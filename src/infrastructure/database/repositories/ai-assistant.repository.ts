import { inject, injectable } from 'tsyringe';
import { IAssistantRepository } from '../../../application/interfaces/repositories/ai-assistant.repository';
import { TOKENS } from '../../di/tokens';

import { AssistantMessage } from '../../../application/dtos/ai-assistant/request/chat.dto';
import { PrismaClient } from '@prisma/client';
import { AssistantChat } from '../../../application/dtos/ai-assistant/response/get-chata.dto';

@injectable()
export class AssistantRepository implements IAssistantRepository {
  constructor(
    @inject(TOKENS.PrismaClient)
    private readonly prisma: PrismaClient,
  ) {}

  async getOrCreateConversation(userId: string): Promise<string> {
    const conversation = await this.prisma.assistantConversation.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
      select: {
        id: true,
      },
    });

    return conversation.id;
  }

  async getMessages(userId: string): Promise<AssistantChat[]> {
    const conversation = await this.prisma.assistantConversation.findUnique({
      where: {
        userId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!conversation) {
      return [];
    }

    return conversation.messages.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      createdAt: message.createdAt,
    }));
  }
  async getRecentMessages(
    conversationId: string,
    limit: number,
  ): Promise<AssistantMessage[]> {
    const messages = await this.prisma.assistantMessage.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return messages.reverse().map((m) => ({
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.content,
    }));
  }
  async saveMessages(
    conversationId: string,
    messages: AssistantMessage[],
  ): Promise<void> {
    await this.prisma.assistantMessage.createMany({
      data: messages.map((m) => ({
        conversationId,
        role: m.role,
        content: m.content,
      })),
    });
  }
}
