'use client';

import React, { useState, useEffect } from 'react';
import { Send, MapPin, Phone, Mail, Clock, Loader2, CheckCircle, User, Building2, Tag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import { Directorate } from '@/types';
import { getLocalizedName } from '@/lib/utils';

const ContactSection: React.FC = () => {
  const { language } = useLanguage();
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [contactInfo, setContactInfo] = useState<Record<string, string>>({});

  useEffect(() => {
    API.directorates.getAll()
      .then(data => setDirectorates(data))
      .catch(err => console.error('Failed to load directorates:', err));
    API.settings.getByGroup('contact')
      .then(data => setContactInfo(data as Record<string, string>))
      .catch(() => {});
  }, []);

  const phone = contactInfo.contact_phone || '19999';
  const email = contactInfo.contact_email || 'info@moe.gov.sy';
  const addressAr = contactInfo.contact_address_ar || 'دمشق - ساحة المحافظة\nمبنى وزارة الاقتصاد والصناعة';
  const workingHoursAr = contactInfo.contact_working_hours_ar || 'الأحد - الخميس: 8:00 ص - 3:30 م';

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
    <section className="py-20 bg-gov-beige dark:bg-gov-forest/5 relative overflow-hidden scroll-mt-24" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-4">تواصل معنا</h2>
          <p className="text-gov-stone/60 dark:text-gov-beige/60 max-w-2xl mx-auto">
            نحن هنا لخدمتك. يمكنك التواصل معنا عبر النموذج الإلكتروني الموحد أو عبر قنوات الاتصال الرسمية.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Contact Info Card */}
          <div className="bg-gov-forest text-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl h-full flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gov-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">معلومات الاتصال</h3>
                <p className="text-white/70 leading-relaxed">
                  للاستفسارات العاجلة، يرجى الاتصال بمركز خدمة المواطن الموحد. فريقنا جاهز للرد على استفساراتكم على مدار الساعة.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Phone className="text-gov-gold" size={24} />
                  </div>
                  <div>
                    <span className="block text-sm text-white/50 mb-1">الخط الساخن الموحد</span>
                    <span className="text-xl font-bold font-display">{phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Mail className="text-gov-gold" size={24} />
                  </div>
                  <div>
                    <span className="block text-sm text-white/50 mb-1">البريد الإلكتروني</span>
                    <span className="text-lg">{email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="text-gov-gold" size={24} />
                  </div>
                  <div>
                    <span className="block text-sm text-white/50 mb-1">المقر الرئيسي</span>
                    <span className="text-lg">{addressAr}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Clock className="text-gov-gold" size={24} />
                  </div>
                  <div>
                    <span className="block text-sm text-white/50 mb-1">ساعات العمل</span>
                    <span className="text-lg">{workingHoursAr}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Electronic Form */}
          <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-gray-100 dark:border-gov-gold/10 h-full">
            <h3 className="text-xl font-bold text-gov-charcoal dark:text-white mb-6">نموذج المراسلة الإلكتروني</h3>

            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center py-10 animate-fade-in">
                <div className="w-20 h-20 bg-gov-teal/10 rounded-full flex items-center justify-center mb-6 text-gov-teal">
                  <CheckCircle size={40} />
                </div>
                <h4 className="text-xl font-bold text-gov-charcoal dark:text-white mb-2">تم إرسال رسالتك بنجاح</h4>
                <p className="text-gov-stone/60 dark:text-gov-beige/60 text-center">سيتم الرد على استفسارك خلال 24 ساعة عمل.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">الاسم الكامل</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gov-beige/20 dark:bg-black/20 border border-gov-gold/20 dark:border-gov-gold/10 focus:border-gov-emerald outline-none transition-all text-gov-charcoal dark:text-white placeholder:text-gov-sand"
                      />
                      <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gov-sand dark:text-gov-gold/50" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">البريد الإلكتروني</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gov-beige/20 dark:bg-black/20 border border-gov-gold/20 dark:border-gov-gold/10 focus:border-gov-emerald outline-none transition-all text-gov-charcoal dark:text-white placeholder:text-gov-sand"
                      />
                      <Mail className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gov-sand dark:text-gov-gold/50" size={18} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">عنوان الرسالة</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gov-beige/20 dark:bg-black/20 border border-gov-gold/20 dark:border-gov-gold/10 focus:border-gov-emerald outline-none transition-all text-gov-charcoal dark:text-white placeholder:text-gov-sand"
                      />
                      <Tag className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gov-sand dark:text-gov-gold/50" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">الجهة المختصة</label>
                    <div className="relative">
                      <select
                        value={formData.directorate}
                        onChange={(e) => setFormData({ ...formData, directorate: e.target.value })}
                        className="w-full py-3 px-4 pl-12 rtl:pl-4 rtl:pr-12 rounded-xl bg-gov-beige/20 dark:bg-black/20 border border-gov-gold/20 dark:border-gov-gold/20 focus:border-gov-emerald outline-none transition-all text-gov-charcoal dark:text-white appearance-none"
                      >
                        <option value="" className="bg-white text-gov-charcoal dark:bg-gov-emerald dark:text-white">-- اختر الجهة --</option>
                        <option value="general" className="bg-white text-gov-charcoal dark:bg-gov-emerald dark:text-white">الاستعلامات العامة</option>
                        <option value="complaints" className="bg-white text-gov-charcoal dark:bg-gov-emerald dark:text-white">مكتب الشكاوى</option>
                        <option value="media" className="bg-white text-gov-charcoal dark:bg-gov-emerald dark:text-white">المكتب الإعلامي</option>
                        {directorates.map(d => (
                          <option key={d.id} value={d.id} className="bg-white text-gov-charcoal dark:bg-gov-emerald dark:text-white">{getLocalizedName(d.name, language)}</option>
                        ))}
                      </select>
                      <Building2 className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gov-sand dark:text-gov-gold/50" size={18} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">نص الرسالة</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 rounded-xl bg-gov-beige/20 dark:bg-black/20 border border-gov-gold/20 dark:border-gov-gold/10 focus:border-gov-emerald outline-none transition-all resize-none text-gov-charcoal dark:text-white placeholder:text-gov-sand"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gov-teal text-white font-bold rounded-xl hover:bg-gov-emerald transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
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
