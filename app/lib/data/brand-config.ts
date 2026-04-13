import { BrandConfig } from '../types';

export const BANNED_PHRASES: string[] = [
  "game-changing", "bullish", "massive", "best-in-class", "alpha", 
  "secret", "guaranteed", "safe", "risk-free", "this changes everything", 
  "don't miss this", "huge opportunity", "insane", "moon", "next big thing",
  "alpha alert", "gm fam", "to the moon", "wagmi", "as an expert", 
  "let me teach you", "most people don't know", "like if you agree", "rt for reach"
];

export const PREFERRED_PHRASES: string[] = [
  "ptsd", "disclosing", "not life-changing", "boring pool", 
  "one sol and million dreams", "won again", "kicked in", 
  "the data says", "here's the actual math"
];

export const BRAND_CONFIG: BrandConfig = {
  voiceRules: [
    { rule: "First person, present tense", bad: "I observed that the pool lost fees", good: "I'm watching this pool bleed fees" },
    { rule: "Numbers before narrative", bad: "This pool is really performing well lately", good: "+5.1% in 14 days on SOL-USDC DLMM" },
    { rule: "No external links in post body", bad: "Check out this pool: https://meteora.ag/...", good: "[link in first reply]" },
    { rule: "0–1 hashtags max", bad: "#DeFi #Solana #Yield #DLMM #Meteora", good: "No hashtag or one event tag only" },
    { rule: "Never position as guru", bad: "As an expert in DLMM strategies, let me teach you", good: "Here's what I found after testing this for 2 weeks" },
    { rule: "Short sentences, generous whitespace", bad: "Long paragraph with multiple ideas crammed together without breaks making it hard to scan", good: "One idea per line.\n\nBreathing room between thoughts." },
    { rule: "Emoji as punctuation only (max 1)", bad: "🔥🚀💰 This pool is INSANE!! 🤑🎯", good: "This pool structure surprised me. 📊" },
    { rule: "End with opinion-forcing question", bad: "What do you think? 👇", good: "Would you hold this through a 15% SOL dump?" },
    { rule: "Disclose positions always", bad: "This protocol looks promising", good: "I have a small position here — disclosing" },
    { rule: "English-primary, Indonesian flavor in replies only", bad: "Om ini DLMM pool bagus banget sih 🔥", good: "English post. Indonesian warmth in reply threads." },
  ],
  bannedPhrases: BANNED_PHRASES,
  preferredPhrases: PREFERRED_PHRASES,
  pillarPresets: {
    defi: {
      hookBias: ["H4", "H1", "H3"],
      formulaBias: ["F1", "F7", "F3"],
      ctaBias: ["R1", "R3", "S1"],
      vocabulary: ["yield", "risk", "exposure", "mechanics", "TVL", "APY", "drawdown", "liquidity", "impermanent loss", "fees", "bin"]
    },
    payments: {
      hookBias: ["H2", "H5", "H7"],
      formulaBias: ["F2", "F3"],
      ctaBias: ["Q1", "R2", "R4"],
      vocabulary: ["settlement", "counterparty", "on-ramp", "compliance", "merchant", "checkout", "velocity", "friction", "programmable"]
    },
    agentic_ai: {
      hookBias: ["H4", "H6", "H5"],
      formulaBias: ["F5", "F3", "F4"],
      ctaBias: ["R4", "Q1", "S3"],
      vocabulary: ["architecture", "constraint", "workflow", "agent", "pipeline", "execution", "LLM", "caching", "RPC", "autonomy"]
    },
    futarchy: {
      hookBias: ["H2", "H7"],
      formulaBias: ["F6", "F2"],
      ctaBias: ["Q2", "R2"],
      vocabulary: ["mechanism", "governance", "prediction", "conviction", "market", "multisig", "voting", "DAO", "efficiency"]
    }
  }
};
