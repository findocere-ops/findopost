import { useState, useEffect, useRef } from "react";

const HOOKS = [
  { id: "H1", name: "Confession", template: "I [did/believed X]. It cost me [specific consequence].", trigger: "Vulnerability + specificity → trust", best: "Single tweets, journals", example: "I held my DLMM position through a 20% SOL drop. Here's what it actually cost me." },
  { id: "H2", name: "Counterintuitive", template: "[Common belief] is wrong. Here's what actually happens.", trigger: "Pattern interruption → confusion", best: "Threads", example: "Higher APY doesn't mean higher profit. Most DLMM farmers lose money on the best-looking pools." },
  { id: "H3", name: "Timestamp", template: "[Time marker]: [unexpected observation from real data].", trigger: "Urgency + freshness → FOMO", best: "Single tweets, alpha drops", example: "Last 72 hours: stablecoin LP yields on Meteora quietly doubled. Nobody's talking about why." },
  { id: "H4", name: "Builder's Receipts", template: "[Specific result] from [specific action] in [specific timeframe].", trigger: "Proof + aspiration → credibility", best: "Single tweets w/ screenshot", example: "+6.2% in 11 days on a stablecoin pair. No leverage, no degen plays. Just bin management." },
  { id: "H5", name: "Everyone's Ignoring This", template: "Nobody is paying attention to [specific mechanic]. That's the opportunity.", trigger: "Exclusivity + implied edge", best: "Threads", example: "Nobody is watching Meteora's DAMM V2 fee structure. The edge is in the bin spacing." },
  { id: "H6", name: "Process Reveal", template: "Here's the exact [process/setup] I use for [specific outcome].", trigger: "Behind-the-scenes → dwell time", best: "Threads (step-by-step)", example: "Here's the exact checklist I run before entering any DLMM position. Takes 4 minutes." },
  { id: "H7", name: "Honest Pivot", template: "I used to believe [X]. I was wrong. Here's what changed my mind.", trigger: "Changed mind → respect", best: "Single tweets, short threads", example: "I used to think stablecoin LPs were boring. Then I ran the numbers against my directional trades." },
  { id: "H8", name: "Question-as-Hook", template: "[Provocative question that assumes suboptimal behavior]?", trigger: "Direct challenge → ego activation", best: "Single tweets, reply-max", example: "If your LP strategy can't survive a 15% drawdown, do you actually have a strategy?" },
];

const CTAS = [
  { id: "R1", type: "reply", text: "What's your actual number? Drop your real APY — not the advertised one." },
  { id: "R2", type: "reply", text: "Disagree? Tell me where the logic breaks. I want to stress-test this." },
  { id: "R3", type: "reply", text: "Be honest — have you ever held a position past your own stop-loss just because the APY looked good?" },
  { id: "R4", type: "reply", text: "What's the one DeFi mechanic you still don't fully understand? No judgment." },
  { id: "R5", type: "reply", text: "Would you take this trade with your own money right now? Yes or no — and why." },
  { id: "S1", type: "save", text: "Save this if you LP on Solana. You'll want the checklist when the next volatile week hits." },
  { id: "S2", type: "save", text: "Bookmark the thread. When you're setting up your next position, come back to step 3." },
  { id: "S3", type: "save", text: "This took me 6 months to figure out. Save yourself the tuition — save this." },
  { id: "Q1", type: "quote", text: "Builders: if your protocol's fee structure doesn't survive this scenario, tag me — I want to see the counterargument." },
  { id: "Q2", type: "quote", text: "If you're working on governance tooling and this doesn't match your model, show me what I'm missing." },
];

