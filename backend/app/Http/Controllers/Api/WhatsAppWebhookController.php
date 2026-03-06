<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class WhatsAppWebhookController extends Controller
{
    protected WhatsAppService $whatsAppService;

    public function __construct(WhatsAppService $whatsAppService)
    {
        $this->whatsAppService = $whatsAppService;
    }

    /**
     * Handle webhook verification (GET request from Meta)
     * This is called once during initial webhook setup
     */
    public function verify(Request $request)
    {
        $mode = $request->query('hub.mode');
        $token = $request->query('hub.verify_token');
        $challenge = $request->query('hub.challenge');

        Log::info('WhatsApp webhook verification attempt', [
            'mode' => $mode,
            'has_token' => !empty($token),
            'has_challenge' => !empty($challenge),
        ]);

        $verifiedChallenge = $this->whatsAppService->verifyWebhook($mode, $token, $challenge);

        if ($verifiedChallenge) {
            // Return the challenge as plain text (required by Meta)
            return response($verifiedChallenge, 200)
                ->header('Content-Type', 'text/plain');
        }

        return response('Forbidden', 403);
    }

    /**
     * Handle incoming webhook messages (POST request from Meta)
     * This is called whenever a message is sent to the WhatsApp number
     */
    public function webhook(Request $request): JsonResponse
    {
        $data = $request->all();

        Log::info('WhatsApp webhook received', [
            'object' => $data['object'] ?? null,
            'entry_count' => count($data['entry'] ?? []),
        ]);

        // Verify this is a WhatsApp message webhook
        if (($data['object'] ?? null) !== 'whatsapp_business_account') {
            Log::warning('Invalid WhatsApp webhook object type', [
                'object' => $data['object'] ?? null,
            ]);
            return response()->json(['status' => 'ignored'], 200);
        }

        try {
            // Process the webhook asynchronously
            dispatch(function () use ($data) {
                $this->whatsAppService->processWebhook($data);
            })->afterResponse();

            // Immediately return 200 to Meta (required within 20 seconds)
            return response()->json(['status' => 'received'], 200);
        } catch (\Exception $e) {
            Log::error('WhatsApp webhook processing error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Still return 200 to prevent Meta from retrying
            return response()->json(['status' => 'error'], 200);
        }
    }

    /**
     * Get webhook status (admin endpoint)
     */
    public function status(): JsonResponse
    {
        return response()->json([
            'enabled' => config('whatsapp.enabled'),
            'configured' => $this->whatsAppService->isConfigured(),
            'webhook_url' => config('whatsapp.webhook_url'),
            'phone_number_id' => config('whatsapp.phone_number_id') ? 'configured' : 'not configured',
        ]);
    }
}
