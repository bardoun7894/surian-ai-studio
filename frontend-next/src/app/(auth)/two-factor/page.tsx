'use client';

import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { Shield, ChevronRight, ChevronLeft, Loader2, Mail, AlertTriangle, Clock, Fingerprint, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ApiError } from '@/lib/api';

// Resend cooldown in seconds
const RESEND_COOLDOWN = 60;
// Max verification attempts before lockout
const MAX_ATTEMPTS = 5;

const TwoFactorContent = () => {
    const { language, t } = useLanguage();
    const { verify2fa, resend2fa, isAuthenticated, user } = useAuth();
    const { startLoading } = useLoading();
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const formRef = useRef<HTMLFormElement>(null);

    const BackIcon = language === 'ar' ? ChevronRight : ChevronLeft;

    // Block access if no email (not coming from login) or already authenticated
    useEffect(() => {
        // If already fully authenticated, go to appropriate page
        if (isAuthenticated && user) {
            const role = user.role?.name?.toLowerCase();
            if (role === 'admin' || role === 'staff' || role === 'complaint_officer') {
                router.replace('/admin');
            } else {
                router.replace('/dashboard');
            }
            return;
        }

        // If we have no email, we must go back to login
        if (!email) {
            router.replace('/login');
            return;
        }
    }, [email, router, isAuthenticated, user]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => {
            setResendCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

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

    // Submit handler extracted for auto-submit support
    const submitCode = useCallback(async (otp: string) => {
        if (otp.length !== 6 || isLoading) return;
        if (attempts >= MAX_ATTEMPTS) {
            setError(t('twofa_too_many_attempts'));
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await verify2fa({ email, otp });
            // Show full-page loading overlay only after successful verification,
            // right before navigating away — keeps button spinner visible during API call
            startLoading();
            setIsLoading(false);

            // Role-based redirect after successful 2FA
            if (response.user) {
                const role = response.user.role?.name?.toLowerCase();
                if (role === 'admin' || role === 'staff' || role === 'complaint_officer') {
                    router.replace('/admin');
                } else {
                    router.replace('/dashboard');
                }
            } else {
                router.replace('/dashboard');
            }
        } catch (err) {
            setAttempts(prev => prev + 1);
            if (err instanceof ApiError) {
                if (err.status === 429) {
                    setError(t('twofa_rate_limited'));
                } else if (err.status === 422) {
                    setError(err.message);
                } else {
                    setError(err.message);
                }
            } else {
                setError(t('twofa_invalid_code'));
            }
            // Clear code on failed attempt so user can re-enter
            setCode(['', '', '', '', '', '']);
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
            setIsLoading(false);
        }
    }, [email, isLoading, attempts, verify2fa, startLoading, router, t]);

    const handleInputChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        // Auto-advance to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all 6 digits are filled
        if (value && newCode.every(c => c !== '')) {
            submitCode(newCode.join(''));
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

            // Auto-submit if all 6 digits were pasted
            if (newCode.every(c => c !== '')) {
                submitCode(newCode.join(''));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        submitCode(code.join(''));
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;
        setResendSuccess(false);
        setError(null);
        setIsResending(true);
        try {
            await resend2fa({ email });
            setResendSuccess(true);
            setResendCooldown(RESEND_COOLDOWN);
            // Reset attempts on resend (new code generated)
            setAttempts(0);
            // Clear any stale code
            setCode(['', '', '', '', '', '']);
            setTimeout(() => {
                setResendSuccess(false);
                inputRefs.current[0]?.focus();
            }, 3000);
        } catch (err) {
            if (err instanceof ApiError && err.status === 429) {
                setError(t('twofa_resend_rate_limited'));
            } else {
                setError(t('twofa_resend_failed'));
            }
        } finally {
            setIsResending(false);
        }
    };

    const isCodeComplete = code.every(c => c !== '');
    const isLockedOut = attempts >= MAX_ATTEMPTS;

    return (
        <div className="min-h-screen flex overflow-x-hidden max-w-[100vw]">
            {/* Left Panel - Branding (hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gov-forest relative overflow-hidden lg:fixed lg:inset-y-0 lg:left-0 rtl:lg:left-auto rtl:lg:right-0">
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-pattern-islamic bg-repeat bg-center" />
                </div>

                {/* Islamic Geometric Decorations */}
                <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                    {/* Mihrab-inspired Arch Backdrop */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border-[2px] border-gov-gold/30 rounded-[100%_100%_0_0] transform rotate-12" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border-[1px] border-gov-gold/20 rounded-[100%_100%_0_0] transform -rotate-6" />

                    {/* Corner Islamic Patterns */}
                    <div className="absolute top-0 right-0 w-64 h-64 border-r-2 border-t-2 border-gov-gold/20 rounded-bl-[100%] opacity-50" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 border-l-2 border-b-2 border-gov-gold/15 rounded-tr-[100%] opacity-40" />

                    {/* Subtle Star Patterns */}
                    <div className="absolute top-1/4 left-10 w-4 h-4 bg-gov-gold/40 rotate-45 animate-pulse-slow" />
                    <div className="absolute top-1/3 right-20 w-3 h-3 bg-gov-gold/30 rotate-12 animate-pulse-slow" style={{ animationDelay: '1s' }} />
                    <div className="absolute bottom-1/4 right-10 w-5 h-5 bg-gov-gold/20 rotate-45 animate-pulse-slow" style={{ animationDelay: '2s' }} />
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">


                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-gov-gold/20 rounded-full blur-3xl scale-150" />
                        <Image
                            src="/assets/logo/Asset-15@2x.png"
                            alt="Ministry of Economy and Industry"
                            width={140}
                            height={140}
                            className="relative z-10 drop-shadow-2xl max-w-[140px] max-h-[140px]"
                            style={{ width: 'auto', height: 'auto' }}
                        />
                    </div>

                    <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gov-gold to-transparent mb-8" />

                    <div className="space-y-4 text-white/80">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gov-gold/20 flex items-center justify-center">
                                <Shield size={16} className="text-gov-gold" />
                            </div>
                            <span>{language === 'ar' ? 'اتصال آمن ومشفر' : 'Secure encrypted connection'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gov-gold/20 flex items-center justify-center">
                                <Fingerprint size={16} className="text-gov-gold" />
                            </div>
                            <span>{language === 'ar' ? 'تحقق من الهوية' : 'Identity verification'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gov-gold/20 flex items-center justify-center">
                                <Lock size={16} className="text-gov-gold" />
                            </div>
                            <span>{language === 'ar' ? 'حماية بياناتك الشخصية' : 'Personal data protection'}</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Decorative Pattern & Copyright */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gov-gold/10 to-transparent opacity-50 pointer-events-none" />

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                    <p className="text-gov-gold/60 text-sm font-medium mb-2 whitespace-nowrap">
                        {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'}
                    </p>
                    <div className="flex gap-4 opacity-50">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" style={{ animationDelay: '0s' }} />
                        <div className="w-2 h-2 rounded-full bg-gov-gold animate-pulse" style={{ animationDelay: '0.5s' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>
                </div>
            </div>

            {/* Right Panel - 2FA Form (Pushed by fixed left panel on desktop) */}
            <div className="w-full lg:w-1/2 lg:ml-[50%] rtl:lg:ml-0 rtl:lg:mr-[50%] bg-gov-beige dark:bg-dm-surface flex items-center justify-center py-12 px-4 sm:px-8">
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
                            src="/assets/logo/Asset-15@2x.png"
                            alt="Logo"
                            width={112}
                            height={112}
                            className="mx-auto mb-4 max-w-[112px] max-h-[112px]"
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
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                                <AlertTriangle size={16} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Lockout Warning */}
                        {isLockedOut && (
                            <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-sm rounded-lg flex items-center gap-2">
                                <AlertTriangle size={16} className="shrink-0" />
                                <span>{t('twofa_locked_out')}</span>
                            </div>
                        )}

                        {/* Attempts Warning (show after 3 failed attempts) */}
                        {attempts >= 3 && attempts < MAX_ATTEMPTS && (
                            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm rounded-lg flex items-center gap-2">
                                <AlertTriangle size={16} className="shrink-0" />
                                <span>{t('twofa_attempts_warning').replace('{remaining}', String(MAX_ATTEMPTS - attempts))}</span>
                            </div>
                        )}

                        {/* Resend Success */}
                        {resendSuccess && (
                            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-lg">
                                {t('twofa_resend_success')}
                            </div>
                        )}

                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
                                            autoComplete="one-time-code"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            disabled={isLoading || isLockedOut}
                                            className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || !isCodeComplete || isLockedOut}
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
                                disabled={isResending || resendCooldown > 0}
                                className="text-sm text-gov-teal hover:text-gov-forest dark:hover:text-gov-gold hover:underline transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                            >
                                {isResending && <Loader2 size={14} className="animate-spin" />}
                                {resendCooldown > 0 ? (
                                    <>
                                        <Clock size={14} />
                                        {t('twofa_resend_cooldown').replace('{seconds}', String(resendCooldown))}
                                    </>
                                ) : (
                                    t('twofa_resend')
                                )}
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
