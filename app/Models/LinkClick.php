<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $short_link_id
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property string|null $referer
 * @property \Illuminate\Support\Carbon $clicked_at
 */
#[Fillable(['short_link_id', 'ip_address', 'user_agent', 'referer'])]
class LinkClick extends Model
{
    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'clicked_at' => 'datetime',
        ];
    }

    public function shortLink(): BelongsTo
    {
        return $this->belongsTo(ShortLink::class);
    }
}
