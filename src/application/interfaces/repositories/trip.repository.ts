import { CreateTripDataDTO } from '../../dtos/trip/request/create-trip.dto';
import {
  CreateDestinationRequestDTO,
  Destination,
} from '../../dtos/trip/request/destination.dto';
import { EditTripData } from '../../dtos/trip/request/edit-trip.dto';
import {
  SaveTripMatchDTO,
  TripForMatchingDTO,
} from '../../dtos/trip/responce/calculate-mathc.dto';
import { GetActiveTripResponseDTO } from '../../dtos/trip/responce/get-active-trip.dto';
import { GroupData } from '../../dtos/trip/responce/get-groups.dto';
import {
  GetGroupInvitesResponse,
  GroupInvite,
} from '../../dtos/trip/responce/get-invites.dto';
import { GetMatchProfileResponseDTO } from '../../dtos/trip/responce/get-match-profile.dto';
import { TripMatchResponseDTO } from '../../dtos/trip/responce/get-matches.dto';
import { GetMembersResponseDTO } from '../../dtos/trip/responce/get-members.dto';
import { GetUserTripsResponseDTO } from '../../dtos/trip/responce/get-user-trips.dto';

export interface ITripRepository {
  findDestinationByPlaceId(placeId: string): Promise<Destination | null>;
  createDestination(payload: CreateDestinationRequestDTO): Promise<Destination>;
  createTrip(payload: CreateTripDataDTO): Promise<{ tripId: string }>;
  getTripForMatching(tripId: string): Promise<TripForMatchingDTO>;
  getCandidateTrips(
    tripId: string,
    userId: string,
  ): Promise<TripForMatchingDTO[]>;
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
  getUserPastTrips(payload: {
    userId: string;
  }): Promise<GetUserTripsResponseDTO>;
  editTrip(tripId: string, payload: EditTripData): Promise<void>;
  createGroup(
    tripId: string,
    userId: string,
    inviteCode: string,
  ): Promise<void>;
  getActiveGroups(userId: string): Promise<GroupData[]>;
  addMember(userId: string, groupId: string, addedBy: string): Promise<void>;
  getMembers(groupId: string): Promise<GetMembersResponseDTO>;
  getInviteCode(groupId: string): Promise<{ inviteCode: string }>;
  createGroupInvite(payload: {
    groupId: string;
    invitedBy: string;
    invitedUserEmail: string;
  }): Promise<void>;
  getGroupWithTrip(groupId: string): Promise<{
    inviteCode: string;
    groupName: string;
    destination: string;
  }>;
  joinGroupByInviteCode(payload: {
    inviteCode: string;
    userId: string;
  }): Promise<{ groupId: string }>;
  GetGroupWithDetails(groupId: string): Promise<GroupData>;
  getGroupInvites(groupId: string): Promise<GetGroupInvitesResponse>;
  changeMemberRole(groupId: string, memberId: string): Promise<void>;
  removeFromGroup(
    groupId: string,
    memberId: string,
    userId?: string,
  ): Promise<void>;
}
