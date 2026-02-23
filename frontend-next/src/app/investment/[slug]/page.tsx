'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
    Target,
    Building2,
    FileCheck,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    ArrowRight,
    MapPin,
    Clock,
    Phone,
    Mail,
    Globe,
    CheckCircle,
    FileText,
    Users,
    Briefcase,
    TrendingUp,
    Shield,
    Banknote,
    Factory,
    Landmark,
    Building,
    Zap,
    Wheat,
    Truck,
    Loader2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { API, Investment, InvestmentStats } from '@/lib/repository';

// Investment sub-category metadata
const investmentCategoryMeta: Record<string, {
    iconName: string;
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
    color: string;
    iconColor: string;
}> = {
    'opportunities': {
        iconName: 'Target',
        title_ar: 'الفرص الاستثمارية',
        title_en: 'Investment Opportunities',
        desc_ar: 'اكتشف الفرص الاستثمارية المتاحة في مختلف القطاعات الاقتصادية السورية',
        desc_en: 'Discover investment opportunities available across various Syrian economic sectors',
        color: 'from-gov-forest via-gov-teal to-gov-emerald',
        iconColor: 'gov-gold'
    },
    'one-stop': {
        iconName: 'Building2',
        title_ar: 'النافذة الواحدة',
        title_en: 'One-Stop Shop',
        desc_ar: 'خدمات متكاملة للمستثمرين في مكان واحد - تسهيل الإجراءات وتوفير الوقت',
        desc_en: 'Integrated services for investors in one place - streamlining procedures and saving time',
        color: 'from-gov-teal via-gov-emerald to-gov-forest',
        iconColor: 'white'
    },
    'licenses': {
        iconName: 'FileCheck',
        title_ar: 'التراخيص الاستثمارية',
        title_en: 'Investment Licenses',
        desc_ar: 'إجراءات الحصول على التراخيص والموافقات اللازمة للمشاريع الاستثمارية',
        desc_en: 'Procedures for obtaining necessary licenses and approvals for investment projects',
        color: 'from-gov-charcoal via-gov-forest to-gov-teal',
        iconColor: 'gov-gold'
    },
    'guide': {
        iconName: 'FileText',
        title_ar: 'دليل المستثمر',
        title_en: 'Investor Guide',
        desc_ar: 'دليل شامل للمستثمرين يتضمن جميع المعلومات والإرشادات اللازمة',
        desc_en: 'Comprehensive guide for investors with all necessary information and guidelines',
        color: 'from-gov-forest to-gov-charcoal',
        iconColor: 'gov-beige'
    }
};

// Icon map for dynamic icon rendering
// Mock data for investment opportunities
const mockOpportunities = {
    ar: [
        {
            id: 1,
            title: 'مشروع الطاقة الشمسية - ريف دمشق',
            sector: 'الطاقة المتجددة',
            investment: '5,000,000 $',
            location: 'ريف دمشق',
            status: 'متاح',
            iconName: 'Zap'
        },
        {
            id: 2,
            title: 'مجمع صناعي متكامل - حلب',
            sector: 'الصناعة',
            investment: '15,000,000 $',
            location: 'حلب',
            status: 'متاح',
            iconName: 'Factory'
        },
        {
            id: 3,
            title: 'مشروع سياحي - اللاذقية',
            sector: 'السياحة',
            investment: '8,000,000 $',
            location: 'اللاذقية',
            status: 'قيد الدراسة',
            iconName: 'Building'
        },
        {
            id: 4,
            title: 'مصنع أدوية - حمص',
            sector: 'الصحة',
            investment: '12,000,000 $',
            location: 'حمص',
            status: 'متاح',
            iconName: 'Shield'
        }
    ],
    en: [
        {
            id: 1,
            title: 'Solar Energy Project - Damascus Countryside',
            sector: 'Renewable Energy',
            investment: '$5,000,000',
            location: 'Damascus Countryside',
            status: 'Available',
            iconName: 'Zap'
        },
        {
            id: 2,
            title: 'Integrated Industrial Complex - Aleppo',
            sector: 'Industry',
            investment: '$15,000,000',
            location: 'Aleppo',
            status: 'Available',
            iconName: 'Factory'
        },
        {
            id: 3,
            title: 'Tourism Project - Latakia',
            sector: 'Tourism',
            investment: '$8,000,000',
            location: 'Latakia',
            status: 'Under Review',
            iconName: 'Building'
        },
        {
            id: 4,
            title: 'Pharmaceutical Factory - Homs',
            sector: 'Healthcare',
            investment: '$12,000,000',
            location: 'Homs',
            status: 'Available',
            iconName: 'Shield'
        }
    ]
};

