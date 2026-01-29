<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Config;

class WebhookStatus extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-signal';

    protected static ?string $navigationGroup = 'إعدادات النظام';

    protected static ?int $navigationSort = 6;

    protected static ?string $title = 'حالة التكاملات';

    protected static ?string $navigationLabel = 'حالة الويب هوك';

    protected static string $view = 'filament.pages.webhook-status';

    public function getWhatsAppStatus(): array
    {
        try {
            $token = Config::get('services.whatsapp.token');
            if (empty($token)) {
                return ['status' => 'not_configured', 'message' => 'لم يتم تكوين WhatsApp'];
            }
            return ['status' => 'configured', 'message' => 'WhatsApp مكوّن ومفعّل'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    public function getTelegramStatus(): array
    {
        try {
            $token = Config::get('services.telegram.bot_token');
            if (empty($token)) {
                return ['status' => 'not_configured', 'message' => 'لم يتم تكوين Telegram'];
            }
            return ['status' => 'configured', 'message' => 'Telegram Bot مكوّن ومفعّل'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    public function getAiServiceStatus(): array
    {
        try {
            $response = Http::timeout(5)->get(Config::get('services.ai.url', 'http://ai-service:8001') . '/health');
            if ($response->ok()) {
                return ['status' => 'healthy', 'message' => 'خدمة الذكاء الاصطناعي تعمل بشكل طبيعي'];
            }
            return ['status' => 'error', 'message' => 'خدمة الذكاء الاصطناعي لا تستجيب'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => 'تعذر الاتصال بخدمة الذكاء الاصطناعي'];
        }
    }

    public function getDatabaseStatus(): array
    {
        try {
            \Illuminate\Support\Facades\DB::connection()->getPdo();
            return ['status' => 'healthy', 'message' => 'قاعدة البيانات تعمل بشكل طبيعي'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => 'تعذر الاتصال بقاعدة البيانات'];
        }
    }

    public function getRedisStatus(): array
    {
        try {
            \Illuminate\Support\Facades\Redis::ping();
            return ['status' => 'healthy', 'message' => 'Redis يعمل بشكل طبيعي'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => 'تعذر الاتصال بـ Redis'];
        }
    }
}
