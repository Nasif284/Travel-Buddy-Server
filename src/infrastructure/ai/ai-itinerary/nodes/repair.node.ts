import { IAIModelService } from '../../../../application/interfaces/services/ai-model.service.interface';
import { ItineraryGraphState } from '../itinerary.states';

export async function repairResponseNode(
  state: ItineraryGraphState,
  aiModel: IAIModelService,
) {
  const prompt = `
The following itinerary failed validation.

Errors:
${state.validationErrors.join('\n')}

Original response:

${state.rawAiResponse}

Repair ONLY the invalid parts.

Return valid JSON only.
`;

  const response = await aiModel.complete({
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return {
    rawAiResponse: response.text,
    repairAttempts: state.repairAttempts + 1,
  };
}
