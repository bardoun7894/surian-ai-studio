'use client';
import { usePageLoading } from '@/hooks/usePageLoading';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  Monitor,
  Building,
  Clock,
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
  CheckCircle2,
  Circle,
  Info
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import { Directorate, Service } from '@/types';
import { getLocalizedField } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SkeletonGrid } from '@/components/SkeletonLoader';
import ContentFilter from '@/components/ContentFilter';
import ScrollAnimation from '@/components/ui/ScrollAnimation';
import Pagination from '@/components/Pagination';
import FavoriteButton from '@/components/FavoriteButton';

// Service workflow stages component
const ServiceStages = ({ service, language }: { service: Service; language: string }) => {
  // Define stages based on service type
  const stages = service.isDigital
    ? [
      { id: 1, name: { ar: 'تقديم الطلب', en: 'Submit Request' } },
      { id: 2, name: { ar: 'مراجعة البيانات', en: 'Review Data' } },
      { id: 3, name: { ar: 'الموافقة', en: 'Approval' } },
      { id: 4, name: { ar: 'الإصدار', en: 'Issuance' } }
    ]
    : [
      { id: 1, name: { ar: 'حجز موعد', en: 'Book Appointment' } },
      { id: 2, name: { ar: 'زيارة المركز', en: 'Visit Center' } },
      { id: 3, name: { ar: 'تقديم المستندات', en: 'Submit Documents' } },
      { id: 4, name: { ar: 'استلام الخدمة', en: 'Receive Service' } }
    ];

  return (
    <div className="flex items-start gap-1 px-2 py-2.5 bg-gray-50 dark:bg-gov-card/10 rounded-lg overflow-x-auto no-scrollbar">
      {stages.map((stage, idx) => (
        <div key={stage.id} className="flex items-center shrink-0">
          <div className="flex flex-col items-center gap-1.5 min-w-[68px] sm:min-w-[72px]">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0 bg-gov-forest/10 dark:bg-gov-gold/15 text-gov-forest dark:text-gov-gold">
              <Circle size={8} />
            </div>
            <span className="text-[10px] sm:text-[11px] text-center font-medium leading-4 text-gov-forest/70 dark:text-gov-gold/70">
              {language === 'ar' ? stage.name.ar : stage.name.en}
            </span>
          </div>
          {idx < stages.length - 1 && (
            <div className="h-0.5 w-5 sm:w-7 mx-1 bg-gray-200 dark:bg-dm-surface" />
          )}
        </div>
      ))}
    </div>
  );
};

