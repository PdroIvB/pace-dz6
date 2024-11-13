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
        Schema::create('columns', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('sequence');
            $table->foreignId('owner_id')->constrained(
                table: 'users', indexName: 'columns_user_id'
            )->cascadeOnDelete();
            $table->timestamps();

            $table->index(['workspace_id', 'sequence']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('columns');
    }
};
