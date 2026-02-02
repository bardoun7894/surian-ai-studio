@extends('admin.layouts.app')

@section('title', 'إضافة إدارة فرعية جديدة')

@section('content')
<div class="max-w-2xl mx-auto">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <a href="{{ route('admin.dashboard') }}" class="hover:text-primary transition-colors">الرئيسية</a>
        <span class="material-symbols-outlined text-[16px] rtl-flip">chevron_left</span>
        <a href="{{ route('admin.sub-directorates.index') }}" class="hover:text-primary transition-colors">الإدارات الفرعية</a>
        <span class="material-symbols-outlined text-[16px] rtl-flip">chevron_left</span>
        <span class="text-slate-900 dark:text-white font-medium">إضافة</span>
    </nav>

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">إضافة إدارة فرعية جديدة</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">تعريف إدارة فرعية جديدة تابعة لمديرية.</p>
        </div>
        <a href="{{ route('admin.sub-directorates.index') }}" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm">
            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
            العودة للقائمة
        </a>
    </div>

    <!-- Form -->
    <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <form action="{{ route('admin.sub-directorates.store') }}" method="POST" class="p-6">
            @csrf

            <div class="flex flex-col gap-6">
                <!-- Name AR -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الاسم بالعربية <span class="text-red-500">*</span></label>
                    <input type="text" name="name_ar" value="{{ old('name_ar') }}" required
                        class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                        placeholder="مثال: إدارة الشؤون المالية">
                    @error('name_ar') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- Name EN -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الاسم بالإنجليزية</label>
                    <input type="text" name="name_en" value="{{ old('name_en') }}" dir="ltr"
                        class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                        placeholder="e.g. Financial Affairs Department">
                    @error('name_en') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- Parent Directorate -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">المديرية الأم <span class="text-red-500">*</span></label>
                    <select name="parent_directorate_id" required
                        class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary">
                        <option value="">اختر المديرية...</option>
                        @foreach($directorates as $directorate)
                            <option value="{{ $directorate->id }}" {{ old('parent_directorate_id') == $directorate->id ? 'selected' : '' }}>{{ $directorate->name_ar }}</option>
                        @endforeach
                    </select>
                    @error('parent_directorate_id') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- URL -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الرابط</label>
                    <input type="url" name="url" value="{{ old('url') }}" dir="ltr"
                        class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                        placeholder="https://example.com">
                    @error('url') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Is External -->
                    <div>
                        <label class="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" name="is_external" value="1" {{ old('is_external') ? 'checked' : '' }}
                                class="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary h-5 w-5">
                            <span class="text-sm font-bold text-slate-700 dark:text-slate-300">رابط خارجي</span>
                        </label>
                        @error('is_external') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <!-- Is Active -->
                    <div>
                        <label class="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" name="is_active" value="1" {{ old('is_active', true) ? 'checked' : '' }}
                                class="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary h-5 w-5">
                            <span class="text-sm font-bold text-slate-700 dark:text-slate-300">مفعّل</span>
                        </label>
                        @error('is_active') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <!-- Order -->
                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الترتيب</label>
                        <input type="number" name="order" value="{{ old('order', 0) }}" min="0"
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary">
                        @error('order') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-700 mt-6">
                <a href="{{ route('admin.sub-directorates.index') }}" class="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">إلغاء</a>
                <button type="submit" class="px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                    <span class="material-symbols-outlined text-[20px]">save</span>
                    إنشاء الإدارة الفرعية
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
