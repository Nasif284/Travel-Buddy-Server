import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../../infrastructure/di/tokens';
import { IOnboardingSource } from '../../../../application/interfaces/use-cases/onboarding/onboarding-source.interface';
import { Request, Response } from 'express';
import { UserNotFoundError } from '../../../../domain/errors/auth.error';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { ApiResponse } from '../../../responses/common-response';
import { ONBOARDING_MESSAGES } from '../../../../shared/constants/messages/success/user/onboarding.messages';
import { ISetUserProfile } from '../../../../application/interfaces/use-cases/onboarding/profile.interface';
import { OnboardingProfileRequestDTO } from '../../../../application/dtos/onbaording/request/profile.dto';
import { ImageMissingError } from '../../../../domain/errors/user.error';
import { ISetTravelStyle } from '../../../../application/interfaces/use-cases/onboarding/travel-style.interface';
import { capitalizeFirstLetter } from '../../../../shared/helpers/capitalizseFirstLetter';

@injectable()
export class OnboardingController {
  constructor(
    @inject(TOKENS.IOnboardingSource)
    private readonly _onboardingSourceUseCase: IOnboardingSource,
    @inject(TOKENS.ISetProfile)
    private readonly _setUserProfile: ISetUserProfile,
    @inject(TOKENS.ISetTravelStyle)
    private readonly _setTravelStyle: ISetTravelStyle,
  ) {}
  addOnboardingSource = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const source = req.body.source;
    const userId = req.user?.userId;
    if (!userId) {
      throw new UserNotFoundError();
    }
    await this._onboardingSourceUseCase.execute({ source, userId });
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(ONBOARDING_MESSAGES.SOURCE_ADDED));
  };
  setUserProfile = async (req: Request, res: Response): Promise<Response> => {
    const {
      about,
      dateOfBirth,
      nationality,
      gender,
      travelSkills,
      languages,
      city,
      state,
    } = req.body;
    console.log(req.file, req.body);
    const userId = req.user?.userId;
    const files = req.files as {
      image?: Express.Multer.File[];
      coverImage?: Express.Multer.File[];
    };

    const profileImage = files.image?.[0];
    const coverImage = files.coverImage?.[0];
    if (!userId) {
      throw new UserNotFoundError();
    }
    if (!profileImage || !coverImage) {
      throw new ImageMissingError();
    }

    const payload: OnboardingProfileRequestDTO = {
      userId,
      about,
      dateOfBirth,
      nationality,
      gender,
      travelSkills: JSON.parse(travelSkills).map((s: string) =>
        capitalizeFirstLetter(s),
      ),
      languages: JSON.parse(languages).map((s: string) =>
        capitalizeFirstLetter(s),
      ),
      imageBuffer: profileImage.buffer,
      coverImageBuffer: coverImage.buffer,
      profMimeType: profileImage.mimetype,
      coverMimeType: coverImage.mimetype,
      city,
      state,
    };

    await this._setUserProfile.execute(payload);
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(ONBOARDING_MESSAGES.USER_PROFILE_UPDATED));
  };
  setTravelStyle = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    await this._setTravelStyle.execute({ userId, ...req.body });
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(ONBOARDING_MESSAGES.USER_PROFILE_UPDATED));
  };
}
