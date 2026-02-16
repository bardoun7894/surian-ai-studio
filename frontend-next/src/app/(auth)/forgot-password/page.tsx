'use client';

import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, ArrowLeft, ChevronRight, ChevronLeft, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import auth from '@/lib/auth';
import { ApiError } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ForgotPasswordPage = () => {
    const { language } = useLanguage();
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect away if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await auth.forgotPassword(email);
            setIsSent(true);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to send reset link');
            }
        } finally {
            setIsLoading(false);
        }
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
                        <Image
                            src="/assets/logo/Asset-14@3x.png"
                            alt="Syrian Arab Republic Emblem"
                            width={160}
                            height={160}
                            className="relative z-10 drop-shadow-2xl"
                            style={{ width: 'auto', height: 'auto' }}
                        />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white text-center mb-4">
                        {language === 'ar' ? 'وزارة الاقتصاد والصناعة' : 'Ministry of Economy and Industry'}
                    </h1>
                    <p className="text-gov-gold text-lg text-center mb-8">
                        {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'}
                    </p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 bg-gov-beige dark:bg-dm-surface flex items-center justify-center py-12 px-4 sm:px-8">
                <div className="w-full max-w-md">
                    <Link
                        href="/login"
                        className="flex items-center gap-1 text-gray-500 hover:text-gov-teal transition-colors mb-6 group w-fit"
                    >
                        <BackIcon size={18} className="group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                        {language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">
                            {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                        </h1>
                        <p className="text-gray-500 dark:text-white/70">
                            {language === 'ar'
                                ? 'أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور'
                                : 'Enter your email to receive a password reset link'}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gov-card/10 rounded-2xl shadow-xl border border-gray-100 dark:border-gov-border/15 p-6 sm:p-8">
                        {isSent ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gov-charcoal dark:text-white mb-2">
                                    {language === 'ar' ? 'تم الإرسال' : 'Email Sent'}
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {language === 'ar'
                                        ? 'تم إرسال تعليمات إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.'
                                        : 'Password reset instructions have been sent to your email.'}
                                </p>
                                <Link
                                    href="/login"
                                    className="text-gov-teal font-bold hover:underline"
                                >
                                    {language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
                                </Link>
                                <button
                                    onClick={() => setIsSent(false)}
                                    className="text-sm text-gov-teal hover:underline mt-2 block mx-auto"
                                >
                                    {language === 'ar' ? 'إعادة الإرسال' : 'Send Again'}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {error && (
                                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                                        {error}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                                        {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full py-3.5 px-4 pr-12 rtl:pr-4 rtl:pl-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
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
                                            {language === 'ar' ? 'إرسال الرابط' : 'Send Link'}
                                            <ArrowIcon size={18} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                        <div className="flex items-center justify-center gap-2 mt-6 py-3 border-t border-gray-100 dark:border-gov-border/15 text-xs text-gray-500 dark:text-white/70">
                            <Shield size={14} className="text-gov-teal" />
                            {language === 'ar' ? 'اتصال آمن ومشفر بتقنية SSL' : 'Secure SSL encrypted connection'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
