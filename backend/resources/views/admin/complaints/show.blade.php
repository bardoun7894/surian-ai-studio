@extends('admin.layouts.app')

@section('title', 'تفاصيل الشكوى ' . $complaint->tracking_number)

@section('content')
<div class="max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
            <div class="flex items-center gap-3 mb-1">
                <h1 class="text-2xl font-bold text-slate-900 dark:text-white">تفاصيل الشكوى</h1>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {{ $complaint->tracking_number }}
                </span>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400">تاريخ التقديم: {{ $complaint->created_at->format('Y/m/d H:i') }}</p>
        </div>
        <div class="flex gap-2">
            <a href="{{ route('admin.complaints.index') }}" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm">
                <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
                عودة للقائمة
            </a>
            <a href="mailto:{{ $complaint->email }}" class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm font-bold text-sm">
                <span class="material-symbols-outlined text-[20px]">mail</span>
                مراسلة المواطن
            </a>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content (2/3) -->
        <div class="lg:col-span-2 flex flex-col gap-6">
            <!-- Details Card -->
            <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <!-- Status & Priority Banner -->
                <div class="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-bold text-slate-500">الحالة:</span>
                        @php
                            $statusColors = [
                                'new' => 'bg-blue-50 text-blue-700 border-blue-200',
                                'pending' => 'bg-amber-50 text-amber-700 border-amber-200',
                                'processing' => 'bg-purple-50 text-purple-700 border-purple-200',
                                'resolved' => 'bg-green-50 text-green-700 border-green-200',
                                'rejected' => 'bg-red-50 text-red-700 border-red-200',
                            ];
                            $statusLabels = [
                                'new' => 'جديدة',
                                'pending' => 'قيد الانتظار',
                                'processing' => 'جاري المعالجة',
                                'resolved' => 'تم الحل',
                                'rejected' => 'مرفوضة',
                            ];
                        @endphp
                        <span class="px-3 py-1 rounded-full border text-xs font-bold {{ $statusColors[$complaint->status] ?? 'bg-gray-100 text-gray-700' }}">
                            {{ $statusLabels[$complaint->status] ?? $complaint->status }}
                        </span>
                    </div>

                    <div class="flex items-center gap-2">
                        <span class="text-sm font-bold text-slate-500">الأولوية:</span>
                        <span class="px-3 py-1 rounded-full border text-xs font-bold {{ $complaint->priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' : ($complaint->priority === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200') }}">
                            {{ $complaint->priority === 'high' ? 'عالية' : ($complaint->priority === 'medium' ? 'متوسطة' : 'عادية') }}
                        </span>
                    </div>
                </div>

                <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">{{ $complaint->title }}</h2>
                
                <div class="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                    {{ $complaint->description }}
                </div>

                @if($complaint->ai_summary)
                    <div class="mt-6">
                        <h3 class="flex items-center gap-2 text-sm font-bold text-purple-600 mb-2">
                            <span class="material-symbols-outlined text-[18px]">smart_toy</span>
                            ملخص الذكاء الاصطناعي
                        </h3>
                        <div class="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 p-4 rounded-lg text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {{ $complaint->ai_summary }}
                        </div>
                    </div>
                @endif
            </div>

            <!-- Attachments -->
            @if($complaint->attachments->count() > 0)
                <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                    <h3 class="font-bold text-slate-900 dark:text-white mb-4">المرفقات ({{ $complaint->attachments->count() }})</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        @foreach($complaint->attachments as $attachment)
                            <a href="#" target="_blank" class="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
                                <div class="h-10 w-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                                    <span class="material-symbols-outlined">description</span>
                                </div>
                                <div class="flex flex-col overflow-hidden">
                                    <span class="text-sm font-medium text-slate-900 dark:text-white truncate">مرفق #{{ $loop->iteration }}</span>
                                    <span class="text-xs text-slate-500">{{ $attachment->created_at->format('Y-m-d') }}</span>
                                </div>
                                <span class="material-symbols-outlined text-slate-400 mr-auto">download</span>
                            </a>
                        @endforeach
                    </div>
                </div>
            @endif

            <!-- Responses Section -->
            <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <h3 class="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span class="material-symbols-outlined text-gov-emerald">forum</span>
                    الردود والمتابعات ({{ $complaint->responses->count() }})
                </h3>

                @if($complaint->responses->count() > 0)
                    <div class="space-y-4 mb-6">
                        @foreach($complaint->responses as $response)
                            <div class="relative pr-8 pb-4 {{ !$loop->last ? 'border-b border-slate-100 dark:border-slate-700' : '' }}">
                                <div class="absolute right-0 top-0 h-8 w-8 rounded-full bg-gov-emerald/10 flex items-center justify-center text-gov-emerald font-bold text-xs">
                                    {{ $response->user ? substr($response->user->name, 0, 1) : 'S' }}
                                </div>
                                <div class="flex items-center gap-2 mb-2">
                                    <span class="text-sm font-bold text-slate-900 dark:text-white">{{ $response->user->name ?? 'موظف النظام' }}</span>
                                    @if($response->is_internal)
                                        <span class="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 rounded">ملاحظة داخلية</span>
                                    @endif
                                    @if($response->is_resolution)
                                        <span class="px-2 py-0.5 text-[10px] font-bold bg-green-50 text-green-700 rounded">حل نهائي</span>
                                    @endif
                                </div>
                                <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ $response->content }}</p>
                                <span class="text-xs text-slate-400 mt-2 block">{{ $response->created_at->format('Y/m/d H:i') }}</span>
                            </div>
                        @endforeach
                    </div>
                @else
                    <div class="text-center py-6 text-slate-400 mb-4">
                        <span class="material-symbols-outlined text-3xl mb-2 block">chat_bubble_outline</span>
                        <p class="text-sm">لا توجد ردود حتى الآن.</p>
                    </div>
                @endif

                <!-- Add Response Form -->
                <form action="{{ route('admin.complaints.addResponse', $complaint) }}" method="POST" class="border-t border-slate-100 dark:border-slate-700 pt-4">
                    @csrf
                    <label class="block text-xs font-bold text-slate-500 mb-2">إضافة رد جديد</label>
                    <textarea name="response" rows="3" required placeholder="اكتب ردك هنا..." class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-gov-emerald focus:border-gov-emerald text-sm mb-3"></textarea>
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <div class="flex items-center gap-4">
                            <label class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                                <input type="checkbox" name="is_internal" value="1" class="rounded border-slate-300 text-gov-emerald focus:ring-gov-emerald">
                                <span>ملاحظة داخلية (لن تظهر للمواطن)</span>
                            </label>
                            <label class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                                <input type="checkbox" name="is_resolution" value="1" class="rounded border-slate-300 text-gov-emerald focus:ring-gov-emerald">
                                <span>حل نهائي</span>
                            </label>
                        </div>
                        <button type="submit" class="px-4 py-2 bg-gov-emerald text-white rounded-lg font-bold hover:bg-gov-emeraldLight shadow-sm transition-all flex items-center gap-2">
                            <span class="material-symbols-outlined text-[20px]">send</span>
                            إرسال الرد
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Sidebar (1/3) -->
        <div class="flex flex-col gap-6">
            <!-- Action Card -->
            <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-xs">إجراءات سريعة</h3>
                
                <form action="{{ route('admin.complaints.updateStatus', $complaint) }}" method="POST">
                    @csrf
                    @method('PUT')
                    <label class="block text-xs font-bold text-slate-500 mb-2">تحديث الحالة</label>
                    <div class="flex gap-2">
                        <select name="status" class="flex-1 rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                            <option value="new" {{ $complaint->status == 'new' ? 'selected' : '' }}>جديدة</option>
                            <option value="pending" {{ $complaint->status == 'pending' ? 'selected' : '' }}>قيد الانتظار</option>
                            <option value="processing" {{ $complaint->status == 'processing' ? 'selected' : '' }}>جاري المعالجة</option>
                            <option value="resolved" {{ $complaint->status == 'resolved' ? 'selected' : '' }}>تم الحل</option>
                            <option value="rejected" {{ $complaint->status == 'rejected' ? 'selected' : '' }}>مرفوضة</option>
                        </select>
                        <button type="submit" class="p-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors">
                            <span class="material-symbols-outlined text-[20px]">save</span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Info Card -->
            <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-xs">معلومات مقدم الشكوى</h3>
                
                <div class="flex flex-col gap-4">
                    <div class="flex items-center gap-3">
                        <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {{ substr($complaint->full_name, 0, 1) }}
                        </div>
                        <div>
                            <p class="text-sm font-bold text-slate-900 dark:text-white">{{ $complaint->full_name }}</p>
                            <p class="text-xs text-slate-500">مواطن</p>
                        </div>
                    </div>
                    
                    <div class="h-px bg-slate-100 dark:bg-slate-700"></div>
                    
                    <div class="flex flex-col gap-3 text-sm">
                        <div class="flex justify-between">
                            <span class="text-slate-500">الرقم الوطني</span>
                            <span class="font-medium font-mono text-slate-700 dark:text-slate-200">{{ $complaint->national_id }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-500">رقم الهاتف</span>
                            <span class="font-medium font-mono text-slate-700 dark:text-slate-200" dir="ltr">{{ $complaint->phone }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-500">المديرية المعنية</span>
                            <span class="font-medium text-slate-700 dark:text-slate-200">{{ $complaint->directorate->name ?? 'غير محدد' }}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- AI Classification -->
            @if($complaint->ai_category)
                <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-xs flex items-center gap-2">
                        <span class="material-symbols-outlined text-[18px] text-purple-600">psychology</span>
                        تصنيف الذكاء الاصطناعي
                    </h3>
                    
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-xs text-slate-500">التصنيف المقترح</span>
                            <span class="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded">{{ $complaint->ai_category }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs text-slate-500">الأهمية المقدرة</span>
                            <span class="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded">{{ $complaint->ai_priority }}</span>
                        </div>
                        <p class="text-[10px] text-slate-400 italic mt-2">
                            تم تحليل هذه البيانات تلقائياً بواسطة خوارزميات الوزارة للذكاء الاصطناعي.
                        </p>
                    </div>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection
