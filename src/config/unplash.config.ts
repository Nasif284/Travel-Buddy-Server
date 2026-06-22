import { createApi } from 'unsplash-js';
import { config } from './env.config';

export const unsplashApi = createApi({
  accessKey: config.unsplash.accessKey,
});
