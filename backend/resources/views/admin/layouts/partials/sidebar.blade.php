<aside class="hidden w-64 flex-col border-l border-border-light dark:border-border-dark bg-white dark:bg-surface-dark lg:flex z-20 shadow-sm relative">
    <!-- Geometric Decoration Top -->
    <div class="absolute inset-0 bg-gov-emerald/5 opacity-10 pointer-events-none z-0"></div>
    <div class="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-gov-emerald via-gov-gold to-gov-emerald z-10"></div>
    
    <!-- Logo & Title -->
    <div class="flex h-16 items-center gap-3 px-6 border-b border-border-light dark:border-border-dark">
        <img src="{{ asset('assets/logo/logo.png') }}" alt="Ministry Logo" class="h-10 w-auto">
        <div class="flex flex-col">
            <h1 class="text-sm font-bold leading-none text-slate-900 dark:text-white tracking-tight font-qomra">وزارة الاقتصاد</h1>
            <span class="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-1">لوحة التحكم</span>
        </div>
    </div>
    
    <!-- Navigation -->
    <div class="flex flex-1 flex-col overflow-y-auto px-4 py-6 gap-6">
        <!-- Main Nav -->
        <div class="flex flex-col gap-1">
            <p class="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">الرئيسية</p>
            
            <a class="{{ request()->routeIs('admin.dashboard') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.dashboard') }}">
                <span class="material-symbols-outlined">dashboard</span>
                <span class="text-sm font-semibold">نظرة عامة</span>
            </a>
            
            <a class="{{ request()->routeIs('admin.users.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.users.index') }}">
                <span class="material-symbols-outlined">group</span>
                <span class="text-sm font-medium">إدارة المستخدمين</span>
            </a>
            
            <a class="{{ request()->routeIs('admin.content.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.content.index') }}">
                <span class="material-symbols-outlined">description</span>
                <span class="text-sm font-medium">المحتوى والمقالات</span>
            </a>
        </div>
        
        <!-- Operations Nav -->
        <div class="flex flex-col gap-1">
            <p class="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">العمليات والمتابعة</p>
            
            <a class="{{ request()->routeIs('admin.complaints.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.complaints.index') }}">
                <span class="material-symbols-outlined">warning</span>
                <span class="text-sm font-medium">شكاوى المواطنين</span>
                @php $pendingCount = \App\Models\Complaint::whereIn('status', ['new', 'pending'])->count(); @endphp
                @if($pendingCount > 0)
                    <span class="mr-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">{{ $pendingCount }}</span>
                @endif
            </a>

            <!-- Sub-link for Forms -->
             <a class="{{ request()->routeIs('admin.complaints.forms.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald ml-4' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors ml-4' }}" href="{{ route('admin.complaints.forms.index') }}">
                <span class="material-symbols-outlined text-[18px]">post_add</span>
                <span class="text-xs font-medium">نماذج الشكاوى</span>
            </a>
            
            <a class="{{ request()->routeIs('admin.directorates.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.directorates.index') }}">
                <span class="material-symbols-outlined">domain</span>
                <span class="text-sm font-medium">المديريات</span>
            </a>

            <a class="{{ request()->routeIs('admin.ai.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.ai.logs') }}">
                <span class="material-symbols-outlined">smart_toy</span>
                <span class="text-sm font-medium">المساعد الذكي</span>
            </a>

            <a class="{{ request()->routeIs('admin.faqs.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.faqs.index') }}">
                <span class="material-symbols-outlined">quiz</span>
                <span class="text-sm font-medium">الأسئلة الشائعة</span>
            </a>
        </div>

        <!-- System Nav -->
        <div class="flex flex-col gap-1">
            <p class="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">النظام والإعدادات</p>
            
            <a class="{{ request()->routeIs('admin.reports.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.reports.index') }}">
                <span class="material-symbols-outlined">analytics</span>
                <span class="text-sm font-medium">التقارير والإحصائيات</span>
            </a>

            <a class="{{ request()->routeIs('admin.logs.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.logs.index') }}">
                <span class="material-symbols-outlined">security</span>
                <span class="text-sm font-medium">سجل التدقيق</span>
            </a>

            <a class="{{ request()->routeIs('admin.settings.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.settings.index') }}">
                <span class="material-symbols-outlined">settings</span>
                <span class="text-sm font-medium">إعدادات النظام</span>
            </a>
        </div>
    </div>
    
    <!-- Footer User Card -->
    <div class="border-t border-border-light dark:border-border-dark p-4">
        <div class="flex items-center gap-3 rounded-lg border border-border-light dark:border-border-dark p-2 bg-slate-50 dark:bg-slate-800">
            <div class="h-8 w-8 rounded-full bg-gov-emerald/10 flex items-center justify-center text-gov-emerald text-sm font-bold">
                {{ strtoupper(substr(auth()->user()->name, 0, 2)) }}
            </div>
            <div class="flex flex-col overflow-hidden">
                <span class="truncate text-xs font-bold text-slate-900 dark:text-white">{{ auth()->user()->name }}</span>
                <span class="truncate text-[10px] text-slate-500">مدير النظام</span>
            </div>
            <a href="#" onclick="event.preventDefault(); document.getElementById('logout-form').submit();" class="mr-auto p-1.5 rounded hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors" title="تسجيل الخروج">
                <span class="material-symbols-outlined text-[16px]">logout</span>
            </a>
            <form id="logout-form" action="{{ route('admin.logout') }}" method="POST" class="hidden">
                 @csrf
            </form>
        </div>
    </div>
</aside>
