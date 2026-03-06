@extends('admin.layouts.app')

@section('title', 'النشرة البريدية - وزارة الاقتصاد')

@section('content')
<div class="max-w-[1200px] mx-auto w-full">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 mb-6">
        <a class="text-primary/70 hover:text-primary text-sm font-medium flex items-center" href="{{ route('admin.dashboard') }}">
            <span class="material-symbols-outlined text-sm ml-1 rtl-flip">home</span> الرئيسية
        </a>
        <span class="text-slate-400 text-sm">/</span>
        <span class="text-slate-900 dark:text-white text-sm font-semibold">النشرة البريدية</span>
    </div>

    <!-- Page Heading -->
    <div class="flex flex-wrap justify-between items-end gap-6 mb-8">
        <div class="flex flex-col gap-2">
            <h1 class="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">إدارة المشتركين في النشرة البريدية</h1>
            <p class="text-slate-500 dark:text-slate-400 text-base font-normal max-w-xl">عرض وإدارة المشتركين في النشرة البريدية للموقع.</p>
        </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
            <div class="absolute -left-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform text-primary">
                <span class="material-symbols-outlined text-8xl">mail</span>
            </div>
            <p class="text-xs font-bold text-primary uppercase tracking-widest mb-1">إجمالي المشتركين</p>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white">{{ $subscribers->total() }} مشترك</h3>
        </div>

        <div class="bg-primary text-white p-6 rounded-2xl shadow-xl shadow-primary/10 relative overflow-hidden group">
            <div class="absolute -left-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-8xl">check_circle</span>
            </div>
            <p class="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">مشتركون نشطون</p>
            <h3 class="text-2xl font-black text-white">{{ $totalActive }} مشترك نشط</h3>
        </div>

        <div class="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
            <div class="absolute -left-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform text-red-500">
                <span class="material-symbols-outlined text-8xl">unsubscribe</span>
            </div>
            <p class="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">ألغوا الاشتراك</p>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white">{{ $totalUnsubscribed }} مشترك</h3>
        </div>
    </div>

    <!-- Filter & Search Section -->
    <div class="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
        <!-- Search & Filters -->
        <form action="{{ route('admin.newsletter.index') }}" method="GET" class="p-6 flex flex-wrap gap-4 items-center border-b border-slate-200 dark:border-slate-800">
            <div class="flex-1 min-w-[300px]">
                <label class="relative block">
                    <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                        <span class="material-symbols-outlined">search</span>
                    </span>
                    <input name="search" value="{{ request('search') }}" class="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 pr-12 pl-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-500" placeholder="بحث بالبريد الإلكتروني..." type="text"/>
                </label>
            </div>
            <select name="status" onchange="this.form.submit()" class="px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <option value="">كل الحالات</option>
                <option value="active" {{ request('status') == 'active' ? 'selected' : '' }}>نشط</option>
                <option value="unsubscribed" {{ request('status') == 'unsubscribed' ? 'selected' : '' }}>ألغى الاشتراك</option>
            </select>
            <button type="submit" class="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                <span class="material-symbols-outlined text-sm">search</span>
                بحث
            </button>
            @if(request()->anyFilled(['search', 'status']))
                <a href="{{ route('admin.newsletter.index') }}" class="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">
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
                        <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">البريد الإلكتروني</th>
                        <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الحالة</th>
                        <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">تاريخ الاشتراك</th>
                        <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left">إجراءات</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                    @forelse($subscribers as $subscriber)
                    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td class="px-6 py-5">
                            <div class="flex items-center gap-3">
                                <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span class="material-symbols-outlined text-[20px]">mail</span>
                                </div>
                                <span class="text-sm font-bold text-slate-900 dark:text-white" dir="ltr">{{ $subscriber->email }}</span>
                            </div>
                        </td>
                        <td class="px-6 py-5">
                            @if($subscriber->status === 'active')
                                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                                    <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    نشط
                                </span>
                            @else
                                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                                    <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                    ألغى الاشتراك
                                </span>
                            @endif
                        </td>
                        <td class="px-6 py-5">
                            <span class="text-sm text-slate-500 dark:text-slate-400">{{ $subscriber->subscribed_at ? $subscriber->subscribed_at->locale('ar')->diffForHumans() : $subscriber->created_at->locale('ar')->diffForHumans() }}</span>
                        </td>
                        <td class="px-6 py-5 text-left">
                            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <form action="{{ route('admin.newsletter.destroy', $subscriber) }}" method="POST" onsubmit="return confirm('هل أنت متأكد من حذف هذا المشترك؟');">
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
                                <span class="material-symbols-outlined text-5xl mb-3 opacity-20">mail</span>
                                <p class="text-lg font-medium">لا يوجد مشتركون في النشرة البريدية بعد</p>
                            </div>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        @if($subscribers->hasPages())
            <div class="p-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                <span class="text-sm text-slate-500 dark:text-slate-400">
                    عرض {{ $subscribers->firstItem() ?? 0 }}-{{ $subscribers->lastItem() ?? 0 }} من أصل {{ $subscribers->total() }} سجل
                </span>
                <div class="flex gap-2 dir-ltr">
                    {{ $subscribers->links('pagination::simple-tailwind') }}
                </div>
            </div>
        @endif
    </div>
</div>
@endsection
