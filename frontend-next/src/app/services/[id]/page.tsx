'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/lib/repository';
import { Service, Directorate } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
    ChevronRight,
    ChevronLeft,
    Clock,
    FileText,
    ExternalLink,
    CheckCircle,
    Building,
    Monitor,
    ShieldAlert,
    Scale,
    HeartPulse,
    BookOpen,
    GraduationCap,
    Zap,
    Droplets,
    Plane,
    Wifi,
    Banknote,
    Map,
    Factory,
    Laptop,
    Server,
    Lock,
    RefreshCw,
    Shield,
    TrendingUp,
    DollarSign,
    Award,
    Truck,
    FileCheck,
    Briefcase,
    Users,
    BarChart,
    Building2,
    Landmark,
    Hotel,
    Gavel,
    FileSignature,
    UserCog,
    Settings,
    Heart
} from 'lucide-react';
import { SkeletonText } from '@/components/SkeletonLoader';
import FavoriteButton from '@/components/FavoriteButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedField, getLocalizedName } from '@/lib/utils';
import Link from 'next/link';

// Sub-category metadata with icons and descriptions
const subCategoryMeta: Record<string, { iconName: string; title_ar: string; title_en: string; desc_ar: string; desc_en: string }> = {
    'apps': { iconName: 'Laptop', title_ar: 'التطبيقات الذكية', title_en: 'Smart Applications', desc_ar: 'تطبيقات حكومية ذكية لتسهيل الخدمات', desc_en: 'Smart government applications for easier services' },
    'infrastructure': { iconName: 'Server', title_ar: 'البنية التحتية', title_en: 'Infrastructure', desc_ar: 'البنية التحتية الرقمية للخدمات الحكومية', desc_en: 'Digital infrastructure for government services' },
    'digital-transformation': { iconName: 'RefreshCw', title_ar: 'التحول الرقمي', title_en: 'Digital Transformation', desc_ar: 'خدمات التحول الرقمي والتطوير', desc_en: 'Digital transformation and development services' },
    'supply-control': { iconName: 'Truck', title_ar: 'الرقابة التموينية', title_en: 'Supply Control', desc_ar: 'خدمات الرقابة على المواد التموينية', desc_en: 'Supply and goods monitoring services' },
    'price-monitoring': { iconName: 'TrendingUp', title_ar: 'مراقبة الأسعار', title_en: 'Price Monitoring', desc_ar: 'خدمات مراقبة وضبط الأسعار', desc_en: 'Price monitoring and control services' },
    'trade': { iconName: 'Truck', title_ar: 'التصدير والاستيراد', title_en: 'Import & Export', desc_ar: 'خدمات التجارة الخارجية والاستيراد والتصدير', desc_en: 'Foreign trade, import and export services' },
    'agreements': { iconName: 'FileSignature', title_ar: 'الاتفاقيات التجارية', title_en: 'Trade Agreements', desc_ar: 'الاتفاقيات التجارية الدولية والإقليمية', desc_en: 'International and regional trade agreements' },
    'industrial-licenses': { iconName: 'FileCheck', title_ar: 'التراخيص الصناعية', title_en: 'Industrial Licenses', desc_ar: 'تراخيص المنشآت الصناعية', desc_en: 'Industrial facility licenses' },
    'industrial-zones': { iconName: 'Factory', title_ar: 'المناطق الصناعية', title_en: 'Industrial Zones', desc_ar: 'المناطق والمدن الصناعية', desc_en: 'Industrial zones and cities' },
    'standards': { iconName: 'Award', title_ar: 'الجودة والمواصفات', title_en: 'Quality & Standards', desc_ar: 'معايير الجودة والمواصفات القياسية', desc_en: 'Quality and standard specifications' },
    'sme-financing': { iconName: 'DollarSign', title_ar: 'تمويل المشاريع الصغيرة', title_en: 'SME Financing', desc_ar: 'برامج تمويل المشاريع الصغيرة والمتوسطة', desc_en: 'Small and medium enterprise financing programs' },
    'training': { iconName: 'GraduationCap', title_ar: 'التدريب والإرشاد', title_en: 'Training & Mentoring', desc_ar: 'برامج التدريب والإرشاد المهني', desc_en: 'Training and professional mentoring programs' },
    'incubators': { iconName: 'Briefcase', title_ar: 'حاضنات الأعمال', title_en: 'Business Incubators', desc_ar: 'حاضنات ومسرعات الأعمال', desc_en: 'Business incubators and accelerators' },
    'economic-studies': { iconName: 'BarChart', title_ar: 'الدراسات الاقتصادية', title_en: 'Economic Studies', desc_ar: 'الدراسات والأبحاث الاقتصادية', desc_en: 'Economic studies and research' },
    'statistics': { iconName: 'BarChart', title_ar: 'الإحصاءات', title_en: 'Statistics', desc_ar: 'البيانات والإحصاءات الاقتصادية', desc_en: 'Economic data and statistics' },
    'planning': { iconName: 'Map', title_ar: 'التخطيط الاستراتيجي', title_en: 'Strategic Planning', desc_ar: 'التخطيط الاستراتيجي والتنموي', desc_en: 'Strategic and developmental planning' },
    'company-registration': { iconName: 'Building2', title_ar: 'تسجيل الشركات', title_en: 'Company Registration', desc_ar: 'خدمات تسجيل وتأسيس الشركات', desc_en: 'Company registration and establishment services' },
    'commercial-register': { iconName: 'FileText', title_ar: 'السجل التجاري', title_en: 'Commercial Register', desc_ar: 'خدمات السجل التجاري', desc_en: 'Commercial register services' },
    'trademarks': { iconName: 'Award', title_ar: 'العلامات التجارية', title_en: 'Trademarks', desc_ar: 'تسجيل وحماية العلامات التجارية', desc_en: 'Trademark registration and protection' },
    'cooperatives': { iconName: 'Users', title_ar: 'الجمعيات التعاونية', title_en: 'Cooperatives', desc_ar: 'تأسيس وإدارة الجمعيات التعاونية', desc_en: 'Cooperative establishment and management' },
    'coop-support': { iconName: 'Shield', title_ar: 'الدعم الفني', title_en: 'Technical Support', desc_ar: 'الدعم الفني للجمعيات التعاونية', desc_en: 'Technical support for cooperatives' },
    'tourism-licenses': { iconName: 'FileCheck', title_ar: 'التراخيص السياحية', title_en: 'Tourism Licenses', desc_ar: 'تراخيص المنشآت السياحية', desc_en: 'Tourism facility licenses' },
    'tourist-sites': { iconName: 'Map', title_ar: 'المواقع السياحية', title_en: 'Tourist Sites', desc_ar: 'دليل المواقع السياحية', desc_en: 'Tourist sites guide' },
    'hotels': { iconName: 'Hotel', title_ar: 'الفنادق والمنتجعات', title_en: 'Hotels & Resorts', desc_ar: 'خدمات الفنادق والمنتجعات السياحية', desc_en: 'Hotels and resorts services' },
    'legal': { iconName: 'Gavel', title_ar: 'الاستشارات القانونية', title_en: 'Legal Consultations', desc_ar: 'الاستشارات والخدمات القانونية', desc_en: 'Legal consultations and services' },
    'contracts': { iconName: 'FileSignature', title_ar: 'العقود والاتفاقيات', title_en: 'Contracts & Agreements', desc_ar: 'إعداد ومراجعة العقود والاتفاقيات', desc_en: 'Contract and agreement preparation and review' },
    'hr': { iconName: 'UserCog', title_ar: 'الموارد البشرية', title_en: 'Human Resources', desc_ar: 'خدمات الموارد البشرية والتوظيف', desc_en: 'Human resources and employment services' },
    'admin': { iconName: 'Settings', title_ar: 'الشؤون الإدارية', title_en: 'Administrative Affairs', desc_ar: 'الخدمات الإدارية العامة', desc_en: 'General administrative services' },
};

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
    const { language } = useLanguage();
    const [service, setService] = useState<Service | null>(null);
    const [directorate, setDirectorate] = useState<Directorate | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCategory, setIsCategory] = useState(false);

    const slug = params.id;
    const categoryMeta = subCategoryMeta[slug];

    // Icon map for dynamic icon rendering - defined inside component
    const iconMap: Record<string, React.ElementType> = {
        Laptop,
        Server,
        RefreshCw,
        Truck,
        TrendingUp,
        FileSignature,
        FileCheck,
        Factory,
        Award,
        DollarSign,
        GraduationCap,
        Briefcase,
        BarChart,
        Map,
        Building2,
        FileText,
        Users,
        Shield,
        Hotel,
        Gavel,
        UserCog,
        Settings,
        ShieldAlert,
        Scale,
        HeartPulse,
        BookOpen,
        Zap,
        Droplets,
        Plane,
        Wifi,
        Banknote
    };

    useEffect(() => {
        const fetchData = async () => {
            // Check if this is a category slug
            if (categoryMeta) {
                setIsCategory(true);
                setLoading(false);
                return;
            }

            // Otherwise try to fetch as service ID
            try {
                const s = await API.services.getById(params.id);
                if (s) {
                    setService(s);
                    const d = await API.directorates.getById(s.directorateId);
                    setDirectorate(d);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params.id, categoryMeta]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
                <Navbar />
                <main className="flex-grow pt-20 md:pt-24">
                    {/* Hero Section Skeleton */}
                    <div className="bg-gov-forest text-white py-10 md:py-16 px-4">
                        <div className="max-w-5xl mx-auto">
                            <div className="inline-flex items-center gap-2 mb-6 md:mb-8">
                                <div className="w-5 h-5 rounded-full bg-white/10 animate-pulse" />
                                <div className="h-5 w-40 bg-white/10 rounded animate-pulse" />
                            </div>

                            <div className="flex flex-col md:flex-row items-start gap-8 relative">
                                <div className="absolute top-0 ltr:right-0 rtl:left-0 z-10">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 animate-pulse" />
                                </div>
                                <div className="w-24 h-24 rounded-3xl bg-white/10 animate-pulse" />
                                <div className="flex-1 space-y-4">
                                    <div className="h-6 w-32 bg-white/10 rounded-full animate-pulse" />
                                    <div className="h-12 md:h-16 w-3/4 bg-white/10 rounded-xl animate-pulse" />
                                    <div className="h-6 w-full bg-white/10 rounded animate-pulse" />
                                    <div className="h-6 w-1/2 bg-white/10 rounded animate-pulse" />
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="h-10 w-32 bg-white/10 rounded-2xl animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section Skeleton */}
                    <div className="max-w-5xl mx-auto px-4 py-10 md:py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                            {/* Main Info Skeleton */}
                            <div className="lg:col-span-2 space-y-8 md:space-y-12">
                                {/* About Service */}
                                <section>
                                    <div className="h-8 w-40 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse mb-6" />
                                    <div className="space-y-3">
                                        <SkeletonText lines={4} />
                                        <div className="h-4 w-full bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
                                        <div className="h-4 w-4/5 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
                                    </div>
                                </section>

                                {/* Requirements */}
                                <section>
                                    <div className="h-8 w-48 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse mb-6" />
                                    <div className="space-y-4">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="flex items-start gap-3 p-4 bg-white dark:bg-gov-card/10 rounded-2xl border border-gray-100 dark:border-gov-border/15">
                                                <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse mt-1" />
                                                <div className="h-4 flex-1 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Steps */}
                                <section>
                                    <div className="h-8 w-48 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse mb-6" />
                                    <div className="space-y-4">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-5 w-32 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse" />
                                                    <div className="h-4 w-full bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Sidebar Skeleton */}
                            <div className="space-y-6">
                                {/* Service Info Card */}
                                <div className="bg-white dark:bg-gov-card/10 p-6 rounded-3xl border border-gray-100 dark:border-gov-border/15">
                                    <div className="h-6 w-32 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse mb-6" />
                                    <div className="space-y-6">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="flex justify-between items-center pb-4 border-b border-gray-50 dark:border-white/5">
                                                <div className="h-4 w-24 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
                                                <div className="h-4 w-20 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Support Card */}
                                <div className="bg-gov-teal/5 dark:bg-gov-gold/5 p-6 rounded-3xl border border-gov-teal/10 dark:border-gov-border/15">
                                    <div className="h-6 w-24 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse mb-4" />
                                    <div className="h-4 w-full bg-gray-200 dark:bg-white/5 rounded animate-pulse mb-2" />
                                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
                                    <div className="mt-4 h-8 w-32 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Render category page
    if (isCategory && categoryMeta) {
        const IconComponent = iconMap[categoryMeta.iconName] || Laptop;
        return (
            <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
                <Navbar />
                <main className="flex-grow pt-20 md:pt-24">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-br from-gov-forest via-gov-emerald to-gov-teal text-white py-16 md:py-24 px-4 relative overflow-hidden">
                        {/* Dynamic Background */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                            <div className="absolute top-0 right-0 w-96 h-96 bg-gov-gold/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gov-teal/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                        </div>

                        <div className="max-w-6xl mx-auto relative z-10">
                            <Link
                                href="/services"
                                className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-gov-gold group-hover:text-gov-forest transition-all">
                                    {language === 'ar' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                                </div>
                                <span className="font-medium">{language === 'ar' ? 'العودة لدليل الخدمات' : 'Back to Services Guide'}</span>
                            </Link>

                            <div className="flex flex-col md:flex-row items-center gap-10">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gov-gold/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md flex items-center justify-center text-gov-gold border border-white/20 shadow-2xl relative z-10 group-hover:border-gov-gold/50 transition-all duration-500">
                                        <IconComponent className="filter drop-shadow-lg w-10 h-10 md:w-[60px] md:h-[60px]" />
                                    </div>
                                </div>
                                <div className="flex-1 text-center md:text-right">
                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gov-gold">
                                        {language === 'ar' ? categoryMeta.title_ar : categoryMeta.title_en}
                                    </h1>
                                    <p className="text-white/80 text-xl max-w-3xl leading-relaxed font-light">
                                        {language === 'ar' ? categoryMeta.desc_ar : categoryMeta.desc_en}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Services in this category */}
                    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
                        <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10">
                            <div className="w-1.5 h-8 md:h-10 bg-gradient-to-b from-gov-gold to-gov-orange rounded-full"></div>
                            <h2 className="text-2xl md:text-3xl font-display font-bold text-gov-forest dark:text-white">
                                {language === 'ar' ? 'الخدمات المتوفرة' : 'Available Services'}
                            </h2>
                        </div>

                        <div className="text-center py-12">
                            <p className="text-gray-600 dark:text-white/70 text-lg">
                                {language === 'ar'
                                    ? 'للمزيد من المعلومات حول الخدمات المتاحة في هذه الفئة، يرجى التواصل مع الجهة المختصة.'
                                    : 'For more information about available services in this category, please contact the relevant authority.'}
                            </p>
                        </div>

                        {/* Contact Section */}
                        <div className="mt-12 md:mt-20 bg-gradient-to-r from-gov-forest to-gov-emerald dark:from-gov-gold/10 dark:to-gov-forest/10 p-1 rounded-2xl md:rounded-3xl shadow-2xl">
                            <div className="bg-white dark:bg-dm-surface p-6 md:p-10 rounded-[20px] md:rounded-[22px] backdrop-blur-sm">
                                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gov-gold/10 flex items-center justify-center shrink-0 border border-gov-gold/30 relative">
                                        <div className="absolute inset-0 bg-gov-gold/20 rounded-full blur-xl animate-pulse"></div>
                                        <Shield className="text-gov-gold relative z-10 w-8 h-8 md:w-10 md:h-10" />
                                    </div>
                                    <div className="flex-1 text-center md:text-right">
                                        <h3 className="text-xl md:text-2xl font-bold text-gov-forest dark:text-white mb-2 md:mb-3">
                                            {language === 'ar' ? 'هل تحتاج إلى مساعدة إضافية؟' : 'Need Additional Assistance?'}
                                        </h3>
                                        <p className="text-gray-600 dark:text-white/70 text-lg">
                                            {language === 'ar'
                                                ? 'فريق الدعم الفني جاهز لمساعدتك في أي وقت. لا تتردد في التواصل معنا.'
                                                : "Our technical support team is ready to assist you at any time. Don't hesitate to contact us."}
                                        </p>
                                    </div>
                                    <Link
                                        href="/complaints"
                                        className="px-8 py-4 bg-gov-teal hover:bg-gov-emerald text-white font-bold rounded-xl transition-all shadow-lg shadow-gov-teal/30 hover:-translate-y-1 transform duration-300"
                                    >
                                        {language === 'ar' ? 'تواصل مع الدعم' : 'Contact Support'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Render specific service page
    if (!service) {
        return (
            <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center p-12 text-center">
                    <h1 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-4">
                        {language === 'ar' ? 'الخدمة غير موجودة' : 'Service Not Found'}
                    </h1>
                    <Link href="/services" className="text-gov-teal dark:text-gov-gold font-bold hover:underline">
                        {language === 'ar' ? 'العودة لدليل الخدمات' : 'Back to Services Guide'}
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
            <Navbar />
            <main className="flex-grow pt-20 md:pt-24">
                <div className="bg-gov-forest text-white py-10 md:py-16 px-4">
                    <div className="max-w-5xl mx-auto">
                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 md:mb-8 transition-colors"
                        >
                            {language === 'ar' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                            {language === 'ar' ? 'العودة لدليل الخدمات' : 'Back to Services Guide'}
                        </Link>

                        <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
                            <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-gov-gold border border-white/20">
                                {(() => {
                                    const DirectorateIcon = directorate ? (iconMap[directorate.icon] || Building) : Building;
                                    return <DirectorateIcon className="w-8 h-8 md:w-10 md:h-10" />;
                                })()}
                            </div>
                            <div className="flex-1">
                                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold mb-4 inline-block">
                                    {directorate ? getLocalizedField(directorate, 'name', language as 'ar' | 'en') : ''}
                                </span>
                                <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                                    {getLocalizedField(service, 'title', language as 'ar' | 'en')}
                                </h1>
                                <p className="text-white/80 text-base md:text-lg max-w-3xl leading-relaxed">
                                    {getLocalizedField(service, 'content', language as 'ar' | 'en') || getLocalizedField(service, 'description', language as 'ar' | 'en')}
                                </p>
                            </div>
                            <div className="flex flex-row md:flex-col items-center gap-3 text-center shrink-0 w-full md:w-auto mt-4 md:mt-0 justify-between md:justify-start">
                                <FavoriteButton
                                    contentType="service"
                                    contentId={String(service.id)}
                                    size={24}
                                    variant="default"
                                    metadata={{
                                        title: getLocalizedField(service, 'title', language as 'ar' | 'en'),
                                        description: getLocalizedField(service, 'description', language as 'ar' | 'en'),
                                        url: `/services/${service.id}`
                                    }}
                                />
                                {service.isDigital ? (
                                    <div className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-2xl text-green-400 font-bold flex items-center gap-2">
                                        <Monitor size={20} />
                                        {language === 'ar' ? 'خدمة ' : 'Service'}
                                    </div>
                                ) : (
                                    <div className="px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-2xl text-orange-400 font-bold flex items-center gap-2">
                                        <Building size={20} />
                                        {language === 'ar' ? 'خدمة حضورية' : 'In-Person Service'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 py-10 md:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-8 md:space-y-12">
                            <section>
                                <h2 className="text-2xl font-display font-bold text-gov-forest dark:text-white mb-6 border-r-4 border-gov-gold pr-4">
                                    {language === 'ar' ? 'حول الخدمة' : 'About the Service'}
                                </h2>
                                <p className="text-gray-600 dark:text-white/70 leading-relaxed text-lg">
                                    {language === 'ar'
                                        ? "هذه الخدمة تتيح للمواطنين والمقيمين إنجاز المعاملات المتعلقة بوزارة الاقتصاد والصناعة بكفاءة عالية. تهدف الوزارة من خلال توفير هذه الخدمات إلكترونياً إلى تبسيط الإجراءات وتقليل الوقت والجهد المطلوبين."
                                        : "This service allows citizens and residents to complete transactions related to the Ministry of Economy and Industry efficiently. The Ministry aims to simplify procedures and reduce the time and effort required by providing these services electronically."}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-display font-bold text-gov-forest dark:text-white mb-6 border-r-4 border-gov-gold pr-4">
                                    {language === 'ar' ? 'المتطلبات والوثائق' : 'Requirements & Documents'}
                                </h2>
                                <div className="space-y-4">
                                    {(service.requirements && service.requirements.length > 0 ? service.requirements : [
                                        language === 'ar' ? "الهوية الشخصية السورية أو جواز السفر الساري المفعول" : "Syrian National ID or valid Passport",
                                        language === 'ar' ? "صور شخصية حديثة ملونة عدد (2)" : "Recent color personal photos (2)",
                                        language === 'ar' ? "طلبات التقديم المعبأة مسبقاً (إن وجدت)" : "Pre-filled application forms (if any)",
                                        language === 'ar' ? "دفع الرسوم المقررة" : "Payment of designated fees"
                                    ]).map((req, i) => (
                                        <div key={i} className="flex items-start gap-3 p-4 bg-white dark:bg-gov-card/10 rounded-2xl border border-gray-100 dark:border-gov-border/15">
                                            <CheckCircle className="text-green-500 mt-1" size={18} />
                                            <span className="text-gray-700 dark:text-white/70">{req}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gov-card/10 p-6 rounded-3xl border border-gray-100 dark:border-gov-border/15">
                                <h3 className="font-bold text-gov-forest dark:text-white mb-6 flex items-center gap-2">
                                    <FileText size={20} className="text-gov-teal" />
                                    {language === 'ar' ? 'بيانات الخدمة' : 'Service Info'}
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-50 dark:border-white/5">
                                        <span className="text-sm text-gray-500">{language === 'ar' ? 'الوقت المتوقع' : 'Est. Time'}</span>
                                        <span className="font-bold text-gov-charcoal dark:text-white flex items-center gap-1">
                                            <Clock size={14} className="text-gov-teal" />
                                            {service.estimated_time || (language === 'ar' ? 'غير محدد' : 'Not specified')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-50 dark:border-white/5">
                                        <span className="text-sm text-gray-500">{language === 'ar' ? 'الرسوم' : 'Fees'}</span>
                                        <span className="font-bold text-gov-charcoal dark:text-white">
                                            {service.fees || (language === 'ar' ? 'مجانية' : 'Free')}
                                        </span>
                                    </div>
                                </div>

                            </div>

                            <div className="bg-gov-teal/5 dark:bg-gov-gold/5 p-6 rounded-3xl border border-gov-teal/10 dark:border-gov-border/15">
                                <h3 className="font-bold text-gov-forest dark:text-white mb-4 flex items-center gap-2">
                                    <ShieldAlert size={20} className="text-gov-gold" />
                                    {language === 'ar' ? 'مساعدة' : 'Support'}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-white/70 mb-4">
                                    {language === 'ar'
                                        ? "إذا واجهت أي مشكلة أثناء التقديم، يرجى التواصل مع فريق الدعم الفني."
                                        : "If you encounter any issues during application, please contact our technical support team."}
                                </p>
                                <Link
                                    href="/complaints"
                                    className="text-gov-teal dark:text-gov-gold font-bold text-sm hover:underline"
                                >
                                    {language === 'ar' ? 'تقديم بلاغ عن مشكلة' : 'Report an Issue'}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
