import React, { InputHTMLAttributes, forwardRef } from 'react';
import { LucideIcon, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    isValid?: boolean;
    icon?: LucideIcon;
    containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, isValid, icon: Icon, containerClassName, ...props }, ref) => {
        return (
            <div className={`w-full ${containerClassName || ''}`}>
                {label && (
                    <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                        {label} {props.required && <span className="text-gov-cherry">*</span>}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        className={`w-full py-3 px-4 ${Icon ? 'pl-12 rtl:pl-4 rtl:pr-12' : ''} rounded-xl bg-gov-beige/20 dark:bg-white/10 border outline-none transition-all text-gov-charcoal dark:text-white placeholder:text-gov-sand disabled:opacity-50 disabled:cursor-not-allowed
                            ${error
                                ? 'border-gov-cherry focus:border-gov-cherry focus:ring-1 focus:ring-gov-cherry'
                                : isValid
                                    ? 'border-gov-emerald focus:border-gov-emerald'
                                    : 'border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-emerald'
                            }
                            ${className || ''}`}
                        {...props}
                    />

                    {Icon && (
                        <Icon
                            className={`absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 transition-colors
                                ${error ? 'text-gov-cherry' : isValid ? 'text-gov-emerald' : 'text-gov-sand dark:text-gov-teal/50'}`}
                            size={18}
                        />
                    )}

                    {/* Validation Icons (Right side in LTR, Left in RTL) */}
                    {(error || isValid) && (
                        <div className={`absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 pointer-events-none`}>
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

Input.displayName = 'Input';

export default Input;
