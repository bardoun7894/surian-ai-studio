@extends('admin.layouts.app')

@section('title', 'نظرة عامة - لوحة التحكم')

@section('content')
<div class="mx-auto max-w-7xl flex flex-col gap-8 animate-fade-in">
    <!-- Title Section -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">نظرة عامة على لوحة التحكم</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">مرحباً بعودتك. إليك أحدث البيانات التشغيلية.</p>
        </div>
        <div class="flex items-center gap-2">
            <a href="{{ route('admin.reports.index') }}" class="flex items-center gap-2 rounded border border-border-light bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors shadow-sm">
                <span class="material-symbols-outlined text-[18px]">analytics</span>
                عرض التقارير
            </a>
            <a href="{{ route('admin.complaints.index') }}" class="flex items-center gap-2 rounded bg-gov-emerald px-3 py-1.5 text-sm font-bold text-white hover:bg-gov-emeraldLight transition-colors shadow-sm">
                <span class="material-symbols-outlined text-[18px]">list_alt</span>
                إدارة الشكاوى
            </a>
        </div>
    </div>
    
    <!-- STATS GRID -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Stat Card 1: Users -->
        <div class="relative overflow-hidden rounded-lg bg-white dark:bg-surface-dark p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-border-light dark:border-border-dark group hover:border-gov-emerald/50 transition-colors">
            <div class="absolute left-0 top-0 h-24 w-24 -translate-x-8 -translate-y-8 rounded-full bg-gov-emerald/5 opacity-50 blur-2xl group-hover:bg-gov-emerald/10 transition-all"></div>
            <div class="bg-gov-emerald/5 absolute inset-0 opacity-30"></div>
            <div class="relative z-10 flex flex-col gap-1">
                <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gov-emerald/10 text-gov-emerald">
                    <span class="material-symbols-outlined">person_add</span>
                </div>
                <p class="text-sm font-medium text-slate-500 dark:text-slate-400">إجمالي المستخدمين</p>
                <div class="flex items-baseline gap-2">
                    <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ number_format($stats['total_users']) }}</h3>
                    <span class="flex items-center text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                        <span class="material-symbols-outlined text-[12px] ml-0.5">trending_up</span>
                        1.2%
                    </span>
                </div>
            </div>
        </div>
        
        <!-- Stat Card 2: Complaints -->
        <div class="relative overflow-hidden rounded-lg bg-white dark:bg-surface-dark p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-border-light dark:border-border-dark group hover:border-secondary/50 transition-colors">
            <div class="bg-subtle-pattern absolute inset-0 opacity-30"></div>
            <div class="relative z-10 flex flex-col gap-1">
                <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                    <span class="material-symbols-outlined">report_problem</span>
                </div>
                <p class="text-sm font-medium text-slate-500 dark:text-slate-400">شكاوى مفتوحة</p>
                <div class="flex items-baseline gap-2">
                    <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ $stats['pending_complaints'] }}</h3>
                    <span class="text-xs font-semibold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                        {{ $stats['urgent_complaints'] }} عاجلة
                    </span>
                </div>
            </div>
        </div>
        
        <!-- Stat Card 3: Content -->
        <div class="relative overflow-hidden rounded-lg bg-white dark:bg-surface-dark p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-border-light dark:border-border-dark group hover:border-gov-emerald/50 transition-colors">
            <div class="bg-gov-emerald/5 absolute inset-0 opacity-30"></div>
            <div class="relative z-10 flex flex-col gap-1">
                <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <span class="material-symbols-outlined">article</span>
                </div>
                <p class="text-sm font-medium text-slate-500 dark:text-slate-400">محتوى منشور اليوم</p>
                <div class="flex items-baseline gap-2">
                    <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ $stats['today_content'] }}</h3>
                    <span class="text-xs text-slate-400">مقالات جديدة</span>
                </div>
            </div>
        </div>
        
        <!-- Stat Card 4: AI -->
        <div class="relative overflow-hidden rounded-lg bg-white dark:bg-surface-dark p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-border-light dark:border-border-dark group hover:border-gov-emerald/50 transition-colors">
            <div class="bg-gov-emerald/5 absolute inset-0 opacity-30"></div>
            <div class="relative z-10 flex flex-col gap-1">
                <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <span class="material-symbols-outlined">smart_toy</span>
                </div>
                <p class="text-sm font-medium text-slate-500 dark:text-slate-400">استفسارات الذكاء الاصطناعي</p>
                <div class="flex items-baseline gap-2">
                    <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ number_format($stats['today_conversations']) }}</h3>
                    <span class="flex items-center text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                        <span class="material-symbols-outlined text-[12px] ml-0.5">trending_up</span>
                        12%
                    </span>
                </div>
            </div>
        </div>
    </div>
    
    <!-- CHART & ACTIONS ROW -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Chart Column (2/3) -->
        <div class="lg:col-span-2 rounded bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm p-6">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white">حجم الشكاوى الأسبوعي</h3>
                    <p class="text-sm text-slate-500">نظرة عامة على شكاوى المواطنين خلال الأيام السبعة الماضية</p>
                </div>
                <div class="flex items-center gap-2 text-sm">
                    <span class="h-3 w-3 rounded-full bg-gov-emerald"></span>
                    <span class="text-slate-600 dark:text-slate-300">إجمالي الشكاوى</span>
                </div>
            </div>
            
            <!-- ApexChart Container -->
            <div id="complaintsChart" class="h-[250px] w-full"></div>
            
            <!-- X-Axis Labels -->
            <div class="mt-2 flex justify-between text-xs font-medium text-slate-400">
                @foreach($chartData['labels'] as $label)
                    <span>{{ $label }}</span>
                @endforeach
            </div>
        </div>
        
        <!-- Right Column (1/3) -->
        <div class="flex flex-col gap-6">
            <!-- Pending Actions List -->
            <div class="rounded bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm p-5 flex-1">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">إجراءات معلقة</h3>
                    <span class="text-xs font-semibold text-gov-emerald bg-gov-emerald/10 px-2 py-0.5 rounded">{{ count($pendingActions) }} جديد</span>
                </div>
                <div class="flex flex-col gap-3">
                    @foreach($pendingActions as $action)
                        <label class="flex items-start gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded transition-colors cursor-pointer">
                            <input type="checkbox" {{ $action['completed'] ? 'checked' : '' }} class="mt-1 h-4 w-4 rounded border-slate-300 text-gov-emerald focus:ring-gov-emerald">
                            <div class="flex flex-col">
                                <span class="text-sm font-medium text-slate-800 dark:text-slate-200 {{ $action['completed'] ? 'line-through opacity-60' : '' }}">{{ $action['title'] }}</span>
                                @if(isset($action['priority']) && $action['priority'] === 'high')
                                    <span class="text-xs text-amber-600 font-medium">يتطلب مراجعة عاجلة</span>
                                @else
                                    <span class="text-xs text-slate-500">{{ $action['date'] }}</span>
                                @endif
                            </div>
                        </label>
                        @if(!$loop->last)
                            <div class="h-px w-full bg-slate-100 dark:bg-slate-700"></div>
                        @endif
                    @endforeach
                </div>
                <button class="mt-4 w-full rounded border border-dashed border-slate-300 py-2 text-xs font-semibold text-slate-500 hover:border-gov-emerald hover:text-gov-emerald transition-colors">
                    + إضافة مهمة شخصية
                </button>
            </div>
            
            <!-- Recent Activity Feed -->
            <div class="rounded bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm p-5 flex-1">
                <h3 class="text-base font-bold text-slate-900 dark:text-white mb-4">النشاط الأخير</h3>
                <div class="relative flex flex-col gap-6 pr-2">
                    <!-- Vertical Line -->
                    <div class="absolute right-2 top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-700"></div>
                    
                    @foreach($recentActivity as $activity)
                        <div class="relative flex gap-3 pr-4">
                            <div class="absolute right-[3px] top-1 h-2 w-2 rounded-full {{ $loop->first ? 'bg-gov-emerald' : 'bg-slate-300' }} ring-4 ring-white dark:ring-surface-dark"></div>
                            <div class="flex flex-col">
                                <p class="text-sm font-medium text-slate-900 dark:text-white">{{ $activity['description'] }}</p>
                                <p class="text-xs text-slate-500">{{ $activity['time'] }}</p>
                            </div>
                        </div>
                    @endforeach
                </div>
                <a class="mt-5 block text-center text-xs font-bold text-gov-emerald hover:underline" href="{{ route('admin.logs.index') }}">عرض السجل الكامل</a>
            </div>
        </div>
    </div>
    
    <!-- Footer -->
    <footer class="mt-4 flex items-center justify-between border-t border-border-light dark:border-border-dark pt-6 text-xs text-slate-400">
        <p>© {{ date('Y') }} وزارة الاقتصاد والتجارة الخارجية. جميع الحقوق محفوظة.</p>
        <div class="flex gap-4">
            <a class="hover:text-gov-emerald" href="{{ route('admin.settings.index') }}">إعدادات النظام</a>
            <a class="hover:text-gov-emerald" href="{{ route('admin.logs.index') }}">سجل التدقيق</a>
            <a class="hover:text-gov-emerald" href="{{ route('admin.reports.index') }}">التقارير</a>
        </div>
    </footer>
