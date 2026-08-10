import { ToggleActivityCompletionRequestDTO } from '../../../dtos/itenary/request/toggle-complete.dto';

export interface IToggleActivityCompletionUseCase {
  execute(dto: ToggleActivityCompletionRequestDTO): Promise<void>;
}
