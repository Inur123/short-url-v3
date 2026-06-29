<?php

namespace App\Http\Controllers;

use App\Models\LinkClick;
use App\Models\ShortLink;
use Illuminate\Http\RedirectResponse;

class RedirectController extends Controller
{
    public function show(string $slug): RedirectResponse
    {
        /** @var ShortLink $link */
        $link = ShortLink::query()->where('slug', $slug)->firstOrFail();

        if (! $link->isAccessible()) {
            abort(404);
        }

        // Increment click count atomically
        $link->increment('click_count');

        // Record click details
        LinkClick::create([
            'short_link_id' => $link->id,
            'ip_address' => request()->ip(),
            'user_agent' => substr(request()->userAgent() ?? '', 0, 512),
            'referer' => substr(request()->header('referer') ?? '', 0, 2048),
        ]);

        return redirect()->away($link->original_url, 301);
    }
}
