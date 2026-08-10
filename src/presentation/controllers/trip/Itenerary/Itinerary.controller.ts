import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../../infrastructure/di/tokens';
import { IGetGroupItineraryUseCase } from '../../../../application/interfaces/use-cases/itenary/get-itenary.interface';
import { Request, Response } from 'express';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { ApiResponse } from '../../../responses/common-response';
import { ITINERARY_MESSAGES } from '../../../../shared/constants/messages/success/trip/itenary.messages';
import { ICreateItineraryDayUseCase } from '../../../../application/interfaces/use-cases/itenary/create-day.interface';
import { IUpdateItineraryActivityUseCase } from '../../../../application/interfaces/use-cases/itenary/update-activity.interface';
import { IToggleActivityCompletionUseCase } from '../../../../application/interfaces/use-cases/itenary/toggle-complete.interface';
import { IDeleteItineraryActivityUseCase } from '../../../../application/interfaces/use-cases/itenary/delete-activity.interface';
import { IUpdateItineraryDayUseCase } from '../../../../application/interfaces/use-cases/itenary/update-dat.interface';
import { IDeleteItineraryDayUseCase } from '../../../../application/interfaces/use-cases/itenary/delete-day.interface';
import { ICreateItineraryActivityUseCase } from '../../../../application/interfaces/use-cases/itenary/careate-activity.interface';
import { ISetupItineraryUseCase } from '../../../../application/interfaces/use-cases/itenary/setup-itinerary.interface';
import { IGenerateAiItineraryUseCase } from '../../../../application/interfaces/use-cases/itenary/generate-ai-itinerary.interface';
import { ISaveItineraryUseCase } from '../../../../application/use-cases/itinerary/save-tinerary.usecase';

@injectable()
export class ItineraryController {
  constructor(
    @inject(TOKENS.ISetupItineraryUseCase)
    private readonly _setupItinerary: ISetupItineraryUseCase,
    @inject(TOKENS.IGetGroupItineraryUseCase)
    private readonly _getItinerary: IGetGroupItineraryUseCase,
    @inject(TOKENS.ICreateItineraryDayUseCase)
    private readonly _createDay: ICreateItineraryDayUseCase,
    @inject(TOKENS.IUpdateItineraryActivityUseCase)
    private readonly _updateActivity: IUpdateItineraryActivityUseCase,
    @inject(TOKENS.IToggleActivityCompletionUseCase)
    private readonly _toggleActivityComplete: IToggleActivityCompletionUseCase,
    @inject(TOKENS.IDeleteItineraryActivityUseCase)
    private readonly _deleteActivity: IDeleteItineraryActivityUseCase,
    @inject(TOKENS.IUpdateItineraryDayUseCase)
    private readonly _updateDay: IUpdateItineraryDayUseCase,
    @inject(TOKENS.IDeleteItineraryDayUseCase)
    private readonly _deleteDay: IDeleteItineraryDayUseCase,
    @inject(TOKENS.ICreateItineraryActivityUseCase)
    private readonly _createActivity: ICreateItineraryActivityUseCase,
    @inject(TOKENS.IGenerateAiItineraryUseCase)
    private readonly _generateAiItinerary: IGenerateAiItineraryUseCase,
    @inject(TOKENS.ISaveItineraryUseCase)
    private readonly _saveGenerated: ISaveItineraryUseCase,
  ) {}
  setupItinerary = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const response = await this._setupItinerary.execute({
      groupId: req.params.id as string,
      userId: userId!,
    });

    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(ITINERARY_MESSAGES.SETUP_ITINERARY, response));
  };
  getGroupItinerary = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const response = await this._getItinerary.execute({
      groupId: req.params.id as string,
    });
    console.log(response);
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(ITINERARY_MESSAGES.GET_ITINERARIES, response));
  };
  createItineraryDay = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const userId = req.user?.userId;
    const [year, month, day] = req.body.date.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const response = await this._createDay.execute({
      groupId: req.params.id as string,
      userId: userId!,
      date,
      location: req.body.location,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      summary: req.body.summary,
    });

    return res
      .status(HttpStatus.CREATED)
      .json(
        ApiResponse.success(ITINERARY_MESSAGES.CREATE_ITINERARY_DAY, response),
      );
  };

  createActivity = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const response = await this._createActivity.execute({
      groupId: req.params.id,
      dayId: req.params.dayId,
      userId: userId!,
      ...req.body,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(ITINERARY_MESSAGES.ACTIVITY_CREATED, response));
  };

  updateActivity = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const response = await this._updateActivity.execute({
      groupId: req.params.id,
      activityId: req.params.activityId,
      userId: userId!,
      ...req.body,
    });

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(ITINERARY_MESSAGES.UPDATE_ACTIVITY, response));
  };

  toggleActivityCompletion = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const response = await this._toggleActivityComplete.execute({
      activityId: req.params.activityId as string,
    });

    return res
      .status(HttpStatus.OK)
      .json(
        ApiResponse.success(
          ITINERARY_MESSAGES.TOGGLE_ACTIVITY_COMPLETION,
          response,
        ),
      );
  };

  deleteActivity = async (req: Request, res: Response): Promise<Response> => {
    const response = await this._deleteActivity.execute({
      activityId: req.params.activityId as string,
    });

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(ITINERARY_MESSAGES.DELETE_ACTIVITY, response));
  };

  updateItineraryDay = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const response = await this._updateDay.execute({
      dayId: req.params.dayId as string,
      date: req.body.date ? new Date(req.body.date) : undefined,
      location: req.body.location,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      summary: req.body.summary,
    });

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(ITINERARY_MESSAGES.UPDATE_DAY, response));
  };

  deleteItineraryDay = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const response = await this._deleteDay.execute({
      dayId: req.params.dayId as string,
    });

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(ITINERARY_MESSAGES.DELETE_DAY, response));
  };
  generateAiItinerary = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    console.log(req.body);
    const response = await this._generateAiItinerary.execute({
      groupId: req.params.id as string,
      ...req.body,
    });

    return res
      .status(HttpStatus.OK)
      .json(
        ApiResponse.success(ITINERARY_MESSAGES.ITINERARY_GENERATED, response),
      );
  };
  saveGenerated = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const response = await this._saveGenerated.execute({
      groupId: req.params.id as string,
      itinerary: req.body,
      userId: userId!,
    });

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(ITINERARY_MESSAGES.ITINERARY_SAVED, response));
  };
}
