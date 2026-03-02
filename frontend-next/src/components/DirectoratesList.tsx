"use client";

import React, { useState, useEffect } from "react";
import { API } from "@/lib/repository";
import { Directorate } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Building2,
  ArrowRight,
  ShieldAlert,
  Scale,
  HeartPulse,
  BookOpen,
  GraduationCap,
  Zap,
  Droplets,
  Plane,
  Wifi,
  Banknote,
  Map,
  Factory,
  Landmark,
  LayoutGrid,
  ChevronLeft,
  Search,
  Globe,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { SkeletonGrid } from "@/components/SkeletonLoader";
import { motion } from "framer-motion";
import ScrollAnimation from "@/components/ui/ScrollAnimation";

interface DirectoratesListProps {
  variant?: "full" | "compact";
}

const DirectoratesList: React.FC<DirectoratesListProps> = ({
  variant = "full",
}) => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dirs = await API.directorates.getAll();
        setDirectorates(dirs);
      } catch (error) {
        console.error("Failed to fetch directorates", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper: get localized name from an object with name field
  const getLocalizedName = (obj: any): string => {
    if (!obj) return "";
    const name = obj.name;
    if (name && typeof name === "object" && ("ar" in name || "en" in name)) {
      return language === "ar"
        ? name.ar || name.en || ""
        : name.en || name.ar || "";
    }
    const arVal = obj.name_ar || (typeof name === "string" ? name : "");
    const enVal = obj.name_en || "";
    return language === "en" && enVal ? enVal : arVal;
  };

  // Helper: get localized description
  const getLocalizedDesc = (obj: any): string => {
    if (!obj) return "";
    if (language === "en" && obj.description_en) return obj.description_en;
    const desc = obj.description;
    if (desc && typeof desc === "object" && ("ar" in desc || "en" in desc)) {
      return language === "ar"
        ? desc.ar || desc.en || ""
        : desc.en || desc.ar || "";
    }
    return obj.description || "";
  };

  const getIcon = (iconName: string, isCompact: boolean) => {
    const props = { size: isCompact ? 24 : 32 };
    switch (iconName) {
      case "ShieldAlert":
        return <ShieldAlert {...props} />;
      case "Scale":
        return <Scale {...props} />;
      case "HeartPulse":
        return <HeartPulse {...props} />;
      case "BookOpen":
        return <BookOpen {...props} />;
      case "GraduationCap":
        return <GraduationCap {...props} />;
      case "Zap":
        return <Zap {...props} />;
      case "Droplets":
        return <Droplets {...props} />;
      case "Plane":
        return <Plane {...props} />;
      case "Wifi":
        return <Wifi {...props} />;
      case "Banknote":
        return <Banknote {...props} />;
      case "Map":
        return <Map {...props} />;
      case "Factory":
        return <Factory {...props} />;
      default:
        return <Landmark {...props} />;
    }
  };

  const featuredDirectorates = directorates.filter(
    (dir) => dir.featured === true,
  );

  // Filter directorates by search term
  const filteredDirectorates = directorates.filter((dir) => {
    if (!searchTerm.trim()) return true;
    const name = getLocalizedName(dir).toLowerCase();
    const desc = getLocalizedDesc(dir).toLowerCase();
    return (
      name.includes(searchTerm.toLowerCase()) ||
      desc.includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${variant === "full" ? "py-16 min-h-screen" : "py-12"}`}
      >
        <SkeletonGrid
          cards={variant === "full" ? 3 : 6}
          className={
            variant === "full"
              ? "grid-cols-1"
              : "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
          }
        />
      </div>
    );
  }

  // COMPACT VARIANT (Used on Homepage)
  if (variant === "compact") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-center w-full">
            <h2 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-2 flex items-center gap-3 justify-center">
              <LayoutGrid className="text-gov-teal dark:text-gov-gold" />
              {t("dir_title_compact")}
            </h2>
            <p className="text-gov-stone/60 dark:text-white/70">
              {t("dir_subtitle_compact")}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:gap-6 items-stretch grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {featuredDirectorates.slice(0, 6).map((dir) => (
            <Link
              key={dir.id}
              href={`/directorates/${dir.id}`}
              className="group flex flex-col h-full bg-white dark:bg-dm-surface rounded-2xl border border-gray-100 dark:border-gov-border/15 shadow-sm hover:shadow-xl hover:border-gov-teal/30 dark:hover:border-gov-gold/30 transition-all duration-300 relative overflow-hidden backdrop-blur-sm cursor-pointer p-4 items-center text-center"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gov-teal to-gov-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex flex-col items-center mb-2 gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gov-beige dark:bg-white/10 flex items-center justify-center text-gov-teal dark:text-gov-gold group-hover:bg-gov-teal group-hover:text-white dark:group-hover:bg-gov-gold dark:group-hover:text-gov-forest transition-all duration-300 shadow-inner">
                  {getIcon(dir.icon, true)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gov-charcoal dark:text-white leading-tight group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors">
                    {getLocalizedName(dir)}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/directorates"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gov-teal dark:bg-gov-gold text-white dark:text-gov-forest font-bold rounded-xl hover:bg-gov-emerald dark:hover:bg-white transition-all shadow-lg hover:shadow-xl"
          >
            {t("view_all_dirs")}
            <ChevronLeft
              size={20}
              className={language === "ar" ? "" : "rotate-180"}
            />
          </Link>
        </div>
      </div>
    );
  }

  // FULL VARIANT (Sectioned Layout like Homepage)
  return (
    <div className="min-h-screen bg-gov-beige/30 dark:bg-dm-bg pb-20">
      {/* ═══════════════════════════════════════════════════ */}
      {/* SECTION 1: HERO BANNER                             */}
      {/* ═══════════════════════════════════════════════════ */}
      <section
        id="directorates-hero"
        className="bg-gov-forest text-white py-16 md:py-20 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/islamic-pattern.svg')] opacity-5 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gov-forest via-gov-emerald/90 to-gov-forest pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10 text-center animate-fade-in-up">
          <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm shadow-xl border border-white/20">
            <Landmark size={48} className="text-gov-gold" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 drop-shadow-md">
            {language === "ar"
              ? "وزارة الاقتصاد والصناعة"
              : "Ministry of Economy & Industry"}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-medium mb-8">
            {language === "ar"
              ? "الهيكل التنظيمي للوزارة وإداراتها العامة والمديريات الفرعية التابعة لها."
              : "The organizational structure of the ministry, its general administrations, and sub-directorates."}
          </p>
          <div className="flex items-center justify-center gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gov-gold mb-1">
                {directorates.length}
              </div>
              <div className="text-sm text-white/70">
                {language === "ar" ? "إدارة عامة" : "Departments"}
              </div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gov-gold mb-1">
                {directorates.reduce(
                  (acc, d) => acc + (d.subDirectorates?.length || 0),
                  0,
                )}
              </div>
              <div className="text-sm text-white/70">
                {language === "ar" ? "مديرية فرعية" : "Sub-Directorates"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* SECTION 2: SEARCH BAR                              */}
      {/* ═══════════════════════════════════════════════════ */}
      <section id="directorates-search" className="relative z-20 -mt-7">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-xl border border-gray-100 dark:border-gov-border/15 p-2">
            <div className="relative">
              <Search
                size={20}
                className="absolute top-1/2 -translate-y-1/2 start-4 text-gray-400 dark:text-white/40"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  language === "ar"
                    ? "ابحث عن إدارة أو مديرية..."
                    : "Search departments or directorates..."
                }
                className="w-full ps-12 pe-4 py-3.5 bg-transparent text-gov-charcoal dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* SECTION 3: DIRECTORATES HIERARCHY                  */}
      {/* ═══════════════════════════════════════════════════ */}
      <section
        id="directorates-list"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4"
      >
        <ScrollAnimation>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gov-forest/10 dark:bg-gov-gold/20 flex items-center justify-center">
              <Building2
                className="text-gov-forest dark:text-gov-gold"
                size={20}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gov-charcoal dark:text-white">
                {language === "ar"
                  ? "الإدارات العامة"
                  : "General Administrations"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-white/60">
                {language === "ar"
                  ? filteredDirectorates.length + " إدارة ومديرياتها التابعة"
                  : filteredDirectorates.length +
                    " departments and their affiliated directorates"}
              </p>
            </div>
          </div>
        </ScrollAnimation>

        {filteredDirectorates.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-dm-surface rounded-2xl border border-gray-100 dark:border-gov-border/15">
            <Search
              className="mx-auto text-gray-300 dark:text-white/20 mb-4"
              size={48}
            />
            <p className="text-gov-stone/60 dark:text-white/50 text-lg">
              {language === "ar"
                ? "لا توجد نتائج مطابقة"
                : "No matching results"}
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 px-4 py-2 text-sm font-bold text-gov-teal dark:text-gov-gold hover:underline"
            >
              {language === "ar" ? "مسح البحث" : "Clear search"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {filteredDirectorates.map((admin, index) => (
              <ScrollAnimation key={admin.id} delay={index * 0.05}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-dm-surface rounded-3xl shadow-xl border border-gray-100 dark:border-gov-border/15 overflow-hidden"
                >
                  {/* Administration Header */}
                  <div className="p-8 bg-gradient-to-r from-gov-beige/50 to-transparent dark:from-white/5 border-b border-gray-100 dark:border-gov-border/15 flex flex-col md:flex-row items-center md:items-start gap-6 relative">
                    <div className="absolute top-0 bottom-0 right-0 w-2 bg-gov-gold"></div>
                    <div className="w-20 h-20 rounded-2xl bg-gov-forest dark:bg-white/10 flex items-center justify-center text-gov-gold shadow-lg shrink-0">
                      {getIcon(admin.icon, false)}
                    </div>
                    <div className="text-center md:text-start flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-gov-charcoal dark:text-white mb-3">
                        {getLocalizedName(admin)}
                      </h2>
                      <p className="text-gov-stone dark:text-white/70 leading-relaxed max-w-3xl">
                        {getLocalizedDesc(admin)}
                      </p>
                    </div>
                    <Link
                      href={`/directorates/${admin.id}`}
                      className="shrink-0 mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 bg-gov-teal/10 hover:bg-gov-teal text-gov-teal hover:text-white dark:bg-gov-gold/10 dark:hover:bg-gov-gold dark:text-gov-gold dark:hover:text-gov-forest rounded-xl font-bold transition-all"
                    >
                      {language === "ar" ? "صفحة الإدارة" : "Department Page"}
                      <ArrowRight
                        size={18}
                        className={language === "ar" ? "rotate-180" : ""}
                      />
                    </Link>
                  </div>

                  {/* Sub-Directorates Grid */}
                  <div className="p-8">
                    <h3 className="text-lg font-bold text-gov-forest dark:text-white mb-6 flex items-center gap-2">
                      <Building2 className="text-gov-gold" size={20} />
                      {language === "ar"
                        ? "المديريات التابعة"
                        : "Affiliated Directorates"}
                    </h3>

                    {!admin.subDirectorates ||
                    admin.subDirectorates.length === 0 ? (
                      <p className="text-gov-stone/60 dark:text-white/50">
                        {language === "ar"
                          ? "لا توجد مديريات تابعة."
                          : "No sub-directorates found."}
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {admin.subDirectorates.map((sub) => (
                          <Link
                            key={sub.id}
                            href={
                              sub.isExternal
                                ? sub.url || "#"
                                : `/directorates/${admin.id}/${sub.id}`
                            }
                            target={sub.isExternal ? "_blank" : undefined}
                            rel={
                              sub.isExternal ? "noopener noreferrer" : undefined
                            }
                            className="group p-5 bg-gray-50 dark:bg-white/5 hover:bg-gov-gold/5 dark:hover:bg-gov-gold/10 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-gov-gold/50 transition-all flex items-start gap-4"
                          >
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-black/20 flex items-center justify-center text-gov-teal dark:text-gov-gold shadow-sm shrink-0">
                              <Building2 size={20} />
                            </div>
                            <div>
                              <h4 className="font-bold text-gov-charcoal dark:text-white group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors text-base line-clamp-2">
                                {getLocalizedName(sub)}
                              </h4>
                              {sub.isExternal && (
                                <span className="inline-block mt-2 text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                                  {language === "ar"
                                    ? "رابط خارجي"
                                    : "External"}
                                </span>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </ScrollAnimation>
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* SECTION 4: USEFUL LINKS                            */}
      {/* ═══════════════════════════════════════════════════ */}
      <section
        id="directorates-links"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <ScrollAnimation delay={0.2}>
          <div className="bg-gradient-to-br from-gov-forest to-gov-emerald dark:from-gov-brand dark:to-gov-forest rounded-2xl shadow-lg overflow-hidden p-8 md:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {language === "ar" ? "روابط مفيدة" : "Useful Links"}
              </h2>
              <p className="text-white/70">
                {language === "ar"
                  ? "استكشف المزيد من خدمات الوزارة"
                  : "Explore more ministry services"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/services"
                className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <FileText size={24} className="text-gov-gold" />
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-gov-gold transition-colors">
                    {language === "ar"
                      ? "الخدمات الإلكترونية"
                      : "Digital Services"}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {language === "ar"
                      ? "استعراض جميع الخدمات"
                      : "Browse all services"}
                  </p>
                </div>
              </Link>
              <Link
                href="/news"
                className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Globe size={24} className="text-gov-gold" />
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-gov-gold transition-colors">
                    {language === "ar"
                      ? "الأخبار والتحديثات"
                      : "News & Updates"}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {language === "ar"
                      ? "آخر أخبار الوزارة"
                      : "Latest ministry news"}
                  </p>
                </div>
              </Link>
              <Link
                href="/#complaints"
                className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Scale size={24} className="text-gov-gold" />
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-gov-gold transition-colors">
                    {language === "ar"
                      ? "الشكاوى والاقتراحات"
                      : "Complaints & Suggestions"}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {language === "ar"
                      ? "تقديم شكوى أو اقتراح"
                      : "Submit a complaint or suggestion"}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </ScrollAnimation>
      </section>
    </div>
  );
};

export default DirectoratesList;
