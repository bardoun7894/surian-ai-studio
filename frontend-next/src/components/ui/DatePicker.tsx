'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronUp, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AR_MONTHS = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const EN_MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const AR_DAYS_SHORT = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];
const EN_DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function toArabicNumerals(n: number | string): string {
    const digits = '٠١٢٣٤٥٦٧٨٩';
    return String(n).replace(/[0-9]/g, (d) => digits[parseInt(d)]);
}

interface DatePickerProps {
    value: string; // YYYY-MM-DD
    onChange: (value: string) => void;
    onBlur?: () => void;
    min?: string;
    max?: string;
    className?: string;
    required?: boolean;
    label?: string;
    disabled?: boolean;
    error?: string;
    isValid?: boolean;
}

export default function DatePicker({ value, onChange, onBlur, min, max, className, required, label, disabled, error, isValid }: DatePickerProps) {
    const { language } = useLanguage();
    const isAr = language === 'ar';
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse the current value or default to a reasonable view month
    const parsed = value ? new Date(value + 'T00:00:00') : null;
    const [viewYear, setViewYear] = useState(parsed ? parsed.getFullYear() : 2000);
    const [viewMonth, setViewMonth] = useState(parsed ? parsed.getMonth() : 0);

    // Sync view when value changes externally
    useEffect(() => {
        if (value) {
            const d = new Date(value + 'T00:00:00');
            if (!isNaN(d.getTime())) {
                setViewYear(d.getFullYear());
                setViewMonth(d.getMonth());
            }
        }
    }, [value]);

    // Close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClick);
            return () => document.removeEventListener('mousedown', handleClick);
        }
    }, [open]);

    const minDate = min ? new Date(min + 'T00:00:00') : null;
    const maxDate = max ? new Date(max + 'T00:00:00') : null;

    const isDateDisabled = (y: number, m: number, d: number) => {
        const date = new Date(y, m, d);
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;
        return false;
    };

    const formatDisplay = (val: string) => {
        if (!val) return '';
        const parts = val.split('-');
        if (parts.length !== 3) return val;
        const [y, m, d] = parts;
        if (isAr) {
            return `${toArabicNumerals(d)}/${toArabicNumerals(m)}/${toArabicNumerals(y)}`;
        }
        return `${d}/${m}/${y}`;
    };

    const prevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(viewYear - 1);
        } else {
            setViewMonth(viewMonth - 1);
        }
    };

    const nextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear(viewYear + 1);
        } else {
            setViewMonth(viewMonth + 1);
        }
    };

    const selectDate = (day: number) => {
        const m = String(viewMonth + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        const dateStr = `${viewYear}-${m}-${d}`;
        onChange(dateStr);
        setOpen(false);
        onBlur?.();
    };

    const handleClear = () => {
        onChange('');
        setOpen(false);
        onBlur?.();
    };

    const handleToday = () => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${d}`;
        if (!isDateDisabled(now.getFullYear(), now.getMonth(), now.getDate())) {
            onChange(dateStr);
            setViewYear(now.getFullYear());
            setViewMonth(now.getMonth());
        }
        setOpen(false);
        onBlur?.();
    };

    // Build calendar grid
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const calendarDays: { day: number; currentMonth: boolean; disabled: boolean }[] = [];
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        const d = daysInPrevMonth - i;
        const pm = viewMonth === 0 ? 11 : viewMonth - 1;
        const py = viewMonth === 0 ? viewYear - 1 : viewYear;
        calendarDays.push({ day: d, currentMonth: false, disabled: isDateDisabled(py, pm, d) });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        calendarDays.push({ day: d, currentMonth: true, disabled: isDateDisabled(viewYear, viewMonth, d) });
    }
    const remaining = 42 - calendarDays.length;
    for (let d = 1; d <= remaining; d++) {
        const nm = viewMonth === 11 ? 0 : viewMonth + 1;
        const ny = viewMonth === 11 ? viewYear + 1 : viewYear;
        calendarDays.push({ day: d, currentMonth: false, disabled: isDateDisabled(ny, nm, d) });
    }

    const isSelected = (day: number, currentMonth: boolean) => {
        if (!parsed || !currentMonth) return false;
        return parsed.getFullYear() === viewYear && parsed.getMonth() === viewMonth && parsed.getDate() === day;
    };

    const isDayToday = (day: number, currentMonth: boolean) => {
        if (!currentMonth) return false;
        const now = new Date();
        return now.getFullYear() === viewYear && now.getMonth() === viewMonth && now.getDate() === day;
    };

    const months = isAr ? AR_MONTHS : EN_MONTHS;
    const days = isAr ? AR_DAYS_SHORT : EN_DAYS_SHORT;

    const borderClass = error
        ? 'border-red-500 dark:border-red-400'
        : isValid
            ? 'border-green-500 dark:border-emerald-400'
            : className || 'border-gov-gold/20 dark:border-gov-border/25';

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">
                    {label} {required && <span className="text-red-500 dark:text-red-400">*</span>}
                </label>
            )}
            <div ref={containerRef} className="relative">
                <div
                    onClick={() => !disabled && setOpen(!open)}
                    className={`w-full py-2.5 px-4 ${isAr ? 'pr-12' : 'pl-12'} rounded-xl bg-gov-beige/20 dark:bg-white/10 border text-gov-charcoal dark:text-white text-sm select-none flex items-center transition-all
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        ${borderClass}`}
                >
                    <span className={!value ? 'text-gov-sand' : ''}>
                        {value ? formatDisplay(value) : (isAr ? '\u0627\u062e\u062a\u0631 \u0627\u0644\u062a\u0627\u0631\u064a\u062e' : 'Select date')}
                    </span>
                </div>

                <Calendar
                    className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 pointer-events-none text-gov-sand dark:text-gov-teal/50`}
                    size={20}
                />

                {open && !disabled && (
                    <div onClick={(e) => e.stopPropagation()} className={`absolute z-50 mt-1 ${isAr ? 'right-0' : 'left-0'} bg-white dark:bg-dm-surface border border-gov-gold/20 dark:border-gov-border/25 rounded-xl shadow-lg p-3 w-[280px]`}>
                        <div className="flex items-center justify-between mb-3">
                            <button type="button" onClick={prevMonth} className="p-1 rounded-lg hover:bg-gov-beige/30 dark:hover:bg-white/10 text-gov-charcoal dark:text-white transition-colors">
                                <ChevronUp size={18} />
                            </button>
                            <span className="text-sm font-bold text-gov-charcoal dark:text-white">
                                {months[viewMonth]} {isAr ? toArabicNumerals(viewYear) : viewYear}
                            </span>
                            <button type="button" onClick={nextMonth} className="p-1 rounded-lg hover:bg-gov-beige/30 dark:hover:bg-white/10 text-gov-charcoal dark:text-white transition-colors">
                                <ChevronDown size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 mb-1">
                            {days.map((d, i) => (
                                <div key={i} className="text-center text-xs font-medium text-gov-sand dark:text-gov-teal/60 py-1">
                                    {d}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7">
                            {calendarDays.map((cell, i) => {
                                const selected = isSelected(cell.day, cell.currentMonth);
                                const today = isDayToday(cell.day, cell.currentMonth);
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        disabled={cell.disabled || !cell.currentMonth}
                                        onClick={() => cell.currentMonth && !cell.disabled && selectDate(cell.day)}
                                        className={`
                                            w-9 h-9 text-xs rounded-lg flex items-center justify-center transition-colors
                                            ${!cell.currentMonth
                                                ? 'text-gov-sand/40 dark:text-white/20 cursor-default'
                                                : cell.disabled
                                                    ? 'text-gov-sand/40 dark:text-white/20 cursor-not-allowed'
                                                    : selected
                                                        ? 'bg-gov-forest dark:bg-gov-gold text-white dark:text-gov-charcoal font-bold'
                                                        : today
                                                            ? 'bg-gov-teal/10 dark:bg-gov-gold/10 text-gov-forest dark:text-gov-gold font-semibold ring-1 ring-gov-teal/30 dark:ring-gov-gold/30'
                                                            : 'text-gov-charcoal dark:text-white hover:bg-gov-beige/30 dark:hover:bg-white/10 cursor-pointer'
                                            }
                                        `}
                                    >
                                        {isAr ? toArabicNumerals(cell.day) : cell.day}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex justify-between mt-2 pt-2 border-t border-gov-gold/10 dark:border-gov-border/15">
                            <button type="button" onClick={handleClear} className="text-xs text-gov-teal dark:text-gov-gold hover:underline">
                                {isAr ? '\u0645\u0633\u062d' : 'Clear'}
                            </button>
                            <button type="button" onClick={handleToday} className="text-xs text-gov-teal dark:text-gov-gold hover:underline">
                                {isAr ? '\u0627\u0644\u064a\u0648\u0645' : 'Today'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {error && (
                <div className="min-h-[1.25rem] mt-1">
                    <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1 animate-fade-in">
                        {error}
                    </p>
                </div>
            )}
        </div>
    );
}
