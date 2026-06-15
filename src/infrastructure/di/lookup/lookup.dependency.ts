import { container } from 'tsyringe';
import { GetCountries } from '../../../application/use-cases/lookups/get-countries.usecase';
import { TOKENS } from '../tokens';

export function registerLookupDependency(): void {
  container.registerSingleton<GetCountries>(TOKENS.IGetCountries, GetCountries);
}
