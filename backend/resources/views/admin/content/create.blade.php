@extends('admin.layouts.app')

@section('title', 'إضافة محتوى جديد')

@section('content')
<div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">إضافة محتوى جديد</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">نشر الأخبار، الإعلانات، القرارات، أو الخدمات.</p>
        </div>
        <a href="{{ route('admin.content.index') }}" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm">
            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
            الغاء والعودة
        </a>
    </div>

    <!-- Form -->
    <form id="contentForm" action="{{ route('admin.content.store') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <!-- Hidden fields for English translation -->
        <input type="hidden" name="title_en" id="title_en" value="{{ old('title_en') }}">
        <input type="hidden" name="content_en" id="content_en" value="{{ old('content_en') }}">

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
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">العنوان</label>
                        <input type="text" name="title_ar" id="title_ar" value="{{ old('title_ar') }}" required
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                            placeholder="عنوان المقال أو الخبر">
                        @error('title_ar') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">نص المحتوى</label>
                        <textarea name="content_ar" id="content_ar" rows="12" required
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400 leading-relaxed p-4"
                            placeholder="اكتب المحتوى هنا...">{{ old('content_ar') }}</textarea>
                        @error('content_ar') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>
                </div>

                <!-- Translation Status -->
                <div id="translateStatus" class="hidden bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <div class="flex items-center gap-3">
                        <div class="animate-spin h-5 w-5 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                        <span id="translateStatusText" class="text-sm text-purple-700 dark:text-purple-300 font-medium">جاري الترجمة التلقائية إلى الإنجليزية...</span>
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
                                <option value="draft" {{ old('status') == 'draft' ? 'selected' : '' }}>مسودة</option>
                                <option value="published" {{ old('status') == 'published' ? 'selected' : '' }}>منشور</option>
                                <option value="archived" {{ old('status') == 'archived' ? 'selected' : '' }}>مؤرشف</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">التصنيف</label>
                            <select name="category" id="categorySelect" required class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                                <option value="" disabled selected>اختر التصنيف</option>
                                @foreach($categories as $key => $label)
                                    <option value="{{ $key }}" {{ old('category') == $key ? 'selected' : '' }}>{{ $label }}</option>
                                @endforeach
                            </select>
                            @error('category') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <!-- Directorate Field (Shown for news category) -->
                        <div id="directorateField" class="hidden">
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">الإدارة المركزية</label>
                            <select name="directorate_id" id="directorateSelect" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                                <option value="">-- بدون إدارة --</option>
                                @foreach($directorates as $directorate)
                                    <option value="{{ $directorate->id }}" {{ old('directorate_id') == $directorate->id ? 'selected' : '' }}>{{ $directorate->name_ar }}</option>
                                @endforeach
                            </select>
                            <p class="text-[10px] text-slate-400 mt-1">اختر الإدارة المركزية التابع لها هذا الخبر</p>
                        </div>

                         <!-- Ticker Settings (for news items) -->
                        <div id="tickerFields" class="hidden flex-col gap-3 pt-4 mt-4 border-t border-slate-100 dark:border-slate-700">
                            <h4 class="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                                <span class="material-symbols-outlined text-[16px]">breaking_news</span>
                                شريط الأخبار العاجلة
                            </h4>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <label for="show_in_ticker" class="text-xs font-bold text-slate-700 dark:text-slate-300">عرض في شريط الأخبار</label>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="show_in_ticker" id="show_in_ticker" value="1" class="sr-only peer" {{ old('show_in_ticker') ? 'checked' : '' }}>
                                    <div class="w-9 h-5 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                                </label>
                            </div>
                            <div id="tickerDurationField" class="hidden">
                                <label class="block text-xs font-bold text-slate-500 mb-1.5">مدة العرض</label>
                                <select name="ticker_duration" id="ticker_duration" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-amber-500 focus:border-amber-500 text-sm">
                                    <option value="">-- اختر المدة --</option>
                                    <option value="24h" {{ old('ticker_duration') == '24h' ? 'selected' : '' }}>24 ساعة</option>
                                    <option value="48h" {{ old('ticker_duration') == '48h' ? 'selected' : '' }}>48 ساعة</option>
                                    <option value="1w" {{ old('ticker_duration') == '1w' ? 'selected' : '' }}>أسبوع واحد</option>
                                    <option value="1m" {{ old('ticker_duration') == '1m' ? 'selected' : '' }}>شهر واحد</option>
                                </select>
                                <p class="text-[10px] text-amber-500 mt-1">سيظهر الخبر في شريط الأخبار العاجلة للمدة المحددة من لحظة الحفظ</p>
                            </div>
                        </div>

                        <!-- Service Fields (Hidden by default) -->
                         <div id="serviceFields" class="hidden flex-col gap-4 pt-4 mt-4 border-t border-slate-100 dark:border-slate-700">
                             <h4 class="text-xs font-bold text-gov-teal uppercase tracking-wider mb-2">معلومات الخدمة</h4>

                             <div>
                                 <label class="block text-xs font-bold text-slate-500 mb-1.5">متطلبات الخدمة</label>
                                 <textarea name="service_requirements" rows="3" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 text-sm p-2">{{ old('service_requirements') }}</textarea>
                             </div>

                             <div>
                                 <label class="block text-xs font-bold text-slate-500 mb-1.5">الرسوم المتوقعة</label>
                                 <input type="text" name="service_fees" value="{{ old('service_fees') }}" class="w-full rounded-lg border-slate-300 bg-slate-50 text-sm">
                             </div>

                              <div>
                                 <label class="block text-xs font-bold text-slate-500 mb-1.5">المدة الزمنية</label>
                                 <input type="text" name="service_duration" value="{{ old('service_duration') }}" class="w-full rounded-lg border-slate-300 bg-slate-50 text-sm" placeholder="مثال: 3 أيام عمل">
                             </div>
                         </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">تاريخ النشر</label>
                            <input type="date" name="published_at" value="{{ old('published_at', now()->format('Y-m-d')) }}"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                        </div>

                        <!-- Auto-translate toggle -->
                        <div class="pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[18px] text-purple-600">translate</span>
                                    <label for="autoTranslate" class="text-xs font-bold text-slate-700 dark:text-slate-300">ترجمة تلقائية للإنجليزية</label>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" id="autoTranslate" class="sr-only peer" checked>
                                    <div class="w-9 h-5 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                                </label>
                            </div>
                            <p class="text-[10px] text-slate-400 mt-1.5 mr-6">عند التفعيل، سيتم ترجمة العنوان والمحتوى تلقائياً إلى الإنجليزية عند الحفظ</p>
                        </div>

                        <div class="pt-4 border-t border-slate-100 dark:border-slate-700">
                             <button type="submit" id="submitBtn" class="w-full py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                                <span class="material-symbols-outlined text-[20px]">save</span>
                                حفظ ونشر
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Media & Metadata -->
                <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-xs">الوسائط والكلمات الدلالية</h3>

                    <div class="flex flex-col gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">معرض الصور</label>
                            <!-- Hidden file input -->
                            <input type="file" name="images[]" id="imageInput" accept="image/*" multiple class="hidden">
                            <!-- Drop zone -->
                            <div id="dropZone" class="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                                 >
                                <span class="material-symbols-outlined text-[32px] text-slate-400">add_photo_alternate</span>
                                <p class="text-xs text-slate-500 mt-1">اضغط لاختيار الصور أو اسحبها هنا</p>
                                <p class="text-[10px] text-slate-400 mt-0.5">يمكن اختيار عدة صور معاً (الحد الأقصى 10 صور)</p>
                            </div>
                            <!-- Image previews -->
                            <div id="imagePreviews" class="hidden mt-3">
                                <div class="flex items-center justify-between mb-2">
                                    <span id="imageCount" class="text-xs font-bold text-primary"></span>
                                    <button type="button" id="clearImages" class="text-[10px] text-red-500 hover:text-red-700">مسح الكل</button>
                                </div>
                                <div id="previewGrid" class="grid grid-cols-3 gap-2"></div>
                                <p class="text-[10px] text-slate-400 mt-1.5">الصورة الأولى (مع علامة ★) ستكون الصورة البارزة</p>
                            </div>
                            @error('images') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                            @error('images.*') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <!-- Video Upload -->
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">الفيديو</label>

                            <!-- New video preview -->
                            <div id="new-video-preview" class="hidden mb-3 rounded-lg overflow-hidden border border-primary/30 bg-primary/5">
                                <div class="bg-primary/10 px-3 py-2 flex items-center justify-between">
                                    <span class="text-[10px] font-bold text-primary">معاينة الفيديو</span>
                                    <button type="button" id="clear-video-preview" class="text-primary/60 hover:text-primary">
                                        <span class="material-symbols-outlined text-[16px]">close</span>
                                    </button>
                                </div>
                                <div id="new-video-container"></div>
                            </div>

                            <div class="flex flex-col gap-3">
                                <!-- Video file upload -->
                                <div>
                                    <label class="block text-[10px] text-slate-400 mb-1">رفع ملف فيديو (MP4, WebM, OGG)</label>
                                    <div class="flex items-center gap-2 mb-1.5">
                                        <span class="material-symbols-outlined text-[14px] text-amber-500">info</span>
                                        <span class="text-[11px] font-bold text-amber-600 dark:text-amber-400">الحد الأقصى لحجم الملف: 50MB</span>
                                    </div>
                                    <input type="file" name="video_file" id="video-file-input" accept="video/mp4,video/webm,video/ogg"
                                        class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-600 hover:file:bg-red-100">
                                    <div id="video-size-error" class="hidden mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                        <div class="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                                            <span class="material-symbols-outlined text-[16px]">error</span>
                                            <span>حجم الملف يتجاوز الحد الأقصى (50MB). يرجى اختيار ملف أصغر.</span>
                                        </div>
                                    </div>
                                    <div id="video-file-info" class="hidden mt-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <div class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                                            <span class="material-symbols-outlined text-[16px] text-primary">video_file</span>
                                            <span id="video-file-name" class="truncate flex-1"></span>
                                            <span id="video-file-size" class="text-slate-400 whitespace-nowrap"></span>
                                        </div>
                                    </div>
                                    <!-- Upload progress bar -->
                                    <div id="video-upload-progress" class="hidden mt-2">
                                        <div class="flex items-center justify-between mb-1">
                                            <span class="text-[10px] font-bold text-primary">جاري رفع الفيديو...</span>
                                            <span id="video-progress-text" class="text-[10px] text-slate-500">0%</span>
                                        </div>
                                        <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                            <div id="video-progress-bar" class="bg-primary h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                                        </div>
                                    </div>
                                    @error('video_file') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                                </div>
                                <!-- OR divider -->
                                <div class="flex items-center gap-2">
                                    <div class="flex-1 border-t border-slate-200 dark:border-slate-700"></div>
                                    <span class="text-[10px] text-slate-400 font-bold">أو</span>
                                    <div class="flex-1 border-t border-slate-200 dark:border-slate-700"></div>
                                </div>
                                <!-- YouTube URL -->
                                <div>
                                    <label class="block text-[10px] text-slate-400 mb-1">رابط يوتيوب</label>
                                    <input type="url" name="video_url" id="video-url-input" value="{{ old('video_url') }}" dir="ltr"
                                        class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                        placeholder="https://youtube.com/watch?v=...">
                                    @error('video_url') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                                </div>
                            </div>
                            <p class="text-[10px] text-slate-400 mt-1">رفع ملف فيديو له أولوية على رابط يوتيوب</p>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">الكلمات الدلالية (Tags)</label>
                            <input type="text" name="tags" value="{{ old('tags') }}"
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
        const categorySelect = document.getElementById('categorySelect');
        const serviceFields = document.getElementById('serviceFields');
        const directorateField = document.getElementById('directorateField');

        const tickerFields = document.getElementById('tickerFields');
        const showInTickerCheckbox = document.getElementById('show_in_ticker');
        const tickerDurationField = document.getElementById('tickerDurationField');

        function toggleFields() {
            if (categorySelect.value === 'service') {
                serviceFields.classList.remove('hidden');
                serviceFields.classList.add('flex');
            } else {
                serviceFields.classList.add('hidden');
                serviceFields.classList.remove('flex');
            }

            if (categorySelect.value === 'news') {
                directorateField.classList.remove('hidden');
                tickerFields.classList.remove('hidden');
                tickerFields.classList.add('flex');
            } else {
                directorateField.classList.add('hidden');
                tickerFields.classList.add('hidden');
                tickerFields.classList.remove('flex');
            }
        }

        function toggleTickerDuration() {
            if (showInTickerCheckbox.checked) {
                tickerDurationField.classList.remove('hidden');
            } else {
                tickerDurationField.classList.add('hidden');
            }
        }

        categorySelect.addEventListener('change', toggleFields);
        showInTickerCheckbox.addEventListener('change', toggleTickerDuration);
        toggleFields(); // Initial check
        toggleTickerDuration(); // Initial check

        // Auto-translate on form submit
        const contentForm = document.getElementById('contentForm');
        const autoTranslateToggle = document.getElementById('autoTranslate');
        const translateStatus = document.getElementById('translateStatus');
        const submitBtn = document.getElementById('submitBtn');
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

        contentForm.addEventListener('submit', async function(e) {
            if (!autoTranslateToggle.checked) {
                return; // Submit normally without translation
            }

            const titleAr = document.getElementById('title_ar').value.trim();
            const contentAr = document.getElementById('content_ar').value.trim();

            if (!titleAr && !contentAr) {
                return; // Nothing to translate
            }

            e.preventDefault(); // Pause submission for translation

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<div class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> جاري الترجمة والحفظ...';
            translateStatus.classList.remove('hidden');

            try {
                // Translate title and content in parallel
                const [titleResult, contentResult] = await Promise.allSettled([
                    titleAr ? translateText(titleAr, 'ar', 'en') : Promise.resolve(null),
                    contentAr ? translateText(contentAr, 'ar', 'en') : Promise.resolve(null),
                ]);

                let translationErrors = [];

                if (titleResult.status === 'fulfilled' && titleResult.value?.success) {
                    document.getElementById('title_en').value = titleResult.value.translated_text;
                } else {
                    const reason = titleResult.status === 'rejected' ? titleResult.reason : (titleResult.value?.message || 'Unknown error');
                    console.error('Title translation failed:', reason);
                    translationErrors.push('العنوان');
                }

                if (contentResult.status === 'fulfilled' && contentResult.value?.success) {
                    document.getElementById('content_en').value = contentResult.value.translated_text;
                } else {
                    const reason = contentResult.status === 'rejected' ? contentResult.reason : (contentResult.value?.message || 'Unknown error');
                    console.error('Content translation failed:', reason);
                    translationErrors.push('المحتوى');
                }

                if (translationErrors.length > 0 && translationErrors.length < 2) {
                    // Partial failure — submit anyway with what we have
                    console.warn('Partial translation. Failed fields:', translationErrors);
                } else if (translationErrors.length === 2) {
                    // Both failed
                    translateStatus.classList.add('hidden');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span class="material-symbols-outlined text-[20px]">save</span> حفظ ونشر';
                    if (!confirm('فشلت الترجمة التلقائية. هل تريد الحفظ بدون ترجمة؟')) {
                        return;
                    }
                }

                contentForm.submit();
            } catch (error) {
                console.error('Translation error:', error);
                translateStatus.classList.add('hidden');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span class="material-symbols-outlined text-[20px]">save</span> حفظ ونشر';

                if (confirm('فشلت الترجمة التلقائية. هل تريد الحفظ بدون ترجمة؟')) {
                    contentForm.submit();
                }
            }
        });
    });

    // ── Video Upload Preview & Validation ──
    document.addEventListener('DOMContentLoaded', function() {
        const previewWrap = document.getElementById('new-video-preview');
        const previewContainer = document.getElementById('new-video-container');
        const videoInput = document.getElementById('video-file-input');
        const videoInfo = document.getElementById('video-file-info');
        const videoFileName = document.getElementById('video-file-name');
        const videoFileSize = document.getElementById('video-file-size');
        const videoUrlInput = document.getElementById('video-url-input');
        const clearBtn = document.getElementById('clear-video-preview');
        const sizeError = document.getElementById('video-size-error');
        const maxFileSize = 50 * 1024 * 1024;

        if (!videoInput) return;

        function getYouTubeId(url) {
            const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
            return m ? m[1] : null;
        }

        function showVideoPreview(html) {
            previewContainer.innerHTML = html;
            previewWrap.classList.remove('hidden');
        }

        function hideVideoPreview() {
            previewContainer.innerHTML = '';
            previewWrap.classList.add('hidden');
        }

        videoInput.addEventListener('change', function() {
            sizeError.classList.add('hidden');
            if (this.files && this.files[0]) {
                const file = this.files[0];
                const sizeMB = (file.size / (1024 * 1024)).toFixed(1);

                if (file.size > maxFileSize) {
                    sizeError.classList.remove('hidden');
                    this.value = '';
                    videoInfo.classList.add('hidden');
                    hideVideoPreview();
                    return;
                }

                videoFileName.textContent = file.name;
                videoFileSize.textContent = sizeMB + ' MB';
                videoInfo.classList.remove('hidden');

                const objectUrl = URL.createObjectURL(file);
                showVideoPreview(
                    '<video controls class="w-full aspect-video bg-black"><source src="' + objectUrl + '" type="' + file.type + '">المتصفح لا يدعم تشغيل الفيديو</video>'
                );
                if (videoUrlInput) videoUrlInput.value = '';
            } else {
                videoInfo.classList.add('hidden');
                hideVideoPreview();
            }
        });

        let ytDebounce;
        if (videoUrlInput) {
            videoUrlInput.addEventListener('input', function() {
                clearTimeout(ytDebounce);
                ytDebounce = setTimeout(() => {
                    const url = this.value.trim();
                    if (!url) { hideVideoPreview(); return; }
                    const ytId = getYouTubeId(url);
                    if (ytId) {
                        showVideoPreview(
                            '<iframe src="https://www.youtube.com/embed/' + ytId + '" class="w-full aspect-video" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>'
                        );
                        if (videoInput) { videoInput.value = ''; videoInfo.classList.add('hidden'); }
                    } else {
                        hideVideoPreview();
                    }
                }, 500);
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                hideVideoPreview();
                if (videoInput) { videoInput.value = ''; videoInfo.classList.add('hidden'); }
                if (videoUrlInput) videoUrlInput.value = '';
            });
        }

        // Override form submit for video upload progress
        const contentForm = document.getElementById('contentForm');
        const submitBtn = document.getElementById('submitBtn');
        const progressWrap = document.getElementById('video-upload-progress');
        const progressBar = document.getElementById('video-progress-bar');
        const progressText = document.getElementById('video-progress-text');

        if (contentForm) {
            const origSubmit = contentForm.submit.bind(contentForm);
            contentForm.addEventListener('submit', function(e) {
                if (videoInput && videoInput.files[0] && videoInput.files[0].size > maxFileSize) {
                    e.preventDefault();
                    sizeError.classList.remove('hidden');
                    return;
                }
            });

            // Monkey-patch form.submit() to add progress when video is present
            const nativeSubmit = HTMLFormElement.prototype.submit;
            const patchedSubmit = function() {
                if (videoInput && videoInput.files && videoInput.files.length > 0) {
                    progressWrap.classList.remove('hidden');
                    const formData = new FormData(contentForm);
                    const xhr = new XMLHttpRequest();
                    xhr.open(contentForm.method, contentForm.action, true);
                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

                    xhr.upload.addEventListener('progress', function(evt) {
                        if (evt.lengthComputable) {
                            const pct = Math.round((evt.loaded / evt.total) * 100);
                            progressBar.style.width = pct + '%';
                            progressText.textContent = pct + '%';
                        }
                    });

                    xhr.addEventListener('load', function() {
                        if (xhr.status >= 200 && xhr.status < 400) {
                            window.location.href = xhr.responseURL || '{{ route("admin.content.index") }}';
                        } else {
                            nativeSubmit.call(contentForm);
                        }
                    });

                    xhr.addEventListener('error', function() {
                        progressWrap.classList.add('hidden');
                        alert('حدث خطأ أثناء الرفع. يرجى المحاولة مرة أخرى.');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<span class="material-symbols-outlined text-[20px]">save</span> حفظ ونشر';
                    });

                    xhr.send(formData);
                } else {
                    nativeSubmit.call(contentForm);
                }
            };
            contentForm.submit = patchedSubmit;
        }
    });

    // ── Image Gallery Upload with Preview ──
    document.addEventListener('DOMContentLoaded', function() {
        const imageInput = document.getElementById('imageInput');
        const dropZone = document.getElementById('dropZone');
        const previews = document.getElementById('imagePreviews');
        const previewGrid = document.getElementById('previewGrid');
        const imageCount = document.getElementById('imageCount');
        const clearBtn = document.getElementById('clearImages');

        if (!imageInput || !dropZone) return;

        let selectedFiles = new DataTransfer();

        function addFiles(fileList) {
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i];
                if (!file.type.startsWith('image/')) continue;
                if (selectedFiles.files.length >= 10) break;
                selectedFiles.items.add(file);
            }
            updatePreviews();
        }

        function updatePreviews() {
            previewGrid.innerHTML = '';
            const files = selectedFiles.files;
            if (files.length === 0) {
                previews.classList.add('hidden');
                dropZone.style.display = '';
                imageInput.files = selectedFiles.files;
                return;
            }
            previews.classList.remove('hidden');
            dropZone.style.display = '';
            imageCount.textContent = files.length + ' صورة محددة';

            for (let idx = 0; idx < files.length; idx++) {
                const file = files[idx];
                const div = document.createElement('div');
                div.className = 'relative group';

                const img = document.createElement('img');
                img.className = 'w-full h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700';
                img.src = URL.createObjectURL(file);

                div.appendChild(img);

                if (idx === 0) {
                    const badge = document.createElement('span');
                    badge.className = 'absolute top-1 right-1 bg-primary text-white text-[9px] px-1.5 py-0.5 rounded';
                    badge.textContent = '★ بارزة';
                    div.appendChild(badge);
                }

                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.dataset.idx = idx;
                removeBtn.className = 'remove-img absolute top-1 left-1 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] leading-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center';
                removeBtn.textContent = '×';
                div.appendChild(removeBtn);

                previewGrid.appendChild(div);
            }

            // Sync with actual input
            imageInput.files = selectedFiles.files;
        }

        // Click to open file picker
        dropZone.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            imageInput.click();
        });

        // File input change
        imageInput.addEventListener('change', function() {
            addFiles(this.files);
        });

        // Prevent browser default file-drop on the whole document
        document.addEventListener('dragover', function(e) { e.preventDefault(); });
        document.addEventListener('drop', function(e) { e.preventDefault(); });

        // Drag and drop on drop zone
        dropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.add('border-primary', 'bg-primary/10');
        });

        // Use a counter to handle child element dragleave events
        let dragCounter = 0;
        dropZone.addEventListener('dragenter', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dragCounter++;
            this.classList.add('border-primary', 'bg-primary/10');
        });
        dropZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dragCounter--;
            if (dragCounter === 0) {
                this.classList.remove('border-primary', 'bg-primary/10');
            }
        });
        dropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dragCounter = 0;
            this.classList.remove('border-primary', 'bg-primary/10');
            if (e.dataTransfer && e.dataTransfer.files.length > 0) {
                addFiles(e.dataTransfer.files);
            }
        });

        // Clear all
        clearBtn.addEventListener('click', function(e) {
            e.preventDefault();
            selectedFiles = new DataTransfer();
            imageInput.files = selectedFiles.files;
            updatePreviews();
        });

        // Remove single image
        previewGrid.addEventListener('click', function(e) {
            const btn = e.target.closest('.remove-img');
            if (!btn) return;
            e.preventDefault();
            const idx = parseInt(btn.dataset.idx);
            const newDt = new DataTransfer();
            for (let i = 0; i < selectedFiles.files.length; i++) {
                if (i !== idx) newDt.items.add(selectedFiles.files[i]);
            }
            selectedFiles = newDt;
            updatePreviews();
        });
    });
</script>
@endpush