</div>
@endsection

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const chartData = @json($chartData);
        
        var options = {
            series: [{
                name: 'الشكاوى',
                data: chartData.data
            }],
            chart: {
                height: 280,
                type: 'area',
                fontFamily: 'Qomra, sans-serif',
                toolbar: { show: false },
                zoom: { enabled: false },
                background: 'transparent'
            },
            dataLabels: { enabled: false },
            stroke: { 
                curve: 'smooth', 
                width: 3, 
                colors: ['#094239'] 
            },
            xaxis: {
                categories: chartData.labels,
                axisBorder: { show: false },
                axisTicks: { show: false },
                labels: { 
                    show: true,
                    style: {
                        colors: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b',
                        fontFamily: 'Qomra, sans-serif',
                        fontSize: '11px'
                    } 
                },
                tooltip: { enabled: false }
            },
            yaxis: {
                labels: { 
                    style: {
                        colors: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b',
                        fontFamily: 'Qomra, sans-serif',
                        fontSize: '11px'
                    },
                    formatter: function(val) { return Math.round(val); },
                    offsetX: -10
                }
            },
            colors: ['#094239'],
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.15,
                    opacityTo: 0.02,
                    stops: [0, 90, 100]
                }
            },
            grid: {
                borderColor: document.documentElement.classList.contains('dark') ? '#334155' : '#e2e8f0',
                strokeDashArray: 4,
                xaxis: { lines: { show: false } },
                yaxis: { lines: { show: true } },
                padding: { top: 0, right: 0, bottom: 0, left: 10 }
            },
            markers: {
                size: 0,
                colors: ['#fff'],
                strokeColors: '#094239',
                strokeWidth: 2,
                hover: { 
                    size: 5,
                    sizeOffset: 3
                }
            },
            tooltip: {
                theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
                style: {
                    fontSize: '12px',
                    fontFamily: 'Qomra, sans-serif'
                },
                x: { show: true },
                y: { formatter: function(val) { return val + ' شكوى'; } },
                marker: { show: true }
            }
        };

        var chart = new ApexCharts(document.querySelector("#complaintsChart"), options);
        chart.render();
    });
</script>
@endpush
