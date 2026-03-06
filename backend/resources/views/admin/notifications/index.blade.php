@extends('admin.layouts.app')

@section('title', 'الإشعارات - وزارة الاقتصاد')

@section('content')
<div class="max-w-[1440px] mx-auto w-full">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 mb-6 text-sm">
        <a class="text-slate-500 dark:text-slate-400 hover:text-primary font-medium" href="{{ route('admin.dashboard') }}">الرئيسية</a>
        <span class="material-symbols-outlined text-slate-400 text-[16px] rtl-flip">chevron_left</span>
        <span class="text-primary dark:text-slate-200 font-semibold">الإشعارات</span>
    </div>

    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div class="flex flex-col gap-2">
            <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">إدارة الإشعارات</h1>
            <p class="text-slate-500 dark:text-slate-400 text-base max-w-2xl">عرض إشعارات النظام</p>
        </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div class="bg-surface-light dark:bg-surface-dark p-5 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
            <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">إجمالي</p>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ number_format($notifications->total()) }}</h3>
        </div>
        <div class="bg-surface-light dark:bg-surface-dark p-5 rounded border-r-4 border-amber-500 shadow-sm">
            <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">غير مقروءة</p>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ number_format($unreadCount) }}</h3>
        </div>
    </div>

    <!-- Search & Filter -->
    <div class="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded shadow-sm p-4 mb-6">
        <form method="GET" action="{{ route('admin.notifications.index') }}" class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
                <input type="text" name="search" value="{{ request('search') }}" placeholder="بحث بالعنوان..."
                    class="w-full rounded border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
            </div>
            <div class="w-full md:w-56">
                <select name="type" class="w-full rounded border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                    <option value="">جميع الأنواع</option>
                    <option value="complaint_new" {{ request('type') == 'complaint_new' ? 'selected' : '' }}>شكوى جديدة</option>
                    <option value="complaint_status_change" {{ request('type') == 'complaint_status_change' ? 'selected' : '' }}>تغيير حالة شكوى</option>
                    <option value="complaint_response" {{ request('type') == 'complaint_response' ? 'selected' : '' }}>رد على شكوى</option>
                    <option value="system" {{ request('type') == 'system' ? 'selected' : '' }}>نظام</option>
                    <option value="security_alert" {{ request('type') == 'security_alert' ? 'selected' : '' }}>تنبيه أمني</option>
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
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">العنوان</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">المستخدم</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">النوع</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">الحالة</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">التاريخ</th>
                        <th class="p-4 w-28 text-center text-xs font-bold uppercase tracking-wider text-white/90">إجراءات</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                    @forelse($notifications as $notification)
                    <tr class="group hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors {{ !$notification->is_read ? 'bg-amber-50/50 dark:bg-amber-900/10' : '' }}">
                        <td class="p-4">
                            <span class="text-sm font-bold text-slate-900 dark:text-white">{{ $notification->title }}</span>
                        </td>
                        <td class="p-4">
                            <span class="text-sm text-slate-600 dark:text-slate-300">{{ $notification->user->name ?? 'النظام' }}</span>
                        </td>
                        <td class="p-4">
                            @php
                                $typeColors = [
                                    'complaint_new' => 'bg-blue-100 text-blue-700 border-blue-200',
                                    'complaint_status_change' => 'bg-purple-100 text-purple-700 border-purple-200',
                                    'complaint_response' => 'bg-cyan-100 text-cyan-700 border-cyan-200',
                                    'system' => 'bg-slate-100 text-slate-700 border-slate-200',
                                    'security_alert' => 'bg-red-100 text-red-700 border-red-200',
                                ];
                                $typeLabels = [
                                    'complaint_new' => 'شكوى جديدة',
                                    'complaint_status_change' => 'تغيير حالة',
                                    'complaint_response' => 'رد شكوى',
                                    'system' => 'نظام',
                                    'security_alert' => 'تنبيه أمني',
                                ];
                            @endphp
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border {{ $typeColors[$notification->type] ?? 'bg-slate-100 text-slate-600 border-slate-200' }}">
                                {{ $typeLabels[$notification->type] ?? $notification->type }}
                            </span>
                        </td>
                        <td class="p-4">
                            @if($notification->is_read)
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">مقروء</span>
                            @else
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">غير مقروء</span>
                            @endif
                        </td>
                        <td class="p-4 text-sm text-slate-500 dark:text-slate-400">
                            {{ $notification->created_at->diffForHumans() }}
                        </td>
                        <td class="p-4">
                            <div class="flex items-center justify-center gap-2">
                                <a href="{{ route('admin.notifications.show', $notification) }}" class="size-8 flex items-center justify-center rounded text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="عرض">
                                    <span class="material-symbols-outlined text-[20px]">visibility</span>
                                </a>
                                <form action="{{ route('admin.notifications.destroy', $notification) }}" method="POST" onsubmit="return confirm('هل أنت متأكد من حذف هذا الإشعار؟')">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="size-8 flex items-center justify-center rounded text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="حذف">
                                        <span class="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="6" class="p-8 text-center text-slate-500">
                            <span class="material-symbols-outlined text-3xl mb-2 block">notifications_off</span>
                            لا توجد إشعارات للعرض.
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="p-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <span class="text-sm text-slate-500 dark:text-slate-400">
                عرض {{ $notifications->firstItem() ?? 0 }}-{{ $notifications->lastItem() ?? 0 }} من أصل {{ $notifications->total() }} سجل
            </span>
            <div class="flex gap-2 dir-ltr">
                {{ $notifications->withQueryString()->links('pagination::simple-tailwind') }}
            </div>
        </div>
    </div>
</div>
@endsection
