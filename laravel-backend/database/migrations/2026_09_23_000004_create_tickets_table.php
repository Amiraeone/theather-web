<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_code', 20)->unique(); // e.g. "TT-782140"
            $table->string('qr_token', 64)->unique();      // Cryptographic verification token
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('play_id')->constrained('plays')->cascadeOnDelete();
            $table->foreignId('play_session_id')->constrained('play_sessions')->cascadeOnDelete();
            
            $table->string('buyer_name');
            $table->string('buyer_phone', 20);
            $table->unsignedInteger('total_amount');
            
            // Ticket State: valid, used, cancelled
            $table->enum('status', ['valid', 'used', 'cancelled'])->default('valid');
            $table->dateTime('validated_at')->nullable();
            $table->foreignId('inspector_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('payment_ref_id')->nullable();

            $table->timestamps();

            $table->index(['tracking_code', 'status']);
            $table->index(['buyer_phone']);
            $table->index(['play_session_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
