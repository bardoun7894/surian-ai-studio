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
        if (!Schema::hasColumn('directorates', 'description_en')) {
            Schema::table('directorates', function (Blueprint $table) {
                $table->text('description_en')->nullable()->after('description');
            });
        }

        // Seed English descriptions for existing directorates
        $updates = [
            'd1' => 'Industrial affairs, factories, industrial zones, standards and specifications.',
            'd2' => 'Economic affairs, foreign trade, economic policies, and SME development.',
            'd3' => 'Internal trade, consumer protection, market regulation, and company registration.',
            'd4' => 'Oversight of legal and legislative affairs for the Ministry.',
            'd5' => 'Management of budgets and financial affairs for the Ministry.',
            'd6' => 'Employee affairs, training and professional development.',
            'd7' => 'Development and maintenance of technical and digital infrastructure.',
            'd8' => 'Administrative affairs and logistical services management.',
            'd9' => 'Strategic planning and coordination with international organizations.',
            'd10' => 'Conducting economic and industrial studies and research.',
            'd11' => 'Public relations, media and institutional communications.',
            'd12' => 'Monitoring implementation of decisions and inspecting establishments.',
            'd13' => 'The company responsible for automated bakeries in Syria.',
            'd14' => 'The company responsible for mills and flour production.',
            'd15' => 'The general company for internal trade.',
            'd16' => 'The authority responsible for setting standards and specifications.',
            'd17' => 'Support and development of small and medium enterprises.',
            'd18' => 'Regulating competition and preventing monopoly in the market.',
            'd19' => 'Supporting local production and promoting exports.',
            'd20' => 'Oversight of precious metals and jewelry trade.',
            'd21' => 'Developing the industrial sector and providing technical consultations.',
            'd22' => 'Conducting testing and research for industrial products.',
            'd23' => 'Organizing exhibitions and participating in international markets.',
        ];

        foreach ($updates as $id => $desc) {
            \Illuminate\Support\Facades\DB::table('directorates')
                ->where('id', $id)
                ->update(['description_en' => $desc]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('directorates', function (Blueprint $table) {
            $table->dropColumn('description_en');
        });
    }
};
