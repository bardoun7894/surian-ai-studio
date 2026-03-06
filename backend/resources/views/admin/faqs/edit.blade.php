@extends('admin.layouts.app')

@section('title', 'تعديل السؤال')

@section('content')
<div class="max-w-3xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">تعديل السؤال</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">تحديث محتوى السؤال والإجابة.</p>
        </div>
        <a href="{{ route('admin.faqs.index') }}" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm">
            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
            العودة للقائمة
        </a>
    </div>

    <!-- Form -->
    <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <form action="{{ route('admin.faqs.update', $faq) }}" method="POST" class="p-6">
            @csrf
            @method('PUT')
            
            <div class="flex flex-col gap-6">
                <!-- Arabic Q&A -->
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                    <h3 class="font-bold text-slate-900 dark:text-white mb-4 text-sm flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-primary"></span>
                        النسخة العربية (مطلوب)
                    </h3>
                    
                    <div class="mb-4">
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">السؤال</label>
                        <input type="text" name="question_ar" value="{{ old('question_ar', $faq->question_ar) }}" required 
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400">
                        @error('question_ar') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>
                    
                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الإجابة</label>
                        <textarea name="answer_ar" rows="4" required
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400 leading-relaxed">{{ old('answer_ar', $faq->answer_ar) }}</textarea>
                        @error('answer_ar') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>
                </div>

                <!-- English Q&A -->
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                    <h3 class="font-bold text-slate-900 dark:text-white mb-4 text-sm flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-slate-400"></span>
                        English Version (Optional)
                    </h3>
                    
                    <div class="mb-4">
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Question</label>
                        <input type="text" name="question_en" value="{{ old('question_en', $faq->question_en) }}" dir="ltr"
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Answer</label>
                        <textarea name="answer_en" rows="4" dir="ltr"
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400 leading-relaxed">{{ old('answer_en', $faq->answer_en) }}</textarea>
                    </div>
                </div>

                <!-- Settings -->
                <div class="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="is_published" value="1" {{ old('is_published', $faq->is_published) ? 'checked' : '' }} class="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary">
                        <span class="text-sm font-medium text-slate-700 dark:text-slate-300">نشر هذا السؤال فوراً</span>
                    </label>
                    
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="suggested_by_ai" value="1" {{ old('suggested_by_ai', $faq->suggested_by_ai) ? 'checked' : '' }} class="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary">
                        <span class="text-sm font-medium text-slate-700 dark:text-slate-300">تم اقتراحه بواسطة AI</span>
                    </label>
                </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-700 mt-6">
                <a href="{{ route('admin.faqs.index') }}" class="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">إلغاء</a>
                <button type="submit" class="px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                    <span class="material-symbols-outlined text-[20px]">save</span>
                    حفظ التغييرات
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
