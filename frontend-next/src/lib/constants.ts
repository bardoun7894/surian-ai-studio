import { Directorate, Service, Article, NewsItem, Decree, MediaItem } from '@/types';

export const MOCK_MEDIA: MediaItem[] = [
  {
    id: 'm1',
    title: 'جولة السيد الوزير في معرض دمشق الدولي',
    type: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492619375932-d0234a62176c?auto=format&fit=crop&q=80&w=800',
    date: '2024-05-20',
    duration: '12:30'
  },
  {
    id: 'm2',
    title: 'افتتاح محطة توليد الكهرباء الجديدة',
    type: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800',
    date: '2024-05-18',
    duration: '05:45'
  },
  {
    id: 'm3',
    title: 'صور من حفل تكريم المبدعين',
    type: 'photo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    date: '2024-05-15',
    count: 24
  },
  {
    id: 'm4',
    title: 'إحصائيات التحول الرقمي 2024',
    type: 'infographic',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    date: '2024-05-10'
  },
  {
    id: 'm5',
    title: 'اجتماع مجلس الوزراء الأسبوعي',
    type: 'photo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    date: '2024-05-08',
    count: 15
  },
  {
    id: 'm6',
    title: 'مؤتمر الاستثمار السوري الأول',
    type: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800',
    date: '2024-05-05',
    duration: '45:00'
  }
];

export const DIRECTORATES: Directorate[] = [
  {
    id: 'd1',
    name: 'وزارة الداخلية',
    description: 'إدارة الأحوال المدنية، الجوازات، وشؤون الهجرة والمرور.',
    icon: 'ShieldAlert',
    servicesCount: 15
  },
  {
    id: 'd2',
    name: 'وزارة العدل',
    description: 'الخدمات القضائية، الوكالات، والمحاكم.',
    icon: 'Scale',
    servicesCount: 9
  },
  {
    id: 'd3',
    name: 'وزارة الصحة',
    description: 'الخدمات الطبية، المشافي، والتراخيص الصحية.',
    icon: 'HeartPulse',
    servicesCount: 8
  },
  {
    id: 'd4',
    name: 'وزارة التربية',
    description: 'شؤون المدارس، المناهج، والامتحانات.',
    icon: 'BookOpen',
    servicesCount: 12
  },
  {
    id: 'd5',
    name: 'وزارة التعليم العالي',
    description: 'الجامعات الحكومية، المنح، والبحث العلمي.',
    icon: 'GraduationCap',
    servicesCount: 10
  },
  {
    id: 'd6',
    name: 'وزارة الكهرباء',
    description: 'خدمات المشتركين، الفواتير، والشكاوى الكهربائية.',
    icon: 'Zap',
    servicesCount: 5
  },
  {
    id: 'd7',
    name: 'وزارة الموارد المائية',
    description: 'مياه الشرب، الصرف الصحي، والري.',
    icon: 'Droplets',
    servicesCount: 4
  },
  {
    id: 'd8',
    name: 'وزارة النقل',
    description: 'تراخيص المركبات، النقل البري والبحري والجوي.',
    icon: 'Plane',
    servicesCount: 7
  },
  {
    id: 'd9',
    name: 'وزارة الاتصالات',
    description: 'خدمات الإنترنت، البريد، والتوقيع الرقمي.',
    icon: 'Wifi',
    servicesCount: 6
  },
  {
    id: 'd10',
    name: 'وزارة المالية',
    description: 'الضرائب، الرسوم، والخدمات المالية.',
    icon: 'Banknote',
    servicesCount: 11
  },
  {
    id: 'd11',
    name: 'وزارة السياحة',
    description: 'تراخيص المنشآت السياحية والترويج.',
    icon: 'Map',
    servicesCount: 5
  },
  {
    id: 'd12',
    name: 'وزارة الصناعة',
    description: 'تراخيص المصانع والسجلات الصناعية.',
    icon: 'Factory',
    servicesCount: 8
  }
];

