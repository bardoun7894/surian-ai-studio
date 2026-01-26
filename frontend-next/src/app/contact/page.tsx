'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare, Clock, Map as MapIcon, Loader2, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
    const { language } = useLanguage();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest transition-colors duration-500">
            <Navbar />

            <main className="flex-grow pt-20">
                {/* Header */}
                <div className="bg-gov-forest dark:bg-gov-forest/90 text-white py-16 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
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
                            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-12 h-12 rounded-xl bg-gov-gold/10 flex items-center justify-center text-gov-gold shrink-0">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gov-forest dark:text-white mb-1">{language === 'ar' ? 'الخط الساخن' : 'Hotline'}</h3>
                                    <p className="text-3xl font-display font-bold text-gov-forest dark:text-gray-200">19999</p>
                                    <p className="text-xs text-gray-500 mt-1">{language === 'ar' ? 'متاح 24/7' : 'Available 24/7'}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-12 h-12 rounded-xl bg-gov-teal/10 flex items-center justify-center text-gov-teal shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gov-forest dark:text-white mb-1">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</h3>
                                    <p className="text-base font-bold text-gray-700 dark:text-gray-300">info@moe.gov.sy</p>
                                    <p className="text-base font-bold text-gray-700 dark:text-gray-300">support@moe.gov.sy</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-12 h-12 rounded-xl bg-gov-red/10 flex items-center justify-center text-gov-red shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gov-forest dark:text-white mb-1">{language === 'ar' ? 'العنوان' : 'Address'}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {language === 'ar' ? 'دمشق - ساحة المحافظة - مبنى وزارة الاقتصاد والصناعة' : 'Damascus - Governorate Square - Ministry of Economy and Industry Building'}
                                    </p>
                                </div>
                            </div>

                            {/* Working Hours */}
                            <div className="bg-gov-forest text-white p-6 rounded-2xl shadow-lg border border-gov-gold/20 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-gov-gold shrink-0">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">{language === 'ar' ? 'ساعات العمل' : 'Working Hours'}</h3>
                                    <p className="text-sm text-gray-300 mb-2">
                                        {language === 'ar' ? 'الأحد - الخميس: 8:00 صباحاً - 3:30 عصراً' : 'Sun - Thu: 8:00 AM - 3:30 PM'}
                                    </p>
                                    <span className="text-xs bg-white/20 px-2 py-1 rounded text-white">
                                        {language === 'ar' ? 'الجمعة والسبت عطلة رسمية' : 'Fri & Sat Closed'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form & Map */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Form */}
                            <div className="bg-white dark:bg-white/5 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-white/10">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gov-forest dark:text-white mb-2 flex items-center gap-2">
                                        <MessageSquare className="text-gov-gold" />
                                        {language === 'ar' ? 'أرسل لنا رسالة' : 'Send Us a Message'}
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {language === 'ar' ? 'يرجى ملء النموذج أدناه وسيتم الرد عليكم في أقرب وقت ممكن.' : 'Please fill out the form below and we will reply as soon as possible.'}
                                    </p>
                                </div>

                                {isSuccess ? (
                                    <div className="py-12 text-center animate-fade-in">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                            <CheckCircle size={40} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gov-forest dark:text-white mb-2">{language === 'ar' ? 'تم الإرسال بنجاح' : 'Message Sent Successfully'}</h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-6">{language === 'ar' ? 'شكراً لتواصلك معنا. سنقوم بالرد عليك قريباً.' : 'Thank you for contacting us. We will reply shortly.'}</p>
                                        <button onClick={() => setIsSuccess(false)} className="px-6 py-2 bg-gov-teal text-white rounded-lg font-bold">
                                            {language === 'ar' ? 'إرسال رسالة أخرى' : 'Send Another Message'}
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full py-3 px-4 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 focus:border-gov-teal outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full py-3 px-4 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 focus:border-gov-teal outline-none transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{language === 'ar' ? 'الموضوع' : 'Subject'}</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full py-3 px-4 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 focus:border-gov-teal outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{language === 'ar' ? 'الرسالة' : 'Message'}</label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full py-3 px-4 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 focus:border-gov-teal outline-none transition-colors resize-none"
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

                            {/* Map Placeholder */}
                            <div className="bg-gray-200 dark:bg-gray-800 rounded-3xl h-[400px] overflow-hidden relative shadow-inner flex items-center justify-center group">
                                {/* This would be an iframe or map component in production */}
                                <div className="absolute inset-0 bg-cover bg-center opacity-50 grayscale transition-all duration-500 group-hover:grayscale-0" style={{ backgroundImage: "url('/assets/map-placeholder.jpg')" }}></div>
                                <div className="bg-white/90 dark:bg-black/70 backdrop-blur-sm p-4 rounded-2xl flex items-center gap-2 text-gov-forest dark:text-white font-bold z-10 shadow-lg">
                                    <MapIcon />
                                    <span>{language === 'ar' ? 'الخريطة التفاعلية (قريباً)' : 'Interactive Map (Coming Soon)'}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
