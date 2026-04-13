"use client";

import { useState } from "react";
import { GenerationResult, GenerationMode } from "../../lib/types";
import EvalPanel from "../evaluation/EvalPanel";
import TweetPreview from "../shared/TweetPreview";

interface OutputPanelProps {
  result: GenerationResult;
  mode: GenerationMode;
}

export default function OutputPanel({ result, mode }: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'eval' | 'alternatives'>('preview');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Strategy Ribbon */}
      <div className="flex flex-wrap items-center gap-3 w-full bg-surface/50 border border-border p-3 rounded-xl shadow-inner">
        <div className="bg-[#14F195]/10 text-[#14F195] border border-[#14F195]/20 px-3 py-1 rounded-md text-xs font-mono font-medium">
          {result.formulaUsed || 'Custom Formula'}
        </div>
        {result.selectedHook && (
           <div className="bg-[#9945FF]/10 text-[#9945FF] border border-[#9945FF]/20 px-3 py-1 rounded-md text-xs font-mono font-medium truncate max-w-[200px]">
             {result.selectedHook.id} Hook
           </div>
        )}
        <div className="bg-surface-hover text-text-muted px-3 py-1 rounded-md text-xs font-mono">
          Angle: <span className="text-text-main">{result.angle}</span>
        </div>
      </div>

      {/* Rationale Callout */}
      {result.rationale && (
        <div className="px-4 py-3 bg-surface border-l-2 border-l-primary rounded-r-lg">
          <p className="text-sm text-text-muted italic">"{result.rationale}"</p>
        </div>
      )}

      {/* View Tabs */}
      <div className="flex items-center gap-2 border-b border-border mt-2">
        {(['preview', 'eval', 'alternatives'] as const).map(tab => {
          if (tab === 'alternatives' && (!result.alternatives || result.alternatives.length === 0)) return null;
          
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm transition-all border-b-2 ${
                activeTab === tab 
                  ? 'border-primary text-text-main' 
                  : 'border-transparent text-text-muted hover:text-text-main'
              }`}
            >
              {tab === 'preview' ? 'Final Draft ✨' : 
               tab === 'eval' ? `Voice Check ${result.evaluationScores?.issues.length > 0 ? '⚠️' : '✅'}` : 
               'Alternatives 🔄'}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 w-full flex flex-col gap-4">
        {activeTab === 'preview' && (
          <div className="flex flex-col gap-4 relative">
            <TweetPreview 
              text={result.finalPost} 
              isThread={mode === 'thread'} 
            />
            
            <div className="flex justify-end gap-3 w-full">
              <button 
                onClick={() => copyToClipboard(result.finalPost, 'main')}
                className="btn-primary w-full shadow-lg shadow-primary/20 flex justify-center items-center gap-2"
              >
                {copiedId === 'main' ? <span>✅ Copied!</span> : <span>📋 Copy to X</span>}
              </button>
            </div>
            
            {result.replySuggestion && (
               <div className="mt-4 p-4 rounded-xl border border-border bg-surface relative group">
                 <div className="absolute -top-3 left-4 bg-bg px-2 text-[10px] uppercase font-mono text-text-muted tracking-wider">
                   Suggested 1st Reply
                 </div>
                 <p className="text-sm whitespace-pre-wrap font-sans leading-relaxed">{result.replySuggestion}</p>
                 <button 
                  onClick={() => copyToClipboard(result.replySuggestion!, 'reply')}
                  className="absolute bottom-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-hover rounded text-xs hover:text-primary"
                 >
                   Copy
                 </button>
               </div>
            )}
          </div>
        )}

        {activeTab === 'eval' && result.evaluationScores && (
          <EvalPanel scores={result.evaluationScores} warnings={result.warnings || []} />
        )}

        {activeTab === 'alternatives' && result.alternatives && (
          <div className="flex flex-col gap-6">
            {result.alternatives.map((alt, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                 <div className="flex items-center justify-between">
                   <h4 className="text-xs font-mono text-text-muted uppercase tracking-wider">Alternative {(idx + 1).toString().padStart(2, '0')}</h4>
                   <button 
                    onClick={() => copyToClipboard(alt, `alt-${idx}`)}
                    className="text-xs hover:text-primary"
                   >
                     {copiedId === `alt-${idx}` ? 'Copied' : 'Copy'}
                   </button>
                 </div>
                 <div className="p-4 bg-surface rounded-xl border border-border whitespace-pre-wrap font-sans text-sm leading-relaxed">
                   {alt}
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
