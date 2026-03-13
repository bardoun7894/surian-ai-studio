'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, MapPin, Phone, Mail, Clock, Loader2, CheckCircle, User, Building2, Tag, ArrowRight, MessageSquare, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import { Directorate } from '@/types';
import { getLocalizedName } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import { SkeletonList, SkeletonText } from '@/components/SkeletonLoader';

// ── Validation helpers ──────────────────────────────────────────────
interface FieldErrors {
  name?: string;
  email?: string;
  directorate?: string;
  subject?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateForm(
  data: { name: string; email: string; subject: string; directorate: string; message: string },
  isAr: boolean
): FieldErrors {
  const errors: FieldErrors = {};

  // Name: required, 2-100 chars
  if (!data.name.trim()) {
    errors.name = isAr ? 'الاسم مطلوب' : 'Name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = isAr ? 'الاسم يجب أن يكون حرفين على الأقل' : 'Name must be at least 2 characters';
  } else if (data.name.trim().length > 100) {
    errors.name = isAr ? 'الاسم يجب ألا يتجاوز 100 حرف' : 'Name must not exceed 100 characters';
  }

  // Email: required, valid format
  if (!data.email.trim()) {
    errors.email = isAr ? 'البريد الإلكتروني مطلوب' : 'Email is required';
  } else if (!EMAIL_RE.test(data.email.trim())) {
    errors.email = isAr ? 'صيغة البريد الإلكتروني غير صحيحة' : 'Invalid email format';
  }

  // Directorate: required
  if (!data.directorate) {
    errors.directorate = isAr ? 'يرجى اختيار الإدارة / الجهة' : 'Please select an administration';
  }

  // Subject: required, 3-255 chars
  if (!data.subject.trim()) {
    errors.subject = isAr ? 'عنوان الرسالة مطلوب' : 'Subject is required';
  } else if (data.subject.trim().length < 3) {
    errors.subject = isAr ? 'عنوان الرسالة يجب أن يكون 3 أحرف على الأقل' : 'Subject must be at least 3 characters';
  } else if (data.subject.trim().length > 255) {
    errors.subject = isAr ? 'عنوان الرسالة يجب ألا يتجاوز 255 حرف' : 'Subject must not exceed 255 characters';
  }

  // Message: required, 10-5000 chars
  if (!data.message.trim()) {
    errors.message = isAr ? 'نص الرسالة مطلوب' : 'Message is required';
  } else if (data.message.trim().length < 10) {
    errors.message = isAr ? 'الرسالة يجب أن تكون 10 أحرف على الأقل' : 'Message must be at least 10 characters';
  } else if (data.message.trim().length > 5000) {
    errors.message = isAr ? 'الرسالة يجب ألا تتجاوز 5000 حرف' : 'Message must not exceed 5000 characters';
  }

  return errors;
}

// ── Component ───────────────────────────────────────────────────────
interface ContactOverrides {
  phone?: string;
  email?: string;
  address?: string;
  workingHours?: string;
}

interface ContactSectionProps {
  contactOverrides?: ContactOverrides;
}

const ContactSection: React.FC<ContactSectionProps> = ({ contactOverrides }) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [contactInfo, setContactInfo] = useState<Record<string, string>>({});
  const [directorateEmails, setDirectorateEmails] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.directorates.getAll(),
      API.settings.getByGroup('contact'),
      API.settings.getByGroup('directorate_emails')
    ])
      .then(([directoratesData, contactData, emailsData]) => {
        setDirectorates(directoratesData);
        setContactInfo(contactData as Record<string, string>);
        if (emailsData && Object.keys(emailsData).length > 0) {
          setDirectorateEmails(emailsData as Record<string, string>);
        }
      })
      .catch(err => console.error('Failed to load contact data:', err))
      .finally(() => setLoading(false));
  }, []);

  const phone = contactOverrides?.phone || contactInfo.contact_phone || '19999';
  const defaultEmail = contactOverrides?.email || contactInfo.contact_email || 'info@moe.gov.sy';
  const address = contactOverrides?.address
    || (isAr
      ? (contactInfo.contact_address_ar || 'دمشق - الجمارك مقابل الأمن الجنائي')
      : (contactInfo.contact_address_en || 'Damascus - Customs, opposite Criminal Security'));
  const workingHours = contactOverrides?.workingHours
    || (isAr
      ? (contactInfo.contact_working_hours_ar || 'الأحد - الخميس: 8:00 ص - 3:30 م')
      : (contactInfo.contact_working_hours_en || 'Sunday - Thursday: 8:00 AM - 3:30 PM'));

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    directorate: '',
    subDirectorate: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Mark field as touched on blur
  const handleBlur = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  // Re-validate touched fields on every change
  useEffect(() => {
    const allErrors = validateForm(formData, isAr);
    // Only show errors for touched fields
    const visibleErrors: FieldErrors = {};
    for (const key of Object.keys(allErrors) as (keyof FieldErrors)[]) {
      if (touched[key]) {
        visibleErrors[key] = allErrors[key];
      }
    }
    setFieldErrors(visibleErrors);
  }, [formData, touched, isAr]);

  // Check if entire form is valid (for button disable)
  const isFormValid = useMemo(() => {
    const allErrors = validateForm(formData, isAr);
    return Object.keys(allErrors).length === 0;
  }, [formData, isAr]);

  const recipientEmail = useMemo(() => {
    if (!formData.directorate) return defaultEmail;
    if (['general', 'complaints', 'media'].includes(formData.directorate)) {
      return defaultEmail;
    }
    const selectedDirectorate = directorates.find(d => d.id === formData.directorate);
    return selectedDirectorate?.email || directorateEmails[formData.directorate] || defaultEmail;
  }, [formData.directorate, directorates, directorateEmails, defaultEmail]);

  const availableSubDirectorates = useMemo(() => {
    if (!formData.directorate) return [];
    if (formData.directorate === 'general') {
      return [];
    }
    const selected = directorates.find(d => d.id === formData.directorate);
    return selected?.subDirectorates || [];
  }, [formData.directorate, directorates]);

  const recipientName = useMemo(() => {
    if (!formData.directorate) return isAr ? 'الوزارة' : 'Ministry';
    if (formData.directorate === 'general') return isAr ? 'وزارة الاقتصاد والصناعة' : 'Ministry of Economy and Industry';

    const selectedDirectorate = directorates.find(d => d.id === formData.directorate);
    let name = selectedDirectorate ? getLocalizedName(selectedDirectorate.name, language) : (isAr ? 'الإدارة' : 'Administration');

    if (formData.subDirectorate) {
      const selectedDirSub = selectedDirectorate?.subDirectorates?.find(s => s.id === formData.subDirectorate);
      const childDir = directorates.find(d => d.id === formData.subDirectorate);

      const subName = selectedDirSub
        ? getLocalizedName(selectedDirSub.name, language)
        : (childDir ? getLocalizedName(childDir.name, language) : '');

      if (subName) {
        name += ` - ${subName}`;
      }
    }
    return name;
  }, [formData.directorate, formData.subDirectorate, directorates, language, isAr]);

  const handleDirectorateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, directorate: value, subDirectorate: '' });
    setTouched(prev => ({ ...prev, directorate: true }));
  };

  const handleSubDirectorateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, subDirectorate: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    // Touch all fields to show all errors
    setTouched({ name: true, email: true, directorate: true, subject: true, message: true });

    // Full validation
    const allErrors = validateForm(formData, isAr);
    if (Object.keys(allErrors).length > 0) {
      setFieldErrors(allErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await API.settings.submitContactForm({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.subDirectorate
          ? `${isAr ? 'المديرية: ' : 'Target Directorate: '}${recipientName}\n\n${formData.message}`
          : formData.message,
        department: formData.directorate,
      });
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', directorate: '', subDirectorate: '', message: '' });
      setTouched({});
      setFieldErrors({});
      setTimeout(() => setIsSuccess(false), 5000);
    } catch {
      setSubmitError(isAr ? 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.' : 'An error occurred while sending. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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

  const contactCards = [
    {
      icon: Phone,
      label: isAr ? 'الخط الساخن الموحد' : 'Unified Hotline',
      value: phone,
      href: `tel:${phone.replace(/\D/g, '')}`,
      color: 'from-gov-gold to-gov-sand',
      bgColor: 'bg-gov-gold/10 dark:bg-gov-gold/20',
    },
    {
      icon: Mail,
      label: isAr ? 'البريد الإلكتروني' : 'Email Address',
      value: defaultEmail,
      href: `mailto:${defaultEmail}`,
      color: 'from-gov-teal to-cyan-600',
      bgColor: 'bg-gov-teal/10 dark:bg-gov-teal/20',
    },
    {
      icon: MapPin,
      label: isAr ? 'المقر الرئيسي' : 'Headquarters',
      value: address,
      color: 'from-gov-forest to-gov-emerald',
      bgColor: 'bg-gov-forest/10 dark:bg-gov-forest/20',
    },
    {
      icon: Clock,
      label: isAr ? 'ساعات العمل' : 'Working Hours',
      value: workingHours,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    },
  ];

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-12 md:py-24 relative overflow-hidden bg-gov-beige dark:bg-dm-bg" id="contact">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <SkeletonText lines={1} className="max-w-xs mx-auto mb-6" />
            <SkeletonText lines={2} className="max-w-3xl mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
            <div className="space-y-4">
              <SkeletonList rows={4} />
            </div>
            <div className="space-y-4">
              <SkeletonText lines={6} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Filter main administrations (Featured + Fallback IDs)
  const mainAdministrations = directorates.filter(d => d.featured || ['d1', 'd2', 'd3'].includes(d.id));

  return (
    <section className="py-12 md:py-24 relative overflow-hidden bg-gov-beige dark:bg-dm-bg" id="contact">
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

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10 md:mb-16"
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

          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-block px-6 py-2 rounded-full bg-gov-gold/10 border border-gov-gold/30 text-gov-gold font-bold text-sm mb-4"
          >
            {isAr ? 'تواصل معنا' : 'Contact Us'}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-display font-bold text-gov-forest dark:text-gov-gold mb-6 leading-tight"
          >
            {isAr ? 'نحن هنا لخدمتك' : 'We Are Here to Serve You'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-gov-charcoal/70 dark:text-gov-gold/70 max-w-3xl mx-auto leading-relaxed"
          >
            {isAr
              ? 'يمكنك التواصل معنا عبر النموذج الإلكتروني الموحد أو عبر قنوات الاتصال الرسمية.'
              : 'You can contact us through the unified electronic form or through official communication channels.'}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
          {/* Contact Info Card */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div
              variants={itemVariants}
              className="bg-gov-forest dark:bg-gov-forest/90 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-gold-lg dark:shadow-none h-full"
            >
              {/* Background Effects */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gov-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gov-teal/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10">
                <motion.h3
                  variants={itemVariants}
                  className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-4"
                >
                  {isAr ? 'معلومات الاتصال' : 'Contact Information'}
                </motion.h3>
                <motion.p
                  variants={itemVariants}
                  className="text-white/70 leading-relaxed mb-8"
                >
                  {isAr
                    ? 'للاستفسارات العاجلة، يرجى الاتصال بمركز خدمة المواطن الموحد. فريقنا جاهز للرد على استفساراتكم على مدار الساعة.'
                    : 'For urgent inquiries, please contact the unified citizen service center. Our team is ready to respond to your inquiries 24/7.'}
                </motion.p>

                <div className="space-y-4">
                  {contactCards.map((card, idx) => (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ x: isAr ? -8 : 8, scale: 1.02 }}
                      className="group"
                    >
                      {card.href ? (
                        <a
                          href={card.href}
                          className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gov-gold/30 transition-all duration-300"
                        >
                          <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                            <card.icon className="text-gov-gold" size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block text-sm text-white/50 mb-1">{card.label}</span>
                            <span className="text-lg font-bold text-white hover:text-gov-gold transition-colors break-words">
                              {card.value}
                            </span>
                          </div>
                          <ArrowRight className="text-gov-gold/50 group-hover:text-gov-gold transition-colors rtl:rotate-180" size={20} />
                        </a>
                      ) : (
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                          <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center shrink-0`}>
                            <card.icon className="text-gov-gold" size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block text-sm text-white/50 mb-1">{card.label}</span>
                            <span className="text-lg font-bold text-white break-words">
                              {card.value}
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Electronic Form */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-dm-surface rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 shadow-gov dark:shadow-none border border-gov-gold/10 dark:border-gov-border/15 h-full"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gov-forest/10 dark:bg-gov-gold/20 flex items-center justify-center">
                  <MessageSquare className="text-gov-forest dark:text-gov-gold" size={24} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gov-forest dark:text-gov-gold">
                  {isAr ? 'نموذج المراسلة الإلكتروني' : 'Electronic Contact Form'}
                </h3>
              </div>

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center py-10"
                >
                  <div className="w-20 h-20 bg-gov-teal/10 rounded-full flex items-center justify-center mb-6 text-gov-teal">
                    <CheckCircle size={40} />
                  </div>
                  <h4 className="text-xl font-bold text-gov-charcoal dark:text-gov-gold mb-2">
                    {isAr ? 'تم الإرسال بنجاح' : 'Sent Successfully'}
                  </h4>
                  <p className="text-gov-stone/60 dark:text-gov-teal/60 text-center">
                    {isAr ? 'شكراً لتواصلك معنا. سنرد عليك في أقرب وقت.' : 'Thank you for contacting us. We will respond shortly.'}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* General submit error */}
                  {submitError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl text-sm">
                      {submitError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label={isAr ? 'الاسم الكامل' : 'Full Name'}
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onBlur={() => handleBlur('name')}
                      icon={User}
                      error={fieldErrors.name}
                      isValid={touched.name && !fieldErrors.name && formData.name.trim().length >= 2}
                      maxLength={100}
                      placeholder={isAr ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                    />
                    <Input
                      label={isAr ? 'البريد الإلكتروني' : 'Email Address'}
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onBlur={() => handleBlur('email')}
                      icon={Mail}
                      error={fieldErrors.email}
                      isValid={touched.email && !fieldErrors.email && EMAIL_RE.test(formData.email.trim())}
                      maxLength={255}
                      placeholder={isAr ? 'example@domain.com' : 'example@domain.com'}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Select
                      label={isAr ? 'الإدارة / الجهة' : 'Administration / Entity'}
                      required
                      value={formData.directorate}
                      onChange={handleDirectorateChange}
                      onBlur={() => handleBlur('directorate')}
                      icon={Building2}
                      error={fieldErrors.directorate}
                      isValid={touched.directorate && !fieldErrors.directorate && !!formData.directorate}
                      options={[
                        { value: '', label: isAr ? '-- اختر الإدارة / الجهة --' : '-- Select Administration --' },
                        { value: 'general', label: isAr ? 'وزارة الاقتصاد والصناعة' : 'Ministry of Economy and Industry' },
                        ...mainAdministrations.map(d => ({ value: d.id, label: getLocalizedName(d.name, language) }))
                      ]}
                    />

                    <Select
                      label={isAr ? 'المديرية' : 'Directorate'}
                      value={formData.subDirectorate}
                      onChange={handleSubDirectorateChange}
                      icon={Building2}
                      disabled={!availableSubDirectorates.length}
                      options={[
                        { value: '', label: isAr ? '-- اختر المديرية --' : '-- Select Directorate --' },
                        ...availableSubDirectorates.map(s => ({ value: s.id, label: getLocalizedName(s.name, language) }))
                      ]}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label={isAr ? 'عنوان الرسالة' : 'Message Subject'}
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      onBlur={() => handleBlur('subject')}
                      icon={Tag}
                      error={fieldErrors.subject}
                      isValid={touched.subject && !fieldErrors.subject && formData.subject.trim().length >= 3}
                      maxLength={255}
                      placeholder={isAr ? 'موضوع رسالتك' : 'Your message subject'}
                      className="md:col-span-2"
                    />
                  </div>

                  {/* Recipient Info - Shows when directorate is selected */}
                  {formData.directorate && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gov-forest/5 dark:bg-gov-teal/10 rounded-xl p-4 border border-gov-forest/10 dark:border-gov-teal/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gov-forest/10 dark:bg-gov-teal/20 flex items-center justify-center shrink-0">
                          <Mail className="text-gov-forest dark:text-gov-teal" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block text-xs text-gov-stone/60 dark:text-white/50 mb-0.5">
                            {isAr ? 'الجهة المستقبلة:' : 'Recipient:'}
                          </span>
                          <span className="block text-sm font-bold text-gov-forest dark:text-gov-gold truncate">
                            {recipientName}
                          </span>
                          <span className="block text-xs text-gov-stone/70 dark:text-white/60 font-mono truncate">
                            {recipientEmail}
                          </span>
                        </div>
                        <ArrowRight className="text-gov-forest/30 dark:text-white/20 shrink-0 rtl:rotate-180" size={20} />
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <Textarea
                      label={isAr ? 'نص الرسالة' : 'Message Content'}
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      onBlur={() => handleBlur('message')}
                      error={fieldErrors.message}
                      isValid={touched.message && !fieldErrors.message && formData.message.trim().length >= 10}
                      maxLength={5000}
                      placeholder={isAr ? 'اكتب رسالتك هنا (10 أحرف على الأقل)' : 'Write your message here (at least 10 characters)'}
                    />
                  </div>

                  <motion.button
                    whileHover={isFormValid && !isSubmitting ? { scale: 1.02, y: -2 } : {}}
                    whileTap={isFormValid && !isSubmitting ? { scale: 0.98 } : {}}
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className="w-full py-4 bg-gov-forest dark:bg-gov-button text-white font-bold rounded-xl hover:bg-gov-teal dark:hover:bg-gov-gold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} className="rtl:-scale-x-100" />}
                    {isSubmitting
                      ? (isAr ? 'جاري الإرسال...' : 'Sending...')
                      : (isAr ? 'إرسال الرسالة' : 'Send Message')
                    }
                  </motion.button>
                </form>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
