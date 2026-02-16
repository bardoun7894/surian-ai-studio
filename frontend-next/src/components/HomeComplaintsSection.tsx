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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <section ref={ref} className="py-24 relative overflow-hidden bg-gov-forest dark:bg-gov-charcoal">
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
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
                            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight"
                        >
                            {t('complaints_section_title') || (isAr ? 'صوتك مسموع' : 'Your Voice Matters')}
                        </motion.h2>

                        <motion.p 
                            variants={itemVariants}
                            className="text-white/70 text-lg md:text-xl mb-10 leading-relaxed max-w-xl"
                        >
                            {t('complaints_section_desc') || (isAr ?
                                'منصة رقمية آمنة تتيح لك تقديم الشكاوى ومتابعتها بكل شفافية وفاعلية لضمان حقوقك وتحسين جودة الخدمات.' :
                                'A secure digital platform allowing you to submit and track complaints with transparency and efficiency to ensure your rights and improve service quality.')}
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/complaints"
                                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gov-gold text-gov-forest font-bold rounded-2xl hover:bg-white transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg"
                            >
                                <MessageSquareWarning size={22} />
                                <span>{t('submit_complaint') || (isAr ? 'تقديم شكوى' : 'Submit Complaint')}</span>
                                <motion.span
                                    animate={{ x: isAr ? [-3, 3, -3] : [3, -3, 3] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    {isAr ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                                </motion.span>
                            </Link>

                            <Link
                                href="/complaints/track"
                                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 text-lg"
                            >
                                <FileCheck size={22} />
                                <span>{t('track_complaint') || (isAr ? 'متابعة طلب' : 'Track Request')}</span>
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
                        <div className="grid grid-cols-1 gap-6">
                            {/* Main Stat Card */}
                            <motion.div 
                                variants={itemVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-gov-gold/30 to-gov-teal/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gov-gold/20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-16 h-16 rounded-2xl bg-gov-gold/20 flex items-center justify-center">
                                                <CheckCircle size={32} className="text-gov-gold" />
                                            </div>
                                            <div>
                                                <div className="text-5xl font-display font-bold text-gov-gold">100%</div>
                                                <div className="text-white/60 text-sm font-medium">
                                                    {t('complaints_stat') || (isAr ? 'نسبة الاستجابة' : 'Response Rate')}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-white/70 text-sm">
                                            {isAr ? 'نسبة الاستجابة للشكاوى الواردة' : 'Response rate to incoming complaints'}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Secondary Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div 
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                    className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10"
                                >
                                    <Clock size={24} className="text-gov-teal mb-3" />
                                    <div className="text-2xl font-bold text-white mb-1">24/7</div>
                                    <div className="text-white/50 text-sm">
                                        {isAr ? 'دعم مستمر' : '24/7 Support'}
                                    </div>
                                </motion.div>

                                <motion.div 
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                    className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10"
                                >
                                    <Users size={24} className="text-gov-gold mb-3" />
                                    <div className="text-2xl font-bold text-white mb-1">+50K</div>
                                    <div className="text-white/50 text-sm">
                                        {isAr ? 'شكوى تم حلها' : 'Complaints Resolved'}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HomeComplaintsSection;
