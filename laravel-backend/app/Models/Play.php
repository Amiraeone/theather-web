<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Play extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'original_title',
        'slug',
        'director',
        'writer',
        'producer',
        'genre',
        'duration_minutes',
        'age_rating',
        'venue_name',
        'hall_name',
        'venue_address',
        'base_price',
        'vip_price',
        'poster_url',
        'stage_image_url',
        'synopsis',
        'is_active',
    ];

    protected $casts = [
        'duration_minutes' => 'integer',
        'base_price' => 'integer',
        'vip_price' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get all performance sessions for this play.
     */
    public function sessions(): HasMany
    {
        return $this->hasMany(PlaySession::class)->orderBy('session_datetime', 'asc');
    }

    /**
     * Get all cast & crew members.
     */
    public function castMembers(): HasMany
    {
        return $this->hasMany(CastMember::class)->orderBy('display_order', 'asc');
    }

    /**
     * Scope for active plays.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
