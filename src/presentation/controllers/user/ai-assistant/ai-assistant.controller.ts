import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../../infrastructure/di/tokens';
import { IChatAssistantUseCase } from '../../../../application/interfaces/use-cases/ai-assistant/chat.interface';
import { Request, Response } from 'express';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { ApiResponse } from '../../../responses/common-response';
import { IGetAssistantMessagesUseCase } from '../../../../application/interfaces/use-cases/ai-assistant/get-chats.interfce';

@injectable()
export class AiAssistantController {
  constructor(
    @inject(TOKENS.IChatAssistantUseCase)
    private readonly _chatAssistant: IChatAssistantUseCase,
    @inject(TOKENS.IGetAssistantMessagesUseCase)
    private readonly _getAssistantMessages: IGetAssistantMessagesUseCase,
  ) {}
  chat = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const result = await this._chatAssistant.execute({
      userId: userId!,
      message: req.body.message,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success('Response generated', result));
  };
  getChats = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const result = await this._getAssistantMessages.execute(userId!);
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success('Chats retrieved successfully', result));
  };
}
