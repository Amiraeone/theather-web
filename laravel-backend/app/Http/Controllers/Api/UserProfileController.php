<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserProfileController extends Controller
{
    /**
     * Get tickets belonging to a specific buyer phone number.
     * GET /api/v1/user/tickets
     */
    public function myTickets(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => 'required|string',
        ]);

        $phone = trim($request->input('phone'));

        $tickets = Ticket::with(['play', 'session', 'seats'])
            ->where('buyer_phone', $phone)
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($ticket) {
                return [
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
                    'validated_at' => $ticket->validated_at ? $ticket->validated_at->format('Y/m/d H:i') : null,
                    'seats' => $ticket->seats->pluck('seat_label')->toArray(),
                    'created_at' => $ticket->created_at->toIso8601String(),
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $tickets,
        ]);
    }
}
