'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Lightbulb, ArrowLeft, ArrowRight, Sparkles, Target, TrendingUp, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SkeletonGrid, SkeletonText } from '@/components/SkeletonLoader';

const HomeSuggestionsSection = () => {
    const { t, language } = useLanguage();
    const isAr = language === 'ar';
    const [loading] = useState(false); // Add loading state if needed
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

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

    const features = [
        {
            icon: Target,
            title: isAr ? 'مقترحات موجهة' : 'Targeted Suggestions',
            desc: isAr ? 'تقديم أفكار محددة لتحسين الخدمات' : 'Submit specific ideas to improve services'
        },
        {
            icon: Users,
            title: isAr ? 'مشاركة مجتمعية' : 'Community Participation',
            desc: isAr ? 'ساهم في تطوير بيئة الأعمال' : 'Contribute to developing the business environment'
        },
        {
            icon: TrendingUp,
            title: isAr ? 'تطوير مستمر' : 'Continuous Development',
            desc: isAr ? 'متابعة تنفيذ المقترحات والنتائج' : 'Track implementation of suggestions and results'
        }
    ];

    // Loading skeleton
    if (loading) {
        return (
            <section className="py-24 relative overflow-hidden bg-gov-beige dark:bg-dm-bg">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <SkeletonText lines={1} className="max-w-20 mx-auto mb-6" />
                            <SkeletonText lines={2} className="max-w-3xl mx-auto" />
                        </div>
                        <SkeletonGrid cards={3} className="grid-cols-1 md:grid-cols-3 mb-12" />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section ref={ref} className="py-24 relative overflow-hidden bg-gov-beige dark:bg-dm-bg">
            {/* Top Separator */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gov-gold/30 to-transparent" />

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 30% 30%, #b9a779 0%, transparent 2%), 
                                     radial-gradient(circle at 70% 70%, #b9a779 0%, transparent 2%)`,
                    backgroundSize: '120px 120px'
                }} />
            </div>

            {/* Gradient Orbs */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-gradient-radial from-gov-gold/10 via-transparent to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-gov-teal/10 via-transparent to-transparent rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="max-w-5xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-16">
                        {/* Decorative Line */}
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={isInView ? { width: 60 } : {}}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="h-0.5 bg-gradient-to-r from-transparent to-gov-gold"
                            />
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={isInView ? { scale: 1 } : {}}
                                transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                                className="w-3 h-3 rotate-45 bg-gov-gold"
                            />
                            <motion.div
                                initial={{ width: 0 }}
                                animate={isInView ? { width: 60 } : {}}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="h-0.5 bg-gradient-to-l from-transparent to-gov-gold"
                            />
                        </div>

                        {/* Icon */}
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-gov-gold/20 to-gov-gold/5 text-gov-gold mb-6 border border-gov-gold/20"
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Lightbulb size={40} />
                            </motion.div>
                        </motion.div>

                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl md:text-4xl font-display font-bold text-gov-forest dark:text-gov-gold mb-6 leading-tight"
                        >
                            {isAr ? 'شاركنا أفكارك لتطوير المستقبل' : 'Share Your Ideas for Future Development'}
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="text-lg md:text-xl text-gov-charcoal/70 dark:text-gov-gold/70 max-w-3xl mx-auto leading-relaxed"
                        >
                            {isAr
                                ? 'نؤمن بأن الابتكار يبدأ بفكرة. شارك مقترحاتك ومشاريعك لتساهم معنا في تحسين بيئة الأعمال والخدمات.'
                                : 'We believe innovation starts with an idea. Share your suggestions and projects to help us improve the business environment and services.'}
                        </motion.p>
                    </div>

                    {/* Feature Cards */}
                    <motion.div
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                    >
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-gov-gold/20 to-gov-teal/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-gov-gold/10 dark:border-white/10 text-center hover:border-gov-gold/30 transition-colors h-full flex flex-col">
                                    <div className="w-14 h-14 rounded-xl bg-gov-gold/10 dark:bg-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <feature.icon size={28} className="text-gov-gold" />
                                    </div>
                                    <h3 className="font-bold text-gov-forest dark:text-gov-gold mb-2">{feature.title}</h3>
                                    <p className="text-sm text-gov-charcoal/60 dark:text-white/60 flex-grow">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                        variants={itemVariants}
                        className="text-center"
                    >
                        <Link
                            href="/suggestions"
                            className="group inline-flex items-center gap-3 px-10 py-5 bg-gov-forest dark:bg-gov-button text-white font-bold rounded-2xl hover:bg-gov-teal dark:hover:bg-gov-gold transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg"
                        >
                            <Sparkles size={22} className="group-hover:animate-pulse" />
                            <span>{isAr ? 'مشاركة مقترح' : 'Submit Suggestion'}</span>
                            <motion.span
                                animate={{ x: isAr ? [-3, 3, -3] : [3, -3, 3] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                {isAr ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                            </motion.span>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom Separator */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gov-gold/30 to-transparent" />
        </section>
    );
};

export default HomeSuggestionsSection;
