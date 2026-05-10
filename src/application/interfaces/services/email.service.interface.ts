export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}
export interface IEmailService {
  sendEmail(options: SendEmailOptions): Promise<void>;
  sendOtp(email: string, code: string): Promise<void>;
}
