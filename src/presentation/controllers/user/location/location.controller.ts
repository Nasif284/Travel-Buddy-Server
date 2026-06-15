import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../../infrastructure/di/tokens';
import { Request, Response } from 'express';
import { IUpdateUserLocation } from '../../../../application/interfaces/use-cases/location/update-location.interace';
import { UserNotFoundError } from '../../../../domain/errors/auth.error';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { ApiResponse } from '../../../responses/common-response';
import { LOCATION_MESSAGES } from '../../../../shared/constants/messages/success/user/location.messages';
import { IGetLocation } from '../../../../application/interfaces/use-cases/location/get-location.interface';
import { IReverseGeoCode } from '../../../../application/interfaces/use-cases/location/reverse-geocode.interface';

@injectable()
export class LocationController {
  constructor(
    @inject(TOKENS.IUpdateLocation)
    private readonly _updateLocationUseCase: IUpdateUserLocation,
    @inject(TOKENS.IGetLocation)
    private readonly _getLocationUseCase: IGetLocation,
    @inject(TOKENS.IReverseGeoCode)
    private readonly _reverseGeoCodeUseCase: IReverseGeoCode,
  ) {}

  updateLocation = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const { latitude, longitude } = req.body;
    if (!userId) {
      throw new UserNotFoundError();
    }
    await this._updateLocationUseCase.execute({ userId, latitude, longitude });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(LOCATION_MESSAGES.LOCATION_UPDATED));
  };
  getLocation = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UserNotFoundError();
    }
    const { city, country, district, state } =
      await this._getLocationUseCase.execute({
        userId,
      });
    return res.status(HttpStatus.OK).json(
      ApiResponse.success(LOCATION_MESSAGES.LOCATION_FETCHED, {
        city,
        country,
        district,
        state,
      }),
    );
  };
  reverseGeoCode = async (req: Request, res: Response): Promise<Response> => {
    const { latitude, longitude } = req.body;
    const data = await this._reverseGeoCodeUseCase.execute({
      latitude,
      longitude,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(LOCATION_MESSAGES.LOCATION_FETCHED, data));
  };
}
