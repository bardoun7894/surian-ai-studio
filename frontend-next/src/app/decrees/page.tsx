"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import DOMPurify from "isomorphic-dompurify";
import {
  FileText,
  Download,
  Calendar,
  Scale,
  Loader2,
  Sparkles,
  X,
  ChevronDown,
  Building2,
  Eye,
  ExternalLink,
  Printer,
  Search,
} from "lucide-react";
import { API } from "@/lib/repository";
import { Decree, Directorate } from "@/types";
import { getLocalizedField } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { aiService } from "@/lib/aiService";
import FavoriteButton from "@/components/FavoriteButton";
import { useSearchParams } from "next/navigation";

// Type label mappings
const typeLabels: Record<string, { ar: string; en: string }> = {
  "مرسوم تشريعي": { ar: "مرسوم تشريعي", en: "Legislative Decree" },
  قانون: { ar: "قانون", en: "Law" },
  "قرار رئاسي": { ar: "قرار رئاسي", en: "Presidential Decree" },
  تعميم: { ar: "تعميم", en: "Circular" },
  decree: { ar: "مرسوم", en: "Decree" },
};

const MONTHS_AR = [
  "كانون الثاني",
  "شباط",
  "آذار",
  "نيسان",
  "أيار",
  "حزيران",
  "تموز",
  "آب",
  "أيلول",
  "تشرين الأول",
  "تشرين الثاني",
  "كانون الأول",
];
const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => currentYear - i);

