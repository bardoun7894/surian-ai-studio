'use client';

import Image from 'next/image';

interface BrandedLoaderProps {
    size?: number;
    text?: string;
}

export default function BrandedLoader({ size = 80, text }: BrandedLoaderProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <div className="absolute inset-0 bg-gov-gold/20 rounded-full blur-xl animate-pulse" />
                <Image
                    src="/assets/logo/11.png"
                    alt="Loading"
                    width={size}
                    height={size}
                    className="relative z-10 animate-pulse drop-shadow-lg"
                    style={{ width: 'auto', height: 'auto' }}
                />
            </div>
            {text && (
                <p className="text-sm text-gov-charcoal dark:text-white/70 animate-pulse">{text}</p>
            )}
            <div className="flex gap-1">
                <div className="w-2 h-2 bg-gov-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gov-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gov-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );
}
