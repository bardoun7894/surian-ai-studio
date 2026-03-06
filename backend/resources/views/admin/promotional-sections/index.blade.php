@extends('admin.layouts.app')

@section('title', 'الأقسام الترويجية - وزارة الاقتصاد')

@section('content')
<div class="max-w-[1200px] mx-auto w-full">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 mb-6">
        <a class="text-primary/70 hover:text-primary text-sm font-medium flex items-center" href="{{ route('admin.dashboard') }}">
            <span class="material-symbols-outlined text-sm ml-1 rtl-flip">home</span> الرئيسية
        </a>
        <span class="text-slate-400 text-sm">/</span>
        <span class="text-slate-900 dark:text-white text-sm font-semibold">الأقسام الترويجية</span>
    </div>

    <!-- Page Heading -->
    <div class="flex flex-wrap justify-between items-end gap-6 mb-8">
        <div class="flex flex-col gap-2">
            <h1 class="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">إدارة الأقسام الترويجية</h1>
            <p class="text-slate-500 dark:text-slate-400 text-base font-normal max-w-xl">إدارة البانرات والأقسام الترويجية للموقع</p>
        </div>
        <a href="{{ route('admin.promotional.create') }}" class="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
            <span class="material-symbols-outlined">add_circle</span>
            <span>إضافة قسم ترويجي</span>
        </a>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div class="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
            <div class="absolute -left-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform text-primary">
                <span class="material-symbols-outlined text-8xl">view_carousel</span>
            </div>
            <p class="text-xs font-bold text-primary uppercase tracking-widest mb-1">إجمالي الأقسام</p>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white">{{ $sections->total() }} قسم</h3>
        </div>

        <div class="bg-primary text-white p-6 rounded-2xl shadow-xl shadow-primary/10 relative overflow-hidden group">
            <div class="absolute -left-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-8xl">check_circle</span>
            </div>
            <p class="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">أقسام نشطة</p>
            <h3 class="text-2xl font-black text-white">{{ $sections->where('is_active', true)->count() }} قسم نشط</h3>
        </div>
    </div>

    <!-- Filter & Search Section -->
    <div class="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
        <!-- Search & Filters -->
        <form action="{{ route('admin.promotional.index') }}" method="GET" class="p-6 flex flex-wrap gap-4 items-center border-b border-slate-200 dark:border-slate-800">
            <div class="flex-1 min-w-[300px]">
                <label class="relative block">
                    <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                        <span class="material-symbols-outlined">search</span>
                    </span>
                    <input name="search" value="{{ request('search') }}" class="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 pr-12 pl-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-500" placeholder="بحث بالعنوان..." type="text"/>
                </label>
            </div>
            <select name="type" onchange="this.form.submit()" class="px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <option value="">كل الأنواع</option>
                <option value="banner" {{ request('type') == 'banner' ? 'selected' : '' }}>بانر</option>
                <option value="video" {{ request('type') == 'video' ? 'selected' : '' }}>فيديو</option>
                <option value="promo" {{ request('type') == 'promo' ? 'selected' : '' }}>ترويجي</option>
                <option value="stats" {{ request('type') == 'stats' ? 'selected' : '' }}>إحصائيات</option>
            </select>
            <button type="submit" class="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                <span class="material-symbols-outlined text-sm">search</span>
                بحث
            </button>
            @if(request()->anyFilled(['search', 'type']))
                <a href="{{ route('admin.promotional.index') }}" class="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">
                    <span class="material-symbols-outlined text-sm">close</span>
                    إلغاء
                </a>
            @endif
        </form>

        <!-- Data Table -->
        <div class="overflow-x-auto">
            <table class="w-full text-right border-collapse">
                <thead>
                    <tr class="bg-slate-50 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-800">
                        <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">العنوان</th>
                        <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">النوع</th>
                        <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الموقع</th>
                        <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الحالة</th>
                        <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الترتيب</th>
                        <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left">إجراءات</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                    @forelse($sections as $section)
                    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td class="px-6 py-5">
                            <div class="flex flex-col">
                                <span class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors max-w-sm truncate" title="{{ $section->title_ar }}">{{ $section->title_ar }}</span>
                                @if($section->title_en)
                                    <span class="text-xs text-slate-400 font-sans truncate max-w-sm">{{ $section->title_en }}</span>
                                @endif
                            </div>
                        </td>
                        <td class="px-6 py-5">
                            @switch($section->type)
                                @case('banner')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">بانر</span>
                                    @break
                                @case('video')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">فيديو</span>
                                    @break
                                @case('promo')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">ترويجي</span>
                                    @break
                                @case('stats')
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">إحصائيات</span>
                                    @break
                                @default
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">{{ $section->type }}</span>
                            @endswitch
                        </td>
                        <td class="px-6 py-5">
                            <span class="text-sm text-slate-600 dark:text-slate-400">
                                @switch($section->position)
                                    @case('hero') الرئيسي @break
                                    @case('grid_main') الشبكة الرئيسية @break
                                    @case('grid_side') الشبكة الجانبية @break
                                    @case('grid_bottom') أسفل الشبكة @break
                                    @default {{ $section->position }}
                                @endswitch
                            </span>
                        </td>
                        <td class="px-6 py-5">
                            @if($section->is_active)
                                <div class="flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-green-500"></span>
                                    <span class="text-sm text-slate-700 dark:text-slate-300 font-medium">نشط</span>
                                </div>
                            @else
                                <div class="flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-slate-400"></span>
                                    <span class="text-sm text-slate-700 dark:text-slate-300 font-medium">غير نشط</span>
                                </div>
                            @endif
                        </td>
                        <td class="px-6 py-5">
                            <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200">
                                {{ $section->display_order }}
                            </span>
                        </td>
                        <td class="px-6 py-5 text-left">
                            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a href="{{ route('admin.promotional.edit', $section) }}" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-amber-600 transition-colors" title="تعديل">
                                    <span class="material-symbols-outlined text-[20px]">edit</span>
                                </a>
                                <form action="{{ route('admin.promotional.destroy', $section) }}" method="POST" onsubmit="return confirm('هل أنت متأكد من حذف هذا القسم الترويجي؟');">
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
                        <td colspan="6" class="px-6 py-12 text-center">
                            <div class="flex flex-col items-center justify-center text-slate-400">
                                <span class="material-symbols-outlined text-5xl mb-3 opacity-20">view_carousel</span>
                                <p class="text-lg font-medium">لا توجد أقسام ترويجية مضافة بعد</p>
                                <a href="{{ route('admin.promotional.create') }}" class="mt-4 text-primary font-bold hover:underline">إضافة أول قسم ترويجي</a>
                            </div>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        @if($sections->hasPages())
            <div class="p-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                <span class="text-sm text-slate-500 dark:text-slate-400">
                    عرض {{ $sections->firstItem() ?? 0 }}-{{ $sections->lastItem() ?? 0 }} من أصل {{ $sections->total() }} سجل
                </span>
                <div class="flex gap-2 dir-ltr">
                    {{ $sections->links('pagination::simple-tailwind') }}
                </div>
            </div>
        @endif
    </div>
</div>
@endsection
