@extends('admin.layouts.app')

@section('title', 'تحليلات الذكاء الاصطناعي')

@section('content')
<div class="flex flex-col gap-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">تحليلات المساعد الذكي</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">مراقبة أداء وتفاعلات المساعد الذكي مع المستخدمين.</p>
        </div>
        <button class="flex items-center gap-2 rounded bg-gov-emerald px-3 py-1.5 text-sm font-bold text-white hover:bg-gov-emeraldLight transition-colors shadow-sm">
            <span class="material-symbols-outlined text-[18px]">download</span>
            تصدير التقرير
        </button>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">إجمالي المحادثات</span>
            <h3 class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ number_format($stats['total_conversations']) }}</h3>
        </div>
        
        <div class="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">محادثات اليوم</span>
            <h3 class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ number_format($stats['today_conversations']) }}</h3>
        </div>

        <div class="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">متوسط الرسائل / محادثة</span>
            <h3 class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ number_format($stats['avg_messages_per_conversation'], 1) }}</h3>
        </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm min-h-[300px] flex items-center justify-center">
            <p class="text-slate-400 text-sm">مخطط تفاعل المستخدمين (قيد التطوير)</p>
        </div>
        <div class="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm min-h-[300px] flex items-center justify-center">
             <p class="text-slate-400 text-sm">مخطط الأسئلة الأكثر شيوعاً (قيد التطوير)</p>
        </div>
    </div>
</div>
@endsection
