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

  const lang = language as 'ar' | 'en';

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Tool Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleTool('proofread')}
          disabled={loading !== null}
          className="flex items-center gap-2 px-3 py-2 bg-gov-gold/10 text-gov-gold
            rounded-lg text-sm font-bold hover:bg-gov-gold/20 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'proofread' ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {labels.proofread[lang]}
        </button>

        <button
          type="button"
          onClick={() => handleTool('summarize')}
          disabled={loading !== null}
          className="flex items-center gap-2 px-3 py-2 bg-gov-teal/10 text-gov-teal
            rounded-lg text-sm font-bold hover:bg-gov-teal/20 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'summarize' ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
          {labels.summarize[lang]}
        </button>

        <button
          type="button"
          onClick={() => handleTool('title')}
          disabled={loading !== null}
          className="flex items-center gap-2 px-3 py-2 bg-gov-ocean/10 text-gov-ocean
            rounded-lg text-sm font-bold hover:bg-gov-ocean/20 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'title' ? <Loader2 size={16} className="animate-spin" /> : <Heading size={16} />}
          {labels.title[lang]}
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
            {labels[activeResult.type][lang]}
          </div>

          <div className="p-3 bg-white dark:bg-white/10 rounded-lg text-sm text-gov-charcoal dark:text-gray-200 whitespace-pre-wrap">
            {activeResult.result}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAccept}
              className="flex items-center gap-1 px-4 py-2 bg-gov-emerald text-white
                rounded-lg text-sm font-bold hover:bg-gov-teal transition-colors"
            >
              <Check size={16} />
              {language === 'ar' ? 'تطبيق' : 'Apply'}
            </button>
            <button
              type="button"
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
