'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import { Ticket } from '@/types';
import { API_URL } from '@/constants';
import {
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Clock,
  User,
  Building2,
  FileText,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Tag,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { SkeletonCard, SkeletonList, SkeletonText } from '@/components/SkeletonLoader';

const translations = {
  ar: {
    title: 'تفاصيل الشكوى',
    back: 'العودة للقائمة',
    loading: 'جاري التحميل...',
    notFound: 'الشكوى غير موجودة',
    complainant: 'مقدم الشكوى',
    status: 'الحالة',
    priority: 'الأولوية',
    category: 'التصنيف',
    directorate: 'الجهة المختصة',
    createdAt: 'تاريخ التقديم',
    updatedAt: 'آخر تحديث',
    description: 'تفاصيل الشكوى',
    responses: 'الردود والتحديثات',
    addResponse: 'إضافة رد',
    responsePlaceholder: 'اكتب ردك هنا...',
    send: 'إرسال',
    sending: 'جاري الإرسال...',
    priorityUpdated: 'تم تحديث الأولوية بنجاح',
    priorityUpdateFailed: 'فشل تحديث الأولوية',
    responseAdded: 'تم إضافة الرد بنجاح',
    responseAddFailed: 'فشل إضافة الرد',
    activityLog: 'سجل النشاط',
    priorities: {
      low: 'منخفضة',
      medium: 'متوسطة',
      high: 'عالية',
      urgent: 'عاجلة'
    },
    statuses: {
      new: 'جديد',
      pending: 'قيد الانتظار',
      processing: 'قيد المعالجة',
      in_progress: 'قيد المعالجة',
      resolved: 'تم الحل',
      rejected: 'مرفوض',
      received: 'مستلم',
      closed: 'مغلق'
    },
    statusChange: 'تغيير الحالة',
    statusUpdated: 'تم تحديث الحالة بنجاح',
    statusUpdateFailed: 'فشل تحديث الحالة'
  },
  en: {
    title: 'Complaint Details',
    back: 'Back to List',
    loading: 'Loading...',
    notFound: 'Complaint not found',
    complainant: 'Complainant',
    status: 'Status',
    priority: 'Priority',
    category: 'Category',
    directorate: 'Directorate',
    createdAt: 'Submitted',
    updatedAt: 'Last Updated',
    description: 'Complaint Details',
    responses: 'Responses & Updates',
    addResponse: 'Add Response',
    responsePlaceholder: 'Write your response here...',
    send: 'Send',
    sending: 'Sending...',
    priorityUpdated: 'Priority updated successfully',
    priorityUpdateFailed: 'Failed to update priority',
    responseAdded: 'Response added successfully',
    responseAddFailed: 'Failed to add response',
    activityLog: 'Activity Log',
    priorities: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      urgent: 'Urgent'
    },
    statuses: {
      new: 'New',
      pending: 'Pending',
      processing: 'Processing',
      in_progress: 'In Progress',
      resolved: 'Resolved',
      rejected: 'Rejected',
      received: 'Received',
      closed: 'Closed'
    },
    statusChange: 'Change Status',
    statusUpdated: 'Status updated successfully',
    statusUpdateFailed: 'Failed to update status'
  }
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-700 border-gray-300',
  medium: 'bg-blue-100 text-blue-700 border-blue-300',
  high: 'bg-orange-100 text-orange-700 border-orange-300',
  urgent: 'bg-red-100 text-red-700 border-red-300'
};

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-purple-100 text-purple-700',
  in_progress: 'bg-purple-100 text-purple-700',
  resolved: 'bg-green-100 text-green-700',
  received: 'bg-cyan-100 text-cyan-700',
  rejected: 'bg-red-100 text-red-700',
  closed: 'bg-gray-100 text-gray-700'
};

interface ComplaintDetail extends Ticket {
  complainant_name?: string;
  email?: string;
  phone?: string;
  ai_category?: string;
  priority?: string;
  directorate?: { id: string; name: string };
  logs?: Array<{
    id: number;
    action: string;
    user: { name: string };
    created_at: string;
    changes?: any;
  }>;
}

