import { Directorate, Service, Article, NewsItem, Decree, MediaItem } from './types';

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
    name: 'الإدارة العامة للصناعة',
    description: 'التراخيص الصناعية، المناطق الصناعية، المواصفات والمقاييس، واختبارات الجودة.',
    icon: 'Factory',
    servicesCount: 6
  },
  {
    id: 'd2',
    name: 'الإدارة العامة للاقتصاد',
    description: 'التجارة الخارجية، المعارض الدولية، تنمية المشروعات الصغيرة والمتوسطة.',
    icon: 'TrendingUp',
    servicesCount: 6
  },
  {
    id: 'd3',
    name: 'الإدارة العامة للتجارة الداخلية وحماية المستهلك',
    description: 'حماية المستهلك، تسجيل الشركات، العلامات التجارية، ومراقبة الأسعار.',
    icon: 'ShieldCheck',
    servicesCount: 6
  }
];

export const KEY_SERVICES: Service[] = [
  // الإدارة العامة للصناعة (d1)
  { id: 's1', title: 'ترخيص منشأة صناعية', directorateId: 'd1', isDigital: true, description: 'تقديم طلب للحصول على ترخيص لإنشاء منشأة صناعية جديدة أو توسيع منشأة قائمة.' },
  { id: 's2', title: 'تسجيل سجل صناعي', directorateId: 'd1', isDigital: true, description: 'تسجيل المنشآت الصناعية في السجل الصناعي الوطني.' },
  { id: 's3', title: 'شهادة المطابقة والجودة', directorateId: 'd1', isDigital: false, description: 'الحصول على شهادة مطابقة المنتجات للمواصفات القياسية السورية.' },

  // الإدارة العامة للاقتصاد (d2)
  { id: 's4', title: 'إجازة استيراد', directorateId: 'd2', isDigital: true, description: 'تقديم طلب للحصول على إجازة استيراد للبضائع والمواد الأولية.' },
  { id: 's5', title: 'إجازة تصدير', directorateId: 'd2', isDigital: true, description: 'تقديم طلب للحصول على إجازة تصدير للمنتجات السورية.' },
  { id: 's6', title: 'تمويل المشاريع الصغيرة', directorateId: 'd2', isDigital: true, description: 'برامج دعم وتمويل المشاريع الصغيرة والمتوسطة.' },

  // الإدارة العامة للتجارة الداخلية وحماية المستهلك (d3)
  { id: 's7', title: 'تسجيل شركة تجارية', directorateId: 'd3', isDigital: true, description: 'تسجيل الشركات التجارية في السجل التجاري.' },
  { id: 's8', title: 'شكوى حماية المستهلك', directorateId: 'd3', isDigital: true, description: 'تقديم شكوى في حال التعرض للغش التجاري أو المخالفات السعرية.' },

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

// Bilingual data structures - MOE Structure
export const DIRECTORATES_BILINGUAL: Record<string, { ar: Directorate; en: Directorate }> = {
  'd1': {
    ar: { id: 'd1', name: 'الإدارة العامة للصناعة', description: 'التراخيص الصناعية، المناطق الصناعية، المواصفات والمقاييس، واختبارات الجودة.', icon: 'Factory', servicesCount: 6 },
    en: { id: 'd1', name: 'General Administration for Industry', description: 'Industrial licenses, industrial zones, standards and metrology, and quality testing.', icon: 'Factory', servicesCount: 6 }
  },
  'd2': {
    ar: { id: 'd2', name: 'الإدارة العامة للاقتصاد', description: 'التجارة الخارجية، المعارض الدولية، تنمية المشروعات الصغيرة والمتوسطة.', icon: 'TrendingUp', servicesCount: 6 },
    en: { id: 'd2', name: 'General Administration for Economy', description: 'Foreign trade, international exhibitions, SME development.', icon: 'TrendingUp', servicesCount: 6 }
  },
  'd3': {
    ar: { id: 'd3', name: 'الإدارة العامة للتجارة الداخلية وحماية المستهلك', description: 'حماية المستهلك، تسجيل الشركات، العلامات التجارية، ومراقبة الأسعار.', icon: 'ShieldCheck', servicesCount: 6 },
    en: { id: 'd3', name: 'General Administration for Internal Trade & Consumer Protection', description: 'Consumer protection, company registration, trademarks, and price monitoring.', icon: 'ShieldCheck', servicesCount: 6 }
  }
};

export const KEY_SERVICES_BILINGUAL: Record<string, { ar: Service; en: Service }> = {
  's1': {
    ar: { id: 's1', title: 'ترخيص منشأة صناعية', directorateId: 'd1', isDigital: true, description: 'تقديم طلب للحصول على ترخيص لإنشاء منشأة صناعية جديدة أو توسيع منشأة قائمة.' },
    en: { id: 's1', title: 'Industrial Facility License', directorateId: 'd1', isDigital: true, description: 'Apply for a license to establish or expand an industrial facility.' }
  },
  's2': {
    ar: { id: 's2', title: 'تسجيل سجل صناعي', directorateId: 'd1', isDigital: true, description: 'تسجيل المنشآت الصناعية في السجل الصناعي الوطني.' },
    en: { id: 's2', title: 'Industrial Registry', directorateId: 'd1', isDigital: true, description: 'Register industrial establishments in the national industrial registry.' }
  },
  's3': {
    ar: { id: 's3', title: 'شهادة المطابقة والجودة', directorateId: 'd1', isDigital: false, description: 'الحصول على شهادة مطابقة المنتجات للمواصفات القياسية السورية.' },
    en: { id: 's3', title: 'Quality Conformity Certificate', directorateId: 'd1', isDigital: false, description: 'Obtain product conformity certificate to Syrian standards.' }
  },
  's4': {
    ar: { id: 's4', title: 'إجازة استيراد', directorateId: 'd2', isDigital: true, description: 'تقديم طلب للحصول على إجازة استيراد للبضائع والمواد الأولية.' },
    en: { id: 's4', title: 'Import License', directorateId: 'd2', isDigital: true, description: 'Apply for import license for goods and raw materials.' }
  },
  's5': {
    ar: { id: 's5', title: 'إجازة تصدير', directorateId: 'd2', isDigital: true, description: 'تقديم طلب للحصول على إجازة تصدير للمنتجات السورية.' },
    en: { id: 's5', title: 'Export License', directorateId: 'd2', isDigital: true, description: 'Apply for export license for Syrian products.' }
  },
  's6': {
    ar: { id: 's6', title: 'تمويل المشاريع الصغيرة', directorateId: 'd2', isDigital: true, description: 'برامج دعم وتمويل المشاريع الصغيرة والمتوسطة.' },
    en: { id: 's6', title: 'SME Financing', directorateId: 'd2', isDigital: true, description: 'SME support and financing programs.' }
  },
  's7': {
    ar: { id: 's7', title: 'تسجيل شركة تجارية', directorateId: 'd3', isDigital: true, description: 'تسجيل الشركات التجارية في السجل التجاري.' },
    en: { id: 's7', title: 'Commercial Company Registration', directorateId: 'd3', isDigital: true, description: 'Register commercial companies in the commercial registry.' }
  },
  's8': {
    ar: { id: 's8', title: 'شكوى حماية المستهلك', directorateId: 'd3', isDigital: true, description: 'تقديم شكوى في حال التعرض للغش التجاري أو المخالفات السعرية.' },
    en: { id: 's8', title: 'Consumer Protection Complaint', directorateId: 'd3', isDigital: true, description: 'File a complaint for commercial fraud or price violations.' }
  },
  's9': {
    ar: { id: 's9', title: 'تسجيل علامة تجارية', directorateId: 'd3', isDigital: true, description: 'تسجيل وحماية العلامات التجارية.' },
    en: { id: 's9', title: 'Trademark Registration', directorateId: 'd3', isDigital: true, description: 'Register and protect trademarks.' }
  },
  's10': {
    ar: { id: 's10', title: 'تخصيص قطعة أرض صناعية', directorateId: 'd1', isDigital: true, description: 'تقديم طلب لتخصيص قطعة أرض في المناطق الصناعية.' },
    en: { id: 's10', title: 'Industrial Land Allocation', directorateId: 'd1', isDigital: true, description: 'Apply for industrial land allocation in industrial zones.' }
  },
  's11': {
    ar: { id: 's11', title: 'المشاركة في المعارض الدولية', directorateId: 'd2', isDigital: true, description: 'تسجيل الشركات للمشاركة في معرض دمشق الدولي والمعارض التخصصية.' },
    en: { id: 's11', title: 'International Exhibition Participation', directorateId: 'd2', isDigital: true, description: 'Register for Damascus International Fair and specialized exhibitions.' }
  },
  's12': {
    ar: { id: 's12', title: 'الاستعلام عن الأسعار', directorateId: 'd3', isDigital: true, description: 'الاستعلام عن الأسعار الرسمية للمواد الأساسية والمحروقات.' },
    en: { id: 's12', title: 'Price Inquiry', directorateId: 'd3', isDigital: true, description: 'Inquire about official prices for basic materials and fuel.' }
  }
};

export const COMPLAINT_CATEGORIES_BILINGUAL: Record<string, { ar: string; en: string }> = {
  'services_electronic': { ar: 'خدمات إلكترونية', en: 'E-Services' },
  'administrative': { ar: 'أداء إداري', en: 'Administrative' },
  'infrastructure': { ar: 'بنية تحتية', en: 'Infrastructure' },
  'health_services': { ar: 'خدمات صحية', en: 'Health Services' },
  'development_proposals': { ar: 'مقترحات تطوير', en: 'Development Proposals' },
  'administrative_corruption': { ar: 'فساد إداري', en: 'Administrative Corruption' }
};

export const MOCK_MEDIA_BILINGUAL: Record<string, { ar: MediaItem; en: MediaItem }> = {
  'm1': {
    ar: { id: 'm1', title: 'جولة السيد الوزير في معرض دمشق الدولي', type: 'video', thumbnailUrl: 'https://images.unsplash.com/photo-149261937592-d0234a62176c?auto=format&fit=crop&q=80&w=800', date: '2024-05-20', duration: '12:30' },
    en: { id: 'm1', title: 'Minister Tour in Damascus International Fair', type: 'video', thumbnailUrl: 'https://images.unsplash.com/photo-149261937592-d0234a62176c?auto=format&fit=crop&q=80&w=800', date: '2024-05-20', duration: '12:30' }
  },
  'm2': {
    ar: { id: 'm2', title: 'افتتاح محطة توليد الكهرباء الجديدة', type: 'video', thumbnailUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800', date: '2024-05-18', duration: '05:45' },
    en: { id: 'm2', title: 'Opening New Power Station', type: 'video', thumbnailUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800', date: '2024-05-18', duration: '05:45' }
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
    ar: { id: 'm6', title: 'مؤتمر الاستثمار السوري الأول', type: 'video', thumbnailUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800', date: '2024-05-05', duration: '45:00' },
    en: { id: 'm6', title: 'First Syrian Investment Forum', type: 'video', thumbnailUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800', date: '2024-05-05', duration: '45:00' }
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