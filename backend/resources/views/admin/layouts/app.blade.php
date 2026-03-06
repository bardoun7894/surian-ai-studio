<!DOCTYPE html>
<html class="light" lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'لوحة التحكم - وزارة الاقتصاد')</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        primary: "#178282", // Keeping for backward compatibility
                        gov: {
                            forest: '#094239',
                            emerald: '#094239',
                            emeraldLight: '#115E59',
                            teal: '#428177',
                            gold: '#b9a779',
                            sand: '#988561',
                            beige: '#edebe0',
                            umber: '#260f14',
                            cherry: '#4a151e',
                            red: '#6b1f2a',
                            charcoal: '#161616',
                            stone: '#3d3a3b'
                        },
                        mofa: {
                            teal: '#054239',
                            light: '#f0fdfa'
                        },
                        // Keeping existing mappings mapped to new/closest values or staying same
                        "primary-dark": "#105e5e",
                        "secondary": "#D4AF37",
                        "background-light": "#f8fafc",
                        "background-dark": "#0f172a",
                        "surface-light": "#ffffff",
                        "surface-dark": "#1e293b",
                        "border-light": "#e2e8f0",
                        "border-dark": "#334155",
                    },
                    fontFamily: {
                        sans: ['"Qomra"', '"Cairo"', '"Noto Sans Arabic"', 'Arial', 'sans-serif'],
                        display: ['"Qomra"', '"Cairo"', '"Noto Kufi Arabic"', 'Arial', 'sans-serif'],
                        body: ['"Qomra"', '"Cairo"', 'sans-serif'],
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "2xl": "1rem",
                        "full": "9999px"
                    },
                    backgroundImage: {
                        'subtle-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23178282' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                    },
                    animation: {
                        'fade-in': 'fadeIn 0.5s ease-out forwards',
                        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    },
                    keyframes: {
                        fadeIn: {
                            '0%': { opacity: '0' },
                            '100%': { opacity: '1' },
                        }
                    }
                },
            },
        }
    </script>
    <style>
        @font-face {
            font-family: 'Qomra';
            src: url('/fonts/Qomra/itfQomraArabic-Light.otf') format('opentype');
            font-weight: 300;
            font-style: normal;
        }
        @font-face {
            font-family: 'Qomra';
            src: url('/fonts/Qomra/itfQomraArabic-Regular.otf') format('opentype');
            font-weight: 400;
            font-style: normal;
        }
        @font-face {
            font-family: 'Qomra';
            src: url('/fonts/Qomra/itfQomraArabic-Bold.otf') format('opentype');
            font-weight: 700;
            font-style: normal;
        }
        
        body { font-family: 'Qomra', 'Cairo', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .active-nav-item .material-symbols-outlined { font-variation-settings: 'FILL' 1; }
        [dir="rtl"] .rtl-flip { transform: scaleX(-1); }
    </style>
</head>
<body class="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-display antialiased overflow-hidden selection:bg-gov-emerald selection:text-white">
    <div class="flex h-screen w-full">
        <!-- SIDEBAR -->
        @include('admin.layouts.partials.sidebar')
        
        <!-- MAIN CONTENT -->
        <main class="flex flex-1 flex-col overflow-hidden relative">
            <!-- TOP HEADER -->
            @include('admin.layouts.partials.header')
            
            <!-- SCROLLABLE CONTENT -->
            <div class="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-8">
                @yield('content')
            </div>
        </main>
    </div>
    
    @stack('scripts')
</body>
</html>
