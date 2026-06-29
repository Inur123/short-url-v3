<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $original_url
 * @property string $slug
 * @property string|null $title
 * @property int $click_count
 * @property bool $is_active
 * @property Carbon|null $expired_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @method bool update(array $attributes = [])
 * @method int increment(string $column, int $amount = 1)
 * @method bool|null delete()
 */
#[Fillable(['user_id', 'original_url', 'slug', 'title', 'is_active', 'expired_at'])]
class ShortLink extends Model
{
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'expired_at' => 'datetime',
        ];
    }

    /**
     * Check if the link is accessible (active and not expired).
     */
    public function isAccessible(): bool
    {
        if (! $this->is_active) {
            return false;
        }

        if ($this->expired_at !== null && $this->expired_at->isPast()) {
            return false;
        }

        return true;
    }

    /**
     * Get the computed status label for this link.
     *
     * @return 'active'|'inactive'|'expired'
     */
    public function getStatusAttribute(): string
    {
        if ($this->expired_at !== null && $this->expired_at->isPast()) {
            return 'expired';
        }

        return $this->is_active ? 'active' : 'inactive';
    }

    /**
     * Relationship: belongs to user.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship: has many click records.
     */
    public function clicks(): HasMany
    {
        return $this->hasMany(LinkClick::class);
    }
}
