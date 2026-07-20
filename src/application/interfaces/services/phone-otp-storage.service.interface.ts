export interface IPhoneOtpService {
  save(phone: string, otp: string): Promise<void>;
  get(phone: string): Promise<string | null>;
  delete(phone: string): Promise<void>;
  hasActiveOtp(phone: string): Promise<boolean>;
}
