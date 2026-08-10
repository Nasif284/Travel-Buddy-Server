import { inject, injectable } from 'tsyringe';
import { IAssistantService } from '../../application/interfaces/services/ai-assistant.service.interface';
import { TOKENS } from '../di/tokens';
import { IAIModelService } from '../../application/interfaces/services/ai-model.service.interface';
import { createAssistantGraph } from '../ai/ai-assistant/graph';
import { AssistantContext } from '../../application/interfaces/use-cases/ai-assistant/chat.interface';

@injectable()
export class AssistantService implements IAssistantService {
  constructor(
    @inject(TOKENS.IAIModelService)
    private readonly aiModel: IAIModelService,
  ) {}

  async chat(context: AssistantContext, message: string): Promise<string> {
    const graph = createAssistantGraph(this.aiModel);

    const result = await graph.invoke({
      context,
      userMessage: message,
    });

    return result.assistantReply;
  }
}
