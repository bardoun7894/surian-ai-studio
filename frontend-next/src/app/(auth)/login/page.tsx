'use client';

import React, { useState, useRef } from 'react';
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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ApiError } from '@/lib/api';

const LoginPage = () => {
    const { language } = useLanguage();
    const { login } = useAuth();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'national'>('email');
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        nationalId: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const formRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Prepare credentials based on method
            let loginIdentifier = '';
            if (loginMethod === 'email') loginIdentifier = formData.email;
            else if (loginMethod === 'phone') loginIdentifier = formData.phone;
            else loginIdentifier = formData.nationalId;

            const response = await login({
                email: loginIdentifier,
                password: formData.password
            });

            if (!response.require_2fa) {
                window.location.href = '/dashboard';
                return;
            }
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Login failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;
    const BackIcon = language === 'ar' ? ChevronRight : ChevronLeft;

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding (hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gov-forest relative overflow-hidden">
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
                        />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-display font-bold text-white text-center mb-4">
                        {language === 'ar' ? 'وزارة الاقتصاد والتجارة الخارجية' : 'Ministry of Economy & Foreign Trade'}
                    </h1>
                    <p className="text-gov-gold text-lg text-center mb-8">
                        {language === 'ar' ? 'الجمهورية العربية السورية' : 'Syrian Arab Republic'}
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

                {/* Bottom Stars */}
                <Image
                    src="/assets/logo/stars.png"
                    alt=""
                    width={96}
                    height={32}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30"
                />
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 bg-gov-beige dark:bg-gov-charcoal flex items-center justify-center py-12 px-4 sm:px-8">
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
                        />
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">
                            {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            {language === 'ar'
                                ? 'سجل دخولك للوصول إلى خدماتك الحكومية'
                                : 'Sign in to access your government services'}
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white dark:bg-white/5 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-6 sm:p-8">
                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Login Method Tabs */}
                        <div className="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-white/10 rounded-xl">
                            {[
                                { key: 'email', icon: Mail, label: language === 'ar' ? 'بريد' : 'Email' },
                                { key: 'phone', icon: Phone, label: language === 'ar' ? 'هاتف' : 'Phone' },
                                { key: 'national', icon: Fingerprint, label: language === 'ar' ? 'وطني' : 'ID' },
                            ].map(({ key, icon: Icon, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setLoginMethod(key as typeof loginMethod)}
                                    className={`flex-1 py-2.5 px-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${loginMethod === key
                                        ? 'bg-white dark:bg-gov-teal text-gov-forest dark:text-white shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gov-forest dark:hover:text-white'
                                        }`}
                                >
                                    <Icon size={15} />
                                    <span className="hidden sm:inline">{label}</span>
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Dynamic Input Field */}
                            <div>
                                <label className="block text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                                    {loginMethod === 'email' && (language === 'ar' ? 'البريد الإلكتروني' : 'Email Address')}
                                    {loginMethod === 'phone' && (language === 'ar' ? 'رقم الهاتف' : 'Phone Number')}
                                    {loginMethod === 'national' && (language === 'ar' ? 'الرقم الوطني' : 'National ID')}
                                </label>
                                <div className="relative">
                                    <input
                                        type={loginMethod === 'email' ? 'email' : 'text'}
                                        value={formData[loginMethod === 'email' ? 'email' : loginMethod === 'phone' ? 'phone' : 'nationalId']}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            [loginMethod === 'email' ? 'email' : loginMethod === 'phone' ? 'phone' : 'nationalId']: e.target.value
                                        })}
                                        placeholder={
                                            loginMethod === 'email'
                                                ? (language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email')
                                                : loginMethod === 'phone'
                                                    ? '09xxxxxxxx'
                                                    : (language === 'ar' ? 'أدخل الرقم الوطني' : 'Enter your national ID')
                                        }
                                        className="w-full py-3.5 px-4 pr-12 rtl:pr-4 rtl:pl-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                        required
                                    />
                                    {loginMethod === 'email' && <Mail className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />}
                                    {loginMethod === 'phone' && <Phone className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />}
                                    {loginMethod === 'national' && <Fingerprint className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />}
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                                    {language === 'ar' ? 'كلمة المرور' : 'Password'}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                                        className="w-full py-3.5 px-4 pr-12 rtl:pr-4 rtl:pl-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gov-teal transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-gov-teal focus:ring-gov-teal cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gov-forest dark:group-hover:text-white transition-colors">
                                        {language === 'ar' ? 'تذكرني' : 'Remember me'}
                                    </span>
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-gov-teal hover:text-gov-forest hover:underline transition-colors"
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
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-gov-forest/30 border-t-gov-forest rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                                        <ArrowIcon size={18} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Security Badge */}
                        <div className="flex items-center justify-center gap-2 mt-6 py-3 border-t border-gray-100 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400">
                            <Shield size={14} className="text-gov-teal" />
                            {language === 'ar' ? 'اتصال آمن ومشفر بتقنية SSL' : 'Secure SSL encrypted connection'}
                        </div>
                    </div>

                    {/* Register Link */}
                    <div className="text-center mt-6 p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                        <span className="text-gray-500 dark:text-gray-400">
                            {language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}
                        </span>
                        <Link
                            href="/register"
                            className="text-gov-teal font-bold hover:text-gov-forest hover:underline mr-2 rtl:mr-0 rtl:ml-2 transition-colors"
                        >
                            {language === 'ar' ? 'إنشاء حساب جديد' : 'Create account'}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
