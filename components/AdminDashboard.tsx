import React, { useState } from 'react';
import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    Users,
    Settings,
    LogOut,
    Bell,
    Search,
    Menu,
    X,
    CheckCircle,
    Loader2,
    Send,
    ChevronDown,
    Printer,
    Wand2,
    Sparkles,
    Plus
} from 'lucide-react';
import { aiService } from '../services/aiService';
import { useLanguage } from '../contexts/LanguageContext';
import { API } from '../services/repository';
import { Ticket } from '../types';
import LoadingSpinner from './LoadingSpinner';
import Skeleton from './Skeleton';

interface AdminDashboardProps {
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const { t, language } = useLanguage();
    const [activeView, setActiveView] = useState<'overview' | 'complaints' | 'content' | 'users'>('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [complaints, setComplaints] = useState<Ticket[]>([]);
    const [analytics, setAnalytics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState<Ticket | null>(null);
    const [complaintLogs, setComplaintLogs] = useState<any[]>([]);
    const [responseMessage, setResponseMessage] = useState('');

    const [isActionLoading, setIsActionLoading] = useState(false);

    // Content Management State
    const [isContentModalOpen, setIsContentModalOpen] = useState(false);
    const [contentForm, setContentForm] = useState({ title: '', type: 'news', body: '' });
    const [contentList, setContentList] = useState<any[]>([]);

    const handleSaveContent = async () => {
        if (!contentForm.title) return;
        setIsActionLoading(true);
        try {
            await API.content.create({
                title_ar: contentForm.title,
                content_ar: contentForm.body,
                category: contentForm.type,
                status: 'published'
            });
            alert(language === 'ar' ? 'تم إضافة المحتوى بنجاح' : 'Content added successfully');
            setIsContentModalOpen(false);
            setContentForm({ title: '', type: 'news', body: '' });
            fetchData(); // Refresh list
        } catch (e) {
            console.error(e);
            alert('Error creating content');
        } finally {
            setIsActionLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, [activeView]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            if (activeView === 'overview') {
                const data = await API.staff.getAnalytics();
                setAnalytics(data);
            } else if (activeView === 'complaints') {
                const res = await API.staff.listComplaints();
                setComplaints(res.data);
            } else if (activeView === 'content') {
                const res = await API.content.getAll();
                setContentList(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch admin data', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        setIsActionLoading(true);
        try {
            const success = await API.staff.updateStatus(id, newStatus);
            if (success) {
                // Refresh data
                if (selectedComplaint && selectedComplaint.id === id) {
                    setSelectedComplaint({ ...selectedComplaint, status: newStatus });
                }
                fetchData();
            }
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleUpdateCategorization = async (id: string, category: string, priority: string) => {
        setIsActionLoading(true);
        try {
            const success = await API.staff.updateCategorization(id, category, priority);
            if (success) {
                alert(language === 'ar' ? 'تم تحديث التصنيف بنجاح' : 'Categorization updated successfully');
                fetchData();
            }
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleAddResponse = async (id: string) => {
        if (!responseMessage.trim()) return;
        setIsActionLoading(true);
        try {
            const success = await API.staff.addResponse(id, responseMessage);
            if (success) {
                setResponseMessage('');
                // In a real app, we'd fetch responses too
                alert(language === 'ar' ? 'تمت إضافة الرد بنجاح' : 'Response added successfully');
            }
        } finally {
            setIsActionLoading(false);
        }
    };

    const menuItems = [
        { id: 'overview', label: t('admin_overview'), icon: <LayoutDashboard size={20} /> },
        { id: 'complaints', label: t('admin_complaints'), icon: <MessageSquare size={20} /> },
        { id: 'content', label: t('admin_content'), icon: <FileText size={20} /> },
        { id: 'users', label: t('admin_users'), icon: <Users size={20} /> },
    ];

    const handleViewComplaint = async (ticket: Ticket) => {
        setSelectedComplaint(ticket);
        try {
            const logs = await API.staff.getComplaintLogs(ticket.id);
            setComplaintLogs(logs);
        } catch (e) {
            console.error(e);
            setComplaintLogs([]);
        }
    };

    const handlePrintComplaint = (complaint: Ticket) => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
        <html dir="${language === 'ar' ? 'rtl' : 'ltr'}">
          <head>
            <title>Print Complaint #${complaint.tracking_number || complaint.id}</title>
            <style>
              body { font-family: sans-serif; padding: 20px; direction: ${language === 'ar' ? 'rtl' : 'ltr'}; }
              h1 { border-bottom: 2px solid #333; padding-bottom: 10px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; }
            </style>
          </head>
          <body>
            <h1>${language === 'ar' ? 'تفاصيل الشكوى' : 'Complaint Details'}</h1>
            <div class="field"><span class="label">${t('admin_ticket_no')}:</span> ${complaint.tracking_number || complaint.id}</div>
            <div class="field"><span class="label">${t('admin_last_update')}:</span> ${complaint.lastUpdate}</div>
            <div class="field"><span class="label">${t('admin_status')}:</span> ${complaint.status}</div>
            <div class="field"><span class="label">${language === 'ar' ? 'الوصف' : 'Description'}:</span> <p>${complaint.notes}</p></div>
            <script>window.print();</script>
          </body>
        </html>
      `);
            printWindow.document.close();
        }
    };

    const handleAiImprove = async () => {
        if (!contentForm.body.trim()) return;
        setIsActionLoading(true);
        try {
            const improved = await aiService.proofread(contentForm.body);
            if (improved) setContentForm(prev => ({ ...prev, body: improved }));
        } catch (e) {
            console.error('AI Improvment failed', e);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleAiSummarize = async () => {
        if (!contentForm.body.trim()) return;
        setIsActionLoading(true);
        try {
            const summary = await aiService.summarize(contentForm.body);
            if (summary) setContentForm(prev => ({ ...prev, body: prev.body + (language === 'ar' ? "\n\nملخص AI:\n" : "\n\nAI Summary:\n") + summary }));
        } catch (e) {
            console.error('AI Summary failed', e);
        } finally {
            setIsActionLoading(false);
        }
    };

    const renderContent = () => {
        switch (activeView) {
            case 'overview':
                if (isLoading) return (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} height={120} />)}
                    </div>
                );
                return (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
                        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-xs font-bold mb-1 uppercase tracking-wider">{t('admin_total_complaints')}</p>
                                    <h3 className="text-3xl font-display font-bold text-gov-forest dark:text-white">{analytics?.total || 0}</h3>
                                </div>
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><MessageSquare size={20} /></div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-xs font-bold mb-1 uppercase tracking-wider">{t('admin_new_complaints')}</p>
                                    <h3 className="text-3xl font-display font-bold text-gov-forest dark:text-white">{analytics?.new || 0}</h3>
                                </div>
                                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center"><Bell size={20} /></div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-xs font-bold mb-1 uppercase tracking-wider">{t('admin_in_progress')}</p>
                                    <h3 className="text-3xl font-display font-bold text-gov-forest dark:text-white">{analytics?.in_progress || 0}</h3>
                                </div>
                                <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center"><FileText size={20} /></div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-xs font-bold mb-1 uppercase tracking-wider">{t('admin_resolved')}</p>
                                    <h3 className="text-3xl font-display font-bold text-gov-forest dark:text-white">{analytics?.resolved || 0}</h3>
                                </div>
                                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center"><CheckCircle size={20} /></div>
                            </div>
                        </div>
                    </div>
                );

            case 'complaints':
                if (isLoading) return <LoadingSpinner className="py-20" />;
                return (
                    <div className="bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden animate-fade-in">
                        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-display font-bold text-gov-forest dark:text-white">{t('admin_complaints_log')}</h2>
                            <button className="text-gov-teal dark:text-gov-gold text-sm font-bold hover:underline">{t('ui_show_all')}</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right rtl:text-right ltr:text-left">
                                <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 text-sm">
                                    <tr>
                                        <th className="p-4">{t('admin_ticket_no')}</th>
                                        <th className="p-4">{t('reg_full_name')}</th>
                                        <th className="p-4">{t('admin_status')}</th>
                                        <th className="p-4">{t('admin_last_update')}</th>
                                        <th className="p-4">{t('admin_action')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                                    {complaints.map(ticket => (
                                        <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-bold font-mono text-gov-forest">{ticket.tracking_number || ticket.id}</td>
                                            <td className="p-4">{ticket.name}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${ticket.status === 'new' ? 'bg-blue-100 text-blue-600' :
                                                    ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                                                    }`}>
                                                    {ticket.status === 'new' ? t('complaint_status_new') : ticket.status === 'in_progress' ? t('complaint_status_in_progress') : t('complaint_status_resolved')}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-500 text-sm">{ticket.lastUpdate || (ticket.updated_at ? new Date(ticket.updated_at).toLocaleDateString() : 'N/A')}</td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleViewComplaint(ticket)}
                                                    className="text-gov-forest font-bold hover:underline text-sm transition-all hover:text-gov-teal"
                                                >
                                                    {t('admin_view')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'content':
                return (
                    <div className="bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden animate-fade-in">
                        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-display font-bold text-gov-forest dark:text-white">{t('admin_content_mgmt')}</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsContentModalOpen(true)}
                                    className="px-4 py-2 bg-gov-forest text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gov-teal transition-all"
                                >
                                    <Plus size={16} />
                                    {t('admin_add_new')}
                                </button>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-white/10">
                            {contentList.map(item => (
                                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gov-gold/10 rounded-lg flex items-center justify-center text-gov-gold">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-display font-bold text-gov-forest dark:text-white">{item.title_ar}</h3>
                                            <div className="flex gap-2 text-xs text-gray-500 mt-1">
                                                <span>{item.category === 'decree' ? t('news_filter_decrees') : item.category === 'news' ? t('news_filter_politics') : t('sitemap_circulars')}</span>
                                                <span>•</span>
                                                <span>{item.author?.name || 'Admin'}</span>
                                                <span>•</span>
                                                <span>{new Date(item.created_at).toLocaleDateString(language === 'ar' ? 'ar-SY' : 'en-US')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">{t('ui_edit')}</button>
                                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">{language === 'ar' ? 'أرشفة' : 'Archive'}</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'users':
                return (
                    <div className="bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 p-12 text-center animate-fade-in">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Users size={32} />
                        </div>
                        <h3 className="text-xl font-display font-bold text-gov-forest dark:text-white mb-2">{t('admin_users')}</h3>
                        <p className="text-gray-500 mb-6">{t('admin_under_dev')}</p>
                    </div>
                );

            default:
                return <div className="p-6">Welcome</div>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gov-forest font-sans">

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 ${language === 'ar' ? 'right-0' : 'left-0'} z-50 w-64 bg-gov-charcoal text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-xl ${isSidebarOpen ? 'translate-x-0' : (language === 'ar' ? 'translate-x-full' : '-translate-x-full')}`}>
                <div className="flex items-center justify-between h-20 px-6 bg-gov-charcoal/50 border-b border-white/10">
                    <h1 className="text-xl font-display font-bold text-gov-gold uppercase tracking-widest">{t('admin_panel')}</h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveView(item.id as any); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeView === item.id
                                ? 'bg-gov-forest text-white shadow-lg ring-1 ring-white/10'
                                : 'text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            <span className="font-bold text-sm">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/5 hover:text-red-300 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-bold text-sm">{t('admin_logout')}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white dark:bg-gov-forest border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6 shadow-sm z-40">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-gov-charcoal dark:text-white">
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="md:w-96 hidden md:block relative">
                            <input
                                type="text"
                                placeholder={t('admin_search_placeholder')}
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 border-none focus:ring-2 focus:ring-gov-teal outline-none text-gov-charcoal dark:text-white"
                            />
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full relative">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gov-red rounded-full border-2 border-white dark:border-gov-forest"></span>
                        </button>
                        <div className="flex items-center gap-3 border-r border-gray-200 dark:border-white/10 pr-4 mr-2">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-gov-charcoal dark:text-white">{language === 'ar' ? 'المدير العام' : 'General Manager'}</p>
                                <p className="text-xs text-gray-500">admin@gov.sy</p>
                            </div>
                            <div className="w-10 h-10 bg-gov-gold/20 rounded-full flex items-center justify-center text-gov-gold font-bold">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Body */}
                <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gov-forest/95 p-6 md:p-8">
                    {renderContent()}
                </div>
            </main>

            {/* Modal Components */}
            {selectedComplaint && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gov-charcoal/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gov-charcoal w-full max-w-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gov-beige/50 dark:bg-white/5">
                            <h2 className="text-xl font-display font-bold text-gov-forest dark:text-white">{language === 'ar' ? 'تذكرة' : 'Ticket'} #{selectedComplaint.tracking_number || selectedComplaint.id}</h2>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handlePrintComplaint(selectedComplaint)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gov-charcoal dark:text-white" title={language === 'ar' ? 'طباعة' : 'Print'}>
                                    <Printer size={20} />
                                </button>
                                <button onClick={() => setSelectedComplaint(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gov-charcoal dark:text-white"><X size={20} /></button>
                            </div>
                        </div>
                        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                            <div>
                                <span className="block text-xs font-bold text-gray-500 uppercase mb-2">{language === 'ar' ? 'الوصف' : 'Description'}</span>
                                <p className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl text-sm leading-relaxed text-gov-charcoal dark:text-white">{selectedComplaint.notes || (language === 'ar' ? 'لا يوجد وصف متاح' : 'No description available')}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-xs font-bold text-gray-500 uppercase mb-2">{language === 'ar' ? 'تغيير الحالة' : 'Change Status'}</span>
                                    <select
                                        value={selectedComplaint.status}
                                        onChange={(e) => handleUpdateStatus(selectedComplaint.id, e.target.value)}
                                        disabled={isActionLoading}
                                        className="w-full p-3 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 outline-none text-sm font-bold text-gov-charcoal dark:text-white"
                                    >
                                        <option value="new">{t('complaint_status_new')}</option>
                                        <option value="in_progress">{t('complaint_status_in_progress')}</option>
                                        <option value="resolved">{t('complaint_status_resolved')}</option>
                                        <option value="rejected">{t('complaint_status_rejected')}</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <span className={`px-4 py-3 rounded-xl font-bold text-center w-full ${selectedComplaint.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-gov-gold/10 text-gov-gold'
                                        }`}>
                                        {language === 'ar' ? 'الحالة الحالية:' : 'Current Status:'} {selectedComplaint.status}
                                    </span>
                                </div>
                            </div>

                            {/* AI Support section */}
                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-white/10 mt-4">
                                <div>
                                    <span className="block text-xs font-bold text-gray-500 uppercase mb-2">{language === 'ar' ? 'تصنيف AI (تعديل)' : 'AI Category (Edit)'}</span>
                                    <select
                                        value={selectedComplaint.ai_category || 'other'}
                                        onChange={(e) => setSelectedComplaint({ ...selectedComplaint, ai_category: e.target.value })}
                                        className="w-full p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/20 text-xs font-bold text-gov-charcoal dark:text-white"
                                    >
                                        <option value="electricity">{t('service_electricity')}</option>
                                        <option value="water">{t('open_data_energy')}</option>
                                        <option value="health">{t('open_data_health')}</option>
                                        <option value="education">{t('open_data_education')}</option>
                                        <option value="other">{language === 'ar' ? 'أخرى' : 'Other'}</option>
                                    </select>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold text-gray-500 uppercase mb-2">{language === 'ar' ? 'الأولوية (تعديل)' : 'Priority (Edit)'}</span>
                                    <select
                                        value={selectedComplaint.priority || 'medium'}
                                        onChange={(e) => setSelectedComplaint({ ...selectedComplaint, priority: e.target.value })}
                                        className="w-full p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/20 text-xs font-bold text-gov-charcoal dark:text-white"
                                    >
                                        <option value="high">{language === 'ar' ? 'عالية' : 'High'}</option>
                                        <option value="medium">{language === 'ar' ? 'متوسطة' : 'Medium'}</option>
                                        <option value="low">{language === 'ar' ? 'منخفضة' : 'Low'}</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <button
                                        onClick={() => handleUpdateCategorization(selectedComplaint.id, selectedComplaint.ai_category || 'other', selectedComplaint.priority || 'medium')}
                                        disabled={isActionLoading}
                                        className="w-full py-2 bg-gov-forest/10 hover:bg-gov-forest/20 text-gov-forest dark:text-white rounded-lg text-xs font-bold transition-colors"
                                    >
                                        {language === 'ar' ? 'حفظ تعديلات التصنيف' : 'Save Categorization Changes'}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 dark:border-white/10">
                                <span className="block text-xs font-bold text-gray-500 uppercase mb-2">{language === 'ar' ? 'إضافة رد رسمي' : 'Add Official Response'}</span>
                                <textarea
                                    rows={4}
                                    value={responseMessage}
                                    onChange={(e) => setResponseMessage(e.target.value)}
                                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/10 outline-none text-sm resize-none text-gov-charcoal dark:text-white"
                                    placeholder={language === 'ar' ? 'اكتب الرد الذي سيظهر للمواطن...' : 'Write the response that will appear to the citizen...'}
                                />
                                <button
                                    onClick={() => handleAddResponse(selectedComplaint.id)}
                                    disabled={isActionLoading || !responseMessage.trim()}
                                    className="mt-3 px-6 py-3 bg-gov-teal text-white rounded-xl font-bold text-sm w-full flex items-center justify-center gap-2"
                                >
                                    {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                    {language === 'ar' ? 'إرسال الرد' : 'Send Response'}
                                </button>
                            </div>

                            <div className="pt-4 border-t border-gray-100 dark:border-white/10">
                                <span className="block text-xs font-bold text-gray-500 uppercase mb-2">{language === 'ar' ? 'سجل النشاطات (Audit Log)' : 'Activity Log (Audit Log)'}</span>
                                <div className="space-y-3">
                                    {complaintLogs.length > 0 ? complaintLogs.map((log, idx) => (
                                        <div key={idx} className="flex gap-3 text-sm p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                                            <div className="w-1 bg-gov-teal rounded-full"></div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <span className="font-bold text-gov-forest dark:text-white">{log.action}</span>
                                                    <span className="text-gray-400 text-xs">{new Date(log.created_at).toLocaleString()}</span>
                                                </div>
                                                <p className="text-gray-500 text-xs mt-1">{language === 'ar' ? 'بواسطة:' : 'By:'} {log.user?.name || (language === 'ar' ? 'النظام' : 'System')}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-gray-400 text-sm italic">{language === 'ar' ? 'لا توجد سجلات نشاط متاحة.' : 'No activity logs available.'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isContentModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gov-charcoal/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gov-charcoal w-full max-w-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gov-beige/50 dark:bg-white/5">
                            <h2 className="text-xl font-display font-bold text-gov-forest dark:text-white">{t('admin_add_new')}</h2>
                            <button onClick={() => setIsContentModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gov-charcoal dark:text-white"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">{language === 'ar' ? 'العنوان' : 'Title'}</label>
                                <input
                                    type="text"
                                    value={contentForm.title}
                                    onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none text-gov-charcoal dark:text-white"
                                    placeholder={language === 'ar' ? 'عنوان الخبر أو المرسوم...' : 'News or decree title...'}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">{language === 'ar' ? 'النوع' : 'Type'}</label>
                                <select
                                    value={contentForm.type}
                                    onChange={(e) => setContentForm({ ...contentForm, type: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none text-gov-charcoal dark:text-white"
                                >
                                    <option value="news">{t('news_filter_politics')}</option>
                                    <option value="decree">{t('news_filter_decrees')}</option>
                                    <option value="circular">{t('sitemap_circulars')}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">{language === 'ar' ? 'المحتوى' : 'Content'}</label>
                                <textarea
                                    rows={4}
                                    value={contentForm.body}
                                    onChange={(e) => setContentForm({ ...contentForm, body: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none text-gov-charcoal dark:text-white resize-none"
                                    placeholder={language === 'ar' ? 'نص المحتوى...' : 'Content text...'}
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={handleAiImprove}
                                        disabled={isActionLoading || !contentForm.body}
                                        className="px-3 py-1.5 rounded-lg bg-gov-gold/10 text-gov-gold text-xs font-bold flex items-center gap-1 hover:bg-gov-gold/20 disabled:opacity-50"
                                    >
                                        <Wand2 size={12} /> {language === 'ar' ? 'تحسين النص (AI)' : 'Improve Text (AI)'}
                                    </button>
                                    <button
                                        onClick={handleAiSummarize}
                                        disabled={isActionLoading || !contentForm.body}
                                        className="px-3 py-1.5 rounded-lg bg-gov-teal/10 text-gov-teal text-xs font-bold flex items-center gap-1 hover:bg-gov-teal/20 disabled:opacity-50"
                                    >
                                        <Sparkles size={12} /> {language === 'ar' ? 'تلخيص (AI)' : 'Summarize (AI)'}
                                    </button>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button
                                    onClick={handleSaveContent}
                                    disabled={isActionLoading}
                                    className="w-full py-3 bg-gov-teal text-white rounded-xl font-bold hover:bg-gov-emerald transition-colors disabled:opacity-50"
                                >
                                    {t('ui_save')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
