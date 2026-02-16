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
      isRTL ? 'ar-SY' : 'en-US',
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
          body {
            font-family: 'Cairo', Arial, sans-serif;
            line-height: 1.6;
            color: #161616;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 3px solid #b9a779;
            margin-bottom: 30px;
          }
          .logo-area {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
          }
          h1 {
            color: #002623;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          .date {
            color: #b9a779;
            font-size: 14px;
          }
          .content {
            font-size: 16px;
            line-height: 1.8;
            color: #3d3a3b;
            white-space: pre-wrap;
          }
          .expiry {
            margin-top: 30px;
            padding: 15px;
            background: #f5f5f0;
            border-radius: 8px;
            text-align: center;
            font-size: 14px;
            color: #666;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #edebe0;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-area">
            ${isRTL ? 'وزارة الاقتصاد والصناعة' : 'Ministry of Economy and Industry'}
          </div>
          <h1>${title}</h1>
          ${date ? `<div class="date">${date}</div>` : ''}
        </div>
        <div class="content">${description}</div>
        <div class="footer">
          <p>${isRTL ? 'تم إنشاء هذا المستند من موقع الوزارة الإلكتروني' : 'This document was generated from the Ministry website'}</p>
          <p>${window.location.origin}/announcements/${announcement.id}</p>
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
