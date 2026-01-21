<x-filament-panels::page>
    {{-- Custom Dashboard Header with Gradient --}}
    <div class="mb-6 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-8">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold">
                    {{ strtoupper(substr(auth()->user()->name, 0, 1)) }}
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-white">
                        مرحباً، {{ auth()->user()->name }}
                    </h1>
                    <p class="text-white/70">{{ auth()->user()->email }}</p>
                </div>
            </div>
            
            <div class="flex items-center gap-2">
                <span class="text-white/70 text-sm">{{ now()->format('Y-m-d') }}</span>
            </div>
        </div>
    </div>

    {{-- Stats Widgets --}}
    <div class="mb-6">
        <x-filament-widgets::widgets
            :widgets="$this->getHeaderWidgets()"
            :columns="$this->getHeaderWidgetsColumns()"
        />
    </div>

    {{-- Main Content Widgets --}}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <x-filament-widgets::widgets
            :widgets="$this->getFooterWidgets()"
        />
    </div>
</x-filament-panels::page>
