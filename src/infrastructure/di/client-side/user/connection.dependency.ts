import { container } from 'tsyringe';
import { TOKENS } from '../../tokens';

import { SendConnectionRequest } from '../../../../application/use-cases/connections/send-connection-request.usecase';
import { GetIncomingRequests } from '../../../../application/use-cases/connections/get-incoming-requestes.usecase';
import { AcceptRequest } from '../../../../application/use-cases/connections/accept-request.usecase';
import { RejectRequest } from '../../../../application/use-cases/connections/reject-request.usecase';
import { GetConnections } from '../../../../application/use-cases/connections/get-connections.usecase';
import { DeactivateConnection } from '../../../../application/use-cases/connections/deactivate-connections.usecase';
import { GetAllRequests } from '../../../../application/use-cases/connections/get-all-requestes.usecase';
import { GetSentRequests } from '../../../../application/use-cases/connections/get-sent-requests.usecase';
import { WithdrawRequest } from '../../../../application/use-cases/connections/withdraw-request.usecase';

export function registerConnectionDependency() {
  container.registerSingleton<SendConnectionRequest>(
    TOKENS.ISendConnectionRequest,
    SendConnectionRequest,
  );
  container.registerSingleton<GetIncomingRequests>(
    TOKENS.IGetIncomingRequests,
    GetIncomingRequests,
  );
  container.registerSingleton<AcceptRequest>(
    TOKENS.IAcceptRequest,
    AcceptRequest,
  );
  container.registerSingleton<RejectRequest>(
    TOKENS.IRejectRequest,
    RejectRequest,
  );
  container.registerSingleton<GetConnections>(
    TOKENS.IGetConnections,
    GetConnections,
  );
  container.registerSingleton<DeactivateConnection>(
    TOKENS.IDeactivateConnection,
    DeactivateConnection,
  );
  container.registerSingleton<GetAllRequests>(
    TOKENS.IGetAllRequests,
    GetAllRequests,
  );
  container.registerSingleton<GetSentRequests>(
    TOKENS.IGetSentRequests,
    GetSentRequests,
  );
  container.registerSingleton<WithdrawRequest>(
    TOKENS.IWithdrawRequest,
    WithdrawRequest,
  );
}
