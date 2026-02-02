@extends('admin.layouts.app')

@section('title', 'قوالب الشكاوى - وزارة الاقتصاد')

@section('content')
<div class="mx-auto max-w-7xl">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <a href="{{ route('admin.dashboard') }}" class="hover:text-primary transition-colors">الرئيسية</a>
        <span class="material-symbols-outlined text-[16px] rtl-flip">chevron_left</span>
        <span class="text-slate-900 dark:text-white font-medium">قوالب الشكاوى</span>
    </nav>

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">إدارة قوالب الشكاوى</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">إدارة القوالب المستخدمة في نماذج الشكاوى</p>
        </div>
        <a href="{{ route('admin.complaint-templates.create') }}" class="button bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
            <span class="material-symbols-outlined text-[20px]">add</span>
            إضافة قالب
        </a>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-right">
                <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                    <tr>
                        <th class="px-6 py-4">الاسم</th>
                        <th class="px-6 py-4">المديرية</th>
                        <th class="px-6 py-4">النوع</th>
                        <th class="px-6 py-4">تحقق الهوية</th>
                        <th class="px-6 py-4">الحالة</th>
                        <th class="px-6 py-4 text-center">إجراءات</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border-light dark:divide-border-dark">
                    @forelse($templates as $template)
                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <td class="px-6 py-4">
                                <p class="font-bold text-slate-900 dark:text-white">{{ $template->name }}</p>
                            </td>
                            <td class="px-6 py-4">
                                @if($template->directorate)
                                    <span class="text-slate-600 dark:text-slate-300">{{ $template->directorate->name_ar }}</span>
                                @else
                                    <span class="text-slate-400">-</span>
                                @endif
                            </td>
                            <td class="px-6 py-4">
                                <span class="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10">{{ $template->type }}</span>
                            </td>
                            <td class="px-6 py-4">
                                @if($template->requires_identification)
                                    <span class="inline-flex items-center gap-1 rounded-md bg-amber-50 dark:bg-amber-900/30 px-2 py-1 text-xs font-medium text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-600/20">
                                        <span class="material-symbols-outlined text-[14px]">verified_user</span>
                                        مطلوب
                                    </span>
                                @else
                                    <span class="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 ring-1 ring-inset ring-slate-500/10">غير مطلوب</span>
                                @endif
                            </td>
                            <td class="px-6 py-4">
                                @if($template->is_active)
                                    <span class="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">مفعّل</span>
                                @else
                                    <span class="inline-flex items-center rounded-md bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 text-xs font-medium text-yellow-800 dark:text-yellow-400 ring-1 ring-inset ring-yellow-600/20">معطّل</span>
                                @endif
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a href="{{ route('admin.complaint-templates.edit', $template) }}" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-amber-600 transition-colors" title="تعديل">
                                        <span class="material-symbols-outlined text-[20px]">edit</span>
                                    </a>

                                    <form action="{{ route('admin.complaint-templates.destroy', $template) }}" method="POST" onsubmit="return confirm('هل أنت متأكد من حذف هذا القالب؟');">
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
                                    <span class="material-symbols-outlined text-5xl mb-3 opacity-20">description</span>
                                    <p class="text-lg font-medium">لا توجد قوالب شكاوى مضافة بعد</p>
                                    <a href="{{ route('admin.complaint-templates.create') }}" class="mt-4 text-primary font-bold hover:underline">إضافة قالب جديد</a>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if($templates->hasPages())
            <div class="border-t border-border-light dark:border-border-dark p-4">
                {{ $templates->links() }}
            </div>
        @endif
    </div>
</div>
@endsection
