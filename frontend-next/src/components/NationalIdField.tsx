'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Loader2, Fingerprint } from 'lucide-react';
import { useNationalIdVerification } from '@/hooks/useNationalIdVerification';

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
    label = 'الرقم الوطني',
    required = false,
    disabled = false,
    autoVerify = true,
    showVerifyButton = false,
    className = '',
}: NationalIdFieldProps) {
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
                return 'border-gov-gold/20 dark:border-gov-border/15 focus-within:border-gov-emerald';
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
            {label && (
                <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                    {label} {required && <span className="text-gov-cherry">*</span>}
                </label>
            )}

            {/* Input container */}
            <div className={`relative flex items-center rounded-xl bg-gov-beige/20 dark:bg-white/10 border outline-none transition-all ${borderClass}`}>
                {/* Fingerprint icon */}
                <Fingerprint
                    size={18}
                    className={`absolute right-4 rtl:right-4 rtl:left-auto transition-colors pointer-events-none
                        ${verificationStatus === 'verified'
                            ? 'text-emerald-500'
                            : verificationStatus === 'error'
                                ? 'text-gov-red'
                                : 'text-gov-sand dark:text-gov-teal/50'
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
                    placeholder="أدخل الرقم الوطني المؤلف من 11 رقماً"
                    dir="ltr"
                    className={`w-full py-3 px-4 pr-12 rtl:pr-12 rtl:pl-4 rounded-xl bg-transparent outline-none text-gov-charcoal dark:text-white placeholder:text-gov-sand disabled:opacity-50 disabled:cursor-not-allowed text-left`}
                    required={required}
                />

                {/* Status icon on left side */}
                <div className="absolute left-4 rtl:left-4 rtl:right-auto top-1/2 -translate-y-1/2 pointer-events-none">
                    <StatusIcon />
                </div>
            </div>

            {/* Character counter */}
            <div className="flex items-center justify-between mt-1.5">
                <div className="flex-1">
                    {/* Format validation hint while typing */}
                    {formatValidation && !formatValidation.valid && value.length > 0 && verificationStatus === 'idle' && (
                        <p className="text-xs text-gov-sand flex items-center gap-1 animate-fade-in">
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
                </div>

                {/* Counter */}
                <span className={`text-xs tabular-nums shrink-0 mr-2 rtl:mr-0 rtl:ml-2 ${
                    value.length === 11
                        ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'text-gov-sand'
                }`}>
                    {value.length}/11
                </span>
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
                    التحقق من السجل المدني
                </button>
            )}
        </div>
    );
}
