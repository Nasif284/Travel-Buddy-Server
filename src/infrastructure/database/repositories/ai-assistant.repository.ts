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
  ): Promise<AssistantChat[]> {
    const createdMessages = [];

    for (const message of messages) {
      const created = await this.prisma.assistantMessage.create({
        data: {
          conversationId,
          role: message.role,
          content: message.content,
        },
      });

      createdMessages.push({
        id: created.id,
        role: created.role,
        content: created.content,
        createdAt: created.createdAt,
      });
    }

    return createdMessages;
  }

  async saveMessageEmbedding(
    messageId: string,
    conversationId: string,
    content: string,
    embedding: number[],
  ): Promise<void> {
    const vector = `[${embedding.join(',')}]`;

    await this.prisma.$executeRaw`
    INSERT INTO assistant_message_embeddings
      (
        id,
        message_id,
        conversation_id,
        content,
        embedding
      )
    VALUES
      (
        gen_random_uuid(),
        ${messageId}::uuid,
        ${conversationId}::uuid,
        ${content},
        ${vector}::vector
      )
  `;
  }

  async searchSimilarMessages(
    conversationId: string,
    embedding: number[],
    limit: number,
  ): Promise<AssistantMessage[]> {
    const vector = `[${embedding.join(',')}]`;

    const messages = await this.prisma.$queryRaw<
      {
        role: string;
        content: string;
      }[]
    >`
    SELECT
      m.role,
      e.content
    FROM assistant_message_embeddings e
    INNER JOIN assistant_messages m
      ON m.id = e.message_id
    WHERE e.conversation_id = ${conversationId}::uuid
    ORDER BY e.embedding <=> ${vector}::vector
    LIMIT ${limit}
  `;

    return messages.map((message) => ({
      role: message.role as 'user' | 'assistant' | 'system',
      content: message.content,
    }));
  }
}
