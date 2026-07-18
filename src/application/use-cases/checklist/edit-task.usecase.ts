import { inject, injectable } from 'tsyringe';
import { IEditTask } from '../../interfaces/use-cases/cheklist/edit-task.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IChecklistRepository } from '../../interfaces/repositories/checklist.repository';
import { EditChecklistTaskRequestDTO } from '../../dtos/checklist/request/edit-task.dto';
@injectable()
export class EditTask implements IEditTask {
  constructor(
    @inject(TOKENS.IChecklistRepository)
    private readonly _checklistRepository: IChecklistRepository,
  ) {}
  async execute(dto: EditChecklistTaskRequestDTO): Promise<void> {
    return this._checklistRepository.editTask(dto);
  }
}
