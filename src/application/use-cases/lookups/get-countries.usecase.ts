import { inject, injectable } from 'tsyringe';
import {
  CountryList,
  IGetCountriesList,
} from '../../interfaces/use-cases/lookups/get-countries.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ILookupRepository } from '../../interfaces/repositories/lookups.repository';

@injectable()
export class GetCountries implements IGetCountriesList {
  constructor(
    @inject(TOKENS.ILookupRepository)
    private readonly _lookupRepository: ILookupRepository,
  ) {}
  async execute(): Promise<CountryList[]> {
    const countries = this._lookupRepository.getAllCountries();
    return countries;
  }
}
