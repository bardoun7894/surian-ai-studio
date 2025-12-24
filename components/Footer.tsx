import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gov-emerald text-white pt-16 pb-8 border-t-4 border-gov-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center gap-3 mb-6">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Coat_of_arms_of_Syria.svg/200px-Coat_of_arms_of_Syria.svg.png" 
                  alt="شعار الجمهورية العربية السورية" 
                  className="h-16 w-auto brightness-0 invert opacity-100"
                />
                <div className="flex flex-col">
                   <span className="font-display font-bold text-lg text-white">الجمهورية العربية السورية</span>
                   <span className="text-xs text-gov-gold tracking-wider font-sans uppercase">Syrian Arab Republic</span>
                </div>
             </div>
             <p className="text-white/70 text-sm leading-relaxed">
               المنصة الرسمية الموحدة للخدمات الحكومية الرقمية. بوابة المستقبل نحو سوريا الحديثة.
             </p>
          </div>

          <div>
             <h4 className="font-bold text-lg mb-6 text-gov-gold">روابط هامة</h4>
             <ul className="space-y-3 text-sm text-white/80">
               <li><a href="#" className="hover:text-gov-gold transition-colors">عن البوابة</a></li>
               <li><a href="#" className="hover:text-gov-gold transition-colors">سياسة الخصوصية</a></li>
               <li><a href="#" className="hover:text-gov-gold transition-colors">شروط الاستخدام</a></li>
               <li><a href="#" className="hover:text-gov-gold transition-colors">البيانات المفتوحة</a></li>
             </ul>
          </div>

          <div>
             <h4 className="font-bold text-lg mb-6 text-gov-gold">تواصل معنا</h4>
             <ul className="space-y-3 text-sm text-white/80">
               <li>مركز الاتصال الوطني: 19999</li>
               <li>البريد الإلكتروني: info@egov.sy</li>
               <li>أوقات العمل: الأحد - الخميس 8ص - 3م</li>
             </ul>
          </div>

          <div>
             <h4 className="font-bold text-lg mb-6 text-gov-gold">إمكانية الوصول</h4>
             <p className="text-sm text-white/70 mb-4">
               هذا الموقع يدعم معايير الوصول العالمية WCAG 2.0.
             </p>
             <div className="flex gap-2">
                <button className="px-3 py-1 bg-white/10 rounded hover:bg-gov-gold hover:text-gov-emerald transition-colors text-xs border border-white/10">A+</button>
                <button className="px-3 py-1 bg-white/10 rounded hover:bg-gov-gold hover:text-gov-emerald transition-colors text-xs border border-white/10">A-</button>
                <button className="px-3 py-1 bg-white/10 rounded hover:bg-gov-gold hover:text-gov-emerald transition-colors text-xs border border-white/10">عالي التباين</button>
             </div>
          </div>

        </div>
        
        <div className="pt-8 border-t border-white/10 text-center flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-sm text-white/60">&copy; 2024 الجمهورية العربية السورية. جميع الحقوق محفوظة.</p>
           <div className="flex items-center gap-2 text-white/40 text-xs">
              <span>تطوير الفريق الوطني للتحول الرقمي</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;