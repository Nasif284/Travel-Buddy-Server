export interface IVerificationProcessing {
  execute(dto: { verificationId: string }): Promise<void>;
}