export const KEY_SERVICES: Service[] = [
  { id: 's1', title: 'إصدار جواز سفر إلكتروني', directorateId: 'd1', isDigital: true, description: 'تقديم طلب للحصول على جواز سفر جديد أو تجديده إلكترونياً.' },
  { id: 's2', title: 'خلاصة سجل عدلي (غير محكوم)', directorateId: 'd1', isDigital: true, description: 'الحصول على وثيقة غير محكوم إلكترونياً.' },
  { id: 's3', title: 'دفع المخالفات المرورية', directorateId: 'd1', isDigital: true, description: 'الاستعلام عن المخالفات المرورية وتسديدها.' },
  { id: 's4', title: 'الوكالات العدلية', directorateId: 'd2', isDigital: false, description: 'حجز موعد لتوثيق الوكالات العدلية.' },
  { id: 's5', title: 'بيان ملكية عقارية', directorateId: 'd2', isDigital: true, description: 'الحصول على بيان يوضح الملكيات العقارية.' },
  { id: 's6', title: 'نتائج التحاليل الطبية', directorateId: 'd3', isDigital: true, description: 'الاطلاع على نتائج التحاليل من المخابر المعتمدة.' },
  { id: 's7', title: 'نتائج الامتحانات العامة', directorateId: 'd4', isDigital: true, description: 'عرض نتائج الشهادات الإعدادية والثانوية.' },
  { id: 's8', title: 'تسلسل دراسي', directorateId: 'd4', isDigital: false, description: 'طلب وثيقة تسلسل دراسي من المؤسسات التعليمية.' },
  { id: 's9', title: 'المفاضلة الجامعية', directorateId: 'd5', isDigital: true, description: 'التقدم للمفاضلة الجامعية للعام الدراسي.' },
  { id: 's10', title: 'كشف علامات جامعي', directorateId: 'd5', isDigital: true, description: 'استخراج كشف علامات للسنوات الدراسية.' },
  { id: 's11', title: 'دفع فاتورة الكهرباء', directorateId: 'd6', isDigital: true, description: 'تسديد فواتير الكهرباء إلكترونياً.' },
  { id: 's12', title: 'طلب عداد جديد', directorateId: 'd6', isDigital: false, description: 'تقديم طلب لتركيب عداد كهرباء جديد.' },
  { id: 's13', title: 'دفع فاتورة المياه', directorateId: 'd7', isDigital: true, description: 'تسديد فواتير المياه إلكترونياً.' },
  { id: 's14', title: 'تجديد ترخيص مركبة', directorateId: 'd8', isDigital: true, description: 'تجديد ترسيم المركبات إلكترونياً.' },
  { id: 's15', title: 'بوابة خدمة المواطن', directorateId: 'd9', isDigital: true, description: 'منصة موحدة لكافة الخدمات الإلكترونية.' },
  { id: 's16', title: 'براءة ذمة مالية', directorateId: 'd10', isDigital: true, description: 'الحصول على براءة ذمة من الدوائر المالية.' },
  { id: 's17', title: 'التحقق الضريبي', directorateId: 'd10', isDigital: true, description: 'خدمة التحقق من الوثائق الضريبية.' },
];

export const COMPLAINT_CATEGORIES = [
  'خدمات إلكترونية',
  'أداء إداري',
  'بنية تحتية',
  'خدمات صحية',
  'مقترحات تطوير',
  'فساد إداري'
];

export const OFFICIAL_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'رئاسة مجلس الوزراء تقر خطة التحول الرقمي الشامل لعام 2024',
    date: '2024-05-21',
    category: 'رئاسة الوزراء',
    summary: 'أقر مجلس الوزراء في جلسته الأسبوعية الخطة الوطنية للتحول الرقمي التي تهدف إلى أتمتة كافة الخدمات الحكومية بحلول نهاية العام.',
    imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&q=80&w=600',
    isUrgent: true
  },
  {
    id: 'n2',
    title: 'وزارة الاتصالات تطلق بوابة الخدمات الإلكترونية الجديدة',
    date: '2024-05-20',
    category: 'تكنولوجيا',
    summary: 'أعلنت وزارة الاتصالات والتقانة عن إطلاق النسخة المحدثة من بوابة المواطن.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'n3',
    title: 'مرسوم تشريعي بتعديل رسوم الخدمات القنصلية',
    date: '2024-05-19',
    category: 'مراسيم',
    summary: 'صدر المرسوم التشريعي القاضي بتعديل بعض الرسوم القنصلية لتسهيل الإجراءات على المغتربين.',
    isUrgent: false
  },
  {
    id: 'n4',
    title: 'افتتاح مركز خدمة المواطن الجديد في دمشق',
    date: '2024-05-18',
    category: 'خدمات',
    summary: 'تم افتتاح مركز جديد لخدمة المواطن يقدم أكثر من 50 خدمة حكومية في مكان واحد.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600'
  }
];

