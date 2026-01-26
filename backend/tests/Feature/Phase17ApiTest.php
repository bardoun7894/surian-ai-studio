<?php

namespace Tests\Feature;

use App\Models\Complaint;
use App\Models\Directorate;
use App\Models\FaqSuggestion;
use App\Models\Role;
use App\Models\Suggestion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Phase17ApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $staff;
    protected Directorate $directorate;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles
        $adminRole = Role::create(['name' => 'admin.super', 'display_name' => 'Super Admin']);
        $staffRole = Role::create(['name' => 'staff', 'display_name' => 'Staff']);

        // Create directorate
        $this->directorate = Directorate::create([
            'id' => 'd1',
            'name_ar' => 'إدارة التجارة',
            'name_en' => 'Trade Directorate',
            'is_active' => true,
        ]);

        // Create users
        $this->admin = User::factory()->create([
            'role_id' => $adminRole->id,
            'directorate_id' => $this->directorate->id,
        ]);

        $this->staff = User::factory()->create([
            'role_id' => $staffRole->id,
            'directorate_id' => $this->directorate->id,
        ]);
    }

    // ==========================================
    // FR-25: Complaint Rating Tests
    // ==========================================

    public function test_can_rate_resolved_complaint()
    {
        $complaint = Complaint::create([
            'tracking_number' => 'CMP-TEST-001',
            'full_name' => 'Test User',
            'title' => 'Test Complaint',
            'description' => 'Test description',
            'status' => 'resolved',
            'directorate_id' => $this->directorate->id,
        ]);

        $response = $this->postJson("/api/v1/complaints/{$complaint->tracking_number}/rate", [
            'rating' => 5,
            'comment' => 'Excellent service!',
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('complaints', [
            'id' => $complaint->id,
            'rating' => 5,
            'rating_comment' => 'Excellent service!',
        ]);
    }

    public function test_cannot_rate_pending_complaint()
    {
        $complaint = Complaint::create([
            'tracking_number' => 'CMP-TEST-002',
            'full_name' => 'Test User',
            'title' => 'Test Complaint',
            'description' => 'Test description',
            'status' => 'new',
            'directorate_id' => $this->directorate->id,
        ]);

        $response = $this->postJson("/api/v1/complaints/{$complaint->tracking_number}/rate", [
            'rating' => 5,
        ]);

        $response->assertStatus(400);
    }

    public function test_cannot_rate_complaint_twice()
    {
        $complaint = Complaint::create([
            'tracking_number' => 'CMP-TEST-003',
            'full_name' => 'Test User',
            'title' => 'Test Complaint',
            'description' => 'Test description',
            'status' => 'resolved',
            'directorate_id' => $this->directorate->id,
            'rating' => 4,
            'rated_at' => now(),
        ]);

        $response = $this->postJson("/api/v1/complaints/{$complaint->tracking_number}/rate", [
            'rating' => 5,
        ]);

        $response->assertStatus(400);
    }

    public function test_rating_validation()
    {
        $complaint = Complaint::create([
            'tracking_number' => 'CMP-TEST-004',
            'full_name' => 'Test User',
            'title' => 'Test Complaint',
            'description' => 'Test description',
            'status' => 'resolved',
            'directorate_id' => $this->directorate->id,
        ]);

        // Test invalid rating (out of range)
        $response = $this->postJson("/api/v1/complaints/{$complaint->tracking_number}/rate", [
            'rating' => 10,
        ]);

        $response->assertStatus(422);
    }

    // ==========================================
    // FR-35: Complaint Snooze Tests
    // ==========================================

    public function test_staff_can_snooze_complaint()
    {
        $complaint = Complaint::create([
            'tracking_number' => 'CMP-TEST-005',
            'full_name' => 'Test User',
            'title' => 'Test Complaint',
            'description' => 'Test description',
            'status' => 'new',
            'directorate_id' => $this->directorate->id,
        ]);

        $response = $this->actingAs($this->staff)
            ->postJson("/api/v1/staff/complaints/{$complaint->id}/snooze", [
                'days' => 2,
            ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $complaint->refresh();
        $this->assertNotNull($complaint->snoozed_until);
        $this->assertEquals($this->staff->id, $complaint->snoozed_by);
    }

    public function test_staff_can_unsnooze_complaint()
    {
        $complaint = Complaint::create([
            'tracking_number' => 'CMP-TEST-006',
            'full_name' => 'Test User',
            'title' => 'Test Complaint',
            'description' => 'Test description',
            'status' => 'new',
            'directorate_id' => $this->directorate->id,
            'snoozed_until' => now()->addDays(2),
            'snoozed_by' => $this->staff->id,
        ]);

        $response = $this->actingAs($this->staff)
            ->deleteJson("/api/v1/staff/complaints/{$complaint->id}/snooze");

        $response->assertStatus(200);

        $complaint->refresh();
        $this->assertNull($complaint->snoozed_until);
    }

    public function test_snooze_validation_max_days()
    {
        $complaint = Complaint::create([
            'tracking_number' => 'CMP-TEST-007',
            'full_name' => 'Test User',
            'title' => 'Test Complaint',
            'description' => 'Test description',
            'status' => 'new',
            'directorate_id' => $this->directorate->id,
        ]);

        $response = $this->actingAs($this->staff)
            ->postJson("/api/v1/staff/complaints/{$complaint->id}/snooze", [
                'days' => 5, // Max is 3
            ]);

        $response->assertStatus(422);
    }

    // ==========================================
    // FR-58: FAQ Suggestion Snooze Tests
    // ==========================================

    public function test_admin_can_snooze_faq_suggestion()
    {
        $suggestion = FaqSuggestion::create([
            'question_ar' => 'سؤال تجريبي',
            'question_en' => 'Test question',
            'answer_ar' => 'إجابة تجريبية',
            'answer_en' => 'Test answer',
            'status' => 'pending',
            'occurrence_count' => 5,
            'confidence_score' => 0.85,
        ]);

        $response = $this->actingAs($this->admin)
            ->postJson("/api/v1/admin/faq-suggestions/{$suggestion->id}/snooze", [
                'period' => '1_week',
            ]);

        $response->assertStatus(200);

        $suggestion->refresh();
        $this->assertTrue($suggestion->isSnoozed());
    }

    public function test_faq_index_excludes_snoozed_by_default()
    {
        // Create regular suggestion
        FaqSuggestion::create([
            'question_ar' => 'سؤال عادي',
            'question_en' => 'Normal question',
            'answer_ar' => 'إجابة',
            'answer_en' => 'Answer',
            'status' => 'pending',
            'occurrence_count' => 3,
            'confidence_score' => 0.8,
        ]);

        // Create snoozed suggestion
        FaqSuggestion::create([
            'question_ar' => 'سؤال مؤجل',
            'question_en' => 'Snoozed question',
            'answer_ar' => 'إجابة',
            'answer_en' => 'Answer',
            'status' => 'pending',
            'occurrence_count' => 3,
            'confidence_score' => 0.8,
            'snoozed_until' => now()->addDays(3),
            'snoozed_by' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/admin/faq-suggestions');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('suggestions'));
    }

    // ==========================================
    // FR-55: Suggestion Tracking Tests
    // ==========================================

    public function test_can_track_suggestion_by_tracking_number()
    {
        $suggestion = Suggestion::create([
            'name' => 'Test User',
            'description' => 'Test suggestion',
            'status' => 'pending',
            'tracking_number' => 'SUG-TEST1234',
        ]);

        $response = $this->getJson("/api/v1/suggestions/track/{$suggestion->tracking_number}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'tracking_number',
                    'status',
                    'submitted_at',
                    'last_updated',
                ]
            ]);
    }

    public function test_tracking_hides_response_for_pending()
    {
        $suggestion = Suggestion::create([
            'name' => 'Test User',
            'description' => 'Test suggestion',
            'status' => 'pending',
            'tracking_number' => 'SUG-TEST5678',
            'response' => 'Internal notes',
        ]);

        $response = $this->getJson("/api/v1/suggestions/track/{$suggestion->tracking_number}");

        $response->assertStatus(200);
        $this->assertNull($response->json('data.response'));
    }

    public function test_tracking_shows_response_when_reviewed()
    {
        $suggestion = Suggestion::create([
            'name' => 'Test User',
            'description' => 'Test suggestion',
            'status' => 'approved',
            'tracking_number' => 'SUG-TEST9999',
            'response' => 'Thank you for your suggestion!',
            'reviewed_by' => $this->admin->id,
            'reviewed_at' => now(),
        ]);

        $response = $this->getJson("/api/v1/suggestions/track/{$suggestion->tracking_number}");

        $response->assertStatus(200);
        $this->assertEquals('Thank you for your suggestion!', $response->json('data.response'));
    }

    public function test_tracking_returns_404_for_invalid_number()
    {
        $response = $this->getJson('/api/v1/suggestions/track/INVALID-NUMBER');

        $response->assertStatus(404);
    }

    // ==========================================
    // T-SRS2-04: Satisfaction Analytics Tests
    // ==========================================

    public function test_staff_can_view_satisfaction_analytics()
    {
        // Create rated complaints
        Complaint::create([
            'tracking_number' => 'CMP-ANAL-001',
            'full_name' => 'User 1',
            'title' => 'Complaint 1',
            'description' => 'Description',
            'status' => 'resolved',
            'directorate_id' => $this->directorate->id,
            'rating' => 5,
            'rated_at' => now(),
        ]);

        Complaint::create([
            'tracking_number' => 'CMP-ANAL-002',
            'full_name' => 'User 2',
            'title' => 'Complaint 2',
            'description' => 'Description',
            'status' => 'resolved',
            'directorate_id' => $this->directorate->id,
            'rating' => 3,
            'rated_at' => now(),
        ]);

        $response = $this->actingAs($this->staff)
            ->getJson('/api/v1/staff/analytics/satisfaction');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'average_rating',
                    'total_ratings',
                    'rating_distribution',
                ]
            ]);

        $this->assertEquals(4, $response->json('data.average_rating'));
        $this->assertEquals(2, $response->json('data.total_ratings'));
    }

    // ==========================================
    // T-SRS2-10: Suggestion Print View Tests
    // ==========================================

    public function test_can_get_suggestion_print_view()
    {
        $suggestion = Suggestion::create([
            'name' => 'Test User',
            'job_title' => 'Engineer',
            'email' => 'test@example.com',
            'phone' => '0912345678',
            'description' => 'Test suggestion for print',
            'status' => 'pending',
            'tracking_number' => 'SUG-PRINT001',
        ]);

        $response = $this->getJson("/api/v1/suggestions/{$suggestion->tracking_number}/print");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'tracking_number',
                    'name',
                    'job_title',
                    'email',
                    'phone',
                    'description',
                    'status',
                    'status_label',
                    'submitted_at',
                ]
            ]);
    }
}
