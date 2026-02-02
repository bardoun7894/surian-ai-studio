@extends('admin.layouts.app')

@section('title', 'المقترحات - وزارة الاقتصاد')

@section('content')
<div class="mx-auto max-w-7xl">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <a href="{{ route('admin.dashboard') }}" class="hover:text-primary transition-colors">الرئيسية</a>
        <span class="material-symbols-outlined text-[16px] rtl-flip">chevron_left</span>
        <span class="text-slate-900 dark:text-white font-medium">المقترحات</span>
    </nav>

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">إدارة المقترحات</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">عرض ومتابعة مقترحات المواطنين</p>
        </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div class="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm p-5 flex items-center gap-4">
            <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <span class="material-symbols-outlined text-primary text-[28px]">lightbulb</span>
            </div>
            <div>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ $suggestions->total() }}</p>
                <p class="text-sm text-slate-500 dark:text-slate-400">إجمالي المقترحات</p>
            </div>
        </div>
        <div class="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm p-5 flex items-center gap-4">
            <div class="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                <span class="material-symbols-outlined text-amber-600 text-[28px]">pending_actions</span>
            </div>
            <div>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ $suggestions->where('status', 'pending')->count() }}</p>
                <p class="text-sm text-slate-500 dark:text-slate-400">بانتظار المراجعة</p>
            </div>
        </div>
    </div>

    <!-- Search & Filter -->
    <div class="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm p-4 mb-6">
        <form method="GET" action="{{ route('admin.suggestions.index') }}" class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1">
                <input type="text" name="search" value="{{ request('search') }}" placeholder="بحث برقم التتبع أو الاسم أو الوصف..."
                    class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400 text-sm">
            </div>
            <div class="w-full sm:w-48">
                <select name="status" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                    <option value="">جميع الحالات</option>
                    <option value="pending" {{ request('status') == 'pending' ? 'selected' : '' }}>بانتظار المراجعة</option>
                    <option value="reviewed" {{ request('status') == 'reviewed' ? 'selected' : '' }}>تمت المراجعة</option>
                    <option value="approved" {{ request('status') == 'approved' ? 'selected' : '' }}>مقبول</option>
                    <option value="rejected" {{ request('status') == 'rejected' ? 'selected' : '' }}>مرفوض</option>
                </select>
            </div>
            <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors text-sm flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px]">search</span>
                بحث
            </button>
        </form>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-right">
                <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                    <tr>
                        <th class="px-6 py-4">رقم التتبع</th>
                        <th class="px-6 py-4">المقدم</th>
                        <th class="px-6 py-4">الوصف</th>
                        <th class="px-6 py-4 text-center">الحالة</th>
                        <th class="px-6 py-4">التاريخ</th>
                        <th class="px-6 py-4 text-center">إجراءات</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border-light dark:divide-border-dark">
                    @forelse($suggestions as $suggestion)
                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <td class="px-6 py-4">
                                <span class="font-mono font-bold text-slate-700 dark:text-slate-200">{{ $suggestion->tracking_number }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="font-medium text-slate-900 dark:text-white">{{ $suggestion->name }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="text-slate-600 dark:text-slate-300">{{ Str::limit($suggestion->description, 50) }}</span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                @php
                                    $statusColors = [
                                        'pending' => 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
                                        'reviewed' => 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
                                        'approved' => 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
                                        'rejected' => 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
                                    ];
                                    $statusLabels = [
                                        'pending' => 'بانتظار المراجعة',
                                        'reviewed' => 'تمت المراجعة',
                                        'approved' => 'مقبول',
                                        'rejected' => 'مرفوض',
                                    ];
                                @endphp
                                <span class="px-3 py-1 rounded-full border text-xs font-bold {{ $statusColors[$suggestion->status] ?? 'bg-gray-100 text-gray-700 border-gray-200' }}">
                                    {{ $statusLabels[$suggestion->status] ?? $suggestion->status }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="text-slate-500 dark:text-slate-400 text-xs">{{ $suggestion->created_at->diffForHumans() }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a href="{{ route('admin.suggestions.show', $suggestion) }}" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-primary transition-colors" title="عرض التفاصيل">
                                        <span class="material-symbols-outlined text-[20px]">visibility</span>
                                    </a>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-6 py-12 text-center">
                                <div class="flex flex-col items-center justify-center text-slate-400">
                                    <span class="material-symbols-outlined text-5xl mb-3 opacity-20">lightbulb</span>
                                    <p class="text-lg font-medium">لا توجد مقترحات بعد</p>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if($suggestions->hasPages())
            <div class="border-t border-border-light dark:border-border-dark p-4">
                {{ $suggestions->withQueryString()->links() }}
            </div>
        @endif
    </div>
</div>
@endsection
