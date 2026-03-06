'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare, Clock, Loader2, CheckCircle, User, Building2, Tag, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import { Directorate } from '@/types';
import { getLocalizedName } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { usePageMeta } from "@/hooks/usePageMeta";

// ── Validation helpers ──────────────────────────────────────────────
interface ContactInfo {
    contact_phone?: string;
    contact_email?: string;
    contact_support_email?: string;
    contact_address_ar?: string;
    contact_address_en?: string;
    contact_working_hours_ar?: string;
    contact_working_hours_en?: string;
}

interface FieldErrors {
    name?: string;
    email?: string;
    directorate?: string;
    subject?: string;
    message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateForm(
    data: { name: string; email: string; subject: string; directorate: string; message: string },
    isAr: boolean
): FieldErrors {
    const errors: FieldErrors = {};

    // Name: required, 2-100 chars
    if (!data.name.trim()) {
        errors.name = isAr ? 'الاسم مطلوب' : 'Name is required';
    } else if (data.name.trim().length < 2) {
        errors.name = isAr ? 'الاسم يجب أن يكون حرفين على الأقل' : 'Name must be at least 2 characters';
    } else if (data.name.trim().length > 100) {
        errors.name = isAr ? 'الاسم يجب ألا يتجاوز 100 حرف' : 'Name must not exceed 100 characters';
    }

    // Email: required, valid format
    if (!data.email.trim()) {
        errors.email = isAr ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!EMAIL_RE.test(data.email.trim())) {
        errors.email = isAr ? 'صيغة البريد الإلكتروني غير صحيحة' : 'Invalid email format';
    }

    // Directorate: required
    if (!data.directorate) {
        errors.directorate = isAr ? 'يرجى اختيار الإدارة / الجهة' : 'Please select an administration';
    }

    // Subject: required, 3-255 chars
    if (!data.subject.trim()) {
        errors.subject = isAr ? 'الموضوع مطلوب' : 'Subject is required';
    } else if (data.subject.trim().length < 3) {
        errors.subject = isAr ? 'الموضوع يجب أن يكون 3 أحرف على الأقل' : 'Subject must be at least 3 characters';
    } else if (data.subject.trim().length > 255) {
        errors.subject = isAr ? 'الموضوع يجب ألا يتجاوز 255 حرف' : 'Subject must not exceed 255 characters';
    }

    // Message: required, 10-5000 chars
    if (!data.message.trim()) {
        errors.message = isAr ? 'الرسالة مطلوبة' : 'Message is required';
    } else if (data.message.trim().length < 10) {
        errors.message = isAr ? 'الرسالة يجب أن تكون 10 أحرف على الأقل' : 'Message must be at least 10 characters';
    } else if (data.message.trim().length > 5000) {
        errors.message = isAr ? 'الرسالة يجب ألا تتجاوز 5000 حرف' : 'Message must not exceed 5000 characters';
    }

    return errors;
}

// ── Component ───────────────────────────────────────────────────────
export default function ContactPage() {
    const { language } = useLanguage();

  usePageMeta({
    title: language === "ar" ? "اتصل بنا" : "Contact Us",
    description: language === "ar" ? "تواصل مع وزارة الاقتصاد والصناعة" : "Contact the Ministry of Economy and Industry",
  });
    const isAr = language === 'ar';
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [contactInfo, setContactInfo] = useState<ContactInfo>({});
    const [directorates, setDirectorates] = useState<Directorate[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        directorate: '',
        subject: '',
        message: ''
    });
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        Promise.all([
            API.settings.getByGroup('contact'),
            API.directorates.getAll()
        ])
            .then(([settings, dirs]) => {
                setContactInfo(settings as ContactInfo);
                setDirectorates(dirs);
            })
            .catch(() => {
                setContactInfo({});
            });
    }, []);

    // Mark field as touched on blur
    const handleBlur = useCallback((field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    }, []);

    // Re-validate touched fields on every change
    useEffect(() => {
        const allErrors = validateForm(formData, isAr);
        const visibleErrors: FieldErrors = {};
        for (const key of Object.keys(allErrors) as (keyof FieldErrors)[]) {
            if (touched[key]) {
                visibleErrors[key] = allErrors[key];
            }
        }
        setFieldErrors(visibleErrors);
    }, [formData, touched, isAr]);

    // Check if entire form is valid (for button disable)
    const isFormValid = useMemo(() => {
        const allErrors = validateForm(formData, isAr);
        return Object.keys(allErrors).length === 0;
    }, [formData, isAr]);

    // Main administrations for the dropdown
    const mainAdministrations = useMemo(() => {
        return directorates.filter(d => d.featured || ['d1', 'd2', 'd3'].includes(d.id));
    }, [directorates]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');

        // Touch all fields to show all errors
        setTouched({ name: true, email: true, directorate: true, subject: true, message: true });

        // Full validation
        const allErrors = validateForm(formData, isAr);
        if (Object.keys(allErrors).length > 0) {
            setFieldErrors(allErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            await API.settings.submitContactForm({
                name: formData.name.trim(),
                email: formData.email.trim(),
                subject: formData.subject.trim(),
                message: formData.message,
                department: formData.directorate,
            });
            setIsSuccess(true);
            setFormData({ name: '', email: '', directorate: '', subject: '', message: '' });
            setTouched({});
            setFieldErrors({});
        } catch {
            setSubmitError(isAr ? 'حدث خطأ أثناء الإرسال. حاول مرة أخرى.' : 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const phone = contactInfo.contact_phone || '19999';
    const email = contactInfo.contact_email || 'info@moe.gov.sy';
    const supportEmail = contactInfo.contact_support_email || 'support@moe.gov.sy';
    const address = language === 'en'
        ? (contactInfo.contact_address_en || 'Damascus - Customs, opposite Criminal Security')
        : 'دمشق - الجمارك مقابل الأمن الجنائي';
    const workingHours = language === 'en' && contactInfo.contact_working_hours_en
        ? contactInfo.contact_working_hours_en
        : (contactInfo.contact_working_hours_ar || 'الأحد - الخميس: 8:00 صباحاً - 3:30 عصراً');

    // Helper for input styling with error/valid states
    const inputClass = (field: keyof FieldErrors) => {
        const base = "w-full py-3 px-4 rounded-xl bg-gray-50 dark:bg-white/10 border outline-none transition-colors text-gov-charcoal dark:text-white";
        if (fieldErrors[field]) return `${base} border-red-500 dark:border-red-400 focus:border-red-500`;
        if (touched[field] && !fieldErrors[field] && formData[field]?.trim()) return `${base} border-green-500 dark:border-emerald-400 focus:border-green-500`;
        return `${base} border-gray-200 dark:border-gov-border/25 focus:border-gov-teal`;
    };

    const selectClass = (field: keyof FieldErrors) => {
        const base = "w-full py-3 px-4 rounded-xl bg-gray-50 dark:bg-white/10 border outline-none transition-colors appearance-none text-gov-charcoal dark:text-white";
        if (fieldErrors[field]) return `${base} border-red-500 dark:border-red-400 focus:border-red-500`;
        if (touched[field] && !fieldErrors[field] && formData[field]) return `${base} border-green-500 dark:border-emerald-400 focus:border-green-500`;
        return `${base} border-gray-200 dark:border-gov-border/25 focus:border-gov-teal`;
    };

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors duration-500">
            <Navbar />

            <main className="flex-grow">
                {/* Header */}
                <div className="bg-gov-forest dark:bg-gov-forest/90 text-white py-16 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                            {isAr ? 'اتصل بنا' : 'Contact Us'}
                        </h1>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            {isAr
                                ? 'نحن هنا للإجابة على استفساراتكم وتلقي مقترحاتكم لخدمة أفضل'
                                : 'We are here to answer your inquiries and receive your suggestions for better service'}
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Contact Info Cards */}
                        <div className="space-y-4 lg:col-span-1">
                            {/* Phone */}
                            <div className="bg-white dark:bg-dm-surface p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gov-border/15 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-12 h-12 rounded-xl bg-gov-gold/10 flex items-center justify-center text-gov-gold shrink-0">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gov-forest dark:text-gov-gold mb-1">{isAr ? 'الخط الساخن' : 'Hotline'}</h3>
                                    <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-3xl font-display font-bold text-gov-forest dark:text-white/70 hover:text-gov-gold dark:hover:text-gov-gold transition-colors">{phone}</a>
                                    <p className="text-xs text-gray-500 mt-1">{isAr ? 'متاح 24/7' : 'Available 24/7'}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="bg-white dark:bg-dm-surface p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gov-border/15 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-12 h-12 rounded-xl bg-gov-teal/10 flex items-center justify-center text-gov-teal shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gov-forest dark:text-gov-gold mb-1">{isAr ? 'البريد الإلكتروني' : 'Email'}</h3>
                                    <a href={`mailto:${email}`} className="block text-base font-bold text-gray-700 dark:text-white/70 hover:text-gov-teal dark:hover:text-gov-gold transition-colors">{email}</a>
                                    <a href={`mailto:${supportEmail}`} className="block text-base font-bold text-gray-700 dark:text-white/70 hover:text-gov-teal dark:hover:text-gov-gold transition-colors">{supportEmail}</a>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="bg-white dark:bg-dm-surface p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gov-border/15 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-12 h-12 rounded-xl bg-gov-red/10 flex items-center justify-center text-gov-red shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gov-forest dark:text-gov-gold mb-1">{isAr ? 'العنوان' : 'Address'}</h3>
                                    <p className="text-sm text-gray-600 dark:text-white/70 leading-relaxed">
                                        {address}
                                    </p>
                                </div>
                            </div>

                            {/* Working Hours */}
                            <div className="bg-white dark:bg-dm-surface p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gov-border/15 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-12 h-12 rounded-xl bg-gov-forest/10 dark:bg-gov-gold/10 flex items-center justify-center text-gov-forest dark:text-gov-gold shrink-0">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gov-forest dark:text-gov-gold mb-1">{isAr ? 'ساعات العمل' : 'Working Hours'}</h3>
                                    <p className="text-sm text-gray-600 dark:text-white/70 mb-2">
                                        {workingHours}
                                    </p>
                                    <span className="text-xs bg-gov-forest/10 dark:bg-gov-gold/10 px-2 py-1 rounded text-gov-forest dark:text-gov-gold">
                                        {isAr ? 'الجمعة والسبت عطلة رسمية' : 'Fri & Sat Closed'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Form */}
                            <div className="bg-white dark:bg-dm-surface p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gov-border/15">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gov-forest dark:text-gov-gold mb-2 flex items-center gap-2">
                                        <MessageSquare className="text-gov-gold" />
                                        {isAr ? 'أرسل لنا رسالة' : 'Send Us a Message'}
                                    </h2>
                                    <p className="text-gray-500 dark:text-white/70">
                                        {isAr ? 'يرجى ملء النموذج أدناه وسيتم الرد عليكم في أقرب وقت ممكن.' : 'Please fill out the form below and we will reply as soon as possible.'}
                                    </p>
                                </div>

                                {isSuccess ? (
                                    <div className="py-12 text-center animate-fade-in">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                            <CheckCircle size={40} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gov-forest dark:text-white mb-2">{isAr ? 'تم الإرسال بنجاح' : 'Message Sent Successfully'}</h3>
                                        <p className="text-gray-600 dark:text-white/70 mb-6">{isAr ? 'شكراً لتواصلك معنا. سنقوم بالرد عليك قريباً.' : 'Thank you for contacting us. We will reply shortly.'}</p>
                                        <button onClick={() => setIsSuccess(false)} className="px-6 py-2 bg-gov-teal text-white rounded-lg font-bold">
                                            {isAr ? 'إرسال رسالة أخرى' : 'Send Another Message'}
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} noValidate className="space-y-6">
                                        {submitError && (
                                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl text-sm flex items-center gap-2">
                                                <AlertCircle size={16} className="shrink-0" />
                                                {submitError}
                                            </div>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Name */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-white/70 mb-2">
                                                    {isAr ? 'الاسم الكامل' : 'Full Name'} <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    onBlur={() => handleBlur('name')}
                                                    maxLength={100}
                                                    placeholder={isAr ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                                                    className={inputClass('name')}
                                                />
                                                <div className="min-h-[1.25rem] mt-1">
                                                    {fieldErrors.name && (
                                                        <p className="text-xs text-red-500 flex items-center gap-1">
                                                            <AlertCircle size={12} className="shrink-0" />
                                                            {fieldErrors.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-white/70 mb-2">
                                                    {isAr ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    onBlur={() => handleBlur('email')}
                                                    maxLength={255}
                                                    placeholder="example@domain.com"
                                                    className={inputClass('email')}
                                                />
                                                <div className="min-h-[1.25rem] mt-1">
                                                    {fieldErrors.email && (
                                                        <p className="text-xs text-red-500 flex items-center gap-1">
                                                            <AlertCircle size={12} className="shrink-0" />
                                                            {fieldErrors.email}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Directorate / Entity Selection */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-white/70 mb-2">
                                                {isAr ? 'الإدارة / الجهة' : 'Administration / Entity'} <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={formData.directorate}
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, directorate: e.target.value });
                                                        setTouched(prev => ({ ...prev, directorate: true }));
                                                    }}
                                                    onBlur={() => handleBlur('directorate')}
                                                    className={selectClass('directorate')}
                                                >
                                                    <option value="">{isAr ? '-- اختر الإدارة / الجهة --' : '-- Select Administration / Entity --'}</option>
                                                    <option value="general">{isAr ? 'وزارة الاقتصاد والصناعة' : 'Ministry of Economy and Industry'}</option>
                                                    {mainAdministrations.map(d => (
                                                        <option key={d.id} value={d.id} className="bg-white text-gov-charcoal dark:bg-dm-surface dark:text-white">
                                                            {getLocalizedName(d.name, language)}
                                                        </option>
                                                    ))}
                                                </select>
                                                <Building2 className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                            </div>
                                            <div className="min-h-[1.25rem] mt-1">
                                                {fieldErrors.directorate && (
                                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                                        <AlertCircle size={12} className="shrink-0" />
                                                        {fieldErrors.directorate}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Subject */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-white/70 mb-2">
                                                {isAr ? 'الموضوع' : 'Subject'} <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                onBlur={() => handleBlur('subject')}
                                                maxLength={255}
                                                placeholder={isAr ? 'موضوع رسالتك' : 'Your message subject'}
                                                className={inputClass('subject')}
                                            />
                                            <div className="min-h-[1.25rem] mt-1">
                                                {fieldErrors.subject && (
                                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                                        <AlertCircle size={12} className="shrink-0" />
                                                        {fieldErrors.subject}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-white/70 mb-2">
                                                {isAr ? 'الرسالة' : 'Message'} <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                rows={5}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                onBlur={() => handleBlur('message')}
                                                maxLength={5000}
                                                placeholder={isAr ? 'اكتب رسالتك هنا (10 أحرف على الأقل)' : 'Write your message here (at least 10 characters)'}
                                                className={`${inputClass('message')} resize-none`}
                                            />
                                            <div className="min-h-[1.25rem] mt-1">
                                                {fieldErrors.message && (
                                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                                        <AlertCircle size={12} className="shrink-0" />
                                                        {fieldErrors.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !isFormValid}
                                            className="w-full py-4 bg-gov-forest text-white font-bold rounded-xl shadow-lg hover:bg-gov-teal transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                                            {isSubmitting ? (isAr ? 'جاري الإرسال...' : 'Sending...') : (isAr ? 'إرسال الرسالة' : 'Send Message')}
                                        </button>
                                    </form>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
