import { z } from 'zod';
export const onboardingSourceSchema = z.object({
  source: z.enum([
    'Friends or Family',
    'Social Media',
    'Travel Blog or Article',
    'Search Engine',
    'App Store',
    'other',
  ]),
});
