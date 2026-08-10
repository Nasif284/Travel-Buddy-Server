import { ItineraryGraphState } from '../itinerary.states';

export async function failureNode(state: ItineraryGraphState) {
  throw new Error(
    `Unable to generate a valid itinerary after ${state.repairAttempts} attempts.\n\nErrors:\n${state.validationErrors.join('\n')}`,
  );
}
