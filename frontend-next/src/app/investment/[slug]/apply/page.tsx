"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { API, Investment } from "@/lib/repository";
import {
  Briefcase,
  User,
  Building2,
  Mail,
  Phone,
  Banknote,
  FileText,
  Upload,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  CreditCard,
  MapPin,
  Target,
} from "lucide-react";
import Link from "next/link";

const translations = {
  ar: {
    title: "تقديم طلب استثمار",
    linkedTo: "مرتبط بالفرصة:",
    fullName: "الاسم الكامل",
    nationalId: "الرقم الوطني",
    nationalIdHint: "11 رقماً",
    companyName: "اسم الشركة",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    proposedAmount: "مبلغ الاستثمار المقترح (USD)",
    description: "وصف المشروع / خطاب التقديم",
    descriptionHint: "حد أقصى 5000 حرف",
    attachments: "المرفقات",
    attachmentsHint: "PDF, JPG, PNG, DOC - حد أقصى 5 ملفات، 10MB لكل ملف",
    addFiles: "إضافة ملفات",
    submit: "تقديم الطلب",
    submitting: "جاري التقديم...",
    successTitle: "تم تقديم طلبك بنجاح!",
    successMessage: "يمكنك متابعة حالة طلبك باستخدام رقم التتبع التالي:",
    trackingNumber: "رقم التتبع",
    trackApplication: "تتبع الطلب",
    submitAnother: "تقديم طلب آخر",
    required: "مطلوب",
    invalidNationalId: "الرقم الوطني يجب أن يتكون من 11 رقماً",
    invalidEmail: "البريد الإلكتروني غير صالح",
    loading: "جاري التحميل...",
    notFound: "الفرصة الاستثمارية غير موجودة",
    backToInvestments: "العودة للاستثمارات",
  },
  en: {
    title: "Investment Application",
    linkedTo: "Linked to opportunity:",
    fullName: "Full Name",
    nationalId: "National ID",
    nationalIdHint: "11 digits",
    companyName: "Company Name",
    email: "Email",
    phone: "Phone Number",
    proposedAmount: "Proposed Investment Amount (USD)",
    description: "Project Description / Cover Letter",
    descriptionHint: "Maximum 5000 characters",
    attachments: "Attachments",
    attachmentsHint: "PDF, JPG, PNG, DOC - Max 5 files, 10MB each",
    addFiles: "Add Files",
    submit: "Submit Application",
    submitting: "Submitting...",
    successTitle: "Application Submitted Successfully!",
    successMessage:
      "You can track your application status using the following tracking number:",
    trackingNumber: "Tracking Number",
    trackApplication: "Track Application",
    submitAnother: "Submit Another",
    required: "Required",
    invalidNationalId: "National ID must be exactly 11 digits",
    invalidEmail: "Invalid email address",
    loading: "Loading...",
    notFound: "Investment opportunity not found",
    backToInvestments: "Back to Investments",
  },
};

interface FormData {
  full_name: string;
  national_id: string;
  company_name: string;
  email: string;
  phone: string;
  proposed_amount: string;
  description: string;
}

