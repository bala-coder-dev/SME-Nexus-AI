import { useRef } from "react";
import { Clipboard, Download, Printer, Check, Sparkles, FileText } from "lucide-react";
import { MeetingMinutes } from "../types";

interface MeetingMinutesViewProps {
  minutes: MeetingMinutes | null;
  warning?: string;
}

export default function MeetingMinutesView({ minutes, warning }: MeetingMinutesViewProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!minutes) {
    return (
      <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/[0.04] text-center space-y-3">
        <FileText className="w-8 h-8 text-slate-500 mx-auto" />
        <p className="text-sm text-slate-400 font-medium">No Executive Minutes available.</p>
        <p className="text-xs text-slate-500">Convene the board under the "Board Room" tab to record a new session.</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleCopyToClipboard = () => {
    const textToCopy = `
${minutes.title.toUpperCase()}
Date: ${minutes.date}
Attendees: ${minutes.attendees.join(", ")}

MEETING SUMMARY:
${minutes.summary}

KEY FINDINGS:
${minutes.keyFindings}

CONFLICTS RESOLVED:
${minutes.conflictsResolved}

ACTION ITEMS:
${minutes.actionItems}

FUTURE OUTLOOK & RECOMMENDATIONS:
${minutes.futureRecommendations}
    `;
    navigator.clipboard.writeText(textToCopy);
    alert("Board Meeting Minutes copied to clipboard!");
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(minutes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sme_nexus_minutes_${minutes.date.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Print styles applied dynamically inside a style tag to keep print formatting completely clean */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          #root {
            display: none !important;
          }
          .print-container {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 2rem !important;
            font-family: "Georgia", serif !important;
            background: white !important;
            color: #111111 !important;
          }
          .print-container h1, .print-container h2, .print-container h3 {
            color: #0c2340 !important;
            font-family: "Georgia", serif !important;
            border-bottom: 1px solid #cccccc !important;
            padding-bottom: 0.5rem !important;
          }
          .print-header {
            border-bottom: 3px double #0c2340 !important;
            margin-bottom: 2rem !important;
            padding-bottom: 1rem !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Corporate Records</p>
          <h2 className="text-3xl font-bold tracking-tight text-white mt-1 font-sans">Meeting Minutes</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyToClipboard}
            className="px-4 py-2.5 rounded-xl bg-white/[0.04] text-slate-300 border border-white/[0.08] text-xs font-semibold flex items-center gap-1.5 hover:bg-white/[0.08] transition-colors"
          >
            <Clipboard className="w-3.5 h-3.5" /> Copy text
          </button>
          <button
            onClick={handleDownloadJSON}
            className="px-4 py-2.5 rounded-xl bg-white/[0.04] text-slate-300 border border-white/[0.08] text-xs font-semibold flex items-center gap-1.5 hover:bg-white/[0.08] transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download JSON
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/25 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-indigo-600/10"
          >
            <Printer className="w-3.5 h-3.5" /> Print McKinsey PDF
          </button>
        </div>
      </div>

      {warning && (
        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs flex items-center gap-3 no-print">
          <Sparkles className="w-4 h-4" />
          <span>{warning}</span>
        </div>
      )}

      {/* McKinsey consulting report layout document */}
      <div
        ref={printAreaRef}
        className="print-container p-8 md:p-12 rounded-2xl bg-white text-slate-900 border border-white/[0.08] font-serif max-w-4xl mx-auto shadow-2xl relative overflow-hidden"
      >
        {/* McKinsey double-rule header border */}
        <div className="print-header border-b-2 border-slate-900 pb-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Advisory Memorandum</p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans mt-1">SME NEXUS AI EXECUTIVE BOARD</h1>
              <p className="text-xs font-mono text-slate-500 mt-1 uppercase tracking-wide">Board Proceedings & Action Directives</p>
            </div>
            <div className="text-right text-xs font-mono text-slate-500">
              <p>Doc ID: SME-{minutes.date.replace(/\//g, "-")}</p>
              <p className="mt-1">{minutes.date}</p>
            </div>
          </div>
        </div>

        {/* Meeting metadata fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans pb-6 border-b border-slate-200 mb-8">
          <div className="space-y-1.5">
            <p className="text-slate-500 uppercase font-mono tracking-wider text-[10px]">Title of Assembly</p>
            <p className="font-semibold text-slate-800 text-sm">{minutes.title}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-slate-500 uppercase font-mono tracking-wider text-[10px]">Constituted Attendees</p>
            <p className="font-light text-slate-800 leading-relaxed text-xs">
              {minutes.attendees.join(" • ")}
            </p>
          </div>
        </div>

        {/* Section 1: executive summary */}
        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-sans uppercase tracking-wide border-b border-slate-200 pb-2">
              1.0 Executive Summary
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed font-light text-justify">
              {minutes.summary}
            </p>
          </section>

          {/* Section 2: key findings */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-sans uppercase tracking-wide border-b border-slate-200 pb-2">
              2.0 Core Analytical Findings
            </h2>
            <div className="text-sm text-slate-700 leading-relaxed font-light space-y-1 text-justify whitespace-pre-line">
              {minutes.keyFindings}
            </div>
          </section>

          {/* Section 3: conflicts resolved */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-sans uppercase tracking-wide border-b border-slate-200 pb-2">
              3.0 Conflict Resolution & CEO arbitration
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed font-light text-justify">
              {minutes.conflictsResolved}
            </p>
          </section>

          {/* Section 4: action items */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-sans uppercase tracking-wide border-b border-slate-200 pb-2">
              4.0 Action Items & Directives
            </h2>
            <div className="text-sm text-slate-700 leading-relaxed font-light space-y-1 text-justify whitespace-pre-line">
              {minutes.actionItems}
            </div>
          </section>

          {/* Section 5: future outlook */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-sans uppercase tracking-wide border-b border-slate-200 pb-2">
              5.0 Strategic Horizon Outlook
            </h2>
            <div className="text-sm text-slate-700 leading-relaxed font-light space-y-1 text-justify whitespace-pre-line">
              {minutes.futureRecommendations}
            </div>
          </section>
        </div>

        {/* Corporate Footer sign-off */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-center font-sans text-[10px] text-slate-400">
          <p className="uppercase tracking-widest font-semibold">SME Nexus Board Administration Services</p>
          <p className="mt-1">CONFIDENTIAL • FOR SME EXECUTIVE AUDIENCE ONLY • COPYRIGHT © 2026</p>
        </div>
      </div>
    </div>
  );
}
