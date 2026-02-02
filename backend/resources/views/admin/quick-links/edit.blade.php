@extends('admin.layouts.app')

@section('title', 'تعديل الرابط السريع - وزارة الاقتصاد')

@section('content')
<div class="max-w-3xl mx-auto">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <a href="{{ route('admin.dashboard') }}" class="hover:text-primary transition-colors">الرئيسية</a>
        <span class="material-symbols-outlined text-[16px] rtl-flip">chevron_left</span>
        <a href="{{ route('admin.quick-links.index') }}" class="hover:text-primary transition-colors">الروابط السريعة</a>
        <span class="material-symbols-outlined text-[16px] rtl-flip">chevron_left</span>
        <span class="text-slate-900 dark:text-white font-medium">تعديل الرابط</span>
    </nav>

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">تعديل الرابط السريع</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">تحديث بيانات الرابط السريع</p>
        </div>
        <a href="{{ route('admin.quick-links.index') }}" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm">
            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
            العودة للقائمة
        </a>
    </div>

    <!-- Form -->
    <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div class="bg-primary px-6 py-4">
            <h2 class="text-white font-bold text-sm flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px]">edit</span>
                تعديل بيانات الرابط السريع
            </h2>
        </div>

        <form action="{{ route('admin.quick-links.update', $quickLink) }}" method="POST" class="p-6">
            @csrf
            @method('PUT')

            <div class="flex flex-col gap-6">
                <!-- Arabic Label -->
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                    <h3 class="font-bold text-slate-900 dark:text-white mb-4 text-sm flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-primary"></span>
                        النسخة العربية (مطلوب)
                    </h3>

                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">العنوان بالعربية <span class="text-red-500">*</span></label>
                        <input type="text" name="label_ar" value="{{ old('label_ar', $quickLink->label_ar) }}" required
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                            placeholder="مثال: الخدمات الإلكترونية">
                        @error('label_ar') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>
                </div>

                <!-- English Label -->
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                    <h3 class="font-bold text-slate-900 dark:text-white mb-4 text-sm flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-slate-400"></span>
                        English Version (Optional)
                    </h3>

                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Label in English</label>
                        <input type="text" name="label_en" value="{{ old('label_en', $quickLink->label_en) }}" dir="ltr"
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                            placeholder="e.g. E-Services">
                        @error('label_en') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>
                </div>

                <!-- URL & Settings -->
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                    <h3 class="font-bold text-slate-900 dark:text-white mb-4 text-sm flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-primary"></span>
                        إعدادات الرابط
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="md:col-span-2">
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الرابط (URL) <span class="text-red-500">*</span></label>
                            <input type="url" name="url" value="{{ old('url', $quickLink->url) }}" required dir="ltr"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                                placeholder="https://example.com/page">
                            @error('url') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الأيقونة</label>
                            <input type="text" name="icon" value="{{ old('icon', $quickLink->icon) }}" dir="ltr"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                                placeholder="e.g. public, work, school">
                            @error('icon') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                            <p class="text-xs text-slate-400 mt-1">اسم أيقونة من Material Symbols</p>
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">القسم</label>
                            <input type="text" name="section" value="{{ old('section', $quickLink->section) }}"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                                placeholder="مثال: main, footer, sidebar">
                            @error('section') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">ترتيب العرض</label>
                            <input type="number" name="display_order" value="{{ old('display_order', $quickLink->display_order) }}" min="0"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                                placeholder="0">
                            @error('display_order') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div class="flex items-end">
                            <label class="flex items-center gap-2 cursor-pointer pb-2">
                                <input type="checkbox" name="is_active" value="1" {{ old('is_active', $quickLink->is_active) ? 'checked' : '' }}
                                    class="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary">
                                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">مفعّل</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-700 mt-6">
                <a href="{{ route('admin.quick-links.index') }}" class="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">إلغاء</a>
                <button type="submit" class="px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                    <span class="material-symbols-outlined text-[20px]">save</span>
                    تحديث الرابط
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
