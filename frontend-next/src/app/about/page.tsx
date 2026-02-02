'use client';

import React, { useState, useEffect } from 'react';
import { Target, Eye, Award, Users, CheckCircle, Shield, Building, Lightbulb, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface AboutValue {
    icon: string;
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
}

interface AboutGoal {
    title_ar: string;
    title_en: string;
}

interface AboutData {
    about_mission_ar?: string;
    about_mission_en?: string;
    about_vision_ar?: string;
    about_vision_en?: string;
    about_values?: AboutValue[];
    about_goals?: AboutGoal[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
    Eye: <Eye size={32} />,
    Award: <Award size={32} />,
    Shield: <Shield size={32} />,
    Lightbulb: <Lightbulb size={32} />,
    Users: <Users size={32} />,
    Building: <Building size={32} />,
    Target: <Target size={32} />,
};

export default function AboutPage() {
    const { language } = useLanguage();
    const [data, setData] = useState<AboutData>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const settings = await API.settings.getByGroup('about') as AboutData;
                setData(settings);
            } catch {
                setData({});
            } finally {
                setLoading(false);
            }
        };
        fetchAbout();
    }, []);

    const vision = language === 'en' && data.about_vision_en ? data.about_vision_en : (data.about_vision_ar || '');
    const mission = language === 'en' && data.about_mission_en ? data.about_mission_en : (data.about_mission_ar || '');
    const values = data.about_values || [];
    const goals = data.about_goals || [];

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors duration-500">
            <Navbar />

            <main className="flex-grow pt-20 md:pt-24">
                {/* Hero Section */}
                <div className="relative py-24 bg-gov-forest dark:bg-gov-forest/80 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-pattern-islamic bg-repeat opacity-5"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-gov-forest/80 to-gov-forest dark:from-gov-forest/60 dark:to-gov-forest/80"></div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 animate-fade-in-up">
                            {language === 'ar' ? 'عن الوزارة' : 'About The Ministry'}
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-100">
                            {language === 'ar'
                                ? 'نعمل على تحقيق تنمية اقتصادية مستدامة وبناء مستقبل رقمي واعد للجمهورية العربية السورية.'
                                : 'Working towards sustainable economic development and building a promising digital future for the Syrian Arab Republic.'}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="animate-spin text-gov-teal" size={48} />
                    </div>
                ) : (
                    <>
                        {/* Vision & Mission */}
                        <div className="py-20 bg-gradient-to-br from-white to-gov-beige/30 dark:from-dm-bg dark:to-dm-bg relative overflow-hidden">
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-gov-gold/5 dark:bg-gov-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gov-teal/5 dark:bg-gov-teal/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

                                    {/* Vision Card */}
                                    <div className="group relative bg-white dark:bg-dm-surface rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-gov-border/15 shadow-lg hover:shadow-xl hover:shadow-gov-gold/10 dark:hover:shadow-gov-gold/5 transition-all duration-500 overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gov-gold/10 dark:bg-gov-gold/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-700"></div>

                                        <div className="relative z-10">
                                            <div className="w-16 h-16 bg-gov-forest dark:bg-gov-gold rounded-2xl flex items-center justify-center mb-6 shadow-md transform group-hover:-translate-y-1 transition-transform duration-300">
                                                <Eye size={32} className="text-white dark:text-gov-forest" />
                                            </div>

                                            <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-gov-gold mb-4 group-hover:text-gov-emerald dark:group-hover:text-gov-gold transition-colors">
                                                {language === 'ar' ? 'رؤيتنا' : 'Our Vision'}
                                            </h2>

                                            <p className="text-lg text-gray-600 dark:text-white/70 leading-relaxed">
                                                {/* Use provided text or fallback to API data */}
                                                {language === 'ar'
                                                    ? 'اقتصاد وطني متنوع ومستدام يحقق الرفاه للمواطنين ويعزز مكانة سوريا في الاقتصاد العالمي.'
                                                    : (vision || 'A diversified and sustainable national economy that achieves welfare for citizens and enhances Syria\'s position in the global economy.')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Mission Card */}
                                    <div className="group relative bg-white dark:bg-dm-surface rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-gov-border/15 shadow-lg hover:shadow-xl hover:shadow-gov-teal/10 dark:hover:shadow-gov-teal/5 transition-all duration-500 overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gov-teal/10 dark:bg-gov-teal/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-700"></div>

                                        <div className="relative z-10">
                                            <div className="w-16 h-16 bg-gov-emerald dark:bg-gov-teal rounded-2xl flex items-center justify-center mb-6 shadow-md transform group-hover:-translate-y-1 transition-transform duration-300">
                                                <Target size={32} className="text-white" />
                                            </div>

                                            <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-gov-gold mb-4 group-hover:text-gov-emerald dark:group-hover:text-gov-teal transition-colors">
                                                {language === 'ar' ? 'رسالتنا' : 'Our Mission'}
                                            </h2>

                                            <p className="text-lg text-gray-600 dark:text-white/70 leading-relaxed">
                                                {/* Use provided text or fallback to API data */}
                                                {language === 'ar'
                                                    ? 'تعمل وزارة الاقتصاد والصناعة على تعزيز النمو الاقتصادي المستدام ودعم القطاعات الإنتاجية من خلال سياسات اقتصادية فعّالة وبيئة استثمارية محفزة وخدمات رقمية متطورة.'
                                                    : (mission || 'The Ministry of Economy and Industry works to promote sustainable economic growth and support productive sectors through effective economic policies, a stimulating investment environment, and advanced Services.')}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Values */}
                        {values.length > 0 && (
                            <div className="py-20 bg-gov-beige dark:bg-dm-bg">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-16">
                                        <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-gov-gold mb-4">
                                            {language === 'ar' ? 'قيمنا المؤسسية' : 'Our Core Values'}
                                        </h2>
                                        <div className="w-24 h-1 bg-gov-gold/50 mx-auto rounded-full"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                        {values.map((value, index) => (
                                            <div key={index} className="bg-white dark:bg-dm-surface p-8 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-gov-border/15 group">
                                                <div className="w-14 h-14 bg-gov-forest/5 dark:bg-white/10 text-gov-forest dark:text-gov-gold rounded-xl flex items-center justify-center mb-6 group-hover:bg-gov-forest group-hover:text-white dark:group-hover:bg-gov-gold dark:group-hover:text-gov-forest transition-colors">
                                                    {ICON_MAP[value.icon] || <Shield size={32} />}
                                                </div>
                                                <h3 className="text-xl font-bold text-gov-forest dark:text-gov-gold mb-3">
                                                    {language === 'en' && value.title_en ? value.title_en : value.title_ar}
                                                </h3>
                                                <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed">
                                                    {language === 'en' && value.desc_en ? value.desc_en : value.desc_ar}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Strategic Goals */}
                        {goals.length > 0 && (
                            <div className="py-20 bg-gov-beige dark:bg-dm-bg border-t border-gray-100 dark:border-gov-border/15">
                                <div className="max-w-4xl mx-auto px-4">
                                    <div className="text-center mb-16">
                                        <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-gov-gold mb-4">
                                            {language === 'ar' ? 'أهدافنا الاستراتيجية' : 'Strategic Goals'}
                                        </h2>
                                        <p className="text-gray-500 dark:text-white/70">
                                            {language === 'ar'
                                                ? 'نسعى لتحقيق مجموعة من الأهداف التي تصب في مصلحة الوطن والمواطن'
                                                : 'We strive to achieve a set of goals that serve the interest of the nation and citizens'}
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        {goals.map((goal, i) => (
                                            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gov-beige/30 dark:bg-dm-surface hover:bg-gov-beige dark:hover:bg-gov-card/10 transition-colors border border-transparent dark:border-gov-border/15">
                                                <CheckCircle className="text-gov-teal mt-1 shrink-0" size={24} />
                                                <p className="text-lg text-gov-charcoal dark:text-white/70 font-medium">
                                                    {language === 'en' && goal.title_en ? goal.title_en : goal.title_ar}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

            </main>

            <Footer />
        </div>
    );
}
