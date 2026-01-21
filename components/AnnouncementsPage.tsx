import React, { useState } from 'react';
import { Megaphone, Calendar, ArrowLeft, ArrowRight, Bell, AlertCircle, Search, Filter, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

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
    title: 'إعلان عن مناقصة عامة لتوريد معدات تقنية',
    date: '2025-01-12',
    type: 'tender',
    category: 'مناقصات',
    description: 'تعلن رئاسة مجلس الوزراء عن مناقصة عامة لتوريد معدات تقنية وأجهزة حاسوبية للوزارات والمؤسسات الحكومية. آخر موعد للتقديم: 30/01/2025'
  },
  {
    id: '2',
    title: 'تمديد مهلة تقديم طلبات التوظيف',
    date: '2025-01-10',
    type: 'urgent',
    category: 'توظيف',
    description: 'تم تمديد مهلة تقديم طلبات التوظيف للمسابقة المركزية حتى نهاية الشهر الحالي. يرجى من جميع المتقدمين استكمال أوراقهم'
  },
  {
    id: '3',
    title: 'دورة تدريبية في الإدارة الإلكترونية',
    date: '2025-01-08',
    type: 'general',
    category: 'تدريب',
    description: 'إعلان عن دورة تدريبية مجانية في الإدارة الإلكترونية للموظفين الحكوميين. التسجيل مفتوح حتى 15/01/2025'
  },
  {
    id: '4',
    title: 'تحديث نظام المعاملات الإلكترونية',
    date: '2025-01-05',
    type: 'important',
    category: 'تقنية',
    description: 'سيتم تحديث نظام المعاملات الإلكترونية يوم السبت القادم من الساعة 12 ليلاً حتى 6 صباحاً. نعتذر عن أي إزعاج'
  },
  {
    id: '5',
    title: 'فرص عمل جديدة في القطاع الحكومي',
    date: '2025-01-03',
    type: 'job',
    category: 'توظيف',
    description: 'إعلان عن وظائف شاغرة في عدة وزارات ومؤسسات حكومية تشمل: محاسبين، مهندسين، إداريين'
  },
  {
    id: '6',
    title: 'مناقصة لتأهيل مباني حكومية',
    date: '2025-01-02',
    type: 'tender',
    category: 'مناقصات',
    description: 'إعلان عن مناقصة لتأهيل وصيانة مباني حكومية في محافظة دمشق. كراسة الشروط متوفرة في مقر الوزارة'
  },
  {
    id: '7',
    title: 'تعليق العمل بسبب العطلة الرسمية',
    date: '2024-12-30',
    type: 'important',
    category: 'إداري',
    description: 'تعلن رئاسة مجلس الوزراء عن تعليق العمل في الدوائر الحكومية خلال فترة عطلة رأس السنة'
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
    title: 'مسابقة توظيف في وزارة المالية',
    date: '2024-12-25',
    type: 'job',
    category: 'توظيف',
    description: 'تعلن وزارة المالية عن مسابقة لتعيين 50 موظفاً في الفئة الثانية من حملة الإجازة الجامعية'
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

const AnnouncementsPage: React.FC = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
          bg: 'bg-gov-red/5 dark:bg-gov-red/10',
          border: 'border-gov-red/20 dark:border-gov-red/30',
          badge: 'bg-gov-red text-white',
          icon: <AlertCircle size={14} />
        };
      case 'important':
        return {
          bg: 'bg-gov-gold/10 dark:bg-gov-gold/10',
          border: 'border-gov-gold/30 dark:border-gov-gold/30',
          badge: 'bg-gov-gold text-gov-forest',
          icon: <Bell size={14} />
        };
      case 'tender':
        return {
          bg: 'bg-gov-teal/5 dark:bg-gov-teal/10',
          border: 'border-gov-teal/20 dark:border-gov-teal/30',
          badge: 'bg-gov-teal text-white',
          icon: <Megaphone size={14} />
        };
      case 'job':
        return {
          bg: 'bg-gov-emeraldLight/5 dark:bg-gov-emeraldLight/10',
          border: 'border-gov-emeraldLight/20 dark:border-gov-emeraldLight/30',
          badge: 'bg-gov-emeraldLight text-white',
          icon: <Megaphone size={14} />
        };
      default:
        return {
          bg: 'bg-gov-sand/5 dark:bg-white/5',
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

  const filteredAnnouncements = MOCK_ANNOUNCEMENTS.filter(announcement => {
    const matchesSearch = announcement.title.includes(searchQuery) ||
                         announcement.description.includes(searchQuery);
    const matchesType = selectedType === 'all' || announcement.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || announcement.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-gov-beige dark:bg-gov-forest pb-16">
      {/* Hero Header */}
      <div className="bg-gov-forest dark:bg-gov-forest/80 py-16 mb-8">
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
        <div className="bg-white dark:bg-white/5 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ar' ? 'ابحث في الإعلانات...' : 'Search announcements...'}
                className="w-full py-3 px-4 pr-12 rtl:pr-4 rtl:pl-12 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-teal transition-colors"
              />
              <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>

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
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {language === 'ar'
              ? `عرض ${filteredAnnouncements.length} من ${MOCK_ANNOUNCEMENTS.length} إعلان`
              : `Showing ${filteredAnnouncements.length} of ${MOCK_ANNOUNCEMENTS.length} announcements`}
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => {
            const styles = getTypeStyles(announcement.type);
            return (
              <article
                key={announcement.id}
                className={`${styles.bg} ${styles.border} border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer`}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Content */}
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className={`${styles.badge} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                        {styles.icon}
                        {getTypeLabel(announcement.type)}
                      </span>
                      <span className="px-3 py-1 bg-gray-200 dark:bg-white/20 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                        {announcement.category}
                      </span>
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                        <Calendar size={14} />
                        <span>{formatDate(announcement.date)}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gov-forest dark:text-white mb-2 group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors">
                      {announcement.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {announcement.description}
                    </p>

                    {/* Read More */}
                    <div className="flex items-center gap-2 text-gov-teal dark:text-gov-gold font-bold text-sm group-hover:gap-3 transition-all">
                      <span>{language === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
                      <ArrowIcon size={16} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-16">
            <Megaphone className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-2">
              {language === 'ar' ? 'لا توجد إعلانات' : 'No Announcements Found'}
            </h3>
            <p className="text-gray-400 dark:text-gray-500">
              {language === 'ar' ? 'جرب تغيير معايير البحث' : 'Try changing your search criteria'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
