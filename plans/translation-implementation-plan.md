# Frontend Translation Implementation Plan

## Overview
Translate all hardcoded strings in the frontend to support both Arabic (ar) and English (en) languages using the existing `LanguageContext` and `t()` function pattern.

## Current State

### Translation Infrastructure
- **Location**: `contexts/LanguageContext.tsx`
- **Function**: `t(key: string) -> string`
- **Languages**: Arabic (`ar`), English (`en`)
- **Direction**: RTL for Arabic, LTR for English

### Components Analysis

| Component | Translation Status | Pattern Used |
|-----------|-------------------|--------------|
| HeroSection.tsx | ✅ Complete | Uses `t()` function |
| StatsAchievements.tsx | ✅ Complete | Uses `t()` function |
| GovernmentPartners.tsx | ✅ Complete | Uses `t()` function |
| Navbar.tsx | ⚠️ Partial | Mix of `t()` and conditionals |
| Footer.tsx | ⚠️ Partial | Mix of `t()` and conditionals |
| LoginPage.tsx | ⚠️ Partial | Uses `language === 'ar' ? ...` |
| RegisterPage.tsx | ⚠️ Partial | Uses `language === 'ar' ? ...` |
| ServicesGuide.tsx | ⚠️ Partial | Uses `language === 'ar' ? ...` |
| MediaCenter.tsx | ⚠️ Partial | Uses `language === 'ar' ? ...` |
| SitemapPage.tsx | ⚠️ Partial | Uses `language === 'ar' ? ...` |
| SearchResultsPage.tsx | ⚠️ Partial | Uses `language === 'ar' ? ...` |
| ComplaintPortal.tsx | ❌ Arabic Only | Hardcoded Arabic strings |
| NewsSection.tsx | ❌ Arabic Only | Hardcoded Arabic strings |
| ChatBot.tsx | ❌ Arabic Only | Hardcoded Arabic strings |
| ContactSection.tsx | ❌ Arabic Only | Hardcoded Arabic strings |
| FAQSection.tsx | ❌ Arabic Only | Hardcoded Arabic strings |
| AboutPage.tsx | ❌ Arabic Only | Hardcoded Arabic strings |
| OpenDataPage.tsx | ❌ Arabic Only | Hardcoded Arabic strings |
| NewsArchivePage.tsx | ❌ Arabic Only | Hardcoded Arabic strings |
| DirectorateDetail.tsx | ❌ Arabic Only | Hardcoded Arabic strings |
| Announcements.tsx | ⚠️ Partial | Uses `language === 'ar' ? ...` |
| AnnouncementsPage.tsx | ⚠️ Partial | Uses `language === 'ar' ? ...` |
| ForgotPasswordPage.tsx | ⚠️ Partial | Uses `language === 'ar' ? ...` |
| ResetPasswordPage.tsx | ⚠️ Partial | Uses `language === 'ar' ? ...` |

### Constants with Hardcoded Data
- `constants.ts` contains all Arabic-only data:
  - `DIRECTORATES` - Ministry names and descriptions
  - `KEY_SERVICES` - Service titles and descriptions
  - `COMPLAINT_CATEGORIES` - Category names
  - `OFFICIAL_NEWS` - News items
  - `BREAKING_NEWS` - Breaking news
  - `HERO_ARTICLE` - Hero article
  - `GRID_ARTICLES` - Grid articles
  - `DECREES` - Decrees data
  - `MOCK_MEDIA` - Media items

## Implementation Steps

### Step 1: Extend LanguageContext Translations
**File**: `contexts/LanguageContext.tsx`

Add comprehensive translation keys organized by category:

