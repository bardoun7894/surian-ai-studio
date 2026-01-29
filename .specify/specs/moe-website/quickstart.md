# Quickstart: MOE Website - Final 2 Gaps

**Date**: 2026-01-26 | **Plan**: [plan.md](./plan.md)

## Prerequisites

All infrastructure is already in place:
- ✅ Laravel backend running
- ✅ Next.js frontend running
- ✅ FastAPI AI service accessible via `/ai/*` proxy
- ✅ PDF generation library installed (`barryvdh/laravel-dompdf`)

## Implementation Steps

### Step 1: Create ComplaintPrintButton Component (FR-28)

**File**: `frontend-next/src/components/ComplaintPrintButton.tsx`

```tsx
'use client';

import React, { useState } from 'react';
import { Printer, Loader2, Download } from 'lucide-react';
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
```

### Step 2: Add Print Button to ComplaintPortal (FR-28)

**File**: `frontend-next/src/components/ComplaintPortal.tsx`

Add import at top:
```tsx
import ComplaintPrintButton from './ComplaintPrintButton';
```

Add button after tracking result display (around line 662, after the responses section):
```tsx
{trackingResult && (
  <div className="mt-6 flex justify-center">
    <ComplaintPrintButton
      trackingNumber={trackingResult.tracking_number || trackingResult.id}
    />
  </div>
)}
```

### Step 3: Create AIContentTools Component (FR-14)

**File**: `frontend-next/src/components/AIContentTools.tsx`

```tsx
'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Heading,
  Loader2,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { aiService } from '@/lib/aiService';

interface AIContentToolsProps {
  content: string;
  onAcceptProofread?: (text: string) => void;
  onAcceptSummary?: (summary: string) => void;
  onAcceptTitle?: (title: string) => void;
  className?: string;
}

type ToolType = 'proofread' | 'summarize' | 'title';

export const AIContentTools: React.FC<AIContentToolsProps> = ({
  content,
  onAcceptProofread,
  onAcceptSummary,
  onAcceptTitle,
  className = ''
}) => {
  const { language } = useLanguage();
  const [activeResult, setActiveResult] = useState<{
    type: ToolType;
    result: string;
  } | null>(null);
  const [loading, setLoading] = useState<ToolType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const labels = {
    proofread: { ar: 'تدقيق لغوي', en: 'Proofread' },
    summarize: { ar: 'إنشاء ملخص', en: 'Summarize' },
    title: { ar: 'اقتراح عناوين', en: 'Suggest Titles' }
  };

  const minChars = {
    proofread: 10,
    summarize: 100,
    title: 50
  };

  const handleTool = async (type: ToolType) => {
    if (content.length < minChars[type]) {
      setError(language === 'ar'
        ? `يجب أن يحتوي النص على ${minChars[type]} حرف على الأقل`
        : `Content must be at least ${minChars[type]} characters`
      );
      return;
    }

    setLoading(type);
    setError(null);
    setActiveResult(null);

    try {
      let result: string;
      switch (type) {
        case 'proofread':
          result = await aiService.proofread(content);
          break;
        case 'summarize':
          result = await aiService.summarize(content);
          break;
        case 'title':
          result = await aiService.suggestTitle(content);
          break;
      }
      setActiveResult({ type, result });
    } catch (e) {
      setError(language === 'ar'
        ? 'فشل الاتصال بخدمة الذكاء الاصطناعي'
        : 'AI service connection failed'
      );
    } finally {
      setLoading(null);
    }
  };

  const handleAccept = () => {
    if (!activeResult) return;

    switch (activeResult.type) {
      case 'proofread':
        onAcceptProofread?.(activeResult.result);
        break;
      case 'summarize':
        onAcceptSummary?.(activeResult.result);
        break;
      case 'title':
        onAcceptTitle?.(activeResult.result);
        break;
    }
    setActiveResult(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Tool Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleTool('proofread')}
          disabled={loading !== null}
          className="flex items-center gap-2 px-3 py-2 bg-gov-gold/10 text-gov-gold
            rounded-lg text-sm font-bold hover:bg-gov-gold/20 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'proofread' ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {labels.proofread[language as 'ar' | 'en']}
        </button>

        <button
          onClick={() => handleTool('summarize')}
          disabled={loading !== null}
          className="flex items-center gap-2 px-3 py-2 bg-gov-teal/10 text-gov-teal
            rounded-lg text-sm font-bold hover:bg-gov-teal/20 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'summarize' ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
          {labels.summarize[language as 'ar' | 'en']}
        </button>

        <button
          onClick={() => handleTool('title')}
          disabled={loading !== null}
          className="flex items-center gap-2 px-3 py-2 bg-gov-ocean/10 text-gov-ocean
            rounded-lg text-sm font-bold hover:bg-gov-ocean/20 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'title' ? <Loader2 size={16} className="animate-spin" /> : <Heading size={16} />}
          {labels.title[language as 'ar' | 'en']}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20
          border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Result Panel */}
      {activeResult && (
        <div className="p-4 bg-gov-beige dark:bg-white/5 rounded-xl border border-gov-gold/20 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-gov-charcoal dark:text-white">
            <Sparkles size={16} className="text-gov-gold" />
            {language === 'ar' ? 'نتيجة ' : 'Result: '}
            {labels[activeResult.type][language as 'ar' | 'en']}
          </div>

          <div className="p-3 bg-white dark:bg-white/10 rounded-lg text-sm text-gov-charcoal dark:text-gray-200">
            {activeResult.result}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              className="flex items-center gap-1 px-4 py-2 bg-gov-emerald text-white
                rounded-lg text-sm font-bold hover:bg-gov-teal transition-colors"
            >
              <Check size={16} />
              {language === 'ar' ? 'تطبيق' : 'Apply'}
            </button>
            <button
              onClick={() => setActiveResult(null)}
              className="flex items-center gap-1 px-4 py-2 bg-gray-200 dark:bg-white/10
                text-gov-charcoal dark:text-white rounded-lg text-sm font-bold
                hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
            >
              <X size={16} />
              {language === 'ar' ? 'تجاهل' : 'Dismiss'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIContentTools;
```

