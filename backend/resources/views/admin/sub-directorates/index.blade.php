@extends('admin.layouts.app')

@section('title', 'الإدارات الفرعية - وزارة الاقتصاد')

@section('content')
<div class="mx-auto max-w-7xl">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <a href="{{ route('admin.dashboard') }}" class="hover:text-primary transition-colors">الرئيسية</a>
        <span class="material-symbols-outlined text-[16px] rtl-flip">chevron_left</span>
        <span class="text-slate-900 dark:text-white font-medium">الإدارات الفرعية</span>
    </nav>

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">إدارة الإدارات الفرعية</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">إدارة الإدارات الفرعية التابعة للمديريات.</p>
        </div>
        <a href="{{ route('admin.sub-directorates.create') }}" class="bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
            <span class="material-symbols-outlined text-[20px]">add</span>
            إضافة إدارة فرعية
        </a>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-6">
        <div class="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm p-5 flex items-center gap-4">
            <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <span class="material-symbols-outlined text-primary text-[28px]">account_tree</span>
            </div>
            <div>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ $subDirectorates->total() }}</p>
                <p class="text-sm text-slate-500 dark:text-slate-400">إجمالي الإدارات</p>
            </div>
        </div>
    </div>

    <!-- Search & Filter -->
    <div class="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm p-4 mb-6">
        <form method="GET" action="{{ route('admin.sub-directorates.index') }}" class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1">
                <input type="text" name="search" value="{{ request('search') }}" placeholder="بحث بالاسم..."
                    class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400 text-sm">
            </div>
            <div class="w-full sm:w-56">
                <select name="directorate_id" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                    <option value="">جميع المديريات</option>
                    @foreach($directorates as $directorate)
                        <option value="{{ $directorate->id }}" {{ request('directorate_id') == $directorate->id ? 'selected' : '' }}>{{ $directorate->name_ar }}</option>
                    @endforeach
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
                        <th class="px-6 py-4">الاسم</th>
                        <th class="px-6 py-4">المديرية الأم</th>
                        <th class="px-6 py-4">الرابط</th>
                        <th class="px-6 py-4 text-center">خارجي</th>
                        <th class="px-6 py-4 text-center">الحالة</th>
                        <th class="px-6 py-4 text-center">الترتيب</th>
                        <th class="px-6 py-4 text-center">إجراءات</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border-light dark:divide-border-dark">
                    @forelse($subDirectorates as $subDirectorate)
                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <td class="px-6 py-4">
                                <span class="font-bold text-slate-900 dark:text-white">{{ $subDirectorate->name_ar }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="text-slate-600 dark:text-slate-300">{{ $subDirectorate->directorate->name_ar ?? '-' }}</span>
                            </td>
                            <td class="px-6 py-4">
                                @if($subDirectorate->url)
                                    <a href="{{ $subDirectorate->url }}" target="_blank" class="text-primary hover:underline text-xs truncate max-w-[200px] block" dir="ltr">{{ Str::limit($subDirectorate->url, 40) }}</a>
                                @else
                                    <span class="text-slate-400 text-xs italic">لا يوجد</span>
                                @endif
                            </td>
                            <td class="px-6 py-4 text-center">
                                @if($subDirectorate->is_external)
                                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">خارجي</span>
                                @else
                                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">داخلي</span>
                                @endif
                            </td>
                            <td class="px-6 py-4 text-center">
                                @if($subDirectorate->is_active)
                                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">مفعّل</span>
                                @else
                                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">معطّل</span>
                                @endif
                            </td>
                            <td class="px-6 py-4 text-center">
                                <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200">
                                    {{ $subDirectorate->order }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a href="{{ route('admin.sub-directorates.edit', $subDirectorate) }}" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-amber-600 transition-colors" title="تعديل">
                                        <span class="material-symbols-outlined text-[20px]">edit</span>
                                    </a>
                                    <form action="{{ route('admin.sub-directorates.destroy', $subDirectorate) }}" method="POST" onsubmit="return confirm('هل أنت متأكد من حذف هذه الإدارة الفرعية؟');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 text-slate-500 transition-colors" title="حذف">
                                            <span class="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="px-6 py-12 text-center">
                                <div class="flex flex-col items-center justify-center text-slate-400">
                                    <span class="material-symbols-outlined text-5xl mb-3 opacity-20">account_tree</span>
                                    <p class="text-lg font-medium">لا توجد إدارات فرعية مضافة بعد</p>
                                    <a href="{{ route('admin.sub-directorates.create') }}" class="mt-4 text-primary font-bold hover:underline">إضافة أول إدارة فرعية</a>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if($subDirectorates->hasPages())
            <div class="border-t border-border-light dark:border-border-dark p-4">
                {{ $subDirectorates->withQueryString()->links() }}
            </div>
        @endif
    </div>
</div>
@endsection
