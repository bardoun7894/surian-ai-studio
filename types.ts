export interface Directorate {
  id: string;
  name: string;
  description: string;
  icon: string;
  servicesCount: number;
}

export interface Service {
  id: string;
  title: string;
  directorateId: string;
  isDigital: boolean;
}

export interface ComplaintData {
  fullName?: string;
  phone: string;
  category: string;
  details: string;
  directorate?: string;
}

export interface Ticket {
  id: string;
  status: 'new' | 'in_progress' | 'resolved' | 'rejected';
  lastUpdate: string;
  notes?: string;
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

export type ViewState = 'HOME' | 'COMPLAINTS' | 'DIRECTORATES';