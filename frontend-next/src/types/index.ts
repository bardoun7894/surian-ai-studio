// Paginated API Response
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

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
  description?: LocalizedString | string;
  description_ar?: string;
  description_en?: string;
  phone?: string;
  email?: string;
  address?: LocalizedString | string;
  address_ar?: string;
  address_en?: string;
}

export interface DirectorateTeam {
  id: string;
  name: string;
  name_ar: string;
  name_en?: string;
  position: string;
  position_ar: string;
  position_en?: string;
  image?: string;
  order: number;
}

export interface Directorate {
  id: string;
  name: LocalizedString | string;
  description: LocalizedString | string;
  icon: string;
  logo?: string;
  servicesCount?: number;
  newsCount?: number;
  featured?: boolean;
  subDirectorates?: SubDirectorate[];
  team?: DirectorateTeam[];
  latitude?: number;
  longitude?: number;
  address?: string;
  address_ar?: string;
  address_en?: string;
  email?: string;
  phone?: string;
  website?: string;
  working_hours_ar?: string;
  working_hours_en?: string;
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

export interface DecreeAttachment {
  id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  download_url: string;
}

export interface Decree {
  id: string;
  number: string;
  year: string;
  title: string;
  title_ar?: string;
  title_en?: string;
  type: string;
  type_en?: string;
  date: string;
  description: string;
  description_ar?: string;
  description_en?: string;
  content_ar?: string;
  content_en?: string;
  directorate_id?: string;
  directorate_name?: string;
  directorate_name_en?: string;
  attachments?: DecreeAttachment[];
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
  ai_category?: string;
  ai_priority?: string;
  template_id?: string | number;
  template_fields?: Record<string, string>;
  created_at?: string;
  lastUpdate?: string;
  updated_at?: string;
  notes?: string;
  description?: string;
  directorate?: string | {
    id?: string;
    name?: string;
    name_ar?: string;
    name_en?: string;
  };
  full_name?: string;
  phone?: string;
  email?: string;
  attachments?: Array<{
    id?: string | number;
    file_name?: string;
    mime_type?: string;
    size?: number;
  }>;
  responses?: TicketResponse[];
  rating?: number;
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
  files?: File[];
  // M1-T3: Pre-uploaded staged file IDs (sent instead of raw files)
  staged_attachment_ids?: string[];
  session_token?: string;
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
  // M1-T3: Pre-uploaded staged file IDs (sent instead of raw files)
  staged_attachment_ids?: string[];
  session_token?: string;
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

export interface Favorite {
  id: number;
  content_type: 'news' | 'announcement' | 'service' | 'law';
  content_id: string;
  metadata?: Record<string, any>;
  content?: Record<string, any>;
  created_at: string;
}

export interface AutocompleteSuggestion {
  text: string;
  type: string;
  url: string;
}

export interface AuditSummary {
  action: string;
  count: number;
}

export interface AuditResponse {
  summary: AuditSummary[];
  recent_activity: AuditLog[];
}
export interface Investment {
  id: number;
  title_ar: string;
  title_en: string;
  sector_ar: string;
  sector_en: string;
  location_ar: string;
  location_en: string;
  investment_amount?: number;
  formatted_amount?: string;
  currency?: string;
  status: string;
  status_label?: { ar: string; en: string };
  category: string;
  icon: string;
  image?: string;
  is_featured: boolean;
  description_ar?: string;
  description_en?: string;
  requirements?: any;
  fee?: string;
  processing_time?: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface InvestmentStats {
  total_opportunities: number;
  available_count: number;
  total_investment_value: number;
  sectors_count: number;
  labels: Record<string, { ar: string; en: string }>;
}
