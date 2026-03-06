'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Home, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function UnauthorizedPage() {
  const { language } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gov-forest to-gov-charcoal dark:from-dm-bg dark:to-dm-surface p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-dm-surface rounded-3xl shadow-2xl p-8 border border-gov-gold/20">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gov-charcoal dark:text-white mb-2">
            {language === 'ar' ? 'غير مصرح' : 'Unauthorized'}
          </h1>

          {/* Message */}
          <p className="text-gray-600 dark:text-white/70 mb-8">
            {language === 'ar'
              ? 'ليس لديك صلاحية للوصول إلى هذه الصفحة. يرجى التواصل مع مدير النظام إذا كنت تعتقد أن هذا خطأ.'
              : 'You do not have permission to access this page. Please contact the system administrator if you believe this is an error.'}
          </p>

          {/* Error Code */}
          <div className="inline-block px-4 py-2 bg-gov-gold/10 rounded-lg mb-8">
            <span className="text-gov-gold font-mono text-sm">Error 403</span>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gov-gold text-gov-forest font-bold rounded-xl hover:bg-gov-gold/90 transition-colors"
            >
              <Home size={18} />
              {language === 'ar' ? 'العودة للرئيسية' : 'Go to Homepage'}
            </button>

            <button
              onClick={handleGoBack}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-white/10 text-gov-charcoal dark:text-white font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
            >
              <ArrowRight size={18} className="rtl:rotate-180" />
              {language === 'ar' ? 'العودة للخلف' : 'Go Back'}
            </button>

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full text-sm text-gray-500 dark:text-white/70 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                {language === 'ar' ? 'تسجيل الخروج' : 'Sign out'}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-sm text-white/60">
          {language === 'ar'
            ? 'وزارة الاقتصاد والصناعة'
            : 'Ministry of Economy & Industry'}
        </p>
      </div>
    </div>
  );
}
