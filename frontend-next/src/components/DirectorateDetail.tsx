'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    ArrowRight,
    MapPin,
    Phone,
    Mail,
    Globe,
    FileCheck,
    Newspaper,
    ExternalLink,
    ShieldAlert,
    ShieldCheck,
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
    Landmark,
    Loader2,
    Building2,
    TrendingUp,
    ChevronLeft
} from 'lucide-react';
import { API } from '@/lib/repository';
import { Directorate, Service, NewsItem, LocalizedString } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

interface DirectorateDetailProps {
    directorateId: string;
}

const DirectorateDetail: React.FC<DirectorateDetailProps> = ({ directorateId }) => {
    const { t, language } = useLanguage();
    const [directorate, setDirectorate] = useState<Directorate | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const getLocalized = (content: LocalizedString | string | undefined | null): string => {
        if (!content) return '';
        if (typeof content === 'string') return content;
        return content[language as 'ar' | 'en'] || '';
    };

    // Helper to get localized field - handles LocalizedString objects AND _ar/_en suffixed fields
    const loc = (obj: any, field: string): string => {
        const val = obj?.[field];
        if (val && typeof val === 'object' && ('ar' in val || 'en' in val)) {
            return val[language] || val['ar'] || '';
        }
        const ar = obj?.[`${field}_ar`] || (typeof val === 'string' ? val : '') || '';
        const en = obj?.[`${field}_en`] || ar;
        return language === 'ar' ? ar : en;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dir, servs, news] = await Promise.all([
                    API.directorates.getById(directorateId),
                    API.directorates.getServicesByDirectorate(directorateId),
                    API.directorates.getNewsByDirectorate(directorateId) // FR-11: News per directorate
                ]);
                setDirectorate(dir);
                setServices(servs);
                setRelatedNews(news);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [directorateId]);

    // Icon mapping helper
    const getIcon = (iconName: string) => {
        const props = { size: 40 };
        switch (iconName) {
            case 'ShieldAlert': return <ShieldAlert {...props} />;
            case 'ShieldCheck': return <ShieldCheck {...props} />;
            case 'Scale': return <Scale {...props} />;
            case 'HeartPulse': return <HeartPulse {...props} />;
            case 'BookOpen': return <BookOpen {...props} />;
            case 'GraduationCap': return <GraduationCap {...props} />;
            case 'Zap': return <Zap {...props} />;
            case 'Droplets': return <Droplets {...props} />;
            case 'Plane': return <Plane {...props} />;
            case 'Wifi': return <Wifi {...props} />;
            case 'Banknote': return <Banknote {...props} />;
            case 'Map': return <Map {...props} />;
            case 'Factory': return <Factory {...props} />;
            case 'TrendingUp': return <TrendingUp {...props} />;
            default: return <Landmark {...props} />;
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-gov-teal" size={40} /></div>;
    if (!directorate) return (
        <div className="p-20 text-center text-gov-charcoal dark:text-white">
            {language === 'ar' ? 'لم يتم العثور على الجهة' : 'Directorate not found'}
        </div>
    );

    return (
        <div className="animate-fade-in min-h-screen bg-gray-50 dark:bg-dm-bg pb-20 pt-24 md:pt-28">

            {/* Hero Header */}
            <div className="bg-gov-forest text-white pt-12 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-gray-300 text-sm mb-6">
                        <Link href="/" className="hover:text-gov-gold transition-colors">
                            {language === 'ar' ? 'الرئيسية' : 'Home'}
                        </Link>
                        <ChevronLeft size={16} className="rtl:rotate-180" />
                        <Link href="/directorates" className="hover:text-gov-gold transition-colors">
                            {language === 'ar' ? 'الإدارات' : 'Directorates'}
                        </Link>
                        <ChevronLeft size={16} className="rtl:rotate-180" />
                        <span className="text-gov-gold">
                            {loc(directorate, 'name')}
                        </span>
                    </div>

                    <div className="flex flex-col md:flex-row items-start gap-8">
                        <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-gov-gold border border-white/20 shadow-2xl">
                            {getIcon(directorate.icon)}
                        </div>
                        <div>
                            <p className="text-sm text-gov-gold/90 font-bold mb-2">
                                {t('directorate_subtitle')}
                            </p>
                            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
                                {loc(directorate, 'name')}
                            </h1>
                            <p className="text-lg text-white/80 max-w-3xl leading-relaxed">
                                {loc(directorate, 'description')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Services Section */}
                        <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-sm border border-gray-100 dark:border-gov-border/15 p-8">
                            <h2 className="text-xl font-bold text-gov-charcoal dark:text-white mb-6 flex items-center gap-2">
                                <FileCheck className="text-gov-forest dark:text-gov-teal" />
                                {t('directorate_services')}
                            </h2>

                            {services.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {services.map(service => (
                                        <div key={service.id} className="p-4 rounded-xl border border-gray-100 dark:border-gov-border/15 hover:border-gov-forest dark:hover:border-gov-gold hover:shadow-md transition-all group bg-gray-50 dark:bg-gov-card/10 cursor-pointer">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className={`w-2 h-2 rounded-full mt-1.5 ${service.isDigital ? 'bg-gov-teal' : 'bg-gray-300 dark:bg-dm-surface'}`}></div>
                                                <ExternalLink size={16} className="text-gray-300 dark:text-white/70 group-hover:text-gov-forest dark:group-hover:text-gov-gold transition-colors" />
                                            </div>
                                            <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-gov-forest dark:group-hover:text-gov-gold transition-colors">
                                                {loc(service, 'title')}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-white/70 mt-2">
                                                {service.isDigital ? t('directorate_digital') : t('directorate_in_person')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400 dark:text-white/50">
                                    {t('directorate_no_services')}
                                </div>
                            )}

                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gov-border/15 text-center">
                                <button className="text-gov-forest dark:text-gov-teal font-bold text-sm hover:underline">
                                    {t('directorate_paper_guide')}
                                </button>
                            </div>
                        </div>

                        {/* Sub-Directorates Section (FR-50) */}
                        {directorate.subDirectorates && directorate.subDirectorates.length > 0 && (
                            <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-sm border border-gray-100 dark:border-gov-border/15 p-8">
                                <h2 className="text-xl font-bold text-gov-charcoal dark:text-white mb-6 flex items-center gap-2">
                                    <Building2 className="text-gov-forest dark:text-gov-teal" />
                                    {language === 'ar' ? 'المديريات التابعة' : 'Sub-Directorates'}
                                    <span className="text-sm font-normal text-gray-400 dark:text-white/50">
                                        ({directorate.subDirectorates.length})
                                    </span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {directorate.subDirectorates.map((sub: any) => {
                                        const isExternal = sub.is_external || sub.isExternal;
                                        const subName = loc(sub, 'name');
                                        const href = isExternal ? sub.url : `/directorates/${directorate.id}/sub-directorates`;
                                        return (
                                            <Link
                                                key={sub.id}
                                                href={href}
                                                target={isExternal ? '_blank' : undefined}
                                                rel={isExternal ? 'noopener noreferrer' : undefined}
                                                className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-gov-border/15 hover:border-gov-forest dark:hover:border-gov-gold hover:shadow-md transition-all group bg-gray-50 dark:bg-gov-card/10"
                                            >
                                                <Building2 size={18} className="text-gray-400 dark:text-white/50 group-hover:text-gov-forest dark:group-hover:text-gov-gold transition-colors flex-shrink-0" />
                                                <span className="text-sm font-bold text-gray-700 dark:text-white group-hover:text-gov-forest dark:group-hover:text-gov-gold transition-colors flex-1">
                                                    {subName}
                                                </span>
                                                {isExternal && (
                                                    <ExternalLink size={14} className="text-gray-400 dark:text-white/50 flex-shrink-0" />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* News Section for this Ministry (FR-11) */}
                        <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-sm border border-gray-100 dark:border-gov-border/15 p-8">
                            <h2 className="text-xl font-bold text-gov-charcoal dark:text-white mb-6 flex items-center gap-2">
                                <Newspaper className="text-gov-forest dark:text-gov-teal" />
                                {t('directorate_news')}
                            </h2>
                            {relatedNews.length > 0 ? (
                                <div className="space-y-6">
                                    {relatedNews.map(news => (
                                        <Link key={news.id} href={`/news/${news.id}`} className="flex gap-4 group cursor-pointer">
                                            <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gov-card/10">
                                                {news.imageUrl ? (
                                                    <Image src={news.imageUrl} alt={news.title} width={96} height={96} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Newspaper className="text-gray-300 dark:text-white/50" size={32} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <span className="text-xs text-gov-forest dark:text-gov-teal font-bold mb-1 block">
                                                    {news.category || (language === 'ar' ? 'أخبار' : 'News')}
                                                </span>
                                                <h3 className="font-bold text-gray-800 dark:text-white mb-2 leading-tight group-hover:text-gov-forest dark:group-hover:text-gov-gold transition-colors">
                                                    {loc(news, 'title')}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-white/70 line-clamp-2">
                                                    {loc(news, 'summary')}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400 dark:text-white/50">
                                    <Newspaper className="mx-auto mb-2 opacity-30" size={32} />
                                    <p>{language === 'ar' ? 'لا توجد أخبار متعلقة بهذه الإدارة حالياً' : 'No related news currently available'}</p>
                                </div>
                            )}
                            {relatedNews.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gov-border/15 text-center">
                                    <Link href="/news" className="text-gov-forest dark:text-gov-teal font-bold text-sm hover:underline">
                                        {language === 'ar' ? 'عرض جميع الأخبار' : 'View All News'}
                                    </Link>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">

                        {/* Contact Card */}
                        <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-sm border border-gray-100 dark:border-gov-border/15 p-6">
                            <h3 className="font-bold text-gov-charcoal dark:text-white mb-6 border-b border-gray-100 dark:border-gov-border/15 pb-2">
                                {t('directorate_contact')}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-white/70">
                                    <MapPin className="shrink-0 text-gov-forest dark:text-gov-teal" size={18} />
                                    <span>{t('directorate_address')}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-white/70">
                                    <Phone className="shrink-0 text-gov-forest dark:text-gov-teal" size={18} />
                                    <span dir="ltr">{t('directorate_phone')}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-white/70">
                                    <Mail className="shrink-0 text-gov-forest dark:text-gov-teal" size={18} />
                                    <span>{t('directorate_email')}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-white/70">
                                    <Globe className="shrink-0 text-gov-forest dark:text-gov-teal" size={18} />
                                    <a href="#" className="hover:text-gov-forest dark:hover:text-gov-gold underline">
                                        {t('directorate_website')}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Working Hours */}
                        <div className="bg-gov-forest text-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            <h3 className="font-bold mb-4 relative z-10">
                                {t('directorate_hours')}
                            </h3>
                            <div className="space-y-2 text-sm text-white/80 relative z-10">
                                <div className="flex justify-between">
                                    <span>{t('directorate_hours_sun_thu')}</span>
                                    <span>{t('directorate_hours_value')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{t('directorate_fri_sat')}</span>
                                    <span>{t('directorate_holiday')}</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    );
};

export default DirectorateDetail;
