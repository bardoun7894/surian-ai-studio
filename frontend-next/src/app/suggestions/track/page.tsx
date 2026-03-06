'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Search, Loader2, CheckCircle, Clock, XCircle, AlertCircle, FileText, ArrowLeft, Calendar, User, Printer, Star } from 'lucide-react';
import { API } from '@/lib/repository';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SuggestionRating from '@/components/SuggestionRating';
import PrintHeader from '@/components/PrintHeader';
import PrintFooter from '@/components/PrintFooter';

interface SuggestionStatus {
    tracking_number: string;
    status: string;
    submitted_at: string;
    last_updated: string;
    response?: string;
    reviewed_at?: string;
}

const statusConfig: Record<string, { label: string; labelEn: string; color: string; icon: React.ReactNode; bg: string }> = {
    pending: {
        label: 'قيد المراجعة',
        labelEn: 'Pending Review',
        color: 'text-yellow-600 dark:text-yellow-400',
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        icon: <Clock size={24} />
    },
    reviewed: {
        label: 'تمت المراجعة',
        labelEn: 'Reviewed',
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        icon: <FileText size={24} />
    },
    approved: {
        label: 'تمت الموافقة',
        labelEn: 'Approved',
        color: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-100 dark:bg-green-900/30',
        icon: <CheckCircle size={24} />
    },
    rejected: {
        label: 'مرفوض',
        labelEn: 'Rejected',
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-100 dark:bg-red-900/30',
        icon: <XCircle size={24} />
    }
};

export default function SuggestionTrackPage() {
    return <Suspense><SuggestionTrackPageContent /></Suspense>;
}