// Mock data for one-stop shop services
const mockOneStopServices = {
    ar: [
        { id: 1, title: 'تسجيل الشركات', desc: 'تسجيل الشركات الجديدة وتحديث البيانات', time: '3-5 أيام عمل' },
        { id: 2, title: 'الحصول على التراخيص', desc: 'استخراج جميع التراخيص اللازمة', time: '5-10 أيام عمل' },
        { id: 3, title: 'التسجيل الضريبي', desc: 'التسجيل في الدوائر المالية', time: '2-3 أيام عمل' },
        { id: 4, title: 'تراخيص البناء', desc: 'الحصول على رخص البناء للمشاريع', time: '10-15 يوم عمل' },
        { id: 5, title: 'التأمينات الاجتماعية', desc: 'تسجيل العمال في التأمينات', time: '1-2 يوم عمل' },
        { id: 6, title: 'الجمارك', desc: 'تسهيلات الاستيراد والتصدير', time: '3-7 أيام عمل' }
    ],
    en: [
        { id: 1, title: 'Company Registration', desc: 'Register new companies and update data', time: '3-5 working days' },
        { id: 2, title: 'License Acquisition', desc: 'Obtain all necessary licenses', time: '5-10 working days' },
        { id: 3, title: 'Tax Registration', desc: 'Register with financial departments', time: '2-3 working days' },
        { id: 4, title: 'Building Permits', desc: 'Obtain building permits for projects', time: '10-15 working days' },
        { id: 5, title: 'Social Insurance', desc: 'Register workers in insurance', time: '1-2 working days' },
        { id: 6, title: 'Customs', desc: 'Import and export facilitation', time: '3-7 working days' }
    ]
};

// Mock data for licenses
const mockLicenses = {
    ar: [
        { id: 1, title: 'رخصة استثمار صناعي', requirements: ['طلب رسمي', 'دراسة جدوى', 'السجل التجاري', 'شهادة بيئية'], fee: '50,000 ل.س' },
        { id: 2, title: 'رخصة استثمار سياحي', requirements: ['طلب رسمي', 'مخطط المشروع', 'موافقة وزارة السياحة'], fee: '75,000 ل.س' },
        { id: 3, title: 'رخصة استثمار زراعي', requirements: ['طلب رسمي', 'وثائق الملكية', 'موافقة وزارة الزراعة'], fee: '25,000 ل.س' },
        { id: 4, title: 'رخصة استثمار تجاري', requirements: ['طلب رسمي', 'السجل التجاري', 'شهادة الغرفة التجارية'], fee: '40,000 ل.س' }
    ],
    en: [
        { id: 1, title: 'Industrial Investment License', requirements: ['Official application', 'Feasibility study', 'Commercial register', 'Environmental certificate'], fee: 'SYP 50,000' },
        { id: 2, title: 'Tourism Investment License', requirements: ['Official application', 'Project plan', 'Ministry of Tourism approval'], fee: 'SYP 75,000' },
        { id: 3, title: 'Agricultural Investment License', requirements: ['Official application', 'Ownership documents', 'Ministry of Agriculture approval'], fee: 'SYP 25,000' },
        { id: 4, title: 'Commercial Investment License', requirements: ['Official application', 'Commercial register', 'Chamber of Commerce certificate'], fee: 'SYP 40,000' }
    ]
};

