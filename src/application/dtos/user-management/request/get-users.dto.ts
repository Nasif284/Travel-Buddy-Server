export interface GetAllUsersRequestDTO {
  page: number;
  limit: number;
  filter: {
    status: string | undefined;
    verified: string | undefined;
    joined: string | undefined;
  };
  orderBy: string;
}
