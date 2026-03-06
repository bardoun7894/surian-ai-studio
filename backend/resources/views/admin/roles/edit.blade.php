@extends('admin.layouts.app')

@section('title', 'تعديل الدور - وزارة الاقتصاد')

@section('content')
<div class="max-w-3xl mx-auto">
    <!-- Breadcrumbs -->
    <div class="flex flex-wrap items-center gap-2 mb-6 text-sm">
        <a class="text-slate-500 dark:text-slate-400 hover:text-primary font-medium" href="{{ route('admin.dashboard') }}">الرئيسية</a>
        <span class="material-symbols-outlined text-slate-400 text-[16px] rtl-flip">chevron_left</span>
        <a class="text-slate-500 dark:text-slate-400 hover:text-primary font-medium" href="{{ route('admin.roles.index') }}">الأدوار</a>
        <span class="material-symbols-outlined text-slate-400 text-[16px] rtl-flip">chevron_left</span>
        <span class="text-primary dark:text-slate-200 font-semibold">تعديل الدور</span>
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">تعديل الدور</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">تحديث بيانات وصلاحيات الدور: {{ $role->label ?? $role->name }}</p>
        </div>
        <a href="{{ route('admin.roles.index') }}" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm">
            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
            العودة للقائمة
        </a>
    </div>

    <!-- Form -->
    <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <form action="{{ route('admin.roles.update', $role) }}" method="POST" class="p-6">
            @csrf
            @method('PUT')

            <!-- Role Info Section -->
            <div class="bg-surface-light dark:bg-surface-dark rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-6">
                <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-[22px]">badge</span>
                    معلومات الدور
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Name (English slug) -->
                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">اسم الدور (بالإنجليزية)</label>
                        <input type="text" name="name" value="{{ old('name', $role->name) }}" required
                            class="w-full bg-background-light dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg h-10 px-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 transition-all"
                            placeholder="مثال: editor, moderator" dir="ltr">
                        <p class="text-xs text-slate-500 mt-1">معرّف فريد بالإنجليزية بدون مسافات (يُستخدم داخلياً).</p>
                        @error('name') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <!-- Label (Arabic display name) -->
                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الاسم العربي (التسمية)</label>
                        <input type="text" name="label" value="{{ old('label', $role->label) }}" required
                            class="w-full bg-background-light dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg h-10 px-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 transition-all"
                            placeholder="مثال: محرر، مشرف">
                        <p class="text-xs text-slate-500 mt-1">الاسم الظاهر للمستخدمين في الواجهة.</p>
                        @error('label') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>
                </div>
            </div>

            <!-- Permissions Section -->
            <div class="bg-surface-light dark:bg-surface-dark rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-6">
                <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-[22px]">key</span>
                    الصلاحيات
                </h2>
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">حدد الصلاحيات التي سيتمتع بها أصحاب هذا الدور.</p>

                @error('permissions') <p class="text-red-500 text-xs mb-4">{{ $message }}</p> @enderror

                <div class="space-y-4">
                    @foreach($permissionGroups as $groupKey => $group)
                    <div x-data="{ open: true }" class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                        <!-- Group Header -->
                        <button type="button" @click="open = !open" class="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-right">
                            <div class="flex items-center gap-3">
                                <span class="material-symbols-outlined text-primary text-[20px]">folder</span>
                                <span class="text-sm font-bold text-slate-900 dark:text-white">{{ $group['label'] }}</span>
                                <span class="text-xs text-slate-500 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">{{ count($group['permissions']) }}</span>
                            </div>
                            <span class="material-symbols-outlined text-slate-400 text-[20px] transition-transform" :class="open ? 'rotate-180' : ''">expand_more</span>
                        </button>

                        <!-- Group Permissions -->
                        <div x-show="open" x-collapse class="p-4 bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-slate-700">
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                @foreach($group['permissions'] as $permKey => $permLabel)
                                <label class="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group">
                                    <input type="checkbox" name="permissions[]" value="{{ $permKey }}"
                                        {{ in_array($permKey, old('permissions', $role->permissions ?? [])) ? 'checked' : '' }}
                                        class="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary cursor-pointer size-4">
                                    <span class="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{{ $permLabel }}</span>
                                </label>
                                @endforeach
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-700 mt-6">
                <a href="{{ route('admin.roles.index') }}" class="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">إلغاء</a>
                <button type="submit" class="px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                    <span class="material-symbols-outlined text-[20px]">save</span>
                    تحديث الدور
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