export const BREAKING_NEWS = [
  "رئاسة مجلس الوزراء: عطلة رسمية بمناسبة عيد الشهداء يوم الاثنين القادم.",
  "وزارة التربية: صدور نتائج امتحانات التعليم الأساسي.",
  "وزارة الصحة: حملة تلقيح وطنية شاملة تنطلق الأحد القادم."
];

export const HERO_ARTICLE: Article = {
  title: "استراتيجية الحكومة الإلكترونية",
  excerpt: "نحو قطاع عام كفء وشفاف وفعال يخدم المواطن السوري بأحدث التقنيات.",
  category: "رؤية 2030",
  date: "20 مايو 2024",
  author: "المكتب الإعلامي",
  readTime: "5 دقائق",
  imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000"
};

export const GRID_ARTICLES: Article[] = [
  {
    title: "مشروع الطاقة المتجددة في حمص",
    excerpt: "تدشين المرحلة الأولى من محطة الطاقة الشمسية بقدرة 50 ميغاواط لدعم الشبكة الكهربائية.",
    category: "طاقة",
    date: "2024-05-15",
    author: "وزارة الكهرباء",
    readTime: "3 دقائق",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "تحديث المناهج الجامعية",
    excerpt: "إدخال تخصصات الذكاء الاصطناعي والأمن السيبراني في خمس جامعات حكومية جديدة.",
    category: "تعليم عالي",
    date: "2024-05-10",
    author: "وزارة التعليم العالي",
    readTime: "4 دقائق",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "مهرجان التسوق الشهري",
    excerpt: "انطلاق فعاليات مهرجان التسوق 'صنع في سوريا' بمشاركة واسعة من الشركات الصناعية.",
    category: "اقتصاد",
    date: "2024-05-08",
    author: "غرفة الصناعة",
    readTime: "2 دقائق",
    imageUrl: "https://images.unsplash.com/photo-1472851294608-41510501529f?auto=format&fit=crop&q=80&w=600"
  }
];

export const DECREES: Decree[] = [
  {
    id: 'dec1',
    number: '37',
    year: '2024',
    title: 'قانون تنظيم التحول الرقمي في المؤسسات الحكومية',
    type: 'قانون',
    date: '2024-04-15',
    description: 'يحدد هذا القانون الضوابط والمعايير الخاصة بالتحول الرقمي وإلزامية الأتمتة في الوزارات.'
  },
  {
    id: 'dec2',
    number: '12',
    year: '2024',
    title: 'مرسوم تشريعي بزيادة الرواتب والأجور',
    type: 'مرسوم تشريعي',
    date: '2024-02-05',
    description: 'زيادة بنسبة 50% على الرواتب والأجور المقطوعة للعاملين في الدولة.'
  },
  {
    id: 'dec3',
    number: '105',
    year: '2023',
    title: 'قرار بتسهيل إجراءات ترخيص المشاريع الصغيرة',
    type: 'قرار رئاسي',
    date: '2023-11-20',
    description: 'تبسيط الإجراءات الإدارية وتخفيض الرسوم لدعم المشاريع الصغيرة والمتناهية الصغر.'
  },
  {
    id: 'dec4',
    number: '8',
    year: '2023',
    title: 'قانون حماية المستهلك الجديد',
    type: 'قانون',
    date: '2023-08-10',
    description: 'تشديد العقوبات على المخالفات التموينية وضبط الأسواق.'
  },
  {
    id: 'dec5',
    number: '4',
    year: '2024',
    title: 'تعميم بخصوص دوام الجهات العامة في شهر رمضان',
    type: 'تعميم',
    date: '2024-03-01',
    description: 'تحديد ساعات الدوام الرسمي في شهر رمضان المبارك.'
  }
];

export const MOCK_ANNOUNCEMENTS = [
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
  }
];

