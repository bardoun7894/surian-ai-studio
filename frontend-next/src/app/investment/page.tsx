'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
    TrendingUp,
    Building2,
    FileCheck,
    Target,
    Globe,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    Users,
    Award,
    LucideIcon
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { usePageMeta } from "@/hooks/usePageMeta";

// Icon component that renders based on name
const IconRenderer = ({ name, size = 40, className = '' }: { name: string; size?: number; className?: string }) => {
    const icons: Record<string, LucideIcon> = {
        Target,
        Building2,
        FileCheck,
        DollarSign,
        Users,
        Award
    };
    const IconComponent = icons[name] || Target;
    return <IconComponent size={size} className={className} />;
};

const investmentCategories = [
    {
        slug: 'opportunities',
        iconName: 'Target',
        title_ar: 'الفرص الاستثمارية',
        title_en: 'Investment Opportunities',
        desc_ar: 'اكتشف الفرص الاستثمارية المتاحة في مختلف القطاعات الاقتصادية',
        desc_en: 'Discover investment opportunities available in various economic sectors'
    },
    {
        slug: 'one-stop',
        iconName: 'Building2',
        title_ar: 'النافذة الواحدة',
        title_en: 'One-Stop Shop',
        desc_ar: 'خدمات متكاملة للمستثمرين في مكان واحد',
        desc_en: 'Integrated services for investors in one place'
    },
    {
        slug: 'licenses',
        iconName: 'FileCheck',
        title_ar: 'التراخيص الاستثمارية',
        title_en: 'Investment Licenses',
        desc_ar: 'إجراءات الحصول على التراخيص والموافقات اللازمة',
        desc_en: 'Procedures for obtaining necessary licenses and approvals'
    }
];

const stats = [
    { iconName: 'DollarSign', value: '500+', label_ar: 'فرصة استثمارية', label_en: 'Investment Opportunities' },
    { iconName: 'Users', value: '1000+', label_ar: 'مستثمر مسجل', label_en: 'Registered Investors' },
    { iconName: 'Award', value: '95%', label_ar: 'نسبة الرضا', label_en: 'Satisfaction Rate' }
];

export default function InvestmentPage() {
    const { language } = useLanguage();

  usePageMeta({
    title: language === "ar" ? "الاستثمار" : "Investment",
    description: language === "ar" ? "فرص الاستثمار في سوريا" : "Investment opportunities in Syria",
  });

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
            <Navbar />
            <main className="flex-grow pt-0">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-gov-forest via-gov-emerald to-gov-teal text-white py-24 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                    </div>
                    <div className="max-w-6xl mx-auto relative z-10 text-center">
                        <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-gov-gold border border-white/20 mx-auto mb-8">
                            <TrendingUp size={50} />
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
                            {language === 'ar' ? 'بوابة الاستثمار' : 'Investment Portal'}
                        </h1>
                        <p className="text-white/80 text-xl max-w-3xl mx-auto leading-relaxed">
                            {language === 'ar'
                                ? 'بوابتك الشاملة للاستثمار في سوريا - فرص استثمارية، تراخيص، ودعم متكامل للمستثمرين'
                                : 'Your comprehensive gateway to investing in Syria - investment opportunities, licenses, and integrated support for investors'}
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white dark:bg-dm-surface p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gov-border/15 text-center">
                                <IconRenderer name={stat.iconName} size={32} className="text-gov-gold mx-auto mb-3" />
                                <div className="text-3xl font-bold text-gov-forest dark:text-white">{stat.value}</div>
                                <div className="text-gray-600 dark:text-white/70">
                                    {language === 'ar' ? stat.label_ar : stat.label_en}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="max-w-6xl mx-auto px-4 py-20">
                    <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-12 text-center">
                        {language === 'ar' ? 'خدمات الاستثمار' : 'Investment Services'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {investmentCategories.map((cat, idx) => (
                            <Link
                                key={idx}
                                href={`/investment/${cat.slug}`}
                                className="group bg-white dark:bg-dm-surface p-8 rounded-3xl border border-gray-100 dark:border-gov-border/15 hover:border-gov-gold/50 hover:shadow-2xl transition-all duration-500"
                            >
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gov-teal to-gov-emerald dark:from-gov-gold/90 dark:to-gov-sand flex items-center justify-center text-white dark:text-gov-forest mb-6 group-hover:scale-110 transition-transform shadow-lg">
                                    <IconRenderer name={cat.iconName} size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-gov-forest dark:text-white mb-4">
                                    {language === 'ar' ? cat.title_ar : cat.title_en}
                                </h3>
                                <p className="text-gray-600 dark:text-white/70 mb-6 leading-relaxed">
                                    {language === 'ar' ? cat.desc_ar : cat.desc_en}
                                </p>
                                <span className="text-gov-teal dark:text-gov-gold font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                                    {language === 'ar' ? 'استكشف المزيد' : 'Explore More'}
                                    {language === 'ar' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gov-forest/5 dark:bg-gov-gold/5 py-20 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Globe size={60} className="text-gov-gold mx-auto mb-6" />
                        <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-4">
                            {language === 'ar' ? 'ابدأ رحلتك الاستثمارية اليوم' : 'Start Your Investment Journey Today'}
                        </h2>
                        <p className="text-gray-600 dark:text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                            {language === 'ar'
                                ? 'فريقنا المتخصص جاهز لمساعدتك في كل خطوة من خطوات الاستثمار'
                                : 'Our specialized team is ready to help you at every step of your investment'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/complaints"
                                className="px-8 py-4 bg-gov-teal hover:bg-gov-emerald text-white font-bold rounded-2xl transition-all shadow-lg"
                            >
                                {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                            </Link>
                            <Link
                                href="/investment/opportunities"
                                className="px-8 py-4 bg-white dark:bg-white/10 border-2 border-gov-teal dark:border-gov-gold text-gov-teal dark:text-gov-gold font-bold rounded-2xl transition-all hover:bg-gov-teal/5 dark:hover:bg-gov-gold/5"
                            >
                                {language === 'ar' ? 'تصفح الفرص' : 'Browse Opportunities'}
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
