import React, { useState, useRef } from "react";
import { Upload, CheckCircle, AlertTriangle, RefreshCw, FileSpreadsheet, Eye, Clipboard } from "lucide-react";
import { SalesRecord, InventoryRecord, LeadRecord, ReviewRecord } from "../types";

interface DataViewProps {
  sales: SalesRecord[];
  inventory: InventoryRecord[];
  leads: LeadRecord[];
  reviews: ReviewRecord[];
  onUpload: (type: 'sales' | 'inventory' | 'leads' | 'reviews', data: any[]) => void;
  onResetDemo: () => void;
}

export default function DataView({ sales, inventory, leads, reviews, onUpload, onResetDemo }: DataViewProps) {
  const [dragActive, setDragActive] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activePreview, setActivePreview] = useState<'sales' | 'inventory' | 'leads' | 'reviews'>('sales');
  const [templateTab, setTemplateTab] = useState<'sales' | 'inventory' | 'leads' | 'reviews'>('sales');
  const [copiedState, setCopiedState] = useState<string | null>(null);

  const templates = {
    sales: `order_id,date,product_name,category,channel,quantity,revenue
ORD-011,2026-06-10,Enterprise ERP Suite,Software,Direct,1,8500
ORD-012,2026-06-11,Pro Analytics Hub,Software,Online,3,3600
ORD-013,2026-06-12,Hardware Terminal,Hardware,Retail,5,4500
ORD-014,2026-06-13,SME Cloud Server,Infrastructure,Online,2,2400
ORD-015,2026-06-14,Security Gateway,Hardware,Direct,1,1500`,
    inventory: `product_id,product_name,category,stock,reorder_level,status,unit_cost
PRD-201,Enterprise ERP Suite,Software,250,50,In Stock,120
PRD-202,Pro Analytics Hub,Software,15,30,Low Stock,80
PRD-203,Hardware Terminal,Hardware,8,15,Low Stock,450
PRD-204,SME Cloud Server,Infrastructure,0,10,Out of Stock,600
PRD-205,Security Gateway,Hardware,42,20,In Stock,350`,
    leads: `lead_id,source,budget,stage,value,conversion_prob,date
LEA-501,LinkedIn Ads,15000,Won,12000,100,2026-06-01
LEA-502,Google Search,8000,Proposal,6400,65,2026-06-03
LEA-503,Direct Referral,25000,Negotiation,20000,80,2026-06-05
LEA-504,Cold Outreach,5000,Contacted,1500,20,2026-06-08
LEA-505,Industry Event,35000,Lost,0,0,2026-06-10`,
    reviews: `review_id,date,product_name,rating,sentiment,text
REV-801,2026-06-15,Enterprise ERP Suite,5,Positive,Remarkable automation capabilities. Saved us 15 hours/week!
REV-802,2026-06-16,Pro Analytics Hub,4,Positive,The real-time analytics are incredibly robust.
REV-803,2026-06-17,Hardware Terminal,3,Neutral,Solid construction but delivery took 8 business days.
REV-804,2026-06-18,SME Cloud Server,1,Negative,Frequent server out-of-stock messages delayed our scaling plan.
REV-805,2026-06-19,Security Gateway,5,Positive,Perfect defense. Setup took less than 10 minutes.`
  };

  const handleCopyTemplate = (key: 'sales' | 'inventory' | 'leads' | 'reviews') => {
    navigator.clipboard.writeText(templates[key]);
    setCopiedState(key);
    setTimeout(() => setCopiedState(null), 2000);
  };

  const fileInputRefs = {
    sales: useRef<HTMLInputElement>(null),
    inventory: useRef<HTMLInputElement>(null),
    leads: useRef<HTMLInputElement>(null),
    reviews: useRef<HTMLInputElement>(null),
  };

  // Compute stats and diagnostics for the current active data
  const getQualityDiagnostics = (type: 'sales' | 'inventory' | 'leads' | 'reviews', dataset: any[]) => {
    if (!dataset || dataset.length === 0) return { score: 0, missingCount: 0, columns: [] };
    
    const sample = dataset[0];
    const columns = Object.keys(sample);
    let missingCount = 0;
    let totalCells = dataset.length * columns.length;

    dataset.forEach(row => {
      columns.forEach(col => {
        if (row[col] === undefined || row[col] === null || row[col] === "" || (typeof row[col] === "number" && isNaN(row[col]))) {
          missingCount++;
        }
      });
    });

    const score = Math.round(((totalCells - missingCount) / totalCells) * 100);
    return { score, missingCount, columns };
  };

  const salesDiag = getQualityDiagnostics('sales', sales);
  const invDiag = getQualityDiagnostics('inventory', inventory);
  const leadsDiag = getQualityDiagnostics('leads', leads);
  const reviewsDiag = getQualityDiagnostics('reviews', reviews);
  const hasData = sales.length > 0;

  // Simple CSV parser
  const parseCSV = (text: string, type: string) => {
    const lines = text.split("\n").map(l => l.trim()).filter(l => l !== "");
    if (lines.length < 2) throw new Error("File must contain a header and at least one data row.");

    const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, ""));
    const dataRows = lines.slice(1);

    // Validate minimum column requirements based on type
    const requiredCols: Record<string, string[]> = {
      sales: ["revenue", "quantity"],
      inventory: ["stock", "product_name"],
      leads: ["stage", "value"],
      reviews: ["rating", "sentiment"]
    };

    const missingRequired = requiredCols[type].filter(col => 
      !headers.some(h => h.toLowerCase() === col || h.toLowerCase().includes(col))
    );

    if (missingRequired.length > 0) {
      throw new Error(`CSV is missing required indicators/columns: ${missingRequired.join(", ")}`);
    }

    const parsed = dataRows.map((line, idx) => {
      // Handle commas inside quotes
      const values: string[] = [];
      let currentVal = "";
      let insideQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' || char === "'") {
          insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
          values.push(currentVal.trim().replace(/^["']|["']$/g, ""));
          currentVal = "";
        } else {
          currentVal += char;
        }
      }
      values.push(currentVal.trim().replace(/^["']|["']$/g, ""));

      // Map values to header keys
      const rowObj: any = {};
      headers.forEach((hdr, i) => {
        let val: any = values[i] || "";
        // Auto-type casting
        if (!isNaN(val) && val !== "") {
          val = val.includes(".") ? parseFloat(val) : parseInt(val, 10);
        }
        rowObj[hdr.toLowerCase().replace(/\s+/g, "_")] = val;
      });

      return rowObj;
    });

    return parsed;
  };

  const handleFile = (file: File, type: 'sales' | 'inventory' | 'leads' | 'reviews') => {
    if (!file.name.endsWith(".csv")) {
      setErrorMsg("Please upload a valid CSV file (.csv format only)");
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsedData = parseCSV(text, type);
        onUpload(type, parsedData);
        setSuccessMsg(`Successfully imported ${parsedData.length} records into ${type.toUpperCase()}!`);
        setTimeout(() => setSuccessMsg(null), 4000);
      } catch (err: any) {
        setErrorMsg(`Import failed: ${err.message || "Unknown schema mismatch"}`);
        setTimeout(() => setErrorMsg(null), 5000);
      }
    };
    reader.readAsText(file);
  };

  const onDrag = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(type);
    } else if (e.type === "dragleave") {
      setDragActive(null);
    }
  };

  const onDrop = (e: React.DragEvent, type: 'sales' | 'inventory' | 'leads' | 'reviews') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0], type);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
            {hasData ? "Datasets Management" : "DATASETS CONNECTION"}
          </p>
          <h2 className="text-3xl font-serif font-light tracking-tight text-white mt-1">
            {hasData ? "Upload Your Datasets" : "Activate Your AI Executive Board"}
          </h2>
          {!hasData && (
            <p className="text-xs text-white/40 mt-1 max-w-xl leading-relaxed">
              SME Nexus AI requires business datasets to convene the autonomous board and run simulators. Please paste or drop your CSV files below to instantly configure.
            </p>
          )}
        </div>
      </div>

      {/* Message alerts */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Row 1 Stats Diagnostics Grid - ONLY visible after data is connected */}
      {hasData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { key: 'sales', label: "Sales", records: sales.length, diag: salesDiag },
            { key: 'inventory', label: "Inventory", records: inventory.length, diag: invDiag },
            { key: 'leads', label: "Leads", records: leads.length, diag: leadsDiag },
            { key: 'reviews', label: "Reviews", records: reviews.length, diag: reviewsDiag },
          ].map(({ key, label, records, diag }) => (
            <div
              key={key}
              onClick={() => setActivePreview(key as any)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                activePreview === key
                  ? "bg-orange-500/[0.02] border-orange-500/40 shadow-orange-500/5 shadow-md"
                  : "glass hover:border-orange-500/20"
              }`}
            >
              <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">{label}</p>
              <p className="text-3xl font-serif font-light text-white mt-2">{records}</p>
              <p className="text-[10px] text-white/40 font-mono mt-1">records</p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5 text-[10px] font-mono">
                <span className="text-white/40">Quality score:</span>
                <span className={`font-semibold ${diag.score >= 95 ? "text-orange-400" : diag.score >= 80 ? "text-amber-500" : "text-rose-400"}`}>
                  {diag.score}%
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                <span className="text-white/40">Missing fields:</span>
                <span className={`font-semibold ${diag.missingCount === 0 ? "text-white/40" : "text-orange-400"}`}>
                  {diag.missingCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Row 2 Drag and Drop CSV upload Panel */}
      <div className="p-6 rounded-2xl glass">
        <h3 className="text-sm font-serif font-light text-white mb-4">Upload CSV Files</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { key: 'sales', label: "Sales", desc: "Order-level revenue, channel, product" },
            { key: 'inventory', label: "Inventory", desc: "Stock, cost pricing, reorder indicators" },
            { key: 'leads', label: "Leads", desc: "Pipeline budget, source, lead stages" },
            { key: 'reviews', label: "Reviews", desc: "Ratings, text segments, sentiment labels" },
          ].map(({ key, label, desc }) => (
            <div
              key={key}
              onDragEnter={(e) => onDrag(e, key)}
              onDragOver={(e) => onDrag(e, key)}
              onDragLeave={(e) => onDrag(e, key)}
              onDrop={(e) => onDrop(e, key as any)}
              onClick={() => fileInputRefs[key as 'sales' | 'inventory' | 'leads' | 'reviews'].current?.click()}
              className={`p-6 rounded-xl border-2 border-dashed flex items-center gap-4 cursor-pointer transition-all ${
                dragActive === key
                  ? "border-orange-500 bg-orange-500/5"
                  : "border-white/5 bg-white/[0.01] hover:border-orange-500/20"
              }`}
            >
              <input
                ref={fileInputRefs[key as 'sales' | 'inventory' | 'leads' | 'reviews']}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], key as any)}
              />
              <div className="p-3.5 rounded-xl bg-white/[0.02] text-white/50 flex-shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white">{label} CSV</h4>
                <p className="text-xs text-white/40 truncate mt-1">{desc}</p>
                <p className="text-[10px] text-white/30 font-mono mt-1.5 uppercase tracking-widest">Click or drag & drop</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3 Table Previews - brought UP directly beneath uploads */}
      {hasData && (
        <div className="p-6 rounded-2xl glass space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-serif font-light text-white">
                Dataset Preview · {activePreview.toUpperCase()}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              {(activePreview === 'sales' ? sales : activePreview === 'inventory' ? inventory : activePreview === 'leads' ? leads : reviews).length} records connected
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/5 max-h-[400px] overflow-y-auto scrollbar-thin">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white/[0.02] text-white/40 border-b border-white/5 font-mono text-[10px] uppercase sticky top-0 z-10 backdrop-blur-md">
                  {activePreview === 'sales' && (
                    <>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Channel</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Revenue (₹)</th>
                    </>
                  )}
                  {activePreview === 'inventory' && (
                    <>
                      <th className="p-3">Product ID</th>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Stock Level</th>
                      <th className="p-3">Reorder Point</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Cost (₹)</th>
                    </>
                  )}
                  {activePreview === 'leads' && (
                    <>
                      <th className="p-3">Lead ID</th>
                      <th className="p-3">Source</th>
                      <th className="p-3">Budget (₹)</th>
                      <th className="p-3">Stage</th>
                      <th className="p-3">Value (₹)</th>
                      <th className="p-3">Probability</th>
                    </>
                  )}
                  {activePreview === 'reviews' && (
                    <>
                      <th className="p-3">Review ID</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3">Sentiment</th>
                      <th className="p-3">Review Text</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {activePreview === 'sales' && sales.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5 text-white/80 hover:bg-white/[0.01]">
                    <td className="p-3 font-mono text-white/50">{row.order_id}</td>
                    <td className="p-3">{row.date}</td>
                    <td className="p-3">{row.product_name}</td>
                    <td className="p-3 text-white/40">{row.category}</td>
                    <td className="p-3 text-white/40">{row.channel}</td>
                    <td className="p-3 font-mono">{row.quantity}</td>
                    <td className="p-3 font-semibold text-white">₹{Number(row.revenue).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
                {activePreview === 'inventory' && inventory.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5 text-white/80 hover:bg-white/[0.01]">
                    <td className="p-3 font-mono text-white/50">{row.product_id}</td>
                    <td className="p-3">{row.product_name}</td>
                    <td className="p-3 text-white/40">{row.category}</td>
                    <td className="p-3 font-mono">{row.stock}</td>
                    <td className="p-3 font-mono">{row.reorder_level}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        row.status === 'In Stock' ? "bg-orange-500/10 text-orange-400" : row.status === 'Low Stock' ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono">₹{Number(row.unit_cost).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
                {activePreview === 'leads' && leads.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5 text-white/80 hover:bg-white/[0.01]">
                    <td className="p-3 font-mono text-white/50">{row.lead_id}</td>
                    <td className="p-3">{row.source}</td>
                    <td className="p-3 font-mono">₹{row.budget?.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-white/[0.02] text-white/60 text-[10px] font-mono uppercase border border-white/5">
                        {row.stage}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-semibold text-white">₹{row.value?.toLocaleString('en-IN')}</td>
                    <td className="p-3 font-mono">{row.conversion_prob}%</td>
                  </tr>
                ))}
                {activePreview === 'reviews' && reviews.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5 text-white/80 hover:bg-white/[0.01]">
                    <td className="p-3 font-mono text-white/50">{row.review_id}</td>
                    <td className="p-3">{row.date}</td>
                    <td className="p-3">{row.product_name}</td>
                    <td className="p-3 text-orange-400 font-bold">{"★".repeat(row.rating)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        row.sentiment === 'Positive' ? "bg-orange-500/10 text-orange-400" : row.sentiment === 'Neutral' ? "bg-white/[0.02] text-white/50 border border-white/5" : "bg-rose-500/10 text-rose-400"
                      }`}>
                        {row.sentiment}
                      </span>
                    </td>
                    <td className="p-3 text-white/55 max-w-xs truncate">{row.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CSV Guidelines & Copyable Templates Section - Moved DOWN */}
      <div className="p-6 rounded-2xl glass space-y-6">
        <div>
          <h3 className="text-sm font-serif font-light text-white">SME Ready-Made CSV Templates</h3>
          <p className="text-xs text-white/40 mt-1">
            Review column requirements, copy valid CSV templates, and drop them into the uploads above to stress-test our Executive Agents.
          </p>
        </div>

        {/* Inner Tabs for templates */}
        <div className="flex border-b border-white/5 pb-2 overflow-x-auto gap-2">
          {(['sales', 'inventory', 'leads', 'reviews'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTemplateTab(key)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                templateTab === key
                  ? "bg-orange-500/10 text-orange-400 border-orange-500/20 font-bold"
                  : "text-white/40 hover:text-white/70 bg-transparent border-transparent"
              }`}
            >
              {key} Format
            </button>
          ))}
        </div>

        {/* Tab Content Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Required columns descriptions */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-orange-400">Schema Specification</h4>
            <div className="space-y-3.5">
              {templateTab === 'sales' && (
                <>
                  <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                    <p className="text-xs font-semibold text-white">revenue <span className="text-[10px] text-orange-400 font-mono">(Required)</span></p>
                    <p className="text-[11px] text-white/50">Numeric sales amount in INR (₹). Critical for Sales, Finance, and Risk algorithms.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                    <p className="text-xs font-semibold text-white">quantity <span className="text-[10px] text-orange-400 font-mono">(Required)</span></p>
                    <p className="text-[11px] text-white/50">Integer value of item units sold in the transaction. Triggers Operations tracking.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                    <p className="text-xs font-semibold text-white">Optional Fields</p>
                    <p className="text-[11px] text-white/50"><code>order_id</code>, <code>date</code>, <code>product_name</code>, <code>category</code>, <code>channel</code>.</p>
                  </div>
                </>
              )}
              {templateTab === 'inventory' && (
                <>
                  <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                    <p className="text-xs font-semibold text-white">stock <span className="text-[10px] text-orange-400 font-mono">(Required)</span></p>
                    <p className="text-[11px] text-white/50">Integer of physical units left in warehouse. High values boost fulfillment security.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                    <p className="text-xs font-semibold text-white">product_name <span className="text-[10px] text-orange-400 font-mono">(Required)</span></p>
                    <p className="text-[11px] text-white/50">Text name identifying the stock. Cross-referenced against Sales and Reviews.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                    <p className="text-xs font-semibold text-white">Optional Fields</p>
                    <p className="text-[11px] text-white/50"><code>product_id</code>, <code>category</code>, <code>reorder_level</code>, <code>status</code>, <code>unit_cost</code>.</p>
                  </div>
                </>
              )}
              {templateTab === 'leads' && (
                <>
                  <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                    <p className="text-xs font-semibold text-white">stage <span className="text-[10px] text-orange-400 font-mono">(Required)</span></p>
                    <p className="text-[11px] text-white/50">Funnel progress indicator: <code>Won</code>, <code>Proposal</code>, <code>Negotiation</code>, <code>Contacted</code>, <code>Lost</code>.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                    <p className="text-xs font-semibold text-white">value <span className="text-[10px] text-orange-400 font-mono">(Required)</span></p>
                    <p className="text-[11px] text-white/50">Total estimated deal value in INR (₹). Triggers Marketing Lead Pipeline valuations.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                    <p className="text-xs font-semibold text-white">Optional Fields</p>
                    <p className="text-[11px] text-white/50"><code>lead_id</code>, <code>source</code>, <code>budget</code>, <code>conversion_prob</code>, <code>date</code>.</p>
                  </div>
                </>
              )}
              {templateTab === 'reviews' && (
                <>
                  <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                    <p className="text-xs font-semibold text-white">rating <span className="text-[10px] text-orange-400 font-mono">(Required)</span></p>
                    <p className="text-[11px] text-white/50">Integer from 1 to 5. Used to calculate overall customer intelligence health index.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                    <p className="text-xs font-semibold text-white">sentiment <span className="text-[10px] text-orange-400 font-mono">(Required)</span></p>
                    <p className="text-[11px] text-white/50">NPS classifier tags: <code>Positive</code>, <code>Neutral</code>, <code>Negative</code>.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                    <p className="text-xs font-semibold text-white">Optional Fields</p>
                    <p className="text-[11px] text-white/50"><code>review_id</code>, <code>date</code>, <code>product_name</code>, <code>text</code>.</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Copyable codeblock */}
          <div className="lg:col-span-7 flex flex-col justify-between p-4 rounded-xl border border-white/5 bg-black/40 relative">
            <div className="flex justify-between items-center pb-2.5 mb-2.5 border-b border-white/5">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{templateTab}_template.csv</span>
              <button
                onClick={() => handleCopyTemplate(templateTab)}
                className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-[11px] flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <Clipboard className="w-3.5 h-3.5" />
                {copiedState === templateTab ? "Copied!" : "Copy Template Data"}
              </button>
            </div>
            <pre className="font-mono text-[10.5px] text-white/80 overflow-x-auto leading-relaxed whitespace-pre p-2 bg-black/50 rounded-lg scrollbar-thin select-all">
              {templates[templateTab]}
            </pre>
            <p className="text-[9px] text-white/30 font-mono mt-3">
              💡 Save this copied content as a <b>.csv</b> text file (e.g., <code>{templateTab}_test.csv</code>) on your computer, then drag it into the active upload box above!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
