<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketSeat extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'seat_code',    // e.g. "R1-S4"
        'row_number',   // 1
        'seat_number',  // 4
        'seat_type',    // regular / vip
        'seat_label',   // "ردیف ۱ - صندلی ۴ (VIP)"
        'price',
    ];

    protected $casts = [
        'row_number' => 'integer',
        'seat_number' => 'integer',
        'price' => 'integer',
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }
}
