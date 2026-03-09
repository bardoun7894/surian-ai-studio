import React, { TextareaHTMLAttributes, forwardRef } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    isValid?: boolean;
    containerClassName?: string;
    /** Bug #349: Show character counter with min/max hints */
    showCharCount?: boolean;
    /** Custom character count label format. Receives (current, min, max) */
    charCountLabel?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, isValid, containerClassName, showCharCount, charCountLabel, ...props }, ref) => {
        const currentLength = typeof props.value === 'string' ? props.value.length : 0;
        const minLen = props.minLength;
        const maxLen = props.maxLength;
        const isBelowMin = minLen !== undefined && currentLength > 0 && currentLength < minLen;
        const isNearMax = maxLen !== undefined && currentLength > maxLen * 0.9;

        return (
            <div className={`w-full ${containerClassName || ''}`}>
                {label && (
                    <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                        {label} {props.required && <span className="text-gov-cherry">*</span>}
                    </label>
                )}
                <div className="relative">
                    <textarea
                        ref={ref}
                        className={`w-full p-3 rounded-xl bg-gov-beige/20 dark:bg-white/10 border outline-none transition-all resize-none text-gov-charcoal dark:text-white placeholder:text-gov-sand disabled:opacity-50 disabled:cursor-not-allowed
                            ${error
                                ? 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-400/20'
                                : isValid
                                    ? 'border-green-500 dark:border-emerald-400 focus:border-green-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-emerald-400/20'
                                    : 'border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20'
                            }
                            ${className || ''}`}
                        {...props}
                    />

                    {/* Validation Icons (Top Right in LTR, Top Left in RTL) */}
                    {(error || isValid) && (
                        <div className={`absolute top-3 right-3 rtl:right-auto rtl:left-3 pointer-events-none`}>
                            {error && <AlertCircle size={18} className="text-red-500 dark:text-gov-cherry" />}
                            {isValid && !error && <CheckCircle2 size={18} className="text-green-500 dark:text-emerald-400" />}
                        </div>
                    )}
                </div>
                {/* Bug #349: Character counter */}
                {(showCharCount || minLen || maxLen) && (
                    <div className="flex items-center justify-between mt-1 px-1">
                        <div className="text-xs">
                            {isBelowMin && (
                                <span className="text-amber-500 dark:text-amber-400">
                                    {minLen !== undefined && (currentLength < minLen) && (
                                        charCountLabel || `${minLen - currentLength} حرف إضافي مطلوب`
                                    )}
                                </span>
                            )}
                        </div>
                        <span className={`text-xs font-mono ${
                            isBelowMin
                                ? 'text-amber-500 dark:text-amber-400'
                                : isNearMax
                                    ? 'text-red-500 dark:text-red-400'
                                    : 'text-gray-400 dark:text-white/50'
                        }`}>
                            {currentLength}
                            {minLen !== undefined && currentLength < minLen && ` / ${minLen}`}
                            {maxLen !== undefined && ` / ${maxLen}`}
                        </span>
                    </div>
                )}
                {/* Validation message below field - min-height prevents layout shift */}
                <div className="min-h-[1.25rem] mt-1">
                    {error && (
                        <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1 animate-fade-in">
                            <AlertCircle size={12} className="shrink-0" />
                            {error}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export default Textarea;
