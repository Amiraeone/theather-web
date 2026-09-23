<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PlayController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\TicketInspectorController;
use App\Http\Controllers\Api\UserProfileController;

/*
|--------------------------------------------------------------------------
| API Routes - TheaterTicket Platform
|--------------------------------------------------------------------------
| High-performance RESTful API endpoints for plays, online seat bookings,
| gate admission & inspector barcode validation.
*/

Route::prefix('v1')->group(function () {

    // Plays & Performance Sessions
    Route::get('/plays', [PlayController::class, 'index'])->name('plays.index');
    Route::get('/plays/{id}', [PlayController::class, 'show'])->name('plays.show');
    Route::get('/sessions/{sessionId}/seats', [PlayController::class, 'sessionSeats'])->name('sessions.seats');

    // Online Seat Reservation & Ticket Issuing (Rate limited to avoid bot spamming)
    Route::middleware('throttle:30,1')->group(function () {
        Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
    });

    // User Profile & Tickets
    Route::get('/user/tickets', [UserProfileController::class, 'myTickets'])->name('user.tickets');

    // Gate Inspector & Venue Staff Panel
    Route::prefix('inspector')->group(function () {
        Route::post('/inquiry', [TicketInspectorController::class, 'inquiry'])->name('inspector.inquiry');
        Route::post('/admit', [TicketInspectorController::class, 'admit'])->name('inspector.admit');
        Route::get('/stats', [TicketInspectorController::class, 'stats'])->name('inspector.stats');
        Route::get('/ledger', [TicketInspectorController::class, 'ledger'])->name('inspector.ledger');
    });

    // Health check endpoint
    Route::get('/health', function () {
        return response()->json([
            'status' => 'healthy',
            'service' => 'TheaterTicket Laravel Backend API',
            'timestamp' => now()->toIso8601String(),
        ]);
    });
});
