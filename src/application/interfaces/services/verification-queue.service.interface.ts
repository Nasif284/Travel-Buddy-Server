export interface IVerificationQueueService {
  enqueue(verificationId: string): Promise<void>;
}
