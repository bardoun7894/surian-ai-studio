@extends('admin.layouts.app')

@section('title', 'تفاصيل المحادثة - وزارة الاقتصاد')

@section('content')
<div class="max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
            <div class="flex items-center gap-3 mb-1">
                <h1 class="text-2xl font-bold text-slate-900 dark:text-white">تفاصيل المحادثة</h1>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" dir="ltr">
                    {{ Str::limit($conversation->session_id, 20) }}
                </span>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400">تاريخ المحادثة: {{ $conversation->created_at->format('Y/m/d H:i') }}</p>
        </div>
        <a href="{{ route('admin.chat-conversations.index') }}" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm">
            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
            عودة للقائمة
        </a>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content - Messages -->
        <div class="lg:col-span-2">
            <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <h3 class="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <span class="material-symbols-outlined text-gov-emerald">forum</span>
                    الرسائل ({{ is_array($conversation->messages) ? count($conversation->messages) : 0 }})
                </h3>

                @if(is_array($conversation->messages) && count($conversation->messages) > 0)
                    <div class="space-y-4">
                        @foreach($conversation->messages as $message)
                            @php
                                $role = $message['role'] ?? 'unknown';
                                $content = $message['content'] ?? '';
                                $timestamp = $message['timestamp'] ?? null;
                                $isUser = ($role === 'user');
                            @endphp
                            <div class="flex {{ $isUser ? 'justify-end' : 'justify-start' }}">
                                <div class="max-w-[80%] {{ $isUser ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800' : 'bg-slate-100 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700' }} border rounded-xl p-4">
                                    <div class="flex items-center gap-2 mb-2">
                                        <span class="material-symbols-outlined text-[16px] {{ $isUser ? 'text-green-600' : 'text-slate-500' }}">
                                            {{ $isUser ? 'person' : 'smart_toy' }}
                                        </span>
                                        <span class="text-xs font-bold {{ $isUser ? 'text-green-700 dark:text-green-400' : 'text-slate-600 dark:text-slate-400' }}">
                                            {{ $isUser ? 'المستخدم' : 'المساعد' }}
                                        </span>
                                        @if($timestamp)
                                            <span class="text-[10px] text-slate-400 mr-auto" dir="ltr">{{ $timestamp }}</span>
                                        @endif
                                    </div>
                                    <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{{ $content }}</p>
                                </div>
                            </div>
                        @endforeach
                    </div>
                @else
                    <div class="text-center py-8 text-slate-400">
                        <span class="material-symbols-outlined text-3xl mb-2 block">chat_bubble_outline</span>
                        <p class="text-sm">لا توجد رسائل في هذه المحادثة.</p>
                    </div>
                @endif
            </div>
        </div>

        <!-- Sidebar -->
        <div class="flex flex-col gap-6">
            <!-- Conversation Info -->
            <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">معلومات المحادثة</h3>

                <div class="flex flex-col gap-3 text-sm">
                    <div class="flex justify-between">
                        <span class="text-slate-500">معرف الجلسة</span>
                        <span class="font-medium font-mono text-slate-700 dark:text-slate-200 text-xs" dir="ltr">{{ Str::limit($conversation->session_id, 20) }}</span>
                    </div>
                    <div class="h-px bg-slate-100 dark:bg-slate-700"></div>
                    <div class="flex justify-between">
                        <span class="text-slate-500">المستخدم</span>
                        <span class="font-medium text-slate-700 dark:text-slate-200">{{ $conversation->user->name ?? 'زائر' }}</span>
                    </div>
                    <div class="h-px bg-slate-100 dark:bg-slate-700"></div>
                    <div class="flex justify-between">
                        <span class="text-slate-500">عدد الرسائل</span>
                        <span class="font-medium text-slate-700 dark:text-slate-200">{{ is_array($conversation->messages) ? count($conversation->messages) : 0 }}</span>
                    </div>
                    <div class="h-px bg-slate-100 dark:bg-slate-700"></div>
                    <div class="flex justify-between">
                        <span class="text-slate-500">تاريخ الإنشاء</span>
                        <span class="font-medium text-slate-700 dark:text-slate-200">{{ $conversation->created_at->format('Y/m/d H:i') }}</span>
                    </div>
                </div>
            </div>

            <!-- Handoff Info -->
            <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">معلومات التحويل</h3>

                <div class="flex flex-col gap-3 text-sm">
                    <div class="flex justify-between items-center">
                        <span class="text-slate-500">طلب تحويل</span>
                        @if($conversation->handoff_requested)
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">نعم</span>
                        @else
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">لا</span>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
