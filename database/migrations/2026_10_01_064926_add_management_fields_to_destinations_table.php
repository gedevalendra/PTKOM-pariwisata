<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('destinations', function (Blueprint $table) {
            $table->foreignUuid('user_id')->nullable()->after('id')->constrained('users')->cascadeOnDelete();
            $table->time('opening_time')->nullable()->after('location');
            $table->time('closing_time')->nullable()->after('opening_time');
            $table->decimal('discount_price', 15, 2)->nullable()->after('price');
            $table->longText('content')->nullable()->after('description');
            $table->boolean('is_published')->default(true)->after('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('destinations', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'opening_time', 'closing_time', 'discount_price', 'content', 'is_published']);
        });
    }
};
