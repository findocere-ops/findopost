"use client";

import { useState } from "react";
import { GenerationMode, Pillar, GenerationRequest, GenerationResult } from "./lib/types";
import Sidebar from "./components/layout/Sidebar";
import Composer from "./components/composer/Composer";
import OutputPanel from "./components/output/OutputPanel";
import SettingsModal from "./components/settings/SettingsModal";
import { generateContent } from "./lib/services/generation";

export default function Home() {
  const [mode, setMode] = useState<GenerationMode>('single_post');
  const [pillar, setPillar] = useState<Pillar>('defi');
  
  const [generatedResult, setGeneratedResult] = useState<GenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleGenerate = async (request: GenerationRequest) => {
    setIsGenerating(true);
    try {
        const result = await generateContent(request);
        setGeneratedResult(result);
    } catch (err: any) {
        console.error("Failed to generate content:", err);
        setGeneratedResult({
            angle: "Error",
            finalPost: "Failed to generate content. Please check the logs.",
            rationale: err.message,
            evaluationScores: {
                brandFit: 0, endingStrength: 0, hypeRisk: 100, isUnderLimit: false, 
                overclaimRisk: 100, readability: 0, specificity: 0, voiceFit: 0, 
                issues: [{rule: 'Generation Error', rulePassed: false, severity: 'high'}],
                characterCount: 0
            }
        });
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar 
        currentMode={mode} 
        onModeChange={setMode} 
        currentPillar={pillar} 
        onPillarChange={setPillar} 
        onSettingsClick={() => setSettingsOpen(true)}
      />
      
      <main className="flex-1 flex overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-secondary z-50"></div>
        
        {/* Left Pane - Input & Settings */}
        <section className="w-1/2 min-w-[500px] border-r border-border flex flex-col h-full bg-surface/30">
          <header className="px-6 py-5 border-b border-border bg-bg/80 backdrop-blur top-0 z-10 sticky">
            <h2 className="text-lg font-semibold tracking-tight">
              {mode === 'single_post' ? 'Single Post Composer' : 
               mode === 'thread' ? 'Thread Generator' : 
               mode === 'rewrite' ? 'Draft Rewriter' :
               mode === 'hooks_only' ? 'Hook Explorer' :
               mode === 'angle_explorer' ? 'Angle Explorer' : 'Voice Evaluator'}
            </h2>
            <p className="text-sm text-text-muted mt-1 font-mono">
              Pillar: <span className="text-primary">{pillar.toUpperCase()}</span>
            </p>
          </header>
          
          <div className="flex-1 overflow-y-auto w-full p-6">
            <Composer 
              mode={mode} 
              pillar={pillar} 
              onGenerate={handleGenerate} 
              isGenerating={isGenerating} 
            />
          </div>
        </section>
        
        {/* Right Pane - Output & Evaluation */}
        <section className="w-1/2 min-w-[500px] flex flex-col h-full bg-[#0A0A0F]">
           <header className="px-6 py-5 border-b border-border bg-bg/80 backdrop-blur top-0 z-10 sticky flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Output & Analysis</h2>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ display: isGenerating ? 'block' : 'none' }}></span>
               <span className="text-xs font-mono text-text-muted">{isGenerating ? 'GENERATING...' : 'IDLE'}</span>
            </div>
          </header>
          
          <div className="flex-1 overflow-y-auto w-full p-6" style={{ background: 'radial-gradient(circle at 100% 0%, rgba(20,241,149,0.03) 0%, transparent 40%)' }}>
            {generatedResult ? (
               <OutputPanel result={generatedResult} mode={mode} />
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50">
                 <div className="text-4xl mb-4">✍️</div>
                 <p className="font-mono text-sm leading-relaxed text-center max-w-sm">
                   Awaiting generation...<br/><br/>
                   Configure your post parameters on the left and hit generate to see the results.
                 </p>
               </div>
            )}
          </div>
        </section>
      </main>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
