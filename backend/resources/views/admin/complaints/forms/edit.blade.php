@extends('admin.layouts.app')

@section('title', 'تعديل نموذج الشكوى')

@section('content')
<div class="max-w-4xl mx-auto animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">تعديل نموذج الشكوى</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">قم بتعديل الحقول المطلوبة لهذا النموذج.</p>
        </div>
        <a href="{{ route('admin.complaints.forms.index') }}" class="text-slate-500 hover:text-slate-700 text-sm font-bold flex items-center gap-1">
            <span class="material-symbols-outlined">arrow_forward</span>
            عودة
        </a>
    </div>

    <form action="{{ route('admin.complaints.forms.update', $form) }}" method="POST" class="flex flex-col gap-6">
        @csrf
        @method('PUT')

        <!-- Basic Info -->
        <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 class="font-bold text-slate-900 dark:text-white mb-4">معلومات النموذج</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-500 mb-1.5">اسم النموذج</label>
                    <input type="text" name="name" value="{{ old('name', $form->name) }}" required class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-gov-emerald focus:border-gov-emerald text-sm">
                    @error('name')
                        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                    @enderror
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 mb-1.5">المديرية التابعة</label>
                    <select name="directorate_id" required class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-gov-emerald focus:border-gov-emerald text-sm">
                        <option value="">اختر المديرية...</option>
                        @foreach($directorates as $dir)
                            <option value="{{ $dir->id }}" {{ old('directorate_id', $form->directorate_id) == $dir->id ? 'selected' : '' }}>{{ $dir->name }}</option>
                        @endforeach
                    </select>
                    @error('directorate_id')
                        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                    @enderror
                </div>
                <div class="flex items-center gap-2 mt-4">
                     <input type="checkbox" name="is_active" value="1" {{ old('is_active', $form->is_active) ? 'checked' : '' }} class="rounded border-slate-300 text-gov-emerald focus:ring-gov-emerald">
                     <label class="text-sm text-slate-700 dark:text-slate-300 font-medium">تفعيل النموذج</label>
                </div>
            </div>
        </div>

        <!-- Form Builder -->
        <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-slate-900 dark:text-white">بناء الحقول</h3>
                <button type="button" id="addFieldBtn" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                    <span class="material-symbols-outlined text-[16px]">add</span>
                    إضافة حقل
                </button>
            </div>

            <div id="fieldsContainer" class="flex flex-col gap-4">
                @php
                    $fields = old('fields', $form->fields ?? []);
                @endphp

                @if(empty($fields))
                    <div class="empty-state text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                        <p class="text-slate-400 text-sm">لم يتم إضافة حقول بعد. اضغط "إضافة حقل" للبدء.</p>
                    </div>
                @else
                    @foreach($fields as $index => $field)
                        <div class="field-row bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-start relative group">
                            <button type="button" class="remove-field absolute left-2 top-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span class="material-symbols-outlined text-[18px]">close</span>
                            </button>

                            <div class="flex-1 w-full">
                                <label class="block text-xs font-bold text-slate-500 mb-1">عنوان الحقل (Label)</label>
                                <input type="text" name="fields[{{ $index }}][label]" value="{{ $field['label'] ?? '' }}" required class="w-full rounded border-slate-300 text-sm">
                            </div>

                            <div class="w-full md:w-1/4">
                                <label class="block text-xs font-bold text-slate-500 mb-1">النوع</label>
                                <select name="fields[{{ $index }}][type]" class="w-full rounded border-slate-300 text-sm">
                                    <option value="text" {{ ($field['type'] ?? '') == 'text' ? 'selected' : '' }}>نص قصير</option>
                                    <option value="textarea" {{ ($field['type'] ?? '') == 'textarea' ? 'selected' : '' }}>نص طويل</option>
                                    <option value="number" {{ ($field['type'] ?? '') == 'number' ? 'selected' : '' }}>رقم</option>
                                    <option value="date" {{ ($field['type'] ?? '') == 'date' ? 'selected' : '' }}>تاريخ</option>
                                    <option value="file" {{ ($field['type'] ?? '') == 'file' ? 'selected' : '' }}>مرفق (ملف)</option>
                                </select>
                            </div>

                            <div class="w-full md:w-auto pt-7 flex items-center gap-2">
                                <input type="hidden" name="fields[{{ $index }}][required]" value="0">
                                <input type="checkbox" name="fields[{{ $index }}][required]" value="1" {{ !empty($field['required']) ? 'checked' : '' }} class="rounded border-slate-300 text-gov-emerald focus:ring-gov-emerald">
                                <span class="text-xs text-slate-600">مطلوب؟</span>
                            </div>
                        </div>
                    @endforeach
                @endif
            </div>
        </div>

        <div class="flex justify-between pt-4">
            <button type="button" onclick="if(confirm('هل أنت متأكد من حذف هذا النموذج؟')) document.getElementById('deleteForm').submit();" class="bg-red-50 text-red-600 px-4 py-2.5 rounded-lg font-bold hover:bg-red-100 transition-all flex items-center gap-2">
                <span class="material-symbols-outlined">delete</span>
                حذف النموذج
            </button>
            <button type="submit" class="bg-gov-emerald text-white px-6 py-2.5 rounded-lg font-bold hover:bg-gov-emeraldLight shadow-md transition-all flex items-center gap-2">
                <span class="material-symbols-outlined">save</span>
                حفظ التغييرات
            </button>
        </div>
    </form>

    <!-- Delete Form -->
    <form id="deleteForm" action="{{ route('admin.complaints.forms.destroy', $form) }}" method="POST" class="hidden">
        @csrf
        @method('DELETE')
    </form>
