import React, { useState } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { API } from '@/lib/repository'; // Assuming we'll add snooze to repository later

interface SnoozeButtonProps {
    itemId: string;
    itemType: 'complaint' | 'suggestion' | 'faq-suggestion';
    onSnoozed?: () => void;
    currentSnoozeUntil?: string;
}

const SnoozeButton: React.FC<SnoozeButtonProps> = ({ itemId, itemType, onSnoozed, currentSnoozeUntil }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSnooze = async (hours: number) => {
        setLoading(true);
        try {
            // Mock API call for now, replacing with real API call later when backend ready (or use existing ID logic)
            // In a real scenario, this would call API.staff.snooze(itemId, itemType, hours)
            // Since user said "check just ui frontend", we will simulate this.

            console.log(`Snoozing ${itemType} ${itemId} for ${hours} hours`);

            // Simulating delay
            await new Promise(resolve => setTimeout(resolve, 500));

            setIsOpen(false);
            if (onSnoozed) onSnoozed();
        } catch (e) {
            console.error("Failed to snooze", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${currentSnoozeUntil
                    ? 'bg-gov-gold/10 text-gov-gold border-gov-gold/20 hover:bg-gov-gold/20'
                    : 'bg-white dark:bg-white/5 text-gov-stone dark:text-gov-beige border-gov-stone/20 dark:border-gov-gold/10 hover:border-gov-gold hover:text-gov-gold'
                    }`}
                title="تأجيل المعالجة (غياب مؤقت)"
            >
                <Clock size={14} />
                {currentSnoozeUntil ? 'مؤجل' : 'تأجيل'}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 animate-fade-in origin-top-left">
                        <div className="py-1" role="menu">
                            <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                <span className="text-xs font-bold text-gray-700">تأجيل لمدة...</span>
                            </div>
                            {[
                                { label: 'ساعة واحدة', value: 1 },
                                { label: '3 ساعات', value: 3 },
                                { label: '24 ساعة (غداً)', value: 24 },
                                { label: '48 ساعة', value: 48 },
                                { label: 'أسبوع', value: 168 },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleSnooze(option.value)}
                                    disabled={loading}
                                    className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gov-forest transition-colors flex items-center justify-between"
                                >
                                    <span>{option.label}</span>
                                    {loading && <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SnoozeButton;
