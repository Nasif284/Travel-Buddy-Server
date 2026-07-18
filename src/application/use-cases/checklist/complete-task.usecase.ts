import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IChecklistRepository } from '../../interfaces/repositories/checklist.repository';
import { ICompleteTask } from '../../interfaces/use-cases/cheklist/complete-task.interface';
@injectable()
export class CompleteTask implements ICompleteTask {
  constructor(
    @inject(TOKENS.IChecklistRepository)
    private readonly _checklistRepository: IChecklistRepository,
  ) {}
  async execute(dto: { id: string }): Promise<void> {
    return await this._checklistRepository.completeTask(dto.id);
  }
}
