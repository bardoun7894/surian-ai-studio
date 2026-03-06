import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, ChevronRight, ChevronLeft, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ViewState } from '../types';

interface ForgotPasswordPageProps {
    onNavigate: (view: ViewState) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
    const { t, language } = useLanguage();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSent(true);
        }, 1500);
    };

    const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;
    const BackIcon = language === 'ar' ? ChevronRight : ChevronLeft;

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding (Same as Login) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gov-forest relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-pattern-islamic bg-repeat bg-center" />
                </div>
                <div className="absolute top-20 -right-20 w-80 h-80 rounded-full border border-gov-gold/20" />
                <div className="absolute bottom-20 -left-20 w-96 h-96 rounded-full border border-gov-gold/10" />
                <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-gov-gold/20 rounded-full blur-3xl scale-150" />
                        <img
                            src="/assets/logo/Asset-14@3x.png"
                            alt="Syrian Arab Republic Emblem"
                            className="w-40 h-40 relative z-10 drop-shadow-2xl"
                        />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white text-center mb-4">
                        {t('auth_ministry_name')}
                    </h1>
                    <p className="text-gov-gold text-lg text-center mb-8">
                        {t('republic_name')}
                    </p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 bg-gov-beige dark:bg-gov-charcoal flex items-center justify-center py-12 px-4 sm:px-8">
                <div className="w-full max-w-md">
                    <button
                        onClick={() => onNavigate('LOGIN')}
                        className="flex items-center gap-1 text-gray-500 hover:text-gov-teal transition-colors mb-6 group"
                    >
                        <BackIcon size={18} className="group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                        {t('auth_back_login')}
                    </button>

                    <div className="mb-8">
                        <h1 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">
                            {t('forgot_title')}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            {t('forgot_subtitle')}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-white/5 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-6 sm:p-8">
                        {isSent ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gov-charcoal dark:text-white mb-2">
                                    {t('forgot_sent_title')}
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {t('forgot_sent_desc')}
                                </p>
                                <button
                                    onClick={() => onNavigate('LOGIN')}
                                    className="text-gov-teal font-bold hover:underline"
                                >
                                    {t('auth_back_login')}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                                        {t('auth_email')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full py-3.5 px-4 pr-12 rtl:pr-4 rtl:pl-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                            placeholder="example@domain.com"
                                            required
                                        />
                                        <Mail className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-gradient-to-r from-gov-gold to-gov-sand text-gov-forest font-bold rounded-xl hover:from-gov-sand hover:to-gov-gold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-gov-forest/30 border-t-gov-forest rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {t('forgot_send_link')}
                                            <ArrowIcon size={18} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                        <div className="flex items-center justify-center gap-2 mt-6 py-3 border-t border-gray-100 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400">
                            <Shield size={14} className="text-gov-teal" />
                            {t('auth_ssl_secure')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
