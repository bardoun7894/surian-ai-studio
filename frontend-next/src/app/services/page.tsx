'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Monitor,
  Building,
  Clock,
  ChevronLeft,
  ChevronRight,
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
  Loader2,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import { Directorate, Service } from '@/types';
import { getLocalizedField, getLocalizedName } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { SkeletonGrid } from '@/components/SkeletonLoader';
import ContentFilter from '@/components/ContentFilter';
import ScrollAnimation from '@/components/ui/ScrollAnimation';
import Pagination from '@/components/Pagination';

// Service workflow stages component
const ServiceStages = ({ service, language }: { service: Service; language: string }) => {
  // Define stages based on service type
  const stages = service.isDigital
    ? [
      { id: 1, name: { ar: 'تقديم الطلب', en: 'Submit Request' }, completed: true },
      { id: 2, name: { ar: 'مراجعة البيانات', en: 'Review Data' }, completed: true },
      { id: 3, name: { ar: 'الموافقة', en: 'Approval' }, completed: false },
      { id: 4, name: { ar: 'الإصدار', en: 'Issuance' }, completed: false }
    ]
    : [
      { id: 1, name: { ar: 'حجز موعد', en: 'Book Appointment' }, completed: true },
      { id: 2, name: { ar: 'زيارة المركز', en: 'Visit Center' }, completed: false },
      { id: 3, name: { ar: 'تقديم المستندات', en: 'Submit Documents' }, completed: false },
      { id: 4, name: { ar: 'استلام الخدمة', en: 'Receive Service' }, completed: false }
    ];

  return (
    <div className="flex items-center justify-between gap-0.5 px-1 py-3 bg-gray-50 dark:bg-gov-card/10 rounded-lg overflow-x-auto no-scrollbar">
      {stages.map((stage, idx) => (
        <div key={stage.id} className="flex items-center flex-1 min-w-[60px]">
          <div className="flex flex-col items-center gap-1 flex-1">
            <div
              className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shrink-0 ${stage.completed
                ? 'bg-gov-teal text-white'
                : 'bg-gray-200 dark:bg-gov-gold/20 text-gray-400'
                }`}
            >
              {stage.completed ? <CheckCircle2 size={12} /> : <Circle size={8} />}
            </div>
            <span className={`text-[9px] md:text-[10px] text-center font-medium leading-tight ${stage.completed ? 'text-gov-teal' : 'text-gray-400'}`}>
              {language === 'ar' ? stage.name.ar : stage.name.en}
            </span>
          </div>
          {idx < stages.length - 1 && (
            <div className={`h-0.5 flex-1 min-w-[4px] mx-0.5 ${stage.completed ? 'bg-gov-teal' : 'bg-gray-200 dark:bg-dm-surface'}`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default function ServicesPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDirectorate, setSelectedDirectorate] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStages, setShowStages] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage] = useState(12);

  // Fetch directorates once on mount
  useEffect(() => {
    const fetchDirectorates = async () => {
      try {
        const dirs = await API.directorates.getAll();
        setDirectorates(dirs);
      } catch (e) {
        console.error(e);
      }
    };
    fetchDirectorates();
  }, []);

  // Fetch paginated services when page, filters, or perPage change
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await API.services.getPaginated(
          currentPage,
          perPage,
          selectedDirectorate || undefined,
          searchQuery || undefined
        );
        setServices(response.data);
        setCurrentPage(response.current_page);
        setLastPage(response.last_page);
        setTotalItems(response.total);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [currentPage, perPage, selectedDirectorate, searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDirectorate]);


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

  // Services are already filtered server-side via query params

  // Get directorate name
  const getDirectorateName = (id: string) => {
    const d = directorates.find(d => d.id === id);
    if (!d) return '';
    return getLocalizedField(d, 'name', language as 'ar' | 'en');
  };

  // Get directorate icon
  const getDirectorateIcon = (id: string) => {
    const directorate = directorates.find(d => d.id === id);
    return directorate ? iconMap[directorate.icon] : <Building size={20} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
      <Navbar />

      <main className="flex-grow pt-20 md:pt-24">
        {/* Header */}
        <div className="bg-gov-forest text-white py-16 px-4 animate-fade-in-up">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {language === 'ar' ? 'دليل الخدمات الحكومية' : 'Government Services Guide'}
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              {language === 'ar'
                ? 'تصفح جميع الخدمات الحكومية المتاحة للمواطنين'
                : 'Browse all government services available to citizens'}
            </p>

          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Filters */}
          <ContentFilter
            // Tabs could be directorates, but list is long. Use dropdown in extra instead.
            onSearch={(q) => { setSearchQuery(q); }}
            searchValue={searchQuery}
            totalCount={totalItems}
            countLabel={language === 'ar' ? 'خدمة' : 'services'}
            extraFilters={
              <>
                {/* Directorate Filter */}
                <div className="relative">
                  <select
                    value={selectedDirectorate || ''}
                    onChange={(e) => { setSelectedDirectorate(e.target.value || null); }}
                    className="appearance-none bg-white dark:bg-dm-surface border border-gray-200 dark:border-gov-border/25 rounded-xl py-2 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-gov-charcoal dark:text-gov-gold font-medium focus:outline-none focus:border-gov-gold transition-colors cursor-pointer h-[42px]"
                  >
                    <option value="">{language === 'ar' ? 'جميع الجهات' : 'All Agencies'}</option>
                    {directorates.map(d => (
                      <option key={d.id} value={d.id}>{getLocalizedField(d, 'name', language as 'ar' | 'en')}</option>
                    ))}
                  </select>
                  <Filter className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>

                {/* Show Stages Toggle */}
                <button
                  onClick={() => setShowStages(!showStages)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 h-[42px] ${showStages
                    ? 'bg-gov-gold text-white'
                    : 'bg-white dark:bg-dm-surface text-gov-charcoal dark:text-gov-gold border border-gray-200 dark:border-gov-border/25'
                    }`}
                >
                  <CheckCircle2 size={16} />
                  {language === 'ar' ? 'المراحل' : 'Stages'}
                </button>
              </>
            }
            className="mb-8"
          />



          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-8">
                <SkeletonGrid cards={6} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
              </div>
            ) : services.map((service, index) => (
              <ScrollAnimation key={service.id} delay={index * 0.05}>
                <Link
                  href={`/services/${service.id}`}
                  className="group bg-white dark:bg-dm-surface rounded-2xl border border-gray-100 dark:border-gov-border/15 p-6 hover:border-gov-gold/50 hover:shadow-gov transition-all duration-300 flex flex-col h-full"
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
                  </div>

                  {/* Service Title */}
                  <h3 className="text-lg font-bold text-gov-charcoal dark:text-gov-gold mb-2 group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors">
                    {getLocalizedField(service, 'title', language as 'ar' | 'en')}
                  </h3>

                  {/* Service Description */}
                  <p className="text-sm text-gray-600 dark:text-white/70 mb-4 line-clamp-2">
                    {getLocalizedField(service, 'description', language as 'ar' | 'en')}
                  </p>

                  {/* Service Workflow Stages */}
                  {showStages && (
                    <div className="mb-4">
                      <ServiceStages service={service} language={language} />
                    </div>
                  )}

                  {/* Service Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gov-border/15 mt-auto">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gov-gold/50">
                      <Clock size={14} />
                      <span>{language === 'ar' ? 'فوري' : 'Instant'}</span>
                    </div>
                  </div>
                </Link>
              </ScrollAnimation>
            ))}
          </div>

          {/* Pagination */}
          {!loading && services.length > 0 && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                total={totalItems}
                perPage={perPage}
                onPageChange={(page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              />
            </div>
          )}

          {/* Empty State */}
          {!loading && services.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-dm-surface/50 flex items-center justify-center mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gov-charcoal dark:text-gov-gold mb-2">
                {language === 'ar' ? 'لا توجد نتائج' : 'No Results Found'}
              </h3>
              <p className="text-gray-500 dark:text-gov-gold/50">
                {language === 'ar'
                  ? 'جرب تغيير معايير البحث أو الفلترة'
                  : 'Try changing your search or filter criteria'}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
