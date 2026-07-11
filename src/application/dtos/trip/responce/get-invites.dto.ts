export interface GroupInvite {
  id: string;
  groupId: string;
  invitedBy: string;
  invitedUserEmail: string;
  statusCode: string;
  createdAt: Date;
}
export interface GetGroupInvitesResponse {
  invites: GroupInvite[];
}
