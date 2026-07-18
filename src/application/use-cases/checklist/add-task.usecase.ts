import { inject, injectable } from 'tsyringe';
import { IAddChecklistTask } from '../../interfaces/use-cases/cheklist/add-task.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IChecklistRepository } from '../../interfaces/repositories/checklist.repository';
import { AddTaskToChecklistRequestDTO } from '../../dtos/checklist/request/add-task.dto';
@injectable()
export class AddChecklistTask implements IAddChecklistTask {
  constructor(
    @inject(TOKENS.IChecklistRepository)
    private readonly _checklistRepository: IChecklistRepository,
  ) {}
  async execute(dto: AddTaskToChecklistRequestDTO): Promise<void> {
    return this._checklistRepository.addTask(dto);
  }
}
