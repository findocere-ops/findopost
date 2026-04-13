"use client";

import { useState } from "react";
import { GenerationMode, Pillar, GenerationRequest } from "../../lib/types";

interface ComposerProps {
  mode: GenerationMode;
  pillar: Pillar;
  onGenerate: (req: GenerationRequest) => void;
  isGenerating: boolean;
}

export default function Composer({ mode, pillar, onGenerate, isGenerating }: ComposerProps) {
  const [topic, setTopic] = useState("");
  const [rawNotes, setRawNotes] = useState("");
  const [formulaId, setFormulaId] = useState("auto");
  const [hookId, setHookId] = useState("auto");
  
  const handleGenerate = () => {
    onGenerate({
      mode,
      pillar,
      topic,
      rawNotes,
      formulaId: formulaId === 'auto' ? undefined : formulaId,
      hookId: hookId === 'auto' ? undefined : hookId,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Primary Input */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-text-muted uppercase tracking-wider pl-1">
          Topic / Core Idea
        </label>
        <input 
          type="text" 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Why stablecoin IL is worse than finding a new pair..."
          className="input-field placeholder:text-surface-hover"
        />
      </div>

      {/* Raw Notes Input */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-text-muted uppercase tracking-wider pl-1 flex justify-between">
          <span>Raw Notes / Data</span>
          <span className="text-primary cursor-pointer hover:underline">Paste Screenshot Data</span>
        </label>
        <textarea 
          value={rawNotes}
          onChange={(e) => setRawNotes(e.target.value)}
          placeholder="Paste your messy notes, metrics, or raw observations here..."
          className="input-field min-h-[160px] resize-y font-mono text-sm placeholder:font-sans placeholder:text-surface-hover"
        />
      </div>

      {/* Generation Settings */}
      <div className="glass-panel p-5 mt-2 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-semibold text-sm">Strategic Framing</h3>
          <span className="text-xs text-text-muted font-mono">OPTIONAL</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-text-muted">Formula Bias</label>
            <select 
              value={formulaId} 
              onChange={(e) => setFormulaId(e.target.value)}
              className="bg-[#0A0A0F] border border-border rounded p-2 text-sm text-text-main focus:outline-none focus:border-primary"
            >
              <option value="auto">🤖 Auto-select best</option>
              <option value="F1">F1 — Practitioner Confession</option>
              <option value="F2">F2 — Counterintuitive Take</option>
              <option value="F3">F3 — Technical Teardown</option>
              <option value="F4">F4 — Hack Drop</option>
              <option value="F5">F5 — Builder Log</option>
              <option value="F6">F6 — Conviction Stack</option>
              <option value="F7">F7 — Benchmark Post</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs text-text-muted">Hook Category</label>
            <select 
              value={hookId} 
              onChange={(e) => setHookId(e.target.value)}
              className="bg-[#0A0A0F] border border-border rounded p-2 text-sm text-text-main focus:outline-none focus:border-primary"
            >
              <option value="auto">🤖 Auto-select best</option>
              <option value="H1">H1 — Confession</option>
              <option value="H2">H2 — Counterintuitive</option>
              <option value="H3">H3 — Timestamp</option>
              <option value="H4">H4 — Builder's Receipts</option>
              <option value="H5">H5 — Everyone's Ignoring This</option>
              <option value="H6">H6 — Process Reveal</option>
              <option value="H7">H7 — Honest Pivot</option>
              <option value="H8">H8 — Question</option>
            </select>
          </div>
        </div>
      </div>

      <button 
        onClick={handleGenerate}
        disabled={isGenerating || (!topic && !rawNotes)}
        className={`mt-4 py-3.5 rounded-lg flex items-center justify-center gap-2 font-bold transition-all shadow-lg shadow-primary/20 ${
          isGenerating || (!topic && !rawNotes)
            ? 'bg-surface-hover text-text-muted cursor-not-allowed shadow-none' 
            : 'bg-primary text-black hover:brightness-110 active:scale-[0.98]'
        }`}
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            Drafting...
          </>
        ) : (
          <>
            <span>✨</span> Generate {mode === 'thread' ? 'Thread' : 'Draft'}
          </>
        )}
      </button>

    </div>
  );
}
