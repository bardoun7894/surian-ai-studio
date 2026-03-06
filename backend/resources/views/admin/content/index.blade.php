@extends('admin.layouts.app')

@section('title', 'إدارة المحتوى - وزارة الاقتصاد')

@section('content')
<div class="max-w-[1200px] mx-auto w-full">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 mb-6">
        <a class="text-primary/70 hover:text-primary text-sm font-medium flex items-center" href="{{ route('admin.dashboard') }}">
            <span class="material-symbols-outlined text-sm ml-1 rtl-flip">home</span> الرئيسية
        </a>
        <span class="text-slate-400 text-sm">/</span>
        <span class="text-slate-900 dark:text-white text-sm font-semibold">المحتوى</span>
    </div>
    
    <!-- Page Heading -->
    <div class="flex flex-wrap justify-between items-end gap-6 mb-8">
        <div class="flex flex-col gap-2">
            <h1 class="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">إدارة المحتوى</h1>
            <p class="text-slate-500 dark:text-slate-400 text-base font-normal max-w-xl">نظام مركزي لإدارة المنشورات والمراسيم والقوانين الحكومية.</p>
        </div>
        <a href="{{ route('admin.content.create') }}" class="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
            <span class="material-symbols-outlined">add_circle</span>
            <span>إضافة محتوى</span>
        </a>
    </div>
    
    <!-- Department Overview Cards -->
    @php
        $draftCount = \App\Models\Content::where('status', 'draft')->count();
        $totalDrafts = \App\Models\Content::count() ?: 1;
        $draftPercentage = round(($draftCount / $totalDrafts) * 100);

        $weeklyDecrees = \App\Models\Content::where('category', 'decree')
            ->where('status', 'published')
            ->where('created_at', '>=', now()->subWeek())
            ->count();
        $lastWeekDecrees = \App\Models\Content::where('category', 'decree')
            ->where('status', 'published')
            ->whereBetween('created_at', [now()->subWeeks(2), now()->subWeek()])
            ->count();
        $decreeChange = $lastWeekDecrees > 0 ? round((($weeklyDecrees - $lastWeekDecrees) / $lastWeekDecrees) * 100) : 0;

        $totalViews = \App\Models\Content::sum('view_count') ?? 0;
        $mostViewed = \App\Models\Content::orderBy('view_count', 'desc')->first();
    @endphp
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
            <div class="absolute -left-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform text-primary">
                <span class="material-symbols-outlined text-8xl">account_balance</span>
            </div>
            <p class="text-xs font-bold text-primary uppercase tracking-widest mb-1">الشؤون القانونية</p>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-4">{{ $draftCount }} محتوى قيد المراجعة</h3>
            <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mb-4">
                <div class="bg-primary h-2 rounded-full" style="width: {{ min($draftPercentage, 100) }}%"></div>
            </div>
            <a class="text-sm font-bold text-primary flex items-center gap-1" href="{{ route('admin.content.index', ['status' => 'draft']) }}">
                عرض طابور المراجعة <span class="material-symbols-outlined text-sm rtl-flip">arrow_back</span>
            </a>
        </div>

        <div class="bg-primary text-white p-6 rounded-2xl shadow-xl shadow-primary/10 relative overflow-hidden group">
            <div class="absolute -left-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-8xl">verified</span>
            </div>
            <p class="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">الملخص الأسبوعي</p>
            <h3 class="text-2xl font-black text-white mb-4">{{ $weeklyDecrees }} مرسوم رسمي</h3>
            <div class="flex items-center gap-2 mb-4">
                @if($decreeChange >= 0)
                    <span class="material-symbols-outlined text-green-300">trending_up</span>
                    <span class="text-sm font-medium">{{ $decreeChange }}% زيادة عن الأسبوع الماضي</span>
                @else
                    <span class="material-symbols-outlined text-red-300">trending_down</span>
                    <span class="text-sm font-medium">{{ abs($decreeChange) }}% انخفاض عن الأسبوع الماضي</span>
                @endif
            </div>
            <a class="text-sm font-bold text-white flex items-center gap-1 bg-white/20 w-fit px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors" href="{{ route('admin.reports.index') }}">
                عرض التقرير <span class="material-symbols-outlined text-sm">open_in_new</span>
            </a>
        </div>

        <div class="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
            <div class="absolute -left-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform text-primary">
                <span class="material-symbols-outlined text-8xl">rss_feed</span>
            </div>
            <p class="text-xs font-bold text-primary uppercase tracking-widest mb-1">المشاركة المجتمعية</p>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-4">{{ number_format($totalViews) }} قراءة إجمالية</h3>
            <div class="flex items-center gap-4">
                <div class="flex flex-col">
                    <span class="text-xs text-slate-400">الأكثر قراءة</span>
                    <span class="text-sm font-bold text-slate-700 dark:text-slate-300 truncate max-w-[180px]">{{ $mostViewed?->title_ar ?? 'لا يوجد محتوى' }}</span>
                </div>
            </div>
            <a class="text-sm font-bold text-primary flex items-center gap-1 mt-4" href="{{ route('admin.reports.index') }}">
                تحليلات تفصيلية <span class="material-symbols-outlined text-sm">analytics</span>
            </a>
        </div>
    </div>
    
    <!-- Filter & Search Section -->
    <div class="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
        <div class="flex flex-col lg:flex-row border-b border-slate-200 dark:border-slate-800">
            <!-- Tabs -->
            <div class="flex px-6 overflow-x-auto">
                <a class="flex items-center justify-center border-b-2 {{ !request('status') ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200' }} px-6 py-5 transition-all font-bold text-sm whitespace-nowrap" href="{{ route('admin.content.index') }}">
                    الكل <span class="mr-2 px-1.5 py-0.5 {{ !request('status') ? 'bg-primary/20' : 'bg-slate-100 dark:bg-slate-800' }} rounded text-[10px]">{{ \App\Models\Content::count() }}</span>
                </a>
                <a class="flex items-center justify-center border-b-2 {{ request('status') == 'published' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200' }} px-6 py-5 transition-all font-bold text-sm whitespace-nowrap" href="{{ route('admin.content.index', ['status' => 'published']) }}">
                    منشور <span class="mr-2 px-1.5 py-0.5 {{ request('status') == 'published' ? 'bg-primary/20' : 'bg-slate-100 dark:bg-slate-800' }} rounded text-[10px]">{{ \App\Models\Content::where('status', 'published')->count() }}</span>
                </a>
                <a class="flex items-center justify-center border-b-2 {{ request('status') == 'draft' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200' }} px-6 py-5 transition-all font-bold text-sm whitespace-nowrap" href="{{ route('admin.content.index', ['status' => 'draft']) }}">
                    مسودات <span class="mr-2 px-1.5 py-0.5 {{ request('status') == 'draft' ? 'bg-primary/20' : 'bg-slate-100 dark:bg-slate-800' }} rounded text-[10px]">{{ \App\Models\Content::where('status', 'draft')->count() }}</span>
                </a>
                <a class="flex items-center justify-center border-b-2 {{ request('status') == 'archived' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200' }} px-6 py-5 transition-all font-bold text-sm whitespace-nowrap" href="{{ route('admin.content.index', ['status' => 'archived']) }}">
                    مؤرشف <span class="mr-2 px-1.5 py-0.5 {{ request('status') == 'archived' ? 'bg-primary/20' : 'bg-slate-100 dark:bg-slate-800' }} rounded text-[10px]">{{ \App\Models\Content::where('status', 'archived')->count() }}</span>
                </a>
            </div>
        </div>
        
        <!-- Search & Filters -->
        <form action="{{ route('admin.content.index') }}" method="GET" class="p-6 flex flex-wrap gap-4 items-center">
            @if(request('status'))
                <input type="hidden" name="status" value="{{ request('status') }}">
            @endif
            <div class="flex-1 min-w-[300px]">
                <label class="relative block">
                    <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                        <span class="material-symbols-outlined">search</span>
                    </span>
                    <input name="search" value="{{ request('search') }}" class="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 pr-12 pl-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-500" placeholder="بحث بالعنوان، القسم، أو الرقم التعريفي..." type="text"/>
                </label>
            </div>
            <select name="category" onchange="this.form.submit()" class="px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <option value="">كل الأنواع</option>
                <option value="news" {{ request('category') == 'news' ? 'selected' : '' }}>أخبار</option>
                <option value="announcement" {{ request('category') == 'announcement' ? 'selected' : '' }}>إعلانات</option>
                <option value="decree" {{ request('category') == 'decree' ? 'selected' : '' }}>مراسيم</option>
                <option value="service" {{ request('category') == 'service' ? 'selected' : '' }}>خدمات</option>
            </select>
            <button type="submit" class="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                <span class="material-symbols-outlined text-sm">search</span>
                بحث
            </button>
            @if(request()->anyFilled(['search', 'category']))
                <a href="{{ route('admin.content.index', ['status' => request('status')]) }}" class="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">
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
                        <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">المحرر</th>
                        <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الحالة</th>
                        <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">آخر تعديل</th>
                        <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left">إجراءات</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                    @forelse($contents as $content)
                    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td class="px-6 py-5">
                            <div class="flex flex-col">
                                <span class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors max-w-sm truncate" title="{{ $content->title_ar }}">{{ $content->title_ar }}</span>
                                <span class="text-xs text-slate-400 font-sans truncate max-w-sm">{{ $content->title_en }}</span>
                            </div>
                        </td>
                        <td class="px-6 py-5">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800 uppercase">
                                {{ $content->type }}
                            </span>
                        </td>
                        <td class="px-6 py-5">
                            <span class="text-sm text-slate-600 dark:text-slate-400">{{ $content->author->name ?? 'غير معروف' }}</span>
                        </td>
                        <td class="px-6 py-5">
                            @if($content->status === 'published')
                                <div class="flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-green-500"></span>
                                    <span class="text-sm text-slate-700 dark:text-slate-300 font-medium">منشور</span>
                                </div>
                            @elseif($content->status === 'draft')
                                <div class="flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-slate-400"></span>
                                    <span class="text-sm text-slate-700 dark:text-slate-300 font-medium">مسودة</span>
                                </div>
                            @else
                                <div class="flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                                    <span class="text-sm text-slate-700 dark:text-slate-300 font-medium">{{ ucfirst($content->status) }}</span>
                                </div>
                            @endif
                        </td>
                        <td class="px-6 py-5">
                            <span class="text-sm text-slate-500 dark:text-slate-400">{{ $content->updated_at->locale('ar')->diffForHumans() }}</span>
                        </td>
                        <td class="px-6 py-5 text-left">
                            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a href="{{ route('admin.content.edit', $content) }}" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-amber-600 transition-colors" title="تعديل">
                                    <span class="material-symbols-outlined text-[20px]">edit</span>
                                </a>
                                <form action="{{ route('admin.content.destroy', $content) }}" method="POST" onsubmit="return confirm('هل أنت متأكد من حذف هذا المحتوى؟');">
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
                        <td colspan="6" class="px-6 py-12 text-center text-slate-500">لم يتم العثور على محتوى.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        
        <!-- Pagination -->
        <div class="p-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <span class="text-sm text-slate-500 dark:text-slate-400">
                عرض {{ $contents->firstItem() ?? 0 }}-{{ $contents->lastItem() ?? 0 }} من أصل {{ $contents->total() }} سجل
            </span>
            <div class="flex gap-2 dir-ltr">
                {{ $contents->links('pagination::simple-tailwind') }}
            </div>
        </div>
    </div>
</div>
@endsection
