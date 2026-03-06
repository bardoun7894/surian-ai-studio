<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * FR-42: System Settings table for website configuration
     */
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, integer, boolean, json, text
            $table->string('group')->default('general'); // general, email, notifications, security, appearance
            $table->string('label_ar')->nullable();
            $table->string('label_en')->nullable();
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->boolean('is_public')->default(false); // Can be exposed to public API
            $table->boolean('is_encrypted')->default(false); // Should value be encrypted
            $table->timestamps();

            $table->index('group');
            $table->index('is_public');
        });

        // Insert default settings
        $this->seedDefaultSettings();
    }

    /**
     * Seed default system settings
     */
    protected function seedDefaultSettings(): void
    {
        $settings = [
            // General Settings
            [
                'key' => 'site_name_ar',
                'value' => 'وزارة الاقتصاد والصناعة',
                'type' => 'string',
                'group' => 'general',
                'label_ar' => 'اسم الموقع (عربي)',
                'label_en' => 'Site Name (Arabic)',
                'is_public' => true,
            ],
            [
                'key' => 'site_name_en',
                'value' => 'Ministry of Economy & Industry',
                'type' => 'string',
                'group' => 'general',
                'label_ar' => 'اسم الموقع (انجليزي)',
                'label_en' => 'Site Name (English)',
                'is_public' => true,
            ],
            [
                'key' => 'site_description_ar',
                'value' => 'البوابة الإلكترونية الرسمية لوزارة الاقتصاد والصناعة',
                'type' => 'text',
                'group' => 'general',
                'label_ar' => 'وصف الموقع (عربي)',
                'label_en' => 'Site Description (Arabic)',
                'is_public' => true,
            ],
            [
                'key' => 'site_description_en',
                'value' => 'Official Portal of the Ministry of Economy & Industry',
                'type' => 'text',
                'group' => 'general',
                'label_ar' => 'وصف الموقع (انجليزي)',
                'label_en' => 'Site Description (English)',
                'is_public' => true,
            ],
            [
                'key' => 'contact_email',
                'value' => 'info@moe.gov.sy',
                'type' => 'string',
                'group' => 'general',
                'label_ar' => 'البريد الإلكتروني للتواصل',
                'label_en' => 'Contact Email',
                'is_public' => true,
            ],
            [
                'key' => 'contact_phone',
                'value' => '+963-11-2211111',
                'type' => 'string',
                'group' => 'general',
                'label_ar' => 'رقم الهاتف',
                'label_en' => 'Contact Phone',
                'is_public' => true,
            ],
            [
                'key' => 'address_ar',
                'value' => 'دمشق، سوريا',
                'type' => 'text',
                'group' => 'general',
                'label_ar' => 'العنوان (عربي)',
                'label_en' => 'Address (Arabic)',
                'is_public' => true,
            ],
            [
                'key' => 'address_en',
                'value' => 'Damascus, Syria',
                'type' => 'text',
                'group' => 'general',
                'label_ar' => 'العنوان (انجليزي)',
                'label_en' => 'Address (English)',
                'is_public' => true,
            ],
            [
                'key' => 'working_hours_ar',
                'value' => 'الأحد - الخميس: 8:00 ص - 3:00 م',
                'type' => 'string',
                'group' => 'general',
                'label_ar' => 'ساعات العمل (عربي)',
                'label_en' => 'Working Hours (Arabic)',
                'is_public' => true,
            ],
            [
                'key' => 'working_hours_en',
                'value' => 'Sun - Thu: 8:00 AM - 3:00 PM',
                'type' => 'string',
                'group' => 'general',
                'label_ar' => 'ساعات العمل (انجليزي)',
                'label_en' => 'Working Hours (English)',
                'is_public' => true,
            ],

            // Complaint Settings
            [
                'key' => 'complaint_sla_days',
                'value' => '7',
                'type' => 'integer',
                'group' => 'complaints',
                'label_ar' => 'مدة معالجة الشكوى (أيام)',
                'label_en' => 'Complaint SLA (Days)',
                'is_public' => false,
            ],
            [
                'key' => 'complaint_allow_anonymous',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'complaints',
                'label_ar' => 'السماح بالشكاوى المجهولة',
                'label_en' => 'Allow Anonymous Complaints',
                'is_public' => true,
            ],
            [
                'key' => 'complaint_max_attachments',
                'value' => '5',
                'type' => 'integer',
                'group' => 'complaints',
                'label_ar' => 'الحد الأقصى للمرفقات',
                'label_en' => 'Max Attachments',
                'is_public' => true,
            ],
            [
                'key' => 'complaint_max_file_size_mb',
                'value' => '10',
                'type' => 'integer',
                'group' => 'complaints',
                'label_ar' => 'الحد الأقصى لحجم الملف (ميغابايت)',
                'label_en' => 'Max File Size (MB)',
                'is_public' => true,
            ],

            // Security Settings
            [
                'key' => 'session_timeout_minutes',
                'value' => '15',
                'type' => 'integer',
                'group' => 'security',
                'label_ar' => 'مهلة الجلسة (دقائق)',
                'label_en' => 'Session Timeout (Minutes)',
                'is_public' => false,
            ],
            [
                'key' => 'max_login_attempts',
                'value' => '5',
                'type' => 'integer',
                'group' => 'security',
                'label_ar' => 'الحد الأقصى لمحاولات تسجيل الدخول',
                'label_en' => 'Max Login Attempts',
                'is_public' => false,
            ],
            [
                'key' => 'lockout_duration_minutes',
                'value' => '15',
                'type' => 'integer',
                'group' => 'security',
                'label_ar' => 'مدة القفل (دقائق)',
                'label_en' => 'Lockout Duration (Minutes)',
                'is_public' => false,
            ],
            [
                'key' => 'recaptcha_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'security',
                'label_ar' => 'تفعيل reCAPTCHA',
                'label_en' => 'Enable reCAPTCHA',
                'is_public' => true,
            ],

            // Notification Settings
            [
                'key' => 'email_notifications_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'notifications',
                'label_ar' => 'تفعيل إشعارات البريد',
                'label_en' => 'Enable Email Notifications',
                'is_public' => false,
            ],
            [
                'key' => 'sms_notifications_enabled',
                'value' => 'false',
                'type' => 'boolean',
                'group' => 'notifications',
                'label_ar' => 'تفعيل إشعارات SMS',
                'label_en' => 'Enable SMS Notifications',
                'is_public' => false,
            ],

            // AI Settings
            [
                'key' => 'ai_classification_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'ai',
                'label_ar' => 'تفعيل التصنيف الذكي',
                'label_en' => 'Enable AI Classification',
                'is_public' => false,
            ],
            [
                'key' => 'ai_chatbot_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'ai',
                'label_ar' => 'تفعيل المساعد الذكي',
                'label_en' => 'Enable AI Chatbot',
                'is_public' => true,
            ],
            [
                'key' => 'ai_provider',
                'value' => 'gemini',
                'type' => 'string',
                'group' => 'ai',
                'label_ar' => 'مزود الذكاء الاصطناعي',
                'label_en' => 'AI Provider',
                'is_public' => false,
            ],

            // Appearance Settings
            [
                'key' => 'primary_color',
                'value' => '#C6A962',
                'type' => 'string',
                'group' => 'appearance',
                'label_ar' => 'اللون الأساسي',
                'label_en' => 'Primary Color',
                'is_public' => true,
            ],
            [
                'key' => 'dark_mode_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'appearance',
                'label_ar' => 'تفعيل الوضع الليلي',
                'label_en' => 'Enable Dark Mode',
                'is_public' => true,
            ],
            [
                'key' => 'rtl_support',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'appearance',
                'label_ar' => 'دعم RTL',
                'label_en' => 'RTL Support',
                'is_public' => true,
            ],

            // Social Links
            [
                'key' => 'social_facebook',
                'value' => '',
                'type' => 'string',
                'group' => 'social',
                'label_ar' => 'رابط فيسبوك',
                'label_en' => 'Facebook URL',
                'is_public' => true,
            ],
            [
                'key' => 'social_twitter',
                'value' => '',
                'type' => 'string',
                'group' => 'social',
                'label_ar' => 'رابط تويتر',
                'label_en' => 'Twitter URL',
                'is_public' => true,
            ],
            [
                'key' => 'social_youtube',
                'value' => '',
                'type' => 'string',
                'group' => 'social',
                'label_ar' => 'رابط يوتيوب',
                'label_en' => 'YouTube URL',
                'is_public' => true,
            ],
            [
                'key' => 'social_telegram',
                'value' => '',
                'type' => 'string',
                'group' => 'social',
                'label_ar' => 'رابط تيليغرام',
                'label_en' => 'Telegram URL',
                'is_public' => true,
            ],
        ];

        foreach ($settings as $setting) {
            DB::table('system_settings')->insert(array_merge($setting, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
