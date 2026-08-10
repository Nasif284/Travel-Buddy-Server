import { RawOcrResult } from './ocr.service.interface';
export interface OcrField {
  value: string | null;
  confidence: number | null;
}

export interface OcrExtractionResult {
  fields: {
    fullName: OcrField;
    documentNumber: OcrField;
    nationality: OcrField;
    gender: OcrField;
    dateOfBirth: {
      value: Date | null;
      confidence: number | null;
    };
    expiryDate: {
      value: Date | null;
      confidence: number | null;
    };
    issuingCountry: OcrField;
    issuingAuthority: OcrField;
    documentVersion: OcrField;
  };
  confidence: number;
}
export interface IDocumentExtractionService {
  extract(raw: RawOcrResult): Promise<OcrExtractionResult>;
}
