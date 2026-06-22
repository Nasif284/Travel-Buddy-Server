import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../../infrastructure/di/tokens';
import { ISendConnectionRequest } from '../../../../application/interfaces/use-cases/connections/send-connection-request.interface';
import { Request, Response } from 'express';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { ApiResponse } from '../../../responses/common-response';
import { CONNECTIONS_MESSAGES } from '../../../../shared/constants/messages/success/user/connection.message';
import { IGetIncomingRequests } from '../../../../application/interfaces/use-cases/connections/get-incomimg-requests.interface';
import { IAcceptRequest } from '../../../../application/interfaces/use-cases/connections/accept-request.interface';
import { IRejectRequest } from '../../../../application/interfaces/use-cases/connections/reject-request.interface';
import { IGetConnections } from '../../../../application/interfaces/use-cases/connections/get-connections.interface';
import { IDeactivateConnection } from '../../../../application/interfaces/use-cases/connections/deactivate-connections.interface';
import { IGetAllRequests } from '../../../../application/interfaces/use-cases/connections/get-all-requests.interface';

@injectable()
export class ConnectionsController {
  constructor(
    @inject(TOKENS.ISendConnectionRequest)
    private readonly _sendConnectionRequest: ISendConnectionRequest,
    @inject(TOKENS.IGetIncomingRequests)
    private readonly _getIncomingRequests: IGetIncomingRequests,
    @inject(TOKENS.IAcceptRequest)
    private readonly _acceptRequest: IAcceptRequest,
    @inject(TOKENS.IRejectRequest)
    private readonly _rejectRequest: IRejectRequest,
    @inject(TOKENS.IGetConnections)
    private readonly _getConnection: IGetConnections,
    @inject(TOKENS.IDeactivateConnection)
    private readonly _deactivateConnection: IDeactivateConnection,
    @inject(TOKENS.IGetAllRequests)
    private readonly _getAllRequests: IGetAllRequests,
  ) {}
  sendConnectionRequest = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const { matchId, receiverId, message } = req.body;
    const userId = req.user?.userId;
    await this._sendConnectionRequest.execute({
      matchId,
      message,
      receiverId,
      senderId: userId!,
    });
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(CONNECTIONS_MESSAGES.REQUEST_SEND));
  };
  getIncomingRequests = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const userId = req.user?.userId;
    const data = await this._getIncomingRequests.execute({ userId: userId! });
    return res
      .status(HttpStatus.OK)
      .json(
        ApiResponse.success(
          CONNECTIONS_MESSAGES.FETCHED_INCOMING_REQUESTS,
          data,
        ),
      );
  };
  acceptRequest = async (req: Request, res: Response): Promise<Response> => {
    const requestId = req.params.id;
    await this._acceptRequest.execute({ requestId: requestId as string });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(CONNECTIONS_MESSAGES.ACCEPTED_REQUEST));
  };
  rejectRequest = async (req: Request, res: Response): Promise<Response> => {
    const requestId = req.params.id;
    await this._rejectRequest.execute({ requestId: requestId as string });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(CONNECTIONS_MESSAGES.REJECTED_REQUEST));
  };
  getConnections = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const data = await this._getConnection.execute({ userId: userId! });
    return res
      .status(HttpStatus.OK)
      .json(
        ApiResponse.success(CONNECTIONS_MESSAGES.FETCHED_CONNECTIONS, data),
      );
  };
  disconnect = async (req: Request, res: Response): Promise<Response> => {
    const connectionId = req.params.id;
    await this._deactivateConnection.execute({
      connectionId: connectionId as string,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(CONNECTIONS_MESSAGES.DISCONNECTED));
  };
  getAllRequests = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const data = await this._getAllRequests.execute({ userId: userId! });
    return res
      .status(HttpStatus.OK)
      .json(
        ApiResponse.success(
          CONNECTIONS_MESSAGES.FETCHED_INCOMING_REQUESTS,
          data,
        ),
      );
  };
}
