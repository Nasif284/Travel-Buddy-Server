import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ICreateTrip } from '../../../application/interfaces/use-cases/trip/create-trip.usecase';
import { Request, Response } from 'express';
import { HttpStatus } from '../../../domain/enums/HttpStatusCodes.constants';
import { ApiResponse } from '../../responses/common-response';
import { TRIP_MESSAGES } from '../../../shared/constants/messages/success/trip/trip.messages';
import { IGetTripMatches } from '../../../application/interfaces/use-cases/trip/get-trip-matches.interface';
import { IGetActiveTrip } from '../../../application/interfaces/use-cases/trip/get-active-trip.interface';
import { IGetUserUpcomingTrips } from '../../../application/interfaces/use-cases/trip/get-user-upcoming-trips.interface';
import { IGetMatchProfile } from '../../../application/interfaces/use-cases/trip/get-match-profile.interface';
import { IGetPastTrips } from '../../../application/interfaces/use-cases/trip/get-past-trips.usecase';
import { IEditTrip } from '../../../application/interfaces/use-cases/trip/edit-trip.interface';
import { IDeleteTrip } from '../../../application/interfaces/use-cases/trip/delete-trip.usecase';
import { ICreateGroup } from '../../../application/interfaces/use-cases/trip/create-group.interface';
import { IGetActiveGroups } from '../../../application/interfaces/use-cases/trip/get-active-groups.interface';
import { IAddMembers } from '../../../application/interfaces/use-cases/trip/add-members.interface';
import { IGetMembers } from '../../../application/interfaces/use-cases/trip/get-memeber.usecase';
import { IGetGroup } from '../../../application/interfaces/use-cases/trip/get-group.interface';
import { IGetInviteCode } from '../../../application/interfaces/use-cases/trip/get-invite-code.interface';
import { ISendInvite } from '../../../application/interfaces/use-cases/trip/send-invite.interface';
import { IJoinWithLink } from '../../../application/interfaces/use-cases/trip/join-with-link.interface';
import { IGetInvites } from '../../../application/interfaces/use-cases/trip/get-invites.interface';
import { IRemoveMember } from '../../../application/interfaces/use-cases/trip/remove-member.inteface';
import { IChangeMemberRole } from '../../../application/interfaces/use-cases/trip/change-member-role.interface';

