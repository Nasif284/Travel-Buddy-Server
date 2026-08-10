import { Worker } from 'bullmq';

import { getRedisClient } from '../../../config/redis.config';

import { processVerificationProcessor } from '../processors/process-verification.processor';

export const verificationWorker = new Worker(
  'verification-processing',
  processVerificationProcessor,
  {
    connection: getRedisClient(),
  },
);
verificationWorker.on('ready', () => {
  console.log('[Verification Worker] Ready');
});

verificationWorker.on('active', (job) => {
  console.log(`[Verification Worker] Started ${job.id}`);
});

verificationWorker.on('completed', (job) => {
  console.log(`[Verification Worker] Completed ${job.id}`);
});

verificationWorker.on('failed', (job, error) => {
  console.error(`[Verification Worker] Failed ${job?.id}`, error);
});
