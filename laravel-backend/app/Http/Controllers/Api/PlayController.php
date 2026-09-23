<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Play;
use App\Models\PlaySession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlayController extends Controller
{
    /**
     * Get list of active plays with optional search and genre filtering.
     * GET /api/v1/plays
     */
    public function index(Request $request): JsonResponse
    {
        $query = Play::query()
            ->active()
            ->with(['sessions' => function ($q) {
                $q->where('session_datetime', '>=', now())
                  ->where('is_booking_open', true);
            }, 'castMembers']);

        // Search query
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('director', 'like', "%{$search}%")
                  ->orWhere('venue_name', 'like', "%{$search}%")
                  ->orWhereHas('castMembers', function ($cq) use ($search) {
                      $cq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Genre filter
        if ($genre = $request->input('genre')) {
            if ($genre !== 'all') {
                $query->where('genre', 'like', "%{$genre}%");
            }
        }

        $plays = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $plays,
        ]);
    }

    /**
     * Get details of a single play by ID or slug.
     * GET /api/v1/plays/{id}
     */
    public function show($id): JsonResponse
    {
        $play = Play::query()
            ->with(['sessions', 'castMembers'])
            ->where('id', $id)
            ->orWhere('slug', $id)
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $play,
        ]);
    }

    /**
     * Get real-time seat availability map for a specific session.
     * GET /api/v1/sessions/{sessionId}/seats
     */
    public function sessionSeats($sessionId): JsonResponse
    {
        $session = PlaySession::with('play')->findOrFail($sessionId);

        // Fetch taken seat codes atomically
        $takenSeatCodes = $session->getTakenSeatCodes();

        return response()->json([
            'status' => 'success',
            'session' => [
                'id' => $session->id,
                'datetime' => $session->session_datetime->toIso8601String(),
                'hall_name' => $session->hall_name,
                'play_title' => $session->play->title,
                'base_price' => $session->play->base_price,
                'vip_price' => $session->play->vip_price,
            ],
            'taken_seats' => $takenSeatCodes,
        ]);
    }
}
