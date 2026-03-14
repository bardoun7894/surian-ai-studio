@extends('admin.layouts.app')

@section('title', 'تعديل الخدمة - وزارة الاقتصاد')

@section('content')
<div class="max-w-3xl mx-auto">
    <!-- Breadcrumbs -->
    <div class="flex flex-wrap items-center gap-2 mb-6 text-sm">
        <a class="text-slate-500 dark:text-slate-400 hover:text-primary font-medium" href="{{ route('admin.dashboard') }}">الرئيسية</a>
        <span class="material-symbols-outlined text-slate-400 text-[16px] rtl-flip">chevron_left</span>
        <a class="text-slate-500 dark:text-slate-400 hover:text-primary font-medium" href="{{ route('admin.services.index') }}">الخدمات</a>
        <span class="material-symbols-outlined text-slate-400 text-[16px] rtl-flip">chevron_left</span>
        <span class="text-primary dark:text-slate-200 font-semibold">تعديل الخدمة</span>
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">تعديل الخدمة</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">تحديث بيانات الخدمة #{{ $service->id }}</p>
        </div>
        <a href="{{ route('admin.services.index') }}" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm">
            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
            العودة للقائمة
        </a>
    </div>

    <!-- Form -->
    <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <form action="{{ route('admin.services.update', $service) }}" method="POST" class="p-6">
            @csrf
            @method('PUT')

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <!-- name_ar -->
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">اسم الخدمة (عربي) <span class="text-red-500">*</span></label>
                    <input type="text" name="name_ar" value="{{ old('name_ar', $service->name_ar) }}" required
                        class="w-full bg-background-light dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg h-10 px-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 transition-all"
                        placeholder="أدخل اسم الخدمة بالعربي">
                    @error('name_ar') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- name_en -->
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">اسم الخدمة (إنجليزي)</label>
                    <input type="text" name="name_en" value="{{ old('name_en', $service->name_en) }}"
                        class="w-full bg-background-light dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg h-10 px-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 transition-all"
                        placeholder="Enter service name in English" dir="ltr">
                    @error('name_en') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- description_ar -->
                <div class="col-span-2">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الوصف (عربي)</label>
                    <textarea name="description_ar" rows="4"
                        class="w-full bg-background-light dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 transition-all resize-y"
                        placeholder="وصف تفصيلي للخدمة بالعربي...">{{ old('description_ar', $service->description_ar) }}</textarea>
                    @error('description_ar') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- description_en -->
                <div class="col-span-2">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الوصف (إنجليزي)</label>
                    <textarea name="description_en" rows="4" dir="ltr"
                        class="w-full bg-background-light dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 transition-all resize-y"
                        placeholder="Detailed description of the service in English...">{{ old('description_en', $service->description_en) }}</textarea>
                    @error('description_en') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- directorate_id -->
                @include('admin.partials.searchable-select', [
                    'name' => 'directorate_id',
                    'label' => 'المديرية',
                    'grouped' => $groupedDirectorates,
                    'valueField' => 'id',
                    'labelField' => 'name_ar',
                    'labelFieldFallback' => 'name_en',
                    'selected' => old('directorate_id', $service->directorate_id),
                    'placeholder' => '-- اختر المديرية --',
                ])

                <!-- icon -->
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الأيقونة</label>
                    <input type="text" name="icon" value="{{ old('icon', $service->icon) }}"
                        class="w-full bg-background-light dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg h-10 px-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 transition-all"
                        placeholder="مثال: work, settings, language" dir="ltr">
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">اسم أيقونة من Material Symbols</p>
                    @error('icon') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- category -->
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">التصنيف</label>
                    <input type="text" name="category" value="{{ old('category', $service->category) }}"
                        class="w-full bg-background-light dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg h-10 px-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 transition-all"
                        placeholder="تصنيف الخدمة">
                    @error('category') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- url -->
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">رابط الخدمة</label>
                    <input type="url" name="url" value="{{ old('url', $service->url) }}"
                        class="w-full bg-background-light dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg h-10 px-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 transition-all"
                        placeholder="https://example.com/service" dir="ltr">
                    @error('url') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- fees -->
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الرسوم</label>
                    <input type="text" name="fees" value="{{ old('fees', $service->fees) }}"
                        class="w-full bg-background-light dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg h-10 px-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 transition-all"
                        placeholder="مثال: مجاني أو 50 ل.س">
                    @error('fees') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- estimated_time -->
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الوقت المقدر</label>
                    <input type="text" name="estimated_time" value="{{ old('estimated_time', $service->estimated_time) }}"
                        class="w-full bg-background-light dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg h-10 px-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 transition-all"
                        placeholder="مثال: 3 أيام عمل">
                    @error('estimated_time') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- requirements -->
                <div class="col-span-2">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">المتطلبات</label>
                    <textarea name="requirements" rows="4"
                        class="w-full bg-background-light dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 transition-all resize-y"
                        placeholder="المستندات والمتطلبات اللازمة لتقديم الخدمة...">{{ old('requirements', $service->requirements) }}</textarea>
                    @error('requirements') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- display_order -->
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">ترتيب العرض</label>
                    <input type="number" name="display_order" value="{{ old('display_order', $service->display_order) }}" min="0"
                        class="w-full bg-background-light dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg h-10 px-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 transition-all"
                        placeholder="0">
                    @error('display_order') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- Checkboxes -->
                <div class="col-span-2 md:col-span-1 flex items-end gap-6 pb-1">
                    <div class="flex items-center gap-2">
                        <input type="checkbox" name="is_digital" id="is_digital" value="1" {{ old('is_digital', $service->is_digital) ? 'checked' : '' }}
                            class="rounded border-gray-300 text-primary focus:ring-primary">
                        <label for="is_digital" class="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">خدمة </label>
                    </div>
                    <div class="flex items-center gap-2">
                        <input type="checkbox" name="is_active" id="is_active" value="1" {{ old('is_active', $service->is_active) ? 'checked' : '' }}
                            class="rounded border-gray-300 text-primary focus:ring-primary">
                        <label for="is_active" class="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">نشطة</label>
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-700 mt-6">
                <a href="{{ route('admin.services.index') }}" class="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">إلغاء</a>
                <button type="submit" class="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-5 rounded shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                    <span class="material-symbols-outlined text-[20px]">save</span>
                    تحديث الخدمة
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
