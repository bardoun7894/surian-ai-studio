<!DOCTYPE html>
<html class="light" lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تسجيل الدخول - وزارة الاقتصاد</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com?plugins=forms"></script>
    <script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#178282",
                        "primary-dark": "#105e5e",
                        "secondary": "#D4AF37",
                        "background-light": "#f8fafc",
                    },
                    fontFamily: {
                        "display": ["Cairo", "sans-serif"],
                        "body": ["Cairo", "sans-serif"],
                    },
                    backgroundImage: {
                        'subtle-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23178282' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                    }
                },
            },
        }
    </script>
    <style>
        body { font-family: 'Cairo', sans-serif; }
    </style>
</head>
<body class="bg-background-light min-h-screen flex items-center justify-center p-4 bg-subtle-pattern">
    
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <!-- Top Decoration -->
        <div class="h-2 bg-gradient-to-r from-primary to-secondary"></div>
        
        <div class="p-8">
            <!-- Header -->
            <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <span class="material-symbols-outlined text-4xl">account_balance</span>
                </div>
                <h1 class="text-2xl font-bold text-slate-800 tracking-tight">وزارة الاقتصاد</h1>
                <p class="text-slate-500 text-sm mt-1">بوابة الإدارة المركزية</p>
            </div>
            
            <!-- Form -->
            <form action="{{ route('admin.login') }}" method="POST" class="space-y-6">
                @csrf
                
                <div>
                    <label for="email" class="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
                    <div class="relative">
                        <input type="email" id="email" name="email" value="{{ old('email') }}" required autofocus
                            class="w-full pl-4 pr-10 py-2.5 rounded-lg border-slate-300 focus:border-primary focus:ring-primary text-slate-900 bg-slate-50 focus:bg-white transition-colors"
                            placeholder="user@economy.gov.sy">
                        <span class="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">mail</span>
                    </div>
                    @error('email') <p class="text-red-500 text-xs mt-1 font-bold">{{ $message }}</p> @enderror
                </div>
                
                <div>
                    <label for="password" class="block text-sm font-bold text-slate-700 mb-2">كلمة المرور</label>
                    <div class="relative">
                        <input type="password" id="password" name="password" required
                            class="w-full pl-4 pr-10 py-2.5 rounded-lg border-slate-300 focus:border-primary focus:ring-primary text-slate-900 bg-slate-50 focus:bg-white transition-colors"
                            placeholder="••••••••">
                        <span class="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">lock</span>
                    </div>
                </div>
                
                <div class="flex items-center justify-between">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="remember" class="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary">
                        <span class="text-sm text-slate-600">تذكر تسجيل دخولي</span>
                    </label>
                    
                    <a href="#" class="text-sm font-bold text-primary hover:text-primary-dark transition-colors">نسيت كلمة المرور؟</a>
                </div>
                
                <button type="submit" class="w-full py-3 rounded-lg bg-primary text-white font-bold text-base hover:bg-primary-dark shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                    تسجيل الدخول
                </button>
            </form>
        </div>
        
        <!-- Footer -->
        <div class="bg-slate-50 border-t border-slate-100 p-4 text-center">
            <p class="text-xs text-slate-400">
                &copy; {{ date('Y') }} وزارة الاقتصاد والتجارة الخارجية. جميع الحقوق محفوظة.
            </p>
            <p class="text-[10px] text-slate-300 mt-1 font-mono">Ver 2.0.1</p>
        </div>
    </div>

</body>
</html>
