import { injectable } from 'tsyringe';
import {
  IOcrService,
  OcrDocumentInput,
  OcrExtractionResult,
} from '../../application/interfaces/services/ocr.service.interface';

@injectable()
export class MockOcrService implements IOcrService {
  async extractDocumentData(
    documents: OcrDocumentInput[],
  ): Promise<OcrExtractionResult> {
    console.log(`OCR processing ${documents.length} document(s)`);

    return {
      fields: {
        fullName: {
          value: 'John Doe',
          confidence: 99.2,
        },

        documentNumber: {
          value: 'A12345678',
          confidence: 98.6,
        },

        nationality: {
          value: 'Indian',
          confidence: 96.8,
        },

        gender: {
          value: 'Male',
          confidence: 98.4,
        },
        dateOfBirth: {
          value: '1995-04-18',
          confidence: 97.5,
        },

        expiryDate: {
          value: '2035-04-18',
          confidence: 99.1,
        },
        issuingCountry: {
          value: 'India',
          confidence: 98.8,
        },
        issuingAuthority: {
          value: 'Government of India',
          confidence: 97.2,
        },
        documentVersion: {
          value: '1',
          confidence: 95.6,
        },
      },
      confidence: 98.3,
      rawResponse: {},
    };
  }
}
