<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketSeat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TicketInspectorController extends Controller
{
    /**
     * Inquire ticket validity via Tracking Code or Barcode / QR token.
     * POST /api/v1/inspector/inquiry
     */
    public function inquiry(Request $request): JsonResponse
    {
        $request->validate([
            'query' => 'required|string|max:100',
        ]);

        $queryStr = trim($request->input('query'));

        // Normalize tracking code (allow user or scanner entering '782140' or 'TT-782140')
        $normalizedCode = str_starts_with(strtoupper($queryStr), 'TT-') 
            ? strtoupper($queryStr) 
            : 'TT-' . $queryStr;

        $ticket = Ticket::with(['play', 'session', 'seats'])
            ->where('tracking_code', $normalizedCode)
            ->orWhere('tracking_code', $queryStr)
            ->orWhere('qr_token', $queryStr)
            ->orWhere('buyer_phone', $queryStr)
            ->first();

        if (!$ticket) {
            return response()->json([
                'status' => 'not_found',
                'message' => "بلیط با کد «{$queryStr}» در سیستم یافت نشد. لطفاً کد را بررسی کنید.",
            ], 404);
        }

        $formatted = [
            'id' => $ticket->tracking_code,
            'play_title' => $ticket->play->title,
            'venue_name' => $ticket->play->venue_name,
            'hall_name' => $ticket->session->hall_name,
            'session_datetime' => $ticket->session->session_datetime->format('Y/m/d H:i'),
            'buyer_name' => $ticket->buyer_name,
            'buyer_phone' => $ticket->buyer_phone,
            'status' => $ticket->status,
            'validated_at' => $ticket->validated_at ? $ticket->validated_at->format('Y/m/d H:i') : null,
            'seats' => $ticket->seats->pluck('seat_label')->toArray(),
            'total_amount' => $ticket->total_amount,
        ];

        if ($ticket->status === Ticket::STATUS_VALID) {
            return response()->json([
                'status' => 'valid',
                'message' => 'بلیط کاملاً معتبر است و اجازه ورود به سالن دارد.',
                'ticket' => $formatted,
            ]);
        }

        if ($ticket->status === Ticket::STATUS_USED) {
            return response()->json([
                'status' => 'already_used',
                'message' => "هشدار گیت: این بلیط قبلاً در تاریخ {$formatted['validated_at']} پذیرش و باطل شده است!",
                'ticket' => $formatted,
            ], 409);
        }

        return response()->json([
            'status' => 'cancelled',
            'message' => 'این بلیط باطل یا لغو شده است و اجازه ورود ندارد.',
            'ticket' => $formatted,
        ], 403);
    }

    /**
     * Admit ticket holder and mark ticket as USED (One-time gate entrance).
     * POST /api/v1/inspector/admit
     */
    public function admit(Request $request): JsonResponse
    {
        $request->validate([
            'tracking_code' => 'required|string',
            'inspector_name' => 'nullable|string|max:100',
        ]);

        $code = trim($request->input('tracking_code'));
        if (!str_starts_with(strtoupper($code), 'TT-')) {
            $code = 'TT-' . $code;
        }

        return DB::transaction(function () use ($code, $request) {
            $ticket = Ticket::where('tracking_code', $code)
                ->lockForUpdate()
                ->firstOrFail();

            if ($ticket->status === Ticket::STATUS_USED) {
                return response()->json([
                    'status' => 'error',
                    'message' => "خطا: این بلیط پیش‌تر در تاریخ {$ticket->validated_at} ابطال شده است.",
                ], 409);
            }

            if ($ticket->status !== Ticket::STATUS_VALID) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'وضعیت بلیط معتبر نیست و امکان پذیرش وجود ندارد.',
                ], 422);
            }

            // Mark as used
            $ticket->update([
                'status' => Ticket::STATUS_USED,
                'validated_at' => now(),
                'inspector_id' => $request->user()?->id,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'ورود تماشاگر تایید و بلیط با موفقیت ابطال شد.',
                'validated_at' => $ticket->validated_at->format('Y/m/d H:i'),
            ]);
        });
    }

    /**
     * Real-time metrics for theater managers and gate operators.
     * GET /api/v1/inspector/stats
     */
    public function stats(): JsonResponse
    {
        $totalSoldTickets = Ticket::whereIn('status', ['valid', 'used'])->count();
        $totalSeatsSold = TicketSeat::query()
            ->join('tickets', 'ticket_seats.ticket_id', '=', 'tickets.id')
            ->whereIn('tickets.status', ['valid', 'used'])
            ->count();

        $totalAdmitted = Ticket::where('status', 'used')->count();
        $pendingAdmission = Ticket::where('status', 'valid')->count();
        $totalRevenue = Ticket::whereIn('status', ['valid', 'used'])->sum('total_amount');

        return response()->json([
            'status' => 'success',
            'stats' => [
                'total_tickets_issued' => $totalSoldTickets,
                'total_seats_sold' => $totalSeatsSold,
                'total_admitted' => $totalAdmitted,
                'pending_admission' => $pendingAdmission,
                'total_revenue' => (int) $totalRevenue,
            ],
        ]);
    }

    /**
     * All tickets ledger with pagination.
     * GET /api/v1/inspector/ledger
     */
    public function ledger(Request $request): JsonResponse
    {
        $status = $request->input('status');

        $query = Ticket::with(['play', 'session', 'seats'])->orderBy('id', 'desc');

        if ($status && in_array($status, ['valid', 'used', 'cancelled'])) {
            $query->where('status', $status);
        }

        $tickets = $query->paginate(20);

        return response()->json([
            'status' => 'success',
            'data' => $tickets,
        ]);
    }
}
