import { IImageService } from '../../application/interfaces/services/image.service.interace';
import { unsplashApi } from '../../config/unplash.config';
export class ImageService implements IImageService {
  async getDestinationCover(destination: string): Promise<string | null> {
    const res = await unsplashApi.GET('/search/photos', {
      params: {
        query: { query: destination, orientation: 'landscape', per_page: 1 },
      },
    });
    const photo = res.data?.results?.[0];
    if (!photo) {
      return null;
    }
    return photo.urls.regular;
  }
}
