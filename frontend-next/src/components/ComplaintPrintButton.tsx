'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { Printer } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface ComplaintPrintButtonProps {
  printTargetId: string;
  className?: string;
}

export const ComplaintPrintButton: React.FC<ComplaintPrintButtonProps> = ({
  printTargetId,
  className = ''
}) => {
  const { language } = useLanguage();
  const cleanupRef = useRef<(() => void) | null>(null);

  const clearPrintMode = useCallback(() => {
    const targetElement = document.querySelector('[data-complaint-print-target="true"]');
    if (targetElement) {
      targetElement.removeAttribute('data-complaint-print-target');
    }
    document.body.classList.remove('complaint-print-mode');
  }, []);

  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      clearPrintMode();
    };
  }, [clearPrintMode]);

  const handlePrint = () => {
    const targetElement = document.getElementById(printTargetId);
    if (!targetElement) {
      toast.error(
        language === 'ar' ? 'تعذر تجهيز الشكوى للطباعة' : 'Unable to prepare complaint for printing'
      );
      return;
    }

    clearPrintMode();
    targetElement.setAttribute('data-complaint-print-target', 'true');
    document.body.classList.add('complaint-print-mode');

    const handleAfterPrint = () => {
      clearPrintMode();
      window.removeEventListener('afterprint', handleAfterPrint);
      cleanupRef.current = null;
    };

    cleanupRef.current = () => {
      window.removeEventListener('afterprint', handleAfterPrint);
      clearPrintMode();
      cleanupRef.current = null;
    };

    window.addEventListener('afterprint', handleAfterPrint);

    window.requestAnimationFrame(() => {
      window.print();
    });
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className={`flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto text-center bg-gov-teal text-white font-bold rounded-xl
        hover:bg-gov-emerald transition-all ${className}`}
    >
      <Printer size={18} />
      {language === 'ar' ? 'طباعة الشكوى' : 'Print Complaint'}
    </button>
  );
};

export default ComplaintPrintButton;
