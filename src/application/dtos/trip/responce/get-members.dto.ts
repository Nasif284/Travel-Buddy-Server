interface Member {
  id: string;
  userId: string;
  name: string;
  avatarUrl: string;
  joinedAt: Date;
  role: string;
}
export interface GetMembersResponseDTO {
  members: Member[];
}
