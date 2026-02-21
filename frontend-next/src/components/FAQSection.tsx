'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Loader2, MessageCircle, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import { FAQ } from '@/types';
import { SkeletonList, SkeletonText } from '@/components/SkeletonLoader';

const FALLBACK_FAQS: FAQ[] = [
  {
    id: '1',
    question_ar: "كيف يمكنني إنشاء حساب جديد على بوابة المواطن؟",
    answer_ar: "يمكنك إنشاء حساب جديد بالضغط على زر تسجيل الدخول في أعلى الصفحة واختيار 'إنشاء حساب'. قم بملء المعلومات المطلوبة بما في ذلك الرقم الوطني والبريد الإلكتروني ورقم الهاتف.",
    question_en: "How can I create a new account on the Citizen Portal?",
    answer_en: "You can create a new account by clicking the login button at the top of the page and selecting 'Create Account'. Fill in the required information including national ID, email, and phone number."
  },
  {
    id: '2',
    question_ar: "هل يمكنني تقديم شكوى دون الكشف عن هويتي؟",
    answer_ar: "نعم، يمكنك تقديم شكوى دون الكشف عن هويتك. سيتم التعامل مع شكواك بسرية تامة ولن يطلع عليه أحد.",
    question_en: "Can I file a complaint without revealing my identity?",
    answer_en: "Yes, you can file a complaint without revealing your identity. Your complaint will be handled with complete confidentiality and no one will see it."
  },
  {
    id: '3',
    question_ar: "كم تستغرق معالجة طلبات الخدمات الإلكترونية؟",
    answer_ar: "تستغرق معالجة الطلبات الإلكترونية عادةً من 3 إلى 7 أيام عمل حسب نوع الخدمة. يمكنك متابعة حالة طلبك من خلال لوحة التحكم الخاصة بك.",
    question_en: "How long does it take to process electronic service requests?",
    answer_en: "Electronic service requests typically take 3 to 7 business days depending on the service type. You can track your request status through your dashboard."
  },
  {
    id: '4',
    question_ar: "كيف يمكنني متابعة حالة شكواي؟",
    answer_ar: "يمكنك متابعة حالة شكواك من خلال إدخال رقم المتابعة في قسم 'متابعة الشكاوى' أو من خلال لوحة التحكم الخاصة بك إذا كنت قد سجلت الدخول.",
    question_en: "How can I track my complaint status?",
    answer_en: "You can track your complaint status by entering the tracking number in the 'Track Complaints' section or through your dashboard if you are logged in."
  },
  {
    id: '5',
    question_ar: "ما هي المستندات المطلوبة لتسجيل منشأة تجارية؟",
    answer_ar: "تتطلب عملية التسجيل: سجل تجاري ساري المفعول، هوية المالك أو المفوض، عقد إيجار أو سند ملكية للمقر، والتراخيص المهنية اللازمة حسب نوع النشاط.",
    question_en: "What documents are required to register a commercial establishment?",
    answer_en: "The registration process requires: valid commercial registry, owner or authorized person's ID, lease or ownership deed for the premises, and necessary professional licenses according to the activity type."
  },
  {
    id: '6',
    question_ar: "كيف يمكنني التواصل مع الدعم الفني؟",
    answer_ar: "يمكنك التواصل مع الدعم الفني عبر الخط الساخن 19999 على مدار الساعة، أو عبر البريد الإلكتروني info@moe.gov.sy، أو من خلال نموذج التواصل في قسم 'تواصل معنا'.",
    question_en: "How can I contact technical support?",
    answer_en: "You can contact technical support via the 24/7 hotline 19999, email info@moe.gov.sy, or through the contact form in the 'Contact Us' section."
  }
];

const FAQSection: React.FC = () => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');



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

  const filteredFaqs = faqs.filter(faq => {
    const query = searchQuery.toLowerCase();
    return getQuestion(faq).toLowerCase().includes(query) ||
      getAnswer(faq).toLowerCase().includes(query);
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  if (loading) {
    return (
      <section id="faq" className="py-24 bg-gov-beige/30 dark:bg-dm-bg scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SkeletonText lines={1} className="max-w-xs mx-auto mb-4" />
            <SkeletonText lines={1} className="max-w-sm mx-auto" />
          </div>
          <SkeletonList rows={5} className="space-y-3" />
        </div>
      </section>
    );
  }

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-gov-beige/30 dark:bg-dm-bg scroll-mt-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, #b9a779 0%, transparent 2%), 
                           radial-gradient(circle at 80% 80%, #094239 0%, transparent 2%)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-gov-gold/10 via-transparent to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-radial from-gov-teal/10 via-transparent to-transparent rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-0.5 bg-gradient-to-r from-transparent to-gov-gold"
            />
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
              className="w-3 h-3 rotate-45 bg-gov-gold"
            />
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-0.5 bg-gradient-to-l from-transparent to-gov-gold"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gov-gold/10 border border-gov-gold/30 text-gov-gold text-sm font-bold mb-4"
          >
            <HelpCircle size={18} />
            <span>{isAr ? 'مركز المساعدة' : 'Help Center'}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-display font-bold text-gov-forest dark:text-gov-gold mb-4"
          >
            {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gov-charcoal/70 dark:text-gov-gold/70 max-w-2xl mx-auto mb-8"
          >
            {isAr
              ? 'إجابات على أكثر الاستفسارات شيوعاً حول الخدمات والبوابة.'
              : 'Answers to the most common inquiries about services and the portal.'}
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="relative max-w-xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث في الأسئلة الشائعة...' : 'Search FAQs...'}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-dm-surface border border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-gold focus:ring-2 focus:ring-gov-gold/20 outline-none transition-all text-gov-forest dark:text-white placeholder:text-gray-400"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4 max-h-[600px] overflow-y-auto scroll-smooth"
        >
          <AnimatePresence mode="popLayout">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                variants={itemVariants}
                layout
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === index
                  ? 'bg-white dark:bg-white/10 border-gov-gold shadow-lg shadow-gov-gold/10'
                  : 'bg-white/80 dark:bg-white/5 border-gov-gold/10 dark:border-white/10 hover:border-gov-gold/30 hover:shadow-[5px_5px_10px_#b9a779]'
                  }`}
              >
                <motion.button
                  onClick={() => toggleFaq(index)}
                  whileHover={{ x: isAr ? -4 : 4 }}
                  className="w-full flex items-center justify-between p-6 text-right"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${openIndex === index ? 'bg-gov-gold text-gov-forest' : 'bg-gov-forest/10 dark:bg-gov-gold/20 text-gov-forest dark:text-gov-gold'}`}>
                      <MessageCircle size={20} />
                    </div>
                    <span className={`font-display font-bold text-lg transition-colors ${openIndex === index ? 'text-gov-forest dark:text-gov-gold' : 'text-gov-forest dark:text-white'}`}>
                      {getQuestion(faq)}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ml-4 ${openIndex === index ? 'bg-gov-gold/20 text-gov-gold' : 'bg-gray-100 dark:bg-white/10 text-gray-400'}`}
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <div className="border-t border-gov-gold/10 dark:border-gov-border/15 pt-4">
                          <p className="text-gov-charcoal/70 dark:text-white/70 leading-relaxed text-base">
                            {getAnswer(faq)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        {filteredFaqs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gov-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gov-gold" size={32} />
            </div>
            <p className="text-gov-charcoal/70 dark:text-white/70">
              {isAr ? 'لم يتم العثور على نتائج' : 'No results found'}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
