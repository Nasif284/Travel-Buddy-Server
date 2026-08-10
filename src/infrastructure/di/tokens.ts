import { ADMIN_TOKENS } from './admin-side/admin/admin.tokens';
import { CHECKLIST_TOKENS } from './client-side/checklsit/checklist.tokens';
import { EXPENSE_TOKENS } from './client-side/expense/tokens';
import { LOOKUP_TOKENS } from './lookup/lookup.tokens';
import { TRIP_TOKENS } from './client-side/trip/tokens';
import { USER_TOKENS } from './client-side/user/user.tokens';
import { VERIFICATION_TOKENS } from './admin-side/verification-queue/verification.tokens';
import { ITINERARY_TOKENS } from './client-side/itenerary/tokens';
import { AI_ASSISTANT_TOKENS } from './client-side/ai-assistant/tokens';

export const TOKENS = {
  IUserRepository: 'IUserRepository',
  IAdminRepository: 'IAdminRepository',
  ILookupRepository: 'ILookupRepository',
  IChecklistRepository: 'IChecklistRepository',
  IExpenseRepository: 'IExpenseRepository',
  IVerificationRepository: 'IVerificationRepository',
  IItineraryRepository: 'IItineraryRepository',
  IAssistantRepository: 'IAssistantRepository',

  AdminAuthenticationMiddleware: 'AdminAuthenticationMiddleware',
  UserAuthMiddleware: 'UserAuthMiddleware',

  IHashService: 'IHashService',
  ITokenService: 'ITokenService',
  ISessionService: 'ISessionService',
  IOtpService: 'IOtpService',
  IEmailService: 'IEmailService',
  IStorageService: 'IStorageService',
  IGeocodeService: 'IGeocodeService',
  IImageService: 'IImageService',
  IWeatherService: 'IWeatherService',
  IPhoneOtpService: 'IPhoneOtpService',
  ISmsService: 'ISmsService',
  ICacheService: 'ICacheService',
  IVerificationQueueService: 'IVerificationQueueService',
  IOcrService: 'IOcrService',
  IDocumentAnalysisService: 'IDocumentAnalysisService',
  IDocumentExtractionService: 'IDocumentExtractionService',
  IAIModelService: 'IAIModelService',
  IPlacesService: 'IPlacesService',
  IAiItineraryService: 'IAiItineraryService',
  GooglePlacesClient: 'GooglePlacesClient',

  PrismaClient: 'PrismaClient',
  RedisClient: 'RedisClient',

  ...USER_TOKENS,
  ...ADMIN_TOKENS,
  ...LOOKUP_TOKENS,
  ...TRIP_TOKENS,
  ...CHECKLIST_TOKENS,
  ...EXPENSE_TOKENS,
  ...VERIFICATION_TOKENS,
  ...ITINERARY_TOKENS,
  ...AI_ASSISTANT_TOKENS,
} as const;
