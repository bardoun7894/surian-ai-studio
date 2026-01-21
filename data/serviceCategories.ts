import React from 'react';
import {
  User,
  Banknote,
  GraduationCap,
  HeartPulse,
  Car,
  Home,
  Briefcase,
  Building,
  Shield,
  Leaf,
  FileText,
  Search,
  HelpCircle,
  Star
} from 'lucide-react';
import { ServiceCategory } from '../components/ServiceCategoryPage';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'civil-status',
    titleAr: 'خدمات الأحوال المدنية',
    titleEn: 'Civil Status Services',
    descriptionAr: 'خدمات تسجيل الولادات والوفيات وعقود الزواج والوثائق الشخصية',
    descriptionEn: 'Birth, death, marriage registration and personal documents',
    icon: React.createElement(User, { size: 36 }),
    color: 'from-blue-600 to-blue-800',
    services: [
      {
        id: 'birth-cert',
        title: 'شهادة ميلاد',
        description: 'استخراج شهادة ميلاد أصلية أو بدل ضائع',
        isDigital: true,
        estimatedTime: '3 أيام',
        requirements: ['صورة عن الهوية', 'دفتر العائلة'],
        fees: '5,000 ل.س'
      },
      {
        id: 'death-cert',
        title: 'شهادة وفاة',
        description: 'استخراج شهادة وفاة رسمية',
        isDigital: true,
        estimatedTime: '3 أيام',
        requirements: ['تقرير طبي', 'هوية المتوفى'],
        fees: '5,000 ل.س'
      },
      {
        id: 'marriage-contract',
        title: 'عقد زواج',
        description: 'توثيق عقد الزواج الرسمي',
        isDigital: false,
        estimatedTime: '7 أيام',
        requirements: ['هوية الطرفين', 'شهادة فحص طبي', 'موافقة الولي'],
        fees: '25,000 ل.س'
      },
      {
        id: 'family-book',
        title: 'دفتر عائلة',
        description: 'استخراج دفتر عائلة جديد أو بدل ضائع',
        isDigital: false,
        estimatedTime: '15 يوم',
        requirements: ['عقد الزواج', 'هوية رب الأسرة'],
        fees: '15,000 ل.س'
      },
      {
        id: 'id-card',
        title: 'البطاقة الشخصية',
        description: 'استخراج بطاقة شخصية جديدة أو تجديدها',
        isDigital: false,
        estimatedTime: '30 يوم',
        requirements: ['صور شخصية', 'إخراج قيد مدني'],
        fees: '10,000 ل.س'
      },
      {
        id: 'civil-record',
        title: 'إخراج قيد مدني',
        description: 'استخراج بيان قيد مدني فردي أو عائلي',
        isDigital: true,
        estimatedTime: 'فوري',
        requirements: ['الرقم الوطني'],
        fees: '2,000 ل.س'
      }
    ]
  },
  {
    id: 'financial',
    titleAr: 'الخدمات المالية',
    titleEn: 'Financial Services',
    descriptionAr: 'الضرائب والرسوم والبراءات المالية والخدمات المصرفية الحكومية',
    descriptionEn: 'Taxes, fees, financial clearances and government banking',
    icon: React.createElement(Banknote, { size: 36 }),
    color: 'from-green-600 to-green-800',
    services: [
      {
        id: 'tax-declaration',
        title: 'الإقرار الضريبي',
        description: 'تقديم الإقرار الضريبي السنوي إلكترونياً',
        isDigital: true,
        estimatedTime: 'فوري',
        requirements: ['الرقم الضريبي', 'البيانات المالية'],
        fees: 'حسب الشريحة'
      },
      {
        id: 'financial-clearance',
        title: 'براءة ذمة مالية',
        description: 'الحصول على براءة ذمة من الدوائر المالية',
        isDigital: true,
        estimatedTime: '5 أيام',
        requirements: ['الرقم الوطني', 'آخر إقرار ضريبي'],
        fees: '10,000 ل.س'
      },
      {
        id: 'customs-fees',
        title: 'دفع الرسوم الجمركية',
        description: 'تسديد الرسوم الجمركية على البضائع',
        isDigital: true,
        estimatedTime: 'فوري',
        requirements: ['البيان الجمركي'],
        fees: 'حسب البضاعة'
      },
      {
        id: 'business-license-fee',
        title: 'رسوم الترخيص التجاري',
        description: 'دفع رسوم تجديد الرخصة التجارية',
        isDigital: true,
        estimatedTime: 'فوري',
        requirements: ['رقم السجل التجاري'],
        fees: 'حسب النشاط'
      }
    ]
  },
  {
    id: 'education',
    titleAr: 'خدمات التعليم',
    titleEn: 'Education Services',
    descriptionAr: 'التسجيل والنتائج والشهادات التعليمية للمدارس والجامعات',
    descriptionEn: 'Registration, results and certificates for schools and universities',
    icon: React.createElement(GraduationCap, { size: 36 }),
    color: 'from-purple-600 to-purple-800',
    services: [
      {
        id: 'school-registration',
        title: 'التسجيل في المدارس',
        description: 'تسجيل الطلاب في المدارس الحكومية',
        isDigital: true,
        estimatedTime: '3 أيام',
        requirements: ['شهادة الميلاد', 'صور شخصية', 'شهادة الصف السابق'],
        fees: 'مجانية'
      },
      {
        id: 'exam-results',
        title: 'نتائج الامتحانات',
        description: 'الاستعلام عن نتائج الشهادات الرسمية',
        isDigital: true,
        estimatedTime: 'فوري',
        requirements: ['رقم الاكتتاب'],
        fees: 'مجانية'
      },
      {
        id: 'academic-certificate',
        title: 'الشهادات الأكاديمية',
        description: 'استخراج صورة مصدقة عن الشهادات',
        isDigital: false,
        estimatedTime: '7 أيام',
        requirements: ['الشهادة الأصلية', 'هوية'],
        fees: '5,000 ل.س'
      },
      {
        id: 'university-admission',
        title: 'المفاضلة الجامعية',
        description: 'التقدم للمفاضلة الجامعية',
        isDigital: true,
        estimatedTime: 'حسب الموسم',
        requirements: ['شهادة الثانوية', 'الرقم الوطني'],
        fees: '10,000 ل.س'
      },
      {
        id: 'transcript',
        title: 'كشف العلامات',
        description: 'استخراج كشف علامات جامعي',
        isDigital: true,
        estimatedTime: '3 أيام',
        requirements: ['الرقم الجامعي'],
        fees: '3,000 ل.س'
      }
    ]
  },
  {
    id: 'health',
    titleAr: 'خدمات الصحة',
    titleEn: 'Health Services',
    descriptionAr: 'المواعيد الطبية والتقارير الصحية والتأمين الصحي',
    descriptionEn: 'Medical appointments, health reports and health insurance',
    icon: React.createElement(HeartPulse, { size: 36 }),
    color: 'from-red-500 to-red-700',
    services: [
      {
        id: 'medical-appointment',
        title: 'حجز موعد طبي',
        description: 'حجز موعد في المشافي الحكومية',
        isDigital: true,
        estimatedTime: 'فوري',
        requirements: ['الرقم الوطني'],
        fees: 'مجانية'
      },
      {
        id: 'lab-results',
        title: 'نتائج التحاليل',
        description: 'الاطلاع على نتائج التحاليل المخبرية',
        isDigital: true,
        estimatedTime: 'فوري',
        requirements: ['رقم الملف الطبي'],
        fees: 'مجانية'
      },
      {
        id: 'health-card',
        title: 'البطاقة الصحية',
        description: 'استخراج بطاقة صحية للعلاج المجاني',
        isDigital: false,
        estimatedTime: '15 يوم',
        requirements: ['إثبات الدخل', 'هوية'],
        fees: 'مجانية'
      },
      {
        id: 'medical-report',
        title: 'تقرير طبي',
        description: 'استخراج تقرير طبي رسمي',
        isDigital: false,
        estimatedTime: '3 أيام',
        requirements: ['ملف المريض'],
        fees: '5,000 ل.س'
      }
    ]
  },
  {
    id: 'transportation',
    titleAr: 'خدمات النقل والسياحة',
    titleEn: 'Transportation & Tourism',
    descriptionAr: 'رخص القيادة وتسجيل المركبات وجوازات السفر',
    descriptionEn: 'Driving licenses, vehicle registration and passports',
    icon: React.createElement(Car, { size: 36 }),
    color: 'from-orange-500 to-orange-700',
    services: [
      {
        id: 'driving-license',
        title: 'رخصة القيادة',
        description: 'استخراج أو تجديد رخصة القيادة',
        isDigital: false,
        estimatedTime: '30 يوم',
        requirements: ['شهادة صحية', 'صور شخصية', 'اجتياز الاختبار'],
        fees: '50,000 ل.س'
      },
      {
        id: 'vehicle-registration',
        title: 'تسجيل مركبة',
        description: 'تسجيل مركبة جديدة أو نقل ملكية',
        isDigital: false,
        estimatedTime: '7 أيام',
        requirements: ['عقد البيع', 'فحص فني'],
        fees: 'حسب المركبة'
      },
      {
        id: 'passport',
        title: 'جواز السفر',
        description: 'استخراج أو تجديد جواز السفر',
        isDigital: true,
        estimatedTime: '30 يوم',
        requirements: ['هوية', 'صور بيومترية', 'دفع الرسوم'],
        fees: '100,000 ل.س'
      },
      {
        id: 'traffic-fines',
        title: 'المخالفات المرورية',
        description: 'الاستعلام عن المخالفات وتسديدها',
        isDigital: true,
        estimatedTime: 'فوري',
        requirements: ['رقم اللوحة أو الرخصة'],
        fees: 'حسب المخالفة'
      }
    ]
  },
  {
    id: 'housing',
    titleAr: 'خدمات الإسكان',
    titleEn: 'Housing Services',
    descriptionAr: 'الملكية العقارية والقروض السكنية وخدمات البناء',
    descriptionEn: 'Property ownership, housing loans and construction',
    icon: React.createElement(Home, { size: 36 }),
    color: 'from-teal-600 to-teal-800',
    services: [
      {
        id: 'property-deed',
        title: 'بيان ملكية عقارية',
        description: 'استخراج بيان ملكية من السجل العقاري',
        isDigital: true,
        estimatedTime: '3 أيام',
        requirements: ['رقم العقار', 'هوية المالك'],
        fees: '10,000 ل.س'
      },
      {
        id: 'building-permit',
        title: 'رخصة بناء',
        description: 'الحصول على رخصة بناء جديد',
        isDigital: false,
        estimatedTime: '60 يوم',
        requirements: ['مخططات هندسية', 'سند ملكية'],
        fees: 'حسب المساحة'
      },
      {
        id: 'housing-loan',
        title: 'قرض سكني',
        description: 'التقدم لقرض سكني حكومي',
        isDigital: true,
        estimatedTime: '90 يوم',
        requirements: ['إثبات دخل', 'ضمانات'],
        fees: 'مجانية'
      }
    ]
  },
  {
    id: 'employment',
    titleAr: 'خدمات العمل والتوظيف',
    titleEn: 'Employment Services',
    descriptionAr: 'البحث عن وظائف وشهادات الخدمة والتأمينات',
    descriptionEn: 'Job search, service certificates and insurance',
    icon: React.createElement(Briefcase, { size: 36 }),
    color: 'from-indigo-600 to-indigo-800',
    services: [
      {
        id: 'job-search',
        title: 'البحث عن وظيفة',
        description: 'تصفح الوظائف الحكومية المتاحة',
        isDigital: true,
        estimatedTime: 'فوري',
        requirements: ['سيرة ذاتية'],
        fees: 'مجانية'
      },
      {
        id: 'service-certificate',
        title: 'شهادة خدمة',
        description: 'استخراج شهادة خدمة للموظفين',
        isDigital: true,
        estimatedTime: '3 أيام',
        requirements: ['الرقم الوظيفي'],
        fees: '2,000 ل.س'
      },
      {
        id: 'social-insurance',
        title: 'التأمينات الاجتماعية',
        description: 'الاستعلام عن التأمينات والمستحقات',
        isDigital: true,
        estimatedTime: 'فوري',
        requirements: ['الرقم التأميني'],
        fees: 'مجانية'
      }
    ]
  },
  {
    id: 'projects',
    titleAr: 'خدمات المشاريع والتنمية',
    titleEn: 'Projects & Development',
    descriptionAr: 'تسجيل المشاريع والتمويل والدعم الحكومي',
    descriptionEn: 'Project registration, financing and government support',
    icon: React.createElement(Building, { size: 36 }),
    color: 'from-amber-600 to-amber-800',
    services: [
      {
        id: 'project-registration',
        title: 'تسجيل مشروع',
        description: 'تسجيل مشروع صغير أو متوسط',
        isDigital: true,
        estimatedTime: '15 يوم',
        requirements: ['خطة عمل', 'وثائق قانونية'],
        fees: '50,000 ل.س'
      },
      {
        id: 'gov-support',
        title: 'طلب دعم حكومي',
        description: 'التقدم للحصول على دعم حكومي',
        isDigital: true,
        estimatedTime: '30 يوم',
        requirements: ['دراسة جدوى'],
        fees: 'مجانية'
      }
    ]
  },
  {
    id: 'security',
    titleAr: 'خدمات الأمن والسلامة',
    titleEn: 'Security & Safety',
    descriptionAr: 'السجل العدلي والبلاغات والتصاريح الأمنية',
    descriptionEn: 'Criminal record, reports and security permits',
    icon: React.createElement(Shield, { size: 36 }),
    color: 'from-slate-600 to-slate-800',
    services: [
      {
        id: 'criminal-record',
        title: 'السجل العدلي',
        description: 'استخراج وثيقة غير محكوم',
        isDigital: true,
        estimatedTime: '7 أيام',
        requirements: ['هوية', 'صورة شخصية'],
        fees: '5,000 ل.س'
      },
      {
        id: 'police-report',
        title: 'بلاغ شرطة',
        description: 'تقديم بلاغ إلكتروني',
        isDigital: true,
        estimatedTime: 'فوري',
        requirements: ['تفاصيل الحادثة'],
        fees: 'مجانية'
      },
      {
        id: 'security-permit',
        title: 'تصريح أمني',
        description: 'طلب تصريح لفعالية أو نشاط',
        isDigital: false,
        estimatedTime: '15 يوم',
        requirements: ['خطة الفعالية'],
        fees: '25,000 ل.س'
      }
    ]
  },
  {
    id: 'environment',
    titleAr: 'خدمات البيئة والزراعة',
    titleEn: 'Environment & Agriculture',
    descriptionAr: 'الرخص الزراعية والاستشارات البيئية',
    descriptionEn: 'Agricultural licenses and environmental consultations',
    icon: React.createElement(Leaf, { size: 36 }),
    color: 'from-lime-600 to-lime-800',
    services: [
      {
        id: 'farm-license',
        title: 'رخصة مزرعة',
        description: 'الحصول على رخصة لمشروع زراعي',
        isDigital: false,
        estimatedTime: '30 يوم',
        requirements: ['سند ملكية الأرض', 'دراسة بيئية'],
        fees: '100,000 ل.س'
      },
      {
        id: 'agricultural-support',
        title: 'الدعم الزراعي',
        description: 'التقدم لبرامج الدعم الزراعي',
        isDigital: true,
        estimatedTime: '15 يوم',
        requirements: ['إثبات ملكية أو استثمار'],
        fees: 'مجانية'
      }
    ]
  },
  {
    id: 'inquiry',
    titleAr: 'خدمات الاستعلام والبحث',
    titleEn: 'Inquiry & Search',
    descriptionAr: 'البحث في الأرشيف والاستعلامات العامة',
    descriptionEn: 'Archive search and general inquiries',
    icon: React.createElement(Search, { size: 36 }),
    color: 'from-cyan-600 to-cyan-800',
    services: [
      {
        id: 'document-search',
        title: 'البحث في الأرشيف',
        description: 'البحث عن وثائق في الأرشيف الوطني',
        isDigital: true,
        estimatedTime: 'فوري',
        requirements: [],
        fees: 'مجانية'
      },
      {
        id: 'general-inquiry',
        title: 'استعلام عام',
        description: 'الاستعلام عن أي معاملة حكومية',
        isDigital: true,
        estimatedTime: 'فوري',
        requirements: ['رقم المعاملة'],
        fees: 'مجانية'
      }
    ]
  },
  {
    id: 'support',
    titleAr: 'خدمات الدعم والمساعدة',
    titleEn: 'Support & Assistance',
    descriptionAr: 'الدعم الفني والمساعدة الاجتماعية',
    descriptionEn: 'Technical support and social assistance',
    icon: React.createElement(HelpCircle, { size: 36 }),
    color: 'from-pink-600 to-pink-800',
    services: [
      {
        id: 'tech-support',
        title: 'الدعم الفني',
        description: 'الحصول على مساعدة تقنية',
        isDigital: true,
        estimatedTime: 'فوري',
        requirements: [],
        fees: 'مجانية'
      },
      {
        id: 'social-assistance',
        title: 'المساعدة الاجتماعية',
        description: 'التقدم لبرامج المساعدة الاجتماعية',
        isDigital: true,
        estimatedTime: '30 يوم',
        requirements: ['إثبات الحاجة'],
        fees: 'مجانية'
      }
    ]
  },
  {
    id: 'feedback',
    titleAr: 'خدمات التقييم والملاحظات',
    titleEn: 'Feedback & Rating',
    descriptionAr: 'تقييم الخدمات وتقديم الاقتراحات',
    descriptionEn: 'Rate services and submit suggestions',
    icon: React.createElement(Star, { size: 36 }),
    color: 'from-yellow-500 to-yellow-700',
    services: [
      {
        id: 'service-rating',
        title: 'تقييم الخدمات',
        description: 'تقييم جودة الخدمات الحكومية',
        isDigital: true,
        estimatedTime: 'فوري',
        requirements: [],
        fees: 'مجانية'
      },
      {
        id: 'suggestion',
        title: 'تقديم اقتراح',
        description: 'تقديم اقتراح لتحسين الخدمات',
        isDigital: true,
        estimatedTime: 'فوري',
        requirements: [],
        fees: 'مجانية'
      }
    ]
  },
  {
    id: 'digital-services',
    titleAr: 'الخدمات الإلكترونية',
    titleEn: 'Digital Services',
    descriptionAr: 'الهوية الرقمية وإدارة الحساب',
    descriptionEn: 'Digital ID and account management',
    icon: React.createElement(FileText, { size: 36 }),
    color: 'from-violet-600 to-violet-800',
    services: [
      {
        id: 'digital-id',
        title: 'الهوية الرقمية',
        description: 'الحصول على معرف رقمي موحد',
        isDigital: true,
        estimatedTime: '7 أيام',
        requirements: ['هوية شخصية', 'رقم هاتف'],
        fees: 'مجانية'
      },
      {
        id: 'account-link',
        title: 'ربط الحسابات',
        description: 'ربط حساباتك في الجهات الحكومية',
        isDigital: true,
        estimatedTime: 'فوري',
        requirements: ['تسجيل دخول'],
        fees: 'مجانية'
      }
    ]
  }
];

export const getServiceCategoryById = (id: string): ServiceCategory | undefined => {
  return SERVICE_CATEGORIES.find(cat => cat.id === id);
};
