import { Directorate, Service, Article, NewsItem, Decree, MediaItem } from '@/types';

export const MOCK_MEDIA: MediaItem[] = [
  {
    id: 'm1',
    title: 'جولة السيد الوزير في معرض دمشق الدولي للصناعات',
    type: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492619375932-d0234a62176c?auto=format&fit=crop&q=80&w=800',
    date: '2024-05-20',
    duration: '12:30'
  },
  {
    id: 'm2',
    title: 'افتتاح المنطقة الصناعية الجديدة في عدرا',
    type: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800',
    date: '2024-05-18',
    duration: '05:45'
  },
  {
    id: 'm3',
    title: 'صور من حفل تكريم المصنعين المتميزين',
    type: 'photo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    date: '2024-05-15',
    count: 24
  },
  {
    id: 'm4',
    title: 'إحصائيات القطاع الصناعي 2024',
    type: 'infographic',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    date: '2024-05-10'
  },
  {
    id: 'm5',
    title: 'اجتماع الإدارة العامة للصناعة مع المستثمرين',
    type: 'photo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    date: '2024-05-08',
    count: 15
  },
  {
    id: 'm6',
    title: 'مؤتمر تطوير المشاريع الصغيرة والمتوسطة',
    type: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800',
    date: '2024-05-05',
    duration: '45:00'
  }
];

export const DIRECTORATES: Directorate[] = [
  {
    id: 'd1',
    name: { ar: 'الإدارة العامة للصناعة', en: 'General Administration for Industry' },
    description: { ar: 'إدارة شؤون الصناعة والمصانع والمناطق الصناعية والمواصفات والمقاييس.', en: 'Management of industry, factories, industrial zones, and standards.' },
    icon: 'Factory',
    servicesCount: 6,
    subDirectorates: [
      { id: 'i1', name: { ar: 'مؤسسات ومعامل القطاع العام', en: 'Public Sector Institutions & Factories' }, url: '#' },
      { id: 'i2', name: { ar: 'مركز التنمية الصناعية', en: 'Industrial Development Center' }, url: '#' },
      { id: 'i3', name: { ar: 'مديرية المدن والمناطق الصناعية', en: 'Industrial Cities & Zones Directorate' }, url: '#' },
      { id: 'i4', name: { ar: 'مديرية الإشراف على التأهيل الفني', en: 'Technical Qualification Supervision Directorate' }, url: '#' },
      { id: 'i5', name: { ar: 'مديريات الصناعة في المحافظات', en: 'Provincial Industry Directorates' }, url: '#' },
      { id: 'i6', name: { ar: 'هيئة إدارة المعادن الثمينة', en: 'Precious Metals Management Authority' }, url: '#' },
      { id: 'i7', name: { ar: 'مركز الاختبارات والأبحاث الصناعية', en: 'Industrial Testing & Research Center' }, url: '#' },
      { id: 'i8', name: { ar: 'هيئة المواصفات والمقاييس السورية', en: 'Syrian Standards & Metrology Authority' }, url: '#' }
    ]
  },
  {
    id: 'd2',
    name: { ar: 'الإدارة العامة للاقتصاد', en: 'General Administration for Economy' },
    description: { ar: 'إدارة شؤون الاقتصاد والتجارة الخارجية والسياسات الاقتصادية والمشروعات الصغيرة والمتوسطة.', en: 'Management of economy, foreign trade, economic policies, and SMEs.' },
    icon: 'TrendingUp',
    servicesCount: 6,
    subDirectorates: [
      { id: 'e1', name: { ar: 'المؤسسة العامة للمعارض والأسواق الدولية', en: 'Public Establishment for International Fairs & Markets' }, url: '#' },
      { id: 'e2', name: { ar: 'هيئة تنمية المشروعات الصغيرة والمتوسطة', en: 'SME Development Authority' }, url: '#' },
      { id: 'e3', name: { ar: 'مديرية التجارة الخارجية', en: 'Foreign Trade Directorate' }, url: '#' },
      { id: 'e4', name: { ar: 'مديريات الاقتصاد في المحافظات', en: 'Provincial Economy Directorates' }, url: '#' },
      { id: 'e5', name: { ar: 'هيئة دعم وتنمية الانتاج المحلي والصادرات', en: 'Authority for Support & Development of Local Production & Exports' }, url: '#' },
      { id: 'e6', name: { ar: 'مديرية السياسات الاقتصادية', en: 'Economic Policies Directorate' }, url: '#' },
      { id: 'e7', name: { ar: 'مديرية التعاون الاستهلاكي', en: 'Consumer Cooperation Directorate' }, url: '#' },
      { id: 'e8', name: { ar: 'المديريات الفرعية في المحافظات', en: 'Provincial Branch Directorates' }, url: '#' },
      { id: 'e9', name: { ar: 'مديرية المواد والأمن الغذائي', en: 'Materials & Food Security Directorate' }, url: '#' }
    ]
  },
  {
    id: 'd3',
    name: { ar: 'الإدارة العامة للتجارة الداخلية وحماية المستهلك', en: 'General Administration for Internal Trade' },
    description: { ar: 'إدارة شؤون التجارة الداخلية وحماية المستهلك والرقابة على الأسواق والشركات.', en: 'Management of internal trade, consumer protection, and market monitoring.' },
    icon: 'ShieldCheck',
    servicesCount: 6,
    subDirectorates: [
      { id: 'it1', name: { ar: 'مديرية حماية المستهلك', en: 'Consumer Protection Directorate' }, url: '#' },
      { id: 'it2', name: { ar: 'مديرية الأسعار', en: 'Pricing Directorate' }, url: '#' },
      { id: 'it3', name: { ar: 'مديرية الشركات', en: 'Companies Directorate' }, url: '#' },
      { id: 'it4', name: { ar: 'مديرية التجارة الداخلية بالمحافظات', en: 'Provincial Internal Trade Directorate' }, url: '#' },
      { id: 'it5', name: { ar: 'مديرية المخابر', en: 'Laboratories Directorate' }, url: '#' },
      { id: 'it6', name: { ar: 'مديرية الشؤون الفنية والجودة', en: 'Technical Affairs & Quality Directorate' }, url: '#' }
    ]
  }
];

