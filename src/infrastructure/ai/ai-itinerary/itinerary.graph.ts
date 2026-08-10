import { START, END, StateGraph } from '@langchain/langgraph';

import { ItineraryState } from './itinerary.states';

import { validateContextNode } from './nodes/validate.node';
import { buildPlacesContextNode } from './nodes/place-context.node';
import { generateItineraryNode } from './nodes/planner.node';
import { validateResponseNode } from './nodes/response-validator.node';

import { IAIModelService } from '../../../application/interfaces/services/ai-model.service.interface';
import { IPlacesService } from '../../../application/interfaces/services/places.service.interface';
import { repairResponseNode } from './nodes/repai.node';
import { routeValidation } from './nodes/route-validation';
import { failureNode } from './nodes/filure.node';

export function createItineraryGraph(
  aiModel: IAIModelService,
  placesService: IPlacesService,
) {
  return new StateGraph(ItineraryState)
    .addNode('validate-context', validateContextNode)
    .addNode('places-context', (state) =>
      buildPlacesContextNode(state, placesService),
    )
    .addNode('planner', (state) => generateItineraryNode(state, aiModel))
    .addNode('response-validator', validateResponseNode)
    .addNode('repair-response', (state) => repairResponseNode(state, aiModel))
    .addNode('failure', failureNode)
    .addEdge(START, 'validate-context')
    .addEdge('validate-context', 'places-context')
    .addEdge('places-context', 'planner')
    .addEdge('planner', 'response-validator')
    .addConditionalEdges('response-validator', routeValidation, {
      success: END,
      repair: 'repair-response',
      failed: 'failure',
    })
    .addEdge('repair-response', 'response-validator')
    .compile();
}
