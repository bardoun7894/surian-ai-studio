'use client';

import React, { useEffect, useState } from 'react';
import { Megaphone, Calendar, ArrowLeft, ArrowRight, Bell, AlertCircle, Loader2, Printer, Share2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { API } from '@/lib/repository';
import { shareContent } from '@/lib/utils';
import Link from 'next/link';

interface Announcement {
    id: string;
    title: string;
    date: string;
    type: 'urgent' | 'important' | 'general';
    description: string;
}

const Announcements: React.FC = () => {
    const { t, language } = useLanguage();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch announcements from API (FR-58: Show 9 items in 3x3 grid)
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await API.announcements.getAll();
                // Map API response to component format
                const mapped = (Array.isArray(data) ? data : []).slice(0, 9).map((item: any) => ({
                    id: item.id?.toString() || Math.random().toString(),
                    title: language === 'ar' ? (item.title_ar || item.title) : (item.title_en || item.title),
                    date: item.date || item.created_at || new Date().toISOString(),
                    type: (item.is_urgent ? 'urgent' : (item.is_important ? 'important' : 'general')) as 'urgent' | 'important' | 'general',
                    description: language === 'ar' ? (item.description_ar || item.description || item.content_ar) : (item.description_en || item.description || item.content_en)
                }));
                setAnnouncements(mapped);
            } catch (error) {
                console.error('Failed to fetch announcements:', error);
                setAnnouncements([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, [language]);

    const getTypeStyles = (type: Announcement['type']) => {
        switch (type) {
            case 'urgent':
                return {
                    bg: 'bg-gov-forest/5 dark:bg-dm-surface',
                    border: 'border-gov-gold/30 dark:border-gov-border/25',
                    badge: 'bg-gov-gold text-white',
                    icon: <AlertCircle size={14} />
                };
            case 'important':
                return {
                    bg: 'bg-gov-forest/5 dark:bg-dm-surface',
                    border: 'border-gov-gold/30 dark:border-gov-border/25',
                    badge: 'bg-gov-gold/80 text-white',
                    icon: <Bell size={14} />
                };
            default:
                return {
                    bg: 'bg-gov-forest/5 dark:bg-dm-surface',
                    border: 'border-gov-forest/10 dark:border-gov-border/15',
                    badge: 'bg-gov-forest text-white',
                    icon: <Megaphone size={14} />
                };
        }
    };

    const getTypeLabel = (type: Announcement['type']) => {
        return t(`announcements_type_${type}`);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return language === 'ar'
            ? date.toLocaleDateString('ar-SY', { year: 'numeric', month: 'long', day: 'numeric' })
            : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

    // Loading skeleton for 3x3 grid
    if (loading) {
        return (
            <section className="py-24 bg-white dark:bg-dm-bg relative overflow-hidden scroll-mt-24" id="announcements">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="h-8 w-48 bg-gray-200 dark:bg-dm-surface rounded-full mx-auto mb-6 animate-pulse"></div>
                        <div className="h-12 w-96 bg-gray-200 dark:bg-dm-surface rounded mx-auto mb-4 animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="h-64 bg-gray-200 dark:bg-dm-surface rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-white dark:bg-dm-bg relative overflow-hidden scroll-mt-24" id="announcements">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gov-gold/10 dark:bg-gov-emerald/20 rounded-full mb-6">
                        <Megaphone className="text-gov-gold" size={20} />
                        <span className="text-gov-gold font-bold text-sm tracking-wide">
                            {t('announcements_latest')}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-gov-forest dark:text-gov-teal mb-6">
                        {t('announcements_title')}
                    </h2>
                    <p className="text-gov-stone/60 dark:text-gov-teal/40 max-w-2xl mx-auto text-lg leading-relaxed">
                        {t('announcements_subtitle')}
                    </p>
                </div>

                {/* FR-58: Announcements 3x3 Grid (9 items) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {announcements.map((announcement) => {
                        const styles = getTypeStyles(announcement.type);
                        return (
                            <Link
                                key={announcement.id}
                                href={`/announcements/${announcement.id}`}
                                className="block"
                            >
                                <article
                                    className={`${styles.bg} ${styles.border} border rounded-[1.5rem] p-6 hover:shadow-2xl hover:shadow-gov-gold/10 transition-all duration-500 group cursor-pointer backdrop-blur-md relative overflow-hidden hover:-translate-y-2 hover:border-gov-gold/40`}
                                >
                                    {/* Type Badge */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`${styles.badge} px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider border border-white/20`}>
                                            {styles.icon}
                                            {getTypeLabel(announcement.type)}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-gov-gold/60 font-medium text-xs">
                                            <Calendar size={12} />
                                            <span>{formatDate(announcement.date)}</span>
                                        </div>
                                    </div>

                                    {/* Title - Keep Gold/White distinction if needed, user said Gold for Head */}
                                    <h3 className="text-lg font-display font-bold text-gov-forest dark:text-gov-teal mb-3 group-hover:text-gov-teal dark:group-hover:text-white transition-colors line-clamp-2 leading-snug">
                                        {announcement.title}
                                    </h3>

                                    {/* Description - White */}
                                    <p className="text-gov-stone/60 dark:text-white/70 text-sm mb-4 line-clamp-2 leading-relaxed">
                                        {announcement.description}
                                    </p>

                                    {/* Action buttons: Print & Share */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                window.print();
                                            }}
                                            className="p-2 rounded-lg bg-gov-forest/5 dark:bg-white/5 text-gov-forest dark:text-gov-teal hover:bg-gov-forest/10 dark:hover:bg-white/10 transition-colors"
                                            title={t('print')}
                                            aria-label={t('print')}
                                        >
                                            <Printer size={14} />
                                        </button>
                                        <button
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                await shareContent(
                                                    announcement.title,
                                                    `${window.location.origin}/announcements/${announcement.id}`
                                                );
                                            }}
                                            className="p-2 rounded-lg bg-gov-forest/5 dark:bg-white/5 text-gov-forest dark:text-gov-teal hover:bg-gov-forest/10 dark:hover:bg-white/10 transition-colors"
                                            title={t('share')}
                                            aria-label={t('share')}
                                        >
                                            <Share2 size={14} />
                                        </button>
                                    </div>

                                    {/* Read More */}
                                    <div className="flex items-center gap-2 text-gov-gold dark:text-gov-gold font-bold text-[10px] uppercase tracking-[0.15em] group-hover:gap-3 transition-all pt-3 border-t border-gov-gold/10 dark:border-white/5">
                                        <span>{t('announcements_read_more')}</span>
                                        <ArrowIcon size={14} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                                    </div>
                                </article>
                            </Link>
                        );
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        href="/announcements"
                        className="inline-flex items-center gap-2 px-10 py-4 bg-gov-forest dark:bg-gov-button text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-gov-forest/20 dark:hover:shadow-gov-gold/20 transition-all duration-300 group hover:-translate-y-1 active:translate-y-0"
                    >
                        <span>{t('announcements_view_all')}</span>
                        <ArrowIcon size={18} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Announcements;
