import { container } from 'tsyringe';
import { TOKENS } from '../../tokens';
import { UpdateUserLocation } from '../../../../application/use-cases/location/update-location.usecase';
import { GetLocation } from '../../../../application/use-cases/location/get-location.usecase';
import { ReverseGeoCode } from '../../../../application/use-cases/location/reverse-geocode.usecase';

export function registerLocationDependency() {
  container.registerSingleton<UpdateUserLocation>(
    TOKENS.IUpdateLocation,
    UpdateUserLocation,
  );
  container.registerSingleton<GetLocation>(TOKENS.IGetLocation, GetLocation);
  container.registerSingleton<ReverseGeoCode>(
    TOKENS.IReverseGeoCode,
    ReverseGeoCode,
  );
}
