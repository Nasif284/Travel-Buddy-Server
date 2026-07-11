export interface IAddMembers {
  execute(dto: {
    members: string[];
    groupId: string;
    addedBy: string;
  }): Promise<void>;
}
