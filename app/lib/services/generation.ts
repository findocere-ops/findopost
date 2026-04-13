import { GenerationRequest, GenerationResult } from '../types';
import { SYSTEM_PROMPT, buildPrompt } from '../prompts';
import { evaluateContent } from '../evaluator';

export async function generateContent(request: GenerationRequest): Promise<GenerationResult> {
  const apiKey = typeof window !== 'undefined' ? localStorage.getItem('findo_api_key') : null;
  const baseUrl = typeof window !== 'undefined' ? localStorage.getItem('findo_base_url') : 'https://api.openai.com/v1';
  const modelName = typeof window !== 'undefined' ? localStorage.getItem('findo_model') : 'gpt-4o'; // Or openrouter/minimax

  const prompt = buildPrompt(request);

  if (!apiKey || apiKey.trim() === '') {
     console.warn("No API key provided, falling back to mock generation.");
     return mockGeneration(request);
  }

  try {
     const response = await fetch(`${baseUrl}/chat/completions`, {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${apiKey}`
         },
         body: JSON.stringify({
             model: modelName,
             messages: [
                 { role: 'system', content: SYSTEM_PROMPT },
                 { role: 'user', content: prompt }
             ],
             response_format: { type: "json_object" },
             temperature: 0.7
         })
     });

     if (!response.ok) {
         throw new Error(`API returned ${response.status}: ${response.statusText}`);
     }

     const data = await response.json();
     const content = data.choices[0].message.content;
     let parsed: any;
     
     try {
         parsed = JSON.parse(content);
     } catch(e) {
         console.error("Failed to parse JSON response:", content);
         throw new Error("Invalid output format returned by LLM.");
     }

     const evaluationScores = evaluateContent(parsed.finalPost, request.mode === 'thread');
     
     return {
         ...parsed,
         evaluationScores,
         warnings: []
     } as GenerationResult;

  } catch (err: any) {
     console.error("Generation failed:", err);
     
     // Fallback to mock on error but surface the error in formatting if wanted
     const mockResult = await mockGeneration(request);
     mockResult.warnings = [(err as Error).message, "Using offline mock generation instead."];
     return mockResult;
  }
}

async function mockGeneration(req: GenerationRequest): Promise<GenerationResult> {
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const text = `I held my DLMM position through a 20% SOL drop. Here's what it actually cost me.\n\n+5.1% in fees. -18% in IL.\n\nThe real lesson here isn't about avoiding drops. It's about knowing if your fees outpace the IL before the drop happens.\n\nWould you hold this through a 15% SOL dump?\n\nDYOR, NFA.`;
  
  return {
    angle: "Risk reality check",
    formulaUsed: req.formulaId || "F1 (Practitioner Confession)",
    selectedHook: {
      id: req.hookId || "H1",
      text: "I held my DLMM position through a 20% SOL drop. Here's what it actually cost me.",
      rationale: "Vulnerability builds trust, especially in DeFi where everyone flexes wins."
    },
    finalPost: req.mode === 'thread' ? text + "\n\n---\n\nTweet 2:\nThis is a mocked thread..." : text,
    alternatives: [
      "Here is an alternative angle mocked for demo.\n\nThe IL is worse than finding a new pair.",
      "Another alternative mocked generation."
    ],
    replySuggestion: "Detailed breakdown of the pool fees: [LINK]",
    rationale: "MOCKED generation. Maintained short sentences, and avoided hype words.",
    evaluationScores: evaluateContent(text, req.mode === 'thread'),
    warnings: ["Running in offline/mock mode.", "Set your API key in Settings."]
  };
}
