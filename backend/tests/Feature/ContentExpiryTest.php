<?php

namespace Tests\Feature;

use App\Models\Content;
use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Tests\TestCase;

class ContentExpiryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedRoles();
    }

    private function seedRoles(): void
    {
        if (Schema::hasTable('roles')) {
            Role::firstOrCreate(['name' => 'admin'], ['permissions' => json_encode(['*'])]);
            Role::firstOrCreate(['name' => 'staff'], ['permissions' => json_encode(['content.*'])]);
        }
    }

    private function createAdminUser(): User
    {
        $adminRole = Role::where('name', 'admin')->first();
        
        return User::create([
            'first_name' => 'Admin',
            'father_name' => 'Test',
            'last_name' => 'User',
            'email' => 'admin' . uniqid() . '@test.com',
            'password' => Hash::make('password'),
            'role_id' => $adminRole?->id,
            'is_active' => true,
        ]);
    }

    private function createContent(array $overrides = []): Content
    {
        $defaults = [
            'title_ar' => 'Test Title',
            'content_ar' => 'Test Content',
            'slug' => Str::slug('test-title-' . uniqid()),
            'category' => 'announcement',
            'status' => 'published',
            'published_at' => now()->subDay(),
            'expires_at' => null,
        ];
        
        return Content::create(array_merge($defaults, $overrides));
    }

    /**
     * Test 1: Migration runs successfully
     */
    public function test_migration_adds_expires_at_column(): void
    {
        $this->assertTrue(Schema::hasColumn('contents', 'expires_at'));
        
        $indexes = DB::select("SELECT indexname FROM pg_indexes WHERE tablename = 'contents'");
        $indexNames = array_map(fn($i) => $i->indexname, $indexes);
        $hasIndex = collect($indexNames)->contains(fn($name) => str_contains($name, 'expires_at'));
        $this->assertTrue($hasIndex, 'expires_at index should exist');
    }

    /**
     * Test 2: Content model - scopeActive() returns only non-expired content
     */
    public function test_scope_active_returns_only_non_expired_content(): void
    {
        $activeNull = $this->createContent([
            'title_ar' => 'Active Null',
            'expires_at' => null,
        ]);

        $activeFuture = $this->createContent([
            'title_ar' => 'Active Future',
            'expires_at' => now()->addDay(),
        ]);

        $expired = $this->createContent([
            'title_ar' => 'Expired',
            'published_at' => now()->subDays(5),
            'expires_at' => now()->subDay(),
        ]);

        $active = Content::active()->get();

        $this->assertTrue($active->contains('id', $activeNull->id), 'Should include content with null expires_at');
        $this->assertTrue($active->contains('id', $activeFuture->id), 'Should include content with future expires_at');
        $this->assertFalse($active->contains('id', $expired->id), 'Should not include expired content');
    }

    /**
     * Test 3: Content model - scopeExpired() returns only expired content
     */
    public function test_scope_expired_returns_only_expired_content(): void
    {
        $active = $this->createContent([
            'title_ar' => 'Active',
            'expires_at' => now()->addDay(),
        ]);

        $expired = $this->createContent([
            'title_ar' => 'Expired',
            'published_at' => now()->subDays(5),
            'expires_at' => now()->subDay(),
        ]);

        $expiredResults = Content::expired()->get();

        $this->assertFalse($expiredResults->contains('id', $active->id), 'Should not include active content');
        $this->assertTrue($expiredResults->contains('id', $expired->id), 'Should include expired content');
    }

    /**
     * Test 4: Content model - isExpired() returns correct boolean
     */
    public function test_is_expired_returns_correct_boolean(): void
    {
        $active = $this->createContent([
            'title_ar' => 'Active',
            'expires_at' => now()->addDay(),
        ]);

        $expired = $this->createContent([
            'title_ar' => 'Expired',
            'published_at' => now()->subDays(5),
            'expires_at' => now()->subHour(),
        ]);

        $neverExpires = $this->createContent([
            'title_ar' => 'Never Expires',
            'expires_at' => null,
        ]);

        $this->assertFalse($active->isExpired(), 'Future expiry should not be expired');
        $this->assertTrue($expired->isExpired(), 'Past expiry should be expired');
        $this->assertFalse($neverExpires->isExpired(), 'Null expiry should not be expired');
    }

    /**
     * Test 5: Validation - expires_at is required in StoreContentRequest
     */
    public function test_validation_expires_at_is_required(): void
    {
        $request = new \App\Http\Requests\StoreContentRequest();
        
        $validator = Validator::make([
            'type' => 'announcement',
            'title_ar' => 'Test Title',
            'body_ar' => 'Test body content',
            'published_at' => now()->format('Y-m-d H:i:s'),
            // expires_at missing
        ], $request->rules(), $request->messages());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('expires_at', $validator->errors()->toArray());
    }

    /**
     * Test 6: Validation - expires_at must be after published_at
     */
    public function test_validation_expires_at_must_be_after_published_at(): void
    {
        $request = new \App\Http\Requests\StoreContentRequest();
        $now = now();
        
        $validator = Validator::make([
            'type' => 'announcement',
            'title_ar' => 'Test Title',
            'body_ar' => 'Test body content',
            'published_at' => $now->format('Y-m-d H:i:s'),
            'expires_at' => $now->copy()->subDay()->format('Y-m-d H:i:s'),
        ], $request->rules(), $request->messages());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('expires_at', $validator->errors()->toArray());
        
        $errors = $validator->errors()->toArray();
        $this->assertEquals('تاريخ الانتهاء يجب أن يكون بعد تاريخ النشر', $errors['expires_at'][0]);
    }

    /**
     * Test 7: Validation - expires_at accepts valid dates
     */
    public function test_validation_accepts_valid_expires_at(): void
    {
        $request = new \App\Http\Requests\StoreContentRequest();
        $now = now();
        
        $validator = Validator::make([
            'type' => 'announcement',
            'title_ar' => 'Test Title',
            'body_ar' => 'Test body content',
            'published_at' => $now->format('Y-m-d H:i:s'),
            'expires_at' => $now->copy()->addDay()->format('Y-m-d H:i:s'),
        ], $request->rules(), $request->messages());

        $this->assertFalse($validator->fails());
        $this->assertArrayNotHasKey('expires_at', $validator->errors()->toArray());
    }

    /**
     * Test 8: API - announcements() returns expires_at in response
     */
    public function test_api_announcements_returns_expires_at(): void
    {
        $this->createContent([
            'title_ar' => 'Test Announcement',
            'category' => 'announcement',
            'expires_at' => now()->addWeek(),
        ]);

        $response = $this->getJson('/api/v1/public/announcements');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'title',
                    'expires_at',
                    'is_expired',
                ]
            ]);
    }

    /**
     * Test 9: API - Filter by active works
     */
    public function test_api_filter_by_active_returns_active_only(): void
    {
        $active = $this->createContent([
            'title_ar' => 'Active Announcement',
            'category' => 'announcement',
            'expires_at' => now()->addWeek(),
        ]);

        $expired = $this->createContent([
            'title_ar' => 'Expired Announcement',
            'category' => 'announcement',
            'published_at' => now()->subDays(5),
            'expires_at' => now()->subDay(),
        ]);

        $response = $this->getJson('/api/v1/public/announcements?filter=active');

        $response->assertStatus(200);
        
        $data = $response->json();
        $this->assertCount(1, $data);
        $this->assertEquals($active->title_ar, $data[0]['title']);
        $this->assertFalse($data[0]['is_expired']);
    }

    /**
     * Test 10: API - Filter by expired works
     */
    public function test_api_filter_by_expired_returns_expired_only(): void
    {
        $active = $this->createContent([
            'title_ar' => 'Active Announcement',
            'category' => 'announcement',
            'expires_at' => now()->addWeek(),
        ]);

        $expired = $this->createContent([
            'title_ar' => 'Expired Announcement',
            'category' => 'announcement',
            'published_at' => now()->subDays(5),
            'expires_at' => now()->subDay(),
        ]);

        $response = $this->getJson('/api/v1/public/announcements?filter=expired');

        $response->assertStatus(200);
        
        $data = $response->json();
        $this->assertCount(1, $data);
        $this->assertEquals($expired->title_ar, $data[0]['title']);
        $this->assertTrue($data[0]['is_expired']);
    }

    /**
     * Test 11: API - is_expired flag is correct in response
     */
    public function test_api_returns_correct_is_expired_flag(): void
    {
        $this->createContent([
            'title_ar' => 'Active',
            'category' => 'announcement',
            'expires_at' => now()->addWeek(),
        ]);

        $this->createContent([
            'title_ar' => 'Expired',
            'category' => 'announcement',
            'published_at' => now()->subDays(5),
            'expires_at' => now()->subDay(),
        ]);

        $response = $this->getJson('/api/v1/public/announcements?limit=20');

        $response->assertStatus(200);
        
        $data = $response->json();
        
        $activeEntry = collect($data)->first(fn($item) => $item['title'] === 'Active');
        $expiredEntry = collect($data)->first(fn($item) => $item['title'] === 'Expired');
        
        $this->assertNotNull($activeEntry, 'Active entry should exist');
        $this->assertNotNull($expiredEntry, 'Expired entry should exist');
        $this->assertFalse($activeEntry['is_expired'], 'Active entry should have is_expired = false');
        $this->assertTrue($expiredEntry['is_expired'], 'Expired entry should have is_expired = true');
    }
}
