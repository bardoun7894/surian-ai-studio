@extends('admin.layouts.app')

@section('title', 'لوحة متابعة المقترحات - وزارة الاقتصاد')

@section('content')
<div class="flex flex-col h-full overflow-hidden">
    <!-- Header -->
    <div class="px-2 pt-2 pb-4">
        <div class="flex flex-col gap-1 mb-6">
            <div class="flex items-center gap-2 text-primary mb-1">
                <span class="text-xs font-bold tracking-[0.2em] uppercase">سير العمل</span>
            </div>
            <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">لوحة متابعة المقترحات</h2>
        </div>
        <!-- Filters -->
        <div class="flex flex-wrap items-center gap-3 p-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-xl w-fit border border-slate-200 dark:border-slate-800">
            <!-- View Toggle -->
            <a href="{{ route('admin.suggestions.index') }}" class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-sm font-semibold text-slate-500 dark:text-slate-400 transition-all">
                <span class="material-symbols-outlined text-lg">list</span>
                عرض القائمة
            </a>
            <div class="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>

            <!-- Directorate Filter -->
            <div class="relative">
                <select id="filter-directorate" class="appearance-none flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white cursor-pointer pr-8">
                    <option value="">كل المديريات</option>
                    @foreach($directorates as $directorate)
                        <option value="{{ $directorate->id }}">{{ $directorate->name_ar }}</option>
                    @endforeach
                </select>
            </div>

            <!-- AI Category Filter -->
            <div class="relative">
                <select id="filter-category" class="appearance-none flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white cursor-pointer pr-8">
                    <option value="">كل التصنيفات</option>
                    @php
                        $categories = $suggestions ?? collect();
                        $uniqueCategories = collect();
                        foreach($grouped as $statusGroup) {
                            foreach($statusGroup as $s) {
                                if($s->ai_category) $uniqueCategories->push($s->ai_category);
                            }
                        }
                        $uniqueCategories = $uniqueCategories->unique()->sort();
                    @endphp
                    @foreach($uniqueCategories as $cat)
                        <option value="{{ $cat }}">{{ $cat }}</option>
                    @endforeach
                </select>
            </div>

            <div class="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>

            <!-- Reset -->
            <button id="filter-reset" class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-primary hover:bg-primary/5 transition-all hidden">
                <span class="material-symbols-outlined text-lg">filter_alt_off</span>
                إزالة التصفية
            </button>
        </div>
    </div>

    <!-- Toast Notification -->
    <div id="kanban-toast" class="fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 opacity-0 -translate-y-4 pointer-events-none">
        <div class="flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl border text-sm font-bold" id="kanban-toast-inner">
            <span class="material-symbols-outlined text-lg" id="kanban-toast-icon"></span>
            <span id="kanban-toast-text"></span>
        </div>
    </div>

    <!-- Kanban Board -->
    <div class="flex flex-1 gap-6 p-4 overflow-x-auto min-h-0 items-start custom-scrollbar">
        @php
            $columns = [
                'pending' => ['title' => 'بانتظار المراجعة', 'color' => 'orange-400', 'bg' => 'bg-orange-400', 'ring' => 'ring-orange-400/30'],
                'reviewed' => ['title' => 'تمت المراجعة', 'color' => 'blue-500', 'bg' => 'bg-blue-500', 'ring' => 'ring-blue-500/30'],
                'approved' => ['title' => 'مقبول', 'color' => 'green-500', 'bg' => 'bg-green-500', 'ring' => 'ring-green-500/30'],
                'rejected' => ['title' => 'مرفوض', 'color' => 'slate-400', 'bg' => 'bg-slate-400', 'ring' => 'ring-slate-400/30'],
            ];
        @endphp

        @foreach($columns as $status => $config)
            <div class="min-w-[320px] max-w-[320px] flex flex-col gap-4 h-full"
                 data-status="{{ $status }}">
                <!-- Column Header -->
                <div class="flex items-center justify-between px-1">
                    <div class="flex items-center gap-2">
                        <span class="size-2 rounded-full {{ $config['bg'] }} shadow-[0_0_8px_rgba(0,0,0,0.2)]"></span>
                        <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">{{ $config['title'] }}</h3>
                        <span class="kanban-count mr-2 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-xs font-black text-slate-600 dark:text-slate-400"
                              data-status="{{ $status }}">
                            {{ isset($grouped[$status]) ? $grouped[$status]->count() : 0 }}
                        </span>
                    </div>
                </div>

                <!-- Droppable Cards Container -->
                <div class="kanban-dropzone flex flex-col gap-3 overflow-y-auto pl-2 pb-2 custom-scrollbar min-h-[120px] rounded-xl transition-all duration-200"
                     data-status="{{ $status }}">
                    @forelse($grouped[$status] ?? [] as $suggestion)
                        <a href="{{ route('admin.suggestions.show', $suggestion) }}"
                           class="kanban-card bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group border border-slate-200 dark:border-slate-700 select-none block"
                             draggable="true"
                             data-id="{{ $suggestion->id }}"
                             data-status="{{ $status }}"
                             data-directorate="{{ $suggestion->directorate_id }}"
                             data-category="{{ $suggestion->ai_category }}">
                            <div class="flex justify-between items-start mb-3">
                                <span class="text-[11px] font-black text-primary bg-primary/10 px-2 py-1 rounded">#{{ $suggestion->tracking_number }}</span>
                                @if($suggestion->ai_category)
                                    <span class="bg-purple-50 text-purple-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                                        <span class="material-symbols-outlined text-[12px]">psychology</span>
                                        {{ $suggestion->ai_category }}
                                    </span>
                                @endif
                            </div>
                            <h4 class="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{{ $suggestion->name ?? 'مجهول' }}</h4>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">{{ $suggestion->description }}</p>
                            <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                                <div class="flex items-center gap-2">
                                    <span class="material-symbols-outlined text-xs text-slate-400">corporate_fare</span>
                                    <span class="text-[11px] font-semibold text-slate-500">{{ $suggestion->directorate->name_ar ?? 'العامة' }}</span>
                                </div>
                                <span class="text-[11px] text-slate-400 font-medium italic">{{ $suggestion->created_at->locale('ar')->diffForHumans() }}</span>
                            </div>
                        </a>
                    @empty
                        <div class="kanban-empty p-4 text-center text-xs text-slate-400 italic border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                            لا يوجد مقترحات
                        </div>
                    @endforelse
                </div>
            </div>
        @endforeach
    </div>
