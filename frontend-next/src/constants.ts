import { Directorate, Service, Article, NewsItem, Decree, MediaItem } from './types';

export const MOCK_MEDIA: MediaItem[] = [
  {
    id: 'm1',
    title: 'جولة السيد الوزير في معرض دمشق الدولي للصناعات',
    type: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492619375932-d0234a62176c?auto=format&fit=crop&q=80&w=800',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    date: '2024-05-20',
    duration: '12:30'
  },
  {
    id: 'm2',
    title: 'افتتاح المنطقة الصناعية الجديدة في عدرا',
    type: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
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
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    date: '2024-05-05',
    duration: '45:00'
  }
];

export const DIRECTORATES: Directorate[] = [
  {
    id: 'd1',
    name: { ar: 'الإدارة العامة للصناعة', en: 'General Administration for Industry' },
    description: { ar: 'إدارة شؤون الصناعة والمصانع والمناطق الصناعية والمواصفات والمقاييس.', en: 'Industrial affairs, factories, industrial zones, standards and specifications.' },
    icon: 'Factory',
    servicesCount: 6,
    subDirectorates: [
      { id: 'sd1-1', name: { ar: 'مديرية التراخيص الصناعية', en: 'Directorate of Industrial Licensing' }, url: '/directorates/industry/licensing' },
      { id: 'sd1-2', name: { ar: 'مديرية المواصفات والمقاييس', en: 'Directorate of Standards & Specifications' }, url: '/directorates/industry/standards' },
      { id: 'sd1-3', name: { ar: 'مديرية المدن الصناعية', en: 'Directorate of Industrial Zones' }, url: '/directorates/industry/zones' }
    ]
  },
  {
    id: 'd2',
    name: { ar: 'الإدارة العامة للاقتصاد', en: 'General Administration for Economy' },
    description: { ar: 'إدارة شؤون الاقتصاد والتجارة الخارجية والسياسات الاقتصادية والمشروعات الصغيرة والمتوسطة.', en: 'Economic affairs, foreign trade, economic policies, and SME development.' },
    icon: 'TrendingUp',
    servicesCount: 6,
    subDirectorates: [
      { id: 'sd2-1', name: { ar: 'مديرية التجارة الخارجية', en: 'Directorate of Foreign Trade' }, url: '/directorates/economy/trade' },
      { id: 'sd2-2', name: { ar: 'هيئة المشروعات الصغيرة', en: 'SME Development Authority' }, url: 'https://sme.gov.sy', isExternal: true },
      { id: 'sd2-3', name: { ar: 'مديرية السياسات الاقتصادية', en: 'Directorate of Economic Policies' }, url: '/directorates/economy/policies' }
    ]
  },
  {
    id: 'd3',
    name: { ar: 'الإدارة العامة للتجارة الداخلية وحماية المستهلك', en: 'General Administration for Internal Trade & Consumer Protection' },
    description: { ar: 'إدارة شؤون التجارة الداخلية وحماية المستهلك والرقابة على الأسواق والشركات.', en: 'Internal trade, consumer protection, market regulation, and company registration.' },
    icon: 'ShieldCheck',
    servicesCount: 6,
    subDirectorates: [
      { id: 'sd3-1', name: { ar: 'مديرية حماية المستهلك', en: 'Directorate of Consumer Protection' }, url: '/directorates/trade/protection' },
      { id: 'sd3-2', name: { ar: 'مديرية الشركات', en: 'Directorate of Companies' }, url: '/directorates/trade/companies' },
      { id: 'sd3-3', name: { ar: 'مديرية الأسعار', en: 'Directorate of Prices' }, url: '/directorates/trade/prices' }
    ]
  }
];

