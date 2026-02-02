@extends('admin.layouts.app')

@section('title', 'الروابط السريعة - وزارة الاقتصاد')

@section('content')
<div class="mx-auto max-w-7xl">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <a href="{{ route('admin.dashboard') }}" class="hover:text-primary transition-colors">الرئيسية</a>
        <span class="material-symbols-outlined text-[16px] rtl-flip">chevron_left</span>
        <span class="text-slate-900 dark:text-white font-medium">الروابط السريعة</span>
    </nav>

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">إدارة الروابط السريعة</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">إدارة الروابط السريعة المعروضة في الموقع</p>
        </div>
        <a href="{{ route('admin.quick-links.create') }}" class="button bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
            <span class="material-symbols-outlined text-[20px]">add</span>
            إضافة رابط
        </a>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm p-4 flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <span class="material-symbols-outlined text-primary text-[24px]">link</span>
            </div>
            <div>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ $links->total() }}</p>
                <p class="text-sm text-slate-500 dark:text-slate-400">إجمالي الروابط</p>
            </div>
        </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-right">
                <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                    <tr>
                        <th class="px-6 py-4">العنوان</th>
                        <th class="px-6 py-4">الرابط</th>
                        <th class="px-6 py-4">القسم</th>
                        <th class="px-6 py-4">الترتيب</th>
                        <th class="px-6 py-4">الحالة</th>
                        <th class="px-6 py-4 text-center">إجراءات</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border-light dark:divide-border-dark">
                    @forelse($links as $link)
                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <td class="px-6 py-4">
                                <p class="font-bold text-slate-900 dark:text-white">{{ $link->label_ar }}</p>
                            </td>
                            <td class="px-6 py-4">
                                <span class="text-slate-500 dark:text-slate-400 text-xs" dir="ltr" title="{{ $link->url }}">{{ Str::limit($link->url, 40) }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-500/10">{{ $link->section }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="text-slate-600 dark:text-slate-300 font-medium">{{ $link->display_order }}</span>
                            </td>
                            <td class="px-6 py-4">
                                @if($link->is_active)
                                    <span class="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">مفعّل</span>
                                @else
                                    <span class="inline-flex items-center rounded-md bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 text-xs font-medium text-yellow-800 dark:text-yellow-400 ring-1 ring-inset ring-yellow-600/20">معطّل</span>
                                @endif
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a href="{{ route('admin.quick-links.edit', $link) }}" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-amber-600 transition-colors" title="تعديل">
                                        <span class="material-symbols-outlined text-[20px]">edit</span>
                                    </a>

                                    <form action="{{ route('admin.quick-links.destroy', $link) }}" method="POST" onsubmit="return confirm('هل أنت متأكد من حذف هذا الرابط؟');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 text-slate-500 transition-colors" title="حذف">
                                            <span class="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-6 py-12 text-center">
                                <div class="flex flex-col items-center justify-center text-slate-400">
                                    <span class="material-symbols-outlined text-5xl mb-3 opacity-20">link</span>
                                    <p class="text-lg font-medium">لا توجد روابط سريعة مضافة بعد</p>
                                    <a href="{{ route('admin.quick-links.create') }}" class="mt-4 text-primary font-bold hover:underline">إضافة رابط جديد</a>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if($links->hasPages())
            <div class="border-t border-border-light dark:border-border-dark p-4">
                {{ $links->links() }}
            </div>
        @endif
    </div>
</div>
@endsection
