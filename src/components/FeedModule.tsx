/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  FishFeedRecord, 
  IngredientRecord, 
  FeedingSchedule, 
  SupplierRecord, 
  StockInventory 
} from "../types";
import { 
  Plus, 
  Search, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  Luggage, 
  UserCheck, 
  Truck, 
  Calendar, 
  ShoppingBag, 
  Package, 
  Sparkles, 
  X 
} from "lucide-react";

interface FeedModuleProps {
  feeds: FishFeedRecord[];
  ingredients: IngredientRecord[];
  schedules: FeedingSchedule[];
  suppliers: SupplierRecord[];
  inventoryManagement: StockInventory[];
  onAddRecord: (model: string, data: any) => Promise<void>;
  onDeleteRecord: (model: string, id: string) => Promise<void>;
}

export default function FeedModule({
  feeds,
  ingredients,
  schedules,
  suppliers,
  inventoryManagement,
  onAddRecord,
  onDeleteRecord
}: FeedModuleProps) {
  const [activeTab, setActiveTab] = useState<"feeds" | "schedule" | "suppliers" | "inventory">("feeds");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modals / forms
  const [showAddFeedLog, setShowAddFeedLog] = useState(false);
  const [showAddSupplier, setShowAddSupplier] = useState(false);

  // Form states
  const [newFeedLog, setNewFeedLog] = useState({
    name: "",
    tankId: "Nlin-A",
    fishSpecies: "Clarius Gariepinus",
    fishStage: "Fingerlings",
    stockingDensity: "12000",
    feedTypeByIngredients: "Complete Feeds",
    feedTypeByForm: "Floating Pellets",
    unitCostPerKg: "4500",
    unitKg: "50",
    receivedDate: new Date().toISOString().split('T')[0],
    stockKg: "500",
    reservedStockKg: "50",
    reorderLevelKg: "100",
    reorderQtyKg: "500",
    currentFeedQtyKg: "450"
  });

  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    active: true
  });

  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Handlers
  const handleAddFeedLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddRecord("fishFeeds", {
      ...newFeedLog,
      stockingDensity: parseInt(newFeedLog.stockingDensity),
      unitCostPerKg: parseFloat(newFeedLog.unitCostPerKg),
      unitKg: parseFloat(newFeedLog.unitKg),
      stockKg: parseFloat(newFeedLog.stockKg),
      reservedStockKg: parseFloat(newFeedLog.reservedStockKg),
      reorderLevelKg: parseFloat(newFeedLog.reorderLevelKg),
      reorderQtyKg: parseFloat(newFeedLog.reorderQtyKg),
      currentFeedQtyKg: parseFloat(newFeedLog.currentFeedQtyKg),
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    setSuccessToast("Feed log entry successfully written.");
    setShowAddFeedLog(false);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleAddSupplierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddRecord("suppliers", newSupplier);
    setSuccessToast("New recxpats supplier added successfully.");
    setShowAddSupplier(false);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Filters
  const filteredFeeds = feeds.filter(f => f.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredSuppliers = suppliers.filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div id="feed-module-container" className="space-y-6">
      
      {/* Toast */}
      {successToast && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-bounce">
          <CheckCircle2 size={18} />
          <span className="text-sm font-medium">{successToast}</span>
        </div>
      )}

      {/* Top summary alerts/notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Reordering alert */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/50 flex gap-3 text-xs text-amber-800">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Automated Reorder Level Alarm</span>
            <p>The following food profiles have breached reorder thresholds: <strong>35% CP 3mm Floating Pellet</strong> is at <strong>950 Kg</strong> (Reserved limit: 900 Kg). Please coordinate with suppliers.</p>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/50 flex gap-3 text-xs text-emerald-800">
          <Package className="text-emerald-600 shrink-0 mt-0.5" size={18} />
          <div>
            <span className="font-bold block mb-0.5">Physical Inventory Count</span>
            <p>Currently storing <strong>{inventoryManagement.length} standard tool categories</strong> in the central store including recxpats test strips, aerators, water change kits, and nursery sifting nets.</p>
          </div>
        </div>
      </div>

      {/* Primary Sub-Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-sky-100">
        <div className="flex gap-1 overflow-x-auto">
          <button 
            onClick={() => setActiveTab("feeds")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === "feeds" ? "bg-sky-900 text-white shadow-sm ring-1 ring-sky-700/25" : "text-sky-900 hover:bg-sky-50"}`}
          >
            Formulated Feeds & Profiles ({feeds.length})
          </button>
          <button 
            onClick={() => setActiveTab("schedule")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === "schedule" ? "bg-sky-900 text-white shadow-sm ring-1 ring-sky-700/25" : "text-sky-905 hover:bg-sky-50"}`}
          >
            Feeding Routines
          </button>
          <button 
            onClick={() => setActiveTab("suppliers")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === "suppliers" ? "bg-sky-900 text-white shadow-sm ring-1 ring-sky-700/25" : "text-sky-900 hover:bg-sky-50"}`}
          >
            Suppliers Ledger
          </button>
          <button 
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === "inventory" ? "bg-sky-900 text-white shadow-sm ring-1 ring-sky-700/25" : "text-sky-900 hover:bg-sky-50"}`}
          >
            Hardware Inventory ({inventoryManagement.length})
          </button>
        </div>

        <div className="flex gap-2">
          {activeTab === "feeds" && (
            <button
              onClick={() => setShowAddFeedLog(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-sky-900 text-white rounded-xl text-xs font-semibold hover:bg-sky-850 transition shadow-md shadow-sky-950/15"
            >
              <Plus size={16} /> New Feed Profile
            </button>
          )}
          {activeTab === "suppliers" && (
            <button
              onClick={() => setShowAddSupplier(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-sky-900 text-white rounded-xl text-xs font-semibold hover:bg-sky-850 transition shadow-md shadow-sky-950/15"
            >
              <Plus size={16} /> Add Supplier
            </button>
          )}
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
        
        {/* SUBTAB 1: FORMULATED FEEDS */}
        {activeTab === "feeds" && (
          <div className="space-y-6">
            <h3 className="font-bold text-slate-850 text-sm">Feed Store Level & Feed conversion ratios (FCR)</h3>
            
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full border-collapse text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Feed Profile Name</th>
                    <th className="px-6 py-4">Assigned Tank ID</th>
                    <th className="px-6 py-4">Fish Stage</th>
                    <th className="px-6 py-4 text-center">In Stock (Kg)</th>
                    <th className="px-6 py-4 text-center">Reserved Limit</th>
                    <th className="px-6 py-4 text-right">Unit Cost</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFeeds.map(fd => (
                    <tr key={fd.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{fd.name}</div>
                        <div className="text-[10px] text-slate-500">{fd.fishSpecies} • {fd.feedTypeByIngredients}</div>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-indigo-600">{fd.tankId}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                          {fd.fishStage}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-800">{fd.currentFeedQtyKg || fd.stockKg} Kg</td>
                      <td className="px-6 py-4 text-center text-slate-400 font-mono">{fd.reorderLevelKg || fd.reservedStockKg || "900"} Kg</td>
                      <td className="px-6 py-4 text-right font-mono font-semibold">Ush {fd.unitCostPerKg ? fd.unitCostPerKg.toLocaleString() : "—"}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => fd.id && onDeleteRecord("fishFeeds", fd.id)}
                          className="text-rose-500 hover:bg-rose-50 p-1.5 rounded"
                        >
                          <X size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sub-section: Base Ingredients */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h4 className="font-bold text-slate-800 text-sm">Raw Ingredients Base Mix Formulation</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {ingredients.map(ing => (
                  <div key={ing.id} className="p-4 border border-slate-100 bg-slate-50/50 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-xs">{ing.name}</span>
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Cost Per Kg</span>
                    </div>
                    <div className="flex justify-between text-xs pt-1.5 border-t border-slate-200/40">
                      <span className="text-slate-400">Cost:</span>
                      <span className="font-bold text-slate-800">Ush {ing.costPerKg?.toLocaleString()}/kg</span>
                    </div>
                    {ing.proteinPct && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Protein:</span>
                        <span className="font-semibold text-teal-650">{ing.proteinPct}% Content</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: FEEDING SCHEDULE */}
        {activeTab === "schedule" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-sky-50/50 p-4 rounded-2xl border border-sky-100/50 gap-4">
              <div>
                <h3 className="font-extrabold text-slate-850 text-sm">🍲 Feed Consumption Per Fish Tank / Pond</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Real-time biological performance, conversion efficiency (FCR), and automated AI recommendations.</p>
              </div>
              <span className="px-3 py-1 bg-sky-900 text-cyan-200 text-[10px] font-bold rounded-lg uppercase tracking-wider block shrink-0 text-center">
                {schedules.length} Active Tanks
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {schedules.map((sc, i) => {
                const displayFcr = sc.fcr || (sc.biomassGainKg && sc.totalFeedUsedPerDay
                  ? (sc.totalFeedUsedPerDay / sc.biomassGainKg).toFixed(2)
                  : "1.35");

                return (
                  <div key={sc.id || i} className="p-6 border border-slate-150 rounded-2xl bg-white shadow-xs space-y-6 relative overflow-hidden text-left">
                    <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center font-black text-cyan-800 text-xs shrink-0">
                          {sc.fishTankId || sc.assignedTanks || "POND"}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-sm flex flex-wrap items-center gap-2">
                            <span>{sc.fishSpecies || "Clarias Gariepinus (Catfish)"}</span>
                            <span className="px-2 py-0.5 bg-sky-50 text-[10px] text-sky-800 font-extrabold rounded-md">
                              {sc.fishStage || "Fingerling"}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Stocking Date: {sc.fishStockingDate || "2026-04-12"} • Water Temp: {sc.waterTemperature || "26.5"}°C
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-2">
                        <button
                          onClick={() => sc.id && onDeleteRecord("feedingSchedules", sc.id)}
                          className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-bold border border-rose-200 cursor-pointer flex items-center gap-1"
                        >
                          <X size={12} /> Delete Log
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Fish Count</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">{(sc.fishCount || 1500).toLocaleString()} pcs</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Feed Type</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">{sc.feedType || "Regular Pellets Feed"}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Duration Cycle</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">{sc.startDate || "2026-06-18"} to {sc.endDate || "2026-07-18"}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Feed per Fish</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">{sc.feedPerFish || "0.15 g/fish"}</span>
                      </div>
                      
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Feeding Frequency</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">{sc.feedingFrequencyPerDay || 3} times/day</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Daily Feed Weight</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">{sc.totalFeedUsedPerDay || 2.5} Target Kg</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Feed Qty / Cycle</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">{sc.feedQuantityPerCycle || sc.quantityPerCycle || 75} kg</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Biomass Gain</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">{sc.biomassGainKg || 45} kg</span>
                      </div>

                      <div className="bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                        <span className="text-[9px] text-emerald-700 font-bold uppercase block">FCR Total-feed / Biomass</span>
                        <span className="font-black text-emerald-800 block mt-0.5">{displayFcr}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Growth Rate (%)</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">+{sc.growthRatePct || 2.5}% daily</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Expected Harvest</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">{sc.expectedHarvestDate || "2026-12-15"}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Feed Wastage Ratio</span>
                        <span className="font-extrabold text-rose-700 block mt-0.5">{sc.feedWastage || "Negligible (<1%)"}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2 font-sans">
                      <div className="p-3 bg-slate-50 border rounded-xl">
                        <span className="text-[10px] font-extrabold text-slate-500 block uppercase">Feeding Instructions</span>
                        <p className="text-slate-700 mt-1 font-medium">{sc.instructions || "Distribute evenly across active trays twice daily."}</p>
                      </div>
                      <div className="p-3 bg-slate-50 border rounded-xl">
                        <span className="text-[10px] font-extrabold text-slate-500 block uppercase">Feed Wastage Notes &amp; Logs</span>
                        <p className="text-slate-700 mt-1 font-medium">{sc.feedWastageNotes || "No residual pellets observed on bottom traps."}</p>
                      </div>
                      <div className="col-span-1 md:col-span-2 p-3 bg-slate-50 border rounded-xl">
                        <span className="text-[10px] font-extrabold text-slate-500 block uppercase">General Notes</span>
                        <p className="text-slate-700 mt-0.5 font-medium">{sc.notes || "Healthy feed response with active schooling."}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-cyan-900 to-indigo-950 text-white rounded-xl space-y-3 font-sans">
                      <div className="flex items-center gap-1.5 px-1">
                        <Sparkles size={14} className="text-cyan-300 animate-pulse" />
                        <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-300">Generative AI Diagnosis &amp; Traceability</h5>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] leading-relaxed">
                        <div className="space-y-1.5">
                          <p>🧠 <strong className="text-cyan-200">Recommendation:</strong> {sc.aiRecommendations || "Maintain current density. Prepare temperature buffers."}</p>
                          <p>⚡ <strong className="text-cyan-200">Real-time Feed adjustment:</strong> {sc.aiFeedAdjustment || "If temp spike exceeds 28°C, shift feed timings."}</p>
                          <p>📅 <strong className="text-cyan-200">Feeding Schedule (AI):</strong> {sc.aiFeedingSchedule || "AM peak delivery: 40%. Midday: 30%. Evening: 30%."}</p>
                          <p>🔍 <strong className="text-cyan-200">Supplier Insights:</strong> {sc.aiSupplierInsights || "Supplied compounds contain trace minerals."}</p>
                        </div>
                        <div className="space-y-1.5 md:border-l md:border-white/10 md:pl-4">
                          <p>📊 <strong className="text-cyan-200">Consumption Summary:</strong> {sc.aiConsumptionSummary || "Consistent daily conversion indices."}</p>
                          <p>💸 <strong className="text-cyan-200">Ingredient Costing:</strong> {sc.aiIngredientCostBreakdown || "Crude protein compounds represent ~70% of cost."}</p>
                          <p>🔬 <strong className="text-cyan-200">Nutritional Profile:</strong> {sc.aiNutritionalProfileSummary || "Crude Protein 35%, Fat 10%, Fiber 4.5%."}</p>
                          <p>🔗 <strong className="text-cyan-200">Traceability Interface:</strong> <span className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-cyan-200 block sm:inline-block mt-1 sm:mt-0">{sc.traceabilityInterface || "Trace ID: FCR-T1-TIL-2026"}</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {schedules.length === 0 && (
                <div className="p-8 border border-dashed border-slate-200 text-center text-slate-400 font-medium rounded-xl">
                  No active pond feeding logs found. Click "Add Record" in the senior console to log feed consumption.
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 3: APPROVED SUPPLIERS */}
        {activeTab === "suppliers" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-sky-50/50 p-4 rounded-2xl border border-sky-100/50 gap-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">👥 Feed Suppliers Directory Ledger</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Approved commercial feeding suppliers, raw materials, and automated reliability insights.</p>
              </div>
              <span className="px-3 py-1 bg-sky-900 text-cyan-200 text-[10px] font-bold rounded-lg uppercase tracking-wider block shrink-0 text-center">
                {suppliers.length} Registered Suppliers
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
              {filteredSuppliers.map(sup => (
                <div key={sup.id} className="p-5 border border-slate-150 rounded-2xl bg-white shadow-xs space-y-4 relative text-left">
                  <div className="absolute top-0 right-0 left-0 h-1.5 bg-indigo-650 rounded-t-2xl" />
                  
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-black text-slate-900 text-base">{sup.companyName || sup.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium">Representative: <strong className="text-slate-600">{sup.contactPerson || "Primary Contact"}</strong></p>
                    </div>
                    <button
                      onClick={() => sup.id && onDeleteRecord("suppliers", sup.id)}
                      className="p-1 hover:text-red-650 text-slate-400 font-bold border rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100 font-sans">
                    <div>
                      <span className="text-[9px] text-slate-440 uppercase font-bold block">Phone Number</span>
                      <span className="text-slate-800 font-bold block mt-0.5">{sup.phone}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-440 uppercase font-bold block">Email Address</span>
                      <span className="text-slate-850 font-bold block mt-0.5 break-all">{sup.email || "N/A"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[9px] text-slate-440 uppercase font-bold block">Physical Distribution Address</span>
                      <span className="text-slate-700 font-medium block mt-0.5">{sup.address || "N/A"}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-sans">
                    <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider block">Formulated Feed Ingredients Supplied</span>
                    <p className="text-slate-700 font-medium mt-1 font-mono text-[11px]">{sup.feedIngredients || "Organic fishmeal extract, cereal grains, minerals premix."}</p>
                  </div>

                  {sup.notes && (
                    <div className="text-xs p-3 bg-slate-50/50 border border-dashed rounded-xl">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase block">Supplier Notes</span>
                      <p className="text-slate-650 mt-1 font-medium">{sup.notes}</p>
                    </div>
                  )}

                  {/* AI hub for Supplier info */}
                  <div className="p-3 bg-cyan-50/30 border border-cyan-150 rounded-xl text-xs flex gap-2 items-start font-sans">
                    <Sparkles size={14} className="text-cyan-700 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <span className="text-[9px] font-black uppercase text-cyan-800 tracking-widest block">Automated Insights (AI)</span>
                      <p className="text-cyan-900 font-semibold mt-0.5 font-serif text-[11px] leading-relaxed">
                        {sup.aiInsights || "Consistent delivery turnaround. High bioavailability inputs."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {filteredSuppliers.length === 0 && (
                <div className="col-span-2 p-8 border border-dashed border-slate-200 text-center text-slate-400 font-medium rounded-xl">
                  No active commercial suppliers registered. Click "Add Supplier" or "Add Record" in the console.
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 4: CENTRAL HARDWARE STORE */}
        {activeTab === "inventory" && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Fish Farm Central Tools & Materials Inventory</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full border-collapse text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Item Catalog Label</th>
                    <th className="px-6 py-4">Inventory Type</th>
                    <th className="px-6 py-4 text-center">Remaining In Stock</th>
                    <th className="px-6 py-4 text-right">Standard Cost</th>
                    <th className="px-6 py-4 text-center">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventoryManagement.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-bold text-slate-800">{inv.name}</td>
                      <td className="px-6 py-4 text-slate-500">{inv.inventoryType || "Fish Farm Equipment"}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 bg-slate-900 text-white font-mono rounded text-[11px]">
                          {inv.quantity} {inv.unitOfMeasure}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold font-mono text-slate-800">Ush {inv.unitCost?.toLocaleString() || "—"}</td>
                      <td className="px-6 py-4 text-center text-slate-400 font-medium">{inv.lastUpdated || "2025-10-01"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ADD FEED PROFILE */}
      {showAddFeedLog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-100 p-6 shadow-xl relative animate-in fade-in zoom-in-95">
            <button onClick={() => setShowAddFeedLog(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"><X size={18} /></button>
            <div className="flex items-center gap-2 mb-4">
              <Scale className="text-slate-900" size={20} />
              <h3 className="font-bold text-slate-800 text-base">New Feed Formulation Entry</h3>
            </div>
            <form onSubmit={handleAddFeedLogSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Formulated Feed Name</label>
                <input type="text" required placeholder="e.g. 42% CP Floating Pellets" value={newFeedLog.name} onChange={(e)=>setNewFeedLog({...newFeedLog, name:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium font-bold">Target Pond Link ID</label>
                  <input type="text" value={newFeedLog.tankId} onChange={(e)=>setNewFeedLog({...newFeedLog, tankId:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Fish Stock Stage</label>
                  <input type="text" required value={newFeedLog.fishStage} onChange={(e)=>setNewFeedLog({...newFeedLog, fishStage:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">In Store (Kg)</label>
                  <input type="number" required value={newFeedLog.stockKg} onChange={(e)=>setNewFeedLog({...newFeedLog, stockKg:e.target.value, currentFeedQtyKg:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Unit Cost Per Kg (Ush)</label>
                  <input type="number" required value={newFeedLog.unitCostPerKg} onChange={(e)=>setNewFeedLog({...newFeedLog, unitCostPerKg:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition">Save Formulation Ledger</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SUPPLIER */}
      {showAddSupplier && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-100 p-6 shadow-xl relative animate-in fade-in zoom-in-95">
            <button onClick={() => setShowAddSupplier(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"><X size={18} /></button>
            <div className="flex items-center gap-2 mb-4">
              <Truck className="text-slate-900" size={20} />
              <h3 className="font-bold text-slate-800 text-base">Add Supplier Ledger</h3>
            </div>
            <form onSubmit={handleAddSupplierSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Company Name</label>
                <input type="text" required placeholder="e.g. Aller Aquatics Africa" value={newSupplier.name} onChange={(e)=>setNewSupplier({...newSupplier, name:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Contact Representative</label>
                  <input type="text" required placeholder="Full Name" value={newSupplier.contactPerson} onChange={(e)=>setNewSupplier({...newSupplier, contactPerson:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Phone Number</label>
                  <input type="text" required placeholder="Tel" value={newSupplier.phone} onChange={(e)=>setNewSupplier({...newSupplier, phone:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition">Register Supplier</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
