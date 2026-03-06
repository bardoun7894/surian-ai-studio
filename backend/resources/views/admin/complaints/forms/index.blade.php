@extends('admin.layouts.app')

@section('title', 'بناء نماذج الشكاوى')

@section('content')
<div class="flex flex-col gap-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">نماذج الشكاوى (Form Builder)</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">تخصيص نماذج الشكاوى لكل مديرية.</p>
        </div>
        <a href="{{ route('admin.complaints.forms.create') }}" class="flex items-center gap-2 rounded bg-gov-emerald px-3 py-1.5 text-sm font-bold text-white hover:bg-gov-emeraldLight transition-colors shadow-sm">
            <span class="material-symbols-outlined text-[18px]">add_circle</span>
            إنشاء نموذج جديد
        </a>
    </div>

    <!-- Templates List -->
    <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <table class="w-full text-right">
            <thead class="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">اسم النموذج</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">المديرية</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">عدد الحقول</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الحالة</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الإجراءات</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                @forelse($templates as $template)
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">{{ $template->name }}</td>
                        <td class="px-6 py-4 text-slate-600 dark:text-slate-400">{{ $template->directorate->name ?? 'عام' }}</td>
                        <td class="px-6 py-4 text-slate-600 dark:text-slate-400">{{ count($template->fields ?? []) }}</td>
                        <td class="px-6 py-4">
                            <span class="px-2 py-1 rounded-full text-xs font-bold {{ $template->is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700' }}">
                                {{ $template->is_active ? 'نشط' : 'غير نشط' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 flex items-center gap-2">
                            <a href="{{ route('admin.complaints.forms.edit', $template) }}" class="p-1 rounded hover:bg-blue-50 text-blue-600 transition-colors">
                                <span class="material-symbols-outlined text-[20px]">edit</span>
                            </a>
                            <form action="{{ route('admin.complaints.forms.destroy', $template) }}" method="POST" onsubmit="return confirm('هل أنت متأكد من الحذف؟')">
                                @csrf @method('DELETE')
                                <button type="submit" class="p-1 rounded hover:bg-red-50 text-red-600 transition-colors">
                                    <span class="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center text-slate-500">لا توجد نماذج مخصصة حالياً.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
         <div class="px-6 py-4">
            {{ $templates->links() }}
        </div>
    </div>
</div>
@endsection
