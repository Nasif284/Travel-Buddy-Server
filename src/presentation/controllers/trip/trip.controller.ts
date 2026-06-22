import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ICreateTrip } from '../../../application/interfaces/use-cases/trip/create-trip.usecase';
import { Request, Response } from 'express';
import { HttpStatus } from '../../../domain/enums/HttpStatusCodes.constants';
import { ApiResponse } from '../../responses/common-response';
import { TRIP_MESSAGES } from '../../../shared/constants/messages/success/trip/trip.messages';
import { IGetTripMatches } from '../../../application/interfaces/use-cases/trip/get-trip-matches.interface';
import { IGetActiveTrip } from '../../../application/interfaces/use-cases/trip/get-active-trip.interface';
import { IGetUserUpcomingTrips } from '../../../application/interfaces/use-cases/trip/get-user-upcoming-trips.interface';
import { IGetMatchProfile } from '../../../application/interfaces/use-cases/trip/get-match-profile.interface';

@injectable()
export class TripController {
  constructor(
    @inject(TOKENS.ICreateTrip)
    private readonly _createTripUseCase: ICreateTrip,
    @inject(TOKENS.IGetTripMatches)
    private readonly _getTripMatches: IGetTripMatches,
    @inject(TOKENS.IGetActiveTrip)
    private readonly _getActiveTrip: IGetActiveTrip,
    @inject(TOKENS.IGetUserUpcomingTrips)
    private readonly _getUserTrips: IGetUserUpcomingTrips,
    @inject(TOKENS.IGetMatchProfile)
    private readonly _getMatchProfile: IGetMatchProfile,
  ) {}
  createTrip = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    console.log(req.body);
    await this._createTripUseCase.execute({ ...req.body, userId });
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(TRIP_MESSAGES.TRIP_CREATED));
  };
  getTripMatches = async (req: Request, res: Response): Promise<Response> => {
    const { page, limit } = req.query;
    const tripId = req.params.tripId;
    const data = await this._getTripMatches.execute({
      tripId: tripId as string,
      limit: Number(limit),
      page: Number(page),
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.FETCHED_TRIP_MATCHES, data));
  };
  getActiveTrip = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const data = await this._getActiveTrip.execute({ userId: userId! });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.FETCHED_ACTIVE_TRIP, data));
  };
  getUserTrips = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const data = await this._getUserTrips.execute({ userId: userId! });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.FETCHED_USER_TRIPS, data));
  };
  getMatchProfile = async (req: Request, res: Response): Promise<Response> => {
    const { matchId } = req.params;
    const userId = req.user?.userId;
    const data = await this._getMatchProfile.execute({
      matchId: matchId as string,
      userId: userId!,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.FETCHED_MATCH_PROFILE, data));
  };
  getUpcomingTrip = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.id;
    console.log(userId);
    const data = await this._getUserTrips.execute({ userId: userId as string });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.FETCHED_USER_TRIPS, data));
  };
}
