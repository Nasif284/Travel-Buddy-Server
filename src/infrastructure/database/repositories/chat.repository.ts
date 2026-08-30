import { inject, injectable } from 'tsyringe';
import { PrismaClient, ChatType, ChatMessageType } from '@prisma/client';
import {
  ChatMessageDTO,
  IChatRepository,
  SaveChatMessageDTO,
} from '../../../application/interfaces/repositories/chat.repository';
import { TOKENS } from '../../di/tokens';
import { DirectConversationDTO } from '../../../application/dtos/chat/response/get-direct-conversations.dto';

@injectable()
export class ChatRepository implements IChatRepository {
  constructor(
    @inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  async findDirectConversation(
    userId: string,
    otherUserId: string,
  ): Promise<string | null> {
    const [userAId, userBId] = [userId, otherUserId].sort();

    const conversation = await this.prisma.chatConversation.findUnique({
      where: {
        directKey: `${userAId}:${userBId}`,
      },
      select: {
        id: true,
      },
    });

    return conversation?.id ?? null;
  }

  async createDirectConversation(
    userId: string,
    otherUserId: string,
  ): Promise<string> {
    const [userAId, userBId] = [userId, otherUserId].sort();

    const directKey = `${userAId}:${userBId}`;

    const conversation = await this.prisma.chatConversation.create({
      data: {
        type: ChatType.DIRECT,
        userAId,
        userBId,
        directKey,
      },
      select: {
        id: true,
      },
    });

    return conversation.id;
  }

  async getOrCreateGroupConversation(groupId: string): Promise<string> {
    const existing = await this.prisma.chatConversation.findUnique({
      where: {
        groupId,
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      return existing.id;
    }

    const conversation = await this.prisma.chatConversation.create({
      data: {
        type: ChatType.GROUP,
        groupId,
      },
      select: {
        id: true,
      },
    });

    return conversation.id;
  }

  async getConversation(conversationId: string) {
    return this.prisma.chatConversation.findUnique({
      where: {
        id: conversationId,
      },
      select: {
        id: true,
        type: true,
        userAId: true,
        userBId: true,
        groupId: true,
      },
    });
  }

  async isDirectConversationMember(
    conversationId: string,
    userId: string,
  ): Promise<boolean> {
    const conversation = await this.prisma.chatConversation.findFirst({
      where: {
        id: conversationId,
        type: ChatType.DIRECT,
        OR: [
          {
            userAId: userId,
          },
          {
            userBId: userId,
          },
        ],
      },
      select: {
        id: true,
      },
    });

    return !!conversation;
  }

  async isGroupConversationMember(
    conversationId: string,
    userId: string,
  ): Promise<boolean> {
    const conversation = await this.prisma.chatConversation.findFirst({
      where: {
        id: conversationId,
        type: ChatType.GROUP,
        group: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    return !!conversation;
  }

  async saveMessage(
    conversationId: string,
    senderId: string,
    data: SaveChatMessageDTO,
  ): Promise<ChatMessageDTO> {
    const message = await this.prisma.chatMessage.create({
      data: {
        conversationId,
        senderId,
        type: data.type as ChatMessageType,
        content: data.content ?? '',

        ...(data.type === 'IMAGE' && data.attachment
          ? {
              attachment: {
                create: {
                  storageKey: data.attachment.storageKey,
                  fileName: data.attachment.fileName,
                  mimeType: data.attachment.mimeType,
                  fileSize: data.attachment.fileSize,
                },
              },
            }
          : {}),
      },

      select: {
        id: true,
        conversationId: true,
        senderId: true,
        type: true,
        content: true,
        createdAt: true,
        updatedAt: true,

        attachment: {
          select: {
            storageKey: true,
            fileName: true,
            mimeType: true,
            fileSize: true,
          },
        },

        sender: {
          select: {
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });
    await this.prisma.chatConversation.update({
      where: {
        id: conversationId,
      },
      data: {
        updatedAt: new Date(),
      },
    });
    return message;
  }

  async getMessages(
    conversationId: string,
    limit: number,
    cursor?: string,
  ): Promise<ChatMessageDTO[]> {
    const messages = await this.prisma.chatMessage.findMany({
      where: {
        conversationId,
      },

      orderBy: {
        createdAt: 'desc',
      },

      take: limit + 1,

      ...(cursor
        ? {
            cursor: {
              id: cursor,
            },
            skip: 1,
          }
        : {}),

      select: {
        id: true,
        conversationId: true,
        senderId: true,
        type: true,
        content: true,
        createdAt: true,
        updatedAt: true,

        attachment: {
          select: {
            storageKey: true,
            fileName: true,
            mimeType: true,
            fileSize: true,
          },
        },

        sender: {
          select: {
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return messages.reverse();
  }
  async getDirectConversations(
    userId: string,
  ): Promise<DirectConversationDTO[]> {
    const conversations = await this.prisma.chatConversation.findMany({
      where: {
        type: 'DIRECT',

        OR: [
          {
            userAId: userId,
          },
          {
            userBId: userId,
          },
        ],
      },

      include: {
        userA: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },

        userB: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },

        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,

          select: {
            content: true,
            createdAt: true,
          },
        },
      },

      orderBy: {
        updatedAt: 'desc',
      },
    });

    return conversations.map((conversation) => {
      const otherUser =
        conversation.userAId === userId
          ? conversation.userB
          : conversation.userA;

      return {
        conversationId: conversation.id,

        user: {
          id: otherUser!.id,
          name: otherUser!.fullName,
          profileImage: otherUser!.avatarUrl ?? undefined,
        },

        lastMessage: conversation.messages[0]
          ? {
              content: conversation.messages[0].content,
              createdAt: conversation.messages[0].createdAt,
            }
          : undefined,

        updatedAt: conversation.updatedAt,
      };
    });
  }
}