export const KEY_SERVICES: Service[] = [
  // d1 - الإدارة العامة للصناعة (Industry)
  { id: 's1', title: 'ترخيص منشأة صناعية', title_ar: 'ترخيص منشأة صناعية', title_en: 'Industrial Facility License', directorateId: 'd1', isDigital: true, description: 'تقديم طلب للحصول على ترخيص لإنشاء منشأة صناعية جديدة.', description_ar: 'تقديم طلب للحصول على ترخيص لإنشاء منشأة صناعية جديدة.', description_en: 'Apply for a license to establish a new industrial facility.' },
  { id: 's2', title: 'تسجيل سجل صناعي', title_ar: 'تسجيل سجل صناعي', title_en: 'Industrial Registry', directorateId: 'd1', isDigital: true, description: 'تسجيل المنشآت الصناعية في السجل الصناعي الوطني.', description_ar: 'تسجيل المنشآت الصناعية في السجل الصناعي الوطني.', description_en: 'Register industrial establishments in the national industrial registry.' },
  { id: 's3', title: 'شهادة المطابقة والجودة', title_ar: 'شهادة المطابقة والجودة', title_en: 'Quality Conformity Certificate', directorateId: 'd1', isDigital: false, description: 'الحصول على شهادة مطابقة المنتجات للمواصفات القياسية.', description_ar: 'الحصول على شهادة مطابقة المنتجات للمواصفات القياسية.', description_en: 'Obtain product conformity certificate to Syrian standards.' },
  { id: 's4', title: 'تخصيص قطعة أرض صناعية', title_ar: 'تخصيص قطعة أرض صناعية', title_en: 'Industrial Land Allocation', directorateId: 'd1', isDigital: true, description: 'تقديم طلب لتخصيص قطعة أرض في المناطق الصناعية.', description_ar: 'تقديم طلب لتخصيص قطعة أرض في المناطق الصناعية.', description_en: 'Apply for industrial land allocation in industrial zones.' },

  // d2 - الإدارة العامة للاقتصاد (Economy)
  { id: 's5', title: 'إجازة استيراد', title_ar: 'إجازة استيراد', title_en: 'Import License', directorateId: 'd2', isDigital: true, description: 'تقديم طلب للحصول على إجازة استيراد للبضائع والمواد.', description_ar: 'تقديم طلب للحصول على إجازة استيراد للبضائع والمواد.', description_en: 'Apply for import license for goods and raw materials.' },
  { id: 's6', title: 'إجازة تصدير', title_ar: 'إجازة تصدير', title_en: 'Export License', directorateId: 'd2', isDigital: true, description: 'تقديم طلب للحصول على إجازة تصدير للمنتجات السورية.', description_ar: 'تقديم طلب للحصول على إجازة تصدير للمنتجات السورية.', description_en: 'Apply for export license for Syrian products.' },
  { id: 's7', title: 'تمويل المشاريع الصغيرة', title_ar: 'تمويل المشاريع الصغيرة', title_en: 'SME Financing', directorateId: 'd2', isDigital: true, description: 'برامج دعم وتمويل المشاريع الصغيرة والمتوسطة.', description_ar: 'برامج دعم وتمويل المشاريع الصغيرة والمتوسطة.', description_en: 'SME support and financing programs.' },
  { id: 's8', title: 'المشاركة في المعارض الدولية', title_ar: 'المشاركة في المعارض الدولية', title_en: 'International Exhibition', directorateId: 'd2', isDigital: true, description: 'تسجيل الشركات للمشاركة في معرض دمشق الدولي.', description_ar: 'تسجيل الشركات للمشاركة في معرض دمشق الدولي.', description_en: 'Register for Damascus International Fair participation.' },

  // d3 - الإدارة العامة للتجارة الداخلية وحماية المستهلك (Trade & Consumer Protection)
  { id: 's9', title: 'تسجيل شركة تجارية', title_ar: 'تسجيل شركة تجارية', title_en: 'Commercial Company Registration', directorateId: 'd3', isDigital: true, description: 'تسجيل الشركات التجارية في السجل التجاري.', description_ar: 'تسجيل الشركات التجارية في السجل التجاري.', description_en: 'Register commercial companies in the commercial registry.' },
  { id: 's10', title: 'شكوى حماية المستهلك', title_ar: 'شكوى حماية المستهلك', title_en: 'Consumer Protection Complaint', directorateId: 'd3', isDigital: true, description: 'تقديم شكوى في حال التعرض للغش التجاري.', description_ar: 'تقديم شكوى في حال التعرض للغش التجاري.', description_en: 'File a complaint for commercial fraud or price violations.' },
  { id: 's11', title: 'الاستعلام عن الأسعار', title_ar: 'الاستعلام عن الأسعار', title_en: 'Price Inquiry', directorateId: 'd3', isDigital: true, description: 'الاستعلام عن الأسعار الرسمية للمواد الأساسية.', description_ar: 'الاستعلام عن الأسعار الرسمية للمواد الأساسية.', description_en: 'Inquire about official prices for basic materials.' },
  { id: 's12', title: 'تسجيل علامة تجارية', title_ar: 'تسجيل علامة تجارية', title_en: 'Trademark Registration', directorateId: 'd3', isDigital: true, description: 'تسجيل وحماية العلامات التجارية.', description_ar: 'تسجيل وحماية العلامات التجارية.', description_en: 'Register and protect trademarks.' },
];

