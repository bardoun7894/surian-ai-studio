import React from 'react';
import { Megaphone, Calendar, ArrowLeft, ArrowRight, Bell, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

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
        title: 'إعلان عن مناقصة عامة لتوريد معدات تقنية',
        date: '2025-01-12',
        type: 'important',
        description: 'تعلن رئاسة مجلس الوزراء عن مناقصة عامة لتوريد معدات تقنية وأجهزة حاسوبية'
    },
    {
        id: '2',
        title: 'تمديد مهلة تقديم طلبات التوظيف',
        date: '2025-01-10',
        type: 'urgent',
        description: 'تم تمديد مهلة تقديم طلبات التوظيف للمسابقة المركزية حتى نهاية الشهر الحالي'
    },
    {
        id: '3',
        title: 'دورة تدريبية في الإدارة الإلكترونية',
        date: '2025-01-08',
        type: 'general',
        description: 'إعلان عن دورة تدريبية مجانية في الإدارة الإلكترونية للموظفين الحكوميين'
    },
    {
        id: '4',
        title: 'تحديث نظام المعاملات الإلكترونية',
        date: '2025-01-05',
        type: 'important',
        description: 'سيتم تحديث نظام المعاملات الإلكترونية يوم السبت القادم'
    },
    {
        id: '5',
        title: 'فرص عمل جديدة في القطاع الحكومي',
        date: '2025-01-03',
        type: 'general',
        description: 'إعلان عن وظائف شاغرة في عدة وزارات ومؤسسات حكومية تشمل: محاسبين، مهندسين، إداريين'
    }
];

const MOCK_ANNOUNCEMENTS_EN: Announcement[] = [
    {
        id: '1',
        title: 'Tender announcement for office supplies procurement',
        date: '2025-01-12',
        type: 'important',
        description: 'The Prime Ministry announces a general tender for supplying technical equipment and computers'
    },
    {
        id: '2',
        title: 'Employment application deadline extended',
        date: '2025-01-10',
        type: 'urgent',
        description: 'The deadline for submitting employment applications for the central competition has been extended until the end of the current month'
    },
    {
        id: '3',
        title: 'Free training course in electronic administration',
        date: '2025-01-08',
        type: 'general',
        description: 'Announcement of a free training course in electronic administration for government employees'
    },
    {
        id: '4',
        title: 'E-transactions system update',
        date: '2025-01-05',
        type: 'important',
        description: 'The electronic transactions system will be updated next Saturday from 12:00 AM to 6:00 PM'
    },
    {
        id: '5',
        title: 'New job vacancies in the government sector',
        date: '2025-01-03',
        type: 'general',
        description: 'Announcement of vacant positions in several ministries and government institutions including: accountants, engineers, administrators'
    }
];

const getAnnouncements = (language: 'ar' | 'en'): Announcement[] => {
    return language === 'ar' ? MOCK_ANNOUNCEMENTS_AR : MOCK_ANNOUNCEMENTS_EN;
};

const Announcements: React.FC = () => {
    const { t, language } = useLanguage();

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

    return (
        <section className="py-24 bg-white dark:bg-gov-forest/30 relative overflow-hidden" id="announcements">
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
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        {t('announcements_subtitle')}
                    </p>
                </div>

                {/* Announcements Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {getAnnouncements(language).slice(0, 6).map((announcement) => {
                        const styles = getTypeStyles(announcement.type);
                        return (
                            <article
                                key={announcement.id}
                                className={`${styles.bg} ${styles.border} border-2 rounded-[2.5rem] p-8 hover:shadow-2xl transition-all duration-500 group cursor-pointer backdrop-blur-sm relative overflow-hidden`}
                            >
                                {/* Type Badge */}
                                <div className="flex items-center justify-between mb-6">
                                    <span className={`${styles.badge} px-4 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-2 uppercase tracking-widest border border-white/20`}>
                                        {styles.icon}
                                        {getTypeLabel(announcement.type)}
                                    </span>
                                    <div className="flex items-center gap-2 text-gov-gold/60 font-medium text-xs">
                                        <Calendar size={14} />
                                        <span>{formatDate(announcement.date)}</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-display font-bold text-gov-forest dark:text-white mb-4 group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors line-clamp-2 leading-snug">
                                    {announcement.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
                                    {announcement.description}
                                </p>

                                {/* Read More */}
                                <div className="flex items-center gap-2 text-gov-forest dark:text-gov-gold font-bold text-[10px] uppercase tracking-[0.2em] group-hover:gap-4 transition-all mt-auto pt-4 border-t border-black/5 dark:border-white/5">
                                    <span>{t('announcements_read_more')}</span>
                                    <ArrowIcon size={18} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center mt-10">
                    <button className="inline-flex items-center gap-2 px-8 py-3 bg-gov-forest dark:bg-gov-gold text-white dark:text-gov-forest font-bold rounded-xl hover:shadow-lg transition-all duration-300 group">
                        <span>{t('announcements_view_all')}</span>
                        <ArrowIcon size={18} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Announcements;
