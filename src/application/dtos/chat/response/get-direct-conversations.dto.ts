export interface DirectConversationUserDTO {
  id: string;
  name: string;
  profileImage?: string;
}

export interface DirectConversationDTO {
  conversationId: string;

  user: DirectConversationUserDTO;

  lastMessage?: {
    content: string;
    createdAt: Date;
  };

  updatedAt: Date;
}
