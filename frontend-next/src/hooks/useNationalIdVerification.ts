'use client';

import { useState, useCallback, useRef } from 'react';
import { API } from '@/lib/repository';

interface VerificationResult {
    verified: boolean;
    message: string;
    service_available: boolean;
    citizen_data?: {
        first_name?: string;
        father_name?: string;
        last_name?: string;
        birth_date?: string;
        governorate?: string;
    };
    mismatched_fields?: Array<{ field: string; label: string }>;
}

interface UseNationalIdVerificationReturn {
    // State
    verificationStatus: 'idle' | 'validating' | 'verifying' | 'verified' | 'error' | 'mismatch';
    verificationMessage: string;
    citizenData: VerificationResult['citizen_data'] | null;
    mismatchedFields: Array<{ field: string; label: string }>;
    isServiceAvailable: boolean;
    
    // Actions
    validateFormat: (nationalId: string) => { valid: boolean; error: string };
    verifyWithRegistry: (nationalId: string, personalData?: {
        first_name?: string;
        father_name?: string;
        last_name?: string;
        birth_date?: string;
    }) => Promise<VerificationResult | null>;
    reset: () => void;
}

export function useNationalIdVerification(): UseNationalIdVerificationReturn {
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'validating' | 'verifying' | 'verified' | 'error' | 'mismatch'>('idle');
    const [verificationMessage, setVerificationMessage] = useState('');
    const [citizenData, setCitizenData] = useState<VerificationResult['citizen_data'] | null>(null);
    const [mismatchedFields, setMismatchedFields] = useState<Array<{ field: string; label: string }>>([]);
    const [isServiceAvailable, setIsServiceAvailable] = useState(false);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    const validateFormat = useCallback((nationalId: string): { valid: boolean; error: string } => {
        const isAr = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
        if (!nationalId || nationalId.trim() === '') {
            return { valid: false, error: isAr ? 'الرقم الوطني مطلوب' : 'National ID is required' };
        }
        if (!/^\d+$/.test(nationalId)) {
            return { valid: false, error: isAr ? 'الرقم الوطني يجب أن يحتوي على أرقام فقط' : 'National ID must contain numbers only' };
        }
        if (nationalId.length < 11) {
            return { valid: false, error: isAr ? `أدخلت ${nationalId.length} من 11 رقماً` : `${nationalId.length}/11 digits entered` };
        }
        return { valid: true, error: '' };
    }, []);

    const verifyWithRegistry = useCallback(async (
        nationalId: string,
        personalData?: { first_name?: string; father_name?: string; last_name?: string; birth_date?: string }
    ): Promise<VerificationResult | null> => {
        // First validate format
        const formatCheck = validateFormat(nationalId);
        if (!formatCheck.valid) {
            setVerificationStatus('error');
            setVerificationMessage(formatCheck.error);
            return null;
        }

        const isAr = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
        setVerificationStatus('verifying');
        setVerificationMessage(isAr ? 'جارٍ التحقق من الرقم الوطني في السجل المدني...' : 'Verifying National ID with the civil registry...');

        try {
            const result = await API.nationalId.verify({
                national_id: nationalId,
                ...personalData,
            });

            setIsServiceAvailable(result.service_available ?? false);

            if (result.verified) {
                setVerificationStatus('verified');
                setVerificationMessage(result.message || (isAr ? 'تم التحقق بنجاح' : 'Verification successful'));
                setCitizenData(result.citizen_data || null);
                setMismatchedFields([]);
            } else if (result.mismatched_fields?.length > 0) {
                setVerificationStatus('mismatch');
                setVerificationMessage(result.message || (isAr ? 'البيانات غير مطابقة للسجل المدني' : 'Data does not match civil registry records'));
                setMismatchedFields(result.mismatched_fields);
                setCitizenData(null);
            } else {
                setVerificationStatus('error');
                setVerificationMessage(result.message || (isAr ? 'الرقم الوطني غير مسجل في السجل المدني' : 'National ID is not registered in the civil registry'));
                setCitizenData(null);
            }

            return result;
        } catch (err) {
            setVerificationStatus('error');
            setVerificationMessage(isAr ? 'حدث خطأ أثناء الاتصال بخدمة السجل المدني. يرجى المحاولة مرة أخرى.' : 'An error occurred while connecting to the civil registry service. Please try again.');
            return null;
        }
    }, [validateFormat]);

    const reset = useCallback(() => {
        setVerificationStatus('idle');
        setVerificationMessage('');
        setCitizenData(null);
        setMismatchedFields([]);
    }, []);

    return {
        verificationStatus,
        verificationMessage,
        citizenData,
        mismatchedFields,
        isServiceAvailable,
        validateFormat,
        verifyWithRegistry,
        reset,
    };
}
