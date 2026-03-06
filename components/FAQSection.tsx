import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';

const FAQSection: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: t('faq_q1'),
      answer: t('faq_a1')
    },
    {
      question: t('faq_q2'),
      answer: t('faq_a2')
    },
    {
      question: t('faq_q3'),
      answer: t('faq_a3')
    },
    {
      question: t('faq_q4'),
      answer: t('faq_a4')
    },
    {
      question: t('faq_q5'),
      answer: t('faq_a5')
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white dark:bg-gov-forest border-t border-gov-gold/10 dark:border-gov-gold/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gov-gold/10 text-gov-gold text-xs font-bold mb-4">
            <HelpCircle size={14} />
            <span>{t('faq_center')}</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-4">{t('faq_title')}</h2>
          <p className="text-gray-500 dark:text-gray-400">{t('faq_subtitle')}</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === index
                ? 'bg-gov-beige/30 border-gov-gold/50 shadow-md'
                : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 hover:border-gov-gold/30'
                }`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-right font-display font-bold text-gov-forest dark:text-white hover:text-gov-teal dark:hover:text-gov-gold transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-gov-gold' : 'text-gray-400'}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="p-6 pt-0 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-200/50 dark:border-white/10 mt-2">
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