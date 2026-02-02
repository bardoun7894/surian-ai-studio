// Localized String support
export interface LocalizedString {
  ar: string;
  en: string;
}

export interface SubDirectorate {
  id: string;
  name: LocalizedString | string;
  url: string;
  isExternal?: boolean;
}

export interface Directorate {
  id: string;
  name: LocalizedString | string;
  description: LocalizedString | string;
  icon: string;
  servicesCount?: number;
  featured?: boolean;
  subDirectorates?: SubDirectorate[];
}

export interface Service {
  id: string;
  title: string;
  title_ar?: string;
  title_en?: string;
  directorateId: string;
  isDigital: boolean;
  description: string;
  description_ar?: string;
  description_en?: string;
  content_ar?: string;
  content_en?: string;
  fees?: string;
  estimated_time?: string;
  requirements?: string[];
}

export interface Article {
  id?: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  imageUrl: string;
}

export interface NewsItem {
  id: string;
  title: string;
  title_ar?: string;
  title_en?: string;
  date: string;
  category: string;
  summary: string;
  summary_ar?: string;
  summary_en?: string;
  content_ar?: string;
  content_en?: string;
  imageUrl?: string;
  isUrgent?: boolean;
  directorate_id?: string;
  directorate_name?: string;
  directorate_name_en?: string;
}

export interface Decree {
  id: string;
  number: string;
  year: string;
  title: string;
  type: string;
  date: string;
  description: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'video' | 'photo' | 'infographic';
  thumbnailUrl: string;
  url?: string;
  date: string;
  duration?: string;
  count?: number;
}

export interface Ticket {
  id: string;
  tracking_number?: string;
  title?: string;
  subject?: string;
  status: 'new' | 'in_progress' | 'resolved' | 'rejected' | string;
  priority?: 'low' | 'normal' | 'medium' | 'high' | 'urgent';
  created_at?: string;
  lastUpdate?: string;
  updated_at?: string;
  notes?: string;
  description?: string;
  directorate?: string;
  responses?: TicketResponse[];
}

export interface TicketResponse {
  id: string;
  content: string;
  created_at: string;
  user?: {
    full_name: string;
  };
}

export interface ComplaintData {
  directorateId?: string; // or directorate name
  directorate?: string;
  templateId?: string;
  title?: string;
  description?: string;
  details?: string; // alias for description
  fullName?: string;
  firstName?: string;
  lastName?: string;
  fatherName?: string;
  dob?: string;
  category?: string;
  nationalId?: string;
  phone?: string;
  email?: string;
  hasPreviousComplaint?: boolean;
  previousTrackingNumber?: string;
  recaptcha_token?: string;
  file?: File | null;
}

export interface SuggestionData {
  firstName?: string;
  lastName?: string;
  fatherName?: string;
  nationalId?: string;
  dob?: string;
  email?: string;
  phone?: string;
  directorate_id?: string;
  description: string;
  files?: File[];
  recaptcha_token?: string;
  is_anonymous?: boolean;
  guest_token?: string;
}

export interface Suggestion {
  id: string | number;
  tracking_number: string;
  description: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  status_label: {
    ar: string;
    en: string;
  };
  created_at: string;
  updated_at: string;
  response?: string | null;
  reviewed_at?: string | null;
  attachments_count: number;
}

export interface Role {
  id: number;
  name: string;
  label: string;
  permissions?: string[];
}

export interface User {
  id: number;
  first_name: string;
  father_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  role_id?: number;
  role?: Role;
  national_id?: string;
  phone?: string;
  birth_date?: string;
  governorate?: string;
  directorate_id?: string;
  directorate?: Directorate;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface PromotionalSection {
  id: number;
  title_ar: string;
  title_en: string;
  description_ar: string | null;
  description_en: string | null;
  button_text_ar: string | null;
  button_text_en: string | null;
  image: string | null;
  background_color: string;
  icon: string;
  button_url: string | null;
  type: 'banner' | 'video' | 'promo' | 'stats';
  type_label: { ar: string; en: string };
  position: 'hero' | 'grid_main' | 'grid_side' | 'grid_bottom';
  position_label: { ar: string; en: string };
  display_order: number;
  metadata?: Record<string, any>;
  video_url?: string;
}

export interface AuditLog {
  id: number;
  user_id: number | null;
  action: string;
  entity_type: string | null;
  entity_id: number | null;
  changes: Record<string, any> | null;
  ip_address: string | null;
  created_at: string;
  user?: {
    id: number;
    full_name: string;
  };
}

export interface FAQ {
  id: string | number;
  question_ar: string;
  answer_ar: string;
  question_en?: string;
  answer_en?: string;
  order?: number;
}

export interface SearchResult {
  id: string;
  title: string;
  title_ar?: string;
  title_en?: string;
  description?: string;
  excerpt?: string;
  date: string;
  type: string;
  category?: string;
  url?: string;
}

export interface SearchResults {
  news: SearchResult[];
  decrees: SearchResult[];
  announcements: SearchResult[];
  services: SearchResult[];
  faqs: SearchResult[];
  pages: SearchResult[];
  total: number;
}

export interface AuditSummary {
  action: string;
  count: number;
}

export interface AuditResponse {
  summary: AuditSummary[];
  recent_activity: AuditLog[];
}
