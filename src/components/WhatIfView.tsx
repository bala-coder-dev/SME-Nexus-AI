import { Sliders, HelpCircle, Sparkles, IndianRupee, Package, Megaphone, HeartHandshake } from "lucide-react";
import { WhatIfFactors } from "../types";

interface WhatIfViewProps {
  factors: WhatIfFactors;
  onChangeFactors: (factors: WhatIfFactors) => void;
  onReRun: () => void;
  isLoading: boolean;
}

export default function WhatIfView({ factors, onChangeFactors, onReRun, isLoading }: WhatIfViewProps) {
  const updateFactor = (key: keyof WhatIfFactors, val: number) => {
    onChangeFactors({
      ...factors,
      [key]: val,
    });
  };

  const handleReset = () => {
    onChangeFactors({
      revenueFactor: 1.0,
      inventoryFactor: 1.0,
      marketingBudgetFactor: 1.0,
      customerSatisfactionFactor: 1.0,
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Scenario modeling</p>
          <h2 className="text-3xl font-bold tracking-tight text-white mt-1">What-If Simulator</h2>
        </div>
        <button
          onClick={handleReset}
          className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] text-slate-300 border border-white/[0.08] text-xs font-semibold hover:bg-white/[0.08] transition-colors"
        >
          Reset multipliers
        </button>
      </div>

      {/* Description */}
      <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] flex gap-4">
        <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 h-fit">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Stress-test your business model</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-light mt-1.5">
            Adjust the sliders below to override baseline statistics derived from your raw CSV data. When you trigger a recalculation, the AI directors will formulate dynamic recommendations reflecting your new scenarios, triggering updated conflict pathways and strategic compromises from the CEO.
          </p>
        </div>
      </div>

      {/* Symmetrical slider layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sliders Grid */}
        <div className="space-y-6 p-6 rounded-2xl bg-white/[0.01] border border-white/[0.04]">
          {/* Slider 1: Revenue factor */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-blue-400" /> Revenue Multiplier
              </span>
              <span className="text-blue-400 font-mono font-bold bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                {factors.revenueFactor.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={factors.revenueFactor}
              onChange={(e) => updateFactor("revenueFactor", parseFloat(e.target.value))}
              className="w-full accent-blue-500 bg-white/[0.04] h-2 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.5x (Recession)</span>
              <span>1.0x Baseline</span>
              <span>2.0x (Hypergrowth)</span>
            </div>
          </div>

          {/* Slider 2: Inventory Stock level factor */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Package className="w-4 h-4 text-emerald-400" /> Inventory Stock Levels
              </span>
              <span className="text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                {factors.inventoryFactor.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={factors.inventoryFactor}
              onChange={(e) => updateFactor("inventoryFactor", parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-white/[0.04] h-2 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.5x (Supply Failure)</span>
              <span>1.0x Baseline</span>
              <span>2.0x (Buffer Surplus)</span>
            </div>
          </div>

          {/* Slider 3: Marketing Budget Factor */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-pink-400" /> Marketing Ad Allocation
              </span>
              <span className="text-pink-400 font-mono font-bold bg-pink-500/10 px-2.5 py-0.5 rounded border border-pink-500/20">
                {factors.marketingBudgetFactor.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={factors.marketingBudgetFactor}
              onChange={(e) => updateFactor("marketingBudgetFactor", parseFloat(e.target.value))}
              className="w-full accent-pink-500 bg-white/[0.04] h-2 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.5x (Austerity)</span>
              <span>1.0x Baseline</span>
              <span>2.0x (Campaign Push)</span>
            </div>
          </div>

          {/* Slider 4: Customer Satisfaction factor */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-purple-400" /> Customer Satisfaction
              </span>
              <span className="text-purple-400 font-mono font-bold bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20">
                {factors.customerSatisfactionFactor.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={factors.customerSatisfactionFactor}
              onChange={(e) => updateFactor("customerSatisfactionFactor", parseFloat(e.target.value))}
              className="w-full accent-purple-500 bg-white/[0.04] h-2 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.5x (High Churn)</span>
              <span>1.0x Baseline</span>
              <span>2.0x (Elite Loyalty)</span>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/[0.03] to-purple-500/[0.03] border border-white/[0.04] flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" /> Strategic Scenario Preview
            </h4>
            <div className="text-xs text-slate-400 leading-relaxed space-y-3">
              <p>
                - **Revenue Growth**: Simulates changes in overall transaction ticket size and demand.
              </p>
              <p>
                - **Inventory Adjustments**: Simulates manufacturing constraints or safety-stock buffers.
              </p>
              <p>
                - **Marketing Campaigns**: Controls pipeline lead volumes and CAC optimization pressures.
              </p>
              <p>
                - **Customer Loyalty**: Shifts reviews sentiment ratio distribution and star-ratings feedback.
              </p>
            </div>
          </div>

          <button
            onClick={onReRun}
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-white text-black hover:bg-slate-100 disabled:opacity-50 transition-all font-semibold text-sm flex items-center justify-center gap-2 shadow-xl shadow-white/5 active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-t-black border-slate-300 animate-spin" />
                Recalculating Strategy...
              </>
            ) : (
              "Re-calculate Boardroom Strategy"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
