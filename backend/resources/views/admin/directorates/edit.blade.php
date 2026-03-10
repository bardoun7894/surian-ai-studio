@extends('admin.layouts.app')

@section('title', 'تعديل بيانات المديرية')

@section('content')
<div class="max-w-2xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">تعديل بيانات المديرية</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">تحديث معلومات مديرية: {{ $directorate->name }}</p>
        </div>
        <a href="{{ route('admin.directorates.index') }}" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm">
            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
            العودة للقائمة
        </a>
    </div>

    <!-- Form -->
    <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <form action="{{ route('admin.directorates.update', $directorate) }}" method="POST" class="p-6">
            @csrf
            @method('PUT')
            
            <div class="flex flex-col gap-6">
                <!-- Name -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">اسم المديرية</label>
                    <input type="text" name="name" value="{{ old('name', $directorate->name) }}" required 
                        class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400">
                    @error('name') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- Description -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الوصف / المهام</label>
                    <textarea name="description" rows="3"
                        class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400">{{ old('description', $directorate->description) }}</textarea>
                    @error('description') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- Contact Info Section Header -->
                <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">معلومات التواصل</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">هذه المعلومات ستظهر في صفحة المديرية على الموقع</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Email -->
                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">البريد الإلكتروني الرسمي</label>
                        <input type="email" name="email" value="{{ old('email', $directorate->email) }}" dir="ltr"
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                            placeholder="directorate@moe.gov.sy">
                        @error('email') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <!-- Phone -->
                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">رقم الهاتف</label>
                        <input type="text" name="phone" value="{{ old('phone', $directorate->phone) }}" dir="ltr"
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                            placeholder="+963 ...">
                        @error('phone') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Address AR -->
                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">العنوان بالعربية</label>
                        <input type="text" name="address_ar" value="{{ old('address_ar', $directorate->address_ar) }}"
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                            placeholder="دمشق - ...">
                        @error('address_ar') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <!-- Address EN -->
                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">العنوان بالإنجليزية</label>
                        <input type="text" name="address_en" value="{{ old('address_en', $directorate->address_en) }}" dir="ltr"
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                            placeholder="Damascus - ...">
                        @error('address_en') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>
                </div>

                <!-- Website -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الموقع الإلكتروني</label>
                    <input type="url" name="website" value="{{ old('website', $directorate->website) }}" dir="ltr"
                        class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                        placeholder="https://...">
                    @error('website') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Working Hours AR -->
                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">ساعات العمل بالعربية</label>
                        <input type="text" name="working_hours_ar" value="{{ old('working_hours_ar', $directorate->working_hours_ar) }}"
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                            placeholder="الأحد - الخميس: 8:00 ص - 3:30 م">
                        @error('working_hours_ar') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <!-- Working Hours EN -->
                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">ساعات العمل بالإنجليزية</label>
                        <input type="text" name="working_hours_en" value="{{ old('working_hours_en', $directorate->working_hours_en) }}" dir="ltr"
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                            placeholder="Sunday - Thursday: 8:00 AM - 3:30 PM">
                        @error('working_hours_en') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-700 mt-6">
                <a href="{{ route('admin.directorates.index') }}" class="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">إلغاء</a>
                <button type="submit" class="px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                    <span class="material-symbols-outlined text-[20px]">save</span>
                    حفظ التغييرات
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
