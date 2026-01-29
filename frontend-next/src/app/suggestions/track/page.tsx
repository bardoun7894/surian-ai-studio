'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Search, Loader2, CheckCircle, Clock, XCircle, AlertCircle, FileText, ArrowLeft, Calendar, User, Printer } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

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
            const response = await fetch(`/api/v1/suggestions/track/${trackingNumber}`);
            if (!response.ok) {
                if (response.status === 404) {
                    setError('لم يتم العثور على مقترح بهذا الرقم. يرجى التحقق من رقم المتابعة.');
                } else {
                    setError('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.');
                }
                return;
            }
            const data = await response.json();
            if (data.success && data.data) {
                setResult(data.data);
            } else {
                setError('لم يتم العثور على مقترح بهذا الرقم.');
            }
        } catch (err) {
            console.error('Track error:', err);
            setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
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
        <div className="min-h-screen bg-gov-beige dark:bg-gov-forest py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gov-forest dark:text-gov-gold hover:underline mb-8"
                >
                    <ArrowLeft size={18} />
                    العودة للرئيسية
                </Link>

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-gov-forest dark:bg-gov-gold rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={28} className="text-white dark:text-gov-forest" />
                    </div>
                    <h1 className="text-3xl font-bold text-gov-forest dark:text-white mb-2">
                        متابعة حالة المقترح
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        أدخل رقم المتابعة للاطلاع على آخر المستجدات
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-8 print:hidden">
                    <div className="bg-white dark:bg-gov-forest/50 rounded-2xl p-6 shadow-lg border border-gov-gold/20">
                        <label className="block text-sm font-bold text-gov-forest dark:text-gray-300 mb-2">
                            رقم المتابعة
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                                placeholder="SUG-XXXXXXXX"
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus:ring-2 focus:ring-gov-gold focus:border-transparent outline-none transition-all font-mono text-lg"
                            />
                            <button
                                type="submit"
                                disabled={loading || !trackingNumber.trim()}
                                className="px-6 py-3 bg-gov-forest dark:bg-gov-gold text-white dark:text-gov-forest font-bold rounded-xl hover:bg-gov-forest/90 dark:hover:bg-gov-gold/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                                بحث
                            </button>
                        </div>
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
                    <div className="bg-white dark:bg-gov-forest/50 rounded-2xl shadow-lg border border-gov-gold/20 overflow-hidden animate-fade-in print:shadow-none print:border-none">
                        {/* Status Header */}
                        <div className={`${getStatusInfo(result.status).bg} p-6 flex justify-between items-start`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-full bg-white dark:bg-black/20 flex items-center justify-center ${getStatusInfo(result.status).color}`}>
                                    {getStatusInfo(result.status).icon}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">حالة المقترح</p>
                                    <h2 className={`text-2xl font-bold ${getStatusInfo(result.status).color}`}>
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
                            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/10">
                                <span className="text-gray-600 dark:text-gray-400">رقم المتابعة</span>
                                <span className="font-bold font-mono text-gov-forest dark:text-gov-gold">
                                    {result.tracking_number}
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/10">
                                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                    <Calendar size={16} />
                                    تاريخ التقديم
                                </span>
                                <span className="text-gov-forest dark:text-white">
                                    {formatDate(result.submitted_at)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/10">
                                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
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
                                    <div className="bg-gov-beige/50 dark:bg-white/5 rounded-xl p-4 border border-gov-gold/20">
                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                            {result.response}
                                        </p>
                                        {result.reviewed_at && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                                                تاريخ الرد: {formatDate(result.reviewed_at)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Submit New Suggestion Link */}
                <div className="text-center mt-8 print:hidden">
                    <Link
                        href="/#suggestions"
                        className="text-gov-forest dark:text-gov-gold hover:underline font-bold"
                    >
                        تقديم مقترح جديد
                    </Link>
                </div>
            </div>
        </div>
    );
}
