@extends('admin.layouts.app')

@section('title', 'محادثات الدردشة - وزارة الاقتصاد')

@section('content')
<div class="max-w-[1440px] mx-auto w-full">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 mb-6 text-sm">
        <a class="text-slate-500 dark:text-slate-400 hover:text-primary font-medium" href="{{ route('admin.dashboard') }}">الرئيسية</a>
        <span class="material-symbols-outlined text-slate-400 text-[16px] rtl-flip">chevron_left</span>
        <span class="text-primary dark:text-slate-200 font-semibold">محادثات الدردشة</span>
    </div>

    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div class="flex flex-col gap-2">
            <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">سجل محادثات الدردشة</h1>
        </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div class="bg-surface-light dark:bg-surface-dark p-5 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
            <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">إجمالي المحادثات</p>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ number_format($totalConversations) }}</h3>
        </div>
        <div class="bg-surface-light dark:bg-surface-dark p-5 rounded border-r-4 border-amber-500 shadow-sm">
            <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">طلبات تحويل</p>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ number_format($handoffCount) }}</h3>
        </div>
    </div>

    <!-- Search & Filter -->
    <div class="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded shadow-sm p-4 mb-6">
        <form method="GET" action="{{ route('admin.chat-conversations.index') }}" class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
                <input type="text" name="search" value="{{ request('search') }}" placeholder="بحث بمعرف الجلسة أو اسم المستخدم..."
                    class="w-full rounded border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
            </div>
            <div class="w-full md:w-56">
                <select name="handoff" class="w-full rounded border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                    <option value="">جميع المحادثات</option>
                    <option value="yes" {{ request('handoff') == 'yes' ? 'selected' : '' }}>طلب تحويل</option>
                    <option value="no" {{ request('handoff') == 'no' ? 'selected' : '' }}>بدون تحويل</option>
                </select>
            </div>
            <button type="submit" class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-5 rounded flex items-center gap-2 shadow-sm transition-all">
                <span class="material-symbols-outlined text-[20px]">search</span>
                بحث
            </button>
        </form>
    </div>

    <!-- Data Table -->
    <div class="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-right border-collapse">
                <thead>
                    <tr class="bg-primary text-white border-b border-primary-dark">
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">المعرف</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">المستخدم</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">عدد الرسائل</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">تحويل</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">التاريخ</th>
                        <th class="p-4 w-24 text-center text-xs font-bold uppercase tracking-wider text-white/90">إجراءات</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                    @forelse($conversations as $conversation)
                    <tr class="group hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                        <td class="p-4">
                            <span class="text-sm font-mono font-bold text-primary" dir="ltr">{{ Str::limit($conversation->session_id, 16) }}</span>
                        </td>
                        <td class="p-4">
                            <span class="text-sm text-slate-600 dark:text-slate-300">{{ $conversation->user->name ?? 'زائر' }}</span>
                        </td>
                        <td class="p-4">
                            <span class="text-sm font-bold text-slate-900 dark:text-white">{{ is_array($conversation->messages) ? count($conversation->messages) : 0 }}</span>
                        </td>
                        <td class="p-4">
                            @if($conversation->handoff_requested)
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">طلب تحويل</span>
                            @else
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">لا</span>
                            @endif
                        </td>
                        <td class="p-4 text-sm text-slate-500 dark:text-slate-400">
                            {{ $conversation->created_at->diffForHumans() }}
                        </td>
                        <td class="p-4 text-center">
                            <a href="{{ route('admin.chat-conversations.show', $conversation) }}" class="size-8 flex items-center justify-center rounded text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="عرض">
                                <span class="material-symbols-outlined text-[20px]">visibility</span>
                            </a>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="6" class="p-8 text-center text-slate-500">
                            <span class="material-symbols-outlined text-3xl mb-2 block">chat_bubble_outline</span>
                            لا توجد محادثات للعرض.
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="p-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <span class="text-sm text-slate-500 dark:text-slate-400">
                عرض {{ $conversations->firstItem() ?? 0 }}-{{ $conversations->lastItem() ?? 0 }} من أصل {{ $conversations->total() }} سجل
            </span>
            <div class="flex gap-2 dir-ltr">
                {{ $conversations->withQueryString()->links('pagination::simple-tailwind') }}
            </div>
        </div>
    </div>
</div>
@endsection
