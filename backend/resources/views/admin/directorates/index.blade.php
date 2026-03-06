@extends('admin.layouts.app')

@section('title', 'إدارة المديريات')

@section('content')
<div class="mx-auto max-w-7xl">
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">المديريات والجهات</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">إدارة الهيكل التنظيمي والمديريات التابعة للوزارة.</p>
        </div>
        <a href="{{ route('admin.directorates.create') }}" class="button bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
            <span class="material-symbols-outlined text-[20px]">add</span>
            إضافة مديرية
        </a>
    </div>

    <div class="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-right">
                <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                    <tr>
                        <th class="px-6 py-4">اسم المديرية</th>
                        <th class="px-6 py-4">معلومات الاتصال</th>
                        <th class="px-6 py-4 text-center">الموظفين</th>
                        <th class="px-6 py-4 text-center">الشكاوى</th>
                        <th class="px-6 py-4 text-center">الإجراءات</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border-light dark:divide-border-dark">
                    @forelse($directorates as $directorate)
                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div class="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                        {{ substr($directorate->name, 0, 1) }}
                                    </div>
                                    <div>
                                        <p class="font-bold text-slate-900 dark:text-white">{{ $directorate->name }}</p>
                                        <p class="text-xs text-slate-500 truncate max-w-[200px]">{{ $directorate->description }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col gap-1 text-slate-600 dark:text-slate-300">
                                    @if($directorate->email)
                                        <div class="flex items-center gap-1.5 text-xs">
                                            <span class="material-symbols-outlined text-[14px] text-slate-400">mail</span>
                                            {{ $directorate->email }}
                                        </div>
                                    @endif
                                    @if($directorate->phone)
                                        <div class="flex items-center gap-1.5 text-xs">
                                            <span class="material-symbols-outlined text-[14px] text-slate-400">call</span>
                                            <span dir="ltr">{{ $directorate->phone }}</span>
                                        </div>
                                    @endif
                                    @if(!$directorate->email && !$directorate->phone)
                                        <span class="text-xs text-slate-400 italic">لا توجد معلومات</span>
                                    @endif
                                </div>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200">
                                    {{ $directorate->users_count }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                                    {{ $directorate->complaints_count }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a href="{{ route('admin.directorates.edit', $directorate) }}" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-amber-600 transition-colors" title="تعديل">
                                        <span class="material-symbols-outlined text-[20px]">edit</span>
                                    </a>
                                    
                                    @if($directorate->users_count == 0 && $directorate->complaints_count == 0)
                                        <form action="{{ route('admin.directorates.destroy', $directorate) }}" method="POST" onsubmit="return confirm('هل أنت متأكد من حذف هذه المديرية؟');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="p-1.5 rounded hover:bg-red-50 hover:text-red-600 text-slate-500 transition-colors" title="حذف">
                                                <span class="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </form>
                                    @endif
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-12 text-center">
                                <div class="flex flex-col items-center justify-center text-slate-400">
                                    <span class="material-symbols-outlined text-5xl mb-3 opacity-20">domain_disabled</span>
                                    <p class="text-lg font-medium">لا توجد مديريات مضافة بعد</p>
                                    <a href="{{ route('admin.directorates.create') }}" class="mt-4 text-primary font-bold hover:underline">إضافة أول مديرية</a>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        
        @if($directorates->hasPages())
            <div class="border-t border-border-light dark:border-border-dark p-4">
                {{ $directorates->links() }}
            </div>
        @endif
    </div>
</div>
@endsection
