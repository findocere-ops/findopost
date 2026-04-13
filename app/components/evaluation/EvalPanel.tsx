"use client";

import { EvaluationScores } from "../../lib/types";

interface EvalPanelProps {
  scores: EvaluationScores;
  warnings?: string[];
}

export default function EvalPanel({ scores, warnings = [] }: EvalPanelProps) {
  
  const metrics = [
    { label: "Voice Fit", score: scores.voiceFit, desc: "@findocere alignment", reverse: false },
    { label: "Specificity", score: scores.specificity, desc: "Data & numbers", reverse: false },
    { label: "Hype Risk", score: scores.hypeRisk, desc: "Lower is better", reverse: true },
    { label: "Overclaim", score: scores.overclaimRisk, desc: "Lower is better", reverse: true },
    { label: "Readability", score: scores.readability, desc: "Format & pacing", reverse: false },
    { label: "Ending", score: scores.endingStrength, desc: "Question strength", reverse: false },
  ];

  const getColor = (score: number, reverse: boolean) => {
    // If reverse, high score is bad (red)
    if (reverse) {
      if (score < 20) return "text-[#14F195]";
      if (score < 60) return "text-[#FFB800]";
      return "text-[#FF4444]";
    }
    // High score is good (green)
    if (score > 80) return "text-[#14F195]";
    if (score > 50) return "text-[#FFB800]";
    return "text-[#FF4444]";
  };

  const getBarColor = (score: number, reverse: boolean) => {
    if (reverse) {
      if (score < 20) return "bg-[#14F195]";
      if (score < 60) return "bg-[#FFB800]";
      return "bg-[#FF4444]";
    }
    if (score > 80) return "bg-[#14F195]";
    if (score > 50) return "bg-[#FFB800]";
    return "bg-[#FF4444]";
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Issues Panel */}
      {scores.issues && scores.issues.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">Detected Issues</h3>
          {scores.issues.map((iss, i) => (
             <div 
               key={i} 
               className={`p-3 rounded-lg flex items-start gap-3 border ${
                 iss.severity === 'high' ? 'bg-danger/10 border-danger/20 text-danger' :
                 iss.severity === 'medium' ? 'bg-warning/10 border-warning/20 text-warning' :
                 'bg-surface border-border text-text-main'
               }`}
             >
                <div className="mt-0.5">
                  {iss.severity === 'high' ? '🔴' : iss.severity === 'medium' ? '🟡' : '⚪'}
                </div>
                <div className="text-sm">
                  {iss.rule}
                </div>
             </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-[#14F195]/10 border border-[#14F195]/20 rounded-lg flex items-center gap-3">
           <span className="text-xl">✅</span>
           <div>
              <p className="text-[#14F195] font-semibold text-sm">Perfect Voice Check</p>
              <p className="text-xs text-[#14F195]/80">No heuristic violations detected.</p>
           </div>
        </div>
      )}

      {/* AI Warnings */}
      {warnings.length > 0 && (
         <div className="flex flex-col gap-2">
           <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">AI Evaluator Notes</h3>
           {warnings.map((warn, i) => (
              <div key={i} className="px-4 py-3 bg-surface border-l-2 border-l-[#9945FF] rounded-r-lg text-sm text-text-muted">
                {warn}
              </div>
           ))}
         </div>
      )}

      {/* Scorecards */}
      <div>
        <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-4">Metric Scan</h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {metrics.map((m, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-end">
                <div>
                  <div className="font-medium text-sm text-text-main">{m.label}</div>
                  <div className="text-[10px] text-text-muted">{m.desc}</div>
                </div>
                <div className={`font-mono text-xs font-bold ${getColor(m.score, m.reverse)}`}>
                  {m.score}/100
                </div>
              </div>
              <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                 <div 
                   className={`h-full rounded-full transition-all duration-500 delay-100 ${getBarColor(m.score, m.reverse)}`}
                   style={{ width: `${Math.max(5, m.score)}%` }}
                 />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
