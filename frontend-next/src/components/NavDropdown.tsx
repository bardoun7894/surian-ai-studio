import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavDropdownProps {
    label: string;
    items: {
        label: string;
        href: string;
        icon?: React.ElementType;
    }[];
}

const NavDropdown: React.FC<NavDropdownProps> = ({ label, items }) => {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { language } = useLanguage();

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 200);
    };

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 ${isOpen ? 'bg-white/10 text-white' : ''}`}
                aria-expanded={isOpen}
            >
                <span>{label}</span>
                <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute top-full mt-2 w-64 bg-white dark:bg-dm-surface rounded-xl shadow-2xl border border-gov-gold/20 dark:border-dm-border py-2 z-50 start-0`}
                    >
                        {items.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gov-charcoal dark:text-white hover:bg-gov-beige/50 dark:hover:bg-white/10 transition-colors border-b last:border-0 border-gray-100 dark:border-white/5"
                                >
                                    {Icon && <Icon size={16} className="text-gov-gold flex-shrink-0" />}
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NavDropdown;