@injectable()
export class TripController {
  constructor(
    @inject(TOKENS.ICreateTrip)
    private readonly _createTripUseCase: ICreateTrip,
    @inject(TOKENS.IGetTripMatches)
    private readonly _getTripMatches: IGetTripMatches,
    @inject(TOKENS.IGetActiveTrip)
    private readonly _getActiveTrip: IGetActiveTrip,
    @inject(TOKENS.IGetUserUpcomingTrips)
    private readonly _getUserTrips: IGetUserUpcomingTrips,
    @inject(TOKENS.IGetMatchProfile)
    private readonly _getMatchProfile: IGetMatchProfile,
    @inject(TOKENS.IGetPastTrips)
    private readonly _getPastTrips: IGetPastTrips,
    @inject(TOKENS.IEditTrip)
    private readonly _editTrip: IEditTrip,
    @inject(TOKENS.IDeleteTrip)
    private readonly _deleteTrip: IDeleteTrip,
    @inject(TOKENS.ICreateGroup)
    private readonly _createGroup: ICreateGroup,
    @inject(TOKENS.IGetActiveGroups)
    private readonly _getActiveGroups: IGetActiveGroups,
    @inject(TOKENS.IAddMembers)
    private readonly _addMembers: IAddMembers,
    @inject(TOKENS.IGetMembers)
    private readonly _getMembers: IGetMembers,
    @inject(TOKENS.IGetGroup)
    private readonly _getGroup: IGetGroup,
    @inject(TOKENS.IGetInviteCode)
    private readonly _getInviteCode: IGetInviteCode,
    @inject(TOKENS.ISendInvite)
    private readonly _sendInvite: ISendInvite,
    @inject(TOKENS.IJoinWithLink)
    private readonly _joinWithLink: IJoinWithLink,
    @inject(TOKENS.IGetInvites)
    private readonly _getInvites: IGetInvites,
    @inject(TOKENS.IRemoveMember)
    private readonly _removeMember: IRemoveMember,
    @inject(TOKENS.IChangeRole)
    private readonly _changeRole: IChangeMemberRole,
  ) {}
  createTrip = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    console.log(req.body);
    await this._createTripUseCase.execute({ ...req.body, userId });
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(TRIP_MESSAGES.TRIP_CREATED));
  };
  getTripMatches = async (req: Request, res: Response): Promise<Response> => {
    const { page, limit } = req.query;
    const tripId = req.params.tripId;
    const data = await this._getTripMatches.execute({
      tripId: tripId as string,
      limit: Number(limit),
      page: Number(page),
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.FETCHED_TRIP_MATCHES, data));
  };
  getActiveTrip = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const data = await this._getActiveTrip.execute({ userId: userId! });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.FETCHED_ACTIVE_TRIP, data));
  };
  getUserTrips = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const data = await this._getUserTrips.execute({ userId: userId! });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.FETCHED_USER_TRIPS, data));
  };
  getMatchProfile = async (req: Request, res: Response): Promise<Response> => {
    const { matchId } = req.params;
    const userId = req.user?.userId;
    const data = await this._getMatchProfile.execute({
      matchId: matchId as string,
      userId: userId!,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.FETCHED_MATCH_PROFILE, data));
  };
  getUpcomingTrip = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.id;
    const data = await this._getUserTrips.execute({ userId: userId as string });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.FETCHED_USER_TRIPS, data));
  };
  getPastTrip = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.id;
    const data = await this._getPastTrips.execute({ userId: userId as string });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.FETCHED_USER_TRIPS, data));
  };
  getUserPastTrip = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const data = await this._getPastTrips.execute({ userId: userId as string });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.FETCHED_USER_TRIPS, data));
  };
  editTrip = async (req: Request, res: Response): Promise<Response> => {
    const tripId = req.params.id;
    await this._editTrip.execute({
      tripId: tripId as string,
      ...req.body,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.EDITED_TRIP_PLAN));
  };
  deleteTrip = async (req: Request, res: Response): Promise<Response> => {
    const tripId = req.params.id;
    await this._deleteTrip.execute({
      tripId: tripId as string,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.DELETED_TRIP_PLAN));
  };
  createGroup = async (req: Request, res: Response): Promise<Response> => {
    const tripId = req.params.id;
    const userId = req.user?.userId;
    await this._createGroup.execute({
      tripId: tripId as string,
      userId: userId!,
    });
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(TRIP_MESSAGES.TRIP_GROUP_CREATED));
  };
  getActiveGroups = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const data = await this._getActiveGroups.execute({
      userId: userId!,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.FETCHED_ACTIVE_GROUPS, data));
  };
  addMembers = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const groupId = req.params.id;
    const { members } = req.body;
    await this._addMembers.execute({
      members,
      groupId: groupId as string,
      addedBy: userId!,
    });
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(TRIP_MESSAGES.ADDED_MEMBER));
  };
  getMembers = async (req: Request, res: Response): Promise<Response> => {
    const groupId = req.params.id;
    const data = await this._getMembers.execute({ groupId: groupId as string });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.GET_MEMBERS, data));
  };
  getGroup = async (req: Request, res: Response): Promise<Response> => {
    const groupId = req.params.id;
    const data = await this._getGroup.execute({ groupId: groupId as string });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.GET_GROUP, data));
  };
  getInviteCode = async (req: Request, res: Response): Promise<Response> => {
    const groupId = req.params.id;
    const data = await this._getInviteCode.execute({
      groupId: groupId as string,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.GET_INVITE_CODE, data));
  };
  sendInvite = async (req: Request, res: Response): Promise<Response> => {
    const groupId = req.params.id;
    const userId = req.user?.userId;
    const { email } = req.body;
    await this._sendInvite.execute({
      groupId: groupId as string,
      email,
      invitedBy: userId!,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.INVITE_SENT));
  };
  joinWithLink = async (req: Request, res: Response): Promise<Response> => {
    const { inviteCode } = req.params;
    const userId = req.user?.userId;
    const data = await this._joinWithLink.execute({
      inviteCode: inviteCode as string,
      userId: userId!,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.JOINED_GROUP, data));
  };
  getInvites = async (req: Request, res: Response): Promise<Response> => {
    const groupId = req.params.id;
    const data = await this._getInvites.execute({
      groupId: groupId as string,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.GET_INVITES, data));
  };
  removeMember = async (req: Request, res: Response): Promise<Response> => {
    const groupId = req.params.id;
    const memberId = req.params.memberId;
    const userId = req.user?.userId;
    console.log(groupId + '      ' + memberId);
    await this._removeMember.execute({
      groupId: groupId as string,
      memberId: memberId as string,
      userId: userId!,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.REMOVE_MEMBER));
  };
  leaveGroup = async (req: Request, res: Response): Promise<Response> => {
    const groupId = req.params.id;
    const memberId = req.user?.userId;
    await this._removeMember.execute({
      groupId: groupId as string,
      memberId: memberId as string,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.LEFT_GROUP));
  };
  changeRole = async (req: Request, res: Response): Promise<Response> => {
    const groupId = req.params.id;
    const memberId = req.params.memberId;
    await this._changeRole.execute({
      groupId: groupId as string,
      memberId: memberId as string,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.CHANGE_ROLE));
  };
}
