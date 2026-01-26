<?php

namespace App\Services;

use App\Models\ChatSession;
use App\Models\ChatMessage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    protected string $botToken;
    protected string $botUsername;
    protected string $webhookSecret;
    protected string $apiUrl;
    protected bool $enabled;

    public function __construct()
    {
        $this->botToken = config('telegram.bot_token', '');
        $this->botUsername = config('telegram.bot_username', '');
        $this->webhookSecret = config('telegram.webhook_secret', '');
        $this->apiUrl = config('telegram.api_url', 'https://api.telegram.org');
        $this->enabled = config('telegram.enabled', false);
    }

    /**
     * Send a text message via Telegram
     */
    public function sendMessage(int $chatId, string $message, array $options = []): bool
    {
        if (!$this->enabled) {
            Log::info("Telegram disabled. Would send to chat {$chatId}: {$message}");
            return true;
        }

        if (empty($this->botToken)) {
            Log::error('Telegram bot token not configured');
            return false;
        }

        try {
            $payload = array_merge([
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => 'HTML',
            ], $options);

            $response = Http::post("{$this->apiUrl}/bot{$this->botToken}/sendMessage", $payload);

            if ($response->successful()) {
                Log::info("Telegram message sent to chat {$chatId}");
                return true;
            }

            Log::error("Telegram API error: {$response->body()}", [
                'status' => $response->status(),
                'chat_id' => $chatId,
            ]);
            return false;
        } catch (\Exception $e) {
            Log::error("Telegram send failed: {$e->getMessage()}", [
                'chat_id' => $chatId,
            ]);
            return false;
        }
    }

    /**
     * Send message with inline keyboard
     */
    public function sendMessageWithKeyboard(int $chatId, string $message, array $buttons): bool
    {
        $keyboard = ['inline_keyboard' => $buttons];

        return $this->sendMessage($chatId, $message, [
            'reply_markup' => json_encode($keyboard),
        ]);
    }

    /**
     * Send notification about complaint status change
     */
    public function sendComplaintStatusNotification(int $chatId, string $trackingNumber, string $oldStatus, string $newStatus): bool
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

        $message = "🔔 <b>تحديث حالة الشكوى</b>\n\n";
        $message .= "📋 رقم المتابعة: <code>{$trackingNumber}</code>\n";
        $message .= "⏮ الحالة السابقة: {$oldLabel}\n";
        $message .= "⏭ الحالة الجديدة: <b>{$newLabel}</b>\n\n";
        $message .= "يمكنك متابعة شكواك على موقع وزارة الاقتصاد والصناعة.";

        $buttons = [[
            [
                'text' => '🔍 متابعة الشكوى',
                'url' => config('app.url') . '/complaints/track?id=' . $trackingNumber,
            ],
        ]];

        return $this->sendMessageWithKeyboard($chatId, $message, $buttons);
    }

    /**
     * Process incoming webhook update
     */
    public function processWebhook(array $update): void
    {
        Log::info('Telegram update received', [
            'update_id' => $update['update_id'] ?? null,
            'has_message' => isset($update['message']),
            'has_callback' => isset($update['callback_query']),
        ]);

        // Handle regular message
        if (isset($update['message'])) {
            $this->handleMessage($update['message']);
        }

        // Handle callback query (inline button press)
        if (isset($update['callback_query'])) {
            $this->handleCallbackQuery($update['callback_query']);
        }

        // Handle edited message
        if (isset($update['edited_message'])) {
            $this->handleMessage($update['edited_message'], true);
        }
    }

    /**
     * Handle incoming message
     */
    protected function handleMessage(array $message, bool $isEdited = false): void
    {
        $chatId = $message['chat']['id'] ?? null;
        $userId = $message['from']['id'] ?? null;
        $text = $message['text'] ?? null;
        $messageId = $message['message_id'] ?? null;

        if (!$chatId || !$text) {
            Log::warning('Invalid Telegram message format');
            return;
        }

        Log::info("Telegram message from {$chatId}: {$text}");

        // Handle commands
        if (str_starts_with($text, '/')) {
            $this->handleCommand($chatId, $text, $message);
            return;
        }

        // Get or create chat session
        $session = $this->getOrCreateSession($chatId, $userId, $message['from']);

        // Save incoming message
        ChatMessage::create([
            'session_id' => $session->id,
            'message' => $text,
            'sender' => 'user',
            'metadata' => [
                'channel' => 'telegram',
                'telegram_message_id' => $messageId,
                'telegram_chat_id' => $chatId,
                'telegram_user_id' => $userId,
                'is_edited' => $isEdited,
            ],
        ]);

        // Process with AI and send response
        $this->processAndRespond($session, $text, $chatId);
    }

    /**
     * Handle bot commands
     */
    protected function handleCommand(int $chatId, string $command, array $message): void
    {
        $parts = explode(' ', $command, 2);
        $cmd = $parts[0];
        $args = $parts[1] ?? '';

        match ($cmd) {
            '/start' => $this->handleStartCommand($chatId, $message),
            '/help' => $this->handleHelpCommand($chatId),
            '/track' => $this->handleTrackCommand($chatId, $args),
            '/contact' => $this->handleContactCommand($chatId),
            default => $this->sendMessage($chatId, "الأمر غير معروف. استخدم /help لعرض الأوامر المتاحة."),
        };
    }

    /**
     * Handle /start command
     */
    protected function handleStartCommand(int $chatId, array $message): void
    {
        $firstName = $message['from']['first_name'] ?? 'صديقي';

        $welcomeMessage = "مرحباً {$firstName}! 👋\n\n";
        $welcomeMessage .= "أنا مساعد وزارة الاقتصاد والصناعة الذكي. يمكنني مساعدتك في:\n\n";
        $welcomeMessage .= "📋 الإجابة عن الأسئلة المتعلقة بخدمات الوزارة\n";
        $welcomeMessage .= "🔍 البحث عن المعلومات\n";
        $welcomeMessage .= "📄 متابعة حالة الشكاوى\n";
        $welcomeMessage .= "💬 الدردشة العامة\n\n";
        $welcomeMessage .= "كيف يمكنني مساعدتك اليوم؟";

        $buttons = [
            [
                ['text' => '📋 خدمات الوزارة', 'callback_data' => 'services'],
                ['text' => '🔍 متابعة شكوى', 'callback_data' => 'track'],
            ],
            [
                ['text' => '📞 تواصل معنا', 'callback_data' => 'contact'],
                ['text' => 'ℹ️ مساعدة', 'callback_data' => 'help'],
            ],
        ];

        $this->sendMessageWithKeyboard($chatId, $welcomeMessage, $buttons);
    }

    /**
     * Handle /help command
     */
    protected function handleHelpCommand(int $chatId): void
    {
        $helpMessage = "📚 <b>الأوامر المتاحة:</b>\n\n";
        $helpMessage .= "/start - بدء المحادثة\n";
        $helpMessage .= "/help - عرض هذه المساعدة\n";
        $helpMessage .= "/track [رقم_المتابعة] - متابعة شكوى\n";
        $helpMessage .= "/contact - معلومات التواصل\n\n";
        $helpMessage .= "يمكنك أيضاً إرسال أي سؤال مباشرة وسأحاول الإجابة عليه!";

        $this->sendMessage($chatId, $helpMessage);
    }

    /**
     * Handle /track command
     */
    protected function handleTrackCommand(int $chatId, string $trackingNumber): void
    {
        if (empty($trackingNumber)) {
            $this->sendMessage($chatId, "الرجاء إدخال رقم المتابعة.\n\nمثال: <code>/track COMP-12345</code>");
            return;
        }

        $trackingNumber = trim(strtoupper($trackingNumber));

        // Here you would fetch the actual complaint status
        // For now, just provide a link
        $message = "🔍 لمتابعة حالة شكواك رقم <code>{$trackingNumber}</code>، يرجى زيارة الرابط التالي:";

        $buttons = [[
            [
                'text' => '🔗 متابعة الشكوى',
                'url' => config('app.url') . '/complaints/track?id=' . $trackingNumber,
            ],
        ]];

        $this->sendMessageWithKeyboard($chatId, $message, $buttons);
    }

    /**
     * Handle /contact command
     */
    protected function handleContactCommand(int $chatId): void
    {
        $contactMessage = "📞 <b>معلومات التواصل:</b>\n\n";
        $contactMessage .= "🌐 الموقع الإلكتروني: economy.gov.sy\n";
        $contactMessage .= "📧 البريد الإلكتروني: info@economy.gov.sy\n";
        $contactMessage .= "📱 الهاتف: +963 11 xxxxxxx\n\n";
        $contactMessage .= "📍 العنوان: دمشق، سوريا";

        $buttons = [[
            [
                'text' => '🌐 زيارة الموقع',
                'url' => config('app.url'),
            ],
        ]];

        $this->sendMessageWithKeyboard($chatId, $contactMessage, $buttons);
    }

    /**
     * Handle callback query (inline button press)
     */
    protected function handleCallbackQuery(array $callbackQuery): void
    {
        $chatId = $callbackQuery['message']['chat']['id'] ?? null;
        $data = $callbackQuery['data'] ?? null;
        $queryId = $callbackQuery['id'] ?? null;

        if (!$chatId || !$data) {
            return;
        }

        // Answer callback query to remove loading state
        if ($queryId) {
            Http::post("{$this->apiUrl}/bot{$this->botToken}/answerCallbackQuery", [
                'callback_query_id' => $queryId,
            ]);
        }

        // Handle different callbacks
        match ($data) {
            'services' => $this->sendMessage($chatId, "يرجى زيارة موقعنا الإلكتروني للاطلاع على جميع الخدمات المتاحة."),
            'track' => $this->sendMessage($chatId, "أرسل رقم متابعة الشكوى أو استخدم الأمر:\n<code>/track رقم_المتابعة</code>"),
            'contact' => $this->handleContactCommand($chatId),
            'help' => $this->handleHelpCommand($chatId),
            default => Log::warning("Unknown callback data: {$data}"),
        };
    }

    /**
     * Get or create chat session for Telegram user
     */
    protected function getOrCreateSession(int $chatId, int $userId, array $from): ChatSession
    {
        // Try to find existing active session
        $session = ChatSession::where('metadata->telegram_chat_id', $chatId)
            ->where('status', 'active')
            ->first();

        if ($session) {
            return $session;
        }

        // Create new session
        return ChatSession::create([
            'session_id' => 'telegram_' . $chatId . '_' . time(),
            'user_id' => null, // Anonymous Telegram user
            'status' => 'active',
            'metadata' => [
                'channel' => 'telegram',
                'telegram_chat_id' => $chatId,
                'telegram_user_id' => $userId,
                'telegram_username' => $from['username'] ?? null,
                'telegram_first_name' => $from['first_name'] ?? null,
                'telegram_last_name' => $from['last_name'] ?? null,
            ],
        ]);
    }

    /**
     * Process message with AI and send response
     */
    protected function processAndRespond(ChatSession $session, string $userMessage, int $chatId): void
    {
        try {
            // Use the existing ChatService to process the message
            $chatService = app(\App\Services\ChatService::class);
            $response = $chatService->processMessage($session->session_id, $userMessage);

            // Send response via Telegram
            $this->sendMessage($chatId, $response['response']);

            // Save bot response
            ChatMessage::create([
                'session_id' => $session->id,
                'message' => $response['response'],
                'sender' => 'bot',
                'metadata' => [
                    'channel' => 'telegram',
                    'ai_context' => $response['context'] ?? null,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error("Telegram AI processing failed: {$e->getMessage()}");

            // Send error message
            $errorMessage = "عذراً، حدث خطأ في معالجة رسالتك. يرجى المحاولة مرة أخرى أو الاتصال بنا عبر الموقع الإلكتروني.";
            $this->sendMessage($chatId, $errorMessage);
        }
    }

    /**
     * Set webhook URL
     */
    public function setWebhook(string $url): bool
    {
        if (empty($this->botToken)) {
            Log::error('Telegram bot token not configured');
            return false;
        }

        try {
            $response = Http::post("{$this->apiUrl}/bot{$this->botToken}/setWebhook", [
                'url' => $url,
                'allowed_updates' => ['message', 'edited_message', 'callback_query'],
                'secret_token' => $this->webhookSecret,
            ]);

            if ($response->successful()) {
                Log::info("Telegram webhook set to: {$url}");
                return true;
            }

            Log::error("Telegram setWebhook failed: {$response->body()}");
            return false;
        } catch (\Exception $e) {
            Log::error("Telegram setWebhook error: {$e->getMessage()}");
            return false;
        }
    }

    /**
     * Delete webhook
     */
    public function deleteWebhook(): bool
    {
        if (empty($this->botToken)) {
            return false;
        }

        try {
            $response = Http::post("{$this->apiUrl}/bot{$this->botToken}/deleteWebhook");
            return $response->successful();
        } catch (\Exception $e) {
            Log::error("Telegram deleteWebhook error: {$e->getMessage()}");
            return false;
        }
    }

    /**
     * Get webhook info
     */
    public function getWebhookInfo(): ?array
    {
        if (empty($this->botToken)) {
            return null;
        }

        try {
            $response = Http::get("{$this->apiUrl}/bot{$this->botToken}/getWebhookInfo");

            if ($response->successful()) {
                return $response->json('result');
            }

            return null;
        } catch (\Exception $e) {
            Log::error("Telegram getWebhookInfo error: {$e->getMessage()}");
            return null;
        }
    }

    /**
     * Check if Telegram is enabled and configured
     */
    public function isConfigured(): bool
    {
        return $this->enabled && !empty($this->botToken);
    }
}
