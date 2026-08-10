import { inject, injectable } from 'tsyringe';

import { TOKENS } from '../../infrastructure/di/tokens';

import { IAIModelService } from '../../application/interfaces/services/ai-model.service.interface';
import { IAiItineraryService } from '../../application/interfaces/services/ai-itinerary.service.interface';

import { TripPlanningContext } from '../../application/dtos/itenary/request/ai-itinery-trip-context.dto';
import { GeneratedItinerary } from '../../application/dtos/itenary/response/ai-itinerary-result.dto';

import { createItineraryGraph } from '../ai/ai-itinerary/itinerary.graph';
import { IPlacesService } from '../../application/interfaces/services/places.service.interface';

@injectable()
export class AiItineraryService implements IAiItineraryService {
  constructor(
    @inject(TOKENS.IAIModelService)
    private readonly _aiModel: IAIModelService,
    @inject(TOKENS.IPlacesService)
    private readonly _placesService: IPlacesService,
  ) {}

  async generate(context: TripPlanningContext): Promise<GeneratedItinerary> {
    const graph = createItineraryGraph(this._aiModel, this._placesService);
    const result = await graph.invoke({
      context,
    });
    return result.generatedItinerary!;
  }
}
