/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  WaterQualityRecord, 
  BudgetRecord, 
  SpawningRecord 
} from "../types";
import { 
  BrainCircuit, 
  Droplets, 
  Coins, 
  GitMerge, 
  Play, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Loader
} from "lucide-react";

interface AIAssistantModuleProps {
  waterQuality: WaterQualityRecord[];
  budgets: BudgetRecord[];
  spawning: SpawningRecord[];
  activeAISuggestion: { type: string, data: any } | null;
  onClearActiveAISuggestion: () => void;
}

export default function AIAssistantModule({
  waterQuality,
  budgets,
  spawning,
  activeAISuggestion,
  onClearActiveAISuggestion
}: AIAssistantModuleProps) {
  const [diagnosticType, setDiagnosticType] = useState<"water-quality" | "budget-forecast" | "breeding-success">("water-quality");
  const [selectedRecordId, setSelectedRecordId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosticResponse, setDiagnosticResponse] = useState<string | null>(null);
  
  // Set immediate focus from clicking "Analyze" across other tabs
  React.useEffect(() => {
    if (activeAISuggestion) {
      setDiagnosticType(activeAISuggestion.type as any);
      setSelectedRecordId(activeAISuggestion.data.id || "");
    }
  }, [activeAISuggestion]);

  // Retrieve matching active records
  const activeRecords = (() => {
    switch (diagnosticType) {
      case "water-quality":
        return waterQuality;
      case "budget-forecast":
        return budgets;
      case "breeding-success":
        return spawning;
      default:
        return [];
    }
  })();

  const handleRunDiagnostic = async () => {
    const targetRecord = activeRecords.find((rec: any) => rec.id === selectedRecordId) || activeRecords[0];
    if (!targetRecord) return;

    setIsLoading(true);
    setDiagnosticResponse(null);

    try {
      const res = await fetch("/api/gemini/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: diagnosticType,
          data: targetRecord
        })
      });
      const data = await res.json();
      setDiagnosticResponse(data.text || "Diagnostic cycle completed successfully.");
    } catch (error) {
      console.error(error);
      setDiagnosticResponse("Diagnostic query timed out or failed to connect to Gemini API on the server. Please verify your GEMINI_API_KEY.");
    } finally {
      setIsLoading(false);
      onClearActiveAISuggestion();
    }
  };

  return (
    <div id="ai-assistant-module-container" className="space-y-6">
      
      {/* Header bar */}
      <div className="bg-gradient-to-r from-sky-900 to-teal-950 border border-sky-850 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-lg shadow-sky-950/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-sky-950/80 tracking-widest text-[9px] uppercase border border-sky-800/60 text-cyan-300 font-bold rounded-full">Senior Advisor Core</span>
            <span className="flex items-center gap-1 text-[9px] tracking-wide text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-905/65 font-bold font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              ONLINE
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight">recxpats AI Bio-security Advisor</h2>
          <p className="text-xs text-sky-200 max-w-lg leading-relaxed">
            Diagnose micro-nutrient deficiencies, evaluate pond-water nitrite threshold toxicity indices, and analyze budget variances directly against active operational data.
          </p>
        </div>
        <BrainCircuit size={48} className="text-cyan-800 shrink-0 hidden md:block opacity-60" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left selector panel */}
        <div className="lg:col-span-1 bg-white/90 backdrop-blur-md border border-sky-100 p-5 rounded-2xl space-y-4 shadow-sm">
          <h3 className="font-bold text-sky-900 text-xs uppercase tracking-wider">Configure Diagnostic</h3>
          
          <div className="space-y-3">
            <label className="block text-sky-500 font-semibold text-[10px] uppercase">Analysis Division</label>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => { setDiagnosticType("water-quality"); setSelectedRecordId(""); }}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 text-xs font-semibold transition ${diagnosticType === "water-quality" ? "bg-sky-900 text-white border-sky-950 shadow-md shadow-sky-900/10" : "bg-sky-50/40 text-sky-900 border-sky-100/80 hover:bg-sky-100/50"}`}
              >
                <Droplets size={16} /> Water Parameter Bio-Toxicity
              </button>

              <button
                onClick={() => { setDiagnosticType("budget-forecast"); setSelectedRecordId(""); }}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 text-xs font-semibold transition ${diagnosticType === "budget-forecast" ? "bg-sky-900 text-white border-sky-950 shadow-md shadow-sky-900/10" : "bg-sky-50/40 text-sky-900 border-sky-100/80 hover:bg-sky-100/50"}`}
              >
                <Coins size={16} /> Budget Allocation Variance
              </button>

              <button
                onClick={() => { setDiagnosticType("breeding-success"); setSelectedRecordId(""); }}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 text-xs font-semibold transition ${diagnosticType === "breeding-success" ? "bg-sky-900 text-white border-sky-950 shadow-md shadow-sky-900/10" : "bg-sky-50/40 text-sky-900 border-sky-100/80 hover:bg-sky-100/50"}`}
              >
                <GitMerge size={16} /> Breeding potencies
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-sky-100">
            <label className="block text-sky-500 font-semibold text-[10px] uppercase">Select Active Record</label>
            <select
              value={selectedRecordId}
              onChange={(e) => setSelectedRecordId(e.target.value)}
              className="w-full p-2.5 bg-sky-50/40 border border-sky-100 text-sky-900 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-sky-300"
            >
              <option value="">-- Choose Data Subject --</option>
              {activeRecords.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.name || r.invoiceNumber || r.tankId}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRunDiagnostic}
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-sky-800 to-teal-800 text-white rounded-xl text-xs font-bold hover:from-sky-900 hover:to-teal-900 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-md shadow-sky-900/15"
          >
            {isLoading ? <Loader className="animate-spin" size={16} /> : <Play size={14} />}
            Evaluate with Senior Gemini AI
          </button>
        </div>
 
        {/* Right diagnostic viewport output */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-md border border-sky-100 p-6 rounded-2xl flex flex-col min-h-[400px]">
          <h3 className="font-bold text-sky-900 text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Cpu size={14} className="text-sky-500" /> Professional Advisor Insights Viewport
          </h3>

          <div className="flex-1 bg-white p-5 rounded-xl border border-sky-100 overflow-y-auto block relative">
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 p-6 text-center select-none bg-white/80">
                <Sparkles size={28} className="text-sky-800 animate-bounce" />
                <p className="text-xs font-bold text-sky-950">Processing operations chemistry and physics...</p>
                <p className="text-[10px] text-sky-600 max-w-xs leading-normal">Calculating bio-chemical decay metrics and formulating recovery roadmaps.</p>
              </div>
            ) : diagnosticResponse ? (
              <div className="text-xs text-sky-950 space-y-4 font-sans leading-relaxed">
                {diagnosticResponse.split("\n").map((line, idx) => {
                  const isHeader = line.startsWith("#");
                  const isListItem = line.startsWith("*") || line.startsWith("-");
                  return (
                    <p 
                      key={idx} 
                      className={`
                        ${isHeader ? 'font-bold text-sky-900 text-sm mt-3 pt-3 border-t border-sky-100/60 first:border-0 first:pt-0' : ''} 
                        ${isListItem ? 'pl-4 border-l-2 border-sky-500 py-0.5' : ''}
                      `}
                    >
                      {line.replace(/[#*\-]/g, "").trim()}
                    </p>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center select-none text-sky-400">
                <Lightbulb size={36} className="text-sky-350 mb-2 animate-pulse" />
                <p className="text-xs font-semibold text-sky-800">Ready for Operations Analysis</p>
                <p className="text-[10px] text-sky-500/80 max-w-sm mt-1">Configure diagnostic fields to evaluate compliance levels and trigger high-volume rescue procedures.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
