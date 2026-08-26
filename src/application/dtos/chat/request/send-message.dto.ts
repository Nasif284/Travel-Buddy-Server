export interface SendChatMessageDTO {
  conversationId: string;

  type: 'TEXT' | 'IMAGE';

  content?: string;

  attachment?: {
    storageKey: string;
    fileName?: string;
    mimeType: string;
    fileSize: number;
  };
}