export default function InvestmentSlugApplyPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { language } = useLanguage();
  const t = translations[language];

  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loadingInvestment, setLoadingInvestment] = useState(true);
  const [form, setForm] = useState<FormData>({
    full_name: "",
    national_id: "",
    company_name: "",
    email: "",
    phone: "",
    proposed_amount: "",
    description: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    API.investments
      .getById(Number(slug))
      .then((inv) => {
        setInvestment(inv);
        setLoadingInvestment(false);
      })
      .catch(() => setLoadingInvestment(false));
  }, [slug]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.full_name.trim()) newErrors.full_name = t.required;
    if (!form.national_id.match(/^\d{11}$/))
      newErrors.national_id = t.invalidNationalId;
    if (!form.company_name.trim()) newErrors.company_name = t.required;
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = t.invalidEmail;
    if (!form.phone.trim()) newErrors.phone = t.required;
    if (!form.proposed_amount || Number(form.proposed_amount) <= 0)
      newErrors.proposed_amount = t.required;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await API.investmentApplications.submit({
        full_name: form.full_name,
        national_id: form.national_id,
        company_name: form.company_name,
        email: form.email,
        phone: form.phone,
        proposed_amount: Number(form.proposed_amount),
        description: form.description || undefined,
        investment_id: Number(slug),
        attachments: files.length > 0 ? files : undefined,
      });
      setTrackingNumber(result);
    } catch (err: any) {
      setSubmitError(err.message || "حدث خطأ أثناء تقديم الطلب");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (loadingInvestment) {
    return (
      <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="animate-spin text-gov-teal" size={48} />
        </main>
        <Footer />
      </div>
    );
  }

  if (trackingNumber) {
    return (
      <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-white dark:bg-dm-surface rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle
                className="text-green-600 dark:text-green-400"
                size={32}
              />
            </div>
            <h2 className="text-2xl font-bold text-gov-charcoal dark:text-white mb-2">
              {t.successTitle}
            </h2>
            <p className="text-gray-600 dark:text-white/70 mb-6">
              {t.successMessage}
            </p>
            <div className="bg-gov-gold/10 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-500 dark:text-white/60 mb-1">
                {t.trackingNumber}
              </p>
              <p className="text-2xl font-bold font-mono text-gov-forest dark:text-gov-gold">
                {trackingNumber}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/investment/track?number=${trackingNumber}`}
                className="flex-1 py-3 bg-gov-teal text-white font-bold rounded-xl text-center hover:bg-gov-emerald transition-colors"
              >
                {t.trackApplication}
              </Link>
              <Link
                href="/investment"
                className="flex-1 py-3 border-2 border-gray-200 dark:border-gov-border/25 text-gray-600 dark:text-white/70 font-bold rounded-xl text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                {t.backToInvestments}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border-2 ${errors[field] ? "border-red-400" : "border-gray-200 dark:border-gov-border/25"} bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:border-gov-teal focus:outline-none transition-colors`;

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
      <Navbar />
      <main className="flex-grow py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gov-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-gov-teal" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gov-charcoal dark:text-white mb-2">
              {t.title}
            </h1>
            {investment && (
              <div className="inline-flex items-center gap-2 bg-gov-gold/10 px-4 py-2 rounded-xl mt-2">
                <Target size={16} className="text-gov-gold" />
                <span className="text-sm font-bold text-gov-forest dark:text-gov-gold">
                  {t.linkedTo}{" "}
                  {language === "ar"
                    ? investment.title_ar
                    : investment.title_en}
                </span>
              </div>
            )}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-dm-surface rounded-2xl shadow-lg p-8 space-y-6"
          >
            <div>
              <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                <User size={16} className="inline me-2" />
                {t.fullName} *
              </label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                className={inputClass("full_name")}
              />
              {errors.full_name && (
                <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                <CreditCard size={16} className="inline me-2" />
                {t.nationalId} *{" "}
                <span className="text-gray-400 font-normal">
                  ({t.nationalIdHint})
                </span>
              </label>
              <input
                type="text"
                maxLength={11}
                value={form.national_id}
                onChange={(e) =>
                  handleChange("national_id", e.target.value.replace(/\D/g, ""))
                }
                className={inputClass("national_id")}
                dir="ltr"
              />
              {errors.national_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.national_id}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                <Building2 size={16} className="inline me-2" />
                {t.companyName} *
              </label>
              <input
                type="text"
                value={form.company_name}
                onChange={(e) => handleChange("company_name", e.target.value)}
                className={inputClass("company_name")}
              />
              {errors.company_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.company_name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                  <Mail size={16} className="inline me-2" />
                  {t.email} *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={inputClass("email")}
                  dir="ltr"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                  <Phone size={16} className="inline me-2" />
                  {t.phone} *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className={inputClass("phone")}
                  dir="ltr"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                <Banknote size={16} className="inline me-2" />
                {t.proposedAmount} *
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={form.proposed_amount}
                onChange={(e) =>
                  handleChange("proposed_amount", e.target.value)
                }
                className={inputClass("proposed_amount")}
                dir="ltr"
              />
              {errors.proposed_amount && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.proposed_amount}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                <FileText size={16} className="inline me-2" />
                {t.description}{" "}
                <span className="text-gray-400 font-normal">
                  ({t.descriptionHint})
                </span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                maxLength={5000}
                rows={5}
                className={inputClass("description")}
              />
              <p className="text-xs text-gray-400 mt-1 text-end">
                {form.description.length}/5000
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                <Upload size={16} className="inline me-2" />
                {t.attachments}{" "}
                <span className="text-gray-400 font-normal">
                  ({t.attachmentsHint})
                </span>
              </label>
              {files.length < 5 && (
                <label className="block w-full border-2 border-dashed border-gray-300 dark:border-gov-border/25 rounded-xl p-6 text-center cursor-pointer hover:border-gov-teal transition-colors">
                  <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                  <span className="text-sm text-gray-500 dark:text-white/60">
                    {t.addFiles}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-gray-50 dark:bg-white/5 rounded-lg px-4 py-2"
                    >
                      <span className="text-sm text-gov-charcoal dark:text-white truncate">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {submitError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {submitError}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gov-teal text-white font-bold rounded-xl hover:bg-gov-emerald transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {t.submitting}
                </>
              ) : (
                t.submit
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link
              href="/investment"
              className="text-gov-teal hover:underline font-bold text-sm"
            >
              {t.backToInvestments}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
