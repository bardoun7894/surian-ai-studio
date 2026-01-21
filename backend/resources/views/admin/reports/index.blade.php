@extends('admin.layouts.app')

@section('title', 'التقارير والإحصائيات')

@section('content')
<div class="flex flex-col gap-8 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">التقارير والإحصائيات</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">تحليل أداء النظام، الشكاوى، والمستخدمين.</p>
        </div>
        <div class="flex items-center gap-2">
            <button class="flex items-center gap-2 rounded border border-border-light bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-gov-emerald transition-colors shadow-sm">
                <span class="material-symbols-outlined text-[18px]">calendar_today</span>
                <span>هذا الشهر</span>
            </button>
            <button class="flex items-center gap-2 rounded bg-gov-emerald px-3 py-1.5 text-sm font-bold text-white hover:bg-gov-emeraldLight transition-colors shadow-sm">
                <span class="material-symbols-outlined text-[18px]">print</span>
                تصدير PDF
            </button>
        </div>
    </div>

    <!-- Key Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1 -->
        <div class="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-2">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">إجمالي المستخدمين</span>
            <div class="flex items-baseline gap-2">
                <h3 class="text-3xl font-bold text-slate-900 dark:text-white">{{ number_format($stats['total_users']) }}</h3>
                <span class="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <span class="material-symbols-outlined text-[12px]">arrow_upward</span>
                    {{ $stats['new_users_this_month'] }}
                </span>
            </div>
            <p class="text-xs text-slate-400">مستخدم جديد هذا الشهر</p>
        </div>

        <!-- Card 2 -->
        <div class="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-2">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">إجمالي الشكاوى</span>
            <div class="flex items-baseline gap-2">
                <h3 class="text-3xl font-bold text-slate-900 dark:text-white">{{ number_format($stats['total_complaints']) }}</h3>
            </div>
            <p class="text-xs text-slate-400">منذ إطلاق النظام</p>
        </div>

        <!-- Card 3 -->
        <div class="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-2">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">معدل الحل</span>
            <div class="flex items-baseline gap-2">
                @php 
                    $resolutionRate = $stats['total_complaints'] > 0 ? ($stats['resolved_complaints'] / $stats['total_complaints']) * 100 : 0;
                @endphp
                <h3 class="text-3xl font-bold text-slate-900 dark:text-white">{{ round($resolutionRate) }}%</h3>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                <div class="bg-gov-emerald h-1.5 rounded-full" style="width: {{ $resolutionRate }}%"></div>
            </div>
        </div>

        <!-- Card 4 -->
        <div class="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-2">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">شكاوى قيد المعالجة</span>
            <div class="flex items-baseline gap-2">
                <h3 class="text-3xl font-bold text-gov-gold">{{ number_format($stats['pending_complaints']) }}</h3>
            </div>
            <p class="text-xs text-slate-400">تتطلب إجراءات متابعة</p>
        </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Monthly Trends -->
        <div class="lg:col-span-2 bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">اتجاهات الشكاوى (آخر 6 أشهر)</h3>
             <div id="monthlyChart" class="w-full h-[300px]"></div>
        </div>

        <!-- Status Distribution -->
        <div class="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">توزيع الحالات</h3>
            <div id="statusChart" class="w-full h-[300px]"></div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
<script>
    document.addEventListener('DOMContentLoaded', function () {
        // Monthly Trends Chart
        var monthlyOptions = {
            series: [{
                name: 'الشكاوى',
                data: @json($monthlyData)
            }],
            chart: {
                type: 'bar',
                height: 300,
                fontFamily: 'Qomra, sans-serif',
                toolbar: { show: false }
            },
            colors: ['#094239'],
            plotOptions: {
                bar: { borderRadius: 4, columnWidth: '40%' }
            },
            xaxis: {
                categories: @json($monthlyLabels),
                axisBorder: { show: false },
                axisTicks: { show: false }
            },
            grid: {
                borderColor: '#f1f5f9',
                strokeDashArray: 4,
            },
            dataLabels: { enabled: false }
        };
        new ApexCharts(document.querySelector("#monthlyChart"), monthlyOptions).render();

        // Status Distribution Chart
        var statusData = @json($complaintStatusData);
        var statusLabels = Object.keys(statusData);
        var statusValues = Object.values(statusData);

        var statusOptions = {
            series: statusValues,
            chart: {
                type: 'donut',
                height: 300,
                fontFamily: 'Qomra, sans-serif'
            },
            labels: statusLabels,
            colors: ['#094239', '#b9a779', '#428177', '#ef4444', '#64748b'], // Emerald, Gold, Teal, Red, Slate
            legend: {
                position: 'bottom',
                fontFamily: 'Qomra, sans-serif'
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%'
                    }
                }
            }
        };
        new ApexCharts(document.querySelector("#statusChart"), statusOptions).render();
    });
</script>
@endpush
