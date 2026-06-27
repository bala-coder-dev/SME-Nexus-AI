import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  UploadCloud,
  Users,
  Compass,
  FileText,
  BarChart3,
  Sliders,
  Play,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Building2,
  Calendar
} from "lucide-react";

import { defaultSales, defaultInventory, defaultLeads, defaultReviews } from "./data/defaults";
import { MeetingSession, WhatIfFactors, SalesRecord, InventoryRecord, LeadRecord, ReviewRecord } from "./types";

import LandingPage from "./components/LandingPage";
import DashboardView from "./components/DashboardView";
import DataView from "./components/DataView";
import BoardRoomView from "./components/BoardRoomView";
import LiveDebateView from "./components/LiveDebateView";
import ActionPlanView from "./components/ActionPlanView";
import AnalyticsView from "./components/AnalyticsView";
import MeetingMinutesView from "./components/MeetingMinutesView";
import WhatIfView from "./components/WhatIfView";
import DailyGrowthView from "./components/DailyGrowthView";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("Landing");
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const activeTheme: string = "cobalt";

  const getThemeCSS = () => {
    switch (activeTheme) {
      case "gold":
        return `
          :root {
            --color-primary: #eab308;
            --color-primary-hover: #ca8a04;
            --color-primary-glow: rgba(234, 179, 8, 0.15);
            --color-primary-border: rgba(234, 179, 8, 0.2);
          }
          .text-orange-400 { color: #facc15 !important; }
          .bg-orange-500 { background-color: #eab308 !important; }
          .hover\\:bg-orange-600:hover { background-color: #ca8a04 !important; }
          .bg-orange-500\\/10 { background-color: rgba(234, 179, 8, 0.1) !important; }
          .border-orange-500\\/20 { border-color: rgba(234, 179, 8, 0.2) !important; }
          .border-orange-500\\/25 { border-color: rgba(234, 179, 8, 0.25) !important; }
          .border-orange-500\\/40 { border-color: rgba(234, 179, 8, 0.4) !important; }
          .shadow-orange-500\\/10 { box-shadow: 0 4px 20px rgba(234, 179, 8, 0.1) !important; }
          .shadow-orange-500\\/20 { box-shadow: 0 4px 20px rgba(234, 179, 8, 0.2) !important; }
          .shadow-orange-500\\/25 { box-shadow: 0 4px 20px rgba(234, 179, 8, 0.25) !important; }
          .text-orange-500 { color: #eab308 !important; }
          .from-orange-500 { --tw-gradient-from: #eab308 !important; }
        `;
      case "emerald":
        return `
          :root {
            --color-primary: #10b981;
            --color-primary-hover: #059669;
            --color-primary-glow: rgba(16, 185, 129, 0.15);
            --color-primary-border: rgba(16, 185, 129, 0.2);
          }
          .text-orange-400 { color: #34d399 !important; }
          .bg-orange-500 { background-color: #10b981 !important; }
          .hover\\:bg-orange-600:hover { background-color: #059669 !important; }
          .bg-orange-500\\/10 { background-color: rgba(16, 185, 129, 0.1) !important; }
          .border-orange-500\\/20 { border-color: rgba(16, 185, 129, 0.2) !important; }
          .border-orange-500\\/25 { border-color: rgba(16, 185, 129, 0.25) !important; }
          .border-orange-500\\/40 { border-color: rgba(16, 185, 129, 0.4) !important; }
          .shadow-orange-500\\/10 { box-shadow: 0 4px 20px rgba(16, 185, 129, 0.1) !important; }
          .shadow-orange-500\\/20 { box-shadow: 0 4px 20px rgba(16, 185, 129, 0.2) !important; }
          .shadow-orange-500\\/25 { box-shadow: 0 4px 20px rgba(16, 185, 129, 0.25) !important; }
          .text-orange-500 { color: #10b981 !important; }
          .from-orange-500 { --tw-gradient-from: #10b981 !important; }
        `;
      case "cobalt":
        return `
          :root {
            --color-primary: #3b82f6;
            --color-primary-hover: #2563eb;
            --color-primary-glow: rgba(59, 130, 246, 0.15);
            --color-primary-border: rgba(59, 130, 246, 0.2);
          }
          .text-orange-400 { color: #60a5fa !important; }
          .bg-orange-500 { background-color: #3b82f6 !important; }
          .hover\\:bg-orange-600:hover { background-color: #2563eb !important; }
          .bg-orange-500\\/10 { background-color: rgba(59, 130, 246, 0.1) !important; }
          .border-orange-500\\/20 { border-color: rgba(59, 130, 246, 0.2) !important; }
          .border-orange-500\\/25 { border-color: rgba(59, 130, 246, 0.25) !important; }
          .border-orange-500\\/40 { border-color: rgba(59, 130, 246, 0.4) !important; }
          .shadow-orange-500\\/10 { box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1) !important; }
          .shadow-orange-500\\/20 { box-shadow: 0 4px 20px rgba(59, 130, 246, 0.2) !important; }
          .shadow-orange-500\\/25 { box-shadow: 0 4px 20px rgba(59, 130, 246, 0.25) !important; }
          .text-orange-500 { color: #3b82f6 !important; }
          .from-orange-500 { --tw-gradient-from: #3b82f6 !important; }
        `;
      case "light":
        return `
          :root {
            --color-primary: #1e293b;
            --color-primary-hover: #0f172a;
            --color-primary-glow: rgba(30, 41, 59, 0.05);
            --color-primary-border: rgba(30, 41, 59, 0.1);
          }
          body {
            background-color: #f8fafc !important;
            color: #1e293b !important;
          }
          .min-h-screen {
            background-color: #f8fafc !important;
            color: #1e293b !important;
          }
          aside {
            background-color: #ffffff !important;
            border-right: 1px solid rgba(0, 0, 0, 0.06) !important;
          }
          header {
            background-color: #ffffff !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
            color: #1e293b !important;
          }
          .glass {
            background: rgba(255, 255, 255, 0.8) !important;
            border: 1px solid rgba(0, 0, 0, 0.06) !important;
            color: #1e293b !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02) !important;
          }
          .text-white { color: #0f172a !important; }
          .text-slate-400 { color: #475569 !important; }
          .text-white\\/40 { color: #64748b !important; }
          .text-white\\/55 { color: #475569 !important; }
          .text-white\\/60 { color: #334155 !important; }
          .text-white\\/80 { color: #1e293b !important; }
          .text-white\\/30 { color: #94a3b8 !important; }
          .text-white\\/20 { color: #cbd5e1 !important; }
          .text-slate-300 { color: #334155 !important; }
          .bg-white\\/\\[0\\.01\\] { background-color: rgba(0, 0, 0, 0.01) !important; }
          .bg-white\\/\\[0\\.02\\] { background-color: rgba(0, 0, 0, 0.02) !important; }
          .bg-white\\/\\[0\\.03\\] { background-color: rgba(0, 0, 0, 0.03) !important; }
          .bg-white\\/\\[0\\.04\\] { background-color: rgba(0, 0, 0, 0.04) !important; }
          .bg-black\\/20 { background-color: rgba(0, 0, 0, 0.01) !important; }
          .bg-[#070708] { background-color: #f8fafc !important; }
          .bg-black\\/40 { background-color: rgba(0, 0, 0, 0.02) !important; }
          .border-white\\/5 { border-color: rgba(0, 0, 0, 0.06) !important; }
          .text-orange-400 { color: #1e293b !important; }
          .bg-orange-500 { background-color: #1e293b !important; }
          .hover\\:bg-orange-600:hover { background-color: #0f172a !important; }
          .bg-orange-500\\/10 { background-color: rgba(30, 41, 59, 0.08) !important; }
          .border-orange-500\\/20 { border-color: rgba(30, 41, 59, 0.15) !important; }
          .border-orange-500\\/25 { border-color: rgba(30, 41, 59, 0.2) !important; }
          .border-orange-500\\/40 { border-color: rgba(30, 41, 59, 0.3) !important; }
          .shadow-orange-500\\/10 { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04) !important; }
          .shadow-orange-500\\/20 { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important; }
          .shadow-orange-500\\/25 { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important; }
          .text-orange-500 { color: #1e293b !important; }
          .from-orange-500 { --tw-gradient-from: #1e293b !important; }
          .to-red-600 { --tw-gradient-to: #475569 !important; }
          pre.font-mono { background-color: rgba(0, 0, 0, 0.03) !important; color: #0f172a !important; }
        `;
      default:
        return "";
    }
  };

  // Core Datasets State
  const [sales, setSales] = useState<SalesRecord[]>([]);
  const [inventory, setInventory] = useState<InventoryRecord[]>([]);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);

  const hasData = sales.length > 0;

  const getCompanyName = () => {
    if (!hasData) return "SME Enterprise Group";
    const categories = Array.from(new Set([
      ...sales.map(s => s.category),
      ...inventory.map(i => i.category)
    ].filter(Boolean)));
    
    if (categories.length === 0) return "SME Enterprise Group";
    const formatted = categories.slice(0, 2).map(c => c.trim()).join(" & ");
    return `${formatted} Co.`;
  };

  // What If Scenario Multipliers
  const [whatIfFactors, setWhatIfFactors] = useState<WhatIfFactors>({
    revenueFactor: 1.0,
    inventoryFactor: 1.0,
    marketingBudgetFactor: 1.0,
    customerSatisfactionFactor: 1.0,
  });

  // Board Sessions History State
  const [meetings, setMeetings] = useState<MeetingSession[]>([]);
  const [currentSession, setCurrentSession] = useState<MeetingSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch initial meeting history if any from backend on load
  useEffect(() => {
    fetch("/api/meetings-history")
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) {
          setMeetings(data);
          setCurrentSession(data[0]);
        }
      })
      .catch(() => {
        // Safe console ignore in case of sandboxed offline modes
      });
  }, []);

  // Compute stats on current local datasets
  const calculateStats = (
    s: SalesRecord[],
    inv: InventoryRecord[],
    ld: LeadRecord[],
    rev: ReviewRecord[]
  ) => {
    const revenue = s.reduce((acc, curr) => acc + curr.revenue, 0) * whatIfFactors.revenueFactor;
    const orders = Math.round(s.length * whatIfFactors.revenueFactor);
    const aov = orders > 0 ? Math.round(revenue / orders) : 0;
    
    // profit margin target
    const profit = Math.round(revenue * 0.56);
    const profitMarginPercent = 56;

    const inventoryCount = Math.round(inv.reduce((acc, curr) => acc + curr.stock, 0) * whatIfFactors.inventoryFactor);
    const outOfStock = inv.filter(i => i.stock === 0 || i.status === 'Out of Stock').length;
    const lowStock = inv.filter(i => (i.stock > 0 && i.stock <= i.reorder_level) || i.status === 'Low Stock').length;
    const totalInvItems = inv.length;
    const inventoryHealth = totalInvItems > 0 ? Math.round(((totalInvItems - outOfStock) / totalInvItems) * 100) : 100;

    const pipeline = ld.reduce((acc, curr) => acc + curr.value, 0) * whatIfFactors.marketingBudgetFactor;
    const totalLeads = Math.round(ld.length * whatIfFactors.marketingBudgetFactor);
    const wonLeads = Math.round(ld.filter(l => l.stage === 'Won').length * whatIfFactors.marketingBudgetFactor);
    const leadConversion = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

    const totalRating = rev.reduce((acc, curr) => acc + curr.rating, 0) * whatIfFactors.customerSatisfactionFactor;
    const rawRating = rev.length > 0 ? (totalRating / rev.length) : 5.0;
    const customerRating = Math.min(5.0, parseFloat(rawRating.toFixed(2)));

    const positive = Math.round(rev.filter(r => r.sentiment === 'Positive').length * whatIfFactors.customerSatisfactionFactor);
    const neutral = rev.filter(r => r.sentiment === 'Neutral').length;
    const negative = rev.filter(r => r.sentiment === 'Negative').length;

    return {
      revenue,
      orders,
      aov,
      profit,
      profitMarginPercent,
      inventoryCount,
      inventoryHealth,
      outOfStock,
      lowStock,
      pipeline,
      leadConversion,
      wonLeads,
      totalLeads,
      customerRating,
      sentimentStats: { positive, neutral, negative }
    };
  };

  const currentStats = calculateStats(sales, inventory, leads, reviews);

  // Trigger boardroom convening
  const runBoardMeeting = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setActiveTab("Live Debate");

    try {
      const response = await fetch("/api/board-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sales,
          inventory,
          leads,
          reviews,
          whatIf: whatIfFactors
        })
      });

      if (!response.ok) {
        throw new Error("Boardroom session calculation request failed");
      }

      const session: MeetingSession = await response.json();
      setMeetings(prev => [session, ...prev]);
      setCurrentSession(session);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during board analysis.");
      setActiveTab("Board Room");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTab = (tab: string) => {
    if (tab === "Landing") {
      setShowLanding(true);
    } else {
      setShowLanding(false);
      if (!hasData && tab !== "Data Upload") {
        setActiveTab("Data Upload");
      } else {
        setActiveTab(tab);
      }
    }
  };

  const handleUploadData = (type: 'sales' | 'inventory' | 'leads' | 'reviews', parsedData: any[]) => {
    switch (type) {
      case "sales": setSales(parsedData); break;
      case "inventory": setInventory(parsedData); break;
      case "leads": setLeads(parsedData); break;
      case "reviews": setReviews(parsedData); break;
    }
  };

  const handleResetDemo = () => {
    setSales(defaultSales);
    setInventory(defaultInventory);
    setLeads(defaultLeads);
    setReviews(defaultReviews);
    setWhatIfFactors({
      revenueFactor: 1.0,
      inventoryFactor: 1.0,
      marketingBudgetFactor: 1.0,
      customerSatisfactionFactor: 1.0,
    });
  };

  if (showLanding) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: getThemeCSS() }} />
        <LandingPage onEnter={handleSelectTab} />
      </>
    );
  }

  // Sidebar navigation options
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Data Upload", icon: UploadCloud },
    { name: "Daily Growth", icon: Sparkles },
    { name: "Board Room", icon: Users },
    { name: "Live Debate", icon: MessageSquare, requiresSession: true },
    { name: "Action Plan", icon: Compass, requiresSession: true },
    { name: "Analytics", icon: BarChart3 },
    { name: "Meeting Minutes", icon: FileText, requiresSession: true },
    { name: "What-If Simulator", icon: Sliders },
  ];

  return (
    <div className="flex min-h-screen bg-[#070708] text-[#E0E0E0] font-sans antialiased overflow-x-hidden selection:bg-orange-500/30 selection:text-white">
      <style dangerouslySetInnerHTML={{ __html: getThemeCSS() }} />
      {/* Sidebar Drawer */}
      <aside className="w-64 border-r border-white/5 bg-black/20 p-6 flex flex-col justify-between shrink-0 no-print hidden md:flex">
        <div className="space-y-8">
          {/* Logo brand */}
          <div
            onClick={() => setShowLanding(true)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform font-bold text-white text-xs">
              NX
            </div>
            <div>
              <h1 className="font-semibold tracking-tight text-white text-sm">SME NEXUS AI</h1>
              <p className="text-[9px] text-white/40 font-mono uppercase tracking-[0.1em] leading-none">Autonomous Executive Board</p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isLocked = (item.requiresSession && !currentSession) || (item.name !== "Data Upload" && !hasData);
              const isActive = activeTab === item.name;

              return (
                <button
                  key={item.name}
                  disabled={isLocked && !isLoading}
                  onClick={() => handleSelectTab(item.name)}
                  className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all group ${
                    isActive
                      ? "bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-[0_0_15px_rgba(244,113,33,0.06)]"
                      : isLocked
                      ? "text-white/20 cursor-not-allowed"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-orange-400" : "text-white/40 group-hover:text-white/60"}`} />
                    <span>{item.name}</span>
                  </div>
                  {isLocked && (
                    <span className="text-[8px] font-mono text-white/30 bg-white/[0.02] border border-white/5 px-1.5 py-0.5 rounded">
                      Locked
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Action convening summary bottom segment */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3.5 glass">
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>BOARD STATUS</span>
            <span className="flex items-center gap-1.5 font-semibold">
              {hasData ? (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 glow-emerald animate-pulse" /> Active
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 glow-rose animate-pulse" /> Waiting
                </span>
              )}
            </span>
          </div>
          <button
            onClick={runBoardMeeting}
            disabled={isLoading || !hasData}
            className={`w-full py-2.5 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition-colors uppercase tracking-widest cursor-pointer ${
              !hasData
                ? "bg-white/5 text-white/30 border-white/5 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 border-orange-500/25 text-white shadow-lg shadow-orange-500/20"
            }`}
          >
            <Play className={`w-3 h-3 ${hasData ? "fill-white" : "fill-white/30"}`} />
            Convene Board
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar header */}
        <header className="h-16 border-b border-white/5 px-8 flex justify-between items-center bg-[#070708] no-print shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono bg-white/[0.04] border border-white/5 text-white/60 px-2 py-1 rounded">
              {currentSession ? `CURRENT SESSION: ${getCompanyName()}` : "BOARD STATUS: PENDING DATA CONFIGURATION"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-white/40 hidden md:flex">
              <Calendar className="w-3.5 h-3.5" />
              <span>SME Nexus Agent v1.0</span>
            </div>
          </div>
        </header>

        {/* Content viewport */}
        <main className="flex-1 overflow-y-auto px-8 py-8 md:px-12">
          {/* Main loader / processing state overlay */}
          {isLoading ? (
            <div className="min-h-[400px] flex flex-col justify-center items-center text-center space-y-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-t-orange-500 border-white/5 animate-spin" />
                <Sparkles className="w-4 h-4 text-orange-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Convene Board in Progress</h3>
                <p className="text-xs text-white/50 max-w-xs mt-1.5 font-light leading-relaxed">
                  Seven Directors are debating conflict parameters, analyzing cross-sheet outliers, and executing risk algorithms.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Tab views rendering switches */}
              {activeTab === "Dashboard" && (
                <DashboardView
                  currentSession={currentSession}
                  onConvene={runBoardMeeting}
                  defaultStats={currentStats}
                />
              )}

              {activeTab === "Data Upload" && (
                <DataView
                  sales={sales}
                  inventory={inventory}
                  leads={leads}
                  reviews={reviews}
                  onUpload={handleUploadData}
                  onResetDemo={handleResetDemo}
                />
              )}

              {activeTab === "Daily Growth" && (
                <DailyGrowthView
                  currentSession={currentSession}
                  defaultStats={currentStats}
                />
              )}

              {activeTab === "Board Room" && (
                <BoardRoomView
                  meetings={meetings}
                  onSelectMeeting={(m) => { setCurrentSession(m); setActiveTab("Dashboard"); }}
                  onConvene={runBoardMeeting}
                  currentSessionId={currentSession?.id || null}
                  companyName={getCompanyName()}
                />
              )}

              {activeTab === "Live Debate" && (
                <LiveDebateView
                  debate={currentSession?.debate || []}
                  onBack={() => setActiveTab("Board Room")}
                  isLoading={isLoading}
                />
              )}

              {activeTab === "Action Plan" && (
                <ActionPlanView
                  actionPlan={currentSession?.actionPlan || []}
                  ceoDecision={currentSession?.ceoDecision || { compromiseExplanation: "", finalDirective: "" }}
                  votes={currentSession?.votes}
                />
              )}

              {activeTab === "Analytics" && (
                <AnalyticsView
                  currentSession={currentSession}
                  defaultStats={currentStats}
                />
              )}

              {activeTab === "Meeting Minutes" && (
                <MeetingMinutesView
                  minutes={currentSession?.meetingMinutes || null}
                  warning={currentSession?.warning}
                />
              )}

              {activeTab === "What-If Simulator" && (
                <WhatIfView
                  factors={whatIfFactors}
                  onChangeFactors={setWhatIfFactors}
                  onReRun={runBoardMeeting}
                  isLoading={isLoading}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
