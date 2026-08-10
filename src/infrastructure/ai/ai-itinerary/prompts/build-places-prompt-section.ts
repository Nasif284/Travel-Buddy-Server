import { AIPlacesContext } from '../nodes/place-context.node';

export function buildPlacesSection(places: AIPlacesContext): string {
  return `
Available Nearby Places
Top Attractions
${formatPlaces(places.attractions)}
Restaurants
${formatPlaces(places.restaurants)}
Cafes
${formatPlaces(places.cafes)}
Parks
${formatPlaces(places.parks)}
Viewpoints
${formatPlaces(places.viewpoints)}
Shopping
${formatPlaces(places.shopping)}
Hotels
${formatPlaces(places.hotels)}
Important
Use these places whenever appropriate.
Prefer these places over your own knowledge.
Do not invent attractions.
If no suitable place exists,
leave the location as null.
`;
}

import { NearbyPlaceDTO } from '../../../../application/interfaces/services/places.service.interface';

function formatPlaces(places: NearbyPlaceDTO[]): string {
  if (!places.length) {
    return 'None';
  }
  return places
    .map(
      (place) => `
- ${place.name}
  Category: ${place.category}
  Rating: ${place.rating ?? 'N/A'}
  Address: ${place.address ?? 'Unknown'}
`,
    )
    .join('\n');
}
