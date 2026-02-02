@extends('admin.layouts.app')

@section('title', 'تعديل قسم ترويجي - وزارة الاقتصاد')

@section('content')
<div class="max-w-4xl mx-auto">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 mb-6">
        <a class="text-primary/70 hover:text-primary text-sm font-medium flex items-center" href="{{ route('admin.dashboard') }}">
            <span class="material-symbols-outlined text-sm ml-1 rtl-flip">home</span> الرئيسية
        </a>
        <span class="text-slate-400 text-sm">/</span>
        <a class="text-primary/70 hover:text-primary text-sm font-medium" href="{{ route('admin.promotional.index') }}">الأقسام الترويجية</a>
        <span class="text-slate-400 text-sm">/</span>
        <span class="text-slate-900 dark:text-white text-sm font-semibold">تعديل القسم</span>
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">تعديل القسم الترويجي</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">تحديث بيانات: {{ $section->title_ar }}</p>
        </div>
        <a href="{{ route('admin.promotional.index') }}" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm">
            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
            العودة للقائمة
        </a>
    </div>

    <!-- Form -->
    <form action="{{ route('admin.promotional.update', $section) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Content (2/3) -->
            <div class="lg:col-span-2 flex flex-col gap-6">
                <!-- Arabic Content -->
                <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                    <div class="flex items-center mb-4">
                        <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">عربي</span>
                            المحتوى بالعربية
                        </h3>
                    </div>

                    <div class="flex flex-col gap-4">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">العنوان (بالعربية) <span class="text-red-500">*</span></label>
                            <input type="text" name="title_ar" value="{{ old('title_ar', $section->title_ar) }}" required
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                                placeholder="عنوان القسم الترويجي">
                            @error('title_ar') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الوصف (بالعربية)</label>
                            <textarea name="description_ar" rows="4"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400 leading-relaxed"
                                placeholder="وصف مختصر للقسم الترويجي...">{{ old('description_ar', $section->description_ar) }}</textarea>
                            @error('description_ar') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">نص الزر (بالعربية)</label>
                                <input type="text" name="button_text_ar" value="{{ old('button_text_ar', $section->button_text_ar) }}"
                                    class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                                    placeholder="مثال: اقرأ المزيد">
                                @error('button_text_ar') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">رابط الزر</label>
                                <input type="url" name="button_url" value="{{ old('button_url', $section->button_url) }}" dir="ltr"
                                    class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                                    placeholder="https://example.com">
                                @error('button_url') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                            </div>
                        </div>
                    </div>
                </div>

                <!-- English Content -->
                <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                    <div class="flex items-center mb-4">
                        <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded">English</span>
                            المحتوى بالإنجليزية (اختياري)
                        </h3>
                    </div>

                    <div class="flex flex-col gap-4">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Title (English)</label>
                            <input type="text" name="title_en" value="{{ old('title_en', $section->title_en) }}" dir="ltr"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                                placeholder="Section Title">
                            @error('title_en') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description (English)</label>
                            <textarea name="description_en" rows="4" dir="ltr"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400 leading-relaxed"
                                placeholder="Short description...">{{ old('description_en', $section->description_en) }}</textarea>
                            @error('description_en') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Button Text (English)</label>
                            <input type="text" name="button_text_en" value="{{ old('button_text_en', $section->button_text_en) }}" dir="ltr"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder:text-slate-400"
                                placeholder="e.g. Read More">
                            @error('button_text_en') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar (1/3) -->
            <div class="flex flex-col gap-6">
                <!-- Section Settings -->
                <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                    <h3 class="text-xs font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">إعدادات القسم</h3>

                    <div class="flex flex-col gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">النوع <span class="text-red-500">*</span></label>
                            <select name="type" required class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                                <option value="banner" {{ old('type', $section->type) == 'banner' ? 'selected' : '' }}>بانر</option>
                                <option value="video" {{ old('type', $section->type) == 'video' ? 'selected' : '' }}>فيديو</option>
                                <option value="promo" {{ old('type', $section->type) == 'promo' ? 'selected' : '' }}>ترويجي</option>
                                <option value="stats" {{ old('type', $section->type) == 'stats' ? 'selected' : '' }}>إحصائيات</option>
                            </select>
                            @error('type') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">الموقع <span class="text-red-500">*</span></label>
                            <select name="position" required class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                                <option value="hero" {{ old('position', $section->position) == 'hero' ? 'selected' : '' }}>الرئيسي</option>
                                <option value="grid_main" {{ old('position', $section->position) == 'grid_main' ? 'selected' : '' }}>الشبكة الرئيسية</option>
                                <option value="grid_side" {{ old('position', $section->position) == 'grid_side' ? 'selected' : '' }}>الشبكة الجانبية</option>
                                <option value="grid_bottom" {{ old('position', $section->position) == 'grid_bottom' ? 'selected' : '' }}>أسفل الشبكة</option>
                            </select>
                            @error('position') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">ترتيب العرض</label>
                            <input type="number" name="display_order" value="{{ old('display_order', $section->display_order) }}" min="0"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm">
                            @error('display_order') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div class="flex items-center gap-3 pt-2">
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="hidden" name="is_active" value="0">
                                <input type="checkbox" name="is_active" value="1" {{ old('is_active', $section->is_active) ? 'checked' : '' }} class="sr-only peer">
                                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:after:border-slate-600 peer-checked:bg-primary"></div>
                            </label>
                            <span class="text-sm font-bold text-slate-700 dark:text-slate-300">نشط</span>
                        </div>

                        <div class="pt-4 border-t border-slate-100 dark:border-slate-700">
                            <button type="submit" id="submit-btn" class="w-full py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                                <span class="material-symbols-outlined text-[20px]" id="submit-icon">save</span>
                                <svg id="submit-spinner" class="hidden animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                <span id="submit-text">تحديث القسم</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Media & Appearance -->
                <div class="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                    <h3 class="text-xs font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">الوسائط والمظهر</h3>

                    <div class="flex flex-col gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">الصورة</label>
                            @if($section->image)
                                <div class="mb-3 relative group">
                                    <img src="{{ asset('storage/' . $section->image) }}" alt="{{ $section->title_ar }}" class="w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                        <span class="text-white text-xs font-bold">سيتم استبدالها عند رفع صورة جديدة</span>
                                    </div>
                                </div>
                            @endif
                            <input type="file" name="image" accept="image/*" class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20">
                            @error('image') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">الفيديو</label>

                            <!-- Current video preview -->
                            @if($section->video_url)
                                <div class="mb-3 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700" id="current-video-preview">
                                    <div class="bg-slate-50 dark:bg-slate-800 px-3 py-2 flex items-center justify-between">
                                        <span class="text-[10px] font-bold text-slate-500">الفيديو الحالي</span>
                                        <button type="button" onclick="document.getElementById('current-video-preview').classList.toggle('hidden')" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                            <span class="material-symbols-outlined text-[16px]">close</span>
                                        </button>
                                    </div>
                                    @if(str_contains($section->video_url, 'youtube') || str_contains($section->video_url, 'youtu.be'))
                                        @php
                                            $ytId = '';
                                            if (preg_match('/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/', $section->video_url, $m)) {
                                                $ytId = $m[1];
                                            }
                                        @endphp
                                        @if($ytId)
                                            <iframe src="https://www.youtube.com/embed/{{ $ytId }}" class="w-full aspect-video" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                                        @else
                                            <div class="p-3 text-xs text-slate-500">
                                                <a href="{{ $section->video_url }}" target="_blank" dir="ltr" class="text-primary hover:underline">{{ $section->video_url }}</a>
                                            </div>
                                        @endif
                                    @else
                                        <video controls class="w-full aspect-video bg-black">
                                            <source src="{{ asset($section->video_url) }}" type="video/mp4">
                                            المتصفح لا يدعم تشغيل الفيديو
                                        </video>
                                    @endif
                                </div>
                            @endif

                            <!-- New video preview (shown when user selects file or enters URL) -->
                            <div id="new-video-preview" class="hidden mb-3 rounded-lg overflow-hidden border border-primary/30 bg-primary/5">
                                <div class="bg-primary/10 px-3 py-2 flex items-center justify-between">
                                    <span class="text-[10px] font-bold text-primary">معاينة الفيديو الجديد</span>
                                    <button type="button" id="clear-video-preview" class="text-primary/60 hover:text-primary">
                                        <span class="material-symbols-outlined text-[16px]">close</span>
                                    </button>
                                </div>
                                <div id="new-video-container"></div>
                            </div>

                            <div class="flex flex-col gap-3">
                                <!-- Video file upload -->
                                <div>
                                    <label class="block text-[10px] text-slate-400 mb-1">رفع ملف فيديو (MP4, WebM, OGG - حتى 50MB)</label>
                                    <input type="file" name="video_file" id="video-file-input" accept="video/mp4,video/webm,video/ogg"
                                        class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-600 hover:file:bg-red-100">
                                    <div id="video-file-info" class="hidden mt-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <div class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                                            <span class="material-symbols-outlined text-[16px] text-primary">video_file</span>
                                            <span id="video-file-name" class="truncate flex-1"></span>
                                            <span id="video-file-size" class="text-slate-400 whitespace-nowrap"></span>
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
                                    <input type="url" name="video_url" id="video-url-input" value="{{ old('video_url', $section->video_url && !str_starts_with($section->video_url, '/storage/') ? $section->video_url : '') }}" dir="ltr"
                                        class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                        placeholder="https://youtube.com/watch?v=...">
                                    @error('video_url') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                                </div>
                            </div>
                            <p class="text-[10px] text-slate-400 mt-1">رفع ملف فيديو له أولوية على رابط يوتيوب. اتركهما فارغين للإبقاء على الفيديو الحالي.</p>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">لون الخلفية</label>
                            <div class="flex items-center gap-3">
                                <input type="color" name="background_color" value="{{ old('background_color', $section->background_color ?? '#ffffff') }}"
                                    class="h-10 w-14 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer">
                                <input type="text" value="{{ old('background_color', $section->background_color ?? '#ffffff') }}" dir="ltr" readonly
                                    class="flex-1 rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                    id="bg-color-text">
                            </div>
                            @error('background_color') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1.5">الأيقونة (Material Icon)</label>
                            <input type="text" name="icon" value="{{ old('icon', $section->icon) }}" dir="ltr"
                                class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary text-sm"
                                placeholder="e.g. campaign, star, trending_up">
                            @if($section->icon)
                                <div class="mt-2 flex items-center gap-2 text-slate-500">
                                    <span class="material-symbols-outlined text-primary">{{ $section->icon }}</span>
                                    <span class="text-[10px]">الأيقونة الحالية</span>
                                </div>
                            @endif
                            <p class="text-[10px] text-slate-400 mt-1">اسم الأيقونة من Material Symbols</p>
                            @error('icon') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
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
        const colorInput = document.querySelector('input[name="background_color"]');
        const colorText = document.getElementById('bg-color-text');
        if (colorInput && colorText) {
            colorInput.addEventListener('input', function() {
                colorText.value = this.value;
            });
        }

        // Video preview helpers
        const previewWrap = document.getElementById('new-video-preview');
        const previewContainer = document.getElementById('new-video-container');
        const videoInput = document.getElementById('video-file-input');
        const videoInfo = document.getElementById('video-file-info');
        const videoFileName = document.getElementById('video-file-name');
        const videoFileSize = document.getElementById('video-file-size');
        const videoUrlInput = document.getElementById('video-url-input');
        const clearBtn = document.getElementById('clear-video-preview');

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

        // Uploaded file preview
        if (videoInput) {
            videoInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const file = this.files[0];
                    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
                    videoFileName.textContent = file.name;
                    videoFileSize.textContent = sizeMB + ' MB';
                    videoInfo.classList.remove('hidden');

                    const objectUrl = URL.createObjectURL(file);
                    showVideoPreview(
                        '<video controls class="w-full aspect-video bg-black"><source src="' + objectUrl + '" type="' + file.type + '">المتصفح لا يدعم تشغيل الفيديو</video>'
                    );
                    // Clear YouTube input when file is selected
                    if (videoUrlInput) videoUrlInput.value = '';
                } else {
                    videoInfo.classList.add('hidden');
                    hideVideoPreview();
                }
            });
        }

        // YouTube URL preview
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
                        // Clear file input when YouTube URL is entered
                        if (videoInput) { videoInput.value = ''; videoInfo.classList.add('hidden'); }
                    } else {
                        hideVideoPreview();
                    }
                }, 500);
            });
        }

        // Clear preview button
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                hideVideoPreview();
                if (videoInput) { videoInput.value = ''; videoInfo.classList.add('hidden'); }
                if (videoUrlInput) videoUrlInput.value = '';
            });
        }

        // Form submit loading state
        const form = document.querySelector('form');
        const submitBtn = document.getElementById('submit-btn');
        const submitIcon = document.getElementById('submit-icon');
        const submitSpinner = document.getElementById('submit-spinner');
        const submitText = document.getElementById('submit-text');
        if (form && submitBtn) {
            form.addEventListener('submit', function() {
                submitBtn.disabled = true;
                submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
                submitIcon.classList.add('hidden');
                submitSpinner.classList.remove('hidden');
                submitText.textContent = 'جاري الرفع والتحديث...';
            });
        }
    });
</script>
@endpush
