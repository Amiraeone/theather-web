<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class PlaySession extends Model
{
    use HasFactory;

    protected $fillable = [
        'play_id',
        'hall_name',
        'session_datetime',
        'doors_open_at',
        'is_booking_open',
    ];

    protected $casts = [
        'session_datetime' => 'datetime',
        'doors_open_at' => 'datetime',
        'is_booking_open' => 'boolean',
    ];

    public function play(): BelongsTo
    {
        return $this->belongsTo(Play::class);
    }

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    /**
     * All reserved seat records for this session.
     */
    public function reservedSeats(): HasManyThrough
    {
        return $this->hasManyThrough(TicketSeat::class, Ticket::class);
    }

    /**
     * Returns an array of reserved seat IDs (e.g. ['R1-S3', 'R2-S5']).
     */
    public function getTakenSeatCodes(): array
    {
        return TicketSeat::query()
            ->join('tickets', 'ticket_seats.ticket_id', '=', 'tickets.id')
            ->where('tickets.play_session_id', $this->id)
            ->whereIn('tickets.status', ['valid', 'used'])
            ->pluck('ticket_seats.seat_code')
            ->toArray();
    }
}