```typescript
// Navigation
'nav_announcements': { ar: 'الإعلانات', en: 'Announcements' },
'nav_media_center': { ar: 'المركز الإعلامي', en: 'Media Center' },

// Complaint Portal
'complaint_submit_tab': { ar: 'تقديم شكوى جديدة', en: 'Submit New Complaint' },
'complaint_track_tab': { ar: 'متابعة حالة الطلب', en: 'Track Request' },
'complaint_form_title': { ar: 'نموذج الشكاوى الموحد', en: 'Unified Complaint Form' },
'complaint_personal_info': { ar: 'بيانات مقدم الشكوى', en: 'Complainant Information' },
'complaint_first_name': { ar: 'الاسم الأول', en: 'First Name' },
'complaint_last_name': { ar: 'الاسم الأخير', en: 'Last Name' },
'complaint_father_name': { ar: 'اسم الأب', en: 'Father Name' },
'complaint_national_id': { ar: 'الرقم الوطني', en: 'National ID' },
'complaint_dob': { ar: 'تاريخ الميلاد', en: 'Date of Birth' },
'complaint_details': { ar: 'تفاصيل الشكوى', en: 'Complaint Details' },
'complaint_phone': { ar: 'رقم الهاتف', en: 'Phone Number' },
'complaint_email': { ar: 'البريد الإلكتروني', en: 'Email Address' },
'complaint_directorate': { ar: 'الجهة', en: 'Directorate' },
'complaint_submit': { ar: 'إرسال الشكوى', en: 'Submit Complaint' },
'complaint_success': { ar: 'تم استلام طلبك بنجاح', en: 'Request Received Successfully' },
'complaint_ticket_number': { ar: 'رقم التذكرة', en: 'Ticket Number' },
'complaint_track_now': { ar: 'متابعة الطلب الآن', en: 'Track Request Now' },
'complaint_track_title': { ar: 'متابعة الطلبات', en: 'Track Requests' },
'complaint_ticket_label': { ar: 'رقم التذكرة', en: 'Ticket Number' },
'complaint_national_id_verify': { ar: 'الرقم الوطني (للتحقق)', en: 'National ID (for verification)' },
'complaint_search': { ar: 'استعلام', en: 'Search' },
'complaint_not_found': { ar: 'لم يتم العثور على تذكرة بهذا الرقم.', en: 'No ticket found with this number.' },
'complaint_error': { ar: 'حدث خطأ أثناء الاتصال بالنظام.', en: 'Error connecting to the system.' },
'complaint_status_new': { ar: 'جديد', en: 'New' },
'complaint_status_in_progress': { ar: 'قيد المعالجة', en: 'In Progress' },
'complaint_status_resolved': { ar: 'تم الحل', en: 'Resolved' },
'complaint_status_rejected': { ar: 'مرفوض', en: 'Rejected' },
'complaint_last_update': { ar: 'آخر تحديث', en: 'Last Update' },
'complaint_responses': { ar: 'الردود والتحديثات', en: 'Responses & Updates' },
'complaint_ocr_upload': { ar: 'أرفق صورة للشكوى المكتوبة (OCR)', en: 'Attach complaint image (OCR)' },
'complaint_ocr_desc': { ar: 'سيتم استخراج النص تلقائياً من الصورة', en: 'Text will be extracted automatically from image' },
'complaint_processing': { ar: 'جاري المعالجة...', en: 'Processing...' },
'complaint_extracted': { ar: 'تم الاستخراج', en: 'Extracted' },
'complaint_ai_analyze': { ar: 'تحليل ذكي', en: 'AI Analysis' },
'complaint_analyzing': { ar: 'جاري التحليل...', en: 'Analyzing...' },
'complaint_ai_result': { ar: 'نتيجة التحليل الذكي', en: 'AI Analysis Result' },
'complaint_priority': { ar: 'الأولوية', en: 'Priority' },
'complaint_category_ai': { ar: 'التصنيف', en: 'Category' },
'complaint_select_directorate': { ar: '-- اختر الجهة --', en: '-- Select Directorate --' },
'complaint_sending': { ar: 'جاري الإرسال...', en: 'Sending...' },

// News Section
'news_center': { ar: 'المركز الإعلامي', en: 'Media Center' },
'news_subtitle': { ar: 'آخر الأخبار والمراسيم والقرارات الحكومية', en: 'Latest news, decrees, and government decisions' },
'news_read_more': { ar: 'اقرأ المزيد', en: 'Read More' },
'news_view_archive': { ar: 'عرض الأرشيف', en: 'View Archive' },
'news_archive_title': { ar: 'الأرشيف الإعلامي', en: 'Media Archive' },
'news_archive_desc': { ar: 'تصفح كافة الأخبار والقرارات والتقارير الصحفية الصادرة.', en: 'Browse all news, decisions, and press releases.' },
'news_filter_all': { ar: 'الكل', en: 'All' },
'news_filter_politics': { ar: 'سياسة', en: 'Politics' },
'news_filter_economy': { ar: 'اقتصاد', en: 'Economy' },
'news_filter_services': { ar: 'خدمات', en: 'Services' },
'news_filter_decrees': { ar: 'مراسيم', en: 'Decrees' },
'news_load_more': { ar: 'تحميل المزيد', en: 'Load More' },
'news_read_details': { ar: 'اقرأ التفاصيل', en: 'Read Details' },

// Chat Bot
'chat_title': { ar: 'المساعد الحكومي الذكي', en: 'Smart Government Assistant' },
'chat_online': { ar: 'متصل الآن - يحتفظ بالسياق', en: 'Online - Maintains Context' },
'chat_welcome': { ar: 'مرحباً بك في البوابة الإلكترونية للحكومة السورية. أنا المساعد الذكي، كيف يمكنني مساعدتك اليوم؟', en: 'Welcome to the Syrian Government E-Portal. I am the smart assistant, how can I help you today?' },
'chat_placeholder': { ar: 'اكتب استفسارك هنا...', en: 'Type your inquiry here...' },
'chat_attach': { ar: 'إرفاق صورة أو مستند', en: 'Attach image or document' },
'chat_ready': { ar: 'جاهز للإرسال (OCR)', en: 'Ready to send (OCR)' },
'chat_error': { ar: 'عذراً، حدث خطأ في الاتصال بالخدمة. يرجى المحاولة مرة أخرى.', en: 'Sorry, an error occurred connecting to the service. Please try again.' },
'chat_send': { ar: 'إرسال', en: 'Send' },
'chat_clear': { ar: 'مسح المحادثة والبدء من جديد', en: 'Clear chat and start over' },
'chat_disclaimer': { ar: 'هذا النظام مدعوم بالذكاء الاصطناعي ويتذكر محادثاتك السابقة.', en: 'This system is AI-powered and remembers your previous conversations.' },
'chat_file_large': { ar: 'حجم الملف كبير جداً. يرجى اختيار ملف أقل من 5 ميغابايت.', en: 'File size too large. Please select a file less than 5MB.' },
'chat_floating_label': { ar: 'المساعد الذكي', en: 'Smart Assistant' },

// Contact Section
'contact_title': { ar: 'تواصل معنا', en: 'Contact Us' },
'contact_subtitle': { ar: 'نحن هنا لخدمتك. يمكنك التواصل معنا عبر النموذج الإلكتروني الموحد أو عبر قنوات الاتصال الرسمية.', en: 'We are here to serve you. You can contact us via the unified electronic form or through official communication channels.' },
'contact_info': { ar: 'معلومات الاتصال', en: 'Contact Information' },
'contact_info_desc': { ar: 'للاستفسارات العاجلة، يرجى الاتصال بمركز خدمة المواطن الموحد. فريقنا جاهز للرد على استفساراتكم على مدار الساعة.', en: 'For urgent inquiries, please contact the unified citizen service center. Our team is ready to respond to your inquiries 24/7.' },
'contact_hotline': { ar: 'الخط الساخن الموحد', en: 'Unified Hotline' },
'contact_email_label': { ar: 'البريد الإلكتروني', en: 'Email Address' },
'contact_headquarters': { ar: 'المقر الرئيسي', en: 'Headquarters' },
'contact_hours': { ar: 'ساعات العمل', en: 'Working Hours' },
'contact_hours_value': { ar: 'الأحد - الخميس: 8:00 ص - 3:30 م', en: 'Sunday - Thursday: 8:00 AM - 3:30 PM' },
'contact_form_title': { ar: 'نموذج المراسلة الإلكتروني', en: 'Electronic Messaging Form' },
'contact_success_title': { ar: 'تم إرسال رسالتك بنجاح', en: 'Message Sent Successfully' },
'contact_success_desc': { ar: 'سيتم الرد على استفسارك خلال 24 ساعة عمل.', en: 'Your inquiry will be responded to within 24 business hours.' },
'contact_full_name': { ar: 'الاسم الكامل', en: 'Full Name' },
'contact_subject': { ar: 'عنوان الرسالة', en: 'Message Subject' },
'contact_directorate': { ar: 'الجهة المختصة', en: 'Relevant Directorate' },
'contact_message': { ar: 'نص الرسالة', en: 'Message Text' },
'contact_send': { ar: 'إرسال الرسالة', en: 'Send Message' },
'contact_sending': { ar: 'جاري الإرسال...', en: 'Sending...' },
'contact_select_directorate': { ar: '-- اختر الجهة --', en: '-- Select Directorate --' },
'contact_general': { ar: 'الاستعلامات العامة', en: 'General Inquiries' },
'contact_complaints': { ar: 'مكتب الشكاوى', en: 'Complaints Office' },
'contact_media': { ar: 'المكتب الإعلامي', en: 'Media Office' },

// FAQ Section
'faq_center': { ar: 'مركز المساعدة', en: 'Help Center' },
'faq_title': { ar: 'الأسئلة الشائعة', en: 'Frequently Asked Questions' },
'faq_subtitle': { ar: 'إجابات على أكثر الاستفسارات شيوعاً حول الخدمات والبوابة.', en: 'Answers to the most common inquiries about services and the portal.' },
'faq_q1': { ar: 'كيف يمكنني إنشاء حساب جديد على بوابة المواطن؟', en: 'How can I create a new account on the citizen portal?' },
'faq_a1': { ar: 'يمكنك إنشاء حساب جديد بالضغط على زر "تسجيل الدخول" في أعلى الصفحة واختيار "إنشاء حساب". ستحتاج إلى رقمك الوطني ورقم هاتف فعال.', en: 'You can create a new account by clicking the "Sign In" button at the top of the page and selecting "Create Account". You will need your national ID and an active phone number.' },
'faq_q2': { ar: 'هل يمكنني تقديم شكوى دون الكشف عن هويتي؟', en: 'Can I submit a complaint without revealing my identity?' },
'faq_a2': { ar: 'نعم، النظام يتيح تقديم الشكاوى بشكل سري، ولكن يفضل تزويدنا بمعلومات الاتصال لنتمكن من متابعة الحل معك.', en: 'Yes, the system allows anonymous complaint submission, but it is preferable to provide contact information so we can follow up with you on the resolution.' },
'faq_q3': { ar: 'كم تستغرق معالجة طلبات الخدمات الإلكترونية؟', en: 'How long does it take to process e-service requests?' },
'faq_a3': { ar: 'تختلف المدة حسب نوع الخدمة، ولكن معظم الخدمات الإلكترونية الفورية (مثل استخراج البيانات) تتم خلال دقائق. المعاملات التي تتطلب تدقيقاً قد تستغرق من 1 إلى 3 أيام عمل.', en: 'The duration varies depending on the service type, but most instant e-services (such as data extraction) are completed within minutes. Transactions requiring verification may take 1 to 3 business days.' },
'faq_q4': { ar: 'ما هي الوثائق المطلوبة لتجديد جواز السفر؟', en: 'What documents are required for passport renewal?' },
'faq_a4': { ar: 'يتطلب تجديد جواز السفر: الهوية الشخصية، صورة شخصية حديثة، ودفع الرسوم الإلكترونية. يمكنك إتمام العملية كاملة عبر قسم "وزارة الداخلية" في البوابة.', en: 'Passport renewal requires: Personal ID, recent photo, and electronic fee payment. You can complete the entire process through the "Ministry of Interior" section on the portal.' },
'faq_q5': { ar: 'كيف يمكنني دفع الرسوم الحكومية؟', en: 'How can I pay government fees?' },
'faq_a5': { ar: 'تدعم البوابة الدفع الإلكتروني عبر المصارف العامة والخاصة المرتبطة بشبكة المدفوعات الوطنية، بالإضافة إلى الدفع عبر شركات الهاتف المحمول.', en: 'The portal supports electronic payment through public and private banks connected to the national payment network, in addition to payment through mobile phone companies.' },

// About Page
'about_title': { ar: 'عن البوابة الإلكترونية', en: 'About the E-Portal' },
'about_subtitle': { ar: 'المنصة الوطنية الموحدة للخدمات الحكومية في الجمهورية العربية السورية. رؤية طموحة لمستقبل رقمي يخدم المواطن ويعزز الشفافية.', en: 'The unified national platform for government services in the Syrian Arab Republic. An ambitious vision for a digital future that serves citizens and enhances transparency.' },
'about_mission': { ar: 'رسالتنا', en: 'Our Mission' },
'about_mission_desc': { ar: 'تقديم خدمات حكومية ذكية، متكاملة، وآمنة، تتيح للمواطنين إتمام معاملاتهم بسهولة ويسر من أي مكان وفي أي وقت، مما يساهم في رفع كفاءة العمل الحكومي وتقليل البيروقراطية.', en: 'Providing smart, integrated, and secure government services that enable citizens to complete their transactions easily and conveniently from anywhere and at any time, contributing to improving government efficiency and reducing bureaucracy.' },
'about_vision': { ar: 'رؤيتنا', en: 'Our Vision' },
'about_vision_desc': { ar: 'حكومة بلا ورق بحلول عام 2030، تعتمد على البيانات والتقنيات الحديثة لصنع القرار، وتضع رضا المواطن في قلب أولوياتها من خلال تجربة مستخدم سلسة وشفافة.', en: 'A paperless government by 2030, relying on data and modern technologies for decision-making, placing citizen satisfaction at the heart of its priorities through a seamless and transparent user experience.' },
'about_pillars': { ar: 'ركائزنا الاستراتيجية', en: 'Our Strategic Pillars' },
'about_security': { ar: 'الأمان والخصوصية', en: 'Security & Privacy' },
'about_security_desc': { ar: 'حماية بيانات المواطنين وفق أعلى المعايير العالمية.', en: 'Protecting citizens data according to the highest global standards.' },
'about_inclusivity': { ar: 'الشمولية', en: 'Inclusivity' },
'about_inclusivity_desc': { ar: 'خدمات متاحة لجميع فئات المجتمع بما في ذلك ذوي الاحتياجات الخاصة.', en: 'Services available to all segments of society including people with special needs.' },
'about_digital': { ar: 'التحول الرقمي', en: 'Digital Transformation' },
'about_digital_desc': { ar: 'أتمتة شاملة للإجراءات وربط المؤسسات الحكومية.', en: 'Comprehensive automation of procedures and linking government institutions.' },
'about_efficiency': { ar: 'الكفاءة والسرعة', en: 'Efficiency & Speed' },
'about_efficiency_desc': { ar: 'تقليص زمن إنجاز المعاملات ورفع جودة الأداء.', en: 'Reducing transaction completion time and improving performance quality.' },
'about_users': { ar: 'مستخدم نشط', en: 'Active Users' },
'about_services_count': { ar: 'خدمة إلكترونية', en: 'E-Services' },
'about_satisfaction': { ar: 'نسبة الرضا', en: 'Satisfaction Rate' },
'about_support': { ar: 'دعم فني', en: 'Technical Support' },

// Open Data
'open_data_title': { ar: 'منصة البيانات المفتوحة', en: 'Open Data Platform' },
'open_data_subtitle': { ar: 'تعزيزاً للشفافية والابتكار، تتيح الحكومة الوصول إلى مجموعة واسعة من البيانات الحكومية القابلة للمعالجة وإعادة الاستخدام مجاناً.', en: 'To promote transparency and innovation, the government provides access to a wide range of government data that can be processed and reused for free.' },
'open_data_search': { ar: 'بحث عن مجموعة بيانات...', en: 'Search for dataset...' },
'open_data_filter': { ar: 'تصفية', en: 'Filter' },
'open_data_size': { ar: 'الحجم', en: 'Size' },
'open_data_updated': { ar: 'آخر تحديث', en: 'Last Updated' },
'open_data_format': { ar: 'الصيغة', en: 'Format' },
'open_data_download': { ar: 'تحميل البيانات', en: 'Download Data' },
'open_data_education': { ar: 'التعليم', en: 'Education' },
'open_data_health': { ar: 'الصحة', en: 'Health' },
'open_data_finance': { ar: 'المالية', en: 'Finance' },
'open_data_energy': { ar: 'الطاقة', en: 'Energy' },
'open_data_tourism': { ar: 'السياحة', en: 'Tourism' },
'open_data_environment': { ar: 'البيئة', en: 'Environment' },
'open_data_daily': { ar: 'يومياً', en: 'Daily' },
'open_data_photos': { ar: 'صور', en: 'photos' },

// Announcements
'announcements_title': { ar: 'الإعلانات والتنبيهات', en: 'Announcements & Alerts' },
'announcements_subtitle': { ar: 'تابع أحدث الإعلانات والمناقصات والفرص الحكومية', en: 'Stay updated with latest announcements, tenders, and government opportunities' },
'announcements_latest': { ar: 'آخر التحديثات', en: 'Latest Updates' },
'announcements_page_title': { ar: 'الإعلانات والمناقصات', en: 'Announcements & Tenders' },
'announcements_page_subtitle': { ar: 'تابع أحدث الإعلانات الحكومية والمناقصات وفرص العمل والدورات التدريبية', en: 'Follow latest government announcements, tenders, job opportunities, and training courses' },
'announcements_view_all': { ar: 'عرض جميع الإعلانات', en: 'View All Announcements' },
'announcements_type_urgent': { ar: 'عاجل', en: 'Urgent' },
'announcements_type_important': { ar: 'هام', en: 'Important' },
'announcements_type_general': { ar: 'إعلان', en: 'Announcement' },
'announcements_type_tender': { ar: 'مناقصة', en: 'Tender' },
'announcements_type_job': { ar: 'توظيف', en: 'Job' },
'announcements_category_tenders': { ar: 'مناقصات', en: 'Tenders' },
'announcements_category_jobs': { ar: 'توظيف', en: 'Employment' },
'announcements_category_training': { ar: 'تدريب', en: 'Training' },
'announcements_category_tech': { ar: 'تقنية', en: 'Technology' },
'announcements_category_admin': { ar: 'إداري', en: 'Administrative' },
'announcements_filter_all_types': { ar: 'جميع الأنواع', en: 'All Types' },
'announcements_filter_all_categories': { ar: 'جميع التصنيفات', en: 'All Categories' },
'announcements_search': { ar: 'ابحث في الإعلانات...', en: 'Search announcements...' },
'announcements_showing': { ar: 'عرض', en: 'Showing' },
'announcements_of': { ar: 'من', en: 'of' },
'announcements_no_results': { ar: 'لا توجد إعلانات', en: 'No Announcements Found' },
'announcements_try_different': { ar: 'جرب تغيير معايير البحث', en: 'Try changing your search criteria' },
'announcements_read_more': { ar: 'قراءة المزيد', en: 'Read More' },
'announcements_view_details': { ar: 'عرض التفاصيل', en: 'View Details' },
'announcements_official_portal': { ar: 'البوابة الرسمية', en: 'Official Portal' },

// Authentication
'auth_login_title': { ar: 'تسجيل الدخول', en: 'Sign In' },
'auth_login_subtitle': { ar: 'سجل دخولك للوصول إلى خدماتك الحكومية', en: 'Sign in to access your government services' },
'auth_register_title': { ar: 'إنشاء حساب جديد', en: 'Create Account' },
'auth_register_subtitle': { ar: 'سجل الآن للوصول إلى جميع الخدمات الحكومية', en: 'Register now to access all government services' },
'auth_email': { ar: 'البريد الإلكتروني', en: 'Email Address' },
'auth_phone': { ar: 'رقم الهاتف', en: 'Phone Number' },
'auth_national_id': { ar: 'الرقم الوطني', en: 'National ID' },
'auth_password': { ar: 'كلمة المرور', en: 'Password' },
'auth_remember': { ar: 'تذكرني', en: 'Remember me' },
'auth_forgot_password': { ar: 'نسيت كلمة المرور؟', en: 'Forgot password?' },
'auth_sign_in_btn': { ar: 'تسجيل الدخول', en: 'Sign In' },
'auth_no_account': { ar: 'ليس لديك حساب؟', en: "Don't have an account?" },
'auth_create_account': { ar: 'إنشاء حساب جديد', en: 'Create account' },
'auth_back_home': { ar: 'العودة للرئيسية', en: 'Back to Home' },
'auth_back_login': { ar: 'العودة لتسجيل الدخول', en: 'Back to Login' },
'auth_secure': { ar: 'اتصال آمن ومشفر', en: 'Secure encrypted connection' },
'auth_verify': { ar: 'تحقق من الهوية', en: 'Identity verification' },
'auth_protect': { ar: 'حماية بياناتك الشخصية', en: 'Personal data protection' },
'auth_ministry_name': { ar: 'وزارة الاقتصاد والتجارة الخارجية', en: 'Ministry of Economy & Foreign Trade' },
'auth_enter_email': { ar: 'أدخل بريدك الإلكتروني', en: 'Enter your email' },
'auth_enter_phone': { ar: '09xxxxxxxx', en: '09xxxxxxxx' },
'auth_enter_national_id': { ar: 'أدخل الرقم الوطني', en: 'Enter your national ID' },
'auth_enter_password': { ar: 'أدخل كلمة المرور', en: 'Enter your password' },
'auth_ssl_secure': { ar: 'اتصال آمن ومشفر بتقنية SSL', en: 'Secure SSL encrypted connection' },

// Registration Steps
'reg_step_personal': { ar: 'المعلومات الشخصية', en: 'Personal Info' },
'reg_step_contact': { ar: 'معلومات الاتصال', en: 'Contact Info' },
'reg_step_password': { ar: 'كلمة المرور', en: 'Password' },
'reg_full_name': { ar: 'الاسم الكامل', en: 'Full Name' },
'reg_full_name_placeholder': { ar: 'الاسم الثلاثي', en: 'Full name' },
'reg_birth_date': { ar: 'تاريخ الميلاد', en: 'Birth Date' },
'reg_governorate': { ar: 'المحافظة', en: 'Governorate' },
'reg_select_governorate': { ar: 'اختر المحافظة', en: 'Select governorate' },
'reg_phone_placeholder': { ar: '09xxxxxxxx', en: '09xxxxxxxx' },
'reg_verification': { ar: 'سيتم إرسال رمز التحقق إلى هاتفك وبريدك الإلكتروني للتأكد من صحة البيانات.', en: 'A verification code will be sent to your phone and email to verify your information.' },
'reg_new_password': { ar: 'كلمة المرور الجديدة', en: 'New Password' },
'reg_password_placeholder': { ar: 'أدخل كلمة مرور قوية', en: 'Enter a strong password' },
'reg_confirm_password': { ar: 'تأكيد كلمة المرور', en: 'Confirm Password' },
'reg_reenter_password': { ar: 'أعد إدخال كلمة المرور', en: 'Re-enter password' },
'reg_password_requirements': { ar: 'متطلبات كلمة المرور:', en: 'Password requirements:' },
'reg_password_length': { ar: '8 أحرف على الأقل', en: 'At least 8 characters' },
'reg_password_uppercase': { ar: 'حرف كبير واحد على الأقل', en: 'At least one uppercase letter' },
'reg_password_number': { ar: 'رقم واحد على الأقل', en: 'At least one number' },
'reg_agree_terms': { ar: 'أوافق على شروط الاستخدام وسياسة الخصوصية', en: 'I agree to Terms of Service and Privacy Policy' },
'reg_previous': { ar: 'السابق', en: 'Previous' },
'reg_next': { ar: 'التالي', en: 'Next' },
'reg_create': { ar: 'إنشاء الحساب', en: 'Create Account' },
'reg_protected': { ar: 'بياناتك محمية ومشفرة', en: 'Your data is protected & encrypted' },
'reg_already_account': { ar: 'لديك حساب بالفعل؟', en: 'Already have an account?' },
'reg_back_home': { ar: '← العودة للصفحة الرئيسية', en: '← Back to Home' },

// Forgot Password
'forgot_title': { ar: 'نسيت كلمة المرور؟', en: 'Forgot Password?' },
'forgot_subtitle': { ar: 'أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور', en: 'Enter your email to receive a password reset link' },
'forgot_email_placeholder': { ar: 'example@domain.com', en: 'example@domain.com' },
'forgot_send_link': { ar: 'إرسال الرابط', en: 'Send Link' },
'forgot_sent_title': { ar: 'تم الإرسال', en: 'Email Sent' },
'forgot_sent_desc': { ar: 'تم إرسال تعليمات إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.', en: 'Password reset instructions have been sent to your email.' },

// Reset Password
'reset_title': { ar: 'إعادة تعيين كلمة المرور', en: 'Reset Password' },
'reset_subtitle': { ar: 'أدخل كلمة المرور الجديدة لحسابك', en: 'Enter a new password for your account' },
'reset_new_password': { ar: 'كلمة المرور الجديدة', en: 'New Password' },
'reset_confirm_password': { ar: 'تأكيد كلمة المرور', en: 'Confirm Password' },
'reset_save': { ar: 'حفظ التغييرات', en: 'Save Changes' },
'reset_success_title': { ar: 'تم تغيير كلمة المرور', en: 'Password Changed' },
'reset_success_desc': { ar: 'تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.', en: 'Your password has been successfully updated. You can now login.' },
'reset_mismatch': { ar: 'كلمات المرور غير متطابقة', en: 'Passwords do not match' },
'reset_cancel': { ar: 'إلغاء', en: 'Cancel' },

// Services Guide
'services_guide_title': { ar: 'دليل الخدمات الحكومية', en: 'Government Services Guide' },
'services_guide_subtitle': { ar: 'تصفح جميع الخدمات الحكومية الإلكترونية والتقليدية المتاحة للمواطنين', en: 'Browse all electronic and traditional government services available to citizens' },
'services_search': { ar: 'ابحث عن خدمة...', en: 'Search for a service...' },
'services_all_agencies': { ar: 'جميع الجهات', en: 'All Agencies' },
'services_filter_all': { ar: 'الكل', en: 'All' },
'services_digital': { ar: 'إلكترونية', en: 'Digital' },
'services_in_person': { ar: 'حضورية', en: 'In-Person' },
'services_available': { ar: 'خدمة متاحة', en: 'services available' },
'services_instant': { ar: 'فوري', en: 'Instant' },
'services_apply': { ar: 'تقديم الطلب', en: 'Apply' },
'services_no_results': { ar: 'لا توجد نتائج', en: 'No Results Found' },
'services_try_change': { ar: 'جرب تغيير معايير البحث أو الفلترة', en: 'Try changing your search or filter criteria' },

// Media Center
'media_center_title': { ar: 'المركز الإعلامي', en: 'Media Center' },
'media_center_subtitle': { ar: 'مكتبة الفيديو والصور والإنفوجرافيك الرسمية من رئاسة مجلس الوزراء', en: 'Official video, photo, and infographic library from Prime Ministry' },
'media_filter_all': { ar: 'الكل', en: 'All' },
'media_filter_video': { ar: 'فيديو', en: 'Videos' },
'media_filter_photo': { ar: 'صور', en: 'Photos' },
'media_filter_infographic': { ar: 'إنفوجرافيك', en: 'Infographics' },
'media_items': { ar: 'عنصر', en: 'items' },
'media_view': { ar: 'مشاهدة', en: 'View' },
'media_share': { ar: 'مشاركة', en: 'Share' },
'media_download': { ar: 'تحميل', en: 'Download' },
'media_no_items': { ar: 'لا توجد عناصر', en: 'No Items Found' },
'media_no_content': { ar: 'لا يوجد محتوى في هذه الفئة حالياً', en: 'No content in this category currently' },

// Search Results
'search_results_title': { ar: 'نتائج البحث', en: 'Search Results' },
'search_advanced': { ar: 'بحث متقدم وفلاتر', en: 'Advanced Search & Filters' },
'search_date_from': { ar: 'من تاريخ', en: 'From Date' },
'search_date_to': { ar: 'إلى تاريخ', en: 'To Date' },
'search_entity': { ar: 'الجهة / التصنيف', en: 'Entity / Category' },
'search_reset': { ar: 'إعادة تعيين', en: 'Reset' },
'search_tab_all': { ar: 'الكل', en: 'All' },
'search_tab_news': { ar: 'أخبار', en: 'News' },
'search_tab_decrees': { ar: 'مراسيم وقوانين', en: 'Decrees & Laws' },
'search_tab_announcements': { ar: 'إعلانات', en: 'Announcements' },
'search_section_news': { ar: 'الأخبار', en: 'News' },
'search_section_decrees': { ar: 'المراسيم والقوانين', en: 'Decrees & Laws' },
'search_no_results': { ar: 'لا توجد نتائج', en: 'No results found' },
'search_try_keywords': { ar: 'جرب كلمات بحث مختلفة', en: 'Try different keywords' },
'search_no': { ar: 'رقم', en: 'No' },

// Sitemap
'sitemap_title': { ar: 'خريطة الموقع', en: 'Site Map' },
'sitemap_subtitle': { ar: 'استعرض جميع صفحات وأقسام البوابة الإلكترونية للوصول السريع', en: 'Browse all pages and sections of the portal for quick access' },
'sitemap_back': { ar: 'العودة للرئيسية', en: 'Back to Home' },
'sitemap_home': { ar: 'الصفحة الرئيسية', en: 'Home' },
'sitemap_directory': { ar: 'دليل الجهات الحكومية', en: 'Government Directory' },
'sitemap_services': { ar: 'دليل الخدمات', en: 'Services Guide' },
'sitemap_decrees': { ar: 'المراسيم والقوانين', en: 'Decrees & Laws' },
'sitemap_media': { ar: 'المركز الإعلامي', en: 'Media Center' },
'sitemap_complaints': { ar: 'منظومة الشكاوى', en: 'Complaints System' },
'sitemap_about': { ar: 'عن البوابة', en: 'About Portal' },
'sitemap_open_data': { ar: 'البيانات المفتوحة', en: 'Open Data' },
'sitemap_account': { ar: 'حساب المستخدم', en: 'User Account' },
'sitemap_sub_pages': { ar: 'صفحة فرعية', en: 'sub-pages' },
'sitemap_service_categories': { ar: 'فئات الخدمات (14 فئة)', en: 'Service Categories (14)' },

// Directorate Detail
'directorate_back': { ar: 'العودة إلى الدليل', en: 'Back to Directory' },
'directorate_services': { ar: 'الخدمات الإلكترونية المتاحة', en: 'Available E-Services' },
'directorate_digital': { ar: 'خدمة رقمية فورية', en: 'Instant digital service' },
'directorate_in_person': { ar: 'تتطلب مراجعة المركز', en: 'Requires center visit' },
'directorate_no_services': { ar: 'لا توجد خدمات إلكترونية مضافة حالياً.', en: 'No e-services added currently.' },
'directorate_paper_guide': { ar: 'عرض دليل المعاملات الورقية', en: 'View Paper Transactions Guide' },
'directorate_news': { ar: 'آخر أخبار الوزارة', en: 'Latest Ministry News' },
'directorate_contact': { ar: 'معلومات التواصل', en: 'Contact Information' },
'directorate_address': { ar: 'دمشق، ساحة يوسف العظمة، مبنى الوزارة', en: 'Damascus, Youssef Al-Azmeh Square, Ministry Building' },
'directorate_hours': { ar: 'أوقات الدوام الرسمي', en: 'Official Working Hours' },
'directorate_hours_sun_thu': { ar: 'الأحد - الخميس', en: 'Sunday - Thursday' },
'directorate_hours_value': { ar: '08:00 ص - 03:30 م', en: '08:00 AM - 03:30 PM' },
'directorate_fri_sat': { ar: 'الجمعة - السبت', en: 'Friday - Saturday' },
'directorate_holiday': { ar: 'عطلة رسمية', en: 'Official Holiday' },
'directorate_not_found': { ar: 'Ministry not found', en: 'Ministry not found' },

// General UI
'ui_loading': { ar: 'جاري التحميل...', en: 'Loading...' },
'ui_no_results': { ar: 'لا توجد نتائج مطابقة لبحثك', en: 'No matching results for your search' },
'ui_show_all': { ar: 'عرض الكل', en: 'Show All' },
'ui_close': { ar: 'إغلاق', en: 'Close' },
'ui_save': { ar: 'حفظ', en: 'Save' },
'ui_cancel': { ar: 'إلغاء', en: 'Cancel' },
'ui_confirm': { ar: 'تأكيد', en: 'Confirm' },
'ui_delete': { ar: 'حذف', en: 'Delete' },
'ui_edit': { ar: 'تعديل', en: 'Edit' },
'ui_view': { ar: 'عرض', en: 'View' },
'ui_download': { ar: 'تحميل', en: 'Download' },
'ui_upload': { ar: 'رفع', en: 'Upload' },
'ui_search': { ar: 'بحث', en: 'Search' },
'ui_filter': { ar: 'تصفية', en: 'Filter' },
'ui_sort': { ar: 'ترتيب', en: 'Sort' },
'ui_required': { ar: 'مطلوب', en: 'Required' },
'ui_optional': { ar: 'اختياري', en: 'Optional' },
'ui_yes': { ar: 'نعم', en: 'Yes' },
'ui_no': { ar: 'لا', en: 'No' },
'ui_submit': { ar: 'إرسال', en: 'Submit' },
'ui_back': { ar: 'عودة', en: 'Back' },
'ui_next': { ar: 'التالي', en: 'Next' },
'ui_previous': { ar: 'السابق', en: 'Previous' },
'ui_swipe': { ar: 'اسحب للمزيد', en: 'Swipe for more' },
```

