import React, { InputHTMLAttributes, forwardRef, useState, useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    COUNTRY_PHONE_RULES,
    detectCountryRule,
    normalizePhoneWithCountryCode,
    sanitizeNationalPhoneInput,
    localizeNumbers,
} from '@/lib/phone';

export interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label?: string;
    error?: string;
    isValid?: boolean;
    containerClassName?: string;
    value: string;
    onChange: (value: string) => void;
    /** Lock only the country code dropdown while keeping the phone number input editable */
    disableCountryCode?: boolean;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
    ({ className, label, error, isValid, containerClassName, value, onChange, disableCountryCode, ...props }, ref) => {
        const { language, direction } = useLanguage();
        const [isOpen, setIsOpen] = useState(false);
        const [selectedCode, setSelectedCode] = useState('+963');
        const [phoneNumber, setPhoneNumber] = useState('');
        const dropdownRef = useRef<HTMLDivElement>(null);

        // Initialize state from value prop
        useEffect(() => {
            const normalizedValue = normalizePhoneWithCountryCode(value);

            if (!normalizedValue) {
                setPhoneNumber('');
                return;
            }

            const matchingCountry = detectCountryRule(normalizedValue);
            if (matchingCountry) {
                const sanitizedNumber = sanitizeNationalPhoneInput(
                    normalizedValue.slice(matchingCountry.code.length),
                    matchingCountry.maxDigits
                );
                setSelectedCode(matchingCountry.code);
                setPhoneNumber(sanitizedNumber);
                return;
            }

            setPhoneNumber(sanitizeNationalPhoneInput(normalizedValue, 15));
        }, [value]);

        const handleCodeSelect = (code: string) => {
            const selectedCountry = COUNTRY_PHONE_RULES.find((country) => country.code === code);
            const nextPhoneNumber = sanitizeNationalPhoneInput(phoneNumber, selectedCountry?.maxDigits || 15);
            setSelectedCode(code);
            setPhoneNumber(nextPhoneNumber);
            setIsOpen(false);
            onChange(`${code}${nextPhoneNumber}`);
        };

        const currentCountry = COUNTRY_PHONE_RULES.find(c => c.code === selectedCode);
        const maxDigits = currentCountry?.maxDigits || 15;

        const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = sanitizeNationalPhoneInput(e.target.value, maxDigits);
            setPhoneNumber(val);
            onChange(`${selectedCode}${val}`);
        };

        // Close dropdown when clicking outside
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        return (
            <div className={`w-full ${containerClassName || ''}`} dir={direction}>
                {label && (
                    <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                        {label} {props.required && <span className="text-gov-cherry">*</span>}
                    </label>
                )}
                <div className="relative flex w-full items-stretch" dir="ltr" ref={dropdownRef}>
                    {/* Country Code Dropdown Trigger - always on the left visually due to flex row and dir="ltr" */}
                    <div
                        className={`flex shrink-0 items-center gap-2 px-3 sm:px-4 min-w-[92px] sm:min-w-[104px] bg-gov-beige/20 dark:bg-white/10 border-y border-l rounded-l-xl transition-all
                            ${(props.disabled || disableCountryCode) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            ${error
                                ? 'border-red-500 dark:border-gov-cherry'
                                : isValid
                                    ? 'border-green-500 dark:border-gov-emerald'
                                    : 'border-gov-gold/20 dark:border-gov-border/15'
                            }
                        `}
                        onClick={() => !props.disabled && !disableCountryCode && setIsOpen(!isOpen)}
                    >
                        <span className="text-lg leading-none">{currentCountry?.flag}</span>
                        <span className="text-sm font-bold text-gov-charcoal dark:text-white" dir="ltr">
                            {selectedCode}
                        </span>
                        <ChevronDown size={14} className={`ml-auto text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Country Code Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto bg-white dark:bg-dm-surface border border-gray-200 dark:border-gov-border/25 rounded-xl shadow-lg z-50">
                            {COUNTRY_PHONE_RULES.map((country) => (
                                <div
                                    key={country.code}
                                    className={`flex items-center px-4 py-2 hover:bg-gov-beige/20 dark:hover:bg-white/5 cursor-pointer transition-colors ${selectedCode === country.code ? 'bg-gov-beige/40 dark:bg-white/10' : ''}`}
                                    onClick={() => handleCodeSelect(country.code)}
                                >
                                    <span className="text-xl mr-3">{country.flag}</span>
                                    <span className="flex-1 text-sm font-medium text-gov-charcoal dark:text-white">
                                        {language === 'ar' ? country.countryAr : country.country}
                                    </span>
                                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400" dir="ltr">
                                        {country.code}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Phone Number Input */}
                    <div className="relative flex-1">
                        <input
                            ref={ref}
                            type="tel"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            autoComplete="tel-national"
                            maxLength={maxDigits}
                            placeholder={currentCountry?.placeholder || ''}
                            className={`w-full py-3 px-4 rounded-r-xl bg-gov-beige/20 dark:bg-white/10 border border-l-0 outline-none transition-all text-gov-charcoal dark:text-white placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed
                                ${error
                                    ? 'border-red-500 dark:border-gov-cherry focus:border-red-500 dark:focus:border-gov-cherry focus:ring-2 focus:ring-red-500/20 dark:focus:ring-gov-cherry/20'
                                    : isValid
                                        ? 'border-green-500 dark:border-gov-emerald focus:border-green-500 dark:focus:border-gov-emerald focus:ring-2 focus:ring-green-500/20 dark:focus:ring-gov-emerald/20'
                                        : 'border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20'
                                }
                                ${className || ''}`}
                            dir="ltr"
                            {...props}
                        />
                        {/* Status Icons */}
                        {(error || isValid) && (
                            <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none`}>
                                {error && <AlertCircle size={18} className="text-red-500 dark:text-gov-cherry" />}
                                {isValid && !error && <CheckCircle2 size={18} className="text-green-500 dark:text-gov-emerald" />}
                            </div>
                        )}
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

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
