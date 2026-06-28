/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  AppointmentBooking, 
  CameraRecord, 
  LPORecord, 
  TraceRecord, 
  ProcessingRecord 
} from "../types";
import { 
  Plus, 
  Search, 
  Video, 
  CalendarClock, 
  Files, 
  Compass, 
  Shuffle, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  Cpu, 
  Truck,
  ShieldAlert,
  UserCheck2,
  X 
} from "lucide-react";

interface OperationsModuleProps {
  bookings: AppointmentBooking[];
  cameras: CameraRecord[];
  lpos: LPORecord[];
  traces: TraceRecord[];
  processing: ProcessingRecord[];
  onAddRecord: (model: string, data: any) => Promise<void>;
  onDeleteRecord: (model: string, id: string) => Promise<void>;
}

export default function OperationsModule({
  bookings,
  cameras,
  lpos,
  traces,
  processing,
  onAddRecord,
  onDeleteRecord
}: OperationsModuleProps) {
  const [activeTab, setActiveTab] = useState<"bookings" | "cameras" | "logistics">("bookings");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modals / local states
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [triggeredCameraId, setTriggeredCameraId] = useState<string | null>(null);

  // Form states
  const [newBooking, setNewBooking] = useState({
    customerName: "",
    transportMode: "Car",
    contactInfo: "",
    appointmentType: "Fingerlings Order",
    dateTime: new Date().toISOString().split('T')[0],
    status: "Scheduled",
    staffAssigned: "Fish Farm Manager",
    notes: "",
    followUpRequired: false,
    vehiclePlate: "",
    gateFeePayment: "Paid",
    biosecurityStatus: "Protocol Followed"
  });

  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Handlers
  const handleAddBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddRecord("appointments", {
      ...newBooking,
      followUpRequired: newBooking.followUpRequired
    });
    setSuccessToast("Agricultural booking processed correctly.");
    setShowAddBooking(false);
    setNewBooking({
      customerName: "",
      transportMode: "Car",
      contactInfo: "",
      appointmentType: "Fingerlings Order",
      dateTime: new Date().toISOString().split('T')[0],
      status: "Scheduled",
      staffAssigned: "Fish Farm Manager",
      notes: "",
      followUpRequired: false,
      vehiclePlate: "",
      gateFeePayment: "Paid",
      biosecurityStatus: "Protocol Followed"
    });
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleCameraCheck = (id: string) => {
    setTriggeredCameraId(id);
    setTimeout(() => setTriggeredCameraId(null), 2000);
  };

  return (
    <div id="operations-module-container" className="space-y-6">
      
      {/* Toast */}
      {successToast && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-bounce">
          <CheckCircle2 size={18} />
          <span className="text-sm font-medium">{successToast}</span>
        </div>
      )}

      {/* Sub tabs nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-sky-100">
        <div className="flex gap-1 overflow-x-auto">
          <button 
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === "bookings" ? "bg-sky-900 text-white shadow-sm ring-1 ring-sky-700/25" : "text-sky-900 hover:bg-sky-50"}`}
          >
            Visitor Appointments & Bookings ({bookings.length})
          </button>
          <button 
            onClick={() => setActiveTab("cameras")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === "cameras" ? "bg-sky-900 text-white shadow-sm ring-1 ring-sky-700/25" : "text-sky-900 hover:bg-sky-50"}`}
          >
            Closed-Circuit Security Cameras ({cameras.length})
          </button>
          <button 
            onClick={() => setActiveTab("logistics")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === "logistics" ? "bg-sky-900 text-white shadow-sm ring-1 ring-sky-700/25" : "text-sky-900 hover:bg-sky-50"}`}
          >
            Fish Farm Logistics & LPOs
          </button>
        </div>

        <div className="flex gap-2">
          {activeTab === "bookings" && (
            <button
              onClick={() => setShowAddBooking(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-sky-900 text-white rounded-xl text-xs font-semibold hover:bg-sky-850 transition shadow-md shadow-sky-950/15"
            >
              <Plus size={16} /> New Appointment
            </button>
          )}
        </div>
      </div>

      {/* Primary container */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
        
        {/* SUBTAB 1: VISITOR BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-850 text-sm">Agriculture Gate Sign-In Bookings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map(bk => (
                <div key={bk.id} className="p-5 border border-slate-100 bg-slate-50/40 rounded-2xl space-y-4 relative">
                  <span className={`absolute top-4 right-4 text-[10px] uppercase font-bold px-2 py-0.5 rounded ${bk.status === "Scheduled" ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
                    {bk.status}
                  </span>

                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{bk.customerName}</h4>
                    <p className="text-xs text-slate-400">Appointment Type: {bk.appointmentType}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-white border border-slate-100 rounded-lg">
                      <span className="text-[9px] text-slate-400 block font-medium">Gate Fee</span>
                      <span className="font-bold text-slate-700 block text-[10px] mt-0.5">{bk.gateFeePayment}</span>
                    </div>
                    <div className="p-2 bg-white border border-slate-100 rounded-lg">
                      <span className="text-[9px] text-slate-400 block font-medium font-bold">Biosecure</span>
                      <span className="font-semibold text-slate-700 block text-[9px] mt-0.5 leading-tight">{bk.biosecurityStatus || "Checked"}</span>
                    </div>
                    <div className="p-2 bg-white border border-slate-100 rounded-lg">
                      <span className="text-[9px] text-slate-400 block font-medium">Assigned To</span>
                      <span className="font-semibold text-slate-800 block text-[9.5px] mt-0.5">{bk.staffAssigned || "Fish Farm Unit"}</span>
                    </div>
                  </div>

                  {bk.notes && (
                    <p className="text-xs text-slate-550 italic bg-white p-3 border border-slate-100 rounded-xl">
                      &quot;{bk.notes}&quot;
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100/60 text-slate-500">
                    <span className="flex items-center gap-1"><CalendarClock size={14} /> Arrival: {bk.dateTime}</span>
                    {bk.vehiclePlate && <span className="font-mono text-[10px]">Plate: {bk.vehiclePlate}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 2: CCTV CAMERAS */}
        {activeTab === "cameras" && (
          <div className="space-y-6">
            <h3 className="font-bold text-slate-850 text-sm">Real-time Closed-Circuit Camera Overviews</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {cameras.map(cam => (
                <div key={cam.id} className="border border-slate-150 rounded-2xl overflow-hidden shadow-xs bg-slate-900 text-white relative">
                  
                  {/* Outer Video Mask screen with scan-lines */}
                  <div className="h-44 bg-slate-950 flex flex-col justify-between p-4 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-950/20 via-slate-950/80 to-slate-950 pointer-events-none" />
                    
                    {/* Blink indicator */}
                    <div className="flex items-center justify-between z-10">
                      <span className="bg-slate-900/80 text-white font-mono text-[9px] px-2 py-1 rounded border border-slate-800">
                        Camera: {cam.name}
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-wide text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900/60 font-bold select-none">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        REC • {cam.status}
                      </span>
                    </div>

                    {/* Simulation camera viewport lines */}
                    <div className="text-center z-10 py-6">
                      <Video size={36} className="mx-auto text-emerald-500/80 mb-2 animate-pulse" />
                      <span className="text-[10px] text-slate-500 font-mono">Location: {cam.location || "Central Fish Farm"}</span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono z-10 bg-slate-950/40 p-1.5 rounded">
                      <span>Model: {cam.model || "HikVision Pro"}</span>
                      <span>S/N: {cam.serialNumber || "N/A"}</span>
                    </div>
                  </div>

                  {/* Actions drawer */}
                  <div className="p-4 bg-slate-800 text-slate-200 text-xs flex items-center justify-between">
                    <div>
                      {cam.activityType && (
                        <p className="flex items-center gap-1 font-mono text-[9.5px] text-emerald-400">
                          <Activity size={12} /> {cam.activityType}
                        </p>
                      )}
                      <p className="text-slate-400 text-[10px]">Zone: {cam.viewZone || "Perimeter"}</p>
                    </div>

                    <button 
                      onClick={() => cam.id && handleCameraCheck(cam.id)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition ${triggeredCameraId === cam.id ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-650'}`}
                    >
                      {triggeredCameraId === cam.id ? "Passed OK" : "Run Feed Ping"}
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 3: LOGISTICS & LPOs */}
        {activeTab === "logistics" && (
          <div className="space-y-6">
            
            {/* LPO and Trace list */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LPO ledger list */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-850 text-sm flex items-center gap-1.5">
                  <Files size={16} className="text-slate-400" /> Procurement Purchase Orders (LPOs)
                </h4>
                
                {lpos.map(lp => (
                  <div key={lp.id} className="p-4 border border-slate-100 bg-slate-50/50 rounded-xl space-y-3 relative">
                    <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded">
                      {lp.status}
                    </span>
                    <div>
                      <span className="font-bold block text-xs text-slate-800">{lp.lpoNumber} ({lp.supplierName})</span>
                      <span className="text-[10px] text-slate-400">{lp.date} • Category: {lp.category}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/45 text-xs">
                      <span className="text-slate-500">Total Purchase:</span>
                      <span className="font-black text-slate-850">Ush {lp.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Traceability Compliance snap */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-850 text-sm flex items-center gap-1.5">
                  <Compass size={16} className="text-slate-400" /> Active Biosecurity Trace Logs
                </h4>

                {traces.map(tr => (
                  <div key={tr.id} className="p-5 border border-slate-150 rounded-xl space-y-3 relative">
                    <div className="flex items-center gap-2 text-rose-600 text-xs font-bold bg-rose-50 px-3 py-1.5 rounded-lg select-none">
                      <ShieldAlert size={14} />
                      Recall Readiness Level: {tr.recallStatus}
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-800">Compliance Log: {tr.name}</p>
                      <p className="text-[11px] text-slate-400">Barcode tracking ID: {tr.lotNumber}</p>
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                      <p><strong>Tracking classification</strong>: {tr.trackingType}</p>
                      {tr.summaryRiskAlerts && <p className="text-indigo-600 bg-indigo-50/60 p-2 rounded mt-1.5"><strong>Analysis Advice</strong>: {tr.summaryRiskAlerts}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Processing register lines */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Shuffle size={16} className="text-slate-400" /> Harvesting & Food Slicing Lines
              </h4>

              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full border-collapse text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Processing Line Label</th>
                      <th className="px-6 py-4">Line Date</th>
                      <th className="px-6 py-4">Linked Batch ID</th>
                      <th className="px-6 py-4">Cold Storage Unit</th>
                      <th className="px-6 py-4 text-right">Cut Yield (Kg)</th>
                      <th className="px-6 py-4 text-center">Cleaning Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {processing.map(pr => (
                      <tr key={pr.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-855">{pr.name}</div>
                          <div className="text-[10px] text-slate-400">Assoc. Species: {pr.species}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{pr.date}</td>
                        <td className="px-6 py-4 font-mono select-all text-indigo-650">{pr.batchId}</td>
                        <td className="px-6 py-4 font-medium text-slate-600">{pr.stage || "Fish Farm Lockers"}</td>
                        <td className="px-6 py-4 text-right font-bold text-slate-800">{pr.cutYieldKg} Kg</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pr.cleaningStatus === "Success" ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500 animate-pulse'}`}>
                            Sanitation: {pr.cleaningStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* MODAL: ADD APPOINTMENT */}
      {showAddBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-100 p-6 shadow-xl relative animate-in fade-in zoom-in-95">
            <button onClick={() => setShowAddBooking(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"><X size={18} /></button>
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock className="text-slate-900" size={20} />
              <h3 className="font-bold text-slate-800 text-base">New Farm Gate Booking</h3>
            </div>
            <form onSubmit={handleAddBookingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Customer / Institutional Name</label>
                <input type="text" required placeholder="e.g. Koma Cooperative, University Field trip" value={newBooking.customerName} onChange={(e)=>setNewBooking({...newBooking, customerName:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Contact Reference</label>
                  <input type="text" placeholder="Tel/Email" value={newBooking.contactInfo} onChange={(e)=>setNewBooking({...newBooking, contactInfo:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-bold">Planned Arrival Date</label>
                  <input type="date" required value={newBooking.dateTime} onChange={(e)=>setNewBooking({...newBooking, dateTime:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Appointment Purpose</label>
                  <select value={newBooking.appointmentType} onChange={(e)=>setNewBooking({...newBooking, appointmentType:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none">
                    <option value="Fingerlings Order">Fingerlings Order Delivery</option>
                    <option value="Consultancy Service">recxpats Feasibility Consulting</option>
                    <option value="Agritourism Stay">Agritourism School Visit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Assigned Liaison Officer</label>
                  <input type="text" value={newBooking.staffAssigned} onChange={(e)=>setNewBooking({...newBooking, staffAssigned:e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Operations Notes</label>
                <textarea rows={2} value={newBooking.notes} onChange={(e)=>setNewBooking({...newBooking, notes:e.target.value})} placeholder="Specify delivery quantities, special requirements or biological needs..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
              </div>
              <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition">Establish Gate Check-in Booking</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
