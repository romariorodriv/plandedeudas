export type AiExplanationContext = {
  viability: string;
  priorityReason: string;
  selectedStrategy: "moderate" | "aggressive";
};

export function isAiExplanationConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function createAiAssistedExplanation(context: AiExplanationContext) {
  void context;
  if (!isAiExplanationConfigured()) return null;
  return null;
}
