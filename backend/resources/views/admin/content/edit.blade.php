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
    <form id="contentForm" action="{{ route('admin.content.update', $content) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <!-- Hidden fields for English translation -->
        <input type="hidden" name="title_en" id="title_en" value="{{ old('title_en', $content->title_en) }}">
        <input type="hidden" name="content_en" id="content_en" value="{{ old('content_en', $content->content_en) }}">

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
                        <input type="text" name="title_ar" id="title_ar" value="{{ old('title_ar', $content->title_ar) }}" required
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                            placeholder="عنوان المقال أو الخبر">
                        @error('title_ar') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">نص المحتوى</label>
                        <textarea name="content_ar" id="content_ar" rows="12" required
                            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400 leading-relaxed p-4"
                            placeholder="اكتب المحتوى هنا...">{{ old('content_ar', $content->content_ar) }}</textarea>
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
                                <option value="draft" {{ (old('status') ?? $content->status) == 'draft' ? 'selected' : '' }}>مسودة</option>
                                <option value="published" {{ (old('status') ?? $content->status) == 'published' ? 'selected' : '' }}>منشور</option>
                                <option value="archived" {{ (old('status') ?? $content->status) == 'archived' ? 'selected' : '' }}>مؤرشف</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">التصنيف</label>
                            <select name="category" id="categorySelect" required class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                                @foreach($categories as $key => $label)
                                    <option value="{{ $key }}" {{ (old('category') ?? $content->category) == $key ? 'selected' : '' }}>{{ $label }}</option>
                                @endforeach
                            </select>
                            @error('category') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <!-- Directorate Field (Shown for news category) -->
                        <div id="directorateField" class="{{ (old('category', $content->category) === 'news') ? '' : 'hidden' }}">
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">الإدارة المركزية</label>
                            <select name="directorate_id" id="directorateSelect" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                                <option value="">-- بدون إدارة --</option>
                                @foreach($directorates as $directorate)
                                    <option value="{{ $directorate->id }}" {{ (old('directorate_id', $content->directorate_id)) == $directorate->id ? 'selected' : '' }}>{{ $directorate->name_ar }}</option>
                                @endforeach
                            </select>
                            <p class="text-[10px] text-slate-400 mt-1">اختر الإدارة المركزية التابع لها هذا الخبر</p>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">تاريخ النشر</label>
                            <input type="date" name="published_at" value="{{ old('published_at', $content->published_at?->format('Y-m-d')) }}"
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
                                    <input type="checkbox" id="autoTranslate" class="sr-only peer">
                                    <div class="w-9 h-5 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                                </label>
                            </div>
                            <p class="text-[10px] text-slate-400 mt-1.5 mr-6">عند التفعيل، سيتم إعادة ترجمة العنوان والمحتوى إلى الإنجليزية عند الحفظ</p>
                            @if($content->title_en)
                                <p class="text-[10px] text-green-600 mt-1 mr-6 flex items-center gap-1">
                                    <span class="material-symbols-outlined text-[12px]">check_circle</span>
                                    يوجد محتوى إنجليزي محفوظ مسبقاً
                                </p>
                            @endif
                        </div>

                        <div class="pt-4 border-t border-slate-100 dark:border-slate-700">
                             <button type="submit" id="submitBtn" class="w-full py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
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
                        @php
                            $existingImages = $content->metadata['images'] ?? [];
                            $featuredImage = $content->metadata['image'] ?? null;
                            if (empty($existingImages) && $featuredImage) {
                                $existingImages = [$featuredImage];
                            }
                        @endphp
                        @if(!empty($existingImages))
                            <div id="existingImagesSection">
                                <label class="block text-xs font-bold text-slate-500 mb-1.5">الصور الحالية ({{ count($existingImages) }} صورة)</label>
                                <div class="grid grid-cols-3 gap-2">
                                    @foreach($existingImages as $idx => $img)
                                        @php
                                            $imgUrl = str_starts_with($img, '/storage/') || str_starts_with($img, 'http')
                                                ? $img
                                                : '/storage/' . $img;
                                        @endphp
                                        <div class="relative group">
                                            <img src="{{ $imgUrl }}" alt="Image {{ $idx + 1 }}" class="w-full h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700">
                                            @if($idx === 0)
                                                <span class="absolute top-1 right-1 bg-primary text-white text-[9px] px-1.5 py-0.5 rounded">★ بارزة</span>
                                            @endif
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        @endif

                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">رفع صور جديدة (تستبدل الحالية)</label>
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
        // Category-dependent fields toggle
        const categorySelect = document.getElementById('categorySelect');
        const directorateField = document.getElementById('directorateField');

        function toggleCategoryFields() {
            if (categorySelect.value === 'news') {
                directorateField.classList.remove('hidden');
            } else {
                directorateField.classList.add('hidden');
            }
        }

        categorySelect.addEventListener('change', toggleCategoryFields);

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
                    submitBtn.innerHTML = '<span class="material-symbols-outlined text-[20px]">save</span> حفظ التغييرات';
                    if (!confirm('فشلت الترجمة التلقائية. هل تريد الحفظ بدون ترجمة؟')) {
                        return;
                    }
                }

                contentForm.submit();
            } catch (error) {
                console.error('Translation error:', error);
                translateStatus.classList.add('hidden');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span class="material-symbols-outlined text-[20px]">save</span> حفظ التغييرات';

                if (confirm('فشلت الترجمة التلقائية. هل تريد الحفظ بدون ترجمة؟')) {
                    contentForm.submit();
                }
            }
        });
    });

    // ── Image Gallery Upload with Preview ──
    document.addEventListener('DOMContentLoaded', function() {
        const imageInput = document.getElementById('imageInput');
        const dropZone = document.getElementById('dropZone');
        const previews = document.getElementById('imagePreviews');
        const previewGrid = document.getElementById('previewGrid');
        const imageCount = document.getElementById('imageCount');
        const clearBtn = document.getElementById('clearImages');
        const existingSection = document.getElementById('existingImagesSection');

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
                if (existingSection) existingSection.classList.remove('hidden');
                imageInput.files = selectedFiles.files;
                return;
            }
            previews.classList.remove('hidden');
            if (existingSection) existingSection.classList.add('hidden');
            dropZone.style.display = '';
            imageCount.textContent = files.length + ' صورة جديدة محددة (ستستبدل الحالية)';

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
