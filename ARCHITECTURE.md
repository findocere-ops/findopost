# @findocere Content Engine — System Architecture

## Overview

This is a skill graph content production system. 12 interconnected markdown files form the "brain" of an AI content agent. The agent reads the graph, follows [[wikilinks]], and produces platform-native posts for X (Twitter).

## Folder Structure

```
findocere-content-engine/
├── CLAUDE.md                    ← Master system prompt (copy into your LLM)
├── ARCHITECTURE.md              ← This file
├── index.md                     ← Command center — agent reads this FIRST
├── platforms/
│   └── x.md                     ← X/Twitter playbook (rules, limits, algo signals)
├── voice/
│   ├── brand-voice.md           ← Core DNA (who findo is, what he sounds like)
│   └── platform-tone.md         ← How voice adapts per platform
├── engine/
│   ├── hooks.md                 ← 8 hook formulas with templates
│   ├── content-types.md         ← 7 content formulas (Confession, Teardown, etc.)
│   ├── ctas.md                  ← 10 CTA formulas (reply-bait, save-bait, QT-bait)
│   ├── repurpose.md             ← 1 idea → multiple post variants
│   └── scheduling.md            ← Weekly rhythm, timing, pillar distribution
└── audience/
    ├── defi-practitioners.md    ← Primary audience segment
    ├── builders.md              ← AI x crypto builder segment
    └── newcomers.md             ← Crypto-curious newcomers
```

## How the Wikilinks Connect

```
index.md
  ├── [[voice/brand-voice]]     → identity, personality, forbidden patterns
  │     └── [[voice/platform-tone]]  → X-specific adaptation
  ├── [[platforms/x]]            → character limits, algo rules, format
  ├── [[engine/hooks]]           → 8 hook formulas
  │     └── references [[voice/brand-voice]] for tone check
  ├── [[engine/content-types]]   → 7 content formulas
  │     └── references [[engine/hooks]] for hook selection
  │     └── references [[audience/*]] for targeting
  ├── [[engine/ctas]]            → 10 closing formulas
  ├── [[engine/repurpose]]       → multi-variant production
  │     └── references [[platforms/x]] for format rules
  ├── [[engine/scheduling]]      → timing and cadence
  └── [[audience/*]]             → 3 audience segments
```

## Deployment Methods

### Method 1: Claude Projects (Recommended)

1. Create a new Project in Claude called "findocere content engine"
2. Upload ALL .md files into the Project Knowledge Base
3. Set CLAUDE.md content as the Project System Prompt (Custom Instructions)
4. Start a conversation: "Generate a hack drop about Meteora bin spacing"
5. Claude reads the graph, follows links, produces a ready-to-publish post

### Method 2: Hermes Agent Framework + MiniMax M2.7

For autonomous/scheduled content generation:

```
hermes-agent/
├── agent/
│   ├── config.yaml              ← Agent configuration
│   └── skills/
│       └── findocere-content-engine/   ← This entire folder
├── .env                         ← API keys (OpenRouter for MiniMax M2.7)
└── ...
```

**config.yaml structure:**
```yaml
agent:
  name: "findocere-content-agent"
  model: "minimax/m2.7"
  provider: "openrouter"
  
  system_prompt_path: "./skills/findocere-content-engine/CLAUDE.md"
  
  knowledge_base:
    - "./skills/findocere-content-engine/index.md"
    - "./skills/findocere-content-engine/voice/brand-voice.md"
    - "./skills/findocere-content-engine/voice/platform-tone.md"
    - "./skills/findocere-content-engine/platforms/x.md"
    - "./skills/findocere-content-engine/engine/hooks.md"
    - "./skills/findocere-content-engine/engine/content-types.md"
    - "./skills/findocere-content-engine/engine/ctas.md"
    - "./skills/findocere-content-engine/engine/repurpose.md"
    - "./skills/findocere-content-engine/engine/scheduling.md"
    - "./skills/findocere-content-engine/audience/defi-practitioners.md"
    - "./skills/findocere-content-engine/audience/builders.md"
    - "./skills/findocere-content-engine/audience/newcomers.md"

  tools:
    - name: "x_post"
      description: "Post to X/Twitter"
      # Configure with X API credentials
    - name: "file_read"
      description: "Read skill graph files"

  constraints:
    max_tokens: 2000
    temperature: 0.7  # Some creativity, but voice-consistent
```

