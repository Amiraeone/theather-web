<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Play;
use App\Models\PlaySession;
use App\Models\Ticket;
use App\Models\TicketSeat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class BookingController extends Controller
{
    /**
     * Reserve and issue tickets with atomic seat lock.
     * POST /api/v1/bookings
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => 'required|exists:play_sessions,id',
            'buyer_name' => 'required|string|max:100',
            'buyer_phone' => 'required|string|regex:/^09[0-9]{9}$/',
            'seats' => 'required|array|min:1|max:6',
            'seats.*.code' => 'required|string|max:20', // e.g. "R1-S4"
            'seats.*.row' => 'required|integer|min:1',
            'seats.*.number' => 'required|integer|min:1',
            'seats.*.type' => 'required|in:regular,vip',
            'seats.*.label' => 'required|string',
            'seats.*.price' => 'required|integer|min:0',
        ], [
            'buyer_phone.regex' => 'فرمت شماره موبایل باید به صورت 09xxxxxxxxx باشد.',
            'seats.max' => 'حداکثر می‌توانید ۶ صندلی در هر تراکنش رزرو نمایید.',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            // Lock session row to prevent race conditions during high-demand ticketing
            $session = PlaySession::where('id', $validated['session_id'])
                ->lockForUpdate()
                ->firstOrFail();

            $play = $session->play;

            // Extract seat codes requested
            $requestedCodes = collect($validated['seats'])->pluck('code')->toArray();

            // Check if any of these seats are already reserved or paid
            $alreadyTaken = TicketSeat::query()
                ->join('tickets', 'ticket_seats.ticket_id', '=', 'tickets.id')
                ->where('tickets.play_session_id', $session->id)
                ->whereIn('tickets.status', ['valid', 'used'])
                ->whereIn('ticket_seats.seat_code', $requestedCodes)
                ->pluck('ticket_seats.seat_code')
                ->toArray();

            if (!empty($alreadyTaken)) {
                throw ValidationException::withMessages([
                    'seats' => ['متاسفانه صندلی‌های (' . implode(', ', $alreadyTaken) . ') توسط کاربر دیگری هم‌اکنون رزرو شده است. لطفاً صندلی‌های دیگری انتخاب کنید.'],
                ]);
            }

            // Calculate total amount
            $totalAmount = collect($validated['seats'])->sum('price');

            // Generate unique tracking code and QR token
            $trackingCode = Ticket::generateTrackingCode();
            $qrToken = hash('sha256', Str::uuid() . $trackingCode . microtime(true));

            // Create Ticket
            $ticket = Ticket::create([
                'tracking_code' => $trackingCode,
                'qr_token' => $qrToken,
                'user_id' => $request->user()?->id,
                'play_id' => $play->id,
                'play_session_id' => $session->id,
                'buyer_name' => trim($validated['buyer_name']),
                'buyer_phone' => trim($validated['buyer_phone']),
                'total_amount' => $totalAmount,
                'status' => Ticket::STATUS_VALID,
                'payment_ref_id' => 'BANK-' . mt_rand(10000000, 99999999),
            ]);

            // Save individual seats
            foreach ($validated['seats'] as $seatItem) {
                TicketSeat::create([
                    'ticket_id' => $ticket->id,
                    'seat_code' => $seatItem['code'],
                    'row_number' => $seatItem['row'],
                    'seat_number' => $seatItem['number'],
                    'seat_type' => $seatItem['type'],
                    'seat_label' => $seatItem['label'],
                    'price' => $seatItem['price'],
                ]);
            }

            // Load full relationships for immediate response
            $ticket->load(['play', 'session', 'seats']);

            return response()->json([
                'status' => 'success',
                'message' => 'رزرو بلیط با موفقیت ثبت شد و کد پیگیری صادر گردید.',
                'ticket' => [
                    'id' => $ticket->tracking_code,
                    'qr_token' => $ticket->qr_token,
                    'play_title' => $ticket->play->title,
                    'venue_name' => $ticket->play->venue_name,
                    'hall_name' => $ticket->session->hall_name,
                    'session_datetime' => $ticket->session->session_datetime->toIso8601String(),
                    'session_date_fa' => $ticket->session->session_datetime->format('Y/m/d H:i'),
                    'buyer_name' => $ticket->buyer_name,
                    'buyer_phone' => $ticket->buyer_phone,
                    'total_amount' => $ticket->total_amount,
                    'status' => $ticket->status,
                    'seats' => $ticket->seats->pluck('seat_label')->toArray(),
                    'created_at' => $ticket->created_at->toIso8601String(),
                ],
            ], 201);
        });
    }
}
