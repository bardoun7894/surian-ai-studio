'use client';

import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, ArrowLeft, ArrowRight, Bell, AlertCircle, Search, ChevronDown, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import { getLocalizedField } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';


interface Announcement {
  id: string;
  title: string;
  date: string;
  type: 'urgent' | 'important' | 'general' | 'tender' | 'job';
  description: string;
  category: string;
}

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'مناقصة عامة لتوريد معدات صناعية للمناطق الصناعية',
    date: '2025-01-12',
    type: 'tender',
    category: 'مناقصات',
    description: 'تعلن وزارة الاقتصاد والصناعة عن مناقصة عامة لتوريد معدات صناعية للمناطق الصناعية. آخر موعد للتقديم: 30/01/2025'
  },
  {
    id: '2',
    title: 'تمديد مهلة التقديم على برنامج تمويل المشاريع الصغيرة',
    date: '2025-01-10',
    type: 'urgent',
    category: 'تمويل',
    description: 'تم تمديد مهلة التقديم على برنامج تمويل المشاريع الصغيرة والمتوسطة حتى نهاية الشهر الحالي'
  },
  {
    id: '3',
    title: 'دورة تدريبية في إدارة الجودة الصناعية',
    date: '2025-01-08',
    type: 'general',
    category: 'تدريب',
    description: 'تعلن الإدارة العامة للصناعة عن دورة تدريبية مجانية في إدارة الجودة للمنشآت الصناعية. التسجيل مفتوح حتى 15/01/2025'
  },
  {
    id: '4',
    title: 'تحديث منصة التراخيص الصناعية الإلكترونية',
    date: '2025-01-05',
    type: 'important',
    category: 'تقنية',
    description: 'سيتم تحديث منصة التراخيص الصناعية الإلكترونية يوم السبت القادم من الساعة 12 ليلاً حتى 6 صباحاً'
  },
  {
    id: '5',
    title: 'فرص عمل جديدة في القطاع الصناعي',
    date: '2025-01-03',
    type: 'job',
    category: 'توظيف',
    description: 'إعلان عن وظائف شاغرة في المناطق الصناعية تشمل: مهندسين صناعيين، فنيين، إداريين'
  },
  {
    id: '6',
    title: 'مناقصة لتأهيل المنطقة الصناعية في عدرا',
    date: '2025-01-02',
    type: 'tender',
    category: 'مناقصات',
    description: 'إعلان عن مناقصة لتأهيل وصيانة البنية التحتية في المنطقة الصناعية بعدرا. كراسة الشروط متوفرة في مقر الوزارة'
  },
  {
    id: '7',
    title: 'تعليق العمل بسبب العطلة الرسمية',
    date: '2024-12-30',
    type: 'important',
    category: 'إداري',
    description: 'تعلن وزارة الاقتصاد والصناعة عن تعليق العمل في الإدارات خلال فترة عطلة رأس السنة'
  },
  {
    id: '8',
    title: 'برنامج منح دراسية للموظفين',
    date: '2024-12-28',
    type: 'general',
    category: 'تدريب',
    description: 'إعلان عن برنامج منح دراسية للموظفين الحكوميين للحصول على شهادات عليا في الإدارة العامة'
  },
  {
    id: '9',
    title: 'مسابقة توظيف في وزارة الاقتصاد والصناعة',
    date: '2024-12-25',
    type: 'job',
    category: 'توظيف',
    description: 'تعلن وزارة الاقتصاد والصناعة عن مسابقة لتعيين 50 موظفاً في الفئة الثانية من حملة الإجازة الجامعية'
  },
  {
    id: '10',
    title: 'تغيير مواعيد الدوام الرسمي',
    date: '2024-12-20',
    type: 'important',
    category: 'إداري',
    description: 'إعلان هام بخصوص تغيير مواعيد الدوام الرسمي في الدوائر الحكومية اعتباراً من بداية العام الجديد'
  }
];

