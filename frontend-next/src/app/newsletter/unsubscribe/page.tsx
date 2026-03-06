'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { MailX, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const UnsubscribeContent = () => {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const t = {
    title: language === 'ar' ? 'إلغاء الاشتراك في النشرة البريدية' : 'Unsubscribe from Newsletter',
    desc: language === 'ar' ? 'هل أنت متأكد أنك تريد إلغاء اشتراكك في النشرة البريدية؟' : 'Are you sure you want to unsubscribe from our newsletter?',
    confirm: language === 'ar' ? 'تأكيد إلغاء الاشتراك' : 'Confirm Unsubscribe',
    processing: language === 'ar' ? 'جاري المعالجة...' : 'Processing...',
    success: language === 'ar' ? 'تم إلغاء اشتراكك بنجاح' : 'You have been successfully unsubscribed',
    successDesc: language === 'ar' ? 'لن تتلقى أي رسائل بريدية منا بعد الآن.' : 'You will no longer receive emails from us.',
    error: language === 'ar' ? 'حدث خطأ أثناء إلغاء الاشتراك' : 'An error occurred while unsubscribing',
    noToken: language === 'ar' ? 'رابط غير صالح. يرجى استخدام الرابط الموجود في البريد الإلكتروني.' : 'Invalid link. Please use the link from your email.',
    backHome: language === 'ar' ? 'العودة للرئيسية' : 'Back to Home',
  };

  const handleUnsubscribe = async () => {
    if (!token) {
      setStatus('error');
      setMessage(t.noToken);
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/v1/public/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      if (res.ok) {
        setStatus('success');
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus('error');
        setMessage(data.message || t.error);
      }
    } catch {
      setStatus('error');
      setMessage(t.error);
    }
  };

  return (
    <div className="max-w-md w-full bg-white dark:bg-gov-card/10 rounded-3xl shadow-xl border border-gray-100 dark:border-gov-border/15 p-8 text-center">
      {status === 'success' ? (
        <>
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gov-charcoal dark:text-white mb-3">{t.success}</h1>
          <p className="text-gray-500 dark:text-white/70 mb-6">{t.successDesc}</p>
          <a href="/" className="inline-block px-6 py-3 bg-gov-teal text-white rounded-xl font-bold hover:bg-gov-emerald transition-colors">
            {t.backHome}
          </a>
        </>
      ) : status === 'error' ? (
        <>
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gov-charcoal dark:text-white mb-3">{t.error}</h1>
          <p className="text-gray-500 dark:text-white/70 mb-6">{message || t.error}</p>
          <a href="/" className="inline-block px-6 py-3 bg-gov-teal text-white rounded-xl font-bold hover:bg-gov-emerald transition-colors">
            {t.backHome}
          </a>
        </>
      ) : (
        <>
          <div className="w-20 h-20 bg-gov-gold/10 dark:bg-gov-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MailX size={40} className="text-gov-gold" />
          </div>
          <h1 className="text-2xl font-bold text-gov-charcoal dark:text-white mb-3">{t.title}</h1>
          <p className="text-gray-500 dark:text-white/70 mb-8">{t.desc}</p>
          {!token && (
            <p className="text-sm text-red-500 mb-4">{t.noToken}</p>
          )}
          <button
            onClick={handleUnsubscribe}
            disabled={status === 'loading' || !token}
            className="w-full py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {status === 'loading' ? <Loader2 size={20} className="animate-spin" /> : <MailX size={20} />}
            {status === 'loading' ? t.processing : t.confirm}
          </button>
        </>
      )}
    </div>
  );
};

export default function NewsletterUnsubscribePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 pt-20">
        <React.Suspense fallback={<Loader2 className="animate-spin text-gov-gold" size={40} />}>
          <UnsubscribeContent />
        </React.Suspense>
      </main>
      <Footer />
    </div>
  );
}