const FORMULAS = [
  { id: "F1", name: "Practitioner Confession", structure: "Hook (admission) → Context (numbers) → Lesson (takeaway) → CTA (shared experience)", pillar: "DeFi", engages: "Replies" },
  { id: "F2", name: "Counterintuitive Take", structure: "Bold claim → Evidence (on-chain data) → Reframe (new model) → CTA (invite disagreement)", pillar: "Any", engages: "Quote tweets" },
  { id: "F3", name: "Technical Teardown", structure: "Hook + 'how it works' → Mechanics (screenshots) → My setup → Question", pillar: "DeFi / AI", engages: "Bookmarks" },
  { id: "F4", name: "Hack Drop", structure: "Single tweet: [What to do] → [Why it works] → [What you'll see]", pillar: "Any", engages: "Bookmarks" },
  { id: "F5", name: "Builder Log", structure: "Status update → Surprise lesson → What's next → CTA for builders", pillar: "Agentic AI", engages: "Replies from builders" },
  { id: "F6", name: "Conviction Stack", structure: "Thesis → Evidence layers → Personal stake → CTA counter-thesis", pillar: "Futarchy", engages: "Quote tweets" },
  { id: "F7", name: "Benchmark Post", structure: "Raw data → Context → Honest assessment → CTA compare numbers", pillar: "DeFi", engages: "Replies" },
];

const VOICE_RULES = [
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
];

const CALENDAR = [
  { day: 1, date: "Apr 11", pillar: "D", formula: "F1", format: "JN", hook: "I took profit too early on my Meteora position last week.", anchor: false },
  { day: 2, date: "Apr 12", pillar: "A", formula: "F5", format: "ST", hook: "MeteorWatcher build update: the LLM doesn't trade. Here's why.", anchor: false },
  { day: 3, date: "Apr 13", pillar: "D", formula: "F4", format: "ST", hook: "Before entering any Meteora pool: check the 7-day fee/TVL ratio, not the APY display.", anchor: false },
  { day: 4, date: "Apr 14", pillar: "P", formula: "F2", format: "ST", hook: "Solana's real payments moat isn't speed. It's programmable settlement.", anchor: false },
  { day: 5, date: "Apr 15", pillar: "D", formula: "F7", format: "ST", hook: "+4.2% blended return across 3 LP positions this month.", anchor: false },
  { day: 6, date: "Apr 16", pillar: "F", formula: "F6", format: "TH", hook: "Futarchy will replace multisig governance. Here's my evidence stack.", anchor: false },
  { day: 7, date: "Apr 17", pillar: "D", formula: "F3", format: "TH", hook: "How DLMM bin spacing actually determines your profit — not APY.", anchor: true },
  { day: 8, date: "Apr 18", pillar: "A", formula: "F1", format: "JN", hook: "I spent 3 days debugging an agent that was making decisions it wasn't supposed to.", anchor: false },
  { day: 9, date: "Apr 19", pillar: "D", formula: "F4", format: "ST", hook: "The single setting in Solflare that saved me from a $800 approval drain.", anchor: false },
  { day: 10, date: "Apr 20", pillar: "D", formula: "F2", format: "ST", hook: "Stablecoin LPs aren't 'safe.' They just move the risk somewhere you can't see it.", anchor: false },
  { day: 11, date: "Apr 21", pillar: "D", formula: "F7", format: "TH", hook: "Weekly yield watchlist — April 21, 2026.", anchor: false },
  { day: 12, date: "Apr 22", pillar: "P", formula: "F3", format: "TH", hook: "How Solana Pay actually processes a transaction — from tap to settlement.", anchor: false },
  { day: 13, date: "Apr 23", pillar: "D", formula: "F1", format: "JN", hook: "I keep over-managing my LP positions. The data says I should stop.", anchor: false },
  { day: 14, date: "Apr 24", pillar: "A", formula: "F5", format: "ST", hook: "MeteorWatcher: its first 10 suggestions vs. what I would have done.", anchor: true },
  { day: 15, date: "Apr 25", pillar: "D", formula: "F4", format: "ST", hook: "If a pool's 24h volume is < 2x its TVL, the displayed APY is a mirage.", anchor: false },
  { day: 16, date: "Apr 26", pillar: "F", formula: "F2", format: "ST", hook: "DAOs don't fail because of voter apathy. They fail because voting is the wrong mechanism.", anchor: false },
  { day: 17, date: "Apr 27", pillar: "D", formula: "F3", format: "TH", hook: "Impermanent loss on DLMM is not the same as on Uniswap. Here's the actual math.", anchor: false },
  { day: 18, date: "Apr 28", pillar: "D", formula: "F7", format: "TH", hook: "30 days of DLMM: my full results, every position, every mistake.", anchor: true },
  { day: 19, date: "Apr 29", pillar: "A", formula: "F4", format: "ST", hook: "When building DeFi agents: cache your RPC state. Never let the LLM wait on a live call.", anchor: false },
  { day: 20, date: "Apr 30", pillar: "P", formula: "F6", format: "ST", hook: "Streaming payments will kill invoicing. Solana is the only chain fast enough.", anchor: false },
  { day: 21, date: "May 1", pillar: "D", formula: "F1", format: "JN", hook: "I almost rage-quit DeFi last month. Here's what made me stay.", anchor: false },
  { day: 22, date: "May 2", pillar: "D", formula: "F4", format: "ST", hook: "The 'travel mode' LP setup: how I farm yield without checking my phone for 2 weeks.", anchor: false },
  { day: 23, date: "May 3", pillar: "A", formula: "F3", format: "TH", hook: "Anatomy of a DeFi agent: what MeteorWatcher actually does in 6 steps.", anchor: false },
  { day: 24, date: "May 4", pillar: "F", formula: "F2", format: "TH", hook: "MetaDAO prediction markets: more accurate than DAO votes 73% of the time.", anchor: true },
  { day: 25, date: "May 5", pillar: "D", formula: "F7", format: "TH", hook: "Weekly yield watchlist — May 5, 2026.", anchor: false },
  { day: 26, date: "May 6", pillar: "D", formula: "F2", format: "ST", hook: "The best time to enter an LP position is when everyone else is exiting.", anchor: false },
  { day: 27, date: "May 7", pillar: "P", formula: "F5", format: "ST", hook: "Tested a Solana Pay integration for a merchant in Medan. Here's what broke.", anchor: false },
  { day: 28, date: "May 8", pillar: "D", formula: "F1", format: "JN", hook: "I've been farming DeFi for over a year. My compounded return is lower than you'd think.", anchor: false },
  { day: 29, date: "May 9", pillar: "A", formula: "F4", format: "ST", hook: "If your DeFi agent can execute trades without human confirmation, you have a liability.", anchor: false },
  { day: 30, date: "May 10", pillar: "D", formula: "F3", format: "TH", hook: "Everything I know about surviving as a small Solana LP farmer — a thread.", anchor: true },
];

