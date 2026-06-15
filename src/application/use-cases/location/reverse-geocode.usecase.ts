import { inject, injectable } from 'tsyringe';
import { ReverseGeoCodeRequestDTO } from '../../dtos/location/request/reverse-geocode.dto';
import { ReverseGeoCodeResponseDTO } from '../../dtos/location/response/reverse-geocode.dto';
import { IReverseGeoCode } from '../../interfaces/use-cases/location/reverse-geocode.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IGeocodingService } from '../../interfaces/services/geocode.service.interfcae';
@injectable()
export class ReverseGeoCode implements IReverseGeoCode {
  constructor(
    @inject(TOKENS.IGeocodeService)
    private readonly _geoCodeService: IGeocodingService,
  ) {}
  async execute(
    dto: ReverseGeoCodeRequestDTO,
  ): Promise<ReverseGeoCodeResponseDTO> {
    const { city, country, countryCode, district, state, stateCode } =
      await this._geoCodeService.reverseGeocode(dto.latitude, dto.longitude);
    return {
      city: city ?? '',
      country: country ?? '',
      countryCode: countryCode ?? '',
      district: district ?? '',
      state: state ?? '',
      stateCode: stateCode ?? '',
    };
  }
}
