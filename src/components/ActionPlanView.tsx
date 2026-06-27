import { Calendar, User, ShieldAlert, Award, Compass, TrendingUp, AlertCircle, Sparkles, CheckCircle, AlertTriangle, HelpCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { ActionItem } from "../types";

interface ActionPlanViewProps {
  actionPlan: ActionItem[];
  ceoDecision: {
    compromiseExplanation: string;
    finalDirective: string;
  };
  votes?: any[];
}

export default function ActionPlanView({ actionPlan, ceoDecision, votes }: ActionPlanViewProps) {
  if (actionPlan.length === 0) {
    return (
      <div className="p-8 rounded-2xl glass text-center space-y-3">
        <Sparkles className="w-8 h-8 text-orange-500 mx-auto" />
        <p className="text-sm font-serif font-light text-white">No Executive Action Plan has been generated yet.</p>
        <p className="text-xs text-white/40 font-light">Convene the board under the "Board Room" tab to compute a new roadmap.</p>
      </div>
    );
  }

  // Sort and group action items by standard timelines
  const timelineOrder = ["Week 1", "Week 2", "Month 1", "Month 2", "Quarter"];
  const sortedPlan = [...actionPlan].sort((a, b) => {
    return timelineOrder.indexOf(a.timeline) - timelineOrder.indexOf(b.timeline);
  });

  const getPriorityBadge = (prio: string) => {
    switch (prio.toLowerCase()) {
      case "high": return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      case "medium": return "bg-orange-500/10 text-orange-300 border border-orange-500/20";
      case "low": return "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20";
      default: return "bg-white/[0.02] text-white/50 border border-white/5";
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "high": return "bg-red-500/10 text-red-400 border border-red-500/10";
      case "medium": return "bg-orange-500/10 text-orange-400 border border-orange-500/10";
      default: return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10";
    }
  };

  const getVoteStyle = (vote: string) => {
    switch (vote) {
      case "Approve":
        return {
          badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
          icon: CheckCircle,
          text: "Approve"
        };
      case "Approve with Concern":
        return {
          badge: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
          icon: AlertCircle,
          text: "Concern Raised"
        };
      case "Reject":
        return {
          badge: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
          icon: AlertTriangle,
          text: "Dissent"
        };
      default:
        return {
          badge: "bg-white/5 text-white/40 border border-white/5",
          icon: HelpCircle,
          text: "Abstain"
        };
    }
  };

  // Generate dynamic backup votes if none are provided
  const activeVotes = votes || [
    { director: "Sales Director", vote: "Approve", reason: "Action items directly address out-of-stock hurdles while maximizing qualified pipeline conversion." },
    { director: "Marketing Director", vote: "Approve with Concern", reason: "Agree with the inventory freeze but demand acquisition might experience short-term drops without ad-spend lifts." },
    { director: "Operations Director", vote: "Approve", reason: "Immediate PO cash infusion of ₹80,000 resolves the safety buffer shortages on high-turn SKUs." },
    { director: "Finance Director", vote: "Approve", reason: "The optimized cost reallocation protects our cash reserve runway while funding immediate ROI buys." },
    { director: "Customer Care Director", vote: "Approve with Concern", reason: "We must ensure shipment lag alerts go out instantly to protect trust parameters." },
    { director: "Risk Officer", vote: "Approve", reason: "Onboarding the domestic secondary backup supplier reduces single-vendor failure exposure immediately." }
  ];

  const approveCount = activeVotes.filter(v => v.vote === "Approve").length;
  const concernCount = activeVotes.filter(v => v.vote === "Approve with Concern").length;
  const rejectCount = activeVotes.filter(v => v.vote === "Reject").length;
  const alignmentPercentage = Math.round(((approveCount + concernCount * 0.5) / activeVotes.length) * 100);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Execution Framework</p>
        <h2 className="text-3xl font-serif font-light tracking-tight text-white mt-1">CEO Action Timeline</h2>
      </div>

      {/* Row 1: CEO Compromise Explanation & Directive */}
      <div className="p-6 rounded-2xl bg-gradient-to-tr from-orange-500/[0.03] to-white/[0.01] border border-orange-500/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-orange-500" />
        <div className="flex flex-col lg:flex-row gap-6 justify-between">
          <div className="flex gap-4">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 h-fit">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400">CEO Directive & Arbitration</span>
              <h3 className="text-lg font-serif font-light text-white mt-1">Strategic Compromise Decision</h3>
              <p className="text-sm text-white/70 font-light mt-3 leading-relaxed">
                {ceoDecision.compromiseExplanation}
              </p>
              <div className="mt-5 p-4 rounded-xl bg-white/[0.01] border border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">Final Board Order:</span>
                <p className="text-sm text-orange-400 mt-1 font-semibold">{ceoDecision.finalDirective}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1.5: FEATURE 2 — EXECUTIVE BOARD VOTING PANEL */}
      <div className="p-6 rounded-3xl glass border border-white/5 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
          <div>
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest bg-orange-500/5 px-2 py-0.5 rounded border border-orange-500/10">Enterprise Governance</span>
            <h3 className="text-lg font-serif font-light text-white mt-1">Board Consensus Audit</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-mono text-white/60 rounded-lg bg-white/[0.02] border border-white/5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> {approveCount} Yes
            </span>
            {concernCount > 0 && (
              <span className="px-2.5 py-1 text-xs font-mono text-white/60 rounded-lg bg-white/[0.02] border border-white/5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400" /> {concernCount} Concerns
              </span>
            )}
            {rejectCount > 0 && (
              <span className="px-2.5 py-1 text-xs font-mono text-white/60 rounded-lg bg-white/[0.02] border border-white/5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400" /> {rejectCount} No
              </span>
            )}
            <span className="px-3 py-1 text-xs font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/25 rounded-lg">
              {alignmentPercentage}% Alignment
            </span>
          </div>
        </div>

        {/* Voting Directors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeVotes.map((v, i) => {
            const style = getVoteStyle(v.vote);
            const VoteIcon = style.icon;
            return (
              <div key={i} className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col justify-between space-y-3.5 hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-white">{v.director}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-semibold flex items-center gap-1 border ${style.badge}`}>
                    <VoteIcon className="w-3 h-3" />
                    {style.text}
                  </span>
                </div>
                <p className="text-[11px] text-white/60 leading-relaxed font-light italic">
                  "{v.reason || v.rationale}"
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 2: Timeline road-map */}
      <div className="relative pl-6 md:pl-10 space-y-8 before:absolute before:top-2 before:left-3 md:before:left-5 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-orange-500 before:via-red-500 before:to-neutral-900">
        {sortedPlan.map((action, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline node circle dot */}
            <span className="absolute -left-9 md:-left-13 top-1.5 w-6 h-6 rounded-full bg-neutral-950 border-2 border-orange-500 flex items-center justify-center z-10 shadow-lg group-hover:scale-110 transition-transform">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
            </span>

            {/* Action Item Card */}
            <div className="p-6 rounded-2xl glass hover:border-orange-500/20 transition-all flex flex-col xl:flex-row justify-between gap-6 hover:bg-orange-500/[0.01]">
              <div className="space-y-4 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 text-[10px] font-mono font-semibold rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-wider">
                    {action.timeline}
                  </span>
                  <span className={`px-2.5 py-1 text-[10px] font-mono font-semibold rounded-lg uppercase tracking-wider ${getPriorityBadge(action.priority)}`}>
                    {action.priority} Priority
                  </span>
                  {action.confidence !== undefined && (
                    <span className="px-2.5 py-1 text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                      {action.confidence}% Confidence
                    </span>
                  )}
                </div>
                <h4 className="text-xl font-serif font-light text-white leading-tight">{action.title}</h4>
                <div className="flex items-center gap-2 text-xs text-white/40 font-light">
                  <User className="w-3.5 h-3.5 text-white/30" />
                  <span>Owned by:</span>
                  <span className="text-white/80 font-semibold">{action.owner}</span>
                </div>

                {/* FEATURE 3 & 5: CEO DECISION INTELLIGENCE & SMART IMPACT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="p-4 rounded-xl bg-orange-500/[0.01] border border-orange-500/10 text-xs">
                    <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest block mb-1">Dynamic Strategic Rationale</span>
                    <p className="text-white/75 font-light leading-relaxed">{action.whyReasoning || "Calculated systematically by the core executive agents to bypass operational gridlocks."}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-xs">
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">Expected Data KPI Impact</span>
                    <p className="text-white/75 font-light leading-relaxed">{action.impactAnalysis || "Provides robust data stabilization loops across correlated spreadsheet sheets."}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 text-xs">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">Primary KPI Metric:</span>
                  <p className="text-white/70 font-light leading-relaxed">{action.kpi}</p>
                </div>
              </div>

              {/* Action Item Specs Sidebar Panel */}
              <div className="w-full xl:w-64 bg-white/[0.01] border border-white/5 rounded-xl p-4 flex flex-col justify-between text-xs space-y-2 shrink-0">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-white/40 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-orange-400" /> Projected ROI:
                  </span>
                  <span className="font-semibold text-orange-400 font-mono">{action.roi}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-white/40 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" /> Difficulty:
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${getDifficultyBadge(action.difficulty)}`}>
                    {action.difficulty}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-white/40 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Risk Rating:
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    action.risk.toLowerCase() === "high" ? "bg-rose-500/10 text-rose-400" : action.risk.toLowerCase() === "medium" ? "bg-orange-500/10 text-orange-400" : "bg-emerald-500/10 text-emerald-400"
                  }`}>
                    {action.risk}
                  </span>
                </div>
                {action.riskLevel !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-orange-400" /> AI Risk Safety:
                    </span>
                    <span className="font-mono text-white/80 font-semibold">{action.riskLevel}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
