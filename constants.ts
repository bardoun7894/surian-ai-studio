import { Directorate, Service, Article, NewsItem, Decree } from './types';

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
    icon: 'Plane', // Represents Transport generally
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
  { id: 's1', title: 'إصدار جواز سفر إلكتروني', directorateId: 'd1', isDigital: true },
  { id: 's2', title: 'خلاصة سجل عدلي (غير محكوم)', directorateId: 'd1', isDigital: true },
  { id: 's3', title: 'دفع المخالفات المرورية', directorateId: 'd1', isDigital: true },
  
  { id: 's4', title: 'الوكالات العدلية', directorateId: 'd2', isDigital: false },
  { id: 's5', title: 'بيان ملكية عقارية', directorateId: 'd2', isDigital: true },
  
  { id: 's6', title: 'نتائج التحاليل الطبية', directorateId: 'd3', isDigital: true },
  
  { id: 's7', title: 'نتائج الامتحانات العامة', directorateId: 'd4', isDigital: true },
  { id: 's8', title: 'تسلسل دراسي', directorateId: 'd4', isDigital: false },
  
  { id: 's9', title: 'المفاضلة الجامعية', directorateId: 'd5', isDigital: true },
  { id: 's10', title: 'كشف علامات جامعي', directorateId: 'd5', isDigital: true },
  
  { id: 's11', title: 'دفع فاتورة الكهرباء', directorateId: 'd6', isDigital: true },
  { id: 's12', title: 'طلب عداد جديد', directorateId: 'd6', isDigital: false },
  
  { id: 's13', title: 'دفع فاتورة المياه', directorateId: 'd7', isDigital: true },
  
  { id: 's14', title: 'تجديد ترخيص مركبة', directorateId: 'd8', isDigital: true },
  
  { id: 's15', title: 'بوابة خدمة المواطن', directorateId: 'd9', isDigital: true },
  
  { id: 's16', title: 'براءة ذمة مالية', directorateId: 'd10', isDigital: true },
  { id: 's17', title: 'التحقق الضريبي', directorateId: 'd10', isDigital: true },
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
    imageUrl: 'https://images.unsplash.com/photo-1577017040065-650523537231?auto=format&fit=crop&q=80&w=600',
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