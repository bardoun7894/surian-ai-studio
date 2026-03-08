"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { API } from "@/lib/repository";
import { InvestmentApplication } from "@/types";
import {
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  Banknote,
  FileText,
  Briefcase,
} from "lucide-react";
import Link from "next/link";

const translations = {
  ar: {
    title: "تتبع طلب الاستثمار",
    subtitle: "أدخل رقم التتبع لمعرفة حالة طلبك",
    trackingNumber: "رقم التتبع",
    placeholder: "INV-XXXXXXXX-XXXXX",
    search: "بحث",
    searching: "جاري البحث...",
    notFound: "لم يتم العثور على الطلب. يرجى التحقق من رقم التتبع.",
    status: "الحالة",
    applicant: "مقدم الطلب",
    company: "الشركة",
    proposedAmount: "المبلغ المقترح",
    linkedOpportunity: "الفرصة المرتبطة",
    staffNotes: "ملاحظات الإدارة",
    submittedAt: "تاريخ التقديم",
    lastUpdate: "آخر تحديث",
    applyNow: "تقديم طلب جديد",
    generalApplication: "طلب عام",
  },
  en: {
    title: "Track Investment Application",
    subtitle: "Enter your tracking number to check your application status",
    trackingNumber: "Tracking Number",
    placeholder: "INV-XXXXXXXX-XXXXX",
    search: "Search",
    searching: "Searching...",
    notFound: "Application not found. Please check the tracking number.",
    status: "Status",
    applicant: "Applicant",
    company: "Company",
    proposedAmount: "Proposed Amount",
    linkedOpportunity: "Linked Opportunity",
    staffNotes: "Staff Notes",
    submittedAt: "Submitted",
    lastUpdate: "Last Updated",
    applyNow: "Submit New Application",
    generalApplication: "General Application",
  },
};

const statusColors: Record<string, string> = {
  received: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  under_review:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  needs_more_info:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  approved:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function InvestmentTrackPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const searchParams = useSearchParams();

  const [trackingNumber, setTrackingNumber] = useState(
    searchParams.get("number") || "",
  );
  const [application, setApplication] = useState<InvestmentApplication | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (searchParams.get("number")) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    if (!trackingNumber.trim()) return;
    setLoading(true);
    setError(false);
    setSearched(true);
    try {
      const result = await API.investmentApplications.track(
        trackingNumber.trim(),
      );
      if (result) {
        setApplication(result);
      } else {
        setApplication(null);
        setError(true);
      }
    } catch {
      setApplication(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
      <Navbar />
      <main className="flex-grow py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gov-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="text-gov-teal" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gov-charcoal dark:text-white mb-2">
              {t.title}
            </h1>
            <p className="text-gray-600 dark:text-white/70">{t.subtitle}</p>
          </div>

          {/* Search Box */}
          <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-lg p-6 mb-6">
            <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
              {t.trackingNumber}
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder={t.placeholder}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gov-border/25 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:border-gov-teal focus:outline-none transition-colors font-mono"
                dir="ltr"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={loading || !trackingNumber.trim()}
                className="px-6 py-3 bg-gov-teal text-white font-bold rounded-xl hover:bg-gov-emerald transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Search size={18} />
                )}
                {loading ? t.searching : t.search}
              </button>
            </div>
          </div>

          {/* Not Found */}
          {searched && error && !loading && (
            <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-lg p-8 text-center">
              <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
              <p className="text-gray-600 dark:text-white/70">{t.notFound}</p>
            </div>
          )}

          {/* Result */}
          {application && !loading && (
            <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-lg p-8 space-y-6">
              {/* Tracking Number & Status */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-white/60">
                    {t.trackingNumber}
                  </p>
                  <p className="text-xl font-bold font-mono text-gov-charcoal dark:text-white">
                    {application.tracking_number}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold ${statusColors[application.status] || statusColors.received}`}
                >
                  {application.status_label
                    ? language === "ar"
                      ? application.status_label.ar
                      : application.status_label.en
                    : application.status}
                </span>
              </div>

              <hr className="border-gray-100 dark:border-gov-border/15" />

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Building2
                    className="text-gray-400 mt-0.5 flex-shrink-0"
                    size={18}
                  />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-white/60">
                      {t.company}
                    </p>
                    <p className="text-sm font-bold text-gov-charcoal dark:text-white">
                      {application.company_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Banknote
                    className="text-gray-400 mt-0.5 flex-shrink-0"
                    size={18}
                  />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-white/60">
                      {t.proposedAmount}
                    </p>
                    <p className="text-sm font-bold text-gov-charcoal dark:text-white">
                      ${Number(application.proposed_amount).toLocaleString()}
                    </p>
                  </div>
                </div>
                {application.investment && (
                  <div className="flex items-start gap-3">
                    <Briefcase
                      className="text-gray-400 mt-0.5 flex-shrink-0"
                      size={18}
                    />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-white/60">
                        {t.linkedOpportunity}
                      </p>
                      <p className="text-sm font-bold text-gov-charcoal dark:text-white">
                        {language === "ar"
                          ? application.investment.title_ar
                          : application.investment.title_en}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Clock
                    className="text-gray-400 mt-0.5 flex-shrink-0"
                    size={18}
                  />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-white/60">
                      {t.submittedAt}
                    </p>
                    <p className="text-sm font-bold text-gov-charcoal dark:text-white">
                      {new Date(application.created_at).toLocaleDateString(
                        language === "ar" ? "ar-SY" : "en-US",
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Staff Notes */}
              {application.staff_notes && (
                <>
                  <hr className="border-gray-100 dark:border-gov-border/15" />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="text-gray-400" size={16} />
                      <p className="text-sm font-bold text-gov-charcoal dark:text-white">
                        {t.staffNotes}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-white/70 bg-gray-50 dark:bg-white/5 rounded-xl p-4 whitespace-pre-wrap">
                      {application.staff_notes}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Apply Link */}
          <div className="text-center mt-6">
            <Link
              href="/investment/apply"
              className="text-gov-teal hover:underline font-bold text-sm"
            >
              {t.applyNow}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
