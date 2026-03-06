@extends('admin.layouts.app')

@section('title', 'تفاصيل الإشعار - وزارة الاقتصاد')

@section('content')
<div class="max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
            <div class="flex items-center gap-3 mb-1">
                <h1 class="text-2xl font-bold text-slate-900 dark:text-white">تفاصيل الإشعار</h1>
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
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold border {{ $typeColors[$notification->type] ?? 'bg-slate-100 text-slate-600 border-slate-200' }}">
                    {{ $typeLabels[$notification->type] ?? $notification->type }}
                </span>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400">تاريخ الإنشاء: {{ $notification->created_at->format('Y/m/d H:i') }}</p>
        </div>
        <a href="{{ route('admin.notifications.index') }}" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm">
            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
            عودة للقائمة
        </a>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 flex flex-col gap-6">
            <!-- Notification Content -->
            <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <div class="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-bold text-slate-500">الحالة:</span>
                        @if($notification->is_read)
                            <span class="px-3 py-1 rounded-full border text-xs font-bold bg-green-50 text-green-700 border-green-200">مقروء</span>
                        @else
                            <span class="px-3 py-1 rounded-full border text-xs font-bold bg-amber-50 text-amber-700 border-amber-200">غير مقروء</span>
                        @endif
                    </div>
                </div>

                <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">{{ $notification->title }}</h2>

                <div class="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                    {{ $notification->body }}
                </div>

                @if($notification->data)
                    <div class="mt-6">
                        <h3 class="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            <span class="material-symbols-outlined text-[18px]">data_object</span>
                            بيانات إضافية
                        </h3>
                        <div class="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 p-4 rounded-lg">
                            <pre class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono" dir="ltr">{{ json_encode($notification->data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) }}</pre>
                        </div>
                    </div>
                @endif
            </div>
        </div>

        <!-- Sidebar -->
        <div class="flex flex-col gap-6">
            <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">معلومات الإشعار</h3>

                <div class="flex flex-col gap-3 text-sm">
                    <div class="flex justify-between">
                        <span class="text-slate-500">المستخدم</span>
                        <span class="font-medium text-slate-700 dark:text-slate-200">{{ $notification->user->name ?? 'النظام' }}</span>
                    </div>
                    <div class="h-px bg-slate-100 dark:bg-slate-700"></div>
                    <div class="flex justify-between">
                        <span class="text-slate-500">النوع</span>
                        <span class="font-medium text-slate-700 dark:text-slate-200">{{ $typeLabels[$notification->type] ?? $notification->type }}</span>
                    </div>
                    <div class="h-px bg-slate-100 dark:bg-slate-700"></div>
                    <div class="flex justify-between">
                        <span class="text-slate-500">الحالة</span>
                        <span class="font-medium text-slate-700 dark:text-slate-200">{{ $notification->is_read ? 'مقروء' : 'غير مقروء' }}</span>
                    </div>
                    <div class="h-px bg-slate-100 dark:bg-slate-700"></div>
                    <div class="flex justify-between">
                        <span class="text-slate-500">تاريخ الإنشاء</span>
                        <span class="font-medium text-slate-700 dark:text-slate-200">{{ $notification->created_at->format('Y/m/d H:i') }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
