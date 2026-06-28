import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Database, 
  Wifi, 
  Activity, 
  Cpu, 
  Server, 
  Terminal, 
  Send, 
  Sparkles, 
  ArrowRight,
  Info,
  Clock,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { motion, AnimatePresence } from "motion/react";

interface SyncTable {
  model: string;
  localCount: number;
  supabaseCount: number;
  synced: boolean;
}

interface SupabaseStatus {
  configured: boolean;
  active: boolean;
  tableExists: boolean;
  tableError: string;
  latencyMs?: number;
  tables?: SyncTable[];
}

interface SupabaseHealthDashboardProps {
  status: SupabaseStatus;
  isRechecking: boolean;
  onRefresh: () => Promise<void>;
  onClose?: () => void;
}

interface TelemetryLog {
  id: string;
  timestamp: string;
  type: "info" | "success" | "error" | "warning";
  message: string;
}

export default function SupabaseHealthDashboard({ 
  status, 
  isRechecking, 
  onRefresh, 
  onClose 
}: SupabaseHealthDashboardProps) {
  const [latencyHistory, setLatencyHistory] = useState<Array<{ name: string; latency: number }>>([]);
  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success?: boolean; message?: string; totalSynced?: number } | null>(null);
  const [activeTab, setActiveTab] = useState<"health" | "tables" | "telemetry">("health");
  const [supabaseConfig, setSupabaseConfig] = useState<{ supabaseUrl: string } | null>(null);

  // Add initial log entry
  const addLog = (message: string, type: "info" | "success" | "error" | "warning" = "info") => {
    const newLog: TelemetryLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
      type,
      message
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs
  };

  // Fetch Supabase URL on mount
  useEffect(() => {
    fetch("/api/supabase/config")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP Error ${res.status} ${res.statusText || ""}`);
        }
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("Received non-JSON HTML response (possibly static routing or server is offline)");
        }
        try {
          return await res.json();
        } catch (parseErr: any) {
          throw new Error(`Invalid JSON format: ${parseErr.message}`);
        }
      })
      .then(data => {
        if (data && data.supabaseUrl) {
          setSupabaseConfig({ supabaseUrl: data.supabaseUrl });
          addLog(`Supabase API target resolved: ${data.supabaseUrl.substring(0, 25)}...`, "info");
        } else {
          addLog("No Supabase connection string found in server environment.", "warning");
        }
      })
      .catch(err => {
        addLog(`Could not load Supabase configuration: ${err.message}. Operating in offline-first mode.`, "warning");
      });
  }, []);

  // Update latency history and log status whenever status props change
  useEffect(() => {
    if (status.configured) {
      const lat = status.latencyMs !== undefined && status.latencyMs !== -1 ? status.latencyMs : 0;
      if (lat > 0) {
        setLatencyHistory(prev => {
          const next = [...prev, { name: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), latency: lat }];
          return next.slice(-12); // Keep last 12 data points
        });
        
        if (lat < 100) {
          addLog(`Diagnostic Ping verified. Latency: ${lat}ms (Excellent connection)`, "success");
        } else if (lat < 300) {
          addLog(`Diagnostic Ping verified. Latency: ${lat}ms (Moderate delay)`, "warning");
        } else {
          addLog(`Diagnostic Ping verified. Latency: ${lat}ms (High database latency)`, "warning");
        }
      }
      
      if (status.tableError) {
        addLog(`Database Table Error: ${status.tableError}`, "error");
      }
    } else {
      addLog("Supabase cloud is currently unconfigured. Running in local SQLite/JSON fallback mode.", "info");
    }
  }, [status]);

  const handleManualPing = async () => {
    addLog("Sending manual ping and latency diagnostics...", "info");
    const start = Date.now();
    try {
      await onRefresh();
      const delay = Date.now() - start;
      addLog(`Ping back-and-forth complete in ${delay}ms`, "success");
    } catch (err: any) {
      addLog(`Ping failed: ${err.message}`, "error");
    }
  };

  const handleForceSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    addLog("Initiating full multi-model state mirroring to Supabase...", "info");

    try {
      const res = await fetch("/api/supabase/sync", {
        method: "POST"
      });
      const data = await res.json();
      
      if (res.ok) {
        setSyncResult({
          success: true,
          message: data.message,
          totalSynced: data.totalSynced
        });
        addLog(`Mirroring complete! ${data.totalSynced} records successfully pushed to Cloud.`, "success");
        await onRefresh();
      } else {
        setSyncResult({
          success: false,
          message: data.error || "Mirroring operation failed."
        });
        addLog(`Mirroring aborted: ${data.error}`, "error");
      }
    } catch (err: any) {
      setSyncResult({
        success: false,
        message: err.message
      });
      addLog(`Network fault during sync: ${err.message}`, "error");
    } finally {
      setIsSyncing(false);
    }
  };

  // Compute overall status message
  const getStatusBadge = () => {
    if (!status.configured) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <Wifi className="w-3.5 h-3.5 text-slate-400" />
          Offline-First Fallback
        </span>
      );
    }
    if (!status.tableExists) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          Table Missing (Pending Provision)
        </span>
      );
    }
    if (status.tableError && status.tableError.toLowerCase().includes("permission")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
          RLS Policy Restricted
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
        Live Connected
      </span>
    );
  };

  const avgLatency = latencyHistory.length > 0 
    ? Math.round(latencyHistory.reduce((acc, curr) => acc + curr.latency, 0) / latencyHistory.length) 
    : (status.latencyMs && status.latencyMs > 0 ? status.latencyMs : 0);

  const maxLatency = latencyHistory.length > 0
    ? Math.max(...latencyHistory.map(d => d.latency))
    : (status.latencyMs && status.latencyMs > 0 ? status.latencyMs : 0);

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl p-6 overflow-hidden max-w-4xl w-full mx-auto" id="supabase-health-panel">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-2xl border border-teal-500/20">
            <Database className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              Supabase Cloud Node Status
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Endpoint: {supabaseConfig?.supabaseUrl ? <code className="text-teal-400 font-mono text-[11px] bg-slate-950 px-1.5 py-0.5 rounded">{supabaseConfig.supabaseUrl.substring(0, 45)}...</code> : <span className="text-slate-500 font-mono">Not configured</span>}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          {getStatusBadge()}
          {onClose && (
            <button 
              onClick={onClose}
              className="px-3 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition font-bold"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 my-5 bg-slate-950 p-1 rounded-xl w-fit border border-slate-850">
        <button
          onClick={() => setActiveTab("health")}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold tracking-wide uppercase transition cursor-pointer flex items-center gap-1.5 ${activeTab === "health" ? "bg-slate-800 text-teal-400 font-black shadow-xs" : "text-slate-400 hover:text-slate-200"}`}
        >
          <Activity className="w-3.5 h-3.5" />
          Connection Health
        </button>
        <button
          onClick={() => setActiveTab("tables")}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold tracking-wide uppercase transition cursor-pointer flex items-center gap-1.5 ${activeTab === "tables" ? "bg-slate-800 text-teal-400 font-black shadow-xs" : "text-slate-400 hover:text-slate-200"}`}
        >
          <Database className="w-3.5 h-3.5" />
          Active Table Sync
        </button>
        <button
          onClick={() => setActiveTab("telemetry")}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold tracking-wide uppercase transition cursor-pointer flex items-center gap-1.5 ${activeTab === "telemetry" ? "bg-slate-800 text-teal-400 font-black shadow-xs" : "text-slate-400 hover:text-slate-200"}`}
        >
          <Terminal className="w-3.5 h-3.5" />
          Live Telemetry ({logs.length})
        </button>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[320px]">
        {activeTab === "health" && (
          <div className="space-y-6 animate-in fade-in duration-250">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block mb-2">
                  Database Latency
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-3xl font-black text-white font-mono">
                    {status.latencyMs !== undefined && status.latencyMs !== -1 ? `${status.latencyMs}` : "N/A"}
                  </span>
                  <span className="text-xs text-teal-400 font-bold font-mono">ms</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-2">
                  Duration of the diagnostic test query.
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block mb-2">
                  Rolling Avg Latency
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-3xl font-black text-slate-200 font-mono">
                    {avgLatency > 0 ? `${avgLatency}` : "N/A"}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ms</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-2">
                  Calculated from last 12 samples.
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block mb-2">
                  Active Tables
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-3xl font-black text-white font-mono">
                    {status.tables?.length || 0}
                  </span>
                  <span className="text-xs text-slate-400">models</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-2">
                  Mapped schema tables verified on node.
                </p>
              </div>
            </div>

            {/* Latency History Graph */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    Real-time Latency Spark Graph
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleManualPing}
                    disabled={isRechecking}
                    className="px-2.5 py-1 text-[10px] uppercase font-black tracking-wider bg-slate-800 hover:bg-slate-700 text-teal-400 hover:text-white rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw size={11} className={isRechecking ? "animate-spin" : ""} />
                    Test Ping
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono">Max Peak: {maxLatency}ms</span>
                </div>
              </div>

              {latencyHistory.length > 0 ? (
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={latencyHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                      <YAxis stroke="#64748b" fontSize={9} unit="ms" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "12px" }}
                        labelStyle={{ color: "#94a3b8", fontSize: "10px", fontWeight: "bold" }}
                        itemStyle={{ color: "#2dd4bf", fontSize: "12px", fontWeight: "bold" }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="latency" 
                        stroke="#14b8a6" 
                        strokeWidth={2.5} 
                        dot={{ r: 4, strokeWidth: 1, fill: "#0f172a" }}
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-44 flex flex-col items-center justify-center text-slate-500 bg-slate-900/40 rounded-xl border border-slate-900">
                  <Activity className="w-8 h-8 text-slate-700 animate-pulse mb-2" />
                  <span className="text-xs font-bold">Waiting for latency telemetry cycles...</span>
                  <p className="text-[10px] text-slate-600 mt-1">Press 'Test Ping' to poll immediate samples</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "tables" && (
          <div className="space-y-4 animate-in fade-in duration-250">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-950 p-4 rounded-2xl border border-slate-850 gap-3">
              <div>
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">
                  Cloud State Syncing Engine
                </span>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Synchronize your local offline storage cache to the remote Supabase PostgreSQL database.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={handleForceSync}
                  disabled={isSyncing || !status.configured || !status.tableExists}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSyncing ? "Mirroring Database..." : "Force Sync to Cloud"}
                </button>
              </div>
            </div>

            {/* Sync results toast alert */}
            {syncResult && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className={`p-3.5 rounded-xl text-xs font-semibold border ${syncResult.success ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/30" : "bg-rose-950/60 text-rose-300 border-rose-500/30"}`}
              >
                <div className="flex gap-2 items-start">
                  {syncResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                  <div>
                    <span className="font-bold block">{syncResult.success ? "Synchronization Successful!" : "Sync Failed"}</span>
                    <span className="text-[11px] text-slate-350 block mt-0.5">{syncResult.message}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tables Grid */}
            <div className="bg-slate-950 rounded-2xl border border-slate-850 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-850 bg-slate-900/60 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                      <th className="py-3 px-4">Model/Table Name</th>
                      <th className="py-3 px-4 text-center">Local Rows (Cache)</th>
                      <th className="py-3 px-4 text-center">Supabase Rows (Cloud)</th>
                      <th className="py-3 px-4 text-center">Sync Progress</th>
                      <th className="py-3 px-4 text-right">State Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {status.tables && status.tables.length > 0 ? (
                      status.tables.map((tbl) => {
                        const total = Math.max(tbl.localCount, tbl.supabaseCount, 1);
                        const percent = Math.min(Math.round((tbl.supabaseCount / tbl.localCount) * 100) || 0, 100);
                        
                        return (
                          <tr key={tbl.model} className="hover:bg-slate-900/40 text-xs text-slate-300">
                            <td className="py-3 px-4 font-mono font-bold text-teal-400 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                              {tbl.model}
                            </td>
                            <td className="py-3 px-4 text-center font-mono font-semibold text-slate-300">
                              {tbl.localCount}
                            </td>
                            <td className="py-3 px-4 text-center font-mono font-semibold text-teal-300">
                              {tbl.supabaseCount}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2 max-w-[120px] mx-auto">
                                <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-500 ${percent === 100 ? "bg-emerald-500" : percent > 0 ? "bg-teal-500" : "bg-slate-700"}`}
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                                <span className="font-mono text-[10px] text-slate-400">{percent}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              {tbl.localCount === tbl.supabaseCount ? (
                                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded">
                                  <CheckCircle2 className="w-3 h-3" /> Synchronized
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded">
                                  <AlertTriangle className="w-3 h-3 animate-pulse" /> Pending Sync
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500 font-bold">
                          No models detected in local database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "telemetry" && (
          <div className="space-y-4 animate-in fade-in duration-250">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                Connection Event Streams
              </span>
              <button 
                onClick={() => setLogs([])}
                className="text-[10px] uppercase font-bold text-slate-400 hover:text-white"
              >
                Clear Console
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 font-mono text-[11px] h-64 overflow-y-auto space-y-2 select-text text-left">
              {logs.length > 0 ? (
                logs.map((log) => {
                  let color = "text-slate-400";
                  let prefix = "ℹ️ [INFO]";
                  if (log.type === "success") {
                    color = "text-emerald-400";
                    prefix = "✅ [SUCCESS]";
                  } else if (log.type === "error") {
                    color = "text-rose-400";
                    prefix = "❌ [ERROR]";
                  } else if (log.type === "warning") {
                    color = "text-amber-400";
                    prefix = "⚠️ [WARNING]";
                  }

                  return (
                    <div key={log.id} className={`flex items-start gap-2 hover:bg-slate-900 p-0.5 rounded transition ${color}`}>
                      <span className="text-slate-600 shrink-0 font-medium select-none">[{log.timestamp}]</span>
                      <span className="font-extrabold shrink-0 select-none">{prefix}</span>
                      <span className="break-all">{log.message}</span>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex items-center justify-center text-slate-600">
                  <span>Console is currently empty. Running diagnostics...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-5 pt-4 border-t border-slate-800/85 text-[10px] text-slate-500 font-semibold gap-3">
        <span className="flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5 text-teal-500/80" />
          Node Health Engine v1.2 • Active Period: 2026-Q2
        </span>
        <span className="text-slate-450 hover:text-slate-350 flex items-center gap-1 font-bold">
          <Clock className="w-3.5 h-3.5" />
          Last Check: {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
