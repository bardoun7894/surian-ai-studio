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

// Bilingual data structures
export const DIRECTORATES_BILINGUAL: Record<string, { ar: Directorate; en: Directorate }> = {
  'd1': {
    ar: { id: 'd1', name: 'وزارة الداخلية', description: 'إدارة الأحوال المدنية، الجوازات، وشؤون الهجرة والمرور.', icon: 'ShieldAlert', servicesCount: 15 },
    en: { id: 'd1', name: 'Ministry of Interior', description: 'Civil registry, passports, immigration and traffic affairs.', icon: 'ShieldAlert', servicesCount: 15 }
  },
  'd2': {
    ar: { id: 'd2', name: 'وزارة العدل', description: 'الخدمات القضائية، الوكالات، والمحاكم.', icon: 'Scale', servicesCount: 9 },
    en: { id: 'd2', name: 'Ministry of Justice', description: 'Judicial services, agencies, and courts.', icon: 'Scale', servicesCount: 9 }
  },
  'd3': {
    ar: { id: 'd3', name: 'وزارة الصحة', description: 'الخدمات الطبية، المشافي، والتراخيص الصحية.', icon: 'HeartPulse', servicesCount: 8 },
    en: { id: 'd3', name: 'Ministry of Health', description: 'Medical services, hospitals, and health centers.', icon: 'HeartPulse', servicesCount: 8 }
  },
  'd4': {
    ar: { id: 'd4', name: 'وزارة التربية', description: 'شؤون المدارس، المناهج، والامتحانات.', icon: 'BookOpen', servicesCount: 12 },
    en: { id: 'd4', name: 'Ministry of Education', description: 'Schools, curricula, and examinations.', icon: 'BookOpen', servicesCount: 12 }
  },
  'd5': {
    ar: { id: 'd5', name: 'وزارة التعليم العالي', description: 'الجامعات الحكومية، المنح، والبحث العلمي.', icon: 'GraduationCap', servicesCount: 10 },
    en: { id: 'd5', name: 'Ministry of Higher Education', description: 'Government universities, scholarships, and scientific research.', icon: 'GraduationCap', servicesCount: 10 }
  },
  'd6': {
    ar: { id: 'd6', name: 'وزارة الكهرباء', description: 'خدمات المشتركين، الفواتير، والشكاوى الكهربائية.', icon: 'Zap', servicesCount: 5 },
    en: { id: 'd6', name: 'Ministry of Electricity', description: 'Subscriber services, bills, and electricity complaints.', icon: 'Zap', servicesCount: 5 }
  },
  'd7': {
    ar: { id: 'd7', name: 'وزارة الموارد المائية', description: 'مياه الشرب، الصرف الصحي، والري.', icon: 'Droplets', servicesCount: 4 },
    en: { id: 'd7', name: 'Ministry of Water Resources', description: 'Drinking water, sewage, and irrigation.', icon: 'Droplets', servicesCount: 4 }
  },
  'd8': {
    ar: { id: 'd8', name: 'وزارة النقل', description: 'تراخيص المركبات، النقل البري والبحري والجوي.', icon: 'Plane', servicesCount: 7 },
    en: { id: 'd8', name: 'Ministry of Transport', description: 'Vehicle licenses, land, sea and air transport.', icon: 'Plane', servicesCount: 7 }
  },
  'd9': {
    ar: { id: 'd9', name: 'وزارة الاتصالات', description: 'خدمات الإنترنت، البريد، والتوقيع الرقمي.', icon: 'Wifi', servicesCount: 6 },
    en: { id: 'd9', name: 'Ministry of Communications', description: 'Internet services, mail, and digital signatures.', icon: 'Wifi', servicesCount: 6 }
  },
  'd10': {
    ar: { id: 'd10', name: 'وزارة المالية', description: 'الضرائب، الرسوم، والخدمات المالية.', icon: 'Banknote', servicesCount: 11 },
    en: { id: 'd10', name: 'Ministry of Finance', description: 'Taxes, fees, and financial services.', icon: 'Banknote', servicesCount: 11 }
  },
  'd11': {
    ar: { id: 'd11', name: 'وزارة السياحة', description: 'تراخيص المنشآت السياحية والترويج.', icon: 'Map', servicesCount: 5 },
    en: { id: 'd11', name: 'Ministry of Tourism', description: 'Tourism establishment licensing and promotion.', icon: 'Map', servicesCount: 5 }
  },
  'd12': {
    ar: { id: 'd12', name: 'وزارة الصناعة', description: 'تراخيص المصانع والسجلات الصناعية.', icon: 'Factory', servicesCount: 8 },
    en: { id: 'd12', name: 'Ministry of Industry', description: 'Factory licensing and industrial registers.', icon: 'Factory', servicesCount: 8 }
  }
};

