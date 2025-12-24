import React, { useState } from 'react';
import { DIRECTORATES, KEY_SERVICES } from '../constants';
import { 
  Building2, 
  ArrowRight, 
  Search,
  ShieldAlert,
  Scale,
  HeartPulse,
  BookOpen,
  GraduationCap,
  Zap,
  Droplets,
  Plane,
  Wifi,
  Banknote,
  Map,
  Factory,
  Landmark,
  LayoutGrid,
  ChevronLeft
} from 'lucide-react';

interface DirectoratesListProps {
  onSelectDirectorate?: (id: string) => void;
  variant?: 'full' | 'compact';
  onViewAll?: () => void;
}

const DirectoratesList: React.FC<DirectoratesListProps> = ({ 
  onSelectDirectorate, 
  variant = 'full',
  onViewAll 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Icon mapping helper
  const getIcon = (iconName: string) => {
    const props = { size: 32 };
    switch (iconName) {
      case 'ShieldAlert': return <ShieldAlert {...props} />;
      case 'Scale': return <Scale {...props} />;
      case 'HeartPulse': return <HeartPulse {...props} />;
      case 'BookOpen': return <BookOpen {...props} />;
      case 'GraduationCap': return <GraduationCap {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Droplets': return <Droplets {...props} />;
      case 'Plane': return <Plane {...props} />;
      case 'Wifi': return <Wifi {...props} />;
      case 'Banknote': return <Banknote {...props} />;
      case 'Map': return <Map {...props} />;
      case 'Factory': return <Factory {...props} />;
      default: return <Landmark {...props} />;
    }
  };

  const filteredDirectorates = variant === 'full' 
    ? DIRECTORATES.filter(dir => dir.name.includes(searchTerm) || dir.description.includes(searchTerm))
    : DIRECTORATES.slice(0, 6); // Show only top 6 in compact mode

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${variant === 'full' ? 'py-16 min-h-screen' : 'py-12'}`}>
       
       <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
         <div className={`text-center ${variant === 'full' ? 'md:text-right' : 'md:text-center w-full'}`}>
            <h2 className={`text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-2 flex items-center gap-3 justify-center ${variant === 'full' ? 'md:justify-start' : ''}`}>
               <LayoutGrid className="text-gov-teal dark:text-gov-gold" />
               {variant === 'full' ? 'دليل الجهات الحكومية' : 'الوصول السريع للجهات'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {variant === 'full' 
                ? 'تصفح الدليل الشامل للوزارات والهيئات الحكومية والخدمات الرقمية.' 
                : 'أكثر الجهات الحكومية طلباً وخدماتها الرقمية.'}
            </p>
         </div>

         {/* Search Bar - Only in Full Mode */}
         {variant === 'full' && (
           <div className="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="بحث عن وزارة أو هيئة..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-gov-emerald/10 border border-gray-200 dark:border-gov-gold/20 text-gov-charcoal dark:text-white focus:border-gov-teal dark:focus:border-gov-gold focus:ring-1 focus:ring-gov-teal/20 transition-all outline-none"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
           </div>
         )}
       </div>

       {filteredDirectorates.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
             <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
             <p className="text-gray-500 font-bold">لا توجد نتائج مطابقة لبحثك</p>
             <button onClick={() => setSearchTerm('')} className="mt-2 text-gov-teal dark:text-gov-gold underline text-sm">عرض الكل</button>
          </div>
       ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDirectorates.map((dir) => {
                const dirServices = KEY_SERVICES.filter(s => s.directorateId === dir.id);
                return (
                  <div key={dir.id} className="group flex flex-col h-full bg-white dark:bg-gov-forest/50 rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm hover:shadow-xl hover:border-gov-teal/30 dark:hover:border-gov-gold/30 transition-all duration-300 relative overflow-hidden backdrop-blur-sm">
                      
                      {/* Top Decor Line */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gov-teal to-gov-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gov-beige dark:bg-white/5 flex items-center justify-center text-gov-teal dark:text-gov-gold group-hover:bg-gov-teal group-hover:text-white dark:group-hover:bg-gov-gold dark:group-hover:text-gov-forest transition-all duration-300 shadow-inner">
                            {getIcon(dir.icon)}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gov-charcoal dark:text-white leading-tight group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors">{dir.name}</h3>
                            <span className="text-xs text-gray-400 font-medium">{dir.servicesCount} خدمة متاحة</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed line-clamp-2 min-h-[40px]">{dir.description}</p>
                      
                      {/* Services List - Show fewer in compact mode */}
                      <div className="bg-gray-50/50 dark:bg-black/20 rounded-xl p-3 mb-6 flex-1">
                          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 pr-1">خدمات مختارة</h4>
                          <div className="space-y-2">
                              {dirServices.slice(0, variant === 'compact' ? 2 : 3).map(service => (
                                <div key={service.id} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 p-1.5 hover:bg-white dark:hover:bg-white/10 rounded transition-colors">
                                  <div className={`w-1.5 h-1.5 rounded-full ${service.isDigital ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                  <span className="truncate">{service.title}</span>
                                </div>
                              ))}
                              {dirServices.length === 0 && <span className="text-xs text-gray-400 block p-1">جاري تحديث الخدمات...</span>}
                          </div>
                      </div>

                      <div className="mt-auto border-t border-gray-100 dark:border-white/10 pt-4 flex justify-between items-center">
                        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">رمز: {dir.id.toUpperCase()}</span>
                        <button 
                          onClick={() => onSelectDirectorate?.(dir.id)}
                          className="text-sm font-bold text-gov-teal dark:text-gov-gold flex items-center gap-2 hover:gap-3 transition-all"
                        >
                          تصفح الجهة
                          <ArrowRight size={16} />
                        </button>
                      </div>
                  </div>
                );
              })}
          </div>
       )}

       {/* View All Button for Compact Mode */}
       {variant === 'compact' && (
          <div className="mt-12 text-center">
            <button 
              onClick={onViewAll}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gov-teal dark:bg-gov-gold text-white dark:text-gov-forest font-bold rounded-xl hover:bg-gov-emerald dark:hover:bg-white transition-all shadow-lg hover:shadow-xl"
            >
              عرض دليل الجهات الكامل
              <ChevronLeft size={20} />
            </button>
          </div>
       )}
    </div>
  );
};

export default DirectoratesList;