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
        toast.success(data.message || t('newsletter_subscribed'));
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
    <section className="py-12 md:py-20 bg-gradient-to-br from-gov-forest via-gov-teal to-gov-forest dark:from-dm-surface dark:via-dm-surface dark:to-dm-surface relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-pattern-islamic bg-[length:200px] md:bg-[length:400px] bg-repeat" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 rounded-full mb-4 md:mb-6 backdrop-blur-sm border border-white/10">
          <Mail className="text-gov-gold w-4 h-4 md:w-[18px] md:h-[18px]" size={18} />
          <span className="text-gov-gold font-bold text-xs md:text-sm">{t('nl_badge')}</span>
        </div>

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white dark:text-gov-teal mb-3 md:mb-4">
          {t('nl_title')}
        </h2>
        <p className="text-white/70 dark:text-white/70 text-sm md:text-lg max-w-2xl mx-auto mb-6 md:mb-10">
          {t('nl_subtitle')}
        </p>

        {subscribed ? (
          <div className="flex items-center justify-center gap-2 md:gap-3 text-white bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl px-6 py-4 md:px-8 md:py-6 max-w-md mx-auto border border-white/10">
            <CheckCircle2 size={24} className="text-gov-gold w-5 h-5 md:w-6 md:h-6" />
            <span className="font-bold text-sm md:text-base">{t('newsletter_subscribed')}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 md:gap-3 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
                className="w-full py-3 px-4 md:py-4 md:px-6 pr-10 md:pr-12 rtl:pr-4 md:rtl:pr-6 rtl:pl-10 md:rtl:pl-12 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-gov-gold focus:ring-1 focus:ring-gov-gold transition-all text-sm md:text-base"
                disabled={loading}
              />
              <Mail className="absolute right-3 md:right-4 rtl:right-auto rtl:left-3 md:rtl:left-4 top-1/2 -translate-y-1/2 text-white/40 w-[18px] h-[18px] md:w-5 md:h-5" size={20} />
            </div>
            <button
              type="submit"
              disabled={loading || !email}
              className="px-6 py-3 md:px-8 md:py-4 bg-gov-gold text-gov-forest font-bold rounded-lg md:rounded-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 text-sm md:text-base"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin w-[18px] h-[18px] md:w-5 md:h-5" />
              ) : (
                <>
                  <Send size={18} className="w-4 h-4 md:w-[18px] md:h-[18px]" />
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
