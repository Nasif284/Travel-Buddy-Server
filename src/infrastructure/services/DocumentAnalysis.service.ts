import { injectable } from 'tsyringe';

import {
  DocumentAnalysisInput,
  DocumentAnalysisResult,
  IDocumentAnalysisService,
} from '../../application/interfaces/services/doucment-analysis.service.interface';

@injectable()
export class RuleBasedDocumentAnalysisService implements IDocumentAnalysisService {
  async analyze(input: DocumentAnalysisInput): Promise<DocumentAnalysisResult> {
    const checks: DocumentAnalysisResult['analysisSummary']['checks'] = [];

    let riskScore = 100;

    const fields = input.extraction.fields;

    const evaluateField = (
      title: string,
      value: string | Date | null,
      penalty: number,
      required = true,
    ) => {
      if (value) {
        checks.push({
          title,
          status: 'PASSED',
          message: `${title} extracted successfully.`,
          confidence: 100,
        });

        return;
      }

      if (required) {
        riskScore -= penalty;

        checks.push({
          title,
          status: 'FAILED',
          message: `${title} could not be extracted.`,
        });
      } else {
        checks.push({
          title,
          status: 'WARNING',
          message: `${title} is missing.`,
        });
      }
    };

    evaluateField('Full Name', fields.fullName.value, 25);

    evaluateField('Document Number', fields.documentNumber.value, 30);

    evaluateField('Date Of Birth', fields.dateOfBirth.value, 15, false);

    evaluateField('Gender', fields.gender.value, 5, false);

    evaluateField('Nationality', fields.nationality.value, 5, false);

    evaluateField('Expiry Date', fields.expiryDate.value, 10, false);

    if (input.documents.length === 0) {
      riskScore -= 30;

      checks.push({
        title: 'Uploaded Documents',
        status: 'FAILED',
        message: 'No documents uploaded.',
      });
    } else {
      checks.push({
        title: 'Uploaded Documents',
        status: 'PASSED',
        message: `${input.documents.length} document(s) uploaded.`,
      });
    }

    const totalBytes = input.documents.reduce(
      (sum, d) => sum + d.buffer.length,
      0,
    );

    if (totalBytes < 100 * 1024) {
      riskScore -= 10;

      checks.push({
        title: 'Image Quality',
        status: 'WARNING',
        message: 'Uploaded image size is very small.',
      });
    } else {
      checks.push({
        title: 'Image Quality',
        status: 'PASSED',
        message: 'Image size appears acceptable.',
      });
    }

    if (input.extraction.confidence < 40) {
      riskScore -= 20;

      checks.push({
        title: 'Extraction Confidence',
        status: 'FAILED',
        message: 'Very few document fields could be extracted.',
        confidence: input.extraction.confidence,
      });
    } else if (input.extraction.confidence < 70) {
      riskScore -= 10;

      checks.push({
        title: 'Extraction Confidence',
        status: 'WARNING',
        message: 'Some document fields are missing.',
        confidence: input.extraction.confidence,
      });
    } else {
      checks.push({
        title: 'Extraction Confidence',
        status: 'PASSED',
        message: 'Document extraction completed successfully.',
        confidence: input.extraction.confidence,
      });
    }

    riskScore = Math.max(0, Math.min(100, riskScore));

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';

    if (riskScore >= 80) riskLevel = 'LOW';
    else if (riskScore >= 50) riskLevel = 'MEDIUM';
    else riskLevel = 'HIGH';

    return {
      overallRiskScore: riskScore,

      analysisSummary: {
        riskLevel,
        checks,
      },
    };
  }
}
