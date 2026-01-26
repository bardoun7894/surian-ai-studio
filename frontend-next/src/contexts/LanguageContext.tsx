'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Brand
  'republic_name': { ar: 'الجمهورية العربية السورية', en: 'Syrian Arab Republic' },
  'ministry_name': { ar: 'وزارة الاقتصاد والصناعة', en: 'Ministry of Economy and Industry' },
  'portal_name': { ar: 'البوابة الإلكترونية', en: 'E-Government Portal' },
  'cabinet': { ar: 'وزارة الاقتصاد والصناعة', en: 'Ministry of Economy and Industry' },
  'unified_platform': { ar: 'المنصة الوطنية الموحدة للخدمات الحكومية الإلكترونية', en: 'The Unified National Platform for E-Government Services' },
  'secure_gateway': { ar: 'بوابة آمنة، خدمات متكاملة، ومستقبل رقمي', en: 'Secure Gateway, Integrated Services, Digital Future' },

  // Nav
  'nav_home': { ar: 'الرئيسية', en: 'Home' },
  'nav_all': { ar: 'الكل', en: 'All' },
  'nav_news': { ar: 'الأخبار', en: 'News' },
  'nav_directory': { ar: 'دليل الجهات', en: 'Directory' },
  'nav_decrees': { ar: 'المراسيم والقوانين', en: 'Decrees & Laws' },
  'nav_complaints': { ar: 'منظومة الشكاوى', en: 'Complaints' },
  'nav_search': { ar: 'بحث', en: 'Search' },

  // Hero
  'hero_services_btn': { ar: 'دليل الخدمات', en: 'Services Guide' },
  'hero_decrees_btn': { ar: 'الجريدة الرسمية', en: 'Official Gazette' },
  'stat_services': { ar: 'خدمة إلكترونية', en: 'E-Services' },
  'stat_secure': { ar: 'بوابة آمنة', en: 'Secure Portal' },
  'stat_transparency': { ar: 'شفافية البيانات', en: 'Data Transparency' },

  // Directorates
  'dir_title_full': { ar: 'دليل الجهات الحكومية', en: 'Government Directory' },
  'dir_subtitle_full': { ar: 'تصفح الدليل الشامل للوزارات والهيئات الحكومية والخدمات الرقمية.', en: 'Browse the comprehensive directory of ministries, agencies, and digital services.' },
  'dir_title_compact': { ar: 'الوصول السريع للجهات', en: 'Quick Access' },
  'dir_subtitle_compact': { ar: 'أكثر الجهات الحكومية طلباً وخدماتها الرقمية.', en: 'Most requested government agencies and their digital services.' },
  'dir_services_selected': { ar: 'خدمات مختارة', en: 'Selected Services' },
  'search_placeholder': { ar: 'بحث عن وزارة أو هيئة...', en: 'Search for a ministry or agency...' },
  'view_details': { ar: 'تصفح', en: 'View' },
  'view_all_dirs': { ar: 'عرض دليل الجهات الكامل', en: 'View Full Directory' },

  // News
  'news_center': { ar: 'المركز الإعلامي', en: 'Media Center' },
  'news_subtitle': { ar: 'آخر الأخبار والمراسيم والقرارات الحكومية', en: 'Latest news, decrees, and government decisions' },
  'news_breaking': { ar: 'أخبار عاجلة', en: 'Breaking News' },
  // External Link Modal
  'external_link_warning_title': { ar: 'تنبيه مغادرة الموقع', en: 'Leaving Website Warning' },
  'external_link_warning_desc': { ar: 'أنت على وشك مغادرة موقع وزارة الاقتصاد والصناعة. الوزارة ليست مسؤولة عن محتوى الروابط الخارجية.', en: 'You are about to leave Ministry of Economy and Industry website. The Ministry is not responsible for the content of external links.' },
  'external_link_stay': { ar: 'البقاء في الموقع', en: 'Stay Here' },
  'external_link_continue': { ar: 'متابعة', en: 'Continue' },
  'read_more': { ar: 'اقرأ المزيد', en: 'Read More' },
  'view_archive': { ar: 'عرض الأرشيف', en: 'View Archive' },

  // Footer
  'quick_links': { ar: 'روابط سريعة', en: 'Quick Links' },
  'contact_us': { ar: 'اتصل بنا', en: 'Contact Us' },
  'accessibility': { ar: 'إمكانية الوصول', en: 'Accessibility' },
  'about_portal': { ar: 'عن البوابة', en: 'About Portal' },
  'footer_admin_login': { ar: 'دخول المسؤولين', en: 'Admin Login' },
  'accessibility_increase': { ar: 'تكبير الخط', en: 'Increase Font' },
  'accessibility_decrease': { ar: 'تصغير الخط', en: 'Decrease Font' },
  'accessibility_high_contrast': { ar: 'تباين عالٍ', en: 'High Contrast' },
  'open_data': { ar: 'البيانات المفتوحة', en: 'Open Data' },
  'site_map': { ar: 'خريطة الموقع (Site Map)', en: 'Site Map' },
  'contact_center': { ar: 'مركز الاتصال الموحد', en: 'Unified Contact Center' },
  'damascus_address': { ar: 'دمشق - ساحة المحافظة - مبنى وزارة الاقتصاد والصناعة', en: 'Damascus - Governorate Square - Ministry of Economy and Industry Building' },
  'copyright': { ar: '© 2025 الجمهورية العربية السورية - جميع الحقوق محفوظة.', en: '© 2025 Syrian Arab Republic - All Rights Reserved.' },
  'footer_desc': { ar: 'البوابة الإلكترونية الرسمية لوزارة الاقتصاد والصناعة. المصدر الموثوق للمعلومات والخدمات.', en: 'The Official E-Portal for the Ministry of Economy and Industry. The trusted source for information and services.' },

  // Complaints
  'complaint_portal_title': { ar: 'بوابة الشكاوى الذكية', en: 'Smart Complaints Portal' },

  // General
  'switch_lang': { ar: 'English', en: 'عربي' },

  // Quick Services
  'quick_services_title': { ar: 'الخدمات الأكثر طلباً', en: 'Most Requested Services' },
  'quick_services_subtitle': { ar: 'وصول سريع لأهم الخدمات الحكومية الإلكترونية', en: 'Quick access to the most important e-government services' },
  'service_industrial_license': { ar: 'ترخيص منشأة صناعية', en: 'Industrial Facility License' },
  'service_import_license': { ar: 'إجازة استيراد', en: 'Import License' },
  'service_export_license': { ar: 'إجازة تصدير', en: 'Export License' },
  'service_sme_financing': { ar: 'تمويل المشاريع الصغيرة', en: 'SME Financing' },
  'service_consumer_complaint': { ar: 'شكوى حماية المستهلك', en: 'Consumer Protection Complaint' },
  'service_company_registration': { ar: 'تسجيل شركة تجارية', en: 'Commercial Company Registration' },
  'access_service': { ar: 'الوصول للخدمة', en: 'Access Service' },

  // Stats & Achievements
  'stats_title': { ar: 'إنجازاتنا بالأرقام', en: 'Our Achievements in Numbers' },
  'stats_achievements_title': { ar: 'إنجازات البوابة بالأرقام', en: 'Portal Achievements In Numbers' },
  'stats_subtitle': { ar: 'نعمل على تطوير الخدمات الحكومية لتحقيق رؤية سوريا الرقمية', en: 'Working to develop government services to achieve Syria digital vision' },
  'stat_total_services': { ar: 'خدمة إلكترونية', en: 'E-Services' },
  'stat_transactions': { ar: 'معاملة منجزة', en: 'Completed Transactions' },
  'stat_complaints_resolved': { ar: 'شكوى محلولة', en: 'Resolved Complaints' },
  'stat_satisfaction': { ar: 'نسبة رضا المستخدمين', en: 'User Satisfaction' },

  // Happiness Indicator
  'happiness_title': { ar: 'كيف كانت تجربتك؟', en: 'How was your experience?' },
  'happiness_subtitle': { ar: 'رأيك يهمنا لتطوير خدماتنا بشكل مستمر', en: 'Your opinion matters for our continuous development' },
  'happiness_thanks': { ar: 'شكراً لتقييمك!', en: 'Thank you for your rating!' },

  // Partners
  'partners_title': { ar: 'الجهات الحكومية الشريكة', en: 'Government Partners' },
  'partners_subtitle': { ar: 'شبكة متكاملة من الوزارات والهيئات الحكومية', en: 'An integrated network of ministries and government agencies' },

  // Navigation (Additional)
  'nav_announcements': { ar: 'الإعلانات', en: 'Announcements' },
  'nav_media_center': { ar: 'المركز الإعلامي', en: 'Media Center' },

  // Complaint Portal
  'complaint_submit_tab': { ar: 'تقديم شكوى جديدة', en: 'Submit New Complaint' },
  'complaint_track_tab': { ar: 'متابعة حالة الطلب', en: 'Track Request' },
  'complaint_form_title': { ar: 'نموذج الشكاوى الموحد', en: 'Unified Complaint Form' },
  'complaint_subtitle': { ar: 'سيتم التعامل مع بياناتك بسرية تامة وتوجيهها للجهة المعنية.', en: 'Your data will be treated with complete confidentiality and directed to the relevant authority.' },
  'complaint_personal_info': { ar: 'بيانات مقدم الشكوى', en: 'Complainant Information' },
  'complaint_first_name': { ar: 'الاسم الأول', en: 'First Name' },
  'complaint_last_name': { ar: 'الاسم الأخير', en: 'Last Name' },
  'complaint_father_name': { ar: 'اسم الأب', en: 'Father Name' },
  'complaint_national_id': { ar: 'الرقم الوطني', en: 'National ID' },
  'complaint_dob': { ar: 'تاريخ الميلاد', en: 'Date of Birth' },
  'complaint_details': { ar: 'تفاصيل الشكوى', en: 'Complaint Details' },
  'complaint_phone': { ar: 'رقم الهاتف', en: 'Phone Number' },
  'complaint_email': { ar: 'البريد الإلكتروني', en: 'Email Address' },
  'complaint_directorate': { ar: 'الجهة (اختياري)', en: 'Directorate (Optional)' },
  'complaint_submit': { ar: 'إرسال الشكوى', en: 'Submit Complaint' },
  'complaint_success': { ar: 'تم استلام طلبك بنجاح', en: 'Request Received Successfully' },
  'complaint_success_desc': { ar: 'يرجى الاحتفاظ برقم التذكرة أدناه لمتابعة حالة الطلب. تم إرسال رسالة تأكيد لرقم هاتفك.', en: 'Please keep the ticket number below to track your request. A confirmation message has been sent to your phone.' },
  'complaint_ticket_number': { ar: 'رقم التذكرة', en: 'Ticket Number' },
  'complaint_track_now': { ar: 'متابعة الطلب الآن', en: 'Track Request Now' },
  'complaint_track_title': { ar: 'متابعة الطلبات', en: 'Track Requests' },
  'complaint_track_subtitle': { ar: 'أدخل رقم التذكرة للاستعلام عن آخر المستجدات.', en: 'Enter the ticket number to inquire about the latest updates.' },
  'complaint_ticket_label': { ar: 'رقم التذكرة', en: 'Ticket Number' },
  'complaint_ticket_placeholder': { ar: 'مثال: GOV-12345', en: 'Example: GOV-12345' },
  'complaint_national_id_verify': { ar: 'الرقم الوطني (للتحقق)', en: 'National ID (for verification)' },
  'complaint_national_id_placeholder': { ar: 'الرقم الوطني', en: 'National ID' },
  'complaint_search': { ar: 'استعلام', en: 'Search' },
  'complaint_not_found': { ar: 'لم يتم العثور على تذكرة بهذا الرقم.', en: 'No ticket found with this number.' },
  'complaint_error': { ar: 'حدث خطأ أثناء الاتصال بالنظام.', en: 'Error connecting to the system.' },
  'complaint_status_new': { ar: 'جديد', en: 'New' },
  'complaint_status_in_progress': { ar: 'قيد المعالجة', en: 'In Progress' },
  'complaint_status_resolved': { ar: 'تم الحل', en: 'Resolved' },
  'complaint_status_rejected': { ar: 'مرفوض', en: 'Rejected' },
  'complaint_last_update': { ar: 'آخر تحديث', en: 'Last Update' },
  'complaint_responses': { ar: 'الردود والتحديثات', en: 'Responses & Updates' },
  'complaint_responses_subtitle': { ar: 'فريق الدعم', en: 'Support Team' },
  'complaint_ocr_upload': { ar: 'أرفق صورة للشكوى المكتوبة (OCR)', en: 'Attach complaint image (OCR)' },
  'complaint_ocr_desc': { ar: 'سيتم استخراج النص تلقائياً من الصورة', en: 'Text will be extracted automatically from the image' },
  'complaint_processing': { ar: 'جاري المعالجة...', en: 'Processing...' },
  'complaint_ticket_prefix': { ar: 'تذكرة #', en: 'Ticket #' },
  'complaint_extracted': { ar: 'تم الاستخراج', en: 'Extracted' },
  'complaint_ai_analyze': { ar: 'تحليل ذكي', en: 'AI Analysis' },
  'complaint_analyzing': { ar: 'جاري التحليل...', en: 'Analyzing...' },
  'complaint_ai_result': { ar: 'نتيجة التحليل الذكي', en: 'AI Analysis Result' },
  'complaint_priority': { ar: 'الأولوية', en: 'Priority' },
  'complaint_category_ai': { ar: 'التصنيف', en: 'Category' },
  'complaint_select_directorate': { ar: '-- اختر الجهة --', en: '-- Select Directorate --' },
  'complaint_sending': { ar: 'جاري الإرسال...', en: 'Sending...' },
  'complaint_placeholder': { ar: 'اشرح المشكلة بالتفصيل أو قم برفع صورة المستند...', en: 'Explain the problem in detail or upload a document image...' },
  'complaint_required': { ar: 'مطلوب', en: 'Required' },
  'complaint_national_id_hint': { ar: '11 خانة', en: '11 digits' },

  // News Section (Additional)
  'news_archive_title': { ar: 'الأرشيف الإعلامي', en: 'Media Archive' },
  'news_archive_desc': { ar: 'تصفح كافة الأخبار والقرارات والتقارير الصحفية الصادرة.', en: 'Browse all news, decisions, and press releases.' },
  'news_filter_all': { ar: 'الكل', en: 'All' },
  'news_filter_politics': { ar: 'سياسة', en: 'Politics' },
  'news_filter_economy': { ar: 'اقتصاد', en: 'Economy' },
  'news_filter_services': { ar: 'خدمات', en: 'Services' },
  'news_filter_decrees': { ar: 'مراسيم', en: 'Decrees' },
  'news_load_more': { ar: 'تحميل المزيد', en: 'Load More' },
  'news_read_details': { ar: 'اقرأ التفاصيل', en: 'Read Details' },
  'news_no_results': { ar: 'لا توجد نتائج', en: 'No results' },
  'news_show_all': { ar: 'عرض الأرشيف الكامل', en: 'View Full Archive' },
  'decrees_title': { ar: 'الجريدة الرسمية والتشريعات', en: 'Official Gazette & Legislation' },
  'decrees_subtitle': { ar: 'البوابة الرسمية للوصول إلى كافة المراسيم التشريعية، القوانين، والقرارات الحكومية الصادرة في الجمهورية العربية السورية.', en: 'The official portal for accessing all legislative decrees, laws, and government decisions issued in the Syrian Arab Republic.' },
  'decrees_search_placeholder': { ar: 'بحث برقم المرسوم، السنة، أو العنوان...', en: 'Search by decree number, year, or title...' },
  'decrees_filter_all': { ar: 'الكل', en: 'All' },
  'decrees_type_legislative': { ar: 'مرسوم تشريعي', en: 'Legislative Decree' },
  'decrees_type_law': { ar: 'قانون', en: 'Law' },
  'decrees_type_presidential': { ar: 'قرار رئاسي', en: 'Presidential Decree' },
  'decrees_type_circular': { ar: 'تعميم', en: 'Circular' },
  'decrees_no_results': { ar: 'لا توجد وثائق مطابقة للبحث', en: 'No matching documents found' },
  'decrees_number_label': { ar: 'رقم', en: 'No.' },
  'decrees_year_label': { ar: 'عام', en: 'Year' },
  'decrees_issue_date': { ar: 'تاريخ الصدور:', en: 'Issue Date:' },
  'decrees_download_pdf': { ar: 'تحميل PDF', en: 'Download PDF' },

  // Chat Bot
  'chat_title': { ar: 'المساعد الحكومي الذكي', en: 'Smart Government Assistant' },
  'chat_online': { ar: 'متصل الآن - يحتفظ بالسياق', en: 'Online - Maintains Context' },
  'chat_welcome': { ar: 'مرحباً بك في البوابة الإلكترونية لوزارة الاقتصاد والصناعة. أنا المساعد الذكي، كيف يمكنني مساعدتك في خدمات الصناعة والتجارة والاقتصاد؟', en: 'Welcome to the Ministry of Economy and Industry E-Portal. I am the smart assistant, how can I help you with industry, trade, and economy services today?' },
  'chat_placeholder': { ar: 'اكتب استفسارك هنا...', en: 'Type your inquiry here...' },
  'chat_attach': { ar: 'إرفاق صورة أو مستند', en: 'Attach image or document' },
  'chat_attach_title': { ar: 'إرفاق صورة أو مستند', en: 'Attach image or document' },
  'chat_ready': { ar: 'جاهز للإرسال (OCR)', en: 'Ready to send (OCR)' },
  'chat_error': { ar: 'عذراً، حدث خطأ في الاتصال بالخدمة. يرجى المحاولة مرة أخرى.', en: 'Sorry, an error occurred connecting to the service. Please try again.' },
  'chat_send': { ar: 'إرسال', en: 'Send' },
  'chat_clear': { ar: 'مسح المحادثة والبدء من جديد', en: 'Clear chat and start over' },
  'chat_clear_title': { ar: 'مسح المحادثة والبدء من جديد', en: 'Clear chat and start over' },
  'chat_disclaimer': { ar: 'هذا النظام مدعوم بالذكاء الاصطناعي ويتذكر محادثاتك السابقة.', en: 'This system is AI-powered and remembers your previous conversations.' },
  'chat_file_large': { ar: 'حجم الملف كبير جداً. يرجى اختيار ملف أقل من 5 ميغابايت.', en: 'File size too large. Please select a file less than 5MB.' },
  'chat_floating_label': { ar: 'المساعد الذكي', en: 'Smart Assistant' },
  'chat_analyze_image': { ar: 'قم بتحليل النص المستخرج من الصورة', en: 'Analyze the text extracted from the image' },
  'chat_analyze_file': { ar: 'قم بتحليل هذا الملف المرفق.', en: 'Analyze this attached file.' },
  'chat_attachment_label': { ar: ' [مرفق: ', en: ' [Attachment: ' },

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
  'contact_email': { ar: 'البريد الإلكتروني', en: 'Email Address' },
  'contact_subject': { ar: 'عنوان الرسالة', en: 'Message Subject' },
  'contact_directorate': { ar: 'الجهة المختصة', en: 'Relevant Directorate' },
  'contact_select_directorate': { ar: '-- اختر الجهة --', en: '-- Select Directorate --' },
  'contact_general': { ar: 'الاستعلامات العامة', en: 'General Inquiries' },
  'contact_complaints': { ar: 'مكتب الشكاوى', en: 'Complaints Office' },
  'contact_media': { ar: 'المكتب الإعلامي', en: 'Media Office' },
  'contact_message': { ar: 'نص الرسالة', en: 'Message Text' },
  'contact_send': { ar: 'إرسال الرسالة', en: 'Send Message' },
  'contact_sending': { ar: 'جاري الإرسال...', en: 'Sending...' },
  'contact_email_placeholder': { ar: 'example@email.com', en: 'example@email.com' },
  'contact_name_placeholder': { ar: 'الاسم الكامل', en: 'Full Name' },
  'contact_subject_placeholder': { ar: 'عنوان الرسالة', en: 'Message Subject' },
  'contact_message_placeholder': { ar: 'اكتب رسالتك هنا...', en: 'Write your message here...' },

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
  'faq_q4': { ar: 'ما هي الوثائق المطلوبة للحصول على ترخيص منشأة صناعية؟', en: 'What documents are required for an industrial facility license?' },
  'faq_a4': { ar: 'يتطلب الحصول على ترخيص منشأة صناعية: دراسة جدوى اقتصادية، مخططات الموقع، الوثائق القانونية للشركة، والموافقات البيئية. يمكنك إتمام العملية عبر الإدارة العامة للصناعة.', en: 'Industrial facility license requires: economic feasibility study, site plans, company legal documents, and environmental approvals. You can complete the process through the General Administration for Industry.' },
  'faq_q5': { ar: 'كيف يمكنني دفع الرسوم الحكومية؟', en: 'How can I pay government fees?' },
  'faq_a5': { ar: 'تدعم البوابة الدفع الإلكتروني عبر المصارف العامة والخاصة المرتبطة بشبكة المدفوعات الوطنية، بالإضافة إلى الدفع عبر شركات الهاتف المحمول.', en: 'The portal supports electronic payment through public and private banks connected to the national payment network, in addition to payment through mobile phone companies.' },

  // About Page
  'about_title': { ar: 'عن البوابة الإلكترونية', en: 'About the E-Portal' },
  'about_subtitle': { ar: 'المنصة الوطنية الموحدة للخدمات الحكومية في الجمهورية العربية السورية. رؤية طموحة لمستقبل رقمي يخدم المواطن ويعزز الشفافية.', en: 'The unified national platform for government services in the Syrian Arab Republic. An ambitious vision for a digital future that serves citizens and enhances transparency.' },
  'about_mission': { ar: 'رسالتنا', en: 'Our Mission' },
  'about_mission_desc': { ar: 'تقديم خدمات حكومية ذكية، متكاملة، وآمنة، تتيح للمواطنين إتمام معاملاتهم بسهولة ويسر من أي مكان وفي أي وقت، مما يساهم في رفع كفاءة العمل الحكومي وتقليل البيروقراطية.', en: 'Providing smart, integrated, and secure government services that enable citizens to complete their transactions easily and conveniently from anywhere and at any time, contributing to improving government efficiency and reducing bureaucracy.' },
  'about_vision': { ar: 'رؤيتنا', en: 'Our Vision' },
  'about_vision_desc': { ar: 'حكومة بلا ورق بحلول عام 2030، تعتمد على البيانات والتقنيات الحديثة لصنع القرار، وتضع رضا المواطن في قلب أولوياتها من خلال تجربة مستخدم سلسة وشفافة.', en: 'A paperless government by 2030, relying on data and modern technologies for decision-making, placing citizen satisfaction at the heart of its priorities through a seamless and transparent user experience.' },
  'requested_services_title': { ar: 'الخدمات الأكثر طلباً', en: 'Most Requested Services' },
  'requested_services_subtitle': { ar: 'الوصول السريع إلى حزمة الخدمات الإلكترونية الأكثر أهمية', en: 'Quick access to the most important e-government services' },
  'view_all_services': { ar: 'عرض كافة الخدمات', en: 'View All Services' },
  's_passport': { ar: 'الجواز الإلكتروني', en: 'E-Passport' },
  's_traffic': { ar: 'مخالفات المرور', en: 'Traffic Fines' },
  's_electricity': { ar: 'فواتير الكهرباء', en: 'Electricity Bills' },
  's_exams': { ar: 'النتائج الامتحانية', en: 'Exam Results' },
  's_finance': { ar: 'براءة الذمة', en: 'Financial Clearance' },
  's_property': { ar: 'البيان العقاري', en: 'Property Statement' },
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
  'announcements_latest': { ar: 'آخر التحديثات', en: 'Latest Updates' },
  'announcements_title': { ar: 'الإعلانات والتنبيهات', en: 'Announcements & Alerts' },
  'announcements_subtitle': { ar: 'تابع أحدث الإعلانات والمناقصات والفرص الحكومية', en: 'Stay updated with the latest announcements, tenders, and government opportunities' },
  'announcements_type_urgent': { ar: 'عاجل', en: 'Urgent' },
  'announcements_type_important': { ar: 'هام', en: 'Important' },
  'announcements_type_general': { ar: 'إعلان', en: 'Announcement' },
  'announcements_view_all': { ar: 'عرض جميع الإعلانات', en: 'View All Announcements' },
  'announcements_read_more': { ar: 'قراءة المزيد', en: 'Read More' },
  'open_data_education': { ar: 'التعليم', en: 'Education' },
  'open_data_health': { ar: 'الصحة', en: 'Health' },
  'open_data_finance': { ar: 'المالية', en: 'Finance' },
  'open_data_energy': { ar: 'الطاقة', en: 'Energy' },
  'open_data_tourism': { ar: 'السياحة', en: 'Tourism' },
  'open_data_environment': { ar: 'البيئة', en: 'Environment' },
  'open_data_daily': { ar: 'يومياً', en: 'Daily' },
  'open_data_photos': { ar: 'صور', en: 'photos' },

  // Authentication

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
  'auth_ministry_name': { ar: 'وزارة الاقتصاد والصناعة', en: 'Ministry of Economy and Industry' },
  'auth_enter_email': { ar: 'أدخل بريدك الإلكتروني', en: 'Enter your email' },
  'auth_enter_phone': { ar: '09xxxxxxxx', en: '09xxxxxxxx' },
  'auth_enter_national_id': { ar: 'أدخل الرقم الوطني', en: 'Enter your national ID' },
  'auth_enter_password': { ar: 'أدخل كلمة المرور', en: 'Enter your password' },
  'auth_ssl_secure': { ar: 'اتصال آمن ومشفر بتقنية SSL', en: 'Secure SSL encrypted connection' },
  'auth_method_email': { ar: 'بريد', en: 'Email' },
  'auth_method_phone': { ar: 'هاتف', en: 'Phone' },
  'auth_method_id': { ar: 'وطني', en: 'ID' },

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
  'forgot_back_login': { ar: 'العودة لتسجيل الدخول', en: 'Back to Login' },

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
  'reset_signin': { ar: 'تسجيل الدخول', en: 'Sign In' },

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
  'media_center_subtitle': { ar: 'مكتبة الفيديو والصور والإنفوجرافيك الرسمية من وزارة الاقتصاد والصناعة', en: 'Official video, photo, and infographic library from Ministry of Economy and Industry' },
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
  'media_duration': { ar: 'مدة', en: 'Duration' },
  'media_photos_count': { ar: 'صور', en: 'photos' },

  // Search Results
  'search_results': { ar: 'نتائج البحث', en: 'Search Results' },
  'search_results_title': { ar: 'نتائج البحث', en: 'Search Results' },
  'search_advanced': { ar: 'بحث متقدم وفلاتر', en: 'Advanced Search & Filters' },
  'search_from': { ar: 'من تاريخ', en: 'From Date' },
  'search_to': { ar: 'إلى تاريخ', en: 'To Date' },
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
  'search_try_again': { ar: 'جرب تغيير معايير البحث', en: 'Try changing search criteria' },
  'search_no': { ar: 'رقم', en: 'No' },
  'search_number': { ar: 'رقم', en: 'No' },
  'decree_no_label': { ar: 'رقم', en: 'No' },

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
  'sitemap_industry': { ar: 'الإدارة العامة للصناعة', en: 'General Administration for Industry' },
  'sitemap_economy': { ar: 'الإدارة العامة للاقتصاد', en: 'General Administration for Economy' },
  'sitemap_trade': { ar: 'الإدارة العامة للتجارة الداخلية وحماية المستهلك', en: 'General Administration for Internal Trade & Consumer Protection' },
  'sitemap_legislative_decrees': { ar: 'المراسيم التشريعية', en: 'Legislative Decrees' },
  'sitemap_laws': { ar: 'القوانين', en: 'Laws' },
  'sitemap_presidential_decisions': { ar: 'القرارات الرئاسية', en: 'Presidential Decisions' },
  'sitemap_circulars': { ar: 'التعاميم', en: 'Circulars' },
  'sitemap_news': { ar: 'الأخبار', en: 'News' },
  'sitemap_videos': { ar: 'الفيديوهات', en: 'Videos' },
  'sitemap_photos': { ar: 'الصور', en: 'Photos' },
  'sitemap_infographics': { ar: 'الإنفوجرافيك', en: 'Infographics' },
  'sitemap_submit': { ar: 'تقديم شكوى', en: 'Submit Complaint' },
  'sitemap_track': { ar: 'تتبع الشكوى', en: 'Track Complaint' },
  'sitemap_previous': { ar: 'الشكاوى السابقة', en: 'Previous Complaints' },
  'sitemap_vision_mission': { ar: 'الرؤية والرسالة', en: 'Vision & Mission' },
  'sitemap_strategic_goals': { ar: 'الأهداف الاستراتيجية', en: 'Strategic Goals' },
  'sitemap_team': { ar: 'فريق العمل', en: 'Team' },
  'sitemap_statistics': { ar: 'الإحصائيات', en: 'Statistics' },
  'sitemap_reports': { ar: 'التقارير', en: 'Reports' },
  'sitemap_raw_data': { ar: 'البيانات الخام', en: 'Raw Data' },
  'nav_login': { ar: 'دخول المواطن', en: 'Citizen Login' },
  'nav_logout': { ar: 'تسجيل الخروج', en: 'Logout' },
  'nav_toggle_theme': { ar: 'تبديل السمة', en: 'Toggle Theme' },
  'sitemap_login': { ar: 'تسجيل الدخول', en: 'Login' },
  'sitemap_register': { ar: 'إنشاء حساب', en: 'Register' },
  'sitemap_dashboard': { ar: 'لوحة التحكم', en: 'Dashboard' },
  'sitemap_applications': { ar: 'طلباتي', en: 'My Applications' },
  'sitemap_notifications': { ar: 'الإشعارات', en: 'Notifications' },
  'sitemap_civil_services': { ar: 'خدمات الأحوال المدنية', en: 'Civil Status Services' },
  'sitemap_financial': { ar: 'الخدمات المالية', en: 'Financial' },
  'sitemap_education': { ar: 'خدمات التعليم', en: 'Education' },
  'sitemap_health': { ar: 'خدمات الصحة', en: 'Health' },
  'sitemap_transportation': { ar: 'خدمات النقل', en: 'Transportation' },
  'sitemap_housing': { ar: 'خدمات الإسكان', en: 'Housing' },
  'sitemap_employment': { ar: 'خدمات العمل', en: 'Employment' },
  'sitemap_projects': { ar: 'خدمات المشاريع', en: 'Projects' },
  'sitemap_security': { ar: 'خدمات الأمن', en: 'Security' },
  'sitemap_environment': { ar: 'خدمات البيئة', en: 'Environment' },
  'sitemap_inquiry': { ar: 'خدمات الاستعلام', en: 'Inquiry' },
  'sitemap_support': { ar: 'خدمات الدعم', en: 'Support' },
  'sitemap_feedback': { ar: 'خدمات التقييم', en: 'Feedback' },

  // Directorate Detail
  'directorate_back': { ar: 'العودة إلى الدليل', en: 'Back to Directory' },
  'directorate_services': { ar: 'الخدمات الإلكترونية المتاحة', en: 'Available E-Services' },
  'directorate_digital': { ar: 'خدمة رقمية فورية', en: 'Instant digital service' },
  'directorate_in_person': { ar: 'تتطلب مراجعة المركز', en: 'Requires center visit' },
  'directorate_no_services': { ar: 'لا توجد خدمات إلكترونية مضافة حالياً.', en: 'No e-services added currently.' },
  'directorate_paper_guide': { ar: 'عرض دليل المعاملات الورقية', en: 'View Paper Transactions Guide' },
  'directorate_news': { ar: 'آخر أخبار الوزارة', en: 'Latest Ministry News' },
  'directorate_contact': { ar: 'معلومات التواصل', en: 'Contact Information' },
  'directorate_address': { ar: 'دمشق - ساحة المحافظة - مبنى وزارة الاقتصاد والصناعة', en: 'Damascus - Governorate Square - Ministry of Economy and Industry Building' },
  'directorate_phone': { ar: '+963 11 222 3333', en: '+963 11 222 3333' },
  'directorate_email': { ar: 'contact@ministry.gov.sy', en: 'contact@ministry.gov.sy' },
  'directorate_website': { ar: 'www.ministry.gov.sy', en: 'www.ministry.gov.sy' },
  'contact_address_damascus': { ar: 'دمشق - ساحة المحافظة - مبنى وزارة الاقتصاد والصناعة', en: 'Damascus - Governorate Square - Ministry of Economy and Industry Building' },
  'directorate_hours': { ar: 'أوقات الدوام الرسمي', en: 'Official Working Hours' },
  'directorate_hours_sun_thu': { ar: 'الأحد - الخميس', en: 'Sunday - Thursday' },
  'directorate_hours_value': { ar: '08:00 ص - 03:30 م', en: '08:00 AM - 03:30 PM' },
  'directorate_fri_sat': { ar: 'الجمعة - السبت', en: 'Friday - Saturday' },
  'directorate_holiday': { ar: 'عطلة رسمية', en: 'Official Holiday' },
  'directorate_not_found': { ar: 'لم يتم العثور على الجهة', en: 'Directorate not found' },

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
  'ui_view_grid': { ar: 'عرض الشبكة', en: 'Grid View' },
  'ui_view_list': { ar: 'عرض القائمة', en: 'List View' },
  'ui_live': { ar: 'مباشر', en: 'Live' },
  'ui_ai': { ar: 'ذكاء اصطناعي', en: 'AI' },
  'ui_smart_summary': { ar: 'ملخص ذكي', en: 'Smart Summary' },
  'ui_smart_summarize': { ar: 'تلخيص ذكي', en: 'Smart Summarize' },
  'ui_analyzing': { ar: 'جاري التحليل...', en: 'Analyzing...' },
  'ui_hide_summary': { ar: 'إخفاء الملخص', en: 'Hide Summary' },
  'ui_exclusive_video': { ar: 'فيديو حصري', en: 'Exclusive Video' },
  'ui_writers': { ar: 'كاتب ومحلل', en: 'Writers & Analysts' },
  'ui_writers_desc': { ar: 'انضم إلى مجتمعنا من الخبراء والمحللين لقراءة تحليلات عميقة.', en: 'Join our community of experts and analysts for deep insights.' },
  'ui_browse_writers': { ar: 'تصفح الكتاب', en: 'Browse Writers' },
  'ui_exclusive_video_title': { ar: 'كواليس التحضيرات النهائية', en: 'Exclusive Behind the Scenes' },
  'ui_exclusive_video_desc': { ar: 'شاهد التقرير الحصري من قلب الحدث مع مراسلنا.', en: 'Watch the exclusive report from the heart of the event with our correspondent.' },
  'ui_breaking': { ar: 'عاجل', en: 'Breaking' },

  // Admin Dashboard
  'admin_panel': { ar: 'لوحة الإدارة', en: 'Admin Panel' },
  'admin_overview': { ar: 'نظرة عامة', en: 'Overview' },
  'admin_complaints': { ar: 'الشكاوى', en: 'Complaints' },
  'admin_content': { ar: 'إدارة المحتوى', en: 'Content Management' },
  'admin_users': { ar: 'المستخدمين', en: 'Users' },
  'admin_logout': { ar: 'تسجيل خروج', en: 'Logout' },
  'admin_search_placeholder': { ar: 'بحث سريع...', en: 'Quick search...' },
  'admin_total_complaints': { ar: 'إجمالي الشكاوى', en: 'Total Complaints' },
  'admin_new_complaints': { ar: 'الشكاوى الجديدة', en: 'New Complaints' },
  'admin_in_progress': { ar: 'قيد المعالجة', en: 'In Progress' },
  'admin_resolved': { ar: 'تم حلها', en: 'Resolved' },
  'admin_complaints_log': { ar: 'سجل الشكاوى الواردة', en: 'Incoming Complaints Log' },
  'admin_ticket_no': { ar: 'رقم التذكرة', en: 'Ticket No.' },
  'admin_status': { ar: 'الحالة', en: 'Status' },
  'admin_last_update': { ar: 'التحديث الأخير', en: 'Last Update' },
  'admin_action': { ar: 'الإجراء', en: 'Action' },
  'admin_view': { ar: 'عرض', en: 'View' },
  'admin_add_new': { ar: 'إضافة جديد', en: 'Add New' },
  'admin_content_mgmt': { ar: 'إدارة المحتوى والمراسيم', en: 'Content & Decrees Management' },
  'admin_under_dev': { ar: 'قيد التطوير', en: 'Under Development' },

  // User Dashboard
  'user_welcome': { ar: 'مرحباً،', en: 'Welcome,' },
  'user_logout': { ar: 'تسجيل الخروج', en: 'Logout' },
  'user_active_requests': { ar: 'الطلبات النشطة', en: 'Active' },
  'user_completed_requests': { ar: 'المنجزة', en: 'Completed' },
  'user_rejected_requests': { ar: 'مرفوضة', en: 'Rejected' },
  'user_my_applications': { ar: 'طلباتي', en: 'My Applications' },
  'user_notifications': { ar: 'الإشعارات', en: 'Notifications' },
  'user_settings': { ar: 'الإعدادات', en: 'Settings' },
  'user_recent_activity': { ar: 'آخر النشاطات', en: 'Recent Activity' },
  'user_quick_actions': { ar: 'إجراءات سريعة', en: 'Quick Actions' },
  'user_all_applications': { ar: 'جميع الطلبات', en: 'All Applications' },
  'user_new_request': { ar: 'طلب جديد', en: 'New Request' },
  'user_book_appt': { ar: 'حجز موعد', en: 'Book Appointment' },
  'user_track_request': { ar: 'تتبع الطلبات', en: 'Track Request' },
  'user_tech_support': { ar: 'الدعم الفني', en: 'Support' },
  'user_account_settings': { ar: 'إعدادات الحساب', en: 'Account Settings' },
  'user_new_password_optional': { ar: 'كلمة المرور الجديدة (اختياري)', en: 'New Password (Optional)' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gov_lang');
      return (saved as Language) || 'ar';
    }
    return 'ar';
  });

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('gov_lang', language);
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);

    // Adjust font based on language if needed, though the stack handles both well
    if (language === 'en') {
      document.body.classList.add('font-english');
    } else {
      document.body.classList.remove('font-english');
    }

  }, [language, direction]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
