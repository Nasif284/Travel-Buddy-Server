import { DirectConversationDTO } from '../../dtos/chat/response/get-direct-conversations.dto';

export interface ChatMessageDTO {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: {
    fullName: string;
    avatarUrl: string | null;
  };
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatRepository {
  findDirectConversation(
    userId: string,
    otherUserId: string,
  ): Promise<string | null>;

  createDirectConversation(
    userId: string,
    otherUserId: string,
  ): Promise<string>;

  getOrCreateGroupConversation(groupId: string): Promise<string>;

  getConversation(conversationId: string): Promise<{
    id: string;
    type: string;
    userAId: string | null;
    userBId: string | null;
    groupId: string | null;
  } | null>;

  isDirectConversationMember(
    conversationId: string,
    userId: string,
  ): Promise<boolean>;

  isGroupConversationMember(
    conversationId: string,
    userId: string,
  ): Promise<boolean>;

  saveMessage(
    conversationId: string,
    senderId: string,
    content: string,
  ): Promise<ChatMessageDTO>;

  getMessages(
    conversationId: string,
    limit: number,
    cursor?: string,
  ): Promise<ChatMessageDTO[]>;
  getDirectConversations(userId: string): Promise<DirectConversationDTO[]>;
}
