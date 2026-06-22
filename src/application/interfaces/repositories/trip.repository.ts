import { CreateTripDataDTO } from '../../dtos/trip/request/create-trip.dto';
import {
  CreateDestinationRequestDTO,
  Destination,
} from '../../dtos/trip/request/destination.dto';
import {
  SaveTripMatchDTO,
  TripForMatchingDTO,
} from '../../dtos/trip/responce/calculate-mathc.dto';
import { GetActiveTripResponseDTO } from '../../dtos/trip/responce/get-active-trip.dto';
import { GetMatchProfileResponseDTO } from '../../dtos/trip/responce/get-match-profile.dto';
import { TripMatchResponseDTO } from '../../dtos/trip/responce/get-matches.dto';
import { GetUserTripsResponseDTO } from '../../dtos/trip/responce/get-user-trips.dto';

export interface ITripRepository {
  findDestinationByPlaceId(placeId: string): Promise<Destination | null>;
  createDestination(payload: CreateDestinationRequestDTO): Promise<Destination>;
  createTrip(payload: CreateTripDataDTO): Promise<{ tripId: string }>;
  getTripForMatching(tripId: string): Promise<TripForMatchingDTO>;
  getCandidateTrips(tripId: string): Promise<TripForMatchingDTO[]>;
  saveTripMatch(payload: SaveTripMatchDTO): Promise<void>;
  deleteTripMatch(payload: { tripId: string }): Promise<void>;
  getTripMatches(
    tripId: string,
    page: number,
    limit: number,
  ): Promise<TripMatchResponseDTO>;
  getActiveTrip(payload: {
    userId: string;
  }): Promise<GetActiveTripResponseDTO | null>;
  getUserUpcomingTrips(payload: {
    userId: string;
  }): Promise<GetUserTripsResponseDTO>;
  getMatchProfile(payload: {
    matchId: string;
    userId: string;
  }): Promise<GetMatchProfileResponseDTO>;
}
