'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Loader2, Fingerprint } from 'lucide-react';
import { useNationalIdVerification } from '@/hooks/useNationalIdVerification';
import { useLanguage } from '@/contexts/LanguageContext';

interface NationalIdFieldProps {
    value: string;
    onChange: (value: string) => void;
    onVerified?: (citizenData: any) => void;
    onError?: (error: string) => void;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    autoVerify?: boolean;
    showVerifyButton?: boolean;
    className?: string;
}

export default function NationalIdField({
    value,
    onChange,
    onVerified,
    onError,
    label,
    required = false,
    disabled = false,
    autoVerify = true,
    showVerifyButton = false,
    className = '',
}: NationalIdFieldProps) {
    const { language, t } = useLanguage();
    const resolvedLabel = label !== undefined ? label : t('auth_national_id');
    const {
        verificationStatus,
        verificationMessage,
        citizenData,
        mismatchedFields,
        validateFormat,
        verifyWithRegistry,
        reset,
    } = useNationalIdVerification();

    const hasAutoVerified = useRef(false);
    const prevValueRef = useRef(value);

    // Handle input change - allow only numeric input
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^\d]/g, '');
        // Cap at 11 digits
        const capped = raw.slice(0, 11);
        onChange(capped);

        // Reset verification if the value changed
        if (capped !== prevValueRef.current) {
            reset();
            hasAutoVerified.current = false;
            prevValueRef.current = capped;
        }
    }, [onChange, reset]);

    // Auto-verify when 11 digits are entered
    useEffect(() => {
        if (
            autoVerify &&
            value.length === 11 &&
            !hasAutoVerified.current &&
            verificationStatus === 'idle'
        ) {
            hasAutoVerified.current = true;
            verifyWithRegistry(value).then((result) => {
                if (result?.verified && onVerified) {
                    onVerified(result.citizen_data || null);
                } else if (!result?.verified && onError) {
                    onError(result?.message || 'فشل التحقق');
                }
            });
        }
    }, [value, autoVerify, verificationStatus, verifyWithRegistry, onVerified, onError]);

    // Manual verify handler
    const handleManualVerify = useCallback(() => {
        hasAutoVerified.current = true;
        verifyWithRegistry(value).then((result) => {
            if (result?.verified && onVerified) {
                onVerified(result.citizen_data || null);
            } else if (!result?.verified && onError) {
                onError(result?.message || 'فشل التحقق');
            }
        });
    }, [value, verifyWithRegistry, onVerified, onError]);

    // Real-time format validation message (while typing, before full 11 digits)
    const formatValidation = value.length > 0 && value.length < 11
        ? validateFormat(value)
        : null;

    // Border color based on status
    const borderClass = (() => {
        switch (verificationStatus) {
            case 'validating':
                return 'border-blue-400 focus-within:border-blue-500';
            case 'verifying':
                return 'border-gov-gold focus-within:border-gov-gold';
            case 'verified':
                return 'border-emerald-500 focus-within:border-emerald-500';
            case 'error':
                return 'border-gov-red focus-within:border-gov-red';
            case 'mismatch':
                return 'border-orange-400 focus-within:border-orange-500';
            default:
                return 'border-gray-200 dark:border-gov-border/25 focus-within:border-gov-teal focus-within:ring-2 focus-within:ring-gov-teal/20';
        }
    })();

    // Status icon
    const StatusIcon = () => {
        switch (verificationStatus) {
            case 'validating':
            case 'verifying':
                return <Loader2 size={18} className="animate-spin text-gov-gold" />;
            case 'verified':
                return <CheckCircle2 size={18} className="text-emerald-500" />;
            case 'error':
                return <XCircle size={18} className="text-gov-red" />;
            case 'mismatch':
                return <AlertTriangle size={18} className="text-orange-500" />;
            default:
                return null;
        }
    };

    // Message color
    const messageClass = (() => {
        switch (verificationStatus) {
            case 'verifying':
            case 'validating':
                return 'text-gov-gold';
            case 'verified':
                return 'text-emerald-600 dark:text-emerald-400';
            case 'error':
                return 'text-gov-red';
            case 'mismatch':
                return 'text-orange-600 dark:text-orange-400';
            default:
                return 'text-gov-sand';
        }
    })();

    return (
        <div className={`w-full ${className}`}>
            {/* Label */}
            {resolvedLabel && (
                <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {resolvedLabel} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {/* Input container */}
            <div className={`relative group flex items-center rounded-xl bg-gray-50 dark:bg-white/10 border outline-none transition-all ${borderClass}`}>
                {/* Fingerprint icon */}
                <Fingerprint
                    size={20}
                    className={`absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none
                        ${verificationStatus === 'verified'
                            ? 'text-emerald-500'
                            : verificationStatus === 'error'
                                ? 'text-gov-red'
                                : 'text-gray-400 group-focus-within:text-gov-teal'
                        }`}
                />

                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={11}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled || verificationStatus === 'verifying'}
                    placeholder={language === 'ar' ? 'أدخل الرقم الوطني المؤلف من 11 رقماً' : 'Enter 11-digit National ID'}
                    dir="ltr"
                    className={`w-full py-2.5 px-4 ltr:pl-12 rtl:pr-12 rounded-xl bg-transparent outline-none text-gov-charcoal dark:text-white placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-left text-sm`}
                    required={required}
                />

                {/* Status icon on opposite side */}
                <div className="absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <StatusIcon />
                </div>
            </div>

            {/* Helper text and counter */}
            <div className="mt-1.5">
                {/* Format validation hint while typing */}
                {formatValidation && !formatValidation.valid && value.length > 0 && verificationStatus === 'idle' && (
                    <p className="text-xs text-gray-500 dark:text-white/60 flex items-center gap-1 animate-fade-in">
                        {formatValidation.error}
                    </p>
                )}

                {/* Verification status message */}
                {verificationMessage && (
                    <p className={`text-xs flex items-center gap-1.5 animate-fade-in ${messageClass}`}>
                        <StatusIcon />
                        {verificationMessage}
                    </p>
                )}

                {/* Mismatch details */}
                {verificationStatus === 'mismatch' && mismatchedFields.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                        {mismatchedFields.map((field, idx) => (
                            <p key={idx} className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                                <AlertTriangle size={12} />
                                {field.label}
                            </p>
                        ))}
                    </div>
                )}

                {/* Counter */}
                {value.length > 0 && (
                    <p className={`text-xs tabular-nums mt-0.5 ${
                        value.length === 11
                            ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                            : 'text-gray-500 dark:text-white/60'
                    }`}>
                        {value.length}/11
                    </p>
                )}
            </div>

            {/* Manual verify button */}
            {showVerifyButton && value.length === 11 && verificationStatus !== 'verified' && verificationStatus !== 'verifying' && (
                <button
                    type="button"
                    onClick={handleManualVerify}
                    disabled={disabled}
                    className="mt-2 w-full py-2 px-4 rounded-xl bg-gov-forest text-white text-sm font-semibold hover:bg-gov-forest/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Fingerprint size={16} />
                    {t('national_id_verify_button')}
                </button>
            )}
        </div>
    );
}
