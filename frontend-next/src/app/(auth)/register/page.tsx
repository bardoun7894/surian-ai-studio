'use client';

import React, { useState, useRef } from 'react';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
    User,
    Phone,
    Fingerprint,
    Shield,
    CheckCircle,
    MapPin,
    Calendar,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ApiError } from '@/lib/api';

const RegisterPage = () => {
    const { language } = useLanguage();
    const { register } = useAuth();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        nationalId: '',
        fullName: '',
        email: '',
        phone: '',
        birthDate: '',
        governorate: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const governorates = [
        'دمشق',
        'ريف دمشق',
        'حلب',
        'حمص',
        'حماة',
        'اللاذقية',
        'طرطوس',
        'دير الزور',
        'الحسكة',
        'الرقة',
        'إدلب',
        'درعا',
        'السويداء',
        'القنيطرة'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
            return;
        }

        setIsLoading(true);

        try {
            await register({
                name: formData.fullName,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirmPassword,
                national_id: formData.nationalId,
                phone: formData.phone,
                birth_date: formData.birthDate,
                governorate: formData.governorate
            });

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Registration failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;
    const BackIcon = language === 'ar' ? ChevronRight : ChevronLeft;

    const steps = [
        { num: 1, title: language === 'ar' ? 'المعلومات الشخصية' : 'Personal Info' },
        { num: 2, title: language === 'ar' ? 'معلومات الاتصال' : 'Contact Info' },
        { num: 3, title: language === 'ar' ? 'كلمة المرور' : 'Password' }
    ];

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
                        {language === 'ar' ? 'وزارة الاقتصاد والصناعة' : 'Ministry of Economy and Industry'}
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
                            <span>{language === 'ar' ? 'تسجيل آمن وسريع' : 'Fast & secure registration'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gov-gold/20 flex items-center justify-center">
                                <User size={16} className="text-gov-gold" />
                            </div>
                            <span>{language === 'ar' ? 'حساب موحد لجميع الخدمات' : 'Unified account for all services'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gov-gold/20 flex items-center justify-center">
                                <CheckCircle size={16} className="text-gov-gold" />
                            </div>
                            <span>{language === 'ar' ? 'تفعيل فوري للحساب' : 'Instant account activation'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Register Form */}
            <div className="flex-1 bg-gov-beige dark:bg-gov-charcoal flex items-center justify-center py-12 px-4 sm:px-8 overflow-y-auto">
                <div className="w-full max-w-lg">
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
                    <div className="mb-6 relative">
                        <h1 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">
                            {language === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            {language === 'ar'
                                ? 'سجل الآن للوصول إلى الخدمات الحكومية الإلكترونية'
                                : 'Register now to access e-government services'}
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.num}>
                                <div className="flex flex-col items-center cursor-pointer" onClick={() => step.num < currentStep && setCurrentStep(step.num)}>
                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep > step.num
                                        ? 'bg-gov-gold text-gov-forest'
                                        : currentStep === step.num
                                            ? 'bg-gov-teal text-white shadow-lg shadow-gov-teal/20'
                                            : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                                        }`}>
                                        {currentStep > step.num ? <CheckCircle size={18} /> : step.num}
                                    </div>
                                    <span className={`text-[10px] md:text-xs mt-1 font-medium ${currentStep >= step.num ? 'text-gov-teal dark:text-gov-gold' : 'text-gray-400'
                                        }`}>
                                        {step.title}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-0.5 rounded ${currentStep > step.num ? 'bg-gov-gold' : 'bg-gray-200 dark:bg-white/10'
                                        }`} style={{ minWidth: '2rem' }} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Register Card */}
                    <div className="bg-white dark:bg-white/5 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-6 sm:p-8">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Step 1: Personal Information */}
                            {currentStep === 1 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {/* National ID */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {language === 'ar' ? 'الرقم الوطني' : 'National ID'} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={formData.nationalId}
                                                onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                                                placeholder={language === 'ar' ? 'أدخل الرقم الوطني' : 'Enter national ID'}
                                                className="w-full py-3.5 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                                required
                                            />
                                            <Fingerprint className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                        </div>
                                    </div>

                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {language === 'ar' ? 'الاسم الكامل' : 'Full Name'} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                placeholder={language === 'ar' ? 'الاسم الثلاثي' : 'Full name'}
                                                className="w-full py-3.5 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                                required
                                            />
                                            <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                        </div>
                                    </div>

                                    {/* Birth Date */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {language === 'ar' ? 'تاريخ الميلاد' : 'Birth Date'} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="date"
                                                value={formData.birthDate}
                                                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                                className="w-full py-3.5 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                                required
                                            />
                                            <Calendar className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                        </div>
                                    </div>

                                    {/* Governorate */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {language === 'ar' ? 'المحافظة' : 'Governorate'} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <select
                                                value={formData.governorate}
                                                onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                                                className="w-full py-3.5 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all appearance-none"
                                                required
                                            >
                                                <option value="">{language === 'ar' ? 'اختر المحافظة' : 'Select governorate'}</option>
                                                {governorates.map((gov) => (
                                                    <option key={gov} value={gov}>{gov}</option>
                                                ))}
                                            </select>
                                            <MapPin className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Contact Information */}
                            {currentStep === 2 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="example@email.com"
                                                className="w-full py-3.5 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                                required
                                            />
                                            <Mail className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="09xxxxxxxx"
                                                className="w-full py-3.5 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                                required
                                            />
                                            <Phone className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                        </div>
                                    </div>

                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/20 flex gap-3">
                                        <Shield className="shrink-0 text-blue-600 dark:text-blue-400" size={20} />
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            {language === 'ar'
                                                ? 'سيتم إرسال رمز التحقق إلى هاتفك وبريدك الإلكتروني للتأكد من صحة البيانات.'
                                                : 'A verification code will be sent to your phone and email to verify your information.'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Password */}
                            {currentStep === 3 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {language === 'ar' ? 'كلمة المرور' : 'Password'} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                placeholder={language === 'ar' ? 'أدخل كلمة مرور قوية' : 'Enter a strong password'}
                                                className="w-full py-3.5 px-4 pr-12 rtl:pr-4 rtl:pl-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                                required
                                                minLength={8}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gov-teal transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                placeholder={language === 'ar' ? 'أعد إدخال كلمة المرور' : 'Re-enter password'}
                                                className="w-full py-3.5 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                                required
                                            />
                                            <Lock className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                        </div>
                                    </div>

                                    {/* Password Requirements */}
                                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl space-y-2 border border-gray-100 dark:border-white/5">
                                        <p className="text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {language === 'ar' ? 'متطلبات كلمة المرور:' : 'Password requirements:'}
                                        </p>
                                        <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                                            <li className="flex items-center gap-2">
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.password.length >= 8 ? 'bg-gov-emerald text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-400'}`}>
                                                    <CheckCircle size={10} />
                                                </div>
                                                <span className={formData.password.length >= 8 ? 'text-gov-emerald font-medium' : ''}>{language === 'ar' ? '8 أحرف على الأقل' : 'At least 8 characters'}</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${/[A-Z]/.test(formData.password) ? 'bg-gov-emerald text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-400'}`}>
                                                    <CheckCircle size={10} />
                                                </div>
                                                <span className={/[A-Z]/.test(formData.password) ? 'text-gov-emerald font-medium' : ''}>{language === 'ar' ? 'حرف كبير واحد على الأقل' : 'At least one uppercase letter'}</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${/[0-9]/.test(formData.password) ? 'bg-gov-emerald text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-400'}`}>
                                                    <CheckCircle size={10} />
                                                </div>
                                                <span className={/[0-9]/.test(formData.password) ? 'text-gov-emerald font-medium' : ''}>{language === 'ar' ? 'رقم واحد على الأقل' : 'At least one number'}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Terms Agreement */}
                                    <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={formData.agreeTerms}
                                            onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                                            className="w-5 h-5 mt-0.5 rounded border-gray-300 text-gov-teal focus:ring-gov-teal cursor-pointer"
                                            required
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {language === 'ar'
                                                ? 'أوافق على شروط الاستخدام وسياسة الخصوصية'
                                                : 'I agree to the Terms of Service and Privacy Policy'}
                                        </span>
                                    </label>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex gap-3 pt-2">
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(currentStep - 1)}
                                        className="flex-1 py-4 bg-gray-100 dark:bg-white/10 text-gov-charcoal dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                                    >
                                        {language === 'ar' ? 'السابق' : 'Previous'}
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`flex-1 py-4 bg-gradient-to-r from-gov-gold to-gov-sand text-gov-forest font-bold rounded-xl hover:from-gov-sand hover:to-gov-gold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 group hover:-translate-y-1`}
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-gov-forest/30 border-t-gov-forest rounded-full animate-spin" />
                                    ) : currentStep < 3 ? (
                                        <>
                                            {language === 'ar' ? 'التالي' : 'Next'}
                                            <ArrowIcon size={18} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                                        </>
                                    ) : (
                                        <>
                                            {language === 'ar' ? 'إنشاء الحساب' : 'Create Account'}
                                            <ArrowIcon size={18} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Security Badge */}
                        <div className="flex items-center justify-center gap-2 mt-6 py-3 border-t border-gray-100 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400">
                            <Shield size={14} className="text-gov-teal" />
                            {language === 'ar' ? 'بياناتك محمية ومشفرة بتقنية SSL' : 'Your data is secured with SSL encryption'}
                        </div>
                    </div>

                    {/* Login Link */}
                    <div className="text-center mt-6 p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                        <span className="text-gray-500 dark:text-gray-400">
                            {language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}
                        </span>
                        <Link
                            href="/login"
                            className="text-gov-teal font-bold hover:text-gov-forest hover:underline mr-2 rtl:mr-0 rtl:ml-2 transition-colors"
                        >
                            {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
