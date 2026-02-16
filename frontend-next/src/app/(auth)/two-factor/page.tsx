'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Shield, ChevronRight, ChevronLeft, Loader2, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ApiError } from '@/lib/api';

const TwoFactorContent = () => {
    const { language, t } = useLanguage();
    const { verify2fa } = useAuth();
    const { startLoading, stopLoading } = useLoading();
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resendSuccess, setResendSuccess] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const BackIcon = language === 'ar' ? ChevronRight : ChevronLeft;

    // Block access if no email (not coming from login) or already verified
    useEffect(() => {
        // If we have no email, we must go back to login
        if (!email) {
            router.replace('/login');
            return;
        }

        // If we are already verified for this email, skip to dashboard
        const verified = sessionStorage.getItem('2fa_verified');
        if (verified === email) {
            router.replace('/dashboard');
        }
        // otherwise, stay here and let user enter code
    }, [email, router]);

    // Auto-focus first input
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Visibility change handler - re-focus first empty input when user returns to tab
    useEffect(() => {
        const handleVisibilityChange = () => {
            // When user returns to tab, re-focus the first empty input
            if (!document.hidden) {
                const firstEmpty = code.findIndex(c => !c);
                if (firstEmpty !== -1) {
                    inputRefs.current[firstEmpty]?.focus();
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [code]);

    const handleInputChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        // Auto-advance to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length > 0) {
            const newCode = [...code];
            for (let i = 0; i < 6; i++) {
                newCode[i] = pasted[i] || '';
            }
            setCode(newCode);
            // Focus the next empty input or the last one
            const nextEmpty = newCode.findIndex(c => !c);
            inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otp = code.join('');
        if (otp.length !== 6) return;

        setIsLoading(true);
        setError(null);

        try {
            await verify2fa({ email, otp });
            sessionStorage.setItem('2fa_verified', email);
            // Show loading badge before navigating to dashboard
            startLoading();
            setIsLoading(false);
            router.replace('/dashboard');
            // Safety fallback: ensure loading is stopped after navigation completes.
            // This handles cases where the pathname change listener fails to fire.
            setTimeout(() => {
                stopLoading();
            }, 3000);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError(t('twofa_invalid_code'));
            }
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setResendSuccess(false);
        setError(null);
        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
            await fetch(`${API_BASE_URL}/auth/resend-2fa`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            setResendSuccess(true);
            setTimeout(() => setResendSuccess(false), 3000);
        } catch {
            setError(t('twofa_expired'));
        }
    };

    const isCodeComplete = code.every(c => c !== '');

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding (hidden on mobile) */}
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
                        {language === 'ar' ? 'وزارة الاقتصاد والصناعة' : 'Ministry of Economy & Industry'}
                    </h1>
                    <p className="text-gov-gold text-lg text-center mb-8">
                        {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'}
                    </p>

                    <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gov-gold to-transparent mb-8" />

                    <div className="space-y-4 text-white/80">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gov-gold/20 flex items-center justify-center">
                                <Shield size={16} className="text-gov-gold" />
                            </div>
                            <span>{t('twofa_title')}</span>
                        </div>
                    </div>
                </div>

                <Image
                    src="/assets/logo/stars.png"
                    alt=""
                    width={96}
                    height={32}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30"
                    style={{ width: 'auto', height: 'auto' }}
                />
            </div>

            {/* Right Panel - 2FA Form */}
            <div className="flex-1 bg-gov-beige dark:bg-dm-surface flex items-center justify-center py-12 px-4 sm:px-8">
                <div className="w-full max-w-md">
                    {/* Back Button */}
                    <Link
                        href="/login"
                        className="flex items-center gap-1 text-gray-500 dark:text-white/60 hover:text-gov-teal transition-colors mb-6 group"
                    >
                        <BackIcon size={18} className="group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                        {language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
                    </Link>

                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Image
                            src="/assets/logo/Asset-14@3x.png"
                            alt="Emblem"
                            width={80}
                            height={80}
                            className="mx-auto mb-4"
                            style={{ width: 'auto', height: 'auto' }}
                        />
                    </div>

                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="w-16 h-16 bg-gov-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Shield size={32} className="text-gov-teal" />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">
                            {t('twofa_title')}
                        </h1>
                        <p className="text-gray-500 dark:text-white/70">
                            {t('twofa_subtitle')}
                        </p>
                        {email && (
                            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gov-teal">
                                <Mail size={14} />
                                <span dir="ltr">{email}</span>
                            </div>
                        )}
                    </div>

                    {/* 2FA Card */}
                    <div className="bg-white dark:bg-gov-card/10 rounded-2xl shadow-xl border border-gray-100 dark:border-gov-border/15 p-6 sm:p-8">
                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Resend Success */}
                        {resendSuccess && (
                            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-lg">
                                {t('twofa_resend_success')}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* OTP Code Input */}
                            <div>
                                <label className="block text-sm font-medium text-gov-charcoal dark:text-white mb-3 text-center">
                                    {t('twofa_code_label')}
                                </label>
                                <div className="flex gap-2 justify-center" dir="ltr" onPaste={handlePaste}>
                                    {code.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={el => { inputRefs.current[index] = el; }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || !isCodeComplete}
                                className="w-full py-4 bg-gradient-to-r from-gov-gold to-gov-sand text-gov-forest font-bold rounded-xl hover:from-gov-sand hover:to-gov-gold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <>
                                        <Shield size={18} />
                                        {t('twofa_verify')}
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Resend Code */}
                        <div className="text-center mt-6 pt-4 border-t border-gray-100 dark:border-gov-border/15">
                            <button
                                onClick={handleResend}
                                className="text-sm text-gov-teal hover:text-gov-forest dark:hover:text-gov-gold hover:underline transition-colors font-medium"
                            >
                                {t('twofa_resend')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TwoFactorPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gov-beige dark:bg-dm-bg">
                <Loader2 className="w-8 h-8 animate-spin text-gov-teal" />
            </div>
        }>
            <TwoFactorContent />
        </Suspense>
    );
};

export default TwoFactorPage;
