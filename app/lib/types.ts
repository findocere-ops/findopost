export type GenerationMode = 'single_post' | 'thread' | 'rewrite' | 'hooks_only' | 'angle_explorer' | 'evaluator';

export type ContentFormat = 'single_tweet' | 'thread' | 'journal';

export type Pillar = 'defi' | 'payments' | 'agentic_ai' | 'futarchy' | 'any';

export type CTAType = 'reply' | 'save' | 'quote';

export interface Hook {
  id: string;
  name: string;
  template: string;
  trigger: string;
  best: string;
  example: string;
}

export interface CTA {
  id: string;
  type: CTAType;
  text: string;
}

export interface Formula {
  id: string;
  name: string;
  structure: string;
  pillar: string;
  engages: string;
}

export interface GenerationRequest {
  mode: GenerationMode;
  topic?: string;
  rawNotes?: string;
  draft?: string;
  sourceFacts?: string;
  targetGoal?: string;
  format?: ContentFormat;
  formulaId?: string;      // F1-F7 or 'auto'
  hookId?: string;         // H1-H8 or 'auto'
  toneIntensity?: number;  // 1-5
  ctaType?: CTAType | 'auto';
  pillar?: Pillar;
}

export interface HookCandidate {
  id: string;
  text: string;
  rationale: string;
}

export interface GenerationResult {
  angle: string;
  formulaUsed?: string;
  hookCandidates?: HookCandidate[];
  selectedHook?: HookCandidate;
  finalPost: string;
  alternatives?: string[];
  suggestedCTA?: string;
  rationale: string;
  warnings?: string[];
  replySuggestion?: string;
  imageUsageSuggestion?: string;
  evaluationScores: EvaluationScores;
}

export interface EvaluationIssue {
  rule: string;
  severity: 'low' | 'medium' | 'high';
  rulePassed: boolean;
}

export interface EvaluationScores {
  voiceFit: number;          // 0-100
  specificity: number;       // 0-100
  hypeRisk: number;          // 0-100 (lower is better)
  overclaimRisk: number;     // 0-100 (lower is better)
  readability: number;       // 0-100
  endingStrength: number;    // 0-100
  brandFit: number;          // 0-100
  characterCount: number;
  isUnderLimit: boolean;
  issues: EvaluationIssue[];
}

export interface BrandConfig {
  voiceRules: { rule: string; bad: string; good: string }[];
  bannedPhrases: string[];
  preferredPhrases: string[];
  pillarPresets: Record<string, { hookBias: string[]; formulaBias: string[]; ctaBias: string[]; vocabulary: string[] }>;
}

export interface PostHistoryEntry {
  id: string;
  timestamp: string; // ISO format
  request: GenerationRequest;
  result: GenerationResult;
  isFavorite?: boolean;
}
