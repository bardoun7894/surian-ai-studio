import React from 'react';
import { DIRECTORATES, KEY_SERVICES } from '../constants';
import { Building2, ArrowRight } from 'lucide-react';

const DirectoratesList: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
       <div className="text-center mb-12">
         <h2 className="text-3xl font-display font-bold text-gov-charcoal mb-4">دليل الجهات الحكومية</h2>
         <p className="text-gray-500 max-w-2xl mx-auto">تصفح كافة الوزارات والهيئات الحكومية والخدمات التي تقدمها.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {DIRECTORATES.map((dir) => {
             const dirServices = KEY_SERVICES.filter(s => s.directorateId === dir.id);
             return (
               <div key={dir.id} className="group bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:border-gov-emerald/30 transition-all duration-300">
                  <div className="flex items-start gap-6">
                     <div className="w-16 h-16 rounded-xl bg-gov-beige flex items-center justify-center text-gov-emerald group-hover:bg-gov-emerald group-hover:text-white transition-colors">
                        <Building2 size={32} />
                     </div>
                     <div className="flex-1">
                        <h3 className="text-xl font-bold text-gov-charcoal mb-2">{dir.name}</h3>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">{dir.description}</p>
                        
                        <div className="space-y-3">
                           <h4 className="text-xs font-bold text-gov-charcoal uppercase tracking-wider mb-3">أبرز الخدمات</h4>
                           {dirServices.length > 0 ? (
                             dirServices.map(service => (
                               <div key={service.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 group-hover:bg-white border border-transparent group-hover:border-gray-100 transition-colors">
                                 <span className="text-sm font-medium text-gray-700">{service.title}</span>
                                 {service.isDigital && <span className="w-2 h-2 rounded-full bg-green-500" title="خدمة رقمية"></span>}
                               </div>
                             ))
                           ) : (
                             <span className="text-sm text-gray-400 italic">لا توجد خدمات معروضة حالياً</span>
                           )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                           <button className="text-sm font-bold text-gov-emerald flex items-center gap-2 hover:gap-3 transition-all">
                             زيارة الصفحة
                             <ArrowRight size={16} />
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
             );
          })}
       </div>
    </div>
  );
};

export default DirectoratesList;