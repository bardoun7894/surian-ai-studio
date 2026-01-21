import React from 'react';
import {
  Home,
  Building2,
  Scale,
  Newspaper,
  MessageSquare,
  Info,
  Database,
  Image,
  Layers,
  ChevronLeft,
  ChevronRight,
  User,
  FileText,
  Banknote,
  GraduationCap,
  HeartPulse,
  Car,
  Briefcase,
  Shield,
  Leaf,
  Search,
  HelpCircle,
  Star,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ViewState } from '../types';

interface SitemapPageProps {
  onNavigate: (view: ViewState) => void;
  onBack: () => void;
}

interface SitemapSection {
  titleAr: string;
  titleEn: string;
  icon: React.ReactNode;
  view?: ViewState;
  children?: { titleAr: string; titleEn: string; view?: ViewState }[];
}

const SitemapPage: React.FC<SitemapPageProps> = ({ onNavigate, onBack }) => {
  const { t, language } = useLanguage();

  const BackArrow = language === 'ar' ? ArrowRight : ArrowLeft;
  const ForwardArrow = language === 'ar' ? ChevronLeft : ChevronRight;

  const sitemapData: SitemapSection[] = [
    {
      titleAr: 'الصفحة الرئيسية',
      titleEn: 'Home',
      icon: <Home size={24} />,
      view: 'HOME'
    },
    {
      titleAr: 'دليل الجهات الحكومية',
      titleEn: 'Government Directory',
      icon: <Building2 size={24} />,
      view: 'DIRECTORATES',
      children: [
        { titleAr: 'وزارة الداخلية', titleEn: 'Ministry of Interior' },
        { titleAr: 'وزارة العدل', titleEn: 'Ministry of Justice' },
        { titleAr: 'وزارة الصحة', titleEn: 'Ministry of Health' },
        { titleAr: 'وزارة التربية', titleEn: 'Ministry of Education' },
        { titleAr: 'وزارة المالية', titleEn: 'Ministry of Finance' },
      ]
    },
    {
      titleAr: 'دليل الخدمات',
      titleEn: 'Services Guide',
      icon: <Layers size={24} />,
      view: 'SERVICES_GUIDE',
      children: [
        { titleAr: 'خدمات الأحوال المدنية', titleEn: 'Civil Status Services' },
        { titleAr: 'الخدمات المالية', titleEn: 'Financial Services' },
        { titleAr: 'خدمات التعليم', titleEn: 'Education Services' },
        { titleAr: 'خدمات الصحة', titleEn: 'Health Services' },
        { titleAr: 'خدمات النقل', titleEn: 'Transportation Services' },
      ]
    },
    {
      titleAr: 'المراسيم والقوانين',
      titleEn: 'Decrees & Laws',
      icon: <Scale size={24} />,
      view: 'DECREES',
      children: [
        { titleAr: 'المراسيم التشريعية', titleEn: 'Legislative Decrees' },
        { titleAr: 'القوانين', titleEn: 'Laws' },
        { titleAr: 'القرارات الرئاسية', titleEn: 'Presidential Decisions' },
        { titleAr: 'التعاميم', titleEn: 'Circulars' },
      ]
    },
    {
      titleAr: 'المركز الإعلامي',
      titleEn: 'Media Center',
      icon: <Image size={24} />,
      view: 'MEDIA_CENTER',
      children: [
        { titleAr: 'الأخبار', titleEn: 'News', view: 'NEWS_ARCHIVE' },
        { titleAr: 'الفيديوهات', titleEn: 'Videos' },
        { titleAr: 'الصور', titleEn: 'Photos' },
        { titleAr: 'الإنفوغرافيك', titleEn: 'Infographics' },
      ]
    },
    {
      titleAr: 'منظومة الشكاوى',
      titleEn: 'Complaints System',
      icon: <MessageSquare size={24} />,
      view: 'COMPLAINTS',
      children: [
        { titleAr: 'تقديم شكوى', titleEn: 'Submit Complaint' },
        { titleAr: 'تتبع الشكوى', titleEn: 'Track Complaint' },
        { titleAr: 'الشكاوى السابقة', titleEn: 'Previous Complaints' },
      ]
    },
    {
      titleAr: 'عن البوابة',
      titleEn: 'About Portal',
      icon: <Info size={24} />,
      view: 'ABOUT',
      children: [
        { titleAr: 'الرؤية والرسالة', titleEn: 'Vision & Mission' },
        { titleAr: 'الأهداف الاستراتيجية', titleEn: 'Strategic Goals' },
        { titleAr: 'فريق العمل', titleEn: 'Team' },
      ]
    },
    {
      titleAr: 'البيانات المفتوحة',
      titleEn: 'Open Data',
      icon: <Database size={24} />,
      view: 'OPEN_DATA',
      children: [
        { titleAr: 'الإحصائيات', titleEn: 'Statistics' },
        { titleAr: 'التقارير', titleEn: 'Reports' },
        { titleAr: 'البيانات الخام', titleEn: 'Raw Data' },
      ]
    },
    {
      titleAr: 'حساب المستخدم',
      titleEn: 'User Account',
      icon: <User size={24} />,
      children: [
        { titleAr: 'تسجيل الدخول', titleEn: 'Login' },
        { titleAr: 'إنشاء حساب', titleEn: 'Register' },
        { titleAr: 'لوحة التحكم', titleEn: 'Dashboard' },
        { titleAr: 'طلباتي', titleEn: 'My Applications' },
        { titleAr: 'الإشعارات', titleEn: 'Notifications' },
      ]
    },
  ];

  const serviceCategoriesMap = [
    { icon: <FileText size={20} />, titleAr: 'خدمات الأحوال المدنية', titleEn: 'Civil Status' },
    { icon: <Banknote size={20} />, titleAr: 'الخدمات المالية', titleEn: 'Financial' },
    { icon: <GraduationCap size={20} />, titleAr: 'خدمات التعليم', titleEn: 'Education' },
    { icon: <HeartPulse size={20} />, titleAr: 'خدمات الصحة', titleEn: 'Health' },
    { icon: <Car size={20} />, titleAr: 'خدمات النقل', titleEn: 'Transportation' },
    { icon: <Home size={20} />, titleAr: 'خدمات الإسكان', titleEn: 'Housing' },
    { icon: <Briefcase size={20} />, titleAr: 'خدمات العمل', titleEn: 'Employment' },
    { icon: <Building2 size={20} />, titleAr: 'خدمات المشاريع', titleEn: 'Projects' },
    { icon: <Shield size={20} />, titleAr: 'خدمات الأمن', titleEn: 'Security' },
    { icon: <Leaf size={20} />, titleAr: 'خدمات البيئة', titleEn: 'Environment' },
    { icon: <Search size={20} />, titleAr: 'خدمات الاستعلام', titleEn: 'Inquiry' },
    { icon: <HelpCircle size={20} />, titleAr: 'خدمات الدعم', titleEn: 'Support' },
    { icon: <Star size={20} />, titleAr: 'خدمات التقييم', titleEn: 'Feedback' },
  ];

  return (
    <div className="min-h-screen bg-gov-beige dark:bg-gov-forest pt-8 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gov-teal dark:text-gov-gold hover:underline mb-6 font-medium"
        >
          <BackArrow size={18} />
          <span>{t('sitemap_back')}</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gov-charcoal dark:text-white mb-4">
            {t('sitemap_title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {t('sitemap_subtitle')}
          </p>
        </div>

        {/* Main Sitemap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sitemapData.map((section, index) => (
            <div
              key={index}
              className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Section Header */}
              <div
                onClick={() => section.view && onNavigate(section.view)}
                className={`p-6 bg-gov-forest/5 dark:bg-gov-gold/5 border-b border-gray-100 dark:border-white/10 ${section.view ? 'cursor-pointer hover:bg-gov-forest/10 dark:hover:bg-gov-gold/10' : ''
                  } transition-colors`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gov-teal/10 dark:bg-gov-gold/10 flex items-center justify-center text-gov-teal dark:text-gov-gold">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-gov-charcoal dark:text-white">
                      {language === 'ar' ? section.titleAr : section.titleEn}
                    </h2>
                    {section.children && (
                      <p className="text-sm text-gray-400">
                        {section.children.length} {t('sitemap_sub_pages')}
                      </p>
                    )}
                  </div>
                  {section.view && <ForwardArrow className="text-gray-400" size={20} />}
                </div>
              </div>

              {/* Section Children */}
              {section.children && (
                <div className="p-4">
                  <ul className="space-y-2">
                    {section.children.map((child, childIndex) => (
                      <li key={childIndex}>
                        <button
                          onClick={() => child.view && onNavigate(child.view)}
                          className="w-full text-right rtl:text-right ltr:text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 text-sm transition-colors flex items-center justify-between"
                        >
                          <span>{language === 'ar' ? child.titleAr : child.titleEn}</span>
                          <ForwardArrow size={14} className="text-gray-300" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Service Categories Section */}
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-8">
          <h2 className="text-2xl font-display font-bold text-gov-charcoal dark:text-white mb-6 text-center">
            {t('sitemap_service_categories')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {serviceCategoriesMap.map((cat, index) => (
              <button
                key={index}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-black/20 hover:bg-gov-gold/10 transition-colors"
              >
                <div className="text-gov-teal dark:text-gov-gold">{cat.icon}</div>
                <span className="text-xs text-center text-gov-charcoal dark:text-white font-medium">
                  {language === 'ar' ? cat.titleAr : cat.titleEn}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SitemapPage;
