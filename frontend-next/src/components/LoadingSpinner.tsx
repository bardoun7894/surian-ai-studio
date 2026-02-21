import React, { useEffect, useRef } from 'react';
import { panEmblem } from '@/animations';
import { useLanguage } from '../contexts/LanguageContext';

interface LoadingSpinnerProps {
    size?: number;
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 48, className = '' }) => {
    const { t } = useLanguage();
    const spinnerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (spinnerRef.current) {
            panEmblem(spinnerRef.current);
        }
    }, []);

    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <div ref={spinnerRef} className="relative">
                <div className="absolute inset-0 rounded-full bg-gov-gold/10 dark:bg-gov-gold/20 blur-2xl animate-pulse" />
                <img
                    src="/assets/logo/11.png"
                    alt="Loading..."
                    style={{ width: size, height: size, objectFit: 'contain' }}
                    className="drop-shadow-md dark:drop-shadow-[0_0_15px_rgba(185,167,121,0.4)] relative z-10"
                />
            </div>
            <span className="text-xs font-display font-bold text-gov-forest/60 dark:text-gov-gold/80 tracking-widest uppercase">
                {t('ui_loading')}
            </span>
        </div>
    );
};

export default LoadingSpinner;
