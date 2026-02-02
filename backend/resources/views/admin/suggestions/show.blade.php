@extends('admin.layouts.app')

@section('title', 'تفاصيل المقترح')

@section('content')
<div class="max-w-5xl mx-auto">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <a href="{{ route('admin.dashboard') }}" class="hover:text-primary transition-colors">الرئيسية</a>
        <span class="material-symbols-outlined text-[16px] rtl-flip">chevron_left</span>
        <a href="{{ route('admin.suggestions.index') }}" class="hover:text-primary transition-colors">المقترحات</a>
        <span class="material-symbols-outlined text-[16px] rtl-flip">chevron_left</span>
        <span class="text-slate-900 dark:text-white font-medium">تفاصيل</span>
    </nav>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
            <div class="flex items-center gap-3 mb-1">
                <h1 class="text-2xl font-bold text-slate-900 dark:text-white">تفاصيل المقترح</h1>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {{ $suggestion->tracking_number }}
                </span>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400">تاريخ التقديم: {{ $suggestion->created_at->format('Y/m/d H:i') }}</p>
        </div>
        <a href="{{ route('admin.suggestions.index') }}" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm">
            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
            عودة للقائمة
        </a>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content (2/3) -->
        <div class="lg:col-span-2 flex flex-col gap-6">
            <!-- Suggestion Details Card -->
            <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <!-- Status Banner -->
                <div class="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                    <span class="text-sm font-bold text-slate-500">الحالة:</span>
                    @php
                        $statusColors = [
                            'pending' => 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
                            'reviewed' => 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
                            'approved' => 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
                            'rejected' => 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
                        ];
                        $statusLabels = [
                            'pending' => 'بانتظار المراجعة',
                            'reviewed' => 'تمت المراجعة',
                            'approved' => 'مقبول',
                            'rejected' => 'مرفوض',
                        ];
                    @endphp
                    <span class="px-3 py-1 rounded-full border text-xs font-bold {{ $statusColors[$suggestion->status] ?? 'bg-gray-100 text-gray-700 border-gray-200' }}">
                        {{ $statusLabels[$suggestion->status] ?? $suggestion->status }}
                    </span>
                </div>

                <h3 class="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">description</span>
                    تفاصيل المقترح
                </h3>

                <div class="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700 leading-relaxed">
                    {{ $suggestion->description }}
                </div>

                @if($suggestion->response)
                    <div class="mt-6">
                        <h3 class="flex items-center gap-2 text-sm font-bold text-primary mb-2">
                            <span class="material-symbols-outlined text-[18px]">reply</span>
                            رد الإدارة
                        </h3>
                        <div class="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-4 rounded-lg text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {{ $suggestion->response }}
                        </div>
                    </div>
                @endif
            </div>

            <!-- Update Status Form -->
            <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <h3 class="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span class="material-symbols-outlined text-gov-emerald">edit_note</span>
                    تحديث حالة المقترح
                </h3>

                <form action="{{ route('admin.suggestions.updateStatus', $suggestion) }}" method="POST">
                    @csrf
                    @method('PUT')

                    <div class="flex flex-col gap-4">
                        <!-- Status -->
                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الحالة</label>
                            <select name="status" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                                <option value="pending" {{ $suggestion->status == 'pending' ? 'selected' : '' }}>بانتظار المراجعة</option>
                                <option value="reviewed" {{ $suggestion->status == 'reviewed' ? 'selected' : '' }}>تمت المراجعة</option>
                                <option value="approved" {{ $suggestion->status == 'approved' ? 'selected' : '' }}>مقبول</option>
                                <option value="rejected" {{ $suggestion->status == 'rejected' ? 'selected' : '' }}>مرفوض</option>
                            </select>
                            @error('status') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <!-- Response -->
                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الرد</label>
                            <textarea name="response" rows="4" placeholder="اكتب الرد على المقترح..."
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400 text-sm">{{ old('response', $suggestion->response) }}</textarea>
                            @error('response') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div class="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
                            <button type="submit" class="px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                                <span class="material-symbols-outlined text-[20px]">save</span>
                                تحديث الحالة
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- Sidebar (1/3) -->
        <div class="flex flex-col gap-6">
            <!-- Submitter Info Card -->
            <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                <h3 class="text-xs font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">معلومات مقدم المقترح</h3>

                <div class="flex flex-col gap-4">
                    <div class="flex items-center gap-3">
                        <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {{ mb_substr($suggestion->name, 0, 1) }}
                        </div>
                        <div>
                            <p class="text-sm font-bold text-slate-900 dark:text-white">{{ $suggestion->name }}</p>
                            @if($suggestion->job_title)
                                <p class="text-xs text-slate-500">{{ $suggestion->job_title }}</p>
                            @endif
                        </div>
                    </div>

                    <div class="h-px bg-slate-100 dark:bg-slate-700"></div>

                    <div class="flex flex-col gap-3 text-sm">
                        <div class="flex justify-between">
                            <span class="text-slate-500">رقم التتبع</span>
                            <span class="font-medium font-mono text-slate-700 dark:text-slate-200">{{ $suggestion->tracking_number }}</span>
                        </div>
                        @if($suggestion->email)
                            <div class="flex justify-between">
                                <span class="text-slate-500">البريد الإلكتروني</span>
                                <span class="font-medium text-slate-700 dark:text-slate-200 text-xs">{{ $suggestion->email }}</span>
                            </div>
                        @endif
                        @if($suggestion->phone)
                            <div class="flex justify-between">
                                <span class="text-slate-500">رقم الهاتف</span>
                                <span class="font-medium font-mono text-slate-700 dark:text-slate-200" dir="ltr">{{ $suggestion->phone }}</span>
                            </div>
                        @endif
                        <div class="flex justify-between">
                            <span class="text-slate-500">تاريخ التقديم</span>
                            <span class="font-medium text-slate-700 dark:text-slate-200">{{ $suggestion->created_at->format('Y/m/d') }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
