import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Directorate } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import DirectorateCard from './DirectorateCard';
import { SkeletonCard } from '@/components/SkeletonLoader';

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
            <section className="py-12 bg-gov-beige/50 dark:bg-dm-bg relative overflow-hidden transition-colors">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="h-6 w-32 bg-gray-200 dark:bg-dm-surface rounded-full mx-auto mb-4 animate-pulse" />
                        <div className="h-10 w-64 bg-gray-200 dark:bg-dm-surface rounded mx-auto mb-3 animate-pulse" />
                        <div className="h-1 w-24 bg-gray-200 dark:bg-dm-surface rounded-full mx-auto animate-pulse" />
                    </div>
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-full md:w-[380px]">
                            <SkeletonCard className="h-64" />
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full">
                            <div className="w-full md:w-[380px]">
                                <SkeletonCard className="h-64" />
                            </div>
                            <div className="w-full md:w-[380px]">
                                <SkeletonCard className="h-64" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (directorates.length === 0) return null;

    // Reorder for triangular layout: [0] top, [1,2] bottom
    const topDirectorate = directorates[0];
    const bottomDirectorates = directorates.slice(1, 3);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const topCardVariants = {
        hidden: {
            opacity: 0,
            y: -50,
            scale: 0.8,
            rotateX: 15
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.8
            }
        }
    };

    const leftCardVariants = {
        hidden: {
            opacity: 0,
            x: -100,
            y: 50,
            scale: 0.8,
            rotate: -10
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.8
            }
        }
    };

    const rightCardVariants = {
        hidden: {
            opacity: 0,
            x: 100,
            y: 50,
            scale: 0.8,
            rotate: 10
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.8
            }
        }
    };

    return (
        <section id="featured-directorates" className="py-16 bg-gov-beige/50 dark:bg-dm-bg relative overflow-hidden scroll-mt-24">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        rotate: { duration: 60, repeat: Infinity, ease: "linear" },
                        scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-5"
                    style={{
                        background: 'radial-gradient(circle at 30% 30%, #b9a779 0%, transparent 50%)'
                    }}
                />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-gov-gold/20"
                        style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + (i % 3) * 20}%`
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{
                            duration: 3 + i * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.3
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gov-gold/10 text-gov-gold text-sm font-bold mb-4"
                    >
                        <span>{t('dir_title_compact')}</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gov-forest dark:text-gov-teal mb-3">
                        {t('dir_subtitle_compact')}
                    </h2>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: 96 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="h-1 bg-gov-gold mx-auto rounded-full"
                    />
                </motion.div>

                {/* Triangular Layout */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex flex-col items-center gap-6 md:gap-8"
                >
                    {/* Top Card */}
                    <motion.div
                        variants={topCardVariants}
                        whileHover={{
                            scale: 1.05,
                            y: -10,
                            transition: { type: "spring", stiffness: 300 }
                        }}
                        className="w-full md:w-[380px] perspective-1000"
                    >
                        <div className="relative">
                            {/* Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-gov-gold/20 via-gov-teal/20 to-gov-gold/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <DirectorateCard directorate={topDirectorate} />
                        </div>
                    </motion.div>

                    {/* Bottom Row */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full">
                        {bottomDirectorates.map((directorate, idx) => (
                            <motion.div
                                key={directorate.id}
                                variants={idx === 0 ? leftCardVariants : rightCardVariants}
                                whileHover={{
                                    scale: 1.05,
                                    y: -10,
                                    transition: { type: "spring", stiffness: 300 }
                                }}
                                className="w-full md:w-[380px] perspective-1000"
                            >
                                <div className="relative">
                                    {/* Glow Effect */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-gov-gold/20 via-gov-teal/20 to-gov-gold/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <DirectorateCard directorate={directorate} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Connection Lines (SVG) - Removed per user request */}
                {/* <svg ... /> removed */}
            </div>
        </section>
    );
}
