import { GetChecklistResponseDTO } from '../../../dtos/checklist/respose/get-checklist.dto';

export interface IGetCheckList {
  execute(dto: {
    groupId: string;
    userId: string;
  }): Promise<GetChecklistResponseDTO>;
}
