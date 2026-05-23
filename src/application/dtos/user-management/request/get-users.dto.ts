export interface GetAllUsersRequestDTO {
  page: number;
  limit: number;
  filter: {
    status: string | undefined;
    verified: string | undefined;
    joined: string | undefined;
    search: string | undefined;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
