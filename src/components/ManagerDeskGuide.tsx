import React, { useState } from "react";
import { 
  Database, 
  Smartphone, 
  LineChart, 
  FileText, 
  ShieldCheck, 
  Activity, 
  Sparkles, 
  WifiOff, 
  Globe, 
  CheckCircle,
  Clock,
  ArrowRight,
  Info
} from "lucide-react";

interface ManagerDeskGuideProps {
  onClose?: () => void;
}

export default function ManagerDeskGuide({ onClose }: ManagerDeskGuideProps) {
  // Local state to simulate toggle checks for high interactive fidelity
  const [completedFeatures, setCompletedFeatures] = useState<Record<string, boolean>>({
    "1.1": true, "1.2": true, "1.3": true,
    "2.1": true, "2.2": true, "2.3": true,
    "3.1": true, "3.2": true, "3.3": true,
    "admin.1": true, "admin.2": true, "admin.3": true,
    "audit.1": true, "audit.2": true,
    "ai.1": true, "ai.2": true, "ai.3": true,
    "off.1": true, "off.2": true,
    "lang.1": true, "lang.2": true,
    "a": true, "b": true, "c": true, "d": true, "e": true, "f": true, "g": true, "h": true, "i": true, "j": true, "k": true, "l": true, "m": true, "n": true, "o": true, "p": true, "q": true, "r": true
  });

  const toggleCheck = (id: string) => {
    setCompletedFeatures(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[1100px] overflow-y-auto animate-in fade-in slide-in-from-left duration-300">
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-widest block mb-0.5">
            Operational Directory & Matrix
          </span>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            ⚙️ MANAGER'S DESK
          </h2>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Hide Directory
          </button>
        )}
      </div>

      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 text-[11px] text-slate-350 leading-relaxed font-sans space-y-2">
        <p className="font-bold text-slate-200">ℹ️ Operational Workspace Active</p>
        <p>
          You are exploring the live executive interface for <strong>MANAGER'S DESK</strong>. 
          Use the directory below to track and verify specific systems, telemetry logs, and tracking metrics.
        </p>
      </div>


      {/* 3. ADVANCED FEATURES */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800/50 pb-1.5">
          <Sparkles size={13} /> Advanced Features
        </h3>
        <div className="space-y-3 pl-1">
          {/* AI & Automation */}
          <div>
            <span className="text-[10.5px] font-bold text-slate-300 block mb-1">1. AI &amp; Automation</span>
            <div className="grid grid-cols-1 gap-1.5 text-[11px] pl-2 text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={completedFeatures["ai.1"]} 
                  onChange={() => toggleCheck("ai.1")}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
                />
                <span className={completedFeatures["ai.1"] ? "line-through text-slate-500" : ""}>Chatbots</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={completedFeatures["ai.2"]} 
                  onChange={() => toggleCheck("ai.2")}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
                />
                <span className={completedFeatures["ai.2"] ? "line-through text-slate-500" : ""}>Predictive recommendations</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={completedFeatures["ai.3"]} 
                  onChange={() => toggleCheck("ai.3")}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
                />
                <span className={completedFeatures["ai.3"] ? "line-through text-slate-500" : ""}>Automated workflows</span>
              </label>
            </div>
          </div>

          {/* Offline Mode */}
          <div>
            <span className="text-[10.5px] font-bold text-slate-300 block mb-1">1. Offline Mode</span>
            <div className="grid grid-cols-1 gap-1.5 text-[11px] pl-2 text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={completedFeatures["off.1"]} 
                  onChange={() => toggleCheck("off.1")}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
                />
                <span className={completedFeatures["off.1"] ? "line-through text-slate-500" : ""}>Local data storage</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={completedFeatures["off.2"]} 
                  onChange={() => toggleCheck("off.2")}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
                />
                <span className={completedFeatures["off.2"] ? "line-through text-slate-500" : ""}>Sync when internet is available</span>
              </label>
            </div>
          </div>

          {/* Multi-Language Support */}
          <div>
            <span className="text-[10.5px] font-bold text-slate-300 block mb-1">1. Multi-Language Support</span>
            <div className="grid grid-cols-1 gap-1.5 text-[11px] pl-2 text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={completedFeatures["lang.1"]} 
                  onChange={() => toggleCheck("lang.1")}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
                />
                <span className={completedFeatures["lang.1"] ? "line-through text-slate-500" : ""}>Multiple languages</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={completedFeatures["lang.2"]} 
                  onChange={() => toggleCheck("lang.2")}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
                />
                <span className={completedFeatures["lang.2"] ? "line-through text-slate-500" : ""}>Regional settings</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* TRACK AND MONITOR SYSTEM FLOW (a. through r.) */}
      <div className="space-y-3.5 pt-2">
        <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800/50 pb-1.5">
          <Activity size={13} /> Biosecure Tracking &amp; Monitoring (a-r)
        </h3>
        
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 text-[11px] font-sans">
          
          {/* Point a */}
          <div className="flex items-start gap-2.5 p-2 bg-slate-950/70 rounded-xl border border-slate-800/50">
            <input 
              type="checkbox" 
              checked={completedFeatures["a"]} 
              onChange={() => toggleCheck("a")}
              className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">a. Track and monitor Operations-Customer Login Dashboard.</span>
              <p className="text-[10px] text-slate-450">Active customer logins, communication logs, and active booking slots telemetry feed.</p>
            </div>
          </div>

          {/* Point b */}
          <div className="flex items-start gap-2.5 p-2 bg-slate-950/70 rounded-xl border border-slate-800/50">
            <input 
              type="checkbox" 
              checked={completedFeatures["b"]} 
              onChange={() => toggleCheck("b")}
              className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">b. Track and monitor Customer Appointments and Engagements</span>
              <p className="text-[10px] text-slate-450">Overview of customer appointments, visit types, assigned staff, and follow-up activities. Useful for customers to view upcoming/scheduled visits, related notes, and engagement history.</p>
            </div>
          </div>

          {/* Point c */}
          <div className="flex items-start gap-2.5 p-2 bg-slate-950/70 rounded-xl border border-slate-800/50">
            <input 
              type="checkbox" 
              checked={completedFeatures["c"]} 
              onChange={() => toggleCheck("c")}
              className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">c. Track and monitor Operations-Appointment &amp; Scheduling Tracker</span>
              <p className="text-[10px] text-slate-450">Monitor, manage, and track appointments, including follow-ups, statuses, assigned staff, and appointment types for effective scheduling and follow-up actions.</p>
            </div>
          </div>

          {/* Point d */}
          <div className="flex items-start gap-2.5 p-2 bg-slate-950/70 rounded-xl border border-slate-800/50">
            <input 
              type="checkbox" 
              checked={completedFeatures["d"]} 
              onChange={() => toggleCheck("d")}
              className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">d. Track and monitor Operations-Spawning Management</span>
              <p className="text-[10px] text-slate-450">Telemetry integration with deep tracking statistics across breeding lots.</p>
            </div>
          </div>

          {/* Point e */}
          <div className="flex items-start gap-2.5 p-2 bg-slate-950/70 rounded-xl border border-slate-800/50">
            <input 
              type="checkbox" 
              checked={completedFeatures["e"]} 
              onChange={() => toggleCheck("e")}
              className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">e. Track and monitor Spawning &amp; Incubation Management</span>
              <p className="text-[10px] text-slate-450">Create, record, and track all aspects of spawning and incubation activities, including spawning tanks, tranquilizer tanks, broodstock species and tanks, broodstock size and weight, egg production and quantity, spawning and incubation dates and times, activity logs, broodstock replacement/mortality/origin, hormone and chemical usage, dosages and quantities.</p>
            </div>
          </div>

          {/* Point f */}
          <div className="flex items-start gap-2.5 p-2 bg-slate-950/70 rounded-xl border border-slate-800/50">
            <input 
              type="checkbox" 
              checked={completedFeatures["f"]} 
              onChange={() => toggleCheck("f")}
              className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">f. Track and monitor Operations-Broodstock Striping Management</span>
              <p className="text-[10px] text-slate-450">Track weight profiles, hormone dosage quantities, species classification and water temperature metrics for striping cycles.</p>
            </div>
          </div>

          {/* Point g */}
          <div className="flex items-start gap-2.5 p-2 bg-slate-950/70 rounded-xl border border-slate-800/50">
            <input 
              type="checkbox" 
              checked={completedFeatures["g"]} 
              onChange={() => toggleCheck("g")}
              className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">g. Track and monitor Broodstock Striping Management Overview</span>
              <p className="text-[10px] text-slate-450">Monitor, manage, and analyze all records related to broodstock striping, including batch details, incubation periods, stock type, quantities, survival rates, and quality assessment. Use this view to track progress and make informed management decisions efficiently.</p>
            </div>
          </div>

          {/* Point h */}
          <div className="flex items-start gap-2.5 p-2 bg-slate-950/70 rounded-xl border border-slate-800/50">
            <input 
              type="checkbox" 
              checked={completedFeatures["h"]} 
              onChange={() => toggleCheck("h")}
              className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">h. Track and monitor Operations-Incubation &amp; Hatching, Incubation and Hatching Performance</span>
              <p className="text-[10px] text-slate-450">Track batch performance metrics such as survival rate, mortality, quality assessment, and chemical usage for each incubation and hatching batch.</p>
            </div>
          </div>

          {/* Point i */}
          <div className="flex items-start gap-2.5 p-2 bg-slate-950/70 rounded-xl border border-slate-800/50">
            <input 
              type="checkbox" 
              checked={completedFeatures["i"]} 
              onChange={() => toggleCheck("i")}
              className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">i. Track and monitor Operations-Pond &amp; Batch Management,create Batch Management Overview</span>
              <p className="text-[10px] text-slate-450">Track fish stocked, transfers, and mortality by batch, including quantities, status, and associations to specific ponds and species.</p>
            </div>
          </div>

          {/* Point j */}
          <div className="flex items-start gap-2.5 p-2 bg-slate-950/70 rounded-xl border border-slate-800/50">
            <input 
              type="checkbox" 
              checked={completedFeatures["j"]} 
              onChange={() => toggleCheck("j")}
              className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">j. Track and monitor Operations-Water Quality Tests Review</span>
              <p className="text-[10px] text-slate-450">Review recent water quality test results and their remarks for each test. Review recent water quality test results and their remarks for each test.</p>
            </div>
          </div>

          {/* Point k */}
          <div className="flex items-start gap-2.5 p-2 bg-slate-950/70 rounded-xl border border-slate-800/50">
            <input 
              type="checkbox" 
              checked={completedFeatures["k"]} 
              onChange={() => toggleCheck("k")}
              className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">k. Track and monitor Operations-Water Quality Tests Review, Water Quality Test Summary &amp; Actions</span>
              <p className="text-[10px] text-slate-450">Analyze parameters such as dissolved oxygen, pH, salinity, temperature, turbidity, ammonia nitrites, and recommended correction actions.</p>
            </div>
          </div>

          {/* Point l */}
          <div className="flex items-start gap-2.5 p-2 bg-slate-950/70 rounded-xl border border-slate-800/50">
            <input 
              type="checkbox" 
              checked={completedFeatures["l"]} 
              onChange={() => toggleCheck("l")}
              className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">l. Track, create, summarize, and monitor daily water quality test reports</span>
              <p className="text-[10px] text-slate-450">With emphasis on immediate and urgent actions needed, across all tanks. This group gives you an overview of tested parameters, recommended actions, and tank status.</p>
            </div>
          </div>

          {/* Point m */}
          <div className="flex items-start gap-2.5 p-2 bg-slate-950/70 rounded-xl border border-slate-800/50">
            <input 
              type="checkbox" 
              checked={completedFeatures["m"]} 
              onChange={() => toggleCheck("m")}
              className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">m. Track and monitor Procurement &amp; Logistics</span>
              <p className="text-[10px] text-slate-450">Detailed review of Local Purchase Orders (LPOs), critical low stock alarms, and biosecure transport routes.</p>
            </div>
          </div>

          {/* Point n */}
          <div className="flex items-start gap-2.5 p-2 bg-slate-950/70 rounded-xl border border-slate-800/50">
            <input 
              type="checkbox" 
              checked={completedFeatures["n"]} 
              onChange={() => toggleCheck("n")}
              className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">n. Standalone dashboard section as requested</span>
              <p className="text-[10px] text-slate-450">Separate from existing Operations and Finance sections. Customize with relevant overview or summary metrics as needed for future expansion.</p>
            </div>
          </div>

          {/* Point o */}
          <div className="flex items-start gap-2.5 p-2 bg-slate-950/70 rounded-xl border border-slate-800/50">
            <input 
              type="checkbox" 
              checked={completedFeatures["o"]} 
              onChange={() => toggleCheck("o")}
              className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">o. Track and monitor Operations-Detailed Staff Activities Log</span>
              <p className="text-[10px] text-slate-450">Log records representing biosecure actions, health inspections, and feed measurements recorded by operational staff.</p>
            </div>
          </div>

          {/* Point p */}
          <div className="flex items-start gap-2.5 p-2 bg-slate-950/70 rounded-xl border border-slate-800/50">
            <input 
              type="checkbox" 
              checked={completedFeatures["p"]} 
              onChange={() => toggleCheck("p")}
              className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">p. Track and monitor Operations-Traceability</span>
              <p className="text-[10px] text-slate-450">Secure cryptographic lot tracking from spawning to harvest pack lines.</p>
            </div>
          </div>

          {/* Point q */}
          <div className="flex items-start gap-2.5 p-2 bg-slate-950/70 rounded-xl border border-slate-800/50">
            <input 
              type="checkbox" 
              checked={completedFeatures["q"]} 
              onChange={() => toggleCheck("q")}
              className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">q. Operations-Traceability Dashboard</span>
              <p className="text-[10px] text-slate-450">Detailed trace of active lots on decentralized databases and compliance checkmarks.</p>
            </div>
          </div>

          {/* Point r */}
          <div className="flex items-start gap-2.5 p-2 bg-slate-950/70 rounded-xl border border-slate-800/50">
            <input 
              type="checkbox" 
              checked={completedFeatures["r"]} 
              onChange={() => toggleCheck("r")}
              className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/50 bg-slate-800 w-3.5 h-3.5 cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-100">r. Track and monitor Traceability &amp; Lot-Based Chain of Custody</span>
              <p className="text-[10px] text-slate-450">Comprehensive dashboard for lot-based tracking, compliance trace reports, pond-to-pack traceability, QR code integration, harvest batch records, chain of custody tracking, stock movement logs, recall-ready records, disease source tracing, and regulatory tags. Explore and trace linkages from batch and lot identification through to regulatory export requirements, powered by connected modules (harvest, health/environment, feed, and inventory).</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
