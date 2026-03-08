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
    Star,
} from 'lucide-react';
import { API } from '@/lib/repository';
import { Directorate } from '@/types';
import { getLocalizedName, copyToClipboard, formatDate as formatDateUtil } from '@/lib/utils';
import { focusPulse } from '@/lib/animations';
import { validatePhoneWithCountryCode } from '@/lib/phone';
import { toast } from 'sonner';
import { useRecaptcha } from '@/hooks/useRecaptcha';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import SuggestionRating from '@/components/SuggestionRating';

import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import PhoneInput from '@/components/ui/PhoneInput';
import NationalIdField from './NationalIdField';
import UploadProgress, { MultiUploadProgress } from './UploadProgress';

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
    const [dynamicRules, setDynamicRules] = useState<string>('');

    // Multi-step Form State
    const [formStep, setFormStep] = useState(0); // 0: Terms, 1: Identity, 2: Suggestion, 3: Success
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);

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
    const [stagedIds, setStagedIds] = useState<Record<string, string>>({});
    const [isUploading, setIsUploading] = useState(false);

    // Tracking State
    const [trackId, setTrackId] = useState(initialTrackingNumber);
    const [trackNationalId, setTrackNationalId] = useState('');
    const [trackingResult, setTrackingResult] = useState<any | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [trackError, setTrackError] = useState<string | null>(null);
    // T032: Support anonymous tracking mode
    const [trackMode, setTrackMode] = useState<'identified' | 'anonymous'>('identified');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // Copy state
    const [copied, setCopied] = useState(false);

    // Rating state - track if user already rated
    const [hasRated, setHasRated] = useState(false);

    // File upload visual progress
    const [fileUploadStatus, setFileUploadStatus] = useState<'ready' | 'uploading' | 'completed'>('ready');
    const [fileUploadProgress, setFileUploadProgress] = useState(0);

    // Validation State
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // File upload constants
    const MAX_ATTACHMENT_COUNT = 5;
    const MAX_ATTACHMENT_SIZE_MB = 5;
    const MAX_ATTACHMENT_SIZE_BYTES = MAX_ATTACHMENT_SIZE_MB * 1024 * 1024;
    const ALLOWED_ATTACHMENT_EXTENSIONS = new Set(['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']);

    const validateField = (name: string, value: string) => {
        let error = '';
        if (name === 'nationalId' && value && !/^\d{11}$/.test(value)) {
            error = isAr ? 'الرقم الوطني يجب أن يتكون من 11 رقماً' : 'National ID must be 11 digits';
        } else if (name === 'phone' && value) {
            const phoneResult = validatePhoneWithCountryCode(value);
            if (!phoneResult.isValid) {
                error = isAr ? 'رقم الهاتف غير صالح' : 'Invalid phone number';
            }
        } else if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = isAr ? 'البريد الإلكتروني غير صالح' : 'Invalid email address';
        } else if (name === 'firstName' && !isAnonymous && !value.trim()) {
            error = isAr ? 'الاسم الأول مطلوب' : 'First name is required';
        } else if (name === 'lastName' && !isAnonymous && !value.trim()) {
            error = isAr ? 'اسم العائلة مطلوب' : 'Last name is required';
        } else if (name === 'fatherName' && !isAnonymous && !value.trim()) {
            error = isAr ? 'اسم الأب مطلوب' : 'Father name is required';
        } else if (name === 'description' && !value.trim()) {
            error = isAr ? 'الوصف مطلوب' : 'Description is required';
        }
        setErrors(prev => ({ ...prev, [name]: error }));
        return error;
    };

    const handleBlur = (name: string, value: string) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, value);
    };

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
        API.settings.getByGroup('contact')
            .then(data => {
                const settings = data as Record<string, string>;
                if (settings.contact_whatsapp) setWhatsappNumber(settings.contact_whatsapp);
            })
            .catch(() => { });

        API.settings.getByGroup('rules')
            .then(data => {
                const settings = data as Record<string, string>;
                const key = language === 'ar' ? 'suggestion_rules_ar' : 'suggestion_rules_en';
                if (settings[key]) setDynamicRules(settings[key]);
            })
            .catch(() => { });

        API.directorates.getAll()
            .then(data => setDirectoratesList(data))
            .catch(err => console.error('Failed to load directorates:', err));
    }, [language]);

    useEffect(() => {
        if (!formRef.current) return;
        const inputs = formRef.current.querySelectorAll('input, textarea, select');
        inputs.forEach(el => focusPulse(el as any));
    }, [activeTab]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const incomingFiles = Array.from(e.target.files);
        const remainingSlots = Math.max(0, MAX_ATTACHMENT_COUNT - formData.files.length);

        if (remainingSlots === 0) {
            toast.error(isAr ? `الحد الأقصى للمرفقات هو ${MAX_ATTACHMENT_COUNT} ملفات` : `Maximum ${MAX_ATTACHMENT_COUNT} attachments allowed`);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        const acceptedFiles: File[] = [];
        const existingNames = new Set(formData.files.map(f => f.name.toLowerCase()));

        incomingFiles.forEach((file) => {
            // Check duplicate
            if (existingNames.has(file.name.toLowerCase())) {
                toast.error(isAr ? `الملف "${file.name}" مرفق مسبقاً` : `File "${file.name}" is already attached`);
                return;
            }

            // Check file type
            const fileExtension = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() || '' : '';
            if (!ALLOWED_ATTACHMENT_EXTENSIONS.has(fileExtension)) {
                toast.error(isAr
                    ? `صيغة الملف "${file.name}" غير مدعومة. الصيغ المسموحة: PDF, DOC, DOCX, JPG, PNG`
                    : `File "${file.name}" has unsupported type. Allowed: PDF, DOC, DOCX, JPG, PNG`);
                return;
            }

            // Check file size
            if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
                toast.error(isAr
                    ? `الملف "${file.name}" يتجاوز الحد المسموح ${MAX_ATTACHMENT_SIZE_MB} MB`
                    : `File "${file.name}" exceeds ${MAX_ATTACHMENT_SIZE_MB} MB limit`);
                return;
            }

            acceptedFiles.push(file);
            existingNames.add(file.name.toLowerCase());
        });

        const filesToAdd = acceptedFiles.slice(0, remainingSlots);
        if (acceptedFiles.length > remainingSlots) {
            toast.error(isAr
                ? `تم تجاوز الحد الأقصى. يمكنك إرفاق ${MAX_ATTACHMENT_COUNT} ملفات فقط`
                : `Attachment limit reached. You can upload up to ${MAX_ATTACHMENT_COUNT} files`);
        }

        if (filesToAdd.length > 0) {
            setFormData(prev => ({ ...prev, files: [...prev.files, ...filesToAdd] }));
            // Stage upload immediately on file selection
            setFileUploadStatus('uploading');
            setFileUploadProgress(0);
            const totalFiles = filesToAdd.length;
            let completed = 0;

            const failedFiles: string[] = [];
            for (const file of filesToAdd) {
                try {
                    const fd = new FormData();
                    fd.append('file', file);
                    const res = await fetch('/api/v1/complaints/attachments/stage', {
                        method: 'POST',
                        body: fd,
                        credentials: 'include',
                    });
                    if (res.ok) {
                        const result = await res.json();
                        setStagedIds(prev => ({ ...prev, [`${file.name}:${file.size}:${file.lastModified}`]: result.staged_id }));
                    }
                } catch (err) {
                    console.error('Staged upload failed for', file.name, err);
                    failedFiles.push(file.name);
                }
                completed++;
                setFileUploadProgress(Math.round((completed / totalFiles) * 100));
            }
            setFileUploadStatus(failedFiles.length > 0 ? 'ready' : 'completed');
        }

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeFile = (index: number) => {
        setFormData(prev => {
            const newFiles = prev.files.filter((_, i) => i !== index);
            if (newFiles.length === 0) {
                setFileUploadStatus('ready');
                setFileUploadProgress(0);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
            return { ...prev, files: newFiles };
        });
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

    // Validation before advancing steps
    const validateStep = (step: number): boolean => {
        if (step === 0) {
            if (!hasAgreedToTerms) {
                toast.error(isAr ? 'يرجى الموافقة على الضوابط أولاً' : 'Please agree to the guidelines first');
                return false;
            }
            return true;
        }
        if (step === 1) {
            if (!isAnonymous) {
                if (!formData.firstName.trim() || formData.firstName.trim().length < 2) {
                    toast.error(isAr ? 'الاسم الأول مطلوب (حرفان على الأقل)' : 'First name is required (at least 2 characters)');
                    return false;
                }
                if (!formData.lastName.trim() || formData.lastName.trim().length < 2) {
                    toast.error(isAr ? 'الكنية مطلوبة (حرفان على الأقل)' : 'Last name is required (at least 2 characters)');
                    return false;
                }
                if (!formData.fatherName.trim() || formData.fatherName.trim().length < 2) {
                    toast.error(isAr ? 'اسم الأب مطلوب (حرفان على الأقل)' : 'Father name is required (at least 2 characters)');
                    return false;
                }
                if (!formData.nationalId.trim() || !/^\d{11}$/.test(formData.nationalId.trim())) {
                    toast.error(isAr ? 'الرقم الوطني يجب أن يتكون من 11 رقماً' : 'National ID must be exactly 11 digits');
                    return false;
                }
                if (!formData.phone.trim()) {
                    toast.error(isAr ? 'رقم الهاتف مطلوب' : 'Phone number is required');
                    return false;
                }
                const phoneCheck = validatePhoneWithCountryCode(formData.phone);
                if (!phoneCheck.isValid) {
                    toast.error(isAr ? 'رقم الهاتف غير صالح' : 'Invalid phone number');
                    return false;
                }
                if (!formData.email.trim()) {
                    toast.error(isAr ? 'البريد الإلكتروني مطلوب' : 'Email is required');
                    return false;
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
                    toast.error(isAr ? 'البريد الإلكتروني غير صالح' : 'Invalid email address');
                    return false;
                }
            }
            return true;
        }
        if (step === 2) {
            if (!formData.directorate_id) {
                toast.error(isAr ? 'يرجى تحديد الجهة المختصة' : 'Please select a target entity');
                return false;
            }
            if (!formData.description.trim()) {
                toast.error(t('suggestion_required_fields'));
                return false;
            }
            if (formData.description.trim().length < 10) {
                toast.error(isAr ? 'الوصف يجب أن يكون 10 أحرف على الأقل' : 'Description must be at least 10 characters');
                return false;
            }
            return true;
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep(formStep)) {
            setFormStep(prev => prev + 1);
        }
    };
    const prevStep = () => setFormStep(prev => prev - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formStep < 2) {
            nextStep();
            return;
        }
        if (!isAnonymous && !formData.firstName) {
            toast.error(t('suggestion_required_fields'));
            return;
        }
        if (!formData.directorate_id) {
            toast.error(isAr ? 'يرجى تحديد الجهة المختصة' : 'Please select a target entity');
            return;
        }
        if (!formData.description) {
            toast.error(t('suggestion_required_fields'));
            return;
        }

        setIsSubmitting(true);
        setUploadProgress(0);

        // T030: Track file upload progress
        const hasFiles = formData.files.length > 0;
        if (hasFiles) {
            setIsUploading(true);
        }

        try {
            const recaptchaToken = await executeRecaptcha('submit_suggestion');

            const submitData = isAnonymous
                ? { description: formData.description, directorate_id: formData.directorate_id, files: formData.files, is_anonymous: true as const, recaptcha_token: recaptchaToken, staged_attachment_ids: Object.values(stagedIds).filter(Boolean) }
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
                    staged_attachment_ids: Object.values(stagedIds).filter(Boolean),
                };

            const result = await API.suggestions.submitWithProgress(
                submitData,
                (progress) => setUploadProgress(progress)
            );

            setUploadProgress(100);
            const newTrackingNumber = result.tracking_number || (result as any).trackingNumber || null;
            setSubmittedTicket(newTrackingNumber);
            setFormStep(3); // Go to success step

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
            setTimeout(() => { setIsUploading(false); setUploadProgress(0); }, 500);
        }
    };

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsTracking(true);
        setTrackError(null);
        setTrackingResult(null);

        try {
            const response = await API.suggestions.track(trackId);
            // API returns { success: true, data: {...} } - extract the actual data
            const result = response?.data || response;
            if (result && (result.tracking_number || result.status)) {
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

    // T029: Enforced valid suggestion status display with correct Arabic labels
    const suggestionStatusMap: Record<string, { ar: string; en: string; color: string }> = {
        'received': { ar: 'واردة', en: 'Received', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
        'new': { ar: 'واردة', en: 'Received', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
        'in_progress': { ar: 'قيد المعالجة', en: 'In Progress', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
        'pending': { ar: 'قيد المعالجة', en: 'In Progress', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
        'processing': { ar: 'قيد المعالجة', en: 'In Progress', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
        'completed': { ar: 'منتهية', en: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
        'reviewed': { ar: 'منتهية', en: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
        'approved': { ar: 'منتهية', en: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
        'implemented': { ar: 'منتهية', en: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
        'rejected': { ar: 'منتهية', en: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
        'responded': { ar: 'تم الرد عليها', en: 'Responded', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    };

    const getStatusColor = (status: string) => {
        return (suggestionStatusMap[status] || suggestionStatusMap['received']).color;
    };

    const getStatusLabel = (status: string) => {
        const entry = suggestionStatusMap[status] || suggestionStatusMap['received'];
        return isAr ? entry.ar : entry.en;
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">

            {/* Tabs */}
            <div className="flex bg-white dark:bg-dm-surface p-1 rounded-2xl shadow-sm border border-gray-200 dark:border-gov-border/25 mb-8 max-w-md mx-auto">
                <button
                    onClick={() => { setActiveTab('submit'); setSubmittedTicket(null); setFormStep(0); setHasAgreedToTerms(false); }}
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
                {/* Progress Indicator */}
                {activeTab === 'submit' && formStep < 3 && (
                    <div className="px-8 pt-8 md:px-12">
                        <div className="flex items-center justify-between mb-4">
                            {[0, 1, 2].map((step) => (
                                <div key={step} className="flex flex-col items-center gap-2 flex-1 relative">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all z-10 ${formStep >= step
                                        ? 'bg-gov-forest dark:bg-gov-button text-white shadow-md'
                                        : 'bg-gray-100 dark:bg-white/10 text-gray-400'
                                        }`}>
                                        {formStep > step ? <Check size={16} /> : step + 1}
                                    </div>
                                    <span className={`text-[10px] font-bold transition-all ${formStep >= step ? 'text-gov-forest dark:text-gov-teal' : 'text-gray-400'}`}>
                                        {step === 0 ? t('suggestion_step_terms') || 'الشروط' : step === 1 ? t('suggestion_step_identity') || 'الهوية' : t('suggestion_step_details') || 'التفاصيل'}
                                    </span>
                                    {step < 2 && (
                                        <div className={`absolute left-[60%] rtl:left-auto rtl:right-[60%] top-4 h-[2px] -z-0 ${formStep > step ? 'bg-gov-forest dark:bg-gov-teal' : 'bg-gray-100 dark:bg-white/10'}`} style={{ width: 'calc(100% - 20%)' }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {/* SUBMIT TAB - STEP 0: TERMS AGREEMENT */}
                {activeTab === 'submit' && formStep === 0 && (
                    <div className="p-8 md:p-12 animate-fade-in">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-gov-forest/10 dark:bg-gov-emerald/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lightbulb size={32} className="text-gov-forest dark:text-gov-teal" />
                            </div>
                            <h2 className="text-xl md:text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">
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

                            {dynamicRules ? (
                                <div className="bg-gov-beige/50 dark:bg-gov-card/10 rounded-lg p-4 mb-4">
                                    <p className="text-gov-charcoal dark:text-white text-sm leading-relaxed whitespace-pre-line">
                                        {dynamicRules}
                                    </p>
                                </div>
                            ) : (
                                <>
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
                                </>
                            )}
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
                            onClick={() => nextStep()}
                            disabled={!hasAgreedToTerms}
                            className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-3 ${
                                hasAgreedToTerms
                                    ? 'bg-gov-forest dark:bg-gov-button text-white hover:bg-gov-teal dark:hover:bg-gov-gold'
                                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            <span>{t('suggestion_start_new')}</span>
                            {isAr ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                        </button>

                    </div>
                )}

                {/* SUBMIT TAB - STEP 1 & 2: FORM */}
                {activeTab === 'submit' && (formStep === 1 || formStep === 2) && (
                    <div className="p-8 md:p-12 animate-fade-in">
                        {/* Back button */}
                        <button
                            type="button"
                            onClick={() => prevStep()}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/70 hover:text-gov-forest dark:hover:text-gov-gold mb-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAr ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                            <span>{formStep === 2
                                ? (isAr ? 'العودة إلى الهوية' : 'Back to Identity')
                                : t('suggestion_back_terms')
                            }</span>
                        </button>

                        <div className="text-center mb-10">
                            <h2 className="text-xl md:text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">
                                {formStep === 1 ? (isAr ? 'تحديد الهوية' : 'Identity Selection') : t('suggestion_form_title')}
                            </h2>
                            <p className="text-gray-600 dark:text-white/70">
                                {formStep === 1 ? (isAr ? 'اختر كيف ترغب في تقديم مقترحك' : 'Choose how you want to submit your suggestion') : t('suggestion_form_subtitle')}
                            </p>
                        </div>

                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                            <fieldset disabled={isSubmitting} className="space-y-6">
                            {formStep === 1 && (
                                <div className="space-y-6 animate-fade-in">
                                    {/* Anonymous / Known Identity Toggle */}
                                    <div className="bg-gov-beige/50 dark:bg-gov-card/10 p-6 rounded-2xl border border-gov-gold/20 text-center">
                                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setIsAnonymous(false)}
                                                className={`flex-1 w-full md:w-auto flex flex-col items-center gap-3 p-6 rounded-2xl font-bold transition-all border-2 ${!isAnonymous
                                                    ? 'bg-gov-forest/5 border-gov-forest dark:bg-gov-button/20 dark:border-gov-teal text-gov-forest dark:text-gov-teal'
                                                    : 'bg-white dark:bg-white/5 border-gray-100 dark:border-gov-border/15 text-gray-400 opacity-60'
                                                    }`}
                                            >
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${!isAnonymous ? 'bg-gov-forest text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                    <User size={24} />
                                                </div>
                                                <div>
                                                    <span className="block text-base">{isAuthenticated ? t('complaint_my_data') : t('complaint_known_identity')}</span>
                                                    <span className="text-xs font-normal opacity-70">{isAr ? 'تقديم المقترح باسمي الشخصي' : 'Submit suggestion with my personal identity'}</span>
                                                </div>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsAnonymous(true)}
                                                className={`flex-1 w-full md:w-auto flex flex-col items-center gap-3 p-6 rounded-2xl font-bold transition-all border-2 ${isAnonymous
                                                    ? 'bg-gov-forest/5 border-gov-forest dark:bg-gov-button/20 dark:border-gov-teal text-gov-forest dark:text-gov-teal'
                                                    : 'bg-white dark:bg-white/5 border-gray-100 dark:border-gov-border/15 text-gray-400 opacity-60'
                                                    }`}
                                            >
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isAnonymous ? 'bg-gov-forest text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                    <UserX size={24} />
                                                </div>
                                                <div>
                                                    <span className="block text-base">{t('complaint_anonymous_identity')}</span>
                                                    <span className="text-xs font-normal opacity-70">{isAr ? 'تقديم المقترح دون الكشف عن هويتي' : 'Submit suggestion without revealing my identity'}</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Personal Data Fields (if not anonymous) */}
                                    {!isAnonymous && (
                                        <div className="animate-slide-up space-y-6">
                                            <div className="bg-gray-50 dark:bg-gov-card/10 p-6 rounded-xl border border-gray-100 dark:border-gov-border/15">
                                                <h3 className="font-display font-bold text-gov-forest dark:text-gov-teal mb-4 text-base border-b border-gov-gold/20 dark:border-gov-border/15 pb-2">
                                                    {t('suggestion_personal_info')}
                                                </h3>

                                                {/* 3-column: First Name, Father Name, Last Name */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <Input
                                                        label={t('suggestion_first_name')}
                                                        required={!isAnonymous}
                                                        value={formData.firstName}
                                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                        onBlur={() => handleBlur('firstName', formData.firstName)}
                                                        error={touched.firstName ? errors.firstName : undefined}
                                                        isValid={touched.firstName && !errors.firstName && !!formData.firstName.trim()}
                                                        icon={User}
                                                    />
                                                    <Input
                                                        label={t('suggestion_last_name')}
                                                        required={!isAnonymous}
                                                        value={formData.lastName}
                                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                        onBlur={() => handleBlur('lastName', formData.lastName)}
                                                        error={touched.lastName ? errors.lastName : undefined}
                                                        isValid={touched.lastName && !errors.lastName && !!formData.lastName.trim()}
                                                        icon={User}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 mb-4 items-start">
                                                    <Input
                                                        label={t('suggestion_father_name')}
                                                        required={!isAnonymous}
                                                        value={formData.fatherName}
                                                        onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                                                        onBlur={() => handleBlur('fatherName', formData.fatherName)}
                                                        error={touched.fatherName ? errors.fatherName : undefined}
                                                        isValid={touched.fatherName && !errors.fatherName && !!formData.fatherName.trim()}
                                                        icon={User}
                                                    />
                                                    <NationalIdField
                                                        value={formData.nationalId}
                                                        onChange={(val) => setFormData(prev => ({ ...prev, nationalId: val }))}
                                                        onBlur={() => handleBlur('nationalId', formData.nationalId)}
                                                        onVerified={(citizenData) => {
                                                            if (citizenData) {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    firstName: citizenData.first_name || prev.firstName,
                                                                    fatherName: citizenData.father_name || prev.fatherName,
                                                                    lastName: citizenData.last_name || prev.lastName,
                                                                }));
                                                            }
                                                        }}
                                                        error={touched.nationalId ? errors.nationalId : undefined}
                                                        required={!isAnonymous}
                                                        autoVerify={true}
                                                        label={t('complaint_national_id')}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 mb-6 items-start">
                                                    <div className="relative">
                                                        <PhoneInput
                                                            label={t('complaint_phone')}
                                                            required={!isAnonymous}
                                                            value={formData.phone}
                                                            onChange={(val) => {
                                                                setFormData({ ...formData, phone: val });
                                                                if (touched.phone) validateField('phone', val);
                                                            }}
                                                            onBlur={() => handleBlur('phone', formData.phone)}
                                                            error={touched.phone ? errors.phone : undefined}
                                                            isValid={touched.phone && !errors.phone && !!formData.phone}
                                                        />
                                                    </div>
                                                    <Input
                                                        type="email"
                                                        label={t('complaint_email')}
                                                        required={!isAnonymous}
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        onBlur={() => handleBlur('email', formData.email)}
                                                        error={touched.email ? errors.email : undefined}
                                                        isValid={touched.email && !errors.email && !!formData.email.trim()}
                                                        icon={Mail}
                                                        dir="ltr"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => nextStep()}
                                        className="w-full py-4 rounded-xl bg-gov-forest dark:bg-gov-button text-white font-bold shadow-lg hover:bg-gov-teal dark:hover:bg-gov-gold transition-all flex items-center justify-center gap-2"
                                    >
                                        <span>{t('ui_next') || 'التالي'}</span>
                                        {isAr ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                                    </button>
                                </div>
                            )}

                            {formStep === 2 && (
                                <div className="space-y-6 animate-fade-in">
                                    {/* Directorate Selection */}
                                    <div className="mb-2">
                                        <Select
                                            value={formData.directorate_id}
                                            onChange={(e) => setFormData({ ...formData, directorate_id: e.target.value })}
                                            label={t('complaint_entity')}
                                            options={[
                                                { value: '', label: t('complaint_select_entity') },
                                                ...directoratesList.map(d => ({ value: d.id, label: getLocalizedName(d.name, language) }))
                                            ]}
                                            icon={Building2}
                                        />
                                    </div>

                                    {/* Description and Files here */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {t('suggestion_description')} <span className="text-gov-gold">*</span>
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            onBlur={() => handleBlur('description', formData.description)}
                                            rows={6}
                                            className={`w-full p-4 rounded-xl bg-white dark:bg-white/10 border text-gov-charcoal dark:text-white focus:ring-2 transition-all outline-none resize-none ${
                                                touched.description && errors.description
                                                    ? 'border-red-500 dark:border-gov-cherry focus:border-red-500 focus:ring-red-500/20'
                                                    : touched.description && !errors.description && formData.description.trim()
                                                        ? 'border-green-500 dark:border-gov-emerald focus:border-green-500 focus:ring-green-500/20'
                                                        : 'border-gray-200 dark:border-gov-border/25 focus:border-gov-forest dark:focus:border-gov-gold focus:ring-gov-teal/20'
                                            }`}
                                            placeholder={t('suggestion_description_placeholder')}
                                        />
                                        {touched.description && errors.description && (
                                            <p className="text-xs text-red-500 dark:text-gov-cherry flex items-center gap-1 mt-1 animate-fade-in">
                                                <AlertCircle size={12} className="shrink-0" />
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* File Upload */}
                                    <div>
                                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                                            {t('suggestion_attachments')} <span className="text-xs text-gray-400">({t('suggestion_optional')})</span>
                                        </label>
                                        <div className="bg-gov-beige/50 dark:bg-gov-card/10 border-2 border-dashed border-gov-gold/40 rounded-xl p-6 text-center">
                                            <input
                                                type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                className="hidden" ref={fileInputRef} onChange={handleFileChange}
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
                                                    <div key={`${file.name}-${idx}`}>
                                                        <UploadProgress
                                                            fileName={file.name}
                                                            progress={isUploading || isSubmitting ? uploadProgress : fileUploadStatus === 'uploading' ? fileUploadProgress : 100}
                                                            status={isUploading || isSubmitting ? 'uploading' : fileUploadStatus === 'uploading' ? 'uploading' : 'ready'}
                                                            fileSize={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                                                            language={isAr ? 'ar' : 'en'}
                                                            onCancel={!isSubmitting ? () => removeFile(idx) : undefined}
                                                        />
                                                    </div>
                                                ))}

                                                {/* Add more files button */}
                                                {formData.files.length < MAX_ATTACHMENT_COUNT && !isSubmitting && (
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="w-full py-2.5 rounded-xl border-2 border-dashed border-gov-gold/30 text-gov-forest dark:text-gov-teal text-sm font-bold hover:bg-gov-beige/30 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Upload size={16} />
                                                        <span>{isAr ? `إضافة مرفقات أخرى (${formData.files.length}/${MAX_ATTACHMENT_COUNT})` : `Add more files (${formData.files.length}/${MAX_ATTACHMENT_COUNT})`}</span>
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {/* T030: Upload Progress Bar (shown during submission) */}
                                        <MultiUploadProgress
                                            files={formData.files}
                                            progress={uploadProgress}
                                            isUploading={isUploading}
                                            isSubmitting={isSubmitting}
                                            language={isAr ? 'ar' : 'en'}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 rounded-xl bg-gov-forest dark:bg-gov-button text-white font-bold shadow-lg hover:bg-gov-teal dark:hover:bg-gov-gold transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} className="rtl:-scale-x-100" />}
                                        <span>{isSubmitting ? t('suggestion_sending') : t('suggestion_submit')}</span>
                                    </button>
                                </div>
                            )}
                            </fieldset>
                        </form>
                    </div>
                )}

                {/* SUCCESS STATE (Step 3) */}
                {formStep === 3 && (
                    <div className="p-12 text-center animate-fade-in flex flex-col items-center">
                        <div className="w-20 h-20 bg-gov-emerald/10 dark:bg-gov-emerald/20 rounded-full flex items-center justify-center mb-6 text-gov-emerald">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-xl md:text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">{t('suggestion_success')}</h2>
                        <p className="text-gray-500 dark:text-white/70 mb-8 max-w-md">{t('suggestion_success_desc')}</p>

                        <div className="bg-gov-beige dark:bg-white/10 border-2 border-dashed border-gov-gold/30 p-6 rounded-xl mb-8 w-full max-w-sm">
                            <span className="block text-xs text-gray-500 dark:text-white/70 mb-1">{t('suggestion_tracking_number')}</span>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-xl md:text-3xl font-display font-bold text-gov-forest dark:text-gov-teal tracking-wider">{submittedTicket || 'SUG-123456'}</span>
                                <button
                                    onClick={copyTrackingNumber}
                                    className="p-2 rounded-lg bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/15 hover:bg-gray-50 dark:hover:bg-white/20 transition-colors"
                                >
                                    {copied ? <Check size={18} className="text-gov-emerald" /> : <Copy size={18} className="text-gray-500" />}
                                </button>
                            </div>
                        </div>

                        {/* Rating Component */}
                        {submittedTicket && (
                            <div className="w-full max-w-md mb-8">
                                <SuggestionRating
                                    trackingNumber={submittedTicket}
                                    language={language as 'ar' | 'en'}
                                    onClose={() => {}}
                                    hideHelpfulQuestion={true}
                                />
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <button onClick={() => { setSubmittedTicket(null); setFormStep(0); setActiveTab('track'); setTrackId(submittedTicket || ''); }} className="px-6 py-2.5 bg-gov-forest dark:bg-gov-button text-white font-bold rounded-xl hover:bg-gov-forest/90 dark:hover:bg-gov-button/80 transition-colors">
                                {t('suggestion_track_now')}
                            </button>
                            <button onClick={() => { setSubmittedTicket(null); setFormStep(0); setActiveTab('submit'); }} className="text-gov-forest dark:text-gov-teal font-bold hover:underline text-sm">
                                {isAr ? 'تقديم مقترح جديد' : 'Submit New Suggestion'}
                            </button>
                        </div>
                    </div>
                )}


                {/* TRACKING TAB */}
                {
                    activeTab === 'track' && !submittedTicket && (
                        <div className="p-8 md:p-12 animate-fade-in">
                            <div className="text-center mb-10">
                                <h2 className="text-xl md:text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">{t('suggestion_track_title')}</h2>
                                <p className="text-gray-500 dark:text-white/70">{t('suggestion_track_subtitle')}</p>
                            </div>

                            <form onSubmit={handleTrack} className="max-w-lg mx-auto mb-10 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-white/70 mb-1">{t('suggestion_tracking_number')}</label>
                                    <input
                                        type="text"
                                        placeholder={t('suggestion_track_placeholder')}
                                        value={trackId}
                                        onChange={(e) => setTrackId(e.target.value.toUpperCase())}
                                        className="w-full p-3 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold outline-none font-mono"
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
                                        {/* Submission date */}
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 text-gray-400"><Calendar size={18} /></div>
                                            <div>
                                                <span className="block text-xs text-gray-500 dark:text-white/70 mb-1">{isAr ? 'تاريخ التقديم' : 'Submission Date'}</span>
                                                <span className="text-sm font-medium text-gov-charcoal dark:text-white">
                                                    {(trackingResult.created_at) ? formatDateUtil(trackingResult.created_at, isAr ? 'ar' : 'en') : (isAr ? 'غير متوفر' : 'N/A')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Last update */}
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 text-gray-400"><AlertCircle size={18} /></div>
                                            <div>
                                                <span className="block text-xs text-gray-500 dark:text-white/70 mb-1">{t('complaint_last_update')}</span>
                                                <span className="text-sm font-medium text-gov-charcoal dark:text-white">
                                                    {(trackingResult.last_updated || trackingResult.updated_at) ? formatDateUtil(trackingResult.last_updated || trackingResult.updated_at, isAr ? 'ar' : 'en') : (isAr ? 'غير متوفر' : 'N/A')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Directorate */}
                                        {(trackingResult.directorate_name || trackingResult.directorate) && (
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 text-gray-400"><Building2 size={18} /></div>
                                                <div>
                                                    <span className="block text-xs text-gray-500 dark:text-white/70 mb-1">{isAr ? 'الجهة' : 'Directorate'}</span>
                                                    <span className="text-sm font-medium text-gov-charcoal dark:text-white">
                                                        {trackingResult.directorate_name || (typeof trackingResult.directorate === 'object' ? (isAr ? trackingResult.directorate.name_ar : trackingResult.directorate.name_en) : trackingResult.directorate)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Full description */}
                                        {trackingResult.description && (
                                            <div className="flex items-start gap-3 bg-gray-50 dark:bg-white/10 p-4 rounded-lg">
                                                <div className="mt-1 text-gray-400"><FileText size={18} /></div>
                                                <div className="flex-1">
                                                    <span className="block text-xs text-gray-500 dark:text-white/70 mb-1">{t('suggestion_description')}</span>
                                                    <p className="text-sm text-gray-700 dark:text-white/70 whitespace-pre-wrap">{trackingResult.description}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Submitter name if available */}
                                        {trackingResult.full_name && (
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 text-gray-400"><User size={18} /></div>
                                                <div>
                                                    <span className="block text-xs text-gray-500 dark:text-white/70 mb-1">{isAr ? 'مقدم المقترح' : 'Submitted By'}</span>
                                                    <span className="text-sm font-medium text-gov-charcoal dark:text-white">{trackingResult.full_name}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Category if available */}
                                        {trackingResult.category && (
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 text-gray-400"><Lightbulb size={18} /></div>
                                                <div>
                                                    <span className="block text-xs text-gray-500 dark:text-white/70 mb-1">{isAr ? 'التصنيف' : 'Category'}</span>
                                                    <span className="text-sm font-medium text-gov-charcoal dark:text-white">{trackingResult.category}</span>
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

                                    {/* Rating after receiving tracking result - always available for user experience feedback */}
                                    {!trackingResult.rating && !hasRated && (
                                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gov-border/15 animate-fade-in">
                                            <SuggestionRating
                                                trackingNumber={trackingResult.tracking_number || trackingResult.id}
                                                language={language as 'ar' | 'en'}
                                                onClose={() => setHasRated(true)}
                                                hideHelpfulQuestion={!(trackingResult.response || (trackingResult.responses && trackingResult.responses.length > 0))}
                                            />
                                        </div>
                                    )}
                                    {(hasRated || trackingResult.rating) && (
                                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gov-border/15 text-center">
                                            <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                                                <CheckCircle size={16} />
                                                {isAr ? 'شكراً لتقييمك!' : 'Thank you for your rating!'}
                                            </p>
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
                    )
                }

            </div>
        </div>
    );
};

export default SuggestionPortal;
