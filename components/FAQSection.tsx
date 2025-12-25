import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "كيف يمكنني إنشاء حساب جديد على بوابة المواطن؟",
      answer: "يمكنك إنشاء حساب جديد بالضغط على زر 'تسجيل الدخول' في أعلى الصفحة واختيار 'إنشاء حساب'. ستحتاج إلى رقمك الوطني ورقم هاتف فعال."
    },
    {
      question: "هل يمكنني تقديم شكوى دون الكشف عن هويتي؟",
      answer: "نعم، النظام يتيح تقديم الشكاوى بشكل سري، ولكن يفضل تزويدنا بمعلومات الاتصال لنتمكن من متابعة الحل معك."
    },
    {
      question: "كم تستغرق معالجة طلبات الخدمات الإلكترونية؟",
      answer: "تختلف المدة حسب نوع الخدمة، ولكن معظم الخدمات الإلكترونية الفورية (مثل استخراج البيانات) تتم خلال دقائق. المعاملات التي تتطلب تدقيقاً قد تستغرق من 1 إلى 3 أيام عمل."
    },
    {
      question: "ما هي الوثائق المطلوبة لتجديد جواز السفر؟",
      answer: "يتطلب تجديد جواز السفر: الهوية الشخصية، صورة شخصية حديثة، ودفع الرسوم الإلكترونية. يمكنك إتمام العملية كاملة عبر قسم 'وزارة الداخلية' في البوابة."
    },
    {
      question: "كيف يمكنني دفع الرسوم الحكومية؟",
      answer: "تدعم البوابة الدفع الإلكتروني عبر المصارف العامة والخاصة المرتبطة بشبكة المدفوعات الوطنية، بالإضافة إلى الدفع عبر شركات الهاتف المحمول."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white dark:bg-gov-forest border-t border-gray-100 dark:border-gov-gold/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gov-gold/10 text-gov-gold text-xs font-bold mb-4">
             <HelpCircle size={14} />
             <span>مركز المساعدة</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-4">الأسئلة الشائعة</h2>
          <p className="text-gray-500 dark:text-gray-400">إجابات على أكثر الاستفسارات شيوعاً حول الخدمات والبوابة.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                openIndex === index 
                ? 'bg-gov-beige/30 border-gov-gold/50 shadow-md' 
                : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 hover:border-gov-gold/30'
              }`}
            >
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-right font-bold text-gov-charcoal dark:text-white hover:text-gov-emerald dark:hover:text-gov-gold transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown 
                  size={20} 
                  className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-gov-gold' : 'text-gray-400'}`} 
                />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
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