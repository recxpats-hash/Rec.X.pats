import React, { useState, useRef, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Camera, 
  Upload, 
  Database, 
  RefreshCw, 
  CloudLightning, 
  Smartphone, 
  FileText, 
  Download, 
  Eye, 
  CheckCircle,
  Wifi,
  WifiOff,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Play,
  StopCircle,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar 
} from "recharts";

// Interfaces
interface ManagerRecord {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  status: "Optimized" | "Critical" | "Review";
  image?: string;
  fileName?: string;
  lastUpdated: string;
}

export default function ManagersDeskPanel() {
  const [activeSubSection, setActiveSubSection] = useState<"data_mgmt" | "cloud_sync" | "analytics">("data_mgmt");

  // 1. DATA MANAGEMENT STATES
  const [records, setRecords] = useState<ManagerRecord[]>([
    { id: "M-101", itemName: "Tilapia Broodstock Starter Feed", category: "Feeds Feedstock", quantity: 650, status: "Optimized", lastUpdated: "2026-06-20 11:24" },
    { id: "M-102", itemName: "Hormonized Spawning Inducer (Ova)", category: "Biological Agent", quantity: 45, status: "Critical", lastUpdated: "2026-06-20 12:45" },
    { id: "M-103", itemName: "Dissolved Oxygen Digital Probe #3", category: "Equipment Accessories", quantity: 180, status: "Optimized", lastUpdated: "2026-06-20 14:10" },
  ]);

  const [formItemName, setFormItemName] = useState("");
  const [formCategory, setFormCategory] = useState("Feeds Feedstock");
  const [formQuantity, setFormQuantity] = useState<number>(100);
  const [formStatus, setFormStatus] = useState<"Optimized" | "Critical" | "Review">("Optimized");
  const [editRecordId, setEditRecordId] = useState<string | null>(null);

  // File and Camera States
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCameraStream, setShowCameraStream] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 2. CLOUD SYNCHRONIZATION STATES
  const [isOnline, setIsOnline] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState("2026-06-20 15:00 UTC");
  const [deviceSessions] = useState([
    { name: "Okello's iPad Pro", location: "Luwero Broodstock Fish Farm", status: "Active Now", icon: Smartphone },
    { name: "Manager's iPhone 15 Pro", location: "Kampala Main HQ", status: "Idle - 12m ago", icon: Smartphone },
    { name: "Direct Desktop Terminal #1", location: "Incubation Control Booth", status: "Active Now", icon: Database }
  ]);

  // 3. ANALYTICS & FILTER STATES
  const [analyticsFilterType, setAnalyticsFilterType] = useState<"all" | "high" | "low">("all");

  const [chartData] = useState([
    { month: "Jan", feedQty: 480, spawnQty: 120, survivalRate: 88, cogs: 3.2 },
    { month: "Feb", feedQty: 590, spawnQty: 140, survivalRate: 92, cogs: 2.8 },
    { month: "Mar", feedQty: 620, spawnQty: 190, survivalRate: 85, cogs: 3.5 },
    { month: "Apr", feedQty: 750, spawnQty: 220, survivalRate: 94, cogs: 2.4 },
    { month: "May", feedQty: 820, spawnQty: 250, survivalRate: 91, cogs: 2.1 },
    { month: "Jun", feedQty: 940, spawnQty: 310, survivalRate: 95, cogs: 1.8 }
  ]);

  // Toast system
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // CAMERA DISPATCH LOGIC
  const startCamera = async () => {
    try {
      setShowCameraStream(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      triggerToast("Camera hardware engaged successfully.");
    } catch (err) {
      console.error("Camera access failed:", err);
      // Fallback
      triggerToast("Webcam unavailable. Interactive camera simulated.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraStream(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        setCapturedImage(dataUrl);
        triggerToast("Biological sample snapshot captured successfully.");
      }
      stopCamera();
    } else {
      // Simulation sample
      setCapturedImage("https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&auto=format&fit=crop&q=60");
      setShowCameraStream(false);
      triggerToast("Mock biological sample captured.");
    }
  };

  // FILE DRAG AND DROP HANDLERS
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB"
      });
      triggerToast(`Analyzed file: ${file.name} queued for record link.`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB"
      });
      triggerToast(`Analyzed file: ${file.name} queued for record link.`);
    }
  };

  // CRUD FORMS HANDLERS
  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formItemName.trim()) {
      triggerToast("Error: Item Name cannot be empty.");
      return;
    }

    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);

    if (editRecordId) {
      // Update
      setRecords(prev => prev.map(rec => {
        if (rec.id === editRecordId) {
          const updated = {
            ...rec,
            itemName: formItemName,
            category: formCategory,
            quantity: formQuantity,
            status: formStatus,
            image: capturedImage || rec.image,
            fileName: uploadedFile ? uploadedFile.name : rec.fileName,
            lastUpdated: timestamp
          };
          // Track offline queue if state is toggled
          if (!isOnline) {
            setOfflineQueue(q => [...q, `UPDATE record ${rec.id}`]);
          }
          return updated;
        }
        return rec;
      }));
      triggerToast(`Record ${editRecordId} updated successfully.`);
      setEditRecordId(null);
    } else {
      // Create
      const newId = `M-${Math.floor(100 + Math.random() * 900)}`;
      const newRecord: ManagerRecord = {
        id: newId,
        itemName: formItemName,
        category: formCategory,
        quantity: formQuantity,
        status: formStatus,
        image: capturedImage || undefined,
        fileName: uploadedFile ? uploadedFile.name : undefined,
        lastUpdated: timestamp
      };
      setRecords(prev => [newRecord, ...prev]);
      if (!isOnline) {
        setOfflineQueue(q => [...q, `CREATE record ${newId}`]);
      }
      triggerToast(`Record ${newId} initialized on Ledger.`);
    }

    // Reset Form
    setFormItemName("");
    setFormQuantity(100);
    setCapturedImage(null);
    setUploadedFile(null);
  };

  const handleEditInit = (rec: ManagerRecord) => {
    setEditRecordId(rec.id);
    setFormItemName(rec.itemName);
    setFormCategory(rec.category);
    setFormQuantity(rec.quantity);
    setFormStatus(rec.status);
    setCapturedImage(rec.image || null);
    if (rec.fileName) {
      setUploadedFile({ name: rec.fileName, size: "Linked" });
    } else {
      setUploadedFile(null);
    }
    triggerToast(`Modifying record ${rec.id}...`);
    // Scroll smoothly to form
    document.getElementById("form-anchor")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    if (!isOnline) {
      setOfflineQueue(q => [...q, `DELETE record ${id}`]);
    }
    triggerToast(`Record ${id} removed safely.`);
  };

  // SYNC TIMERS & OFFLINE EMULATOR
  const emulatedSync = () => {
    if (offlineQueue.length === 0) {
      triggerToast("Telemetry Ledger is already completely synchronized.");
      return;
    }
    setIsSyncing(true);
    triggerToast("Initiating secure biocompliance Cloud Handshake...");
    setTimeout(() => {
      setIsSyncing(false);
      setOfflineQueue([]);
      const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC";
      setLastBackupTime(timestamp);
      triggerToast("Synchronization final! Transmitted logs successfully.");
    }, 2000);
  };

  // EXPORT METRICS LOGIC
  const handleExportLedger = (format: "pdf" | "csv" | "excel" | "print") => {
    const title = "Manager's Desk Operational Ledger Report";
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const code = `MGR-LEDG-${Math.floor(100000 + Math.random() * 900000)}`;

    if (format === "csv") {
      let csvContent = "ID,Item Name,Category,Quantity,Status,Last Updated\n";
      records.forEach(r => {
        csvContent += `"${r.id}","${(r.itemName || '').replace(/"/g, '""')}","${r.category}",${r.quantity},"${r.status}","${r.lastUpdated}"\n`;
      });
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Manager_Telemetry_Ledger_${new Date().toISOString().substring(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast("Ledger CSV dispatch completed.");

    } else if (format === "excel") {
      let excelContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Manager Ledger</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
          <style>
            table { border-collapse: collapse; }
            th { background-color: #1e1b4b; color: #ffffff; font-weight: bold; border: 1px solid #cbd5e1; padding: 6px; text-align: left; }
            td { border: 1px solid #cbd5e1; padding: 6px; }
            .header { font-size: 16px; font-weight: bold; color: #4338ca; }
          </style>
        </head>
        <body>
          <table>
            <tr><td colspan="6" class="header">${title}</td></tr>
            <tr><td colspan="6">Date: ${dateStr} | Code: ${code}</td></tr>
            <tr><td colspan="6"></td></tr>
            <tr>
              <th>ID</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Last Updated</th>
            </tr>
      `;

      records.forEach(r => {
        excelContent += `
          <tr>
            <td>${r.id}</td>
            <td>${r.itemName}</td>
            <td>${r.category}</td>
            <td>${r.quantity}</td>
            <td>${r.status}</td>
            <td>${r.lastUpdated}</td>
          </tr>
        `;
      });

      excelContent += `
          </table>
        </body>
        </html>
      `;

      const blob = new Blob([excelContent], { type: "application/vnd.ms-excel" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Manager_Telemetry_Ledger_${new Date().toISOString().substring(0,10)}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast("Ledger Excel sheet downloaded!");

    } else if (format === "print" || format === "pdf") {
      let rowsHtml = "";
      records.forEach(r => {
        rowsHtml += `
          <tr>
            <td><code>${r.id}</code></td>
            <td><strong>${r.itemName}</strong></td>
            <td><span class="badge">${r.category}</span></td>
            <td class="text-right">${r.quantity} units</td>
            <td><strong>${r.status}</strong></td>
            <td>${r.lastUpdated}</td>
          </tr>
        `;
      });

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${title}</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                  color: #1e293b;
                  padding: 40px;
                  max-width: 900px;
                  margin: 0 auto;
                }
                .header-area {
                  border-bottom: 2px solid #cbd5e1;
                  padding-bottom: 15px;
                  margin-bottom: 30px;
                }
                .title {
                  font-size: 22px;
                  font-weight: 900;
                  color: #1e1b4b;
                  margin: 0;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
                }
                th {
                  background-color: #f1f5f9;
                  border: 1px solid #cbd5e1;
                  padding: 10px;
                  font-size: 11px;
                  text-transform: uppercase;
                  color: #475569;
                  text-align: left;
                }
                td {
                  border: 1px solid #cbd5e1;
                  padding: 10px;
                  font-size: 12px;
                }
                .badge {
                  background-color: #e0e7ff;
                  color: #3730a3;
                  padding: 2px 6px;
                  border-radius: 4px;
                  font-size: 10px;
                  font-weight: 700;
                }
                .text-right {
                  text-align: right;
                }
              </style>
            </head>
            <body>
              <div class="header-area">
                <h1 class="title">${title}</h1>
                <div style="font-size: 12px; color: #64748b; margin-top: 5px;">
                  Code: ${code} | Generated: ${dateStr}
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th class="text-right">Quantity</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  ${rowsHtml}
                </tbody>
              </table>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6">
      
      {/* Toast popup Alert */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500 text-emerald-350 font-mono text-xs px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xl animate-bounce">
          <CheckCircle size={16} className="text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Main Header Widget */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block mb-1 font-mono">
            Biosecure Compliance Suite
          </span>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            ⚙️ MANAGER'S DESK OPERATIONAL LEDGER
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-2xl">
            Execute high-fidelity data entries, test offline backups, and coordinate direct digital telemetry synchronizations natively with executive-level ledger auditing.
          </p>
        </div>
        
        {/* Connection status tracker */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setIsOnline(!isOnline);
              triggerToast(isOnline ? "Network Disengaged. Emulating offline queue buffering." : "Network Established. Automatic background syncing online.");
            }}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition cursor-pointer select-none ${
              isOnline 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" 
                : "bg-amber-500/10 text-amber-500 border-amber-500/25"
            }`}
            title="Toggle network connectivity simulation"
          >
            {isOnline ? (
              <>
                <Wifi size={13} className="animate-pulse" />
                <span>ONLINE CLOUD MODE</span>
              </>
            ) : (
              <>
                <WifiOff size={13} />
                <span>OFFLINE LOCAL MODE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Horizontal Subsystem Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-850">
        <button
          onClick={() => setActiveSubSection("data_mgmt")}
          className={`py-3 px-4 rounded-xl text-xs font-black tracking-wide flex items-center justify-center gap-2.5 transition cursor-pointer ${
            activeSubSection === "data_mgmt"
              ? "bg-slate-800 text-white shadow-md border-b-2 border-emerald-400 font-black"
              : "text-slate-400 hover:text-white hover:bg-slate-900/40"
          }`}
        >
          <Database size={15} className="text-emerald-400" />
          <span>1. Data Management Features</span>
        </button>
        
        <button
          onClick={() => setActiveSubSection("cloud_sync")}
          className={`py-3 px-4 rounded-xl text-xs font-black tracking-wide flex items-center justify-center gap-2.5 transition cursor-pointer ${
            activeSubSection === "cloud_sync"
              ? "bg-slate-800 text-white shadow-md border-b-2 border-emerald-400 font-black"
              : "text-slate-400 hover:text-white hover:bg-slate-900/40"
          }`}
        >
          <CloudLightning size={15} className="text-sky-400" />
          <span>2. Cloud Synchronization</span>
        </button>

        <button
          onClick={() => setActiveSubSection("analytics")}
          className={`py-3 px-4 rounded-xl text-xs font-black tracking-wide flex items-center justify-center gap-2.5 transition cursor-pointer ${
            activeSubSection === "analytics"
              ? "bg-slate-800 text-white shadow-md border-b-2 border-emerald-400 font-black"
              : "text-slate-400 hover:text-white hover:bg-slate-900/40"
          }`}
        >
          <FileText size={15} className="text-violet-400" />
          <span>3. Reporting &amp; Analytics</span>
        </button>
      </div>

      {/* SUB-SECTION 1: DATA MANAGEMENT */}
      {activeSubSection === "data_mgmt" && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Intro Strip */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-850 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs">
              <span className="text-emerald-400 text-base">📝</span>
              <p className="font-semibold text-slate-300">
                <strong>Data Entry Forms:</strong> Create, edit, and delete real items, attach related files via drag-and-drop, and capture snapshots securely.
              </p>
            </div>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-3 py-1 font-mono font-bold rounded-lg shrink-0">
              LEDGER AUDITING LIVE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Record Creation/Editing Form */}
            <div id="form-anchor" className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <h4 className="text-xs font-black tracking-wider uppercase text-slate-200">
                  {editRecordId ? `Edit Record • ${editRecordId}` : "Create New Record Entry"}
                </h4>
                {editRecordId && (
                  <button 
                    onClick={() => {
                      setEditRecordId(null);
                      setFormItemName("");
                      setFormQuantity(100);
                      setCapturedImage(null);
                      setUploadedFile(null);
                      triggerToast("Form cleared.");
                    }}
                    className="text-[10px] bg-slate-850 text-slate-400 hover:text-white font-bold px-2 py-1 rounded"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleCreateOrUpdate} className="space-y-3.5 text-xs text-slate-300">
                {/* Item Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Item / Asset Name</label>
                  <input 
                    type="text" 
                    value={formItemName}
                    onChange={(e) => setFormItemName(e.target.value)}
                    placeholder="e.g. Broodstock Premium Starter Feed"
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white text-xs font-medium focus:outline-hidden focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Grid selectors */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Category</label>
                    <select 
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white text-xs font-semibold focus:outline-hidden focus:border-emerald-500 transition-all"
                    >
                      <option value="Feeds Feedstock">Feeds Feedstock</option>
                      <option value="Biological Agent">Biological Agent</option>
                      <option value="Equipment Accessories">Equipment Accessories</option>
                      <option value="Water Treatment">Water Treatment</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Status Class</label>
                    <select 
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white text-xs font-semibold focus:outline-hidden focus:border-emerald-500 transition-all"
                    >
                      <option value="Optimized">Optimized</option>
                      <option value="Critical">Critical</option>
                      <option value="Review">Review</option>
                    </select>
                  </div>
                </div>

                {/* Quantity */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Stock Quantity (Units/Kgs)</label>
                  <input 
                    type="number" 
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(Number(e.target.value))}
                    min={0}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white text-xs font-mono font-bold focus:outline-hidden focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Interactive Drag-and-Drop File Upload Area */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">File Upload (Document Link)</label>
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed p-4 rounded-xl text-center transition cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      isDragOver ? "border-emerald-400 bg-emerald-500/5 text-slate-100" : "border-slate-800 hover:border-slate-700 bg-slate-900/60"
                    }`}
                  >
                    <Upload size={18} className="text-slate-450" />
                    <span className="font-semibold block text-[10.5px]">Drag files here of click below</span>
                    <label className="px-3 py-1 bg-slate-800 hover:bg-slate-750 text-slate-100 rounded-lg text-[9px] font-black tracking-wide cursor-pointer transition">
                      Browse Files
                      <input 
                        type="file" 
                        onChange={handleFileSelect}
                        className="hidden" 
                      />
                    </label>
                    {uploadedFile && (
                      <span className="text-[10px] text-emerald-400 font-mono mt-1 select-none flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        📄 {uploadedFile.name} ({uploadedFile.size})
                      </span>
                    )}
                  </div>
                </div>

                {/* Camera snapshot feature using capture input & fallback native stream */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Image Capture (Biological Sample Photo)</label>
                  <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col gap-3">
                    
                    {showCameraStream ? (
                      <div className="rounded-lg overflow-hidden relative border border-slate-700 aspect-video bg-black flex flex-col items-center justify-center">
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                          <button 
                            type="button" 
                            onClick={capturePhoto} 
                            className="px-3 py-1 bg-emerald-500 text-slate-950 rounded-lg text-[10px] font-extrabold shadow-lg hover:scale-105 active:scale-95 transition"
                          >
                            Capture Sample
                          </button>
                          <button 
                            type="button" 
                            onClick={stopCamera} 
                            className="px-3 py-1 bg-red-600 text-white rounded-lg text-[10px] font-extrabold shadow-lg hover:bg-red-700 transition"
                          >
                            Stop Stream
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button 
                            type="button" 
                            onClick={startCamera} 
                            className="bg-slate-800 hover:bg-slate-755 text-slate-150 px-3 py-2 rounded-xl border border-slate-700 transition flex items-center gap-1.5 hover:text-white"
                          >
                            <Camera size={14} className="text-emerald-400" />
                            <span>Capture via Camera</span>
                          </button>
                          <span className="text-[10px] text-slate-500 font-medium">Or hook manual device files</span>
                        </div>
                        
                        {/* Native mobile camera fallback trigger */}
                        <label className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-750 hover:border-slate-700 transition text-[9px] font-black rounded-lg cursor-pointer">
                          📱 Mobile Cam Capture
                          <input 
                            type="file" 
                            accept="image/*" 
                            capture="environment" 
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  setCapturedImage(reader.result as string);
                                  triggerToast("Mobile snapshot linked.");
                                };
                                reader.readAsDataURL(e.target.files[0]);
                              }
                            }}
                            className="hidden" 
                          />
                        </label>
                      </div>
                    )}

                    {capturedImage && (
                      <div className="relative rounded-lg overflow-hidden border border-slate-800 p-1.5 bg-slate-950 flex items-center gap-3">
                        <img 
                          src={capturedImage} 
                          alt="Captured biological sample preview" 
                          className="w-14 h-14 object-cover rounded-md border border-slate-800"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] text-emerald-400 uppercase font-black font-mono block">Image Sample Saved</span>
                          <span className="text-[10px] text-slate-450 block truncate font-mono">Payload: {capturedImage.substring(0,25)}...</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setCapturedImage(null)} 
                          className="p-1 px-2 bg-slate-850 hover:bg-slate-800 text-red-400 rounded-lg hover:text-red-300 font-bold transition"
                        >
                          Clear
                        </button>
                      </div>
                    )}

                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black tracking-wider uppercase py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10"
                >
                  <Plus size={14} className="stroke-[3]" />
                  <span>{editRecordId ? "Save Record Edits" : "Authorize Ledger Record"}</span>
                </button>
              </form>
            </div>

            {/* List of active Operational Records */}
            <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <h4 className="text-xs font-black tracking-wider uppercase text-slate-200">
                  Manager's Assets &amp; Items Ledger
                </h4>
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[9px] font-bold text-slate-500 font-mono">EXPORT LEDGER:</span>
                  <button 
                    onClick={() => handleExportLedger("pdf")}
                    className="text-[9px] font-black uppercase text-sky-400 bg-sky-955/40 border border-sky-800/35 rounded-md px-2 py-1 hover:bg-sky-900/40 transition cursor-pointer"
                    title="Export PDF Report"
                  >
                    PDF
                  </button>
                  <button 
                    onClick={() => handleExportLedger("csv")}
                    className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-955/40 border border-emerald-800/35 rounded-md px-2 py-1 hover:bg-emerald-900/40 transition cursor-pointer"
                    title="Export CSV"
                  >
                    CSV
                  </button>
                  <button 
                    onClick={() => handleExportLedger("excel")}
                    className="text-[9px] font-black uppercase text-amber-400 bg-amber-955/40 border border-amber-800/35 rounded-md px-2 py-1 hover:bg-amber-900/40 transition cursor-pointer"
                    title="Export Excel"
                  >
                    EXCEL
                  </button>
                  <button 
                    onClick={() => handleExportLedger("print")}
                    className="text-[9px] font-black uppercase text-purple-400 bg-purple-955/40 border border-purple-800/35 rounded-md px-2 py-1 hover:bg-purple-900/40 transition cursor-pointer"
                    title="Direct Print"
                  >
                    PRINT
                  </button>
                </div>
              </div>

              {/* Records List Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-850 text-[10px] text-slate-450 font-black uppercase tracking-wider">
                      <th className="py-2.5 px-2">ID</th>
                      <th className="py-2.5 px-3">Item Name</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-2 text-right">Qty</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/40">
                    {records.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="py-3.5 px-2 font-mono text-[10px] font-black text-slate-400">{rec.id}</td>
                        <td className="py-3.5 px-3">
                          <div className="space-y-1">
                            <span className="font-extrabold text-slate-100 block">{rec.itemName}</span>
                            <div className="flex items-center gap-2">
                              {rec.image && (
                                <span className="text-[9px] bg-emerald-500/10 text-emerald-350 px-1 rounded flex items-center gap-0.5">
                                  📸 Snap Linked
                                </span>
                              )}
                              {rec.fileName && (
                                <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded truncate max-w-28 flex items-center gap-0.5">
                                  📄 {rec.fileName}
                                </span>
                              )}
                              <span className="text-[9px] text-slate-500 block font-mono">Updated: {rec.lastUpdated}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-300 font-semibold">{rec.category}</td>
                        <td className="py-3.5 px-2 text-right font-mono font-bold text-slate-200">{rec.quantity.toLocaleString()}</td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase border leading-none ${
                            rec.status === "Optimized" 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                              : rec.status === "Critical" 
                                ? "bg-red-500/10 text-red-400 border-red-500/20" 
                                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => handleEditInit(rec)}
                              className="p-1 px-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-800 transition text-[10px] font-extrabold flex items-center gap-1"
                              title="Modify active item properties"
                            >
                              <Edit3 size={11} />
                              <span>Edit</span>
                            </button>
                            <button 
                              onClick={() => handleDelete(rec.id)}
                              className="p-1 px-2 bg-red-950 hover:bg-red-900 border border-red-900/20 text-red-400 hover:text-red-300 rounded transition text-[10px] font-extrabold flex items-center"
                              title="Delete record from workspace"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* SUB-SECTION 2: CLOUD SYNCHRONIZATION */}
      {activeSubSection === "cloud_sync" && (
        <div className="space-y-6 animate-fade-in text-xs text-slate-300 font-sans">
          
          {/* Main Sync banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Backup status card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-black text-sky-400 uppercase tracking-widest block mb-2">System Backups</span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight">Automatic Backups</h4>
                <p className="text-[11px] text-slate-450 mt-1 leading-normal">
                  Redundant snapshots are uploaded securely to primary server locations.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-900/80 flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 font-mono font-bold">● SECURE &amp; COMPLIANT</span>
                <span className="text-[10.5px] font-mono text-slate-400">Interval: 60m</span>
              </div>
            </div>

            {/* Offline-to-Online queue count card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest block mb-2">Offline Cache buffering</span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight">Offline Queue Status</h4>
                <p className="text-[11px] text-slate-450 mt-1 leading-normal">
                  Modifying ledger entries during offline simulation buffers commands locally.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-900/80 flex items-center justify-between">
                <span className="text-xs font-mono font-black text-amber-500">
                  {offlineQueue.length} Pending Commands
                </span>
                <button 
                  disabled={offlineQueue.length === 0 || isSyncing}
                  onClick={emulatedSync}
                  className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider flex items-center gap-1 ${
                    offlineQueue.length > 0 
                      ? "bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer" 
                      : "bg-slate-900 text-slate-600 border border-slate-850 cursor-not-allowed"
                  }`}
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw size={11} className="animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw size={11} />
                      <span>Sync Ledger</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Combined Cloud Connection Status Card */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-black text-violet-400 uppercase tracking-widest block mb-2">Database state</span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight">Cloud Connection Sync</h4>
                <p className="text-[11px] text-slate-450 mt-1 leading-normal">
                  Real-time database status, mapping coordinates securely with Supabase.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-900/80 flex items-center justify-between">
                <span className="text-[10.5px] text-slate-400 font-mono">Last backup time:</span>
                <span className="text-[10.5px] font-mono font-black text-violet-300">{lastBackupTime}</span>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            
            {/* Multi-Device Login Sessions */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
              <div className="border-b border-slate-850 pb-2 flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                  📱 Multi-Device Authorized Sessions
                </h4>
                <span className="text-[10.5px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">3 Connected</span>
              </div>
              <p className="text-[10.5px] text-slate-450 leading-relaxed font-medium">
                Below indicates devices authenticated dynamically under Manager Okello's biosecure profile. Direct access commands are secure.
              </p>

              <div className="space-y-2.5">
                {deviceSessions.map((dev, idx) => {
                  const Icon = dev.icon;
                  return (
                    <div key={idx} className="bg-slate-900 border border-slate-850/80 p-3 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-950 p-2 rounded-xl text-sky-450">
                          <Icon size={16} />
                        </div>
                        <div>
                          <span className="font-extrabold block text-slate-200">{dev.name}</span>
                          <span className="text-[10px] text-slate-500">{dev.location}</span>
                        </div>
                      </div>
                      <span className={`text-[9.5px] font-black uppercase tracking-wider ${
                        dev.status.includes("Now") ? "text-emerald-400" : "text-slate-500 font-medium"
                      }`}>
                        {dev.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simulated Queued actions log */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
              <div className="border-b border-slate-850 pb-2 flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                  📁 Offline Command Buffering Queue
                </h4>
                <span className="text-[10.5px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {offlineQueue.length} Active Buffers
                </span>
              </div>
              <p className="text-[10.5px] text-slate-450 leading-relaxed font-semibold">
                When network connectivity is disengaged, any addition, deletion, or editing tasks are stored inside client-side LocalStorage.
              </p>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 min-h-[150px] flex flex-col justify-between">
                {offlineQueue.length > 0 ? (
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1 select-none text-[10.5px] font-mono">
                    {offlineQueue.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-amber-300">
                        <span>⌛</span>
                        <span>{item} queued for Cloud handshake...</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 py-8 text-slate-500">
                    <CheckCircle size={26} className="text-slate-600 animate-pulse" />
                    <div>
                      <span className="font-bold text-slate-400 block">Ledger Synchronized</span>
                      <span className="text-[10px]">No offline changes detected. Start editing offline to simulate cache!</span>
                    </div>
                  </div>
                )}
                
                {offlineQueue.length > 0 && (
                  <button 
                    onClick={emulatedSync}
                    className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl uppercase transition cursor-pointer text-[11px]"
                  >
                    Sync Buffer Queue Now
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUB-SECTION 3: REPORTING & ANALYTICS */}
      {activeSubSection === "analytics" && (
        <div className="space-y-6 animate-fade-in text-xs text-slate-300 font-sans">
          
          {/* Dashboard Control panel */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-violet-400 uppercase font-black tracking-widest block font-mono">Analytical Reports Dispatcher</span>
              <h4 className="text-sm font-black text-white mt-0.5">Performance Dashboards &amp; Exports</h4>
              <p className="text-[10.5px] text-slate-400 leading-normal">
                Analyze compiled feed volumes, spawning success indexes, and realization margins.
              </p>
            </div>
             <div className="flex flex-wrap items-center gap-2">
               <button 
                 onClick={() => handleExportLedger("pdf")}
                 className="bg-sky-500 hover:bg-sky-400 text-slate-950 px-3.5 py-2 rounded-xl font-black uppercase tracking-wider text-[10px] flex items-center gap-1.5 cursor-pointer transition"
                 title="Export PDF Report"
               >
                 <FileText size={13} className="stroke-[3]" />
                 <span>PDF</span>
               </button>
               <button 
                 onClick={() => handleExportLedger("csv")}
                 className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl font-black uppercase tracking-wider text-[10px] flex items-center gap-1.5 cursor-pointer transition"
                 title="Export CSV spreadsheet"
               >
                 <Download size={13} className="stroke-[3]" />
                 <span>CSV</span>
               </button>
               <button 
                 onClick={() => handleExportLedger("excel")}
                 className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-2 rounded-xl font-black uppercase tracking-wider text-[10px] flex items-center gap-1.5 cursor-pointer transition"
                 title="Export Excel formatted spreadsheet"
               >
                 <Download size={13} className="stroke-[3]" />
                 <span>Excel</span>
               </button>
               <button 
                 onClick={() => handleExportLedger("print")}
                 className="bg-purple-500 hover:bg-purple-400 text-slate-950 px-3.5 py-2 rounded-xl font-black uppercase tracking-wider text-[10px] flex items-center gap-1.5 cursor-pointer transition"
                 title="Print snapshot directly"
               >
                 <FileText size={13} className="stroke-[3]" />
                 <span>Print</span>
               </button>
             </div>
          </div>

          {/* Performance Dashboard KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col justify-between">
              <span className="text-[9.5px] text-slate-500 block uppercase font-mono font-bold">Spawning Growth</span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-xl font-mono font-black text-emerald-400">+158.3%</span>
                <span className="text-[9px] text-slate-400">vs Prev Month</span>
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col justify-between">
              <span className="text-[9.5px] text-slate-500 block uppercase font-mono font-bold">Feed Conversion Ratio</span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-xl font-mono font-black text-white">1.45 FCR</span>
                <span className="text-[9px] text-emerald-400">Optimal Range</span>
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col justify-between">
              <span className="text-[9.5px] text-slate-500 block uppercase font-mono font-bold">Biological Survival Index</span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-xl font-mono font-black text-emerald-400">92.5%</span>
                <span className="text-[9px] text-slate-400">Target: 90%</span>
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col justify-between">
              <span className="text-[9.5px] text-slate-500 block uppercase font-mono font-bold">Lot Realization Level</span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-xl font-mono font-black text-white">Optimized</span>
                <span className="text-[9px] text-sky-400">Live Telemetry</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            
            {/* Chart Module 1: Feeds and Spawning indexes */}
            <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl flex flex-col justify-between">
              <div className="border-b border-slate-850 pb-3 mb-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-200 flex items-center gap-1.5">
                    <BarChart3 size={14} className="text-emerald-450 animate-bounce" />
                    Interactive Spawning &amp; Feed Resource Logistics
                  </h4>
                  <p className="text-[10px] text-slate-450 mt-0.5">Biocompatible volume indexes tracked across the preceding 6 months</p>
                </div>
              </div>

              <div className="h-56 w-full text-[10.5px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorFeed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSpawn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b" }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Area type="monotone" dataKey="feedQty" name="Feed Supplied (kg)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorFeed)" />
                    <Area type="monotone" dataKey="spawnQty" name="Spawning Run realizing (thousands)" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorSpawn)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart Module 2: Biological survival curves vs COGS */}
            <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl flex flex-col justify-between">
              <div className="border-b border-slate-850 pb-3 mb-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-200 flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-violet-450" />
                    Biological Survival Target vs Unit Cost Analytics
                  </h4>
                  <p className="text-[10px] text-slate-450 mt-0.5">Monthly tracking of percentage fry survival vs unit cost ratios.</p>
                </div>
              </div>

              <div className="h-56 w-full text-[10.5px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b" }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="survivalRate" name="Fry Survival Rate (%)" fill="#0284c7" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="cogs" name="Unit Production Cost index (Ush)" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