export default function ServicesPage() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const initializedRef = useRef(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDirectorate, setSelectedDirectorate] = useState<string | null>(null);
  const [filterDigital, setFilterDigital] = useState<boolean | undefined>(undefined);
  const [services, setServices] = useState<Service[]>([]);
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [loading, setLoading] = useState(true);
    usePageLoading(loading);
  const [showStages, setShowStages] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage] = useState(12);

  // Map slug names from header nav to actual directorate IDs
  const directorateSlugMap: Record<string, string> = {
    'industry': 'd1',
    'economy': 'd2',
    'trade': 'd3',
  };

  // Read URL search params to apply filters from header navigation
  useEffect(() => {
    const dirParam = searchParams.get('directorate');
    const typeParam = searchParams.get('type');

    if (dirParam) {
      // Resolve slug to actual directorate ID, or use as-is if already an ID
      const resolvedId = directorateSlugMap[dirParam] || dirParam;
      setSelectedDirectorate(resolvedId);
    }
    if (typeParam === 'ministry') {
      // "ministry" type means show all — no specific directorate filter
      setSelectedDirectorate(null);
    }
    initializedRef.current = true;
  }, [searchParams]);

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
  // Wait until URL params have been read (initializedRef) before fetching
  useEffect(() => {
    if (!initializedRef.current) return;
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await API.services.getPaginated(
          currentPage,
          perPage,
          selectedDirectorate || undefined,
          searchQuery || undefined,
          filterDigital
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
  }, [currentPage, perPage, selectedDirectorate, searchQuery, filterDigital]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDirectorate, filterDigital]);


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

      <main className="flex-grow">
        {/* Header */}
        <div className="bg-gov-forest text-white py-7 sm:py-12 md:py-16 px-4 animate-fade-in-up">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 sm:mb-4 leading-tight">
              {language === 'ar' ? 'دليل الخدمات الحكومية' : 'Government Services Guide'}
            </h1>
            <p className="text-gray-200 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
              {language === 'ar'
                ? 'تصفح جميع الخدمات الحكومية المتاحة للمواطنين'
                : 'Browse all government services available to citizens'}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
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
                <div className="relative w-full sm:w-auto sm:min-w-[180px]">
                  <select
                    value={selectedDirectorate || ''}
                    onChange={(e) => { setSelectedDirectorate(e.target.value || null); }}
                    className="w-full appearance-none bg-white dark:bg-dm-surface border border-gray-200 dark:border-gov-border/25 rounded-xl py-2.5 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-sm sm:text-base text-gov-charcoal dark:text-gov-gold font-medium focus:outline-none focus:border-gov-gold transition-colors cursor-pointer min-h-[44px]"
                  >
                    <option value="">{language === 'ar' ? 'جميع الجهات' : 'All Agencies'}</option>
                    {directorates.map(d => (
                      <option key={d.id} value={d.id}>{getLocalizedField(d, 'name', language as 'ar' | 'en')}</option>
                    ))}
                  </select>
                  <Filter className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>

                {/* E-Services Filter */}
                <div className="relative w-full sm:w-auto sm:min-w-[180px]">
                  <select
                    value={filterDigital === undefined ? 'all' : filterDigital ? 'digital' : 'traditional'}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFilterDigital(val === 'all' ? undefined : val === 'digital');
                    }}
                    className="w-full appearance-none bg-white dark:bg-dm-surface border border-gray-200 dark:border-gov-border/25 rounded-xl py-2.5 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-sm sm:text-base text-gov-charcoal dark:text-gov-gold font-medium focus:outline-none focus:border-gov-gold transition-colors cursor-pointer min-h-[44px]"
                  >
                    <option value="all">{language === 'ar' ? 'جميع الخدمات' : 'All Services'}</option>
                    <option value="digital">{language === 'ar' ? 'خدمات إلكترونية' : 'E-Services'}</option>
                    <option value="traditional">{language === 'ar' ? 'خدمات تقليدية' : 'Traditional Services'}</option>
                  </select>
                  <Monitor className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>

                {/* Show Stages Toggle */}
                <button
                  onClick={() => setShowStages(!showStages)}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 min-h-[44px] ${showStages
                    ? 'bg-gov-gold text-white'
                    : 'bg-white dark:bg-dm-surface text-gov-charcoal dark:text-gov-gold border border-gray-200 dark:border-gov-border/25'
                    }`}
                >
                  <CheckCircle2 size={16} />
                  {language === 'ar' ? 'المراحل' : 'Stages'}
                </button>
              </>
            }
            className="mb-6 md:mb-8"
          />



          {/* M7.8: Disclaimer banner */}
          <div className="flex items-center gap-3 px-4 py-3 mb-4 md:mb-6 bg-gov-teal/5 dark:bg-gov-gold/5 border border-gov-teal/15 dark:border-gov-gold/15 rounded-xl">
            <Info size={18} className="text-gov-teal dark:text-gov-gold shrink-0" />
            <p className="text-sm text-gov-charcoal/80 dark:text-gov-gold/80 font-medium">
              {language === 'ar'
                ? 'الخدمات المعروضة تخضع للتعديل والتحديث المستمر'
                : 'Services shown are subject to continuous updates'}
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {loading ? (
              <div className="col-span-full py-8">
                <SkeletonGrid cards={6} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
              </div>
            ) : services.map((service, index) => (
              <ScrollAnimation key={service.id} delay={index * 0.05}>
                <div className="relative group bg-white dark:bg-dm-surface rounded-2xl border border-gray-100 dark:border-gov-border/15 p-3.5 sm:p-5 md:p-6 hover:border-gov-gold/50 hover:shadow-gov transition-all duration-300 flex flex-col h-full">
                  {/* TASK 2 & 4: Favorite button - inline, no full-page loading */}
                  <Link
                    href={`/services/${service.id}`}
                    className="flex flex-col h-full"
                  >
                    {/* Service Header */}
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gov-forest/5 dark:bg-gov-gold/10 text-gov-forest dark:text-gov-gold flex items-center justify-center shrink-0">
                          {getDirectorateIcon(service.directorateId)}
                        </div>
                        <span className="text-xs text-gov-teal dark:text-gov-gold font-medium line-clamp-1 min-w-0">
                          {getDirectorateName(service.directorateId)}
                        </span>
                      </div>
                      <div className="shrink-0 ms-2" onClick={(e) => e.preventDefault()}>
                        <FavoriteButton
                          contentType="service"
                          contentId={String(service.id)}
                          metadata={{
                            title: getLocalizedField(service, 'title', language as 'ar' | 'en'),
                            title_ar: getLocalizedField(service, 'title', 'ar'),
                            title_en: getLocalizedField(service, 'title', 'en'),
                            description: getLocalizedField(service, 'description', language as 'ar' | 'en'),
                            description_ar: getLocalizedField(service, 'description', 'ar'),
                            description_en: getLocalizedField(service, 'description', 'en'),
                            url: `/services/${service.id}`,
                          }}
                          variant="compact"
                          size={16}
                        />
                      </div>
                    </div>

                    {/* Service Title */}
                    <h3 className="text-base sm:text-lg font-bold text-gov-charcoal dark:text-gov-gold mb-2 group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors line-clamp-2 leading-snug">
                      {getLocalizedField(service, 'title', language as 'ar' | 'en')}
                    </h3>

                    {/* Service Description */}
                    <p className="text-sm text-gray-600 dark:text-white/70 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                      {getLocalizedField(service, 'description', language as 'ar' | 'en')}
                    </p>

                    {/* Service Workflow Stages */}
                    {showStages && (
                      <div className="mb-3.5 sm:mb-4">
                        <ServiceStages service={service} language={language} />
                      </div>
                    )}

                    {/* Service Footer */}
                    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 dark:border-gov-border/15 mt-auto">
                      <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gov-gold/50">
                        <Clock size={14} className="shrink-0 rtl:order-none ltr:order-none" />
                        <span className="leading-none">{language === 'ar' ? 'فوري' : 'Instant'}</span>
                      </div>
                    </div>
                  </Link>
                </div>
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
