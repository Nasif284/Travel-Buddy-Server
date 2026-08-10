import { container } from 'tsyringe';
import {
  IAssistantContextBuilder,
  IChatAssistantUseCase,
} from '../../../../application/interfaces/use-cases/ai-assistant/chat.interface';
import { TOKENS } from '../../tokens';
import { AssistantContextBuilder } from '../../../ai/ai-assistant/builder/context.builder';

import { AssistantService } from '../../../services/ai-assistant.service';
import { ChatAssistantUseCase } from '../../../../application/use-cases/ai-assistant/chat.usecase';
import { IGetAssistantMessagesUseCase } from '../../../../application/interfaces/use-cases/ai-assistant/get-chats.interfce';
import { GetAssistantMessagesUseCase } from '../../../../application/use-cases/ai-assistant/get-chats.usecase';
import { IAssistantService } from '../../../../application/interfaces/services/ai-assistant.service.interface';

export function registerAiAssistantDependency() {
  container.registerSingleton<IAssistantContextBuilder>(
    TOKENS.IAssistantContextBuilder,
    AssistantContextBuilder,
  );
  container.registerSingleton<IAssistantService>(
    TOKENS.IAssistantService,
    AssistantService,
  );
  container.registerSingleton<IChatAssistantUseCase>(
    TOKENS.IChatAssistantUseCase,
    ChatAssistantUseCase,
  );
  container.registerSingleton<IGetAssistantMessagesUseCase>(
    TOKENS.IGetAssistantMessagesUseCase,
    GetAssistantMessagesUseCase,
  );
}
