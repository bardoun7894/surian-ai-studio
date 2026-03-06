<?php

namespace Tests\Unit;

use App\Models\Suggestion;
use App\Models\User;
use App\Services\AIService;
use App\Services\SuggestionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SuggestionServiceTest extends TestCase
{
    use RefreshDatabase;

    protected SuggestionService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $aiService = $this->createMock(AIService::class);
        $aiService->method('classifySuggestion')->willReturn([]);
        $this->service = new SuggestionService($aiService);
    }

    public function test_it_can_store_a_suggestion_without_files()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $data = [
            'name' => 'John Doe',
            'description' => 'This is a test suggestion.',
            'job_title' => 'Developer',
            'email' => 'john@example.com',
        ];

        $suggestion = $this->service->store($data);

        $this->assertInstanceOf(Suggestion::class, $suggestion);
        $this->assertDatabaseHas('suggestions', [
            'name' => 'John Doe',
            'description' => 'This is a test suggestion.',
            'status' => Suggestion::STATUS_PENDING,
        ]);
    }

    public function test_it_can_store_a_suggestion_with_files()
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $this->actingAs($user);

        $file = UploadedFile::fake()->create('document.pdf', 100);
        
        $data = [
            'name' => 'Jane Doe',
            'description' => 'Suggestion with file.',
        ];

        $suggestion = $this->service->store($data, [$file]);

        $this->assertCount(1, $suggestion->attachments);
        Storage::disk('public')->assertExists($suggestion->attachments->first()->file_path);
    }
}
