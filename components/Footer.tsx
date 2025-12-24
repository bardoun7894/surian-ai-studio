import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gov-charcoal text-white pt-16 pb-8 border-t-4 border-gov-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                   <ShieldCheck className="text-gov-gold" />
                </div>
                <span className="font-display font-bold text-xl">البوابة الحكومية</span>
             </div>
             <p className="text-gray-400 text-sm leading-relaxed">
               المنصة الرسمية الموحدة للخدمات الحكومية الرقمية. نعمل على مدار الساعة لخدمتكم وتسهيل معاملاتكم.
             </p>
          </div>

          <div>
             <h4 className="font-bold text-lg mb-6 text-gov-gold">روابط هامة</h4>
             <ul className="space-y-3 text-sm text-gray-300">
               <li><a href="#" className="hover:text-white transition-colors">عن المنصة</a></li>
               <li><a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a></li>
               <li><a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a></li>
               <li><a href="#" className="hover:text-white transition-colors">البيانات المفتوحة</a></li>
             </ul>
          </div>

          <div>
             <h4 className="font-bold text-lg mb-6 text-gov-gold">تواصل معنا</h4>
             <ul className="space-y-3 text-sm text-gray-300">
               <li>مركز الاتصال الوطني: 19999</li>
               <li>البريد الإلكتروني: support@gov.example</li>
               <li>أوقات العمل: الأحد - الخميس 8ص - 4م</li>
             </ul>
          </div>

          <div>
             <h4 className="font-bold text-lg mb-6 text-gov-gold">إمكانية الوصول</h4>
             <p className="text-sm text-gray-400 mb-4">
               هذا الموقع يدعم معايير الوصول العالمية WCAG 2.0 لضمان سهولة الاستخدام للجميع.
             </p>
             <div className="flex gap-2">
                <button className="px-3 py-1 bg-white/10 rounded hover:bg-white/20 text-xs">A+</button>
                <button className="px-3 py-1 bg-white/10 rounded hover:bg-white/20 text-xs">A-</button>
                <button className="px-3 py-1 bg-white/10 rounded hover:bg-white/20 text-xs">تباين عالي</button>
             </div>
          </div>

        </div>
        
        <div className="pt-8 border-t border-white/10 text-center">
           <p className="text-sm text-gray-500">&copy; 2024 البوابة الحكومية الرقمية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;