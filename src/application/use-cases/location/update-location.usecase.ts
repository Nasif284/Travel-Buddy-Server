import { inject, injectable } from 'tsyringe';

import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUpdateUserLocation } from '../../interfaces/use-cases/location/update-location.interace';
import { UpdateLocationRequestDTO } from '../../dtos/location/request/update-location.dto';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';
import { IGeocodingService } from '../../interfaces/services/geocode.service.interfcae';
import { UserLocationDataMissingError } from '../../../domain/errors/user.error';
@injectable()
export class UpdateUserLocation implements IUpdateUserLocation {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TOKENS.IGeocodeService)
    private readonly _geoCodeService: IGeocodingService,
  ) {}
  async execute(dto: UpdateLocationRequestDTO): Promise<void> {
    const { latitude, longitude, userId } = dto;
    const { city, countryCode } = await this._geoCodeService.reverseGeocode(
      latitude,
      longitude,
    );
    if (!city || !countryCode) {
      throw new UserLocationDataMissingError();
    }
    await this._userRepository.updateUserLocation({
      latitude,
      longitude,
      userId,
      city,
      countryCode,
    });
  }
}
