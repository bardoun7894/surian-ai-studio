'use client';

import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle2, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { API } from '@/lib/repository';
import { useRecaptcha } from '@/hooks/useRecaptcha';

const NewsletterSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { executeRecaptcha } = useRecaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error(language === 'ar' ? 'يرجى إدخال بريد إلكتروني صالح' : 'Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      const recaptchaToken = await executeRecaptcha('newsletter_subscribe');
      const data = await API.newsletter.subscribe(email, recaptchaToken);
      if (data.success) {
        setSubscribed(true);
        setEmail('');
        toast.success(data.message || t('nl_success'));
      } else {
        toast.error(data.message || t('nl_error'));
      }
    } catch {
      toast.error(t('nl_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gov-forest via-gov-teal to-gov-forest dark:bg-gov-emeraldStatic dark:from-transparent dark:via-transparent dark:to-transparent relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-pattern-islamic bg-[length:400px] bg-repeat" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6 backdrop-blur-sm border border-white/10">
          <Mail className="text-gov-gold" size={18} />
          <span className="text-gov-gold font-bold text-sm">{t('nl_badge')}</span>
        </div>

        <h2 className="text-3xl md:text-4xl font-display font-bold text-white dark:text-gov-gold mb-4">
          {t('nl_title')}
        </h2>
        <p className="text-white/70 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-10">
          {t('nl_subtitle')}
        </p>

        {subscribed ? (
          <div className="flex items-center justify-center gap-3 text-white bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 max-w-md mx-auto border border-white/10">
            <CheckCircle2 size={24} className="text-gov-gold" />
            <span className="font-bold">{t('nl_success')}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
                className="w-full py-4 px-6 pr-12 rtl:pr-6 rtl:pl-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-gov-gold focus:ring-1 focus:ring-gov-gold transition-all text-base"
                disabled={loading}
              />
              <Mail className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            </div>
            <button
              type="submit"
              disabled={loading || !email}
              className="px-8 py-4 bg-gov-gold text-gov-forest font-bold rounded-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Send size={18} />
                  {t('nl_cta')}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
