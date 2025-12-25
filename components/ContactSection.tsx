import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail, Clock, Loader2, CheckCircle } from 'lucide-react';
import { DIRECTORATES } from '../constants';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    directorate: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', directorate: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <section className="py-20 bg-gov-beige dark:bg-gov-forest/5 relative overflow-hidden" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-4">تواصل معنا</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            نحن هنا لخدمتك. يمكنك التواصل معنا عبر النموذج الإلكتروني الموحد أو عبر قنوات الاتصال الرسمية.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Contact Info Card */}
          <div className="bg-gov-forest text-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
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
                         <span className="text-xl font-bold font-display">19999</span>
                      </div>
                   </div>

                   <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                         <Mail className="text-gov-gold" size={24} />
                      </div>
                      <div>
                         <span className="block text-sm text-white/50 mb-1">البريد الإلكتروني</span>
                         <span className="text-lg">info@egov.sy</span>
                      </div>
                   </div>

                   <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                         <MapPin className="text-gov-gold" size={24} />
                      </div>
                      <div>
                         <span className="block text-sm text-white/50 mb-1">المقر الرئيسي</span>
                         <span className="text-lg">دمشق - تنظيم كفرسوسة<br/>مبنى رئاسة مجلس الوزراء</span>
                      </div>
                   </div>

                   <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                         <Clock className="text-gov-gold" size={24} />
                      </div>
                      <div>
                         <span className="block text-sm text-white/50 mb-1">ساعات العمل</span>
                         <span className="text-lg">الأحد - الخميس: 8:00 ص - 3:30 م</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Electronic Form */}
          <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-gray-100 dark:border-gov-gold/10">
             <h3 className="text-xl font-bold text-gov-charcoal dark:text-white mb-6">نموذج المراسلة الإلكتروني</h3>
             
             {isSuccess ? (
               <div className="h-full flex flex-col items-center justify-center py-10 animate-fade-in">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                     <CheckCircle size={40} />
                  </div>
                  <h4 className="text-xl font-bold text-gov-charcoal dark:text-white mb-2">تم إرسال رسالتك بنجاح</h4>
                  <p className="text-gray-500 text-center">سيتم الرد على استفسارك خلال 24 ساعة عمل.</p>
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">الاسم الكامل</label>
                        <input 
                           type="text" 
                           required
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                           className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gov-gold/20 focus:border-gov-emerald outline-none transition-all"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">البريد الإلكتروني</label>
                        <input 
                           type="email" 
                           required
                           value={formData.email}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                           className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gov-gold/20 focus:border-gov-emerald outline-none transition-all"
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">عنوان الرسالة</label>
                        <input 
                           type="text" 
                           required
                           value={formData.subject}
                           onChange={(e) => setFormData({...formData, subject: e.target.value})}
                           className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gov-gold/20 focus:border-gov-emerald outline-none transition-all"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">الجهة المختصة</label>
                        <select 
                           value={formData.directorate}
                           onChange={(e) => setFormData({...formData, directorate: e.target.value})}
                           className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gov-gold/20 focus:border-gov-emerald outline-none transition-all text-gov-charcoal dark:text-white"
                        >
                           <option value="" className="bg-white text-gov-charcoal dark:bg-gov-emerald dark:text-white">-- اختر الجهة --</option>
                           <option value="general" className="bg-white text-gov-charcoal dark:bg-gov-emerald dark:text-white">الاستعلامات العامة</option>
                           <option value="complaints" className="bg-white text-gov-charcoal dark:bg-gov-emerald dark:text-white">مكتب الشكاوى</option>
                           <option value="media" className="bg-white text-gov-charcoal dark:bg-gov-emerald dark:text-white">المكتب الإعلامي</option>
                           {DIRECTORATES.map(d => (
                              <option key={d.id} value={d.id} className="bg-white text-gov-charcoal dark:bg-gov-emerald dark:text-white">{d.name}</option>
                           ))}
                        </select>
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">نص الرسالة</label>
                     <textarea 
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gov-gold/20 focus:border-gov-emerald outline-none transition-all resize-none"
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