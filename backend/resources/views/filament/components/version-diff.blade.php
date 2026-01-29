<div class="p-4" dir="rtl">
    @if(isset($message))
        <div class="text-center text-gray-500 py-4">
            {{ $message }}
        </div>
    @elseif(empty($changes))
        <div class="text-center text-gray-500 py-4">
            لا توجد تغييرات في هذا الإصدار
        </div>
    @else
        <div class="space-y-4">
            @foreach($changes as $field => $change)
                <div class="border rounded-lg overflow-hidden">
                    <div class="bg-gray-100 dark:bg-gray-800 px-4 py-2 font-semibold">
                        {{ match($field) {
                            'title_ar' => 'العنوان (عربي)',
                            'title_en' => 'العنوان (إنجليزي)',
                            'content_ar' => 'المحتوى (عربي)',
                            'content_en' => 'المحتوى (إنجليزي)',
                            'status' => 'الحالة',
                            'category' => 'التصنيف',
                            'slug' => 'الرابط',
                            'seo_description_ar' => 'وصف SEO (عربي)',
                            'seo_description_en' => 'وصف SEO (إنجليزي)',
                            default => $field
                        } }}
                    </div>
                    <div class="grid grid-cols-2 divide-x divide-x-reverse">
                        <div class="p-3 bg-red-50 dark:bg-red-900/20">
                            <div class="text-xs text-red-600 dark:text-red-400 mb-1">القيمة السابقة</div>
                            <div class="text-sm break-words">
                                @if(is_array($change['old']))
                                    <pre class="text-xs">{{ json_encode($change['old'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) }}</pre>
                                @else
                                    {!! Str::limit(strip_tags($change['old'] ?? '-'), 200) !!}
                                @endif
                            </div>
                        </div>
                        <div class="p-3 bg-green-50 dark:bg-green-900/20">
                            <div class="text-xs text-green-600 dark:text-green-400 mb-1">القيمة الجديدة</div>
                            <div class="text-sm break-words">
                                @if(is_array($change['new']))
                                    <pre class="text-xs">{{ json_encode($change['new'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) }}</pre>
                                @else
                                    {!! Str::limit(strip_tags($change['new'] ?? '-'), 200) !!}
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    @endif
</div>
