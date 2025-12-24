import { Directorate, Service, Article } from './types';

export const DIRECTORATES: Directorate[] = [
  {
    id: 'd1',
    name: 'وزارة الداخلية',
    description: 'إدارة الأحوال المدنية، الجوازات، والمرور.',
    icon: 'Shield',
    servicesCount: 12
  },
  {
    id: 'd2',
    name: 'وزارة الصحة',
    description: 'الخدمات الطبية، التراخيص الصحية، والمستشفيات.',
    icon: 'Heart',
    servicesCount: 8
  },
  {
    id: 'd3',
    name: 'وزارة التربية والتعليم',
    description: 'شؤون المدارس، المناهج، والامتحانات.',
    icon: 'Book',
    servicesCount: 15
  },
  {
    id: 'd4',
    name: 'وزارة النقل',
    description: 'تراخيص المركبات، الطرق، والمواصلات العامة.',
    icon: 'Bus',
    servicesCount: 6
  }
];

export const KEY_SERVICES: Service[] = [
  { id: 's1', title: 'تجديد جواز السفر', directorateId: 'd1', isDigital: true },
  { id: 's2', title: 'دفع المخالفات المرورية', directorateId: 'd1', isDigital: true },
  { id: 's3', title: 'حجز موعد عيادة', directorateId: 'd2', isDigital: true },
  { id: 's4', title: 'الاستعلام عن النتائج', directorateId: 'd3', isDigital: true },
];

export const COMPLAINT_CATEGORIES = [
  'خدمات إلكترونية متعثرة',
  'سوء معاملة موظفين',
  'تأخر في الإنجاز',
  'نظافة وصيانة مرافق',
  'مقترحات تطوير'
];

export const BREAKING_NEWS = [
  "مجلس الوزراء يعتمد الخطة الخمسية للتحول الرقمي",
  "إطلاق منصة 'تواصل' لاستقبال مقترحات المواطنين",
  "وزارة الصحة تفتتح 5 مستشفيات ذكية جديدة",
  "تخفيض رسوم الخدمات الحكومية بنسبة 20% للفئات المستحقة"
];

export const HERO_ARTICLE: Article = {
  title: "مستقبل الخدمات الحكومية: ذكاء اصطناعي في خدمة المواطن",
  excerpt: "تعرف على أحدث التقنيات التي نستخدمها لتحسين تجربتك الحكومية، من تحليل الشكاوى آلياً إلى توقع احتياجاتك قبل طلبها.",
  category: "تكنولوجيا",
  date: "20 مايو 2024",
  author: "أحمد محمد",
  readTime: "5 دقائق",
  imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000"
};

export const GRID_ARTICLES: Article[] = [
  {
      title: "دليلك الشامل لاستخدام البوابة الموحدة",
      excerpt: "خطوات بسيطة لإنشاء حساب والوصول لكافة الخدمات.",
      category: "دليل المستخدم",
      date: "19 مايو 2024",
      author: "سارة علي",
      readTime: "3 دقائق",
      imageUrl: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=500"
  },
  {
      title: "التحول الرقمي في قطاع التعليم",
      excerpt: "كيف تساهم التكنولوجيا في تطوير المناهج الدراسية.",
      category: "تعليم",
      date: "18 مايو 2024",
      author: "خالد يوسف",
      readTime: "4 دقائق",
      imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=500"
  },
  {
      title: "مبادرات الصحة الرقمية الجديدة",
      excerpt: "خدمات التطبيب عن بعد والوصفات الإلكترونية.",
      category: "صحة",
      date: "17 مايو 2024",
      author: "د. ليلى حسن",
      readTime: "6 دقائق",
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=500"
  }
];