/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  PondRecord, 
  BatchRecord, 
  SpawningRecord, 
  WaterQualityRecord, 
  HealthRecord 
} from "../types";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Search, 
  Droplets, 
  Thermometer, 
  Sparkles, 
  Fish, 
  HeartPulse, 
  Activity, 
  AlertTriangle, 
  ExternalLink,
  MapPin,
  Flame,
  Gauge,
  CheckCircle2,
  X
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface PondModuleProps {
  ponds: PondRecord[];
  batches: BatchRecord[];
  spawning: SpawningRecord[];
  waterQuality: WaterQualityRecord[];
  health: HealthRecord[];
  onAddRecord: (model: string, data: any) => Promise<void>;
  onDeleteRecord: (model: string, id: string) => Promise<void>;
  onRunDiagnostic: (type: string, data: any) => void;
}

export default function PondModule({
  ponds,
  batches,
  spawning,
  waterQuality,
  health,
  onAddRecord,
  onDeleteRecord,
  onRunDiagnostic
}: PondModuleProps) {
  const [activeTab, setActiveTab] = useState<"tanks" | "water" | "spawning" | "health">("tanks");
  
  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Modals / forms
  const [showAddWaterTest, setShowAddWaterTest] = useState(false);
  const [showAddSpawning, setShowAddSpawning] = useState(false);

  // Forms states
  const [newWaterTest, setNewWaterTest] = useState({
    name: "",
    tankId: "BCat-F-1",
    tankName: "BCG Females Tank",
    tankType: "Broodstock Tank",
    species: "Clarius Gariepinus",
    stage: "Broodstock",
    testDate: new Date().toISOString().split('T')[0],
    ph: "7.0",
    dissolvedOxygen: "6.0",
    ammonia: "0.0",
    nitrite: "0.0",
    nitrate: "5.0",
    temperature: "26",
    testedBy: "George"
  });

  const [newSpawning, setNewSpawning] = useState({
    tankId: "B-MC-F-01",
    broodstockOrigin: "Agri2rist Hub Farm",
    species: "Mirror Carp",
    sex: "Female",
    weightG: "500",
    mortality: 0,
    replacementQty: 0,
    hormoneInjected: "OvaPrim",
    spawningDate: new Date().toISOString().split('T')[0],
    eggAppearance: "Transparent, Pale Yellow",
    eggChemicals: "Formalin",
    eggWeightG: "2.5",
    eggsQuantity: "45000",
    incubationTank: "AQ-C",
    tankStatus: "In-Use",
    hatchedFry: "42000",
    stockType: "Sex Reversed Fry",
    survivalRatePct: "95.0",
    qualityAssessment: "Good",
    staffName: "James",
    staffRole: "Supervisor"
  });

  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Handlers
  const handleAddWaterTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddRecord("waterQuality", {
      ...newWaterTest,
      ph: parseFloat(newWaterTest.ph),
      dissolvedOxygen: parseFloat(newWaterTest.dissolvedOxygen),
      ammonia: parseFloat(newWaterTest.ammonia),
      nitrite: parseFloat(newWaterTest.nitrite),
      nitrate: parseFloat(newWaterTest.nitrate),
      temperature: parseFloat(newWaterTest.temperature),
      isMonitored: true,
      aiRiskLevel: parseFloat(newWaterTest.dissolvedOxygen) < 4 || parseFloat(newWaterTest.nitrite) > 4 ? "High" : "Normal"
    });
    setSuccessToast("Water quality parameters recorded successfully.");
    setShowAddWaterTest(false);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleAddSpawningSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddRecord("spawning", {
      ...newSpawning,
      weightG: parseFloat(newSpawning.weightG),
      eggWeightG: parseFloat(newSpawning.eggWeightG),
      eggsQuantity: parseInt(newSpawning.eggsQuantity),
      hatchedFry: parseInt(newSpawning.hatchedFry),
      survivalRatePct: parseFloat(newSpawning.survivalRatePct),
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    setSuccessToast("Breeding cycle recorded in fish farm ledger.");
    setShowAddSpawning(false);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Mapped lists
  const filteredPonds = ponds.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredWQ = waterQuality.filter(w => w.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  // Temperature variance chart mapping
  const waterChartData = waterQuality.filter(wq => wq.isMonitored).map(wq => ({
    date: wq.testDate,
    temp: wq.temperature,
    ph: wq.ph,
    do: wq.dissolvedOxygen,
    ammonia: wq.ammonia
  })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div id="ponds-module-container" className="space-y-6">
      
      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-bounce">
          <CheckCircle2 size={18} />
          <span className="text-sm font-medium">{successToast}</span>
        </div>
      )}

      {/* Top micro stat indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-sky-100 flex items-center gap-4 shadow-sm">
          <div className="bg-sky-50 text-sky-600 p-3 rounded-xl">
            <Droplets size={22} />
          </div>
          <div>
            <span className="text-[10px] text-sky-505 font-bold uppercase tracking-wider block">Average Water Temp</span>
            <span className="text-xl font-bold text-sky-950">25.3 °C</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-sky-100 flex items-center gap-4 shadow-sm">
          <div className="bg-sky-900 text-white p-3 rounded-xl">
            <Fish size={22} />
          </div>
          <div>
            <span className="text-[10px] text-sky-505 font-bold uppercase tracking-wider block">Spawning Operations</span>
            <span className="text-xl font-bold text-sky-950">{spawning.length} Broods</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-sky-100 flex items-center gap-4 shadow-sm">
          <div className="bg-rose-50 text-rose-600 p-3 rounded-xl">
            <HeartPulse size={22} />
          </div>
          <div>
            <span className="text-[10px] text-rose-505 font-bold uppercase tracking-wider block">Critically Low DO Tests</span>
            <span className="text-xl font-bold text-rose-950">
              {waterQuality.filter(w => w.dissolvedOxygen && Number(wq => wq.dissolvedOxygen) < 3.0).length} Tanks
            </span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-sky-100 flex items-center gap-4 shadow-sm">
          <div className="bg-amber-50 text-amber-600 p-3 rounded-xl">
            <Activity size={22} />
          </div>
          <div>
            <span className="text-[10px] text-amber-550 font-bold uppercase tracking-wider block">Active Batches Stored</span>
            <span className="text-xl font-bold text-sky-950">{batches.length} Stocks</span>
          </div>
        </div>
      </div>

      {/* Primary Module Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-sky-100">
        <div className="flex gap-1 overflow-x-auto">
          <button 
            onClick={() => setActiveTab("tanks")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === "tanks" ? "bg-sky-900 text-white shadow-sm ring-1 ring-sky-700/25" : "text-sky-900 hover:bg-sky-50"}`}
          >
            Ponds & Stock Batches
          </button>
          <button 
            onClick={() => setActiveTab("water")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === "water" ? "bg-sky-900 text-white shadow-sm ring-1 ring-sky-700/25" : "text-sky-900 hover:bg-sky-50"}`}
          >
            Water Quality Audits ({waterQuality.length})
          </button>
          <button 
            onClick={() => setActiveTab("spawning")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === "spawning" ? "bg-sky-900 text-white shadow-sm ring-1 ring-sky-700/25" : "text-sky-900 hover:bg-sky-50"}`}
          >
            Breeding & Spawning
          </button>
          <button 
            onClick={() => setActiveTab("health")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === "health" ? "bg-sky-900 text-white shadow-sm ring-1 ring-sky-700/25" : "text-sky-900 hover:bg-sky-50"}`}
          >
            Stock Health logs
          </button>
        </div>

        <div className="flex gap-2">
          {activeTab === "water" && (
            <button
              onClick={() => setShowAddWaterTest(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-sky-900 text-white rounded-xl text-xs font-semibold hover:bg-sky-850 transition shadow-md shadow-sky-950/15"
            >
              <Plus size={16} /> Record Water test
            </button>
          )}
          {activeTab === "spawning" && (
            <button
              onClick={() => setShowAddSpawning(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-sky-900 text-white rounded-xl text-xs font-semibold hover:bg-sky-850 transition shadow-md shadow-sky-950/15"
            >
              <Plus size={16} /> Log Spawning Cycle
            </button>
          )}
        </div>
      </div>

      {/* Primary Panels Content */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
        
        {/* TAB 1: PONDS & STOCK BATCHES */}
        {activeTab === "tanks" && (
          <div className="space-y-6">
            <h3 className="font-bold text-slate-800 text-sm">Pond Configurations ({ponds.length} Registered Infrastructure)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ponds.map(pond => (
                <div key={pond.id} className="p-5 border border-slate-150 rounded-2xl bg-slate-50/40 relative">
                  <div className="absolute top-4 right-4 flex items-center gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${pond.status === "In Use" ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                      {pond.status || "Out of Use"}
                    </span>
                    <button
                      onClick={() => onDeleteRecord("ponds", pond.id)}
                      className="text-slate-300 hover:text-rose-500 transition cursor-pointer p-1 rounded hover:bg-rose-50"
                      title="Delete Pond"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-3 pr-24 text-slate-800 font-bold text-sm">
                    <MapPin size={16} className="text-slate-400 block shrink-0" />
                    <span className="truncate">{pond.name || "Main Nursery Tank"}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs mb-3 text-slate-505">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Type:</span>
                      <span className="font-medium text-slate-700">{pond.pondType || "Fingerlings"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Size:</span>
                      <span className="font-medium text-slate-700">{pond.sizeM2 || 0} m² ({pond.volumeM3 || 0} m³)</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-550">
                    <span>Species stocking:</span>
                    <span className="font-semibold text-slate-800">{pond.associatedSpecies || "Mirror Carp"}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Stock batches table */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm">Active Stock Batches</h3>
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full border-collapse text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Batch Number/Name</th>
                      <th className="px-6 py-4">Species</th>
                      <th className="px-6 py-4">Pond link</th>
                      <th className="px-6 py-4 text-center">Initial Quantity</th>
                      <th className="px-6 py-4 text-center">Remaining Stock</th>
                      <th className="px-6 py-4 text-center font-bold">Fish Stage</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {batches.map(bt => (
                      <tr key={bt.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4 font-bold text-slate-800">{bt.name}</td>
                        <td className="px-6 py-4">{bt.species}</td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{bt.pondLink}</td>
                        <td className="px-6 py-4 text-center font-mono">{bt.initialQuantity?.toLocaleString() || "0"} pcs</td>
                        <td className="px-6 py-4 text-center font-mono font-semibold text-slate-800">{bt.currentQuantity?.toLocaleString() || "0"} pcs</td>
                        <td className="px-6 py-4 text-center p-2">
                          <span className="px-2 py-1 bg-slate-900 text-white rounded text-[10px] font-bold">
                            {bt.fishStage}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => onDeleteRecord("batches", bt.id)}
                            className="text-slate-300 hover:text-rose-500 transition cursor-pointer p-1.5 rounded hover:bg-rose-50"
                            title="Delete Stock Batch"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WATER QUALITY AUDITS */}
        {activeTab === "water" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Parameter limits box */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Gauge size={14} className="text-slate-400" /> Parameter Safety Limits (Standard)
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                    <span className="text-slate-500">Dissolved Oxygen (DO)</span>
                    <span className="font-semibold text-teal-600">&gt; 5.0 mg/L (Min)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                    <span className="text-slate-500">Ammonia (NH₃)</span>
                    <span className="font-semibold text-teal-600">&lt; 0.05 mg/L (Max)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                    <span className="text-slate-500">Nitrite (NO₂⁻)</span>
                    <span className="font-semibold text-teal-600">&lt; 0.1 mg/L (Max)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                    <span className="text-slate-500">pH Level</span>
                    <span className="font-semibold text-teal-600">6.5 - 8.5 range</span>
                  </div>
                </div>
              </div>

              {/* Water quality timeline charting */}
              <div className="lg:col-span-2 space-y-2">
                <h4 className="font-semibold text-slate-800 text-xs">Monitored Parameter Overtime</h4>
                <div className="h-48 bg-slate-50/20 p-2 rounded-xl">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={waterChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} />
                      <YAxis stroke="#94a3b8" fontSize={9} />
                      <Tooltip />
                      <Line type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#f59e0b" strokeWidth={2} />
                      <Line type="monotone" dataKey="ph" name="pH Value" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="do" name="DO (mg/l)" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Water Quality Tests Grid */}
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full border-collapse text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Test Date</th>
                    <th className="px-6 py-4">Tank Reference</th>
                    <th className="px-6 py-2 text-center">pH</th>
                    <th className="px-6 py-2 text-center">D.O (mg/L)</th>
                    <th className="px-6 py-2 text-center">Ammonia / Nitrite</th>
                    <th className="px-6 py-2 text-center">Temp (°C)</th>
                    <th className="px-6 py-4 text-center">Biosecurity Risk</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWQ.map(wq => {
                    const isDangerous = wq.dissolvedOxygen < 3 || wq.nitrite > 2;
                    return (
                      <tr key={wq.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4 text-slate-400 font-medium">{wq.testDate}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{wq.tankName || wq.tankId}</div>
                          <div className="text-[10px] text-slate-500">{wq.species} • {wq.stage}</div>
                        </td>
                        <td className="px-6 py-2 text-center font-semibold text-slate-700">{wq.ph}</td>
                        <td className={`px-6 py-2 text-center font-bold ${wq.dissolvedOxygen < 3 ? 'text-rose-600 font-black' : 'text-slate-800'}`}>
                          {wq.dissolvedOxygen}
                        </td>
                        <td className="px-6 py-2 text-center font-medium">
                          <span className={wq.ammonia > 1 ? 'text-rose-500 font-bold' : ''}>{wq.ammonia} mg/L</span> /{" "}
                          <span className={wq.nitrite > 1 ? 'text-rose-500 font-bold' : ''}>{wq.nitrite} mg/L</span>
                        </td>
                        <td className="px-6 py-2 text-center text-slate-800 font-semibold">{wq.temperature}°C</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold ${isDangerous ? 'bg-rose-50 text-rose-500 animate-pulse' : 'bg-emerald-50 text-emerald-600'}`}>
                            {isDangerous ? 'CRITICAL RISK' : 'STABLE LEVEL'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2 flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onRunDiagnostic("water-quality", wq)}
                            className="px-2 py-1 bg-slate-900 text-white rounded text-[10px] font-semibold flex items-center gap-1 hover:bg-slate-800 inline-flex"
                          >
                            <Sparkles size={11} /> AI Diag
                          </button>
                          <button
                            onClick={() => onDeleteRecord("waterQuality", wq.id)}
                            className="text-slate-300 hover:text-rose-500 transition cursor-pointer p-1 rounded hover:bg-rose-50"
                            title="Delete Test"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: BREEDING & SPAWNING */}
        {activeTab === "spawning" && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Fish Farm Spawning & Breeding Records</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {spawning.map(sp => (
                <div key={sp.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/40 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Broodstock ID: {sp.tankId}</h4>
                      <p className="text-xs text-slate-400">Species: {sp.species} ({sp.sex || "Female"})</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono px-2 py-0.5 bg-slate-200 text-slate-700 rounded select-none">
                        Hormone: {sp.hormoneInjected}
                      </span>
                      <button
                        onClick={() => onDeleteRecord("spawning", sp.id)}
                        className="text-slate-300 hover:text-rose-500 transition cursor-pointer p-1 rounded hover:bg-rose-50"
                        title="Delete Spawning Record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 bg-white border border-slate-100 rounded-lg">
                      <span className="text-[9px] text-slate-400 block uppercase">Spawning Date</span>
                      <span className="font-bold text-slate-800 block mt-0.5">{sp.spawningDate}</span>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-100 rounded-lg">
                      <span className="text-[9px] text-slate-400 block uppercase">Hatched Fry</span>
                      <span className="font-bold text-blue-600 block mt-0.5">{sp.hatchedFry?.toLocaleString() || "0"}</span>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-100 rounded-lg">
                      <span className="text-[9px] text-slate-400 block uppercase">Survival Rate</span>
                      <span className="font-bold text-emerald-600 block mt-0.5">{sp.survivalRatePct}%</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 py-2 border-t border-dashed border-slate-200">
                    <p><strong>Incubation Tank</strong>: {sp.incubationTank} (Status: {sp.tankStatus})</p>
                    {sp.eggAppearance && <p><strong>Egg Appearance</strong>: {sp.eggAppearance}</p>}
                    {sp.eggChemicals && <p><strong>Fungi Treatment</strong>: {sp.eggChemicals}</p>}
                  </div>

                  <button
                    onClick={() => onRunDiagnostic("breeding-success", sp)}
                    className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles size={14} /> Assess Spawning & Breeding AI
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STOCK HEALTH LOGS */}
        {activeTab === "health" && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-850 text-sm">Disease logs & Biosecurity Protocol Logs</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full border-collapse text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Observation Date</th>
                    <th className="px-6 py-4">Record / Treatment</th>
                    <th className="px-6 py-4">Stock Species</th>
                    <th className="px-6 py-4 text-center">Mortality count</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4">Compliance Level</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {health.map((h, i) => (
                    <tr key={h.id || i} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 text-slate-500">{h.observationDate}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{h.name}</div>
                        {h.treatmentPrescribed && <div className="text-[10px] text-indigo-500 font-bold">Treatment: {h.treatmentPrescribed}</div>}
                      </td>
                      <td className="px-6 py-4">{h.species} • <span className="font-medium">{h.stage}</span></td>
                      <td className="px-6 py-4 text-center font-mono font-semibold text-rose-500">{h.mortalityCount || 0}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold">
                          {h.healthStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium ${h.biosecurityStatus === "Protocol Follower" ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          Biosecurity: {h.biosecurityStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onDeleteRecord("healthRecords", h.id)}
                          className="text-slate-300 hover:text-rose-500 transition cursor-pointer p-1.5 rounded hover:bg-rose-50"
                          title="Delete Health Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {health.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400">No active stock health anomalies registered.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ADD WATER QUALITY AUDIT */}
      {showAddWaterTest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-100 p-6 shadow-xl relative animate-in fade-in zoom-in-95">
            <button onClick={() => setShowAddWaterTest(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"><X size={18} /></button>
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="text-slate-900" size={20} />
              <h3 className="font-bold text-slate-800 text-base">Record Water Parameters</h3>
            </div>
            <form onSubmit={handleAddWaterTestSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Audit Record Name</label>
                  <input type="text" required placeholder="e.g. Tank A Morning Test" value={newWaterTest.name} onChange={(e)=>setNewWaterTest({...newWaterTest, name:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Tank/Pond ID</label>
                  <input type="text" required value={newWaterTest.tankId} onChange={(e)=>setNewWaterTest({...newWaterTest, tankId:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Target Species</label>
                  <input type="text" value={newWaterTest.species} onChange={(e)=>setNewWaterTest({...newWaterTest, species:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Test Date</label>
                  <input type="date" required value={newWaterTest.testDate} onChange={(e)=>setNewWaterTest({...newWaterTest, testDate:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">pH Level</label>
                  <input type="number" step="0.1" required value={newWaterTest.ph} onChange={(e)=>setNewWaterTest({...newWaterTest, ph:e.target.value})} className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">D.O (mg/L)</label>
                  <input type="number" step="0.1" required value={newWaterTest.dissolvedOxygen} onChange={(e)=>setNewWaterTest({...newWaterTest, dissolvedOxygen:e.target.value})} className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Temp (°C)</label>
                  <input type="number" required value={newWaterTest.temperature} onChange={(e)=>setNewWaterTest({...newWaterTest, temperature:e.target.value})} className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center focus:outline-none"/>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Ammonia</label>
                  <input type="number" step="0.01" value={newWaterTest.ammonia} onChange={(e)=>setNewWaterTest({...newWaterTest, ammonia:e.target.value})} className="w-full px-2 py-2 bg-slate-50 border border-slate-200 text-center rounded-xl focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Nitrite</label>
                  <input type="number" step="0.01" value={newWaterTest.nitrite} onChange={(e)=>setNewWaterTest({...newWaterTest, nitrite:e.target.value})} className="w-full px-2 py-2 bg-slate-50 border border-slate-200 text-center rounded-xl focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Tested By</label>
                  <input type="text" value={newWaterTest.testedBy} onChange={(e)=>setNewWaterTest({...newWaterTest, testedBy:e.target.value})} className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition">Save Water Parameters</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG SPAWNING */}
      {showAddSpawning && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-100 p-6 shadow-xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowAddSpawning(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"><X size={18} /></button>
            <div className="flex items-center gap-2 mb-4">
              <Fish className="text-slate-900" size={20} />
              <h3 className="font-bold text-slate-800 text-base">New Spawning Ledgers</h3>
            </div>
            <form onSubmit={handleAddSpawningSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Breed Tank ID</label>
                  <input type="text" required value={newSpawning.tankId} onChange={(e)=>setNewSpawning({...newSpawning, tankId:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Species</label>
                  <input type="text" required value={newSpawning.species} onChange={(e)=>setNewSpawning({...newSpawning, species:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Broodstock weight (g)</label>
                  <input type="number" value={newSpawning.weightG} onChange={(e)=>setNewSpawning({...newSpawning, weightG:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Hormone Administered</label>
                  <input type="text" value={newSpawning.hormoneInjected} onChange={(e)=>setNewSpawning({...newSpawning, hormoneInjected:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Harvested Eggs</label>
                  <input type="number" required value={newSpawning.eggsQuantity} onChange={(e)=>setNewSpawning({...newSpawning, eggsQuantity:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Hatched Fry (pcs)</label>
                  <input type="number" required value={newSpawning.hatchedFry} onChange={(e)=>setNewSpawning({...newSpawning, hatchedFry:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Survival Rate %</label>
                  <input type="number" step="0.1" required value={newSpawning.survivalRatePct} onChange={(e)=>setNewSpawning({...newSpawning, survivalRatePct:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Incubation Tank Link</label>
                  <input type="text" value={newSpawning.incubationTank} onChange={(e)=>setNewSpawning({...newSpawning, incubationTank:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition">Register Breeding Spawn</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
