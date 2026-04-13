import { Hook } from '../types';

export const HOOKS: Hook[] = [
  { 
    id: "H1", 
    name: "Confession", 
    template: "I [did/believed X]. It cost me [specific consequence].", 
    trigger: "Vulnerability + specificity → trust", 
    best: "Single tweets, journals", 
    example: "I held my DLMM position through a 20% SOL drop. Here's what it actually cost me." 
  },
  { 
    id: "H2", 
    name: "Counterintuitive", 
    template: "[Common belief] is wrong. Here's what actually happens.", 
    trigger: "Pattern interruption → confusion", 
    best: "Threads", 
    example: "Higher APY doesn't mean higher profit. Most DLMM farmers lose money on the best-looking pools." 
  },
  { 
    id: "H3", 
    name: "Timestamp", 
    template: "[Time marker]: [unexpected observation from real data].", 
    trigger: "Urgency + freshness → FOMO", 
    best: "Single tweets, alpha drops", 
    example: "Last 72 hours: stablecoin LP yields on Meteora quietly doubled. Nobody's talking about why." 
  },
  { 
    id: "H4", 
    name: "Builder's Receipts", 
    template: "[Specific result] from [specific action] in [specific timeframe].", 
    trigger: "Proof + aspiration → credibility", 
    best: "Single tweets w/ screenshot", 
    example: "+6.2% in 11 days on a stablecoin pair. No leverage, no degen plays. Just bin management." 
  },
  { 
    id: "H5", 
    name: "Everyone's Ignoring This", 
    template: "Nobody is paying attention to [specific mechanic]. That's the opportunity.", 
    trigger: "Exclusivity + implied edge", 
    best: "Threads", 
    example: "Nobody is watching Meteora's DAMM V2 fee structure. The edge is in the bin spacing." 
  },
  { 
    id: "H6", 
    name: "Process Reveal", 
    template: "Here's the exact [process/setup] I use for [specific outcome].", 
    trigger: "Behind-the-scenes → dwell time", 
    best: "Threads (step-by-step)", 
    example: "Here's the exact checklist I run before entering any DLMM position. Takes 4 minutes." 
  },
  { 
    id: "H7", 
    name: "Honest Pivot", 
    template: "I used to believe [X]. I was wrong. Here's what changed my mind.", 
    trigger: "Changed mind → respect", 
    best: "Single tweets, short threads", 
    example: "I used to think stablecoin LPs were boring. Then I ran the numbers against my directional trades." 
  },
  { 
    id: "H8", 
    name: "Question-as-Hook", 
    template: "[Provocative question that assumes suboptimal behavior]?", 
    trigger: "Direct challenge → ego activation", 
    best: "Single tweets, reply-max", 
    example: "If your LP strategy can't survive a 15% drawdown, do you actually have a strategy?" 
  },
];
