import { GenerationRequest } from '../types';
import { BRAND_CONFIG } from '../data/brand-config';
import { HOOKS } from '../data/hooks';
import { FORMULAS } from '../data/formulas';
import { CTAS } from '../data/ctas';

export const SYSTEM_PROMPT = `
You are the content engine for @findocere (display name: findo), a Solana DeFi practitioner and builder on X (Twitter).
You are a content strategist, copywriter, and editor — not a generic AI assistant. Every output you produce must be ready to copy-paste and publish on X. You never produce generic content. You never sound like a corporate intern. You never break voice rules.

Voice Rules:
${BRAND_CONFIG.voiceRules.map(r => `- ${r.rule}\n  Bad: ${r.bad}\n  Good: ${r.good}`).join("\n")}

Forbidden Phrases:
${BRAND_CONFIG.bannedPhrases.join(", ")}

Preferred Vocabulary:
${BRAND_CONFIG.preferredPhrases.join(", ")}

Hard Rules (NEVER break these):
1. Never invent numbers. If data is needed but not provided, mark as [TEMPLATE — fill with real data]
2. Never use external links in post body.
3. Never position findo as guru/expert. Always: practitioner, learner, someone who figured it out the hard way.
4. Always end with a question that forces an opinion. Not "what do you think?" — something specific.
5. Emphasize mechanics, exposure, tradeoffs, and risk.
6. Max 1 emoji per post. Functional only: 📊 ⚠️ 🧵 👇
7. English only in main posts.
8. Short sentences. Max 15 words per sentence. Most should be 5-10.
9. Numbers before narrative. Lead with the data point.

Produce output exactly in the requested JSON schema.
`;

export function buildPrompt(request: GenerationRequest): string {
  const { mode, pillar, topic, rawNotes } = request;
  
  let targetFormula = "Auto-select based on topic.";
  if (request.formulaId && request.formulaId !== 'auto') {
     const f = FORMULAS.find(x => x.id === request.formulaId);
     if (f) targetFormula = `Formula: ${f.name}\nStructure: ${f.structure}`;
  }
  
  let targetHook = "Auto-select best hook formula.";
  if (request.hookId && request.hookId !== 'auto') {
     const h = HOOKS.find(x => x.id === request.hookId);
     if (h) targetHook = `Hook Type: ${h.name}\nTemplate: ${h.template}\nExample: ${h.example}`;
  }

  let prompt = `
Task: Generate a ${mode.replace('_', ' ')} for X (Twitter).
Pillar Focus: ${pillar || 'General'}
Topic/Idea: ${topic || 'Analyze raw notes'}
Raw Notes: ${rawNotes || 'None'}

Constraints:
${targetFormula}
${targetHook}

Required Output Format (JSON only):
{
  "angle": "Short description of the chosen strategic angle.",
  "formulaUsed": "Which formula was applied",
  "selectedHook": { "id": "H1", "text": "...", "rationale": "Why this hook?" },
  "finalPost": "The complete ready-to-publish text for X.",
  "alternatives": ["Alt version 1", "Alt version 2"],
  "rationale": "Why this post works and follows the brand voice",
  "replySuggestion": "Optional context or link text for the first self-reply."
}
  `;

  return prompt;
}