export const COMPLAINT_CATEGORIES = [
  'خدمات',
  'أداء إداري',
  'بنية تحتية',
  'خدمات صحية',
  'مقترحات تطوير',
  'فساد إداري'
];

export const OFFICIAL_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'وزارة الاقتصاد والصناعة تطلق منصة التراخيص الصناعية',
    date: '2024-05-21',
    category: 'خدمات رقمية',
    summary: 'أطلقت الوزارة منصة متكاملة لإصدار التراخيص الصناعية وتجديدها بشكل فوري.',
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
    imageUrl: 'https://images.unsplash.com/photo-1589216532372-1c2a367900d9?auto=format&fit=crop&q=80&w=600',
    isUrgent: false
  },
  {
    id: 'n4',
    title: 'إطلاق برنامج تمويل المشاريع الصغيرة والمتوسطة',
    date: '2024-05-18',
    category: 'خدمات',
    summary: 'تم افتتاح مركز جديد لخدمة المواطن يقدم أكثر من 50 خدمة حكومية في مكان واحد.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600'
  }
];

export const BREAKING_NEWS = [
  "وزارة الاقتصاد والصناعة: افتتاح معرض دمشق الدولي بمشاركة 40 دولة.",
  "الإدارة العامة للصناعة: إطلاق منصة التراخيص الصناعية.",
  "هيئة المشروعات الصغيرة: فتح باب التسجيل لبرنامج التمويل الميسر."
];

export const HERO_ARTICLE: Article = {
  title: "استراتيجية الحكومة الرقمية",
  excerpt: "نحو قطاع عام كفء وشفاف وفعار يخدم المواطن السوري بأحدث التقنيات.",
  category: "رؤية 2030",
  date: "20 مايو 2024",
  author: "المكتب الإعلامي",
  readTime: "5 دقائق",
  imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000"
};

