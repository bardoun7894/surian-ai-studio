'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  loading = false,
  loadingText,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const { language } = useLanguage();

  const baseStyles = 'relative inline-flex items-center justify-center font-bold transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-gov-teal text-white hover:bg-gov-emerald focus:ring-gov-teal shadow-lg hover:shadow-xl',
    secondary: 'bg-gov-gold text-gov-forest hover:bg-gov-sand focus:ring-gov-gold shadow-lg hover:shadow-xl',
    outline: 'border-2 border-gov-forest text-gov-forest hover:bg-gov-forest hover:text-white dark:border-gov-gold dark:text-gov-gold dark:hover:bg-gov-gold dark:hover:text-gov-forest focus:ring-gov-forest',
    ghost: 'text-gov-forest hover:bg-gov-forest/10 dark:text-gov-gold dark:hover:bg-gov-gold/10 focus:ring-gov-forest',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-3',
    lg: 'px-8 py-4 text-lg gap-3',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            {/* Mini Eagle Spinner */}
            <div className="relative w-5 h-5">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-white/30 border-t-white"
              />
              <Image
                src="/assets/logo/11.png"
                alt=""
                width={12}
                height={12}
                className="absolute inset-0 m-auto"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <span>{loadingText || (language === 'ar' ? 'جاري التحميل...' : 'Loading...')}</span>
          </motion.div>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export default LoadingButton;
