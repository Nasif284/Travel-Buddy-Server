export interface IRemoveMember {
  execute(dto: {
    groupId: string;
    memberId: string;
    userId?: string;
  }): Promise<void>;
}
