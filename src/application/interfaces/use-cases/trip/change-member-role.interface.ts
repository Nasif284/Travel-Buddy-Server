export interface IChangeMemberRole {
  execute(dto: { groupId: string; memberId: string }): Promise<void>;
}
