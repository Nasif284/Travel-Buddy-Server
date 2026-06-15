import { PrismaClient } from '@prisma/client';

import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { ILookupRepository } from '../../../application/interfaces/repositories/lookups.repository';
import { CountryList } from '../../../application/interfaces/use-cases/lookups/get-countries.interface';

@injectable()
export class LookupRepository implements ILookupRepository {
  constructor(
    @inject(TOKENS.PrismaClient) private readonly _prisma: PrismaClient,
  ) {}
  async getAllCountries(): Promise<CountryList[]> {
    const countries = await this._prisma.country.findMany({
      select: { code: true, flagEmoji: true, name: true, phonePrefix: true },
      orderBy: { name: 'asc' },
    });
    return countries;
  }
}
