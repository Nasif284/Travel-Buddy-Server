import { ItineraryGraphState } from '../itinerary.states';

export async function validateContextNode(state: ItineraryGraphState) {
  const errors: string[] = [];

  const { context } = state;

  if (!context.destination.name) {
    errors.push('Destination is required.');
  }

  if (!context.trip.startDate) {
    errors.push('Trip start date is required.');
  }

  if (!context.trip.endDate) {
    errors.push('Trip end date is required.');
  }

  if (errors.length) {
    throw new Error(errors.join('\n'));
  }

  return {};
}
