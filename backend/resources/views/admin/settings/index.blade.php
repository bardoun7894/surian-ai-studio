@extends('admin.layouts.app')

@section('title', 'إعدادات النظام')

@section('content')
<div class="max-w-4xl mx-auto animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">إعدادات النظام العامة</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">التحكم في خصائص الموقع، الأمان، والتكاملات.</p>
        </div>
        <button form="settingsForm" type="submit" class="flex items-center gap-2 rounded bg-gov-emerald px-6 py-2.5 text-sm font-bold text-white hover:bg-gov-emeraldLight transition-colors shadow-md hover:shadow-lg">
            <span class="material-symbols-outlined text-[20px]">save</span>
            حفظ التغييرات
        </button>
    </div>

    <form id="settingsForm" action="{{ route('admin.settings.update') }}" method="POST">
        @csrf
        @method('PUT')

        <div class="flex flex-col gap-8">
            <!-- General Settings -->
            <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-gov-emerald via-gov-gold to-gov-emerald opacity-50"></div>
                <h3 class="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                    <span class="material-symbols-outlined text-gov-emerald">tune</span>
                    إعدادات الموقع الأساسية
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1.5">اسم الموقع (بالعربية)</label>
                        <input type="text" name="site_name_ar" value="{{ $settings['site_name_ar'] ?? 'وزارة الاقتصاد والتجارة الخارجية' }}" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-gov-emerald focus:border-gov-emerald text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1.5">Site Name (English)</label>
                        <input type="text" name="site_name_en" value="{{ $settings['site_name_en'] ?? 'Ministry of Economy' }}" dir="ltr" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-gov-emerald focus:border-gov-emerald text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1.5">بريد الدعم الفني</label>
                        <input type="email" name="support_email" value="{{ $settings['support_email'] ?? 'support@economy.gov.sy' }}" dir="ltr" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-gov-emerald focus:border-gov-emerald text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1.5">رقم الهاتف</label>
                        <input type="text" name="contact_phone" value="{{ $settings['contact_phone'] ?? '+963 11 1234567' }}" dir="ltr" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-gov-emerald focus:border-gov-emerald text-sm">
                    </div>
                </div>
            </div>

            <!-- Security Settings -->
            <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <h3 class="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                    <span class="material-symbols-outlined text-gov-gold">security</span>
                    الأمان والوصول
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div>
                            <span class="block text-sm font-bold text-slate-900 dark:text-white">وضع البوابة (Maintenance Mode)</span>
                            <p class="text-xs text-slate-500 mt-1">إغلاق الموقع مؤقتاً للتحديثات.</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="maintenance_mode" value="1" class="sr-only peer" {{ ($settings['maintenance_mode'] ?? '') == '1' ? 'checked' : '' }}>
                            <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gov-emerald/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gov-emerald"></div>
                        </label>
                    </div>

                    <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div>
                            <span class="block text-sm font-bold text-slate-900 dark:text-white">المصادقة الثنائية (2FA)</span>
                            <p class="text-xs text-slate-500 mt-1">فرض 2FA على جميع حسابات الموظفين.</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="force_2fa" value="1" class="sr-only peer" {{ ($settings['force_2fa'] ?? '') == '1' ? 'checked' : '' }}>
                            <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gov-emerald/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gov-emerald"></div>
                        </label>
                    </div>
                </div>

                <div class="mt-6">
                    <label class="block text-xs font-bold text-slate-500 mb-1.5">مدة الجلسة (بالدقائق)</label>
                    <input type="number" name="session_lifetime" value="{{ $settings['session_lifetime'] ?? '120' }}" class="w-32 rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-gov-emerald focus:border-gov-emerald text-sm">
                    <p class="text-[10px] text-slate-400 mt-1">سيتم تسجيل خروج المستخدم تلقائياً بعد هذه المدة من الخمول.</p>
                </div>
            </div>
            
             <!-- AI Settings -->
             <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <h3 class="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                    <span class="material-symbols-outlined text-purple-600">smart_toy</span>
                    إعدادات الذكاء الاصطناعي
                </h3>
                 <div class="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-800">
                     <div>
                        <span class="block text-sm font-bold text-slate-900 dark:text-white">تفعيل المساعد الذكي (Chatbot)</span>
                        <p class="text-xs text-slate-500 mt-1">السماح للزوار بالتفاعل مع البوت.</p>
                     </div>
                     <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="enable_chatbot" value="1" class="sr-only peer" {{ ($settings['enable_chatbot'] ?? '') == '1' ? 'checked' : '' }}>
                        <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                 </div>
            </div>
        </div>
    </form>
</div>
@endsection
