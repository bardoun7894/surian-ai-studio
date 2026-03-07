'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
    Phone,
    Fingerprint,
    Shield,
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import type { LoginCredentials } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ApiError } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import PhoneInput from '@/components/ui/PhoneInput';
import { formatPhoneForLogin, validatePhoneWithCountryCode } from '@/lib/phone';
import { API } from '@/lib/repository';

const LoginPage = () => {
    const { language, t } = useLanguage();
    const { login, isAuthenticated } = useAuth();
    const { startLoading } = useLoading();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'national'>('email');
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        nationalId: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [phoneFieldError, setPhoneFieldError] = useState<string | null>(null);
    const [nationalIdFieldError, setNationalIdFieldError] = useState<string | null>(null);
    const [emailFieldError, setEmailFieldError] = useState<string | null>(null);
    const [passwordFieldError, setPasswordFieldError] = useState<string | null>(null);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [whatsappNumber, setWhatsappNumber] = useState('963912345678');
    const formRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isLoading) {
                abortControllerRef.current?.abort();
                setIsLoading(false);
                setError(language === 'ar' ? 'تم إلغاء تسجيل الدخول' : 'Login cancelled');
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Fetch WhatsApp number from settings
        API.settings.getByGroup('contact')
            .then(data => {
                const settings = data as Record<string, string>;
                if (settings.contact_whatsapp) {
                    setWhatsappNumber(settings.contact_whatsapp);
                }
            })
            .catch(() => { });
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isLoading, language]);

    // Redirect away if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isAuthenticated, router]);

    // Validation helpers
    const isEmailValid = (email: string): boolean => {
        return !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isNationalIdValid = (id: string): boolean => {
        return /^\d{11}$/.test(id.trim());
    };


    const isPasswordFilled = (pw: string): boolean => {
        return pw.length > 0;
    };

    // Border class helpers for visual validation
    const getIdentifierBorderClass = (): string => {
        const hasError = (loginMethod === 'national' && nationalIdFieldError) || (loginMethod === 'email' && emailFieldError);
        const fieldValue = loginMethod === 'email' ? formData.email : formData.nationalId;
        const fieldIsValid = loginMethod === 'email' ? isEmailValid(formData.email) : isNationalIdValid(formData.nationalId);

        if (hasError) {
            return 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-400/20';
        }
        if (fieldValue && fieldIsValid) {
            return 'border-green-500 dark:border-emerald-400 focus:border-green-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-emerald-400/20';
        }
        return 'border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20';
    };

    const getPasswordBorderClass = (): string => {
        if (passwordFieldError) {
            return 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-400/20';
        }
        if (formData.password && isPasswordFilled(formData.password)) {
            return 'border-green-500 dark:border-emerald-400 focus:border-green-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-emerald-400/20';
        }
        return 'border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20';
    };

    const getIdentifierIconColor = (): string => {
        const hasError = (loginMethod === 'national' && nationalIdFieldError) || (loginMethod === 'email' && emailFieldError);
        const fieldValue = loginMethod === 'email' ? formData.email : formData.nationalId;
        const fieldIsValid = loginMethod === 'email' ? isEmailValid(formData.email) : isNationalIdValid(formData.nationalId);

        if (hasError) return 'text-red-500 dark:text-red-400';
        if (fieldValue && fieldIsValid) return 'text-green-500 dark:text-emerald-400';
        return 'text-gov-sand dark:text-gov-teal/50 group-focus-within:text-gov-teal dark:group-focus-within:text-gov-gold';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
        setIsLoading(true);
        setError(null);
        setPhoneFieldError(null);
        setNationalIdFieldError(null);
        setEmailFieldError(null);
        setPasswordFieldError(null);
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            // Validate password first (applies to all methods)
            if (!formData.password.trim()) {
                setPasswordFieldError(t('validation_required'));
                setIsLoading(false);
                return;
            }

            // Prepare credentials based on method
            const credentials: LoginCredentials = { password: formData.password };
            if (loginMethod === 'email') {
                if (!formData.email.trim()) {
                    setEmailFieldError(t('validation_required'));
                    setIsLoading(false);
                    return;
                }
                if (!isEmailValid(formData.email)) {
                    setEmailFieldError(t('validation_email_invalid'));
                    setIsLoading(false);
                    return;
                }
                credentials.email = formData.email.trim();
            } else if (loginMethod === 'phone') {
                const phoneValidation = validatePhoneWithCountryCode(formData.phone);
                if (!phoneValidation.isValid) {
                    setPhoneFieldError(
                        phoneValidation.reason === 'required'
                            ? t('validation_required')
                            : t('validation_phone_invalid')
                    );
                    setIsLoading(false);
                    return;
                }

                // Send phone in the same international format used during registration
                credentials.phone = phoneValidation.normalized;
            } else {
                const nationalId = formData.nationalId.trim();
                if (!/^\d{11}$/.test(nationalId)) {
                    setNationalIdFieldError(t('national_id_format_error'));
                    setIsLoading(false);
                    return;
                }

                credentials.national_id = nationalId;
            }

            const response = await login(credentials);

            if (response.require_2fa) {
                const twoFactorEmail = response.email;
                if (!twoFactorEmail) {
                    setIsLoading(false);
                    setError(language === 'ar' ? 'تعذر بدء التحقق الثنائي. يرجى المحاولة مرة أخرى.' : 'Unable to start two-factor verification. Please try again.');
                    return;
                }
                // Show loading badge and redirect to 2FA verification page
                startLoading();
                setIsLoading(false);
                router.replace(`/two-factor?email=${encodeURIComponent(twoFactorEmail)}`);
                return;
            }

            // Role-based redirection - show loading badge
            startLoading();
            setIsLoading(false);
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
            // Only stop loading on error; successful navigation keeps the spinner visible
            setIsLoading(false);
            if (err instanceof ApiError) {
                setError(err.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Login failed');
            }
        }
    };

    const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;
    const BackIcon = language === 'ar' ? ChevronRight : ChevronLeft;

    return (
        <div className="min-h-screen flex">
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

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">


                    {/* Government Emblem */}
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

                    {/* Decorative Line */}
                    <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gov-gold to-transparent mb-8" />

                    {/* Features */}
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

                {/* Bottom Decorative Pattern */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gov-gold/10 to-transparent opacity-50 pointer-events-none" />

                {/* Stars */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                    <p className="text-gov-gold/60 text-sm font-medium mb-2">
                        {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'}
                    </p>
                    <div className="flex gap-4 opacity-50">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" style={{ animationDelay: '0s' }} />
                        <div className="w-2 h-2 rounded-full bg-gov-gold animate-pulse" style={{ animationDelay: '0.5s' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 lg:ml-[50%] rtl:lg:ml-0 rtl:lg:mr-[50%] bg-gov-beige dark:bg-dm-surface flex items-center justify-center py-12 px-4 sm:px-8 overflow-y-auto min-h-screen">
                <div className="w-full max-w-md" ref={formRef}>
                    {/* Back Button */}
                    <Link
                        href="/"
                        className="flex items-center gap-1 text-gray-500 hover:text-gov-teal transition-colors mb-6 group"
                    >
                        <BackIcon size={18} className="group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                        {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                    </Link>

                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-6">
                        <Image
                            src="/assets/logo/Asset-15@2x.png"
                            alt="Logo"
                            width={112}
                            height={112}
                            className="mx-auto mb-3 max-w-[112px] max-h-[112px]"
                            style={{ width: 'auto', height: 'auto' }}
                        />
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-display font-bold text-gov-forest dark:text-gov-gold mb-2">
                            {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                        </h1>
                        <p className="text-gray-500 dark:text-white/70">
                            {language === 'ar'
                                ? 'سجل دخولك للوصول إلى خدماتك الحكومية'
                                : 'Sign in to access your government services'}
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="relative bg-white dark:bg-dm-surface rounded-2xl shadow-xl border border-gray-100 dark:border-gov-border/15 p-6 sm:p-8">
                        {/* Loading Overlay */}
                        {isLoading && (
                            <div className="absolute inset-0 z-50 bg-white/80 dark:bg-dm-surface/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <LoadingSpinner size={64} />
                            </div>
                        )}
                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Login Method Tabs - Minimalist Style */}
                        <div className="flex gap-2 mb-8 p-1.5 bg-gray-100/50 dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/5">
                            {[
                                { key: 'email', icon: Mail, label: language === 'ar' ? 'بريد' : 'Email' },
                                { key: 'phone', icon: Phone, label: language === 'ar' ? 'هاتف' : 'Phone' },
                                { key: 'national', icon: Fingerprint, label: language === 'ar' ? 'وطني' : 'ID' },
                            ].map(({ key, icon: Icon, label }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => {
                                        setLoginMethod(key as typeof loginMethod);
                                        setError(null);
                                        if (key !== 'phone') {
                                            setPhoneFieldError(null);
                                        }
                                        if (key !== 'national') {
                                            setNationalIdFieldError(null);
                                        }
                                    }}
                                    className={`flex-1 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${loginMethod === key
                                        ? 'bg-white dark:bg-gov-button text-gov-forest dark:text-white shadow-sm border border-gray-200/50 dark:border-white/10'
                                        : 'text-gray-500 dark:text-white/60 hover:text-gov-forest dark:hover:text-white hover:bg-white/50'
                                        }`}
                                >
                                    <Icon size={14} className={loginMethod === key ? 'text-gov-teal animate-pulse-slow' : ''} />
                                    <span>{label}</span>
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Dynamic Input Field */}
                            <div>
                                <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                                    {loginMethod === 'email' && (language === 'ar' ? 'البريد الإلكتروني' : 'Email Address')}
                                    {loginMethod === 'phone' && (language === 'ar' ? 'رقم الهاتف' : 'Phone Number')}
                                    {loginMethod === 'national' && (language === 'ar' ? 'الرقم الوطني' : 'National ID')}
                                </label>
                                {loginMethod === 'phone' ? (
                                    <PhoneInput
                                        value={formData.phone}
                                        onChange={(val) => {
                                            setFormData({ ...formData, phone: val });
                                            if (phoneFieldError) {
                                                setPhoneFieldError(null);
                                            }
                                        }}
                                        error={phoneFieldError || undefined}
                                        isValid={!!formData.phone && !phoneFieldError && validatePhoneWithCountryCode(formData.phone).isValid}
                                        required
                                    />
                                ) : (
                                    <div className="relative group">
                                        <input
                                            type={loginMethod === 'email' ? 'email' : 'text'}
                                            value={formData[loginMethod === 'email' ? 'email' : 'nationalId']}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (loginMethod === 'national') {
                                                    if (/^\d{0,11}$/.test(val)) {
                                                        if (nationalIdFieldError) {
                                                            setNationalIdFieldError(null);
                                                        }
                                                        setFormData({ ...formData, nationalId: val });
                                                    }
                                                    return;
                                                }

                                                setFormData({ ...formData, email: val });
                                                // Real-time email validation
                                                if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                                                    setEmailFieldError(t('validation_email_invalid'));
                                                } else if (!val && formSubmitted) {
                                                    setEmailFieldError(t('validation_required'));
                                                } else {
                                                    setEmailFieldError(null);
                                                }
                                            }}
                                            placeholder={
                                                loginMethod === 'email'
                                                    ? (language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email')
                                                    : '12345678901'
                                            }
                                            className={`w-full py-4 px-4 pr-12 rtl:pr-4 rtl:pl-12 rounded-2xl bg-gov-beige/20 dark:bg-white/10 border text-gov-charcoal dark:text-white placeholder:text-gov-sand focus:outline-none transition-all text-sm
                                                ${getIdentifierBorderClass()}`}
                                            required
                                        />
                                        <div className={`absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 transition-colors
                                            ${getIdentifierIconColor()}`}>
                                            {loginMethod === 'email' && <Mail size={18} />}
                                            {loginMethod === 'national' && <Fingerprint size={18} />}
                                        </div>
                                        {/* Validation status icons */}
                                        {((loginMethod === 'national' && nationalIdFieldError) || (loginMethod === 'email' && emailFieldError)) && (
                                            <div className="absolute left-10 rtl:left-auto rtl:right-10 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <AlertCircle size={18} className="text-red-500 dark:text-red-400" />
                                            </div>
                                        )}
                                        {loginMethod === 'email' && !emailFieldError && formData.email && isEmailValid(formData.email) && (
                                            <div className="absolute left-10 rtl:left-auto rtl:right-10 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <CheckCircle2 size={18} className="text-green-500 dark:text-emerald-400" />
                                            </div>
                                        )}
                                        {loginMethod === 'national' && !nationalIdFieldError && formData.nationalId && isNationalIdValid(formData.nationalId) && (
                                            <div className="absolute left-10 rtl:left-auto rtl:right-10 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <CheckCircle2 size={18} className="text-green-500 dark:text-emerald-400" />
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="min-h-[1.25rem] mt-1">
                                    {loginMethod === 'national' && nationalIdFieldError && (
                                        <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1 animate-fade-in">
                                            <AlertCircle size={12} className="shrink-0" />
                                            {nationalIdFieldError}
                                        </p>
                                    )}
                                    {loginMethod === 'email' && emailFieldError && (
                                        <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1 animate-fade-in">
                                            <AlertCircle size={12} className="shrink-0" />
                                            {emailFieldError}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                                    {language === 'ar' ? 'كلمة المرور' : 'Password'}{' '}<span className="text-red-500 dark:text-red-400">*</span>
                                </label>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => {
                                            setFormData({ ...formData, password: e.target.value });
                                            if (e.target.value.trim()) {
                                                setPasswordFieldError(null);
                                            } else if (formSubmitted) {
                                                setPasswordFieldError(t('validation_required'));
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!formData.password.trim() && formSubmitted) {
                                                setPasswordFieldError(t('validation_required'));
                                            }
                                        }}
                                        placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                                        className={`w-full py-4 px-4 pr-12 rtl:pr-4 rtl:pl-12 rounded-2xl bg-gov-beige/20 dark:bg-white/10 border text-gov-charcoal dark:text-white placeholder:text-gov-sand focus:outline-none transition-all text-sm
                                            ${getPasswordBorderClass()}`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gov-teal transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <div className="min-h-[1.25rem] mt-1">
                                    {passwordFieldError && (
                                        <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1 animate-fade-in">
                                            <AlertCircle size={12} className="shrink-0" />
                                            {passwordFieldError}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-3 cursor-pointer group select-none">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded-lg border-gray-300 dark:border-white/20 text-gov-teal focus:ring-gov-teal cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-white/70 group-hover:text-gov-forest dark:group-hover:text-white transition-colors">
                                        {language === 'ar' ? 'تذكرني' : 'Remember me'}
                                    </span>
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-bold text-gov-teal hover:text-gov-gold transition-colors"
                                >
                                    {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-gradient-to-r from-gov-gold to-gov-sand text-gov-forest font-bold rounded-xl hover:from-gov-sand hover:to-gov-gold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <>
                                    {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                                    <ArrowIcon size={18} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                                </>
                            </button>
                        </form>

                        {/* Security Badge */}
                        <div className="flex items-center justify-center gap-2 mt-6 py-3 border-t border-gray-100 dark:border-gov-border/15 text-xs text-gray-500 dark:text-white/70">
                            <Shield size={14} className="text-gov-teal" />
                            {language === 'ar' ? 'اتصال آمن ومشفر بتقنية SSL' : 'Secure SSL encrypted connection'}
                        </div>
                    </div>

                    {/* Register Link */}
                    <div className="text-center mt-6 p-4 bg-white/50 dark:bg-gov-card/10 rounded-xl border border-gray-100 dark:border-gov-border/15">
                        <span className="text-gray-500 dark:text-white/70">
                            {language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}
                        </span>
                        <Link
                            href="/register"
                            className="text-gov-teal font-bold hover:text-gov-forest hover:underline mr-2 rtl:mr-0 rtl:ml-2 transition-colors"
                        >
                            {language === 'ar' ? 'إنشاء حساب جديد' : 'Create account'}
                        </Link>
                    </div>

                    {/* WhatsApp Support */}
                    <div className="text-center mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-white/70">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-green-500" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors">
                            {language === 'ar' ? 'تواصل معنا عبر واتساب للدعم' : 'Contact us via WhatsApp for support'}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
