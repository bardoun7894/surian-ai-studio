<x-filament-panels::page>
    <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @php
                $services = [
                    ['name' => 'قاعدة البيانات (PostgreSQL)', 'icon' => 'heroicon-o-circle-stack', 'data' => $this->getDatabaseStatus()],
                    ['name' => 'Redis Cache', 'icon' => 'heroicon-o-bolt', 'data' => $this->getRedisStatus()],
                    ['name' => 'خدمة الذكاء الاصطناعي', 'icon' => 'heroicon-o-cpu-chip', 'data' => $this->getAiServiceStatus()],
                    ['name' => 'WhatsApp Integration', 'icon' => 'heroicon-o-chat-bubble-left-right', 'data' => $this->getWhatsAppStatus()],
                    ['name' => 'Telegram Bot', 'icon' => 'heroicon-o-paper-airplane', 'data' => $this->getTelegramStatus()],
                ];

                $statusColors = [
                    'healthy' => 'text-green-600 dark:text-green-400',
                    'configured' => 'text-blue-600 dark:text-blue-400',
                    'not_configured' => 'text-yellow-600 dark:text-yellow-400',
                    'error' => 'text-red-600 dark:text-red-400',
                ];

                $statusBg = [
                    'healthy' => 'bg-green-100 dark:bg-green-900/30',
                    'configured' => 'bg-blue-100 dark:bg-blue-900/30',
                    'not_configured' => 'bg-yellow-100 dark:bg-yellow-900/30',
                    'error' => 'bg-red-100 dark:bg-red-900/30',
                ];

                $statusLabels = [
                    'healthy' => 'يعمل',
                    'configured' => 'مكوّن',
                    'not_configured' => 'غير مكوّن',
                    'error' => 'خطأ',
                ];

                $statusDot = [
                    'healthy' => 'bg-green-500',
                    'configured' => 'bg-blue-500',
                    'not_configured' => 'bg-yellow-500',
                    'error' => 'bg-red-500',
                ];
            @endphp

            @foreach($services as $service)
                @php $status = $service['data']['status']; @endphp
                <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="p-2 {{ $statusBg[$status] ?? 'bg-gray-100' }} rounded-lg">
                                <x-dynamic-component :component="$service['icon']" class="w-6 h-6 {{ $statusColors[$status] ?? 'text-gray-500' }}" />
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-white text-sm">{{ $service['name'] }}</h3>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full {{ $statusDot[$status] ?? 'bg-gray-500' }} animate-pulse"></span>
                            <span class="text-xs font-medium {{ $statusColors[$status] ?? 'text-gray-500' }}">{{ $statusLabels[$status] ?? $status }}</span>
                        </div>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ $service['data']['message'] }}</p>
                </div>
            @endforeach
        </div>

        {{-- System Info --}}
        <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">معلومات النظام</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div class="flex justify-between py-2 border-b dark:border-gray-700">
                    <span class="text-gray-500 dark:text-gray-400">Laravel</span>
                    <span class="text-gray-900 dark:text-white font-medium">{{ app()->version() }}</span>
                </div>
                <div class="flex justify-between py-2 border-b dark:border-gray-700">
                    <span class="text-gray-500 dark:text-gray-400">PHP</span>
                    <span class="text-gray-900 dark:text-white font-medium">{{ PHP_VERSION }}</span>
                </div>
                <div class="flex justify-between py-2 border-b dark:border-gray-700">
                    <span class="text-gray-500 dark:text-gray-400">البيئة</span>
                    <span class="text-gray-900 dark:text-white font-medium">{{ app()->environment() }}</span>
                </div>
                <div class="flex justify-between py-2 border-b dark:border-gray-700">
                    <span class="text-gray-500 dark:text-gray-400">التخزين المؤقت</span>
                    <span class="text-gray-900 dark:text-white font-medium">{{ config('cache.default') }}</span>
                </div>
            </div>
        </div>
    </div>
</x-filament-panels::page>
