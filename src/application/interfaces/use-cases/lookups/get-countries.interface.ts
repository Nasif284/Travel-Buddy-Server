export interface CountryList {
  code: string;
  name: string;
  phonePrefix: string | null;
  flagEmoji: string | null;
}
export interface IGetCountriesList {
  execute(): Promise<CountryList[]>;
}
