'use client';

import React, { useState, useEffect } from 'react';
import { Send, MapPin, Phone, Mail, Clock, Loader2, CheckCircle, User, Building2, Tag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import { Directorate } from '@/types';
import { getLocalizedName } from '@/lib/utils';

const ContactSection: React.FC = () => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [contactInfo, setContactInfo] = useState<Record<string, string>>({});

  useEffect(() => {
    API.directorates.getAll()
      .then(data => setDirectorates(data))
      .catch(err => console.error('Failed to load directorates:', err));
    API.settings.getByGroup('contact')
      .then(data => setContactInfo(data as Record<string, string>))
      .catch(() => { });
  }, []);

  const phone = contactInfo.contact_phone || '19999';
  const email = contactInfo.contact_email || 'info@moe.gov.sy';
  const address = isAr
    ? 'دمشق - الجمارك مقابل الأمن الجنائي'
    : (contactInfo.contact_address_en || 'Damascus - Customs, opposite Criminal Security');
  const workingHours = isAr
    ? (contactInfo.contact_working_hours_ar || 'الأحد - الخميس: 8:00 ص - 3:30 م')
    : (contactInfo.contact_working_hours_en || 'Sunday - Thursday: 8:00 AM - 3:30 PM');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    directorate: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.settings.submitContactForm({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        department: formData.directorate,
      });
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', directorate: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch {
      // Silently handle - the form UI will reset
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gov-beige dark:bg-dm-bg relative overflow-hidden scroll-mt-24" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold text-gov-charcoal dark:text-gov-teal mb-4">{t('contact_us_title')}</h2>
          <p className="text-gov-stone/60 dark:text-white/70 max-w-2xl mx-auto">
            {t('contact_us_description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Contact Info Card */}
          <div className="bg-gov-forest text-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl h-full flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gov-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">{t('contact_info_title')}</h3>
                <p className="text-white/70 leading-relaxed">
                  {t('contact_info_description')}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Phone className="text-gov-gold" size={24} />
                  </div>
                  <div>
                    <span className="block text-sm text-white/50 mb-1">{t('contact_hotline_label')}</span>
                    <span className="text-xl font-bold font-display">{phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Mail className="text-gov-gold" size={24} />
                  </div>
                  <div>
                    <span className="block text-sm text-white/50 mb-1">{t('contact_email_label')}</span>
                    <span className="text-lg">{email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="text-gov-gold" size={24} />
                  </div>
                  <div>
                    <span className="block text-sm text-white/50 mb-1">{t('contact_address_label')}</span>
                    <span className="text-lg">{address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Clock className="text-gov-gold" size={24} />
                  </div>
                  <div>
                    <span className="block text-sm text-white/50 mb-1">{t('contact_working_hours_label')}</span>
                    <span className="text-lg">{workingHours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Electronic Form */}
          <div className="bg-white dark:bg-dm-surface rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-gray-100 dark:border-gov-border/15 h-full">
            <h3 className="text-xl font-bold text-gov-charcoal dark:text-gov-teal mb-6">{t('contact_form_title')}</h3>

            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center py-10 animate-fade-in">
                <div className="w-20 h-20 bg-gov-teal/10 rounded-full flex items-center justify-center mb-6 text-gov-teal">
                  <CheckCircle size={40} />
                </div>
                <h4 className="text-xl font-bold text-gov-charcoal dark:text-gov-teal mb-2">{t('contact_form_success_title')}</h4>
                <p className="text-gov-stone/60 dark:text-gov-teal/60 text-center">{t('contact_form_success_message')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">{t('contact_form_name')}</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gov-beige/20 dark:bg-white/10 border border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-emerald outline-none transition-all text-gov-charcoal dark:text-white placeholder:text-gov-sand"
                      />
                      <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gov-sand dark:text-gov-teal/50" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">{t('contact_form_email')}</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gov-beige/20 dark:bg-white/10 border border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-emerald outline-none transition-all text-gov-charcoal dark:text-white placeholder:text-gov-sand"
                      />
                      <Mail className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gov-sand dark:text-gov-teal/50" size={18} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">{t('contact_form_subject')}</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gov-beige/20 dark:bg-white/10 border border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-emerald outline-none transition-all text-gov-charcoal dark:text-white placeholder:text-gov-sand"
                      />
                      <Tag className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gov-sand dark:text-gov-teal/50" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">{t('contact_form_department')}</label>
                    <div className="relative">
                      <select
                        value={formData.directorate}
                        onChange={(e) => setFormData({ ...formData, directorate: e.target.value })}
                        className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gov-beige/20 dark:bg-white/10 border border-gov-gold/20 dark:border-gov-border/25 focus:border-gov-emerald outline-none transition-all text-gov-charcoal dark:text-white appearance-none"
                      >
                        <option value="" className="bg-white text-gov-charcoal dark:bg-dm-surface dark:text-white">{t('contact_form_select_dept')}</option>
                        <option value="general" className="bg-white text-gov-charcoal dark:bg-dm-surface dark:text-white">{t('contact_form_general')}</option>
                        <option value="complaints" className="bg-white text-gov-charcoal dark:bg-dm-surface dark:text-white">{t('contact_form_complaints')}</option>
                        <option value="media" className="bg-white text-gov-charcoal dark:bg-dm-surface dark:text-white">{t('contact_form_media')}</option>
                        {directorates.map(d => (
                          <option key={d.id} value={d.id} className="bg-white text-gov-charcoal dark:bg-dm-surface dark:text-white">{getLocalizedName(d.name, language)}</option>
                        ))}
                      </select>
                      <Building2 className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gov-sand dark:text-gov-teal/50" size={18} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-2">{t('contact_form_message')}</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 rounded-xl bg-gov-beige/20 dark:bg-white/10 border border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-emerald outline-none transition-all resize-none text-gov-charcoal dark:text-white placeholder:text-gov-sand"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gov-teal text-white font-bold rounded-xl hover:bg-gov-emerald transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                  {isSubmitting ? t('contact_form_sending') : t('contact_form_submit')}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
