<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('play_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('play_id')->constrained('plays')->cascadeOnDelete();
            $table->string('hall_name');
            $table->dateTime('session_datetime');
            $table->dateTime('doors_open_at')->nullable();
            $table->boolean('is_booking_open')->default(true);
            $table->timestamps();

            $table->index(['play_id', 'session_datetime']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('play_sessions');
    }
};
