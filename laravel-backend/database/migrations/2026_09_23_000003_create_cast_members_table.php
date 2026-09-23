<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cast_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('play_id')->constrained('plays')->cascadeOnDelete();
            $table->string('name');
            $table->string('role_title');
            $table->string('avatar_url')->nullable();
            $table->unsignedSmallInteger('display_order')->default(0);
            $table->timestamps();

            $table->index(['play_id', 'display_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cast_members');
    }
};
