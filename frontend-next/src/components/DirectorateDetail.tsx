'use client';

import React, { useState, useEffect } from 'react';
import {
    MapPin,
    Phone,
    Mail,
    Globe,
    Building2,
    Loader2,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    Clock,
    Users,
    Newspaper,
    Megaphone,
    Calendar,
    ArrowRight,
    ArrowLeft,
} from 'lucide-react';
import { API } from '@/lib/repository';
import { Directorate, NewsItem, FAQ } from '@/types';
import { Announcement } from '@/lib/repository';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollAnimation from '@/components/ui/ScrollAnimation';
import DirectorateHero from '@/components/DirectorateHero';
import QuickLinks from '@/components/QuickLinks';
import HomeComplaintsSection from '@/components/HomeComplaintsSection';
import HomeSuggestionsSection from '@/components/HomeSuggestionsSection';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/ContactSection';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRelativeTime, getLocalizedField } from '@/lib/utils';

interface DirectorateDetailProps {
    directorateId: string;
}

const DirectorateDetail: React.FC<DirectorateDetailProps> = ({ directorateId }) => {
    const { t, language } = useLanguage();
    const isAr = language === 'ar';
    const [directorate, setDirectorate] = useState<Directorate | null>(null);
    const [loading, setLoading] = useState(true);
    const [ministryContact, setMinistryContact] = useState<Record<string, string>>({});

    // News & Announcements
    const [news, setNews] = useState<NewsItem[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [contentLoading, setContentLoading] = useState(true);

    const loc = (obj: any, field: string): string => {
        const val = obj?.[field];
        if (val && typeof val === 'object' && ('ar' in val || 'en' in val)) {
            if (language in val && val[language] !== undefined && val[language] !== null && val[language] !== '') {
                return val[language];
            }
            return val['ar'] || '';
        }
        const ar = obj?.[`${field}_ar`] || (typeof val === 'string' ? val : '') || '';
        const en = obj?.[`${field}_en`] || '';
        return language === 'en' && en ? en : ar;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dir, contactSettings] = await Promise.all([
                    API.directorates.getById(directorateId),
                    API.settings.getByGroup('contact'),
                ]);
                setDirectorate(dir);
                setMinistryContact((contactSettings ?? {}) as Record<string, string>);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [directorateId]);

    // Fetch news & announcements
    useEffect(() => {
        const fetchContent = async () => {
            try {
                setContentLoading(true);
                const [newsData, announcementsData] = await Promise.all([
                    API.directorates.getNewsByDirectorate(directorateId),
                    API.announcements.getByDirectorate(directorateId).catch(() => []),
                ]);
                setNews(newsData);
                setAnnouncements(announcementsData);
            } catch (e) {
                console.error('Failed to load directorate content', e);
            } finally {
                setContentLoading(false);
            }
        };
        fetchContent();
    }, [directorateId]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-gov-teal" size={40} />
        </div>
    );

    if (!directorate) return (
        <div className="p-20 text-center text-gov-charcoal dark:text-white">
            {isAr ? 'لم يتم العثور على الجهة' : 'Directorate not found'}
        </div>
    );

    const subDirectoratesCount = Array.isArray(directorate.subDirectorates)
        ? directorate.subDirectorates.length
        : Number((directorate as any).subDirectoratesCount ?? (directorate as any).sub_directorates_count) || 0;

    // Contact info resolution
    const contactAddress = loc(directorate, 'address')
        || (directorate as any).contact?.address
        || (isAr
            ? (ministryContact.contact_address_ar || t('directorate_address'))
            : (ministryContact.contact_address_en || t('directorate_address')));
    const contactPhone = directorate.phone
        || (directorate as any).contact?.phone
        || ministryContact.contact_phone
        || t('directorate_phone');
    const contactEmail = directorate.email
        || (directorate as any).contact?.email
        || ministryContact.contact_email
        || t('directorate_email');
    const contactWebsite = directorate.website
        || (directorate as any).contact?.website
        || '';
    const contactWorkingHours = (isAr
        ? (directorate.working_hours_ar || ministryContact.contact_working_hours_ar)
        : (directorate.working_hours_en || ministryContact.contact_working_hours_en))
        || '';

    const featuredNews = news.slice(0, 4);
    const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dm-bg">
            {/* ═══════════════════════════════════════════════════ */}
            {/* 1. HERO SECTION */}
            {/* ═══════════════════════════════════════════════════ */}
            <DirectorateHero
                directorate={{ ...directorate, servicesCount: 0 }}
                hasSubDirectorates={subDirectoratesCount > 0}
            />

            {/* ═══════════════════════════════════════════════════ */}
            {/* 2. SUB-DIRECTORATES */}
            {/* ═══════════════════════════════════════════════════ */}
            {directorate.subDirectorates && directorate.subDirectorates.length > 0 && (
                <section id="sub-directorates" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
                                                {isAr ? 'المديريات التابعة' : 'Sub-Directorates'}
                                            </h2>
                                            <p className="text-white/60 text-sm">
                                                {isAr
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
                                        {isAr ? 'عرض الكل' : 'View All'}
                                        {isAr ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
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

            {/* ═══════════════════════════════════════════════════ */}
            {/* 3. FEATURED NEWS (Last 4) */}
            {/* ═══════════════════════════════════════════════════ */}
            <section id="news" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <ScrollAnimation>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gov-forest/10 dark:bg-gov-gold/20 flex items-center justify-center">
                                <Newspaper className="text-gov-forest dark:text-gov-gold" size={20} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gov-charcoal dark:text-white">
                                    {isAr ? 'الأخبار الرئيسية' : 'Featured News'}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-white/60">
                                    {isAr ? 'آخر الأخبار المتعلقة بالإدارة' : 'Latest directorate news'}
                                </p>
                            </div>
                        </div>
                        <Link
                            href={`/news?directorate=${directorateId}`}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gov-forest/10 dark:bg-gov-gold/10 text-gov-forest dark:text-gov-gold font-bold text-sm hover:bg-gov-forest/20 dark:hover:bg-gov-gold/20 transition-colors"
                        >
                            {isAr ? 'عرض كل الأخبار' : 'View All News'}
                            <ArrowIcon size={16} />
                        </Link>
                    </div>

                    {contentLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white dark:bg-dm-surface rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gov-border/15">
                                    <div className="h-48 bg-gray-200 dark:bg-white/5 animate-pulse" />
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-3/4" />
                                        <div className="h-3 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
                                        <div className="h-3 bg-gray-200 dark:bg-white/5 rounded animate-pulse w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : featuredNews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredNews.map((item, idx) => {
                                const title = loc(item, 'title');
                                const excerpt = loc(item, 'excerpt') || loc(item, 'content');
                                const imageUrl = item.imageUrl || (item as any).image || (item as any).cover_image || (item as any).featured_image;
                                return (
                                    <Link
                                        key={item.id}
                                        href={`/news/${item.id}`}
                                        className="group bg-white dark:bg-dm-surface rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gov-border/15 hover:shadow-lg hover:border-gov-forest/30 dark:hover:border-gov-gold/30 transition-all"
                                    >
                                        <div className="relative h-48 bg-gray-100 dark:bg-white/5 overflow-hidden">
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Newspaper size={40} className="text-gray-300 dark:text-white/20" />
                                                </div>
                                            )}
                                            {idx === 0 && (
                                                <div className="absolute top-3 start-3 px-2 py-1 rounded-full bg-gov-gold text-white text-xs font-bold">
                                                    {isAr ? 'خبر رئيسي' : 'Featured'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-white/40 mb-2">
                                                <Calendar size={12} />
                                                <span>{item.date ? formatRelativeTime(item.date, language) : ''}</span>
                                            </div>
                                            <h3 className="font-bold text-gov-charcoal dark:text-white group-hover:text-gov-forest dark:group-hover:text-gov-gold transition-colors line-clamp-2 mb-2">
                                                {title}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-white/60 line-clamp-2">
                                                {excerpt}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400 dark:text-white/50">
                            <Newspaper className="mx-auto mb-4 opacity-30" size={48} />
                            <p>{isAr ? 'لا توجد أخبار حالياً' : 'No news available'}</p>
                        </div>
                    )}
                </ScrollAnimation>
            </section>

            {/* ═══════════════════════════════════════════════════ */}
            {/* 4. ANNOUNCEMENTS */}
            {/* ═══════════════════════════════════════════════════ */}
            <section id="announcements" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <ScrollAnimation>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gov-gold/10 flex items-center justify-center">
                                <Megaphone className="text-gov-gold" size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-gov-charcoal dark:text-white">
                                {isAr ? 'الإعلانات' : 'Announcements'}
                            </h2>
                        </div>
                        <Link
                            href={`/announcements?directorate=${directorateId}`}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gov-gold/10 text-gov-gold font-bold text-sm hover:bg-gov-gold/20 transition-colors"
                        >
                            {isAr ? 'عرض الكل' : 'View All'}
                            <ArrowIcon size={16} />
                        </Link>
                    </div>

                    {announcements.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {announcements.slice(0, 3).map((ann: any) => {
                                const annTitle = loc(ann, 'title');
                                const annContent = loc(ann, 'content') || loc(ann, 'description');
                                return (
                                    <Link
                                        key={ann.id}
                                        href={`/announcements/${ann.id}`}
                                        className="group bg-white dark:bg-dm-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gov-border/15 hover:shadow-lg hover:border-gov-gold/30 transition-all"
                                    >
                                        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-white/40 mb-3">
                                            <Calendar size={12} />
                                            <span>{ann.date ? formatRelativeTime(ann.date, language) : ''}</span>
                                        </div>
                                        <h3 className="font-bold text-gov-charcoal dark:text-white group-hover:text-gov-gold transition-colors mb-2 line-clamp-2">
                                            {annTitle}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-white/60 line-clamp-3">
                                            {annContent}
                                        </p>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white dark:bg-dm-surface rounded-2xl border border-gray-100 dark:border-gov-border/15">
                            <Megaphone className="mx-auto text-gov-gold/40 mb-3" size={40} />
                            <p className="text-gov-stone/60 dark:text-white/50">
                                {isAr ? 'لا توجد إعلانات حالياً' : 'No announcements at the moment'}
                            </p>
                        </div>
                    )}
                </ScrollAnimation>
            </section>

            {/* ═══════════════════════════════════════════════════ */}
            {/* 5. COMPLAINTS */}
            {/* ═══════════════════════════════════════════════════ */}
            <ScrollAnimation>
                <HomeComplaintsSection />
            </ScrollAnimation>

            {/* ═══════════════════════════════════════════════════ */}
            {/* 6. QUICK LINKS (directorate-specific) */}
            {/* ═══════════════════════════════════════════════════ */}
            <ScrollAnimation>
                <div className="bg-white dark:bg-dm-surface">
                    <QuickLinks section="directorate" />
                </div>
            </ScrollAnimation>

            {/* ═══════════════════════════════════════════════════ */}
            {/* 7. SUGGESTIONS */}
            {/* ═══════════════════════════════════════════════════ */}
            <ScrollAnimation>
                <HomeSuggestionsSection />
            </ScrollAnimation>

            {/* ═══════════════════════════════════════════════════ */}
            {/* 8. FAQ (directorate-specific) */}
            {/* ═══════════════════════════════════════════════════ */}
            <section id="faq" className="py-12 bg-gray-50 dark:bg-dm-bg">
                <ScrollAnimation>
                    <FAQSection directorateId={directorateId} />
                </ScrollAnimation>
            </section>

            {/* ═══════════════════════════════════════════════════ */}
            {/* 9. CONTACT US (directorate-specific info) */}
            {/* ═══════════════════════════════════════════════════ */}
            <section id="contact" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <ScrollAnimation>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gov-charcoal dark:text-white mb-2">
                            {isAr ? 'تواصل معنا' : 'Contact Us'}
                        </h2>
                        <p className="text-gray-500 dark:text-white/60">
                            {isAr ? `معلومات التواصل الخاصة بـ ${loc(directorate, 'name')}` : `Contact information for ${loc(directorate, 'name')}`}
                        </p>
                        <div className="mt-3 mx-auto w-20 h-1 rounded-full bg-gov-gold" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                        {/* Contact Info Card */}
                        <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-sm border border-gray-100 dark:border-gov-border/15 p-6 h-full flex flex-col justify-center">
                            <h3 className="font-bold text-gov-charcoal dark:text-white mb-5 flex items-center gap-2">
                                <Users className="text-gov-forest dark:text-gov-teal" size={20} />
                                {t('directorate_contact')}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-white/70">
                                    <MapPin className="shrink-0 text-gov-forest dark:text-gov-teal mt-0.5" size={18} />
                                    <span>{contactAddress}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-white/70">
                                    <Phone className="shrink-0 text-gov-forest dark:text-gov-teal" size={18} />
                                    <a href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`} className="hover:text-gov-forest dark:hover:text-gov-gold dir-ltr transition-colors">
                                        {contactPhone}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-white/70">
                                    <Mail className="shrink-0 text-gov-forest dark:text-gov-teal" size={18} />
                                    <a href={`mailto:${contactEmail}`} className="hover:text-gov-forest dark:hover:text-gov-gold transition-colors">
                                        {contactEmail}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-white/70">
                                    <Globe className="shrink-0 text-gov-forest dark:text-gov-teal" size={18} />
                                    {contactWebsite ? (
                                        <a
                                            href={contactWebsite}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-gov-forest dark:hover:text-gov-gold underline break-all"
                                        >
                                            {contactWebsite}
                                        </a>
                                    ) : (
                                        <span>{t('directorate_website')}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Working Hours Card */}
                        <div className="bg-gov-forest text-white rounded-2xl shadow-lg p-6 relative overflow-hidden flex flex-col justify-center h-full">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            <h3 className="font-bold mb-5 relative z-10 flex items-center gap-2">
                                <Clock size={20} />
                                {t('directorate_hours')}
                            </h3>
                            <div className="space-y-3 text-sm relative z-10">
                                {contactWorkingHours ? (
                                    <div className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3">
                                        <span className="font-bold text-gov-gold">{contactWorkingHours}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3">
                                        <span className="font-medium">{t('directorate_hours_sun_thu')}</span>
                                        <span className="font-bold text-gov-gold">{t('directorate_hours_value')}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3">
                                    <span className="font-medium">{t('directorate_fri_sat')}</span>
                                    <span className="font-bold text-red-300">{t('directorate_holiday')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollAnimation>
            </section>

            {/* ═══════════════════════════════════════════════════ */}
            {/* 10. CONTACT FORM (same as homepage) */}
            {/* ═══════════════════════════════════════════════════ */}
            <ContactSection />
        </div>
    );
};

export default DirectorateDetail;
