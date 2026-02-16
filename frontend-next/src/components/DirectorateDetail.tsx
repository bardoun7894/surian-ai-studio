'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    MapPin,
    Phone,
    Mail,
    Globe,
    FileCheck,
    Building2,
    Loader2,
    ExternalLink,
    ChevronLeft,
    Clock,
    Users
} from 'lucide-react';
import { API } from '@/lib/repository';
import { Directorate, Service, LocalizedString } from '@/types';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import DirectorateStructure from '@/components/DirectorateStructure';
import ContentFilter from '@/components/ContentFilter';
import { Filter } from 'lucide-react';
import ScrollAnimation from '@/components/ui/ScrollAnimation';
import DirectorateHero from '@/components/DirectorateHero';
import DirectorateNewsGrid from '@/components/DirectorateNewsGrid';
import QuickLinks from '@/components/QuickLinks';
import HomeComplaintsSection from '@/components/HomeComplaintsSection';
import HomeSuggestionsSection from '@/components/HomeSuggestionsSection';

interface DirectorateDetailProps {
    directorateId: string;
}

const DirectorateDetail: React.FC<DirectorateDetailProps> = ({ directorateId }) => {
    const { t, language } = useLanguage();
    const [directorate, setDirectorate] = useState<Directorate | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    // Filtering state
    const [searchQuery, setSearchQuery] = useState('');
    const [serviceTypeFilter, setServiceTypeFilter] = useState<'all' | 'digital' | 'manual'>('all');

    const loc = (obj: any, field: string): string => {
        const val = obj?.[field];
        if (val && typeof val === 'object' && ('ar' in val || 'en' in val)) {
            // Check for explicit key presence rather than truthiness to handle empty strings
            if (language in val && val[language] !== undefined && val[language] !== null && val[language] !== '') {
                return val[language];
            }
            return val['ar'] || '';
        }
        const ar = obj?.[`${field}_ar`] || (typeof val === 'string' ? val : '') || '';
        const en = obj?.[`${field}_en`] || '';
        // In English mode: prefer en, then fall back to ar only if en is empty
        return language === 'en' && en ? en : ar;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dir, servs] = await Promise.all([
                    API.directorates.getById(directorateId),
                    API.directorates.getServicesByDirectorate(directorateId),
                ]);
                setDirectorate(dir);
                setServices(servs);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [directorateId]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-gov-teal" size={40} />
        </div>
    );

    if (!directorate) return (
        <div className="p-20 text-center text-gov-charcoal dark:text-white">
            {language === 'ar' ? 'لم يتم العثور على الجهة' : 'Directorate not found'}
        </div>
    );

    const filteredServices = services.filter(service => {
        const matchesSearch = searchQuery === '' ||
            loc(service, 'title').toLowerCase().includes(searchQuery.toLowerCase()) ||
            loc(service, 'description').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = serviceTypeFilter === 'all' ||
            (serviceTypeFilter === 'digital' && service.isDigital) ||
            (serviceTypeFilter === 'manual' && !service.isDigital);

        return matchesSearch && matchesType;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dm-bg">
            {/* Hero Section - Like Homepage */}
            <DirectorateHero
                directorate={directorate}
                hasSubDirectorates={!!directorate.subDirectorates?.length}
            />

            {/* News & Announcements Grid - Like Homepage HeroGrid */}
            <DirectorateNewsGrid
                directorateId={directorateId}
                directorateName={loc(directorate, 'name')}
            />

            {/* Services Section */}
            <section id="services" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <ScrollAnimation>
                    <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-sm border border-gray-100 dark:border-gov-border/15 overflow-hidden">
                        {/* Section Header */}
                        <div className="p-8 border-b border-gray-100 dark:border-gov-border/15">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gov-charcoal dark:text-white flex items-center gap-2">
                                        <FileCheck className="text-gov-forest dark:text-gov-teal" />
                                        {t('directorate_services')}
                                    </h2>
                                    <p className="text-gray-500 dark:text-white/60 mt-1">
                                        {language === 'ar'
                                            ? 'جميع الخدمات المقدمة من هذه الإدارة'
                                            : 'All services provided by this directorate'
                                        }
                                    </p>
                                </div>

                                {/* Filter */}
                                <div className="flex items-center gap-2">
                                    <ContentFilter
                                        onSearch={setSearchQuery}
                                        searchValue={searchQuery}
                                        totalCount={filteredServices.length}
                                        countLabel={language === 'ar' ? 'خدمة' : 'services'}
                                        className="mb-0"
                                        extraFilters={
                                            <div className="relative">
                                                <select
                                                    value={serviceTypeFilter}
                                                    onChange={(e) => setServiceTypeFilter(e.target.value as any)}
                                                    className="appearance-none bg-white dark:bg-dm-surface border border-gray-200 dark:border-gov-border/25 rounded-xl py-2 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-gov-charcoal dark:text-gov-gold font-medium focus:outline-none focus:border-gov-gold transition-colors cursor-pointer h-[42px]"
                                                >
                                                    <option value="all">{language === 'ar' ? 'جميع الخدمات' : 'All Services'}</option>
                                                    <option value="digital">{language === 'ar' ? 'إلكترونية' : 'Digital'}</option>
                                                    <option value="manual">{language === 'ar' ? 'ورقية' : 'Manual'}</option>
                                                </select>
                                                <Filter className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                            </div>
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Services Grid */}
                        <div className="p-8">
                            {filteredServices.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredServices.map(service => (
                                        <Link
                                            key={service.id}
                                            href={`/services/${service.id}`}
                                            className="group p-5 rounded-xl border border-gray-100 dark:border-gov-border/15 hover:border-gov-forest dark:hover:border-gov-gold hover:shadow-lg transition-all bg-gray-50 dark:bg-gov-card/10"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className={`px-2 py-1 rounded-full text-xs font-bold ${service.isDigital
                                                        ? 'bg-gov-teal/10 text-gov-teal dark:bg-gov-teal/20'
                                                        : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                                    }`}>
                                                    {service.isDigital
                                                        ? (language === 'ar' ? 'إلكترونية' : 'Digital')
                                                        : (language === 'ar' ? 'ورقية' : 'Manual')
                                                    }
                                                </div>
                                                <ExternalLink size={16} className="text-gray-300 dark:text-white/30 group-hover:text-gov-forest dark:group-hover:text-gov-gold transition-colors" />
                                            </div>
                                            <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-gov-forest dark:group-hover:text-gov-gold transition-colors mb-2">
                                                {loc(service, 'title')}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-white/60 line-clamp-2">
                                                {loc(service, 'description')}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400 dark:text-white/50">
                                    <FileCheck className="mx-auto mb-4 opacity-30" size={48} />
                                    <p>{services.length > 0
                                        ? (language === 'ar' ? 'لا توجد نتائج تطابق بحثك' : 'No results match your search')
                                        : t('directorate_no_services')
                                    }</p>
                                </div>
                            )}
                        </div>
                    </div>
                </ScrollAnimation>
            </section>

            {/* Sub-Directorates Section */}
            {directorate.subDirectorates && directorate.subDirectorates.length > 0 && (
                <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <ScrollAnimation>
                        <div className="bg-gradient-to-br from-gov-forest to-gov-emerald dark:from-gov-brand dark:to-gov-forest rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                            <Building2 className="text-gov-gold" size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">
                                                {language === 'ar' ? 'المديريات التابعة' : 'Sub-Directorates'}
                                            </h2>
                                            <p className="text-white/60 text-sm">
                                                {language === 'ar'
                                                    ? `${directorate.subDirectorates.length} مديرية`
                                                    : `${directorate.subDirectorates.length} Sub-Directorates`
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/directorates/${directorateId}/sub-directorates`}
                                        className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors font-bold text-sm flex items-center gap-2"
                                    >
                                        {language === 'ar' ? 'عرض الكل' : 'View All'}
                                        <ChevronLeft size={16} className="rtl:rotate-180" />
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {directorate.subDirectorates.slice(0, 6).map((sub: any) => {
                                        const isExternal = sub.is_external || sub.isExternal;
                                        const subName = loc(sub, 'name');
                                        const href = isExternal ? sub.url : `/directorates/${directorate.id}/${sub.id}`;
                                        return (
                                            <Link
                                                key={sub.id}
                                                href={href}
                                                target={isExternal ? '_blank' : undefined}
                                                rel={isExternal ? 'noopener noreferrer' : undefined}
                                                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
                                            >
                                                <Building2 size={18} className="text-gov-gold flex-shrink-0" />
                                                <span className="text-sm font-bold text-white flex-1">
                                                    {subName}
                                                </span>
                                                {isExternal && (
                                                    <ExternalLink size={14} className="text-white/50" />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </ScrollAnimation>
                </section>
            )}

            {/* Quick Links Section */}
            <ScrollAnimation>
                <div className="bg-white dark:bg-dm-surface">
                    <QuickLinks section="directorate" />
                </div>
            </ScrollAnimation>

            {/* Complaints Section */}
            <ScrollAnimation>
                <HomeComplaintsSection />
            </ScrollAnimation>

            {/* Suggestions Section */}
            <ScrollAnimation>
                <HomeSuggestionsSection />
            </ScrollAnimation>

            {/* Team Structure */}
            {directorate.team && directorate.team.length > 0 && (
                <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <ScrollAnimation>
                        <DirectorateStructure team={directorate.team} directorate={directorate} />
                    </ScrollAnimation>
                </section>
            )}

            {/* Contact & Working Hours — Horizontal Layout */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <ScrollAnimation>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Info Card */}
                        <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-sm border border-gray-100 dark:border-gov-border/15 p-6">
                            <h3 className="font-bold text-gov-charcoal dark:text-white mb-5 flex items-center gap-2">
                                <Users className="text-gov-forest dark:text-gov-teal" size={20} />
                                {t('directorate_contact')}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-white/70">
                                    <MapPin className="shrink-0 text-gov-forest dark:text-gov-teal mt-0.5" size={18} />
                                    <span>{loc(directorate, 'address') || (directorate as any).contact?.address || t('directorate_address')}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-white/70">
                                    <Phone className="shrink-0 text-gov-forest dark:text-gov-teal" size={18} />
                                    <a href={`tel:${((directorate as any).phone || (directorate as any).contact?.phone || t('directorate_phone')).replace(/[^\d+]/g, '')}`} className="hover:text-gov-forest dark:hover:text-gov-gold dir-ltr transition-colors">
                                        {(directorate as any).phone || (directorate as any).contact?.phone || t('directorate_phone')}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-white/70">
                                    <Mail className="shrink-0 text-gov-forest dark:text-gov-teal" size={18} />
                                    <a href={`mailto:${(directorate as any).email || (directorate as any).contact?.email || t('directorate_email')}`} className="hover:text-gov-forest dark:hover:text-gov-gold transition-colors">
                                        {(directorate as any).email || (directorate as any).contact?.email || t('directorate_email')}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-white/70">
                                    <Globe className="shrink-0 text-gov-forest dark:text-gov-teal" size={18} />
                                    {((directorate as any).website || (directorate as any).contact?.website) ? (
                                        <a
                                            href={(directorate as any).website || (directorate as any).contact?.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-gov-forest dark:hover:text-gov-gold underline"
                                        >
                                            {(directorate as any).website || (directorate as any).contact?.website}
                                        </a>
                                    ) : (
                                        <span>{t('directorate_website')}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Working Hours Card */}
                        <div className="bg-gov-forest text-white rounded-2xl shadow-lg p-6 relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            <h3 className="font-bold mb-5 relative z-10 flex items-center gap-2">
                                <Clock size={20} />
                                {t('directorate_hours')}
                            </h3>
                            <div className="space-y-3 text-sm relative z-10">
                                <div className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3">
                                    <span className="font-medium">{t('directorate_hours_sun_thu')}</span>
                                    <span className="font-bold text-gov-gold">{t('directorate_hours_value')}</span>
                                </div>
                                <div className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3">
                                    <span className="font-medium">{t('directorate_fri_sat')}</span>
                                    <span className="font-bold text-red-300">{t('directorate_holiday')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollAnimation>
            </section>
        </div>
    );
};

export default DirectorateDetail;
