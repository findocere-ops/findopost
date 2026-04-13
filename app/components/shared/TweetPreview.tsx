"use client";

interface TweetPreviewProps {
  text: string;
  isThread: boolean;
}

export default function TweetPreview({ text, isThread }: TweetPreviewProps) {
  
  if (!text) return null;

  // Roughly separate tweets by empty line pairs if it's a thread
  const tweets = isThread ? text.split(/\n\s*\n/).filter(t => t.trim().length > 0) : [text];

  return (
    <div className="flex flex-col gap-4">
      {tweets.map((tweetText, idx) => {
        const charCount = tweetText.length;
        const pct = Math.min((charCount / 280) * 100, 100);
        const charColor = charCount > 280 ? 'text-[#FF4444]' : charCount > 250 ? 'text-[#FFB800]' : 'text-primary';

        return (
          <div key={idx} className="relative flex gap-3 p-4 bg-black border border-border rounded-xl">
            {/* Avatar & Thread Line */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#14F195] to-[#9945FF] flex shrink-0 border border-white/10 overflow-hidden items-center justify-center font-bold text-black">
                f
              </div>
              {isThread && idx < tweets.length - 1 && (
                <div className="w-0.5 min-h-12 h-full bg-border mt-2" />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-bold text-[15px] truncate text-[#E7E9EA]">findo</span>
                <span className="text-[#1D9BF0] ml-0.5">✓</span>
                <span className="text-[#71767B] text-[15px] truncate">@findocere</span>
                <span className="text-[#71767B]">·</span>
                <span className="text-[#71767B]/80 text-[15px]">1m</span>
              </div>
              
              <div className="mt-1 text-[15px] text-[#E7E9EA] whitespace-pre-wrap leading-tight font-sans" style={{ wordBreak: 'break-word', letterSpacing: '-0.01em' }}>
                {tweetText}
              </div>
              
              {/* Fake X Action Bar */}
              <div className="flex justify-between items-center text-[#71767B] text-sm mt-3 px-1">
                <div className="flex items-center gap-1.5 hover:text-[#1d9bf0] cursor-pointer"><span className="text-[16px]">💬</span></div>
                <div className="flex items-center gap-1.5 hover:text-[#00ba7c] cursor-pointer"><span className="text-[16px]">🔁</span></div>
                <div className="flex items-center gap-1.5 hover:text-[#f91880] cursor-pointer"><span className="text-[16px]">❤️</span></div>
                <div className="flex items-center gap-1.5 hover:text-[#1d9bf0] cursor-pointer"><span className="text-[16px]">📊</span></div>
                <div className="flex items-center gap-1.5 hover:text-[#1d9bf0] cursor-pointer"><span className="text-[16px]">🔖</span></div>
              </div>
              
            </div>

            {/* Character Counter Ring */}
             <div className="absolute top-4 right-4 flex items-center justify-center opacity-60">
              <svg className="w-6 h-6 transform -rotate-90">
                <circle cx="12" cy="12" r="10" className="stroke-surface-hover" strokeWidth="2" fill="none" />
                <circle cx="12" cy="12" r="10" 
                  className={`stroke-current ${charCount > 280 ? 'text-[#FF4444]' : charCount > 250 ? 'text-[#FFB800]' : 'text-primary'} transition-all`} 
                  strokeWidth="2" fill="none" 
                  strokeDasharray={`${pct * 0.628} 100`} 
                  strokeLinecap="round" 
                />
              </svg>
              {charCount > 260 && (
                 <span className={`absolute text-[9px] font-bold ${charColor}`}>{280 - charCount}</span>
              )}
            </div>
            
          </div>
        );
      })}
    </div>
  );
}
