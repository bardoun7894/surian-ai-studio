@extends('admin.layouts.app')

@section('title', 'الاستثمارات - وزارة الاقتصاد')

@section('content')
<div class="max-w-[1200px] mx-auto w-full">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 mb-6">
        <a class="text-primary/70 hover:text-primary text-sm font-medium flex items-center" href="{{ route('admin.dashboard') }}">
            <span class="material-symbols-outlined text-sm ml-1 rtl-flip">home</span> الرئيسية
        </a>
        <span class="text-slate-400 text-sm">/</span>
        <span class="text-slate-900 dark:text-white text-sm font-semibold">الاستثمارات</span>
    </div>

    <!-- Page Heading -->
    <div class="flex flex-wrap justify-between items-end gap-6 mb-8">
        <div class="flex flex-col gap-2">
            <h1 class="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">إدارة الاستثمارات</h1>
            <p class="text-slate-500 dark:text-slate-400 text-base font-normal max-w-xl">إدارة الفرص الاستثمارية المتاحة</p>
        </div>
        <a href="{{ route('admin.investments.create') }}" class="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
            <span class="material-symbols-outlined">add_circle</span>
            <span>إضافة فرصة استثمارية</span>
        </a>
    </div>

    <!-- Stats Cards -->
    @php
        $totalInvestments = $investments->total();
        $activeCount = \App\Models\Investment::where('status', 'available')->where('is_active', true)->count();
        $featuredCount = \App\Models\Investment::where('is_featured', true)->count();
    @endphp
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
            <div class="absolute -left-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform text-primary">
                <span class="material-symbols-outlined text-8xl">trending_up</span>
            </div>
            <p class="text-xs font-bold text-primary uppercase tracking-widest mb-1">إجمالي الفرص</p>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-4">{{ $totalInvestments }} فرصة استثمارية</h3>
            <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mb-4">
                <div class="bg-primary h-2 rounded-full" style="width: {{ $totalInvestments > 0 ? 100 : 0 }}%"></div>
            </div>
            <span class="text-sm font-bold text-primary flex items-center gap-1">
                جميع الفرص المسجلة
            </span>
        </div>

        <div class="bg-primary text-white p-6 rounded-2xl shadow-xl shadow-primary/10 relative overflow-hidden group">
            <div class="absolute -left-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-8xl">check_circle</span>
            </div>
            <p class="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">فرص نشطة</p>
            <h3 class="text-2xl font-black text-white mb-4">{{ $activeCount }} فرصة متاحة</h3>
            <div class="flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-green-300">verified</span>
                <span class="text-sm font-medium">جاهزة للمستثمرين</span>
            </div>
            <a class="text-sm font-bold text-white flex items-center gap-1 bg-white/20 w-fit px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors" href="{{ route('admin.investments.index', ['status' => 'available']) }}">
                عرض النشطة <span class="material-symbols-outlined text-sm">open_in_new</span>
            </a>
        </div>

        <div class="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
            <div class="absolute -left-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform text-primary">
                <span class="material-symbols-outlined text-8xl">star</span>
            </div>
            <p class="text-xs font-bold text-primary uppercase tracking-widest mb-1">فرص مميزة</p>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-4">{{ $featuredCount }} فرصة مميزة</h3>
            <div class="flex items-center gap-4">
                <div class="flex flex-col">
                    <span class="text-xs text-slate-400">تظهر بشكل بارز</span>
                    <span class="text-sm font-bold text-slate-700 dark:text-slate-300">في الصفحة الرئيسية</span>
                </div>
            </div>
            <a class="text-sm font-bold text-primary flex items-center gap-1 mt-4" href="{{ route('admin.investments.index', ['featured' => '1']) }}">
                عرض المميزة <span class="material-symbols-outlined text-sm">star</span>
            </a>
        </div>
    </div>

    <!-- Filter & Search Section -->
    <div class="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
        <div class="flex flex-col lg:flex-row border-b border-slate-200 dark:border-slate-800">
            <!-- Tabs -->
            <div class="flex px-6 overflow-x-auto">
                <a class="flex items-center justify-center border-b-2 {{ !request('status') ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200' }} px-6 py-5 transition-all font-bold text-sm whitespace-nowrap" href="{{ route('admin.investments.index') }}">
                    الكل <span class="mr-2 px-1.5 py-0.5 {{ !request('status') ? 'bg-primary/20' : 'bg-slate-100 dark:bg-slate-800' }} rounded text-[10px]">{{ \App\Models\Investment::count() }}</span>
                </a>
                <a class="flex items-center justify-center border-b-2 {{ request('status') == 'available' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200' }} px-6 py-5 transition-all font-bold text-sm whitespace-nowrap" href="{{ route('admin.investments.index', ['status' => 'available']) }}">
                    متاحة <span class="mr-2 px-1.5 py-0.5 {{ request('status') == 'available' ? 'bg-primary/20' : 'bg-slate-100 dark:bg-slate-800' }} rounded text-[10px]">{{ \App\Models\Investment::where('status', 'available')->count() }}</span>
                </a>
                <a class="flex items-center justify-center border-b-2 {{ request('status') == 'under_review' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200' }} px-6 py-5 transition-all font-bold text-sm whitespace-nowrap" href="{{ route('admin.investments.index', ['status' => 'under_review']) }}">
                    قيد المراجعة <span class="mr-2 px-1.5 py-0.5 {{ request('status') == 'under_review' ? 'bg-primary/20' : 'bg-slate-100 dark:bg-slate-800' }} rounded text-[10px]">{{ \App\Models\Investment::where('status', 'under_review')->count() }}</span>
                </a>
                <a class="flex items-center justify-center border-b-2 {{ request('status') == 'closed' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200' }} px-6 py-5 transition-all font-bold text-sm whitespace-nowrap" href="{{ route('admin.investments.index', ['status' => 'closed']) }}">
                    مغلقة <span class="mr-2 px-1.5 py-0.5 {{ request('status') == 'closed' ? 'bg-primary/20' : 'bg-slate-100 dark:bg-slate-800' }} rounded text-[10px]">{{ \App\Models\Investment::where('status', 'closed')->count() }}</span>
                </a>
            </div>
        </div>

        <!-- Search & Filters -->
        <form action="{{ route('admin.investments.index') }}" method="GET" class="p-6 flex flex-wrap gap-4 items-center">
            @if(request('status'))
                <input type="hidden" name="status" value="{{ request('status') }}">
            @endif
            <div class="flex-1 min-w-[300px]">
                <label class="relative block">
                    <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                        <span class="material-symbols-outlined">search</span>
                    </span>
                    <input name="search" value="{{ request('search') }}" class="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 pr-12 pl-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-500" placeholder="بحث بالعنوان، القطاع، أو الموقع..." type="text"/>
                </label>
            </div>
            <button type="submit" class="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                <span class="material-symbols-outlined text-sm">search</span>
                بحث
            </button>
            @if(request()->anyFilled(['search']))
                <a href="{{ route('admin.investments.index', ['status' => request('status')]) }}" class="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">
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
                        <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">القطاع</th>
                        <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">المبلغ</th>
                        <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الحالة</th>
                        <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">مميز</th>
                        <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left">إجراءات</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                    @forelse($investments as $investment)
                    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td class="px-6 py-5">
                            <div class="flex flex-col">
                                <span class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors max-w-sm truncate" title="{{ $investment->title_ar }}">{{ $investment->title_ar }}</span>
                                <span class="text-xs text-slate-400 font-sans truncate max-w-sm">{{ $investment->title_en }}</span>
                            </div>
                        </td>
                        <td class="px-6 py-5">
                            <span class="text-sm text-slate-600 dark:text-slate-400">{{ $investment->sector_ar }}</span>
                        </td>
                        <td class="px-6 py-5">
                            <span class="text-sm font-semibold text-slate-900 dark:text-white">{{ $investment->formatted_amount }}</span>
                        </td>
                        <td class="px-6 py-5">
                            @if($investment->status === 'available')
                                <div class="flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-green-500"></span>
                                    <span class="text-sm text-slate-700 dark:text-slate-300 font-medium">متاحة</span>
                                </div>
                            @elseif($investment->status === 'under_review')
                                <div class="flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                                    <span class="text-sm text-slate-700 dark:text-slate-300 font-medium">قيد المراجعة</span>
                                </div>
                            @elseif($investment->status === 'closed')
                                <div class="flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-red-500"></span>
                                    <span class="text-sm text-slate-700 dark:text-slate-300 font-medium">مغلقة</span>
                                </div>
                            @endif
                        </td>
                        <td class="px-6 py-5">
                            @if($investment->is_featured)
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                    <span class="material-symbols-outlined text-[14px] ml-1">star</span>
                                    مميز
                                </span>
                            @else
                                <span class="text-xs text-slate-400">-</span>
                            @endif
                        </td>
                        <td class="px-6 py-5 text-left">
                            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a href="{{ route('admin.investments.edit', $investment) }}" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-amber-600 transition-colors" title="تعديل">
                                    <span class="material-symbols-outlined text-[20px]">edit</span>
                                </a>
                                <form action="{{ route('admin.investments.destroy', $investment) }}" method="POST" onsubmit="return confirm('هل أنت متأكد من حذف هذه الفرصة الاستثمارية؟');">
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
                        <td colspan="6" class="px-6 py-12 text-center text-slate-500">لم يتم العثور على فرص استثمارية.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="p-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <span class="text-sm text-slate-500 dark:text-slate-400">
                عرض {{ $investments->firstItem() ?? 0 }}-{{ $investments->lastItem() ?? 0 }} من أصل {{ $investments->total() }} سجل
            </span>
            <div class="flex gap-2 dir-ltr">
                {{ $investments->links('pagination::simple-tailwind') }}
            </div>
        </div>
    </div>
</div>
@endsection
