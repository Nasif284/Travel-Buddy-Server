import { Annotation } from '@langchain/langgraph';

import { TripPlanningContext } from '../../../application/dtos/itenary/request/ai-itinery-trip-context.dto';
import { GeneratedItinerary } from '../../../application/dtos/itenary/response/ai-itinerary-result.dto';
import { AIPlacesContext } from './nodes/place-context.node';

export const ItineraryState = Annotation.Root({
  context: Annotation<TripPlanningContext>(),
  placesContext: Annotation<AIPlacesContext>({
    value: (_, right) => right,
    default: () => ({
      attractions: [],
      viewpoints: [],
      restaurants: [],
      cafes: [],
      parks: [],
      hotels: [],
      shopping: [],
    }),
  }),
  rawAiResponse: Annotation<string | null>({
    value: (_, right) => right,
    default: () => null,
  }),

  generatedItinerary: Annotation<GeneratedItinerary | null>({
    value: (_, right) => right,
    default: () => null,
  }),

  validationErrors: Annotation<string[]>({
    value: (_, right) => right,
    default: () => [],
  }),

  repairAttempts: Annotation<number>({
    value: (_, right) => right,
    default: () => 0,
  }),
});

export type ItineraryGraphState = typeof ItineraryState.State;
