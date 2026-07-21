export interface GetGroupsRequestDTO {
  search: string;
  budgetStyle: string;
  tripStatus: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}
