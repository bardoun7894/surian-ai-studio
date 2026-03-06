'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Download, FileText, Paperclip, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DownloadMenuProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: {
    id: string;
    title: string;
    description?: string;
    date?: string;
    attachments?: Array<{ name: string; url: string }>;
  } | null;
}

export default function DownloadMenu({ isOpen, onClose, announcement }: DownloadMenuProps) {
  const { language, t } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleDownloadPDF = () => {
    if (!announcement) return;
    setIsPrinting(true);

    // Create a print-friendly window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      // Fallback to window.print() if popup blocked
      window.print();
      setIsPrinting(false);
      onClose();
      return;
    }

    const isRTL = language === 'ar';
    const title = announcement.title;
    const description = announcement.description || '';
    const date = announcement.date ? new Date(announcement.date).toLocaleDateString(
      isRTL ? 'ar-u-nu-latn' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    ) : '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="${isRTL ? 'rtl' : 'ltr'}" lang="${isRTL ? 'ar' : 'en'}">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          @page {
            size: A4;
            margin: 15mm 18mm 20mm 18mm;
          }
          body {
            font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
            line-height: 1.7;
            color: #161616;
            padding: 0;
            max-width: 100%;
            margin: 0;
          }
          /* --- Official Header --- */
          .header-gold-line {
            height: 3px;
            background: #b9a779;
            margin-bottom: 16px;
          }
          .header-row {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 12px;
          }
          .header-logo {
            width: 70px;
            height: auto;
            object-fit: contain;
          }
          .header-text {
            flex: 1;
          }
          .header-republic {
            font-size: 11px;
            color: #666;
            margin: 0;
            line-height: 1.4;
          }
          .header-ministry {
            font-size: 18px;
            font-weight: 700;
            color: #094239;
            margin: 2px 0;
            line-height: 1.3;
          }
          .header-doctype {
            font-size: 12px;
            color: #b9a779;
            font-weight: 600;
            margin: 2px 0 0;
          }
          .header-separator {
            height: 2px;
            background: linear-gradient(to ${isRTL ? 'left' : 'right'}, #094239, #b9a779);
            margin: 12px 0 24px;
          }
          /* --- Content --- */
          h1 {
            color: #094239;
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 8px;
            line-height: 1.4;
          }
          .meta-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e5e5e0;
          }
          .date {
            color: #b9a779;
            font-size: 13px;
            font-weight: 600;
          }
          .content {
            font-size: 14px;
            line-height: 1.85;
            color: #2d2d2d;
            white-space: pre-wrap;
          }
          /* --- Footer --- */
          .footer {
            margin-top: 40px;
            padding-top: 16px;
            border-top: 0.75px solid #d0d0d0;
          }
          .footer-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 10px;
            color: #888;
          }
          .footer-url {
            font-weight: 600;
            color: #094239;
            direction: ltr;
          }
          .footer-copyright {
            text-align: center;
            font-size: 9px;
            color: #aaa;
            margin-top: 6px;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <!-- Official Header -->
        <div class="header-gold-line"></div>
        <div class="header-row">
          <img src="${window.location.origin}/assets/logo/logo-light.png" alt="Logo" class="header-logo" />
          <div class="header-text">
            <p class="header-republic">${isRTL ? 'الجمهورية العربية السورية' : 'Syrian Arab Republic'}</p>
            <p class="header-ministry">${isRTL ? 'وزارة الاقتصاد والصناعة' : 'Ministry of Economy and Industry'}</p>
            <p class="header-doctype">${isRTL ? 'إعلان رسمي' : 'Official Announcement'}</p>
          </div>
        </div>
        <div class="header-separator"></div>

        <!-- Content -->
        <h1>${title}</h1>
        <div class="meta-row">
          ${date ? `<div class="date">${date}</div>` : '<div></div>'}
        </div>
        <div class="content">${description}</div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-row">
            <span>${isRTL ? 'تم إنشاء هذا المستند من البوابة الإلكترونية لوزارة الاقتصاد والصناعة' : 'Generated from the Ministry of Economy and Industry E-Portal'}</span>
            <span class="footer-url">www.moe.gov.sy</span>
          </div>
          <p class="footer-copyright">${isRTL ? '© 2026 وزارة الاقتصاد والصناعة - جميع الحقوق محفوظة' : '© 2026 Ministry of Economy and Industry - All Rights Reserved'}</p>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
    setIsPrinting(false);
    onClose();
  };

  const handleDownloadAttachments = () => {
    if (!announcement?.attachments || announcement.attachments.length === 0) return;
    
    // Download each attachment
    announcement.attachments.forEach((attachment) => {
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
    onClose();
  };

  const attachmentCount = announcement?.attachments?.length || 0;
  const isRTL = language === 'ar';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        ref={menuRef}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="absolute z-10 bg-white dark:bg-dm-surface rounded-xl shadow-lg border border-gov-gold/20 p-2 min-w-[200px]"
      >
        {/* Download options */}
        <div className="space-y-1">
          {/* PDF Download */}
          <button
            onClick={handleDownloadPDF}
            disabled={isPrinting}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gov-gold/10 rounded-lg text-gov-charcoal dark:text-white transition-colors text-right"
          >
            <FileText size={18} className="text-gov-forest dark:text-gov-teal shrink-0" />
            <span className="text-sm">
              {isRTL ? '📄 تحميل PDF' : '📄 Download PDF'}
            </span>
          </button>

          {/* Attachments */}
          <button
            onClick={handleDownloadAttachments}
            disabled={attachmentCount === 0}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-right transition-colors ${
              attachmentCount > 0
                ? 'hover:bg-gov-gold/10 text-gov-charcoal dark:text-white'
                : 'opacity-50 cursor-not-allowed text-gray-400'
            }`}
          >
            <Paperclip size={18} className={`shrink-0 ${attachmentCount > 0 ? 'text-gov-forest dark:text-gov-teal' : 'text-gray-400'}`} />
            <span className="text-sm">
              {isRTL 
                ? `📎 الملفات المرفقة (${attachmentCount})`
                : `📎 Attachments (${attachmentCount})`
              }
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
