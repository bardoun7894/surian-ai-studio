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
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest transition-colors duration-500">
            <Navbar />

            <main className="flex-grow pt-14 md:pt-16">
                {/* Hero Section */}
                <div className="relative py-24 bg-gov-forest text-white overflow-hidden">
                    <div className="absolute inset-0 bg-pattern-islamic bg-repeat opacity-5"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-gov-forest/80 to-gov-forest"></div>

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
                        <div className="py-20 bg-white dark:bg-gov-forest relative">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                                    <div className="order-2 md:order-1 space-y-6">
                                        <div className="bg-gov-gold/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                                            <Eye size={32} className="text-gov-gold" />
                                        </div>
                                        <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white">
                                            {language === 'ar' ? 'رؤيتنا' : 'Our Vision'}
                                        </h2>
                                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {vision}
                                        </p>
                                    </div>
                                    <div className="order-1 md:order-2 relative h-[300px] rounded-3xl overflow-hidden shadow-2xl skew-y-2 hover:skew-y-0 transition-transform duration-700">
                                        <div className="absolute inset-0 bg-gov-teal/80"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Target className="text-white/20 w-32 h-32" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                    <div className="relative h-[300px] rounded-3xl overflow-hidden shadow-2xl -skew-y-2 hover:skew-y-0 transition-transform duration-700">
                                        <div className="absolute inset-0 bg-gov-red/80"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Award className="text-white/20 w-32 h-32" />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="bg-gov-red/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                                            <Target size={32} className="text-gov-red" />
                                        </div>
                                        <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white">
                                            {language === 'ar' ? 'رسالتنا' : 'Our Mission'}
                                        </h2>
                                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {mission}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Values */}
                        {values.length > 0 && (
                            <div className="py-20 bg-gov-beige dark:bg-gov-forest/50">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="text-center mb-16">
                                        <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-4">
                                            {language === 'ar' ? 'قيمنا المؤسسية' : 'Our Core Values'}
                                        </h2>
                                        <div className="w-24 h-1 bg-gov-gold/50 mx-auto rounded-full"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                        {values.map((value, index) => (
                                            <div key={index} className="bg-white dark:bg-white/5 p-8 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-white/5 group">
                                                <div className="w-14 h-14 bg-gov-forest/5 dark:bg-white/10 text-gov-forest dark:text-gov-gold rounded-xl flex items-center justify-center mb-6 group-hover:bg-gov-forest group-hover:text-white dark:group-hover:bg-gov-gold dark:group-hover:text-gov-forest transition-colors">
                                                    {ICON_MAP[value.icon] || <Shield size={32} />}
                                                </div>
                                                <h3 className="text-xl font-bold text-gov-forest dark:text-white mb-3">
                                                    {language === 'en' && value.title_en ? value.title_en : value.title_ar}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
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
                            <div className="py-20 bg-white dark:bg-gov-forest border-t border-gray-100 dark:border-gov-gold/10">
                                <div className="max-w-4xl mx-auto px-4">
                                    <div className="text-center mb-16">
                                        <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-4">
                                            {language === 'ar' ? 'أهدافنا الاستراتيجية' : 'Strategic Goals'}
                                        </h2>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {language === 'ar'
                                                ? 'نسعى لتحقيق مجموعة من الأهداف التي تصب في مصلحة الوطن والمواطن'
                                                : 'We strive to achieve a set of goals that serve the interest of the nation and citizens'}
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        {goals.map((goal, i) => (
                                            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gov-beige/30 dark:bg-white/5 hover:bg-gov-beige dark:hover:bg-white/10 transition-colors">
                                                <CheckCircle className="text-gov-teal mt-1 shrink-0" size={24} />
                                                <p className="text-lg text-gov-charcoal dark:text-gray-200 font-medium">
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
