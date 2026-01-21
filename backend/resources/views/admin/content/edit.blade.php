@extends('admin.layouts.app')

@section('title', 'تعديل المحتوى')

@section('content')
<div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">تعديل المحتوى</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">تحديث بيانات المقال: {{ $content->title_ar }}</p>
        </div>
        <div class="flex gap-2">
            @if($content->status === 'published')
                <a href="#" target="_blank" class="flex items-center gap-2 px-3 py-2 text-primary hover:bg-primary/5 rounded-lg transition-colors text-sm font-semibold">
                    <span class="material-symbols-outlined text-[18px]">open_in_new</span>
                    عرض في الموقع
                </a>
            @endif
            <a href="{{ route('admin.content.index') }}" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm">
                <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
                إلغاء
            </a>
        </div>
    </div>

    <!-- Form -->
    <form action="{{ route('admin.content.update', $content) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Content (2/3) -->
            <div class="lg:col-span-2 flex flex-col gap-6">
                <!-- Arabic Content -->
                <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">عربي</span>
                            المحتوى الرئيسي
                        </h3>
                        <button type="button" id="translateToEnBtn" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <span class="material-symbols-outlined text-[16px]">translate</span>
                            ترجمة إلى الإنجليزية
                            <span class="material-symbols-outlined text-[14px]">arrow_back</span>
                        </button>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">العنوان (بالعربية)</label>
                        <input type="text" name="title_ar" id="title_ar" value="{{ old('title_ar', $content->title_ar) }}" required
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                            placeholder="عنوان المقال أو الخبر">
                        @error('title_ar') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">نص المحتوى (بالعربية)</label>
                        <textarea name="content_ar" id="content_ar" rows="12" required
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400 leading-relaxed p-4"
                            placeholder="اكتب المحتوى هنا...">{{ old('content_ar', $content->content_ar) }}</textarea>
                        @error('content_ar') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>
                </div>

                <!-- English Content -->
                <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded">English</span>
                            المحتوى بالإنجليزية (اختياري)
                        </h3>
                        <button type="button" id="translateToArBtn" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                            ترجمة إلى العربية
                            <span class="material-symbols-outlined text-[16px]">translate</span>
                        </button>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Title (English)</label>
                        <input type="text" name="title_en" id="title_en" value="{{ old('title_en', $content->title_en) }}" dir="ltr"
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                            placeholder="Article Title">
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Content (English)</label>
                        <textarea name="content_en" id="content_en" rows="8" dir="ltr"
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400 leading-relaxed p-4"
                            placeholder="Write content here...">{{ old('content_en', $content->content_en) }}</textarea>
                    </div>
                </div>

                <!-- Translation Status -->
                <div id="translateStatus" class="hidden bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <div class="flex items-center gap-3">
                        <div class="animate-spin h-5 w-5 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                        <span class="text-sm text-purple-700 dark:text-purple-300 font-medium">جاري الترجمة...</span>
                    </div>
                </div>
            </div>

            <!-- Sidebar (1/3) -->
            <div class="flex flex-col gap-6">
                <!-- Publishing Options -->
                <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-xs">خيارات النشر</h3>
                    
                    <div class="flex flex-col gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">الحالة</label>
                            <select name="status" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                                <option value="draft" {{ (old('status') ?? $content->status) == 'draft' ? 'selected' : '' }}>مسودة</option>
                                <option value="published" {{ (old('status') ?? $content->status) == 'published' ? 'selected' : '' }}>منشور</option>
                                <option value="archived" {{ (old('status') ?? $content->status) == 'archived' ? 'selected' : '' }}>مؤرشف</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">التصنيف</label>
                            <select name="category" required class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                                @foreach($categories as $key => $label)
                                    <option value="{{ $key }}" {{ (old('category') ?? $content->category) == $key ? 'selected' : '' }}>{{ $label }}</option>
                                @endforeach
                            </select>
                            @error('category') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">تاريخ النشر</label>
                            <input type="date" name="published_at" value="{{ old('published_at', $content->published_at?->format('Y-m-d')) }}" 
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                        </div>
                        
                        <div class="pt-4 border-t border-slate-100 dark:border-slate-700">
                             <button type="submit" class="w-full py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                                <span class="material-symbols-outlined text-[20px]">save</span>
                                حفظ التغييرات
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Media & Metadata -->
                <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-xs">الوسائط والكلمات الدلالية</h3>
                    
                    <div class="flex flex-col gap-4">
                        @if(isset($content->metadata['image']))
                            <div class="mb-2">
                                <img src="{{ asset('storage/' . $content->metadata['image']) }}" alt="Featured" class="w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-700">
                            </div>
                        @endif
                        
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">الصورة البارزة</label>
                            <input type="file" name="image" accept="image/*" class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20">
                            @error('image') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">الكلمات الدلالية (Tags)</label>
                            @php
                                $tags = is_string($content->tags) ? $content->tags : implode(',', $content->tags ?? []);
                            @endphp
                            <input type="text" name="tags" value="{{ old('tags', $tags) }}" 
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                placeholder="اقتصاد، تجارة، قرارات...">
                            <p class="text-[10px] text-slate-400 mt-1">افصل بين الكلمات بفاصلة (,)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Translation functionality
        const translateToEnBtn = document.getElementById('translateToEnBtn');
        const translateToArBtn = document.getElementById('translateToArBtn');
        const translateStatus = document.getElementById('translateStatus');
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '{{ csrf_token() }}';

        async function translateText(text, sourceLang, targetLang) {
            const response = await fetch('{{ route("admin.content.translate") }}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    source_lang: sourceLang,
                    target_lang: targetLang,
                }),
            });

            if (!response.ok) {
                throw new Error('Translation failed');
            }

            return response.json();
        }

        function showStatus(show = true) {
            if (show) {
                translateStatus.classList.remove('hidden');
            } else {
                translateStatus.classList.add('hidden');
            }
        }

        function setButtonsDisabled(disabled = true) {
            translateToEnBtn.disabled = disabled;
            translateToArBtn.disabled = disabled;
        }

        // Translate Arabic to English
        translateToEnBtn.addEventListener('click', async function() {
            const titleAr = document.getElementById('title_ar').value.trim();
            const contentAr = document.getElementById('content_ar').value.trim();

            if (!titleAr && !contentAr) {
                alert('يرجى إدخال المحتوى العربي أولاً');
                return;
            }

            setButtonsDisabled(true);
            showStatus(true);

            try {
                // Translate title
                if (titleAr) {
                    const titleResult = await translateText(titleAr, 'ar', 'en');
                    if (titleResult.success) {
                        document.getElementById('title_en').value = titleResult.translated_text;
                    }
                }

                // Translate content
                if (contentAr) {
                    const contentResult = await translateText(contentAr, 'ar', 'en');
                    if (contentResult.success) {
                        document.getElementById('content_en').value = contentResult.translated_text;
                    }
                }
            } catch (error) {
                console.error('Translation error:', error);
                alert('فشلت عملية الترجمة. يرجى المحاولة مرة أخرى.');
            } finally {
                setButtonsDisabled(false);
                showStatus(false);
            }
        });

        // Translate English to Arabic
        translateToArBtn.addEventListener('click', async function() {
            const titleEn = document.getElementById('title_en').value.trim();
            const contentEn = document.getElementById('content_en').value.trim();

            if (!titleEn && !contentEn) {
                alert('Please enter English content first');
                return;
            }

            setButtonsDisabled(true);
            showStatus(true);

            try {
                // Translate title
                if (titleEn) {
                    const titleResult = await translateText(titleEn, 'en', 'ar');
                    if (titleResult.success) {
                        document.getElementById('title_ar').value = titleResult.translated_text;
                    }
                }

                // Translate content
                if (contentEn) {
                    const contentResult = await translateText(contentEn, 'en', 'ar');
                    if (contentResult.success) {
                        document.getElementById('content_ar').value = contentResult.translated_text;
                    }
                }
            } catch (error) {
                console.error('Translation error:', error);
                alert('Translation failed. Please try again.');
            } finally {
                setButtonsDisabled(false);
                showStatus(false);
            }
        });
    });
</script>
@endpush
