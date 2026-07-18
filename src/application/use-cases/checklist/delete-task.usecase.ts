import { inject, injectable } from 'tsyringe';
import { IDeleteTask } from '../../interfaces/use-cases/cheklist/delete-task.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IChecklistRepository } from '../../interfaces/repositories/checklist.repository';
@injectable()
export class DeleteTask implements IDeleteTask {
  constructor(
    @inject(TOKENS.IChecklistRepository)
    private readonly _checklistRepository: IChecklistRepository,
  ) {}
  async execute(dto: { id: string }): Promise<void> {
    return await this._checklistRepository.deleteTask(dto.id);
  }
}
