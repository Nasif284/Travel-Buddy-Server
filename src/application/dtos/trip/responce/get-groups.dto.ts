interface GroupMembers {
  id: string;
  name: string;
  avatarUrl: string;
}
export interface GroupData {
  id: string;
  name: string;
  dateTo: Date;
  dateFrom: Date;
  coverUrl: string;
  destination: string;
  members: GroupMembers[];
}
export interface GetGroupsResponseDTO {
  groups: GroupData[];
}
