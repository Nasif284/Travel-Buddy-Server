import { IAIModelService } from '../../../../application/interfaces/services/ai-model.service.interface';
import { ItineraryGraphState } from '../itinerary.states';
import { buildItineraryPrompt } from '../prompts/itinerary.prompt';

export async function generateItineraryNode(
  state: ItineraryGraphState,
  aiModel: IAIModelService,
) {
  const prompt = buildItineraryPrompt(state.context, state.placesContext);

  const response = await aiModel.complete({
    messages: [
      {
        role: 'system',
        content: prompt.system,
      },
      {
        role: 'user',
        content: prompt.user,
      },
    ],
    options: {
      temperature: 0.4,
      maxTokens: 2957,
    },
  });
  console.log('========= RAW AI RESPONSE =========');
  console.log(response.text);
  console.log('===================================');

  return {
    rawAiResponse: response.text,
  };
}
