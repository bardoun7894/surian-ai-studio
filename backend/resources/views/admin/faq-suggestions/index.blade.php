@extends('admin.layouts.app')

@section('title', 'اقتراحات الأسئلة - وزارة الاقتصاد')

@section('content')
<div class="max-w-[1440px] mx-auto w-full">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 mb-6 text-sm">
        <a class="text-slate-500 dark:text-slate-400 hover:text-primary font-medium" href="{{ route('admin.dashboard') }}">الرئيسية</a>
        <span class="material-symbols-outlined text-slate-400 text-[16px] rtl-flip">chevron_left</span>
        <span class="text-primary dark:text-slate-200 font-semibold">اقتراحات الأسئلة الشائعة</span>
    </div>

    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div class="flex flex-col gap-2">
            <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">اقتراحات الأسئلة الشائعة (AI)</h1>
            <p class="text-slate-500 dark:text-slate-400 text-base max-w-2xl">أسئلة مقترحة من الذكاء الاصطناعي بناءً على محادثات المواطنين</p>
        </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div class="bg-surface-light dark:bg-surface-dark p-5 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
            <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">إجمالي الاقتراحات</p>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ number_format($suggestions->total()) }}</h3>
        </div>
        <div class="bg-surface-light dark:bg-surface-dark p-5 rounded border-r-4 border-amber-500 shadow-sm">
            <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">بانتظار المراجعة</p>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ number_format($pendingCount) }}</h3>
        </div>
    </div>

    <!-- Filter -->
    <div class="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded shadow-sm p-4 mb-6">
        <form method="GET" action="{{ route('admin.faq-suggestions.index') }}" class="flex flex-col md:flex-row gap-4">
            <div class="w-full md:w-56">
                <select name="status" class="w-full rounded border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                    <option value="">جميع الحالات</option>
                    <option value="pending" {{ request('status') == 'pending' ? 'selected' : '' }}>بانتظار المراجعة</option>
                    <option value="approved" {{ request('status') == 'approved' ? 'selected' : '' }}>مقبول</option>
                    <option value="rejected" {{ request('status') == 'rejected' ? 'selected' : '' }}>مرفوض</option>
                </select>
            </div>
            <button type="submit" class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-5 rounded flex items-center gap-2 shadow-sm transition-all">
                <span class="material-symbols-outlined text-[20px]">filter_list</span>
                تصفية
            </button>
        </form>
    </div>

    <!-- Data Table -->
    <div class="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-right border-collapse">
                <thead>
                    <tr class="bg-primary text-white border-b border-primary-dark">
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">السؤال</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">التكرار</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">الثقة</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">الحالة</th>
                        <th class="p-4 w-48 text-center text-xs font-bold uppercase tracking-wider text-white/90">إجراءات</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                    @forelse($suggestions as $suggestion)
                    <tr class="group hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                        <td class="p-4">
                            <span class="text-sm font-bold text-slate-900 dark:text-white">{{ Str::limit($suggestion->question_ar, 80) }}</span>
                        </td>
                        <td class="p-4">
                            <span class="text-sm font-mono font-bold text-primary">{{ $suggestion->occurrence_count }}</span>
                        </td>
                        <td class="p-4">
                            @php
                                $score = round($suggestion->confidence_score * 100);
                                $scoreColor = $score >= 80 ? 'text-green-700 bg-green-100' : ($score >= 50 ? 'text-amber-700 bg-amber-100' : 'text-red-700 bg-red-100');
                            @endphp
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold {{ $scoreColor }}">
                                {{ $score }}%
                            </span>
                        </td>
                        <td class="p-4">
                            @php
                                $statusColors = [
                                    'pending' => 'bg-amber-100 text-amber-700 border-amber-200',
                                    'approved' => 'bg-green-100 text-green-700 border-green-200',
                                    'rejected' => 'bg-red-100 text-red-700 border-red-200',
                                ];
                                $statusLabels = [
                                    'pending' => 'بانتظار المراجعة',
                                    'approved' => 'مقبول',
                                    'rejected' => 'مرفوض',
                                ];
                            @endphp
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border {{ $statusColors[$suggestion->status] ?? 'bg-slate-100 text-slate-600 border-slate-200' }}">
                                {{ $statusLabels[$suggestion->status] ?? $suggestion->status }}
                            </span>
                        </td>
                        <td class="p-4">
                            @if($suggestion->status === 'pending')
                                <div class="flex items-center justify-center gap-2">
                                    <form action="{{ route('admin.faq-suggestions.approve', $suggestion) }}" method="POST">
                                        @csrf
                                        <button type="submit" class="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-bold shadow-sm transition-all" title="قبول">
                                            <span class="material-symbols-outlined text-[16px]">check</span>
                                            قبول
                                        </button>
                                    </form>
                                    <form action="{{ route('admin.faq-suggestions.reject', $suggestion) }}" method="POST">
                                        @csrf
                                        <button type="submit" class="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all" title="رفض">
                                            <span class="material-symbols-outlined text-[16px]">close</span>
                                            رفض
                                        </button>
                                    </form>
                                </div>
                            @else
                                <div class="text-center text-xs text-slate-400">--</div>
                            @endif
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="5" class="p-8 text-center text-slate-500">
                            <span class="material-symbols-outlined text-3xl mb-2 block">smart_toy</span>
                            لا توجد اقتراحات للعرض.
                        </td>
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
