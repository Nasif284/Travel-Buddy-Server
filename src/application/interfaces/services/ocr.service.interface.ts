export interface OcrDocumentInput {
  sideCode: string;
  mimeType: string;
  buffer: Buffer;
}

export interface RawOcrResult {
  text: string;
}

export interface IOcrService {
  extractDocumentData(documents: OcrDocumentInput[]): Promise<RawOcrResult>;
}
