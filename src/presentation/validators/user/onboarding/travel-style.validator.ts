import { z } from 'zod';

export const TravelStyleSchema = z.object({
  travelType: z.string().min(1),
  interests: z.array(z.string()).min(1).max(10),
  travelPersonality: z.string().min(1),
  matchWith: z.string().min(1),
});
