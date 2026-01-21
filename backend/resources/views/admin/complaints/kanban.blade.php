@extends('admin.layouts.app')

@section('title', 'لوحة متابعة الشكاوى - وزارة الاقتصاد')

@section('content')
<div class="flex flex-col h-full overflow-hidden">
    <!-- Header -->
    <div class="px-2 pt-2 pb-4">
        <div class="flex flex-col gap-1 mb-6">
            <div class="flex items-center gap-2 text-primary mb-1">
                <span class="text-xs font-bold tracking-[0.2em] uppercase">سير العمل</span>
            </div>
            <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">لوحة متابعة الشكاوى</h2>
        </div>
        <!-- Filters -->
        <div class="flex flex-wrap items-center gap-3 p-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-xl w-fit border border-slate-200 dark:border-slate-800">
            <button class="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white">
                <span class="material-symbols-outlined text-lg">category</span>
                كل المديريات
                <span class="material-symbols-outlined text-lg">expand_more</span>
            </button>
            <button class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-sm font-semibold text-slate-500 dark:text-slate-400 transition-all">
                <span class="material-symbols-outlined text-lg text-primary">health_and_safety</span>
                الصحة والسلامة
            </button>
            <div class="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>
            <button class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-primary hover:bg-primary/5 transition-all">
                <span class="material-symbols-outlined text-lg">tune</span>
                تصفية متقدمة
            </button>
        </div>
    </div>

    <!-- Kanban Board -->
    <div class="flex flex-1 gap-6 p-4 overflow-x-auto min-h-0 items-start custom-scrollbar">
        <!-- Defined Columns -->
        @php
            $columns = [
                'new' => ['title' => 'واردة حديثاً', 'color' => 'blue-500', 'bg' => 'bg-blue-500'],
                'pending' => ['title' => 'قيد الانتظار', 'color' => 'orange-400', 'bg' => 'bg-orange-400'],
                'processing' => ['title' => 'قيد المعالجة', 'color' => 'primary', 'bg' => 'bg-primary'],
                'resolved' => ['title' => 'تم الحل', 'color' => 'green-500', 'bg' => 'bg-green-500'],
                'rejected' => ['title' => 'مغلقة', 'color' => 'slate-400', 'bg' => 'bg-slate-400'],
            ];
        @endphp

        @foreach($columns as $status => $config)
            <div class="min-w-[320px] max-w-[320px] flex flex-col gap-4 h-full">
                <!-- Column Header -->
                <div class="flex items-center justify-between px-1">
                    <div class="flex items-center gap-2">
                        <span class="size-2 rounded-full {{ $config['bg'] }} shadow-[0_0_8px_rgba(0,0,0,0.2)]"></span>
                        <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">{{ $config['title'] }}</h3>
                        <span class="mr-2 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-xs font-black text-slate-600 dark:text-slate-400">
                            {{ isset($grouped[$status]) ? $grouped[$status]->count() : 0 }}
                        </span>
                    </div>
                </div>

                <!-- Cards Container -->
                <div class="flex flex-col gap-3 overflow-y-auto pl-2 pb-2 custom-scrollbar">
                    @forelse($grouped[$status] ?? [] as $complaint)
                        <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group border border-slate-200 dark:border-slate-700">
                            <div class="flex justify-between items-start mb-3">
                                <span class="text-[11px] font-black text-primary bg-primary/10 px-2 py-1 rounded">#{{ $complaint->tracking_number ?? $complaint->id }}</span>
                                @if($complaint->priority === 'high' || $complaint->priority === 'urgent')
                                    <span class="bg-yellow-100 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-200 flex items-center gap-1">
                                        <span class="material-symbols-outlined text-[12px]">warning</span>
                                        {{ $complaint->priority === 'urgent' ? 'عاجلة' : 'مرتفعة' }}
                                    </span>
                                @else
                                    <span class="bg-slate-100 dark:bg-slate-700 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">عادية</span>
                                @endif
                            </div>
                            <h4 class="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{{ $complaint->citizen_name ?? 'مجهول' }}</h4>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">{{ $complaint->description }}</p>
                            <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                                <div class="flex items-center gap-2">
                                    <span class="material-symbols-outlined text-xs text-slate-400">corporate_fare</span>
                                    <span class="text-[11px] font-semibold text-slate-500">{{ $complaint->directorate->name ?? 'العامة' }}</span>
                                </div>
                                <span class="text-[11px] text-slate-400 font-medium italic">{{ $complaint->created_at->locale('ar')->diffForHumans() }}</span>
                            </div>
                        </div>
                    @empty
                        <div class="p-4 text-center text-xs text-slate-400 italic border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                            لا يوجد شكاوى
                        </div>
                    @endforelse
                </div>
            </div>
        @endforeach
    </div>
</div>
@endsection
