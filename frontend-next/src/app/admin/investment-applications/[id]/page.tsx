"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { API } from "@/lib/repository";
import { InvestmentApplication } from "@/types";
import { API_URL } from "@/constants";
import {
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Clock,
  User,
  Building2,
  FileText,
  Loader2,
  CheckCircle,
  Activity,
  DollarSign,
  Paperclip,
  CreditCard,
  Mail,
  Phone,
  Hash,
} from "lucide-react";
import { toast } from "sonner";
import { SkeletonCard, SkeletonText } from "@/components/SkeletonLoader";

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

const allStatuses = [
  "received",
  "under_review",
  "needs_more_info",
  "approved",
  "rejected",
] as const;

export default function InvestmentApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const id = Number(params.id);

  const [application, setApplication] = useState<InvestmentApplication | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [staffNotes, setStaffNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const t = {
    ar: {
      title: "تفاصيل طلب الاستثمار",
      back: "العودة للقائمة",
      notFound: "الطلب غير موجود",
      applicationInfo: "معلومات الطلب",
      applicantInfo: "معلومات مقدم الطلب",
      investmentInfo: "الفرصة الاستثمارية المرتبطة",
      attachments: "المرفقات",
      staffNotes: "ملاحظات الموظف",
      saveNotes: "حفظ الملاحظات",
      saving: "جاري الحفظ...",
      statusChange: "تغيير الحالة",
      statusUpdated: "تم تحديث الحالة بنجاح",
      statusFailed: "فشل تحديث الحالة",
      notesSaved: "تم حفظ الملاحظات بنجاح",
      notesFailed: "فشل حفظ الملاحظات",
      fullName: "الاسم الكامل",
      nationalId: "الرقم الوطني",
      companyName: "اسم الشركة",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      proposedAmount: "المبلغ المقترح",
      description: "الوصف",
      trackingNumber: "رقم التتبع",
      date: "تاريخ التقديم",
      lastUpdate: "آخر تحديث",
      download: "تحميل",
      noAttachments: "لا توجد مرفقات",
      noDescription: "لا يوجد وصف",
      noInvestment: "طلب عام (غير مرتبط بفرصة محددة)",
      notesPlaceholder: "اكتب ملاحظاتك هنا...",
    },
    en: {
      title: "Investment Application Details",
      back: "Back to List",
      notFound: "Application not found",
      applicationInfo: "Application Info",
      applicantInfo: "Applicant Info",
      investmentInfo: "Linked Investment Opportunity",
      attachments: "Attachments",
      staffNotes: "Staff Notes",
      saveNotes: "Save Notes",
      saving: "Saving...",
      statusChange: "Change Status",
      statusUpdated: "Status updated successfully",
      statusFailed: "Failed to update status",
      notesSaved: "Notes saved successfully",
      notesFailed: "Failed to save notes",
      fullName: "Full Name",
      nationalId: "National ID",
      companyName: "Company Name",
      email: "Email",
      phone: "Phone",
      proposedAmount: "Proposed Amount",
      description: "Description",
      trackingNumber: "Tracking Number",
      date: "Submitted",
      lastUpdate: "Last Updated",
      download: "Download",
      noAttachments: "No attachments",
      noDescription: "No description provided",
      noInvestment:
        "General application (not linked to a specific opportunity)",
      notesPlaceholder: "Write your notes here...",
    },
  }[language];

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    setLoading(true);
    try {
      const data = await API.staffInvestmentApplications.getById(id);
      setApplication(data);
      if (data) {
        setSelectedStatus(data.status);
        setStaffNotes(data.staff_notes || "");
      }
    } catch (err) {
      console.error("Failed to fetch application:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const success = await API.staffInvestmentApplications.updateStatus(
        id,
        newStatus,
        staffNotes,
      );
      if (success) {
        setSelectedStatus(newStatus);
        setApplication((prev) =>
          prev ? { ...prev, status: newStatus as any } : null,
        );
        toast.success(t.statusUpdated);
      } else {
        toast.error(t.statusFailed);
      }
    } catch {
      toast.error(t.statusFailed);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      const success = await API.staffInvestmentApplications.updateStatus(
        id,
        selectedStatus,
        staffNotes,
      );
      if (success) {
        setApplication((prev) =>
          prev ? { ...prev, staff_notes: staffNotes } : null,
        );
        toast.success(t.notesSaved);
      } else {
        toast.error(t.notesFailed);
      }
    } catch {
      toast.error(t.notesFailed);
    } finally {
      setSavingNotes(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat(language === "ar" ? "ar-SY" : "en-US").format(
      amount,
    );
  };

  const BackIcon = language === "ar" ? ArrowRight : ArrowLeft;

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gray-50 dark:bg-dm-bg p-6"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="w-32 mb-4">
              <SkeletonText lines={1} />
            </div>
            <div className="flex items-center justify-between">
              <div className="w-80">
                <SkeletonText lines={1} />
              </div>
              <div className="w-24">
                <SkeletonText lines={1} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <div className="space-y-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dm-bg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600 dark:text-white/70">
            {t.notFound}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-dm-bg p-6"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <BackIcon className="w-5 h-5" />
            {t.back}
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t.title} #{application.tracking_number}
            </h1>
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold ${statusColors[application.status] || "bg-gray-100 text-gray-700"}`}
            >
              {statusLabels[application.status]?.[language] ||
                application.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Applicant Details */}
            <div className="bg-white dark:bg-gov-card/10 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gov-border/15">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                {t.applicantInfo}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-white/50">
                      {t.fullName}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {application.full_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-white/50">
                      {t.nationalId}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                      {application.national_id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-white/50">
                      {t.companyName}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {application.company_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-white/50">
                      {t.email}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {application.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-white/50">
                      {t.phone}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                      {application.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-white/50">
                      {t.proposedAmount}
                    </p>
                    <p className="text-sm font-bold text-gov-forest dark:text-gov-gold font-mono">
                      {formatAmount(application.proposed_amount)}{" "}
                      {language === "ar" ? "ل.س" : "SYP"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gov-card/10 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gov-border/15">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t.description}
              </h2>
              <p className="text-gray-700 dark:text-white/80 whitespace-pre-wrap">
                {application.description || t.noDescription}
              </p>
            </div>

            {/* Linked Investment */}
            {application.investment ? (
              <div className="bg-white dark:bg-gov-card/10 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gov-border/15">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {t.investmentInfo}
                </h2>
                <p className="text-gray-700 dark:text-white/80">
                  {language === "ar"
                    ? application.investment.title_ar
                    : application.investment.title_en}
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gov-card/5 rounded-xl p-4 border border-gray-100 dark:border-gov-border/10">
                <p className="text-sm text-gray-500 dark:text-white/50">
                  {t.noInvestment}
                </p>
              </div>
            )}

            {/* Attachments */}
            <div className="bg-white dark:bg-gov-card/10 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gov-border/15">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Paperclip className="w-5 h-5" />
                {t.attachments}
              </h2>
              {application.attachments && application.attachments.length > 0 ? (
                <div className="space-y-2">
                  {application.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Paperclip className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-white/80">
                          {att.file_name}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({(att.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <a
                        href={`${API_URL}/storage/${att.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-gov-forest dark:text-gov-gold hover:underline"
                      >
                        {t.download}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-white/50">
                  {t.noAttachments}
                </p>
              )}
            </div>

            {/* Staff Notes */}
            <div className="bg-white dark:bg-gov-card/10 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gov-border/15">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t.staffNotes}
              </h2>
              <textarea
                value={staffNotes}
                onChange={(e) => setStaffNotes(e.target.value)}
                placeholder={t.notesPlaceholder}
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gov-border/25 rounded-lg bg-white dark:bg-gov-card/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-gov-gold/50 focus:border-transparent resize-none"
              />
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="mt-3 px-4 py-2 bg-gov-forest dark:bg-gov-button text-white rounded-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {savingNotes ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.saving}
                  </>
                ) : (
                  t.saveNotes
                )}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Change */}
            <div className="bg-white dark:bg-gov-card/10 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gov-border/15">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {t.statusChange}
              </h3>
              <div className="space-y-2">
                {allStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={updatingStatus}
                    className={`w-full px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all flex items-center justify-between ${
                      selectedStatus === status
                        ? (statusColors[status] ||
                            "bg-gray-100 text-gray-700") + " border-current"
                        : "bg-white dark:bg-gov-card/5 text-gray-600 dark:text-white/70 border-gray-200 dark:border-gov-border/15 hover:border-gray-300 dark:hover:border-gov-border/30"
                    } ${updatingStatus ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span>{statusLabels[status]?.[language] || status}</span>
                    {selectedStatus === status && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
              {updatingStatus && (
                <div className="flex items-center justify-center mt-3">
                  <Loader2 className="w-5 h-5 animate-spin text-gov-gold" />
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-white dark:bg-gov-card/10 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gov-border/15">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {t.applicationInfo}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-white/50">
                      {t.trackingNumber}
                    </p>
                    <p className="font-mono font-bold text-gray-900 dark:text-white">
                      {application.tracking_number}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-white/80">
                    {application.full_name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-white/80">
                    {application.company_name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-white/50">
                      {t.date}
                    </p>
                    <p className="text-gray-700 dark:text-white/80">
                      {new Date(application.created_at).toLocaleDateString(
                        language === "ar" ? "ar-SY" : "en-US",
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-white/50">
                      {t.lastUpdate}
                    </p>
                    <p className="text-gray-700 dark:text-white/80">
                      {new Date(application.updated_at).toLocaleDateString(
                        language === "ar" ? "ar-SY" : "en-US",
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
