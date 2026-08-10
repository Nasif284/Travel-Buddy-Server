import { z } from 'zod';

export const ActivityCategorySchema = z.enum([
  'FOOD',
  'TRANSPORT',
  'ACCOMMODATION',
  'ACTIVITY',
  'SIGHTSEEING',
  'OTHER',
]);

export const GeneratedActivitySchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  category: ActivityCategorySchema,
  location: z.string().nullable().optional(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  durationMinutes: z.number().int().positive(),
  notes: z.string().nullable().optional(),
});

export const GeneratedDaySchema = z.object({
  date: z.string(),
  location: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  activities: z.array(GeneratedActivitySchema),
});

export const GeneratedItinerarySchema = z.object({
  days: z.array(GeneratedDaySchema),
});

export type GeneratedItinerary = z.infer<typeof GeneratedItinerarySchema>;