export const GRID_ARTICLES: Article[] = [
  {
    title: "إطلاق منصة التراخيص الصناعية",
    excerpt: "الإدارة العامة للصناعة تطلق منصة متكاملة لإصدار التراخيص الصناعية وتجديدها.",
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
    imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600"
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

// Bilingual data structures - Ministry of Economy and Industry
export const DIRECTORATES_BILINGUAL: Record<string, { ar: Directorate; en: Directorate }> = {
  'd1': {
    ar: { id: 'd1', name: 'الإدارة العامة للصناعة', description: 'إدارة شؤون الصناعة والمصانع والمناطق الصناعية والمواصفات والمقاييس.', icon: 'Factory', servicesCount: 6 },
    en: { id: 'd1', name: 'General Administration for Industry', description: 'Industrial affairs, factories, industrial zones, standards and specifications.', icon: 'Factory', servicesCount: 6 }
  },
  'd2': {
    ar: { id: 'd2', name: 'الإدارة العامة للاقتصاد', description: 'إدارة شؤون الاقتصاد والتجارة الخارجية والسياسات الاقتصادية والمشروعات الصغيرة والمتوسطة.', icon: 'TrendingUp', servicesCount: 6 },
    en: { id: 'd2', name: 'General Administration for Economy', description: 'Economic affairs, foreign trade, economic policies, and SME development.', icon: 'TrendingUp', servicesCount: 6 }
  },
  'd3': {
    ar: { id: 'd3', name: 'الإدارة العامة للتجارة الداخلية وحماية المستهلك', description: 'إدارة شؤون التجارة الداخلية وحماية المستهلك والرقابة على الأسواق والشركات.', icon: 'ShieldCheck', servicesCount: 6 },
    en: { id: 'd3', name: 'General Administration for Internal Trade & Consumer Protection', description: 'Internal trade, consumer protection, market regulation, and company registration.', icon: 'ShieldCheck', servicesCount: 6 }
  }
};

export const KEY_SERVICES_BILINGUAL: Record<string, { ar: Service; en: Service }> = {
  // d1 - الإدارة العامة للصناعة (Industry)
  's1': {
    ar: { id: 's1', title: 'ترخيص منشأة صناعية', directorateId: 'd1', isDigital: true, description: 'تقديم طلب للحصول على ترخيص لإنشاء منشأة صناعية جديدة.' },
    en: { id: 's1', title: 'Industrial Facility License', directorateId: 'd1', isDigital: true, description: 'Apply for a license to establish a new industrial facility.' }
  },
  's2': {
    ar: { id: 's2', title: 'تسجيل سجل صناعي', directorateId: 'd1', isDigital: true, description: 'تسجيل المنشآت الصناعية في السجل الصناعي الوطني.' },
    en: { id: 's2', title: 'Industrial Registry', directorateId: 'd1', isDigital: true, description: 'Register industrial establishments in the national industrial registry.' }
  },
  's3': {
    ar: { id: 's3', title: 'شهادة المطابقة والجودة', directorateId: 'd1', isDigital: false, description: 'الحصول على شهادة مطابقة المنتجات للمواصفات القياسية.' },
    en: { id: 's3', title: 'Quality Conformity Certificate', directorateId: 'd1', isDigital: false, description: 'Obtain product conformity certificate to Syrian standards.' }
  },
  's4': {
    ar: { id: 's4', title: 'تخصيص قطعة أرض صناعية', directorateId: 'd1', isDigital: true, description: 'تقديم طلب لتخصيص قطعة أرض في المناطق الصناعية.' },
    en: { id: 's4', title: 'Industrial Land Allocation', directorateId: 'd1', isDigital: true, description: 'Apply for industrial land allocation in industrial zones.' }
  },
  // d2 - الإدارة العامة للاقتصاد (Economy)
  's5': {
    ar: { id: 's5', title: 'إجازة استيراد', directorateId: 'd2', isDigital: true, description: 'تقديم طلب للحصول على إجازة استيراد للبضائع والمواد.' },
    en: { id: 's5', title: 'Import License', directorateId: 'd2', isDigital: true, description: 'Apply for import license for goods and raw materials.' }
  },
  's6': {
    ar: { id: 's6', title: 'إجازة تصدير', directorateId: 'd2', isDigital: true, description: 'تقديم طلب للحصول على إجازة تصدير للمنتجات السورية.' },
    en: { id: 's6', title: 'Export License', directorateId: 'd2', isDigital: true, description: 'Apply for export license for Syrian products.' }
  },
  's7': {
    ar: { id: 's7', title: 'تمويل المشاريع الصغيرة', directorateId: 'd2', isDigital: true, description: 'برامج دعم وتمويل المشاريع الصغيرة والمتوسطة.' },
    en: { id: 's7', title: 'SME Financing', directorateId: 'd2', isDigital: true, description: 'SME support and financing programs.' }
  },
  's8': {
    ar: { id: 's8', title: 'المشاركة في المعارض الدولية', directorateId: 'd2', isDigital: true, description: 'تسجيل الشركات للمشاركة في معرض دمشق الدولي.' },
    en: { id: 's8', title: 'International Exhibition', directorateId: 'd2', isDigital: true, description: 'Register for Damascus International Fair participation.' }
  },
  // d3 - الإدارة العامة للتجارة الداخلية وحماية المستهلك (Trade & Consumer Protection)
  's9': {
    ar: { id: 's9', title: 'تسجيل شركة تجارية', directorateId: 'd3', isDigital: true, description: 'تسجيل الشركات التجارية في السجل التجاري.' },
    en: { id: 's9', title: 'Commercial Company Registration', directorateId: 'd3', isDigital: true, description: 'Register commercial companies in the commercial registry.' }
  },
  's10': {
    ar: { id: 's10', title: 'شكوى حماية المستهلك', directorateId: 'd3', isDigital: true, description: 'تقديم شكوى في حال التعرض للغش التجاري.' },
    en: { id: 's10', title: 'Consumer Protection Complaint', directorateId: 'd3', isDigital: true, description: 'File a complaint for commercial fraud or price violations.' }
  },
  's11': {
    ar: { id: 's11', title: 'الاستعلام عن الأسعار', directorateId: 'd3', isDigital: true, description: 'الاستعلام عن الأسعار الرسمية للمواد الأساسية.' },
    en: { id: 's11', title: 'Price Inquiry', directorateId: 'd3', isDigital: true, description: 'Inquire about official prices for basic materials.' }
  },
  's12': {
    ar: { id: 's12', title: 'تسجيل علامة تجارية', directorateId: 'd3', isDigital: true, description: 'تسجيل وحماية العلامات التجارية.' },
    en: { id: 's12', title: 'Trademark Registration', directorateId: 'd3', isDigital: true, description: 'Register and protect trademarks.' }
  }
};

export const COMPLAINT_CATEGORIES_BILINGUAL: Record<string, { ar: string; en: string }> = {
  'services_electronic': { ar: 'خدمات', en: 'E-Services' },
  'administrative': { ar: 'أداء إداري', en: 'Administrative' },
  'infrastructure': { ar: 'بنية تحتية', en: 'Infrastructure' },
  'health_services': { ar: 'خدمات صحية', en: 'Health Services' },
  'development_proposals': { ar: 'مقترحات تطوير', en: 'Development Proposals' },
  'administrative_corruption': { ar: 'فساد إداري', en: 'Administrative Corruption' }
};

export const MOCK_MEDIA_BILINGUAL: Record<string, { ar: MediaItem; en: MediaItem }> = {
  'm1': {
    ar: { id: 'm1', title: 'جولة السيد الوزير في معرض دمشق الدولي', type: 'video', thumbnailUrl: 'https://images.unsplash.com/photo-149261937592-d0234a62176c?auto=format&fit=crop&q=80&w=800', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', date: '2024-05-20', duration: '12:30' },
    en: { id: 'm1', title: 'Minister Tour in Damascus International Fair', type: 'video', thumbnailUrl: 'https://images.unsplash.com/photo-149261937592-d0234a62176c?auto=format&fit=crop&q=80&w=800', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', date: '2024-05-20', duration: '12:30' }
  },
  'm2': {
    ar: { id: 'm2', title: 'افتتاح محطة توليد الكهرباء الجديدة', type: 'video', thumbnailUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', date: '2024-05-18', duration: '05:45' },
    en: { id: 'm2', title: 'Opening New Power Station', type: 'video', thumbnailUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', date: '2024-05-18', duration: '05:45' }
  },
  'm3': {
    ar: { id: 'm3', title: 'صور من حفل تكريم المبدعين', type: 'photo', thumbnailUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800', date: '2024-05-15', count: 24 },
    en: { id: 'm3', title: 'Photos from Creative Innovators Gala', type: 'photo', thumbnailUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800', date: '2024-05-15', count: 24 }
  },
  'm4': {
    ar: { id: 'm4', title: 'إحصائيات التحول الرقمي 2024', type: 'infographic', thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', date: '2024-05-10' },
    en: { id: 'm4', title: '2024 Digital Transformation Statistics', type: 'infographic', thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', date: '2024-05-10' }
  },
  'm5': {
    ar: { id: 'm5', title: 'اجتماع مجلس الوزراء الأسبوعي', type: 'photo', thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c?auto=format&fit=crop&q=80&w=800', date: '2024-05-08', count: 15 },
    en: { id: 'm5', title: 'Weekly Council of Ministers Meeting', type: 'photo', thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c?auto=format&fit=crop&q=80&w=800', date: '2024-05-08', count: 15 }
  },
  'm6': {
    ar: { id: 'm6', title: 'مؤتمر الاستثمار السوري الأول', type: 'video', thumbnailUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', date: '2024-05-05', duration: '45:00' },
    en: { id: 'm6', title: 'First Syrian Investment Forum', type: 'video', thumbnailUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', date: '2024-05-05', duration: '45:00' }
  }
};

// Helper functions to get localized data
export const getDirectorates = (language: 'ar' | 'en'): Directorate[] => {
  return Object.values(DIRECTORATES_BILINGUAL).map(d => d[language]);
};

export const getServices = (language: 'ar' | 'en'): Service[] => {
  return Object.values(KEY_SERVICES_BILINGUAL).map(s => s[language]);
};

export const getComplaintCategories = (language: 'ar' | 'en'): string[] => {
  return Object.values(COMPLAINT_CATEGORIES_BILINGUAL).map(c => c[language]);
};

export const getMedia = (language: 'ar' | 'en'): MediaItem[] => {
  return Object.values(MOCK_MEDIA_BILINGUAL).map(m => m[language]);
};

// Get governorates list
export const GOVERNORATES: Array<{ value: string; labelAr: string; labelEn: string }> = [
  { value: 'دمشق', labelAr: 'دمشق', labelEn: 'Damascus' },
  { value: 'ريف دمشق', labelAr: 'ريف دمشق', labelEn: 'Rif Damascus' },
  { value: 'حلب', labelAr: 'حلب', labelEn: 'Aleppo' },
  { value: 'حمص', labelAr: 'حمص', labelEn: 'Homs' },
  { value: 'حماة', labelAr: 'حماة', labelEn: 'Hama' },
  { value: 'اللاذقية', labelAr: 'اللاذقية', labelEn: 'Latakia' },
  { value: 'طرطوس', labelAr: 'طرطوس', labelEn: 'Tartous' },
  { value: 'إدلب', labelAr: 'إدلب', labelEn: 'Idlib' },
  { value: 'درعا', labelAr: 'درعا', labelEn: 'Daraa' },
  { value: 'السويداء', labelAr: 'السويداء', labelEn: 'Suwayda' },
  { value: 'القنيطرة', labelAr: 'القنيطرة', labelEn: 'Quneitra' },
  { value: 'دير الزور', labelAr: 'دير الزور', labelEn: 'Deir ez-Zor' },
  { value: 'الرقة', labelAr: 'الرقة', labelEn: 'Raqqa' },
  { value: 'الحسكة', labelAr: 'الحسكة', labelEn: 'Hasakeh' },
  { value: 'السويداء', labelAr: 'السويداء', labelEn: 'Suwayda' },
  { value: 'القنيطرة', labelAr: 'القنيطرة', labelEn: 'Quneitra' }
];

// Service categories map
export const SERVICE_CATEGORIES: Array<{ value: string; labelAr: string; labelEn: string }> = [
  { value: 'civil_status', labelAr: 'خدمات الأحوال المدنية', labelEn: 'Civil Status Services' },
  { value: 'financial', labelAr: 'الخدمات المالية', labelEn: 'Financial Services' },
  { value: 'education', labelAr: 'خدمات التعليم', labelEn: 'Education Services' },
  { value: 'health', labelAr: 'خدمات الصحة', labelEn: 'Health Services' },
  { value: 'transportation', labelAr: 'خدمات النقل', labelEn: 'Transportation Services' },
  { value: 'housing', labelAr: 'خدمات الإسكان', labelEn: 'Housing Services' },
  { value: 'employment', labelAr: 'خدمات العمل', labelEn: 'Employment Services' },
  { value: 'projects', labelAr: 'خدمات المشاريع', labelEn: 'Projects Services' },
  { value: 'security', labelAr: 'خدمات الأمن', labelEn: 'Security Services' },
  { value: 'environment', labelAr: 'خدمات البيئة', labelEn: 'Environment Services' },
  { value: 'inquiry', labelAr: 'خدمات الاستعلام', labelEn: 'Inquiry Services' },
  { value: 'support', labelAr: 'خدمات الدعم', labelEn: 'Support Services' },
  { value: 'feedback', labelAr: 'خدمات التقييم', labelEn: 'Feedback Services' }
];