**Integration with Hermes:**
```typescript
// In your Hermes agent setup (Node.js/TypeScript)
import { HermesAgent } from '@nous/hermes-agent';
import fs from 'fs';

// Load all skill graph files into context
const skillFiles = [
  'index.md',
  'voice/brand-voice.md',
  'voice/platform-tone.md',
  'platforms/x.md',
  'engine/hooks.md',
  'engine/content-types.md',
  'engine/ctas.md',
  'engine/repurpose.md',
  'engine/scheduling.md',
  'audience/defi-practitioners.md',
  'audience/builders.md',
  'audience/newcomers.md',
];

const knowledgeBase = skillFiles.map(f => ({
  name: f,
  content: fs.readFileSync(`./findocere-content-engine/${f}`, 'utf-8'),
}));

const systemPrompt = fs.readFileSync(
  './findocere-content-engine/CLAUDE.md', 'utf-8'
);

const agent = new HermesAgent({
  model: 'minimax/m2.7',  // via OpenRouter
  systemPrompt,
  knowledge: knowledgeBase,
  tools: [
    // X posting tool (optional — for fully autonomous posting)
    // File read tool (for dynamic skill graph updates)
  ],
});

// Generate content
const result = await agent.chat(
  'Generate a hack drop about checking fee/TVL ratio before entering Meteora pools'
);
```

### Method 3: Paste Context (Simplest)

1. Copy contents of CLAUDE.md into any LLM system prompt
2. Paste contents of index.md + brand-voice.md + x.md + hooks.md into conversation
3. Give it a topic
4. More files = better output (add content-types.md, ctas.md for best results)

### Method 4: Cursor / Claude Code

1. Keep the folder on your local machine
2. Point Cursor at the folder
3. Agent reads files directly from filesystem
4. Can also UPDATE files (add new hooks, refine voice rules based on performance)

## The Content Production Loop

```
┌─────────────────────────────────────────────┐
│  INPUT: Topic / idea / data / screenshot     │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│  AGENT reads index.md → follows wikilinks    │
│  Loads: voice → platform → hooks → formulas  │
│  Selects: hook + formula + CTA + audience     │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│  VOICE CHECK: Runs quality gate              │
│  - Numbers present? Hook strong?             │
│  - No links in body? No guru language?       │
│  - Under char limit? Position disclosed?     │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│  OUTPUT: Ready-to-publish post               │
│  + metadata (hook type, formula, CTA, etc.)  │
│  + self-reply text                           │
│  + image description                         │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│  HUMAN REVIEW: findo reads, adjusts,         │
│  fills [TEMPLATE] placeholders with real data │
│  → Publishes                                 │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│  FEEDBACK LOOP: Update skill graph           │
│  - Add winning hooks to hooks.md             │
│  - Refine voice rules based on performance   │
│  - Add new audience insights                 │
│  → Graph gets smarter over time              │
└─────────────────────────────────────────────┘
```

## Critical Design Constraint

**The LLM generates drafts. Findo publishes.** The agent NEVER auto-posts without human review. This mirrors the MeteorWatcher architecture constraint: the AI suggests, the human decides.

## Iteration Workflow

Weekly:
1. Review which posts performed best
2. Update hooks.md with any new hook patterns that worked
3. Refine platform-tone.md if voice drifted
4. Add new audience insights to audience/ files

Monthly:
1. Full voice audit — are posts still sounding like findo?
2. Pillar distribution check — are we hitting 50/20/15/15?
3. Hook performance review — which hooks are converting?
4. Add new content formulas if patterns emerge

## File Sizes & Token Budget

| File | ~Tokens | Priority |
|---|---|---|
| CLAUDE.md (system prompt) | ~1,500 | Always loaded |
| index.md | ~800 | Always loaded |
| voice/brand-voice.md | ~1,000 | Always loaded |
| platforms/x.md | ~900 | Always loaded |
| engine/hooks.md | ~1,200 | Always loaded |
| engine/content-types.md | ~1,100 | Load for generation |
| engine/ctas.md | ~500 | Load for generation |
| voice/platform-tone.md | ~400 | Load for generation |
| engine/repurpose.md | ~600 | Load for repurposing |
| engine/scheduling.md | ~500 | Load for calendar tasks |
| audience/*.md (3 files) | ~900 total | Load relevant segment |
| **Total** | **~9,400** | Fits in any modern LLM context |

The entire graph fits comfortably in MiniMax M2.7's context window via OpenRouter.
