'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import { FAQ } from '@/types';

const FALLBACK_FAQS: FAQ[] = [
  {
    id: '1',
    question_ar: "كيف يمكنني الحصول على ترخيص منشأة صناعية؟",
    answer_ar: "يمكنك التقدم بطلب ترخيص منشأة صناعية عبر قسم 'الإدارة العامة للصناعة' في البوابة. ستحتاج إلى تقديم دراسة جدوى ومخططات الموقع والوثائق القانونية للشركة.",
    question_en: "How can I obtain an industrial facility license?",
    answer_en: "You can apply through the 'General Administration for Industry' section. You will need to submit a feasibility study, site plans, and company legal documents."
  },
  {
    id: '2',
    question_ar: "هل يمكنني تقديم شكوى حماية مستهلك إلكترونياً؟",
    answer_ar: "نعم، يمكنك تقديم شكاوى الغش التجاري والمخالفات السعرية عبر قسم 'الإدارة العامة للتجارة الداخلية وحماية المستهلك'. يتم متابعة الشكوى خلال 48 ساعة.",
    question_en: "Can I file a consumer protection complaint electronically?",
    answer_en: "Yes, you can file commercial fraud and price violation complaints through the 'General Administration for Internal Trade and Consumer Protection'. Complaints are followed up within 48 hours."
  },
  {
    id: '3',
    question_ar: "كيف أحصل على إجازة استيراد أو تصدير؟",
    answer_ar: "يمكنك التقدم للحصول على إجازات الاستيراد والتصدير عبر 'الإدارة العامة للاقتصاد'. تتطلب العملية سجل تجاري ساري المفعول ووثائق البضاعة المراد استيرادها أو تصديرها.",
    question_en: "How do I get an import or export license?",
    answer_en: "You can apply through the 'General Administration for Economy'. The process requires a valid commercial registry and documentation of the goods to be imported or exported."
  },
  {
    id: '4',
    question_ar: "ما هي خدمات دعم المشاريع الصغيرة والمتوسطة؟",
    answer_ar: "توفر هيئة تنمية المشروعات الصغيرة والمتوسطة التابعة للإدارة العامة للاقتصاد برامج تمويل وتدريب ودعم فني للمشاريع الناشئة والقائمة.",
    question_en: "What SME support services are available?",
    answer_en: "The SME Development Authority under the General Administration for Economy provides financing, training, and technical support programs for startups and existing businesses."
  },
  {
    id: '5',
    question_ar: "كيف يمكنني تسجيل علامة تجارية؟",
    answer_ar: "يتم تسجيل وحماية العلامات التجارية عبر مديرية حماية الملكية في الإدارة العامة للتجارة الداخلية. يمكنك تقديم الطلب إلكترونياً مع صورة العلامة والمستندات المطلوبة.",
    question_en: "How can I register a trademark?",
    answer_en: "Trademarks are registered through the Property Protection Directorate in the General Administration for Internal Trade. You can submit an application electronically with the trademark image and required documents."
  }
];

const FAQSection: React.FC = () => {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await API.faqs.getAll();
        setFaqs(data.length > 0 ? data : FALLBACK_FAQS);
      } catch {
        setFaqs(FALLBACK_FAQS);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getQuestion = (faq: FAQ) => language === 'en' && faq.question_en ? faq.question_en : faq.question_ar;
  const getAnswer = (faq: FAQ) => language === 'en' && faq.answer_en ? faq.answer_en : faq.answer_ar;

  if (loading) {
    return (
      <section id="faq" className="py-20 bg-white dark:bg-gov-forest border-t border-gov-gold/10 dark:border-gov-gold/10 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 animate-pulse" />
            <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="faq" className="py-20 bg-white dark:bg-gov-forest border-t border-gov-gold/10 dark:border-gov-gold/10 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gov-gold/10 text-gov-gold text-xs font-bold mb-4">
            <HelpCircle size={14} />
            <span>{language === 'ar' ? 'مركز المساعدة' : 'Help Center'}</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-gov-charcoal dark:text-gov-gold mb-4">
            {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-gov-stone/60 dark:text-gray-300">
            {language === 'ar' ? 'إجابات على أكثر الاستفسارات شيوعاً حول الخدمات والبوابة.' : 'Answers to the most common questions about services and the portal.'}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === index
                ? 'bg-gov-beige/30 dark:bg-gov-brand border-gov-gold/50 shadow-md'
                : 'bg-white dark:bg-gov-emeraldStatic border-gov-gold/10 dark:border-white/10 hover:border-gov-gold/30'
                }`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-right font-display font-bold text-gov-forest dark:text-gov-gold hover:text-gov-teal dark:hover:text-white transition-colors"
              >
                <span>{getQuestion(faq)}</span>
                <ChevronDown
                  size={20}
                  className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-gov-gold' : 'text-gov-sand'}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="p-6 pt-0 text-sm text-gov-stone dark:text-gray-300 leading-relaxed border-t border-gov-gold/10 dark:border-white/10 mt-2">
                  {getAnswer(faq)}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQSection;
