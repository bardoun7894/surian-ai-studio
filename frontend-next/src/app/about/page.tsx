'use client';

import React from 'react';
import { Target, Eye, Award, Users, CheckCircle, Shield, Building } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';


export default function AboutPage() {
    const { language } = useLanguage();

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest transition-colors duration-500">
            <Navbar />

            <main className="flex-grow pt-20">
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
                                    {language === 'ar'
                                        ? 'أن نكون النموذج الرائد في تقديم الخدمات الحكومية الذكية والمبتكرة، وتحقيق التميز المؤسسي لخدمة المواطن والاقتصاد الوطني.'
                                        : 'To be the leading model in providing smart and innovative government services, and achieving institutional excellence to serve citizens and the national economy.'}
                                </p>
                            </div>
                            <div className="order-1 md:order-2 relative h-[300px] rounded-3xl overflow-hidden shadow-2xl skew-y-2 hover:skew-y-0 transition-transform duration-700">
                                {/* Placeholder for vision image - using a pattern or abstract standard */}
                                <div className="absolute inset-0 bg-gov-teal/80"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Target className="text-white/20 w-32 h-32" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="relative h-[300px] rounded-3xl overflow-hidden shadow-2xl -skew-y-2 hover:skew-y-0 transition-transform duration-700">
                                {/* Placeholder for mission image */}
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
                                    {language === 'ar'
                                        ? 'تمكين قطاعات الاقتصاد والصناعة من خلال سياسات داعمة وبنية تحتية رقمية متطورة، وتسهيل الإجراءات لتعزيز بيئة الأعمال والاستثمار.'
                                        : 'Empowering economy and industry sectors through supportive policies and advanced digital infrastructure, and facilitating procedures to enhance the business and investment environment.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values */}
                <div className="py-20 bg-gov-beige dark:bg-gov-forest/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-4">
                                {language === 'ar' ? 'قيمنا المؤسسية' : 'Our Core Values'}
                            </h2>
                            <div className="w-24 h-1 bg-gov-gold/50 mx-auto rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: <Shield size={32} />, title: language === 'ar' ? 'الشفافية' : 'Transparency', desc: language === 'ar' ? 'نلتزم بالوضوح والانفتاح في كافة تعاملاتنا وإجراءاتنا.' : 'We commit to clarity and openness in all our dealings and procedures.' },
                                { icon: <Award size={32} />, title: language === 'ar' ? 'التميز' : 'Excellence', desc: language === 'ar' ? 'نسعى دائماً لتحقيق أعلى معايير الجودة في الأداء.' : 'We always strive to achieve the highest quality standards in performance.' },
                                { icon: <Users size={32} />, title: language === 'ar' ? 'المسؤولية' : 'Responsibility', desc: language === 'ar' ? 'نعمل بمسؤولية وطنية لخدمة المجتمع والصالح العام.' : 'We work with national responsibility to serve society and the public interest.' },
                                { icon: <Building size={32} />, title: language === 'ar' ? 'الابتكار' : 'Innovation', desc: language === 'ar' ? 'نتبنى الحلول الإبداعية والتقنيات الحديثة لتطوير خدماتنا.' : 'We adopt creative solutions and modern technologies to develop our services.' },
                            ].map((value, index) => (
                                <div key={index} className="bg-white dark:bg-white/5 p-8 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-white/5 group">
                                    <div className="w-14 h-14 bg-gov-forest/5 dark:bg-white/10 text-gov-forest dark:text-gov-gold rounded-xl flex items-center justify-center mb-6 group-hover:bg-gov-forest group-hover:text-white dark:group-hover:bg-gov-gold dark:group-hover:text-gov-forest transition-colors">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gov-forest dark:text-white mb-3">{value.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{value.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Strategic Goals */}
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
                            {[
                                language === 'ar' ? 'تطوير البنية التحتية الرقمية للخدمات الحكومية وتسهيل الوصول إليها.' : 'Develop digital infrastructure for government services and facilitate access.',
                                language === 'ar' ? 'رفع كفاءة الأداء المؤسسي وتقليل البيروقراطية الإدارية.' : 'Raise institutional performance efficiency and reduce administrative bureaucracy.',
                                language === 'ar' ? 'دعم بيئة الأعمال والاستثمار وجذب المشاريع التنموية.' : 'Support the business and investment environment and attract development projects.',
                                language === 'ar' ? 'تعزيز الشراكة بين القطاعين العام والخاص.' : 'Enhance partnership between the public and private sectors.',
                                language === 'ar' ? 'تنمية القدرات البشرية وتأهيل الكوادر الوطنية.' : 'Develop human capabilities and qualify national cadres.'
                            ].map((goal, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gov-beige/30 dark:bg-white/5 hover:bg-gov-beige dark:hover:bg-white/10 transition-colors">
                                    <CheckCircle className="text-gov-teal mt-1 shrink-0" size={24} />
                                    <p className="text-lg text-gov-charcoal dark:text-gray-200 font-medium">{goal}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
