'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { MessageSquareWarning, ArrowLeft, ArrowRight, ShieldAlert, FileCheck, CheckCircle, Clock, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SkeletonGrid, SkeletonList, SkeletonText } from '@/components/SkeletonLoader';

const HomeComplaintsSection = () => {
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

    // Loading skeleton
    if (loading) {
        return (
            <section className="py-24 relative overflow-hidden bg-gov-forest dark:bg-gov-charcoal">
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div className="space-y-6">
                            <SkeletonText lines={1} />
                            <SkeletonText lines={2} />
                            <SkeletonText lines={3} />
                            <div className="flex gap-4 pt-4">
                                <SkeletonText lines={1} className="w-40" />
                                <SkeletonText lines={1} className="w-40" />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <SkeletonList rows={1} />
                            <SkeletonGrid cards={2} className="grid-cols-2 gap-4" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section ref={ref} className="py-12 md:py-24 relative overflow-hidden bg-gov-forest dark:bg-gov-charcoal">
            {/* Islamic Pattern Background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 20% 20%, #b9a779 0%, transparent 2%), 
                                     radial-gradient(circle at 80% 80%, #b9a779 0%, transparent 2%),
                                     radial-gradient(circle at 40% 60%, #ffffff 0%, transparent 2%)`,
                    backgroundSize: '100px 100px'
                }} />
            </div>

            {/* Gradient Orbs */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-gov-gold/20 via-transparent to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-gov-teal/20 via-transparent to-transparent rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-16">
                    {/* Left Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="w-full lg:w-1/2"
                    >
                        {/* Decorative Line */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={isInView ? { width: 60 } : {}}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="h-0.5 bg-gradient-to-r from-gov-gold to-transparent mb-6"
                        />

                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gov-gold/20 text-gov-gold text-sm font-bold mb-6 border border-gov-gold/30"
                        >
                            <ShieldAlert size={16} />
                            <span>{t('complaints_section_badge') || (isAr ? 'خدمة المواطن' : 'Citizen Service')}</span>
                        </motion.div>

                        <motion.h2
                            variants={itemVariants}
                            className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-4 md:mb-6 leading-tight"
                        >
                            {t('complaints_section_title') || (isAr ? 'صوتك مسموع' : 'Your Voice Matters')}
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="text-white/70 text-base md:text-lg lg:text-xl mb-8 md:mb-10 leading-relaxed max-w-xl"
                        >
                            {t('complaints_section_desc') || (isAr ?
                                'منصة رقمية آمنة تتيح لك تقديم الشكاوى ومتابعتها بكل شفافية وفاعلية لضمان حقوقك وتحسين جودة الخدمات.' :
                                'A secure digital platform allowing you to submit and track complaints with transparency and efficiency to ensure your rights and improve service quality.')}
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                            {/* Submit Complaint Button */}
                            <Link
                                href="/complaints"
                                className="group relative inline-flex items-center justify-center gap-3 md:gap-4 px-6 md:px-8 py-3 md:py-4 bg-white/10 dark:bg-dm-surface/30 backdrop-blur-md font-bold text-white rounded-2xl md:rounded-3xl hover:text-white transition-colors duration-500 overflow-hidden shadow-xl w-full sm:w-auto"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-gov-forest via-gov-teal to-gov-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                                <div className="absolute inset-0 w-1/4 bg-white/20 skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite] -z-10" />
                                <div className="absolute inset-0 border border-gov-gold/30 rounded-2xl md:rounded-3xl group-hover:border-transparent transition-colors duration-500 -z-10" />

                                <span className="text-[15px] md:text-[17px] tracking-wide relative z-10 font-extrabold">{t('submit_complaint') || (isAr ? 'تقديم شكوى' : 'Submit Complaint')}</span>

                                <div className="relative z-10 w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gov-forest/20 dark:bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500 border border-current/10">
                                    <MessageSquareWarning size={18} className="md:w-5 md:h-5" />
                                </div>
                            </Link>

                            {/* Track Request Button */}
                            <Link
                                href="/complaints/track"
                                className="group relative inline-flex items-center justify-center gap-3 md:gap-4 px-6 md:px-8 py-3 md:py-4 bg-transparent border-2 border-white/20 dark:border-white/10 backdrop-blur-md font-bold text-white hover:border-gov-gold/50 rounded-2xl md:rounded-3xl hover:text-white transition-all duration-500 overflow-hidden w-full sm:w-auto mt-2 sm:mt-0"
                            >
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                                <div className="absolute inset-0 border border-transparent group-hover:border-gov-gold/30 rounded-2xl md:rounded-3xl transition-colors duration-500 -z-10" />

                                <span className="text-[15px] md:text-[17px] tracking-wide relative z-10 font-extrabold">{t('track_complaint') || (isAr ? 'متابعة طلب' : 'Track Request')}</span>

                                <div className="relative z-10 w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-gov-gold/20 transition-colors duration-500 border border-current/10">
                                    <FileCheck size={18} className="md:w-5 md:h-5" />
                                </div>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right Content - Stats Cards */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="w-full lg:w-5/12"
                    >
                        <div className="grid grid-cols-3 gap-4">
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="bg-white/10 backdrop-blur-sm p-4 md:p-5 rounded-2xl border border-white/15 text-center"
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gov-gold/20 flex items-center justify-center mx-auto mb-2 md:mb-3">
                                    <CheckCircle size={20} className="text-gov-gold md:w-6 md:h-6" />
                                </div>
                                <div className="text-xl md:text-2xl font-display font-bold text-gov-gold mb-1">100%</div>
                                <div className="text-white/60 text-[10px] md:text-xs">
                                    {isAr ? 'نسبة الاستجابة' : 'Response Rate'}
                                </div>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="bg-white/10 backdrop-blur-sm p-4 md:p-5 rounded-2xl border border-white/15 text-center"
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gov-teal/20 flex items-center justify-center mx-auto mb-2 md:mb-3">
                                    <Clock size={20} className="text-gov-teal md:w-6 md:h-6" />
                                </div>
                                <div className="text-xl md:text-2xl font-display font-bold text-white mb-1">24/7</div>
                                <div className="text-white/60 text-[10px] md:text-xs">
                                    {isAr ? 'دعم مستمر' : '24/7 Support'}
                                </div>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="bg-white/10 backdrop-blur-sm p-4 md:p-5 rounded-2xl border border-white/15 text-center"
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gov-gold/20 flex items-center justify-center mx-auto mb-2 md:mb-3">
                                    <Users size={20} className="text-gov-gold md:w-6 md:h-6" />
                                </div>
                                <div className="text-xl md:text-2xl font-display font-bold text-white mb-1">+50K</div>
                                <div className="text-white/60 text-[10px] md:text-xs">
                                    {isAr ? 'شكوى تم حلها' : 'Resolved'}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HomeComplaintsSection;
