'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
    User,
    Fingerprint,
    Calendar,
    Phone,
    Mail,
    FileText,
    Upload,
    X,
    AlertCircle,
    CheckCircle2,
    Check,
    ChevronDown,
    CheckCircle,
    ChevronLeft,
    ShieldAlert,
    Scale,
    ChevronRight,
    Copy,
    Loader2,
    ClipboardList,
    UserX,
    Trash2,
    FileCheck,
    History,
    Send,
    Search,
    Star
} from 'lucide-react';
import { API, getComplaintTemplates } from '@/lib/repository';
import { Directorate } from '@/types';
import { getLocalizedName, copyToClipboard } from '@/lib/utils';
import ComplaintPrintButton from './ComplaintPrintButton';
import PrintHeader from './PrintHeader';
import PrintFooter from './PrintFooter';
import { Ticket } from '@/types';
import { focusPulse } from '@/lib/animations';
import { validatePhoneWithCountryCode } from '@/lib/phone';
import ImportedSatisfactionRating from './SatisfactionRating'; // Import Rating Component
import UploadProgress, { MultiUploadProgress } from './UploadProgress';
import { toast } from 'sonner';
import { useRecaptcha } from '@/hooks/useRecaptcha';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import PhoneInput from '@/components/ui/PhoneInput';
import NationalIdField from './NationalIdField';

/** Lightweight submission experience rating that uses the happiness feedback API (works for fresh complaints).
 *  The happiness API accepts rating 1-3 (sad/neutral/happy), so we map 5-star UI to that scale:
 *  stars 1-2 → 1 (sad), star 3 → 2 (neutral), stars 4-5 → 3 (happy). */
const SubmissionExperienceRating: React.FC = () => {
    const { t, language } = useLanguage();
    const isAr = language === 'ar';
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    /** Map 5-star UI value to the happiness API's 1-3 scale */
    const mapToHappinessScale = (stars: number): number => {
        if (stars <= 2) return 1; // sad
        if (stars === 3) return 2; // neutral
        return 3; // happy
    };

    const handleRate = async (star: number) => {
        setRating(star);
        setSubmitting(true);
        try {
            const mapped = mapToHappinessScale(star);
            const ok = await API.happiness.submit(mapped, 'complaint_submission');
            if (!ok) {
                toast.error(isAr ? 'فشل إرسال التقييم' : 'Failed to submit rating');
                return;
            }
            setSubmitted(true);
            toast.success(isAr ? 'شكراً لتقييمك!' : 'Thank you for your rating!');
        } catch {
            toast.error(isAr ? 'فشل إرسال التقييم' : 'Failed to submit rating');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-green-50 dark:bg-gov-forest/20 p-4 rounded-xl border border-green-100 dark:border-gov-forest/30 text-center animate-fade-in">
                <CheckCircle size={24} className="mx-auto mb-2 text-green-600 dark:text-gov-teal" />
                <p className="text-sm font-bold text-green-800 dark:text-white">{isAr ? 'شكراً لتقييمك!' : 'Thank you for your feedback!'}</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center gap-2" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={submitting}
                    className="transition-transform hover:scale-110 focus:outline-none disabled:opacity-50"
                    onMouseEnter={() => setHoverRating(star)}
                    onClick={() => handleRate(star)}
                >
                    <Star
                        size={28}
                        className={`transition-colors ${star <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-white/70'
                            }`}
                    />
                </button>
            ))}
        </div>
    );
};

interface ComplaintPortalProps {
    initialMode?: 'submit' | 'track';
    initialTrackingNumber?: string;
}

type RejectedAttachment = {
    name: string;
    size: number;
    reason: string;
};

