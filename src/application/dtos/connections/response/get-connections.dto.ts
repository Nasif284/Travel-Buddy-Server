export interface Connection {
  id: string;
  fullName: string;
  state: string | null;
  country: string | null;
  avatarUrl: string | null;
}
export interface GetConnectionsResponseDTO {
  connections: Connection[];
}
