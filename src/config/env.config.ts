import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  frontend_url: process.env.FRONTEND_URL,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessExpiration: '900',
    refreshExpiration: '2592000',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  db: {
    url: process.env.DATABASE_URL,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  otp: {
    expiryInMinutes: process.env.OTP_EXPIRY_MINUTES,
    maxAttempts: process.env.OTP_MAX_ATTEMPTS,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
  },
};
