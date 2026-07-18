import { AddTaskToChecklistRequestDTO } from '../../dtos/checklist/request/add-task.dto';
import { EditChecklistTaskRequestDTO } from '../../dtos/checklist/request/edit-task.dto';
import { ChecklistRepositoryResult } from '../../dtos/checklist/respose/get-checklist.dto';
export interface IChecklistRepository {
  getChecklist(groupId: string): Promise<ChecklistRepositoryResult>;
  addTask(payload: AddTaskToChecklistRequestDTO): Promise<void>;
  editTask(payload: EditChecklistTaskRequestDTO): Promise<void>;
  completeTask(id: string): Promise<void>;
  deleteTask(id: string): Promise<void>;
}
