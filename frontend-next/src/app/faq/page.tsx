'use client';
import { usePageLoading } from '@/hooks/usePageLoading';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, HelpCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import { FAQ } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function FAQPage() {
    const { language } = useLanguage();
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    usePageLoading(loading);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const data = await API.faqs.getAll();
                setFaqs(data);
            } catch {
                setFaqs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFaqs();
    }, []);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const getQuestion = (faq: FAQ) => language === 'en' && faq.question_en ? faq.question_en : faq.question_ar;
    const getAnswer = (faq: FAQ) => language === 'en' && faq.answer_en ? faq.answer_en : faq.answer_ar;

    const filteredFaqs = faqs.filter(faq => {
        const question = getQuestion(faq);
        return question.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors duration-500">
            <Navbar />

            <main className="flex-grow pt-20 md:pt-24">
                <div className="bg-gov-forest text-white py-16 px-4 animate-fade-in-up">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                            {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
                        </h1>
                        <p className="text-gray-300 text-lg">
                            {language === 'ar'
                                ? 'اعثر على إجابات سريعة لأهم استفساراتك حول استخدام البوابة والخدمات'
                                : 'Find quick answers to your questions about using the portal and services'}
                        </p>

                        <div className="mt-8 relative max-w-2xl mx-auto">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={language === 'ar' ? 'ابحث عن سؤال...' : 'Search for a question...'}
                                className="w-full py-4 px-6 pr-14 rtl:pr-6 rtl:pl-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-gold transition-colors"
                            />
                            <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-12">

                    {/* FAQ List */}
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <Loader2 className="animate-spin text-gov-teal" size={40} />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredFaqs.length > 0 ? filteredFaqs.map((faq, index) => (
                                <div
                                    key={faq.id}
                                    className={`bg-white dark:bg-dm-surface rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === index
                                        ? 'border-gov-gold/50 shadow-md'
                                        : 'border-gray-100 dark:border-gov-border/15 hover:border-gov-gold/30 hover:shadow-gov'
                                        }`}
                                >
                                    <button
                                        onClick={() => toggleAccordion(index)}
                                        className="w-full flex items-center justify-between p-6 text-right rtl:text-right ltr:text-left focus:outline-none"
                                    >
                                        <span className="font-bold text-lg text-gov-forest dark:text-white">
                                            {getQuestion(faq)}
                                        </span>
                                        <div className={`w-8 h-8 rounded-full bg-gray-50 dark:bg-white/10 flex items-center justify-center transition-transform duration-300 ${openIndex === index ? 'rotate-180 bg-gov-gold/20 text-gov-gold' : 'text-gray-400'}`}>
                                            <ChevronDown size={20} />
                                        </div>
                                    </button>
                                    <div
                                        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <p className="text-gray-600 dark:text-white/70 leading-relaxed border-t border-gray-100 dark:border-gov-border/15 pt-4">
                                            {getAnswer(faq)}
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12">
                                    <HelpCircle size={48} className="mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-bold text-gray-500">
                                        {language === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found'}
                                    </h3>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </div>
    );
}
