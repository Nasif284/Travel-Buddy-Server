import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { IStorageService } from '../../application/interfaces/services/storage.service.interface';
import { s3Client } from '../../config/s3.config';
import { config } from '../../config/env.config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
export class StorageService implements IStorageService {
  async upload(file: Buffer, key: string, mimeType: string): Promise<string> {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: config.s3.bucketName,
        Key: key,
        Body: file,
        ContentType: mimeType,
      }),
    );
    return `https://${config.s3.bucketName}.s3.${config.s3.region}.amazonaws.com/${key}`;
  }
  async getSignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: config.s3.bucketName,
      Key: key,
    });

    return getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
  }
  async delete(key: string): Promise<void> {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: config.s3.bucketName,
        Key: key,
      }),
    );
  }
}
