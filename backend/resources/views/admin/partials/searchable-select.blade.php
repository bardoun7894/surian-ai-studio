{{-- Searchable Select Dropdown with optional grouping --}}
{{--
    Flat mode:   @include('admin.partials.searchable-select', ['name' => 'field', 'label' => 'Label', 'options' => $collection, ...])
    Grouped mode: @include('admin.partials.searchable-select', ['name' => 'field', 'label' => 'Label', 'grouped' => $groupedArray, ...])
--}}
@php
    $uid = 'ss_' . str_replace(['-', '.'], '_', $name) . '_' . rand(100,999);
    $selected = $selected ?? null;
    $placeholder = $placeholder ?? '-- اختر --';
    $labelField = $labelField ?? 'name_ar';
    $labelFieldFallback = $labelFieldFallback ?? null;
    $valueField = $valueField ?? 'id';
    $isGrouped = isset($grouped) && is_array($grouped);
@endphp

<div class="col-span-2 md:col-span-1">
    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{{ $label }}</label>
    <div class="relative" id="{{ $uid }}_wrapper">
        {{-- Hidden input for form submission --}}
        <input type="hidden" name="{{ $name }}" id="{{ $uid }}_value" value="{{ $selected }}">

        {{-- Display input --}}
        <div class="relative">
            <input type="text" id="{{ $uid }}_search" autocomplete="off"
                class="w-full bg-background-light dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg h-10 pr-3 pl-8 text-sm text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer placeholder:text-slate-400"
                placeholder="{{ $placeholder }}" readonly>
            <span class="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 pointer-events-none text-[20px]" id="{{ $uid }}_chevron">expand_more</span>
        </div>

        {{-- Dropdown --}}
        <div id="{{ $uid }}_dropdown" class="hidden absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-72 overflow-hidden">
            {{-- Search filter --}}
            <div class="p-2 border-b border-slate-200 dark:border-slate-700">
                <input type="text" id="{{ $uid }}_filter" autocomplete="off"
                    class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded h-8 px-3 text-sm placeholder:text-slate-400 focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="ابحث...">
            </div>
            <ul id="{{ $uid }}_list" class="overflow-y-auto max-h-56">
                <li data-value="" class="px-3 py-2 text-sm text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">{{ $placeholder }}</li>

                @if($isGrouped)
                    @foreach($grouped as $groupName => $items)
                        <li data-group-header class="px-3 py-1.5 text-xs font-bold text-primary dark:text-gov-teal bg-slate-50 dark:bg-slate-900/50 sticky top-0 select-none border-t border-slate-200 dark:border-slate-700 mt-1 first:mt-0 first:border-t-0">
                            {{ $groupName }}
                        </li>
                        @foreach($items as $option)
                            @php
                                $val = $option->{$valueField};
                                $lbl = $option->{$labelField} ?: ($labelFieldFallback ? $option->{$labelFieldFallback} : $val);
                            @endphp
                            <li data-value="{{ $val }}" data-group="{{ $groupName }}" class="pr-6 pl-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-primary/10 dark:hover:bg-primary/20 cursor-pointer">{{ $lbl }}</li>
                        @endforeach
                    @endforeach
                @else
                    @foreach($options as $option)
                        @php
                            $val = $option->{$valueField};
                            $lbl = $option->{$labelField} ?: ($labelFieldFallback ? $option->{$labelFieldFallback} : $val);
                        @endphp
                        <li data-value="{{ $val }}" class="px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-primary/10 dark:hover:bg-primary/20 cursor-pointer">{{ $lbl }}</li>
                    @endforeach
                @endif
            </ul>
        </div>
    </div>
    @error($name) <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
</div>

@push('scripts')
<script>
(function() {
    var uid = '{{ $uid }}';
    var wrapper = document.getElementById(uid + '_wrapper');
    var searchInput = document.getElementById(uid + '_search');
    var filterInput = document.getElementById(uid + '_filter');
    var dropdown = document.getElementById(uid + '_dropdown');
    var list = document.getElementById(uid + '_list');
    var hiddenInput = document.getElementById(uid + '_value');
    var chevron = document.getElementById(uid + '_chevron');
    var isOpen = false;

    // Set initial display text
    var selectedVal = hiddenInput.value;
    if (selectedVal) {
        var selectedItem = list.querySelector('[data-value="' + selectedVal + '"]');
        if (selectedItem) searchInput.value = selectedItem.textContent.trim();
    }

    function toggle(open) {
        isOpen = open;
        dropdown.classList.toggle('hidden', !open);
        chevron.textContent = open ? 'expand_less' : 'expand_more';
        if (open) {
            filterInput.value = '';
            filterItems('');
            filterInput.focus();
        }
    }

    searchInput.addEventListener('click', function(e) {
        e.stopPropagation();
        toggle(!isOpen);
    });

    filterInput.addEventListener('input', function() {
        filterItems(this.value);
    });
    filterInput.addEventListener('click', function(e) { e.stopPropagation(); });

    function filterItems(query) {
        var q = query.trim().toLowerCase();
        var groupHeaders = list.querySelectorAll('[data-group-header]');
        var items = list.querySelectorAll('li[data-value]');

        // Show/hide items based on search
        items.forEach(function(li) {
            if (!q || li.textContent.toLowerCase().indexOf(q) !== -1) {
                li.style.display = '';
            } else {
                li.style.display = 'none';
            }
        });

        // Show/hide group headers based on whether any child is visible
        groupHeaders.forEach(function(header) {
            var groupName = header.textContent.trim();
            var hasVisible = false;
            var sibling = header.nextElementSibling;
            while (sibling && !sibling.hasAttribute('data-group-header')) {
                if (sibling.style.display !== 'none' && sibling.hasAttribute('data-value')) {
                    hasVisible = true;
                }
                sibling = sibling.nextElementSibling;
            }
            header.style.display = hasVisible || !q ? '' : 'none';
        });
    }

    list.addEventListener('click', function(e) {
        var li = e.target.closest('li[data-value]');
        if (!li) return;
        var val = li.dataset.value;
        hiddenInput.value = val;
        searchInput.value = val ? li.textContent.trim() : '';
        toggle(false);
    });

    document.addEventListener('click', function(e) {
        if (!wrapper.contains(e.target)) toggle(false);
    });
})();
</script>
@endpush
