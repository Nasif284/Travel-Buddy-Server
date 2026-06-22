import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../../infrastructure/di/tokens';
import { IUpdateProfile } from '../../../../application/interfaces/use-cases/profile/update-profile.interface';
import { IUpdateAvatar } from '../../../../application/interfaces/use-cases/profile/update-avatar.interface';
import { IUpdateCover } from '../../../../application/interfaces/use-cases/profile/update-cover.interface';
import { Request, Response } from 'express';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { ApiResponse } from '../../../responses/common-response';
import { PROFILE_MESSAGES } from '../../../../shared/constants/messages/success/user/profile.messages';
import { IUpdateSettings } from '../../../../application/interfaces/use-cases/profile/settings-update.interface';
import { IGetSettings } from '../../../../application/interfaces/use-cases/profile/get-settings.interface';

@injectable()
export class ProfileController {
  constructor(
    @inject(TOKENS.IUpdateProfile)
    private readonly _updateProfile: IUpdateProfile,
    @inject(TOKENS.IUpdateAvatar) private readonly _updateAvatar: IUpdateAvatar,
    @inject(TOKENS.IUpdateCover) private readonly _updateCover: IUpdateCover,
    @inject(TOKENS.IUpdateSettings)
    private readonly _updateSettings: IUpdateSettings,
    @inject(TOKENS.IGetSettings)
    private readonly _getSettings: IGetSettings,
  ) {}
  updateProfile = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    await this._updateProfile.execute({ userId: userId!, payload: req.body });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(PROFILE_MESSAGES.PROFILE_UPDATED));
  };
  updateAvatar = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const file = req.file;
    const buffer = file?.buffer;
    const mimeType = file?.mimetype;

    await this._updateAvatar.execute({
      userId: userId!,
      file: buffer!,
      mimeType: mimeType!,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(PROFILE_MESSAGES.AVATAR_UPDATED));
  };
  updateCover = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const file = req.file;
    const buffer = file?.buffer;
    const mimeType = file?.mimetype;

    await this._updateCover.execute({
      userId: userId!,
      file: buffer!,
      mimeType: mimeType!,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(PROFILE_MESSAGES.COVER_UPDATED));
  };

  updateSettings = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    await this._updateSettings.execute({ userId: userId!, payload: req.body });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(PROFILE_MESSAGES.SETTINGS_UPDATED));
  };
  getSettings = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const data = await this._getSettings.execute({ userId: userId! });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(PROFILE_MESSAGES.FETCHED_SETTINGS, data));
  };
}