const ComplaintPortal: React.FC<ComplaintPortalProps> = ({
    initialMode = 'submit',
    initialTrackingNumber = ''
}) => {
    const { t, language } = useLanguage();
    const isAr = language === 'ar';
    const { user, isAuthenticated } = useAuth();
    const { executeRecaptcha } = useRecaptcha();

    const [activeTab, setActiveTab] = useState<'submit' | 'track'>(initialMode);
    const [directoratesList, setDirectoratesList] = useState<Directorate[]>([]);
    const [whatsappNumber, setWhatsappNumber] = useState('963912345678');

    // Form Steps: 0 = User Info, 1 = Complaint Details, 2 = Success
    const [formStep, setFormStep] = useState(0);
    const [isAnonymous, setIsAnonymous] = useState(false);

    // Deletion states
    const [isDeleting, setIsDeleting] = useState(false);
    const [copied, setCopied] = useState(false);

    // Terms Agreement State
    const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
    const [showTermsScreen, setShowTermsScreen] = useState(true);
    const [dynamicRules, setDynamicRules] = useState<string>('');

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
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

    const authenticatedProfileData = useMemo(() => {
        if (!isAuthenticated || !user) {
            return null;
        }

        return {
            firstName: user.first_name || '',
            fatherName: user.father_name || '',
            lastName: user.last_name || '',
            email: user.email || '',
            phone: user.phone || '',
            nationalId: user.national_id || '',
            dob: user.birth_date ? user.birth_date.split('T')[0] : '',
        };
    }, [isAuthenticated, user]);
    const shouldLockPersonalInfo = !!authenticatedProfileData && !isAnonymous;
    const shouldLockNationalId = shouldLockPersonalInfo && Boolean(authenticatedProfileData?.nationalId);

    // Pre-fill form data from authenticated user profile (#558/#561)
    useEffect(() => {
        if (authenticatedProfileData && !isAnonymous) {
            setFormData(prev => ({
                ...prev,
                firstName: authenticatedProfileData.firstName || prev.firstName,
                lastName: authenticatedProfileData.lastName || prev.lastName,
                fatherName: authenticatedProfileData.fatherName || prev.fatherName,
                email: authenticatedProfileData.email || prev.email,
                phone: authenticatedProfileData.phone || prev.phone,
                nationalId: authenticatedProfileData.nationalId || prev.nationalId,
                dob: authenticatedProfileData.dob || prev.dob,
            }));
        }
    }, [authenticatedProfileData, isAnonymous]);

    // Upload Progress State
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<'ready' | 'uploading' | 'completed' | 'error'>('ready');

    // Dynamic template field values
    const [templateFieldValues, setTemplateFieldValues] = useState<Record<string, string>>({});

    // Complaint Template Dropdown State
    const [complaintTemplates, setComplaintTemplates] = useState<any[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
    const [loadingComplaintTemplates, setLoadingComplaintTemplates] = useState(false);
    const [templateListOpen, setTemplateListOpen] = useState(false);

    // OTP Verification State (for unauthenticated non-anonymous users)
    const [otpStep, setOtpStep] = useState<'none' | 'sending' | 'sent' | 'verifying' | 'verified'>('none');
    const [otpCode, setOtpCode] = useState('');
    const [guestToken, setGuestToken] = useState<string | null>(null);
    const [otpError, setOtpError] = useState<string | null>(null);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [stagedIds, setStagedIds] = useState<Record<string, string>>({});
    const [rejectedFiles, setRejectedFiles] = useState<RejectedAttachment[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Tracking State
    const [trackMode, setTrackMode] = useState<'identified' | 'anonymous'>('identified');
    const [trackId, setTrackId] = useState(initialTrackingNumber);
    const [trackNationalId, setTrackNationalId] = useState('');
    const [trackingResult, setTrackingResult] = useState<Ticket | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [trackError, setTrackError] = useState<string | null>(null);
    const isAuthenticatedTracker = Boolean(isAuthenticated && user);
    const requiresNationalIdForTracking = trackMode === 'identified';
    const autoTrackedFromProfileRef = useRef(false);

    // Validation State
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const MAX_ATTACHMENT_COUNT = 5;
    const MAX_ATTACHMENT_SIZE_MB = 5;
    const MAX_ATTACHMENT_SIZE_BYTES = MAX_ATTACHMENT_SIZE_MB * 1024 * 1024;
    const ALLOWED_ATTACHMENT_EXTENSIONS = new Set(['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']);

    const validateField = (name: string, value: string) => {
        let error = '';
        if (name === 'nationalId' && !/^\d{11}$/.test(value)) {
            error = t('complaint_national_id_invalid');
        } else if (name === 'phone') {
            const phoneResult = validatePhoneWithCountryCode(value);
            if (!phoneResult.isValid) {
                error = t('complaint_phone_invalid');
            }
        } else if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = t('validation_email_invalid') || 'Invalid email address';
        }

        setErrors(prev => ({ ...prev, [name]: error }));
        return error;
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, value);
    };

    useEffect(() => {
        API.directorates.getAll()
            .then(data => setDirectoratesList(data))
            .catch(err => console.error('Failed to load directorates:', err));

        API.settings.getByGroup('contact')
            .then(data => {
                const settings = data as Record<string, string>;
                if (settings.contact_whatsapp) {
                    setWhatsappNumber(settings.contact_whatsapp);
                }
            })
            .catch(() => { });

        API.settings.getByGroup('rules')
            .then(data => {
                const settings = data as Record<string, string>;
                const key = language === 'ar' ? 'complaint_rules_ar' : 'complaint_rules_en';
                if (settings[key]) setDynamicRules(settings[key]);
            })
            .catch(() => { });
    }, [language]);

    useEffect(() => {
        const loadTemplates = async () => {
            setLoadingComplaintTemplates(true);
            try {
                const data = await getComplaintTemplates(isAnonymous);
                setComplaintTemplates(data);

                const openTemplate = data.find((item: any) => item.type === 'open');
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

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!formRef.current) return;
        const inputs = formRef.current.querySelectorAll('input, textarea, select');
        inputs.forEach(el => focusPulse(el as any));
    }, [activeTab]);

    useEffect(() => {
        if (trackMode === 'identified' && !trackNationalId && user?.national_id) {
            setTrackNationalId(user.national_id);
        }
    }, [trackMode, trackNationalId, user?.national_id]);

    // Pre-fill form data for authenticated users
    useEffect(() => {
        if (shouldLockPersonalInfo && authenticatedProfileData) {
            setFormData(prev => ({
                ...prev,
                ...authenticatedProfileData,
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
    }, [shouldLockPersonalInfo, authenticatedProfileData, isAnonymous]);

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
            } else {
                toast.error(t('complaint_delete_failed'));
            }
        } catch (e) {
            toast.error(t('complaint_delete_error_generic'));
        } finally {
            setIsDeleting(false);
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const incomingFiles = Array.from(files);
        const remainingSlots = Math.max(0, MAX_ATTACHMENT_COUNT - selectedFiles.length);

        if (remainingSlots === 0) {
            toast.error(isAr ? `الحد الأقصى للمرفقات هو ${MAX_ATTACHMENT_COUNT} ملفات` : `Maximum ${MAX_ATTACHMENT_COUNT} attachments allowed`);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        const acceptedFiles: File[] = [];
        const rejectedByType: File[] = [];
        const rejectedBySize: File[] = [];

        incomingFiles.forEach((file) => {
            const fileExtension = file.name.includes('.')
                ? file.name.split('.').pop()?.toLowerCase() || ''
                : '';

            const isSupportedType = ALLOWED_ATTACHMENT_EXTENSIONS.has(fileExtension);
            const isSupportedSize = file.size <= MAX_ATTACHMENT_SIZE_BYTES;

            if (!isSupportedType) {
                rejectedByType.push(file);
                return;
            }

            if (!isSupportedSize) {
                rejectedBySize.push(file);
                return;
            }

            acceptedFiles.push(file);
        });

        const filesToAdd = acceptedFiles.slice(0, remainingSlots);
        const rejectedByCount = acceptedFiles.slice(remainingSlots);

        if (filesToAdd.length > 0) {
            setSelectedFiles(prev => [...prev, ...filesToAdd]);
            // Stage upload immediately on file selection
            setUploadStatus('uploading');
            setUploadProgress(0);
            const totalFiles = filesToAdd.length;
            let completed = 0;

            const failedFiles: string[] = [];
            for (const file of filesToAdd) {
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    const res = await fetch('/api/v1/complaints/attachments/stage', {
                        method: 'POST',
                        body: formData,
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
                setUploadProgress(Math.round((completed / totalFiles) * 100));
            }
            if (failedFiles.length > 0) {
                setUploadStatus('error');
            } else {
                setUploadStatus('ready');
            }
        }

        const rejectionItems: RejectedAttachment[] = [
            ...rejectedByType.map((file) => ({
                name: file.name,
                size: file.size,
                reason: isAr
                    ? 'صيغة ملف غير مدعومة'
                    : 'Unsupported file type',
            })),
            ...rejectedBySize.map((file) => ({
                name: file.name,
                size: file.size,
                reason: isAr
                    ? `حجم الملف يتجاوز ${MAX_ATTACHMENT_SIZE_MB} MB`
                    : `File exceeds ${MAX_ATTACHMENT_SIZE_MB} MB limit`,
            })),
            ...rejectedByCount.map((file) => ({
                name: file.name,
                size: file.size,
                reason: isAr
                    ? `تجاوزت الحد الأقصى (${MAX_ATTACHMENT_COUNT} ملفات)`
                    : `Exceeded attachment limit (${MAX_ATTACHMENT_COUNT} files)`,
            })),
        ];

        if (rejectionItems.length > 0) {
            setRejectedFiles(prev => [...prev, ...rejectionItems]);
        }

        if (rejectedByType.length > 0) {
            toast.error(
                isAr
                    ? `${rejectedByType.length} ملف بصيغة غير مدعومة. الصيغ المسموحة: PDF, DOC, DOCX, JPG, PNG`
                    : `${rejectedByType.length} file(s) rejected: unsupported type. Allowed: PDF, DOC, DOCX, JPG, PNG`
            );
        }

        if (rejectedBySize.length > 0) {
            toast.error(
                isAr
                    ? `${rejectedBySize.length} ملف يتجاوز ${MAX_ATTACHMENT_SIZE_MB} MB`
                    : `${rejectedBySize.length} file(s) exceed ${MAX_ATTACHMENT_SIZE_MB} MB limit`
            );
        }

        if (rejectedByCount.length > 0) {
            toast.error(
                isAr
                    ? `تم تجاوز الحد الأقصى. يمكنك إرفاق ${MAX_ATTACHMENT_COUNT} ملفات فقط`
                    : `Attachment limit reached. You can upload up to ${MAX_ATTACHMENT_COUNT} files`
            );
        }

        // Reset the input so the same file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = '';
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

    const removeFile = (index?: number) => {
        if (index !== undefined) {
            setSelectedFiles(prev => {
                const newFiles = prev.filter((_, i) => i !== index);
                if (newFiles.length === 0) {
                    setUploadProgress(0);
                    setUploadStatus('ready');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                }
                return newFiles;
            });
        } else {
            setSelectedFiles([]);
            setUploadProgress(0);
            setUploadStatus('ready');
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeRejectedFile = (index: number) => {
        setRejectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const nationalIdError = !isAnonymous && !/^\d{11}$/.test(formData.nationalId)
            ? t('complaint_national_id_invalid')
            : '';

        if (nationalIdError) {
            setTouched(prev => ({ ...prev, nationalId: true }));
            setErrors(prev => ({ ...prev, nationalId: nationalIdError }));
            setSubmitError(nationalIdError);
            return;
        }

        if (selectedFiles.length > MAX_ATTACHMENT_COUNT) {
            toast.error(
                isAr
                    ? `الحد الأقصى للمرفقات هو ${MAX_ATTACHMENT_COUNT} ملفات`
                    : `Maximum ${MAX_ATTACHMENT_COUNT} attachments allowed`
            );
            return;
        }

        setSubmitError(null);
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
                files: selectedFiles.length > 0 ? selectedFiles : undefined,
                staged_attachment_ids: selectedFiles.length > 0 ? selectedFiles.map(f => stagedIds[`${f.name}:${f.size}:${f.lastModified}`]).filter(Boolean) : undefined,
                template_id: selectedTemplateId || undefined,
                template_fields: Object.keys(templateFieldValues).length > 0 ? templateFieldValues : undefined,
            };
            if (shouldLockPersonalInfo && authenticatedProfileData) {
                Object.entries(authenticatedProfileData).forEach(([fieldName, fieldValue]) => {
                    if (fieldValue) {
                        submitData[fieldName] = fieldValue;
                    }
                });
            }
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
            const rawMessage = e?.message || '';
            // Translate common Arabic-only backend messages when language is English
            const translatedMessage = !isAr ? translateBackendError(rawMessage) : rawMessage;
            const errorMessage = translatedMessage || t('complaint_try_again');
            setSubmitError(errorMessage);
            toast.error(t('complaint_submit_fail'), {
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const performTracking = useCallback(async (ticketNumber: string, nationalId?: string) => {
        setIsTracking(true);
        setTrackError(null);
        setTrackingResult(null);

        try {
            const result = await API.complaints.track(ticketNumber, nationalId);
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
            const backendMessage = typeof e?.message === 'string' ? e.message.trim() : '';

            if (backendMessage === 'national_id_mismatch') {
                setTrackError(t('complaint_national_id_mismatch'));
                toast.error(t('complaint_national_id_mismatch'));
                return;
            }

            if (backendMessage === 'national_id_required') {
                setTrackError(t('complaint_track_identified_desc'));
                toast.error(t('complaint_track_identified_desc'));
                return;
            }

            if (backendMessage === 'tracking_mode_mismatch') {
                setTrackError(t('complaint_track_anonymous_desc'));
                toast.error(t('complaint_track_anonymous_desc'));
                return;
            }

            if (backendMessage && !backendMessage.startsWith('HTTP')) {
                setTrackError(backendMessage);
                toast.error(backendMessage);
                return;
            }

            setTrackError(t('complaint_connection_error_desc'));
            toast.error(t('complaint_connection_error'), {
                description: t('complaint_connection_error_desc'),
            });
        } finally {
            setIsTracking(false);
        }
    }, [t]);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();

        const normalizedTicket = trackId.trim();
        const normalizedNationalId = trackNationalId.trim();

        if (!normalizedTicket) {
            setTrackError(t('complaint_verify_ticket_id'));
            toast.error(t('complaint_verify_ticket_id'));
            return;
        }

        if (requiresNationalIdForTracking && !/^\d{11}$/.test(normalizedNationalId)) {
            setTrackError(t('complaint_national_id_invalid'));
            toast.error(t('complaint_national_id_invalid'));
            return;
        }

        await performTracking(
            normalizedTicket,
            requiresNationalIdForTracking ? normalizedNationalId : undefined,
        );
    };

    useEffect(() => {
        if (!isAuthenticatedTracker || !user?.national_id || initialMode !== 'track' || !initialTrackingNumber || autoTrackedFromProfileRef.current) {
            return;
        }

        autoTrackedFromProfileRef.current = true;
        setTrackId(initialTrackingNumber);
        void performTracking(initialTrackingNumber.trim(), user.national_id);
    }, [isAuthenticatedTracker, user?.national_id, initialMode, initialTrackingNumber, performTracking]);

    // T029: Enforced valid complaint status display with correct Arabic labels
    const statusMap: Record<string, { ar: string; en: string; color: string }> = {
        'received': { ar: 'واردة', en: 'Received', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
        'new': { ar: 'واردة', en: 'Received', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
        'in_progress': { ar: 'قيد المعالجة', en: 'In Progress', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
        'pending': { ar: 'قيد المعالجة', en: 'In Progress', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
        'processing': { ar: 'قيد المعالجة', en: 'In Progress', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
        'completed': { ar: 'منتهية', en: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
        'resolved': { ar: 'منتهية', en: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
        'rejected': { ar: 'مرفوضة', en: 'Rejected', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
        'closed': { ar: 'مغلقة', en: 'Closed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
        'responded': { ar: 'تم الرد عليها', en: 'Responded', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    };

    const getStatusColor = (status: string) => {
        return (statusMap[status] || statusMap['received']).color;
    };

    const getStatusLabel = (status: string) => {
        const entry = statusMap[status] || statusMap['received'];
        return isAr ? entry.ar : entry.en;
    };

    const formatDate = (value?: string) => {
        if (!value) return isAr ? 'غير متوفر' : 'N/A';
        return new Date(value).toLocaleString(isAr ? 'ar-SY' : 'en-US');
    };

    const getDirectorateName = (directorate: Ticket['directorate']) => {
        if (!directorate) return null;
        if (typeof directorate === 'string') return directorate;
        if (isAr) return directorate.name_ar || directorate.name || directorate.name_en || null;
        return directorate.name_en || directorate.name || directorate.name_ar || null;
    };

    const getPriorityLabel = (priority?: string) => {
        if (!priority) return null;
        const normalized = priority.toLowerCase();
        const labels: Record<string, { ar: string; en: string }> = {
            low: { ar: 'منخفضة', en: 'Low' },
            normal: { ar: 'عادية', en: 'Normal' },
            medium: { ar: 'متوسطة', en: 'Medium' },
            high: { ar: 'مرتفعة', en: 'High' },
            urgent: { ar: 'عاجلة', en: 'Urgent' },
        };
        const fallback = normalized.replace(/_/g, ' ');
        return isAr ? labels[normalized]?.ar || fallback : labels[normalized]?.en || fallback;
    };

    const translateBackendError = (msg: string): string => {
        const translations: Record<string, string> = {
            'تم تجاوز الحد المسموح': 'Rate limit exceeded. Please try again later.',
            'تم تجاوز الحد الأقصى': 'Maximum limit exceeded.',
            'الحد الأقصى للمرفقات': 'Maximum attachments limit reached.',
            'حجم الملف يتجاوز الحد المسموح': 'File size exceeds the allowed limit.',
            'صيغة ملف غير مدعومة': 'Unsupported file type.',
            'الرقم الوطني مطلوب': 'National ID is required.',
            'الوصف مطلوب': 'Description is required.',
            'الوصف يجب ان يكون على الأقل 10 أحرف': 'Description must be at least 10 characters.',
        };
        for (const [ar, en] of Object.entries(translations)) {
            if (msg.includes(ar)) return en;
        }
        return msg;
    };

    const maskEmail = (value?: string) => {
        if (!value) return null;
        const [name, domain] = value.split('@');
        if (!name || !domain) return value;
        const visible = name.slice(0, 2);
        return `${visible}${'*'.repeat(Math.max(1, name.length - 2))}@${domain}`;
    };

    const maskPhone = (value?: string) => {
        if (!value) return null;
        const digits = value.replace(/\D/g, '');
        if (digits.length < 5) return value;
        const start = digits.slice(0, 3);
        const end = digits.slice(-2);
        return `${start}${'*'.repeat(Math.max(3, digits.length - 5))}${end}`;
    };

    const getTemplateFieldLabel = (key: string) => {
        if (/[^\x00-\x7F]/.test(key)) return key;
        const normalized = key.replace(/_/g, ' ').trim();
        return normalized.charAt(0).toUpperCase() + normalized.slice(1);
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

                            {dynamicRules ? (
                                <div className="bg-gov-beige/50 dark:bg-gov-card/10 rounded-lg p-4 mb-4">
                                    <p className="text-gov-charcoal dark:text-white text-sm leading-relaxed whitespace-pre-line">
                                        {dynamicRules}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-gov-charcoal dark:text-white/70 text-sm mb-6 leading-relaxed">
                                        {t('complaint_review_desc')}
                                    </p>
                                    <div className="bg-gov-beige/50 dark:bg-gov-card/10 rounded-lg p-4 mb-4">
                                        <p className="text-gov-forest dark:text-gov-teal font-bold text-sm mb-3">
                                            {t('complaint_condition_intro')}
                                        </p>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-gov-cherry rounded-full mt-2 flex-shrink-0"></span>
                                                <p className="text-gov-charcoal dark:text-white text-sm">{t('complaint_condition_1')}</p>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-gov-cherry rounded-full mt-2 flex-shrink-0"></span>
                                                <p className="text-gov-charcoal dark:text-white text-sm">{t('complaint_condition_2')}</p>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-gov-cherry rounded-full mt-2 flex-shrink-0"></span>
                                                <p className="text-gov-charcoal dark:text-white text-sm">{t('complaint_condition_3')}</p>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-gov-cherry rounded-full mt-2 flex-shrink-0"></span>
                                                <p className="text-gov-charcoal dark:text-white text-sm">{t('complaint_condition_4')}</p>
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
                            <ChevronRight size={20} className="rtl:rotate-180" />
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
                            disabled={isSubmitting}
                            className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/70 hover:text-gov-forest dark:hover:text-gov-gold mb-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} className="rtl:rotate-180" />
                            <span>{t('complaint_back_terms')}</span>
                        </button>

                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-2">{t('general_form')}</h2>
                            <p className="text-gray-600 dark:text-white/70">{t('complaint_subtitle')}</p>
                        </div>

                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                            <fieldset disabled={isSubmitting}>


                            {/* Anonymous / Known User Toggle */}
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
                                            <span className="text-xs font-normal opacity-70">
                                                {isAr ? 'تقديم الشكوى باسمي الشخصي' : 'Submit complaint with my personal identity'}
                                            </span>
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
                                            <span className="text-xs font-normal opacity-70">
                                                {isAr ? 'تقديم الشكوى دون الكشف عن هويتي' : 'Submit complaint without revealing my identity'}
                                            </span>
                                        </div>
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
                                                        const entityFromApi = isAr ? tmpl.receiving_entity_ar : tmpl.receiving_entity_en;
                                                        const directorateFallback = (() => {
                                                            const d = directoratesList.find(d => d.id === tmpl.directorate_id);
                                                            return d ? (isAr ? getLocalizedName(d.name, 'ar') : getLocalizedName(d.name, 'en')) : null;
                                                        })();
                                                        const directorateName = entityFromApi || directorateFallback;

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
                                                                        directorate: tmpl.directorate_id || prev.directorate
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
                                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                                            {directorateName && (
                                                                                <span className="inline-block px-2 py-0.5 rounded-full bg-gov-forest/10 dark:bg-gov-teal/20 text-gov-forest dark:text-gov-teal text-[10px] font-bold">
                                                                                    {directorateName}
                                                                                </span>
                                                                            )}
                                                                            {tmpl.type && (
                                                                                <span className="inline-block px-2 py-0.5 rounded bg-gov-teal/10 dark:bg-gov-teal/20 text-gov-teal text-[10px] font-bold">
                                                                                    {tmpl.type === 'open' ? (isAr ? 'شكوى عامة' : 'General Complaint') : tmpl.type === 'standard' ? (isAr ? 'نموذج قياسي' : 'Standard Template') : tmpl.type}
                                                                                </span>
                                                                            )}
                                                                        </div>
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

                            {/* T027: Display receiving entity/department with full hierarchy */}
                            {(() => {
                                const selectedTmpl = complaintTemplates.find(t => t.id === selectedTemplateId);
                                if (!selectedTmpl) return null;

                                // Get directorate name from API response or fallback to local lookup
                                const receivingEntityName = isAr
                                    ? selectedTmpl.receiving_entity_ar
                                    : selectedTmpl.receiving_entity_en;
                                const directorateFallback = (() => {
                                    const d = directoratesList.find(d => d.id === selectedTmpl.directorate_id);
                                    return d ? (isAr ? getLocalizedName(d.name, 'ar') : getLocalizedName(d.name, 'en')) : null;
                                })();
                                const entityName = receivingEntityName || directorateFallback;

                                const ministryName = isAr
                                    ? 'وزارة الاقتصاد والصناعة'
                                    : 'Ministry of Economy and Industry';

                                return (
                                    <div className="mt-3 p-4 bg-gov-teal/10 dark:bg-gov-teal/5 rounded-xl border border-gov-teal/20 dark:border-gov-teal/10">
                                        <div className="flex items-start gap-2 mb-2">
                                            <Send size={16} className="text-gov-teal dark:text-gov-gold mt-0.5 flex-shrink-0" />
                                            <span className="text-gov-teal dark:text-gov-gold font-bold text-sm">
                                                {isAr ? 'سيتم توجيه شكواك إلى:' : 'Your complaint will be directed to:'}
                                            </span>
                                        </div>
                                        <div className={`flex flex-col gap-1 ${isAr ? 'mr-6' : 'ml-6'} text-sm`}>
                                            <span className="text-gov-charcoal dark:text-white/90 font-semibold">
                                                {ministryName}
                                            </span>
                                            {entityName && (
                                                <span className="text-gov-charcoal/80 dark:text-white/70 flex items-center gap-1">
                                                    <ChevronLeft size={14} className={`flex-shrink-0 text-gov-gold ${isAr ? '' : 'rotate-180'}`} />
                                                    {entityName}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}

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
                                                    {field.type === 'textarea' ? (
                                                        <Textarea
                                                            label={fieldLabel}
                                                            required={isRequired}
                                                            value={templateFieldValues[fieldKey] || ''}
                                                            onChange={(e) => setTemplateFieldValues(prev => ({ ...prev, [fieldKey]: e.target.value }))}
                                                            rows={4}
                                                            placeholder={fieldPlaceholder}
                                                        />
                                                    ) : field.type === 'select' && field.options ? (
                                                        <Select
                                                            label={fieldLabel}
                                                            required={isRequired}
                                                            value={templateFieldValues[fieldKey] || ''}
                                                            onChange={(e) => setTemplateFieldValues(prev => ({ ...prev, [fieldKey]: e.target.value }))}
                                                            options={field.options.map(opt => ({
                                                                value: opt.value,
                                                                label: isAr ? opt.label : (opt.label_en || opt.label)
                                                            }))}
                                                        />
                                                    ) : field.type === 'date' ? (
                                                        <Input
                                                            type="date"
                                                            label={fieldLabel}
                                                            required={isRequired}
                                                            value={templateFieldValues[fieldKey] || ''}
                                                            onChange={(e) => setTemplateFieldValues(prev => ({ ...prev, [fieldKey]: e.target.value }))}
                                                        />
                                                    ) : field.type === 'number' ? (
                                                        <Input
                                                            type="number"
                                                            label={fieldLabel}
                                                            required={isRequired}
                                                            value={templateFieldValues[fieldKey] || ''}
                                                            onChange={(e) => setTemplateFieldValues(prev => ({ ...prev, [fieldKey]: e.target.value }))}
                                                            placeholder={fieldPlaceholder}
                                                        />
                                                    ) : (
                                                        <Input
                                                            type="text"
                                                            label={fieldLabel}
                                                            required={isRequired}
                                                            value={templateFieldValues[fieldKey] || ''}
                                                            onChange={(e) => setTemplateFieldValues(prev => ({ ...prev, [fieldKey]: e.target.value }))}
                                                            placeholder={fieldPlaceholder}
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
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    multiple
                                />
                                {/* Upload button - always show when no files or to add more */}
                                <div className="flex flex-col items-center gap-3 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <div className="w-12 h-12 rounded-full bg-white dark:bg-gov-emerald/20 flex items-center justify-center text-gov-forest dark:text-gov-teal shadow-sm">
                                        <Upload size={24} />
                                    </div>
                                    <div>
                                        <span className="block font-bold text-gov-charcoal dark:text-white text-sm">{t('complaint_ocr_attach')}</span>
                                        <span className="text-xs text-gray-500 dark:text-white/70">PDF, DOC, DOCX, JPG, PNG</span>
                                        <span className="block text-xs text-gray-500 dark:text-white/70 mt-1">
                                            {isAr
                                                ? `حتى ${MAX_ATTACHMENT_COUNT} ملفات، كل ملف بحد أقصى ${MAX_ATTACHMENT_SIZE_MB} MB`
                                                : `Up to ${MAX_ATTACHMENT_COUNT} files, ${MAX_ATTACHMENT_SIZE_MB} MB each`}
                                        </span>
                                        {selectedFiles.length > 0 && (
                                            <span className="block text-xs text-gov-teal dark:text-gov-gold mt-1 font-bold">
                                                {isAr ? `${selectedFiles.length} ملف مرفق - انقر لإضافة المزيد` : `${selectedFiles.length} file(s) attached - click to add more`}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Show selected files immediately */}
                                {selectedFiles.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {selectedFiles.map((file, index) => (
                                            <div key={`${file.name}-${index}`}>
                                                <UploadProgress
                                                    fileName={file.name}
                                                    progress={uploadStatus === 'uploading' || isSubmitting ? uploadProgress : 100}
                                                    status={uploadStatus === 'uploading' || isSubmitting ? 'uploading' : uploadStatus === 'error' ? 'error' : 'ready'}
                                                    fileSize={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                                                    language={isAr ? 'ar' : 'en'}
                                                    onCancel={!isSubmitting ? () => removeFile(index) : undefined}
                                                />
                                            </div>
                                        ))}

                                        {/* Add more files button */}
                                        {selectedFiles.length < MAX_ATTACHMENT_COUNT && !isSubmitting && (
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full py-2.5 rounded-xl border-2 border-dashed border-gov-gold/30 text-gov-forest dark:text-gov-teal text-sm font-bold hover:bg-gov-beige/30 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Upload size={16} />
                                                <span>{isAr ? `إضافة مرفقات أخرى (${selectedFiles.length}/${MAX_ATTACHMENT_COUNT})` : `Add more files (${selectedFiles.length}/${MAX_ATTACHMENT_COUNT})`}</span>
                                            </button>
                                        )}

                                        {/* Show overall upload progress during submission */}
                                        {isSubmitting && (
                                            <MultiUploadProgress
                                                files={selectedFiles}
                                                progress={uploadProgress}
                                                isUploading={isSubmitting}
                                                isSubmitting={isSubmitting}
                                                language={isAr ? 'ar' : 'en'}
                                            />
                                        )}
                                    </div>
                                )}

                                {rejectedFiles.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {rejectedFiles.map((file, index) => (
                                            <div key={`${file.name}-rejected-${index}`} className="relative">
                                                <div className="flex items-center justify-between bg-white dark:bg-gov-card/10 p-3 rounded-lg border border-gov-cherry/30">
                                                    <div className="flex items-center gap-3">
                                                        <AlertCircle size={20} className="text-gov-cherry" />
                                                        <span className="text-sm font-bold text-gov-charcoal dark:text-white truncate max-w-[200px]">{file.name}</span>
                                                        <span className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                    </div>
                                                    <button type="button" onClick={() => removeRejectedFile(index)} className="text-gov-cherry hover:bg-gov-cherry/10 p-1 rounded">
                                                        <X size={16} />
                                                    </button>
                                                </div>

                                                <UploadProgress
                                                    fileName={file.name}
                                                    progress={0}
                                                    status="error"
                                                    error={file.reason}
                                                    fileSize={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                                                    language={isAr ? 'ar' : 'en'}
                                                />
                                            </div>
                                        ))}
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
                                        <Input
                                            label={t('complaint_first_name')}
                                            required
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            onBlur={handleBlur}
                                            error={touched.firstName && !formData.firstName.trim() ? (isAr ? 'الاسم الأول مطلوب' : 'First name is required') : undefined}
                                            isValid={touched.firstName && !!formData.firstName.trim()}
                                            icon={User}
                                            disabled={shouldLockPersonalInfo}
                                        />
                                        <Input
                                            label={t('complaint_father_name')}
                                            required
                                            name="fatherName"
                                            value={formData.fatherName}
                                            onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                                            onBlur={handleBlur}
                                            error={touched.fatherName && !formData.fatherName.trim() ? (isAr ? 'اسم الأب مطلوب' : 'Father name is required') : undefined}
                                            isValid={touched.fatherName && !!formData.fatherName.trim()}
                                            icon={User}
                                            disabled={shouldLockPersonalInfo}
                                        />
                                        <Input
                                            label={t('complaint_last_name')}
                                            required
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            onBlur={handleBlur}
                                            error={touched.lastName && !formData.lastName.trim() ? (isAr ? 'اسم العائلة مطلوب' : 'Last name is required') : undefined}
                                            isValid={touched.lastName && !!formData.lastName.trim()}
                                            icon={User}
                                            disabled={shouldLockPersonalInfo}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 mb-4 items-start">
                                        <NationalIdField
                                            value={formData.nationalId}
                                            onChange={(val) => {
                                                setFormData(prev => ({ ...prev, nationalId: val }));
                                                if (touched.nationalId) {
                                                    validateField('nationalId', val);
                                                }
                                            }}
                                            onBlur={() => {
                                                setTouched(prev => ({ ...prev, nationalId: true }));
                                                validateField('nationalId', formData.nationalId);
                                            }}
                                            onVerified={(citizenData) => {
                                                // Auto-fill form fields from civil registry data
                                                if (citizenData) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        firstName: citizenData.first_name || prev.firstName,
                                                        fatherName: citizenData.father_name || prev.fatherName,
                                                        lastName: citizenData.last_name || prev.lastName,
                                                        dob: citizenData.birth_date || prev.dob,
                                                    }));
                                                }
                                            }}
                                            error={touched.nationalId ? errors.nationalId : undefined}
                                            required={!isAnonymous}
                                            disabled={shouldLockNationalId}
                                            autoVerify={false}
                                            showVerifyButton={false}
                                            label={t('complaint_national_id')}
                                        />
                                        <Input
                                            type="date"
                                            label={t('complaint_dob')}
                                            required
                                            value={formData.dob}
                                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                            disabled={shouldLockPersonalInfo}
                                        />
                                    </div>

                                    {/* Email & Phone - moved up to applicant section per item 13 */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 items-start">
                                        <PhoneInput
                                            label={t('complaint_phone')}
                                            required={!isAnonymous}
                                            value={formData.phone}
                                            onChange={(val) => {
                                                setFormData({ ...formData, phone: val });
                                            }}
                                            onBlur={() => validateField('phone', formData.phone)}
                                            error={touched.phone ? errors.phone : undefined}
                                            isValid={touched.phone && !errors.phone && formData.phone.length > 10}
                                            disabled={shouldLockPersonalInfo}
                                            disableCountryCode={shouldLockPersonalInfo}
                                        />
                                        <Input
                                            type="email"
                                            label={t('complaint_email')}
                                            required={!isAnonymous}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            onBlur={handleBlur}
                                            name="email"
                                            error={touched.email ? errors.email : undefined}
                                            isValid={touched.email && !errors.email && formData.email.length > 0}
                                            placeholder="example@mail.com"
                                            icon={Mail}
                                            dir="ltr"
                                            disabled={shouldLockPersonalInfo}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Description - Only visible for "open" complaint template (T020) */}
                            {(() => {
                                const selectedTmpl = complaintTemplates.find(t => t.id === selectedTemplateId);
                                return (!selectedTemplateId || selectedTmpl?.type === 'open');
                            })() && (
                                    // {/* Complaint Details */}
                                    <Textarea
                                        label={t('complaint_details')}
                                        required
                                        value={formData.details}
                                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                        rows={6}
                                        placeholder={isAr ? 'يرجى كتابة تفاصيل الشكوى هنا...' : 'Please write the complaint details here...'}
                                        containerClassName="bg-white dark:bg-gov-card/10 p-4 rounded-xl border border-gray-100 dark:border-gov-border/15"
                                    />
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
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} className="rtl:-scale-x-100" />}
                                    {isSubmitting ? t('complaint_sending') : t('complaint_submit')}
                                </button>
                                {submitError && (
                                    <p className="mt-3 text-sm text-gov-cherry font-medium" role="alert">
                                        {submitError}
                                    </p>
                                )}
                            </div>
                        </fieldset>
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

                            <button onClick={() => { setSubmittedTicket(null); setActiveTab('track'); }} className="text-gov-forest dark:text-gov-teal font-bold hover:underline mb-8">
                                {t('complaint_track_now')}
                            </button>

                            {/* T028: Submission experience rating - uses happiness feedback API (not complaint rating which requires resolved status) */}
                            <div className="w-full max-w-sm">
                                <p className="text-sm font-bold text-gov-charcoal dark:text-white mb-2 text-center">
                                    {isAr ? 'قيّم تجربة تقديم الشكوى' : 'Rate your submission experience'}
                                </p>
                                <SubmissionExperienceRating />
                            </div>
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

                            <form onSubmit={handleTrack} className="max-w-lg mx-auto mb-10 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTrackMode('identified');
                                            setTrackError(null);
                                            setTrackingResult(null);
                                        }}
                                        className={`rounded-xl border p-3 text-start transition-all ${trackMode === 'identified'
                                            ? 'border-gov-forest dark:border-gov-teal bg-gov-forest/5 dark:bg-gov-teal/10'
                                            : 'border-gray-200 dark:border-gov-border/25 bg-white dark:bg-white/5'
                                            }`}
                                    >
                                        <span className="block text-sm font-bold text-gov-charcoal dark:text-white">{t('complaint_track_identified')}</span>
                                        <span className="block text-xs text-gray-500 dark:text-white/70 mt-1">{t('complaint_track_identified_desc')}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTrackMode('anonymous');
                                            setTrackNationalId('');
                                            setTrackError(null);
                                            setTrackingResult(null);
                                        }}
                                        className={`rounded-xl border p-3 text-start transition-all ${trackMode === 'anonymous'
                                            ? 'border-gov-forest dark:border-gov-teal bg-gov-forest/5 dark:bg-gov-teal/10'
                                            : 'border-gray-200 dark:border-gov-border/25 bg-white dark:bg-white/5'
                                            }`}
                                    >
                                        <span className="block text-sm font-bold text-gov-charcoal dark:text-white">{t('complaint_track_anonymous')}</span>
                                        <span className="block text-xs text-gray-500 dark:text-white/70 mt-1">{t('complaint_track_anonymous_desc')}</span>
                                    </button>
                                </div>

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

                                {requiresNationalIdForTracking && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-white/70 mb-1">{t('complaint_national_id_verify')}</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            maxLength={11}
                                            placeholder={t('complaint_national_id_placeholder')}
                                            value={trackNationalId}
                                            onChange={(e) => setTrackNationalId(e.target.value.replace(/\D/g, '').slice(0, 11))}
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
                                <div
                                    id="complaint-print-target"
                                    className="bg-white dark:bg-gov-card/10 border border-gray-100 dark:border-gov-border/25 rounded-2xl p-6 shadow-lg animate-slide-up max-w-lg mx-auto"
                                >
                                    {/* Official Print Header (visible only in print) */}
                                    <PrintHeader
                                        documentTitle={isAr ? 'متابعة شكوى' : 'Complaint Tracking'}
                                        referenceNumber={trackingResult.tracking_number || trackingResult.id}
                                        date={trackingResult.created_at ? new Date(trackingResult.created_at).toLocaleDateString(isAr ? 'ar-SY' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : undefined}
                                        language={isAr ? 'ar' : 'en'}
                                    />
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gov-border/15">
                                        <span className="font-bold text-gov-charcoal dark:text-white">{t('complaint_ticket_prefix')} {trackingResult.tracking_number || trackingResult.id}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(trackingResult.status)}`}>
                                            {getStatusLabel(trackingResult.status)}
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="rounded-xl border border-gray-100 dark:border-gov-border/20 bg-gray-50/70 dark:bg-white/5 p-3">
                                                <div className="flex items-start gap-2">
                                                    <Calendar size={16} className="text-gray-400 mt-0.5" />
                                                    <div>
                                                        <span className="block text-xs text-gray-500 dark:text-white/70 mb-1">{isAr ? 'تاريخ الإرسال' : 'Submitted At'}</span>
                                                        <span className="text-sm font-medium text-gov-charcoal dark:text-white">{formatDate(trackingResult.created_at)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="rounded-xl border border-gray-100 dark:border-gov-border/20 bg-gray-50/70 dark:bg-white/5 p-3">
                                                <div className="flex items-start gap-2">
                                                    <History size={16} className="text-gray-400 mt-0.5" />
                                                    <div>
                                                        <span className="block text-xs text-gray-500 dark:text-white/70 mb-1">{t('complaint_last_update')}</span>
                                                        <span className="text-sm font-medium text-gov-charcoal dark:text-white">{formatDate(trackingResult.updated_at || trackingResult.lastUpdate)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {getDirectorateName(trackingResult.directorate) && (
                                                <div className="rounded-xl border border-gray-100 dark:border-gov-border/20 bg-gray-50/70 dark:bg-white/5 p-3">
                                                    <div className="flex items-start gap-2">
                                                        <FileCheck size={16} className="text-gray-400 mt-0.5" />
                                                        <div>
                                                            <span className="block text-xs text-gray-500 dark:text-white/70 mb-1">{t('complaint_directorate')}</span>
                                                            <span className="text-sm font-medium text-gov-charcoal dark:text-white">{getDirectorateName(trackingResult.directorate)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Priority hidden from end users — only visible in admin panel */}
                                        </div>

                                        {trackingResult.ai_category && (
                                            <div className="flex items-start gap-3 bg-gray-50 dark:bg-white/10 p-3 rounded-lg">
                                                <div className="mt-1 text-gray-400"><ClipboardList size={18} /></div>
                                                <div>
                                                    <span className="block text-xs text-gray-500 dark:text-white/70 mb-1">{t('complaint_category_ai')}</span>
                                                    <span className="text-sm text-gray-700 dark:text-white/70">{trackingResult.ai_category}</span>
                                                </div>
                                            </div>
                                        )}

                                        {(trackingResult.full_name || trackingResult.phone || trackingResult.email) && (
                                            <div className="bg-gov-beige/50 dark:bg-white/10 border border-gov-gold/20 dark:border-gov-border/15 rounded-lg p-3 space-y-2">
                                                <h4 className="text-xs font-bold text-gov-forest dark:text-gov-teal">{isAr ? 'بيانات مقدم الشكوى (مخفية جزئياً)' : 'Complainant Details (Partially Masked)'}</h4>
                                                {trackingResult.full_name && (
                                                    <p className="text-xs text-gray-600 dark:text-white/70">{isAr ? 'الاسم:' : 'Name:'} <span className="font-medium text-gov-charcoal dark:text-white">{trackingResult.full_name}</span></p>
                                                )}
                                                {trackingResult.phone && (
                                                    <p className="text-xs text-gray-600 dark:text-white/70">{t('complaint_phone')}: <span className="font-medium text-gov-charcoal dark:text-white">{maskPhone(trackingResult.phone)}</span></p>
                                                )}
                                                {trackingResult.email && (
                                                    <p className="text-xs text-gray-600 dark:text-white/70">{t('complaint_email')}: <span className="font-medium text-gov-charcoal dark:text-white">{maskEmail(trackingResult.email)}</span></p>
                                                )}
                                            </div>
                                        )}

                                        {trackingResult.description && (
                                            <div className="flex items-start gap-3 bg-gray-50 dark:bg-white/10 p-3 rounded-lg">
                                                <div className="mt-1 text-gray-400"><FileText size={18} /></div>
                                                <div>
                                                    <span className="block text-xs text-gray-500 dark:text-white/70 mb-1">{t('complaint_details')}</span>
                                                    <p className="text-sm text-gray-700 dark:text-white/70 whitespace-pre-wrap break-words">{trackingResult.description}</p>
                                                </div>
                                            </div>
                                        )}

                                        {trackingResult.template_fields && Object.keys(trackingResult.template_fields).length > 0 && (
                                            <div className="bg-gov-ocean/5 dark:bg-gov-ocean/10 border border-gov-ocean/10 dark:border-gov-ocean/20 rounded-lg p-3">
                                                <h4 className="text-xs font-bold text-gov-forest dark:text-gov-oceanLight mb-2">{t('complaint_template_label')}</h4>
                                                <div className="space-y-1.5">
                                                    {Object.entries(trackingResult.template_fields).filter(([, value]) => Boolean(value)).map(([key, value]) => (
                                                        <p key={key} className="text-xs text-gray-700 dark:text-white/70">
                                                            <span className="font-bold text-gov-charcoal dark:text-white">{getTemplateFieldLabel(key)}:</span> {value}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {trackingResult.attachments && trackingResult.attachments.length > 0 && (
                                            <div className="bg-gray-50 dark:bg-white/10 p-3 rounded-lg border border-gray-100 dark:border-gov-border/15">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Upload size={16} className="text-gray-400" />
                                                    <span className="text-xs font-bold text-gray-600 dark:text-white/70">{t('complaint_attachments')} ({trackingResult.attachments.length})</span>
                                                </div>
                                                <div className="space-y-1">
                                                    {trackingResult.attachments.map((attachment, index) => (
                                                        <p key={String(attachment.id || index)} className="text-xs text-gray-700 dark:text-white/70 truncate">{attachment.file_name || (isAr ? `مرفق ${index + 1}` : `Attachment ${index + 1}`)}</p>
                                                    ))}
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
                                            printTargetId="complaint-print-target"
                                        />

                                        {/* FR-22: Delete button for "received/new" status */}
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

                                    {/* Official Print Footer (visible only in print) */}
                                    <PrintFooter language={isAr ? 'ar' : 'en'} />
                                </div>
                            )}

                            {/* T028: Resolution rating - show when complaint is completed/resolved/closed and not yet rated (must match backend canBeRated() statuses) */}
                            {trackingResult && (trackingResult.status === 'resolved' || trackingResult.status === 'closed' || trackingResult.status === 'completed') && !trackingResult.rating && (
                                <div className="max-w-lg mx-auto mt-6">
                                    <p className="text-sm font-bold text-gov-charcoal dark:text-white mb-2 text-center">
                                        {isAr ? 'قيّم مستوى الرد والمعالجة' : 'Rate the resolution quality'}
                                    </p>
                                    <ImportedSatisfactionRating trackingNumber={trackingResult.tracking_number || trackingResult.id} />
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

            </div >

        </div >
    );
};

export default ComplaintPortal;
