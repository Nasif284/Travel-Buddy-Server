import { OtpPurpose } from "../../../domain/enums";

export interface IOtpService {
  send(email: string, purpose: OtpPurpose): Promise<void>;
  verify(email: string, code: string, purpose: OtpPurpose): Promise<void>;
  delete(email: string, purpose: OtpPurpose): Promise<void>;
}
