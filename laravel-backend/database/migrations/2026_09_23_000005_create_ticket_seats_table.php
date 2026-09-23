<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ticket_seats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained('tickets')->cascadeOnDelete();
            $table->string('seat_code', 20);     // e.g. "R1-S3"
            $table->unsignedSmallInteger('row_number');
            $table->unsignedSmallInteger('seat_number');
            $table->string('seat_type', 20)->default('regular'); // 'regular', 'vip'
            $table->string('seat_label');         // "ردیف ۱ - صندلی ۳ (VIP)"
            $table->unsignedInteger('price');
            $table->timestamps();

            $table->index(['ticket_id', 'seat_code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ticket_seats');
    }
};