export default function ComplaintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const id = params.id as string;

  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);

  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [updatingPriority, setUpdatingPriority] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState(complaint?.status || 'new');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [responseText, setResponseText] = useState('');
  const [sendingResponse, setSendingResponse] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  useEffect(() => {
    if (complaint?.status) {
      setSelectedStatus(complaint.status);
    }
  }, [complaint?.status]);

  const fetchComplaint = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/staff/complaints?id=${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const result = await res.json();
        const data = result.data?.[0] || result;
        setComplaint(data);
        setSelectedPriority(data.priority || 'medium');

        // Fetch logs
        const logsRes = await API.staff.getComplaintLogs(id);
        setLogs(logsRes || []);
      }
    } catch (err) {
      console.error('Failed to fetch complaint:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    setUpdatingPriority(true);
    try {
      const success = await API.staff.updateCategorization(id, complaint?.ai_category || '', newPriority);
      if (success) {
        setSelectedPriority(newPriority);
        setComplaint(prev => prev ? { ...prev, priority: newPriority } : null);
        toast.success(t.priorityUpdated);
        fetchComplaint(); // Refresh logs
      } else {
        toast.error(t.priorityUpdateFailed);
      }
    } catch (err) {
      toast.error(t.priorityUpdateFailed);
    } finally {
      setUpdatingPriority(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const success = await API.staff.updateStatus(id, newStatus);
      if (success) {
        setSelectedStatus(newStatus);
        setComplaint(prev => prev ? { ...prev, status: newStatus } : null);
        toast.success(t.statusUpdated);
        fetchComplaint();
      } else {
        toast.error(t.statusUpdateFailed);
      }
    } catch (err) {
      toast.error(t.statusUpdateFailed);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddResponse = async () => {
    if (!responseText.trim()) return;

    setSendingResponse(true);
    try {
      const success = await API.staff.addResponse(id, responseText);
      if (success) {
        setResponseText('');
        toast.success(t.responseAdded);
        fetchComplaint(); // Refresh data
      } else {
        toast.error(t.responseAddFailed);
      }
    } catch (err) {
      toast.error(t.responseAddFailed);
    } finally {
      setSendingResponse(false);
    }
  };

  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dm-bg p-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
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
            {/* Main Content Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              {/* Complaint Details Skeleton */}
              <div className="bg-white dark:bg-gov-card/10 rounded-xl shadow-sm p-6">
                <div className="w-40 mb-4">
                  <SkeletonText lines={1} />
                </div>
                <SkeletonText lines={5} />
              </div>

              {/* Responses Skeleton */}
              <div className="bg-white dark:bg-gov-card/10 rounded-xl shadow-sm p-6">
                <div className="w-40 mb-4">
                  <SkeletonText lines={1} />
                </div>
                <SkeletonList rows={3} className="mb-6" />
                <SkeletonText lines={3} className="mb-3" />
                <div className="w-28">
                  <SkeletonText lines={1} />
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">{t.notFound}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <BackIcon className="w-5 h-5" />
            {t.back}
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              {t.title} #{complaint.tracking_number || complaint.id}
            </h1>
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusColors[complaint.status] || statusColors.new}`}>
              {(t.statuses as any)[complaint.status] || complaint.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t.description}
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
            </div>

            {/* Responses */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {t.responses}
              </h2>

              {complaint.responses && complaint.responses.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {complaint.responses.map((response: any) => (
                    <div key={response.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{response.user?.full_name || 'Staff'}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(response.created_at).toLocaleString(language === 'ar' ? 'ar-u-nu-latn' : 'en-US')}
                        </span>
                      </div>
                      <p className="text-gray-700">{response.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mb-6">No responses yet.</p>
              )}

              {/* Add Response Form */}
              <div className="border-t border-gray-100 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.addResponse}</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder={t.responsePlaceholder}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
                <button
                  onClick={handleAddResponse}
                  disabled={sendingResponse || !responseText.trim()}
                  className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sendingResponse ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t.sending}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t.send}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Activity Log */}
            {logs.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  {t.activityLog}
                </h2>
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 text-sm border-b border-gray-100 pb-3 last:border-0">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700">
                          <span className="font-medium">{log.user?.full_name}</span> - {log.action}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(log.created_at).toLocaleString(language === 'ar' ? 'ar-u-nu-latn' : 'en-US')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Change */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {t.statusChange}
              </h3>
              <div className="space-y-2">
                {(['new', 'received', 'in_progress', 'resolved', 'rejected', 'closed'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={updatingStatus}
                    className={`w-full px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all flex items-center justify-between ${
                      selectedStatus === status
                        ? (statusColors[status] || statusColors.new) + ' border-current'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span>{(t.statuses as any)[status] || status}</span>
                    {selectedStatus === status && <CheckCircle className="w-4 h-4" />}
                  </button>
                ))}
              </div>
              {updatingStatus && (
                <div className="flex items-center justify-center mt-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                </div>
              )}
            </div>

            {/* Priority Adjustment */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {t.priority}
              </h3>
              <div className="space-y-2">
                {(['low', 'medium', 'high', 'urgent'] as const).map((priority) => (
                  <button
                    key={priority}
                    onClick={() => handlePriorityChange(priority)}
                    disabled={updatingPriority}
                    className={`w-full px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all flex items-center justify-between ${
                      selectedPriority === priority
                        ? priorityColors[priority] + ' border-current'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    } ${updatingPriority ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span>{(t.priorities as any)[priority]}</span>
                    {selectedPriority === priority && <CheckCircle className="w-4 h-4" />}
                  </button>
                ))}
              </div>
              {updatingPriority && (
                <div className="flex items-center justify-center mt-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t.complainant}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{complaint.complainant_name || 'Anonymous'}</span>
                </div>
                {complaint.directorate && (
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{complaint.directorate.name}</span>
                  </div>
                )}
                {complaint.ai_category && (
                  <div className="flex items-center gap-3">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{complaint.ai_category}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">
                    {complaint.created_at
                      ? new Date(complaint.created_at).toLocaleDateString(language === 'ar' ? 'ar-u-nu-latn' : 'en-US')
                      : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
