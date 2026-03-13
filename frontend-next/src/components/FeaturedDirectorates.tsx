import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Directorate } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import DirectorateCard from './DirectorateCard';
import { SkeletonCard } from '@/components/SkeletonLoader';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function FeaturedDirectorates() {
    const { t, language } = useLanguage();
    const [directorates, setDirectorates] = useState<Directorate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await API.directorates.getFeatured();
                setDirectorates(data.slice(0, 3));
            } catch (error) {
                console.error("Failed to load directorates", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <section className="py-12 md:py-20 bg-gradient-to-br from-gov-beige/30 via-white to-gov-gold/10 dark:from-dm-bg dark:via-dm-bg dark:to-dm-surface relative overflow-hidden transition-colors">
                <div className="container mx-auto px-5 z-10 relative">
                    <div className="text-center mb-10 md:mb-16">
                        <div className="h-6 md:h-8 w-32 md:w-40 bg-gray-200 dark:bg-dm-surface rounded-full mx-auto mb-4 md:mb-6 animate-pulse" />
                        <div className="h-8 md:h-12 w-64 md:w-80 max-w-full bg-gray-200 dark:bg-dm-surface rounded-xl md:rounded-2xl mx-auto mb-3 md:mb-4 animate-pulse" />
                        <div className="h-1 md:h-1.5 w-24 md:w-32 bg-gray-200 dark:bg-dm-surface rounded-full mx-auto animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
                        <SkeletonCard className="h-64 md:h-72 rounded-2xl md:rounded-3xl" />
                        <SkeletonCard className="h-64 md:h-72 rounded-2xl md:rounded-3xl hidden md:block" />
                        <SkeletonCard className="h-64 md:h-72 rounded-2xl md:rounded-3xl hidden lg:block" />
                    </div>
                </div>
            </section>
        );
    }

    if (directorates.length === 0) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
            opacity: 1, y: 0, scale: 1,
            transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.8 }
        }
    };

    return (
        <section id="featured-directorates" className="py-8 md:py-20 bg-gradient-to-br from-gov-beige/30 via-white to-gov-gold/10 dark:from-dm-bg dark:via-dm-bg dark:to-dm-surface relative overflow-hidden scroll-mt-16 md:scroll-mt-24">
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ rotate: { duration: 80, repeat: Infinity, ease: "linear" }, scale: { duration: 10, repeat: Infinity, ease: "easeInOut" } }}
                    className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[300px] h-[300px] md:w-[800px] md:h-[800px] opacity-[0.03] dark:opacity-[0.02]"
                    style={{ background: 'radial-gradient(circle, #b9a779 0%, transparent 60%)' }}
                />
                <motion.div
                    animate={{ rotate: -360, scale: [1, 1.3, 1] }}
                    transition={{ rotate: { duration: 90, repeat: Infinity, ease: "linear" }, scale: { duration: 15, repeat: Infinity, ease: "easeInOut" } }}
                    className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[250px] h-[250px] md:w-[600px] md:h-[600px] opacity-[0.03] dark:opacity-[0.02]"
                    style={{ background: 'radial-gradient(circle, #1a4a38 0%, transparent 60%)' }}
                />
            </div>

            {/* Glowing Grid Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-[0.02]"
                style={{ backgroundImage: 'linear-gradient(#b9a779 1px, transparent 1px), linear-gradient(90deg, #b9a779 1px, transparent 1px)', backgroundSize: '30px 30px' }}
            />

            <div className="container mx-auto px-5 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-8 md:mb-16 relative"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-5 md:py-2.5 rounded-full bg-white/80 dark:bg-dm-surface/80 backdrop-blur-md border border-gov-gold/30 shadow-sm text-gov-gold text-[10px] md:text-sm font-bold mb-4 md:mb-6"
                    >
                        <span className="relative flex h-2 w-2 md:h-3 md:w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gov-gold opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-gov-gold pt-0"></span>
                        </span>
                        <span>{t('dir_title_compact')}</span>
                    </motion.div>

                    <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-gov-forest dark:text-white mb-3 md:mb-6 leading-tight drop-shadow-sm px-4">
                        {t('dir_subtitle_compact')}
                    </h2>

                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: 80 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4, ease: "circOut" }}
                        className="h-1 md:h-1.5 bg-gradient-to-r from-transparent via-gov-gold to-transparent mx-auto rounded-full md:w-[120px]"
                    />
                </motion.div>

                {/* Staggered Grid Layout */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto"
                >
                    {directorates.map((directorate, index) => (
                        <motion.div
                            key={directorate.id}
                            variants={cardVariants}
                            className={`transform ${index === 1 ? 'lg:-translate-y-8' : ''}`}
                        >
                            <DirectorateCard directorate={directorate} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-10 md:mt-20 relative z-10"
                >
                    <Link
                        href="/directorates"
                        className="group relative inline-flex items-center gap-2 md:gap-4 px-4 py-2 md:px-10 md:py-5 bg-white/10 dark:bg-dm-surface/30 backdrop-blur-md font-bold text-gov-forest dark:text-white rounded-[2rem] hover:text-white transition-colors duration-500 overflow-hidden shadow-lg md:shadow-xl border border-gov-gold/20"
                    >
                        {/* Animated Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-gov-forest via-gov-teal to-gov-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 w-1/4 bg-white/20 skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite] -z-10" />

                        {/* Glass Border */}
                        <div className="absolute inset-0 border border-gov-gold/30 rounded-[2rem] group-hover:border-transparent transition-colors duration-500 -z-10" />

                        <span className="text-[12px] md:text-[17px] tracking-wide relative z-10 font-extrabold">{language === 'ar' ? 'عرض دليل الجهات الكامل' : 'View Full Directorates Guide'}</span>

                        <div className="relative z-10 w-6 h-6 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gov-forest/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500 border border-current/10">
                            <motion.span
                                animate={{ x: language === 'ar' ? [-3, 3, -3] : [3, -3, 3] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                {language === 'ar' ? <ArrowLeft className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" /> : <ArrowRight className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" />}
                            </motion.span>
                        </div>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
