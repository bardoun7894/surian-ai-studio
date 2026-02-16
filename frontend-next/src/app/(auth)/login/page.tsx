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
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ApiError } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

const LoginPage = () => {
    const { language } = useLanguage();
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
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isLoading, language]);

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
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            // Prepare credentials based on method
            let loginIdentifier = '';
            if (loginMethod === 'email') loginIdentifier = formData.email;
            else if (loginMethod === 'phone') loginIdentifier = formData.phone;
            else loginIdentifier = formData.nationalId;

            const response = await login({
                email: loginIdentifier,
                password: formData.password,
            });

            if (response.require_2fa) {
                // Show loading badge and redirect to 2FA verification page
                startLoading();
                setIsLoading(false);
                router.replace(`/two-factor?email=${encodeURIComponent(loginIdentifier)}`);
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

                {/* Decorative Circles */}
                <div className="absolute top-20 -right-20 w-80 h-80 rounded-full border border-gov-gold/20" />
                <div className="absolute bottom-20 -left-20 w-96 h-96 rounded-full border border-gov-gold/10" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
                    {/* Government Emblem */}
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

                    {/* Title */}
                    <h1 className="text-3xl font-display font-bold text-white text-center mb-4">
                        {language === 'ar' ? 'وزارة الاقتصاد والصناعة' : 'Ministry of Economy & Industry'}
                    </h1>
                    <p className="text-gov-gold text-lg text-center mb-8">
                        {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'}
                    </p>

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
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 opacity-50">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" style={{ animationDelay: '0s' }} />
                    <div className="w-2 h-2 rounded-full bg-gov-gold animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 lg:ml-[50%] rtl:lg:ml-0 rtl:lg:mr-[50%] bg-gov-beige dark:bg-dm-surface flex items-center justify-center py-12 px-4 sm:px-8">
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
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
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
                                    onClick={() => setLoginMethod(key as typeof loginMethod)}
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
                                <label className="block text-sm font-medium text-gov-charcoal dark:text-white/70 mb-2">
                                    {loginMethod === 'email' && (language === 'ar' ? 'البريد الإلكتروني' : 'Email Address')}
                                    {loginMethod === 'phone' && (language === 'ar' ? 'رقم الهاتف' : 'Phone Number')}
                                    {loginMethod === 'national' && (language === 'ar' ? 'الرقم الوطني' : 'National ID')}
                                </label>
                                <div className="relative group">
                                    <input
                                        type={loginMethod === 'email' ? 'email' : 'text'}
                                        value={formData[loginMethod === 'email' ? 'email' : loginMethod === 'phone' ? 'phone' : 'nationalId']}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (loginMethod === 'national') {
                                                // Only allow numbers and max 11 chars
                                                if (/^\d{0,11}$/.test(val)) {
                                                    setFormData({ ...formData, nationalId: val });
                                                }
                                            } else {
                                                setFormData({
                                                    ...formData,
                                                    [loginMethod === 'email' ? 'email' : loginMethod === 'phone' ? 'phone' : 'nationalId']: val
                                                });
                                            }
                                        }}
                                        placeholder={
                                            loginMethod === 'email'
                                                ? (language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email')
                                                : loginMethod === 'phone'
                                                    ? '09xxxxxxxx'
                                                    : '12345678901'
                                        }
                                        className="w-full py-4 px-4 pr-12 rtl:pr-4 rtl:pl-12 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal dark:focus:border-gov-gold focus:ring-4 focus:ring-gov-teal/5 dark:focus:ring-gov-gold/5 transition-all text-sm"
                                        required
                                    />
                                    <div className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-gov-teal">
                                        {loginMethod === 'email' && <Mail size={18} />}
                                        {loginMethod === 'phone' && <Phone size={18} />}
                                        {loginMethod === 'national' && <Fingerprint size={18} />}
                                    </div>
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-medium text-gov-charcoal dark:text-white/70 mb-2">
                                    {language === 'ar' ? 'كلمة المرور' : 'Password'}
                                </label>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                                        className="w-full py-4 px-4 pr-12 rtl:pr-4 rtl:pl-12 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal dark:focus:border-gov-gold focus:ring-4 focus:ring-gov-teal/5 dark:focus:ring-gov-gold/5 transition-all text-sm"
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
                        <a href="https://wa.me/963999999999" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors">
                            {language === 'ar' ? 'تواصل معنا عبر واتساب للدعم' : 'Contact us via WhatsApp for support'}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
