"use client";

import { useState, useEffect } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("https://api.openai.com/v1");
  const [model, setModel] = useState("gpt-4o");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(localStorage.getItem('findo_api_key') || '');
      setBaseUrl(localStorage.getItem('findo_base_url') || 'https://api.openai.com/v1');
      setModel(localStorage.getItem('findo_model') || 'gpt-4o');
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('findo_api_key', apiKey);
    localStorage.setItem('findo_base_url', baseUrl);
    localStorage.setItem('findo_model', model);
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const setPreset = (provider: 'openai' | 'openrouter') => {
      if(provider === 'openai') {
          setBaseUrl('https://api.openai.com/v1');
          setModel('gpt-4o');
      } else {
          setBaseUrl('https://openrouter.ai/api/v1');
          setModel('minimax/minimax-01'); // Using modern standard for m2.7 alternative
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#12121A] border border-border rounded-xl shadow-2xl w-[500px] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border bg-[#0A0A0F]">
          <h2 className="font-semibold text-text-main">AI Settings</h2>
          <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">✕</button>
        </div>
        
        <div className="p-6 flex flex-col gap-6">
          <div className="flex gap-2 mb-2">
              <button 
                onClick={() => setPreset('openai')}
                className={`flex-1 py-2 text-xs font-mono rounded ${baseUrl.includes('openai') ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-surface border border-border text-text-muted'}`}
              >
                  OpenAI (GPT-4o)
              </button>
              <button 
                onClick={() => setPreset('openrouter')}
                className={`flex-1 py-2 text-xs font-mono rounded ${baseUrl.includes('openrouter') ? 'bg-secondary/20 text-[#9945FF] border border-[#9945FF]/30' : 'bg-surface border border-border text-text-muted'}`}
              >
                  OpenRouter (MiniMax M2.7)
              </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Base URL</label>
            <input 
              type="text" 
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="input-field py-2 bg-[#0A0A0F]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Model Name</label>
            <input 
              type="text" 
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="input-field py-2 bg-[#0A0A0F]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-text-muted uppercase tracking-wider">API Key</label>
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="input-field py-2 bg-[#0A0A0F] font-mono text-sm"
            />
            <p className="text-xs text-text-muted mt-1">Keys are stored locally in the browser.</p>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-border bg-[#0A0A0F] flex justify-end">
          <button 
            onClick={handleSave}
            className={`btn-primary shadow-lg flex items-center justify-center min-w-[120px] ${saved ? 'bg-secondary text-white' : ''}`}
          >
            {saved ? "Saved ✓" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
