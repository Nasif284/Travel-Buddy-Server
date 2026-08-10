import { Queue } from 'bullmq';
import { getRedisClient } from '../../../config/redis.config';

export const verificationQueue = new Queue('verification-processing', {
  connection: getRedisClient(),
  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: 'exponential',
      delay: 5000,
    },

    removeOnComplete: 100,
    removeOnFail: 100,
  },
});