export default function InvestmentCategoryPage() {
    const params = useParams();
    const slug = params.slug as string;
    const { language } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [stats, setStats] = useState<InvestmentStats | null>(null);

    // Icon map for dynamic icon rendering
    const iconMap: Record<string, React.ElementType> = {
        'Zap': Zap,
        'Factory': Factory,
        'Building': Building,
        'Shield': Shield,
        'Building2': Building2,
        'FileText': FileText,
        'FileCheck': FileCheck,
        'Briefcase': Briefcase,
        'TrendingUp': TrendingUp,
        'Banknote': Banknote,
        'Target': Target,
        'Wheat': Wheat,
        'Truck': Truck,
        'Users': Users,
    };

    const categoryMeta = investmentCategoryMeta[slug];

    const validCategories = ['opportunities', 'one-stop', 'licenses', 'guide'];

    useEffect(() => {
        if (!validCategories.includes(slug)) {
            setLoading(false);
            return;
        }
        const fetchData = async () => {
            try {
                const [investmentsData, statsData] = await Promise.all([
                    API.investments.getByCategory(slug),
                    API.investments.getStats()
                ]);
                setInvestments(investmentsData);
                setStats(statsData);
            } catch (error) {
                console.error('Failed to fetch investments:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    if (!categoryMeta) {
        return (
            <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
                <Navbar />
                <main className="flex-grow pt-20 md:pt-24 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gov-forest dark:text-white mb-4">
                            {language === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}
                        </h1>
                        <Link href="/investment" className="text-gov-teal hover:underline">
                            {language === 'ar' ? 'العودة إلى بوابة الاستثمار' : 'Back to Investment Portal'}
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const Icon = iconMap[categoryMeta.iconName] || Target;

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-gov-gold mb-4" />
                    <p className="text-gray-600 dark:text-white/70">
                        {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                    </p>
                </div>
            );
        }

        // Opportunities page
        if (slug === 'opportunities') {
            const opportunities = investments.length > 0 ? investments : mockOpportunities[language as 'ar' | 'en'] || mockOpportunities.ar;
            return (
                <div className="space-y-8">
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { value: stats?.by_category?.opportunities?.toString() || '6', label_ar: 'فرصة متاحة', label_en: 'Available Opportunities' },
                            { value: '12', label_ar: 'قطاع اقتصادي', label_en: 'Economic Sectors' },
                            { value: '14', label_ar: 'محافظة', label_en: 'Governorates' },
                            { value: stats?.total_investment_value ? `$${(stats.total_investment_value / 1000000).toFixed(0)}M` : '$63M', label_ar: 'حجم الاستثمارات', label_en: 'Investment Volume' }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white dark:bg-dm-bg p-4 rounded-xl text-center border border-gray-100 dark:border-gov-teal">
                                <div className="text-2xl font-bold text-gov-teal dark:text-gov-gold">{stat.value}</div>
                                <div className="text-sm text-gray-600 dark:text-white/70">
                                    {language === 'ar' ? stat.label_ar : stat.label_en}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Opportunities Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {opportunities.map((opp: Investment | typeof mockOpportunities.ar[0]) => {
                            // Handle both API data and mock data formats
                            const isApiData = 'title_ar' in opp;
                            const title = isApiData ? (language === 'ar' ? (opp as Investment).title_ar : (opp as Investment).title_en) : (opp as typeof mockOpportunities.ar[0]).title;
                            const sector = isApiData ? (language === 'ar' ? (opp as Investment).sector_ar : (opp as Investment).sector_en) : (opp as typeof mockOpportunities.ar[0]).sector;
                            const location = isApiData ? (language === 'ar' ? (opp as Investment).location_ar : (opp as Investment).location_en) : (opp as typeof mockOpportunities.ar[0]).location;
                            const investment = isApiData ? (opp as Investment).formatted_amount : (opp as typeof mockOpportunities.ar[0]).investment;
                            const statusLabel = isApiData ? (language === 'ar' ? (opp as Investment).status_label.ar : (opp as Investment).status_label.en) : (opp as typeof mockOpportunities.ar[0]).status;
                            const iconName = isApiData ? (opp as Investment).icon : (opp as typeof mockOpportunities.ar[0]).iconName;
                            const isAvailable = isApiData ? (opp as Investment).status === 'available' : (statusLabel === 'متاح' || statusLabel === 'Available');

                            return (
                                <div key={opp.id} className="group bg-white dark:bg-dm-bg rounded-3xl border border-gray-100 dark:border-gov-teal overflow-hidden hover:border-gov-teal/80 hover:shadow-2xl transition-all duration-500 relative">
                                    <div className={`h-1.5 bg-gradient-to-r ${categoryMeta.color}`}></div>
                                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                                    <div className="p-8 relative z-10">
                                        <div className="flex items-start gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gov-forest to-gov-teal flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500">
                                                {(() => {
                                                    const IconComponent = iconMap[iconName] || Zap;
                                                    return <IconComponent className="w-8 h-8 text-white" />;
                                                })()}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gov-forest dark:text-white mb-3 group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors">{title}</h3>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <span className="px-3 py-1 bg-gov-forest/5 dark:bg-white/10 rounded-lg text-sm font-medium text-gov-forest dark:text-white/70 border border-gov-forest/10 dark:border-white/5">
                                                        {sector}
                                                    </span>
                                                    <span className="px-3 py-1 bg-gov-gold/10 rounded-lg text-sm font-bold text-gov-gold border border-gov-gold/20">
                                                        {investment}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-white/70">
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin size={16} className="text-gov-teal" />
                                                        {location}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${isAvailable ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'}`}>
                                                        <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                        {statusLabel}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="mt-8 w-full py-3 bg-white border-2 border-gov-teal text-gov-teal font-bold rounded-xl hover:bg-gov-teal hover:text-white dark:bg-gov-card/10 dark:border-gov-teal dark:text-gov-teal dark:hover:bg-gov-teal dark:hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg">
                                            {language === 'ar' ? 'عرض تفاصيل الفرصة' : 'View Opportunity Details'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        // One-Stop Shop page
        if (slug === 'one-stop') {
            // Use API data if available, otherwise fallback to mock
            const hasApiData = investments.length > 0;
            const services = hasApiData ? investments : mockOneStopServices[language as 'ar' | 'en'] || mockOneStopServices.ar;
            return (
                <div className="space-y-8">
                    {/* Info Banner */}
                    <div className="bg-gradient-to-r from-gov-teal to-gov-emerald dark:from-gov-gold/20 dark:to-gov-sand/20 p-6 rounded-2xl text-white dark:text-gov-gold">
                        <div className="flex items-center gap-4">
                            <Building2 size={40} />
                            <div>
                                <h3 className="text-xl font-bold">
                                    {language === 'ar' ? 'النافذة الواحدة للمستثمرين' : 'One-Stop Shop for Investors'}
                                </h3>
                                <p className="opacity-90 dark:opacity-80">
                                    {language === 'ar'
                                        ? 'جميع الخدمات الحكومية للمستثمرين في مكان واحد'
                                        : 'All government services for investors in one place'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service: Investment | typeof mockOneStopServices.ar[0]) => {
                            const isApiData = 'title_ar' in service;
                            const title = isApiData ? (language === 'ar' ? (service as Investment).title_ar : (service as Investment).title_en) : (service as typeof mockOneStopServices.ar[0]).title;
                            const desc = isApiData ? (language === 'ar' ? (service as Investment).sector_ar : (service as Investment).sector_en) : (service as typeof mockOneStopServices.ar[0]).desc;
                            const iconName = isApiData ? (service as Investment).icon : 'CheckCircle';
                            const IconComponent = iconMap[iconName] || CheckCircle;

                            return (
                                <div key={service.id} className="bg-white dark:bg-dm-bg p-6 rounded-2xl border border-gray-100 dark:border-gov-teal hover:border-gov-teal/80 hover:shadow-xl transition-all">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-gov-teal/10 dark:bg-gov-gold/10 flex items-center justify-center">
                                            <IconComponent className="w-5 h-5 text-gov-teal dark:text-gov-gold" />
                                        </div>
                                        <h3 className="font-bold text-gov-forest dark:text-white">{title}</h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-white/70 text-sm mb-4">{desc}</p>
                                    {!isApiData && (
                                        <div className="flex items-center gap-2 text-sm text-gov-teal dark:text-gov-gold">
                                            <Clock size={14} />
                                            <span>{(service as typeof mockOneStopServices.ar[0]).time}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Contact Info */}
                    <div className="bg-gov-forest/5 dark:bg-gov-card/10 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-gov-forest dark:text-white mb-4">
                            {language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3">
                                <Phone className="text-gov-gold" size={20} />
                                <span className="text-gray-700 dark:text-white/70">+963 11 123 4567</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="text-gov-gold" size={20} />
                                <span className="text-gray-700 dark:text-white/70">invest@moe.gov.sy</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="text-gov-gold" size={20} />
                                <span className="text-gray-700 dark:text-white/70">
                                    {language === 'ar' ? 'دمشق - ساحة المحافظة' : 'Damascus - Governorate Square'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // Licenses page
        if (slug === 'licenses') {
            const hasApiData = investments.length > 0;
            const licenses = hasApiData ? investments : mockLicenses[language as 'ar' | 'en'] || mockLicenses.ar;
            return (
                <div className="space-y-6">
                    {licenses.map((license: Investment | typeof mockLicenses.ar[0]) => {
                        const isApiData = 'title_ar' in license;
                        const title = isApiData ? (language === 'ar' ? (license as Investment).title_ar : (license as Investment).title_en) : (license as typeof mockLicenses.ar[0]).title;
                        const fee = isApiData ? (license as Investment).formatted_amount : (license as typeof mockLicenses.ar[0]).fee;
                        const requirements = isApiData ? [] : (license as typeof mockLicenses.ar[0]).requirements;
                        const iconName = isApiData ? (license as Investment).icon : 'FileCheck';
                        const IconComponent = iconMap[iconName] || FileCheck;

                        return (
                            <div key={license.id} className="bg-white dark:bg-dm-bg rounded-2xl border border-gray-100 dark:border-gov-teal overflow-hidden">
                                <div className={`h-1 bg-gradient-to-r ${categoryMeta.color}`}></div>
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gov-teal/10 dark:bg-gov-gold/10 flex items-center justify-center flex-shrink-0">
                                                <IconComponent className="w-6 h-6 text-gov-teal dark:text-gov-gold" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gov-forest dark:text-white mb-2">{title}</h3>
                                                {isApiData && (
                                                    <p className="text-gray-600 dark:text-white/70 text-sm">
                                                        {language === 'ar' ? (license as Investment).sector_ar : (license as Investment).sector_en}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <button className="px-6 py-3 bg-gov-teal hover:bg-gov-emerald text-white font-bold rounded-xl transition-all">
                                            {language === 'ar' ? 'تقديم طلب' : 'Apply Now'}
                                        </button>
                                    </div>
                                    {requirements.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gov-border/15">
                                            <h4 className="text-sm font-semibold text-gray-600 dark:text-white/70 mb-2">
                                                {language === 'ar' ? 'المتطلبات:' : 'Requirements:'}
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {requirements.map((req: string, idx: number) => (
                                                    <span key={idx} className="px-3 py-1 bg-gov-beige dark:bg-white/10 rounded-lg text-sm text-gov-forest dark:text-white/70">
                                                        {req}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        // Guide page (default)
        const hasApiData = investments.length > 0;
        return (
            <div className="space-y-6">
                <div className="bg-white dark:bg-dm-bg p-8 rounded-2xl border border-gray-100 dark:border-gov-teal">
                    <p className="text-gray-600 dark:text-white/70 leading-relaxed">
                        {language === 'ar'
                            ? 'يوفر دليل المستثمر معلومات شاملة حول الاستثمار في سوريا، بما في ذلك القوانين واللوائح والإجراءات والفرص المتاحة.'
                            : 'The Investor Guide provides comprehensive information about investing in Syria, including laws, regulations, procedures, and available opportunities.'}
                    </p>
                </div>
                {hasApiData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {investments.map((item) => {
                            const IconComponent = iconMap[item.icon] || FileText;
                            return (
                                <div key={item.id} className="bg-white dark:bg-dm-bg p-6 rounded-2xl border border-gray-100 dark:border-gov-teal hover:border-gov-teal/80 hover:shadow-xl transition-all">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-gov-teal/10 dark:bg-gov-gold/10 flex items-center justify-center">
                                            <IconComponent className="w-5 h-5 text-gov-teal dark:text-gov-gold" />
                                        </div>
                                        <h3 className="font-bold text-gov-forest dark:text-white">
                                            {language === 'ar' ? item.title_ar : item.title_en}
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-white/70 text-sm">
                                        {language === 'ar' ? item.sector_ar : item.sector_en}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
            <Navbar />
            <main className="flex-grow pt-20 md:pt-24">
                {/* Hero Section */}
                <div className={`bg-gradient-to-br ${categoryMeta.color} text-white py-20 px-4 relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                    </div>
                    <div className="max-w-6xl mx-auto relative z-10">
                        {/* Breadcrumb */}
                        <Link
                            href="/investment"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                        >
                            {language === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                            {language === 'ar' ? 'بوابة الاستثمار' : 'Investment Portal'}
                        </Link>

                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                <Icon size={50} />
                            </div>
                            <div className={`text-center ${language === 'ar' ? 'md:text-right' : 'md:text-left'}`}>
                                <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                                    {language === 'ar' ? categoryMeta.title_ar : categoryMeta.title_en}
                                </h1>
                                <p className="text-white/80 text-lg max-w-2xl">
                                    {language === 'ar' ? categoryMeta.desc_ar : categoryMeta.desc_en}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-6xl mx-auto px-4 py-12">
                    {renderContent()}
                </div>

                {/* CTA Section */}
                <div className="bg-gov-forest/5 dark:bg-gov-gold/5 py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-gov-forest dark:text-white mb-4">
                            {language === 'ar' ? 'هل تحتاج إلى مساعدة؟' : 'Need Assistance?'}
                        </h2>
                        <p className="text-gray-600 dark:text-white/70 mb-6">
                            {language === 'ar'
                                ? 'فريقنا المتخصص جاهز للإجابة على استفساراتك ومساعدتك في رحلتك الاستثمارية'
                                : 'Our specialized team is ready to answer your questions and assist you on your investment journey'}
                        </p>
                        <Link
                            href="/complaints"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gov-teal hover:bg-gov-emerald text-white font-bold rounded-2xl transition-all"
                        >
                            {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                            {language === 'ar' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
