interface GroupMembers {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  joinedAt?: Date;
  tripCount?: number;
  reportCount?: number;
}
export interface GroupData {
  id: string;
  name: string;
  dateTo: Date;
  dateFrom: Date;
  coverUrl: string;
  destination: string;
  budgetStyle: string;
  members: GroupMembers[];
}
export interface GetGroupsResponseDTO {
  groups: GroupData[];
}
