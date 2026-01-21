@extends('admin.layouts.app')

@section('title', 'إدارة الأسئلة الشائعة')

@section('content')
<div class="mx-auto max-w-7xl">
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">الأسئلة الشائعة (FAQs)</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">إدارة قاعدة المعرفة والردود الآلية للمساعد الذكي.</p>
        </div>
        <a href="{{ route('admin.faqs.create') }}" class="button bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
            <span class="material-symbols-outlined text-[20px]">add</span>
            إضافة سؤال
        </a>
    </div>

    <div class="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-right">
                <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                    <tr>
                        <th class="px-6 py-4">السؤال</th>
                        <th class="px-6 py-4">مصدر السؤال</th>
                        <th class="px-6 py-4">الحالة</th>
                        <th class="px-6 py-4 text-center">الإجراءات</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border-light dark:divide-border-dark">
                    @forelse($faqs as $faq)
                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <td class="px-6 py-4">
                                <p class="font-bold text-slate-900 dark:text-white line-clamp-1">{{ $faq->question_ar }}</p>
                                <p class="text-xs text-slate-500 line-clamp-2 mt-1">{{ strip_tags($faq->answer_ar) }}</p>
                            </td>
                            <td class="px-6 py-4">
                                @if($faq->suggested_by_ai)
                                    <span class="inline-flex items-center gap-1 rounded bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                                        <span class="material-symbols-outlined text-[14px]">smart_toy</span>
                                        مقترح AI
                                    </span>
                                @else
                                    <span class="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                                        يدوي
                                    </span>
                                @endif
                            </td>
                            <td class="px-6 py-4">
                                @if($faq->is_published)
                                    <span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">منشور</span>
                                @else
                                    <span class="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">مسودة</span>
                                @endif
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a href="{{ route('admin.faqs.edit', $faq) }}" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-amber-600 transition-colors" title="تعديل">
                                        <span class="material-symbols-outlined text-[20px]">edit</span>
                                    </a>
                                    
                                    <form action="{{ route('admin.faqs.destroy', $faq) }}" method="POST" onsubmit="return confirm('هل أنت متأكد من حذف هذا السؤال؟');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="p-1.5 rounded hover:bg-red-50 hover:text-red-600 text-slate-500 transition-colors" title="حذف">
                                            <span class="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="px-6 py-12 text-center">
                                <div class="flex flex-col items-center justify-center text-slate-400">
                                    <span class="material-symbols-outlined text-5xl mb-3 opacity-20">quiz</span>
                                    <p class="text-lg font-medium">لا توجد أسئلة شائعة مضافة بعد</p>
                                    <a href="{{ route('admin.faqs.create') }}" class="mt-4 text-primary font-bold hover:underline">إضافة سؤال جديد</a>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        
        @if($faqs->hasPages())
            <div class="border-t border-border-light dark:border-border-dark p-4">
                {{ $faqs->links() }}
            </div>
        @endif
    </div>
</div>
@endsection
