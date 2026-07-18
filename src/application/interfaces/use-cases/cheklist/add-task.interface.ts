import { AddTaskToChecklistRequestDTO } from '../../../dtos/checklist/request/add-task.dto';

export interface IAddChecklistTask {
  execute(dto: AddTaskToChecklistRequestDTO): Promise<void>;
}
