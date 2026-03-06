<?php

namespace Tests\Feature;

use App\Models\Directorate;
use App\Models\SubDirectorate;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FeaturedDirectorateTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_retrieve_featured_directorates()
    {
        // Create unfeatured directorate
        Directorate::factory()->create([
            'featured' => false
        ]);

        // Create featured directorate with sub-directorates
        $featured = Directorate::factory()->create([
            'featured' => true
        ]);
        
        SubDirectorate::factory()->count(2)->create([
            'parent_directorate_id' => $featured->id,
            'is_active' => true
        ]);

        $response = $this->getJson('/api/v1/public/directorates/featured');

        $response->assertStatus(200)
            ->assertJsonCount(1) // Should return only featured
            ->assertJsonFragment(['featured' => true]);
            
        // Check structure includes subDirectorates
        $data = $response->json();
        $this->assertArrayHasKey('subDirectorates', $data[0]);
        $this->assertCount(2, $data[0]['subDirectorates']);
    }
}
