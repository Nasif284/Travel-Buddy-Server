import { CountryList } from '../use-cases/lookups/get-countries.interface';

export interface ILookupRepository {
  getAllCountries(): Promise<CountryList[]>;
}
