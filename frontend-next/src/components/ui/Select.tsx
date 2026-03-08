import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { LucideIcon, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    isValid?: boolean;
    icon?: LucideIcon;
    containerClassName?: string;
    options?: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, isValid, icon: Icon, containerClassName, children, options, ...props }, ref) => {
        // Build padding classes explicitly to avoid RTL conflicts
        // LTR: icon on left → pl-12, chevron on right → pr-12
        // RTL: icon on right → pr-12, chevron on left → pl-12
        // Without icon: just chevron side gets extra padding
        const paddingClasses = Icon
            ? 'ltr:pl-12 ltr:pr-12 rtl:pr-12 rtl:pl-12'
            : 'ltr:pl-4 ltr:pr-12 rtl:pr-4 rtl:pl-12';

        return (
            <div className={`w-full ${containerClassName || ''}`}>
                {label && (
                    <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                        {label} {props.required && <span className="text-gov-cherry">*</span>}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        className={`w-full py-3 ${paddingClasses} appearance-none rounded-xl bg-gov-beige/20 dark:bg-white/10 border outline-none transition-all text-gov-charcoal dark:text-white disabled:opacity-50 disabled:cursor-not-allowed
                            ${error
                                ? 'border-red-500 dark:border-gov-cherry focus:border-red-500 dark:focus:border-gov-cherry focus:ring-2 focus:ring-red-500/20 dark:focus:ring-gov-cherry/20'
                                : isValid
                                    ? 'border-green-500 dark:border-emerald-400 focus:border-green-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-green-500/20 dark:focus:ring-emerald-400/20'
                                    : 'border-gov-gold/20 dark:border-gov-border/25 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20'
                            }
                            ${className || ''}`}
                        {...props}
                    >
                        {options ? (
                            options.map((opt) => (
                                <option key={opt.value} value={opt.value} className="bg-white text-gov-charcoal dark:bg-dm-surface dark:text-white">
                                    {opt.label}
                                </option>
                            ))
                        ) : (
                            children
                        )}
                    </select>

                    {Icon && (
                        <Icon
                            className={`absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors
                                ${error ? 'text-red-500 dark:text-gov-cherry' : isValid ? 'text-green-500 dark:text-emerald-400' : 'text-gov-sand dark:text-gov-teal/50'}`}
                            size={18}
                        />
                    )}

                    {/* Custom Chevron and Validation Status */}
                    <div className="absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                        {error && <AlertCircle size={18} className="text-red-500 dark:text-gov-cherry" />}
                        {isValid && !error && <CheckCircle2 size={18} className="text-green-500 dark:text-emerald-400" />}
                        <ChevronDown size={16} className="text-gray-400" />
                    </div>
                </div>
                {/* Validation message below field - min-height prevents layout shift */}
                <div className="min-h-[1.25rem] mt-1">
                    {error && (
                        <p className="text-xs text-red-500 dark:text-gov-cherry flex items-center gap-1 animate-fade-in">
                            <AlertCircle size={12} className="shrink-0" />
                            {error}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;
