import {
  pipeline,
  type FeatureExtractionPipeline,
} from '@huggingface/transformers';

import { injectable } from 'tsyringe';
import { IEmbeddingService } from '../../application/interfaces/services/embedding.service.interface';

@injectable()
export class LocalEmbeddingService implements IEmbeddingService {
  private extractor?: FeatureExtractionPipeline;

  private async getExtractor() {
    if (!this.extractor) {
      this.extractor = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2',
      );
    }

    return this.extractor;
  }

  async embed(text: string): Promise<number[]> {
    const extractor = await this.getExtractor();

    const output = await extractor(text, {
      pooling: 'mean',
      normalize: true,
    });

    return Array.from(output.data);
  }
}
