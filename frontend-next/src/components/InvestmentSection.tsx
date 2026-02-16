'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Investment, InvestmentStats } from '@/types';
import { API } from '@/lib/repository';
import { TrendingUp, ArrowLeft, ArrowRight, Building2, CheckCircle, Wallet, Sparkles, Target, Briefcase } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SkeletonCard, SkeletonText } from '@/components/SkeletonLoader';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    Zap: Sparkles,
    Factory: Building2,
    Building: Building2,
    Wheat: Target,
    Building2,
    Users: Briefcase,
    FileText: Target,
    Wallet,
    TrendingUp,
};

export default function InvestmentSection() {
    const { language, t } = useLanguage();
    const [stats, setStats] = useState<InvestmentStats | null>(null);
    const [featured, setFeatured] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, featuredData] = await Promise.all([
                    API.investments.getStats(),
                    API.investments.getAll({ featured: true })
                ]);
                setStats(statsData);
                setFeatured(featuredData.slice(0, 3));
            } catch (error) {
                console.error('Failed to fetch investment data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat(language === 'ar' ? 'ar-SY' : 'en-US').format(num);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-gradient-to-r from-gov-gold to-gov-sand text-gov-forest border border-gov-gold/30';
            case 'under_review':
                return 'bg-gradient-to-r from-gov-teal/20 to-gov-teal/10 text-gov-teal border border-gov-teal/30';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    if (loading) {
        return (
            <section className="py-24 relative overflow-hidden bg-gov-beige dark:bg-dm-bg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <div className="h-6 w-32 bg-gray-200 dark:bg-dm-surface rounded-full mx-auto mb-4 animate-pulse" />
                        <div className="h-16 w-3/4 max-w-2xl bg-gray-200 dark:bg-dm-surface rounded-2xl mx-auto mb-6 animate-pulse" />
                        <div className="h-4 w-2/3 max-w-xl bg-gray-200 dark:bg-dm-surface rounded-full mx-auto animate-pulse" />
                    </div>

                    {/* Stats Skeleton */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white dark:bg-dm-surface backdrop-blur-sm p-6 rounded-3xl border border-gray-100 dark:border-gov-border/15 shadow-xl">
                                <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-white/5 animate-pulse mb-4" />
                                <div className="h-10 w-24 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse mb-2" />
                                <div className="h-4 w-32 bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse" />
                            </div>
                        ))}
                    </div>

                    {/* Featured Opportunities Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <SkeletonCard key={i} className="rounded-[2rem]" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="investments" className="py-24 relative overflow-hidden bg-gov-beige dark:bg-dm-bg">
            {/* Islamic Pattern Background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 20% 20%, #b9a779 0%, transparent 2%), 
                                     radial-gradient(circle at 80% 80%, #b9a779 0%, transparent 2%),
                                     radial-gradient(circle at 40% 60%, #094239 0%, transparent 2%)`,
                    backgroundSize: '100px 100px'
                }} />
            </div>

            {/* Gradient Orbs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-gov-gold/10 via-transparent to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-radial from-gov-teal/10 via-transparent to-transparent rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    {/* Decorative Line */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: 60 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="h-0.5 bg-gradient-to-r from-transparent to-gov-gold"
                        />
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                            className="w-3 h-3 rotate-45 bg-gov-gold"
                        />
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: 60 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="h-0.5 bg-gradient-to-l from-transparent to-gov-gold"
                        />
                    </div>

                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="inline-block px-6 py-2 rounded-full bg-gov-gold/10 border border-gov-gold/30 text-gov-gold font-bold text-sm mb-4"
                    >
                        {language === 'ar' ? 'فرص واعدة' : 'Promising Opportunities'}
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gov-forest dark:text-gov-gold mb-6 leading-tight"
                    >
                        {language === 'ar' ? 'استثمر في سوريا' : 'Invest in Syria'}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="text-lg md:text-xl text-gov-charcoal/70 dark:text-gov-gold/70 max-w-3xl mx-auto leading-relaxed"
                    >
                        {language === 'ar'
                            ? 'اكتشف فرصاً استثمارية متنوعة في مختلف القطاعات الحيوية مع حوافز وتسهيلات غير مسبوقة.'
                            : 'Discover diverse investment opportunities in various vital sectors with unprecedented incentives and facilities.'}
                    </motion.p>
                </motion.div>

                {/* Stats Grid */}
                {stats && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
                    >
                        {[
                            {
                                label: stats.labels.total_opportunities[language as 'ar' | 'en'],
                                value: stats.total_opportunities,
                                icon: Building2,
                                color: 'text-gov-forest',
                                bg: 'bg-gov-forest/10 dark:bg-gov-forest/20',
                            },
                            {
                                label: stats.labels.available_count[language as 'ar' | 'en'],
                                value: stats.available_count,
                                icon: CheckCircle,
                                color: 'text-gov-gold',
                                bg: 'bg-gov-gold/10 dark:bg-gov-gold/20',
                            },
                            {
                                label: stats.labels.total_investment_value[language as 'ar' | 'en'],
                                value: formatNumber(stats.total_investment_value),
                                suffix: '$',
                                icon: Wallet,
                                color: 'text-gov-teal',
                                bg: 'bg-gov-teal/10 dark:bg-gov-teal/20',
                            },
                            {
                                label: stats.labels.sectors_count[language as 'ar' | 'en'],
                                value: stats.sectors_count,
                                icon: TrendingUp,
                                color: 'text-amber-600',
                                bg: 'bg-amber-50 dark:bg-amber-900/20',
                            },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-gov-gold/20 to-gov-forest/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative bg-white dark:bg-dm-surface backdrop-blur-sm p-6 rounded-3xl border border-gov-gold/10 dark:border-gov-border/15 shadow-xl overflow-hidden">
                                    <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <stat.icon size={28} />
                                    </div>

                                    <h3 className="text-3xl md:text-4xl font-display font-bold text-gov-forest dark:text-gov-gold mb-2">
                                        {stat.value}
                                        {stat.suffix && <span className="text-lg opacity-70 ml-1">{stat.suffix}</span>}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-white/60 font-medium">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Featured Opportunities */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {featured.map((item, idx) => {
                        const Icon = iconMap[item.icon] || Building2;
                        const title = language === 'ar' ? item.title_ar : item.title_en;
                        const description = language === 'ar' ? item.description_ar : item.description_en;
                        const sector = language === 'ar' ? item.sector_ar : item.sector_en;
                        const statusLabel = language === 'ar'
                            ? (item.status === 'available' ? 'متاح' : 'قيد المراجعة')
                            : (item.status === 'available' ? 'Available' : 'Under Review');

                        return (
                            <motion.div
                                key={item.id}
                                variants={itemVariants}
                                whileHover={{ y: -12 }}
                                className="group relative"
                            >
                                <Link href={`/investment/${item.category || 'opportunities'}`} className="block h-full">
                                    {/* Glow Effect */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-gov-gold to-gov-teal rounded-[2rem] blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

                                    <div className="relative h-full bg-white dark:bg-dm-surface rounded-[2rem] border border-gov-gold/10 dark:border-gov-border/15 overflow-hidden shadow-xl transition-all duration-300">
                                        {/* Image Header */}
                                        <div className="h-48 relative overflow-hidden">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-gov-forest to-gov-teal flex items-center justify-center">
                                                    <Icon size={64} className="text-white/30" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                            <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                                                    {statusLabel}
                                                </span>
                                            </div>

                                            <div className="absolute bottom-4 left-4 rtl:left-auto rtl:right-4 right-4">
                                                <div className="flex items-center gap-2 text-gov-gold">
                                                    <Icon size={18} />
                                                    <span className="text-sm font-bold">{sector}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gov-forest dark:text-gov-gold mb-3 group-hover:text-gov-teal transition-colors line-clamp-2">
                                                {title}
                                            </h3>
                                            <p className="text-gray-500 dark:text-white/60 text-sm mb-6 line-clamp-3 leading-relaxed">
                                                {description}
                                            </p>

                                            <div className="flex items-center justify-between pt-4 border-t border-gov-gold/10 dark:border-white/5">
                                                <div>
                                                    <span className="text-xs text-gray-400 dark:text-white/40 block mb-1">
                                                        {language === 'ar' ? 'حجم الاستثمار' : 'Investment Value'}
                                                    </span>
                                                    <span className="font-bold text-gov-forest dark:text-gov-gold text-lg">
                                                        {formatNumber(item.investment_amount || 0)} <span className="text-sm">{item.currency}</span>
                                                    </span>
                                                </div>
                                                <div className="w-12 h-12 rounded-full bg-gov-forest/10 dark:bg-gov-gold/10 flex items-center justify-center group-hover:bg-gov-forest dark:group-hover:bg-gov-gold transition-colors duration-300">
                                                    {language === 'ar' ? <ArrowLeft size={20} className="text-gov-forest dark:text-gov-gold group-hover:text-white transition-colors" /> : <ArrowRight size={20} className="text-gov-forest dark:text-gov-gold group-hover:text-white transition-colors" />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-16"
                >
                    <Link
                        href="/investment"
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-gov-forest dark:bg-gov-button text-white font-bold rounded-2xl hover:bg-gov-teal dark:hover:bg-gov-gold transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                    >
                        {language === 'ar' ? 'عرض كل الفرص' : 'View All Opportunities'}
                        <motion.span
                            animate={{ x: language === 'ar' ? [-3, 3, -3] : [3, -3, 3] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            {language === 'ar' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                        </motion.span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
