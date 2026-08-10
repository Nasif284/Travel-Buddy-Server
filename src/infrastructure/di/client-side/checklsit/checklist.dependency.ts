import { container } from 'tsyringe';
import { GetChecklist } from '../../../../application/use-cases/checklist/get-checklist.usecase';
import { TOKENS } from '../../tokens';
import { AddChecklistTask } from '../../../../application/use-cases/checklist/add-task.usecase';
import { EditTask } from '../../../../application/use-cases/checklist/edit-task.usecase';
import { CompleteTask } from '../../../../application/use-cases/checklist/complete-task.usecase';
import { DeleteTask } from '../../../../application/use-cases/checklist/delete-task.usecase';

export function registerChecklistDependency(): void {
  container.registerSingleton<GetChecklist>(TOKENS.IGetChecklist, GetChecklist);
  container.registerSingleton<AddChecklistTask>(
    TOKENS.IAddTask,
    AddChecklistTask,
  );
  container.registerSingleton<EditTask>(TOKENS.IEditTask, EditTask);
  container.registerSingleton<CompleteTask>(TOKENS.ICompleteTask, CompleteTask);
  container.registerSingleton<DeleteTask>(TOKENS.IDeleteTask, DeleteTask);
}
