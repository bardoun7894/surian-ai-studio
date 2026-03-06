@extends('admin.layouts.app')

@section('title', 'نتائج البحث عن: ' . $query)

@section('content')
<div class="mx-auto max-w-7xl">
    <div class="flex items-center justify-between mb-8">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">search</span>
                نتائج البحث
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                تظهر النتائج لـ: <span class="font-bold text-slate-900 dark:text-white">"{{ $query }}"</span>
            </p>
        </div>
    </div>

    @if($users->isEmpty() && $contents->isEmpty() && $complaints->isEmpty())
        <div class="flex flex-col items-center justify-center py-20 bg-white dark:bg-surface-dark rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <div class="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                <span class="material-symbols-outlined text-3xl">search_off</span>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">لم يتم العثور على نتائج</h3>
            <p class="text-slate-500 text-sm mt-1">حاول البحث بكلمات مختلفة أو تأكد من الكتابة الصحيحة.</p>
        </div>
    @endif

    <div class="grid grid-cols-1 gap-8">
        <!-- Results: Complaints -->
        @if($complaints->isNotEmpty())
            <div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span class="material-symbols-outlined text-amber-600">warning</span>
                    الشكاوى ({{ $complaints->count() }})
                </h2>
                <div class="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
                    <div class="divide-y divide-border-light dark:divide-border-dark">
                        @foreach($complaints as $complaint)
                            <a href="{{ route('admin.complaints.show', $complaint) }}" class="block p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <span class="px-2 py-1 rounded text-xs font-bold font-mono bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                            {{ $complaint->tracking_number }}
                                        </span>
                                        <div>
                                            <p class="font-bold text-slate-900 dark:text-white text-sm">{{ $complaint->title }}</p>
                                            <p class="text-xs text-slate-500 mt-0.5 line-clamp-1">{{ $complaint->description }}</p>
                                        </div>
                                    </div>
                                    <span class="material-symbols-outlined text-slate-300 text-[20px]">chevron_left</span>
                                </div>
                            </a>
                        @endforeach
                    </div>
                </div>
            </div>
        @endif

        <!-- Results: Users -->
        @if($users->isNotEmpty())
            <div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span class="material-symbols-outlined text-blue-600">group</span>
                    المستخدمين ({{ $users->count() }})
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    @foreach($users as $user)
                        <div class="flex items-center gap-3 p-4 bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                            <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {{ mb_substr($user->first_name, 0, 1) }}
                            </div>
                            <div class="flex-1 overflow-hidden">
                                <p class="font-bold text-slate-900 dark:text-white text-sm truncate">{{ $user->full_name }}</p>
                                <p class="text-xs text-slate-500 truncate">{{ $user->email }}</p>
                            </div>
                            <a href="{{ route('admin.users.edit', $user) }}" class="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-primary transition-colors">
                                <span class="material-symbols-outlined text-[18px]">edit</span>
                            </a>
                        </div>
                    @endforeach
                </div>
            </div>
        @endif

        <!-- Results: Content -->
        @if($contents->isNotEmpty())
            <div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">article</span>
                    المحتوى ({{ $contents->count() }})
                </h2>
                <div class="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
                    <div class="divide-y divide-border-light dark:divide-border-dark">
                        @foreach($contents as $content)
                            <a href="{{ route('admin.content.edit', $content) }}" class="block p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                                            <span class="material-symbols-outlined text-[18px]">article</span>
                                        </div>
                                        <div>
                                            <p class="font-bold text-slate-900 dark:text-white text-sm">{{ $content->title_ar }}</p>
                                            <div class="flex items-center gap-2 mt-0.5">
                                                <span class="text-xs text-slate-500">{{ $content->category }}</span>
                                                <span class="text-[10px] px-1.5 py-0.5 rounded {{ $content->status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600' }}">
                                                    {{ $content->status }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span class="material-symbols-outlined text-slate-300 text-[20px]">chevron_left</span>
                                </div>
                            </a>
                        @endforeach
                    </div>
                </div>
            </div>
        @endif
    </div>
</div>
@endsection