### Step 2: Update Constants for Bilingual Support
**File**: `constants.ts`

Create a helper function to get localized data:

```typescript
// Add at top of file
import { useLanguage } from './contexts/LanguageContext';

// Create bilingual data structures
export const DIRECTORATES_BILINGUAL: Record<string, { ar: Directorate; en: Directorate }> = {
  'd1': {
    ar: { id: 'd1', name: 'وزارة الداخلية', description: 'إدارة الأحوال المدنية، الجوازات، وشؤون الهجرة والمرور.', icon: 'ShieldAlert', servicesCount: 15 },
    en: { id: 'd1', name: 'Ministry of Interior', description: 'Civil registry, passports, immigration and traffic affairs.', icon: 'ShieldAlert', servicesCount: 15 }
  },
  // ... repeat for all directorates
};

// Helper function to get localized directorates
export const getDirectorates = (language: 'ar' | 'en'): Directorate[] => {
  return Object.values(DIRECTORATES_BILINGUAL).map(d => d[language]);
};
```

### Step 3: Refactor Components

**For Conditional Pattern Components** (e.g., `LoginPage.tsx`, `RegisterPage.tsx`):

Before:
```typescript
{language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
```

After:
```typescript
{t('auth_login_title')}
```

**For Arabic-Only Components** (e.g., `ComplaintPortal.tsx`, `NewsSection.tsx`):