const PILLAR_COLORS = { D: "#14F195", P: "#9945FF", A: "#FF6B35", F: "#00D4AA" };
const PILLAR_NAMES = { D: "DeFi", P: "Payments", A: "Agentic AI", F: "Futarchy" };
const FORMAT_LABELS = { ST: "Single Tweet", TH: "Thread", JN: "Journal" };

function checkVoice(text) {
  const issues = [];
  const urlRegex = /https?:\/\/[^\s]+/g;
  if (urlRegex.test(text)) issues.push({ rule: "No external links in post body", severity: "high" });
  const hashCount = (text.match(/#\w+/g) || []).length;
  if (hashCount > 1) issues.push({ rule: `${hashCount} hashtags found — max 1`, severity: "high" });
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2702}-\u{27B0}]/gu;
  const emojiCount = (text.match(emojiRegex) || []).length;
  if (emojiCount > 1) issues.push({ rule: `${emojiCount} emoji — max 1, functional only`, severity: "medium" });
  if (!text.match(/\?[^"]*$/m)) issues.push({ rule: "No question found — end with an opinion-forcing question", severity: "medium" });
  const guruPhrases = ["as an expert", "let me teach", "i'll show you the secret", "trust me on this", "i know better"];
  for (const p of guruPhrases) { if (text.toLowerCase().includes(p)) issues.push({ rule: `Guru language detected: "${p}"`, severity: "high" }); }
  if (text.length > 0 && !text.match(/\d/)) issues.push({ rule: "No numbers found — lead with data", severity: "low" });
  const lines = text.split("\n").filter(l => l.trim());
  const longLines = lines.filter(l => l.length > 180);
  if (longLines.length > 0) issues.push({ rule: "Long lines detected — break into shorter sentences", severity: "low" });
  return issues;
}

function TweetCounter({ text }) {
  const count = text.length;
  const max = 280;
  const pct = Math.min((count / max) * 100, 100);
  const color = count > max ? "#FF4444" : count > 250 ? "#FFB800" : "var(--accent)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
      <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.2s" }} />
      </div>
      <span style={{ fontSize: 12, fontFamily: "var(--mono)", color, minWidth: 50, textAlign: "right" }}>{count}/{max}</span>
    </div>
  );
}

function VoiceCheck({ issues }) {
  if (issues.length === 0) return <div style={{ padding: "10px 14px", background: "rgba(20,241,149,0.08)", borderLeft: "3px solid #14F195", borderRadius: 4, fontSize: 13, color: "#14F195", marginTop: 10 }}>Voice check passed</div>;
  return (
    <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
      {issues.map((iss, i) => (
        <div key={i} style={{ padding: "8px 12px", background: iss.severity === "high" ? "rgba(255,68,68,0.08)" : iss.severity === "medium" ? "rgba(255,184,0,0.08)" : "rgba(255,255,255,0.04)", borderLeft: `3px solid ${iss.severity === "high" ? "#FF4444" : iss.severity === "medium" ? "#FFB800" : "rgba(255,255,255,0.2)"}`, borderRadius: 4, fontSize: 12, color: "var(--text-secondary)" }}>
          {iss.severity === "high" ? "🔴" : iss.severity === "medium" ? "🟡" : "⚪"} {iss.rule}
        </div>
      ))}
    </div>
  );
}

export default function FindocereEditor() {
  const [tab, setTab] = useState("compose");
  const [draft, setDraft] = useState("");
  const [threadTweets, setThreadTweets] = useState([""]);
  const [isThread, setIsThread] = useState(false);
  const [selectedHook, setSelectedHook] = useState(null);
  const [selectedCTA, setSelectedCTA] = useState(null);
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [calendarDay, setCalendarDay] = useState(null);
  const [voiceDetailOpen, setVoiceDetailOpen] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const textareaRef = useRef(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const insertAtCursor = (text) => {
    if (isThread) {
      const updated = [...threadTweets];
      updated[updated.length - 1] = updated[updated.length - 1] + (updated[updated.length - 1] ? "\n\n" : "") + text;
      setThreadTweets(updated);
    } else {
      setDraft(prev => prev + (prev ? "\n\n" : "") + text);
    }
  };

  const currentText = isThread ? threadTweets.join("\n\n---\n\n") : draft;
  const issues = checkVoice(currentText);

  const tabs = [
    { id: "compose", label: "Compose" },
    { id: "hooks", label: "Hooks" },
    { id: "ctas", label: "CTAs" },
    { id: "formulas", label: "Formulas" },
    { id: "voice", label: "Voice Rules" },
    { id: "calendar", label: "Calendar" },
  ];

  return (
    <div style={{
      "--bg": "#0A0A0F", "--surface": "#12121A", "--surface2": "#1A1A25", "--border": "rgba(255,255,255,0.06)",
      "--text": "#E8E6E3", "--text-secondary": "#8A8A9A", "--accent": "#14F195", "--accent2": "#9945FF",
      "--mono": "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      "--sans": "'DM Sans', 'Satoshi', system-ui, sans-serif",
      fontFamily: "var(--sans)", color: "var(--text)", background: "var(--bg)",
      minHeight: "100vh", padding: 0, margin: 0,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <div style={{ padding: "20px 24px 0", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #14F195, #9945FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>f</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em" }}>@findocere editor</div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--mono)" }}>one SOL and million dreams</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {issues.length > 0 && tab === "compose" && (
              <div style={{ padding: "4px 10px", background: "rgba(255,68,68,0.1)", borderRadius: 12, fontSize: 11, color: "#FF6B6B", fontFamily: "var(--mono)" }}>
                {issues.length} issue{issues.length > 1 ? "s" : ""}
              </div>
            )}
            {tab === "compose" && currentText.length > 0 && issues.length === 0 && (
              <div style={{ padding: "4px 10px", background: "rgba(20,241,149,0.1)", borderRadius: 12, fontSize: 11, color: "#14F195", fontFamily: "var(--mono)" }}>
                clean
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "10px 16px", fontSize: 12, fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? "var(--accent)" : "var(--text-secondary)",
              background: "none", border: "none", cursor: "pointer",
              borderBottom: tab === t.id ? "2px solid var(--accent)" : "2px solid transparent",
              fontFamily: "var(--sans)", whiteSpace: "nowrap", transition: "all 0.15s",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 24px", maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>

        {/* COMPOSE TAB */}
        {tab === "compose" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => { setIsThread(false); }} style={{
                padding: "6px 14px", fontSize: 12, borderRadius: 6, border: "1px solid var(--border)",
                background: !isThread ? "var(--accent)" : "var(--surface)", color: !isThread ? "#000" : "var(--text-secondary)",
                cursor: "pointer", fontWeight: 500, fontFamily: "var(--sans)",
              }}>Single Tweet</button>
              <button onClick={() => { setIsThread(true); if (threadTweets.length === 0) setThreadTweets([""]); }} style={{
                padding: "6px 14px", fontSize: 12, borderRadius: 6, border: "1px solid var(--border)",
                background: isThread ? "var(--accent)" : "var(--surface)", color: isThread ? "#000" : "var(--text-secondary)",
                cursor: "pointer", fontWeight: 500, fontFamily: "var(--sans)",
              }}>Thread</button>
            </div>

            {!isThread ? (
              <div>
                <textarea ref={textareaRef} value={draft} onChange={e => setDraft(e.target.value)} placeholder="Write your post... (voice rules checked live)" style={{
                  width: "100%", minHeight: 160, padding: 14, background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: 8, color: "var(--text)", fontSize: 14, fontFamily: "var(--sans)", resize: "vertical",
                  lineHeight: 1.6, outline: "none", boxSizing: "border-box",
                }} />
                <TweetCounter text={draft} />
                <VoiceCheck issues={checkVoice(draft)} />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {threadTweets.map((tw, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: -8, top: 14, width: 16, height: 16, borderRadius: "50%", background: "var(--surface2)", border: "2px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--mono)", zIndex: 1 }}>{i + 1}</div>
                    <textarea value={tw} onChange={e => { const u = [...threadTweets]; u[i] = e.target.value; setThreadTweets(u); }} placeholder={i === 0 ? "Hook tweet..." : `Tweet ${i + 1}...`} style={{
                      width: "100%", minHeight: 80, padding: "12px 14px 12px 20px", background: "var(--surface)", border: "1px solid var(--border)",
                      borderRadius: 8, color: "var(--text)", fontSize: 13, fontFamily: "var(--sans)", resize: "vertical",
                      lineHeight: 1.6, outline: "none", boxSizing: "border-box",
                    }} />
                    <TweetCounter text={tw} />
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setThreadTweets([...threadTweets, ""])} style={{ padding: "8px 16px", fontSize: 12, background: "var(--surface2)", color: "var(--accent)", border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer", fontFamily: "var(--sans)" }}>+ Add tweet</button>
                  {threadTweets.length > 1 && <button onClick={() => setThreadTweets(threadTweets.slice(0, -1))} style={{ padding: "8px 16px", fontSize: 12, background: "var(--surface2)", color: "#FF6B6B", border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer", fontFamily: "var(--sans)" }}>Remove last</button>}
                </div>
                <VoiceCheck issues={checkVoice(threadTweets.join(" "))} />
              </div>
            )}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => copyToClipboard(isThread ? threadTweets.map((t, i) => `${i + 1}/${threadTweets.length}\n${t}`).join("\n\n") : draft, "main")} style={{
                padding: "10px 20px", fontSize: 13, fontWeight: 600, background: "var(--accent)", color: "#000",
                border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "var(--sans)",
              }}>{copiedId === "main" ? "Copied!" : "Copy to clipboard"}</button>
              <button onClick={() => { if (isThread) setThreadTweets([""]); else setDraft(""); }} style={{
                padding: "10px 20px", fontSize: 13, background: "var(--surface2)", color: "var(--text-secondary)",
                border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", fontFamily: "var(--sans)",
              }}>Clear</button>
            </div>

            {/* Quick insert */}
            <div style={{ padding: 14, background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 10, fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick insert closing</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button onClick={() => insertAtCursor("DYOR, NFA.")} style={{ padding: "5px 10px", fontSize: 11, background: "var(--surface2)", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", fontFamily: "var(--mono)" }}>DYOR, NFA.</button>
                <button onClick={() => insertAtCursor("(Disclosing: I have a position. This is not a recommendation.)")} style={{ padding: "5px 10px", fontSize: 11, background: "var(--surface2)", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", fontFamily: "var(--mono)" }}>Position disclosure</button>
                <button onClick={() => insertAtCursor("👇")} style={{ padding: "5px 10px", fontSize: 11, background: "var(--surface2)", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", fontFamily: "var(--mono)" }}>👇</button>
                <button onClick={() => insertAtCursor("🧵")} style={{ padding: "5px 10px", fontSize: 11, background: "var(--surface2)", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", fontFamily: "var(--mono)" }}>🧵</button>
              </div>
            </div>
          </div>
        )}

        {/* HOOKS TAB */}
        {tab === "hooks" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--mono)", marginBottom: 4 }}>TAP A HOOK TO EXPAND · TAP "USE" TO INSERT INTO COMPOSER</div>
            {HOOKS.map(h => (
              <div key={h.id} onClick={() => setSelectedHook(selectedHook === h.id ? null : h.id)} style={{
                padding: 14, background: "var(--surface)", border: `1px solid ${selectedHook === h.id ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 8, cursor: "pointer", transition: "border-color 0.15s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: selectedHook === h.id ? 10 : 0 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>{h.id}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{h.name}</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--mono)" }}>{h.best}</span>
                </div>
                {selectedHook === h.id && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}><strong style={{ color: "var(--text)" }}>Trigger:</strong> {h.trigger}</div>
                    <div style={{ padding: 10, background: "var(--surface2)", borderRadius: 6, fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-secondary)" }}>{h.template}</div>
                    <div style={{ padding: 10, background: "rgba(20,241,149,0.04)", borderLeft: "3px solid var(--accent)", borderRadius: 4, fontSize: 13, lineHeight: 1.5 }}>{h.example}</div>
                    <button onClick={(e) => { e.stopPropagation(); insertAtCursor(h.example); setTab("compose"); }} style={{
                      alignSelf: "flex-start", padding: "6px 14px", fontSize: 12, background: "var(--accent)", color: "#000",
                      border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontFamily: "var(--sans)",
                    }}>Use this hook →</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTAs TAB */}
        {tab === "ctas" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {["reply", "save", "quote"].map(type => (
              <div key={type}>
                <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: type === "reply" ? "#FF6B35" : type === "save" ? "#9945FF" : "#00D4AA", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                  {type === "reply" ? "Reply-bait" : type === "save" ? "Save-bait" : "Quote-tweet-bait"}
                </div>
                {CTAS.filter(c => c.type === type).map(c => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, marginBottom: 6 }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-secondary)", minWidth: 24 }}>{c.id}</span>
                    <span style={{ fontSize: 13, flex: 1, lineHeight: 1.4 }}>{c.text}</span>
                    <button onClick={() => { insertAtCursor(c.text); setTab("compose"); }} style={{
                      padding: "4px 10px", fontSize: 11, background: "var(--surface2)", color: "var(--accent)",
                      border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", fontFamily: "var(--mono)", whiteSpace: "nowrap",
                    }}>Use</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* FORMULAS TAB */}
        {tab === "formulas" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--mono)", marginBottom: 4 }}>7 CONTENT FORMULAS · TAP TO EXPAND STRUCTURE</div>
            {FORMULAS.map(f => (
              <div key={f.id} onClick={() => setSelectedFormula(selectedFormula === f.id ? null : f.id)} style={{
                padding: 14, background: "var(--surface)", border: `1px solid ${selectedFormula === f.id ? "var(--accent2)" : "var(--border)"}`,
                borderRadius: 8, cursor: "pointer", transition: "border-color 0.15s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent2)", fontWeight: 600 }}>{f.id}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{f.name}</span>
                  <span style={{ marginLeft: "auto", padding: "2px 8px", fontSize: 10, borderRadius: 4, background: `${PILLAR_COLORS[f.pillar === "Any" ? "D" : f.pillar[0]]}15`, color: PILLAR_COLORS[f.pillar === "Any" ? "D" : f.pillar[0]], fontFamily: "var(--mono)" }}>{f.pillar}</span>
                </div>
                {selectedFormula === f.id && (
                  <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ padding: 10, background: "var(--surface2)", borderRadius: 6, fontSize: 13, lineHeight: 1.6, color: "var(--text-secondary)" }}>
                      <strong style={{ color: "var(--text)" }}>Structure:</strong> {f.structure}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                      <strong style={{ color: "var(--text)" }}>Primary engagement:</strong> {f.engages}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* VOICE RULES TAB */}
        {tab === "voice" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--mono)", marginBottom: 4 }}>10 VOICE RULES · TAP TO SEE DO/DON'T</div>
            {VOICE_RULES.map((v, i) => (
              <div key={i} onClick={() => setVoiceDetailOpen(voiceDetailOpen === i ? null : i)} style={{
                padding: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)", fontWeight: 600, minWidth: 20 }}>{i + 1}</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{v.rule}</span>
                </div>
                {voiceDetailOpen === i && (
                  <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ padding: 10, background: "rgba(255,68,68,0.05)", borderLeft: "3px solid #FF4444", borderRadius: 4, fontSize: 12, color: "var(--text-secondary)" }}>
                      <span style={{ color: "#FF6B6B", fontWeight: 600, fontFamily: "var(--mono)", fontSize: 10 }}>DON'T</span><br />{v.bad}
                    </div>
                    <div style={{ padding: 10, background: "rgba(20,241,149,0.05)", borderLeft: "3px solid #14F195", borderRadius: 4, fontSize: 12, color: "var(--text-secondary)" }}>
                      <span style={{ color: "#14F195", fontWeight: 600, fontFamily: "var(--mono)", fontSize: 10 }}>DO</span><br />{v.good}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CALENDAR TAB */}
        {tab === "calendar" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
              {Object.entries(PILLAR_NAMES).map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: PILLAR_COLORS[k] }} />
                  <span style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--mono)" }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "#FFB800" }}>★</span>
                <span style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--mono)" }}>Anchor</span>
              </div>
            </div>
            {CALENDAR.map(c => (
              <div key={c.day} onClick={() => setCalendarDay(calendarDay === c.day ? null : c.day)} style={{
                padding: "10px 12px", background: "var(--surface)",
                border: `1px solid ${calendarDay === c.day ? PILLAR_COLORS[c.pillar] : "var(--border)"}`,
                borderRadius: 6, cursor: "pointer", transition: "border-color 0.15s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-secondary)", minWidth: 18 }}>{c.day}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-secondary)", minWidth: 42 }}>{c.date}</span>
                  <div style={{ width: 6, height: 6, borderRadius: 1, background: PILLAR_COLORS[c.pillar], flexShrink: 0 }} />
                  <span style={{ fontSize: 12, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: calendarDay === c.day ? "normal" : "nowrap", lineHeight: 1.4 }}>
                    {c.hook}
                  </span>
                  {c.anchor && <span style={{ color: "#FFB800", fontSize: 12 }}>★</span>}
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-secondary)", padding: "2px 6px", background: "var(--surface2)", borderRadius: 3 }}>{c.format}</span>
                </div>
                {calendarDay === c.day && (
                  <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ padding: "3px 8px", fontSize: 10, borderRadius: 4, background: `${PILLAR_COLORS[c.pillar]}15`, color: PILLAR_COLORS[c.pillar], fontFamily: "var(--mono)" }}>{PILLAR_NAMES[c.pillar]}</span>
                    <span style={{ padding: "3px 8px", fontSize: 10, borderRadius: 4, background: "rgba(153,69,255,0.1)", color: "#9945FF", fontFamily: "var(--mono)" }}>{c.formula} — {FORMULAS.find(f => f.id === c.formula)?.name}</span>
                    <span style={{ padding: "3px 8px", fontSize: 10, borderRadius: 4, background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", fontFamily: "var(--mono)" }}>{FORMAT_LABELS[c.format]}</span>
                    <button onClick={(e) => { e.stopPropagation(); insertAtCursor(c.hook); setTab("compose"); setIsThread(c.format === "TH"); if (c.format === "TH") setThreadTweets([c.hook]); else setDraft(c.hook); }} style={{
                      marginLeft: "auto", padding: "4px 12px", fontSize: 11, background: "var(--accent)", color: "#000",
                      border: "none", borderRadius: 5, cursor: "pointer", fontWeight: 600, fontFamily: "var(--sans)",
                    }}>Start this post →</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
