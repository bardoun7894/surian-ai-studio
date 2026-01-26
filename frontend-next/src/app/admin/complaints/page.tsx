'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/lib/repository';
import { Ticket } from '@/types';
import { AlertCircle, CheckCircle, Clock, Filter, Search } from 'lucide-react';
import Link from 'next/link';
import SnoozeButton from '@/components/SnoozeButton';

export default function AdminComplaintsPage() {
    const [complaints, setComplaints] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const result = await API.staff.listComplaints({ status: filter !== 'all' ? filter : undefined });
                setComplaints(result.data);
            } catch (e) {
                console.error("Failed to fetch complaints", e);
                // Fallback to mock if API fails/not implemented fully
                setComplaints([
                    { id: '1', title: 'تأخر في إصدار الجواز', status: 'new', priority: 'high', category: 'General', department: 'Passports', created_at: '2025-01-20', description: 'Sample description' },
                    { id: '2', title: 'انقطاع المياه', status: 'in_progress', priority: 'medium', category: 'Infrastructure', department: 'Water', created_at: '2025-01-21', description: 'Sample description' },
                    { id: '3', title: 'شكوى موظف', status: 'resolved', priority: 'low', category: 'HR', department: 'Internal', created_at: '2025-01-19', description: 'Sample description' },
                ] as any);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, [filter]);

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
                    <p className="text-gray-500 dark:text-gray-400">متابعة ومعالجة شكاوى المواطنين</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-gov-gold/20 rounded-lg text-sm font-bold text-gov-charcoal dark:text-white">
                        <Filter size={16} />
                        تصفية
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gov-forest dark:bg-gov-gold text-white dark:text-gov-forest rounded-lg text-sm font-bold">
                        <Search size={16} />
                        بحث
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-gray-100 dark:border-gov-gold/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-gov-gold/10">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400">رقم التذكرة</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400">العنوان</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400">الحالة</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400">الأولوية</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400">التاريخ</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-8">جاري التحميل...</td></tr>
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
        </div>
    );
}
