"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Investment, InvestmentStats } from '@/types';
import { API } from '@/lib/repository';
import { formatNumber } from '@/lib/utils';
import { TrendingUp, ArrowLeft, ArrowRight, Building2, CheckCircle, Wallet, Sparkles, Target, Briefcase } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SkeletonCard, SkeletonText } from '@/components/SkeletonLoader';

const iconMap: Record<string, any> = {
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



    fetchData();
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-gradient-to-r from-gov-gold to-gov-sand text-gov-forest border border-gov-gold/30";
      case "under_review":
        return "bg-gradient-to-r from-gov-teal/20 to-gov-teal/10 text-gov-teal border border-gov-teal/30";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  if (loading) {
    return (
        <section id="investments" className="py-10 md:py-16 relative overflow-hidden bg-gov-beige dark:bg-dm-bg">
            {/* Islamic Pattern Background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 20% 20%, #b9a779 0%, transparent 2%), 
                                     radial-gradient(circle at 80% 80%, #b9a779 0%, transparent 2%),
                                     radial-gradient(circle at 40% 60%, #094239 0%, transparent 2%)`,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-gradient-radial from-gov-gold/10 via-transparent to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gradient-radial from-gov-teal/10 via-transparent to-transparent rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10 md:mb-16"
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
            className="inline-block px-4 py-1.5 md:px-6 md:py-2 rounded-full bg-gov-gold/10 border border-gov-gold/30 text-gov-gold font-bold text-xs md:text-sm mb-3 md:mb-4"
          >
            {language === "ar" ? "فرص واعدة" : "Promising Opportunities"}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-gov-forest dark:text-gov-gold mb-3 md:mb-5 leading-tight"
          >
            {language === "ar" ? "استثمر في سوريا" : "Invest in Syria"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-sm md:text-base lg:text-lg text-gov-charcoal/70 dark:text-gov-gold/70 max-w-3xl mx-auto leading-relaxed"
          >
            {language === "ar"
              ? "اكتشف فرصاً استثمارية متنوعة في مختلف القطاعات الحيوية مع حوافز وتسهيلات غير مسبوقة."
              : "Discover diverse investment opportunities in various vital sectors with unprecedented incentives and facilities."}
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        {stats && stats.labels && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-12 md:mb-20 relative"
          >
            {/* Decorative background glow for the stats section */}
            <div className="absolute inset-0 bg-gradient-to-r from-gov-gold/5 via-gov-teal/5 to-gov-gold/5 blur-3xl rounded-2xl md:rounded-[2rem] -z-10" />

            {[
              {
                label:
                  stats.labels?.total_opportunities?.[
                    language as "ar" | "en"
                  ] ??
                  (language === "ar" ? "إجمالي الفرص" : "Total Opportunities"),
                value: stats.total_opportunities,
                icon: Building2,
                color: "text-gov-forest dark:text-white/90",
                bg: "bg-gov-forest/10 dark:bg-white/10",
                borderHover:
                  "group-hover:border-gov-forest/40 dark:group-hover:border-white/30",
                glowColor: "from-gov-forest/20 to-gov-teal/20",
              },
              {
                label:
                  stats.labels?.available_count?.[language as "ar" | "en"] ??
                  (language === "ar" ? "الفرص المتاحة" : "Available"),
                value: stats.available_count,
                icon: CheckCircle,
                color: "text-gov-gold dark:text-gov-gold",
                bg: "bg-gov-gold/10 dark:bg-gov-gold/10",
                borderHover:
                  "group-hover:border-gov-gold/50 dark:group-hover:border-gov-gold/40",
                glowColor: "from-gov-gold/20 to-amber-500/20",
              },
              {
                label:
                  stats.labels?.total_investment_value?.[
                    language as "ar" | "en"
                  ] ??
                  (language === "ar" ? "قيمة الاستثمار" : "Investment Value"),
                value: formatNumber(stats.total_investment_value),
                suffix: "$",
                icon: Wallet,
                color: "text-gov-teal dark:text-teal-400",
                bg: "bg-gov-teal/10 dark:bg-teal-400/10",
                borderHover:
                  "group-hover:border-gov-teal/50 dark:group-hover:border-teal-400/40",
                glowColor: "from-gov-teal/20 to-cyan-500/20",
              },
              {
                label:
                  stats.labels?.sectors_count?.[language as "ar" | "en"] ??
                  (language === "ar" ? "القطاعات" : "Sectors"),
                value: stats.sectors_count,
                icon: TrendingUp,
                color: "text-amber-600 dark:text-amber-400",
                bg: "bg-amber-600/10 dark:bg-amber-400/10",
                borderHover:
                  "group-hover:border-amber-600/50 dark:group-hover:border-amber-400/40",
                glowColor: "from-amber-600/20 to-orange-500/20",
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative group"
              >
                {/* Glow behind the stat card */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-br ${stat.glowColor} rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div
                  className={`relative bg-white/70 dark:bg-dm-surface/70 backdrop-blur-xl p-4 md:p-6 rounded-2xl border border-white/60 dark:border-white/10 ${stat.borderHover} shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.4)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.1)] overflow-hidden transition-all duration-500 h-full flex flex-col items-center text-center`}
                >
                  {/* Subtle internal shine */}
                  <div className="absolute top-0 right-0 w-20 md:w-28 h-20 md:h-28 bg-white/20 dark:bg-white/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700" />

                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-2.5 md:mb-4 group-hover:-translate-y-1 transition-transform duration-500 border border-current/10 shadow-inner`}
                  >
                    <stat.icon
                      size={20}
                      className="md:w-6 md:h-6"
                      strokeWidth={1.5}
                    />
                  </div>

                  <h3 className="text-lg md:text-3xl font-display font-extrabold text-gov-forest dark:text-white mb-1 tabular-nums tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gov-forest group-hover:to-gov-teal dark:group-hover:from-gov-gold dark:group-hover:to-white transition-all duration-300 drop-shadow-sm">
                    {stat.value}
                    {stat.suffix && (
                      <span className="text-xs md:text-base font-bold opacity-70 ml-1 align-top">
                        {stat.suffix}
                      </span>
                    )}
                  </h3>

                  <p className="text-[10px] md:text-[13px] text-gov-stone/80 dark:text-white/60 font-medium uppercase tracking-wider">
                    {stat.label}
                  </p>
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featured.map((item, idx) => {
            const Icon = iconMap[item.icon] || Building2;
            const title = language === "ar" ? item.title_ar : item.title_en;
            const description =
              language === "ar" ? item.description_ar : item.description_en;
            const sector = language === "ar" ? item.sector_ar : item.sector_en;
            const statusLabel =
              language === "ar"
                ? item.status === "available"
                  ? "متاح"
                  : "قيد المراجعة"
                : item.status === "available"
                  ? "Available"
                  : "Under Review";

            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="group relative h-full"
              >
                <Link
                  href={`/investment/${item.category || "opportunities"}`}
                  className="block h-full"
                >
                  <div className="relative h-full flex flex-col bg-white dark:bg-dm-surface rounded-xl overflow-hidden border border-gray-100 dark:border-gov-border/15 shadow-gold-sm hover:shadow-gov hover:-translate-y-1 transition-all duration-300">

                    {/* Image / Fallback Header */}
                    <div className="h-32 md:h-40 overflow-hidden relative">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gov-forest">
                          {/* Subtle pattern dots */}
                          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, #b9a779 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                          {/* Centered icon */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/15 transition-all duration-500">
                              <Icon size={28} className="text-gov-gold/70 md:w-8 md:h-8" strokeWidth={1.5} />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                      {/* Status badge - top right */}
                      <div className="absolute top-2 right-2 z-10">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded backdrop-blur-md border-l-2 ${item.status === "available" ? "bg-white/90 dark:bg-gov-forest/90 text-gov-forest dark:text-white border-gov-gold" : "bg-gray-100/90 text-gray-600 border-gray-400 dark:bg-gray-800/90 dark:text-gray-300"}`}>
                          {statusLabel}
                        </span>
                      </div>

                      {/* Sector badge - bottom */}
                      <div className="absolute bottom-2 left-2 rtl:left-auto rtl:right-2 z-10">
                        <div className="flex items-center gap-1 text-white bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium border border-white/10">
                          <Icon size={10} className="text-gov-gold" />
                          {sector}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 md:p-4 flex flex-col flex-grow">
                      <h3 className="text-sm font-bold text-gov-charcoal dark:text-white mb-1.5 leading-snug line-clamp-2 group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors">
                        {title}
                      </h3>

                      <p className="text-xs text-gray-500 dark:text-white/60 line-clamp-2 mb-3 flex-grow">
                        {description}
                      </p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="text-base md:text-lg lg:text-xl text-gov-charcoal/70 dark:text-gov-gold/70 max-w-3xl mx-auto leading-relaxed"
                    >
                        {language === 'ar'
                            ? 'اكتشف فرصاً استثمارية متنوعة في مختلف القطاعات الحيوية مع حوافز وتسهيلات غير مسبوقة.'
                            : 'Discover diverse investment opportunities in various vital sectors with unprecedented incentives and facilities.'}
                    </motion.p>
                </motion.div>

                {/* Stats Grid */}
                {stats && stats.labels && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-16 relative"
                    >
                        {/* Decorative background glow for the stats section */}
                        <div className="absolute inset-0 bg-gradient-to-r from-gov-gold/5 via-gov-teal/5 to-gov-gold/5 blur-3xl rounded-[2rem] md:rounded-[3rem] -z-10" />

                        {[
                            {
                                label: stats.labels?.total_opportunities?.[language as 'ar' | 'en'] ?? (language === 'ar' ? 'إجمالي الفرص' : 'Total Opportunities'),
                                value: stats.total_opportunities,
                                icon: Building2,
                                color: 'text-gov-forest dark:text-white/90',
                                bg: 'bg-gov-forest/10 dark:bg-white/10',
                                borderHover: 'group-hover:border-gov-forest/40 dark:group-hover:border-white/30',
                                glowColor: 'from-gov-forest/20 to-gov-teal/20'
                            },
                            {
                                label: stats.labels?.available_count?.[language as 'ar' | 'en'] ?? (language === 'ar' ? 'الفرص المتاحة' : 'Available'),
                                value: stats.available_count,
                                icon: CheckCircle,
                                color: 'text-gov-gold dark:text-gov-gold',
                                bg: 'bg-gov-gold/10 dark:bg-gov-gold/10',
                                borderHover: 'group-hover:border-gov-gold/50 dark:group-hover:border-gov-gold/40',
                                glowColor: 'from-gov-gold/20 to-amber-500/20'
                            },
                            {
                                label: stats.labels?.total_investment_value?.[language as 'ar' | 'en'] ?? (language === 'ar' ? 'قيمة الاستثمار' : 'Investment Value'),
                                value: formatNumber(stats.total_investment_value, language),
                                suffix: '$',
                                icon: Wallet,
                                color: 'text-gov-teal dark:text-teal-400',
                                bg: 'bg-gov-teal/10 dark:bg-teal-400/10',
                                borderHover: 'group-hover:border-gov-teal/50 dark:group-hover:border-teal-400/40',
                                glowColor: 'from-gov-teal/20 to-cyan-500/20'
                            },
                            {
                                label: stats.labels?.sectors_count?.[language as 'ar' | 'en'] ?? (language === 'ar' ? 'القطاعات' : 'Sectors'),
                                value: stats.sectors_count,
                                icon: TrendingUp,
                                color: 'text-amber-600 dark:text-amber-400',
                                bg: 'bg-amber-600/10 dark:bg-amber-400/10',
                                borderHover: 'group-hover:border-amber-600/50 dark:group-hover:border-amber-400/40',
                                glowColor: 'from-amber-600/20 to-orange-500/20'
                            },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="relative group"
                            >
                                {/* Glow behind the stat card */}
                                <div className={`absolute -inset-0.5 bg-gradient-to-br ${stat.glowColor} rounded-2xl md:rounded-3xl blur-md md:blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                <div className={`relative bg-white/70 dark:bg-dm-surface/70 backdrop-blur-xl p-4 md:p-8 rounded-2xl md:rounded-3xl border border-white/60 dark:border-white/10 ${stat.borderHover} shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.4)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.1)] overflow-hidden transition-all duration-500 h-full flex flex-col items-center text-center`}>

                                    {/* Subtle internal shine */}
                                    <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-white/20 dark:bg-white/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700" />

                                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[1.25rem] ${stat.bg} ${stat.color} flex items-center justify-center mb-3 md:mb-5 group-hover:-translate-y-1 transition-transform duration-500 border border-current/10 shadow-inner`}>
                                        <stat.icon size={24} className="md:w-8 md:h-8" strokeWidth={1.5} />
                                    </div>

                                    <h3 className="text-2xl md:text-5xl font-display font-extrabold text-gov-forest dark:text-white mb-1 md:mb-2 tabular-nums tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gov-forest group-hover:to-gov-teal dark:group-hover:from-gov-gold dark:group-hover:to-white transition-all duration-300 drop-shadow-sm">
                                        {stat.value}
                                        {stat.suffix && <span className="text-base md:text-2xl font-bold opacity-70 ml-1 align-top">{stat.suffix}</span>}
                                    </h3>

                                    <p className="text-[11px] md:text-[15px] text-gov-stone/80 dark:text-white/60 font-medium uppercase tracking-wider">{stat.label}</p>
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
                                whileHover={{ y: -8 }}
                                transition={{ duration: 0.3 }}
                                className="group relative h-full"
                            >
                                <Link href={`/investment/${item.category || 'opportunities'}`} className="block h-full">
                                    {/* Main Card Container */}
                                    <div className="relative h-full flex flex-col bg-white/70 dark:bg-dm-surface backdrop-blur-xl rounded-[1.5rem] border border-gov-gold/20 dark:border-white/10 shadow-lg group-hover:shadow-[0_20px_40px_rgba(185,167,121,0.15)] group-hover:border-gov-gold/40 transition-all duration-300 overflow-hidden">

                                        {/* Image Header */}
                                        <div className="h-40 md:h-56 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-gov-forest/90 to-gov-teal/90 flex items-center justify-center">
                                                    <Icon size={48} className="text-white/40 group-hover:scale-110 transition-transform duration-500 md:w-16 md:h-16" strokeWidth={1} />
                                                </div>
                                            )}

                                            {/* Subtle Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                                            <div className="absolute top-3 md:top-4 right-3 md:right-4 z-10 rtl:right-auto rtl:left-3 md:rtl:left-4">
                                                <div className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold backdrop-blur-md shadow-sm border ${item.status === 'available' ? 'bg-gov-gold/90 text-gov-forest border-gov-gold/20' : 'bg-gray-100/90 text-gray-700 border-gray-200 dark:bg-gray-800/90 dark:text-gray-300 dark:border-gray-600'}`}>
                                                    <div className="flex items-center gap-1 md:gap-1.5">
                                                        <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${item.status === 'available' ? 'bg-gov-forest' : 'bg-gray-400'}`} />
                                                        {statusLabel}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 rtl:left-auto rtl:right-3 md:rtl:right-4 z-10">
                                                <div className="flex items-center gap-1.5 md:gap-2 text-white bg-black/40 backdrop-blur-md px-2 py-1 md:px-3 md:py-1.5 rounded-lg border border-white/10">
                                                    <Icon size={14} className="text-gov-gold" />
                                                    <span className="text-[11px] md:text-sm font-medium">{sector}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content body */}
                                        <div className="p-4 md:p-6 lg:p-8 flex flex-col flex-grow relative z-10 bg-white/50 dark:bg-dm-surface/50">
                                            <h3 className="text-lg md:text-xl font-bold text-gov-forest dark:text-white mb-2 md:mb-3 group-hover:text-gov-teal transition-colors duration-300 line-clamp-2">
                                                {title}
                                            </h3>

                                            <p className="text-gov-stone/80 dark:text-white/70 text-xs md:text-[15px] mb-4 md:mb-6 line-clamp-3 md:leading-relaxed flex-grow">
                                                {description}
                                            </p>

                                            <div className="flex items-center justify-between pt-4 md:pt-5 border-t border-gray-100 dark:border-white/10 mt-auto">
                                                <div>
                                                    <span className="text-[10px] md:text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 block mb-1">
                                                        {language === 'ar' ? 'حجم الاستثمار' : 'Investment Value'}
                                                    </span>
                                                    <div className="flex items-baseline gap-1 md:gap-1.5">
                                                        <span className="font-bold text-gov-forest dark:text-gov-gold text-xl md:text-2xl">
                                                            {formatNumber(item.investment_amount || 0, language)}
                                                        </span>
                                                        <span className="text-[10px] md:text-xs font-bold text-gov-teal dark:text-gov-gold/70">{item.currency}</span>
                                                    </div>
                                                </div>

                                                {/* Arrow Button */}
                                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 dark:bg-white/5 border border-gov-gold/20 flex items-center justify-center group-hover:bg-gov-gold group-hover:border-transparent transition-all duration-300 group-hover:shadow-md group-hover:-rotate-45">
                                                    {language === 'ar'
                                                        ? <ArrowLeft size={16} className="text-gov-forest dark:text-white group-hover:text-gov-forest transition-colors md:w-[18px] md:h-[18px]" />
                                                        : <ArrowRight size={16} className="text-gov-forest dark:text-white group-hover:text-gov-forest transition-colors md:w-[18px] md:h-[18px]" />
                                                    }
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
                    className="text-center mt-8 md:mt-12 relative z-10"
                >
                    <Link
                        href="/investment"
                        className="group relative inline-flex items-center gap-3 md:gap-4 px-8 md:px-12 py-4 md:py-5 bg-gov-forest/5 dark:bg-dm-surface/40 backdrop-blur-md font-bold text-gov-forest dark:text-white rounded-[2rem] hover:text-white transition-colors duration-500 overflow-hidden shadow-xl hover:shadow-2xl border border-gov-gold/30"
                    >
                        {/* Animated Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-gov-forest via-gov-teal to-gov-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 w-1/4 bg-white/20 skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite] -z-10" />

                        {/* Glass Border */}
                        <div className="absolute inset-0 border border-gov-gold/30 rounded-[2rem] group-hover:border-transparent transition-colors duration-500 -z-10" />

                        <span className="text-[14px] md:text-[17px] tracking-wide relative z-10 font-extrabold">{language === 'ar' ? 'عرض كل الفرص' : 'View All Opportunities'}</span>

                        <div className="relative z-10 w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gov-forest/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500 border border-current/10">
                            <motion.span
                                animate={{ x: language === 'ar' ? [-3, 3, -3] : [3, -3, 3] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                {language === 'ar' ? <ArrowLeft size={15} className="md:w-[18px] md:h-[18px]" /> : <ArrowRight size={15} className="md:w-[18px] md:h-[18px]" />}
                            </motion.span>
                        </div>

                        <div className="inline-flex items-center text-xs font-bold text-gov-gold group/link">
                          {language === "ar" ? (
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                          ) : (
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          )}
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
          className="text-center mt-6 md:mt-10 relative z-10"
        >
          <Link
            href="/investment"
            className="group relative inline-flex items-center gap-2.5 md:gap-3 px-5 md:px-8 py-2.5 md:py-4 bg-white/10 dark:bg-dm-surface/30 backdrop-blur-md font-bold text-gov-forest dark:text-white rounded-2xl hover:text-white transition-colors duration-500 overflow-hidden shadow-xl border border-gov-gold/20"
          >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-gov-forest via-gov-teal to-gov-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

            {/* Shimmer Effect */}
            <div className="absolute inset-0 w-1/4 bg-white/20 skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite] -z-10" />

            {/* Glass Border */}
            <div className="absolute inset-0 border border-gov-gold/30 rounded-2xl group-hover:border-transparent transition-colors duration-500 -z-10" />

            <span className="text-[13px] md:text-[15px] tracking-wide relative z-10 font-extrabold">
              {language === "ar" ? "عرض كل الفرص" : "View All Opportunities"}
            </span>

            <div className="relative z-10 w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gov-forest/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500 border border-current/10">
              <motion.span
                animate={{ x: language === "ar" ? [-3, 3, -3] : [3, -3, 3] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {language === "ar" ? (
                  <ArrowLeft size={13} className="md:w-4 md:h-4" />
                ) : (
                  <ArrowRight size={13} className="md:w-4 md:h-4" />
                )}
              </motion.span>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