function SuggestionTrackPageContent() {
    const searchParams = useSearchParams();
    const initialId = searchParams.get('id') || '';

    const [trackingNumber, setTrackingNumber] = useState(initialId);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SuggestionStatus | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Auto-search if ID is provided in URL
    useEffect(() => {
        if (initialId) {
            handleSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!trackingNumber.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await API.suggestions.track(trackingNumber);
            if (data?.success && data?.data) {
                setResult(data.data);
            } else if (data?.data) {
                setResult(data.data);
            } else {
                setError('لم يتم العثور على مقترح بهذا الرقم.');
            }
        } catch (err: any) {
            if (err.message?.includes('الرقم الوطني')) {
                setError('الرقم الوطني غير مطابق. يرجى التحقق من البيانات.');
            } else {
                setError('لم يتم العثور على مقترح بهذا الرقم. يرجى التحقق من رقم المتابعة.');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('ar-SY', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateStr;
        }
    };

    const getStatusInfo = (status: string) => {
        return statusConfig[status] || statusConfig.pending;
    };

    return (
        <div className="min-h-screen bg-gov-beige dark:bg-dm-bg py-8 md:py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Back Link */}
                <Link
                    href="/suggestions"
                    className="inline-flex items-center gap-2 text-gov-forest dark:text-gov-gold hover:underline mb-8"
                >
                    <ArrowLeft size={18} />
                    العودة لصفحة المقترحات
                </Link>

                {/* Header */}
                <div className="text-center mb-6 md:mb-10">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gov-forest dark:bg-gov-gold rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={22} className="text-white dark:text-gov-forest" />
                    </div>
                    <h1 className="text-xl md:text-3xl font-bold text-gov-forest dark:text-white mb-2">
                        متابعة حالة المقترح
                    </h1>
                    <p className="text-gray-600 dark:text-white/70">
                        أدخل رقم المتابعة للاطلاع على آخر المستجدات
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-8 print:hidden">
                    <div className="bg-white dark:bg-dm-surface rounded-2xl p-4 md:p-6 shadow-lg border border-gov-gold/20 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gov-forest dark:text-white/70 mb-2">
                                رقم المتابعة
                            </label>
                            <input
                                type="text"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                                placeholder="SUG-XXXXXXXX"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-gray-50 dark:bg-gov-card/10 focus:ring-2 focus:ring-gov-gold focus:border-transparent outline-none transition-all font-mono text-base md:text-lg"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !trackingNumber.trim()}
                            className="w-full px-6 py-3 bg-gov-forest dark:bg-gov-button text-white font-bold rounded-xl hover:bg-gov-forest/90 dark:hover:bg-gov-button/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                            بحث
                        </button>
                    </div>
                </form>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-start gap-3 animate-fade-in">
                        <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-red-700 dark:text-red-300">{error}</p>
                    </div>
                )}

                {/* Result Card */}
                {result && (
                    <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-lg border border-gov-gold/20 overflow-hidden animate-fade-in print:shadow-none print:border-none">
                        {/* Official Print Header */}
                        <PrintHeader
                            documentTitle="متابعة مقترح"
                            referenceNumber={result.tracking_number}
                            date={result.submitted_at ? new Date(result.submitted_at).toLocaleDateString('ar-SY', { year: 'numeric', month: 'long', day: 'numeric' }) : undefined}
                            language="ar"
                        />

                        {/* Status Header */}
                        <div className={`${getStatusInfo(result.status).bg} p-6 flex justify-between items-start`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-full bg-white dark:bg-dm-surface flex items-center justify-center ${getStatusInfo(result.status).color}`}>
                                    {getStatusInfo(result.status).icon}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-white/70 mb-1">حالة المقترح</p>
                                    <h2 className={`text-lg md:text-2xl font-bold ${getStatusInfo(result.status).color}`}>
                                        {getStatusInfo(result.status).label}
                                    </h2>
                                </div>
                            </div>

                            {/* Print Button (FR-47) */}
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-2 px-3 py-2 bg-white/50 hover:bg-white rounded-lg text-gov-forest dark:text-gov-gold text-sm font-bold transition-colors print:hidden"
                                title="طباعة التفاصيل"
                            >
                                <Printer size={18} />
                                <span>طباعة</span>
                            </button>
                        </div>

                        {/* Details */}
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gov-border/15">
                                <span className="text-gray-600 dark:text-white/70">رقم المتابعة</span>
                                <span className="font-bold font-mono text-gov-forest dark:text-gov-gold">
                                    {result.tracking_number}
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gov-border/15">
                                <span className="text-gray-600 dark:text-white/70 flex items-center gap-2">
                                    <Calendar size={16} />
                                    تاريخ التقديم
                                </span>
                                <span className="text-gov-forest dark:text-white">
                                    {formatDate(result.submitted_at)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gov-border/15">
                                <span className="text-gray-600 dark:text-white/70 flex items-center gap-2">
                                    <Clock size={16} />
                                    آخر تحديث
                                </span>
                                <span className="text-gov-forest dark:text-white">
                                    {formatDate(result.last_updated)}
                                </span>
                            </div>

                            {/* Response from Ministry */}
                            {result.response && (
                                <div className="pt-4">
                                    <h3 className="font-bold text-gov-forest dark:text-gov-gold mb-3 flex items-center gap-2">
                                        <User size={18} />
                                        رد الجهة المختصة
                                    </h3>
                                    <div className="bg-gov-beige/50 dark:bg-gov-card/10 rounded-xl p-4 border border-gov-gold/20">
                                        <p className="text-gray-700 dark:text-white/70 whitespace-pre-wrap">
                                            {result.response}
                                        </p>
                                        {result.reviewed_at && (
                                            <p className="text-xs text-gray-500 dark:text-white/70 mt-3">
                                                تاريخ الرد: {formatDate(result.reviewed_at)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Rating Section - Show when there's a response or completed status */}
                            {(result.response || result.status === 'completed' || result.status === 'reviewed' || result.status === 'responded') && (
                                <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gov-border/15">
                                    <SuggestionRating
                                        trackingNumber={result.tracking_number}
                                        language="ar"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Official Print Footer */}
                        <PrintFooter language="ar" />
                    </div>
                )}

                {/* Link to suggestions page */}
                <div className="text-center mt-8 print:hidden">
                    <Link
                        href="/suggestions"
                        className="text-gov-forest dark:text-gov-gold hover:underline font-bold"
                    >
                        تقديم مقترح جديد
                    </Link>
                </div>
            </div>
        </div>
    );
}
