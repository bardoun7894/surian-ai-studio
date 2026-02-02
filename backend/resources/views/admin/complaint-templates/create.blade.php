@extends('admin.layouts.app')

@section('title', 'إضافة قالب شكوى - وزارة الاقتصاد')

@section('content')
<div class="max-w-3xl mx-auto">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <a href="{{ route('admin.dashboard') }}" class="hover:text-primary transition-colors">الرئيسية</a>
        <span class="material-symbols-outlined text-[16px] rtl-flip">chevron_left</span>
        <a href="{{ route('admin.complaint-templates.index') }}" class="hover:text-primary transition-colors">قوالب الشكاوى</a>
        <span class="material-symbols-outlined text-[16px] rtl-flip">chevron_left</span>
        <span class="text-slate-900 dark:text-white font-medium">إضافة قالب</span>
    </nav>

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">إضافة قالب شكوى</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">إنشاء قالب جديد لنماذج الشكاوى</p>
        </div>
        <a href="{{ route('admin.complaint-templates.index') }}" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm">
            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
            العودة للقائمة
        </a>
    </div>

    <!-- Form -->
    <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div class="bg-primary px-6 py-4">
            <h2 class="text-white font-bold text-sm flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px]">description</span>
                بيانات قالب الشكوى
            </h2>
        </div>

        <form action="{{ route('admin.complaint-templates.store') }}" method="POST" class="p-6">
            @csrf

            <div class="flex flex-col gap-6">
                <!-- Arabic Info -->
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                    <h3 class="font-bold text-slate-900 dark:text-white mb-4 text-sm flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-primary"></span>
                        النسخة العربية (مطلوب)
                    </h3>

                    <div class="mb-4">
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">اسم القالب <span class="text-red-500">*</span></label>
                        <input type="text" name="name" value="{{ old('name') }}" required
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                            placeholder="مثال: شكوى تجارية">
                        @error('name') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الوصف</label>
                        <textarea name="description" rows="3"
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400 leading-relaxed"
                            placeholder="وصف مختصر للقالب...">{{ old('description') }}</textarea>
                        @error('description') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>
                </div>

                <!-- English Info -->
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                    <h3 class="font-bold text-slate-900 dark:text-white mb-4 text-sm flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-slate-400"></span>
                        English Version (Optional)
                    </h3>

                    <div class="mb-4">
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Template Name</label>
                        <input type="text" name="name_en" value="{{ old('name_en') }}" dir="ltr"
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                            placeholder="e.g. Commercial Complaint">
                        @error('name_en') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                        <textarea name="description_en" rows="3" dir="ltr"
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400 leading-relaxed"
                            placeholder="Brief description of the template...">{{ old('description_en') }}</textarea>
                        @error('description_en') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>
                </div>

                <!-- Settings -->
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                    <h3 class="font-bold text-slate-900 dark:text-white mb-4 text-sm flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-primary"></span>
                        إعدادات القالب
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">المديرية</label>
                            <select name="directorate_id"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary">
                                <option value="">-- بدون مديرية --</option>
                                @foreach($directorates as $directorate)
                                    <option value="{{ $directorate->id }}" {{ old('directorate_id') == $directorate->id ? 'selected' : '' }}>
                                        {{ $directorate->name_ar }}
                                    </option>
                                @endforeach
                            </select>
                            @error('directorate_id') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">النوع</label>
                            <input type="text" name="type" value="{{ old('type') }}"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                                placeholder="مثال: commercial, service, general">
                            @error('type') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">ترتيب العرض</label>
                            <input type="number" name="sort_order" value="{{ old('sort_order', 0) }}" min="0"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                                placeholder="0">
                            @error('sort_order') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>
                    </div>

                    <div class="flex items-center gap-6 mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="requires_identification" value="1" {{ old('requires_identification') ? 'checked' : '' }}
                                class="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary">
                            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">يتطلب تحقق الهوية</span>
                        </label>

                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="is_active" value="1" {{ old('is_active', true) ? 'checked' : '' }}
                                class="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary">
                            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">مفعّل</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-700 mt-6">
                <a href="{{ route('admin.complaint-templates.index') }}" class="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">إلغاء</a>
                <button type="submit" class="px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                    <span class="material-symbols-outlined text-[20px]">save</span>
                    إنشاء القالب
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
