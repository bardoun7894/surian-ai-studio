<x-filament-panels::page>
    <div class="space-y-6">
        {{-- Date Filter --}}
        <div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <form wire:submit.prevent="$refresh" class="flex flex-wrap items-end gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">من تاريخ</label>
                    <input type="date" wire:model="date_from" class="block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">إلى تاريخ</label>
                    <input type="date" wire:model="date_to" class="block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                </div>
                <button type="submit" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
                    تحديث
                </button>
            </form>
        </div>

        {{-- Stats Overview --}}
        @php $stats = $this->getStats(); @endphp
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <p class="text-sm text-gray-500 dark:text-gray-400">إجمالي الشكاوى</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ $stats['total_complaints'] }}</p>
            </div>
            <div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <p class="text-sm text-gray-500 dark:text-gray-400">شكاوى تم حلها</p>
                <p class="text-2xl font-bold text-success-600">{{ $stats['resolved_complaints'] }}</p>
            </div>
            <div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <p class="text-sm text-gray-500 dark:text-gray-400">شكاوى قيد المعالجة</p>
                <p class="text-2xl font-bold text-warning-600">{{ $stats['in_progress_complaints'] }}</p>
            </div>
            <div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <p class="text-sm text-gray-500 dark:text-gray-400">إجمالي المقترحات</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ $stats['total_suggestions'] }}</p>
            </div>
            <div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <p class="text-sm text-gray-500 dark:text-gray-400">الخدمات النشطة</p>
                <p class="text-2xl font-bold text-primary-600">{{ $stats['active_services'] }}</p>
            </div>
        </div>

        {{-- Charts Row --}}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {{-- Complaints by Status --}}
            @php $byStatus = $this->getComplaintsByStatus(); @endphp
            <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">الشكاوى حسب الحالة</h3>
                @if(count($byStatus) > 0)
                    <div class="space-y-3">
                        @php
                            $statusLabels = ['new' => 'جديدة', 'in_progress' => 'قيد المعالجة', 'resolved' => 'تم الحل', 'closed' => 'مغلقة', 'rejected' => 'مرفوضة'];
                            $statusColors = ['new' => 'bg-blue-500', 'in_progress' => 'bg-yellow-500', 'resolved' => 'bg-green-500', 'closed' => 'bg-gray-500', 'rejected' => 'bg-red-500'];
                            $total = array_sum($byStatus);
                        @endphp
                        @foreach($byStatus as $status => $count)
                            <div>
                                <div class="flex justify-between text-sm mb-1">
                                    <span class="text-gray-600 dark:text-gray-400">{{ $statusLabels[$status] ?? $status }}</span>
                                    <span class="font-medium text-gray-900 dark:text-white">{{ $count }}</span>
                                </div>
                                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div class="{{ $statusColors[$status] ?? 'bg-primary-500' }} h-2 rounded-full" style="width: {{ $total > 0 ? ($count / $total * 100) : 0 }}%"></div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                @else
                    <p class="text-gray-500 dark:text-gray-400 text-sm">لا توجد بيانات للفترة المحددة</p>
                @endif
            </div>

            {{-- Complaints by Directorate --}}
            @php $byDirectorate = $this->getComplaintsByDirectorate(); @endphp
            <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">الشكاوى حسب الإدارة</h3>
                @if(count($byDirectorate) > 0)
                    <div class="space-y-3">
                        @php $totalDir = array_sum($byDirectorate); @endphp
                        @foreach($byDirectorate as $directorate => $count)
                            <div>
                                <div class="flex justify-between text-sm mb-1">
                                    <span class="text-gray-600 dark:text-gray-400">{{ $directorate }}</span>
                                    <span class="font-medium text-gray-900 dark:text-white">{{ $count }}</span>
                                </div>
                                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div class="bg-primary-500 h-2 rounded-full" style="width: {{ $totalDir > 0 ? ($count / $totalDir * 100) : 0 }}%"></div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                @else
                    <p class="text-gray-500 dark:text-gray-400 text-sm">لا توجد بيانات للفترة المحددة</p>
                @endif
            </div>
        </div>

        {{-- Trend --}}
        @php $trend = $this->getComplaintsTrend(); @endphp
        @if(count($trend) > 0)
        <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">اتجاه الشكاوى اليومي</h3>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b dark:border-gray-700">
                            <th class="text-right py-2 text-gray-500 dark:text-gray-400">التاريخ</th>
                            <th class="text-right py-2 text-gray-500 dark:text-gray-400">العدد</th>
                            <th class="text-right py-2 text-gray-500 dark:text-gray-400">الرسم البياني</th>
                        </tr>
                    </thead>
                    <tbody>
                        @php $maxTrend = max($trend); @endphp
                        @foreach($trend as $date => $count)
                        <tr class="border-b dark:border-gray-700">
                            <td class="py-2 text-gray-900 dark:text-white">{{ $date }}</td>
                            <td class="py-2 font-medium text-gray-900 dark:text-white">{{ $count }}</td>
                            <td class="py-2">
                                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div class="bg-primary-500 h-2 rounded-full" style="width: {{ $maxTrend > 0 ? ($count / $maxTrend * 100) : 0 }}%"></div>
                                </div>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
        @endif

        {{-- AI Summaries --}}
        @php $summaries = $this->getRecentSummaries(); @endphp
        @if($summaries->count() > 0)
        <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">آخر ملخصات الذكاء الاصطناعي</h3>
            <div class="space-y-4">
                @foreach($summaries as $summary)
                <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $summary->title ?? 'ملخص #' . $summary->id }}</span>
                        <span class="text-xs text-gray-500">{{ $summary->created_at->diffForHumans() }}</span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ \Illuminate\Support\Str::limit($summary->summary ?? $summary->content ?? '', 200) }}</p>
                </div>
                @endforeach
            </div>
        </div>
        @endif
    </div>
</x-filament-panels::page>
