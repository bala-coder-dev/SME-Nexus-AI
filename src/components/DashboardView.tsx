import { motion } from "motion/react";
import { TrendingUp, IndianRupee, Users, Award, Play, AlertCircle, ShoppingBag, CheckCircle, Package } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { MeetingSession } from "../types";

const getGrade = (score: number) => {
  if (score >= 95) return { grade: "A+", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
  if (score >= 88) return { grade: "A", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" };
  if (score >= 80) return { grade: "B", color: "text-orange-500 bg-orange-500/10 border-orange-500/20" };
  if (score >= 70) return { grade: "C", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" };
  return { grade: "D", color: "text-red-500 bg-red-500/10 border-red-500/20" };
};

interface DashboardViewProps {
  currentSession: MeetingSession | null;
  onConvene: () => void;
  defaultStats: any;
}

export default function DashboardView({ currentSession, onConvene, defaultStats }: DashboardViewProps) {
  // Use stats from active session or fallback to default precomputed statistics
  const stats = currentSession ? currentSession.stats : defaultStats;
  const health = currentSession ? currentSession.healthScores : { overall: 88, sales: 88, marketing: 82, operations: 83, finance: 56, customer: 91, risk: 80 };

  // Generate mock chart data over the last 6 months that maps logically to the computed stats
  const monthlyData = [
    { name: "2025-07", Revenue: Math.round(stats.revenue * 0.12), Profit: Math.round(stats.revenue * 0.12 * 0.56) },
    { name: "2025-08", Revenue: Math.round(stats.revenue * 0.18), Profit: Math.round(stats.revenue * 0.18 * 0.56) },
    { name: "2025-09", Revenue: Math.round(stats.revenue * 0.15), Profit: Math.round(stats.revenue * 0.15 * 0.56) },
    { name: "2025-10", Revenue: Math.round(stats.revenue * 0.16), Profit: Math.round(stats.revenue * 0.16 * 0.56) },
    { name: "2025-11", Revenue: Math.round(stats.revenue * 0.22), Profit: Math.round(stats.revenue * 0.22 * 0.56) },
    { name: "2025-12", Revenue: Math.round(stats.revenue * 0.17), Profit: Math.round(stats.revenue * 0.17 * 0.56) },
  ];

  const categoryData = [
    { name: "Electronics", Volume: Math.round(stats.revenue * 0.35) },
    { name: "Apparel", Volume: Math.round(stats.revenue * 0.22) },
    { name: "Home", Volume: Math.round(stats.revenue * 0.18) },
    { name: "Accessories", Volume: Math.round(stats.revenue * 0.13) },
    { name: "Wellness", Volume: Math.round(stats.revenue * 0.08) },
    { name: "Stationery", Volume: Math.round(stats.revenue * 0.04) },
  ].sort((a, b) => b.Volume - a.Volume);

  const funnelData = [
    { name: "New", count: Math.round(stats.totalLeads * 0.25) },
    { name: "Qualified", count: Math.round(stats.totalLeads * 0.3) },
    { name: "Proposal", count: Math.round(stats.totalLeads * 0.15) },
    { name: "Negotiation", count: Math.round(stats.totalLeads * 0.1) },
    { name: "Won", count: stats.wonLeads },
    { name: "Lost", count: Math.round(stats.totalLeads * 0.1) },
  ];

  const sentimentData = [
    { name: "Positive", value: stats.sentimentStats.positive, color: "#f97316" },
    { name: "Neutral", value: stats.sentimentStats.neutral, color: "rgba(255,255,255,0.2)" },
    { name: "Negative", value: stats.sentimentStats.negative, color: "#f43f5e" },
  ];

  // Gauge parameters
  const overall = health.overall;
  const needleAngle = (overall / 100) * 180;

  return (
    <div className="space-y-8 pb-16">
      {/* Header with Run Trigger */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Executive Overview</p>
          <h2 className="text-3xl font-serif font-light tracking-tight text-white mt-1">Business at a Glance</h2>
        </div>
        <button
          onClick={onConvene}
          className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 border border-orange-500/25 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98] cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" /> Convene the Board
        </button>
      </div>

      {/* Warning banner about mock mode if warning exists */}
      {currentSession?.warning && (
        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 animate-pulse" />
          <span>{currentSession.warning}</span>
        </div>
      )}

      {/* Row 1 KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI: Revenue */}
        <div className="p-6 rounded-2xl glass relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-transparent" />
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">Revenue (180D)</p>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 glow-cobalt animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2 mt-3.5">
            <span className="text-3xl font-serif font-light tracking-tight text-white">
              ₹{Math.round(stats.revenue).toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-white/40">{stats.orders} orders</span>
          </div>
          <div className="w-full bg-white/[0.04] h-[3px] rounded-full mt-4 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: "70%" }} />
          </div>
        </div>

        {/* KPI: Profit Margin */}
        <div className="p-6 rounded-2xl glass relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-transparent" />
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">Profit Margin</p>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 glow-emerald animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2 mt-3.5">
            <span className="text-3xl font-serif font-light tracking-tight text-white">
              {stats.profitMarginPercent}%
            </span>
            <span className="text-xs text-white/40">₹{Math.round(stats.profit).toLocaleString('en-IN')} net</span>
          </div>
          <div className="w-full bg-white/[0.04] h-[3px] rounded-full mt-4 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stats.profitMarginPercent}%` }} />
          </div>
        </div>

        {/* KPI: Marketing Leads Pipeline */}
        <div className="p-6 rounded-2xl glass relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-transparent" />
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">Pipeline Value</p>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 glow-cobalt animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2 mt-3.5">
            <span className="text-3xl font-serif font-light tracking-tight text-white">
              ₹{Math.round(stats.pipeline).toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-white/40">{stats.leadConversion}% conv</span>
          </div>
          <div className="w-full bg-white/[0.04] h-[3px] rounded-full mt-4 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${stats.leadConversion}%` }} />
          </div>
        </div>

        {/* KPI: Customer Satisfaction Rating */}
        <div className="p-6 rounded-2xl glass relative overflow-hidden group hover:border-rose-500/30 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-rose-500 to-transparent" />
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">Customer Rating</p>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 glow-rose animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2 mt-3.5">
            <span className="text-3xl font-serif font-light tracking-tight text-white">
              {stats.customerRating}
            </span>
            <span className="text-xs text-white/40">/ 5.0 rating</span>
          </div>
          <div className="w-full bg-white/[0.04] h-[3px] rounded-full mt-4 overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(stats.customerRating / 5) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Row 2 Charts Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Area Chart: Monthly Revenue & Profit */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">North Star</p>
            <h3 className="text-lg font-serif font-light text-white mt-1">Monthly Revenue & Profit</h3>
          </div>
          <div className="h-[280px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} tickFormatter={(val) => '₹' + (val >= 100000 ? (val / 100000).toFixed(1) + 'L' : val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val)} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#070708", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
                  formatter={(value: any, name: any) => [`₹${parseFloat(value).toLocaleString('en-IN')}`, name]}
                />
                <Area type="monotone" dataKey="Revenue" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="Profit" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Business Health Gauge Chart */}
        <div className="p-6 rounded-2xl glass flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">Strategic Health Analysis</p>
            <div className="flex justify-between items-baseline mt-1">
              <h3 className="text-lg font-serif font-light text-white">Boardroom ROI Impact</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getGrade(currentSession ? (currentSession.postMeetingHealth?.overall || overall + 8) : overall).color}`}>
                Grade {getGrade(currentSession ? (currentSession.postMeetingHealth?.overall || overall + 8) : overall).grade}
              </span>
            </div>
          </div>

          {/* Symmetrical comparison gauge layout */}
          <div className="my-6 grid grid-cols-2 gap-4 border-b border-white/5 pb-5">
            <div className="text-center p-3 rounded-xl bg-white/[0.01] border border-white/5">
              <p className="text-[9px] font-mono uppercase tracking-wider text-white/40">Pre-Meeting Baseline</p>
              <div className="mt-2 text-3xl font-serif text-white/60">{currentSession?.preMeetingHealth?.overall || overall}</div>
              <div className="mt-1 w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
                <div className="bg-white/20 h-full rounded-full" style={{ width: `${currentSession?.preMeetingHealth?.overall || overall}%` }} />
              </div>
            </div>

            <div className="text-center p-3 rounded-xl bg-orange-500/[0.02] border border-orange-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-8 h-8 bg-orange-500/10 rounded-bl-full flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-orange-400 -mr-1 -mt-1" />
              </div>
              <p className="text-[9px] font-mono uppercase tracking-wider text-orange-400">Post-Meeting Forecast</p>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-2 text-3xl font-serif text-orange-400 font-medium"
              >
                {currentSession?.postMeetingHealth?.overall || Math.min(100, overall + 8)}
              </motion.div>
              <div className="mt-1 w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${currentSession?.postMeetingHealth?.overall || Math.min(100, overall + 8)}%` }}
                  transition={{ duration: 1 }}
                  className="bg-orange-500 h-full rounded-full" 
                />
              </div>
            </div>
          </div>

          {/* Business rating breakdown sub-gauges with animated improvement details */}
          <div className="space-y-2.5">
            {[
              { label: "Sales & Conversion", key: "sales", pre: currentSession?.preMeetingHealth?.sales || health.sales, post: currentSession?.postMeetingHealth?.sales || Math.min(100, health.sales + 9) },
              { label: "Marketing Acquisition", key: "marketing", pre: currentSession?.preMeetingHealth?.marketing || health.marketing, post: currentSession?.postMeetingHealth?.marketing || Math.min(100, health.marketing + 13) },
              { label: "Operations & Inventory", key: "operations", pre: currentSession?.preMeetingHealth?.operations || health.operations, post: currentSession?.postMeetingHealth?.operations || Math.min(100, health.operations + 16) },
              { label: "Finance & Margin", key: "finance", pre: currentSession?.preMeetingHealth?.finance || health.finance, post: currentSession?.postMeetingHealth?.finance || Math.min(100, health.finance + 11) },
              { label: "Customer Intelligence", key: "customer", pre: currentSession?.preMeetingHealth?.customer || health.customer, post: currentSession?.postMeetingHealth?.customer || Math.min(100, health.customer + 7) },
              { label: "Vulnerability Risk", key: "risk", pre: currentSession?.preMeetingHealth?.risk || health.risk, post: currentSession?.postMeetingHealth?.risk || Math.min(100, health.risk + 15) },
            ].map((item) => {
              const gain = item.post - item.pre;
              return (
                <div key={item.key} className="text-left text-xs">
                  <div className="flex justify-between items-center text-[11px] font-mono text-white/70">
                    <span className="truncate">{item.label}</span>
                    <span className="flex items-center gap-1.5 text-[10px]">
                      <span className="text-white/40">{item.pre}</span>
                      <span className="text-orange-400">→</span>
                      <span className="text-orange-400 font-medium">{item.post}</span>
                      <span className="text-[10px] text-emerald-400">+{gain}%</span>
                    </span>
                  </div>
                  <div className="w-full bg-white/[0.02] h-1 rounded-full mt-1.5 flex overflow-hidden">
                    <div style={{ width: `${item.pre}%` }} className="bg-white/10 h-full rounded-l" />
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(gain / 100) * 100}%` }}
                      transition={{ duration: 1.2, delay: 0.1 }}
                      className="bg-orange-500 h-full rounded-r" 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3 Tri-Column Detailed Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Performance Bar Chart */}
        <div className="p-6 rounded-2xl glass">
          <h4 className="font-serif font-light text-white mb-4 text-sm tracking-tight">Category Performance</h4>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: -15, right: 10, top: 0, bottom: 0 }}>
                <XAxis type="number" stroke="#475569" fontSize={10} tickLine={false} tickFormatter={(val) => '₹' + (val >= 100000 ? (val / 100000).toFixed(1) + 'L' : val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val)} />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#070708", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(value: any, name: any) => [`₹${parseFloat(value).toLocaleString('en-IN')}`, name]}
                />
                <Bar dataKey="Volume" fill="#f97316" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Funnel Bar Chart */}
        <div className="p-6 rounded-2xl glass">
          <h4 className="font-serif font-light text-white mb-4 text-sm tracking-tight">Lead Funnel</h4>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ left: -25, right: 10, top: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#070708", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "11px" }}
                />
                <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Sentiment Donut Chart */}
        <div className="p-6 rounded-2xl glass flex flex-col justify-between">
          <h4 className="font-serif font-light text-white mb-4 text-sm tracking-tight">Customer Sentiment</h4>
          <div className="h-[150px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#070708", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "11px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-serif font-light text-white">{stats.sentimentStats.positive}</span>
              <span className="text-[9px] font-mono text-orange-400 uppercase tracking-widest">Positive</span>
            </div>
          </div>
          {/* Legend */}
          <div className="flex justify-around text-[10px] font-mono text-white/40 mt-4">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span>{stats.sentimentStats.positive} pos</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span>{stats.sentimentStats.neutral} neu</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>{stats.sentimentStats.negative} neg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4 Bottom Mini Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass flex justify-between items-center">
          <div>
            <p className="text-[10px] font-mono uppercase text-white/40">Inventory Health</p>
            <p className="text-2xl font-serif font-light text-white mt-2">{stats.inventoryHealth}%</p>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-mono text-white/60 rounded-lg bg-white/[0.02] border border-white/5">
            {stats.outOfStock} out of stock
          </span>
        </div>
        <div className="p-6 rounded-2xl glass flex justify-between items-center">
          <div>
            <p className="text-[10px] font-mono uppercase text-white/40">Orders & AOV</p>
            <p className="text-2xl font-serif font-light text-white mt-2">{stats.orders}</p>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-mono text-white/60 rounded-lg bg-white/[0.02] border border-white/5">
            AOV ₹{Math.round(stats.aov).toLocaleString('en-IN')}
          </span>
        </div>
        <div className="p-6 rounded-2xl glass flex justify-between items-center">
          <div>
            <p className="text-[10px] font-mono uppercase text-white/40">Won Leads</p>
            <p className="text-2xl font-serif font-light text-white mt-2">{stats.wonLeads} / {stats.totalLeads}</p>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-mono text-white/60 rounded-lg bg-white/[0.02] border border-white/5">
            {(stats.wonLeads / (stats.totalLeads || 1) * 100).toFixed(1)}% conversion
          </span>
        </div>
      </div>
    </div>
  );
}
