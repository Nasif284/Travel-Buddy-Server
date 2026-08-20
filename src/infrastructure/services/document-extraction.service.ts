import { injectable } from 'tsyringe';
import { GenericIdParser, ParsedDocument } from './document-parser.service';
import {
  IDocumentExtractionService,
  OcrExtractionResult,
} from '../../application/interfaces/services/document-extraction.service.interface';
import { RawOcrResult } from '../../application/interfaces/services/ocr.service.interface';

@injectable()
export class DocumentExtractionService implements IDocumentExtractionService {
  private readonly parser = new GenericIdParser();

  async extract(raw: RawOcrResult): Promise<OcrExtractionResult> {
    const lines = this.normalize(raw.text);
    const parsed = this.parser.parse(lines);
    const confidence = this.calculateConfidence(parsed);
    const fields = {
      fullName: {
        value: parsed.fullName ?? null,
        confidence: parsed.fullName ? 100 : null,
      },

      documentNumber: {
        value: parsed.documentNumber ?? null,
        confidence: parsed.documentNumber ? 100 : null,
      },

      nationality: {
        value: parsed.nationality ?? null,
        confidence: parsed.nationality ? 100 : null,
      },

      gender: {
        value: parsed.gender ?? null,
        confidence: parsed.gender ? 100 : null,
      },

      dateOfBirth: {
        value: parsed.dateOfBirth ?? null,
        confidence: parsed.dateOfBirth ? 100 : null,
      },

      expiryDate: {
        value: parsed.expiryDate ?? null,
        confidence: parsed.expiryDate ? 100 : null,
      },

      issuingCountry: {
        value: parsed.issuingCountry ?? null,
        confidence: null,
      },

      issuingAuthority: {
        value: parsed.issuingAuthority ?? null,
        confidence: null,
      },

      documentVersion: {
        value: parsed.documentVersion ?? null,
        confidence: null,
      },
    };
    console.log('fields:', fields);
    console.log('confidence:', confidence);
    return {
      fields,
      confidence,
    };
  }

  private normalize(text: string): string[] {
    return text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => l.replace(/\s+/g, ' '));
  }

  private calculateConfidence(parsed: ParsedDocument): number {
    let score = 0;

    if (parsed.fullName) score += 20;
    if (parsed.documentNumber) score += 25;
    if (parsed.dateOfBirth) score += 20;
    if (parsed.gender) score += 15;
    if (parsed.nationality) score += 10;
    if (parsed.expiryDate) score += 10;

    return score;
  }
}
