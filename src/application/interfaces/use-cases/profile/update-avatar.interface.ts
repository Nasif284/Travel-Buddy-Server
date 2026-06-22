export interface IUpdateAvatar {
  execute(dto: {
    userId: string;
    file: Buffer;
    mimeType: string;
  }): Promise<void>;
}
