@extends('admin.layouts.app')

@section('title', 'إضافة مستخدم جديد')

@section('content')
<div class="max-w-3xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">إضافة مستخدم جديد</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">إنشاء حساب جديد للموظفين أو المسؤولين.</p>
        </div>
        <a href="{{ route('admin.users.index') }}" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm">
            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
            العودة للقائمة
        </a>
    </div>

    <!-- Form -->
    <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <form action="{{ route('admin.users.store') }}" method="POST" class="p-6">
            @csrf
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <!-- First Name -->
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الاسم الأول</label>
                    <input type="text" name="first_name" value="{{ old('first_name') }}" required
                        class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                        placeholder="الاسم الأول">
                    @error('first_name') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- Father Name -->
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">اسم الأب</label>
                    <input type="text" name="father_name" value="{{ old('father_name') }}" required
                        class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                        placeholder="اسم الأب">
                    @error('father_name') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- Last Name -->
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الكنية</label>
                    <input type="text" name="last_name" value="{{ old('last_name') }}" required
                        class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                        placeholder="الكنية">
                    @error('last_name') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- Email -->
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">البريد الإلكتروني</label>
                    <input type="email" name="email" value="{{ old('email') }}" required
                        class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                        placeholder="email@example.com">
                    @error('email') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- Phone -->
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">رقم الهاتف</label>
                    <input type="text" name="phone" value="{{ old('phone') }}"
                        class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                        placeholder="09XXXXXXXX">
                    @error('phone') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- National ID -->
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الرقم الوطني</label>
                    <input type="text" name="national_id" value="{{ old('national_id') }}"
                        class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                        placeholder="الرقم الوطني">
                    @error('national_id') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- Birth Date -->
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">تاريخ الميلاد</label>
                    <input type="date" name="birth_date" value="{{ old('birth_date') }}"
                        class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary">
                    @error('birth_date') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- Governorate -->
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">المحافظة</label>
                    <input type="text" name="governorate" value="{{ old('governorate') }}"
                        class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                        placeholder="المحافظة">
                    @error('governorate') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- Role -->
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الصلاحية (الدور)</label>
                    <div class="relative">
                        <select name="role" required class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary appearance-none">
                            <option value="" disabled selected>اختر الصلاحية</option>
                            @foreach($roles as $role)
                                <option value="{{ $role->name }}" {{ old('role') == $role->name ? 'selected' : '' }}>
                                    {{ $role->name == 'admin' ? 'مدير نظام' : ($role->name == 'staff' ? 'موظف' : $role->name) }}
                                </option>
                            @endforeach
                        </select>
                        <span class="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                    @error('role') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- Password -->
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">كلمة المرور</label>
                    <input type="password" name="password" required 
                        class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                        placeholder="********">
                    @error('password') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- Confirm Password -->
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">تأكيد كلمة المرور</label>
                    <input type="password" name="password_confirmation" required 
                        class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                        placeholder="********">
                </div>

                <!-- Directorate (Optional) -->
                <div class="col-span-2">
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">المديرية التابعة (اختياري)</label>
                    <div class="relative">
                        <select name="directorate_id" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary appearance-none">
                            <option value="">لا يوجد (مدير عام / غير محدد)</option>
                            @foreach($directorates as $dir)
                                <option value="{{ $dir->id }}" {{ old('directorate_id') == $dir->id ? 'selected' : '' }}>{{ $dir->name }}</option>
                            @endforeach
                        </select>
                        <span class="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                    <p class="text-xs text-slate-500 mt-1">حدد المديرية إذا كان المستخدم موظفاً يتبع لجهة محددة.</p>
                    @error('directorate_id') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-700 mt-6">
                <a href="{{ route('admin.users.index') }}" class="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">إلغاء</a>
                <button type="submit" class="px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                    <span class="material-symbols-outlined text-[20px]">save</span>
                    حفظ المستخدم
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
