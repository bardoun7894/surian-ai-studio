'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/lib/repository';
import { Ticket } from '@/types';
import { AlertCircle, CheckCircle, Clock, Filter, Search } from 'lucide-react';
import Link from 'next/link';
import SnoozeButton from '@/components/SnoozeButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { TableRowSkeleton } from '@/components/Skeleton';
import { SkeletonText } from '@/components/SkeletonLoader';

export default function AdminComplaintsPage() {
    const { language } = useLanguage();
    const [complaints, setComplaints] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const perPage = 15;

    useEffect(() => {
        const fetchComplaints = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await API.staff.listComplaints({
                    status: filter !== 'all' ? filter : undefined,
                    page: currentPage,
                    per_page: perPage,
                });
                setComplaints(result.data);
                setTotalPages(result.last_page || 1);
                setTotal(result.total || 0);
            } catch (e) {
                console.error("Failed to fetch complaints", e);
                setComplaints([]);
                setError(language === 'ar' ? 'فشل في تحميل الشكاوى. يرجى المحاولة مرة أخرى.' : 'Failed to load complaints. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, [filter, currentPage, language]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">جديد</span>;
            case 'in_progress': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">قيد المعالجة</span>;
            case 'resolved': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">تم الحل</span>;
            default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{status}</span>;
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gov-charcoal dark:text-white mb-2">إدارة الشكاوى</h1>
                    <p className="text-gray-500 dark:text-white/70">متابعة ومعالجة شكاوى المواطنين</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gov-card/10 border border-gray-200 dark:border-gov-border/25 rounded-lg text-sm font-bold text-gov-charcoal dark:text-white">
                        <Filter size={16} />
                        تصفية
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gov-forest dark:bg-gov-button text-white rounded-lg text-sm font-bold">
                        <Search size={16} />
                        بحث
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gov-card/10 rounded-2xl shadow-sm border border-gray-100 dark:border-gov-border/15 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 dark:bg-gov-card/10 border-b border-gray-100 dark:border-gov-border/15">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-white/70">رقم التتبع</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-white/70">العنوان</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-white/70">الحالة</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-white/70">الأولوية</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-white/70">التاريخ</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-white/70">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {loading ? (
                              <tr>
                                <td colSpan={6} className="p-6">
                                  {/* Header Skeleton */}
                                  <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gov-border/15 mb-4">
                                    <div className="w-[15%]"><SkeletonText lines={1} /></div>
                                    <div className="w-[30%]"><SkeletonText lines={1} /></div>
                                    <div className="w-[15%]"><SkeletonText lines={1} /></div>
                                    <div className="w-[15%]"><SkeletonText lines={1} /></div>
                                    <div className="w-[15%]"><SkeletonText lines={1} /></div>
                                    <div className="w-[10%]"><SkeletonText lines={1} /></div>
                                  </div>
                                  {/* Table Rows Skeleton */}
                                  {Array.from({ length: 6 }).map((_, i) => (
                                    <TableRowSkeleton key={i} />
                                  ))}
                                </td>
                              </tr>
                            ) : complaints.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8">لا توجد شكاوى</td></tr>
                            ) : (
                                complaints.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-mono text-sm text-gov-charcoal dark:text-white font-bold">{ticket.id}</td>
                                        <td className="px-6 py-4 text-sm text-gov-charcoal dark:text-white max-w-xs truncate">{ticket.title}</td>
                                        <td className="px-6 py-4">{getStatusBadge(ticket.status)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold ${ticket.priority === 'high' ? 'text-red-500' :
                                                    ticket.priority === 'medium' ? 'text-yellow-600' :
                                                        'text-green-500'
                                                }`}>
                                                {ticket.priority || 'عادي'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(ticket.created_at || Date.now()).toLocaleDateString('ar-SY')}</td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <Link href={`/admin/complaints/${ticket.id}`} className="text-gov-forest dark:text-gov-gold text-xs font-bold hover:underline">
                                                عرض التفاصيل
                                            </Link>

                                            {/* Snooze Button (FR-35) */}
                                            <SnoozeButton
                                                itemId={ticket.id}
                                                itemType="complaint"
                                                onSnoozed={() => console.log('Refetch data...')}
                                            />
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
                        onClick={() => { setError(null); setCurrentPage(1); }}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600 transition-colors"
                    >
                        {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
                    </button>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg bg-white dark:bg-gov-card/10 border border-gray-200 dark:border-gov-border/15 text-sm font-bold disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                    >
                        {language === 'ar' ? 'السابق' : 'Previous'}
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-600 dark:text-white/70">
                        {language === 'ar' ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg bg-white dark:bg-gov-card/10 border border-gray-200 dark:border-gov-border/15 text-sm font-bold disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                    >
                        {language === 'ar' ? 'التالي' : 'Next'}
                    </button>
                </div>
            )}
        </div>
    );
}
