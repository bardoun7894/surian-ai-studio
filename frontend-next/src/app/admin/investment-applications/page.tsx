"use client";

import React, { useState, useEffect } from "react";
import { API } from "@/lib/repository";
import { InvestmentApplication } from "@/types";
import { AlertCircle, Filter, Search } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { TableRowSkeleton } from "@/components/Skeleton";
import { SkeletonText } from "@/components/SkeletonLoader";

const statusColors: Record<string, string> = {
  received: "bg-blue-100 text-blue-700",
  under_review: "bg-yellow-100 text-yellow-700",
  needs_more_info: "bg-orange-100 text-orange-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, { ar: string; en: string }> = {
  received: { ar: "واردة", en: "Received" },
  under_review: { ar: "قيد المراجعة", en: "Under Review" },
  needs_more_info: { ar: "يحتاج معلومات إضافية", en: "Needs More Info" },
  approved: { ar: "مقبول", en: "Approved" },
  rejected: { ar: "مرفوض", en: "Rejected" },
};

const filterTabs = [
  "all",
  "received",
  "under_review",
  "needs_more_info",
  "approved",
  "rejected",
] as const;

export default function AdminInvestmentApplicationsPage() {
  const { language } = useLanguage();
  const [applications, setApplications] = useState<InvestmentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const perPage = 15;

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: any = { page: currentPage, per_page: perPage };
        if (filter !== "all") params.status = filter;
        if (search.trim()) params.search = search.trim();

        const result = await API.staffInvestmentApplications.listAll(params);
        setApplications(result.data);
        setTotalPages(result.last_page || 1);
        setTotal(result.total || 0);
      } catch (e) {
        console.error("Failed to fetch investment applications", e);
        setApplications([]);
        setError(
          language === "ar"
            ? "فشل في تحميل طلبات الاستثمار. يرجى المحاولة مرة أخرى."
            : "Failed to load investment applications. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [filter, currentPage, language, search]);

  const getStatusBadge = (status: string) => {
    const colors = statusColors[status] || "bg-gray-100 text-gray-700";
    const label = statusLabels[status]?.[language] || status;
    return (
      <span className={`px-2 py-1 ${colors} rounded text-xs font-bold`}>
        {label}
      </span>
    );
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat(language === "ar" ? "ar-SY" : "en-US").format(
      amount,
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gov-charcoal dark:text-white mb-2">
            {language === "ar" ? "طلبات الاستثمار" : "Investment Applications"}
          </h1>
          <p className="text-gray-500 dark:text-white/70">
            {language === "ar"
              ? `إجمالي ${total} طلب`
              : `${total} total applications`}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setFilter(tab);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              filter === tab
                ? "bg-gov-forest dark:bg-gov-button text-white"
                : "bg-white dark:bg-gov-card/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white hover:bg-gray-50 dark:hover:bg-white/10"
            }`}
          >
            {tab === "all"
              ? language === "ar"
                ? "الكل"
                : "All"
              : statusLabels[tab]?.[language] || tab}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search
            size={16}
            className="absolute top-1/2 -translate-y-1/2 start-3 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={
              language === "ar"
                ? "بحث برقم التتبع، الاسم، الشركة..."
                : "Search by tracking #, name, company..."
            }
            className="w-full ps-10 pe-4 py-2 rounded-lg border border-gray-200 dark:border-gov-border/25 bg-white dark:bg-gov-card/10 text-sm text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gov-gold/50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gov-card/10 rounded-2xl shadow-sm border border-gray-100 dark:border-gov-border/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 dark:bg-gov-card/10 border-b border-gray-100 dark:border-gov-border/15">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-white/70">
                  {language === "ar" ? "رقم التتبع" : "Tracking #"}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-white/70">
                  {language === "ar" ? "اسم الشركة" : "Company"}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-white/70">
                  {language === "ar" ? "مقدم الطلب" : "Applicant"}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-white/70">
                  {language === "ar" ? "الحالة" : "Status"}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-white/70">
                  {language === "ar" ? "المبلغ المقترح" : "Proposed Amount"}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-white/70">
                  {language === "ar" ? "التاريخ" : "Date"}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-white/70">
                  {language === "ar" ? "إجراءات" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-6">
                    <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gov-border/15 mb-4">
                      <div className="w-[15%]">
                        <SkeletonText lines={1} />
                      </div>
                      <div className="w-[20%]">
                        <SkeletonText lines={1} />
                      </div>
                      <div className="w-[15%]">
                        <SkeletonText lines={1} />
                      </div>
                      <div className="w-[12%]">
                        <SkeletonText lines={1} />
                      </div>
                      <div className="w-[15%]">
                        <SkeletonText lines={1} />
                      </div>
                      <div className="w-[13%]">
                        <SkeletonText lines={1} />
                      </div>
                      <div className="w-[10%]">
                        <SkeletonText lines={1} />
                      </div>
                    </div>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <TableRowSkeleton key={i} />
                    ))}
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-8 text-gray-500 dark:text-white/50"
                  >
                    {language === "ar"
                      ? "لا توجد طلبات استثمار"
                      : "No investment applications"}
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-gov-charcoal dark:text-white font-bold">
                      {app.tracking_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-gov-charcoal dark:text-white max-w-xs truncate">
                      {app.company_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gov-charcoal dark:text-white">
                      {app.full_name}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                    <td className="px-6 py-4 text-sm text-gov-charcoal dark:text-white font-mono">
                      {formatAmount(app.proposed_amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(app.created_at).toLocaleDateString(
                        language === "ar" ? "ar-SY" : "en-US",
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/investment-applications/${app.id}`}
                        className="text-gov-forest dark:text-gov-gold text-xs font-bold hover:underline"
                      >
                        {language === "ar" ? "عرض التفاصيل" : "View Details"}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-12 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-500/20 mt-6">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <p className="text-red-600 dark:text-red-400 font-bold">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setCurrentPage(1);
            }}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600 transition-colors"
          >
            {language === "ar" ? "إعادة المحاولة" : "Retry"}
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-white dark:bg-gov-card/10 border border-gray-200 dark:border-gov-border/15 text-sm font-bold disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
          >
            {language === "ar" ? "السابق" : "Previous"}
          </button>
          <span className="px-4 py-2 text-sm text-gray-600 dark:text-white/70">
            {language === "ar"
              ? `صفحة ${currentPage} من ${totalPages}`
              : `Page ${currentPage} of ${totalPages}`}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-white dark:bg-gov-card/10 border border-gray-200 dark:border-gov-border/15 text-sm font-bold disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
          >
            {language === "ar" ? "التالي" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}
