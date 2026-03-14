// Thin re-export from split repository modules
// All 71+ files importing { API } from '@/lib/repository' continue to work unchanged
export { API, getComplaintTemplates } from './repositories';
export type { StatisticsData, AdminStatistics } from './repositories';
export type { Investment, InvestmentStats } from './repositories';
export type { Announcement } from './repositories';
export type { AlbumPhoto, AlbumData } from './repositories';
export type { Role } from './repositories';
export type {
  IDirectorateRepository,
  INewsRepository,
  IDecreeRepository,
  IComplaintRepository,
  IStaffRepository,
  IContentRepository,
  IUserRepository,
  ISuggestionRepository,
  IReportsRepository,
  IAnnouncementsRepository,
  IMediaRepository,
  IRolesRepository,
  IServicesRepository,
  IInvestmentRepository,
  IInvestmentApplicationRepository,
  IStaffInvestmentApplicationRepository,
  IPromotionalSectionsRepository,
  INewsletterRepository,
  IFaqRepository,
  ISearchRepository,
  IAiRepository,
} from './repositories';
