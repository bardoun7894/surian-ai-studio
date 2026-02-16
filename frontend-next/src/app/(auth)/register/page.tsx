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
    ChevronLeft,
    ChevronDown
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ApiError } from '@/lib/api';
import { useRecaptcha } from '@/hooks/useRecaptcha';
import PhoneInput from '@/components/ui/PhoneInput';
import NationalIdField from '@/components/NationalIdField';

const RegisterPage = () => {
    const { language, t } = useLanguage();
    const { register } = useAuth();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        nationalId: '',
        firstName: '',
        fatherName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        governorate: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
        useWhatsApp: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const { executeRecaptcha } = useRecaptcha();

    const validateStep = (step: number): boolean => {
        const errors: Record<string, string> = {};

        if (step === 1) {
            // Date of birth validation
            if (formData.birthDate) {
                const dob = new Date(formData.birthDate);
                if (isNaN(dob.getTime())) {
                    errors.birthDate = t('validation_dob_invalid');
                } else if (dob > new Date()) {
                    errors.birthDate = t('validation_dob_future');
                }
            }
        }

        if (step === 2) {
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (formData.email && !emailRegex.test(formData.email)) {
                errors.email = t('validation_email_invalid');
            }
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

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

        if (!validateStep(currentStep)) {
            return;
        }

        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
            return;
        }

        setIsLoading(true);

        try {
            const recaptchaToken = await executeRecaptcha('register');
            const response = await register({
                first_name: formData.firstName,
                father_name: formData.fatherName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirmPassword,
                national_id: formData.nationalId,
                phone: formData.phone,
                birth_date: formData.birthDate,
                governorate: formData.governorate,
                recaptcha_token: recaptchaToken || undefined,
                use_whatsapp: formData.useWhatsApp
            });

            if (response.require_2fa) {
                // Redirect to 2FA verification page
                router.push(`/two-factor?email=${encodeURIComponent(formData.email)}`);
                return;
            }

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(t('error_generic'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;
    const BackIcon = language === 'ar' ? ChevronRight : ChevronLeft;

    const steps = [
        { num: 1, title: language === 'ar' ? 'الهوية' : 'Identity' },
        { num: 2, title: language === 'ar' ? 'البيانات الشخصية' : 'Personal Info' },
        { num: 3, title: t('reg_step_contact') },
        { num: 4, title: t('reg_step_password') }
    ];

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
                        {t('auth_ministry_name')}
                    </h1>
                    <p className="text-gov-gold text-lg text-center mb-8">
                        {t('republic_name')}
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
            <div className="flex-1 lg:ml-[50%] rtl:lg:ml-0 rtl:lg:mr-[50%] bg-gov-beige dark:bg-dm-surface flex items-center justify-center py-12 px-4 sm:px-8 overflow-y-auto min-h-screen">
                <div className="w-full max-w-lg">
                    {/* Back Button */}
                    <Link
                        href="/"
                        className="flex items-center gap-1 text-gray-500 hover:text-gov-teal transition-colors mb-6 group"
                    >
                        <BackIcon size={18} className="group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                        {t('auth_back_home')}
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
                    <div className="mb-4 relative">
                        <h1 className="text-2xl font-display font-bold text-gov-forest dark:text-gov-gold mb-1">
                            {t('auth_register_title')}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-white/70">
                            {t('auth_register_subtitle')}
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.num}>
                                <div className="flex flex-col items-center cursor-pointer" onClick={() => step.num < currentStep && setCurrentStep(step.num)}>
                                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${currentStep > step.num
                                        ? 'bg-gov-gold text-gov-forest'
                                        : currentStep === step.num
                                            ? 'bg-gov-teal text-white shadow-lg shadow-gov-teal/20'
                                            : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/70'
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
                    <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-xl border border-gray-100 dark:border-gov-border/15 p-4 sm:p-5">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-3">

                            {/* Step 1: Identity */}
                            {currentStep === 1 && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {/* National ID */}
                                    <NationalIdField
                                        value={formData.nationalId}
                                        onChange={(val) => setFormData(prev => ({ ...prev, nationalId: val }))}
                                        onVerified={(citizenData) => {
                                            if (citizenData) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    firstName: citizenData.first_name || prev.firstName,
                                                    fatherName: citizenData.father_name || prev.fatherName,
                                                    lastName: citizenData.last_name || prev.lastName,
                                                    birthDate: citizenData.birth_date || prev.birthDate,
                                                    governorate: citizenData.governorate || prev.governorate,
                                                }));
                                            }
                                        }}
                                        required={true}
                                        autoVerify={true}
                                        showVerifyButton={true}
                                    />

                                    {/* Birth Date */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {t('reg_birth_date')} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="date"
                                                value={formData.birthDate}
                                                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                                className="w-full py-2.5 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white text-sm focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                                required
                                            />
                                            <Calendar className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                        </div>
                                        {fieldErrors.birthDate && (
                                            <p className="text-red-500 text-sm mt-1">{fieldErrors.birthDate}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Personal Information */}
                            {currentStep === 2 && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {/* First Name */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {language === 'ar' ? 'الاسم الأول' : 'First Name'} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                placeholder={language === 'ar' ? 'الاسم الأول' : 'First Name'}
                                                className="w-full py-3.5 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                                required
                                            />
                                            <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                        </div>
                                    </div>

                                    {/* Father Name */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {language === 'ar' ? 'اسم الأب' : 'Father Name'} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={formData.fatherName}
                                                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                                                placeholder={language === 'ar' ? 'اسم الأب' : 'Father Name'}
                                                className="w-full py-3.5 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                                required
                                            />
                                            <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                        </div>
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {language === 'ar' ? 'الكنية' : 'Last Name'} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                placeholder={language === 'ar' ? 'الكنية' : 'Last Name'}
                                                className="w-full py-3.5 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                                required
                                            />
                                            <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                        </div>
                                    </div>

                                    {/* Governorate */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {t('reg_governorate')} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <select
                                                value={formData.governorate}
                                                onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                                                className="w-full py-3.5 ltr:pl-12 ltr:pr-10 rtl:pr-12 rtl:pl-10 rounded-xl bg-gray-50 dark:bg-dm-surface dark:text-white dark:border-gov-border/15 border border-gray-200 text-gov-charcoal focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all appearance-none"
                                                required
                                            >
                                                <option value="" className="dark:bg-dm-surface dark:text-white">{t('reg_select_governorate')}</option>
                                                {governorates.map((gov) => (
                                                    <option key={gov} value={gov} className="dark:bg-dm-surface dark:text-white">{gov}</option>
                                                ))}
                                            </select>
                                            <MapPin className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors pointer-events-none" size={20} />
                                            <ChevronDown className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Contact Information */}
                            {currentStep === 3 && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {t('auth_email')} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="example@email.com"
                                                className="w-full py-3.5 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                                required
                                            />
                                            <Mail className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                        </div>
                                        {fieldErrors.email && (
                                            <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {t('auth_phone')} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <PhoneInput
                                                value={formData.phone}
                                                onChange={(val) => setFormData({ ...formData, phone: val })}
                                                placeholder="09xxxxxxxx"
                                                className="w-full py-4 px-4 pr-12 rtl:pr-12 rtl:pl-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal dark:focus:border-gov-gold focus:ring-4 focus:ring-gov-teal/5 dark:focus:ring-gov-gold/5 transition-all text-sm"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* WhatsApp Support Toggle */}
                                    <label className="flex items-center gap-3 cursor-pointer group select-none p-3 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 hover:border-gov-emerald transition-all">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.useWhatsApp}
                                                onChange={(e) => setFormData({ ...formData, useWhatsApp: e.target.checked })}
                                                className="w-5 h-5 rounded-lg border-gray-300 dark:border-white/20 text-gov-emerald focus:ring-gov-emerald cursor-pointer opacity-0 absolute inset-0 z-10"
                                            />
                                            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${formData.useWhatsApp ? 'bg-gov-emerald border-gov-emerald' : 'bg-transparent border-gray-300 dark:border-white/20'}`}>
                                                {formData.useWhatsApp && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gov-forest dark:text-white/90 group-hover:text-gov-emerald transition-colors">
                                                {language === 'ar' ? 'تفعيل الواتساب للتنبيهات' : 'Enable WhatsApp Notifications'}
                                            </span>
                                            <span className="text-[10px] text-gray-500 dark:text-white/50">
                                                {language === 'ar' ? 'سوف يصلك رمز التحقق عبر الواتساب بدلاً من الرسائل النصية' : 'You will receive verification codes via WhatsApp'}
                                            </span>
                                        </div>
                                    </label>

                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/20 flex gap-3">
                                        <Shield className="shrink-0 text-blue-600 dark:text-blue-400" size={20} />
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            {t('reg_verification')}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Password */}
                            {currentStep === 4 && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {t('auth_password')} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                placeholder={t('reg_password_placeholder')}
                                                className="w-full py-3.5 px-4 pr-12 rtl:pr-4 rtl:pl-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
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
                                            {t('reg_confirm_password')} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                placeholder={t('reg_reenter_password')}
                                                className="w-full py-3.5 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal focus:ring-2 focus:ring-gov-teal/20 transition-all"
                                                required
                                            />
                                            <Lock className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-teal transition-colors" size={20} />
                                        </div>
                                    </div>

                                    {/* Password Requirements */}
                                    <div className="p-4 bg-gray-50 dark:bg-gov-card/10 rounded-xl space-y-2 border border-gray-100 dark:border-white/5">
                                        <p className="text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {t('reg_password_requirements')}
                                        </p>
                                        <ul className="text-sm text-gray-500 dark:text-white/70 space-y-2">
                                            <li className="flex items-center gap-2">
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${formData.password.length >= 8 ? 'bg-gov-emerald text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-400'}`}>
                                                    <CheckCircle size={10} />
                                                </div>
                                                <span className={formData.password.length >= 8 ? 'text-gov-emerald font-medium' : ''}>{t('reg_password_length')}</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${/[A-Z]/.test(formData.password) ? 'bg-gov-emerald text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-400'}`}>
                                                    <CheckCircle size={10} />
                                                </div>
                                                <span className={/[A-Z]/.test(formData.password) ? 'text-gov-emerald font-medium' : ''}>{t('reg_password_uppercase')}</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${/[0-9]/.test(formData.password) ? 'bg-gov-emerald text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-400'}`}>
                                                    <CheckCircle size={10} />
                                                </div>
                                                <span className={/[0-9]/.test(formData.password) ? 'text-gov-emerald font-medium' : ''}>{t('reg_password_number')}</span>
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
                                        <span className="text-sm text-gray-600 dark:text-white/70">
                                            {t('reg_agree_terms')}
                                        </span>
                                    </label>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex gap-3 pt-1">
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(currentStep - 1)}
                                        className="flex-1 py-3 bg-gray-100 dark:bg-white/10 text-gov-charcoal dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors text-sm"
                                    >
                                        {t('reg_previous')}
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`flex-1 py-3 bg-gradient-to-r from-gov-gold to-gov-sand text-gov-forest font-bold rounded-xl hover:from-gov-sand hover:to-gov-gold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 group hover:-translate-y-1 text-sm`}
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-gov-forest/30 border-t-gov-forest rounded-full animate-spin" />
                                    ) : currentStep < 4 ? (
                                        <>
                                            {t('reg_next')}
                                            <ArrowIcon size={18} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                                        </>
                                    ) : (
                                        <>
                                            {t('reg_create')}
                                            <ArrowIcon size={18} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Security Badge */}
                        <div className="flex items-center justify-center gap-2 mt-3 py-2 border-t border-gray-100 dark:border-gov-border/15 text-xs text-gray-500 dark:text-white/70">
                            <Shield size={14} className="text-gov-teal" />
                            {t('reg_protected')}
                        </div>
                    </div>

                    {/* Login Link */}
                    <div className="text-center mt-4 p-3 bg-white/50 dark:bg-gov-card/10 rounded-xl border border-gray-100 dark:border-gov-border/15 text-sm">
                        <span className="text-gray-500 dark:text-white/70">
                            {t('reg_already_account')}
                        </span>
                        <Link
                            href="/login"
                            className="text-gov-teal font-bold hover:text-gov-forest hover:underline mr-2 rtl:mr-0 rtl:ml-2 transition-colors"
                        >
                            {t('auth_sign_in_btn')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
