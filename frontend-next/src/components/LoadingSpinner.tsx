import React, { useEffect, useRef } from 'react';
import { rotateEmblem } from '@/animations';
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
            rotateEmblem(spinnerRef.current);
        }
    }, []);

    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <div ref={spinnerRef} className="relative">
                <img
                    src="/assets/logo/Asset-14@3x.png"
                    alt="Loading..."
                    style={{ width: size, height: size }}
                    className="drop-shadow-md"
                />
                <div
                    className="absolute inset-[-4px] rounded-full border-2 border-gov-gold/30 border-t-gov-gold animate-spin"
                    style={{ animationDuration: '3s' }}
                />
            </div>
            <span className="text-xs font-display font-bold text-gov-forest/60 dark:text-gov-gold/60 tracking-widest uppercase">
                {t('ui_loading')}
            </span>
        </div>
    );
};

export default LoadingSpinner;
