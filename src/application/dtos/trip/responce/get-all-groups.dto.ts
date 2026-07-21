import { GetGroupsResponseDTO } from './get-groups.dto';

export interface GetAllGroupsResponseDTO extends GetGroupsResponseDTO {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
