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
    Shield,
    CheckCircle,
    CheckCircle2,
    AlertCircle,
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
import { validatePhoneWithCountryCode } from '@/lib/phone';

const RegisterPage = () => {
    const { language, t } = useLanguage();
    const { register } = useAuth();
    const router = useRouter();
    const DOB_MIN_AGE = 13;
    const DOB_MAX_AGE = 120;

    const formatDateForInput = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const parseDateInput = (value: string): number | null => {
        const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!match) {
            return null;
        }

        const year = Number(match[1]);
        const month = Number(match[2]);
        const day = Number(match[3]);
        const timestamp = Date.UTC(year, month - 1, day);
        const parsed = new Date(timestamp);

        if (
            parsed.getUTCFullYear() !== year ||
            parsed.getUTCMonth() + 1 !== month ||
            parsed.getUTCDate() !== day
        ) {
            return null;
        }

        return timestamp;
    };

    const getDobLimits = () => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();

        const minDate = new Date(currentYear - DOB_MAX_AGE, month, day);
        const maxDate = new Date(currentYear - DOB_MIN_AGE, month, day);
        const todayTimestamp = Date.UTC(currentYear, month, day);

        return {
            minDate,
            maxDate,
            minTimestamp: Date.UTC(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()),
            maxTimestamp: Date.UTC(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()),
            todayTimestamp,
        };
    };

    const validateBirthDate = (birthDate: string): string | null => {
        if (!birthDate) {
            return t('validation_required');
        }

        const dobTimestamp = parseDateInput(birthDate);
        if (dobTimestamp === null) {
            return t('validation_dob_invalid');
        }

        const { minTimestamp, maxTimestamp, todayTimestamp } = getDobLimits();

        if (dobTimestamp > todayTimestamp) {
            return t('validation_dob_future');
        }

        if (dobTimestamp > maxTimestamp) {
            return t('validation_dob_too_young');
        }

        if (dobTimestamp < minTimestamp) {
            return t('validation_dob_too_old');
        }

        return null;
    };

    const { minDate, maxDate } = getDobLimits();
    const minBirthDate = formatDateForInput(minDate);
    const maxBirthDate = formatDateForInput(maxDate);

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

    const getPhoneValidationError = (phone: string): string | null => {
        const phoneValidation = validatePhoneWithCountryCode(phone);
        if (phoneValidation.isValid) {
            return null;
        }

        if (phoneValidation.reason === 'required') {
            return t('validation_required');
        }

        return t('validation_phone_invalid');
    };

    const passwordRules = [
        { key: 'length', test: (pw: string) => pw.length >= 8 },
        { key: 'uppercase', test: (pw: string) => /[A-Z]/.test(pw) },
        { key: 'lowercase', test: (pw: string) => /[a-z]/.test(pw) },
        { key: 'number', test: (pw: string) => /[0-9]/.test(pw) },
        { key: 'special', test: (pw: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pw) },
    ];

    const isPasswordValid = (pw: string): boolean =>
        passwordRules.every((rule) => rule.test(pw));

    const validateStep = (step: number): boolean => {
        const errors: Record<string, string> = {};

        if (step === 1) {
            // Validate national ID
            if (!formData.nationalId) {
                errors.nationalId = t('validation_required');
            } else if (!/^\d{11}$/.test(formData.nationalId)) {
                errors.nationalId = language === 'ar' ? 'الرقم الوطني يجب أن يتكون من 11 رقماً بالضبط' : 'National ID must be exactly 11 digits';
            }

            const birthDateError = validateBirthDate(formData.birthDate);
            if (birthDateError) {
                errors.birthDate = birthDateError;
            }
        }

        if (step === 2) {
            // Validate name fields
            if (!formData.firstName.trim()) {
                errors.firstName = t('validation_required');
            } else if (formData.firstName.trim().length < 2) {
                errors.firstName = language === 'ar' ? 'الاسم الأول يجب أن يكون حرفين على الأقل' : 'First name must be at least 2 characters';
            }
            if (!formData.fatherName.trim()) {
                errors.fatherName = t('validation_required');
            } else if (formData.fatherName.trim().length < 2) {
                errors.fatherName = language === 'ar' ? 'اسم الأب يجب أن يكون حرفين على الأقل' : 'Father name must be at least 2 characters';
            }
            if (!formData.lastName.trim()) {
                errors.lastName = t('validation_required');
            } else if (formData.lastName.trim().length < 2) {
                errors.lastName = language === 'ar' ? 'الكنية يجب أن تكون حرفين على الأقل' : 'Last name must be at least 2 characters';
            }
            // Validate governorate
            if (!formData.governorate) {
                errors.governorate = t('validation_required');
            }
        }

        if (step === 3) {
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (formData.email && !emailRegex.test(formData.email)) {
                errors.email = t('validation_email_invalid');
            }

            const phoneError = getPhoneValidationError(formData.phone);
            if (phoneError) {
                errors.phone = phoneError;
            }
        }

        if (step === 4) {
            if (!isPasswordValid(formData.password)) {
                errors.password = t('validation_password_weak');
            }
            if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = t('validation_password_mismatch');
            }
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateBeforeSubmit = (): boolean => {
        const errors: Record<string, string> = {};

        // Step 1: Identity
        if (!formData.nationalId) {
            errors.nationalId = t('validation_required');
        } else if (!/^\d{11}$/.test(formData.nationalId)) {
            errors.nationalId = language === 'ar' ? 'الرقم الوطني يجب أن يتكون من 11 رقماً بالضبط' : 'National ID must be exactly 11 digits';
        }

        const birthDateError = validateBirthDate(formData.birthDate);
        if (birthDateError) {
            errors.birthDate = birthDateError;
        }

        // Step 2: Personal Info
        if (!formData.firstName.trim()) {
            errors.firstName = t('validation_required');
        } else if (formData.firstName.trim().length < 2) {
            errors.firstName = language === 'ar' ? 'الاسم الأول يجب أن يكون حرفين على الأقل' : 'First name must be at least 2 characters';
        }
        if (!formData.fatherName.trim()) {
            errors.fatherName = t('validation_required');
        } else if (formData.fatherName.trim().length < 2) {
            errors.fatherName = language === 'ar' ? 'اسم الأب يجب أن يكون حرفين على الأقل' : 'Father name must be at least 2 characters';
        }
        if (!formData.lastName.trim()) {
            errors.lastName = t('validation_required');
        } else if (formData.lastName.trim().length < 2) {
            errors.lastName = language === 'ar' ? 'الكنية يجب أن تكون حرفين على الأقل' : 'Last name must be at least 2 characters';
        }
        if (!formData.governorate) {
            errors.governorate = t('validation_required');
        }

        // Step 3: Contact
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            errors.email = t('validation_email_invalid');
        }

        const phoneError = getPhoneValidationError(formData.phone);
        if (phoneError) {
            errors.phone = phoneError;
        }

        // Step 4: Password
        if (!isPasswordValid(formData.password)) {
            errors.password = t('validation_password_weak');
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = t('validation_password_mismatch');
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const governorates = [
        { ar: 'دمشق', en: 'Damascus' },
        { ar: 'ريف دمشق', en: 'Rural Damascus' },
        { ar: 'حلب', en: 'Aleppo' },
        { ar: 'حمص', en: 'Homs' },
        { ar: 'حماة', en: 'Hama' },
        { ar: 'اللاذقية', en: 'Latakia' },
        { ar: 'طرطوس', en: 'Tartus' },
        { ar: 'دير الزور', en: 'Deir ez-Zor' },
        { ar: 'الحسكة', en: 'Al-Hasakah' },
        { ar: 'الرقة', en: 'Raqqa' },
        { ar: 'إدلب', en: 'Idlib' },
        { ar: 'درعا', en: 'Daraa' },
        { ar: 'السويداء', en: 'As-Suwayda' },
        { ar: 'القنيطرة', en: 'Quneitra' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (currentStep < 4) {
            if (!validateStep(currentStep)) {
                return;
            }

            setCurrentStep(currentStep + 1);
            return;
        }

        if (!validateBeforeSubmit()) {
            // Navigate to the first step that has errors
            const nationalIdError = !formData.nationalId || !/^\d{11}$/.test(formData.nationalId);
            const birthDateError = !!validateBirthDate(formData.birthDate);
            const nameErrors = !formData.firstName.trim() || formData.firstName.trim().length < 2 || !formData.fatherName.trim() || formData.fatherName.trim().length < 2 || !formData.lastName.trim() || formData.lastName.trim().length < 2 || !formData.governorate;
            const contactErrors = !formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) || !!getPhoneValidationError(formData.phone);
            const hasPasswordError = !isPasswordValid(formData.password) || formData.password !== formData.confirmPassword;

            if (nationalIdError || birthDateError) {
                setCurrentStep(1);
            } else if (nameErrors) {
                setCurrentStep(2);
            } else if (contactErrors) {
                setCurrentStep(3);
            } else if (hasPasswordError) {
                setCurrentStep(4);
            }
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
                // Redirect to 2FA verification page (replace so user can't go back to completed form)
                router.replace(`/two-factor?email=${encodeURIComponent(response.email || formData.email)}`);
                return;
            }

            // Redirect to dashboard
            router.replace('/dashboard');
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
                            width={100}
                            height={100}
                            className="relative z-10 drop-shadow-2xl max-w-[100px] max-h-[100px]"
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
                    <div className="lg:hidden text-center mb-6">
                        <Image
                            src="/assets/logo/Asset-15@2x.png"
                            alt="Logo"
                            width={72}
                            height={72}
                            className="mx-auto mb-3 max-w-[72px] max-h-[72px]"
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
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                                            {t('reg_birth_date')} <span className="text-gov-cherry">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="date"
                                                value={formData.birthDate}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setFormData({ ...formData, birthDate: val });
                                                    if (val) {
                                                        const err = validateBirthDate(val);
                                                        if (err) {
                                                            setFieldErrors(prev => ({ ...prev, birthDate: err }));
                                                        } else {
                                                            setFieldErrors(prev => { const next = { ...prev }; delete next.birthDate; return next; });
                                                        }
                                                    } else if (fieldErrors.birthDate) {
                                                        setFieldErrors(prev => { const next = { ...prev }; delete next.birthDate; return next; });
                                                    }
                                                }}
                                                onBlur={() => {
                                                    if (formData.birthDate) {
                                                        const err = validateBirthDate(formData.birthDate);
                                                        if (err) {
                                                            setFieldErrors(prev => ({ ...prev, birthDate: err }));
                                                        }
                                                    }
                                                }}
                                                min={minBirthDate}
                                                max={maxBirthDate}
                                                className={`w-full py-2.5 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gov-beige/20 dark:bg-white/10 border text-gov-charcoal dark:text-white text-sm focus:outline-none transition-all
                                                    ${fieldErrors.birthDate
                                                        ? 'border-red-500 dark:border-gov-cherry focus:border-red-500 dark:focus:border-gov-cherry focus:ring-2 focus:ring-red-500/20 dark:focus:ring-gov-cherry/20'
                                                        : formData.birthDate && !validateBirthDate(formData.birthDate)
                                                            ? 'border-green-500 dark:border-gov-emerald focus:border-green-500 dark:focus:border-gov-emerald focus:ring-2 focus:ring-green-500/20 dark:focus:ring-gov-emerald/20'
                                                            : 'border-gov-gold/20 dark:border-gov-border/25 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20'
                                                    }`}
                                                required
                                            />
                                            <Calendar className={`absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 transition-colors
                                                ${fieldErrors.birthDate
                                                    ? 'text-red-500 dark:text-gov-cherry'
                                                    : formData.birthDate && !validateBirthDate(formData.birthDate)
                                                        ? 'text-green-500 dark:text-gov-emerald'
                                                        : 'text-gov-sand dark:text-gov-teal/50 group-focus-within:text-gov-teal dark:group-focus-within:text-gov-gold'
                                                }`} size={20} />
                                            {/* Validation icon */}
                                            {fieldErrors.birthDate && (
                                                <div className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <AlertCircle size={18} className="text-red-500 dark:text-gov-cherry" />
                                                </div>
                                            )}
                                            {formData.birthDate && !validateBirthDate(formData.birthDate) && !fieldErrors.birthDate && (
                                                <div className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <CheckCircle2 size={18} className="text-green-500 dark:text-gov-emerald" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-h-[1.25rem] mt-1">
                                            {fieldErrors.birthDate && (
                                                <p className="text-xs text-red-500 dark:text-gov-cherry flex items-center gap-1 animate-fade-in">
                                                    <AlertCircle size={12} className="shrink-0" />
                                                    {fieldErrors.birthDate}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Personal Information */}
                            {currentStep === 2 && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {/* First Name */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                                            {language === 'ar' ? 'الاسم الأول' : 'First Name'} <span className="text-gov-cherry">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, firstName: e.target.value });
                                                    if (fieldErrors.firstName) {
                                                        setFieldErrors(prev => { const next = { ...prev }; delete next.firstName; return next; });
                                                    }
                                                }}
                                                onBlur={() => {
                                                    if (!formData.firstName.trim()) {
                                                        setFieldErrors(prev => ({ ...prev, firstName: t('validation_required') }));
                                                    } else if (formData.firstName.trim().length < 2) {
                                                        setFieldErrors(prev => ({ ...prev, firstName: language === 'ar' ? 'الاسم الأول يجب أن يكون حرفين على الأقل' : 'First name must be at least 2 characters' }));
                                                    }
                                                }}
                                                placeholder={language === 'ar' ? 'الاسم الأول' : 'First Name'}
                                                className={`w-full py-3.5 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gov-beige/20 dark:bg-white/10 border text-gov-charcoal dark:text-white placeholder:text-gov-sand focus:outline-none transition-all
                                                    ${fieldErrors.firstName
                                                        ? 'border-red-500 dark:border-gov-cherry focus:border-red-500 dark:focus:border-gov-cherry focus:ring-2 focus:ring-red-500/20 dark:focus:ring-gov-cherry/20'
                                                        : formData.firstName.trim().length >= 2
                                                            ? 'border-green-500 dark:border-gov-emerald focus:border-green-500 dark:focus:border-gov-emerald focus:ring-2 focus:ring-green-500/20 dark:focus:ring-gov-emerald/20'
                                                            : 'border-gov-gold/20 dark:border-gov-border/25 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20'
                                                    }`}
                                                required
                                            />
                                            <User className={`absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 transition-colors
                                                ${fieldErrors.firstName ? 'text-red-500 dark:text-gov-cherry' : formData.firstName.trim().length >= 2 ? 'text-green-500 dark:text-gov-emerald' : 'text-gov-sand dark:text-gov-teal/50 group-focus-within:text-gov-teal dark:group-focus-within:text-gov-gold'}`} size={20} />
                                            {fieldErrors.firstName && (
                                                <div className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <AlertCircle size={18} className="text-red-500 dark:text-gov-cherry" />
                                                </div>
                                            )}
                                            {!fieldErrors.firstName && formData.firstName.trim().length >= 2 && (
                                                <div className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <CheckCircle2 size={18} className="text-green-500 dark:text-gov-emerald" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-h-[1.25rem] mt-1">
                                            {fieldErrors.firstName && (
                                                <p className="text-xs text-red-500 dark:text-gov-cherry flex items-center gap-1 animate-fade-in">
                                                    <AlertCircle size={12} className="shrink-0" />
                                                    {fieldErrors.firstName}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Father Name */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                                            {language === 'ar' ? 'اسم الأب' : 'Father Name'} <span className="text-gov-cherry">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={formData.fatherName}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, fatherName: e.target.value });
                                                    if (fieldErrors.fatherName) {
                                                        setFieldErrors(prev => { const next = { ...prev }; delete next.fatherName; return next; });
                                                    }
                                                }}
                                                onBlur={() => {
                                                    if (!formData.fatherName.trim()) {
                                                        setFieldErrors(prev => ({ ...prev, fatherName: t('validation_required') }));
                                                    } else if (formData.fatherName.trim().length < 2) {
                                                        setFieldErrors(prev => ({ ...prev, fatherName: language === 'ar' ? 'اسم الأب يجب أن يكون حرفين على الأقل' : 'Father name must be at least 2 characters' }));
                                                    }
                                                }}
                                                placeholder={language === 'ar' ? 'اسم الأب' : 'Father Name'}
                                                className={`w-full py-3.5 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gov-beige/20 dark:bg-white/10 border text-gov-charcoal dark:text-white placeholder:text-gov-sand focus:outline-none transition-all
                                                    ${fieldErrors.fatherName
                                                        ? 'border-red-500 dark:border-gov-cherry focus:border-red-500 dark:focus:border-gov-cherry focus:ring-2 focus:ring-red-500/20 dark:focus:ring-gov-cherry/20'
                                                        : formData.fatherName.trim().length >= 2
                                                            ? 'border-green-500 dark:border-gov-emerald focus:border-green-500 dark:focus:border-gov-emerald focus:ring-2 focus:ring-green-500/20 dark:focus:ring-gov-emerald/20'
                                                            : 'border-gov-gold/20 dark:border-gov-border/25 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20'
                                                    }`}
                                                required
                                            />
                                            <User className={`absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 transition-colors
                                                ${fieldErrors.fatherName ? 'text-red-500 dark:text-gov-cherry' : formData.fatherName.trim().length >= 2 ? 'text-green-500 dark:text-gov-emerald' : 'text-gov-sand dark:text-gov-teal/50 group-focus-within:text-gov-teal dark:group-focus-within:text-gov-gold'}`} size={20} />
                                            {fieldErrors.fatherName && (
                                                <div className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <AlertCircle size={18} className="text-red-500 dark:text-gov-cherry" />
                                                </div>
                                            )}
                                            {!fieldErrors.fatherName && formData.fatherName.trim().length >= 2 && (
                                                <div className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <CheckCircle2 size={18} className="text-green-500 dark:text-gov-emerald" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-h-[1.25rem] mt-1">
                                            {fieldErrors.fatherName && (
                                                <p className="text-xs text-red-500 dark:text-gov-cherry flex items-center gap-1 animate-fade-in">
                                                    <AlertCircle size={12} className="shrink-0" />
                                                    {fieldErrors.fatherName}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                                            {language === 'ar' ? 'الكنية' : 'Last Name'} <span className="text-gov-cherry">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, lastName: e.target.value });
                                                    if (fieldErrors.lastName) {
                                                        setFieldErrors(prev => { const next = { ...prev }; delete next.lastName; return next; });
                                                    }
                                                }}
                                                onBlur={() => {
                                                    if (!formData.lastName.trim()) {
                                                        setFieldErrors(prev => ({ ...prev, lastName: t('validation_required') }));
                                                    } else if (formData.lastName.trim().length < 2) {
                                                        setFieldErrors(prev => ({ ...prev, lastName: language === 'ar' ? 'الكنية يجب أن تكون حرفين على الأقل' : 'Last name must be at least 2 characters' }));
                                                    }
                                                }}
                                                placeholder={language === 'ar' ? 'الكنية' : 'Last Name'}
                                                className={`w-full py-3.5 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gov-beige/20 dark:bg-white/10 border text-gov-charcoal dark:text-white placeholder:text-gov-sand focus:outline-none transition-all
                                                    ${fieldErrors.lastName
                                                        ? 'border-red-500 dark:border-gov-cherry focus:border-red-500 dark:focus:border-gov-cherry focus:ring-2 focus:ring-red-500/20 dark:focus:ring-gov-cherry/20'
                                                        : formData.lastName.trim().length >= 2
                                                            ? 'border-green-500 dark:border-gov-emerald focus:border-green-500 dark:focus:border-gov-emerald focus:ring-2 focus:ring-green-500/20 dark:focus:ring-gov-emerald/20'
                                                            : 'border-gov-gold/20 dark:border-gov-border/25 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20'
                                                    }`}
                                                required
                                            />
                                            <User className={`absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 transition-colors
                                                ${fieldErrors.lastName ? 'text-red-500 dark:text-gov-cherry' : formData.lastName.trim().length >= 2 ? 'text-green-500 dark:text-gov-emerald' : 'text-gov-sand dark:text-gov-teal/50 group-focus-within:text-gov-teal dark:group-focus-within:text-gov-gold'}`} size={20} />
                                            {fieldErrors.lastName && (
                                                <div className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <AlertCircle size={18} className="text-red-500 dark:text-gov-cherry" />
                                                </div>
                                            )}
                                            {!fieldErrors.lastName && formData.lastName.trim().length >= 2 && (
                                                <div className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <CheckCircle2 size={18} className="text-green-500 dark:text-gov-emerald" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-h-[1.25rem] mt-1">
                                            {fieldErrors.lastName && (
                                                <p className="text-xs text-red-500 dark:text-gov-cherry flex items-center gap-1 animate-fade-in">
                                                    <AlertCircle size={12} className="shrink-0" />
                                                    {fieldErrors.lastName}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Governorate */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                                            {t('reg_governorate')} <span className="text-gov-cherry">*</span>
                                        </label>
                                        <div className="relative group">
                                            <select
                                                value={formData.governorate}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, governorate: e.target.value });
                                                    if (fieldErrors.governorate) {
                                                        setFieldErrors(prev => { const next = { ...prev }; delete next.governorate; return next; });
                                                    }
                                                }}
                                                className={`w-full py-3.5 ltr:pl-12 ltr:pr-10 rtl:pr-12 rtl:pl-10 rounded-xl bg-gov-beige/20 dark:bg-white/10 border text-gov-charcoal dark:text-white focus:outline-none transition-all appearance-none
                                                    ${fieldErrors.governorate
                                                        ? 'border-red-500 dark:border-gov-cherry focus:border-red-500 dark:focus:border-gov-cherry focus:ring-2 focus:ring-red-500/20 dark:focus:ring-gov-cherry/20'
                                                        : formData.governorate
                                                            ? 'border-green-500 dark:border-gov-emerald focus:border-green-500 dark:focus:border-gov-emerald focus:ring-2 focus:ring-green-500/20 dark:focus:ring-gov-emerald/20'
                                                            : 'border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20'
                                                    }`}
                                                required
                                            >
                                                <option value="" className="dark:bg-dm-surface dark:text-white">{t('reg_select_governorate')}</option>
                                                {governorates.map((gov) => (
                                                    <option key={gov.ar} value={gov.ar} className="dark:bg-dm-surface dark:text-white">{language === 'ar' ? gov.ar : gov.en}</option>
                                                ))}
                                            </select>
                                            <MapPin className={`absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none
                                                ${fieldErrors.governorate
                                                    ? 'text-red-500 dark:text-gov-cherry'
                                                    : formData.governorate
                                                        ? 'text-green-500 dark:text-gov-emerald'
                                                        : 'text-gov-sand dark:text-gov-teal/50 group-focus-within:text-gov-teal dark:group-focus-within:text-gov-gold'
                                                }`} size={20} />
                                            <ChevronDown className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                            {!fieldErrors.governorate && formData.governorate && (
                                                <div className="absolute ltr:right-8 rtl:left-8 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <CheckCircle2 size={16} className="text-green-500 dark:text-gov-emerald" />
                                                </div>
                                            )}
                                            {fieldErrors.governorate && (
                                                <div className="absolute ltr:right-8 rtl:left-8 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <AlertCircle size={16} className="text-red-500 dark:text-gov-cherry" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-h-[1.25rem] mt-1">
                                            {fieldErrors.governorate && (
                                                <p className="text-xs text-red-500 dark:text-gov-cherry flex items-center gap-1 animate-fade-in">
                                                    <AlertCircle size={12} className="shrink-0" />
                                                    {fieldErrors.governorate}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Contact Information */}
                            {currentStep === 3 && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                                            {t('auth_email')} <span className="text-gov-cherry">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, email: e.target.value });
                                                    if (fieldErrors.email) {
                                                        setFieldErrors(prev => { const next = { ...prev }; delete next.email; return next; });
                                                    }
                                                }}
                                                placeholder="example@email.com"
                                                className={`w-full py-3.5 px-4 ltr:pl-12 ltr:pr-10 rtl:pr-12 rtl:pl-10 rounded-xl bg-gov-beige/20 dark:bg-white/10 border text-gov-charcoal dark:text-white placeholder:text-gov-sand focus:outline-none transition-all
                                                    ${fieldErrors.email
                                                        ? 'border-red-500 dark:border-gov-cherry focus:border-red-500 dark:focus:border-gov-cherry focus:ring-2 focus:ring-red-500/20 dark:focus:ring-gov-cherry/20'
                                                        : formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                                                            ? 'border-green-500 dark:border-gov-emerald focus:border-green-500 dark:focus:border-gov-emerald focus:ring-2 focus:ring-green-500/20 dark:focus:ring-gov-emerald/20'
                                                            : 'border-gov-gold/20 dark:border-gov-border/25 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20'
                                                    }`}
                                                required
                                            />
                                            <Mail className={`absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 transition-colors
                                                ${fieldErrors.email ? 'text-red-500 dark:text-gov-cherry' : formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'text-green-500 dark:text-gov-emerald' : 'text-gov-sand dark:text-gov-teal/50 group-focus-within:text-gov-teal dark:group-focus-within:text-gov-gold'}`} size={20} />
                                            {/* Validation icons */}
                                            {fieldErrors.email && (
                                                <div className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <AlertCircle size={18} className="text-red-500 dark:text-gov-cherry" />
                                                </div>
                                            )}
                                            {!fieldErrors.email && formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                                                <div className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <CheckCircle2 size={18} className="text-green-500 dark:text-gov-emerald" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-h-[1.25rem] mt-1">
                                            {fieldErrors.email && (
                                                <p className="text-xs text-red-500 dark:text-gov-cherry flex items-center gap-1 animate-fade-in">
                                                    <AlertCircle size={12} className="shrink-0" />
                                                    {fieldErrors.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                                            {t('auth_phone')} <span className="text-gov-cherry">*</span>
                                        </label>
                                        <div className="relative group">
                                            <PhoneInput
                                                value={formData.phone}
                                                onChange={(val) => {
                                                    setFormData({ ...formData, phone: val });
                                                    if (fieldErrors.phone) {
                                                        setFieldErrors((prev) => {
                                                            const next = { ...prev };
                                                            delete next.phone;
                                                            return next;
                                                        });
                                                    }
                                                }}
                                                error={fieldErrors.phone}
                                                isValid={!!formData.phone && !fieldErrors.phone && validatePhoneWithCountryCode(formData.phone).isValid}
                                                required
                                            />
                                        </div>
                                    </div>

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
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                                            {t('auth_password')} <span className="text-gov-cherry">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                placeholder={t('reg_password_placeholder')}
                                                className={`w-full py-3.5 px-4 ltr:pl-12 ltr:pr-16 rtl:pr-12 rtl:pl-16 rounded-xl bg-gov-beige/20 dark:bg-white/10 border text-gov-charcoal dark:text-white placeholder:text-gov-sand focus:outline-none transition-all
                                                    ${fieldErrors.password
                                                        ? 'border-red-500 dark:border-gov-cherry focus:border-red-500 dark:focus:border-gov-cherry focus:ring-2 focus:ring-red-500/20 dark:focus:ring-gov-cherry/20'
                                                        : formData.password && isPasswordValid(formData.password)
                                                            ? 'border-green-500 dark:border-gov-emerald focus:border-green-500 dark:focus:border-gov-emerald focus:ring-2 focus:ring-green-500/20 dark:focus:ring-gov-emerald/20'
                                                            : 'border-gov-gold/20 dark:border-gov-border/25 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20'
                                                    }`}
                                                required
                                                minLength={8}
                                            />
                                            <Lock className={`absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none
                                                ${fieldErrors.password ? 'text-red-500 dark:text-gov-cherry' : formData.password && isPasswordValid(formData.password) ? 'text-green-500 dark:text-gov-emerald' : 'text-gov-sand dark:text-gov-teal/50 group-focus-within:text-gov-teal dark:group-focus-within:text-gov-gold'}`} size={20} />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={showPassword ? (language === 'ar' ? 'إخفاء كلمة المرور' : 'Hide password') : (language === 'ar' ? 'إظهار كلمة المرور' : 'Show password')}
                                                className="absolute top-0 bottom-0 ltr:right-0 rtl:left-0 w-12 flex items-center justify-center text-gray-400 hover:text-gov-teal transition-colors z-10 touch-manipulation"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        <div className="min-h-[1.25rem] mt-1">
                                            {fieldErrors.password && (
                                                <p className="text-xs text-red-500 dark:text-gov-cherry flex items-center gap-1 animate-fade-in">
                                                    <AlertCircle size={12} className="shrink-0" />
                                                    {fieldErrors.password}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                                            {t('reg_confirm_password')} <span className="text-gov-cherry">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                placeholder={t('reg_reenter_password')}
                                                className={`w-full py-3.5 px-4 ltr:pl-12 ltr:pr-10 rtl:pr-12 rtl:pl-10 rounded-xl bg-gov-beige/20 dark:bg-white/10 border text-gov-charcoal dark:text-white placeholder:text-gov-sand focus:outline-none transition-all
                                                    ${fieldErrors.confirmPassword
                                                        ? 'border-red-500 dark:border-gov-cherry focus:border-red-500 dark:focus:border-gov-cherry focus:ring-2 focus:ring-red-500/20 dark:focus:ring-gov-cherry/20'
                                                        : formData.confirmPassword && formData.confirmPassword === formData.password && isPasswordValid(formData.password)
                                                            ? 'border-green-500 dark:border-gov-emerald focus:border-green-500 dark:focus:border-gov-emerald focus:ring-2 focus:ring-green-500/20 dark:focus:ring-gov-emerald/20'
                                                            : 'border-gov-gold/20 dark:border-gov-border/25 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20'
                                                    }`}
                                                required
                                            />
                                            <Lock className={`absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none
                                                ${fieldErrors.confirmPassword ? 'text-red-500 dark:text-gov-cherry' : formData.confirmPassword && formData.confirmPassword === formData.password && isPasswordValid(formData.password) ? 'text-green-500 dark:text-gov-emerald' : 'text-gov-sand dark:text-gov-teal/50 group-focus-within:text-gov-teal dark:group-focus-within:text-gov-gold'}`} size={20} />
                                            {/* Validation icons */}
                                            {fieldErrors.confirmPassword && (
                                                <div className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <AlertCircle size={18} className="text-red-500 dark:text-gov-cherry" />
                                                </div>
                                            )}
                                            {!fieldErrors.confirmPassword && formData.confirmPassword && formData.confirmPassword === formData.password && isPasswordValid(formData.password) && (
                                                <div className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <CheckCircle2 size={18} className="text-green-500 dark:text-gov-emerald" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-h-[1.25rem] mt-1">
                                            {fieldErrors.confirmPassword && (
                                                <p className="text-xs text-red-500 dark:text-gov-cherry flex items-center gap-1 animate-fade-in">
                                                    <AlertCircle size={12} className="shrink-0" />
                                                    {fieldErrors.confirmPassword}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Password Requirements */}
                                    <div className="p-4 bg-gray-50 dark:bg-gov-card/10 rounded-xl space-y-2 border border-gray-100 dark:border-white/5">
                                        <p className="text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {t('reg_password_requirements')}
                                        </p>
                                        <ul className="text-sm text-gray-500 dark:text-white/70 space-y-2">
                                            {passwordRules.map((rule) => {
                                                const passed = rule.test(formData.password);
                                                const labelKey = rule.key === 'length' ? 'reg_password_length'
                                                    : rule.key === 'uppercase' ? 'reg_password_uppercase'
                                                        : rule.key === 'lowercase' ? 'reg_password_lowercase'
                                                            : rule.key === 'number' ? 'reg_password_number'
                                                                : 'reg_password_special';
                                                return (
                                                    <li key={rule.key} className="flex items-center gap-2">
                                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passed ? 'bg-gov-emerald dark:bg-gov-gold text-white dark:text-gov-forest' : 'bg-gray-200 dark:bg-white/10 text-gray-400'}`}>
                                                            <CheckCircle size={10} />
                                                        </div>
                                                        <span className={passed ? 'text-gov-emerald dark:text-gov-gold font-medium' : ''}>{t(labelKey)}</span>
                                                    </li>
                                                );
                                            })}
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
