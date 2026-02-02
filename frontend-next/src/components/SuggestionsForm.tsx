'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Upload,
    Send,
    CheckCircle,
    CheckCircle2,
    Search,
    X,
    Loader2,
    User,
    UserX,
    Mail,
    Phone,
    Building2,
    FileText,
    AlertCircle,
    Lightbulb,
    ChevronRight,
    ChevronLeft,
    Copy,
    File,
    Check,
    Fingerprint,
    Calendar,
    ShieldAlert,
} from 'lucide-react';
import { API } from '@/lib/repository';
import { Directorate } from '@/types';
import { getLocalizedName, copyToClipboard } from '@/lib/utils';
import { focusPulse } from '@/lib/animations';
import { toast } from 'sonner';
import { useRecaptcha } from '@/hooks/useRecaptcha';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface SuggestionPortalProps {
    initialMode?: 'submit' | 'track';
    initialTrackingNumber?: string;
}

const SuggestionPortal: React.FC<SuggestionPortalProps> = ({
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

    // Terms Agreement State
    const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
    const [showTermsScreen, setShowTermsScreen] = useState(true);

    // Anonymous / Known Identity State
    const [isAnonymous, setIsAnonymous] = useState(false);

    // OTP Verification State (for unauthenticated non-anonymous users)
    const [otpStep, setOtpStep] = useState<'none' | 'sending' | 'sent' | 'verifying' | 'verified'>('none');
    const [otpCode, setOtpCode] = useState('');
    const [guestToken, setGuestToken] = useState<string | null>(null);
    const [otpError, setOtpError] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        fatherName: '',
        nationalId: '',
        dob: '',
        email: '',
        phone: '',
        directorate_id: '',
        description: '',
        files: [] as File[]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Tracking State
    const [trackId, setTrackId] = useState(initialTrackingNumber);
    const [trackNationalId, setTrackNationalId] = useState('');
    const [trackingResult, setTrackingResult] = useState<any | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [trackError, setTrackError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // Copy state
    const [copied, setCopied] = useState(false);

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
            setFormData(prev => ({
                ...prev,
                firstName: '',
                lastName: '',
                fatherName: '',
                nationalId: '',
                dob: '',
                email: '',
                phone: '',
            }));
        }
    }, [isAuthenticated, user, isAnonymous]);

    useEffect(() => {
        API.directorates.getAll()
            .then(data => setDirectoratesList(data))
            .catch(err => console.error('Failed to load directorates:', err));
        API.settings.getByGroup('contact')
            .then(data => {
                const settings = data as Record<string, string>;
                if (settings.contact_whatsapp) setWhatsappNumber(settings.contact_whatsapp);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!formRef.current) return;
        const inputs = formRef.current.querySelectorAll('input, textarea, select');
        inputs.forEach(el => focusPulse(el as any));
    }, [activeTab]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            const allFiles = [...formData.files, ...newFiles].slice(0, 5);
            setFormData(prev => ({ ...prev, files: allFiles }));
        }
    };

    const removeFile = (index: number) => {
        setFormData(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
    };

    const copyTrackingNumber = async () => {
        if (submittedTicket) {
            const success = await copyToClipboard(submittedTicket);
            if (success) {
                setCopied(true);
                toast.success(t('copied'));
                setTimeout(() => setCopied(false), 2000);
            }
        }
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAnonymous && !formData.firstName) {
            toast.error(t('suggestion_required_fields'));
            return;
        }
        if (!formData.description) {
            toast.error(t('suggestion_required_fields'));
            return;
        }

        setIsSubmitting(true);
        setUploadProgress(0);

        try {
            const recaptchaToken = await executeRecaptcha('submit_suggestion');

            const submitData = isAnonymous
                ? { description: formData.description, directorate_id: formData.directorate_id, files: formData.files, is_anonymous: true as const, recaptcha_token: recaptchaToken }
                : {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    fatherName: formData.fatherName,
                    nationalId: formData.nationalId,
                    dob: formData.dob,
                    email: formData.email,
                    phone: formData.phone,
                    directorate_id: formData.directorate_id,
                    description: formData.description,
                    files: formData.files,
                    is_anonymous: false as const,
                    recaptcha_token: recaptchaToken,
                    guest_token: guestToken || undefined,
                };

            const result = await API.suggestions.submitWithProgress(
                submitData,
                (progress) => setUploadProgress(progress)
            );

            const newTrackingNumber = result.tracking_number || (result as any).trackingNumber || null;
            setSubmittedTicket(newTrackingNumber);
            toast.success(t('suggestion_success'), {
                description: newTrackingNumber
                    ? `${t('suggestion_tracking_number')}: ${newTrackingNumber}`
                    : undefined,
                duration: 8000,
            });
            setFormData({ firstName: '', lastName: '', fatherName: '', nationalId: '', dob: '', email: '', phone: '', directorate_id: '', description: '', files: [] });
            setUploadProgress(0);
            setOtpStep('none');
            setOtpCode('');
            setGuestToken(null);
        } catch (err: any) {
            console.error('Submission failed', err);
            toast.error(t('suggestion_failed'), {
                description: err?.message || t('complaint_try_again'),
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

        try {
            const result = await API.suggestions.track(trackId);
            if (result) {
                setTrackingResult(result);
                toast.success(isAr ? 'تم العثور على المقترح' : 'Suggestion found');
            } else {
                setTrackError(t('suggestion_not_found'));
                toast.error(t('suggestion_not_found'));
            }
        } catch (e) {
            setTrackError(t('complaint_connection_error_desc'));
            toast.error(t('complaint_connection_error'), {
                description: t('complaint_connection_error_desc'),
            });
        } finally {
            setIsTracking(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-gov-ocean/10 text-gov-ocean dark:bg-gov-ocean/20 dark:text-gov-oceanLight';
            case 'pending': return 'bg-gov-gold/10 text-gov-gold dark:bg-gov-emerald/20';
            case 'processing': return 'bg-gov-cornflower/10 text-gov-cornflower dark:bg-gov-cornflower/20';
            case 'reviewed': return 'bg-gov-emerald/10 text-gov-emerald dark:bg-gov-emerald/20';
            case 'implemented': return 'bg-gov-emerald/10 text-gov-emerald dark:bg-gov-emerald/20';
            case 'rejected': return 'bg-gov-cherry/10 text-gov-cherry dark:bg-gov-cherry/20';
            default: return 'bg-gov-stone/10 text-gov-stone dark:bg-gov-stone/20 dark:text-white/70';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'new': return t('complaint_status_new');
            case 'pending': return t('admin_in_progress');
            case 'processing': return t('complaint_status_in_progress');
            case 'reviewed': return isAr ? 'تمت المراجعة' : 'Reviewed';
            case 'implemented': return isAr ? 'تم التنفيذ' : 'Implemented';
            case 'rejected': return t('complaint_status_rejected');
            default: return status;
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">

            {/* Tabs */}
            <div className="flex bg-white dark:bg-dm-surface p-1 rounded-2xl shadow-sm border border-gray-200 dark:border-gov-border/25 mb-8 max-w-md mx-auto">
                <button
                    onClick={() => { setActiveTab('submit'); setSubmittedTicket(null); setShowTermsScreen(true); setHasAgreedToTerms(false); }}
                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all ${activeTab === 'submit'
                        ? 'bg-gov-forest dark:bg-gov-button text-white shadow-md'
                        : 'text-gray-500 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                >
                    {t('suggestion_submit_tab')}
                </button>
                <button
                    onClick={() => { setActiveTab('track'); setSubmittedTicket(null); }}
                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all ${activeTab === 'track'
                        ? 'bg-gov-forest dark:bg-gov-button text-white shadow-md'
                        : 'text-gray-500 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                >
                    {t('suggestion_track_tab')}
                </button>
            </div>

            <div className="bg-white dark:bg-dm-surface rounded-[2rem] shadow-xl border border-gray-100 dark:border-gov-border/25 overflow-hidden backdrop-blur-sm">

                {/* SUBMIT TAB - TERMS AGREEMENT SCREEN */}
                {activeTab === 'submit' && !submittedTicket && showTermsScreen && (
                    <div className="p-8 md:p-12 animate-fade-in">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gov-forest/10 dark:bg-gov-emerald/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lightbulb size={32} className="text-gov-forest dark:text-gov-teal" />
                            </div>
                            <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">
                                {t('suggestion_terms_title')}
                            </h2>
                            <p className="text-gray-600 dark:text-white/70">
                                {t('suggestion_terms_info')}
                            </p>
                        </div>


                        {/* Terms Section */}
                        <div className="bg-white dark:bg-gov-card/10 border border-gray-200 dark:border-gov-border/25 rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-display font-bold text-gov-forest dark:text-gov-teal mb-4">
                                {t('suggestion_terms_guidelines')}
                            </h3>

                            <p className="text-gov-charcoal dark:text-white/70 text-sm mb-6 leading-relaxed">
                                {t('suggestion_terms_desc')}
                            </p>

                            {/* Conditions List */}
                            <div className="bg-gov-beige/50 dark:bg-gov-card/10 rounded-lg p-4 mb-4">
                                <p className="text-gov-forest dark:text-gov-teal font-bold text-sm mb-3">
                                    {t('suggestion_condition_intro')}
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-gov-cherry rounded-full mt-2 flex-shrink-0"></span>
                                        <p className="text-gov-charcoal dark:text-white text-sm">
                                            {t('suggestion_condition_1')}
                                        </p>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-gov-cherry rounded-full mt-2 flex-shrink-0"></span>
                                        <p className="text-gov-charcoal dark:text-white text-sm">
                                            {t('suggestion_condition_2')}
                                        </p>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-gov-cherry rounded-full mt-2 flex-shrink-0"></span>
                                        <p className="text-gov-charcoal dark:text-white text-sm">
                                            {t('suggestion_condition_3')}
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
                                    {t('suggestion_agree_terms')}
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
                            <span>{t('suggestion_start_new')}</span>
                            <ChevronLeft size={20} className="rtl:rotate-180" />
                        </button>
                    </div>
                )}

                {/* SUBMIT TAB - SUGGESTION FORM */}
                {activeTab === 'submit' && !submittedTicket && !showTermsScreen && (
                    <div className="p-8 md:p-12 animate-fade-in">
                        {/* Back to terms link */}
                        <button
                            type="button"
                            onClick={() => setShowTermsScreen(true)}
                            className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/70 hover:text-gov-forest dark:hover:text-gov-gold mb-6 transition-colors"
                        >
                            <ChevronRight size={16} className="rtl:rotate-180" />
                            <span>{t('suggestion_back_terms')}</span>
                        </button>

                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">{t('suggestion_form_title')}</h2>
                            <p className="text-gray-600 dark:text-white/70">{t('suggestion_form_subtitle')}</p>
                        </div>

                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

                            {/* Anonymous / Known Identity Toggle */}
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

                            {/* Directorate */}
                            <div>
                                <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                    {t('suggestion_directorate')} <span className="text-xs text-gray-400">({t('suggestion_optional')})</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.directorate_id}
                                        onChange={(e) => setFormData({ ...formData, directorate_id: e.target.value })}
                                        className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-forest/20 transition-all outline-none appearance-none"
                                    >
                                        <option value="" className="bg-white text-gov-charcoal dark:bg-dm-surface dark:text-white">
                                            {t('suggestion_directorate_placeholder')}
                                        </option>
                                        {directoratesList.map(d => (
                                            <option key={d.id} value={d.id} className="bg-white text-gov-charcoal dark:bg-dm-surface dark:text-white">
                                                {isAr ? getLocalizedName(d.name, 'ar') : getLocalizedName(d.name, 'en')}
                                            </option>
                                        ))}
                                    </select>
                                    <Building2 className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                    {t('suggestion_attachments')} <span className="text-xs text-gray-400">({t('suggestion_optional')})</span>
                                </label>
                                <div className="bg-gov-beige/50 dark:bg-gov-card/10 border-2 border-dashed border-gov-gold/40 rounded-xl p-6 text-center">
                                    <input
                                        type="file"
                                        multiple
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    <div className="flex flex-col items-center gap-3 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <div className="w-12 h-12 rounded-full bg-white dark:bg-gov-emerald/20 flex items-center justify-center text-gov-forest dark:text-gov-teal shadow-sm">
                                            <Upload size={24} />
                                        </div>
                                        <div>
                                            <span className="block font-bold text-gov-charcoal dark:text-white text-sm">{t('suggestion_attachments_hint')}</span>
                                            <span className="text-xs text-gray-500 dark:text-white/70">{t('suggestion_attachments_types')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* File List */}
                                {formData.files.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {formData.files.map((file, idx) => (
                                            <div
                                                key={`${file.name}-${idx}`}
                                                className="flex items-center justify-between bg-white dark:bg-gov-card/10 p-3 rounded-lg border border-gov-gold/20"
                                            >
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <File size={18} className="text-gov-forest dark:text-gov-teal flex-shrink-0" />
                                                    <span className="text-sm font-bold text-gov-charcoal dark:text-white truncate">{file.name}</span>
                                                    <span className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                </div>
                                                {!isSubmitting && (
                                                    <button type="button" onClick={() => removeFile(idx)} className="text-gov-cherry hover:bg-gov-cherry/10 p-1 rounded">
                                                        <X size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Upload Progress */}
                                {isSubmitting && uploadProgress > 0 && (
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-white/70 mb-1">
                                            <span>{t('suggestion_sending')}</span>
                                            <span>{uploadProgress}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gov-gold transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Personal Information - Hidden for anonymous submissions */}
                            {!isAnonymous && (
                                <div className="bg-gray-50 dark:bg-gov-card/10 p-6 rounded-xl border border-gray-100 dark:border-gov-border/15">
                                    <h3 className="font-display font-bold text-gov-forest dark:text-gov-teal mb-4 text-base border-b border-gov-gold/20 dark:border-gov-border/15 pb-2">
                                        {t('suggestion_personal_info')}
                                    </h3>

                                    {/* 3-column: First Name, Father Name, Last Name */}
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

                                    {/* 2-column: National ID, Date of Birth */}
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
                                                    placeholder="09xxxxxxxx"
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
                                                    placeholder="example@email.com"
                                                />
                                                <Mail className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                    {t('suggestion_description')} <span className="text-gov-gold">*</span>
                                </label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={6}
                                    className="w-full p-4 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-forest/20 transition-all outline-none resize-none"
                                    placeholder={t('suggestion_description_placeholder')}
                                />
                            </div>


                            {/* OTP Identity Verification - For unauthenticated non-anonymous users */}
                            {!isAuthenticated && !isAnonymous && (
                                <div className="bg-gov-ocean/5 dark:bg-gov-ocean/10 p-6 rounded-xl border border-gov-ocean/20">
                                    <h3 className="font-display font-bold text-gov-forest dark:text-gov-teal mb-4 text-base border-b border-gov-gold/20 dark:border-gov-border/15 pb-2 flex items-center gap-2">
                                        <Fingerprint size={20} />
                                        {t('complaint_otp_title')}
                                    </h3>

                                    {otpStep === 'verified' ? (
                                        <div className="flex items-center gap-3 text-gov-emerald">
                                            <CheckCircle2 size={24} />
                                            <span className="font-bold">{t('complaint_otp_identity_verified')}</span>
                                        </div>
                                    ) : otpStep === 'sent' || otpStep === 'verifying' ? (
                                        <div className="space-y-4">
                                            <p className="text-sm text-gray-600 dark:text-white/70">
                                                {t('complaint_otp_enter_code')}
                                            </p>
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    maxLength={6}
                                                    value={otpCode}
                                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                                    placeholder="000000"
                                                    className="flex-1 py-3 px-4 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold outline-none font-mono text-center text-lg tracking-widest"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleVerifyOtp}
                                                    disabled={otpStep === 'verifying' || otpCode.length < 4}
                                                    className="px-6 py-3 rounded-xl bg-gov-forest dark:bg-gov-button text-white font-bold disabled:opacity-50 transition-colors"
                                                >
                                                    {otpStep === 'verifying' ? <Loader2 size={20} className="animate-spin" /> : t('complaint_otp_verify')}
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                className="text-sm text-gov-teal dark:text-gov-teal hover:underline"
                                            >
                                                {t('complaint_otp_resend')}
                                            </button>
                                            {otpError && <p className="text-sm text-gov-cherry">{otpError}</p>}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <p className="text-sm text-gray-600 dark:text-white/70">
                                                {t('complaint_otp_desc')}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                disabled={otpStep === 'sending' || !formData.phone || !formData.nationalId}
                                                className="w-full py-3 rounded-xl bg-gov-ocean dark:bg-gov-ocean/80 text-white font-bold disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                            >
                                                {otpStep === 'sending' ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                                {otpStep === 'sending' ? t('complaint_sending') : t('complaint_otp_send')}
                                            </button>
                                            {otpError && <p className="text-sm text-gov-cherry">{otpError}</p>}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || (!isAuthenticated && !isAnonymous && otpStep !== 'verified')}
                                    className="w-full py-4 rounded-xl bg-gov-forest dark:bg-gov-button text-white font-bold shadow-lg hover:bg-gov-teal dark:hover:bg-gov-gold transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                    {isSubmitting ? t('suggestion_sending') : t('suggestion_submit')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* SUCCESS STATE */}
                {submittedTicket && (
                    <div className="p-12 text-center animate-fade-in flex flex-col items-center">
                        <div className="w-20 h-20 bg-gov-emerald/10 dark:bg-gov-emerald/20 rounded-full flex items-center justify-center mb-6 text-gov-emerald">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">{t('suggestion_success')}</h2>
                        <p className="text-gray-500 dark:text-white/70 mb-8 max-w-md">{t('suggestion_success_desc')}</p>

                        <div className="bg-gov-beige dark:bg-white/10 border-2 border-dashed border-gov-gold/30 p-6 rounded-xl mb-8 w-full max-w-sm">
                            <span className="block text-xs text-gray-500 dark:text-white/70 mb-1">{t('suggestion_tracking_number')}</span>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-3xl font-display font-bold text-gov-forest dark:text-gov-teal tracking-wider">{submittedTicket}</span>
                                <button
                                    onClick={copyTrackingNumber}
                                    className="p-2 rounded-lg bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/15 hover:bg-gray-50 dark:hover:bg-white/20 transition-colors"
                                >
                                    {copied ? <Check size={18} className="text-gov-emerald" /> : <Copy size={18} className="text-gray-500" />}
                                </button>
                            </div>
                        </div>

                        <button onClick={() => { setSubmittedTicket(null); setActiveTab('track'); setTrackId(submittedTicket || ''); }} className="text-gov-forest dark:text-gov-teal font-bold hover:underline">
                            {t('suggestion_track_now')}
                        </button>
                    </div>
                )}

                {/* TRACKING TAB */}
                {activeTab === 'track' && !submittedTicket && (
                    <div className="p-8 md:p-12 animate-fade-in">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">{t('suggestion_track_title')}</h2>
                            <p className="text-gray-500 dark:text-white/70">{t('suggestion_track_subtitle')}</p>
                        </div>

                        <form onSubmit={handleTrack} className="max-w-lg mx-auto mb-10 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-white/70 mb-1">{t('suggestion_tracking_number')}</label>
                                <input
                                    type="text"
                                    placeholder={t('suggestion_track_placeholder')}
                                    value={trackId}
                                    onChange={(e) => setTrackId(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold outline-none"
                                    required
                                />
                            </div>
                            <div>
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
                            <button type="submit" className="w-full bg-gov-forest dark:bg-gov-button text-white py-3 rounded-xl font-bold hover:bg-gov-teal dark:hover:bg-gov-gold transition-colors flex items-center justify-center gap-2">
                                {isTracking ? <Loader2 className="animate-spin" /> : <Search />}
                                <span>{t('ui_search')}</span>
                            </button>
                            {trackError && <p className="text-gov-cherry text-sm mt-2 text-center">{trackError}</p>}
                        </form>

                        {trackingResult && (
                            <div className="bg-white dark:bg-gov-card/10 border border-gray-100 dark:border-gov-border/25 rounded-2xl p-6 shadow-lg animate-slide-up max-w-lg mx-auto">
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gov-border/15">
                                    <span className="font-bold text-gov-charcoal dark:text-white">{t('suggestion_tracking_number')}: {trackingResult.tracking_number || trackingResult.id}</span>
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
                                                {trackingResult.updated_at ? new Date(trackingResult.updated_at).toLocaleDateString(isAr ? 'ar-SY' : 'en-US') : (isAr ? 'غير متوفر' : 'N/A')}
                                            </span>
                                        </div>
                                    </div>
                                    {trackingResult.description && (
                                        <div className="flex items-start gap-3 bg-gray-50 dark:bg-white/10 p-3 rounded-lg">
                                            <div className="mt-1 text-gray-400"><FileText size={18} /></div>
                                            <div>
                                                <span className="block text-xs text-gray-500 dark:text-white/70 mb-1">{t('suggestion_description')}</span>
                                                <span className="text-sm text-gray-700 dark:text-white/70 line-clamp-2">{trackingResult.description}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {trackingResult.response && (
                                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gov-border/15 animate-fade-in">
                                        <h3 className="text-sm font-bold text-gov-forest dark:text-gov-teal mb-4">{t('complaint_responses')}</h3>
                                        <div className="bg-gov-ocean/5 dark:bg-gov-ocean/10 p-4 rounded-xl border border-gov-ocean/10 dark:border-gov-ocean/20">
                                            <p className="text-gray-700 dark:text-white/70 text-sm whitespace-pre-wrap">{trackingResult.response}</p>
                                        </div>
                                    </div>
                                )}

                                {trackingResult.responses && trackingResult.responses.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gov-border/15 animate-fade-in">
                                        <h3 className="text-sm font-bold text-gov-forest dark:text-gov-teal mb-4">{t('complaint_responses')}</h3>
                                        <div className="space-y-4">
                                            {trackingResult.responses.map((response: any) => (
                                                <div key={response.id} className="bg-gov-ocean/5 dark:bg-gov-ocean/10 p-4 rounded-xl border border-gov-ocean/10 dark:border-gov-ocean/20">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="font-bold text-gov-forest dark:text-gov-oceanLight text-sm">{response.user?.full_name || (isAr ? 'فريق المراجعة' : 'Review Team')}</span>
                                                        <span className="text-xs text-gray-500 dark:text-white/70">{new Date(response.created_at).toLocaleString(isAr ? 'ar-SY' : 'en-US')}</span>
                                                    </div>
                                                    <p className="text-gray-700 dark:text-white/70 text-sm whitespace-pre-wrap">{response.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
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
                )}

            </div>
        </div>
    );
};

export default SuggestionPortal;
