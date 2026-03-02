'use client';

import React, { useEffect, useState } from 'react';
import { Megaphone, Calendar, ArrowLeft, ArrowRight, Bell, AlertCircle, Loader2, Printer, Share2, Download } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { API } from '@/lib/repository';
import ShareMenu from './ShareMenu';
import DownloadMenu from './DownloadMenu';
import Link from 'next/link';
import { SkeletonGrid, SkeletonText } from '@/components/SkeletonLoader';

interface Announcement {
    id: string;
    title: string;
    date: string;
    type: 'urgent' | 'important' | 'general';
    description: string;
    expires_at?: string;
}

const isExpired = (expiresAt?: string): boolean => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
};

const Announcements: React.FC = () => {
    const { t, language } = useLanguage();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [shareData, setShareData] = useState<{ title: string; url: string } | null>(null);
    const [openDownloadMenuId, setOpenDownloadMenuId] = useState<string | null>(null);

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
                        <SkeletonText lines={1} className="max-w-48 mx-auto mb-6" />
                        <SkeletonText lines={1} className="max-w-96 mx-auto" />
                    </div>
                    <SkeletonGrid cards={9} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="py-8 md:py-24 bg-white dark:bg-dm-bg relative overflow-hidden scroll-mt-12 md:scroll-mt-24" id="announcements">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-6 md:mb-16">
                        <div className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 py-1 md:px-4 md:py-2 bg-gov-gold/10 dark:bg-gov-emerald/20 rounded-full mb-3 md:mb-6">
                            <Megaphone className="text-gov-gold w-3.5 h-3.5 md:w-5 md:h-5" />
                            <span className="text-gov-gold font-bold text-[10px] md:text-sm tracking-wide">
                                {t('announcements_latest')}
                            </span>
                        </div>
                        <h2 className="text-xl md:text-3xl lg:text-4xl font-display font-bold text-gov-forest dark:text-gov-teal mb-2 md:mb-6">
                            {t('announcements_title')}
                        </h2>
                        <p className="text-gov-stone/60 dark:text-gov-teal/40 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed">
                            {t('announcements_subtitle')}
                        </p>
                    </div>

                    {/* FR-58: Announcements 3x3 Grid (9 items) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {announcements.map((announcement) => {
                            const styles = getTypeStyles(announcement.type);
                            const expired = isExpired(announcement.expires_at);
                            const cardBorderClass = expired ? 'border-gov-red/30 dark:border-gov-red/30' : styles.border;
                            const cardBgClass = expired ? 'bg-red-50/50 dark:bg-red-950/10' : styles.bg;
                            const isDownloadMenuOpen = openDownloadMenuId === announcement.id;
                            return (
                                <Link
                                    key={announcement.id}
                                    href={`/announcements/${announcement.id}`}
                                    className="block h-full group"
                                >
                                    <div className="relative h-full transition-all duration-500 hover:-translate-y-2">
                                        <article
                                            className={`relative h-full flex flex-col ${expired ? 'bg-red-50/50 dark:bg-red-950/10 border-gov-red/30' : 'bg-white/80 dark:bg-dm-surface/80 border-2 border-gov-gold/20 dark:border-gov-gold/10 hover:border-gov-gold/50 dark:hover:border-gov-gold/30'} backdrop-blur-xl border rounded-xl md:rounded-3xl p-3 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(185,167,121,0.25)] dark:hover:shadow-[0_20px_40px_rgba(185,167,121,0.1)] transition-all duration-500 overflow-hidden ${expired ? 'opacity-70 grayscale-[0.8]' : ''}`}
                                        >
                                            {/* Abstract Shapes */}
                                            <div className="absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-tr from-gov-teal/5 dark:from-gov-teal/[0.02] to-transparent rounded-tr-[100px] -z-10 transition-transform duration-500 group-hover:scale-150" />

                                            {/* Top Bar with Badges */}
                                            <div className="flex flex-wrap items-start justify-between gap-1.5 md:gap-2 mb-3 md:mb-6 z-10 relative">
                                                <div className="flex flex-col gap-1.5 md:gap-2">
                                                    <span className={`${styles.badge} w-fit px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[9px] md:text-xs font-bold flex items-center gap-1 md:gap-1.5 uppercase tracking-wider shadow-sm`}>
                                                        <span className="w-3 h-3 md:w-3.5 md:h-3.5 flex items-center justify-center">{styles.icon}</span>
                                                        {getTypeLabel(announcement.type)}
                                                    </span>
                                                    {expired && (
                                                        <span className="bg-gov-red/10 text-gov-red dark:bg-gov-red/20 dark:text-red-400 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wider border border-gov-red/20 w-fit">
                                                            {language === 'ar' ? 'انتهى التقديم' : 'Application Closed'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-gov-forest/60 dark:text-gov-teal/60 font-medium text-[9px] md:text-[10px] bg-gov-beige/30 dark:bg-black/20 px-1.5 py-0.5 md:px-2 md:py-1 flex-shrink-0 rounded-full self-start">
                                                    <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                                    <span>{formatDate(announcement.date)}</span>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 className={`text-sm md:text-base lg:text-xl font-display font-bold mb-1.5 md:mb-4 group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors line-clamp-3 leading-snug drop-shadow-sm flex-grow ${expired ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gov-forest dark:text-white'}`}>
                                                {announcement.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-gov-stone/70 dark:text-white/70 text-[10px] md:text-sm mb-3 md:mb-6 line-clamp-2 leading-relaxed h-7 md:h-10">
                                                {announcement.description}
                                            </p>

                                            {/* Expiry Date */}
                                            {announcement.expires_at && (
                                                <div className={`text-[10px] md:text-xs font-medium flex items-center gap-1 md:gap-1.5 mb-3 md:mb-5 p-1.5 md:p-2 rounded-lg bg-black/5 dark:bg-white/5 ${expired ? 'text-gov-red dark:text-gov-red' : 'text-gov-teal dark:text-gov-teal'}`}>
                                                    <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                                    {expired
                                                        ? (language === 'ar' ? `انتهى بتاريخ: ${formatDate(announcement.expires_at)}` : `Expired on: ${formatDate(announcement.expires_at)}`)
                                                        : (language === 'ar' ? `ينتهي بتاريخ: ${formatDate(announcement.expires_at)}` : `Expires on: ${formatDate(announcement.expires_at)}`)
                                                    }
                                                </div>
                                            )}

                                            {/* Footer Actions */}
                                            <div className="flex flex-wrap items-center justify-between gap-y-2 pt-3 md:pt-4 border-t border-gov-gold/10 dark:border-white/10 mt-auto z-10 relative">
                                                {/* Action buttons: Print, Share & Download */}
                                                <div className="flex items-center gap-1.5 md:gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            window.print();
                                                        }}
                                                        className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-gov-forest/5 dark:bg-white/5 text-gov-forest dark:text-gov-teal hover:bg-gov-forest/10 hover:text-gov-gold dark:hover:bg-white/10 transition-colors"
                                                        title={t('print')}
                                                        aria-label={t('print')}
                                                    >
                                                        <Printer className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setShareData({
                                                                title: announcement.title,
                                                                url: `${window.location.origin}/announcements/${announcement.id}`
                                                            });
                                                        }}
                                                        className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-gov-forest/5 dark:bg-white/5 text-gov-forest dark:text-gov-teal hover:bg-gov-forest/10 hover:text-gov-gold dark:hover:bg-white/10 transition-colors"
                                                        title={t('share')}
                                                        aria-label={t('share')}
                                                    >
                                                        <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                    </button>
                                                    <div className="relative">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setOpenDownloadMenuId(isDownloadMenuOpen ? null : announcement.id);
                                                            }}
                                                            className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-gov-forest/5 dark:bg-white/5 text-gov-forest dark:text-gov-teal hover:bg-gov-forest/10 hover:text-gov-gold dark:hover:bg-white/10 transition-colors"
                                                            title={language === 'ar' ? 'تحميل' : 'Download'}
                                                            aria-label={language === 'ar' ? 'تحميل' : 'Download'}
                                                        >
                                                            <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                        </button>
                                                        {isDownloadMenuOpen && (
                                                            <div className="absolute bottom-full mb-1 md:mb-2 z-50 w-36 md:w-48 shadow-xl rounded-xl border border-gov-gold/20 origin-bottom-left" style={{ [language === 'ar' ? 'right' : 'left']: 0 }}>
                                                                <DownloadMenu
                                                                    isOpen={true}
                                                                    onClose={() => setOpenDownloadMenuId(null)}
                                                                    announcement={{
                                                                        id: announcement.id,
                                                                        title: announcement.title,
                                                                        description: announcement.description || '',
                                                                        date: announcement.date,
                                                                        attachments: []
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Read More */}
                                                <div className="flex items-center gap-1.5 md:gap-2 text-gov-gold dark:text-gov-teal font-bold text-[9px] md:text-[11px] uppercase tracking-[0.1em] md:tracking-[0.15em] group-hover:text-gov-forest dark:group-hover:text-gov-gold transition-colors ml-auto rtl:ml-0 rtl:mr-auto">
                                                    <span>{t('announcements_read_more')}</span>
                                                    <div className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 rounded-full bg-gov-gold/10 flex items-center justify-center group-hover:bg-gov-gold/20 transition-colors">
                                                        <ArrowIcon className="w-2.5 h-2.5 md:w-3 md:h-3 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Animated Gradient Border at Bottom */}
                                            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gov-forest via-gov-gold to-gov-teal transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                                        </article>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* View All Button */}
                    <div className="text-center mt-6 md:mt-16 relative z-10">
                        <Link
                            href="/announcements"
                            className="group relative inline-flex items-center gap-2 md:gap-4 px-4 md:px-10 py-2.5 md:py-5 bg-white/10 dark:bg-dm-surface/30 backdrop-blur-md font-bold text-gov-forest dark:text-white rounded-[1.5rem] md:rounded-[2rem] hover:text-white transition-colors duration-500 overflow-hidden shadow-md md:shadow-xl border border-gov-gold/20"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-gov-forest via-gov-teal to-gov-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                            <div className="absolute inset-0 w-1/4 bg-white/20 skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite] -z-10" />
                            <div className="absolute inset-0 border border-gov-gold/30 rounded-[1.5rem] md:rounded-[2rem] group-hover:border-transparent transition-colors duration-500 -z-10" />

                            <span className="text-[12px] md:text-[16px] tracking-wide relative z-10 font-bold">{t('announcements_view_all')}</span>

                            <div className="relative z-10 w-6 h-6 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gov-forest/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500 border border-current/10">
                                <ArrowIcon className="w-3.5 h-3.5 md:w-[18px] md:h-[18px] transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            <ShareMenu
                isOpen={!!shareData}
                onClose={() => setShareData(null)}
                title={shareData?.title || ''}
                url={shareData?.url || ''}
            />


        </>
    );
};

export default Announcements;
