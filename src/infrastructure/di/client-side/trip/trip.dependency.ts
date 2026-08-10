import { container } from 'tsyringe';
import { TOKENS } from '../../tokens';
import { CreateTrip } from '../../../../application/use-cases/trip/create-trip.usecase';
import { CalculateMatch } from '../../../../application/use-cases/trip/calculate-match.usecase';
import { GetTripMatches } from '../../../../application/use-cases/trip/get-matches.usecase';
import { GetActiveTrip } from '../../../../application/use-cases/trip/get-active-trip.usecase';
import { GetUserUpcomingTrips } from '../../../../application/use-cases/trip/get-upcoming-trips.usecase';
import { GetMatchProfile } from '../../../../application/use-cases/trip/get-match-profile.usecase';
import { GetPastTrips } from '../../../../application/use-cases/trip/get-past-trips.usecase';
import { EditTrip } from '../../../../application/use-cases/trip/editTrip.usecase';
import { DeleteTrip } from '../../../../application/use-cases/trip/delete-trip.usecase';
import { CreateGroup } from '../../../../application/use-cases/trip/create-group.usecase';
import { GetActiveGroups } from '../../../../application/use-cases/trip/get-active-groups.usecase';
import { AddMembers } from '../../../../application/use-cases/trip/add-members.usecase';
import { GetMembers } from '../../../../application/use-cases/trip/get-members.usecase';
import { GetGroup } from '../../../../application/use-cases/trip/get-group.usecase';
import { GetInviteCode } from '../../../../application/use-cases/trip/get-invite-code.usecase';
import { SendInvite } from '../../../../application/use-cases/trip/send-invite.usecase';
import { JoinWithLink } from '../../../../application/use-cases/trip/join-with-link.usecase';
import { GetInvites } from '../../../../application/use-cases/trip/get-invites.usecase';
import { RemoveMember } from '../../../../application/use-cases/trip/remove-member.usecase';
import { ChangeMemberRole } from '../../../../application/use-cases/trip/change-member-role.usecase';
import { GetTripWeather } from '../../../../application/use-cases/trip/trip-weather.usecase';
import { GetAllTripGroups } from '../../../../application/use-cases/trip/get-all-groups.usecase';
import { GetUserGroups } from '../../../../application/use-cases/trip/get-user-groups.usecase';

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
  container.registerSingleton<GetPastTrips>(TOKENS.IGetPastTrips, GetPastTrips);
  container.registerSingleton<EditTrip>(TOKENS.IEditTrip, EditTrip);
  container.registerType<DeleteTrip>(TOKENS.IDeleteTrip, DeleteTrip);
  container.registerSingleton<CreateGroup>(TOKENS.ICreateGroup, CreateGroup);
  container.registerSingleton<GetActiveGroups>(
    TOKENS.IGetActiveGroups,
    GetActiveGroups,
  );
  container.registerSingleton<AddMembers>(TOKENS.IAddMembers, AddMembers);
  container.registerSingleton<GetMembers>(TOKENS.IGetMembers, GetMembers);
  container.registerSingleton<GetGroup>(TOKENS.IGetGroup, GetGroup);
  container.registerSingleton<GetInviteCode>(
    TOKENS.IGetInviteCode,
    GetInviteCode,
  );
  container.registerSingleton<SendInvite>(TOKENS.ISendInvite, SendInvite);
  container.registerSingleton<JoinWithLink>(TOKENS.IJoinWithLink, JoinWithLink);
  container.registerSingleton<GetInvites>(TOKENS.IGetInvites, GetInvites);
  container.registerSingleton<RemoveMember>(TOKENS.IRemoveMember, RemoveMember);
  container.registerSingleton<ChangeMemberRole>(
    TOKENS.IChangeRole,
    ChangeMemberRole,
  );
  container.registerSingleton<GetTripWeather>(
    TOKENS.IGetWeather,
    GetTripWeather,
  );
  container.registerSingleton<GetAllTripGroups>(
    TOKENS.IGetAllTripGroups,
    GetAllTripGroups,
  );
  container.registerSingleton<GetUserGroups>(
    TOKENS.IGetUserGroups,
    GetUserGroups,
  );
}
