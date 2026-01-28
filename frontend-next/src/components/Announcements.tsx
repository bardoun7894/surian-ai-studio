'use client';

import React, { useEffect, useState } from 'react';
import { Megaphone, Calendar, ArrowLeft, ArrowRight, Bell, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { API } from '@/lib/repository';

interface Announcement {
    id: string;
    title: string;
    date: string;
    type: 'urgent' | 'important' | 'general';
    description: string;
}

const MOCK_ANNOUNCEMENTS_AR: Announcement[] = [
    {
        id: '1',
        title: 'مناقصة عامة لتوريد معدات صناعية للمناطق الصناعية',
        date: '2025-01-12',
        type: 'important',
        description: 'تعلن وزارة الاقتصاد والصناعة عن مناقصة عامة لتوريد معدات صناعية للمناطق الصناعية'
    },
    {
        id: '2',
        title: 'تمديد مهلة التقديم على برنامج تمويل المشاريع الصغيرة',
        date: '2025-01-10',
        type: 'urgent',
        description: 'تم تمديد مهلة التقديم على برنامج تمويل المشاريع الصغيرة والمتوسطة حتى نهاية الشهر'
    },
    {
        id: '3',
        title: 'دورة تدريبية في إدارة الجودة الصناعية',
        date: '2025-01-08',
        type: 'general',
        description: 'تعلن الإدارة العامة للصناعة عن دورة تدريبية مجانية في إدارة الجودة للمنشآت الصناعية'
    },
    {
        id: '4',
        title: 'تحديث منصة التراخيص الصناعية الإلكترونية',
        date: '2025-01-05',
        type: 'important',
        description: 'سيتم تحديث منصة التراخيص الصناعية الإلكترونية يوم السبت القادم'
    },
    {
        id: '5',
        title: 'فرص عمل جديدة في القطاع الصناعي',
        date: '2025-01-03',
        type: 'general',
        description: 'إعلان عن فرص عمل في المناطق الصناعية تشمل: مهندسين صناعيين، فنيين، إداريين'
    },
    {
        id: '6',
        title: 'افتتاح مركز خدمات المستثمرين الجديد',
        date: '2025-01-02',
        type: 'important',
        description: 'يسرنا الإعلان عن افتتاح مركز خدمات المستثمرين الجديد في محافظة دمشق'
    },
    {
        id: '7',
        title: 'إطلاق بوابة وزارة الاقتصاد والصناعة الإلكترونية',
        date: '2025-01-01',
        type: 'urgent',
        description: 'تم إطلاق النسخة الجديدة من بوابة الوزارة بمزايا محسنة وخدمات إلكترونية متكاملة'
    },
    {
        id: '8',
        title: 'ورشة عمل حول تطوير القطاع الصناعي',
        date: '2024-12-28',
        type: 'general',
        description: 'دعوة للمشاركة في ورشة عمل حول استراتيجية تطوير القطاع الصناعي في سوريا'
    },
    {
        id: '9',
        title: 'إعلان نتائج مسابقة أفضل منتج صناعي سوري',
        date: '2024-12-25',
        type: 'important',
        description: 'تم الإعلان عن نتائج مسابقة أفضل منتج صناعي سوري. يمكن للمشاركين الاطلاع على النتائج'
    }
];

const MOCK_ANNOUNCEMENTS_EN: Announcement[] = [
    {
        id: '1',
        title: 'Tender for industrial equipment supply to industrial zones',
        date: '2025-01-12',
        type: 'important',
        description: 'Ministry of Economy and Industry announces a general tender for supplying industrial equipment'
    },
    {
        id: '2',
        title: 'SME financing program deadline extended',
        date: '2025-01-10',
        type: 'urgent',
        description: 'The deadline for SME financing program applications has been extended until the end of the month'
    },
    {
        id: '3',
        title: 'Free training course in industrial quality management',
        date: '2025-01-08',
        type: 'general',
        description: 'General Administration for Industry announces a free training course in quality management for industrial facilities'
    },
    {
        id: '4',
        title: 'Industrial licensing platform update',
        date: '2025-01-05',
        type: 'important',
        description: 'The electronic industrial licensing platform will be updated next Saturday'
    },
    {
        id: '5',
        title: 'New job opportunities in the industrial sector',
        date: '2025-01-03',
        type: 'general',
        description: 'Job opportunities in industrial zones including: industrial engineers, technicians, administrators'
    },
    {
        id: '6',
        title: 'New Investor Services Center Opening',
        date: '2025-01-02',
        type: 'important',
        description: 'We are pleased to announce the opening of a new Investor Services Center in Damascus'
    },
    {
        id: '7',
        title: 'Ministry of Economy and Industry Portal Launch',
        date: '2025-01-01',
        type: 'urgent',
        description: 'The new Ministry portal has been launched with improved features and integrated e-services'
    },
    {
        id: '8',
        title: 'Industrial Sector Development Workshop',
        date: '2024-12-28',
        type: 'general',
        description: 'Invitation to participate in a workshop on industrial sector development strategy in Syria'
    },
    {
        id: '9',
        title: 'Best Syrian Industrial Product Competition Results',
        date: '2024-12-25',
        type: 'important',
        description: 'Results of the Best Syrian Industrial Product competition announced. Participants can view results'
    }
];

const getAnnouncements = (language: 'ar' | 'en'): Announcement[] => {
    return language === 'ar' ? MOCK_ANNOUNCEMENTS_AR : MOCK_ANNOUNCEMENTS_EN;
};

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
                setAnnouncements(mapped.length > 0 ? mapped : getAnnouncements(language).slice(0, 9));
            } catch (error) {
                console.error('Failed to fetch announcements:', error);
                // Fallback to mock data
                setAnnouncements(getAnnouncements(language).slice(0, 9));
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
                    bg: 'bg-gov-forest/5 dark:bg-white/5',
                    border: 'border-gov-gold/30 dark:border-gov-gold/20',
                    badge: 'bg-gov-gold text-white',
                    icon: <AlertCircle size={14} />
                };
            case 'important':
                return {
                    bg: 'bg-gov-forest/5 dark:bg-white/5',
                    border: 'border-gov-gold/30 dark:border-gov-gold/20',
                    badge: 'bg-gov-gold/80 text-white',
                    icon: <Bell size={14} />
                };
            default:
                return {
                    bg: 'bg-gov-forest/5 dark:bg-white/5',
                    border: 'border-gov-forest/10 dark:border-white/10',
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
            <section className="py-24 bg-white dark:bg-gov-forest/30 relative overflow-hidden scroll-mt-24" id="announcements">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 animate-pulse"></div>
                        <div className="h-12 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-white dark:bg-gov-forest/30 relative overflow-hidden scroll-mt-24" id="announcements">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gov-gold/10 dark:bg-gov-gold/20 rounded-full mb-6">
                        <Megaphone className="text-gov-gold" size={20} />
                        <span className="text-gov-gold font-bold text-sm tracking-wide">
                            {t('announcements_latest')}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-gov-forest dark:text-white mb-6">
                        {t('announcements_title')}
                    </h2>
                    <p className="text-gov-stone/60 dark:text-gov-beige/40 max-w-2xl mx-auto text-lg leading-relaxed">
                        {t('announcements_subtitle')}
                    </p>
                </div>

                {/* FR-58: Announcements 3x3 Grid (9 items) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {announcements.map((announcement) => {
                        const styles = getTypeStyles(announcement.type);
                        return (
                            <article
                                key={announcement.id}
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

                                {/* Title */}
                                <h3 className="text-lg font-display font-bold text-gov-forest dark:text-white mb-3 group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors line-clamp-2 leading-snug">
                                    {announcement.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gov-stone/60 dark:text-gov-beige/60 text-sm mb-4 line-clamp-2 leading-relaxed">
                                    {announcement.description}
                                </p>

                                {/* Read More */}
                                <div className="flex items-center gap-2 text-gov-forest dark:text-gov-gold font-bold text-[10px] uppercase tracking-[0.15em] group-hover:gap-3 transition-all pt-3 border-t border-gov-gold/10 dark:border-white/5">
                                    <span>{t('announcements_read_more')}</span>
                                    <ArrowIcon size={14} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <a
                        href="/announcements"
                        className="inline-flex items-center gap-2 px-10 py-4 bg-gov-forest dark:bg-gov-gold text-white dark:text-gov-forest font-bold rounded-2xl hover:shadow-lg hover:shadow-gov-forest/20 dark:hover:shadow-gov-gold/20 transition-all duration-300 group hover:-translate-y-1 active:translate-y-0"
                    >
                        <span>{t('announcements_view_all')}</span>
                        <ArrowIcon size={18} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Announcements;
