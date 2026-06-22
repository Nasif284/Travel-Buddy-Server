interface ConnectionRequestData {
  id: string;
  status: string;
  message: string | null;
  matchId: string;
  createdAt: Date;
  sender: {
    id: string;
    avatarUrl: string | null;
    fullName: string;
    state: string | null;
    country: string | null;
  };
}
export interface GetIncomingRequestsResponseDTO {
  requests: ConnectionRequestData[];
}
