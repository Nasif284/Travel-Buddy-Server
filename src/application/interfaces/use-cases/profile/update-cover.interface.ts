export interface IUpdateCover {
  execute(dto: {
    userId: string;
    file: Buffer;
    mimeType: string;
  }): Promise<void>;
}
