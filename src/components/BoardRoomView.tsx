import { motion } from "motion/react";
import { Play, History, Calendar, DollarSign, BarChart2, Shield } from "lucide-react";
import { directors } from "../data/directors";
import { MeetingSession } from "../types";

interface BoardRoomViewProps {
  meetings: MeetingSession[];
  onSelectMeeting: (session: MeetingSession) => void;
  onConvene: () => void;
  currentSessionId: string | null;
  companyName: string;
}

export default function BoardRoomView({ meetings, onSelectMeeting, onConvene, currentSessionId, companyName }: BoardRoomViewProps) {
  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Board Room</p>
          <h2 className="text-3xl font-serif font-light tracking-tight text-white mt-1">Convene the Executive Board</h2>
        </div>
        <button
          onClick={onConvene}
          className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 border border-orange-500/25 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer shadow-orange-500/20"
        >
          <Play className="w-4 h-4 fill-white" /> Convene the Board
        </button>
      </div>

      {/* Directors Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {directors.map((dir, i) => (
          <div
            key={dir.name}
            className="rounded-2xl glass p-5 flex flex-col justify-between hover:bg-orange-500/[0.02] hover:border-orange-500/20 transition-all group"
          >
            <div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-orange-500 opacity-20 blur-md group-hover:scale-110 transition-transform" />
                  <img
                    src={dir.avatar}
                    alt={dir.name}
                    className="w-12 h-12 rounded-full object-cover relative z-10 border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{dir.name}</h4>
                  <p className="text-[10px] text-orange-400 font-mono tracking-wider">{dir.role}</p>
                </div>
              </div>
              <p className="text-xs text-white/60 mt-4 leading-relaxed font-light">{dir.description}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
              <span>Status:</span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 glow-cobalt animate-pulse" /> Active Agent
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Meetings History List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-white/40" />
          <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Recent Meetings</h3>
        </div>

        {meetings.length === 0 ? (
          <div className="p-8 rounded-2xl glass text-center">
            <Calendar className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-sm text-white/60 font-medium">No previous board meetings recorded.</p>
            <p className="text-xs text-white/30 mt-1">Convene the board above to create your first session.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meetings.map((meet) => (
              <div
                key={meet.id}
                onClick={() => onSelectMeeting(meet)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all hover:bg-orange-500/[0.02] flex flex-col justify-between relative overflow-hidden ${
                  currentSessionId === meet.id
                    ? "bg-orange-500/[0.02] border-orange-500/40"
                    : "glass hover:border-orange-500/20"
                }`}
              >
                {meet.warning && (
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-orange-500/10 text-[8px] font-mono text-orange-400 rounded-bl-lg uppercase tracking-wider">
                    Simulation
                  </div>
                )}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-white/40">
                    <span>{companyName} Board Session</span>
                    <span>{new Date(meet.timestamp).toLocaleString()}</span>
                  </div>
                  <h4 className="text-sm font-serif font-light text-white mt-2">
                    Overall Health: {meet.healthScores.overall}/100
                  </h4>
                  <p className="text-xs text-white/60 line-clamp-1 mt-1 font-light">{meet.ceoDecision.finalDirective}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-white/40">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-orange-400" />
                    <span>${(meet.stats.revenue / 1000).toFixed(1)}K rev</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart2 className="w-3 h-3 text-red-400" />
                    <span>{meet.stats.orders} orders</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-orange-400" />
                    <span>{meet.healthScores.risk}% risk safe</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
