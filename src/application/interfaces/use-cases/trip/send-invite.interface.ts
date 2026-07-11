export interface ISendInvite {
  execute(dto: {
    groupId: string;
    email: string;
    invitedBy: string;
  }): Promise<void>;
}
