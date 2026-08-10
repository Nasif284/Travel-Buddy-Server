export interface AssistantChat {
  id: string;
  role: string;
  content: string;
  createdAt: Date;
}
export interface GetChatsResponseDTO {
  chats: AssistantChat[];
}
