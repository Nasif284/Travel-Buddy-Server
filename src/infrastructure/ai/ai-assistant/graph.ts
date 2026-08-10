import { START, END, StateGraph } from '@langchain/langgraph';

import { IAIModelService } from '../../../application/interfaces/services/ai-model.service.interface';
import { AssistantState } from './state';
import { generateAssistantResponseNode } from './nodes/response.node';

export function createAssistantGraph(aiModel: IAIModelService) {
  return new StateGraph(AssistantState)
    .addNode('assistant', (state) =>
      generateAssistantResponseNode(state, aiModel),
    )
    .addEdge(START, 'assistant')
    .addEdge('assistant', END)
    .compile();
}