export const KEY_SERVICES: Service[] = [
  // d1 - الإدارة العامة للصناعة (Industry)
  { id: 's1', title: 'ترخيص منشأة صناعية', directorateId: 'd1', isDigital: true, description: 'تقديم طلب للحصول على ترخيص لإنشاء منشأة صناعية جديدة.' },
  { id: 's2', title: 'تسجيل سجل صناعي', directorateId: 'd1', isDigital: true, description: 'تسجيل المنشآت الصناعية في السجل الصناعي الوطني.' },
  { id: 's3', title: 'شهادة المطابقة والجودة', directorateId: 'd1', isDigital: false, description: 'الحصول على شهادة مطابقة المنتجات للمواصفات القياسية.' },
  { id: 's4', title: 'تخصيص قطعة أرض صناعية', directorateId: 'd1', isDigital: true, description: 'تقديم طلب لتخصيص قطعة أرض في المناطق الصناعية.' },
  // d2 - الإدارة العامة للاقتصاد (Economy)
  { id: 's5', title: 'إجازة استيراد', directorateId: 'd2', isDigital: true, description: 'تقديم طلب للحصول على إجازة استيراد للبضائع والمواد.' },
  { id: 's6', title: 'إجازة تصدير', directorateId: 'd2', isDigital: true, description: 'تقديم طلب للحصول على إجازة تصدير للمنتجات السورية.' },
  { id: 's7', title: 'تمويل المشاريع الصغيرة', directorateId: 'd2', isDigital: true, description: 'برامج دعم وتمويل المشاريع الصغيرة والمتوسطة.' },
  { id: 's8', title: 'المشاركة في المعارض الدولية', directorateId: 'd2', isDigital: true, description: 'تسجيل الشركات للمشاركة في معرض دمشق الدولي.' },
  // d3 - الإدارة العامة للتجارة الداخلية وحماية المستهلك (Trade & Consumer Protection)
  { id: 's9', title: 'تسجيل شركة تجارية', directorateId: 'd3', isDigital: true, description: 'تسجيل الشركات التجارية في السجل التجاري.' },
  { id: 's10', title: 'شكوى حماية المستهلك', directorateId: 'd3', isDigital: true, description: 'تقديم شكوى في حال التعرض للغش التجاري.' },
  { id: 's11', title: 'الاستعلام عن الأسعار', directorateId: 'd3', isDigital: true, description: 'الاستعلام عن الأسعار الرسمية للمواد الأساسية.' },
  { id: 's12', title: 'تسجيل علامة تجارية', directorateId: 'd3', isDigital: true, description: 'تسجيل وحماية العلامات التجارية.' },
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
    title: 'وزارة الاقتصاد والصناعة تطلق منصة التراخيص الصناعية الإلكترونية',
    date: '2024-05-21',
    category: 'خدمات رقمية',
    summary: 'أطلقت الوزارة منصة إلكترونية متكاملة لإصدار التراخيص الصناعية وتجديدها بشكل فوري.',
    imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&q=80&w=600',
    isUrgent: true
  },
  {
    id: 'n2',
    title: 'الإدارة العامة للصناعة تعلن عن تسهيلات جديدة للمستثمرين',
    date: '2024-05-20',
    category: 'صناعة',
    summary: 'أعلنت الإدارة العامة للصناعة عن حزمة تسهيلات جديدة للمستثمرين في القطاع الصناعي.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'n3',
    title: 'حملة حماية المستهلك: ضبط مخالفات سعرية في الأسواق',
    date: '2024-05-19',
    category: 'تجارة داخلية',
    summary: 'نفذت الإدارة العامة للتجارة الداخلية حملة رقابية مكثفة أسفرت عن ضبط عدة مخالفات سعرية.',
    isUrgent: false
  },
  {
    id: 'n4',
    title: 'إطلاق برنامج تمويل المشاريع الصغيرة والمتوسطة',
    date: '2024-05-18',
    category: 'اقتصاد',
    summary: 'أعلنت الإدارة العامة للاقتصاد عن فتح باب التسجيل لبرنامج التمويل الميسر للمشاريع الناشئة.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600'
  }
];

