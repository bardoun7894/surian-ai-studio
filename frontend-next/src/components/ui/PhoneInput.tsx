import React, { InputHTMLAttributes, forwardRef, useState, useEffect, useRef } from 'react';
import { LucideIcon, AlertCircle, CheckCircle2, ChevronDown, Phone, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label?: string;
    error?: string;
    isValid?: boolean;
    containerClassName?: string;
    value: string;
    onChange: (value: string) => void;
}

const COUNTRY_CODES = [
    { code: '+963', country: 'Syria', flag: '🇸🇾' },
    { code: '+961', country: 'Lebanon', flag: '🇱🇧' },
    { code: '+962', country: 'Jordan', flag: '🇯🇴' },
    { code: '+964', country: 'Iraq', flag: '🇮🇶' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+20', country: 'Egypt', flag: '🇪🇬' },
    { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+90', country: 'Turkey', flag: '🇹🇷' },
    { code: '+98', country: 'Iran', flag: '🇮🇷' },
    { code: '+7', country: 'Russia', flag: '🇷🇺' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
];

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
    ({ className, label, error, isValid, containerClassName, value, onChange, ...props }, ref) => {
        const { language } = useLanguage();
        const isAr = language === 'ar';
        const [isOpen, setIsOpen] = useState(false);
        const [selectedCode, setSelectedCode] = useState('+963');
        const [phoneNumber, setPhoneNumber] = useState('');
        const dropdownRef = useRef<HTMLDivElement>(null);

        // Initialize state from value prop
        useEffect(() => {
            if (value) {
                // Try to find matching country code
                const matchingCountry = COUNTRY_CODES.find(c => value.startsWith(c.code));
                if (matchingCountry) {
                    setSelectedCode(matchingCountry.code);
                    setPhoneNumber(value.replace(matchingCountry.code, ''));
                } else {
                    // Default to Syria if no match found or empty
                    if (!value.startsWith('+')) {
                        setPhoneNumber(value);
                    } else {
                        // Keep full value if it's some other code
                        setPhoneNumber(value);
                    }
                }
            } else {
                setPhoneNumber('');
            }
        }, [value]);

        const handleCodeSelect = (code: string) => {
            setSelectedCode(code);
            setIsOpen(false);
            onChange(`${code}${phoneNumber}`);
        };

        const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value.replace(/[^\d]/g, '').slice(0, 10); // Allow digits only, max 10
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

        const selectedCountry = COUNTRY_CODES.find(c => c.code === selectedCode);

        return (
            <div className={`w-full ${containerClassName || ''}`}>
                {label && (
                    <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                        {label} {props.required && <span className="text-gov-cherry">*</span>}
                    </label>
                )}
                <div className="relative flex" ref={dropdownRef}>
                    {/* Country Code Dropdown Trigger */}
                    <div
                        className={`flex items-center justify-between px-3 min-w-[100px] cursor-pointer bg-gov-beige/20 dark:bg-white/10 border-y border-l rtl:border-r rtl:border-l-0 rounded-l-xl rtl:rounded-l-none rtl:rounded-r-xl transition-all
                            ${error
                                ? 'border-red-500 dark:border-gov-cherry'
                                : isValid
                                    ? 'border-green-500 dark:border-gov-emerald'
                                    : 'border-gov-gold/20 dark:border-gov-border/15'
                            }
                        `}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span className="text-xl mr-2">{selectedCountry?.flag}</span>
                        <span className="text-sm font-mono text-gov-charcoal dark:text-white" dir="ltr">{selectedCode}</span>
                        <ChevronDown size={14} className={`ml-1 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Country Code Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute top-full ltr:left-0 rtl:right-0 mt-1 w-64 max-h-60 overflow-y-auto bg-white dark:bg-dm-surface border border-gray-200 dark:border-gov-border/25 rounded-xl shadow-lg z-50">
                            {COUNTRY_CODES.map((country) => (
                                <div
                                    key={country.code}
                                    className={`flex items-center px-4 py-2 hover:bg-gov-beige/20 dark:hover:bg-white/5 cursor-pointer transition-colors ${selectedCode === country.code ? 'bg-gov-beige/40 dark:bg-white/10' : ''}`}
                                    onClick={() => handleCodeSelect(country.code)}
                                >
                                    <span className="text-xl mr-3">{country.flag}</span>
                                    <span className="flex-1 text-sm text-gov-charcoal dark:text-white">{country.country}</span>
                                    <span className="text-sm font-mono text-gray-500 dark:text-gray-400" dir="ltr">{country.code}</span>
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
                            maxLength={10}
                            className={`w-full py-3 px-4 rounded-r-xl rtl:rounded-r-none rtl:rounded-l-xl bg-gov-beige/20 dark:bg-white/10 border border-l-0 rtl:border-r-0 outline-none transition-all text-gov-charcoal dark:text-white placeholder:text-gov-sand disabled:opacity-50 disabled:cursor-not-allowed
                                ${error
                                    ? 'border-red-500 dark:border-gov-cherry focus:border-red-500 dark:focus:border-gov-cherry focus:ring-1 focus:ring-red-500 dark:focus:ring-gov-cherry'
                                    : isValid
                                        ? 'border-green-500 dark:border-gov-emerald focus:border-green-500 dark:focus:border-gov-emerald'
                                        : 'border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-emerald'
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
                {error && (
                    <p className="mt-1.5 text-xs text-red-500 dark:text-gov-cherry flex items-center gap-1 animate-fade-in">
                        <AlertCircle size={12} />
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
