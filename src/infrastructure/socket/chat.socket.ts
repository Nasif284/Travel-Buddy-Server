import { Server, Socket } from 'socket.io';
import { container } from 'tsyringe';

import { TOKENS } from '../di/tokens';
import { ISendChatMessageUseCase } from '../../application/interfaces/use-cases/chats/send-message.interface';
import { IJoinChatConversationValidationUseCase } from '../../application/interfaces/use-cases/chats/join-conversation-validation.interface';
import { chatMessagesTotal } from '../logging/metrics';

export function registerChatSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);
    socket.on('chat:join', async (conversationId: string) => {
      try {
        const userId = socket.data.userId;

        const useCase =
          container.resolve<IJoinChatConversationValidationUseCase>(
            TOKENS.IJoinChatConversationValidationUseCase,
          );

        await useCase.execute(userId, conversationId);

        socket.join(`conversation:${conversationId}`);

        socket.emit('chat:joined', {
          conversationId,
        });
      } catch (error) {
        socket.emit('chat:error', {
          message:
            error instanceof Error
              ? error.message
              : 'Unable to join conversation.',
        });
      }
    });

    socket.on('chat:leave', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on('chat:send', async (data) => {
      try {
        const userId = socket.data.userId;

        const useCase = container.resolve<ISendChatMessageUseCase>(
          TOKENS.ISendChatMessageUseCase,
        );

        const message = await useCase.execute(userId, data);
        chatMessagesTotal.inc();
        io.to(`conversation:${data.conversationId}`).emit(
          'chat:message',
          message,
        );
      } catch (error) {
        socket.emit('chat:error', {
          message:
            error instanceof Error ? error.message : 'Failed to send message.',
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Disconnected: ${socket.id}`);
    });
  });
}
