import { Server, Socket } from 'socket.io';
import { container } from 'tsyringe';
import { IAuthorizeSignalingUseCase } from '../../application/interfaces/use-cases/calls/authorize-signaling.interface';
import { TOKENS } from '../di/tokens';

export function registerCallSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;

    console.log(`[Call] Connected: ${socket.id}, user=${userId}`);

    socket.join(`user:${userId}`);

    socket.on('call:join-room', async (callId: string) => {
      try {
        if (!callId) {
          throw new Error('Call ID is required.');
        }

        socket.join(`call:${callId}`);

        socket.emit('call:room-joined', {
          callId,
        });

        console.log(`[Call] User ${userId} joined signaling room ${callId}`);
      } catch (error) {
        socket.emit('call:error', {
          message:
            error instanceof Error ? error.message : 'Unable to join call.',
        });
      }
    });

    socket.on('call:leave-room', (callId: string) => {
      if (!callId) return;

      socket.leave(`call:${callId}`);

      socket.emit('call:room-left', {
        callId,
      });
    });

    socket.on('call:offer', async (data) => {
      try {
        const senderId = socket.data.userId;

        const { callId, targetUserId, offer } = data;
        const authorizeSignaling =
          container.resolve<IAuthorizeSignalingUseCase>(
            TOKENS.IAuthorizeSignalingUseCase,
          );
        const authorized = await authorizeSignaling.execute({
          callId,
          senderId,
          targetUserId,
        });

        if (!authorized) {
          socket.emit('call:error', {
            message: 'You are not authorized to send signaling for this call.',
          });

          return;
        }

        io.to(`user:${targetUserId}`).emit('call:offer', {
          callId,
          senderUserId: senderId,
          offer,
        });
      } catch (error) {
        console.error('[Call] Offer error:', error);

        socket.emit('call:error', {
          message:
            error instanceof Error
              ? error.message
              : 'Unable to relay call offer.',
        });
      }
    });

    socket.on('call:answer', async (data) => {
      try {
        const senderId = socket.data.userId;

        const { callId, targetUserId, answer } = data;
        const authorizeSignaling =
          container.resolve<IAuthorizeSignalingUseCase>(
            TOKENS.IAuthorizeSignalingUseCase,
          );
        const authorized = await authorizeSignaling.execute({
          callId,
          senderId,
          targetUserId,
        });

        if (!authorized) {
          socket.emit('call:error', {
            message: 'You are not authorized to send signaling for this call.',
          });

          return;
        }

        io.to(`user:${targetUserId}`).emit('call:answer', {
          callId,
          senderUserId: senderId,
          answer,
        });
      } catch (error) {
        console.error('[Call] Answer error:', error);

        socket.emit('call:error', {
          message:
            error instanceof Error
              ? error.message
              : 'Unable to relay call answer.',
        });
      }
    });

    socket.on('call:ice-candidate', async (data) => {
      try {
        const senderId = socket.data.userId;

        const { callId, targetUserId, candidate } = data;

        const authorizeSignaling =
          container.resolve<IAuthorizeSignalingUseCase>(
            TOKENS.IAuthorizeSignalingUseCase,
          );
        const authorized = await authorizeSignaling.execute({
          callId,
          senderId,
          targetUserId,
        });

        if (!authorized) {
          socket.emit('call:error', {
            message: 'You are not authorized to send ICE candidates.',
          });

          return;
        }

        io.to(`user:${targetUserId}`).emit('call:ice-candidate', {
          callId,
          senderUserId: senderId,
          candidate,
        });
      } catch (error) {
        console.error('[Call] ICE candidate error:', error);

        socket.emit('call:error', {
          message:
            error instanceof Error
              ? error.message
              : 'Unable to relay ICE candidate.',
        });
      }
    });
    socket.on('disconnect', () => {
      console.log(`[Call] Disconnected: ${socket.id}, user=${userId}`);
    });
  });
}
