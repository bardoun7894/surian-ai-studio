'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Phone,
    Mail,
    Search,
    Upload,
    Send,
    CheckCircle2,
    AlertCircle,
    FileText,
    ChevronRight,
    ChevronLeft,
    X,
    History,
    ClipboardList,
    Loader2,
    User,
    Fingerprint,
    Calendar,
    CheckCircle,
    Trash2,
    UserX,
    FileCheck,
    ShieldAlert,
    Scale,
    ChevronDown,
    Copy,
    Check
} from 'lucide-react';
import { API, getComplaintTemplates } from '@/lib/repository';
import { Directorate } from '@/types';
import { getLocalizedName, copyToClipboard } from '@/lib/utils';
import ComplaintPrintButton from './ComplaintPrintButton';
import { Ticket } from '@/types';
import { focusPulse } from '@/lib/animations';
import ImportedSatisfactionRating from './SatisfactionRating'; // Import Rating Component
import UploadProgress from './UploadProgress';
import { toast } from 'sonner';
import { useRecaptcha } from '@/hooks/useRecaptcha';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface ComplaintPortalProps {
    initialMode?: 'submit' | 'track';
    initialTrackingNumber?: string;
}

const ComplaintPortal: React.FC<ComplaintPortalProps> = ({
    initialMode = 'submit',
    initialTrackingNumber = ''
}) => {
    const { executeRecaptcha } = useRecaptcha();
    const { user, isAuthenticated } = useAuth();
    const { language, t } = useLanguage();
    const isAr = language === 'ar';
    const [activeTab, setActiveTab] = useState<'submit' | 'track'>(initialMode);
    const [directoratesList, setDirectoratesList] = useState<Directorate[]>([]);
    const [whatsappNumber, setWhatsappNumber] = useState('963912345678');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [copied, setCopied] = useState(false);

    // Terms Agreement State
    const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
    const [showTermsScreen, setShowTermsScreen] = useState(true);

    useEffect(() => {
        API.directorates.getAll()
            .then(data => setDirectoratesList(data))
            .catch(err => console.error('Failed to load directorates:', err));
        API.settings.getByGroup('contact')
            .then(data => {
                const settings = data as Record<string, string>;
                if (settings.contact_whatsapp) setWhatsappNumber(settings.contact_whatsapp);
            })
            .catch(() => { });
    }, []);

    // Fetch complaint templates when anonymous mode changes (T019)
    useEffect(() => {
        const loadTemplates = async () => {
            setLoadingComplaintTemplates(true);
            try {
                const data = await getComplaintTemplates(isAnonymous);
                setComplaintTemplates(data);
                // Auto-select the "open" (شكوى عامة) template as default
                const openTemplate = data.find((t: any) => t.type === 'open');
                if (openTemplate) {
                    setSelectedTemplateId(openTemplate.id);
                    setFormData(prev => ({ ...prev, category: openTemplate.type || openTemplate.name }));
                } else {
                    setSelectedTemplateId('');
                }
                setTemplateFieldValues({});
            } catch (err) {
                console.error('Failed to load complaint templates:', err);
            } finally {
                setLoadingComplaintTemplates(false);
            }
        };
        if (!showTermsScreen) {
            loadTemplates();
        }
    }, [isAnonymous, showTermsScreen]);


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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

    // Upload Progress State
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<'uploading' | 'completed' | 'error'>('uploading');


    // Dynamic template field values
    const [templateFieldValues, setTemplateFieldValues] = useState<Record<string, string>>({});

    // Complaint Template Dropdown State (T019)
    const [complaintTemplates, setComplaintTemplates] = useState<any[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
    const [loadingComplaintTemplates, setLoadingComplaintTemplates] = useState(false);
    const [templateListOpen, setTemplateListOpen] = useState(false);

    // OTP Verification State (for unauthenticated non-anonymous users)
    const [otpStep, setOtpStep] = useState<'none' | 'sending' | 'sent' | 'verifying' | 'verified'>('none');
    const [otpCode, setOtpCode] = useState('');
    const [guestToken, setGuestToken] = useState<string | null>(null);
    const [otpError, setOtpError] = useState<string | null>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Tracking State
    const [trackId, setTrackId] = useState(initialTrackingNumber);
    const [trackNationalId, setTrackNationalId] = useState('');
    const [trackingResult, setTrackingResult] = useState<Ticket | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [trackError, setTrackError] = useState<string | null>(null);
    const [trackMode, setTrackMode] = useState<'identified' | 'anonymous'>('identified');

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

    // Pre-fill form data for authenticated users
    useEffect(() => {
        if (isAuthenticated && user && !isAnonymous) {
            setFormData(prev => ({
                ...prev,
                firstName: user.first_name || '',
                fatherName: user.father_name || '',
                lastName: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                nationalId: user.national_id || '',
                dob: user.birth_date ? user.birth_date.split('T')[0] : '',
            }));
        } else if (isAnonymous) {
            // Clear personal data for anonymous submissions
            setFormData(prev => ({
                ...prev,
                firstName: '',
                lastName: '',
                fatherName: '',
                email: '',
                phone: '',
                nationalId: '',
                dob: ''
            }));
        }
    }, [isAuthenticated, user, isAnonymous]);

    // Handle delete complaint (only for "received/new" status)
    const handleDeleteComplaint = async () => {
        if (!trackingResult || (trackingResult.status !== 'new' && trackingResult.status !== 'received')) {
            toast.error(t('complaint_delete_not_allowed'), {
                description: t('complaint_delete_error_status'),
            });
            return;
        }

        setIsDeleting(true);
        try {
            const success = await API.complaints.delete(trackingResult.id);
            if (success) {
                toast.success(t('complaint_delete_success'));
                setTrackingResult(null);
                setTrackId('');
                setTrackNationalId('');
            } else {
                toast.error(t('complaint_delete_failed'));
            }
        } catch (e) {
            toast.error(t('complaint_delete_error_generic'));
        } finally {
            setIsDeleting(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
    };

    const handleSendOtp = async () => {
        if (!formData.phone || !formData.nationalId) {
            toast.error(t('complaint_otp_fill_fields'));
            return;
        }
        setOtpStep('sending');
        setOtpError(null);
        try {
            const res = await fetch('/api/v1/complaints/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.phone, national_id: formData.nationalId })
            });
            if (res.ok) {
                setOtpStep('sent');
                toast.success(t('complaint_otp_sent'));
            } else {
                const data = await res.json().catch(() => ({}));
                setOtpError(data.message || t('complaint_otp_send_failed'));
                setOtpStep('none');
            }
        } catch {
            setOtpError(t('complaint_otp_send_failed'));
            setOtpStep('none');
        }
    };

    const handleVerifyOtp = async () => {
        if (!otpCode) return;
        setOtpStep('verifying');
        setOtpError(null);
        try {
            const res = await fetch('/api/v1/complaints/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.phone, national_id: formData.nationalId, otp: otpCode })
            });
            if (res.ok) {
                const data = await res.json();
                setGuestToken(data.guest_token);
                setOtpStep('verified');
                toast.success(t('complaint_otp_verified'));
            } else {
                const data = await res.json().catch(() => ({}));
                setOtpError(data.message || t('complaint_otp_verify_failed'));
                setOtpStep('sent');
            }
        } catch {
            setOtpError(t('complaint_otp_verify_failed'));
            setOtpStep('sent');
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
        setUploadProgress(0);
        setUploadStatus('uploading');

        try {
            // Execute reCAPTCHA v3
            const recaptchaToken = await executeRecaptcha('submit_complaint');

            // Build submission data with file and template info
            const submitData: any = {
                ...formData,
                recaptcha_token: recaptchaToken,
                file: selectedFile,
                template_id: selectedTemplateId || undefined,
                template_fields: Object.keys(templateFieldValues).length > 0 ? templateFieldValues : undefined,
            };
            if (guestToken) {
                submitData.guest_token = guestToken;
            }

            const ticketId = await API.complaints.submitWithProgress(submitData, (progress) => {
                setUploadProgress(progress);
            });

            setUploadStatus('completed');
            setSubmittedTicket(ticketId);
            toast.success(t('complaint_success'), {
                description: ticketId
                    ? `${t('complaint_ticket_number')}: ${ticketId}`
                    : t('complaint_success_desc'),
                duration: 8000,
            });
        } catch (e: any) {
            console.error("Submission failed", e);
            setUploadStatus('error');
            setUploadProgress(0);
            toast.error(t('complaint_submit_fail'), {
                description: e?.message || t('complaint_try_again'),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsTracking(true);
        setTrackError(null);
        setTrackingResult(null);

        // Validate national ID only for identified mode
        if (trackMode === 'identified' && !/^\d{11}$/.test(trackNationalId)) {
            setTrackError(t('complaint_national_id_invalid'));
            toast.error(t('complaint_national_id_invalid'));
            setIsTracking(false);
            return;
        }

        try {
            const result = await API.complaints.track(
                trackId,
                trackMode === 'identified' ? trackNationalId : undefined
            );
            if (result) {
                setTrackingResult(result);
                toast.success(t('complaint_found'), {
                    description: `${t('complaint_status_label')} ${getStatusLabel(result.status)}`,
                });
            } else {
                setTrackError(t('complaint_not_found'));
                toast.error(t('complaint_not_found'), {
                    description: t('complaint_verify_ticket_id'),
                });
            }
        } catch (e: any) {
            if (e?.message === 'national_id_mismatch') {
                setTrackError(t('complaint_national_id_mismatch'));
                toast.error(t('complaint_national_id_mismatch'));
            } else {
                setTrackError(t('complaint_connection_error_desc'));
                toast.error(t('complaint_connection_error'), {
                    description: t('complaint_connection_error_desc'),
                });
            }
        } finally {
            setIsTracking(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-gov-ocean/10 text-gov-ocean dark:bg-gov-ocean/20 dark:text-gov-oceanLight';
            case 'pending': return 'bg-gov-gold/10 text-gov-gold dark:bg-gov-emerald/20';
            case 'processing': return 'bg-gov-cornflower/10 text-gov-cornflower dark:bg-gov-cornflower/20';
            case 'resolved': return 'bg-gov-emerald/10 text-gov-emerald dark:bg-gov-emerald/20';
            case 'rejected': return 'bg-gov-cherry/10 text-gov-cherry dark:bg-gov-cherry/20';
            default: return 'bg-gov-stone/10 text-gov-stone dark:bg-gov-stone/20 dark:text-white/70';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'new': return t('complaint_status_new');
            case 'pending': return t('admin_in_progress'); // Map pending to in progress/generic
            case 'processing': return t('complaint_status_in_progress');
            case 'resolved': return t('complaint_status_resolved');
            case 'rejected': return t('complaint_status_rejected');
            default: return status;
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 pt-24 md:pt-28 pb-12">

            {/* Tabs */}
            <div className="flex bg-white dark:bg-dm-surface p-1 rounded-2xl shadow-sm border border-gray-200 dark:border-gov-border/25 mb-8 max-w-md mx-auto">
                <button
                    onClick={() => { setActiveTab('submit'); setSubmittedTicket(null); setShowTermsScreen(true); setHasAgreedToTerms(false); }}
                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all ${activeTab === 'submit'
                        ? 'bg-gov-forest dark:bg-gov-button text-white shadow-md'
                        : 'text-gray-500 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                >
                    {t('complaint_submit_tab')}
                </button>
                <button
                    onClick={() => { setActiveTab('track'); setSubmittedTicket(null); }}
                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all ${activeTab === 'track'
                        ? 'bg-gov-forest dark:bg-gov-button text-white shadow-md'
                        : 'text-gray-500 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                >
                    {t('complaint_track_tab')}
                </button>
            </div>

            <div className="bg-white dark:bg-dm-surface rounded-[2rem] shadow-xl border border-gray-100 dark:border-gov-border/25 overflow-hidden backdrop-blur-sm">

                {/* SUBMIT TAB - TERMS AGREEMENT SCREEN */}
                {activeTab === 'submit' && !submittedTicket && showTermsScreen && (
                    <div className="p-8 md:p-12 animate-fade-in">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gov-forest/10 dark:bg-gov-emerald/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Scale size={32} className="text-gov-forest dark:text-gov-teal" />
                            </div>
                            <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">
                                {t('nav_complaints')}
                            </h2>
                        </div>

                        {/* Warning Box */}
                        <div className="bg-gov-cherry/5 dark:bg-gov-cherry/10 border border-gov-cherry/20 dark:border-gov-cherry/30 rounded-xl p-5 mb-6">
                            <div className="flex items-start gap-3">
                                <ShieldAlert size={24} className="text-gov-cherry flex-shrink-0 mt-0.5" />
                                <div className="space-y-2">
                                    <p className="text-gov-cherry dark:text-red-400 font-bold text-sm">
                                        {t('complaint_accurate_info_required')}
                                    </p>
                                    <p className="text-gov-cherry dark:text-red-400 font-bold text-sm mt-3">
                                        {t('complaint_false_info_warning')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Terms Section */}
                        <div className="bg-white dark:bg-gov-card/10 border border-gray-200 dark:border-gov-border/25 rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-display font-bold text-gov-forest dark:text-gov-teal mb-4">
                                {t('complaint_review_guidelines')}
                            </h3>

                            <p className="text-gov-charcoal dark:text-white/70 text-sm mb-6 leading-relaxed">
                                {t('complaint_review_desc')}
                            </p>

                            {/* Conditions List */}
                            <div className="bg-gov-beige/50 dark:bg-gov-card/10 rounded-lg p-4 mb-4">
                                <p className="text-gov-forest dark:text-gov-teal font-bold text-sm mb-3">
                                    {t('complaint_condition_intro')}
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-gov-cherry rounded-full mt-2 flex-shrink-0"></span>
                                        <p className="text-gov-charcoal dark:text-white text-sm">
                                            {t('complaint_condition_1')}
                                        </p>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-gov-cherry rounded-full mt-2 flex-shrink-0"></span>
                                        <p className="text-gov-charcoal dark:text-white text-sm">
                                            {t('complaint_condition_2')}
                                        </p>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-gov-cherry rounded-full mt-2 flex-shrink-0"></span>
                                        <p className="text-gov-charcoal dark:text-white text-sm">
                                            {t('complaint_condition_3')}
                                        </p>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-gov-cherry rounded-full mt-2 flex-shrink-0"></span>
                                        <p className="text-gov-charcoal dark:text-white text-sm">
                                            {t('complaint_condition_4')}
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Agreement Checkbox */}
                        <div className="bg-gov-forest/5 dark:bg-gov-emerald/10 rounded-xl p-5 mb-6">
                            <label className="flex items-start gap-3 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={hasAgreedToTerms}
                                    onChange={(e) => setHasAgreedToTerms(e.target.checked)}
                                    className="w-5 h-5 mt-0.5 rounded border-gov-forest dark:border-gov-teal text-gov-forest dark:text-gov-teal focus:ring-gov-gold transition-colors cursor-pointer"
                                />
                                <p className="text-gov-forest dark:text-white font-bold text-sm">
                                    {t('complaint_agree_terms')}
                                </p>
                            </label>
                        </div>

                        {/* Proceed Button */}
                        <button
                            type="button"
                            onClick={() => setShowTermsScreen(false)}
                            disabled={!hasAgreedToTerms}
                            className="w-full py-4 rounded-xl bg-gov-forest dark:bg-gov-button text-white font-bold shadow-lg hover:bg-gov-teal dark:hover:bg-gov-gold transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gov-forest dark:disabled:hover:bg-gov-button"
                        >
                            <span>{t('complaint_start_new')}</span>
                            <ChevronLeft size={20} className="rtl:rotate-180" />
                        </button>
                    </div>
                )}

                {/* SUBMIT TAB - COMPLAINT FORM */}
                {activeTab === 'submit' && !submittedTicket && !showTermsScreen && (
                    <div className="p-8 md:p-12 animate-fade-in">
                        {/* Back to terms link */}
                        <button
                            type="button"
                            onClick={() => setShowTermsScreen(true)}
                            className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/70 hover:text-gov-forest dark:hover:text-gov-gold mb-6 transition-colors"
                        >
                            <ChevronRight size={16} className="rtl:rotate-180" />
                            <span>{t('complaint_back_terms')}</span>
                        </button>

                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">{t('general_form')}</h2>
                            <p className="text-gray-600 dark:text-white/70">{t('complaint_subtitle')}</p>
                        </div>

                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">


                            {/* Anonymous / Known User Toggle */}
                            <div className="bg-gov-beige/50 dark:bg-gov-card/10 p-4 rounded-xl border border-gov-gold/20">
                                <div className="flex items-center justify-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAnonymous(false)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${!isAnonymous
                                            ? 'bg-gov-forest dark:bg-gov-button text-white'
                                            : 'bg-white dark:bg-white/10 text-gray-600 dark:text-white/70 border border-gray-200 dark:border-gov-border/25'
                                            }`}
                                    >
                                        <User size={16} />
                                        {isAuthenticated ? t('complaint_my_data') : t('complaint_known_identity')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAnonymous(true)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${isAnonymous
                                            ? 'bg-gov-forest dark:bg-gov-button text-white'
                                            : 'bg-white dark:bg-white/10 text-gray-600 dark:text-white/70 border border-gray-200 dark:border-gov-border/25'
                                            }`}
                                    >
                                        <UserX size={16} />
                                        {t('complaint_anonymous_identity')}
                                    </button>
                                </div>
                            </div>

                            {/* Complaint Template Selection (T019) */}
                            <div className="bg-gov-gold/5 dark:bg-gov-emerald/10 rounded-xl border border-gov-gold/30">
                                {/* Clickable Header / Trigger */}
                                <button
                                    type="button"
                                    onClick={() => setTemplateListOpen(!templateListOpen)}
                                    className="w-full p-4 flex items-center justify-between gap-3 text-start"
                                >
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <FileCheck size={18} className="text-gov-forest dark:text-gov-teal flex-shrink-0" />
                                        {selectedTemplateId ? (() => {
                                            const tmpl = complaintTemplates.find(t => t.id === selectedTemplateId);
                                            return (
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="font-bold text-sm text-gov-forest dark:text-gov-teal truncate">
                                                        {tmpl ? (isAr ? tmpl.name : (tmpl.name_en || tmpl.name)) : ''}
                                                    </span>
                                                    <CheckCircle2 size={16} className="text-gov-emerald flex-shrink-0" />
                                                </div>
                                            );
                                        })() : (
                                            <span className="font-bold text-sm text-gov-charcoal dark:text-white">
                                                {t('complaint_template_select')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-gov-gold font-bold text-xs">* {t('complaint_required')}</span>
                                        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${templateListOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>

                                {/* Collapsible Card List */}
                                {templateListOpen && (
                                    <div className="px-4 pb-4 animate-fade-in">
                                        {loadingComplaintTemplates ? (
                                            <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500">
                                                <Loader2 size={20} className="animate-spin text-gov-gold" />
                                                {t('complaint_loading_templates')}
                                            </div>
                                        ) : complaintTemplates.filter(tmpl => !isAnonymous || tmpl.type !== 'open').length === 0 ? (
                                            <div className="text-center py-8 text-gray-500 dark:text-white/70">
                                                <FileText size={36} className="mx-auto mb-3 opacity-50" />
                                                <p className="text-sm">{t('complaint_no_templates')}</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                                                {complaintTemplates
                                                    .filter(tmpl => !isAnonymous || tmpl.type !== 'open')
                                                    .map(tmpl => {
                                                        const isSelected = selectedTemplateId === tmpl.id;
                                                        return (
                                                            <button
                                                                key={tmpl.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedTemplateId(tmpl.id);
                                                                    setTemplateFieldValues({});
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        category: tmpl.type || tmpl.name,
                                                                    }));
                                                                    setTemplateListOpen(false);
                                                                }}
                                                                className={`w-full p-4 rounded-xl border transition-all text-start ${isSelected
                                                                    ? 'bg-gov-forest/5 dark:bg-gov-emerald/20 border-gov-forest dark:border-gov-teal shadow-sm'
                                                                    : 'bg-white dark:bg-gov-card/10 border-gray-100 dark:border-gov-border/15 hover:border-gov-gold/50 hover:bg-gov-gold/5 dark:hover:bg-gov-gold/10'
                                                                    }`}
                                                            >
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className={`font-bold mb-1 text-sm ${isSelected ? 'text-gov-forest dark:text-gov-teal' : 'text-gov-charcoal dark:text-white'}`}>
                                                                            {isAr ? tmpl.name : (tmpl.name_en || tmpl.name)}
                                                                        </h4>
                                                                        {(tmpl.description || tmpl.description_en) && (
                                                                            <p className="text-xs text-gray-500 dark:text-white/70 line-clamp-2">
                                                                                {isAr ? tmpl.description : (tmpl.description_en || tmpl.description)}
                                                                            </p>
                                                                        )}
                                                                        {tmpl.type && (
                                                                            <span className="inline-block mt-2 px-2 py-0.5 rounded bg-gov-teal/10 dark:bg-gov-teal/20 text-gov-teal text-xs font-bold">
                                                                                {tmpl.type === 'open' ? (isAr ? 'شكوى عامة' : 'General Complaint') : tmpl.type === 'standard' ? (isAr ? 'نموذج قياسي' : 'Standard Template') : tmpl.type}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className={`flex-shrink-0 mt-0.5 ${isSelected ? 'text-gov-forest dark:text-gov-teal' : 'text-gray-300 dark:text-white/70'}`}>
                                                                        {isSelected ? <CheckCircle2 size={20} /> : <ClipboardList size={18} />}
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Hidden required input for form validation */}
                                <input type="hidden" required value={selectedTemplateId} />
                            </div>

                            {/* Dynamic Template Fields */}
                            {(() => {
                                const selectedTmpl = complaintTemplates.find(t => t.id === selectedTemplateId);
                                const fields = selectedTmpl?.fields;
                                if (!selectedTmpl || !Array.isArray(fields) || fields.length === 0) return null;
                                // Skip if fields are old format (plain strings)
                                if (fields.length > 0 && typeof fields[0] === 'string') return null;
                                return (
                                    <div className="space-y-4 p-4 bg-gov-beige/30 dark:bg-gov-card/10 rounded-xl border border-gov-gold/20">
                                        <h3 className="text-sm font-bold text-gov-forest dark:text-gov-teal flex items-center gap-2">
                                            <FileText size={16} />
                                            {isAr ? 'بيانات النموذج' : 'Form Fields'}
                                        </h3>
                                        {(fields as Array<{ key?: string; label: string; label_en?: string; type: string; required?: boolean; placeholder?: string; placeholder_en?: string; options?: Array<{ value: string; label: string; label_en?: string }> }>).map((field, idx) => {
                                            const fieldKey = field.key || `field_${idx}`;
                                            const fieldLabel = isAr ? field.label : (field.label_en || field.label);
                                            const fieldPlaceholder = isAr ? (field.placeholder || '') : (field.placeholder_en || field.placeholder || '');
                                            const isRequired = field.required === true || field.required === '1' as any;

                                            return (
                                                <div key={fieldKey}>
                                                    <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                                        {fieldLabel} {isRequired && <span className="text-gov-gold">*</span>}
                                                    </label>
                                                    {field.type === 'textarea' ? (
                                                        <textarea
                                                            required={isRequired}
                                                            value={templateFieldValues[fieldKey] || ''}
                                                            onChange={(e) => setTemplateFieldValues(prev => ({ ...prev, [fieldKey]: e.target.value }))}
                                                            rows={4}
                                                            placeholder={fieldPlaceholder}
                                                            className="w-full p-3 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-forest/20 transition-all outline-none resize-none text-sm"
                                                        />
                                                    ) : field.type === 'select' && field.options ? (
                                                        <select
                                                            required={isRequired}
                                                            value={templateFieldValues[fieldKey] || ''}
                                                            onChange={(e) => setTemplateFieldValues(prev => ({ ...prev, [fieldKey]: e.target.value }))}
                                                            className="w-full py-3 px-4 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-forest/20 transition-all outline-none appearance-none text-sm"
                                                        >
                                                            <option value="" className="dark:bg-dm-surface">{isAr ? 'اختر...' : 'Select...'}</option>
                                                            {field.options.map(opt => (
                                                                <option key={opt.value} value={opt.value} className="dark:bg-dm-surface">
                                                                    {isAr ? opt.label : (opt.label_en || opt.label)}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : field.type === 'date' ? (
                                                        <input
                                                            type="date"
                                                            required={isRequired}
                                                            value={templateFieldValues[fieldKey] || ''}
                                                            onChange={(e) => setTemplateFieldValues(prev => ({ ...prev, [fieldKey]: e.target.value }))}
                                                            className="w-full py-3 px-4 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-forest/20 transition-all outline-none text-sm"
                                                        />
                                                    ) : field.type === 'number' ? (
                                                        <input
                                                            type="number"
                                                            required={isRequired}
                                                            value={templateFieldValues[fieldKey] || ''}
                                                            onChange={(e) => setTemplateFieldValues(prev => ({ ...prev, [fieldKey]: e.target.value }))}
                                                            placeholder={fieldPlaceholder}
                                                            className="w-full py-3 px-4 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-forest/20 transition-all outline-none text-sm"
                                                        />
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            required={isRequired}
                                                            value={templateFieldValues[fieldKey] || ''}
                                                            onChange={(e) => setTemplateFieldValues(prev => ({ ...prev, [fieldKey]: e.target.value }))}
                                                            placeholder={fieldPlaceholder}
                                                            className="w-full py-3 px-4 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-forest/20 transition-all outline-none text-sm"
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })()}

                            {/* Document Upload / OCR */}
                            <div className="bg-gov-beige/50 dark:bg-gov-card/10 border-2 border-dashed border-gov-gold/40 rounded-xl p-6 text-center">
                                <input
                                    type="file"
                                    accept="image/*,.pdf,.doc,.docx"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                                {!selectedFile ? (
                                    <div className="flex flex-col items-center gap-3 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <div className="w-12 h-12 rounded-full bg-white dark:bg-gov-emerald/20 flex items-center justify-center text-gov-forest dark:text-gov-teal shadow-sm">
                                            <Upload size={24} />
                                        </div>
                                        <div>
                                            <span className="block font-bold text-gov-charcoal dark:text-white text-sm">{t('complaint_ocr_attach')}</span>
                                            <span className="text-xs text-gray-500 dark:text-white/70">PDF, DOC, JPG, PNG</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between bg-white dark:bg-gov-card/10 p-3 rounded-lg border border-gov-gold/20">
                                            <div className="flex items-center gap-3">
                                                <FileText size={20} className="text-gov-forest dark:text-gov-teal" />
                                                <span className="text-sm font-bold text-gov-charcoal dark:text-white truncate max-w-[200px]">{selectedFile.name}</span>
                                                <span className="text-xs text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                            </div>
                                            <button type="button" onClick={removeFile} className="text-gov-cherry hover:bg-gov-cherry/10 p-1 rounded">
                                                <X size={16} />
                                            </button>
                                        </div>

                                        {/* Show Progress Bar during upload */}
                                        {isSubmitting && selectedFile && (
                                            <UploadProgress
                                                fileName={selectedFile.name}
                                                progress={uploadProgress}
                                                status={uploadStatus}
                                                fileSize={`${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Personal Information - Hidden for anonymous submissions */}
                            {!isAnonymous && (
                                <div className="bg-gray-50 dark:bg-gov-card/10 p-6 rounded-xl border border-gray-100 dark:border-gov-border/15">
                                    <h3 className="font-display font-bold text-gov-forest dark:text-gov-teal mb-4 text-base border-b border-gov-gold/20 dark:border-gov-border/15 pb-2">
                                        {t('complaint_personal_info')}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-white/70 mb-1">{t('complaint_first_name')} <span className="text-gov-gold">*</span></label>
                                            <div className="relative">
                                                <input
                                                    type="text" required
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                    className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-sm focus:border-gov-forest dark:focus:border-gov-gold outline-none transition-colors dark:text-white"
                                                />
                                                <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-white/70 mb-1">{t('complaint_father_name')} <span className="text-gov-gold">*</span></label>
                                            <div className="relative">
                                                <input
                                                    type="text" required
                                                    value={formData.fatherName}
                                                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                                                    className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-sm focus:border-gov-forest dark:focus:border-gov-gold outline-none transition-colors dark:text-white"
                                                />
                                                <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-white/70 mb-1">{t('complaint_last_name')} <span className="text-gov-gold">*</span></label>
                                            <div className="relative">
                                                <input
                                                    type="text" required
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-sm focus:border-gov-forest dark:focus:border-gov-gold outline-none transition-colors dark:text-white"
                                                />
                                                <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-white/70 mb-1">{t('complaint_national_id')} <span className="text-gov-gold">*</span></label>
                                            <div className="relative">
                                                <input
                                                    type="text" required maxLength={11} minLength={11} placeholder={t('complaint_national_id_hint')}
                                                    value={formData.nationalId}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        setFormData({ ...formData, nationalId: val });
                                                    }}
                                                    className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-sm focus:border-gov-forest dark:focus:border-gov-gold outline-none font-mono transition-colors dark:text-white"
                                                />
                                                <Fingerprint className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-white/70 mb-1">{t('complaint_dob')} <span className="text-gov-gold">*</span></label>
                                            <div className="relative">
                                                <input
                                                    type="date" required
                                                    value={formData.dob}
                                                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                                    className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-sm focus:border-gov-forest dark:focus:border-gov-gold outline-none transition-colors dark:text-white"
                                                />
                                                <Calendar className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email & Phone - moved up to applicant section per item 13 */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-white/70 mb-1">{t('complaint_phone')} <span className="text-gov-gold">*</span></label>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    required={!isAnonymous}
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-sm focus:border-gov-forest dark:focus:border-gov-gold outline-none transition-colors dark:text-white"
                                                />
                                                <Phone className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-white/70 mb-1">{t('complaint_email')} <span className="text-gov-gold">*</span></label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    required={!isAnonymous}
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-sm focus:border-gov-forest dark:focus:border-gov-gold outline-none transition-colors dark:text-white"
                                                />
                                                <Mail className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Description - Only visible for "open" complaint template (T020) */}
                            {(() => {
                                const selectedTmpl = complaintTemplates.find(t => t.id === selectedTemplateId);
                                return (!selectedTemplateId || selectedTmpl?.type === 'open');
                            })() && (
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {t('complaint_details')} <span className="text-gov-gold">*</span>
                                        </label>
                                        <textarea
                                            required
                                            value={formData.details}
                                            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                            rows={6}
                                            className="w-full p-4 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-forest/20 transition-all outline-none resize-none"
                                            placeholder={t('complaint_placeholder')}
                                        />
                                    </div>
                                )}


                            {/* Previous Complaint Field (Added for V2) */}
                            <div className="bg-gray-50 dark:bg-gov-card/10 p-6 rounded-xl border border-gray-100 dark:border-gov-border/15">
                                <h3 className="font-display font-bold text-gov-forest dark:text-gov-teal mb-4 text-base border-b border-gov-gold/20 dark:border-gov-border/15 pb-2">{t('complaint_details')} ({t('sitemap_previous')})</h3>

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
                                            {t('complaint_prev_related')}
                                        </label>
                                    </div>

                                    {formData.hasPreviousComplaint && (
                                        <div className="animate-fade-in">
                                            <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                                {t('complaint_prev_ticket')} <span className="text-gov-gold">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    required={formData.hasPreviousComplaint}
                                                    value={formData.previousTrackingNumber || ''}
                                                    onChange={(e) => setFormData({ ...formData, previousTrackingNumber: e.target.value })}
                                                    placeholder={t('complaint_prev_ticket_placeholder')}
                                                    className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-forest/20 transition-all outline-none font-mono"
                                                />
                                                <History className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-white/70 mt-2">
                                                {t('complaint_prev_ticket_hint')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 rounded-xl bg-gov-forest dark:bg-gov-button text-white font-bold shadow-lg hover:bg-gov-teal dark:hover:bg-gov-gold transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                    {isSubmitting ? t('complaint_sending') : t('complaint_submit')}
                                </button>
                            </div>
                        </form>
                    </div>
                )
                }

                {/* SUCCESS STATE */}
                {
                    submittedTicket && (
                        <div className="p-12 text-center animate-fade-in flex flex-col items-center">
                            <div className="w-20 h-20 bg-gov-emerald/10 dark:bg-gov-emerald/20 rounded-full flex items-center justify-center mb-6 text-gov-emerald">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">{t('complaint_success')}</h2>
                            <p className="text-gray-500 dark:text-white/70 mb-4 max-w-md">{t('complaint_success_desc')}</p>
                            <p className="text-sm text-gov-teal dark:text-gov-teal mb-8 max-w-md font-bold">
                                {isAr ? 'تم تسجيل شكواك بنجاح وسيتم مراجعتها في أقرب وقت ممكن.' : 'Your complaint has been registered and will be reviewed as soon as possible.'}
                            </p>

                            <div className="bg-gov-beige dark:bg-white/10 border-2 border-dashed border-gov-gold/30 p-6 rounded-xl mb-6 w-full max-w-sm">
                                <span className="block text-xs text-gray-500 dark:text-white/70 mb-1">{t('complaint_ticket_number')}</span>
                                <div className="flex items-center justify-center gap-3">
                                    <span className="text-3xl font-display font-bold text-gov-forest dark:text-gov-teal tracking-wider">{submittedTicket}</span>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const success = await copyToClipboard(submittedTicket);
                                            if (success) {
                                                setCopied(true);
                                                toast.success(t('copied'));
                                                setTimeout(() => setCopied(false), 2000);
                                            }
                                        }}
                                        className="p-2 rounded-lg bg-gov-forest/10 dark:bg-gov-emerald/20 text-gov-forest dark:text-gov-teal hover:bg-gov-forest/20 dark:hover:bg-gov-gold/30 transition-colors"
                                        title={isAr ? 'نسخ رقم التتبع' : 'Copy tracking number'}
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button onClick={() => { setSubmittedTicket(null); setActiveTab('track'); }} className="text-gov-forest dark:text-gov-teal font-bold hover:underline">
                                {t('complaint_track_now')}
                            </button>
                        </div>
                    )
                }

                {/* TRACKING TAB */}
                {
                    activeTab === 'track' && (
                        <div className="p-8 md:p-12 animate-fade-in">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">{t('complaint_track_title')}</h2>
                                <p className="text-gray-500 dark:text-white/70">{t('complaint_track_subtitle')}</p>
                            </div>

                            {/* Track Mode Toggle */}
                            <div className="max-w-lg mx-auto mb-6">
                                <div className="bg-gov-beige/50 dark:bg-gov-card/10 p-4 rounded-xl border border-gov-gold/20 dark:border-gov-border/25">
                                    <div className="flex items-center justify-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => { setTrackMode('identified'); setTrackingResult(null); setTrackError(null); }}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${trackMode === 'identified'
                                                ? 'bg-gov-forest dark:bg-gov-button text-white'
                                                : 'bg-white dark:bg-white/10 text-gray-600 dark:text-white/70 border border-gray-200 dark:border-gov-border/25'
                                                }`}
                                        >
                                            <Fingerprint size={16} />
                                            {t('complaint_track_identified')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setTrackMode('anonymous'); setTrackingResult(null); setTrackError(null); setTrackNationalId(''); }}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${trackMode === 'anonymous'
                                                ? 'bg-gov-forest dark:bg-gov-button text-white'
                                                : 'bg-white dark:bg-white/10 text-gray-600 dark:text-white/70 border border-gray-200 dark:border-gov-border/25'
                                                }`}
                                        >
                                            <UserX size={16} />
                                            {t('complaint_track_anonymous')}
                                        </button>
                                    </div>
                                    <p className="text-xs text-center text-gray-500 dark:text-white/50 mt-2">
                                        {trackMode === 'identified' ? t('complaint_track_identified_desc') : t('complaint_track_anonymous_desc')}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleTrack} className="max-w-lg mx-auto mb-10 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-white/70 mb-1">{t('complaint_ticket_label')}</label>
                                    <input
                                        type="text"
                                        placeholder={t('complaint_ticket_placeholder')}
                                        value={trackId}
                                        onChange={(e) => setTrackId(e.target.value)}
                                        className="w-full p-3 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold outline-none"
                                        required
                                    />
                                </div>
                                {trackMode === 'identified' && (
                                    <div className="animate-fade-in">
                                        <label className="block text-xs font-bold text-gray-500 dark:text-white/70 mb-1">{t('complaint_national_id_verify')}</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="\d{11}"
                                            maxLength={11}
                                            minLength={11}
                                            placeholder={t('complaint_national_id_placeholder')}
                                            value={trackNationalId}
                                            onChange={(e) => setTrackNationalId(e.target.value.replace(/\D/g, ''))}
                                            className="w-full p-3 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold outline-none"
                                            required
                                        />
                                    </div>
                                )}
                                <button type="submit" className="w-full bg-gov-forest dark:bg-gov-button text-white py-3 rounded-xl font-bold hover:bg-gov-teal dark:hover:bg-gov-gold transition-colors flex items-center justify-center gap-2">
                                    {isTracking ? <Loader2 className="animate-spin" /> : <Search />}
                                    <span>{t('ui_search')}</span>
                                </button>
                                {trackError && <p className="text-gov-cherry text-sm mt-2 text-center">{trackError}</p>}
                            </form>

                            {trackingResult && (
                                <div className="bg-white dark:bg-gov-card/10 border border-gray-100 dark:border-gov-border/25 rounded-2xl p-6 shadow-lg animate-slide-up max-w-lg mx-auto">
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gov-border/15">
                                        <span className="font-bold text-gov-charcoal dark:text-white">{t('complaint_ticket_prefix')} {trackingResult.tracking_number || trackingResult.id}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(trackingResult.status)}`}>
                                            {getStatusLabel(trackingResult.status)}
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 text-gray-400"><AlertCircle size={18} /></div>
                                            <div>
                                                <span className="block text-xs text-gray-500 dark:text-white/70 mb-1">{t('complaint_last_update')}</span>
                                                <span className="text-sm font-medium text-gov-charcoal dark:text-white">
                                                    {trackingResult.updated_at ? new Date(trackingResult.updated_at).toLocaleDateString() : 'غير متوفر'}
                                                </span>
                                            </div>
                                        </div>
                                        {trackingResult.description && (
                                            <div className="flex items-start gap-3 bg-gray-50 dark:bg-white/10 p-3 rounded-lg">
                                                <div className="mt-1 text-gray-400"><FileText size={18} /></div>
                                                <div>
                                                    <span className="block text-xs text-gray-500 dark:text-white/70 mb-1">{t('complaint_details')}</span>
                                                    <span className="text-sm text-gray-700 dark:text-white/70 line-clamp-2">{trackingResult.description}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {trackingResult.responses && trackingResult.responses.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gov-border/15 animate-fade-in">
                                            <h3 className="text-sm font-bold text-gov-forest dark:text-gov-teal mb-4">{t('complaint_responses')}</h3>
                                            <div className="space-y-4">
                                                {trackingResult.responses.map((response) => (
                                                    <div key={response.id} className="bg-gov-ocean/5 dark:bg-gov-ocean/10 p-4 rounded-xl border border-gov-ocean/10 dark:border-gov-ocean/20">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="font-bold text-gov-forest dark:text-gov-oceanLight text-sm">{response.user?.full_name || t('complaint_responses_subtitle')}</span>
                                                            <span className="text-xs text-gray-500 dark:text-white/70">{new Date(response.created_at).toLocaleString('ar-SY')}</span>
                                                        </div>
                                                        <p className="text-gray-700 dark:text-white/70 text-sm whitespace-pre-wrap">{response.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* FR-28: Print Complaint Button & Delete Button */}
                                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gov-border/15 flex flex-col sm:flex-row justify-center gap-3">
                                        <ComplaintPrintButton
                                            trackingNumber={trackingResult.tracking_number || trackingResult.id}
                                        />

                                        {/* FR-22: Delete button only for "received/new" status */}
                                        {(trackingResult.status === 'new' || trackingResult.status === 'received') && (
                                            <button
                                                onClick={handleDeleteComplaint}
                                                disabled={isDeleting}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gov-cherry/10 text-gov-cherry hover:bg-gov-cherry hover:text-white transition-colors font-bold text-sm disabled:opacity-50"
                                            >
                                                {isDeleting ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                                {t('complaint_delete_btn')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {trackingResult && trackingResult.status === 'resolved' && !trackingResult.rating && (
                                <ImportedSatisfactionRating trackingNumber={trackingResult.tracking_number || trackingResult.id} />
                            )}

                            <div className="mt-8 text-center animate-fade-in">
                                <p className="text-sm text-gray-500 dark:text-white/70 mb-3">{t('complaint_need_help')}</p>
                                <a
                                    href={`https://wa.me/${whatsappNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-bold hover:bg-[#20bd5a] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    <span>{t('complaint_whatsapp')}</span>
                                </a>
                            </div>
                        </div>
                    )
                }

            </div >

        </div >
    );
};

export default ComplaintPortal;
