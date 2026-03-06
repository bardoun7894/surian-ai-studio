'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare, Clock, Map as MapIcon, Loader2, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DirectoratesMap from '@/components/DirectoratesMap';

interface ContactInfo {
    contact_phone?: string;
    contact_email?: string;
    contact_support_email?: string;
    contact_address_ar?: string;
    contact_address_en?: string;
    contact_working_hours_ar?: string;
    contact_working_hours_en?: string;
}

export default function ContactPage() {
    const { language } = useLanguage();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [contactInfo, setContactInfo] = useState<ContactInfo>({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const settings = await API.settings.getByGroup('contact') as ContactInfo;
                setContactInfo(settings);
            } catch {
                setContactInfo({});
            }
        };
        fetchContactInfo();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            await API.settings.submitContactForm(formData);
            setIsSuccess(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch {
            setError(language === 'ar' ? 'حدث خطأ أثناء الإرسال. حاول مرة أخرى.' : 'An error occurred. Please try again.');
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

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors duration-500">
            <Navbar />

            <main className="flex-grow pt-20 md:pt-24">
                {/* Header */}
                <div className="bg-gov-forest dark:bg-gov-forest/90 text-white py-16 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                            {language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
                        </h1>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            {language === 'ar'
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
                                    <h3 className="font-bold text-gov-forest dark:text-gov-gold mb-1">{language === 'ar' ? 'الخط الساخن' : 'Hotline'}</h3>
                                    <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-3xl font-display font-bold text-gov-forest dark:text-white/70 hover:text-gov-gold dark:hover:text-gov-gold transition-colors">{phone}</a>
                                    <p className="text-xs text-gray-500 mt-1">{language === 'ar' ? 'متاح 24/7' : 'Available 24/7'}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="bg-white dark:bg-dm-surface p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gov-border/15 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-12 h-12 rounded-xl bg-gov-teal/10 flex items-center justify-center text-gov-teal shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gov-forest dark:text-gov-gold mb-1">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</h3>
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
                                    <h3 className="font-bold text-gov-forest dark:text-gov-gold mb-1">{language === 'ar' ? 'العنوان' : 'Address'}</h3>
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
                                    <h3 className="font-bold text-gov-forest dark:text-gov-gold mb-1">{language === 'ar' ? 'ساعات العمل' : 'Working Hours'}</h3>
                                    <p className="text-sm text-gray-600 dark:text-white/70 mb-2">
                                        {workingHours}
                                    </p>
                                    <span className="text-xs bg-gov-forest/10 dark:bg-gov-gold/10 px-2 py-1 rounded text-gov-forest dark:text-gov-gold">
                                        {language === 'ar' ? 'الجمعة والسبت عطلة رسمية' : 'Fri & Sat Closed'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form & Map */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Form */}
                            <div className="bg-white dark:bg-dm-surface p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gov-border/15">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gov-forest dark:text-gov-gold mb-2 flex items-center gap-2">
                                        <MessageSquare className="text-gov-gold" />
                                        {language === 'ar' ? 'أرسل لنا رسالة' : 'Send Us a Message'}
                                    </h2>
                                    <p className="text-gray-500 dark:text-white/70">
                                        {language === 'ar' ? 'يرجى ملء النموذج أدناه وسيتم الرد عليكم في أقرب وقت ممكن.' : 'Please fill out the form below and we will reply as soon as possible.'}
                                    </p>
                                </div>

                                {isSuccess ? (
                                    <div className="py-12 text-center animate-fade-in">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                            <CheckCircle size={40} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gov-forest dark:text-white mb-2">{language === 'ar' ? 'تم الإرسال بنجاح' : 'Message Sent Successfully'}</h3>
                                        <p className="text-gray-600 dark:text-white/70 mb-6">{language === 'ar' ? 'شكراً لتواصلك معنا. سنقوم بالرد عليك قريباً.' : 'Thank you for contacting us. We will reply shortly.'}</p>
                                        <button onClick={() => setIsSuccess(false)} className="px-6 py-2 bg-gov-teal text-white rounded-lg font-bold">
                                            {language === 'ar' ? 'إرسال رسالة أخرى' : 'Send Another Message'}
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {error && (
                                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl text-sm">
                                                {error}
                                            </div>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-white/70 mb-2">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full py-3 px-4 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 focus:border-gov-teal outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-white/70 mb-2">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full py-3 px-4 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 focus:border-gov-teal outline-none transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-white/70 mb-2">{language === 'ar' ? 'الموضوع' : 'Subject'}</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full py-3 px-4 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 focus:border-gov-teal outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-white/70 mb-2">{language === 'ar' ? 'الرسالة' : 'Message'}</label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full py-3 px-4 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 focus:border-gov-teal outline-none transition-colors resize-none"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-4 bg-gov-forest text-white font-bold rounded-xl shadow-lg hover:bg-gov-teal transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                        >
                                            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                                            {isSubmitting ? (language === 'ar' ? 'جاري الإرسال...' : 'Sending...') : (language === 'ar' ? 'إرسال الرسالة' : 'Send Message')}
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* Map Section */}
                            <DirectoratesMap />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
