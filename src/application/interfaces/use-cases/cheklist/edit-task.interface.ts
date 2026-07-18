import { EditChecklistTaskRequestDTO } from '../../../dtos/checklist/request/edit-task.dto';

export interface IEditTask {
  execute(dto: EditChecklistTaskRequestDTO): Promise<void>;
}
