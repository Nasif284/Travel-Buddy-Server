import { injectable } from 'tsyringe';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';

import {
  IOcrService,
  OcrDocumentInput,
  RawOcrResult,
} from '../../application/interfaces/services/ocr.service.interface';

@injectable()
export class GoogleDocumentAiService implements IOcrService {
  private readonly client: DocumentProcessorServiceClient;

  private readonly processorName: string;

  constructor() {
    this.client = new DocumentProcessorServiceClient({
      apiEndpoint: `${process.env.GOOGLE_DOCUMENT_AI_LOCATION}-documentai.googleapis.com`,
    });

    this.processorName = this.client.processorPath(
      process.env.GOOGLE_CLOUD_PROJECT_ID!,
      process.env.GOOGLE_DOCUMENT_AI_LOCATION!,
      process.env.GOOGLE_DOCUMENT_AI_PROCESSOR_ID!,
    );
  }

  async extractDocumentData(
    documents: OcrDocumentInput[],
  ): Promise<RawOcrResult> {
    try {
      if (!documents.length) {
        throw new Error('No documents supplied.');
      }
      const document = documents[0];

      const [response] = await this.client.processDocument({
        name: this.processorName,

        rawDocument: {
          content: document.buffer.toString('base64'),
          mimeType: document.mimeType,
        },
      });
      const text = response.document?.text ?? '';
      return {
        text,
      };
    } catch (error: any) {
      console.dir(error, { depth: null });
      throw error;
    }
  }
}
