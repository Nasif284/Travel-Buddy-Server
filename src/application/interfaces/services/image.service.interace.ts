export interface IImageService {
  getDestinationCover(destination: string): Promise<string | null>;
}
