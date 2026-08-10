import { OcrExtractionResult } from './document-extraction.service.interface';

export interface DocumentAnalysisInput {
  extraction: OcrExtractionResult;

  documents: {
    sideCode: string;
    mimeType: string;
    buffer: Buffer;
  }[];
}

export interface DocumentAnalysisResult {
  overallRiskScore: number;

  analysisSummary: {
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';

    checks: {
      title: string;
      status: 'PASSED' | 'FAILED' | 'WARNING';
      message: string;
      confidence?: number;
    }[];
  };
}

export interface IDocumentAnalysisService {
  analyze(input: DocumentAnalysisInput): Promise<DocumentAnalysisResult>;
}
