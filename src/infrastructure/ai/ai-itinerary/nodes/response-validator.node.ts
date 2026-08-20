import { GeneratedItinerarySchema } from '../../../../presentation/validators/trip/itinerary.validator';
import { ItineraryGraphState } from '../itinerary.states';

export async function validateResponseNode(state: ItineraryGraphState) {
  try {
    const first = state.rawAiResponse!.indexOf('{');
    const last = state.rawAiResponse!.lastIndexOf('}');

    if (first === -1 || last === -1) {
      return {
        validationErrors: ['No JSON object found.'],
      };
    }

    const cleaned = state.rawAiResponse!.substring(first, last + 1);
    console.log('====== CLEANED ======');
    console.log(cleaned);
    console.log('=====================');
    const parsed = JSON.parse(cleaned);
    GeneratedItinerarySchema.parse(parsed);
    return {
      generatedItinerary: parsed,
      validationErrors: [],
    };
  } catch (error: any) {
    return {
      validationErrors: [error.message],
    };
  }
}
