<?php

namespace App\Http\Controllers;

use App\Models\ShortLink;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ShortLinkController extends Controller
{
    /**
     * Display the dashboard with all short links.
     */
    public function index(): Response
    {
        /** @var User $user */
        $user = Auth::user();

        $links = $user
            ->shortLinks()
            ->latest()
            ->get()
            ->map(fn (ShortLink $link) => [
                'id' => $link->id,
                'original_url' => $link->original_url,
                'slug' => $link->slug,
                'title' => $link->title,
                'click_count' => $link->click_count,
                'is_active' => $link->is_active,
                'expired_at' => $link->expired_at?->toIso8601String(),
                'status' => $link->status,
                'created_at' => $link->created_at?->toIso8601String(),
                'short_url' => url($link->slug),
            ]);

        return Inertia::render('dashboard', [
            'links' => $links,
            'stats' => [
                'total_links' => $links->count(),
                'total_clicks' => $links->sum('click_count'),
                'active_links' => $links->where('status', 'active')->count(),
            ],
        ]);
    }

    /**
     * Store a new short link.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'original_url' => ['required', 'url', 'max:2048'],
            'title' => ['nullable', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:20', 'alpha_dash', 'unique:short_links,slug'],
            'is_active' => ['boolean'],
            'expired_at' => ['nullable', 'date', 'after:now'],
        ]);

        $slug = $validated['slug'] ?? $this->generateUniqueSlug();

        /** @var User $user */
        $user = Auth::user();

        $user->shortLinks()->create([
            'original_url' => $validated['original_url'],
            'slug' => $slug,
            'title' => $validated['title'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'expired_at' => $validated['expired_at'] ?? null,
        ]);

        return back()->with('success', 'Short link created successfully!');
    }

    /**
     * Update an existing short link (toggle active or update fields).
     */
    public function update(Request $request, ShortLink $shortLink): RedirectResponse
    {
        abort_if($shortLink->user_id !== (int) Auth::id(), 403);

        $validated = $request->validate([
            'original_url' => ['sometimes', 'url', 'max:2048'],
            'title' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
            'expired_at' => ['nullable', 'date'],
        ]);

        $shortLink->update($validated);

        return back()->with('success', 'Short link updated successfully!');
    }

    /**
     * Delete a short link.
     */
    public function destroy(ShortLink $shortLink): RedirectResponse
    {
        abort_if($shortLink->user_id !== (int) Auth::id(), 403);

        $shortLink->delete();

        return back()->with('success', 'Short link deleted successfully!');
    }

    /**
     * Generate a unique slug that doesn't exist in the database.
     */
    private function generateUniqueSlug(): string
    {
        do {
            $slug = Str::random(7);
        } while (ShortLink::query()->where('slug', $slug)->exists());

        return $slug;
    }
}
