'use client';

import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { API } from '@/lib/repository';
import { useRecaptcha } from '@/hooks/useRecaptcha';

interface NewsletterSignupProps {
    className?: string;
}

export default function NewsletterSignup({ className = '' }: NewsletterSignupProps) {
    const { language } = useLanguage();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const { executeRecaptcha } = useRecaptcha();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            toast.error(language === 'ar' ? 'يرجى إدخال بريد إلكتروني صالح' : 'Please enter a valid email');
            return;
        }

        setLoading(true);
        setStatus('idle');

        try {
            const recaptchaToken = await executeRecaptcha('newsletter_subscribe');
            const data = await API.newsletter.subscribe(email, recaptchaToken);

            if (data.success) {
                setStatus('success');
                setEmail('');
                toast.success(data.message || (language === 'ar' ? 'تم الاشتراك بنجاح' : 'Subscribed successfully'));
            } else {
                setStatus('error');
                toast.error(data.message || (language === 'ar' ? 'فشل الاشتراك' : 'Subscription failed'));
            }
        } catch (error) {
            setStatus('error');
            toast.error(language === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى' : 'An error occurred. Please try again');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${className}`}>
            <h3 className="text-lg font-bold text-gov-charcoal dark:text-white mb-3">
                {language === 'ar' ? 'النشرة البريدية' : 'Newsletter'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {language === 'ar'
                    ? 'اشترك للحصول على آخر الأخبار والتحديثات'
                    : 'Subscribe to get the latest news and updates'}
            </p>

            {status === 'success' ? (
                <div className="flex items-center gap-2 text-gov-emerald dark:text-gov-emeraldLight text-sm bg-gov-emerald/10 dark:bg-gov-white/5 p-3 rounded-lg border border-gov-emerald/20">
                    <CheckCircle2 size={18} />
                    <span>{language === 'ar' ? 'تم الاشتراك بنجاح!' : 'Subscribed successfully!'}</span>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={language === 'ar' ? 'بريدك الإلكتروني' : 'Your email'}
                            className="w-full py-3 px-4 pr-12 rtl:pr-4 rtl:pl-12 rounded-lg bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-gold transition-colors"
                            disabled={loading}
                        />
                        <Mail className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full py-3 bg-gov-gold text-gov-forest font-bold rounded-lg hover:bg-gov-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <>
                                <Mail size={18} />
                                {language === 'ar' ? 'اشتراك' : 'Subscribe'}
                            </>
                        )}
                    </button>

                    {status === 'error' && (
                        <div className="flex items-center gap-2 text-gov-cherry dark:text-red-400 text-xs mt-2">
                            <AlertCircle size={14} />
                            <span>{language === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى' : 'An error occurred'}</span>
                        </div>
                    )}
                </form>
            )}
        </div>
    );
}
