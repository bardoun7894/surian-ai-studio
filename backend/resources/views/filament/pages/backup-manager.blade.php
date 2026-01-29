<x-filament-panels::page>
    <div class="space-y-6">
        @php $backups = $this->getBackups(); @endphp

        @if(count($backups) > 0)
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 dark:bg-gray-900">
                    <tr>
                        <th class="text-right px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">اسم الملف</th>
                        <th class="text-right px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">الحجم</th>
                        <th class="text-right px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">التاريخ</th>
                        <th class="text-right px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">الإجراءات</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    @foreach($backups as $backup)
                    <tr>
                        <td class="px-6 py-4 text-gray-900 dark:text-white font-medium">
                            <div class="flex items-center gap-2">
                                <x-heroicon-o-document class="w-5 h-5 text-gray-400" />
                                {{ $backup['filename'] }}
                            </div>
                        </td>
                        <td class="px-6 py-4 text-gray-600 dark:text-gray-400">{{ $backup['size'] }}</td>
                        <td class="px-6 py-4 text-gray-600 dark:text-gray-400">{{ $backup['date'] }}</td>
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-2">
                                <button
                                    wire:click="downloadBackup('{{ $backup['filename'] }}')"
                                    class="text-primary-600 hover:text-primary-800 dark:text-primary-400"
                                    title="تحميل"
                                >
                                    <x-heroicon-o-arrow-down-tray class="w-5 h-5" />
                                </button>
                                <button
                                    wire:click="deleteBackup('{{ $backup['filename'] }}')"
                                    wire:confirm="هل أنت متأكد من حذف هذه النسخة الاحتياطية؟"
                                    class="text-danger-600 hover:text-danger-800 dark:text-danger-400"
                                    title="حذف"
                                >
                                    <x-heroicon-o-trash class="w-5 h-5" />
                                </button>
                            </div>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @else
        <div class="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <x-heroicon-o-server-stack class="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">لا توجد نسخ احتياطية</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">اضغط على "إنشاء نسخة احتياطية" لإنشاء أول نسخة.</p>
        </div>
        @endif
    </div>
</x-filament-panels::page>
