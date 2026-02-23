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

            <a class="{{ request()->routeIs('admin.roles.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.roles.index') }}">
                <span class="material-symbols-outlined">shield</span>
                <span class="text-sm font-medium">الأدوار والصلاحيات</span>
            </a>
        </div>

        <!-- Content Management Nav -->
        <div class="flex flex-col gap-1">
            <p class="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">إدارة المحتوى</p>

            <a class="{{ request()->routeIs('admin.content.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.content.index') }}">
                <span class="material-symbols-outlined">description</span>
                <span class="text-sm font-medium">الأخبار والمحتوى</span>
            </a>

            <a class="{{ request()->routeIs('admin.services.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.services.index') }}">
                <span class="material-symbols-outlined">build</span>
                <span class="text-sm font-medium">الخدمات</span>
            </a>

            <a class="{{ request()->routeIs('admin.investments.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.investments.index') }}">
                <span class="material-symbols-outlined">trending_up</span>
                <span class="text-sm font-medium">الاستثمارات</span>
            </a>

            <a class="{{ request()->routeIs('admin.promotional.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.promotional.index') }}">
                <span class="material-symbols-outlined">campaign</span>
                <span class="text-sm font-medium">الأقسام الترويجية</span>
            </a>

            <a class="{{ request()->routeIs('admin.newsletter.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.newsletter.index') }}">
                <span class="material-symbols-outlined">mail</span>
                <span class="text-sm font-medium">النشرة البريدية</span>
            </a>

            <a class="{{ request()->routeIs('admin.quick-links.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.quick-links.index') }}">
                <span class="material-symbols-outlined">link</span>
                <span class="text-sm font-medium">الروابط السريعة</span>
            </a>
        </div>

        <!-- Operations Nav -->
        <div class="flex flex-col gap-1">
            <p class="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">العمليات والمتابعة</p>

            <a class="{{ request()->routeIs('admin.complaints.*') && !request()->routeIs('admin.complaints.forms.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.complaints.index') }}">
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

            <!-- Sub-link for Complaint Templates -->
            <a class="{{ request()->routeIs('admin.complaint-templates.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald ml-4' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors ml-4' }}" href="{{ route('admin.complaint-templates.index') }}">
                <span class="material-symbols-outlined text-[18px]">content_paste</span>
                <span class="text-xs font-medium">قوالب الشكاوى</span>
            </a>

            <a class="{{ request()->routeIs('admin.suggestions.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.suggestions.index') }}">
                <span class="material-symbols-outlined">lightbulb</span>
                <span class="text-sm font-medium">المقترحات</span>
                @php $pendingSuggestions = \App\Models\Suggestion::where('status', 'pending')->count(); @endphp
                @if($pendingSuggestions > 0)
                    <span class="mr-auto flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-600">{{ $pendingSuggestions }}</span>
                @endif
            </a>

            <a class="{{ request()->routeIs('admin.directorates.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.directorates.index') }}">
                <span class="material-symbols-outlined">domain</span>
                <span class="text-sm font-medium">المديريات</span>
            </a>

            <a class="{{ request()->routeIs('admin.sub-directorates.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald ml-4' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors ml-4' }}" href="{{ route('admin.sub-directorates.index') }}">
                <span class="material-symbols-outlined text-[18px]">account_tree</span>
                <span class="text-xs font-medium">الإدارات الفرعية</span>
            </a>

            <a class="{{ request()->routeIs('admin.notifications.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.notifications.index') }}">
                <span class="material-symbols-outlined">notifications</span>
                <span class="text-sm font-medium">الإشعارات</span>
            </a>
        </div>

        <!-- AI Assistant Nav -->
        <div class="flex flex-col gap-1">
            <p class="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">المساعد الذكي</p>

            <a class="{{ request()->routeIs('admin.ai.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.ai.logs') }}">
                <span class="material-symbols-outlined">smart_toy</span>
                <span class="text-sm font-medium">سجل المحادثات</span>
            </a>

            <a class="{{ request()->routeIs('admin.faqs.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.faqs.index') }}">
                <span class="material-symbols-outlined">quiz</span>
                <span class="text-sm font-medium">الأسئلة الشائعة</span>
            </a>

            <a class="{{ request()->routeIs('admin.faq-suggestions.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.faq-suggestions.index') }}">
                <span class="material-symbols-outlined">tips_and_updates</span>
                <span class="text-sm font-medium">اقتراحات الأسئلة</span>
            </a>

            <a class="{{ request()->routeIs('admin.chat-conversations.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.chat-conversations.index') }}">
                <span class="material-symbols-outlined">chat</span>
                <span class="text-sm font-medium">محادثات الدردشة</span>
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

            <a class="{{ request()->routeIs('admin.system-settings.*') ? 'active-nav-item flex items-center gap-3 rounded-lg bg-gov-emerald/10 px-3 py-2.5 text-gov-emerald' : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gov-emerald transition-colors' }}" href="{{ route('admin.system-settings.index') }}">
                <span class="material-symbols-outlined">tune</span>
                <span class="text-sm font-medium">إعدادات متقدمة</span>
            </a>
        </div>
    </div>

    <!-- Footer User Card -->
    <div class="border-t border-border-light dark:border-border-dark p-4">
        <div class="flex items-center gap-3 rounded-lg border border-border-light dark:border-border-dark p-2 bg-slate-50 dark:bg-slate-800">
            <div class="h-8 w-8 rounded-full bg-gov-emerald/10 flex items-center justify-center text-gov-emerald text-sm font-bold">
                {{ mb_strtoupper(mb_substr(auth()->user()->first_name, 0, 1)) }}{{ mb_strtoupper(mb_substr(auth()->user()->last_name, 0, 1)) }}
            </div>
            <div class="flex flex-col overflow-hidden">
                <span class="truncate text-xs font-bold text-slate-900 dark:text-white">{{ auth()->user()->full_name }}</span>
                <span class="truncate text-[10px] text-slate-500">{{ auth()->user()->role?->label ?? 'مستخدم' }}</span>
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