</div>

<style>
    .kanban-dropzone.drag-over {
        background: rgba(var(--color-primary-rgb, 59, 130, 246), 0.06);
        border: 2px dashed rgba(var(--color-primary-rgb, 59, 130, 246), 0.35);
        border-radius: 0.75rem;
    }
    .kanban-card.dragging {
        opacity: 0.4;
        transform: rotate(2deg);
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    }
    .kanban-card.drop-success {
        animation: dropPulse 0.4s ease;
    }
    @keyframes dropPulse {
        0% { transform: scale(0.95); opacity: 0.7; }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); opacity: 1; }
    }
    .kanban-card {
        transition: transform 0.15s ease, opacity 0.15s ease, box-shadow 0.15s ease;
    }
    .kanban-card.filter-hidden {
        display: none;
    }
</style>
@endsection

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    const dropzones = document.querySelectorAll('.kanban-dropzone');
    let draggedCard = null;
    let sourceZone = null;

    // --- Filters ---
    const filterDirectorate = document.getElementById('filter-directorate');
    const filterCategory = document.getElementById('filter-category');
    const filterReset = document.getElementById('filter-reset');

    function applyFilters() {
        var dirVal = filterDirectorate.value;
        var catVal = filterCategory.value;
        var hasFilter = dirVal || catVal;

        filterReset.classList.toggle('hidden', !hasFilter);

        document.querySelectorAll('.kanban-card').forEach(function(card) {
            var show = true;
            if (dirVal && card.dataset.directorate !== dirVal) show = false;
            if (catVal && card.dataset.category !== catVal) show = false;
            card.classList.toggle('filter-hidden', !show);
        });

        updateCounts();
    }

    filterDirectorate.addEventListener('change', applyFilters);
    filterCategory.addEventListener('change', applyFilters);
    filterReset.addEventListener('click', function() {
        filterDirectorate.value = '';
        filterCategory.value = '';
        applyFilters();
    });

    // --- Toast helper ---
    function showToast(message, type) {
        const toast = document.getElementById('kanban-toast');
        const inner = document.getElementById('kanban-toast-inner');
        const icon = document.getElementById('kanban-toast-icon');
        const text = document.getElementById('kanban-toast-text');

        text.textContent = message;
        if (type === 'success') {
            inner.className = 'flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl border text-sm font-bold bg-green-50 dark:bg-green-900/40 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300';
            icon.textContent = 'check_circle';
        } else {
            inner.className = 'flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl border text-sm font-bold bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300';
            icon.textContent = 'error';
        }

        toast.classList.remove('opacity-0', '-translate-y-4', 'pointer-events-none');
        toast.classList.add('opacity-100', 'translate-y-0');

        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(function() {
            toast.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
            toast.classList.remove('opacity-100', 'translate-y-0');
        }, 3000);
    }

    // --- Update column counts ---
    function updateCounts() {
        dropzones.forEach(function(zone) {
            var status = zone.dataset.status;
            var count = zone.querySelectorAll('.kanban-card:not(.filter-hidden)').length;
            var badge = document.querySelector('.kanban-count[data-status="' + status + '"]');
            if (badge) badge.textContent = count;

            var empty = zone.querySelector('.kanban-empty');
            if (count === 0 && !empty) {
                var div = document.createElement('div');
                div.className = 'kanban-empty p-4 text-center text-xs text-slate-400 italic border border-dashed border-slate-200 dark:border-slate-700 rounded-xl';
                div.textContent = 'لا يوجد مقترحات';
                zone.appendChild(div);
            } else if (count > 0 && empty) {
                empty.remove();
            }
        });
    }

    // --- Drag Events on Cards ---
    document.querySelectorAll('.kanban-card').forEach(function(card) {
        bindCardDragEvents(card);
    });

    function bindCardDragEvents(card) {
        card.addEventListener('dragstart', function(e) {
            draggedCard = card;
            sourceZone = card.closest('.kanban-dropzone');
            card.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', card.dataset.id);
            e.stopPropagation();
        });

        card.addEventListener('dragend', function() {
            card.classList.remove('dragging');
            dropzones.forEach(function(z) { z.classList.remove('drag-over'); });
            draggedCard = null;
            sourceZone = null;
        });

        card.addEventListener('click', function(e) {
            if (card.classList.contains('was-dragged')) {
                e.preventDefault();
                card.classList.remove('was-dragged');
            }
        });
    }

    // --- Drop Events on Zones ---
    dropzones.forEach(function(zone) {
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', function(e) {
            if (!zone.contains(e.relatedTarget)) {
                zone.classList.remove('drag-over');
            }
        });

        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            zone.classList.remove('drag-over');

            if (!draggedCard) return;

            draggedCard.classList.add('was-dragged');

            var newStatus = zone.dataset.status;
            var oldStatus = draggedCard.dataset.status;
            var suggestionId = draggedCard.dataset.id;

            var afterCard = getClosestCard(zone, e.clientY);
            if (afterCard) {
                zone.insertBefore(draggedCard, afterCard);
            } else {
                var empty = zone.querySelector('.kanban-empty');
                if (empty) {
                    zone.insertBefore(draggedCard, empty);
                } else {
                    zone.appendChild(draggedCard);
                }
            }

            draggedCard.dataset.status = newStatus;
            draggedCard.classList.add('drop-success');
            setTimeout(function() { draggedCard.classList.remove('drop-success'); }, 400);

            updateCounts();

            if (newStatus !== oldStatus) {
                updateSuggestionStatus(suggestionId, newStatus, draggedCard, oldStatus, sourceZone);
            }
        });
    });

    function getClosestCard(zone, y) {
        var cards = Array.from(zone.querySelectorAll('.kanban-card:not(.dragging)'));
        var closest = null;
        var closestOffset = Number.NEGATIVE_INFINITY;

        cards.forEach(function(card) {
            var box = card.getBoundingClientRect();
            var offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closestOffset) {
                closestOffset = offset;
                closest = card;
            }
        });

        return closest;
    }

    // --- API Call ---
    function updateSuggestionStatus(suggestionId, newStatus, card, oldStatus, oldZone) {
        fetch('/admin/dashboard/suggestions/' + suggestionId + '/status', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ status: newStatus })
        })
        .then(function(response) {
            if (!response.ok) throw new Error('فشل التحديث');
            return response.json();
        })
        .then(function(data) {
            showToast('تم تحديث الحالة بنجاح', 'success');
        })
        .catch(function(err) {
            showToast('فشل تحديث الحالة، يرجى المحاولة مرة أخرى', 'error');
            card.dataset.status = oldStatus;
            if (oldZone) {
                var empty = oldZone.querySelector('.kanban-empty');
                if (empty) {
                    oldZone.insertBefore(card, empty);
                } else {
                    oldZone.appendChild(card);
                }
            }
            updateCounts();
        });
    }
});
</script>
@endpush
