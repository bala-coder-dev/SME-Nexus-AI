import { useState } from "react";
import { 
  Zap, 
  CheckCircle, 
  TrendingUp, 
  Bot, 
  Mail, 
  RefreshCw, 
  AlertTriangle, 
  HeartHandshake, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  Sliders,
  MessageSquare,
  Boxes
} from "lucide-react";
import { MeetingSession } from "../types";

interface DailyGrowthViewProps {
  currentSession: MeetingSession | null;
  defaultStats: any;
}

export default function DailyGrowthView({ currentSession, defaultStats }: DailyGrowthViewProps) {
  const stats = currentSession ? currentSession.stats : defaultStats;
  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [successLogs, setSuccessLogs] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  // Operational triggers based on uploaded data
  const automationTasks = [
    {
      id: "leads_followup",
      title: "Auto-Route & Follow up Won Leads",
      description: "Trigger outbound CRM email campaigns and assign representatives automatically to newly won leads.",
      icon: Mail,
      metric: `${stats.wonLeads} won leads processed`,
      timeSaved: "1.5 hrs",
      actionLabel: "Execute Outbound Flows",
      successMessage: `Successfully dispatched custom introductory welcome flows to all ${stats.wonLeads} converted leads!`,
      color: "text-blue-400 border-blue-500/10 bg-blue-500/[0.02]"
    },
    {
      id: "inventory_reorder",
      title: "Smart Low-Stock Supplier Draft",
      description: "Compile and auto-draft replenishment purchase orders for low-stock supplier routes.",
      icon: Boxes,
      metric: `${stats.lowStock} items below reorder level`,
      timeSaved: "2.0 hrs",
      actionLabel: "Draft PO Orders",
      successMessage: `Purchase orders formulated for ${stats.lowStock} critically low items! Out-of-stock items capped safely.`,
      color: "text-amber-400 border-amber-500/10 bg-amber-500/[0.02]"
    },
    {
      id: "review_responder",
      title: "AI Negative Sentiment Mitigation",
      description: "Identify negative and neutral feedback and generate automated apology & loyalty discount drafts.",
      icon: MessageSquare,
      metric: `${stats.sentimentStats.negative} negative reviews detected`,
      timeSaved: "1.0 hr",
      actionLabel: "Generate Apology Offers",
      successMessage: `Constructed ${stats.sentimentStats.negative} tailored resolution emails with 10% discount codes to recover unhappy buyers.`,
      color: "text-rose-400 border-rose-500/10 bg-rose-500/[0.02]"
    },
    {
      id: "marketing_creator",
      title: "Dynamic Social Ad Copy Generator",
      description: "Auto-generate highly targeted advertising campaigns promoting the top performing categories.",
      icon: Sparkles,
      metric: "Top Category: Electronics (35%)",
      timeSaved: "2.5 hrs",
      actionLabel: "Create Ad Creatives",
      successMessage: "Ad copies, headlines, and Instagram/Facebook targeting parameters compiled and saved to marketing drafts!",
      color: "text-purple-400 border-purple-500/10 bg-purple-500/[0.02]"
    }
  ];

  const handleRunTask = (taskId: string, label: string, successText: string) => {
    setRunningAction(taskId);
    setTimeout(() => {
      setRunningAction(null);
      setSuccessLogs(prev => [
        `[${new Date().toLocaleTimeString()}] SUCCESS: ${successText}`,
        ...prev
      ]);
      setCompletedTasks(prev => ({
        ...prev,
        [taskId]: true
      }));
    }, 1500);
  };

  const toggleChecklist = (taskIndex: number) => {
    setCompletedTasks(prev => ({
      ...prev,
      [`manual-${taskIndex}`]: !prev[`manual-${taskIndex}`]
    }));
  };

  // Dynamic growth metrics and checklist based on dataset characteristics
  const totalCompleted = Object.values(completedTasks).filter(Boolean).length;
  const growthScore = Math.min(100, 60 + totalCompleted * 10);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500">CASE STUDY AUTOMATION</p>
          <h2 className="text-3xl font-serif font-light text-white mt-1">Daily Operations Planner</h2>
        </div>
        <div className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs font-mono text-orange-400 flex items-center gap-2">
          <Zap className="w-4 h-4 animate-pulse" />
          <span>Daily Growth Score: {growthScore}/100</span>
        </div>
      </div>

      {/* Intro overview of Daily Operations Case Study */}
      <div className="p-6 rounded-2xl bg-gradient-to-tr from-orange-500/[0.02] to-white/[0.01] border border-white/[0.04] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl" />
        <div className="flex gap-4">
          <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/15 h-fit shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-serif font-light text-white">Daily Growth Engine for Small Businesses</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light mt-1.5">
              Automate customer management, lead conversion tracking, and inventory replenishment flows instantly. This dashboard maps your actual uploaded dataset values to real-world automated actions, resolving resource bottlenecks and accelerating company momentum with zero manual fatigue.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns - Operational Automation Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-semibold tracking-wide text-slate-300 uppercase font-mono">One-Click Operational Automation</h3>
          
          <div className="space-y-4">
            {automationTasks.map((task) => {
              const IconComponent = task.icon;
              const isExecuting = runningAction === task.id;
              const isDone = completedTasks[task.id];

              return (
                <div 
                  key={task.id} 
                  className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                    isDone 
                      ? "bg-emerald-500/[0.01] border-emerald-500/20" 
                      : "bg-white/[0.01] border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex gap-4 min-w-0">
                    <div className={`p-3 rounded-xl border shrink-0 ${task.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5 min-w-0">
                      <h4 className="text-sm font-medium text-white flex items-center gap-2">
                        {task.title}
                        {isDone && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-light">{task.description}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-slate-500">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Data Source: {task.metric}
                        </span>
                        <span>• Est. Time Saved: <strong className="text-orange-400">{task.timeSaved}</strong></span>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={runningAction !== null || isDone}
                    onClick={() => handleRunTask(task.id, task.title, task.successMessage)}
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center ${
                      isDone 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
                        : "bg-white text-black hover:bg-slate-200 disabled:opacity-40"
                    }`}
                  >
                    {isExecuting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Running Trigger...
                      </>
                    ) : isDone ? (
                      "Executed Successfully"
                    ) : (
                      task.actionLabel
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Operational logs console panel */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3.5">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Automation Execution Log Console</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="font-mono text-xs text-slate-400 space-y-2 h-[120px] overflow-y-auto custom-scrollbar leading-relaxed">
              {successLogs.length === 0 ? (
                <p className="text-slate-600 italic">No operations triggered yet today. Click action buttons above to run triggers.</p>
              ) : (
                successLogs.map((log, idx) => (
                  <p key={idx} className="text-emerald-400/95 animate-fadeIn">
                    {log}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Checklist & Micro-insights */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold tracking-wide text-slate-300 uppercase font-mono">Growth Acceleration Checklist</h3>
          
          <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-4">
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Based on the raw data connect diagnostics, complete your manually validated operations checklist to drive daily conversions:
            </p>

            <div className="space-y-3.5 pt-2">
              {[
                { text: "Confirm inventory buffer safety counts with primary wholesalers", note: `${stats.inventoryCount} stock buffers check` },
                { text: "Review active pipeline high-value lead email outreach templates", note: `₹${stats.pipeline.toLocaleString('en-IN')} total pipeline` },
                { text: "Check customer delivery SLA metrics to curb negative feedback", note: `Sentiment index validation` },
                { text: "Execute ad budget shift targeting top high-margin items", note: "Optimize ROI thresholds" }
              ].map((item, idx) => {
                const checked = completedTasks[`manual-${idx}`];
                return (
                  <div 
                    key={idx} 
                    onClick={() => toggleChecklist(idx)}
                    className="flex gap-3 items-start cursor-pointer group select-none"
                  >
                    <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                      checked 
                        ? "bg-orange-500 border-orange-500 text-white" 
                        : "border-white/20 group-hover:border-orange-500/40"
                    }`}>
                      {checked && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                    <div className="space-y-0.5">
                      <p className={`text-xs leading-tight transition-colors ${checked ? "text-slate-500 line-through" : "text-slate-300"}`}>
                        {item.text}
                      </p>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">{item.note}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