export default function DecreesPage() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const lang = language as "ar" | "en";
  const searchParams = useSearchParams();
  const initializedRef = useRef(false);

  // Map slug names from header nav to actual directorate IDs
  const deptSlugMap: Record<string, string> = {
    industry: "d1",
    economy: "d2",
    trade: "d3",
    ministry: "ministry",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDirectorate, setFilterDirectorate] = useState<string>("all");
  const [decrees, setDecrees] = useState<Decree[]>([]);
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showDirDropdown, setShowDirDropdown] = useState(false);
  const [summaryModal, setSummaryModal] = useState<{
    isOpen: boolean;
    title: string;
    summary: string;
    loading: boolean;
  }>({
    isOpen: false,
    title: "",
    summary: "",
    loading: false,
  });
  // M7.12: Detail modal state
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    decree: Decree | null;
  }>({
    isOpen: false,
    decree: null,
  });

  const getTypeLabel = (type: string) => {
    const labels = typeLabels[type];
    if (labels) return isAr ? labels.ar : labels.en;
    return type;
  };

  // Format decree date with proper locale and fallback to year
  const formatDecreeDate = (decree: Decree) => {
    if (decree.date && decree.date !== 'null' && decree.date.length >= 8) {
      try {
        const d = new Date(decree.date);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString(isAr ? 'ar-SY' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        }
      } catch {}
    }
    // Fallback to year from metadata if date is invalid
    if (decree.year) {
      return isAr ? `عام ${decree.year}` : `Year ${decree.year}`;
    }
    return isAr ? 'غير محدد' : 'Not specified';
  };

  const handleAISummary = async (decree: Decree) => {
    const title = getLocalizedField(decree, "title", lang);
    setSummaryModal({ isOpen: true, title, summary: "", loading: true });
    try {
      const desc = getLocalizedField(decree, "description", lang);
      const textToSummarize = `${title}. ${desc}`;
      const summary = await aiService.summarize(textToSummarize, lang);
      setSummaryModal((prev) => ({ ...prev, summary, loading: false }));
    } catch (e) {
      setSummaryModal((prev) => ({
        ...prev,
        summary: isAr
          ? "فشل في إنشاء الملخص. يرجى المحاولة مرة أخرى."
          : "Failed to generate summary. Please try again.",
        loading: false,
      }));
    }
  };

  // M7.11: Download handler
  const handleDownload = (decree: Decree) => {
    if (decree.attachments && decree.attachments.length > 0) {
      // Download first attachment (usually the PDF)
      const attachment = decree.attachments[0];
      // Build correct download URL through Next.js proxy instead of using
      // backend's download_url which may point to incorrect host (localhost)
      const downloadUrl = `/api/v1/public/decrees/${decree.id}/attachments/${attachment.id}/download`;
      window.open(downloadUrl, "_blank");
    } else {
      // Fallback: if no attachments, show a message or open content in new window
      // For now, open the detail modal so user can see the full text
      setDetailModal({ isOpen: true, decree });
    }
  };



  // Print handler - opens a styled print window with decree content
  const handlePrint = (decree: Decree) => {
    const title = getLocalizedField(decree, "title", lang);
    const description = getLocalizedField(decree, "description", lang);
    const fullTextAr = decree.content_ar || "";
    const fullTextEn = decree.content_en || "";
    const fullText = isAr ? fullTextAr : (fullTextEn || fullTextAr);
    const typeLabel = getTypeLabel(decree.type);
    const dateStr = formatDecreeDate(decree);
    const dir = isAr ? "rtl" : "ltr";
    const langAttr = isAr ? "ar" : "en";
    const borderSide = isAr ? "right" : "left";
    const btnSide = isAr ? "left" : "right";

    const parts: string[] = [];
    parts.push("<!DOCTYPE html>");
    parts.push("<html lang=\"" + langAttr + "\" dir=\"" + dir + "\">");
    parts.push("<head>");
    parts.push("<meta charset=\"UTF-8\">");
    parts.push("<title>" + title + "</title>");
    parts.push("<style>");
    parts.push("@media print {");
    parts.push("  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }");
    parts.push("  .no-print { display: none !important; }");
    parts.push("  @page { margin: 2cm; size: A4; }");
    parts.push("}");
    parts.push("* { box-sizing: border-box; margin: 0; padding: 0; }");
    parts.push("body {");
    parts.push("  font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif;");
    parts.push("  line-height: 1.8;");
    parts.push("  color: #1a1a1a;");
    parts.push("  padding: 40px;");
    parts.push("  direction: " + dir + ";");
    parts.push("}");
    parts.push(".header {");
    parts.push("  text-align: center;");
    parts.push("  border-bottom: 3px double #1a5632;");
    parts.push("  padding-bottom: 20px;");
    parts.push("  margin-bottom: 30px;");
    parts.push("}");
    parts.push(".header h1 {");
    parts.push("  font-size: 18px;");
    parts.push("  color: #1a5632;");
    parts.push("  margin-bottom: 4px;");
    parts.push("}");
    parts.push(".header h2 {");
    parts.push("  font-size: 14px;");
    parts.push("  color: #666;");
    parts.push("  font-weight: normal;");
    parts.push("}");
    parts.push(".meta {");
    parts.push("  display: flex;");
    parts.push("  flex-wrap: wrap;");
    parts.push("  gap: 16px;");
    parts.push("  justify-content: center;");
    parts.push("  margin-bottom: 24px;");
    parts.push("  padding: 12px;");
    parts.push("  background: #f8f6f0;");
    parts.push("  border-radius: 8px;");
    parts.push("}");
    parts.push(".meta-item {");
    parts.push("  font-size: 13px;");
    parts.push("  color: #555;");
    parts.push("}");
    parts.push(".meta-item strong { color: #1a5632; }");
    parts.push(".doc-title {");
    parts.push("  font-size: 20px;");
    parts.push("  font-weight: bold;");
    parts.push("  color: #1a5632;");
    parts.push("  text-align: center;");
    parts.push("  margin-bottom: 20px;");
    parts.push("  padding: 12px;");
    parts.push("  border: 1px solid #e0ddd5;");
    parts.push("  border-radius: 8px;");
    parts.push("  background: #fafaf5;");
    parts.push("}");
    parts.push(".description {");
    parts.push("  font-size: 14px;");
    parts.push("  color: #444;");
    parts.push("  margin-bottom: 24px;");
    parts.push("  padding: 16px;");
    parts.push("  background: #f5f5f0;");
    parts.push("  border-radius: 8px;");
    parts.push("  border-" + borderSide + ": 4px solid #c4a94d;");
    parts.push("}");
    parts.push(".full-text-heading {");
    parts.push("  font-size: 16px;");
    parts.push("  font-weight: bold;");
    parts.push("  color: #1a5632;");
    parts.push("  margin-bottom: 12px;");
    parts.push("  padding-bottom: 8px;");
    parts.push("  border-bottom: 1px solid #e0ddd5;");
    parts.push("}");
    parts.push(".full-text {");
    parts.push("  font-size: 14px;");
    parts.push("  color: #333;");
    parts.push("  line-height: 2;");
    parts.push("}");
    parts.push(".full-text p { margin-bottom: 12px; }");
    parts.push(".print-btn {");
    parts.push("  position: fixed;");
    parts.push("  bottom: 20px;");
    parts.push("  " + btnSide + ": 20px;");
    parts.push("  padding: 12px 24px;");
    parts.push("  background: #1a5632;");
    parts.push("  color: white;");
    parts.push("  border: none;");
    parts.push("  border-radius: 8px;");
    parts.push("  cursor: pointer;");
    parts.push("  font-size: 14px;");
    parts.push("  font-weight: bold;");
    parts.push("  z-index: 1000;");
    parts.push("}");
    parts.push(".print-btn:hover { background: #145228; }");
    parts.push("</style>");
    parts.push("</head>");
    parts.push("<body>");
    parts.push("<div class=\"header\">");
    parts.push("<h1>" + (isAr ? "\u0627\u0644\u062c\u0645\u0647\u0648\u0631\u064a\u0629 \u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0627\u0644\u0633\u0648\u0631\u064a\u0629" : "Syrian Arab Republic") + "</h1>");
    parts.push("<h1>" + (isAr ? "\u0648\u0632\u0627\u0631\u0629 \u0627\u0644\u0627\u0642\u062a\u0635\u0627\u062f \u0648\u0627\u0644\u0635\u0646\u0627\u0639\u0629" : "Ministry of Economy and Industry") + "</h1>");
    parts.push("<h2>" + (isAr ? "Ministry of Economy and Industry" : "\u0648\u0632\u0627\u0631\u0629 \u0627\u0644\u0627\u0642\u062a\u0635\u0627\u062f \u0648\u0627\u0644\u0635\u0646\u0627\u0639\u0629") + "</h2>");
    parts.push("</div>");
    parts.push("<div class=\"meta\">");
    parts.push("<span class=\"meta-item\"><strong>" + (isAr ? "\u0627\u0644\u0646\u0648\u0639:" : "Type:") + "</strong> " + typeLabel + "</span>");
    parts.push("<span class=\"meta-item\"><strong>" + (isAr ? "\u0627\u0644\u0631\u0642\u0645:" : "Number:") + "</strong> " + (decree.number || "") + "</span>");
    parts.push("<span class=\"meta-item\"><strong>" + (isAr ? "\u0627\u0644\u062a\u0627\u0631\u064a\u062e:" : "Date:") + "</strong> " + dateStr + "</span>");
    parts.push("</div>");
    parts.push("<div class=\"doc-title\">" + title + "</div>");
    if (description) {
      parts.push("<div class=\"description\">" + description + "</div>");
    }
    if (fullText) {
      parts.push("<div class=\"full-text-heading\">" + (isAr ? "\u0627\u0644\u0646\u0635 \u0627\u0644\u0643\u0627\u0645\u0644" : "Full Text") + "</div>");
      parts.push("<div class=\"full-text\">" + fullText + "</div>");
    }
    parts.push("<button class=\"print-btn no-print\" onclick=\"window.print()\">" + (isAr ? "\u0637\u0628\u0627\u0639\u0629" : "Print") + "</button>");
    parts.push("<scr" + "ipt>");
    parts.push("window.onload = function() {");
    parts.push("  setTimeout(function() { window.print(); }, 500);");
    parts.push("};");
    parts.push("</scr" + "ipt>");
    parts.push("</body>");
    parts.push("</html>");

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(parts.join("\n"));
    printWindow.document.close();
  };

  // M7.12: Open detail modal
  const handleViewDetails = (decree: Decree) => {
    setDetailModal({ isOpen: true, decree });
  };

  // Read URL search params to apply filters from header navigation
  useEffect(() => {
    const deptParam = searchParams.get("dept");
    if (deptParam) {
      const resolved = deptSlugMap[deptParam] || deptParam;
      setFilterDirectorate(resolved);
    }
    initializedRef.current = true;
  }, [searchParams]);

  // Fetch directorates on mount
  useEffect(() => {
    const fetchDirectorates = async () => {
      try {
        const dirs = await API.directorates.getAll();
        setDirectorates(dirs);
      } catch (e) {
        console.error("Failed to fetch directorates", e);
      }
    };
    fetchDirectorates();
  }, []);

  useEffect(() => {
    const fetchDecrees = async () => {
      setLoading(true);
      try {
        const dirId =
          filterDirectorate !== "all" && filterDirectorate !== "ministry" ? filterDirectorate : undefined;
        const data = await API.decrees.search(searchTerm, filterType, dirId);
        setDecrees(data);
      } catch (e) {
        console.error("Failed to fetch decrees", e);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchDecrees();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterType, filterDirectorate]);

  // Filter type buttons
  const filterTypes = [
    { value: "all", ar: "الكل", en: "All" },
    { value: "مرسوم تشريعي", ar: "مرسوم تشريعي", en: "Legislative Decree" },
    { value: "قانون", ar: "قانون", en: "Law" },
    { value: "قرار رئاسي", ar: "قرار رئاسي", en: "Presidential Decree" },
    { value: "تعميم", ar: "تعميم", en: "Circular" },
  ];

  const filteredDecrees = decrees.filter((decree) => {
    const date = decree.date ? new Date(decree.date) : null;
    const isValidDate = date && !isNaN(date.getTime());
    const matchesMonth =
      selectedMonth === null || (isValidDate && date.getMonth() === selectedMonth);
    const matchesYear =
      selectedYear === null ||
      (isValidDate && date.getFullYear() === selectedYear) ||
      (decree.year && Number(decree.year) === selectedYear);
    return matchesMonth && matchesYear;
  });

  // Get directorate name helper
  const getDirectorateName = (dirId: string) => {
    const dir = directorates.find((d) => String(d.id) === String(dirId));
    if (!dir) return "";
    const name = dir.name;
    if (typeof name === "object" && name !== null) {
      return isAr ? (name as any).ar : (name as any).en;
    }
    return String(name);
  };

  // Get selected directorate display name
  const selectedDirName = useMemo(() => {
    if (filterDirectorate === "all")
      return isAr ? "جميع الجهات" : "All Departments";
    if (filterDirectorate === "ministry")
      return isAr ? "وزارة الاقتصاد والصناعة" : "Ministry of Economy and Industry";
    return (
      getDirectorateName(filterDirectorate) ||
      (isAr ? "جهة غير معروفة" : "Unknown")
    );
  }, [filterDirectorate, directorates, isAr]);

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
      <Navbar />

      <main className="flex-grow pt-16 md:pt-[5.75rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 pb-2 md:pb-4 animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-2 md:mb-4">
            <h2 className="text-2xl font-display font-bold text-gov-forest dark:text-gov-gold mb-2 md:mb-3 inline-flex items-center justify-center gap-2 w-full">
              <Scale size={26} className="text-gov-gold" />
              {isAr ? "القوانين والتشريعات" : "Laws & Legislation"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-white/70 max-w-2xl mx-auto">
              {isAr
                ? "البوابة الرسمية للوصول إلى كافة المراسيم التشريعية، القوانين، والقرارات الحكومية الصادرة في الجمهورية العربية السورية."
                : "The official portal for accessing all legislative decrees, laws, and government decisions issued in the Syrian Arab Republic."}
            </p>
          </div>

          {/* Filter Section */}
          <div className="mb-6 md:mb-8 bg-white dark:bg-dm-surface rounded-xl border border-gray-100 dark:border-gov-border/15 p-4 space-y-4">

            {/* Search Input */}
            <div className="relative max-w-[720px] mx-auto">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search size={16} className="text-gray-400 dark:text-white/40" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isAr ? "ابحث في القوانين والتشريعات..." : "Search laws and legislation..."}
                className="w-full ps-10 pe-4 py-2.5 rounded-lg border border-gray-200 dark:border-gov-border/20 bg-gray-50 dark:bg-white/5 text-sm text-gov-charcoal dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gov-teal/30 dark:focus:ring-gov-gold/30 focus:border-gov-teal dark:focus:border-gov-gold transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 hover:text-gray-600 dark:hover:text-white/70 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Group 1: Type of Legislation */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-white/50 mb-2 uppercase tracking-wide">
                {isAr ? "نوع التشريع" : "Type of Legislation"}
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {filterTypes.map((ft) => (
                  <button
                    key={ft.value}
                    onClick={() => setFilterType(ft.value)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                      filterType === ft.value
                        ? "bg-gov-emerald text-white border-gov-emerald shadow-sm"
                        : "text-gray-600 dark:text-white/70 border-gray-200 dark:border-gov-border/15 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-300 dark:hover:border-gov-border/25"
                    }`}
                  >
                    {isAr ? ft.ar : ft.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Group 2 & 3: Issuing Authority + Date (side by side on desktop) */}
            <div className="flex flex-col sm:flex-row gap-4">

              {/* Group 2: Issuing Authority */}
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-bold text-gray-500 dark:text-white/50 mb-2 uppercase tracking-wide">
                  {isAr ? "الجهة المصدرة" : "Issuing Authority"}
                </label>
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowDirDropdown(!showDirDropdown);
                      setShowMonthDropdown(false);
                      setShowYearDropdown(false);
                    }}
                    className={`w-full px-3.5 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-between gap-2 border ${
                      filterDirectorate !== "all"
                        ? "bg-gov-forest/5 dark:bg-gov-gold/10 text-gov-forest dark:text-gov-gold border-gov-forest/30 dark:border-gov-gold/30"
                        : "text-gray-500 dark:text-white/70 border-gray-200 dark:border-gov-border/15 hover:border-gray-300 dark:hover:border-gov-border/25"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Building2 size={14} className="shrink-0" />
                      <span className="truncate">
                        {filterDirectorate !== "all"
                          ? selectedDirName
                          : isAr
                            ? "جميع الجهات"
                            : "All Departments"}
                      </span>
                    </span>
                    <ChevronDown size={14} className="shrink-0" />
                  </button>
                  {showDirDropdown && (
                    <div className="absolute top-full mt-1 bg-white dark:bg-dm-surface rounded-xl shadow-xl border border-gray-200 dark:border-gov-border/15 py-1 w-full z-50 max-h-72 overflow-y-auto" style={{ overscrollBehaviorY: 'contain' }} onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setFilterDirectorate("all");
                          setShowDirDropdown(false);
                        }}
                        className={`w-full text-right rtl:text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${filterDirectorate === "all" ? "bg-gov-forest/10 dark:bg-gov-gold/20 text-gov-forest dark:text-gov-gold font-bold" : "text-gray-500"}`}
                      >
                        {isAr ? "جميع الجهات" : "All Departments"}
                      </button>
                      {/* Ministry of Economy and Industry - static option */}
                      <button
                        onClick={() => {
                          setFilterDirectorate("ministry");
                          setShowDirDropdown(false);
                        }}
                        className={`w-full text-right rtl:text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors font-bold ${filterDirectorate === "ministry" ? "bg-gov-forest/10 dark:bg-gov-gold/20 text-gov-forest dark:text-gov-gold" : "text-gov-forest dark:text-gov-gold"}`}
                      >
                        {isAr ? "وزارة الاقتصاد والصناعة" : "Ministry of Economy and Industry"}
                      </button>
                      <div className="border-b border-gray-100 dark:border-gov-border/15 my-1"></div>
                      {directorates.map((dir) => {
                        const dirName =
                          typeof dir.name === "object" && dir.name !== null
                            ? isAr
                              ? (dir.name as any).ar
                              : (dir.name as any).en
                            : String(dir.name);
                        return (
                          <button
                            key={dir.id}
                            onClick={() => {
                              setFilterDirectorate(String(dir.id));
                              setShowDirDropdown(false);
                            }}
                            className={`w-full text-right rtl:text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${String(filterDirectorate) === String(dir.id) ? "bg-gov-forest/10 dark:bg-gov-gold/20 text-gov-forest dark:text-gov-gold font-bold" : "text-gov-charcoal dark:text-white"}`}
                          >
                            {dirName}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Group 3: Date Filters */}
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-bold text-gray-500 dark:text-white/50 mb-2 uppercase tracking-wide">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={12} />
                    {isAr ? "التاريخ" : "Date"}
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  {/* Year Dropdown */}
                  <div className="relative flex-1">
                    <button
                      onClick={() => {
                        setShowYearDropdown(!showYearDropdown);
                        setShowMonthDropdown(false);
                        setShowDirDropdown(false);
                      }}
                      className={`w-full px-3.5 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-between gap-2 border ${
                        selectedYear !== null
                          ? "bg-gov-forest/5 dark:bg-gov-gold/10 text-gov-forest dark:text-gov-gold border-gov-forest/30 dark:border-gov-gold/30"
                          : "text-gray-500 dark:text-white/70 border-gray-200 dark:border-gov-border/15 hover:border-gray-300 dark:hover:border-gov-border/25"
                      }`}
                    >
                      <span className="truncate">
                        {selectedYear !== null
                          ? selectedYear
                          : isAr
                            ? "السنة"
                            : "Year"}
                      </span>
                      <ChevronDown size={14} className="shrink-0" />
                    </button>
                    {showYearDropdown && (
                      <div className="absolute top-full mt-1 bg-white dark:bg-dm-surface rounded-xl shadow-xl border border-gray-200 dark:border-gov-border/15 py-1 w-full z-50 max-h-64 overflow-y-auto" style={{ overscrollBehaviorY: 'contain' }} onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setSelectedYear(null);
                            setShowYearDropdown(false);
                          }}
                          className="w-full text-right rtl:text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500"
                        >
                          {isAr ? "الكل" : "All"}
                        </button>
                        {YEARS.map((y) => (
                          <button
                            key={y}
                            onClick={() => {
                              setSelectedYear(y);
                              setShowYearDropdown(false);
                            }}
                            className={`w-full text-right rtl:text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${selectedYear === y ? "bg-gov-forest/10 dark:bg-gov-gold/20 text-gov-forest dark:text-gov-gold font-bold" : "text-gov-charcoal dark:text-white"}`}
                          >
                            {y}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Month Dropdown */}
                  <div className="relative flex-1">
                    <button
                      onClick={() => {
                        setShowMonthDropdown(!showMonthDropdown);
                        setShowYearDropdown(false);
                        setShowDirDropdown(false);
                      }}
                      className={`w-full px-3.5 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-between gap-2 border ${
                        selectedMonth !== null
                          ? "bg-gov-forest/5 dark:bg-gov-gold/10 text-gov-forest dark:text-gov-gold border-gov-forest/30 dark:border-gov-gold/30"
                          : "text-gray-500 dark:text-white/70 border-gray-200 dark:border-gov-border/15 hover:border-gray-300 dark:hover:border-gov-border/25"
                      }`}
                    >
                      <span className="truncate">
                        {selectedMonth !== null
                          ? isAr
                            ? MONTHS_AR[selectedMonth]
                            : MONTHS_EN[selectedMonth]
                          : isAr
                            ? "الشهر"
                            : "Month"}
                      </span>
                      <ChevronDown size={14} className="shrink-0" />
                    </button>
                    {showMonthDropdown && (
                      <div className="absolute top-full mt-1 bg-white dark:bg-dm-surface rounded-xl shadow-xl border border-gray-200 dark:border-gov-border/15 py-1 w-full z-50 max-h-64 overflow-y-auto" style={{ overscrollBehaviorY: 'contain' }} onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setSelectedMonth(null);
                            setShowMonthDropdown(false);
                          }}
                          className="w-full text-right rtl:text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500"
                        >
                          {isAr ? "الكل" : "All"}
                        </button>
                        {(isAr ? MONTHS_AR : MONTHS_EN).map((m, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setSelectedMonth(i);
                              setShowMonthDropdown(false);
                            }}
                            className={`w-full text-right rtl:text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${selectedMonth === i ? "bg-gov-forest/10 dark:bg-gov-gold/20 text-gov-forest dark:text-gov-gold font-bold" : "text-gov-charcoal dark:text-white"}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: Clear Filters + Document Count */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gov-border/10">
              <div>
                {(selectedMonth !== null ||
                  selectedYear !== null ||
                  filterDirectorate !== "all" ||
                  filterType !== "all" ||
                  searchTerm !== "") && (
                  <button
                    onClick={() => {
                      setSelectedMonth(null);
                      setSelectedYear(null);
                      setFilterDirectorate("all");
                      setFilterType("all");
                      setSearchTerm("");
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-gov-cherry dark:text-red-400 hover:bg-gov-cherry/10 dark:hover:bg-red-400/15 transition-all flex items-center gap-1"
                  >
                    <X size={12} />
                    {isAr ? "مسح جميع الفلاتر" : "Clear All Filters"}
                  </button>
                )}
              </div>
              <span className="text-xs text-gray-400 dark:text-white/50 font-medium">
                {filteredDecrees.length} {isAr ? "وثيقة" : "documents"}
              </span>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-1.5">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-gov-teal" size={32} />
              </div>
            ) : filteredDecrees.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gov-card/10 rounded-xl border border-dashed border-gray-200 dark:border-gov-border/25">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 dark:text-white/70">
                  {isAr
                    ? "لا توجد وثائق مطابقة للبحث"
                    : "No documents match your search"}
                </p>
              </div>
            ) : (
              filteredDecrees.map((decree) => (
                <div
                  key={decree.id}
                  className="bg-white dark:bg-dm-surface px-4 py-3 rounded-xl border border-gray-100 dark:border-gov-border/15 hover:border-gov-gold/50 hover:shadow-md transition-all duration-300 group cursor-pointer"
                  onClick={() => handleViewDetails(decree)}
                >
                  <div className="flex flex-col md:flex-row gap-3 items-start">
                    {/* Icon Box */}
                    <div className="w-11 h-11 rounded-lg bg-gov-beige dark:bg-gov-gold/10 flex items-center justify-center text-gov-forest dark:text-gov-gold shrink-0 border border-gray-100 dark:border-gov-border/15 group-hover:bg-gov-forest group-hover:text-white transition-colors">
                      <FileText size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-bold ${
                            decree.type === "قانون"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : decree.type === "مرسوم تشريعي"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                : "bg-gray-100 text-gray-700 dark:bg-dm-surface dark:text-white/70"
                          }`}
                        >
                          {getTypeLabel(decree.type)}
                        </span>
                        <span className="text-xs font-bold text-gray-500 dark:text-white/70 bg-gray-50 dark:bg-white/10 px-2 py-1 rounded inline-flex items-center">
                          {isAr
                            ? `رقم ${decree.number}`
                            : `No. ${decree.number}`}
                        </span>
                        <span className="text-xs font-bold text-gray-500 dark:text-white/70 bg-gray-50 dark:bg-white/10 px-2 py-1 rounded inline-flex items-center">
                          {isAr ? `عام ${decree.date && !isNaN(new Date(decree.date).getTime()) ? new Date(decree.date).getFullYear() : decree.year}` : `Year ${decree.date && !isNaN(new Date(decree.date).getTime()) ? new Date(decree.date).getFullYear() : decree.year}`}
                        </span>
                        {/* Show directorate badge if available */}
                        {decree.directorate_name && (
                          <span className="text-xs font-bold text-gov-teal dark:text-gov-teal bg-gov-teal/10 dark:bg-gov-teal/20 px-2 py-1 rounded inline-flex items-center gap-1">
                            <Building2 size={10} />
                            {isAr
                              ? decree.directorate_name
                              : decree.directorate_name_en ||
                                decree.directorate_name}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-display font-bold text-gov-forest dark:text-gov-gold mb-0.5 group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors leading-snug">
                        {getLocalizedField(decree, "title", lang)}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-white/70 mb-1.5 leading-relaxed line-clamp-2">
                        {getLocalizedField(decree, "description", lang)}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-gray-400 leading-none">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>
                            {isAr
                              ? `تاريخ الصدور: ${formatDecreeDate(decree)}`
                              : `Issued: ${formatDecreeDate(decree)}`}
                          </span>
                        </div>
                        {decree.attachments &&
                          decree.attachments.length > 0 && (
                            <span className="text-gov-emerald dark:text-gov-emerald font-bold">
                              {isAr
                                ? `${decree.attachments.length} مرفق`
                                : `${decree.attachments.length} attachment(s)`}
                            </span>
                          )}
                      </div>
                    </div>

                    <div
                      className="self-center md:self-start flex items-center gap-1.5 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleViewDetails(decree)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gov-forest/10 text-gov-forest dark:bg-gov-gold/10 dark:text-gov-gold font-bold hover:bg-gov-forest hover:text-white dark:hover:bg-gov-gold dark:hover:text-gov-forest transition-all text-xs"
                      >
                        <Eye size={14} />
                        {isAr ? "التفاصيل" : "Details"}
                      </button>
                      <button
                        onClick={() => handleAISummary(decree)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gov-gold/10 text-gov-gold font-bold hover:bg-gov-gold hover:text-white transition-all text-xs"
                      >
                        <Sparkles size={14} />
                        {isAr ? "ملخص" : "Summary"}
                      </button>
                      <button
                        onClick={() => handlePrint(decree)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all text-xs bg-gov-beige dark:bg-gov-gold/10 text-gov-forest dark:text-gov-gold hover:bg-gov-forest hover:text-white dark:hover:bg-gov-gold dark:hover:text-gov-forest"
                        title={isAr ? "طباعة الوثيقة" : "Print document"}
                      >
                        <Printer size={14} />
                        {isAr ? "طباعة" : "Print"}
                      </button>
                      <FavoriteButton
                        contentType="law"
                        contentId={String(decree.id)}
                        size={16}
                        variant="default"
                        metadata={{
                          title: getLocalizedField(decree, "title", lang),
                          title_ar: getLocalizedField(decree, "title", "ar"),
                          title_en: getLocalizedField(decree, "title", "en"),
                          description: getLocalizedField(
                            decree,
                            "description",
                            lang,
                          ),
                          description_ar: getLocalizedField(
                            decree,
                            "description",
                            "ar",
                          ),
                          description_en: getLocalizedField(
                            decree,
                            "description",
                            "en",
                          ),
                          url: `/decrees`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FAQ Section */}
          <div className="mt-8 sm:mt-16 bg-white dark:bg-dm-surface rounded-2xl p-4 sm:p-8 border border-gray-100 dark:border-gov-border/15">
            <h2 className="text-lg sm:text-2xl font-display font-bold text-gov-forest dark:text-gov-gold mb-4 sm:mb-6">
              {isAr ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-3 sm:p-4 bg-gray-50 dark:bg-gov-card/10 rounded-xl text-sm sm:text-base font-bold text-gov-charcoal dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  {isAr
                    ? "كيف أبحث عن مرسوم معين؟"
                    : "How do I search for a specific decree?"}
                  <ChevronDown
                    size={16}
                    className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2 rtl:mr-2 rtl:ml-0 align-middle"
                  />
                </summary>
                <p className="p-3 sm:p-4 text-xs sm:text-sm text-gray-600 dark:text-white/70 leading-relaxed">
                  {isAr
                    ? "استخدم شريط البحث الموحد في أعلى الصفحة للبحث برقم المرسوم أو عنوانه أو سنة صدوره."
                    : "Use the unified search bar at the top of the page to search by decree number, title, or year of issuance."}
                </p>
              </details>
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-3 sm:p-4 bg-gray-50 dark:bg-gov-card/10 rounded-xl text-sm sm:text-base font-bold text-gov-charcoal dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  {isAr
                    ? "ما الفرق بين المرسوم التشريعي والقانون؟"
                    : "What is the difference between a legislative decree and a law?"}
                  <ChevronDown
                    size={16}
                    className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2 rtl:mr-2 rtl:ml-0 align-middle"
                  />
                </summary>
                <p className="p-3 sm:p-4 text-xs sm:text-sm text-gray-600 dark:text-white/70 leading-relaxed">
                  {isAr
                    ? "المرسوم التشريعي يصدر من رئيس الجمهورية ويكون له قوة القانون، بينما القانون يصدر من مجلس الشعب."
                    : "A legislative decree is issued by the President and has the force of law, while a law is issued by Parliament."}
                </p>
              </details>
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/faq"
                className="text-gov-teal dark:text-gov-gold font-bold text-xs sm:text-sm hover:underline"
              >
                {isAr ? "عرض جميع الأسئلة الشائعة ←" : "→ View all FAQs"}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* AI Summary Modal */}
      {summaryModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gov-border/15">
              <div className="flex items-center gap-2 text-gov-gold">
                <Sparkles size={20} />
                <h3 className="font-bold">
                  {isAr ? "ملخص ذكي للمرسوم" : "AI Decree Summary"}
                </h3>
              </div>
              <button
                onClick={() =>
                  setSummaryModal({
                    isOpen: false,
                    title: "",
                    summary: "",
                    loading: false,
                  })
                }
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-gov-charcoal dark:text-white mb-4 line-clamp-2">
                {summaryModal.title}
              </h4>
              {summaryModal.loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin text-gov-gold" size={32} />
                </div>
              ) : (
                <div className="bg-gov-beige/50 dark:bg-gov-card/10 rounded-xl p-4">
                  <p className="text-sm text-gray-700 dark:text-white/70 leading-relaxed">
                    {summaryModal.summary}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* M7.12: Decree Detail Modal */}
      {detailModal.isOpen && detailModal.decree && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setDetailModal({ isOpen: false, decree: null })}
        >
          <div
            className="bg-white dark:bg-dm-surface rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gov-border/15 shrink-0">
              <div className="inline-flex items-center gap-2">
                <Scale size={20} className="text-gov-gold shrink-0" />
                <h3 className="font-bold text-gov-forest dark:text-gov-gold">
                  {isAr ? "تفاصيل الوثيقة" : "Document Details"}
                </h3>
              </div>
              <button
                onClick={() => setDetailModal({ isOpen: false, decree: null })}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Meta Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    detailModal.decree.type === "قانون"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : detailModal.decree.type === "مرسوم تشريعي"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                        : "bg-gray-100 text-gray-700 dark:bg-dm-surface dark:text-white/70"
                  }`}
                >
                  {getTypeLabel(detailModal.decree.type)}
                </span>
                <span className="text-xs font-bold text-gray-500 dark:text-white/70 bg-gray-50 dark:bg-white/10 px-3 py-1.5 rounded-lg">
                  {isAr
                    ? `رقم ${detailModal.decree.number}`
                    : `No. ${detailModal.decree.number}`}
                </span>
                <span className="text-xs font-bold text-gray-500 dark:text-white/70 bg-gray-50 dark:bg-white/10 px-3 py-1.5 rounded-lg">
                  {isAr
                    ? `عام ${detailModal.decree.date && !isNaN(new Date(detailModal.decree.date).getTime()) ? new Date(detailModal.decree.date).getFullYear() : detailModal.decree.year}`
                    : `Year ${detailModal.decree.date && !isNaN(new Date(detailModal.decree.date).getTime()) ? new Date(detailModal.decree.date).getFullYear() : detailModal.decree.year}`}
                </span>
                <span className="text-xs font-bold text-gray-500 dark:text-white/70 bg-gray-50 dark:bg-white/10 px-3 py-1.5 rounded-lg inline-flex items-center gap-1">
                  <Calendar size={12} />
                  {formatDecreeDate(detailModal.decree)}
                </span>
              </div>

              {/* Directorate */}
              {detailModal.decree.directorate_name && (
                <div className="inline-flex items-center gap-2 mb-4 text-sm text-gov-teal dark:text-gov-teal">
                  <Building2 size={16} />
                  <span className="font-bold">
                    {isAr
                      ? detailModal.decree.directorate_name
                      : detailModal.decree.directorate_name_en ||
                        detailModal.decree.directorate_name}
                  </span>
                </div>
              )}

              {/* Title */}
              <h2 className="text-lg font-display font-bold text-gov-forest dark:text-gov-gold mb-4 leading-relaxed">
                {getLocalizedField(detailModal.decree, "title", lang)}
              </h2>

              {/* Description */}
              <div className="bg-gov-beige/50 dark:bg-gov-card/10 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-700 dark:text-white/70 leading-relaxed">
                  {getLocalizedField(detailModal.decree, "description", lang)}
                </p>
              </div>

              {/* Full Content */}
              {(detailModal.decree.content_ar ||
                detailModal.decree.content_en) && (
                <div className="mb-4">
                  <h4 className="font-bold text-gov-charcoal dark:text-white mb-2 text-sm">
                    {isAr ? "النص الكامل" : "Full Text"}
                  </h4>
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-white/80 leading-relaxed border border-gray-100 dark:border-gov-border/15 rounded-xl p-4 bg-white dark:bg-dm-bg/50"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        (isAr
                          ? detailModal.decree.content_ar
                          : detailModal.decree.content_en ||
                            detailModal.decree.content_ar) || ""
                      ),
                    }}
                  />
                </div>
              )}

              {/* Attachments */}
              {detailModal.decree.attachments &&
                detailModal.decree.attachments.length > 0 && (
                  <div className="mb-2">
                    <h4 className="font-bold text-gov-charcoal dark:text-white mb-2 text-sm">
                      {isAr ? "المرفقات" : "Attachments"}
                    </h4>
                    <div className="space-y-2">
                      {detailModal.decree.attachments.map((att) => (
                        <a
                          key={att.id}
                          href={`/api/v1/public/decrees/${detailModal.decree.id}/attachments/${att.id}/download`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-gov-beige/50 dark:bg-gov-card/10 rounded-xl hover:bg-gov-forest/10 dark:hover:bg-gov-gold/10 transition-colors group/att"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gov-forest/10 dark:bg-gov-gold/10 flex items-center justify-center">
                            <FileText
                              size={18}
                              className="text-gov-forest dark:text-gov-gold"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gov-charcoal dark:text-white truncate">
                              {att.file_name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {att.file_size
                                ? `${(att.file_size / 1024).toFixed(0)} KB`
                                : att.file_type}
                            </p>
                          </div>
                          <Download
                            size={16}
                            className="text-gov-forest dark:text-gov-gold opacity-50 group-hover/att:opacity-100 transition-opacity"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100 dark:border-gov-border/15 shrink-0">
              <button
                onClick={() => handleAISummary(detailModal.decree!)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gov-gold/10 text-gov-gold font-bold hover:bg-gov-gold hover:text-white transition-all text-sm"
              >
                <Sparkles size={16} />
                {isAr ? "ملخص ذكي" : "AI Summary"}
              </button>
              <div className="flex items-center gap-2">
                <button
                      onClick={() => handlePrint(detailModal.decree!)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gov-teal/10 text-gov-teal dark:bg-gov-teal/20 dark:text-gov-teal font-bold hover:bg-gov-teal hover:text-white transition-all text-sm"
                    >
                      <Printer size={16} />
                      {isAr ? "طباعة" : "Print"}
                    </button>
                {detailModal.decree.attachments &&
                  detailModal.decree.attachments.length > 0 && (
                    <button
                      onClick={() => handleDownload(detailModal.decree!)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gov-forest text-white dark:bg-gov-gold dark:text-gov-forest font-bold hover:opacity-90 transition-all text-sm"
                    >
                      <Download size={16} />
                      {isAr ? "تحميل PDF" : "Download PDF"}
                    </button>
                  )}
                <button
                  onClick={() =>
                    setDetailModal({ isOpen: false, decree: null })
                  }
                  className="px-4 py-2 rounded-lg text-gray-500 dark:text-white/70 font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-sm"
                >
                  {isAr ? "إغلاق" : "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
