<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Ticket extends Model
{
    use HasFactory;

    const STATUS_VALID = 'valid';
    const STATUS_USED = 'used';
    const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'tracking_code',
        'qr_token',
        'user_id',
        'play_id',
        'play_session_id',
        'buyer_name',
        'buyer_phone',
        'total_amount',
        'status',
        'validated_at',
        'inspector_id',
        'payment_ref_id',
    ];

    protected $casts = [
        'total_amount' => 'integer',
        'validated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function play(): BelongsTo
    {
        return $this->belongsTo(Play::class);
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(PlaySession::class, 'play_session_id');
    }

    public function inspector(): BelongsTo
    {
        return $this->belongsTo(User::class, 'inspector_id');
    }

    public function seats(): HasMany
    {
        return $this->hasMany(TicketSeat::class);
    }

    /**
     * Generate unique Tracking Code format TT-XXXXXX
     */
    public static function generateTrackingCode(): string
    {
        do {
            $code = 'TT-' . mt_rand(100000, 999999);
        } while (self::where('tracking_code', $code)->exists());

        return $code;
    }

    /**
     * Check if the ticket is eligible for admission at gate.
     */
    public function isValidForEntry(): bool
    {
        return $this->status === self::STATUS_VALID;
    }
}
