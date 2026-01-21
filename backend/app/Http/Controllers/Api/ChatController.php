<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatConversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ChatController extends Controller
{
    /**
     * Send a message to the AI chatbot and store the conversation
     * 
     * POST /api/v1/chat/message
     */
    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:2000',
            'session_id' => 'nullable|string',
            'language' => 'nullable|string|in:ar,en',
        ]);

        $sessionId = $validated['session_id'] ?? Str::uuid()->toString();
        $language = $validated['language'] ?? 'ar';

        // Find or create conversation
        $conversation = ChatConversation::findBySession($sessionId);
        
        if (!$conversation) {
            $conversation = ChatConversation::create([
                'session_id' => $sessionId,
                'user_id' => auth()->id(),
                'messages' => [],
                'metadata' => [
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'language' => $language,
                ],
            ]);
        }

        // Add user message
        $conversation->addMessage('user', $validated['message']);

        // Forward to AI service
        try {
            $aiServiceUrl = env('AI_SERVICE_URL', 'http://ai-service:8000');
            
            $response = Http::timeout(30)->post("{$aiServiceUrl}/api/v1/ai/chat", [
                'prompt' => $validated['message'],  // AI service expects 'prompt' field
            ]);

            if ($response->successful()) {
                $aiResponse = $response->json()['response'] ?? 'عذراً، لم أتمكن من فهم سؤالك.';
                
                // Add AI response
                $conversation->addMessage('assistant', $aiResponse);

                return response()->json([
                    'session_id' => $sessionId,
                    'response' => $aiResponse,
                    'timestamp' => now()->toIso8601String(),
                ]);
            }

            throw new \Exception('AI service error: ' . $response->body());
        } catch (\Exception $e) {
            \Log::error('Chat AI service error', ['error' => $e->getMessage()]);
            
            return response()->json([
                'session_id' => $sessionId,
                'response' => 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
                'error' => true,
            ], 500);
        }
    }

    /**
     * Get conversation history
     * 
     * GET /api/v1/chat/history/{sessionId}
     */
    public function getHistory(string $sessionId)
    {
        $conversation = ChatConversation::findBySession($sessionId);

        if (!$conversation) {
            return response()->json([
                'messages' => [],
                'session_id' => $sessionId,
            ]);
        }

        // Verify ownership for authenticated users
        if (auth()->check() && $conversation->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json([
            'session_id' => $sessionId,
            'messages' => $conversation->messages,
            'created_at' => $conversation->created_at,
        ]);
    }

    /**
     * Clear conversation session
     * 
     * DELETE /api/v1/chat/session/{sessionId}
     */
    public function clearSession(string $sessionId)
    {
        $conversation = ChatConversation::findBySession($sessionId);

        if (!$conversation) {
            return response()->json(['message' => 'Session not found'], 404);
        }

        // Verify ownership for authenticated users
        if (auth()->check() && $conversation->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $conversation->delete();

        return response()->json(['message' => 'Session cleared successfully']);
    }

    /**
     * FR-35: Request human handoff
     *
     * POST /api/v1/chat/handoff
     */
    public function requestHandoff(Request $request)
    {
        $validated = $request->validate([
            'session_id' => 'required|string',
            'reason' => 'nullable|string|max:500',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string|max:20',
        ]);

        $conversation = ChatConversation::findBySession($validated['session_id']);

        if (!$conversation) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        // Mark conversation as requiring handoff
        $conversation->update([
            'handoff_requested' => true,
            'handoff_requested_at' => now(),
            'handoff_reason' => $validated['reason'] ?? null,
            'handoff_status' => 'pending',
            'metadata' => array_merge($conversation->metadata ?? [], [
                'contact_email' => $validated['contact_email'] ?? null,
                'contact_phone' => $validated['contact_phone'] ?? null,
            ]),
        ]);

        // Add system message to conversation
        $conversation->addMessage('system', 'تم طلب التحويل لموظف مختص. سيتم التواصل معك قريباً.');

        // Notify staff about handoff request
        $this->notifyStaffAboutHandoff($conversation);

        return response()->json([
            'message' => 'تم طلب التحويل بنجاح',
            'handoff_id' => $conversation->id,
            'status' => 'pending',
        ]);
    }

    /**
     * FR-35: Get pending handoff requests (for staff)
     *
     * GET /api/v1/chat/handoffs
     */
    public function listHandoffs(Request $request)
    {
        $status = $request->get('status', 'pending');

        $handoffs = ChatConversation::where('handoff_requested', true)
            ->when($status !== 'all', fn($q) => $q->where('handoff_status', $status))
            ->with('user:id,name,email')
            ->orderBy('handoff_requested_at', 'desc')
            ->paginate(20);

        return response()->json($handoffs);
    }

    /**
     * FR-35: Handle handoff (staff assigns themselves)
     *
     * PUT /api/v1/chat/handoffs/{id}/assign
     */
    public function assignHandoff(Request $request, int $id)
    {
        $conversation = ChatConversation::findOrFail($id);

        if (!$conversation->handoff_requested) {
            return response()->json(['error' => 'No handoff requested'], 400);
        }

        $conversation->update([
            'handoff_status' => 'assigned',
            'handoff_assigned_to' => auth()->id(),
            'handoff_assigned_at' => now(),
        ]);

        // Add system message
        $staffName = auth()->user()->name ?? 'موظف';
        $conversation->addMessage('system', "تم تعيين {$staffName} للرد على استفسارك.");

        return response()->json([
            'message' => 'تم تعيين المحادثة بنجاح',
            'assigned_to' => auth()->user()->name,
        ]);
    }

    /**
     * FR-35: Staff responds to handoff
     *
     * POST /api/v1/chat/handoffs/{id}/respond
     */
    public function respondToHandoff(Request $request, int $id)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $conversation = ChatConversation::findOrFail($id);

        if ($conversation->handoff_assigned_to !== auth()->id()) {
            return response()->json(['error' => 'Not assigned to you'], 403);
        }

        // Add staff response
        $conversation->addMessage('staff', $validated['message'], [
            'staff_id' => auth()->id(),
            'staff_name' => auth()->user()->name,
        ]);

        return response()->json([
            'message' => 'تم إرسال الرد بنجاح',
        ]);
    }

    /**
     * FR-35: Close handoff
     *
     * PUT /api/v1/chat/handoffs/{id}/close
     */
    public function closeHandoff(Request $request, int $id)
    {
        $conversation = ChatConversation::findOrFail($id);

        $conversation->update([
            'handoff_status' => 'closed',
            'handoff_closed_at' => now(),
        ]);

        $conversation->addMessage('system', 'تم إغلاق المحادثة. شكراً لتواصلك معنا.');

        return response()->json([
            'message' => 'تم إغلاق المحادثة',
        ]);
    }

    /**
     * Build context from conversation history for AI
     */
    private function buildContext(ChatConversation $conversation): array
    {
        $messages = $conversation->messages ?? [];

        // Return last 10 messages for context
        return array_slice($messages, -10);
    }

    /**
     * Notify staff about new handoff request
     */
    private function notifyStaffAboutHandoff(ChatConversation $conversation): void
    {
        try {
            $notificationService = app(\App\Services\NotificationService::class);

            // Notify all staff/admins
            $staffUsers = \App\Models\User::whereHas('role', function ($query) {
                $query->whereIn('name', ['staff', 'admin.general', 'admin.super']);
            })->get();

            foreach ($staffUsers as $staff) {
                $notificationService->notify(
                    $staff,
                    'handoff_request',
                    'طلب تحويل محادثة جديد',
                    'يوجد مستخدم يطلب التحدث مع موظف مختص',
                    [
                        'conversation_id' => $conversation->id,
                        'session_id' => $conversation->session_id,
                        'reason' => $conversation->handoff_reason,
                    ]
                );
            }
        } catch (\Exception $e) {
            \Log::error('Failed to notify staff about handoff', ['error' => $e->getMessage()]);
        }
    }
}
