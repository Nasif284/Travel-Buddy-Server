export interface IJoinWithLink {
  execute(dto: {
    inviteCode: string;
    userId: string;
  }): Promise<{ groupId: string }>;
}
