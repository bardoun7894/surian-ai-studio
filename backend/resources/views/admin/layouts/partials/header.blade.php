<header class="flex h-16 w-full items-center justify-between border-b border-border-light dark:border-border-dark bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md px-6 z-10 relative">
    <!-- Geometric Decoration -->
    <div class="absolute inset-0 bg-gov-emerald/5 opacity-10 pointer-events-none z-0"></div>
    <div class="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-gov-emeraldStatic via-gov-gold to-gov-emeraldStatic z-10"></div>
    <!-- Mobile Menu & Logo -->
    <div class="flex items-center gap-4 lg:hidden">
        <button class="text-slate-500 hover:text-gov-emerald">
            <span class="material-symbols-outlined">menu</span>
        </button>
        <img src="{{ asset('assets/logo/logo.png') }}" alt="Ministry Logo" class="h-8 w-auto">
    </div>
    
    <!-- Search -->
    <div class="hidden max-w-md flex-1 lg:flex items-center">
        <form action="{{ route('admin.search') }}" method="GET" class="relative w-full group">
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 group-focus-within:text-gov-emerald transition-colors">
                <span class="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input 
                name="q"
                value="{{ request('q') }}"
                class="block w-full rounded border-none bg-slate-100 dark:bg-slate-800 py-2 pr-10 pl-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-gov-emerald transition-shadow" 
                placeholder="بحث في الشكاوى، المستخدمين، التقارير..." 
                type="text"
            >
        </form>
    </div>
    
    <!-- Actions -->
    <div class="flex items-center gap-3">
        <!-- System Status -->
        <div class="hidden items-center gap-2 text-xs font-medium text-slate-500 sm:flex border-l border-border-light pl-4 ml-2">
            <span class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            النظام يعمل
        </div>
        
        <!-- Dark Mode Toggle -->
        <button onclick="document.documentElement.classList.toggle('dark')" class="relative flex h-9 w-9 items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
            <span class="material-symbols-outlined text-[20px] dark:hidden">dark_mode</span>
            <span class="material-symbols-outlined text-[20px] hidden dark:block text-yellow-400">light_mode</span>
        </button>
        
        <!-- Notifications -->
        <button class="relative flex h-9 w-9 items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
            <span class="material-symbols-outlined text-[20px]">notifications</span>
            <span class="absolute top-2 left-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-surface-dark"></span>
        </button>
        
        <!-- User Avatar -->
        <div class="mr-2 h-8 w-8 rounded-full border border-gov-emerald/20 bg-gov-emerald/10 flex items-center justify-center text-gov-emerald text-sm font-bold cursor-pointer hover:ring-2 hover:ring-gov-emerald/20 transition-all">
            {{ mb_strtoupper(mb_substr(auth()->user()->first_name, 0, 1)) }}{{ mb_strtoupper(mb_substr(auth()->user()->last_name, 0, 1)) }}
        </div>
    </div>
</header>
