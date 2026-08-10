import { TripPlanningContext } from '../application/dtos/itenary/request/ai-itinery-trip-context.dto';
import { AssistantContext } from '../application/interfaces/use-cases/ai-assistant/chat.interface';
import { AiItineraryService } from '../infrastructure/services/ai-itinerary.service';

export const context: TripPlanningContext = {
  destination: {
    placeId: 'ChIJj61dQgK6BzsR8xv0YQxM2kA',
    name: 'Munnar',
    city: 'Munnar',
    state: 'Kerala',
    country: 'India',
    latitude: 10.0889,
    longitude: 77.0595,
  },

  trip: {
    startDate: '2026-09-10',
    endDate: '2026-09-12',
    travellers: 2,
  },

  preferences: {
    tripPace: 'Relaxed',
    budgetStyle: 'mid-range',
    travelStyle: 'backpacking',
    interests: ['nature', 'food', 'photography'],
  },

  notes: 'Avoid crowded tourist places. Prefer local experiences.',
};

export const dummyContext: AssistantContext = {
  conversationId: '8c8f4d8b-4c7a-4d0d-a5ef-3d8f4f53b8c2',

  user: {
    id: 'c8d0a9d7-3f1b-4d89-a6df-23b7d6dca421',
    firstName: 'Nasif',
  },

  activeTrip: {
    destination: 'Munnar',
    startDate: '2026-09-10',
    endDate: '2026-09-12',
    travelStyle: 'Backpacking',
    budgetStyle: 'Mid-range',
  },

  recentMessages: [
    {
      role: 'user',
      content: "I'm travelling to Munnar next month with two friends.",
    },
    {
      role: 'assistant',
      content:
        'Great! Munnar is perfect for nature lovers. I can help you plan the trip.',
    },
    {
      role: 'user',
      content: 'We love photography and local food.',
    },
    {
      role: 'assistant',
      content:
        "I'll prioritize scenic viewpoints, tea plantations, and authentic local restaurants.",
    },
    {
      role: 'user',
      content: "We don't like crowded tourist spots.",
    },
    {
      role: 'assistant',
      content:
        "Understood. I'll recommend quieter places and less crowded timings.",
    },
  ],
};