1. Import `useLanguage` hook
2. Replace all hardcoded strings with `t('key')`

Before:
```typescript
<h2>نموذج الشكاوى الموحد</h2>
```

After:
```typescript
const { t } = useLanguage();
<h2>{t('complaint_form_title')}</h2>
```

### Step 4: Component-Specific Changes

#### ComplaintPortal.tsx
- Add `useLanguage()` hook
- Replace all Arabic strings with translation keys
- Update form labels, buttons, messages

#### NewsSection.tsx
- Add `useLanguage()` hook
- Replace section titles, labels

#### ChatBot.tsx
- Add `useLanguage()` hook
- Replace welcome message, placeholders, error messages

#### ContactSection.tsx
- Add `useLanguage()` hook
- Replace form labels, success messages

#### FAQSection.tsx
- Add `useLanguage()` hook
- Replace questions and answers

#### AboutPage.tsx
- Add `useLanguage()` hook
- Replace all content

#### OpenDataPage.tsx
- Add `useLanguage()` hook
- Replace labels, categories

#### NewsArchivePage.tsx
- Add `useLanguage()` hook
- Replace filters, labels

#### DirectorateDetail.tsx
- Add `useLanguage()` hook
- Replace all content

#### Announcements.tsx & AnnouncementsPage.tsx
- Replace conditionals with `t()` function

