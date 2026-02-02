import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Filter,
  Clock,
  CheckCircle,
  FileText,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  isDigital: boolean;
  estimatedTime?: string;
  requirements?: string[];
  fees?: string;
}

export interface ServiceCategory {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: React.ReactNode;
  color: string;
  services: ServiceItem[];
}

interface ServiceCategoryPageProps {
  category: ServiceCategory;
  onBack: () => void;
  onServiceSelect?: (serviceId: string) => void;
}

const ServiceCategoryPage: React.FC<ServiceCategoryPageProps> = ({
  category,
  onBack,
  onServiceSelect
}) => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDigital, setFilterDigital] = useState<'all' | 'digital' | 'physical'>('all');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const filteredServices = category.services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterDigital === 'all' ||
      (filterDigital === 'digital' && service.isDigital) ||
      (filterDigital === 'physical' && !service.isDigital);
    return matchesSearch && matchesFilter;
  });

  const BackArrow = language === 'ar' ? ArrowRight : ArrowLeft;
  const ForwardArrow = language === 'ar' ? ChevronLeft : ChevronRight;

  return (
    <div className="min-h-screen bg-gov-beige dark:bg-gov-forest pt-8 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gov-teal dark:text-gov-gold hover:underline mb-6 font-medium"
        >
          <BackArrow size={18} />
          <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
        </button>

        {/* Category Header */}
        <div className={`rounded-3xl p-8 md:p-12 mb-8 bg-gradient-to-br ${category.color} relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
              {category.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                {language === 'ar' ? category.titleAr : category.titleEn}
              </h1>
              <p className="text-white/80 text-lg max-w-2xl">
                {language === 'ar' ? category.descriptionAr : category.descriptionEn}
              </p>
            </div>
            <div className="text-white/90 text-center">
              <div className="text-4xl font-bold">{category.services.length}</div>
              <div className="text-sm">{language === 'ar' ? 'خدمة متاحة' : 'Services'}</div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-white/5 rounded-2xl p-4 mb-8 border border-gray-100 dark:border-white/10 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-4 rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={language === 'ar' ? 'ابحث عن خدمة...' : 'Search services...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pr-12 rtl:pr-12 ltr:pl-12 pl-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-gov-teal outline-none transition-all text-gov-charcoal dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filterDigital}
              onChange={(e) => setFilterDigital(e.target.value as any)}
              className="py-3 px-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-gov-teal outline-none text-gov-charcoal dark:text-white"
            >
              <option value="all">{language === 'ar' ? 'جميع الخدمات' : 'All Services'}</option>
              <option value="digital">{language === 'ar' ? 'خدمات رقمية' : 'Digital Only'}</option>
              <option value="physical">{language === 'ar' ? 'خدمات حضورية' : 'In-Person'}</option>
            </select>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className="group bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10 hover:border-gov-gold/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${service.isDigital
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                  }`}>
                  {service.isDigital
                    ? (language === 'ar' ? 'رقمية' : 'Digital')
                    : (language === 'ar' ? 'حضورية' : 'In-Person')
                  }
                </div>
                {service.estimatedTime && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} />
                    <span>{service.estimatedTime}</span>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-gov-charcoal dark:text-white mb-2 group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors">
                {service.title}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                {service.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10">
                <span className="text-xs text-gray-400">
                  {service.fees || (language === 'ar' ? 'مجانية' : 'Free')}
                </span>
                <span className="flex items-center gap-1 text-sm font-medium text-gov-teal dark:text-gov-gold group-hover:gap-2 transition-all">
                  {language === 'ar' ? 'تفاصيل' : 'Details'}
                  <ForwardArrow size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-16">
            <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {language === 'ar' ? 'لا توجد خدمات مطابقة للبحث' : 'No services match your search'}
            </p>
          </div>
        )}

        {/* Service Detail Modal */}
        {selectedService && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedService(null)}>
            <div
              className="bg-white dark:bg-gov-forest rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`p-6 bg-gradient-to-br ${category.color} rounded-t-3xl`}>
                <div className="flex items-center justify-between">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${selectedService.isDigital
                    ? 'bg-white/20 text-white'
                    : 'bg-white/20 text-white'
                    }`}>
                    {selectedService.isDigital
                      ? (language === 'ar' ? 'خدمة ' : 'Service')
                      : (language === 'ar' ? 'خدمة حضورية' : 'In-Person Service')
                    }
                  </div>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="text-white/80 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <h2 className="text-2xl font-bold text-white mt-4">{selectedService.title}</h2>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'وصف الخدمة' : 'Description'}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedService.description}</p>
                </div>

                {selectedService.requirements && selectedService.requirements.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gov-charcoal dark:text-white mb-2">
                      {language === 'ar' ? 'المتطلبات' : 'Requirements'}
                    </h4>
                    <ul className="space-y-2">
                      {selectedService.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                          <CheckCircle size={16} className="text-green-500 mt-1 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {selectedService.estimatedTime && (
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
                      <div className="text-xs text-gray-400 mb-1">
                        {language === 'ar' ? 'الوقت المتوقع' : 'Estimated Time'}
                      </div>
                      <div className="font-bold text-gov-charcoal dark:text-white flex items-center gap-2">
                        <Clock size={16} className="text-gov-teal" />
                        {selectedService.estimatedTime}
                      </div>
                    </div>
                  )}
                  <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
                    <div className="text-xs text-gray-400 mb-1">
                      {language === 'ar' ? 'الرسوم' : 'Fees'}
                    </div>
                    <div className="font-bold text-gov-charcoal dark:text-white">
                      {selectedService.fees || (language === 'ar' ? 'مجانية' : 'Free')}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onServiceSelect?.(selectedService.id)}
                  className="w-full py-4 bg-gov-teal text-white font-bold rounded-xl hover:bg-gov-emerald transition-colors flex items-center justify-center gap-2"
                >
                  {selectedService.isDigital ? (
                    <>
                      <ExternalLink size={18} />
                      {language === 'ar' ? 'بدء الخدمة' : 'Start Service'}
                    </>
                  ) : (
                    <>
                      <Clock size={18} />
                      {language === 'ar' ? 'حجز موعد' : 'Book Appointment'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ServiceCategoryPage;
