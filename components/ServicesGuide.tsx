import React, { useState } from 'react';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Building,
  Clock,
  CheckCircle,
  ExternalLink,
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
  Factory
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { DIRECTORATES, KEY_SERVICES } from '../constants';

const ServicesGuide: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDirectorate, setSelectedDirectorate] = useState<string | null>(null);
  const [filterDigital, setFilterDigital] = useState<boolean | null>(null);

  // Translation helper
  const tr = (key: string): string => {
    const translations: Record<string, Record<'ar' | 'en', string>> = {
      'services_guide_title': { ar: 'دليل الخدمات الحكومية', en: 'Government Services Guide' },
      'services_guide_subtitle': { ar: 'تصفح جميع الخدمات الحكومية الإلكترونية والتقليدية المتاحة للمواطنين', en: 'Browse all electronic and traditional government services available to citizens' },
      'search_placeholder': { ar: 'ابحث عن خدمة...', en: 'Search for a service...' },
      'filter_all_agencies': { ar: 'جميع الجهات', en: 'All Agencies' },
      'filter_all': { ar: 'الكل', en: 'All' },
      'filter_digital': { ar: 'إلكترونية', en: 'Digital' },
      'filter_in_person': { ar: 'حضورية', en: 'In-Person' },
      'services_available': { ar: 'خدمة متاحة', en: 'services available' },
      'no_results': { ar: 'لا توجد نتائج', en: 'No Results Found' },
      'no_results_hint': { ar: 'جرب تغيير معايير البحث أو الفلترة', en: 'Try changing your search or filter criteria' },
      'instant': { ar: 'فوري', en: 'Instant' },
      'apply': { ar: 'تقديم الطلب', en: 'Apply' },
    };
    return translations[key]?.[language] || key;
  };

  // Icon mapping
  const iconMap: Record<string, React.ReactNode> = {
    ShieldAlert: <ShieldAlert size={20} />,
    Scale: <Scale size={20} />,
    HeartPulse: <HeartPulse size={20} />,
    BookOpen: <BookOpen size={20} />,
    GraduationCap: <GraduationCap size={20} />,
    Zap: <Zap size={20} />,
    Droplets: <Droplets size={20} />,
    Plane: <Plane size={20} />,
    Wifi: <Wifi size={20} />,
    Banknote: <Banknote size={20} />,
    Map: <Map size={20} />,
    Factory: <Factory size={20} />
  };

  // Filter services
  const filteredServices = KEY_SERVICES.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDirectorate = !selectedDirectorate || service.directorateId === selectedDirectorate;
    const matchesDigital = filterDigital === null || service.isDigital === filterDigital;
    return matchesSearch && matchesDirectorate && matchesDigital;
  });

  // Get directorate name
  const getDirectorateName = (id: string) => {
    return DIRECTORATES.find(d => d.id === id)?.name || '';
  };

  // Get directorate icon
  const getDirectorateIcon = (id: string) => {
    const directorate = DIRECTORATES.find(d => d.id === id);
    return directorate ? iconMap[directorate.icon] : <Building size={20} />;
  };

  return (
    <div className="min-h-screen bg-gov-beige dark:bg-gov-forest pb-20">
      {/* Header */}
      <div className="bg-gov-forest text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {tr('services_guide_title')}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            {tr('services_guide_subtitle')}
          </p>

          {/* Search Bar */}
          <div className="mt-8 relative max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tr('search_placeholder')}
              className="w-full py-4 px-6 pr-14 rtl:pr-6 rtl:pl-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-gold transition-colors"
            />
            <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          {/* Directorate Filter */}
          <div className="relative">
            <select
              value={selectedDirectorate || ''}
              onChange={(e) => setSelectedDirectorate(e.target.value || null)}
              className="appearance-none bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-xl px-4 py-3 pr-10 rtl:pr-4 rtl:pl-10 text-gov-charcoal dark:text-white font-medium focus:outline-none focus:border-gov-gold transition-colors cursor-pointer"
            >
              <option value="">{tr('filter_all_agencies')}</option>
              {DIRECTORATES.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <Filter className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>

          {/* Digital Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterDigital(null)}
              className={`px-4 py-3 rounded-xl font-medium transition-colors ${filterDigital === null
                  ? 'bg-gov-teal text-white'
                  : 'bg-white dark:bg-white/10 text-gov-charcoal dark:text-white border border-gray-200 dark:border-white/20'
                }`}
            >
              {tr('filter_all')}
            </button>
            <button
              onClick={() => setFilterDigital(true)}
              className={`px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${filterDigital === true
                  ? 'bg-gov-teal text-white'
                  : 'bg-white dark:bg-white/10 text-gov-charcoal dark:text-white border border-gray-200 dark:border-white/20'
                }`}
            >
              <Monitor size={16} />
              {tr('filter_digital')}
            </button>
            <button
              onClick={() => setFilterDigital(false)}
              className={`px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${filterDigital === false
                  ? 'bg-gov-teal text-white'
                  : 'bg-white dark:bg-white/10 text-gov-charcoal dark:text-white border border-gray-200 dark:border-white/20'
                }`}
            >
              <Building size={16} />
              {tr('filter_in_person')}
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gov-stone dark:text-gray-400">
          {`${filteredServices.length} ${tr('services_available')}`}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-6 hover:border-gov-gold/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              {/* Service Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gov-forest/5 dark:bg-gov-gold/10 text-gov-forest dark:text-gov-gold flex items-center justify-center">
                    {getDirectorateIcon(service.directorateId)}
                  </div>
                  <div>
                    <span className="text-xs text-gov-teal dark:text-gov-gold font-medium">
                      {getDirectorateName(service.directorateId)}
                    </span>
                  </div>
                </div>
                {service.isDigital ? (
                  <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold flex items-center gap-1">
                    <Monitor size={12} />
                    {tr('filter_digital')}
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-bold flex items-center gap-1">
                    <Building size={12} />
                    {tr('filter_in_person')}
                  </span>
                )}
              </div>

              {/* Service Title */}
              <h3 className="text-lg font-bold text-gov-charcoal dark:text-white mb-2 group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors">
                {service.title}
              </h3>

              {/* Service Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {service.description}
              </p>

              {/* Service Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Clock size={14} />
                  <span>{tr('instant')}</span>
                </div>
                <button className="flex items-center gap-1 text-sm font-bold text-gov-teal dark:text-gov-gold hover:underline">
                  {tr('apply')}
                  {language === 'ar' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gov-charcoal dark:text-white mb-2">
              {tr('no_results')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {tr('no_results_hint')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesGuide;
