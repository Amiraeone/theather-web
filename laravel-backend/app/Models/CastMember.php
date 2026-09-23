<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CastMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'play_id',
        'name',
        'role_title',
        'avatar_url',
        'display_order',
    ];

    public function play(): BelongsTo
    {
        return $this->belongsTo(Play::class);
    }
}
