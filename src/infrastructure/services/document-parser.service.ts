import { injectable } from 'tsyringe';

export interface ParsedDocument {
  fullName?: string;
  documentNumber?: string;
  nationality?: string;
  gender?: string;
  dateOfBirth?: Date;
  expiryDate?: Date;
  issuingCountry?: string;
  issuingAuthority?: string;
  documentVersion?: string;
}

@injectable()
export class GenericIdParser {
  parse(lines: string[]): ParsedDocument {
    const result: ParsedDocument = {};
    result.fullName = this.extractName(lines);
    result.documentNumber = this.extractDocumentNumber(lines);
    result.gender = this.extractGender(lines);
    result.dateOfBirth = this.extractDOB(lines);
    result.expiryDate = this.extractExpiry(lines);
    result.nationality = this.extractNationality(lines);
    result.issuingCountry = this.extractIssuingCountry(lines);
    return result;
  }

  private extractName(lines: string[]): string | undefined {
    const blacklist = [
      'government',
      'india',
      'passport',
      'identity',
      'card',
      'licence',
      'license',
      'authority',
      'republic',
      'citizen',
      'dob',
      'birth',
      'male',
      'female',
    ];

    for (const line of lines) {
      const lower = line.toLowerCase();
      if (blacklist.some((k) => lower.includes(k))) continue;
      if (/^[A-Za-z ]{5,50}$/.test(line)) return line;
    }

    return undefined;
  }

  private extractDocumentNumber(lines: string[]): string | undefined {
    const patterns = [
      /\b\d{4}\s?\d{4}\s?\d{4}\b/,
      /\b[A-Z]{5}\d{4}[A-Z]\b/,
      /\b[A-Z0-9]{6,20}\b/,
    ];

    for (const line of lines) {
      for (const regex of patterns) {
        const match = line.match(regex);

        if (match) return match[0];
      }
    }

    return undefined;
  }

  private extractDOB(lines: string[]): Date | undefined {
    const regex = /\b\d{2}[/.-]\d{2}[/.-]\d{4}\b/;

    for (const line of lines) {
      const match = line.match(regex);
      if (match) return this.toDate(match[0]);
    }

    return;
  }

  private extractExpiry(lines: string[]): Date | undefined {
    const regex = /\b\d{2}[/.-]\d{2}[/.-]\d{4}\b/;
    for (const line of lines) {
      if (!line.toLowerCase().includes('exp')) continue;
      const match = line.match(regex);
      if (match) return this.toDate(match[0]);
    }
    return;
  }

  private extractGender(lines: string[]): string | undefined {
    for (const line of lines) {
      const lower = line.toLowerCase();

      if (lower.includes('male')) return 'Male';

      if (lower.includes('female')) return 'Female';
    }

    return undefined;
  }

  private extractNationality(lines: string[]): string | undefined {
    for (const line of lines) {
      if (line.toLowerCase().includes('nationality')) {
        return line
          .replace(/nationality/i, '')
          .replace(/:/g, '')
          .trim();
      }
    }
    return undefined;
  }
  private extractIssuingCountry(lines: string[]): string | undefined {
    const text = lines.join(' ').toLowerCase();

    const countries = [
      'india',
      'united states',
      'canada',
      'australia',
      'germany',
      'france',
      'uae',
      'united arab emirates',
      'saudi arabia',
      'qatar',
      'oman',
      'kuwait',
      'singapore',
      'malaysia',
    ];

    const match = countries.find((country) => text.includes(country));

    return match;
  }
  private toDate(value: string): Date | undefined {
    const normalized = value.replace(/[.-]/g, '/');

    const [day, month, year] = normalized.split('/').map(Number);

    if (!day || !month || !year) return;

    const date = new Date(Date.UTC(year, month - 1, day));

    if (isNaN(date.getTime())) return;

    return date;
  }
}
