import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  frontend_url: process.env.FRONTEND_URL,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessExpiration: process.env.ACCESS_TOKEN_TTL,
    refreshExpiration: process.env.REFRESH_TOKEN_TTL,
  },
  redis: {
    url: process.env.REDIS_URL,
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
  s3: {
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION,
    bucketName: process.env.S3_BUCKET_NAME,
  },
  geoCoding: {
    apiKey: process.env.GEOCODING_API_KEY,
  },
};
