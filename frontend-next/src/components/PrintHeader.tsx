'use client';

import React from 'react';

interface PrintHeaderProps {
  /** Document title shown in the header */
  documentTitle?: string;
  /** Reference/tracking number */
  referenceNumber?: string;
  /** Date string for the document */
  date?: string;
  /** Language direction */
  language?: 'ar' | 'en';
}

/**
 * PrintHeader – Official ministry header that only appears in print output.
 * Matches authority (هيئة) standards for government print documents.
 * Hidden on screen, visible only when printing via `hidden print:block`.
 */
const PrintHeader: React.FC<PrintHeaderProps> = ({
  documentTitle,
  referenceNumber,
  date,
  language = 'ar',
}) => {
  const isAr = language === 'ar';

  return (
    <div className="hidden print:block print-header" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top decorative gold line */}
      <div className="print-header-gold-line" />

      {/* Ministry Logo + Name row */}
      <div className="print-header-row">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/logo/logo-light.png"
          alt={isAr ? 'وزارة الاقتصاد والصناعة' : 'Ministry of Economy and Industry'}
          className="print-header-logo"
        />
        <div className="print-header-text">
          <p className="print-header-republic">
            {isAr ? 'الجمهورية العربية السورية' : 'Syrian Arab Republic'}
          </p>
          <h1 className="print-header-ministry">
            {isAr ? 'وزارة الاقتصاد والصناعة' : 'Ministry of Economy and Industry'}
          </h1>
          {documentTitle && (
            <p className="print-header-doctitle">{documentTitle}</p>
          )}
        </div>
      </div>

      {/* Reference + Date line */}
      {(referenceNumber || date) && (
        <div className="print-header-meta">
          {referenceNumber && (
            <span>
              {isAr ? 'رقم المرجع: ' : 'Ref: '}
              <strong>{referenceNumber}</strong>
            </span>
          )}
          {date && (
            <span>
              {isAr ? 'التاريخ: ' : 'Date: '}
              <strong>{date}</strong>
            </span>
          )}
        </div>
      )}

      {/* Bottom border */}
      <div className="print-header-separator" />
    </div>
  );
};

export default PrintHeader;
