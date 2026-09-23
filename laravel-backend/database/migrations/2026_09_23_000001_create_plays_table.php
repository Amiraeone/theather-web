<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plays', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('original_title')->nullable();
            $table->string('slug')->unique();
            $table->string('director');
            $table->string('writer');
            $table->string('producer')->nullable();
            $table->string('genre');
            $table->unsignedSmallInteger('duration_minutes')->default(90);
            $table->string('age_rating')->default('۱۲+');
            $table->string('venue_name');
            $table->string('hall_name');
            $table->text('venue_address')->nullable();
            $table->unsignedInteger('base_price');
            $table->unsignedInteger('vip_price');
            $table->string('poster_url')->nullable();
            $table->string('stage_image_url')->nullable();
            $table->text('synopsis');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'genre']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plays');
    }
};
