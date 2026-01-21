@extends('admin.layouts.app')

@section('title', 'سجلات المساعد الذكي - وزارة الاقتصاد')

@section('content')
<div class="max-w-[1440px] mx-auto w-full h-full flex flex-col">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 mb-4 text-sm">
        <a class="text-gray-500 hover:text-primary transition-colors" href="{{ route('admin.dashboard') }}">الرئيسية</a>
        <span class="text-gray-400">/</span>
        <span class="text-primary font-semibold">المساعد الذكي</span>
    </div>

    <!-- Page Title & Actions -->
    <div class="flex flex-wrap justify-between items-end gap-4 mb-6">
        <div class="flex flex-col gap-1">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">سجلات المساعد الذكي</h1>
            <p class="text-gray-600 dark:text-gray-400">متابعة مقاييس الأداء وسجلات التفاعل مع المواطنين.</p>
        </div>
        <div class="flex gap-3">
            <button class="flex items-center gap-2 h-10 px-4 bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span class="material-symbols-outlined text-[20px]">settings</span>
                <span>الإعدادات</span>
            </button>
            <button class="flex items-center gap-2 h-10 px-4 bg-primary text-white text-sm font-bold rounded shadow-sm hover:bg-primary-dark transition-colors">
                <span class="material-symbols-outlined text-[20px]">download</span>
                <span>تصدير تقرير</span>
            </button>
        </div>
    </div>

    <!-- Analytics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Card 1 -->
        <div class="bg-white dark:bg-surface-dark p-5 rounded border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col gap-1 relative overflow-hidden group">
            <div class="absolute top-0 left-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span class="material-symbols-outlined text-6xl text-primary">timer</span>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">متوسط زمن الاستجابة</p>
            <div class="flex items-baseline gap-2 mt-1">
                <span class="text-3xl font-bold text-gray-900 dark:text-white">0.85 ثانية</span>
                <span class="text-emerald-600 text-sm font-medium bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded flex items-center">
                    <span class="material-symbols-outlined text-sm ml-0.5">trending_down</span> 12%
                </span>
            </div>
        </div>

        <!-- Card 2 -->
        <div class="bg-white dark:bg-surface-dark p-5 rounded border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col gap-1 relative overflow-hidden group">
            <div class="absolute top-0 left-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span class="material-symbols-outlined text-6xl text-secondary">star</span>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">مؤشر الرضا</p>
            <div class="flex items-baseline gap-2 mt-1">
                <span class="text-3xl font-bold text-gray-900 dark:text-white">4.8</span>
                <span class="text-gray-400 text-lg font-normal">/ 5.0</span>
            </div>
        </div>

        <!-- Card 3 -->
        <div class="bg-white dark:bg-surface-dark p-5 rounded border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col gap-1 relative overflow-hidden group">
            <div class="absolute top-0 left-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span class="material-symbols-outlined text-6xl text-primary">chat</span>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">استفسارات اليوم</p>
            <div class="flex items-baseline gap-2 mt-1">
                <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ number_format($stats['today_conversations'] ?? 0) }}</span>
                <span class="text-emerald-600 text-sm font-medium bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded flex items-center">
                    <span class="material-symbols-outlined text-sm ml-0.5">trending_up</span> 5%
                </span>
            </div>
        </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded shadow-sm flex flex-col flex-1 overflow-hidden">
        <div class="overflow-x-auto flex-1">
            <table class="w-full text-right text-sm border-collapse">
                <thead class="bg-gray-50 dark:bg-[#1a1f24] sticky top-0 z-10">
                    <tr>
                        <th class="px-6 py-3 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 whitespace-nowrap w-[140px]">الجلسة</th>
                        <th class="px-6 py-3 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 whitespace-nowrap w-[180px]">الوقت</th>
                        <th class="px-6 py-3 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">استفسار المستخدم</th>
                        <th class="px-6 py-3 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 w-[140px]">الحالة</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    @forelse($conversations as $conversation)
                        <tr class="group hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors cursor-pointer">
                            <td class="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">#{{ substr($conversation->session_id, 0, 8) }}</td>
                            <td class="px-6 py-4 text-gray-600 dark:text-gray-400">{{ $conversation->created_at->locale('ar')->format('D، h:i A') }}</td>
                            <td class="px-6 py-4 text-gray-900 dark:text-gray-200 font-medium max-w-[250px] truncate">
                                {{ $conversation->title ?? 'محادثة جديدة' }}
                            </td>
                            <td class="px-6 py-4">
                                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> نشط
                                </span>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="px-6 py-8 text-center text-gray-500">لا يوجد سجلات.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        
        <!-- Pagination -->
        <div class="bg-gray-50 dark:bg-[#1a1f24] px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span class="text-sm text-slate-500 dark:text-slate-400">
                عرض {{ $conversations->firstItem() ?? 0 }}-{{ $conversations->lastItem() ?? 0 }} من {{ $conversations->total() }}
            </span>
            <div class="flex gap-2 dir-ltr">
                {{ $conversations->links('pagination::simple-tailwind') }}
            </div>
        </div>
    </div>
</div>
@endsection