</div>

<!-- Template for new field (Hidden) -->
<template id="fieldTemplate">
    <div class="field-row bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-start relative group">
        <button type="button" class="remove-field absolute left-2 top-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <span class="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div class="flex-1 w-full">
            <label class="block text-xs font-bold text-slate-500 mb-1">عنوان الحقل (Label)</label>
            <input type="text" name="fields[INDEX][label]" required class="w-full rounded border-slate-300 text-sm">
        </div>

        <div class="w-full md:w-1/4">
            <label class="block text-xs font-bold text-slate-500 mb-1">النوع</label>
            <select name="fields[INDEX][type]" class="w-full rounded border-slate-300 text-sm">
                <option value="text">نص قصير</option>
                <option value="textarea">نص طويل</option>
                <option value="number">رقم</option>
                <option value="date">تاريخ</option>
                <option value="file">مرفق (ملف)</option>
            </select>
        </div>

        <div class="w-full md:w-auto pt-7 flex items-center gap-2">
            <input type="hidden" name="fields[INDEX][required]" value="0">
            <input type="checkbox" name="fields[INDEX][required]" value="1" class="rounded border-slate-300 text-gov-emerald focus:ring-gov-emerald">
            <span class="text-xs text-slate-600">مطلوب؟</span>
        </div>
    </div>
</template>

@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const container = document.getElementById('fieldsContainer');
        const template = document.getElementById('fieldTemplate');
        const btn = document.getElementById('addFieldBtn');

        // Get highest existing index
        let index = container.querySelectorAll('.field-row').length;

        // Add remove handlers to existing fields
        container.querySelectorAll('.remove-field').forEach(function(removeBtn) {
            removeBtn.addEventListener('click', function(e) {
                e.target.closest('.field-row').remove();
                checkEmpty();
            });
        });

        btn.addEventListener('click', function() {
            // Remove empty state if exists
            const emptyState = container.querySelector('.empty-state');
            if(emptyState) emptyState.remove();

            const clone = template.content.cloneNode(true);

            // Update names with unique index
            clone.querySelectorAll('[name*="INDEX"]').forEach(el => {
                el.name = el.name.replace('INDEX', index);
            });

            // Add remove handler
            clone.querySelector('.remove-field').addEventListener('click', function(e) {
                e.target.closest('.field-row').remove();
                checkEmpty();
            });

            container.appendChild(clone);
            index++;
        });

        function checkEmpty() {
            if(container.querySelectorAll('.field-row').length === 0) {
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'empty-state text-center py-8 border-2 border-dashed border-slate-200 rounded-lg';
                emptyDiv.innerHTML = '<p class="text-slate-400 text-sm">لم يتم إضافة حقول بعد. اضغط "إضافة حقل" للبدء.</p>';
                container.appendChild(emptyDiv);
            }
        }
    });
</script>
@endpush