export const BREAKING_NEWS = [
  "وزارة الاقتصاد والصناعة: افتتاح معرض دمشق الدولي بمشاركة 40 دولة.",
  "الإدارة العامة للصناعة: إطلاق منصة التراخيص الصناعية الإلكترونية.",
  "هيئة المشروعات الصغيرة: فتح باب التسجيل لبرنامج التمويل الميسر."
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
    title: "إطلاق منصة التراخيص الصناعية الإلكترونية",
    excerpt: "الإدارة العامة للصناعة تطلق منصة إلكترونية متكاملة لإصدار التراخيص الصناعية وتجديدها.",
    category: "صناعة",
    date: "2024-05-15",
    author: "الإدارة العامة للصناعة",
    readTime: "3 دقائق",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "برنامج تمويل المشاريع الصغيرة",
    excerpt: "هيئة تنمية المشروعات تعلن عن فتح باب التسجيل لبرنامج التمويل الميسر للمشاريع الناشئة.",
    category: "اقتصاد",
    date: "2024-05-10",
    author: "الإدارة العامة للاقتصاد",
    readTime: "4 دقائق",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "حملة حماية المستهلك الصيفية",
    excerpt: "انطلاق حملة مكثفة لمراقبة الأسواق وضبط المخالفات السعرية خلال موسم الصيف.",
    category: "تجارة داخلية",
    date: "2024-05-08",
    author: "الإدارة العامة للتجارة الداخلية",
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
    title: 'إعلان عن مناقصة عامة لتوريد معدات صناعية',
    date: '2025-01-12',
    type: 'tender',
    category: 'مناقصات',
    description: 'تعلن وزارة الاقتصاد والصناعة عن مناقصة عامة لتوريد معدات ومواد للمناطق الصناعية. آخر موعد للتقديم: 30/01/2025'
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

