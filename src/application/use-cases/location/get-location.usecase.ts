import { inject, injectable } from 'tsyringe';
import { GetLocationRequestDTO } from '../../dtos/location/request/get-location.dto';
import { GetLocationResponseDTO } from '../../dtos/location/response/get-locatiuon.dto';
import { IGetLocation } from '../../interfaces/use-cases/location/get-location.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';
import { IGeocodingService } from '../../interfaces/services/geocode.service.interfcae';
import { UserLocationDataMissingError } from '../../../domain/errors/user.error';
@injectable()
export class GetLocation implements IGetLocation {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TOKENS.IGeocodeService)
    private readonly _geoCodeService: IGeocodingService,
  ) {}
  async execute(dto: GetLocationRequestDTO): Promise<GetLocationResponseDTO> {
    const { lat, lang } = await this._userRepository.getUserLocation(
      dto.userId,
    );
    const { city, district, state, country } =
      await this._geoCodeService.reverseGeocode(lat, lang);
    if (!city || !district || !state || !country) {
      throw new UserLocationDataMissingError();
    }
    return { city, country, district, state };
  }
}
