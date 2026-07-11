export interface IGetInviteCode {
  execute(dto: { groupId: string }): Promise<{ inviteCode: string }>;
}
