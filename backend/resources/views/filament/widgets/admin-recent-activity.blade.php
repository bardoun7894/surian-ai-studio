<x-filament-widgets::widget>
    <x-filament::section>
        <x-slot name="heading">
            النشاط الحديث
        </x-slot>

        <div class="space-y-6">
            @php
            $activities = [
                ['type' => 'complaint', 'text' => 'شكوى جديدة: انقطاع مياه', 'time' => 'منذ 10 دقائق', 'color' => 'bg-amber-100 text-amber-600'],
                ['type' => 'user', 'text' => 'تسجيل مستخدم جديد: أحمد س.', 'time' => 'منذ 32 دقيقة', 'color' => 'bg-blue-100 text-blue-600'],
                ['type' => 'content', 'text' => 'نشر خبر: مرسوم رئاسي', 'time' => 'منذ ساعة', 'color' => 'bg-green-100 text-green-600'],
                ['type' => 'system', 'text' => 'نسخ احتياطي للنظام', 'time' => 'منذ 3 ساعات', 'color' => 'bg-gray-100 text-gray-600'],
            ];
            @endphp

            @foreach($activities as $item)
            <div class="flex gap-4">
                <div class="w-2 h-full min-h-[40px] rounded-full {{ explode(' ', $item['color'])[0] }}"></div>
                <div>
                    <p class="text-sm font-bold text-gray-700 dark:text-gray-200">{{ $item['text'] }}</p>
                    <span class="text-xs text-gray-400">{{ $item['time'] }}</span>
                </div>
            </div>
            @endforeach
        </div>
        
        <button class="w-full mt-6 py-2 text-sm text-primary-600 font-bold border border-primary-600/20 rounded-xl hover:bg-primary-600 hover:text-white transition-colors">
            عرض كل النشاطات
        </button>
    </x-filament::section>
</x-filament-widgets::widget>
