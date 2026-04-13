"use client";

import { GenerationMode, Pillar } from "../../lib/types";

interface SidebarProps {
  currentMode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
  currentPillar: Pillar;
  onPillarChange: (pillar: Pillar) => void;
  onSettingsClick: () => void;
}

export default function Sidebar({ currentMode, onModeChange, currentPillar, onPillarChange, onSettingsClick }: SidebarProps) {
  const modes: { id: GenerationMode; label: string; icon: string }[] = [
    { id: 'single_post', label: 'Single Post', icon: '📝' },
    { id: 'thread', label: 'Thread Gen', icon: '🧵' },
    { id: 'rewrite', label: 'Draft Rewrite', icon: '✨' },
    { id: 'hooks_only', label: 'Hook Explorer', icon: '🎣' },
    { id: 'angle_explorer', label: 'Angle Explorer', icon: '🧭' },
    { id: 'evaluator', label: 'Voice Evaluator', icon: '⚖️' },
  ];

  const pillars: { id: Pillar; label: string; color: string }[] = [
    { id: 'defi', label: 'DeFi', color: 'bg-[#14F195]' },
    { id: 'payments', label: 'Payments', color: 'bg-[#9945FF]' },
    { id: 'agentic_ai', label: 'Agentic AI', color: 'bg-[#FF6B35]' },
    { id: 'futarchy', label: 'Futarchy', color: 'bg-[#00D4AA]' },
    { id: 'any', label: 'Any/General', color: 'bg-gray-500' },
  ];

  return (
    <aside className="w-64 border-r border-border bg-[#0A0A0F] h-screen flex flex-col pt-6">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#14F195] to-[#9945FF] flex items-center justify-center font-bold text-black text-lg">
          f
        </div>
        <div>
          <h1 className="font-bold text-text-main tracking-tight">FindoPost</h1>
          <p className="text-xs text-text-muted font-mono">one SOL and millions...</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-8">
        <div>
          <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest px-2 mb-3">Modes</h2>
          <div className="flex flex-col gap-1">
            {modes.map(mode => (
              <button
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  currentMode === mode.id 
                    ? 'bg-surface-hover text-primary font-medium' 
                    : 'text-text-muted hover:text-text-main hover:bg-surface'
                }`}
              >
                <span>{mode.icon}</span>
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest px-2 mb-3">Context Pillar</h2>
          <div className="flex flex-col gap-1">
            {pillars.map(pillar => (
              <button
                key={pillar.id}
                onClick={() => onPillarChange(pillar.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  currentPillar === pillar.id 
                    ? 'bg-surface-hover text-text-main' 
                    : 'text-text-muted hover:text-text-main hover:bg-surface'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${pillar.color} ${currentPillar !== pillar.id && 'opacity-50'}`} />
                {pillar.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <button 
          onClick={onSettingsClick}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text-main hover:bg-surface transition-all"
        >
          <span>⚙️</span> Settings
        </button>
      </div>
    </aside>
  );
}
