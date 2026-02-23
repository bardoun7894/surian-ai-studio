@extends('admin.layouts.app')

@section('title', 'إدارة المقترحات - وزارة الاقتصاد')

@section('content')
<div class="max-w-[1440px] mx-auto w-full">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 mb-6 text-sm">
        <a class="text-slate-500 dark:text-slate-400 hover:text-primary font-medium" href="{{ route('admin.dashboard') }}">الرئيسية</a>
        <span class="material-symbols-outlined text-slate-400 text-[16px] rtl-flip">chevron_left</span>
        <span class="text-primary dark:text-slate-200 font-semibold">المقترحات</span>
    </div>

    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div class="flex flex-col gap-2">
            <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">مقترحات المواطنين</h1>
            <p class="text-slate-500 dark:text-slate-400 text-base max-w-2xl">متابعة ومراجعة مقترحات المواطنين عبر كافة المديريات.</p>
        </div>
        <div class="flex gap-3">
            <a href="{{ route('admin.suggestions.kanban') }}" class="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold py-2.5 px-5 rounded flex items-center gap-2 shadow-sm transition-all">
                <span class="material-symbols-outlined text-[20px]">view_kanban</span>
                عرض اللوحة
            </a>
        </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <a href="{{ route('admin.suggestions.index') }}" class="bg-surface-light dark:bg-surface-dark p-5 rounded border border-slate-200 dark:border-slate-700 shadow-sm hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer block">
            <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">إجمالي المقترحات</p>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ number_format($suggestions->total()) }}</h3>
        </a>
        <a href="{{ route('admin.suggestions.index', ['status' => 'pending']) }}" class="bg-surface-light dark:bg-surface-dark p-5 rounded border-r-4 border-amber-500 shadow-sm hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer block">
            <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">بانتظار المراجعة</p>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ \App\Models\Suggestion::where('status', 'pending')->count() }}</h3>
        </a>
        <a href="#" class="bg-surface-light dark:bg-surface-dark p-5 rounded border border-slate-200 dark:border-slate-700 shadow-sm hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer block">
            <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">متوسط التقييم</p>
            <div class="flex items-center gap-2">
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ $ratingStats->avg_rating ?? '—' }}</h3>
                @if($ratingStats->avg_rating)
                    <span class="material-symbols-outlined text-amber-400 text-[20px]">star</span>
                @endif
            </div>
        </a>
        <a href="{{ route('admin.suggestions.index', ['status' => 'approved']) }}" class="bg-surface-light dark:bg-surface-dark p-5 rounded border border-slate-200 dark:border-slate-700 shadow-sm hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer block">
            <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">مقبولة</p>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ \App\Models\Suggestion::where('status', 'approved')->count() }}</h3>
        </a>
    </div>

    <!-- Search & Filter -->
    <div class="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded shadow-sm p-4 mb-6">
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

    <!-- Data Table -->
    <div class="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-right border-collapse">
                <thead>
                    <tr class="bg-primary text-white border-b border-primary-dark">
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">رقم التتبع</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">المقدم</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">المديرية</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">الحالة</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">التصنيف</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">تاريخ الورود</th>
                        <th class="p-4 w-24 text-center text-xs font-bold uppercase tracking-wider text-white/90">إجراءات</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                    @forelse($suggestions as $suggestion)
                    <tr class="group hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                        <td class="p-4">
                            <span class="text-sm font-mono font-bold text-primary">#{{ $suggestion->tracking_number }}</span>
                        </td>
                        <td class="p-4">
                            <div class="flex flex-col">
                                <span class="text-sm font-bold text-slate-900 dark:text-white">{{ $suggestion->name ?? 'مجهول' }}</span>
                                @if($suggestion->email)
                                    <span class="text-xs text-slate-500 dark:text-slate-400">{{ $suggestion->email }}</span>
                                @endif
                            </div>
                        </td>
                        <td class="p-4">
                            <span class="text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded">
                                {{ $suggestion->directorate->name_ar ?? 'العامة' }}
                            </span>
                        </td>
                        <td class="p-4">
                            @php
                                $statusColors = [
                                    'pending' => 'bg-amber-100 text-amber-700 border-amber-200',
                                    'reviewed' => 'bg-blue-100 text-blue-700 border-blue-200',
                                    'approved' => 'bg-green-100 text-green-700 border-green-200',
                                    'rejected' => 'bg-slate-100 text-slate-600 border-slate-200',
                                ];
                                $statusLabels = [
                                    'pending' => 'بانتظار المراجعة',
                                    'reviewed' => 'تمت المراجعة',
                                    'approved' => 'مقبول',
                                    'rejected' => 'مرفوض',
                                ];
                            @endphp
                            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border {{ $statusColors[$suggestion->status] ?? 'bg-slate-100 text-slate-600' }}">
                                {{ $statusLabels[$suggestion->status] ?? $suggestion->status }}
                            </span>
                        </td>
                        <td class="p-4">
                            @if($suggestion->ai_category)
                                <span class="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded">
                                    {{ $suggestion->ai_category }}
                                </span>
                            @else
                                <span class="text-xs text-slate-400">—</span>
                            @endif
                        </td>
                        <td class="p-4 text-sm text-slate-500 dark:text-slate-400">
                            {{ $suggestion->created_at->locale('ar')->isoFormat('D MMM Y') }}
                        </td>
                        <td class="p-4 text-center">
                            <a href="{{ route('admin.suggestions.show', $suggestion) }}" class="size-8 flex items-center justify-center rounded text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <span class="material-symbols-outlined text-[20px]">visibility</span>
                            </a>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="7" class="p-8 text-center text-slate-500">لا يوجد مقترحات للعرض.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="p-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <span class="text-sm text-slate-500 dark:text-slate-400">
                عرض {{ $suggestions->firstItem() ?? 0 }}-{{ $suggestions->lastItem() ?? 0 }} من أصل {{ $suggestions->total() }} سجل
            </span>
            <div class="flex gap-2 dir-ltr">
                {{ $suggestions->withQueryString()->links('pagination::simple-tailwind') }}
            </div>
        </div>
    </div>
</div>
@endsection
