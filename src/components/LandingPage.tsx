import { motion } from "motion/react";
import { Play, LayoutDashboard, Sparkles, TrendingUp, Cpu, ShieldCheck, HeartHandshake, RefreshCw } from "lucide-react";
import { directors } from "../data/directors";

interface LandingPageProps {
  onEnter: (tab: string) => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="relative min-h-screen bg-[#070708] text-[#E0E0E0] overflow-hidden font-sans select-none selection:bg-orange-500/30">
      {/* Premium background decorative blur circles */}
      <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full bg-orange-950/15 blur-[150px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] rounded-full bg-red-950/15 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center relative z-10 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20 font-bold text-white text-lg">
            NX
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-white">SME NEXUS AI</h1>
            <p className="text-[9px] text-white/40 font-mono uppercase tracking-[0.2em] leading-none">Autonomous Executive Board</p>
          </div>
        </div>
      </header>

      {/* Hero Section Container */}
      <main className="max-w-5xl mx-auto px-6 pt-12 pb-12 relative z-10 text-center">
        
        {/* Centered Heading and Value Proposition */}
        <div className="space-y-6 max-w-3xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-white tracking-tight leading-[1.15]"
          >
            An autonomous <span className="bg-gradient-to-r from-white via-slate-100 to-orange-400 bg-clip-text text-transparent">executive board</span><br />
            for your business.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm md:text-base text-white/60 leading-relaxed font-light max-w-2xl mx-auto"
          >
            Small businesses struggle with daily operations, sales channels, and customer retention. 
            SME Nexus AI convenes seven autonomous expert AI directors to analyze your data, debate conflicting priorities, 
            and design clear action timelines to automate operations and fuel growth.
          </motion.p>

          {/* Quick Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2"
          >
            <button
              onClick={() => onEnter("Dashboard")}
              className="px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-orange-500/25 active:scale-95 group cursor-pointer"
            >
              Convene the Board
              <Play className="w-3.5 h-3.5 fill-white" />
            </button>
            <button
              onClick={() => onEnter("Data Upload")}
              className="px-6 py-3.5 rounded-xl bg-white/[0.03] text-white/90 border border-white/5 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/[0.08] transition-all duration-300 active:scale-95 cursor-pointer"
            >
              Connect Your Dataset (CSV)
              <LayoutDashboard className="w-3.5 h-3.5 text-orange-400" />
            </button>
          </motion.div>
        </div>

        {/* 4. EXECUTIVE BOARD ABOVE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full border-t border-white/5 pt-8 mb-12"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">Your Executive Board of Agentic Directors</h3>
            <span className="text-[9px] font-mono text-orange-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" /> Synchronized
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {directors.map((dir, i) => (
              <motion.div
                key={dir.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col items-center hover:border-orange-500/25 hover:bg-orange-500/[0.02] transition-all group cursor-pointer"
                onClick={() => onEnter("Dashboard")}
              >
                <div className="relative mb-2">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500 to-red-600 opacity-0 group-hover:opacity-30 transition-opacity blur-md" />
                  <img
                    src={dir.avatar}
                    alt={dir.name}
                    className="w-10 h-10 rounded-full object-cover relative z-10 border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h4 className="text-[11px] font-semibold text-white/90 group-hover:text-orange-400 transition-colors text-center truncate w-full">{dir.name}</h4>
                <p className="text-[9px] text-white/40 font-mono mt-0.5 text-center leading-none truncate w-full">{dir.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 4. FOUR GROWTH PILLARS BELOW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Main Pillars Box (Col Span 12 or 7) */}
          <div className="lg:col-span-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="p-6 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Cpu className="w-16 h-16 text-orange-500" />
              </div>

              <div className="border-b border-white/5 pb-3 mb-6">
                <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-semibold">Active Operational Diagnostics</span>
                <h3 className="text-base font-serif font-light text-white mt-0.5">Four Growth Pillars Solved</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pillar 1 */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center text-xs shrink-0 font-bold font-mono">1</div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Customer Satisfaction Agent</h4>
                    <p className="text-[11px] text-white/50 leading-normal mt-1">Aggregates rating text reviews, tags sentiment outliers, and generates backorder alert notifications.</p>
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center text-xs shrink-0 font-bold font-mono">2</div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Lead Generation & Sales Catalyst</h4>
                    <p className="text-[11px] text-white/50 leading-normal mt-1">Evaluates total lead pipeline values and optimizes channel conversion targets.</p>
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center text-xs shrink-0 font-bold font-mono">3</div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Inventory & Supply Chain Security</h4>
                    <p className="text-[11px] text-white/50 leading-normal mt-1">Identifies stockouts instantly, tracks warehouse buffer reserves, and alerts of shipping delays.</p>
                  </div>
                </div>

                {/* Pillar 4 */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center text-xs shrink-0 font-bold font-mono">4</div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Cash Runway & Profit Margins</h4>
                    <p className="text-[11px] text-white/50 leading-normal mt-1">Defends net profit margins and locks budgets against unoptimized digital campaign spends.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feature Highlights Row: Clean, compact 3-column overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full text-left">
          <div className="p-4.5 rounded-xl bg-white/[0.01] border border-white/5 flex gap-3 hover:border-orange-500/10 transition-all duration-300">
            <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 h-fit shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-xs mb-1">Autonomous Board Debate</h4>
              <p className="text-white/50 text-[11px] leading-relaxed">
                Watch sales expansion and cost discipline clash. Directors argue real corporate trade-offs.
              </p>
            </div>
          </div>
          
          <div className="p-4.5 rounded-xl bg-white/[0.01] border border-white/5 flex gap-3 hover:border-orange-500/10 transition-all duration-300">
            <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 h-fit shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-xs mb-1">Dynamic Action Timelines</h4>
              <p className="text-white/50 text-[11px] leading-relaxed">
                Get high-fidelity tasks for Week 1, Week 2, Month 1, and Quarter 1 with direct KPI owners.
              </p>
            </div>
          </div>

          <div className="p-4.5 rounded-xl bg-white/[0.01] border border-white/5 flex gap-3 hover:border-orange-500/10 transition-all duration-300">
            <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 h-fit shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-xs mb-1">Interactive What-If Simulation</h4>
              <p className="text-white/50 text-[11px] leading-relaxed">
                Manipulate multipliers of marketing, sales, and satisfaction rates to instantly observe board response.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