### Step 4: Add AI Tools to Content Editor (FR-14)

**File**: `frontend-next/src/app/admin/content/page.tsx`

Add import:
```tsx
import AIContentTools from '@/components/AIContentTools';
```

Add below Arabic content textarea (around line 570):
```tsx
<AIContentTools
  content={formData.content_ar}
  onAcceptProofread={(text) => setFormData({ ...formData, content_ar: text })}
  onAcceptTitle={(title) => setFormData({ ...formData, title_ar: title })}
  onAcceptSummary={(summary) => {
    // Optionally show summary in alert or add to content
    alert(language === 'ar' ? `ملخص: ${summary}` : `Summary: ${summary}`);
  }}
/>
```

### Step 5: Add Print Action to Filament (Optional)

**File**: `backend/app/Filament/Resources/ComplaintResource.php`

Add to table actions:
```php
Tables\Actions\Action::make('print')
    ->label('طباعة')
    ->icon('heroicon-o-printer')
    ->color('success')
    ->url(fn ($record) => url("/api/v1/complaints/{$record->tracking_number}/pdf"))
    ->openUrlInNewTab(),
```

## Testing

1. **Print Button**:
   - Go to `/complaints/track`
   - Enter tracking number and verify
   - Click "طباعة الشكوى" button
   - PDF should download

2. **AI Tools**:
   - Go to `/admin/content`
   - Create new content or edit existing
   - Enter Arabic text (100+ chars)
   - Click each AI tool button
   - Verify results appear and "تطبيق" updates the form

## Complete

After implementing these steps, run the full test suite and verify all FR-28 and FR-14 requirements are satisfied.