#### Authentication Pages (Login, Register, ForgotPassword, ResetPassword)
- Replace conditionals with `t()` function

#### ServicesGuide.tsx, MediaCenter.tsx, SitemapPage.tsx, SearchResultsPage.tsx
- Replace conditionals with `t()` function

## Testing Checklist

- [ ] Language toggle works correctly on all pages
- [ ] All text switches between Arabic and English
- [ ] RTL/LTR direction changes correctly
- [ ] No hardcoded strings remain
- [ ] Constants data displays correctly in both languages
- [ ] Form validation messages are translated
- [ ] Error messages are translated
- [ ] Success messages are translated
- [ ] Placeholder text is translated
- [ ] Accessibility labels are translated

## Files to Modify

1. `contexts/LanguageContext.tsx` - Add ~300 translation keys
2. `constants.ts` - Restructure for bilingual support
3. `components/Navbar.tsx` - Replace conditionals
4. `components/Footer.tsx` - Replace conditionals
5. `components/ComplaintPortal.tsx` - Full translation
6. `components/NewsSection.tsx` - Full translation
7. `components/ChatBot.tsx` - Full translation
8. `components/ContactSection.tsx` - Full translation
9. `components/FAQSection.tsx` - Full translation
10. `components/AboutPage.tsx` - Full translation
11. `components/OpenDataPage.tsx` - Full translation
12. `components/NewsArchivePage.tsx` - Full translation
13. `components/DirectorateDetail.tsx` - Full translation
14. `components/Announcements.tsx` - Replace conditionals
15. `components/AnnouncementsPage.tsx` - Replace conditionals
16. `components/LoginPage.tsx` - Replace conditionals
17. `components/RegisterPage.tsx` - Replace conditionals
18. `components/ForgotPasswordPage.tsx` - Replace conditionals
19. `components/ResetPasswordPage.tsx` - Replace conditionals
20. `components/ServicesGuide.tsx` - Replace conditionals
21. `components/MediaCenter.tsx` - Replace conditionals
22. `components/SitemapPage.tsx` - Replace conditionals
23. `components/SearchResultsPage.tsx` - Replace conditionals

## Priority Order

1. **High Priority**: Core navigation and authentication pages
2. **Medium Priority**: Main content pages (complaints, news, services)
3. **Low Priority**: Supplementary pages (about, open data, sitemap)
