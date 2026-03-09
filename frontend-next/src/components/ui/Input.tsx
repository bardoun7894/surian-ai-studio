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
        const hasStatusIcon = !!(error || isValid);

        // Build padding classes to prevent icons from overlapping input text
        // LTR: icon on left (pl-12), status icon on right (pr-10)
        // RTL: icon on right (pr-12), status icon on left (pl-10)
        const paddingClasses = [
            Icon ? 'ltr:pl-12 rtl:pr-12' : '',
            hasStatusIcon ? 'ltr:pr-10 rtl:pl-10' : '',
        ].filter(Boolean).join(' ');

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
                        className={`w-full py-3 px-4 ${paddingClasses} rounded-xl bg-gov-beige/20 dark:bg-white/10 border outline-none transition-all text-gov-charcoal dark:text-white placeholder:text-gov-sand disabled:opacity-50 disabled:cursor-not-allowed
                            ${error
                                ? 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-400/20'
                                : isValid
                                    ? 'border-green-500 dark:border-emerald-400 focus:border-green-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-emerald-400/20'
                                    : 'border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20'
                            }
                            ${className || ''}`}
                        {...props}
                    />

                    {Icon && (
                        <Icon
                            className={`absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 transition-colors
                                ${error ? 'text-red-500 dark:text-gov-cherry' : isValid ? 'text-green-500 dark:text-emerald-400' : 'text-gov-sand dark:text-gov-teal/50'}`}
                            size={18}
                        />
                    )}

                    {/* Validation Icons (Right side in LTR, Left in RTL) */}
                    {(error || isValid) && (
                        <div className={`absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 pointer-events-none`}>
                            {error && <AlertCircle size={18} className="text-red-500 dark:text-gov-cherry" />}
                            {isValid && !error && <CheckCircle2 size={18} className="text-green-500 dark:text-emerald-400" />}
                        </div>
                    )}
                </div>
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

Input.displayName = 'Input';

export default Input;