export default function AnnouncementsPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await API.announcements.getAll();
        setAnnouncements(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);


  const types = [
    { value: 'all', label: language === 'ar' ? 'جميع الأنواع' : 'All Types' },
    { value: 'urgent', label: language === 'ar' ? 'عاجل' : 'Urgent' },
    { value: 'important', label: language === 'ar' ? 'هام' : 'Important' },
    { value: 'tender', label: language === 'ar' ? 'مناقصات' : 'Tenders' },
    { value: 'job', label: language === 'ar' ? 'توظيف' : 'Jobs' },
    { value: 'general', label: language === 'ar' ? 'عام' : 'General' },
  ];

  const categories = [
    { value: 'all', label: language === 'ar' ? 'جميع التصنيفات' : 'All Categories' },
    { value: 'مناقصات', label: language === 'ar' ? 'مناقصات' : 'Tenders' },
    { value: 'توظيف', label: language === 'ar' ? 'توظيف' : 'Employment' },
    { value: 'تدريب', label: language === 'ar' ? 'تدريب' : 'Training' },
    { value: 'تقنية', label: language === 'ar' ? 'تقنية' : 'Technology' },
    { value: 'إداري', label: language === 'ar' ? 'إداري' : 'Administrative' },
  ];

  const getTypeStyles = (type: Announcement['type']) => {
    switch (type) {
      case 'urgent':
        return {
          bg: 'bg-gov-red/5 dark:bg-gov-emeraldStatic',
          border: 'border-gov-red/20 dark:border-gov-red/30',
          badge: 'bg-gov-red text-white',
          icon: <AlertCircle size={14} />
        };
      case 'important':
        return {
          bg: 'bg-gov-gold/10 dark:bg-gov-emeraldStatic',
          border: 'border-gov-gold/30 dark:border-gov-gold/30',
          badge: 'bg-gov-gold text-gov-forest',
          icon: <Bell size={14} />
        };
      case 'tender':
        return {
          bg: 'bg-gov-teal/5 dark:bg-gov-emeraldStatic',
          border: 'border-gov-teal/20 dark:border-gov-teal/30',
          badge: 'bg-gov-teal text-white',
          icon: <Megaphone size={14} />
        };
      case 'job':
        return {
          bg: 'bg-gov-emeraldLight/5 dark:bg-gov-emeraldStatic',
          border: 'border-gov-emeraldLight/20 dark:border-gov-emeraldLight/30',
          badge: 'bg-gov-emeraldLight text-white',
          icon: <Megaphone size={14} />
        };
      default:
        return {
          bg: 'bg-gov-sand/5 dark:bg-gov-emeraldStatic',
          border: 'border-gov-sand/20 dark:border-white/10',
          badge: 'bg-gov-sand text-white',
          icon: <Megaphone size={14} />
        };
    }
  };

  const getTypeLabel = (type: Announcement['type']) => {
    if (language === 'ar') {
      switch (type) {
        case 'urgent': return 'عاجل';
        case 'important': return 'هام';
        case 'tender': return 'مناقصة';
        case 'job': return 'توظيف';
        default: return 'إعلان';
      }
    } else {
      switch (type) {
        case 'urgent': return 'Urgent';
        case 'important': return 'Important';
        case 'tender': return 'Tender';
        case 'job': return 'Job';
        default: return 'Announcement';
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return language === 'ar'
      ? date.toLocaleDateString('ar-SY', { year: 'numeric', month: 'long', day: 'numeric' })
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const dataSource = announcements.length > 0 ? announcements : MOCK_ANNOUNCEMENTS;
  const filteredAnnouncements = dataSource.filter((announcement: any) => {
    const title = getLocalizedField(announcement, 'title', language as 'ar' | 'en');
    const description = getLocalizedField(announcement, 'description', language as 'ar' | 'en');
    const matchesSearch = !searchQuery.trim() || title.includes(searchQuery) || description.includes(searchQuery);
    const matchesType = selectedType === 'all' || announcement.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || announcement.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-black">
      <Navbar />

      <main className="flex-grow pt-14 md:pt-16">
        <div className="min-h-screen bg-gov-beige dark:bg-black pb-16">
          {/* Hero Header */}
          <div className="bg-gov-forest dark:bg-gov-forest/80 py-16 mb-8 animate-fade-in-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gov-gold/20 rounded-full mb-4">
                <Megaphone className="text-gov-gold" size={20} />
                <span className="text-gov-gold font-bold text-sm">
                  {language === 'ar' ? 'البوابة الرسمية' : 'Official Portal'}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                {language === 'ar' ? 'الإعلانات والمناقصات' : 'Announcements & Tenders'}
              </h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                {language === 'ar'
                  ? 'تابع أحدث الإعلانات الحكومية والمناقصات وفرص العمل والدورات التدريبية'
                  : 'Follow the latest government announcements, tenders, job opportunities, and training courses'}
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search & Filters */}
            <div className="bg-white dark:bg-gov-emeraldStatic rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Type Filter */}
                <div className="relative min-w-[180px]">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full py-3 px-4 pr-10 rtl:pr-4 rtl:pl-10 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal transition-colors appearance-none cursor-pointer"
                  >
                    {types.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>

                {/* Category Filter */}
                <div className="relative min-w-[180px]">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full py-3 px-4 pr-10 rtl:pr-4 rtl:pl-10 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal transition-colors appearance-none cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>

              {/* Results Count */}
              {!loading && (
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  {language === 'ar'
                    ? `عرض ${filteredAnnouncements.length} من ${announcements.length} إعلان`
                    : `Showing ${filteredAnnouncements.length} of ${announcements.length} announcements`}
                </div>
              )}
            </div>


            {/* Announcements List - 3x3 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full flex justify-center py-20">
                  <Loader2 className="animate-spin text-gov-teal" size={40} />
                </div>
              ) : filteredAnnouncements.map((announcement) => {
                const styles = getTypeStyles(announcement.type);
                return (
                  <Link
                    key={announcement.id}
                    href={`/announcements/${announcement.id}`}
                    className={`${styles.bg} ${styles.border} border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group block cursor-pointer flex flex-col h-full`}
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className={`${styles.badge} px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1`}>
                        {styles.icon}
                        {getTypeLabel(announcement.type)}
                      </span>
                      <span className="px-2.5 py-0.5 bg-gray-200 dark:bg-white/10 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 border border-transparent dark:border-white/10">
                        {announcement.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gov-forest dark:text-white mb-3 group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors line-clamp-2 min-h-[3.5rem]">
                      {getLocalizedField(announcement, 'title', language as 'ar' | 'en')}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {getLocalizedField(announcement, 'description', language as 'ar' | 'en')}
                    </p>

                    {/* Footer (Date & CTA) - Push to bottom */}
                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-400 text-xs">
                        <Calendar size={14} />
                        <span>{formatDate(announcement.date)}</span>
                      </div>

                      <div className="flex items-center gap-1 text-gov-teal dark:text-gov-gold font-bold text-sm group-hover:gap-2 transition-all">
                        <span>{language === 'ar' ? 'التفاصيل' : 'Details'}</span>
                        <ArrowIcon size={14} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>

                );
              })}
            </div>


            {/* Empty State */}
            {filteredAnnouncements.length === 0 && (
              <div className="text-center py-16">
                <Megaphone className="mx-auto text-gray-300 dark:text-gray-400 mb-4" size={64} />
                <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-2">
                  {language === 'ar' ? 'لا توجد إعلانات' : 'No Announcements Found'}
                </h3>
                <p className="text-gray-400 dark:text-gray-400">
                  {language === 'ar' ? 'جرب تغيير معايير البحث' : 'Try changing your search criteria'}
                </p>
              </div>
            )}
          </div>

          {/* FAQ Section */}
          <div className="mt-16 bg-white dark:bg-gov-emeraldStatic rounded-2xl p-8 border border-gray-100 dark:border-white/10">
            <h2 className="text-2xl font-display font-bold text-gov-forest dark:text-gov-gold mb-6">
              {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-4">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-white/5 rounded-xl font-bold text-gov-charcoal dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  {language === 'ar' ? 'كيف أتابع الإعلانات الجديدة؟' : 'How do I follow new announcements?'}
                  <ChevronDown size={16} className="text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="p-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {language === 'ar' ? 'يمكنك زيارة هذه الصفحة بانتظام أو الاشتراك في النشرة البريدية للحصول على إشعارات بالإعلانات الجديدة.' : 'You can visit this page regularly or subscribe to the newsletter for new announcement notifications.'}
                </p>
              </details>
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-white/5 rounded-xl font-bold text-gov-charcoal dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  {language === 'ar' ? 'ما الفرق بين أنواع الإعلانات؟' : 'What is the difference between announcement types?'}
                  <ChevronDown size={16} className="text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="p-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {language === 'ar' ? 'تتنوع الإعلانات بين عاجلة وهامة ومناقصات ووظائف وعامة، ويمكنك تصفيتها باستخدام القوائم أعلاه.' : 'Announcements vary between urgent, important, tenders, jobs, and general. You can filter them using the menus above.'}
                </p>
              </details>
            </div>
            <div className="mt-4 text-center">
              <Link href="/faq" className="text-gov-teal dark:text-gov-gold font-bold text-sm hover:underline">
                {language === 'ar' ? 'عرض جميع الأسئلة الشائعة ←' : '→ View all FAQs'}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
