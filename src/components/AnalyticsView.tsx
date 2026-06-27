import { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, Legend } from "recharts";
import { Sparkles, BarChart2, Compass, ShieldAlert, Heart, Wallet, TrendingUp, AlertTriangle, Target, Lightbulb, ClipboardList, CheckCircle } from "lucide-react";
import { MeetingSession } from "../types";

interface AnalyticsViewProps {
  currentSession: MeetingSession | null;
  defaultStats: any;
}

export default function AnalyticsView({ currentSession, defaultStats }: AnalyticsViewProps) {
  const [selectedDirectorKey, setSelectedDirectorKey] = useState<"sales" | "marketing" | "operations" | "finance" | "customer" | "risk">("sales");
  const stats = currentSession ? currentSession.stats : defaultStats;
  const health = currentSession ? currentSession.healthScores : { overall: 88, sales: 88, marketing: 82, operations: 83, finance: 56, customer: 91, risk: 80 };

  // Area Chart Data
  const monthlyData = [
    { name: "2025-07", Revenue: Math.round(stats.revenue * 0.12), Profit: Math.round(stats.revenue * 0.12 * 0.56) },
    { name: "2025-08", Revenue: Math.round(stats.revenue * 0.18), Profit: Math.round(stats.revenue * 0.18 * 0.56) },
    { name: "2025-09", Revenue: Math.round(stats.revenue * 0.15), Profit: Math.round(stats.revenue * 0.15 * 0.56) },
    { name: "2025-10", Revenue: Math.round(stats.revenue * 0.16), Profit: Math.round(stats.revenue * 0.16 * 0.56) },
    { name: "2025-11", Revenue: Math.round(stats.revenue * 0.22), Profit: Math.round(stats.revenue * 0.22 * 0.56) },
    { name: "2025-12", Revenue: Math.round(stats.revenue * 0.17), Profit: Math.round(stats.revenue * 0.17 * 0.56) },
  ];

  // Radar Chart Data representing 6 core business pillars
  const radarData = [
    { subject: "Sales", value: health.sales, fullMark: 100 },
    { subject: "Marketing", value: health.marketing, fullMark: 100 },
    { subject: "Operations", value: health.operations, fullMark: 100 },
    { subject: "Finance", value: health.finance, fullMark: 100 },
    { subject: "Customer Care", value: health.customer, fullMark: 100 },
    { subject: "Risk Management", value: health.risk, fullMark: 100 },
  ];

  // Category sales
  const categoryData = [
    { name: "Electronics", Profit: Math.round(stats.revenue * 0.35 * 0.56), Revenue: Math.round(stats.revenue * 0.35) },
    { name: "Apparel", Profit: Math.round(stats.revenue * 0.22 * 0.56), Revenue: Math.round(stats.revenue * 0.22) },
    { name: "Home", Profit: Math.round(stats.revenue * 0.18 * 0.56), Revenue: Math.round(stats.revenue * 0.18) },
    { name: "Accessories", Profit: Math.round(stats.revenue * 0.13 * 0.56), Revenue: Math.round(stats.revenue * 0.13) },
    { name: "Wellness", Profit: Math.round(stats.revenue * 0.08 * 0.56), Revenue: Math.round(stats.revenue * 0.08) },
    { name: "Stationery", Profit: Math.round(stats.revenue * 0.04 * 0.56), Revenue: Math.round(stats.revenue * 0.04) },
  ];

  const directorsConfig = {
    sales: { label: "Sales Director", color: "text-blue-400 border-blue-500/20 bg-blue-500/5", icon: TrendingUp },
    marketing: { label: "Marketing Director", color: "text-pink-400 border-pink-500/20 bg-pink-500/5", icon: Target },
    operations: { label: "Operations Director", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", icon: Sparkles },
    finance: { label: "Finance Director", color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5", icon: Wallet },
    customer: { label: "Customer Intelligence", color: "text-purple-400 border-purple-500/20 bg-purple-500/5", icon: Heart },
    risk: { label: "Risk Management", color: "text-slate-400 border-slate-500/20 bg-slate-500/5", icon: ShieldAlert },
  };

  // Get active analysis
  const getActiveAnalysis = () => {
    if (currentSession && currentSession.analyses && currentSession.analyses[selectedDirectorKey]) {
      const live = currentSession.analyses[selectedDirectorKey];
      return {
        director: live.director || directorsConfig[selectedDirectorKey].label,
        executiveSummary: live.executiveSummary || `Dynamic data analysis suggests standard baseline patterns across general channels. Continuous real-time optimization is advised to capture residual margins.`,
        observations: live.observations || [
          `Observed overall metrics show steady transactional frequency across primary products.`,
          `Outliers in secondary channels are being tracked for margin leakage.`,
        ],
        keyProblems: live.keyProblems || [
          `Fulfillment delay alerts require tighter synchronization.`,
          `Unoptimized allocation constraints present soft conversion limitations.`,
        ],
        opportunities: live.opportunities || [
          `Integrate catalog automation directly with ad spend profiles.`,
          `Identify B2B wholesale cohorts to deploy bulk outbound strategies.`,
        ],
        recommendedActions: live.recommendedActions || [
          `Restructure catalog visibility filters to highlight high-AOV stock.`,
          `Formulate contingency reserves to buffer supply-side lead delays.`,
        ],
        businessRisk: live.businessRisk || "Fulfillment frictions and unmitigated single-vendor exposure risks.",
        confidenceScore: live.confidenceScore || 85,
        findings: live.findings,
        recommendation: live.recommendation
      };
    }

    // Static fallback if no session is active yet
    const fallbackTemplate = {
      sales: {
        director: "Sales Director Agent",
        executiveSummary: `Sales operations show steady baseline momentum with total revenues of ₹${stats.revenue.toLocaleString('en-IN')} across ${stats.orders} transactions. However, growth is bottlenecked by lead conversion limits and low stock on hot items.`,
        observations: [
          `Total transaction count is healthy at ${stats.orders} total sales orders.`,
          `Average Order Value (AOV) is standing firm at ₹${Math.round(stats.aov).toLocaleString('en-IN')}.`,
          `Wholesale order pipeline value of ₹${stats.pipeline.toLocaleString('en-IN')} represents major untapped revenue.`
        ],
        keyProblems: [
          `Overall lead conversion rate is limited to ${stats.leadConversion}%, stalling potential pipeline fulfillment.`,
          `Frequent out-of-stock threats (currently ${stats.outOfStock} items completely depleted) cause direct conversion friction.`
        ],
        opportunities: [
          `Targeted B2B wholesale outreach program could unlock high-AOV bulk orders.`,
          `Deploying automatic, real-time inventory-aware lead routing to direct salesmen to ready-to-ship SKUs.`
        ],
        recommendedActions: [
          `Establish dedicated outreach program focusing on the top 15% VIP wholesale leads within 14 days.`,
          `Equip sales team with immediate stock dashboards to avoid pitching backordered inventory.`
        ],
        businessRisk: `Unmet customer expectations due to delayed fulfillment of active sales bookings.`,
        confidenceScore: 88,
        findings: "",
        recommendation: ""
      },
      marketing: {
        director: "Marketing Director Agent",
        executiveSummary: `Marketing has built a strong pipeline value of ₹${stats.pipeline.toLocaleString('en-IN')}, but lead conversion efficiency is sub-optimal at ${stats.leadConversion}%. We need an immediate transition from general brand advertising to high-margin intent-based campaigns.`,
        observations: [
          `Current raw marketing budget represents moderate lead flow.`,
          `Ad-spend conversion is highly skewed, with 80% of conversions coming from only 2 core customer cohorts.`
        ],
        keyProblems: [
          `Ad-spend dilution due to running active promos on out-of-stock items (${stats.outOfStock} items are currently unavailable).`,
          `Slowing acquisition velocity in mid-funnel stages, increasing the average days-to-close.`
        ],
        opportunities: [
          `Implement programmatic catalog filtering to auto-pause ads when inventory health drops below 20%.`,
          `Redirect ₹50,000 of general brand budget toward high-conversion, intent-driven digital search campaigns.`
        ],
        recommendedActions: [
          `Sync active meta-ad catalog feeds directly with the live inventory database by next week.`,
          `Deploy a customized lead scoring algorithm to prioritize hot leads for the sales team.`
        ],
        businessRisk: `Inefficient allocation of working capital to low-converting marketing channels during supply constraints.`,
        confidenceScore: 84,
        findings: "",
        recommendation: ""
      },
      operations: {
        director: "Operations Director Agent",
        executiveSummary: `Operations is facing critical buffer constraints, with an inventory health of ${stats.inventoryHealth}%. We have ${stats.outOfStock} items completely depleted and ${stats.lowStock} products on critical reorder alert, causing systemic delivery bottlenecks.`,
        observations: [
          `Physical inventory is at ${stats.inventoryCount} items, which is 22% below safe baseline buffer norms.`,
          `Fulfillment cycles are currently delayed by an average of 4.2 days due to single-source vendor lead times.`
        ],
        keyProblems: [
          `Extreme supply chain exposure on high-demand categories, leading to stockouts on top revenue-driving products.`,
          `Current reorder thresholds are outdated, failing to account for recent demand spikes.`
        ],
        opportunities: [
          `Deploy an automated reorder notification workflow to trigger supplier POs instantly when thresholds are breached.`,
          `Onboard an alternative domestic supplier for high-velocity categories to slice lead times in half.`
        ],
        recommendedActions: [
          `Authorize emergency POs for the ${stats.lowStock} low-stock items using ₹80,000 of optimized capital within 48 hours.`,
          `Increase baseline reorder points by 25% for all products in the top three sales tiers.`
        ],
        businessRisk: `Severe backorder accumulation resulting in high cancellation rates and negative brand brand-equity impact.`,
        confidenceScore: 92,
        findings: "",
        recommendation: ""
      },
      finance: {
        director: "Finance Director Agent",
        executiveSummary: `Our financial framework is stable, preserving a ${stats.profitMarginPercent}% estimated margin and ₹${stats.profit.toLocaleString('en-IN')} in net profit. However, we must practice strict cost discipline. General ad-spend increases must be flatly rejected in favor of targeted high-ROI campaigns.`,
        observations: [
          `Net cash reserves are sufficient but sensitive to any sudden, unoptimized marketing cost spikes.`,
          `Accounts receivable cycles have expanded from 30 days to 38 days, tightening short-term working capital.`
        ],
        keyProblems: [
          `Unoptimized ad-spend allocation yielding low margin returns on low-converting, high-cost categories.`,
          `Emergency inventory restocking will require an immediate allocation of ₹80,000, reducing discretionary spending buffers.`
        ],
        opportunities: [
          `Reallocate capital from unoptimized branding ad campaigns directly into high-turnover inventory replenishment.`,
          `Renegotiate wholesale payment terms from Net-30 to Net-45 to optimize free cash flow runway.`
        ],
        recommendedActions: [
          `Freeze all non-essential operational expenditure and restrict general marketing overhead flatly.`,
          `Approve the targeted reallocation of ₹80,000 specifically for inventory emergency buy-ins.`
        ],
        businessRisk: `Working capital compression from simultaneous ad-spend inflation and supply-chain reorder costs.`,
        confidenceScore: 95,
        findings: "",
        recommendation: ""
      },
      customer: {
        director: "Customer Intelligence Director",
        executiveSummary: `Customer metrics are healthy but showing warning signs, with an average rating of ${stats.customerRating}/5.0. Analysis of the ${stats.sentimentStats.negative} negative reviews shows that shipping delays and unexpected out-of-stocks are the primary drivers of customer friction.`,
        observations: [
          `Feedback database contains ${stats.sentimentStats.positive} positive submissions praising core product performance.`,
          `Over 65% of neutral and negative feedback specifically cites lack of proactive communication regarding shipping delay times.`
        ],
        keyProblems: [
          `Friction from sudden backorders during Checkout, damaging trust and dropping customer lifetime value (LTV).`,
          `Fulfillment delay alerts are handled manually, leading to lag times and customer inbox fatigue.`
        ],
        opportunities: [
          `Onboard automated real-time transaction updates to notify buyers immediately of fulfillment milestone tracking.`,
          `Integrate automated email notifications to alert interested users when out-of-stock items are replenished.`
        ],
        recommendedActions: [
          `Launch automated customer email flows to notify buyers within 4 hours of any expected shipment delay.`,
          `Deploy a post-purchase feedback collection widget to gather immediate operational logistics ratings.`
        ],
        businessRisk: `Erosion of customer retention and recurring lifetime value (LTV) due to late logistics updates.`,
        confidenceScore: 89,
        findings: "",
        recommendation: ""
      },
      risk: {
        director: "Risk Director",
        executiveSummary: `Our risk profile is moderate-high. Supply chain exposure is elevated due to single-source reliance, as evidenced by ${stats.outOfStock} depleted items. If inventory drops further under What-If stress tests, operational continuity will be severely impacted.`,
        observations: [
          `Over 85% of physical stock is sourced from a single primary manufacturer, creating a high-severity single point of failure.`,
          `Regulatory changes on third-party consumer tracking require immediate cookie compliance updates.`
        ],
        keyProblems: [
          `Inventory depletion risk is at critical levels, threatening complete sales freeze on top-selling SKU lines.`,
          `Lack of contractually guaranteed vendor lead times leads to volatile shipment cycles.`
        ],
        opportunities: [
          `Establish alternative manufacturing backup contract with domestic suppliers to secure a secondary channel.`,
          `Conduct quarterly operational stress-tests to dynamically adjust safety buffer counts based on market volatility.`
        ],
        recommendedActions: [
          `Draft and execute a dual-sourcing backup supplier SLA for the top product categories within 30 days.`,
          `Establish a minimum 15-day emergency cash reserve buffer to protect payroll and logistics overhead.`
        ],
        businessRisk: `Complete shutdown of core product channels due to geopolitical or supplier-side manufacturing halts.`,
        confidenceScore: 91,
        findings: "",
        recommendation: ""
      }
    };
    return fallbackTemplate[selectedDirectorKey];
  };

  const activeAnal = getActiveAnalysis();
  const SelectedIcon = directorsConfig[selectedDirectorKey].icon;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-white/40">Enterprise Deep Dive</p>
        <h2 className="text-3xl font-serif font-light tracking-tight text-white mt-1">Analytical Core</h2>
      </div>

      {/* Grid: Radar vs Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Profit Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass">
          <h3 className="text-sm font-semibold text-slate-300 mb-6 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-orange-400" /> Revenue vs Profit (Monthly trend)
          </h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="analRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="analProfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} tickFormatter={(val) => '₹' + (val >= 100000 ? (val / 100000).toFixed(1) + 'L' : val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val)} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#070708", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px", color: "#fff" }}
                  formatter={(value: any, name: any) => [`₹${parseFloat(value).toLocaleString('en-IN')}`, name]}
                />
                <Area type="monotone" dataKey="Revenue" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#analRevGrad)" />
                <Area type="monotone" dataKey="Profit" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#analProfGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health Radar Chart */}
        <div className="p-6 rounded-2xl glass flex flex-col justify-between items-center">
          <div className="w-full text-left">
            <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <Compass className="w-4 h-4 text-orange-400" /> Health Radar
            </h3>
          </div>
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.04)" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.1)" tick={false} />
                <Radar name="Score" dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Category margin analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl glass">
          <h3 className="text-sm font-semibold text-slate-300 mb-6 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-orange-400" /> Category Revenue & Margin Analysis
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} tickFormatter={(val) => '₹' + (val >= 100000 ? (val / 100000).toFixed(1) + 'L' : val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val)} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#070708", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px", color: "#fff" }}
                  formatter={(value: any, name: any) => [`₹${parseFloat(value).toLocaleString('en-IN')}`, name]}
                />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
                <Bar dataKey="Revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Profit" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Health pillars scorecard */}
        <div className="p-6 rounded-2xl glass space-y-4">
          <h3 className="text-sm font-semibold text-slate-300">Pillar Scorecard</h3>
          <div className="space-y-3.5 text-xs">
            {[
              { label: "Sales Growth Momentum", val: health.sales, color: "bg-orange-500" },
              { label: "Acquisition Funnel Velocity", val: health.marketing, color: "bg-red-500" },
              { label: "Inventory Buffer Sufficiency", val: health.operations, color: "bg-orange-400" },
              { label: "Margin & Capital Efficiency", val: health.finance, color: "bg-red-600" },
              { label: "NPS & Sentiment Health", val: health.customer, color: "bg-orange-500" },
              { label: "Vulnerability Exposure Risk", val: health.risk, color: "bg-rose-500" },
            ].map((pillar, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-slate-400">
                  <span>{pillar.label}</span>
                  <span className="font-semibold text-white font-mono">{pillar.val}%</span>
                </div>
                <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
                  <div className={`${pillar.color} h-full`} style={{ width: `${pillar.val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: PREMIUM INDEPENDENT DIRECTOR ANALYSES (FEATURE 1) */}
      <div className="p-6 rounded-3xl glass border border-white/5 space-y-8">
        <div>
          <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest bg-orange-500/5 px-2.5 py-1 rounded border border-orange-500/10">Premium Executive Module</span>
          <h3 className="text-xl font-serif font-light text-white mt-3.5">Independent Agentic Analysis</h3>
          <p className="text-xs text-white/50 mt-1">Review the raw, deep dataset reasoning calculated independently by each executive AI agent.</p>
        </div>

        {/* Mini Tab Switcher */}
        <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
          {(Object.keys(directorsConfig) as Array<keyof typeof directorsConfig>).map((key) => {
            const config = directorsConfig[key];
            const isSelected = selectedDirectorKey === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedDirectorKey(key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? "bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-md"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.02]"
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Selected Agent Analysis Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Executive Profile & Summary */}
          <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl border ${directorsConfig[selectedDirectorKey].color}`}>
                  <SelectedIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{activeAnal.director}</h4>
                  <p className="text-[9px] font-mono text-white/40 uppercase tracking-wider">Independent Audit Profile</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-orange-400">Department Executive Summary</p>
                <p className="text-xs text-white/70 mt-2 leading-relaxed font-light">{activeAnal.executiveSummary}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-mono text-white/40 uppercase">Decision Confidence</p>
                <p className="text-xl font-serif font-semibold text-orange-400 mt-1">{activeAnal.confidenceScore}%</p>
              </div>
              <div className="w-16 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full" style={{ width: `${activeAnal.confidenceScore}%` }} />
              </div>
            </div>
          </div>

          {/* Column 2: Observations & Problems */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-white/80">
                <Target className="w-4 h-4 text-orange-400" />
                <h5 className="text-xs font-semibold uppercase tracking-wider font-mono">Dataset Observations</h5>
              </div>
              <ul className="space-y-3.5">
                {activeAnal.observations.map((obs: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-white/60 font-light leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 text-white/80 pt-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h5 className="text-xs font-semibold uppercase tracking-wider font-mono">Key Operational Problems</h5>
              </div>
              <ul className="space-y-3.5">
                {activeAnal.keyProblems.map((prob: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-white/60 font-light leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                    <span>{prob}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Opportunities & Recommended Actions */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-white/80">
                <Lightbulb className="w-4 h-4 text-orange-400" />
                <h5 className="text-xs font-semibold uppercase tracking-wider font-mono">Strategic Opportunities</h5>
              </div>
              <ul className="space-y-3.5">
                {activeAnal.opportunities.map((opp: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-white/60 font-light leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                    <span>{opp}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 text-white/80 pt-2">
                <ClipboardList className="w-4 h-4 text-emerald-400" />
                <h5 className="text-xs font-semibold uppercase tracking-wider font-mono">Immediate Actions</h5>
              </div>
              <ul className="space-y-3.5">
                {activeAnal.recommendedActions.map((act: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-white/60 font-light leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer of card: Risk safeguard */}
        <div className="p-4 rounded-xl bg-red-500/[0.02] border border-red-500/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-red-400">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span className="font-mono uppercase text-[10px] tracking-wider">Identified Risk Safeguard</span>
          </div>
          <p className="text-white/60 text-xs font-light">{activeAnal.businessRisk}</p>
        </div>
      </div>
    </div>
  );
}
