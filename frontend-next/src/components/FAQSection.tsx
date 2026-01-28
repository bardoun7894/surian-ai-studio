'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const FAQSection: React.FC = () => {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "كيف يمكنني الحصول على ترخيص منشأة صناعية؟",
      answer: "يمكنك التقدم بطلب ترخيص منشأة صناعية عبر قسم 'الإدارة العامة للصناعة' في البوابة. ستحتاج إلى تقديم دراسة جدوى ومخططات الموقع والوثائق القانونية للشركة."
    },
    {
      question: "هل يمكنني تقديم شكوى حماية مستهلك إلكترونياً؟",
      answer: "نعم، يمكنك تقديم شكاوى الغش التجاري والمخالفات السعرية عبر قسم 'الإدارة العامة للتجارة الداخلية وحماية المستهلك'. يتم متابعة الشكوى خلال 48 ساعة."
    },
    {
      question: "كيف أحصل على إجازة استيراد أو تصدير؟",
      answer: "يمكنك التقدم للحصول على إجازات الاستيراد والتصدير عبر 'الإدارة العامة للاقتصاد'. تتطلب العملية سجل تجاري ساري المفعول ووثائق البضاعة المراد استيرادها أو تصديرها."
    },
    {
      question: "ما هي خدمات دعم المشاريع الصغيرة والمتوسطة؟",
      answer: "توفر هيئة تنمية المشروعات الصغيرة والمتوسطة التابعة للإدارة العامة للاقتصاد برامج تمويل وتدريب ودعم فني للمشاريع الناشئة والقائمة."
    },
    {
      question: "كيف يمكنني تسجيل علامة تجارية؟",
      answer: "يتم تسجيل وحماية العلامات التجارية عبر مديرية حماية الملكية في الإدارة العامة للتجارة الداخلية. يمكنك تقديم الطلب إلكترونياً مع صورة العلامة والمستندات المطلوبة."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white dark:bg-gov-forest border-t border-gov-gold/10 dark:border-gov-gold/10 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gov-gold/10 text-gov-gold text-xs font-bold mb-4">
            <HelpCircle size={14} />
            <span>مركز المساعدة</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-4">الأسئلة الشائعة</h2>
          <p className="text-gov-stone/60 dark:text-gov-beige/60">إجابات على أكثر الاستفسارات شيوعاً حول الخدمات والبوابة.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === index
                ? 'bg-gov-beige/30 dark:bg-white/10 border-gov-gold/50 shadow-md'
                : 'bg-white dark:bg-white/5 border-gov-gold/10 dark:border-white/10 hover:border-gov-gold/30'
                }`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-right font-display font-bold text-gov-forest dark:text-white hover:text-gov-teal dark:hover:text-gov-gold transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-gov-gold' : 'text-gov-sand'}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="p-6 pt-0 text-sm text-gov-stone dark:text-gov-beige/80 leading-relaxed border-t border-gov-gold/10 dark:border-white/10 mt-2">
                  {faq.answer}
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
