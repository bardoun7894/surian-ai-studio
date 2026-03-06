<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TelegramService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class TelegramWebhookController extends Controller
{
    protected TelegramService $telegramService;

    public function __construct(TelegramService $telegramService)
    {
        $this->telegramService = $telegramService;
    }

    /**
     * Handle incoming webhook updates from Telegram
     */
    public function webhook(Request $request): JsonResponse
    {
        $data = $request->all();

        // Verify webhook secret token (if configured)
        $secretToken = config('telegram.webhook_secret');
        if ($secretToken && $request->header('X-Telegram-Bot-Api-Secret-Token') !== $secretToken) {
            Log::warning('Telegram webhook secret token mismatch');
            return response()->json(['status' => 'forbidden'], 403);
        }

        Log::info('Telegram webhook received', [
            'update_id' => $data['update_id'] ?? null,
            'has_message' => isset($data['message']),
        ]);

        try {
            // Process the webhook asynchronously
            dispatch(function () use ($data) {
                $this->telegramService->processWebhook($data);
            })->afterResponse();

            // Immediately return 200 to Telegram
            return response()->json(['ok' => true], 200);
        } catch (\Exception $e) {
            Log::error('Telegram webhook processing error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Still return 200 to prevent Telegram from retrying
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 200);
        }
    }

    /**
     * Set webhook URL (admin endpoint)
     */
    public function setWebhook(Request $request): JsonResponse
    {
        $url = $request->input('url') ?? config('app.url') . config('telegram.webhook_url');

        $result = $this->telegramService->setWebhook($url);

        if ($result) {
            return response()->json([
                'success' => true,
                'message' => 'Webhook set successfully',
                'url' => $url,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to set webhook',
        ], 500);
    }

    /**
     * Delete webhook (admin endpoint)
     */
    public function deleteWebhook(): JsonResponse
    {
        $result = $this->telegramService->deleteWebhook();

        if ($result) {
            return response()->json([
                'success' => true,
                'message' => 'Webhook deleted successfully',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to delete webhook',
        ], 500);
    }

    /**
     * Get webhook info (admin endpoint)
     */
    public function getWebhookInfo(): JsonResponse
    {
        $info = $this->telegramService->getWebhookInfo();

        if ($info) {
            return response()->json([
                'success' => true,
                'data' => $info,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to get webhook info',
        ], 500);
    }

    /**
     * Get bot status (admin endpoint)
     */
    public function status(): JsonResponse
    {
        $webhookInfo = $this->telegramService->getWebhookInfo();

        return response()->json([
            'enabled' => config('telegram.enabled'),
            'configured' => $this->telegramService->isConfigured(),
            'bot_username' => config('telegram.bot_username'),
            'webhook_info' => $webhookInfo,
        ]);
    }
}
