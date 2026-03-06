'use client';

import React from 'react';

interface PrintFooterProps {
  language?: 'ar' | 'en';
}

/**
 * PrintFooter – Official ministry footer for print output only.
 * Shows website URL and copyright. Hidden on screen.
 */
const PrintFooter: React.FC<PrintFooterProps> = ({ language = 'ar' }) => {
  const isAr = language === 'ar';

  return (
    <div className="hidden print:block print-footer" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="print-footer-separator" />
      <div className="print-footer-content">
        <span>
          {isAr
            ? 'تم إنشاء هذا المستند من البوابة الإلكترونية لوزارة الاقتصاد والصناعة'
            : 'This document was generated from the Ministry of Economy and Industry E-Portal'}
        </span>
        <span className="print-footer-url">www.moe.gov.sy</span>
      </div>
      <p className="print-footer-copyright">
        {isAr
          ? '© 2026 وزارة الاقتصاد والصناعة - جميع الحقوق محفوظة'
          : '© 2026 Ministry of Economy and Industry - All Rights Reserved'}
      </p>
    </div>
  );
};

export default PrintFooter;
