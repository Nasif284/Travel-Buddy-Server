import { ItineraryGraphState } from '../itinerary.states';

export function routeValidation(state: ItineraryGraphState) {
  if (state.validationErrors.length === 0) {
    return 'success';
  }
  if (state.repairAttempts >= 2) {
    return 'failed';
  }
  return 'repair';
}
