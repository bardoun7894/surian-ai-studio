@extends('admin.layouts.app')

@section('title', 'المستخدمين والصلاحيات - وزارة الاقتصاد')

@section('content')
<div class="max-w-[1440px] mx-auto w-full">
    <!-- Breadcrumbs -->
    <div class="flex flex-wrap items-center gap-2 mb-6 text-sm">
        <a class="text-slate-500 dark:text-slate-400 hover:text-primary font-medium" href="{{ route('admin.dashboard') }}">الرئيسية</a>
        <span class="material-symbols-outlined text-slate-400 text-[16px] rtl-flip">chevron_left</span>
        <span class="text-primary dark:text-slate-200 font-semibold">المستخدمين والصلاحيات</span>
    </div>
    
    <!-- Header & Primary Action -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div class="flex flex-col gap-2">
            <h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">إدارة المستخدمين</h1>
            <p class="text-slate-500 dark:text-slate-400 text-base max-w-2xl">التحكم في صلاحيات الوصول، الأدوار الوظيفية، وتنظيم أقسام الوزارة.</p>
        </div>
        <div class="flex gap-3">
            <button class="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold py-2.5 px-5 rounded flex items-center gap-2 shadow-sm transition-all">
                <span class="material-symbols-outlined text-[20px]">download</span>
                تصدير
            </button>
            <a href="{{ route('admin.users.create') }}" class="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-5 rounded flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
                <span class="material-symbols-outlined text-[20px]">person_add</span>
                إضافة مستخدم
            </a>
        </div>
    </div>
    
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Total Users -->
        <div class="bg-surface-light dark:bg-surface-dark p-5 rounded border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
            <div class="absolute left-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span class="material-symbols-outlined text-primary text-[64px]">group</span>
            </div>
            <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">إجمالي المستخدمين</p>
            <div class="flex items-baseline gap-2">
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ number_format($users->total()) }}</h3>
                <span class="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded flex items-center">
                    <span class="material-symbols-outlined text-[12px] ml-0.5">trending_up</span> 12%
                </span>
            </div>
        </div>
        
        <!-- Active Now -->
        <div class="bg-surface-light dark:bg-surface-dark p-5 rounded border-r-4 border-primary dark:border-primary shadow-sm">
            <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">نشط الآن</p>
            <div class="flex items-baseline gap-2">
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white">--</h3>
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400">مستقر</span>
            </div>
        </div>
        
        <!-- Pending Approval -->
        <div class="bg-surface-light dark:bg-surface-dark p-5 rounded border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
            <div class="absolute -left-4 -bottom-4 size-16 bg-yellow-400/20 rounded-full blur-xl"></div>
            <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">بانتظار الموافقة</p>
            <div class="flex items-baseline gap-2">
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white">0</h3>
                <span class="text-xs font-medium text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded">+0 اليوم</span>
            </div>
        </div>
        
        <!-- Inactive -->
        <div class="bg-surface-light dark:bg-surface-dark p-5 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
            <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">غير نشط / مؤرشف</p>
            <div class="flex items-baseline gap-2">
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white">0</h3>
                <span class="text-xs font-medium text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">-1%</span>
            </div>
        </div>
    </div>
    
    <!-- Toolbar & Filters -->
    <div class="bg-surface-light dark:bg-surface-dark rounded-t-lg border border-b-0 border-slate-200 dark:border-slate-700 p-4 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
        <div class="flex flex-1 w-full xl:w-auto gap-4 flex-col sm:flex-row">
            <form id="filterForm" action="{{ route('admin.users.index') }}" method="GET" class="contents">
                <!-- Search -->
                <div class="relative flex-1 max-w-md group">
                    <span class="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">search</span>
                    <input name="search" value="{{ request('search') }}" class="w-full bg-background-light dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg h-10 pr-10 pl-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 transition-all" placeholder="بحث بالاسم، البريد أو المعرف..." type="text"/>
                </div>
                
                <!-- Filters -->
                <div class="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    <div class="relative min-w-[140px]">
                        <select name="role" onchange="this.form.submit()" class="w-full appearance-none bg-background-light dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg h-10 pr-3 pl-8 text-sm text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer text-start">
                            <option value="">كل الأدوار</option>
                            <option value="admin" {{ request('role') == 'admin' ? 'selected' : '' }}>مدير نظام</option>
                            <option value="staff" {{ request('role') == 'staff' ? 'selected' : '' }}>موظف</option>
                            <option value="user" {{ request('role') == 'user' ? 'selected' : '' }}>مواطن</option>
                        </select>
                        <span class="material-symbols-outlined absolute left-2 top-2.5 text-slate-500 pointer-events-none text-[20px]">arrow_drop_down</span>
                    </div>
                    
                    <button type="submit" class="h-10 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:border-primary dark:hover:border-primary transition-colors flex items-center justify-center" title="تصفية">
                        <span class="material-symbols-outlined text-[20px]">filter_list</span>
                    </button>
                    @if(request()->anyFilled(['search', 'role']))
                        <a href="{{ route('admin.users.index') }}" class="h-10 px-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors flex items-center justify-center" title="إلغاء التصفيات">
                            <span class="material-symbols-outlined text-[20px]">close</span>
                        </a>
                    @endif
                </div>
            </form>
        </div>
    </div>
    
    <!-- Data Table -->
    <div class="overflow-x-auto bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-b-lg shadow-sm">
        <table class="w-full text-right border-collapse">
            <thead>
                <tr class="bg-primary text-white border-b border-primary-dark">
                    <th class="p-4 w-12 text-center">
                        <input class="rounded border-gray-300 text-primary focus:ring-0 cursor-pointer size-4 bg-white/10 border-white/30 checked:bg-white checked:text-primary" type="checkbox"/>
                    </th>
                    <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">المستخدم</th>
                    <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">الدور</th>
                    <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">القسم</th>
                    <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">الحالة</th>
                    <th class="p-4 text-xs font-bold uppercase tracking-wider text-white/90">آخر دخول</th>
                    <th class="p-4 w-24 text-center text-xs font-bold uppercase tracking-wider text-white/90">إجراءات</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                @forelse($users as $user)
                <tr class="group hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                    <td class="p-4 text-center">
                        <input class="rounded border-gray-300 text-primary focus:ring-primary cursor-pointer size-4 bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600" type="checkbox"/>
                    </td>
                    <td class="p-4">
                        <div class="flex items-center gap-3">
                            <div class="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold border border-primary/20">
                                {{ strtoupper(substr($user->name, 0, 2)) }}
                            </div>
                            <div>
                                <p class="text-sm font-bold text-slate-900 dark:text-white">{{ $user->name }}</p>
                                <p class="text-xs text-slate-500 dark:text-slate-400">{{ $user->email }}</p>
                            </div>
                        </div>
                    </td>
                    <td class="p-4">
                        <div class="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-200">
                            @if($user->hasRole('admin'))
                                <span class="material-symbols-outlined text-[18px] text-primary">security</span> مدير نظام
                            @elseif($user->hasRole('staff'))
                                <span class="material-symbols-outlined text-[18px] text-slate-400">edit_note</span> موظف
                            @else
                                <span class="material-symbols-outlined text-[18px] text-slate-400">person</span> مواطن
                            @endif
                        </div>
                    </td>
                    <td class="p-4">
                        <span class="text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded">
                            {{ $user->directorate ? $user->directorate->name : '-' }}
                        </span>
                    </td>
                    <td class="p-4">
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                            <span class="size-1.5 rounded-full bg-green-600 animate-pulse"></span>
                            نشط
                        </span>
                    </td>
                    <td class="p-4 text-sm text-slate-500 dark:text-slate-400">
                        {{ $user->updated_at->diffForHumans() }}
                    </td>
                    <td class="p-4 text-center">
                        <div class="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a href="{{ route('admin.users.edit', $user) }}" class="size-8 flex items-center justify-center rounded text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <span class="material-symbols-outlined text-[20px]">edit</span>
                            </a>
                            <form action="{{ route('admin.users.destroy', $user) }}" method="POST" onsubmit="return confirm('هل أنت متأكد من حذف هذا المستخدم؟');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="size-8 flex items-center justify-center rounded text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                    <span class="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="7" class="p-8 text-center text-slate-500">لا يوجد مستخدمين.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
    
    <!-- Pagination -->
    <div class="mt-6 dir-ltr">
        {{ $users->links('pagination::simple-tailwind') }}
    </div>
</div>
@endsection
