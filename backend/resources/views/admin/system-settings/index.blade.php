@extends('admin.layouts.app')

@section('title', 'إعدادات النظام المتقدمة - وزارة الاقتصاد')

@section('content')
<div class="max-w-[1440px] mx-auto w-full">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 mb-6 text-sm">
        <a class="text-slate-500 dark:text-slate-400 hover:text-primary font-medium" href="{{ route('admin.dashboard') }}">الرئيسية</a>
        <span class="material-symbols-outlined text-slate-400 text-[16px] rtl-flip">chevron_left</span>
        <span class="text-primary dark:text-slate-200 font-semibold">إعدادات النظام المتقدمة</span>
    </div>

    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div class="flex flex-col gap-2">
            <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">إعدادات النظام المتقدمة</h1>
            <p class="text-slate-500 dark:text-slate-400 text-base max-w-2xl">إدارة إعدادات النظام المتقدمة</p>
        </div>
    </div>

    <!-- Success Message -->
    @if(session('success'))
        <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-4 mb-6 flex items-center gap-3">
            <span class="material-symbols-outlined text-green-600">check_circle</span>
            <span class="text-sm font-medium text-green-700 dark:text-green-400">{{ session('success') }}</span>
        </div>
    @endif

    <!-- Settings Form -->
    <form action="{{ route('admin.system-settings.update') }}" method="POST">
        @csrf
        @method('PUT')

        @foreach($settingsGrouped as $groupName => $settings)
            <div class="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded shadow-sm overflow-hidden mb-6">
                <!-- Group Header -->
                <div class="bg-primary px-6 py-4">
                    <h2 class="text-lg font-bold text-white">{{ $groupName }}</h2>
                </div>

                <!-- Group Settings -->
                <div class="p-6 space-y-6">
                    @foreach($settings as $setting)
                        <div class="flex flex-col gap-2">
                            <label for="setting_{{ $setting->key }}" class="text-sm font-bold text-slate-700 dark:text-slate-300">
                                {{ $setting->label_ar }}
                            </label>

                            @if($setting->type === 'boolean')
                                <div class="flex items-center gap-3">
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input type="hidden" name="settings[{{ $setting->key }}]" value="0">
                                        <input type="checkbox"
                                            id="setting_{{ $setting->key }}"
                                            name="settings[{{ $setting->key }}]"
                                            value="1"
                                            {{ $setting->getTypedValue() ? 'checked' : '' }}
                                            class="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary h-5 w-5">
                                        <span class="mr-3 text-sm text-slate-600 dark:text-slate-400">{{ $setting->getTypedValue() ? 'مفعل' : 'معطل' }}</span>
                                    </label>
                                </div>
                            @elseif($setting->type === 'integer')
                                <input type="number"
                                    id="setting_{{ $setting->key }}"
                                    name="settings[{{ $setting->key }}]"
                                    value="{{ $setting->getTypedValue() }}"
                                    class="w-full md:w-96 rounded border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                            @elseif($setting->type === 'json')
                                <textarea
                                    id="setting_{{ $setting->key }}"
                                    name="settings[{{ $setting->key }}]"
                                    rows="4"
                                    dir="ltr"
                                    class="w-full rounded border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm font-mono">{{ is_array($setting->getTypedValue()) || is_object($setting->getTypedValue()) ? json_encode($setting->getTypedValue(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) : $setting->getTypedValue() }}</textarea>
                            @else
                                <input type="text"
                                    id="setting_{{ $setting->key }}"
                                    name="settings[{{ $setting->key }}]"
                                    value="{{ $setting->getTypedValue() }}"
                                    class="w-full md:w-96 rounded border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                            @endif

                            @error("settings.{$setting->key}")
                                <p class="text-xs text-red-600 dark:text-red-400 mt-1">{{ $message }}</p>
                            @enderror
                        </div>
                    @endforeach
                </div>
            </div>
        @endforeach

        <!-- Submit Button -->
        <div class="flex justify-end mt-6">
            <button type="submit" class="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
                <span class="material-symbols-outlined text-[20px]">save</span>
                حفظ الإعدادات
            </button>
        </div>
    </form>
</div>
@endsection
