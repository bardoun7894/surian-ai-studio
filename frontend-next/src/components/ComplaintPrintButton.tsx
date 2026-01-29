'use client';

import React, { useState } from 'react';
import { Printer, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface ComplaintPrintButtonProps {
  trackingNumber: string;
  className?: string;
}

export const ComplaintPrintButton: React.FC<ComplaintPrintButtonProps> = ({
  trackingNumber,
  className = ''
}) => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const handlePrint = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/complaints/${trackingNumber}/pdf`);

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `complaint_${trackingNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(
        language === 'ar' ? 'تم تحميل الملف بنجاح' : 'File downloaded successfully'
      );
    } catch (error) {
      toast.error(
        language === 'ar' ? 'فشل تحميل الملف' : 'Failed to download file'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePrint}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 bg-gov-teal text-white font-bold rounded-xl
        hover:bg-gov-emerald transition-all disabled:opacity-50 ${className}`}
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Printer size={18} />
      )}
      {language === 'ar' ? 'طباعة الشكوى' : 'Print Complaint'}
    </button>
  );
};

export default ComplaintPrintButton;
