@extends('admin.layouts.app')

@section('title', 'إدارة الشكاوى - وزارة الاقتصاد')

@section('content')
<div class="max-w-[1440px] mx-auto w-full">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 mb-6 text-sm">
        <a class="text-slate-500 dark:text-slate-400 hover:text-primary font-medium" href="{{ route('admin.dashboard') }}">الرئيسية</a>
        <span class="material-symbols-outlined text-slate-400 text-[16px] rtl-flip">chevron_left</span>
        <span class="text-primary dark:text-slate-200 font-semibold">الشكاوى</span>
    </div>
    
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div class="flex flex-col gap-2">
            <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">شكاوى المواطنين</h1>
            <p class="text-slate-500 dark:text-slate-400 text-base max-w-2xl">متابعة ومعالجة شكاوى المواطنين عبر كافة المديريات.</p>
        </div>
        <div class="flex gap-3">
            <a href="{{ route('admin.complaints.kanban') }}" class="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold py-2.5 px-5 rounded flex items-center gap-2 shadow-sm transition-all">
                <span class="material-symbols-outlined text-[20px]">view_kanban</span>
                عرض اللوحة
            </a>
            <a href="{{ route('admin.complaints.forms.index') }}" class="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-5 rounded flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
                <span class="material-symbols-outlined text-[20px]">post_add</span>
                إدارة النماذج
            </a>
        </div>
    </div>
    
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <a href="{{ route('admin.complaints.index') }}" class="bg-surface-light dark:bg-surface-dark p-5 rounded border border-slate-200 dark:border-slate-700 shadow-sm hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer block">
            <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">إجمالي الشكاوى</p>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ number_format($complaints->total()) }}</h3>
        </a>
        <a href="{{ route('admin.complaints.index', ['status' => 'new']) }}" class="bg-surface-light dark:bg-surface-dark p-5 rounded border-r-4 border-amber-500 shadow-sm hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer block">
            <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">جديدة</p>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ \App\Models\Complaint::where('status', 'new')->count() }}</h3>
        </a>
        <a href="{{ route('admin.complaints.index', ['status' => 'processing']) }}" class="bg-surface-light dark:bg-surface-dark p-5 rounded border border-slate-200 dark:border-slate-700 shadow-sm hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer block">
            <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">قيد المعالجة</p>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ \App\Models\Complaint::where('status', 'processing')->count() }}</h3>
        </a>
        <a href="{{ route('admin.complaints.index', ['status' => 'resolved']) }}" class="bg-surface-light dark:bg-surface-dark p-5 rounded border border-slate-200 dark:border-slate-700 shadow-sm hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer block">
            <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">تم حلها</p>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ \App\Models\Complaint::where('status', 'resolved')->count() }}</h3>
        </a>
    </div>
    
    <!-- Data Table -->
    <div class="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-right border-collapse">
                <thead>
                    <tr class="bg-primary text-white border-b border-primary-dark">
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">رقم التتبع</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">المواطن</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">المديرية</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">الحالة</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">الأولوية</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">تاريخ الورود</th>
                        <th class="p-4 w-24 text-center text-xs font-bold uppercase tracking-wider text-white/90">إجراءات</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                    @forelse($complaints as $complaint)
                    <tr class="group hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                        <td class="p-4">
                            <span class="text-sm font-mono font-bold text-primary">#{{ $complaint->tracking_number ?? $complaint->id }}</span>
                        </td>
                        <td class="p-4">
                            <div class="flex flex-col">
                                <span class="text-sm font-bold text-slate-900 dark:text-white">{{ $complaint->citizen_name ?? 'مجهول' }}</span>
                                <span class="text-xs text-slate-500 dark:text-slate-400">{{ $complaint->citizen_email }}</span>
                            </div>
                        </td>
                        <td class="p-4">
                            <span class="text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded">
                                {{ $complaint->directorate->name ?? 'العامة' }}
                            </span>
                        </td>
                        <td class="p-4">
                            @php
                                $statusColors = [
                                    'new' => 'bg-blue-100 text-blue-700 border-blue-200',
                                    'pending' => 'bg-amber-100 text-amber-700 border-amber-200',
                                    'processing' => 'bg-primary/10 text-primary border-primary/20',
                                    'resolved' => 'bg-green-100 text-green-700 border-green-200',
                                    'rejected' => 'bg-slate-100 text-slate-600 border-slate-200',
                                ];
                                $statusLabels = [
                                    'new' => 'جديدة',
                                    'pending' => 'قيد الانتظار',
                                    'processing' => 'قيد المعالجة',
                                    'resolved' => 'محلولة',
                                    'rejected' => 'مرفوضة',
                                ];
                            @endphp
                            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border {{ $statusColors[$complaint->status] ?? 'bg-slate-100 text-slate-600' }}">
                                {{ $statusLabels[$complaint->status] ?? ucfirst($complaint->status) }}
                            </span>
                        </td>
                        <td class="p-4">
                            @if($complaint->priority === 'high' || $complaint->priority === 'urgent')
                                <span class="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                                    {{ $complaint->priority === 'urgent' ? 'عاجلة' : 'مرتفعة' }}
                                </span>
                            @else
                                <span class="text-xs text-slate-500">عادية</span>
                            @endif
                        </td>
                        <td class="p-4 text-sm text-slate-500 dark:text-slate-400">
                            {{ $complaint->created_at->locale('ar')->isoFormat('D MMM Y') }}
                        </td>
                        <td class="p-4 text-center">
                            <a href="{{ route('admin.complaints.show', $complaint) }}" class="size-8 flex items-center justify-center rounded text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <span class="material-symbols-outlined text-[20px]">visibility</span>
                            </a>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="7" class="p-8 text-center text-slate-500">لا يوجد شكاوى للعرض.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        
        <!-- Pagination -->
        <div class="p-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <span class="text-sm text-slate-500 dark:text-slate-400">
                عرض {{ $complaints->firstItem() ?? 0 }}-{{ $complaints->lastItem() ?? 0 }} من أصل {{ $complaints->total() }} سجل
            </span>
            <div class="flex gap-2 dir-ltr">
                {{ $complaints->links('pagination::simple-tailwind') }}
            </div>
        </div>
    </div>
</div>
@endsection