export const KEY_SERVICES_BILINGUAL: Record<string, { ar: Service; en: Service }> = {
  's1': {
    ar: { id: 's1', title: 'إصدار جواز سفر إلكتروني', directorateId: 'd1', isDigital: true, description: 'تقديم طلب للحصول على جواز سفر جديد أو تجديده إلكترونياً.' },
    en: { id: 's1', title: 'E-Passport', directorateId: 'd1', isDigital: true, description: 'Apply for a new e-passport or renew it electronically.' }
  },
  's2': {
    ar: { id: 's2', title: 'خلاصة سجل عدلي (غير محكوم)', directorateId: 'd1', isDigital: true, description: 'الحصول على وثيقة غير محكوم إلكترونياً.' },
    en: { id: 's2', title: 'Non-Criminal Clearance', directorateId: 'd1', isDigital: true, description: 'Get a non-criminal clearance document electronically.' }
  },
  's3': {
    ar: { id: 's3', title: 'دفع المخالفات المرورية', directorateId: 'd1', isDigital: true, description: 'الاستعلام عن المخالفات المرورية وتسديدها.' },
    en: { id: 's3', title: 'Traffic Fines Payment', directorateId: 'd1', isDigital: true, description: 'Check traffic fines and pay them.' }
  },
  's4': {
    ar: { id: 's4', title: 'نتائج التحاليل الطبية', directorateId: 'd3', isDigital: true, description: 'الاطلاع على نتائج التحاليل من المخابر المعتمدة.' },
    en: { id: 's4', title: 'Medical Exam Results', directorateId: 'd3', isDigital: true, description: 'View medical exam results from approved laboratories.' }
  },
  's5': {
    ar: { id: 's5', title: 'نتائج الامتحانات العامة', directorateId: 'd4', isDigital: true, description: 'عرض نتائج الشهادات الإعدادية والثانوية.' },
    en: { id: 's5', title: 'General Exam Results', directorateId: 'd4', isDigital: true, description: 'View secondary and high school exam results.' }
  },
  's6': {
    ar: { id: 's6', title: 'المفاضلة الجامعية', directorateId: 'd5', isDigital: true, description: 'التقدم للمفاضلة الجامعية للعام الدراسي.' },
    en: { id: 's6', title: 'University Admission', directorateId: 'd5', isDigital: true, description: 'Apply for university admission for the current academic year.' }
  },
  's7': {
    ar: { id: 's7', title: 'كشف علامات جامعي', directorateId: 'd5', isDigital: true, description: 'استخراج كشف علامات للسنوات الدراسية.' },
    en: { id: 's7', title: 'University Transcript', directorateId: 'd5', isDigital: true, description: 'Extract academic transcript for study years.' }
  },
  's8': {
    ar: { id: 's8', title: 'دفع فاتورة الكهرباء', directorateId: 'd6', isDigital: true, description: 'تسديد فواتير الكهرباء إلكترونياً.' },
    en: { id: 's8', title: 'Electricity Bill Payment', directorateId: 'd6', isDigital: true, description: 'Pay electricity bills electronically.' }
  },
  's9': {
    ar: { id: 's9', title: 'طلب عداد جديد', directorateId: 'd6', isDigital: false, description: 'تقديم طلب لتركيب عداد كهرباء جديد.' },
    en: { id: 's9', title: 'New Electricity Meter', directorateId: 'd6', isDigital: false, description: 'Submit request to install new electricity meter.' }
  },
  's10': {
    ar: { id: 's10', title: 'دفع فاتورة المياه', directorateId: 'd7', isDigital: true, description: 'تسديد فواتير المياه إلكترونياً.' },
    en: { id: 's10', title: 'Water Bill Payment', directorateId: 'd7', isDigital: true, description: 'Pay water bills electronically.' }
  },
  's11': {
    ar: { id: 's11', title: 'تجديد ترخيص مركبة', directorateId: 'd8', isDigital: true, description: 'تجديد ترخيص المركبات إلكترونياً.' },
    en: { id: 's11', title: 'Vehicle License Renewal', directorateId: 'd8', isDigital: true, description: 'Renew vehicle licenses electronically.' }
  },
  's12': {
    ar: { id: 's12', title: 'بوابة خدمة المواطن', directorateId: 'd9', isDigital: true, description: 'منصة موحدة لكافة الخدمات الإلكترونية.' },
    en: { id: 's12', title: 'Citizen Service Portal', directorateId: 'd9', isDigital: true, description: 'Unified platform for all e-services.' }
  },
  's13': {
    ar: { id: 's13', title: 'براءة ذمة مالية', directorateId: 'd10', isDigital: true, description: 'الحصول على براءة ذمة من الدوائر المالية.' },
    en: { id: 's13', title: 'Financial Clearance', directorateId: 'd10', isDigital: true, description: 'Get a financial clearance from finance departments.' }
  },
  's14': {
    ar: { id: 's14', title: 'بيان ملكية عقارية', directorateId: 'd2', isDigital: true, description: 'الحصول على بيان يوضح الملكيات العقارية.' },
    en: { id: 's14', title: 'Property Statement', directorateId: 'd2', isDigital: true, description: 'Get a statement showing property ownership.' }
  },
  's15': {
    ar: { id: 's15', title: 'التحقق الضريبي', directorateId: 'd10', isDigital: true, description: 'خدمة التحقق من الوثائق الضريبية.' },
    en: { id: 's15', title: 'Tax Verification', directorateId: 'd10', isDigital: true, description: 'Service for verifying tax documents.' }
  },
  's16': {
    ar: { id: 's16', title: 'براءة ذمة جامعي', directorateId: 'd5', isDigital: true, description: 'استخراج كشف علامات للسنوات الدراسية.' },
    en: { id: 's16', title: 'University Transcript', directorateId: 'd5', isDigital: true, description: 'Extract academic transcript for study years.' }
  },
  's17': {
    ar: { id: 's17', title: 'براءة ذمة مالية', directorateId: 'd10', isDigital: true, description: 'الحصول على براءة ذمة من الدوائر المالية.' },
    en: { id: 's17', title: 'Financial Clearance', directorateId: 'd10', isDigital: true, description: 'Get a financial clearance from finance departments.' }
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