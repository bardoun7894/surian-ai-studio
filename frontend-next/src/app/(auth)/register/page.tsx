'use client';

import React, { useState } from 'react';
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
    Calendar
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

            // Redirect to dashboard or login
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

    const steps = [
        { num: 1, title: language === 'ar' ? 'المعلومات الشخصية' : 'Personal Info' },
        { num: 2, title: language === 'ar' ? 'معلومات الاتصال' : 'Contact Info' },
        { num: 3, title: language === 'ar' ? 'كلمة المرور' : 'Password' }
    ];

    return (
        <div className="min-h-screen bg-gov-beige dark:bg-gov-forest flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-lg">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 relative">
                        <Image src="/assets/logo/Asset-14@3x.png" alt="Emblem" width={80} height={80} className="object-contain" />
                    </div>
                    <h1 className="text-2xl font-display font-bold text-gov-forest dark:text-white mb-2">
                        {language === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {language === 'ar'
                            ? 'سجل الآن للوصول إلى جميع الخدمات الحكومية'
                            : 'Register now to access all government services'}
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.num}>
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep > step.num
                                    ? 'bg-gov-gold text-gov-forest'
                                    : currentStep === step.num
                                        ? 'bg-gov-teal text-white'
                                        : 'bg-gray-200 dark:bg-white/20 text-gray-500 dark:text-gray-400'
                                    }`}>
                                    {currentStep > step.num ? <CheckCircle size={20} /> : step.num}
                                </div>
                                <span className={`text-xs mt-1 ${currentStep >= step.num ? 'text-gov-teal dark:text-gov-gold' : 'text-gray-400'
                                    }`}>
                                    {step.title}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`w-12 h-1 rounded ${currentStep > step.num ? 'bg-gov-gold' : 'bg-gray-200 dark:bg-white/20'
                                    }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Register Card */}
                <div className="bg-white dark:bg-white/5 rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 p-8">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Step 1: Personal Information */}
                        {currentStep === 1 && (
                            <>
                                {/* National ID */}
                                <div>
                                    <label className="block text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                                        {language === 'ar' ? 'الرقم الوطني' : 'National ID'} *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.nationalId}
                                            onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                                            placeholder={language === 'ar' ? 'أدخل الرقم الوطني' : 'Enter national ID'}
                                            className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal transition-colors"
                                            required
                                        />
                                        <Fingerprint className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    </div>
                                </div>

                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                                        {language === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            placeholder={language === 'ar' ? 'الاسم الثلاثي' : 'Full name'}
                                            className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal transition-colors"
                                            required
                                        />
                                        <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    </div>
                                </div>

                                {/* Birth Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                                        {language === 'ar' ? 'تاريخ الميلاد' : 'Birth Date'} *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={formData.birthDate}
                                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                            className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal transition-colors"
                                            required
                                        />
                                        <Calendar className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    </div>
                                </div>

                                {/* Governorate */}
                                <div>
                                    <label className="block text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                                        {language === 'ar' ? 'المحافظة' : 'Governorate'} *
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.governorate}
                                            onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                                            className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal transition-colors appearance-none"
                                            required
                                        >
                                            <option value="">{language === 'ar' ? 'اختر المحافظة' : 'Select governorate'}</option>
                                            {governorates.map((gov) => (
                                                <option key={gov} value={gov}>{gov}</option>
                                            ))}
                                        </select>
                                        <MapPin className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 2: Contact Information */}
                        {currentStep === 2 && (
                            <>
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                                        {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder={language === 'ar' ? 'example@email.com' : 'example@email.com'}
                                            className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal transition-colors"
                                            required
                                        />
                                        <Mail className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                                        {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="09xxxxxxxx"
                                            className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal transition-colors"
                                            required
                                        />
                                        <Phone className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        {language === 'ar'
                                            ? 'سيتم إرسال رمز التحقق إلى هاتفك وبريدك الإلكتروني للتأكد من صحة البيانات.'
                                            : 'A verification code will be sent to your phone and email to verify your information.'}
                                    </p>
                                </div>
                            </>
                        )}

                        {/* Step 3: Password */}
                        {currentStep === 3 && (
                            <>
                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                                        {language === 'ar' ? 'كلمة المرور' : 'Password'} *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder={language === 'ar' ? 'أدخل كلمة مرور قوية' : 'Enter a strong password'}
                                            className="w-full py-3 px-4 pr-12 rtl:pr-4 rtl:pl-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal transition-colors"
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
                                    <label className="block text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                                        {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'} *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            placeholder={language === 'ar' ? 'أعد إدخال كلمة المرور' : 'Re-enter password'}
                                            className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal transition-colors"
                                            required
                                        />
                                        <Lock className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    </div>
                                </div>

                                {/* Password Requirements */}
                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl space-y-2">
                                    <p className="text-sm font-medium text-gov-charcoal dark:text-white mb-2">
                                        {language === 'ar' ? 'متطلبات كلمة المرور:' : 'Password requirements:'}
                                    </p>
                                    <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle size={14} className={formData.password.length >= 8 ? 'text-gov-emeraldLight' : 'text-gray-300'} />
                                            {language === 'ar' ? '8 أحرف على الأقل' : 'At least 8 characters'}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle size={14} className={/[A-Z]/.test(formData.password) ? 'text-gov-emeraldLight' : 'text-gray-300'} />
                                            {language === 'ar' ? 'حرف كبير واحد على الأقل' : 'At least one uppercase letter'}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle size={14} className={/[0-9]/.test(formData.password) ? 'text-gov-emeraldLight' : 'text-gray-300'} />
                                            {language === 'ar' ? 'رقم واحد على الأقل' : 'At least one number'}
                                        </li>
                                    </ul>
                                </div>

                                {/* Terms Agreement */}
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.agreeTerms}
                                        onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                                        className="w-5 h-5 mt-0.5 rounded border-gray-300 text-gov-teal focus:ring-gov-teal"
                                        required
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {language === 'ar'
                                            ? 'أوافق على شروط الاستخدام وسياسة الخصوصية'
                                            : 'I agree to the Terms of Service and Privacy Policy'}
                                    </span>
                                </label>
                            </>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex gap-3">
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
                                className="flex-1 py-4 bg-gov-gold text-gov-forest font-bold rounded-xl hover:bg-gov-sand transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : currentStep < 3 ? (
                                    <>
                                        {language === 'ar' ? 'التالي' : 'Next'}
                                        <ArrowIcon size={18} />
                                    </>
                                ) : (
                                    <>
                                        {language === 'ar' ? 'إنشاء الحساب' : 'Create Account'}
                                        <ArrowIcon size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Security Badge */}
                    <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-500 dark:text-gray-400">
                        <Shield size={14} className="text-gov-emeraldLight" />
                        {language === 'ar' ? 'بياناتك محمية ومشفرة' : 'Your data is protected & encrypted'}
                    </div>
                </div>

                {/* Login Link */}
                <div className="text-center mt-6">
                    <span className="text-gray-500 dark:text-gray-400">
                        {language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}
                    </span>
                    <Link
                        href="/login"
                        className="text-gov-teal font-bold hover:underline mr-2 rtl:mr-0 rtl:ml-2"
                    >
                        {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                    </Link>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-4">
                    <Link
                        href="/"
                        className="text-gray-500 dark:text-gray-400 hover:text-gov-teal transition-colors text-sm"
                    >
                        {language === 'ar' ? '← العودة للصفحة الرئيسية' : '← Back to Home'}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
