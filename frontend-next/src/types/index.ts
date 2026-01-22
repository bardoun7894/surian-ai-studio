export interface Directorate {
  id: string;
  name: string;
  description: string;
  icon: string;
  servicesCount: number;
  featured?: boolean;
  subDirectorates?: SubDirectorate[];
}

export interface SubDirectorate {
  id: string;
  name: string;
  url?: string;
  isExternal?: boolean;
}

export interface Service {
  id: string;
  title: string;
  directorateId: string;
  isDigital: boolean;
  description: string;
}

export interface Article {
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
  date: string;
  category: string;
  summary: string;
  imageUrl?: string;
  isUrgent?: boolean;
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
  priority?: 'low' | 'normal' | 'high';
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
    name: string;
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
}

export interface SuggestionData {
  name: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  description: string;
  files?: File[];
}

export interface Suggestion {
  id: string;
  trackingNumber: string;
  status: 'received' | 'under_review' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  national_id?: string;
  phone?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}
