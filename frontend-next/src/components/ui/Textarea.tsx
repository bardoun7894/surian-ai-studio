import React, { TextareaHTMLAttributes, forwardRef } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    isValid?: boolean;
    containerClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, isValid, containerClassName, ...props }, ref) => {
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
                                ? 'border-gov-cherry focus:border-gov-cherry focus:ring-1 focus:ring-gov-cherry'
                                : isValid
                                    ? 'border-gov-emerald focus:border-gov-emerald'
                                    : 'border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-emerald'
                            }
                            ${className || ''}`}
                        {...props}
                    />

                    {/* Validation Icons (Top Right in LTR, Top Left in RTL) */}
                    {(error || isValid) && (
                        <div className={`absolute top-3 right-3 rtl:right-auto rtl:left-3 pointer-events-none`}>
                            {error && <AlertCircle size={18} className="text-gov-cherry" />}
                            {isValid && !error && <CheckCircle2 size={18} className="text-gov-emerald" />}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1.5 text-xs text-gov-cherry flex items-center gap-1 animate-fade-in">
                        <AlertCircle size={12} />
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export default Textarea;
