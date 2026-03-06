import React, { useState, useEffect } from 'react';
import { API } from '../services/repository';
import { Directorate, Service } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
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
  ChevronLeft,
  Loader2
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
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [servicesMap, setServicesMap] = useState<Record<string, Service[]>>({});
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dirs = await API.directorates.getAll();
        setDirectorates(dirs);

        // Fetch services for each directorate (Optimized: in real app, might want to fetch on demand or include in getAll response)
        const servicesPromises = dirs.map(async (d) => {
          const services = await API.directorates.getServicesByDirectorate(d.id);
          return { id: d.id, services };
        });

        const servicesResults = await Promise.all(servicesPromises);
        const sMap: Record<string, Service[]> = {};
        servicesResults.forEach(item => {
          sMap[item.id] = item.services;
        });
        setServicesMap(sMap);

      } catch (error) {
        console.error("Failed to fetch directorates", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Icon mapping helper
  const getIcon = (iconName: string, isCompact: boolean) => {
    const props = { size: isCompact ? 24 : 32 };
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
    ? directorates.filter(dir => dir.name.includes(searchTerm) || dir.description.includes(searchTerm))
    : directorates.slice(0, 6); // Show only top 6 in compact mode

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-gov-teal" size={40} />
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${variant === 'full' ? 'py-16 min-h-screen' : 'py-12'}`}>

      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className={`text-center ${variant === 'full' ? 'md:text-right rtl:md:text-right ltr:md:text-left' : 'md:text-center w-full'}`}>
          <h2 className={`text-3xl md:text-5xl font-display font-bold text-gov-forest dark:text-white mb-3 flex items-center gap-3 justify-center ${variant === 'full' ? 'md:justify-start' : ''}`}>
            <LayoutGrid className="text-gov-gold" />
            {variant === 'full' ? t('dir_title_full') : t('requested_services_title')}
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto md:mx-0">
            {variant === 'full'
              ? t('dir_subtitle_full')
              : t('requested_services_subtitle')}
          </p>
        </div>

        {/* Search Bar - Only in Full Mode */}
        {variant === 'full' && (
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-4 px-6 pl-12 rtl:pl-4 rtl:pr-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gov-charcoal dark:text-white focus:border-gov-gold dark:focus:border-gov-gold focus:ring-4 focus:ring-gov-gold/10 transition-all outline-none shadow-sm"
            />
            <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 transform -translate-y-1/2 text-gov-gold/50" size={20} />
          </div>
        )}
      </div>

      {filteredDirectorates.length === 0 ? (
        <div className="text-center py-24 bg-white/40 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-white/10 backdrop-blur-sm">
          <Building2 size={64} className="mx-auto text-gov-gold/20 mb-6" />
          <p className="text-xl text-gray-400 font-bold mb-4">{t('ui_no_results')}</p>
          <button onClick={() => setSearchTerm('')} className="text-gov-forest dark:text-gov-gold font-bold hover:underline transition-all underline-offset-4">{t('ui_show_all')}</button>
        </div>
      ) : (
        <div className={`grid gap-6 md:gap-8 ${variant === 'full'
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
          }`}>
          {filteredDirectorates.map((dir) => {
            const dirServices = servicesMap[dir.id] || [];
            const isCompact = variant === 'compact';

            return (
              <div key={dir.id}
                className={`group flex flex-col h-full bg-white dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-2xl hover:border-gov-gold/30 transition-all duration-500 relative overflow-hidden backdrop-blur-sm cursor-pointer ${isCompact ? 'p-6 items-center text-center' : 'p-8'}`}
                onClick={() => onSelectDirectorate?.(dir.id)}
              >

                <div className={`flex gap-5 ${isCompact ? 'flex-col items-center mb-3' : 'items-center mb-6'}`}>
                  <div className={`${isCompact ? 'w-16 h-16' : 'w-20 h-20'} rounded-2xl bg-gov-beige dark:bg-white/5 flex items-center justify-center text-gov-forest dark:text-gov-gold group-hover:bg-gov-gold/10 dark:group-hover:bg-gov-gold/10 transition-all duration-500 shadow-inner ring-1 ring-black/5 dark:ring-white/5`}>
                    {getIcon(dir.icon, isCompact)}
                  </div>
                  <div className={isCompact ? 'space-y-1' : ''}>
                    <h3 className={`${isCompact ? 'text-base' : 'text-xl'} font-bold text-gov-forest dark:text-white leading-tight group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors`}>{dir.name}</h3>
                    {!isCompact && <span className="text-xs text-gov-gold font-bold uppercase tracking-wider">{dir.servicesCount} {t('services_available')}</span>}
                  </div>
                </div>

                {/* Description - Hidden in Compact Mode */}
                {!isCompact && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed line-clamp-2 min-h-[44px]">{dir.description}</p>
                )}

                {/* Services List - Hidden in Compact Mode */}
                {!isCompact && (
                  <div className="bg-gray-50 dark:bg-black/20 rounded-2xl p-4 mb-8 flex-1 border border-gray-100 dark:border-white/5">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 pr-1">{t('dir_services_selected')}</h4>
                    <div className="space-y-2.5">
                      {dirServices.slice(0, 3).map(service => (
                        <div key={service.id} className="flex items-center gap-3 text-xs text-gray-700 dark:text-gray-300 group/service hover:translate-x-1 rtl:hover:-translate-x-1 transition-transform">
                          <div className={`w-2 h-2 rounded-full ${service.isDigital ? 'bg-gov-emerald' : 'bg-gray-300 dark:bg-gray-600'} shadow-sm`}></div>
                          <span className="truncate font-medium">{service.title}</span>
                        </div>
                      ))}
                      {dirServices.length === 0 && <span className="text-xs text-gray-400 block p-1 italic">{t('loading')}</span>}
                    </div>
                  </div>
                )}

                {!isCompact && (
                  <div className="mt-auto border-t border-gray-100 dark:border-white/10 pt-6 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 dark:bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">{dir.id}</span>
                    <span className="text-sm font-bold text-gov-forest dark:text-gov-gold flex items-center gap-2 group-hover:gap-4 transition-all">
                      {t('view_details')}
                      <ArrowRight size={18} className={`${language === 'ar' ? 'rotate-180' : ''} transition-transform`} />
                    </span>
                  </div>
                )}
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
            className="inline-flex items-center gap-3 px-10 py-4 bg-gov-forest dark:bg-gov-gold text-white dark:text-gov-forest font-bold text-lg rounded-2xl hover:shadow-[0_10px_30px_rgba(9,66,57,0.3)] dark:hover:shadow-[0_10px_30px_rgba(185,167,121,0.3)] transition-all transform hover:-translate-y-1"
          >
            {t('view_all_services')}
            <ChevronLeft size={22} className={language === 'ar' ? '' : 'rotate-180'} />
          </button>
        </div>
      )}
    </div>
  );
};

export default DirectoratesList;