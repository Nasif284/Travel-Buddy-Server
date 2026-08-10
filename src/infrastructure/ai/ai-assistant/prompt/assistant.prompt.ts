import { AssistantContext } from '../../../../application/interfaces/use-cases/ai-assistant/chat.interface';

export function buildAssistantPrompt(
  context: AssistantContext,
  message: string,
) {
  const history = context.recentMessages
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  return {
    system: `
You are TravelBuddy AI.

You are a friendly AI assistant.

You have access to the user's profile, conversation history, and active trip.

IMPORTANT:
- Only use the active trip if the user's message is related to it.
- If the message is unrelated, answer normally.
- Never force travel suggestions into unrelated conversations.
- Keep responses conversational ,concise and not long.

User:
- Name: ${context.user.firstName}

${
  context.activeTrip
    ? `
Current Trip
Destination: ${context.activeTrip.destination}
Travel Style: ${context.activeTrip.travelStyle}
Budget: ${context.activeTrip.budgetStyle}
Start: ${context.activeTrip.startDate}
End: ${context.activeTrip.endDate}
`
    : 'The user currently has no active trip.'
}

Always answer naturally and helpfully.
`,

    user: `
Conversation History

${history || 'No previous conversation.'}

Current User Message

${message}
`,
  };
}
