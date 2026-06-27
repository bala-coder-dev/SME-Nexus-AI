import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, ArrowLeft, RotateCcw, Volume2, Sparkles, FastForward } from "lucide-react";
import { DebateTurn } from "../types";

interface LiveDebateViewProps {
  debate: DebateTurn[];
  onBack: () => void;
  isLoading?: boolean;
}

export default function LiveDebateView({ debate, onBack, isLoading }: LiveDebateViewProps) {
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<number>(3000); // ms per turn
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-play debate controller
  useEffect(() => {
    if (!isPlaying || debate.length === 0 || isLoading) return;

    const timer = setTimeout(() => {
      if (currentTurnIdx < debate.length - 1) {
        setCurrentTurnIdx(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentTurnIdx, debate.length, speed, isLoading]);

  // Scroll to bottom whenever active turn advances
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentTurnIdx]);

  if (isLoading) {
    return (
      <div className="space-y-6 pb-16 animate-fadeIn">
        {/* Header Controls Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl skeleton shrink-0" />
            <div className="space-y-2">
              <div className="h-4 w-40 skeleton" />
              <div className="h-3 w-20 skeleton" />
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <div className="h-9 w-24 skeleton" />
            <div className="h-9 w-32 skeleton" />
          </div>
        </div>

        {/* Main Debate Panel Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Board Members Skeleton */}
          <div className="p-5 rounded-2xl glass space-y-4 h-fit">
            <div className="h-4 w-28 skeleton mb-2" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl border border-white/5 bg-white/[0.01]">
                  <div className="w-7 h-7 rounded-full skeleton shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 w-20 skeleton" />
                    <div className="h-2 w-12 skeleton" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Speakers Chat Skeleton */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-6 rounded-2xl glass space-y-6">
              {/* Fake message balloon 1 */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full skeleton shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="h-3.5 w-24 skeleton" />
                    <div className="h-2 w-16 skeleton" />
                  </div>
                  <div className="space-y-1.5 p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                    <div className="h-3 w-11/12 skeleton" />
                    <div className="h-3 w-10/12 skeleton" />
                    <div className="h-3 w-8/12 skeleton" />
                  </div>
                </div>
              </div>

              {/* Fake message balloon 2 */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full skeleton shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="h-3.5 w-28 skeleton" />
                    <div className="h-2 w-12 skeleton" />
                  </div>
                  <div className="space-y-1.5 p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                    <div className="h-3 w-10/12 skeleton" />
                    <div className="h-3 w-9/12 skeleton" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (debate.length === 0) {
    return (
      <div className="min-h-[450px] flex flex-col justify-center items-center text-center space-y-4 p-8 rounded-2xl glass">
        <Sparkles className="w-8 h-8 text-orange-500 animate-pulse" />
        <p className="text-sm font-serif font-light text-white">No active Board Convening found.</p>
        <p className="text-xs text-white/40 max-w-sm font-light leading-relaxed">Convene the board under the "Board Room" page to trigger live director debates on your CSV models.</p>
        <button
          onClick={onBack}
          className="mt-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest active:scale-95 transition-all cursor-pointer"
        >
          Go to Board Room
        </button>
      </div>
    );
  }

  const activeTurn = debate[currentTurnIdx];

  const getBorderColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "ceo": return "border-orange-500 bg-orange-500/5 text-orange-400";
      case "sales": return "border-orange-400 bg-orange-400/5 text-orange-300";
      case "marketing": return "border-red-500 bg-red-500/5 text-red-400";
      case "operations": return "border-amber-500 bg-amber-500/5 text-amber-400";
      case "finance": return "border-yellow-600 bg-yellow-600/5 text-yellow-500";
      case "customer satisfaction":
      case "customer": return "border-red-400 bg-red-400/5 text-red-300";
      case "risk": return "border-neutral-600 bg-neutral-600/5 text-neutral-400";
      default: return "border-white/10 bg-white/5 text-slate-300";
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header controls bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-sm font-serif font-light text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" /> Live Boardroom Debate
            </h3>
            <p className="text-[10px] text-white/40 font-mono mt-0.5">TURN {currentTurnIdx + 1} OF {debate.length}</p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Speed slider */}
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span className="text-[9px] font-mono">Speed:</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="px-2 py-1 bg-white/[0.02] border border-white/5 rounded-lg text-white/80 font-mono text-[10px] outline-none"
            >
              <option value={4500} className="bg-neutral-900 text-white">0.5x Slow</option>
              <option value={3000} className="bg-neutral-900 text-white">1.0x Normal</option>
              <option value={1500} className="bg-neutral-900 text-white">2.0x Fast</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
            <button
              onClick={() => { setCurrentTurnIdx(0); setIsPlaying(true); }}
              className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-white" /> : <Play className="w-3 h-3 fill-white" />}
              {isPlaying ? "Pause" : "Resume"}
            </button>
            <button
              onClick={() => {
                if (currentTurnIdx < debate.length - 1) {
                  setCurrentTurnIdx(prev => prev + 1);
                }
              }}
              className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
              title="Next Turn"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setCurrentTurnIdx(debate.length - 1);
                setIsPlaying(false);
              }}
              className="px-3 py-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-400 font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
              title="Skip to Decision"
            >
              <FastForward className="w-3.5 h-3.5" /> Skip
            </button>
          </div>
        </div>
      </div>

      {/* Main Dialogue Timeline layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Director Speakers List */}
        <div className="p-5 rounded-2xl glass space-y-4 h-fit">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Board Members</p>
          <div className="space-y-2.5">
            {Array.from(new Set(debate.map(d => d.speaker))).map(speakerName => {
              const turn = debate.find(d => d.speaker === speakerName);
              const isSpeakingNow = activeTurn?.speaker === speakerName;
              return (
                <div
                  key={speakerName}
                  className={`p-2.5 rounded-xl border transition-all flex items-center gap-2.5 ${
                    isSpeakingNow
                      ? "bg-orange-500/10 border-orange-500/40 text-orange-400"
                      : "bg-white/[0.01] border-white/5 text-white/60"
                  }`}
                >
                  <img
                    src={turn?.avatar}
                    alt={speakerName}
                    className="w-7 h-7 rounded-full object-cover border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate text-white">{speakerName.split(" (")[0]}</p>
                    <p className="text-[9px] font-mono uppercase tracking-wider leading-none mt-0.5">{turn?.role}</p>
                  </div>
                  {isSpeakingNow && (
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse ml-auto" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dialogue Stream Panel */}
        <div className="lg:col-span-3 p-6 rounded-2xl glass h-[480px] overflow-y-auto flex flex-col space-y-4 scrollbar-thin">
          {debate.slice(0, currentTurnIdx + 1).map((turn, idx) => {
            const isLatest = idx === currentTurnIdx;
            const borderStyle = getBorderColor(turn.role);
            return (
              <div
                key={idx}
                className={`flex gap-4 p-4 rounded-2xl border transition-all ${borderStyle} ${
                  isLatest ? "scale-[1.01] shadow-lg" : "opacity-75"
                }`}
              >
                <img
                  src={turn.avatar}
                  alt={turn.speaker}
                  className="w-10 h-10 rounded-full object-cover border border-white/20 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1 bg-transparent border-0 p-0 shadow-none m-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{turn.speaker}</span>
                    <span className="text-[9px] font-mono uppercase bg-white/[0.04] border border-white/5 px-1.5 py-0.5 rounded text-white/50">
                      {turn.role}
                    </span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed font-light">{turn.text}</p>
                </div>
              </div>
            );
          })}

          {/* Typing simulation for play mode */}
          {isPlaying && currentTurnIdx < debate.length - 1 && (
            <div className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.01] opacity-50">
              <div className="w-10 h-10 rounded-full bg-white/[0.02] animate-pulse flex-shrink-0" />
              <div className="space-y-2">
                <div className="w-32 h-3 bg-white/[0.02] rounded animate-pulse" />
                <div className="flex gap-1 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>
    </div>
  );
}
