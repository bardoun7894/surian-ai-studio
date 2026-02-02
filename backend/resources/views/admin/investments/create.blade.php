@extends('admin.layouts.app')

@section('title', 'إضافة فرصة استثمارية - وزارة الاقتصاد')

@section('content')
<div class="max-w-4xl mx-auto">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 mb-6">
        <a class="text-primary/70 hover:text-primary text-sm font-medium flex items-center" href="{{ route('admin.dashboard') }}">
            <span class="material-symbols-outlined text-sm ml-1 rtl-flip">home</span> الرئيسية
        </a>
        <span class="text-slate-400 text-sm">/</span>
        <a class="text-primary/70 hover:text-primary text-sm font-medium" href="{{ route('admin.investments.index') }}">الاستثمارات</a>
        <span class="text-slate-400 text-sm">/</span>
        <span class="text-slate-900 dark:text-white text-sm font-semibold">إضافة فرصة</span>
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">إضافة فرصة استثمارية</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">إنشاء فرصة استثمارية جديدة للعرض على المستثمرين.</p>
        </div>
        <a href="{{ route('admin.investments.index') }}" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm">
            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
            إلغاء والعودة
        </a>
    </div>

    <!-- Form -->
    <form action="{{ route('admin.investments.store') }}" method="POST">
        @csrf

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Content (2/3) -->
            <div class="lg:col-span-2 flex flex-col gap-6">
                <!-- Arabic Content -->
                <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                    <div class="flex items-center mb-4">
                        <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">عربي</span>
                            البيانات الرئيسية
                        </h3>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">العنوان (بالعربية) <span class="text-red-500">*</span></label>
                        <input type="text" name="title_ar" value="{{ old('title_ar') }}" required
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                            placeholder="عنوان الفرصة الاستثمارية">
                        @error('title_ar') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الوصف (بالعربية)</label>
                        <textarea name="description_ar" rows="6"
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400 leading-relaxed p-4"
                            placeholder="وصف تفصيلي للفرصة الاستثمارية...">{{ old('description_ar') }}</textarea>
                        @error('description_ar') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">القطاع (بالعربية)</label>
                            <input type="text" name="sector_ar" value="{{ old('sector_ar') }}"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                                placeholder="مثال: الصناعة، الزراعة، التكنولوجيا">
                            @error('sector_ar') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الموقع (بالعربية)</label>
                            <input type="text" name="location_ar" value="{{ old('location_ar') }}"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                                placeholder="مثال: دمشق، حلب">
                            @error('location_ar') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>
                    </div>
                </div>

                <!-- English Content -->
                <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                    <div class="flex items-center mb-4">
                        <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded">English</span>
                            البيانات بالإنجليزية (اختياري)
                        </h3>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Title (English)</label>
                        <input type="text" name="title_en" value="{{ old('title_en') }}" dir="ltr"
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                            placeholder="Investment Opportunity Title">
                        @error('title_en') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description (English)</label>
                        <textarea name="description_en" rows="6" dir="ltr"
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400 leading-relaxed p-4"
                            placeholder="Detailed description of the investment opportunity...">{{ old('description_en') }}</textarea>
                        @error('description_en') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Sector (English)</label>
                            <input type="text" name="sector_en" value="{{ old('sector_en') }}" dir="ltr"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                                placeholder="e.g. Industry, Agriculture, Technology">
                            @error('sector_en') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Location (English)</label>
                            <input type="text" name="location_en" value="{{ old('location_en') }}" dir="ltr"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                                placeholder="e.g. Damascus, Aleppo">
                            @error('location_en') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar (1/3) -->
            <div class="flex flex-col gap-6">
                <!-- Investment Details -->
                <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-xs">تفاصيل الاستثمار</h3>

                    <div class="flex flex-col gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">مبلغ الاستثمار</label>
                            <input type="number" name="investment_amount" value="{{ old('investment_amount') }}" step="0.01" min="0"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                placeholder="0.00">
                            @error('investment_amount') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">العملة</label>
                            <select name="currency" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                                <option value="SYP" {{ old('currency') == 'SYP' ? 'selected' : '' }}>ليرة سورية (SYP)</option>
                                <option value="USD" {{ old('currency') == 'USD' ? 'selected' : '' }}>دولار أمريكي (USD)</option>
                                <option value="EUR" {{ old('currency') == 'EUR' ? 'selected' : '' }}>يورو (EUR)</option>
                            </select>
                            @error('currency') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">الحالة</label>
                            <select name="status" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                                <option value="available" {{ old('status') == 'available' ? 'selected' : '' }}>متاحة</option>
                                <option value="under_review" {{ old('status') == 'under_review' ? 'selected' : '' }}>قيد المراجعة</option>
                                <option value="closed" {{ old('status') == 'closed' ? 'selected' : '' }}>مغلقة</option>
                            </select>
                            @error('status') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">التصنيف</label>
                            <input type="text" name="category" value="{{ old('category') }}"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                placeholder="مثال: عقارات، صناعة، تقنية">
                            @error('category') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">الترتيب</label>
                            <input type="number" name="order" value="{{ old('order', 0) }}" min="0"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                            @error('order') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>
                    </div>
                </div>

                <!-- Contact Info -->
                <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-xs">معلومات التواصل</h3>

                    <div class="flex flex-col gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">البريد الإلكتروني</label>
                            <input type="email" name="contact_email" value="{{ old('contact_email') }}" dir="ltr"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                placeholder="email@example.com">
                            @error('contact_email') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">رقم الهاتف</label>
                            <input type="text" name="contact_phone" value="{{ old('contact_phone') }}" dir="ltr"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                placeholder="+963 XX XXX XXXX">
                            @error('contact_phone') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>
                    </div>
                </div>

                <!-- Options & Submit -->
                <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-xs">خيارات العرض</h3>

                    <div class="flex flex-col gap-4">
                        <label class="flex items-center gap-3 cursor-pointer">
                            <input type="hidden" name="is_active" value="0">
                            <input type="checkbox" name="is_active" value="1" {{ old('is_active', true) ? 'checked' : '' }}
                                class="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary focus:ring-offset-0">
                            <div>
                                <span class="text-sm font-bold text-slate-700 dark:text-slate-300">نشط</span>
                                <p class="text-xs text-slate-400">إظهار الفرصة في الموقع</p>
                            </div>
                        </label>

                        <label class="flex items-center gap-3 cursor-pointer">
                            <input type="hidden" name="is_featured" value="0">
                            <input type="checkbox" name="is_featured" value="1" {{ old('is_featured') ? 'checked' : '' }}
                                class="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary focus:ring-offset-0">
                            <div>
                                <span class="text-sm font-bold text-slate-700 dark:text-slate-300">مميز</span>
                                <p class="text-xs text-slate-400">عرض بشكل بارز في الصفحة الرئيسية</p>
                            </div>
                        </label>

                        <div class="pt-4 border-t border-slate-100 dark:border-slate-700">
                            <button type="submit" class="w-full py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                                <span class="material-symbols-outlined text-[20px]">save</span>
                                إنشاء الفرصة
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection
