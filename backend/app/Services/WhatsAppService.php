<?php

namespace App\Services;

use App\Models\ChatSession;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected string $apiUrl;
    protected string $phoneNumberId;
    protected string $accessToken;
    protected string $verifyToken;
    protected bool $enabled;

    public function __construct()
    {
        $this->apiUrl = config('whatsapp.api_url', 'https://graph.facebook.com/v18.0');
        $this->phoneNumberId = config('whatsapp.phone_number_id', '');
        $this->accessToken = config('whatsapp.access_token', '');
        $this->verifyToken = config('whatsapp.verify_token', '');
        $this->enabled = config('whatsapp.enabled', false);
    }

    /**
     * Send a text message via WhatsApp
     */
    public function sendMessage(string $to, string $message): bool
    {
        if (!$this->enabled) {
            Log::info("WhatsApp disabled. Would send to {$to}: {$message}");
            return true;
        }

        if (empty($this->phoneNumberId) || empty($this->accessToken)) {
            Log::error('WhatsApp credentials not configured');
            return false;
        }

        try {
            $response = Http::withToken($this->accessToken)
                ->post("{$this->apiUrl}/{$this->phoneNumberId}/messages", [
                    'messaging_product' => 'whatsapp',
                    'recipient_type' => 'individual',
                    'to' => $this->normalizePhoneNumber($to),
                    'type' => 'text',
                    'text' => [
                        'preview_url' => false,
                        'body' => $message,
                    ],
                ]);

            if ($response->successful()) {
                Log::info("WhatsApp message sent to {$to}");
                return true;
            }

            Log::error("WhatsApp API error: {$response->body()}", [
                'status' => $response->status(),
                'to' => $to,
            ]);
            return false;
        } catch (\Exception $e) {
            Log::error("WhatsApp send failed: {$e->getMessage()}", [
                'to' => $to,
            ]);
            return false;
        }
    }

    /**
     * Send a template message
     */
    public function sendTemplate(string $to, string $templateName, array $parameters = []): bool
    {
        if (!$this->enabled) {
            Log::info("WhatsApp disabled. Would send template {$templateName} to {$to}");
            return true;
        }

        try {
            $components = [];

            if (!empty($parameters)) {
                $components[] = [
                    'type' => 'body',
                    'parameters' => array_map(fn($param) => [
                        'type' => 'text',
                        'text' => $param,
                    ], $parameters),
                ];
            }

            $response = Http::withToken($this->accessToken)
                ->post("{$this->apiUrl}/{$this->phoneNumberId}/messages", [
                    'messaging_product' => 'whatsapp',
                    'to' => $this->normalizePhoneNumber($to),
                    'type' => 'template',
                    'template' => [
                        'name' => $templateName,
                        'language' => [
                            'code' => 'ar',
                        ],
                        'components' => $components,
                    ],
                ]);

            if ($response->successful()) {
                Log::info("WhatsApp template {$templateName} sent to {$to}");
                return true;
            }

            Log::error("WhatsApp template send failed: {$response->body()}");
            return false;
        } catch (\Exception $e) {
            Log::error("WhatsApp template send failed: {$e->getMessage()}");
            return false;
        }
    }

    /**
     * Send notification about complaint status change
     */
    public function sendComplaintStatusNotification(string $to, string $trackingNumber, string $oldStatus, string $newStatus): bool
    {
        $statusLabels = [
            'new' => 'جديدة',
            'received' => 'مستلمة',
            'in_progress' => 'قيد المعالجة',
            'resolved' => 'تم الحل',
            'rejected' => 'مرفوضة',
            'closed' => 'مغلقة',
        ];

        $oldLabel = $statusLabels[$oldStatus] ?? $oldStatus;
        $newLabel = $statusLabels[$newStatus] ?? $newStatus;

        $message = "تحديث حالة الشكوى\n\n";
        $message .= "رقم المتابعة: {$trackingNumber}\n";
        $message .= "الحالة السابقة: {$oldLabel}\n";
        $message .= "الحالة الجديدة: {$newLabel}\n\n";
        $message .= "يمكنك متابعة شكواك على موقع وزارة الاقتصاد والصناعة.";

        return $this->sendMessage($to, $message);
    }

    /**
     * Process incoming webhook message
     */
    public function processWebhook(array $webhookData): void
    {
        if (!isset($webhookData['entry'])) {
            Log::warning('Invalid WhatsApp webhook data');
            return;
        }

        foreach ($webhookData['entry'] as $entry) {
            if (!isset($entry['changes'])) {
                continue;
            }

            foreach ($entry['changes'] as $change) {
                if ($change['field'] !== 'messages') {
                    continue;
                }

                if (!isset($change['value']['messages'])) {
                    continue;
                }

                foreach ($change['value']['messages'] as $message) {
                    $this->handleIncomingMessage($message, $change['value']);
                }
            }
        }
    }

    /**
     * Handle incoming WhatsApp message
     */
    protected function handleIncomingMessage(array $message, array $metadata): void
    {
        $from = $message['from'] ?? null;
        $messageId = $message['id'] ?? null;
        $timestamp = $message['timestamp'] ?? now()->timestamp;

        if (!$from || !$messageId) {
            Log::warning('Invalid WhatsApp message format');
            return;
        }

        // Extract message text
        $text = $this->extractMessageText($message);

        if (empty($text)) {
            Log::info("Non-text WhatsApp message from {$from}");
            return;
        }

        Log::info("WhatsApp message received from {$from}: {$text}");

        // Mark message as read
        $this->markMessageAsRead($messageId);

        // Get or create chat session
        $session = $this->getOrCreateSession($from);

        // Save incoming message
        ChatMessage::create([
            'session_id' => $session->id,
            'message' => $text,
            'sender' => 'user',
            'metadata' => [
                'channel' => 'whatsapp',
                'whatsapp_message_id' => $messageId,
                'phone_number' => $from,
            ],
        ]);

        // Process with AI and send response
        $this->processAndRespond($session, $text, $from);
    }

    /**
     * Extract text from message object
     */
    protected function extractMessageText(array $message): ?string
    {
        if (isset($message['text']['body'])) {
            return $message['text']['body'];
        }

        if (isset($message['interactive']['button_reply']['title'])) {
            return $message['interactive']['button_reply']['title'];
        }

        if (isset($message['interactive']['list_reply']['title'])) {
            return $message['interactive']['list_reply']['title'];
        }

        return null;
    }

    /**
     * Mark message as read
     */
    protected function markMessageAsRead(string $messageId): void
    {
        if (!$this->enabled) {
            return;
        }

        try {
            Http::withToken($this->accessToken)
                ->post("{$this->apiUrl}/{$this->phoneNumberId}/messages", [
                    'messaging_product' => 'whatsapp',
                    'status' => 'read',
                    'message_id' => $messageId,
                ]);
        } catch (\Exception $e) {
            Log::error("Failed to mark WhatsApp message as read: {$e->getMessage()}");
        }
    }

    /**
     * Get or create chat session for WhatsApp user
     */
    protected function getOrCreateSession(string $phoneNumber): ChatSession
    {
        // Try to find existing active session
        $session = ChatSession::where('metadata->whatsapp_phone', $phoneNumber)
            ->where('status', 'active')
            ->first();

        if ($session) {
            return $session;
        }

        // Create new session
        return ChatSession::create([
            'session_id' => 'whatsapp_' . $phoneNumber . '_' . time(),
            'user_id' => null, // Anonymous WhatsApp user
            'status' => 'active',
            'metadata' => [
                'channel' => 'whatsapp',
                'whatsapp_phone' => $phoneNumber,
            ],
        ]);
    }

    /**
     * Process message with AI and send response
     */
    protected function processAndRespond(ChatSession $session, string $userMessage, string $phoneNumber): void
    {
        try {
            // Use the existing ChatService to process the message
            $chatService = app(\App\Services\ChatService::class);
            $response = $chatService->processMessage($session->session_id, $userMessage);

            // Send response via WhatsApp
            $this->sendMessage($phoneNumber, $response['response']);

            // Save bot response
            ChatMessage::create([
                'session_id' => $session->id,
                'message' => $response['response'],
                'sender' => 'bot',
                'metadata' => [
                    'channel' => 'whatsapp',
                    'ai_context' => $response['context'] ?? null,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error("WhatsApp AI processing failed: {$e->getMessage()}");

            // Send error message
            $errorMessage = "عذراً، حدث خطأ في معالجة رسالتك. يرجى المحاولة مرة أخرى أو الاتصال بنا عبر الموقع الإلكتروني.";
            $this->sendMessage($phoneNumber, $errorMessage);
        }
    }

    /**
     * Verify webhook token (for initial setup)
     */
    public function verifyWebhook(string $mode, string $token, string $challenge): ?string
    {
        if ($mode === 'subscribe' && $token === $this->verifyToken) {
            Log::info('WhatsApp webhook verified successfully');
            return $challenge;
        }

        Log::warning('WhatsApp webhook verification failed', [
            'mode' => $mode,
            'token_match' => $token === $this->verifyToken,
        ]);

        return null;
    }

    /**
     * Normalize phone number for WhatsApp (must include country code without +)
     */
    protected function normalizePhoneNumber(string $phone): string
    {
        // Remove all non-numeric characters
        $phone = preg_replace('/[^0-9]/', '', $phone);

        // Remove leading + if present
        $phone = ltrim($phone, '+');

        // Add Syrian country code if not present
        if (!str_starts_with($phone, '963')) {
            $phone = ltrim($phone, '0');
            $phone = '963' . $phone;
        }

        return $phone;
    }

    /**
     * Check if WhatsApp is enabled and configured
     */
    public function isConfigured(): bool
    {
        return $this->enabled
            && !empty($this->phoneNumberId)
            && !empty($this->accessToken);
    }
}
