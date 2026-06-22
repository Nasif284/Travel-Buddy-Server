import { container } from 'tsyringe';
import { TOKENS } from '../tokens';
import { CreateTrip } from '../../../application/use-cases/trip/create-trip.usecase';
import { CalculateMatch } from '../../../application/use-cases/trip/calculate-match.usecase';
import { GetTripMatches } from '../../../application/use-cases/trip/get-matches.usecase';
import { GetActiveTrip } from '../../../application/use-cases/trip/get-active-trip.usecase';
import { GetUserUpcomingTrips } from '../../../application/use-cases/trip/get-user-trips.usecase';
import { GetMatchProfile } from '../../../application/use-cases/trip/get-match-profile.usecase';

export function registerTripDependency() {
  container.registerSingleton<CreateTrip>(TOKENS.ICreateTrip, CreateTrip);
  container.registerSingleton<CalculateMatch>(
    TOKENS.ICalculateMatch,
    CalculateMatch,
  );
  container.registerSingleton<GetTripMatches>(
    TOKENS.IGetTripMatches,
    GetTripMatches,
  );
  container.registerSingleton<GetActiveTrip>(
    TOKENS.IGetActiveTrip,
    GetActiveTrip,
  );
  container.registerSingleton<GetUserUpcomingTrips>(
    TOKENS.IGetUserUpcomingTrips,
    GetUserUpcomingTrips,
  );
  container.registerSingleton<GetMatchProfile>(
    TOKENS.IGetMatchProfile,
    GetMatchProfile,
  );
}
