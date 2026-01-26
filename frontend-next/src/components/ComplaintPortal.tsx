'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    Clock,
    Search,
    Upload,
    Send,
    CheckCircle2,
    AlertCircle,
    FileText,
    HelpCircle,
    Sparkles,
    ChevronRight,
    ChevronLeft,
    X,
    History,
    ClipboardList,
    Loader2,
    User,
    Fingerprint,
    Calendar,
    CheckCircle
} from 'lucide-react';
import { DIRECTORATES } from '@/lib/constants';
import { API } from '@/lib/repository';
import { aiService, ComplaintAnalysis } from '@/lib/aiService';
import { Ticket } from '@/types';
import { focusPulse } from '@/lib/animations';
import ImportedSatisfactionRating from './SatisfactionRating'; // Import Rating Component

interface ComplaintPortalProps {
    initialMode?: 'submit' | 'track';
    initialTrackingNumber?: string;
}

const ComplaintPortal: React.FC<ComplaintPortalProps> = ({
    initialMode = 'submit',
    initialTrackingNumber = ''
}) => {
    const [activeTab, setActiveTab] = useState<'submit' | 'track'>(initialMode);

    // Submission State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        fatherName: '',
        dob: '',
        nationalId: '',
        email: '',
        phone: '',
        category: '',
        details: '',
        directorate: '',
        hasPreviousComplaint: false,
        previousTrackingNumber: ''
    });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState<ComplaintAnalysis | null>(null);
    const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

    // OCR State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isOcrProcessing, setIsOcrProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Tracking State
    const [trackId, setTrackId] = useState(initialTrackingNumber);
    const [trackNationalId, setTrackNationalId] = useState('');
    const [trackingResult, setTrackingResult] = useState<Ticket | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [trackError, setTrackError] = useState<string | null>(null);

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!formRef.current) return;
        const inputs = formRef.current.querySelectorAll('input, textarea, select');
        inputs.forEach(el => focusPulse(el as any));
    }, [activeTab]);

    // Handle auto-tracking if tracking number is provided initially
    useEffect(() => {
        if (initialTrackingNumber && initialMode === 'track') {
            // In a real app, we might need more verification, but for now we wait for user to enter national ID
        }
    }, [initialTrackingNumber, initialMode]);

    // Handlers
    const handleAIAnalyze = async () => {
        if (formData.details.length < 10) return;
        setIsAnalyzing(true);
        try {
            const result = await aiService.analyzeComplaint(formData.details);
            if (result) {
                setAiSuggestion(result);
                // Auto-fill form based on AI
                setFormData(prev => ({
                    ...prev,
                    category: result.category,
                    directorate: DIRECTORATES.find(d => d.name.includes(result.category))?.name || ''
                }));
            }
        } catch (error) {
            console.error('AI analysis failed:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setIsOcrProcessing(true);

        try {
            const extractedText = await aiService.extractTextFromImage(file);

            if (extractedText) {
                setFormData(prev => ({
                    ...prev,
                    details: (prev.details ? prev.details + '\n\n' : '') + `[تم استخراج النص تلقائياً من المستند المرفق]: \n${extractedText}`
                }));
            }
        } catch (error) {
            console.error('OCR failed:', error);
        } finally {
            setIsOcrProcessing(false);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const ticketId = await API.complaints.submit(formData);
            setSubmittedTicket(ticketId);
        } catch (e) {
            console.error("Submission failed", e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsTracking(true);
        setTrackError(null);
        setTrackingResult(null);

        try {
            const result = await API.complaints.track(trackId);
            if (result) {
                setTrackingResult(result);
            } else {
                setTrackError("لم يتم العثور على تذكرة بهذا الرقم.");
            }
        } catch (e) {
            setTrackError("حدث خطأ أثناء الاتصال بالنظام.");
        } finally {
            setIsTracking(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            case 'resolved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
            case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'new': return 'جديد';
            case 'pending': return 'قيد الانتظار';
            case 'processing': return 'قيد المعالجة';
            case 'resolved': return 'تم الحل';
            case 'rejected': return 'مرفوض';
            default: return status;
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">

            {/* Tabs */}
            <div className="flex bg-white dark:bg-gov-forest/50 p-1 rounded-2xl shadow-sm border border-gray-200 dark:border-gov-gold/20 mb-8 max-w-md mx-auto">
                <button
                    onClick={() => { setActiveTab('submit'); setSubmittedTicket(null); }}
                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all ${activeTab === 'submit'
                        ? 'bg-gov-forest dark:bg-gov-gold text-white dark:text-gov-forest shadow-md'
                        : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                >
                    تقديم شكوى جديدة
                </button>
                <button
                    onClick={() => { setActiveTab('track'); setSubmittedTicket(null); }}
                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all ${activeTab === 'track'
                        ? 'bg-gov-forest dark:bg-gov-gold text-white dark:text-gov-forest shadow-md'
                        : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                >
                    متابعة حالة الطلب
                </button>
            </div>

            <div className="bg-white dark:bg-gov-forest/30 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gov-gold/20 overflow-hidden backdrop-blur-sm">

                {/* SUBMIT TAB */}
                {activeTab === 'submit' && !submittedTicket && (
                    <div className="p-8 md:p-12 animate-fade-in">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">نموذج الشكاوى الموحد</h2>
                            <p className="text-gray-600 dark:text-gray-400">سيتم التعامل مع بياناتك بسرية تامة وتوجيهها للجهة المعنية.</p>
                        </div>

                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

                            {/* Document Upload / OCR */}
                            <div className="bg-gov-beige/50 dark:bg-white/5 border-2 border-dashed border-gov-gold/40 rounded-xl p-6 text-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                                {!selectedFile ? (
                                    <div className="flex flex-col items-center gap-3 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <div className="w-12 h-12 rounded-full bg-white dark:bg-gov-gold/20 flex items-center justify-center text-gov-forest dark:text-gov-gold shadow-sm">
                                            <Upload size={24} />
                                        </div>
                                        <div>
                                            <span className="block font-bold text-gov-charcoal dark:text-white text-sm">أرفق صورة للشكوى المكتوبة (OCR)</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">سيتم استخراج النص تلقائياً من الصورة</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between bg-white dark:bg-white/5 p-3 rounded-lg border border-gov-gold/20">
                                        <div className="flex items-center gap-3">
                                            <FileText size={20} className="text-gov-forest dark:text-gov-gold" />
                                            <span className="text-sm font-bold text-gov-charcoal dark:text-white truncate max-w-[200px]">{selectedFile.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {isOcrProcessing ? (
                                                <span className="flex items-center gap-1 text-xs text-gov-gold font-bold">
                                                    <Loader2 size={12} className="animate-spin" />
                                                    جاري المعالجة...
                                                </span>
                                            ) : (
                                                <span className="text-xs text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                                                    <CheckCircle size={12} />
                                                    تم الاستخراج
                                                </span>
                                            )}
                                            <button type="button" onClick={removeFile} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Personal Information */}
                            <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl border border-gray-100 dark:border-white/10">
                                <h3 className="font-display font-bold text-gov-forest dark:text-gov-gold mb-4 text-base border-b border-gov-gold/20 dark:border-white/10 pb-2">بيانات مقدم الشكوى</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">الاسم الأول <span className="text-gov-gold">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="text" required
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-sm focus:border-gov-forest dark:focus:border-gov-gold outline-none transition-colors dark:text-white"
                                            />
                                            <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">اسم الأب <span className="text-gov-gold">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="text" required
                                                value={formData.fatherName}
                                                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                                                className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-sm focus:border-gov-forest dark:focus:border-gov-gold outline-none transition-colors dark:text-white"
                                            />
                                            <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">الاسم الأخير <span className="text-gov-gold">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="text" required
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-sm focus:border-gov-forest dark:focus:border-gov-gold outline-none transition-colors dark:text-white"
                                            />
                                            <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">الرقم الوطني <span className="text-gov-gold">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="text" required maxLength={11} minLength={11} placeholder="11 خانة"
                                                value={formData.nationalId}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    setFormData({ ...formData, nationalId: val });
                                                }}
                                                className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-sm focus:border-gov-forest dark:focus:border-gov-gold outline-none font-mono transition-colors dark:text-white"
                                            />
                                            <Fingerprint className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">تاريخ الميلاد <span className="text-gov-gold">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="date" required
                                                value={formData.dob}
                                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                                className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-sm focus:border-gov-forest dark:focus:border-gov-gold outline-none transition-colors dark:text-white"
                                            />
                                            <Calendar className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description with AI */}
                            <div>
                                <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">تفاصيل الشكوى <span className="text-gov-gold">*</span></label>
                                <div className="relative">
                                    <textarea
                                        required
                                        value={formData.details}
                                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                        rows={6}
                                        className="w-full p-4 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-forest/20 transition-all outline-none resize-none"
                                        placeholder="اشرح المشكلة بالتفصيل أو قم برفع صورة المستند..."
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAIAnalyze}
                                        disabled={isAnalyzing || formData.details.length < 10}
                                        className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-white dark:bg-gov-gold text-gov-charcoal dark:text-gov-forest text-xs font-bold shadow-sm flex items-center gap-2 hover:bg-gov-gold/10 disabled:opacity-50 transition-colors"
                                    >
                                        {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="text-gov-gold dark:text-gov-forest" />}
                                        {isAnalyzing ? 'جاري التحليل...' : 'تحليل ذكي'}
                                    </button>
                                </div>
                            </div>

                            {/* AI Suggestion Box */}
                            {aiSuggestion && (
                                <div className="p-4 rounded-xl bg-gov-gold/5 border border-gov-gold/20 flex gap-4 animate-fade-in">
                                    <div className="mt-1"><Sparkles className="text-gov-gold" size={20} /></div>
                                    <div>
                                        <h4 className="font-display font-bold text-gov-forest dark:text-gov-gold text-sm mb-1">نتيجة التحليل الذكي</h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">{aiSuggestion.summary}</p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 rounded-md bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-xs text-gray-500 dark:text-gray-300">الأولوية: <span className="font-bold text-gov-forest dark:text-gov-gold">{aiSuggestion.priority}</span></span>
                                            <span className="px-2 py-1 rounded-md bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-xs text-gray-500 dark:text-gray-300">التصنيف: <span className="font-bold text-gov-forest dark:text-gov-gold">{aiSuggestion.category}</span></span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">رقم الهاتف <span className="text-gov-gold">*</span></label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-forest/20 transition-all outline-none"
                                        />
                                        <Phone className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">البريد الإلكتروني <span className="text-gov-gold">*</span></label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-forest/20 transition-all outline-none"
                                        />
                                        <Mail className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    </div>
                                </div>
                            </div>

                            {/* Previous Complaint Field (Added for V2) */}
                            <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl border border-gray-100 dark:border-white/10">
                                <h3 className="font-display font-bold text-gov-forest dark:text-gov-gold mb-4 text-base border-b border-gov-gold/20 dark:border-white/10 pb-2">تفاصيل الشكوى السابقة</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="hasPreviousComplaint"
                                            checked={formData.hasPreviousComplaint || false}
                                            onChange={(e) => setFormData({ ...formData, hasPreviousComplaint: e.target.checked })}
                                            className="w-5 h-5 rounded border-gray-300 text-gov-forest focus:ring-gov-gold transition-colors cursor-pointer"
                                        />
                                        <label htmlFor="hasPreviousComplaint" className="text-gov-charcoal dark:text-white font-bold cursor-pointer select-none">
                                            هل هذه الشكوى مرتبطة بشكوى سابقة؟
                                        </label>
                                    </div>

                                    {formData.hasPreviousComplaint && (
                                        <div className="animate-fade-in">
                                            <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                                رقم تذكرة الشكوى السابقة <span className="text-gov-gold">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    required={formData.hasPreviousComplaint}
                                                    value={formData.previousTrackingNumber || ''}
                                                    onChange={(e) => setFormData({ ...formData, previousTrackingNumber: e.target.value })}
                                                    placeholder="مثال: GOV-123456"
                                                    className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-forest/20 transition-all outline-none font-mono"
                                                />
                                                <History className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                يرجى إدخال رقم التذكرة للشكوى السابقة لربطها بهذه الشكوى وتسريع المعالجة.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">الجهة (اختياري)</label>
                                    <div className="relative">
                                        <select
                                            value={formData.directorate}
                                            onChange={(e) => setFormData({ ...formData, directorate: e.target.value })}
                                            className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-forest/20 transition-all outline-none appearance-none"
                                        >
                                            <option value="" className="bg-white text-gov-charcoal dark:bg-gov-emerald dark:text-white">-- اختر الجهة --</option>
                                            {DIRECTORATES.map(d => (
                                                <option key={d.id} value={d.name} className="bg-white text-gov-charcoal dark:bg-gov-emerald dark:text-white">
                                                    {d.name}
                                                </option>
                                            ))}
                                        </select>
                                        <Building2 className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 rounded-xl bg-gov-forest dark:bg-gov-gold text-white dark:text-gov-forest font-bold shadow-lg hover:bg-gov-teal dark:hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال الشكوى'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* SUCCESS STATE */}
                {submittedTicket && (
                    <div className="p-12 text-center animate-fade-in flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">تم استلام طلبك بنجاح</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">يرجى الاحتفاظ برقم التذكرة أدناه لمتابعة حالة الطلب. تم إرسال رسالة تأكيد لرقم هاتفك.</p>

                        <div className="bg-gov-beige dark:bg-white/10 border-2 border-dashed border-gov-gold/30 p-6 rounded-xl mb-8 w-full max-w-sm">
                            <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">رقم التذكرة</span>
                            <span className="block text-3xl font-display font-bold text-gov-forest dark:text-gov-gold tracking-wider">{submittedTicket}</span>
                        </div>

                        <button onClick={() => { setSubmittedTicket(null); setActiveTab('track'); }} className="text-gov-forest dark:text-gov-gold font-bold hover:underline">
                            متابعة الطلب الآن
                        </button>
                    </div>
                )}

                {/* TRACKING TAB */}
                {activeTab === 'track' && (
                    <div className="p-8 md:p-12 animate-fade-in">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">متابعة الطلبات</h2>
                            <p className="text-gray-500 dark:text-gray-400">أدخل رقم التذكرة للاستعلام عن آخر المستجدات.</p>
                        </div>

                        <form onSubmit={handleTrack} className="max-w-lg mx-auto mb-10 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">رقم التذكرة</label>
                                <input
                                    type="text"
                                    placeholder="مثال: GOV-12345"
                                    value={trackId}
                                    onChange={(e) => setTrackId(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">الرقم الوطني (للتحقق)</label>
                                <input
                                    type="text"
                                    placeholder="الرقم الوطني"
                                    value={trackNationalId}
                                    onChange={(e) => setTrackNationalId(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold outline-none"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full bg-gov-forest dark:bg-gov-gold text-white dark:text-gov-forest py-3 rounded-xl font-bold hover:bg-gov-teal dark:hover:bg-white transition-colors flex items-center justify-center gap-2">
                                {isTracking ? <Loader2 className="animate-spin" /> : <Search />}
                                <span>استعلام</span>
                            </button>
                            {trackError && <p className="text-red-500 text-sm mt-2 text-center">{trackError}</p>}
                        </form>

                        {trackingResult && (
                            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-gov-gold/20 rounded-2xl p-6 shadow-lg animate-slide-up max-w-lg mx-auto">
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-white/10">
                                    <span className="font-bold text-gov-charcoal dark:text-white">تذكرة #{trackingResult.tracking_number || trackingResult.id}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(trackingResult.status)}`}>
                                        {getStatusLabel(trackingResult.status)}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 text-gray-400"><AlertCircle size={18} /></div>
                                        <div>
                                            <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">آخر تحديث</span>
                                            <span className="text-sm font-medium text-gov-charcoal dark:text-white">
                                                {trackingResult.updated_at ? new Date(trackingResult.updated_at).toLocaleDateString() : 'غير متوفر'}
                                            </span>
                                        </div>
                                    </div>
                                    {trackingResult.description && (
                                        <div className="flex items-start gap-3 bg-gray-50 dark:bg-white/10 p-3 rounded-lg">
                                            <div className="mt-1 text-gray-400"><FileText size={18} /></div>
                                            <div>
                                                <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">تفاصيل</span>
                                                <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{trackingResult.description}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {trackingResult.responses && trackingResult.responses.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/10 animate-fade-in">
                                        <h3 className="text-sm font-bold text-gov-forest dark:text-gov-gold mb-4">الردود والتحديثات</h3>
                                        <div className="space-y-4">
                                            {trackingResult.responses.map((response) => (
                                                <div key={response.id} className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/20">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="font-bold text-gov-forest dark:text-blue-100 text-sm">{response.user?.name || 'فريق الدعم'}</span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(response.created_at).toLocaleString('ar-SY')}</span>
                                                    </div>
                                                    <p className="text-gray-700 dark:text-gray-200 text-sm whitespace-pre-wrap">{response.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {trackingResult && trackingResult.status === 'resolved' && (
                            <ImportedSatisfactionRating trackingNumber={trackingResult.id} />
                        )}

                        <div className="mt-8 text-center animate-fade-in">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">هل تحتاج للمساعدة المباشرة؟</p>
                            <a
                                href="https://wa.me/963912345678"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-bold hover:bg-[#20bd5a] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                <span>تواصل عبر واتساب</span>
                            </a>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ComplaintPortal;
