import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../../infrastructure/di/tokens';
import { IGetDirectChatUseCase } from '../../../../application/interfaces/use-cases/chats/get-direct-chat.interface';
import { IGetGroupChatUseCase } from '../../../../application/interfaces/use-cases/chats/get-group-chat.interface';
import { ISendChatMessageUseCase } from '../../../../application/interfaces/use-cases/chats/send-message.interface';
import { IGetChatMessagesUseCase } from '../../../../application/interfaces/use-cases/chats/get-messages.interface';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { ApiResponse } from '../../../responses/common-response';
import { IGetDirectConversationsUseCase } from '../../../../application/interfaces/use-cases/chats/get-direct-conversations.interface';

@injectable()
export class ChatController {
  constructor(
    @inject(TOKENS.IGetDirectChatUseCase)
    private readonly _getDirectChat: IGetDirectChatUseCase,
    @inject(TOKENS.IGetGroupChatUseCase)
    private readonly _getGroupChat: IGetGroupChatUseCase,
    @inject(TOKENS.ISendChatMessageUseCase)
    private readonly _sendMessage: ISendChatMessageUseCase,
    @inject(TOKENS.IGetChatMessagesUseCase)
    private readonly _getMessages: IGetChatMessagesUseCase,
    @inject(TOKENS.IGetDirectConversationsUseCase)
    private readonly _getConversations: IGetDirectConversationsUseCase,
  ) {}

  getDirectChat = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const { userId: otherUserId } = req.params;
    const conversationId = await this._getDirectChat.execute(
      userId!,
      otherUserId as string,
    );
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success('Fetched Conversation', { conversationId }));
  };

  getGroupChat = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const { groupId } = req.params;
    const conversationId = await this._getGroupChat.execute(
      userId!,
      groupId as string,
    );
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success('Fetched Conversation', { conversationId }));
  };

  sendMessage = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const { conversationId } = req.params;
    const { content } = req.body;
    const message = await this._sendMessage.execute(
      userId!,
      conversationId as string,
      content,
    );
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success('Message Send', { message }));
  };

  getMessages = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const { conversationId } = req.params;
    const limit = req.query.limit ? Number(req.query.limit) : 30;

    const cursor =
      typeof req.query.cursor === 'string' ? req.query.cursor : undefined;

    const messages = await this._getMessages.execute(
      userId!,
      conversationId as string,
      limit,
      cursor,
    );

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success('Fetched messages', { messages }));
  };
  getDirectConversations = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const userId = req.user?.userId;
    const conversations = await this._getConversations.execute(userId!);

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success('Fetched Conversations', { conversations }));
  };
}
