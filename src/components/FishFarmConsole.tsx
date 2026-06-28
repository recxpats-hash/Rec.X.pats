/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  StockInventory, 
  FishFeedRecord, 
  FeedProfile,
  FeedingSchedule,
  SupplierRecord, 
  LPORecord, 
  InvoiceRecord, 
  WaterQualityRecord, 
  SpawningRecord, 
  HealthRecord, 
  PondRecord, 
  FarmRecord,
  TraceRecord,
  AppointmentBooking,
  HarvestRecord,
  MaintenanceRecord,
  StaffActivityRecord,
  BatchRecord
} from "../types";
import { 
  Warehouse, 
  Scale, 
  FileText, 
  Droplets, 
  Users, 
  Dna, 
  Heart, 
  Sparkles, 
  Grid, 
  ShieldAlert, 
  Settings, 
  Link2, 
  Plus, 
  Trash2, 
  Search, 
  TrendingUp, 
  Settings2,
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  X, 
  CreditCard,
  Thermometer,
  Gauge,
  Lock,
  Sliders,
  Shield,
  Activity,
  BarChart3,
  Globe,
  MapPin,
  Building,
  Layers,
  Wrench,
  ShieldCheck,
  ClipboardList,
  CheckSquare,
  Zap,
  Sun,
  Video,
  Info,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart
} from "recharts";
import ManagersDeskPanel from "./ManagersDeskPanel";
import AppLogo from "./AppLogo";
import BackgroundWatermark from "./BackgroundWatermark";
import StaffManagementDashboard from "./StaffManagementDashboard";

interface FishFarmConsoleProps {
  inventoryManagement: StockInventory[];
  feeds: FishFeedRecord[];
  feedProfiles: FeedProfile[];
  schedules: FeedingSchedule[];
  suppliers: SupplierRecord[];
  lpos: LPORecord[];
  invoices: InvoiceRecord[];
  waterQuality: WaterQualityRecord[];
  spawning: SpawningRecord[];
  health: HealthRecord[];
  ponds: PondRecord[];
  batches?: BatchRecord[];
  farms?: FarmRecord[];
  traces: TraceRecord[];
  bookings?: AppointmentBooking[];
  harvests?: HarvestRecord[];
  maintenances?: MaintenanceRecord[];
  staffActivities?: StaffActivityRecord[];
  staffMembers?: any[];
  scheduledTasks?: any[];
  dbLoaded?: boolean;
  onAddRecord: (model: string, data: any) => Promise<void>;
  onDeleteRecord: (model: string, id: string) => Promise<void>;
  onUpdateRecord?: (model: string, id: string, data: any) => Promise<void>;
  walletAddress?: string;
  connectMetaMask?: () => Promise<void>;
  isConnectingWallet?: boolean;
  readOnly?: boolean;
  isExecutiveScope?: boolean;
  currentUserEmail?: string;
}

export default function FishFarmConsole({
  inventoryManagement,
  feeds,
  feedProfiles,
  schedules,
  suppliers,
  lpos,
  invoices,
  waterQuality,
  spawning,
  health,
  ponds,
  batches = [],
  farms = [],
  traces,
  bookings = [],
  harvests = [],
  maintenances = [],
  staffActivities = [],
  staffMembers = [],
  scheduledTasks = [],
  dbLoaded = false,
  onAddRecord,
  onDeleteRecord,
  onUpdateRecord,
  walletAddress,
  connectMetaMask,
  isConnectingWallet,
  readOnly = true,
  isExecutiveScope = false,
  currentUserEmail = ""
}: FishFarmConsoleProps) {
  // Operations Navigation state
  const [activeTab, setActiveTab] = useState<
    | "managersDesk"
    | "inventoryManagement"
    | "feeds"
    | "water"
    | "spawning"
    | "farm"
    | "healthMgmt"
    | "harvestMgmt"
    | "maintenanceMgmt"
    | "staffActivityMgmt"
  >(isExecutiveScope ? "managersDesk" : "inventoryManagement");

  // Real farm list supporting persistent backend databases
  const farmsList = (dbLoaded || (farms && farms.length > 0)) ? farms : [
    { id: "farm-1", name: "Luwero Main Fish Farm & Broodstock", location: "Luwero District, Central Uganda", acreage: 4.5, managerName: "Denis Sserwadda", description: "Central operations hub containing recirculating spawning tanks, deep incubation flow modules, and initial fry acclimatization systems.", layoutMapping: "linear_grow_out_4_phase" },
    { id: "farm-2", name: "Jinja Estuary Cage Platform", location: "Jinja Near Source of Victoria Nile", acreage: 2.2, managerName: "George Okello", description: "High-yield riverine floating cage matrix for monoculture Tilapia grow-out and intensive weight classification stages.", layoutMapping: "estuary_cage_matrix" }
  ];

  // GPS navigation & geofencing state variables
  const [geofenceRadius, setGeofenceRadius] = useState<number>(350); // meters
  const [isTruckMoving, setIsTruckMoving] = useState<boolean>(true);
  const [geofenceTriggered, setGeofenceTriggered] = useState<boolean>(false);
  const [activeGeoRoute, setActiveGeoRoute] = useState<"Luwero_To_Jinja" | "Luwero_To_Entebbe">("Luwero_To_Jinja");
  const [gpsSimIndex, setGpsSimIndex] = useState<number>(3); // simulated progress counter
  const [truckTemperature, setTruckTemperature] = useState<number>(4.2); // for cold-chain safety monitoring 

  // Mock geofence triggers list 
  const [geofenceAlerts, setGeofenceAlerts] = useState<Array<{ id: string; timestamp: string; location: string; event: string; type: "info" | "warning" | "danger" }>>([
    { id: "geo-1", timestamp: "11:24:05 UTC", location: "Luwero Main Perimeter", event: "Cold-chain Truck #04 entered secure Fish Farm perimeter", type: "info" },
    { id: "geo-2", timestamp: "12:15:20 UTC", location: "Entebbe Export Zone", event: "Warning: High Temperature Alert outside Entebbe geofence", type: "warning" },
    { id: "geo-3", timestamp: "14:10:02 UTC", location: "Luwero Broodstock Zone", event: "Unauthorized Personnel detected crossing Breeding Pond perimeter geofence!", type: "danger" }
  ]);

  // Track expanded inventory SKU item detail cards
  const [expandedSkuId, setExpandedSkuId] = useState<string | null>(null);

  // Sub-navigation state for Feeds tab
  const [feedSubTab, setFeedSubTab] = useState<"consumption" | "suppliers">("consumption");
  const [farmViewSubTab, setFarmViewSubTab] = useState<"farms" | "ponds" | "layout">("farms");
  const [selectedFarmLayoutId, setSelectedFarmLayoutId] = useState<string>("");
  const [expandedConsumptionId, setExpandedConsumptionId] = useState<string | null>(null);
  const [expandedSupplierId, setExpandedSupplierId] = useState<string | null>(null);
  const [expandedSpawningId, setExpandedSpawningId] = useState<string | null>(null);

  // Report Modal states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState("");
  const [isGeneratingReportAI, setIsGeneratingReportAI] = useState(false);

  const handleExportOperationsReport = (format: "pdf" | "csv" | "excel" | "print") => {
    const title = "Unified Facility Operational Audit Report";
    const subTitle = "RecXpats Fish Farm Operations Master Summary";
    const officer = currentUserEmail || "okello@manager.com";
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const code = `OP-REP-${Math.floor(100000 + Math.random() * 900000)}`;

    const metrics = [
      { name: "Warehouse Stock SKUs", count: inventoryManagement.length },
      { name: "Active Feed Formulas", count: feeds.length },
      { name: "Material & Feed Suppliers", count: suppliers.length },
      { name: "Water Quality Log entries", count: waterQuality.length },
      { name: "Active Spawning Lots", count: spawning.length },
      { name: "Ponds & Rearing Tanks", count: ponds.length },
      { name: "Harvest Batches", count: harvests.length },
      { name: "Biosecurity Health Logs", count: health.length }
    ];

    if (format === "csv") {
      let csvContent = `${title}\n`;
      csvContent += `Report Code,${code}\n`;
      csvContent += `Authorized Officer,${officer}\n`;
      csvContent += `Date,${dateStr}\n\n`;

      csvContent += `OPERATIONAL METRICS OVERVIEW\n`;
      metrics.forEach(m => {
        csvContent += `"${m.name}",${m.count}\n`;
      });

      csvContent += `\nWAREHOUSE SKUs DETAIL\n`;
      csvContent += `SKU,Item Name,Stock Qty,Unit\n`;
      inventoryManagement.slice(0, 15).forEach((item: any) => {
        csvContent += `"${item.skuCode || ''}","${(item.itemName || '').replace(/"/g, '""')}",${item.availableStockQty || 0},"${item.unitOfMeasure || ''}"\n`;
      });

      csvContent += `\nACTIVE PONDS/TANKS DETAIL\n`;
      csvContent += `Pond/Tank,Current Stock,Density,Species\n`;
      ponds.slice(0, 15).forEach((p: any) => {
        csvContent += `"${p.pondName || ''}",${p.currentStockLevel || 0},${p.stockingDensityPerM3 || 0},"${p.stockedSpecies || ''}"\n`;
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Operations_Report_${code}_${new Date().toISOString().substring(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast("Operations Report CSV downloaded!");

    } else if (format === "excel") {
      let excelContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Operations Report</x:Name>
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
            th { background-color: #0f172a; color: #ffffff; font-weight: bold; border: 1px solid #cbd5e1; padding: 6px; text-align: left; }
            td { border: 1px solid #cbd5e1; padding: 6px; }
            .header { font-size: 16px; font-weight: bold; color: #0284c7; }
            .section { font-weight: bold; background-color: #f0f9ff; font-size: 12px; }
          </style>
        </head>
        <body>
          <table>
            <tr><td colspan="4" class="header">${title}</td></tr>
            <tr><td colspan="4">Officer: ${officer} | Date: ${dateStr} | Code: ${code}</td></tr>
            <tr><td colspan="4"></td></tr>
            
            <tr class="section"><td colspan="4">1. OPERATIONAL VOLUME MATRIX OVERVIEW</td></tr>
            <tr><th colspan="2">Metric Section</th><th colspan="2">Volume Record Count</th></tr>
      `;

      metrics.forEach(m => {
        excelContent += `<tr><td colspan="2">${m.name}</td><td colspan="2">${m.count}</td></tr>`;
      });

      excelContent += `
            <tr><td colspan="4"></td></tr>
            <tr class="section"><td colspan="4">2. TOP WAREHOUSE INVENTORY SKUs</td></tr>
            <tr><th>SKU Code</th><th>Item Name</th><th>Stock Qty</th><th>UoM</th></tr>
      `;

      inventoryManagement.slice(0, 10).forEach((item: any) => {
        excelContent += `<tr><td>${item.skuCode || ''}</td><td>${item.itemName || ''}</td><td>${item.availableStockQty || 0}</td><td>${item.unitOfMeasure || ''}</td></tr>`;
      });

      excelContent += `
            <tr><td colspan="4"></td></tr>
            <tr class="section"><td colspan="4">3. ACTIVE PONDS AND REARING RECEPTACLES</td></tr>
            <tr><th>Pond/Tank Name</th><th>Current Stock Level</th><th>Stocking Density</th><th>Stocked Species</th></tr>
      `;

      ponds.slice(0, 10).forEach((p: any) => {
        excelContent += `<tr><td>${p.pondName || ''}</td><td>${p.currentStockLevel || 0}</td><td>${p.stockingDensityPerM3 || 0}</td><td>${p.stockedSpecies || ''}</td></tr>`;
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
      link.setAttribute("download", `Operations_Report_${code}_${new Date().toISOString().substring(0,10)}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast("Operations Report Excel downloaded!");

    } else if (format === "print" || format === "pdf") {
      let metricsHtml = "";
      metrics.forEach(m => {
        metricsHtml += `
          <tr>
            <td><strong>${m.name}</strong></td>
            <td class="text-right">${m.count} Records</td>
          </tr>
        `;
      });

      let inventoryHtml = "";
      inventoryManagement.slice(0, 10).forEach((item: any) => {
        inventoryHtml += `
          <tr>
            <td>${item.skuCode || 'N/A'}</td>
            <td>${item.itemName || 'N/A'}</td>
            <td class="text-right">${item.availableStockQty || 0} ${item.unitOfMeasure || ''}</td>
          </tr>
        `;
      });

      let pondsHtml = "";
      ponds.slice(0, 10).forEach((p: any) => {
        pondsHtml += `
          <tr>
            <td>${p.pondName || 'N/A'}</td>
            <td>${p.stockedSpecies || 'N/A'}</td>
            <td class="text-right">${p.currentStockLevel?.toLocaleString() || 0} fish</td>
            <td class="text-right">${p.stockingDensityPerM3 || 0}/m³</td>
          </tr>
        `;
      });

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${title} - RecXpats Operations</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                  color: #1e293b;
                  line-height: 1.6;
                  padding: 40px;
                  max-width: 850px;
                  margin: 0 auto;
                }
                .logo-section {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  border-bottom: 2px solid #e2e8f0;
                  padding-bottom: 20px;
                  margin-bottom: 30px;
                }
                .logo-title {
                  font-size: 24px;
                  font-weight: 950;
                  color: #0f172a;
                  text-transform: uppercase;
                }
                .logo-tag {
                  font-size: 11px;
                  font-weight: 800;
                  color: #0284c7;
                  text-transform: uppercase;
                  letter-spacing: 0.1em;
                }
                .section-title {
                  font-size: 14px;
                  font-weight: 800;
                  text-transform: uppercase;
                  color: #0f172a;
                  border-bottom: 1.5px solid #e2e8f0;
                  padding-bottom: 6px;
                  margin-top: 35px;
                  margin-bottom: 15px;
                }
                table.data-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 30px;
                }
                table.data-table th {
                  background-color: #f8fafc;
                  border: 1px solid #cbd5e1;
                  padding: 8px 10px;
                  font-size: 11px;
                  font-weight: 700;
                  text-transform: uppercase;
                  color: #64748b;
                  text-align: left;
                }
                table.data-table td {
                  border: 1px solid #cbd5e1;
                  padding: 8px 10px;
                  font-size: 12px;
                  color: #334155;
                }
                .text-right {
                  text-align: right;
                }
                .footer {
                  margin-top: 50px;
                  border-top: 1px solid #e2e8f0;
                  padding-top: 20px;
                  font-size: 10px;
                  color: #94a3b8;
                  text-align: center;
                  text-transform: uppercase;
                }
              </style>
            </head>
            <body>
              <div class="logo-section">
                <div>
                  <div class="logo-tag">RecXpats Operations &amp; Aquaculture Facilities</div>
                  <h1 class="logo-title">${title}</h1>
                  <div style="font-size: 12px; color: #64748b;">${subTitle}</div>
                </div>
                <div style="text-align: right; font-size: 11px; color: #64748b; font-family: monospace;">
                  <div>Ref: ${code}</div>
                  <div>Date: ${dateStr}</div>
                  <div>Officer: ${officer}</div>
                </div>
              </div>

              <div class="section-title">1. Operational Volume Matrix Overview</div>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Metric Section</th>
                    <th class="text-right" style="width: 250px;">Record Count</th>
                  </tr>
                </thead>
                <tbody>
                  ${metricsHtml}
                </tbody>
              </table>

              <div class="section-title">2. Top Warehouse Inventory SKUs</div>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>SKU Code</th>
                    <th>Item Description</th>
                    <th class="text-right">Stock Qty</th>
                  </tr>
                </thead>
                <tbody>
                  ${inventoryHtml}
                </tbody>
              </table>

              <div class="section-title">3. Active Ponds &amp; Rearing Receptacles</div>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Pond/Tank Name</th>
                    <th>Stocked Species</th>
                    <th class="text-right">Current Stock Level</th>
                    <th class="text-right">Stocking Density</th>
                  </tr>
                </thead>
                <tbody>
                  ${pondsHtml}
                </tbody>
              </table>

              <div class="footer">
                🔒 Cryptographic Signature Approved: BIOSECURITY GRADE SECURE AAA ZONE • RECXPATS HARVEST SYSTEMS
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
        triggerToast("Action triggered: Operations Report successfully generated.");
      }
    }
  };

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");
  
  // Water quality multi-dimensional filters
  const [wqFilterTankId, setWqFilterTankId] = useState("All Tanks");
  const [wqFilterTankType, setWqFilterTankType] = useState("All Types");
  const [wqFilterSpecies, setWqFilterSpecies] = useState("All Species");
  const [wqFilterStage, setWqFilterStage] = useState("All Stages");
  const [wqFilterLocation, setWqFilterLocation] = useState("All Locations");
  const [wqFilterDate, setWqFilterDate] = useState("");

  // Unique filter option extractions
  const uniqueTanks = Array.from(new Set(waterQuality.map(w => w.tankId || w.tankName || "N/A"))).filter(Boolean);
  const uniqueTypes = Array.from(new Set(waterQuality.map(w => w.tankType || "N/A"))).filter(Boolean);
  const uniqueSpecies = Array.from(new Set(waterQuality.map(w => w.species || "N/A"))).filter(Boolean);
  const uniqueStages = Array.from(new Set(waterQuality.map(w => w.stage || "N/A"))).filter(Boolean);
  const uniqueLocations = Array.from(new Set(waterQuality.map(w => w.location || "N/A"))).filter(Boolean).filter(l => l !== "N/A" && l !== "");

  // Apply filters to calculate final rendered data
  const filteredWaterQuality = waterQuality.filter(test => {
    // Search query matches Tank ID, Tank Name, Species, Location, or Tested By
    const matchesSearch = !searchQuery || 
      (test.tankId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (test.tankName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (test.species || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (test.location || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (test.testedBy || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTank = wqFilterTankId === "All Tanks" || (test.tankId || test.tankName) === wqFilterTankId;
    const matchesType = wqFilterTankType === "All Types" || test.tankType === wqFilterTankType;
    const matchesSpecies = wqFilterSpecies === "All Species" || test.species === wqFilterSpecies;
    const matchesStage = wqFilterStage === "All Stages" || test.stage === wqFilterStage;
    const matchesLocation = wqFilterLocation === "All Locations" || test.location === wqFilterLocation;
    const matchesDate = !wqFilterDate || test.testDate === wqFilterDate;

    return matchesSearch && matchesTank && matchesType && matchesSpecies && matchesStage && matchesLocation && matchesDate;
  });

  // Calculate summary metrics on the overall dataset to show overview of tested parameters
  const totalTestsCount = waterQuality.length;
  const criticalTendersCount = waterQuality.filter(w => w.dissolvedOxygen < 4.0 || w.ph < 6.5 || w.ph > 8.5 || Number(w.ammonia || 0) > 0.05).length;
  const healthyTanksCount = totalTestsCount - criticalTendersCount;
  
  // Averages calculation for parameters overview panel
  const avgPh = waterQuality.length > 0 ? (waterQuality.reduce((sum, w) => sum + w.ph, 0) / waterQuality.length).toFixed(1) : "N/A";
  const avgDo = waterQuality.length > 0 ? (waterQuality.reduce((sum, w) => sum + w.dissolvedOxygen, 0) / waterQuality.length).toFixed(1) : "N/A";
  const avgTemp = waterQuality.length > 0 ? (waterQuality.reduce((sum, w) => sum + w.temperature, 0) / waterQuality.length).toFixed(1) : "N/A";
  const avgAmmonia = waterQuality.length > 0 ? (waterQuality.reduce((sum, w) => sum + (Number(w.ammonia) || 0), 0) / waterQuality.length).toFixed(3) : "N/A";

  // Form visibility toggles
  const [showAddForm, setShowAddForm] = useState(false);

  // Harvest / Growout sub-tab states & seeded pond cycle details per cycle
  const [harvestActiveSubTab, setHarvestActiveSubTab] = useState<
    "dashboard" | "cycles" | "activeOps" | "calendar" | "forms" | "inventoryAlerts"
  >("dashboard");

  const [isHarvestSubMenuOpen, setIsHarvestSubMenuOpen] = useState(true);

  const [expandedPondCycleId, setExpandedPondCycleId] = useState<string | null>(null);
  const [editingPondCycle, setEditingPondCycle] = useState<any | null>(null);

  // Automations alerts tracking state list (Harvest and Feed alert events)
  const [automationAlerts, setAutomationAlerts] = useState<Array<{
    id: string;
    title: string;
    description: string;
    timestamp: string;
    type: "warning" | "success" | "info" | "danger";
  }>>([
    {
      id: "auto-feed-1",
      title: "Feed Inventory Alert Auto-trigger",
      description: "Low Stock notice: 3.2mm Floating Feed pellets are currently at 115kg, dropping below the designated 150kg safety reorder level. System auto-dispatched digital reorder request LPO-083 to supplier Ugachick Feed Ltd.",
      timestamp: "2026-06-21 Update",
      type: "warning"
    },
    {
      id: "auto-hv-1",
      title: "Harvest Count Inventory Update Automation",
      description: "Automated batch adjustment: Harvest log for POND-01 subtracted 4,500 fish from the active cohort (TIL-092 Tilapia batch), decrementing current growout count precisely to reflect accurate stocking density.",
      timestamp: "2026-06-20 Update",
      type: "success"
    }
  ]);

  const [pondCycles, setPondCycles] = useState<any[]>(() => {
    const saved = localStorage.getItem("pond_cycles_per_cycle");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: "cycle-p01",
        pondId: "POND-01",
        pondLocation: "Luwero Main Compound - North East",
        pondPurpose: "Commercial Grow-out",
        pondSizeM2: 300,
        stockStage: "Grow-out Size",
        species: "Nile Tilapia (Oreochromis niloticus)",
        avgWeightG: 340,
        fishCount: 15400,
        stocksNeededPerPond: 20000,
        amountFeedsNeededPerCycle: 5200,
        stockingDate: "2026-02-14",
        waterTemperature: 27.2,
        aerationNeeded: "Requires continuous paddlewheel aeration (1.5 HP)",
        feedType: "3.2mm Pelleted floating feeds",
        startDate: "2026-02-14",
        endDate: "2026-08-14",
        feedingInstructions: "Ration of 3.5% body weight, administered twice daily (08:00 & 16:30). Monitor DO.",
        feedPerFish: 337.6, // g/fish or g/kg
        feedingFrequency: 2,
        totalFeedUsedPerDay: 54.3,
        feedQuantityPerCycle: 5200,
        biomassGainKg: 3850,
        fcr: 1.35, // feed-kg / biomass-gain-kg
        growthRatePct: 4.8,
        expectedHarvestDate: "2026-08-15",
        mortalityPreHarvestDate: "150 fingerlings (0.9% rate)",
        totalWeightExpected: 5236, // kg
        countHarvested: 15250,
        pricePerUnit: 12500, // Ush per kg
        totalSales: 65450000, // Ush
        destination: "Entebbe Export Processing Center & Local Traders",
        notes: "Excellent water clarity. High FCR performance noted due to automated solar backup pump system.",
        feedWastage: 1.5, // %
        feedWastageNotes: "Extremely low. Wind guards deployed on automatic pellet throwing feed rails.",
        recommendationsAI: "Biomass density is entering critical levels. Increase paddlewheel RPM by 10% during peak-heat hours (13:00 - 15:30) to sustain high DO saturation above 6.0 mg/L.",
        realtimeFeedAI: "Current Water Temp: 27.2°C. Growth curve suggests peak metabolic rate. Favorable cycle timing. Continue feeding rate at 54.3kg per day.",
        feedingScheduleAI: "08:15 Morning Feeder (27.15 kg) | 16:45 Afternoon Feeder (27.15 kg) - Controlled via AI timing relay.",
        supplierInsightsAI: "Ugachick Feed Grade-A delivers optimal FCR (1.35) compared to Diamond brand (1.52). Current pricing remains highly stable.",
        feedConsumptionAI: "Total consumed: 3,450 kg out of 5,200 kg. 1,750 kg remaining in growout depot.",
        ingredientCostAI: "Total cycle feed ingredient ledger cost: Ush 15,600,000 (Based on Ush 3,000 per kg standard).",
        nutritionalProfileAI: "Crude Protein: 32.0% | Crude Oils: 5.5% | Crude Fibre: 4.0% | Phosphorus: 1.1% | Calcium: 1.3%.",
        traceabilityInterface: "UID-TRC-POND01-CYCLE26D (Secured hash verified: 0xbc39...007e1e)"
      },
      {
        id: "cycle-p02",
        pondId: "POND-02",
        pondLocation: "Luwero Main Compound - North West",
        pondPurpose: "RAS",
        pondSizeM2: 150,
        stockStage: "Fingerlings",
        species: "African Catfish (Clarias gariepinus)",
        avgWeightG: 92,
        fishCount: 12500,
        stocksNeededPerPond: 15000,
        amountFeedsNeededPerCycle: 4200,
        stockingDate: "2026-03-10",
        waterTemperature: 28.5,
        aerationNeeded: "Requires medium bubbling diffuser grid",
        feedType: "2.0mm sinking crumble pellets",
        startDate: "2026-03-10",
        endDate: "2026-09-10",
        feedingInstructions: "Distribute evenly over tank. Clean mechanical filter screen daily.",
        feedPerFish: 336.0,
        feedingFrequency: 3,
        totalFeedUsedPerDay: 38.2,
        feedQuantityPerCycle: 4200,
        biomassGainKg: 3100,
        fcr: 1.35,
        growthRatePct: 5.4,
        expectedHarvestDate: "2026-09-15",
        mortalityPreHarvestDate: "80 fish (0.6% rate)",
        totalWeightExpected: 4200,
        countHarvested: 12420,
        pricePerUnit: 11000,
        totalSales: 46200000,
        destination: "Kampala Owino Market Dealers",
        notes: "Excellent survival due to clean water recirculation. Zero ammonia pocket build-up detected.",
        feedWastage: 2.1,
        feedWastageNotes: "Slight accumulation on bio-filter bottom. Upgraded tank vacuum rate.",
        recommendationsAI: "RAS filters are performing exceptionally well. Ensure bio-media backwash sequence is initialized.",
        realtimeFeedAI: "Nitrification rate stable. Keep feed rate at 38.2kg as catfish are exhibiting strong size uniformity.",
        feedingScheduleAI: "07:30 (12.7 kg) | 12:30 (12.7 kg) | 17:30 (12.8 kg) - RAS Controller Automated Dispense.",
        supplierInsightsAI: "Pearl Feeds Inc sinking crumble pellets exhibit minimal disintegration in water. Excellent durability rating.",
        feedConsumptionAI: "Consumed 2,120 kg. Remaining 2,080 kg inside warehouse storehouse.",
        ingredientCostAI: "Total feed expense: Ush 12,600,000 (Based on Ush 3,000 per kg baseline premium).",
        nutritionalProfileAI: "Crude Protein: 42.0% | Crude Oils: 8.5% | Ash: 8.0% | Phosphorus: 1.2% | Moisture: 10.0%.",
        traceabilityInterface: "UID-TRC-POND02-CYCLE26D (Secured hash verified: 0xfa31...de291b)"
      },
      {
        id: "cycle-p03",
        pondId: "POND-03",
        pondLocation: "Luwero compound - Sector Beta",
        pondPurpose: "R&D",
        pondSizeM2: 80,
        stockStage: "Fry",
        species: "Nile Tilapia (Super Male YY Trial)",
        avgWeightG: 12,
        fishCount: 8000,
        stocksNeededPerPond: 8000,
        amountFeedsNeededPerCycle: 1200,
        stockingDate: "2026-05-01",
        waterTemperature: 26.5,
        aerationNeeded: "Continuous micro-bubbler grid",
        feedType: "0.8mm fine starter mash",
        startDate: "2026-05-01",
        endDate: "2026-11-01",
        feedingInstructions: "Feed 6 times daily in tiny portions. High mortality watch stage.",
        feedPerFish: 150.0,
        feedingFrequency: 6,
        totalFeedUsedPerDay: 14.5,
        feedQuantityPerCycle: 1200,
        biomassGainKg: 900,
        fcr: 1.33,
        growthRatePct: 6.8,
        expectedHarvestDate: "2026-11-15",
        mortalityPreHarvestDate: "300 fry (3.7% rate)",
        totalWeightExpected: 960,
        countHarvested: 7700,
        pricePerUnit: 14000,
        totalSales: 13440000,
        destination: "Ndejje University Research Partner Stock",
        notes: "Survival is exceeding academic benchmarks (target was >92%). Dissolved oxygen key parameter here.",
        feedWastage: 4.8,
        feedWastageNotes: "Mash powder dissolves fast. Recommended continuous belt feeder.",
        recommendationsAI: "Transition to 1.2mm crumble starting next Monday to reduce surface oil residue and mash degradation.",
        realtimeFeedAI: "High growth stage. Recommend steady ration. Boost feeding frequency if temperatures remain above 26.8°C.",
        feedingScheduleAI: "08:00 (2.4 kg) | 10:00 (2.4 kg) | 12:00 (2.4 kg) | 14:00 (2.4 kg) | 16:00 (2.4 kg) | 18:00 (2.5 kg).",
        supplierInsightsAI: "Altech Starter Feed shows elite digestive rating. Recommended for upcoming trials.",
        feedConsumptionAI: "Consumed 480 kg of 1,200 kg. Plenty of starter mash in research room.",
        ingredientCostAI: "Total mash feed cost: Ush 5,400,000 (Special micro-capsule premium rate).",
        nutritionalProfileAI: "Crude Protein: 45.0% | Lipid Profile: 12.0% | Phosphorus: 1.5% | Calcium: 1.6%.",
        traceabilityInterface: "UID-TRC-POND03-RDY26 (Secured hash verified: 0x0ef9...f89e22)"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("pond_cycles_per_cycle", JSON.stringify(pondCycles));
  }, [pondCycles]);

  // Form fields states for Batch Stocking Form
  const [frmPondId, setFrmPondId] = useState("POND-01");
  const [frmSpecies, setFrmSpecies] = useState("Tilapia");
  const [frmStockingDate, setFrmStockingDate] = useState("2026-06-21");
  const [frmInitialCount, setFrmInitialCount] = useState(10000);
  const [frmInitialWeightG, setFrmInitialWeightG] = useState(15);
  const [frmFeedType, setFrmFeedType] = useState("Premium Starter Crumble");
  const [frmPondPurpose, setFrmPondPurpose] = useState<any>("Commercial Grow-out");
  const [frmNotes, setFrmNotes] = useState("");

  // Form fields states for Harvest Form
  const [frmHarvestBatchId, setFrmHarvestBatchId] = useState("TIL-092-A");
  const [frmHarvestDate, setFrmHarvestDate] = useState("2026-06-21");
  const [frmHarvestCount, setFrmHarvestCount] = useState(4500);
  const [frmHarvestTotalWeightKg, setFrmHarvestTotalWeightKg] = useState(1575);
  const [frmHarvestDestination, setFrmHarvestDestination] = useState("Kampala Central Processing");
  const [frmHarvestPricePerUnit, setFrmHarvestPricePerUnit] = useState(12500);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPayingInvoiceId, setIsPayingInvoiceId] = useState<string>("");

  const [expandedHealthId, setExpandedHealthId] = useState<string | null>(null);
  const [expandedHarvestId, setExpandedHarvestId] = useState<string | null>(null);
  const [expandedMaintenanceId, setExpandedMaintenanceId] = useState<string | null>(null);
  const [aiDiagnostics, setAiDiagnostics] = useState<Record<string, { loading: boolean; output: string | null }>>({});
  const [aiHarvestReports, setAiHarvestReports] = useState<Record<string, { loading: boolean; output: string | null }>>({});

  const runHlDiagnose = async (record: any) => {
    setAiDiagnostics(prev => ({
      ...prev,
      [record.id]: { loading: true, output: null }
    }));
    try {
      const res = await fetch("/api/gemini/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pathology-remediation",
          data: {
            title: record.name,
            symptoms: record.symptoms || "Regular checks",
            disease: record.diseaseDetected || "None",
            mortality: record.mortalityCount,
            treatment: record.treatmentPrescribed || "None"
          }
        })
      });
      const data = await res.json();
      setAiDiagnostics(prev => ({
        ...prev,
        [record.id]: { loading: false, output: data.text }
      }));
    } catch (err) {
      console.error(err);
      setAiDiagnostics(prev => ({
        ...prev,
        [record.id]: { loading: false, output: "Unable to reach Senior AI Advisor. Check configuration status." }
      }));
    }
  };

  const runHvReport = async (record: any) => {
    setAiHarvestReports(prev => ({
      ...prev,
      [record.id]: { loading: true, output: null }
    }));
    try {
      const res = await fetch("/api/gemini/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "harvest-performance",
          data: {
            batch: record.name,
            estimatedBiomass: record.estimatedBiomassKg,
            actualYield: record.actualYieldKg,
            waste: record.wasteQtyKg,
            coldChain: record.coldChainMaintained ? "Compliant and safe" : "Failed / Risk",
            grading: record.gradingCategory || "Default size",
            cleaning: record.postHarvestCleaning || "None"
          }
        })
      });
      const data = await res.json();
      setAiHarvestReports(prev => ({
        ...prev,
        [record.id]: { loading: false, output: data.text }
      }));
    } catch (err) {
      console.error(err);
      setAiHarvestReports(prev => ({
        ...prev,
        [record.id]: { loading: false, output: "Unable to reach Harvest Logistics AI Advisor. Check configuration status." }
      }));
    }
  };

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Staff log local state
  const [staffLogs, setStaffLogs] = useState<Array<{id: string, staffName: string, role: string, activity: string, date: string}>>([
    { id: "s-1", staffName: "Dr. James Benson", role: "Biologist", activity: "Completed broodstock hormone screening", date: "2026-06-16" },
    { id: "s-2", staffName: "George Ssempa", role: "Operator", activity: "Routine water flushing and filtration check", date: "2026-06-17" }
  ]);

  // Handle addition of custom elements where db model uses unified hooks
  const handleOnChainPayment = async (inv: InvoiceRecord) => {
    if (!walletAddress) {
      if (connectMetaMask) {
        await connectMetaMask();
      } else {
        setActionError("Could not connect to MetaMask. Extension missing.");
      }
      return;
    }
    setIsPayingInvoiceId(inv.id || "");
    setActionError(null);
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const txParams = {
          from: walletAddress,
          to: "0x8269d034fa39665A2069D0281b3E48043003Cd9A", // Fish Farm treasury contract Address
          value: "0x38d7ea4c68000", // tiny payment value
          data: "0x", 
        };
        const txHash = await (window as any).ethereum.request({
          method: "eth_sendTransaction",
          params: [txParams]
        });
        if (txHash && onUpdateRecord && inv.id) {
          await onUpdateRecord("invoices", inv.id, {
            status: "Paid",
            notes: (inv.notes ? `${inv.notes}; ` : "") + `Settle hash: ${txHash.substring(0, 10)}...`
          });
          triggerToast(`Invoice ${inv.invoiceNumber} paid & settled on-chain successfully!`);
        }
      } else {
        setActionError("MetaMask extension not detected.");
      }
    } catch (err: any) {
      console.error(err);
      setActionError(err?.message || "Failed to finalize MetaMask payment.");
    } finally {
      setIsPayingInvoiceId("");
    }
  };

  // Core metrics derived for local analytical charts
  const lowStockCount = inventoryManagement.filter(i => i.quantity <= (i.reorderLevel || 0)).length;
  const approvedBookingsCount = bookings.filter(b => b.status === "Approved" || b.status === "Completed").length;
  const pendingBookingsCount = bookings.filter(b => b.status === "Pending" || !b.status).length;

  // Operations narrow navigation mapping
  const navItems = isExecutiveScope ? [
    { id: "managersDesk" as const, label: "Manager's Desk", icon: Settings, count: 3 },
    { id: "inventoryManagement" as const, label: "INVENTORY MANAGEMENT", icon: Warehouse, count: inventoryManagement.length },
    { id: "feeds" as const, label: "FEEDS MANAGEMENT", icon: Scale, count: schedules.length + suppliers.length },
    { id: "water" as const, label: "WATER MANAGEMENT", icon: Droplets, count: waterQuality.length },
    { id: "spawning" as const, label: "HATCHERY MANAGEMENT", icon: Dna, count: spawning.length },
    { id: "farm" as const, label: "POND MANAGEMENT", icon: Grid, count: ponds.length + (farms ? farms.length : 0) },
    { id: "healthMgmt" as const, label: "HEALTH MANAGEMENT", icon: ShieldAlert, count: health.length },
    { id: "harvestMgmt" as const, label: "HARVEST MANAGEMENT", icon: ClipboardList, count: harvests.length },
    { id: "maintenanceMgmt" as const, label: "FARM MAINTENANCE", icon: Wrench, count: maintenances.length },
    { id: "staffActivityMgmt" as const, label: "STAFF MANAGEMENT", icon: Users, count: staffActivities.length },
  ] : [
    { id: "inventoryManagement" as const, label: "INVENTORY MANAGEMENT", icon: Warehouse, count: inventoryManagement.length },
    { id: "feeds" as const, label: "FEEDS MANAGEMENT", icon: Scale, count: schedules.length + suppliers.length },
    { id: "water" as const, label: "WATER MANAGEMENT", icon: Droplets, count: waterQuality.length },
    { id: "spawning" as const, label: "HATCHERY MANAGEMENT", icon: Dna, count: spawning.length },
    { id: "farm" as const, label: "POND MANAGEMENT", icon: Grid, count: ponds.length + (farms ? farms.length : 0) },
    { id: "healthMgmt" as const, label: "HEALTH MANAGEMENT", icon: ShieldAlert, count: health.length },
    { id: "harvestMgmt" as const, label: "HARVEST MANAGEMENT", icon: ClipboardList, count: harvests.length },
    { id: "maintenanceMgmt" as const, label: "FARM MAINTENANCE", icon: Wrench, count: maintenances.length },
    { id: "staffActivityMgmt" as const, label: "STAFF MANAGEMENT", icon: Users, count: staffActivities.length },
  ];

  return (
    <div className="bg-sky-50/50 min-h-screen flex flex-col md:flex-row rounded-3xl overflow-hidden border border-sky-100 relative">
      {/* Center-aligned Brand Watermark */}
      <BackgroundWatermark mode="light" />
      
      {/* Sidebar navigation */}
      <aside className="w-full md:w-80 bg-sky-950 text-sky-100 p-5 shrink-0 flex flex-col gap-6">
        <div className="flex items-center gap-2 pb-5 border-b border-sky-800">
          <div className="bg-cyan-500 text-sky-950 p-2.5 rounded-xl block">
            <Settings size={22} className="animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight uppercase">RecXpats Fish Farm OS</h2>
            <span className="text-[10px] text-cyan-300 font-medium">Operations Dashboard</span>
          </div>
        </div>

        <div className="text-[11px] font-black tracking-wider text-cyan-400 uppercase select-none px-1.5 pt-1">
          1. OPERATIONS
        </div>

        <nav className="flex flex-col gap-1.5 overflow-y-auto max-h-[70vh] pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className="flex flex-col gap-1">
                <button
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setSearchQuery("");
                    setShowAddForm(false);
                    setActionError(null);
                    if (item.id === "harvestMgmt") {
                      setIsHarvestSubMenuOpen(!isHarvestSubMenuOpen);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive 
                      ? "bg-cyan-400 text-sky-950 shadow-md shadow-cyan-400/10 font-bold" 
                      : "text-sky-200 hover:bg-sky-900/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? "text-sky-950" : "text-cyan-400"} />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${isActive ? 'bg-sky-950 text-cyan-300' : 'bg-sky-900/80 text-sky-300'}`}>
                      {item.count}
                    </span>
                    {item.id === "harvestMgmt" && (
                      isHarvestSubMenuOpen ? (
                        <ChevronDown size={14} className={isActive ? "text-sky-950" : "text-sky-400"} />
                      ) : (
                        <ChevronRight size={14} className={isActive ? "text-sky-950" : "text-sky-400"} />
                      )
                    )}
                  </div>
                </button>

                {/* Sub-menu options for harvestMgmt directly nested inside the operations sidebar */}
                {item.id === "harvestMgmt" && isHarvestSubMenuOpen && (
                  <div className="pl-6 pr-1 py-1 flex flex-col gap-1 transition-all border-l border-sky-800/80 ml-4">
                    {[
                      { id: "dashboard", label: "📊 FCR & KPI Trends", emoji: "📊" },
                      { id: "cycles", label: "🐟 Pond Cycles list", emoji: "🐟" },
                      { id: "activeOps", label: "📈 Active Operations", emoji: "📈" },
                      { id: "calendar", label: "📅 Visual Cycle Calendar", emoji: "📅" },
                      { id: "forms", label: "📝 Stocking & Harvest Logs", emoji: "📝" },
                      { id: "inventoryAlerts", label: "⚠️ Feed & Stock Alerts", emoji: "⚠️" }
                    ].map((subItem) => {
                      const isSubActive = activeTab === "harvestMgmt" && harvestActiveSubTab === subItem.id;
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => {
                            setActiveTab("harvestMgmt" as any);
                            setHarvestActiveSubTab(subItem.id as any);
                          }}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-medium transition cursor-pointer text-left ${
                            isSubActive
                              ? "bg-cyan-950/70 text-cyan-300 font-bold border-l-2 border-cyan-400 pl-2"
                              : "text-sky-300 hover:bg-sky-900/40 hover:text-white"
                          }`}
                        >
                          <span>{subItem.emoji}</span>
                          <span>{subItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-sky-800">
          <button
            onClick={() => setShowReportModal(true)}
            className="w-full bg-cyan-400 hover:bg-cyan-300 text-sky-950 font-black text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:translate-y-[-1px] cursor-pointer"
          >
            <FileText size={16} />
            <span>Generate Operations Report</span>
          </button>
        </div>
      </aside>

      {/* Main viewport */}
      <main className="flex-1 bg-white p-6 md:p-8 flex flex-col gap-6 overflow-x-hidden">
        
        {/* Navigation Info strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-sky-600 block tracking-wider uppercase">Active Control Station</span>
            <h1 className="text-xl font-bold text-slate-800 capitalize flex items-center gap-2">
              {navItems.find(n => n.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Live database search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 w-48 sm:w-64 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 font-bold text-sky-950 rounded-xl text-xs shadow-sm hover:translate-y-[-1px] transition-all cursor-pointer shrink-0"
              title="Generate comprehensive operational audit report"
            >
              <FileText size={14} />
              <span>Generate Report</span>
            </button>

            {!readOnly ? (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 px-4.5 py-2 bg-sky-900 text-white rounded-xl text-xs font-semibold hover:bg-sky-800 shadow-sm hover:translate-y-[-1px] transition-all cursor-pointer shrink-0"
              >
                {showAddForm ? <X size={14} /> : <Plus size={14} />}
                <span>{showAddForm ? "Cancel" : "Add Record"}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4.5 py-2 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl text-xs font-bold leading-none select-none">
                <Lock size={12} className="text-slate-400" />
                <span>Read-Only Console</span>
              </div>
            )}
          </div>
        </div>

        {/* Global Toast / Error Feed */}
        {successToast && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-pulse">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            <span className="font-semibold">{successToast}</span>
          </div>
        )}

        {actionError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-500 shrink-0" />
              <span className="font-semibold">{actionError}</span>
            </div>
            <button onClick={() => setActionError(null)} className="text-rose-400 hover:text-rose-700"><X size={15} /></button>
          </div>
        )}

        {/* Form Overlay Container */}
        {showAddForm && (
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 animate-in slide-in-from-top-4 duration-200">
            <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider mb-4 border-b pb-2 flex items-center gap-2">
              <Plus size={14} className="text-sky-550" /> Add New Record Log
            </h3>
            <FormRouter 
              tab={activeTab} 
              onAdd={async (model, data) => {
                await onAddRecord(model, data);
                setShowAddForm(false);
                triggerToast("Record added successfully.");
              }}
              onClose={() => setShowAddForm(false)}
              onAddLocalStaff={(log) => {
                setStaffLogs([log, ...staffLogs]);
                setShowAddForm(false);
                triggerToast("Staff activity initialized.");
              }}
              ponds={ponds}
              farms={farms}
            />
          </div>
        )}

        {/* MANAGER'S DESK INTEGRATED VISUAL ACTION CONTROL PANEL */}
        {!readOnly && activeTab === "inventoryManagement" && (
          <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white rounded-3xl p-5 md:p-6 shadow-xl border border-slate-750 relative overflow-hidden animate-fade-in mr-1 flex flex-col gap-5 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-sky-900/40 pb-4">
              <div>
                <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1.5 animate-pulse font-mono">
                  📦 OPERATIONS: INVENTORY MANAGEMENT DASHBOARD
                </span>
                <h3 className="text-base font-black tracking-tight text-white leading-tight">
                  Real-time Stock Monitoring & Safety Level Analytics
                </h3>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-sky-400 block font-bold">Total SKUs Tracked:</span>
                <span className="text-cyan-300 text-xs font-mono font-black">{inventoryManagement.length} Items Listed</span>
              </div>
            </div>

            {/* Flex and Reflex Dynamic visualizations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Stock Levels */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 text-xs flex flex-col justify-between hover:bg-slate-800/60 transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="bg-sky-500/10 p-2 rounded-lg text-sky-400">
                    <Warehouse size={16} />
                  </div>
                  <div>
                    <span className="text-slate-400 text-[9px] block uppercase font-bold tracking-wider leading-none mb-1">Stock Levels</span>
                    <span className="text-white font-black text-[14px]">
                      {inventoryManagement.reduce((sum, i) => sum + i.quantity, 0).toLocaleString()} Units
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-sky-300 font-mono">
                  Avg: {inventoryManagement.length ? Math.round(inventoryManagement.reduce((sum, i) => sum + i.quantity, 0) / inventoryManagement.length) : 0} items / SKU
                </div>
              </div>

              {/* 2. Reorder Alert Line */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 text-xs flex flex-col justify-between hover:bg-slate-800/60 transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="bg-rose-500/10 p-2 rounded-lg text-rose-450">
                    <AlertCircle size={16} className="text-rose-450" />
                  </div>
                  <div>
                    <span className="text-slate-400 text-[9px] block uppercase font-bold tracking-wider leading-none mb-1">Reorder Alerts</span>
                    <span className="text-white font-black text-[14px]">
                      {lowStockCount} Alarm Alerts
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] leading-none text-rose-300 font-medium">
                  {lowStockCount > 0 ? (
                    <span className="animate-pulse flex items-center gap-1">⚠️ Procurement required</span>
                  ) : (
                    <span>✓ All items above safe limit</span>
                  )}
                </div>
              </div>

              {/* 3. Expiry Check */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 text-xs flex flex-col justify-between hover:bg-slate-800/60 transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500/10 p-2 rounded-lg text-amber-500">
                    <Clock size={16} />
                  </div>
                  <div>
                    <span className="text-slate-400 text-[9px] block uppercase font-bold tracking-wider leading-none mb-1">Expiry Calendar</span>
                    <span className="text-white font-black text-[14px]">
                      {(() => {
                        const today = new Date();
                        const limit = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
                        return inventoryManagement.filter(i => {
                          if (!i.expiryDate) return false;
                          const exp = new Date(i.expiryDate);
                          return exp <= limit;
                        }).length;
                      })()} Near Expiry
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-amber-300">
                  Monitor shelf duration strictly
                </div>
              </div>

              {/* 4. Valuation holdings */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 text-xs flex flex-col justify-between hover:bg-slate-800/60 transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <span className="text-slate-400 text-[9px] block uppercase font-bold tracking-wider leading-none mb-1">Holdings Valuation</span>
                    <span className="text-white font-black text-[14px]">
                      Ush {inventoryManagement.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-emerald-300 font-mono">
                  Asset Value Logged
                </div>
              </div>
            </div>

            {/* Category split */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-1.5 border-t border-slate-800/50 pt-3">
              {[
                { type: "Equipment", count: inventoryManagement.filter(i => i.inventoryType === "Equipment").length, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                { type: "Feed", count: inventoryManagement.filter(i => i.inventoryType === "Feed").length, color: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
                { type: "Medication", count: inventoryManagement.filter(i => i.inventoryType === "Medication").length, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
                { type: "Fish", count: inventoryManagement.filter(i => i.inventoryType === "Fish").length, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                { type: "Consumables", count: inventoryManagement.filter(i => i.inventoryType === "Consumables").length, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" }
              ].map((cat, idx) => (
                <div key={idx} className={`p-2 rounded-lg border text-center ${cat.color}`}>
                  <span className="text-[9px] block uppercase font-bold font-sans tracking-wide leading-none mb-0.5">{cat.type}</span>
                  <span className="text-xs font-mono font-bold">{cat.count} SKUs</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!readOnly && activeTab === "feeds" && (
          <div className="bg-gradient-to-r from-cyan-900 via-sky-950 to-indigo-950 text-white rounded-3xl p-5 md:p-6 shadow-xl border border-cyan-800/40 relative overflow-hidden animate-fade-in mr-1 flex flex-col gap-5 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyan-800/40 pb-4">
              <div>
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1.5 animate-pulse font-mono">
                  🍲 OPERATIONS: FEEDS MANAGEMENT PERFORMANCE
                </span>
                <h3 className="text-base font-black tracking-tight text-white leading-tight">
                  Feed Usage Logs, Suppliers Integration & FCR Efficiency
                </h3>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-cyan-300 block font-bold">Logged Runs:</span>
                <span className="text-cyan-300 text-xs font-mono font-black">{schedules.length} Logged Entries</span>
              </div>
            </div>

            {/* Flex and Reflex Dynamic visualizations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Feed Usage */}
              <div className="bg-cyan-900/40 border border-cyan-800/50 rounded-xl p-3 text-xs flex flex-col justify-between hover:bg-cyan-900/60 transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-500/20 p-2 rounded-lg text-cyan-400">
                    <Scale size={16} />
                  </div>
                  <div>
                    <span className="text-slate-350 text-[9px] block uppercase font-bold tracking-wider leading-none mb-1">Total Feed Logged</span>
                    <span className="text-white font-black text-[14px]">
                      {schedules.reduce((sum, s) => sum + (s.totalFeedUsedPerDay || s.quantityPerCycle || 0), 0).toLocaleString()} kg
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-cyan-300">
                  Across {new Set(schedules.map(s => s.fishTankId || s.assignedTanks)).size} Active Ponds/Tanks
                </div>
              </div>

              {/* 2. Feed Reorder Level */}
              <div className="bg-cyan-900/40 border border-cyan-800/50 rounded-xl p-3 text-xs flex flex-col justify-between hover:bg-cyan-900/60 transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-500/20 p-2 rounded-lg text-cyan-400">
                    <AlertCircle size={16} className="text-cyan-450" />
                  </div>
                  <div>
                    <span className="text-slate-350 text-[9px] block uppercase font-bold tracking-wider leading-none mb-1">Feed Status</span>
                    <span className="text-white font-black text-[14px]">
                      {feeds.length} Formulations
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-emerald-400 font-bold leading-none">
                  {feeds.some(f => f.stockKg <= f.reorderLevelKg) ? (
                    <span className="text-amber-400 animate-pulse">⚠️ Depot Reorder Levels triggered!</span>
                  ) : (
                    <span>✓ Feed reserve stocks secure</span>
                  )}
                </div>
              </div>

              {/* 3. Fish FCR */}
              <div className="bg-cyan-900/40 border border-cyan-800/50 rounded-xl p-3 text-xs flex flex-col justify-between hover:bg-cyan-900/60 transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-500/20 p-2 rounded-lg text-cyan-400">
                    <Activity size={16} />
                  </div>
                  <div>
                    <span className="text-slate-350 text-[9px] block uppercase font-bold tracking-wider leading-none mb-1">Averaged Fish FCR</span>
                    <span className="text-white font-black text-[14px]">
                      {(() => {
                        const entries = schedules.filter(s => s.biomassGainKg && s.biomassGainKg > 0);
                        if (entries.length === 0) return "1.25 (Standard)";
                        const totalBiomass = entries.reduce((sum, s) => sum + (s.biomassGainKg || 0), 0);
                        const totalFeed = entries.reduce((sum, s) => sum + ((s.totalFeedUsedPerDay || s.quantityPerCycle || 1.1) * 30), 0);
                        return (totalFeed / totalBiomass).toFixed(2);
                      })()} FCR Ratio
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-cyan-300 font-sans">
                  Optimal feed conversion benchmark &lt; 1.5
                </div>
              </div>

              {/* 4. Fish Growth Rate */}
              <div className="bg-cyan-900/40 border border-cyan-800/50 rounded-xl p-3 text-xs flex flex-col justify-between hover:bg-cyan-900/60 transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-500/20 p-2 rounded-lg text-cyan-400">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <span className="text-slate-350 text-[9px] block uppercase font-bold tracking-wider leading-none mb-1">Expected Harvests</span>
                    <span className="text-white font-black text-[14px]">
                      {schedules.filter(s => s.expectedHarvestDate).length} Active Runs
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-teal-300">
                  Growth Index: {schedules.length ? (schedules.reduce((sum, s) => sum + (s.growthRatePct || 0), 0) / schedules.length).toFixed(1) : "2.5"}% daily
                </div>
              </div>
            </div>

            {/* Live AI Advice prompter preview */}
            <div className="border-t border-cyan-800/40 pt-3 text-[10px] text-cyan-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-cyan-400 animate-pulse" />
                <span className="font-semibold text-white">Interactive Feed Advisory (AI):</span>
                <span>"Average water temperature of 26.5°C detected. Recommended FCR optimization: Split feeding schedule to 3 daily slots."</span>
              </div>
              <span className="font-mono text-[9px] px-1.5 py-0.5 bg-cyan-950 rounded text-cyan-300 font-bold border border-cyan-800 uppercase">Interactive Agent Active</span>
            </div>
          </div>
        )}

        {/* Dynamic Display content switcher based on 12 screens */}
        <div className="flex-1">
          {activeTab === "analytics" && (
            <div className="space-y-6 animate-fade-in font-sans">
              
              {/* Dashboard Welcome Header Card */}
              <div className="bg-gradient-to-r from-sky-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md border border-sky-850 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mr-1">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-extrabold text-[10px] uppercase tracking-wider">
                    <Sliders size={13} className="animate-pulse" />
                    <span>Fish Farm Operational Command Cockpit</span>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-white font-sans">
                    RecXpats Nursery & Spawning Analytics
                  </h2>
                  <p className="text-xs text-sky-200/90 max-w-xl font-medium">
                    Integrated visual report of biosecurity records, broodstock spawning ratios, water column parameters, dynamic feed stock balances, and client bookings. 
                  </p>
                </div>
                
                <div className="bg-sky-950/80 px-4 py-3 rounded-2xl border border-sky-800/80 text-center shrink-0">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-cyan-300 block mb-0.5">Biosecurity Grade</span>
                  <span className="text-lg font-mono font-black text-white">Zone AAA Secured</span>
                </div>
              </div>

              {/* Critical Biosecurity Status Alert Banner */}
              {(((waterQuality.length > 0 && waterQuality.some(w => w.dissolvedOxygen < 4.0 || w.ph < 6.2)) || lowStockCount > 0)) && (
                <div className="p-4 bg-red-50/80 border border-red-150 rounded-2xl flex items-start gap-3">
                  <ShieldAlert size={18} className="text-red-650 text-red-600 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <span className="font-bold text-xs text-red-950 block">Operational Warning Alerts Recognized</span>
                    <p className="text-[11px] text-red-800 leading-normal font-medium">
                      {lowStockCount > 0 && `There are currently ${lowStockCount} inventory stock items operating below their designated safety reorder level. `}
                      {waterQuality.some(w => w.dissolvedOxygen < 4.0 || w.ph < 6.2) && `Critical water safety warning! Active tank columns demonstrate dissolved oxygen levels below 4.0 mg/L or pH levels below 6.2. Action required.`}
                    </p>
                  </div>
                </div>
              )}

              {/* Bento Grid Quantitative Scorecards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mr-1">
                
                {/* Scorecard 1: Valuation */}
                <div className="bg-sky-50/50 p-5 rounded-2xl border border-sky-100 flex flex-col justify-between group relative overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-sky-650 uppercase font-extrabold tracking-wider">Stock Assets Valuation</span>
                      <Warehouse size={16} className="text-sky-500" />
                    </div>
                    <div className="text-lg font-mono font-black text-sky-950 mt-3">
                      Ush {inventoryManagement.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0).toLocaleString()}
                    </div>
                  </div>
                  <span className="text-[9px] text-sky-600 font-bold block mt-4 flex items-center gap-1">
                    <CheckCircle2 size={11} /> {inventoryManagement.length} total SKU logs synchronized
                  </span>
                </div>

                {/* Scorecard 2: Water parameters */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between group relative overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Water Column Bio-Index</span>
                      <Droplets size={16} className="text-cyan-500" />
                    </div>
                    <div className="text-lg font-black text-slate-900 mt-3 flex items-baseline gap-1">
                      <span className="font-mono">{waterQuality.length > 0 ? (waterQuality.reduce((sum, w) => sum + w.ph, 0) / waterQuality.length).toFixed(1) : "7.2"}</span>
                      <span className="text-xs text-slate-450 text-slate-400 font-medium">avg pH</span>
                      <span className="mx-1 text-slate-300">|</span>
                      <span className="font-mono">{waterQuality.length > 0 ? (waterQuality.reduce((sum, w) => sum + w.dissolvedOxygen, 0) / waterQuality.length).toFixed(1) : "6.8"}</span>
                      <span className="text-xs text-slate-450 text-slate-400 font-medium font-sans">mg/L D.O.</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-500 font-bold block mt-4 flex items-center gap-1">
                    <Clock size={11} /> {waterQuality.length} realtime water tests monitored
                  </span>
                </div>

                {/* Scorecard 3: Spawning Outputs */}
                <div className="bg-emerald-50 text-emerald-950 p-5 rounded-2xl border border-emerald-150 flex flex-col justify-between group relative overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-emerald-800 uppercase font-extrabold tracking-wider">Fish Farm Spawning Output</span>
                      <Sparkles size={16} className="text-emerald-500" />
                    </div>
                    <div className="text-lg font-mono font-black text-emerald-900 mt-3">
                      {spawning.reduce((sum, s) => sum + Number(s.hatchedFry || 0), 0).toLocaleString()} Fry
                    </div>
                  </div>
                  <span className="text-[9px] text-emerald-850 font-bold block mt-4 flex items-center gap-1">
                    <CheckCircle2 size={11} className="text-emerald-600" /> {spawning.length} active spawning trials listed
                  </span>
                </div>

                {/* Scorecard 4: Logistics Spending */}
                <div className="bg-indigo-50 text-indigo-950 p-5 rounded-2xl border border-indigo-150 flex flex-col justify-between group relative overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-indigo-800 uppercase font-extrabold tracking-wider">Acquisition Expenses</span>
                      <Scale size={16} className="text-indigo-550" />
                    </div>
                    <div className="text-lg font-mono font-black text-indigo-900 mt-3">
                      Ush {lpos.reduce((sum, l) => sum + Number(l.totalAmount || 0), 0).toLocaleString()}
                    </div>
                  </div>
                  <span className="text-[9px] text-indigo-850 font-bold block mt-4 flex items-center gap-1">
                    <Clock size={11} className="text-indigo-600" /> {suppliers.length} active suppliers with LPOs
                  </span>
                </div>

              </div>

              {/* Dynamic Interactive Charts Rows */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mr-1">
                
                {/* Chart 1: Water Quality metrics timeline */}
                <div className="bg-white border text-xs text-slate-800 p-5 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                        <Droplets size={14} className="text-sky-500" /> Water Quality Parameter Trends
                      </h3>
                      <p className="text-[10px] text-slate-400">pH, dissolved oxygen, and temperature logs over time</p>
                    </div>
                    <span className="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">LATEST 10 LOGS</span>
                  </div>

                  <div className="h-64 w-full">
                    {waterQuality.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={waterQuality.slice(-10).map(w => ({
                          date: w.testDate,
                          ph: Number(w.ph || 0),
                          do: Number(w.dissolvedOxygen || 0),
                          temp: Number(w.temperature || 0)
                        })).sort((a,b) => a.date.localeCompare(b.date))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                          <Tooltip />
                          <Legend wrapperStyle={{ fontSize: '10px' }} />
                          <Line type="monotone" strokeWidth={2.5} dataKey="ph" name="pH Value" stroke="#4f46e5" dot={{ r: 3 }} />
                          <Line type="monotone" strokeWidth={2.5} dataKey="do" name="D.O. (mg/L)" stroke="#0ea5e9" dot={{ r: 3 }} />
                          <Line type="monotone" strokeWidth={2.5} dataKey="temp" name="Temp (°C)" stroke="#ea580c" dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 font-medium">No water quality tests logged.</div>
                    )}
                  </div>
                </div>

                {/* Chart 2: Inventory stock valuation distribution */}
                <div className="bg-white border text-xs text-slate-800 p-5 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                        <Warehouse size={14} className="text-indigo-500" /> Stock Assets Capital Allocation
                      </h3>
                      <p className="text-[10px] text-slate-400">Total fiscal value logged across inventory items</p>
                    </div>
                    <span className="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">BY SKU VALUE</span>
                  </div>

                  <div className="h-64 w-full">
                    {inventoryManagement.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={inventoryManagement.map(item => ({
                          name: item.name.substring(0, 15),
                          value: item.quantity * item.unitCost
                        })).sort((a, b) => b.value - a.value).slice(0, 7)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={8} tickLine={false} formatter={(v) => `Ush ${(Number(v)/1000).toFixed(0)}k`} />
                          <Tooltip formatter={(v) => [`Ush ${Number(v).toLocaleString()}`]} />
                          <Bar dataKey="value" name="Asset Capital Allocation" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={28}>
                            {inventoryManagement.map((_, idx) => (
                              <Cell key={`cell-${idx}`} fill={idx % 2 === 0 ? "#0d9488" : "#0f766e"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 font-medium">No inventory SKU stock records.</div>
                    )}
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mr-1">
                
                {/* Chart 3: Spawning eggs weight vs hatched fry output conversion */}
                <div className="bg-white border text-xs text-slate-800 p-5 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                        <Sparkles size={14} className="text-emerald-500" /> Spawn Yield & Conversion Ratios
                      </h3>
                      <p className="text-[10px] text-slate-400">Egg weight vs total hatched fry realized to identify best spawning species</p>
                    </div>
                    <span className="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">REALIZED YIELDS</span>
                  </div>

                  <div className="h-64 w-full">
                    {spawning.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={spawning.slice(-8).map((s, idx) => ({
                          batch: s.spawningDate || `Spawn #${idx+1}`,
                          eggsWeight: Number(s.eggWeightG || 0),
                          hatchedFry: Number(s.hatchedFry || 0)
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="batch" stroke="#94a3b8" fontSize={8} tickLine={false} />
                          <YAxis yAxisId="left" stroke="#94a3b8" fontSize={8} label={{ value: 'Eggs Weight (g)', angle: -90, position: 'insideLeft', style: { fill: '#0ea5e9', fontSize: 8 } }} />
                          <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={8} label={{ value: 'Hatched Fry', angle: 90, position: 'insideRight', style: { fill: '#10b981', fontSize: 8 } }} />
                          <Tooltip />
                          <Legend wrapperStyle={{ fontSize: '10px' }} />
                          <Bar yAxisId="left" dataKey="eggsWeight" name="Spawning Eggs Weight (g)" fill="#38bdf8" barSize={16} radius={[2, 2, 0, 0]} />
                          <Line yAxisId="right" type="monotone" strokeWidth={3} dataKey="hatchedFry" name="Hatched Fry Realized" stroke="#10b981" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 font-medium">No spawning trials recorded.</div>
                    )}
                  </div>
                </div>

                {/* Chart 4: Customer bookings traffic overview */}
                <div className="bg-white border text-xs text-slate-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b pb-3 mb-4 shrink-0">
                    <div>
                      <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                        <Users size={14} className="text-slate-500" /> Bookings & Visitor Traffic Allocation
                      </h3>
                      <p className="text-[10px] text-slate-400">Approved, settled collection orders vs pending queue appointments</p>
                    </div>
                    <span className="text-[8px] bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded font-mono font-bold">CLIENT QUEUE</span>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    
                    {/* Recharts Pie Chart */}
                    <div className="h-44 w-full">
                      {bookings.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: "Approved / Settle", value: approvedBookingsCount },
                                { name: "Pending Review", value: pendingBookingsCount }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={35}
                              outerRadius={50}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              <Cell fill="#10b981" />
                              <Cell fill="#f59e0b" />
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-400">No bookings available.</div>
                      )}
                    </div>

                    {/* Numeric logs */}
                    <div className="space-y-3 font-semibold text-slate-700 p-2">
                      <div className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider block leading-none mb-1">Approved & Completed</span>
                          <span className="text-lg font-mono font-bold text-emerald-600 block">{approvedBookingsCount} Visitor logs</span>
                        </div>
                        <CheckCircle2 size={20} className="text-emerald-500" />
                      </div>

                      <div className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider block leading-none mb-1">Pending Gate Review</span>
                          <span className="text-lg font-mono font-bold text-amber-600 block">{pendingBookingsCount} Appointments</span>
                        </div>
                        <Clock size={20} className="text-amber-500 animate-pulse" />
                      </div>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === "managersDesk" && (
            <div className="animate-in fade-in duration-300">
              <ManagersDeskPanel />
            </div>
          )}

          {activeTab === "inventoryManagement" && (
            <div className="space-y-6">
              {/* Stats badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-sky-50/50 p-5 rounded-2xl border border-sky-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-sky-600 block font-bold uppercase tracking-wider">Total Stock Items</span>
                    <span className="text-2xl font-black text-sky-950 mt-1 block">{inventoryManagement.length}</span>
                  </div>
                  <Warehouse size={32} className="text-sky-350" />
                </div>
                <div className="bg-red-50/70 p-5 rounded-2xl border border-red-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-red-650 block font-bold uppercase tracking-wider">Low Stock Warnings</span>
                    <span className="text-2xl font-black text-red-950 mt-1 block">
                      {inventoryManagement.filter(i => i.quantity <= (i.reorderLevel || 0)).length}
                    </span>
                  </div>
                  <AlertCircle size={32} className="text-red-400" />
                </div>
                <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-650 block font-bold uppercase tracking-wider">Stock Valuation</span>
                    <span className="text-2xl font-black text-emerald-950 mt-1 block">
                      Ush {inventoryManagement.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0).toLocaleString()}
                    </span>
                  </div>
                  <TrendingUp size={32} className="text-emerald-400" />
                </div>
              </div>

              {/* STOCKS INVENTORY VISUAL DASHBOARD */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Chart summary */}
                <div className="lg:col-span-2 bg-slate-50 border p-5 rounded-2xl">
                  <h4 className="text-xs font-black text-sky-950 uppercase mb-3 flex items-center gap-1.5 font-sans">
                    <Warehouse size={14} className="text-sky-600" /> Stock Level vs Safety Reorder Threshold
                  </h4>
                  <div className="h-48 w-full">
                    {inventoryManagement.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={inventoryManagement.map(i => ({
                          name: i.name.substring(0, 12),
                          quantity: i.quantity,
                          reorder: i.reorderLevel || 0
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="name" fontSize={9} />
                          <YAxis fontSize={9} />
                          <Tooltip />
                          <Legend wrapperStyle={{ fontSize: '10px' }} />
                          <Bar dataKey="quantity" name="In Stock" fill="#0284c7" radius={[2, 2, 0, 0]} />
                          <Bar dataKey="reorder" name="Reorder Alert Line" fill="#ef4444" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 font-medium">No stock catalog elements logged.</div>
                    )}
                  </div>
                </div>

                {/* Issues summary list */}
                <div className="bg-red-50/40 p-5 rounded-2xl border border-red-100 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[11px] font-black text-red-950 uppercase mb-2 flex items-center gap-1.5">
                      <AlertCircle size={14} className="text-red-650" /> Identified Low-Stock Disruptions
                    </h4>
                    <p className="text-[10px] text-red-800 mb-3 leading-relaxed">
                      Below lists critical stocks requiring immediate local LPO procurement to prevent fish farm shutdowns.
                    </p>
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                      {inventoryManagement.filter(i => i.quantity <= (i.reorderLevel || 0)).length > 0 ? (
                        inventoryManagement.filter(i => i.quantity <= (i.reorderLevel || 0)).map(item => (
                          <div key={item.id} className="bg-white border border-red-150 p-2 rounded-lg flex justify-between items-center text-[10px]">
                            <div>
                              <span className="font-bold text-slate-900 block">{item.name}</span>
                              <span className="text-red-700 font-mono">Qty: {item.quantity} / Min: {item.reorderLevel || 0}</span>
                            </div>
                            <span className="bg-red-100 text-red-750 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase animate-pulse">Low Stock</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-[10px] text-emerald-800 font-bold p-2 bg-emerald-50 rounded-lg text-center">
                          ✓ All inventory stocks are healthy.
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-[9px] text-red-700 border-t border-red-100 pt-3 mt-3 italic font-semibold">
                    Ensure immediate attention is routed to procurement.
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white border text-xs text-slate-800 rounded-xl overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-55 border-b uppercase text-[10px] text-slate-650 font-bold">
                    <tr>
                      <th className="px-5 py-3">Stock Name</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">Remaining Quantity</th>
                      <th className="px-5 py-3">Unit Cost</th>
                      <th className="px-5 py-3">Total Value</th>
                      <th className="px-5 py-3">Status</th>
                      {!readOnly && <th className="px-5 py-3 text-right">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {inventoryManagement.filter(i => (i.name || "").toLowerCase().includes(searchQuery.toLowerCase())).map((item) => {
                      const isLow = item.quantity <= (item.reorderLevel || 0);
                      const isExpanded = expandedSkuId === item.id;
                      return (
                        <React.Fragment key={item.id}>
                          <tr className="hover:bg-slate-50/50 cursor-pointer transition-colors" onClick={() => setExpandedSkuId(isExpanded ? null : (item.id || null))}>
                            <td className="px-5 py-3 font-semibold text-slate-900 flex items-center gap-2">
                              <span className="text-[10px] text-sky-600">
                                {isExpanded ? "▼" : "▶"}
                              </span>
                              <span>{item.name}</span>
                            </td>
                            <td className="px-5 py-3 text-slate-600">{item.inventoryType || "Fish Farm Stock"}</td>
                            <td className="px-5 py-3">{item.quantity} {item.unitOfMeasure}</td>
                            <td className="px-5 py-3">Ush {item.unitCost.toLocaleString()}</td>
                            <td className="px-5 py-3 font-mono">Ush {(item.quantity * item.unitCost).toLocaleString()}</td>
                            <td className="px-5 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isLow ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                {isLow ? "Low Stock" : "Sufficient"}
                              </span>
                            </td>
                            {!readOnly && (
                              <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => onDeleteRecord("inventoryManagement", item.id || "")} className="text-rose-500 hover:text-rose-800 cursor-pointer p-1"><Trash2 size={14} /></button>
                              </td>
                            )}
                          </tr>
                          {isExpanded && (
                            <tr>
                              <td colSpan={7} className="px-5 py-4 bg-slate-50/85 border-t border-b border-sky-100" onClick={(e) => e.stopPropagation()}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] text-slate-700">
                                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-3xs">
                                    <h5 className="font-bold text-sky-900 border-b pb-1 mb-2">📋 Core Identity & Status</h5>
                                    <ul className="space-y-1.5 font-mono">
                                      <li><span className="text-slate-400 font-sans">Description:</span> {item.description || item.name || "N/A"}</li>
                                      <li><span className="text-slate-400 font-sans">Type:</span> {item.inventoryType || "N/A"}</li>
                                      <li><span className="text-slate-400 font-sans">Brand:</span> {item.brand || "N/A"}</li>
                                      <li><span className="text-slate-400 font-sans">Supplier:</span> {item.supplier || "N/A"}</li>
                                      <li><span className="text-slate-400 font-sans">Last Updated:</span> {item.lastUpdated || "N/A"}</li>
                                      {item.photo && (
                                        <li className="mt-2">
                                          <span className="text-slate-400 block mb-1 font-sans">Attached Photo:</span>
                                          <img src={item.photo} alt="SKU Item" className="w-16 h-16 object-cover rounded-lg border border-slate-200" referrerPolicy="no-referrer" />
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-3xs">
                                    <h5 className="font-bold text-sky-900 border-b pb-1 mb-2">📦 Feed & Batch Specs</h5>
                                    <ul className="space-y-1.5 font-mono">
                                      <li><span className="text-slate-400 font-sans">Feed Name:</span> {item.fishFeedName || "N/A"}</li>
                                      <li><span className="text-slate-400 font-sans">Batch Number:</span> {item.batchNumber || "N/A"}</li>
                                      <li><span className="text-slate-400 font-sans">Qty Received:</span> {item.quantityReceived || 0} {item.unitOfMeasure}</li>
                                      <li><span className="text-slate-400 font-sans">Received Date-Time:</span> {item.dateTimeReceived || "N/A"}</li>
                                      <li><span className="text-slate-400 font-sans">Unit Cost (per kg):</span> Ush {item.unitCostPerKg?.toLocaleString() || "N/A"}</li>
                                      <li><span className="text-slate-400 font-sans">Reorder Level Quantity (kg):</span> {item.reorderLevelQuantityKg || 0} kg</li>
                                    </ul>
                                  </div>
                                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-3xs">
                                    <h5 className="font-bold text-sky-900 border-b pb-1 mb-2">🔬 Nutrient & Log Profile</h5>
                                    <ul className="space-y-1.5 font-mono">
                                      <li><span className="text-slate-400 font-sans">Daily Log Date:</span> {item.dailyLogDate || "N/A"}</li>
                                      <li><span className="text-slate-400 font-sans">Current Feed Qty:</span> {item.currentFeedQuantityKg || 0} kg</li>
                                      <li><span className="text-slate-400 font-sans">Ingredients Used:</span> {item.ingredientsUsed || "N/A"}</li>
                                      <li><span className="text-slate-400 font-sans">Cost per Ingredient (kg):</span> Ush {item.costPerIngredientKg?.toLocaleString() || "N/A"}</li>
                                      <li><span className="text-slate-400 font-sans">Protein / Fat / Fiber:</span> {item.proteinPct || 0}% / {item.fatPct || 0}% / {item.fiberPct || 0}%</li>
                                      <li><span className="text-slate-400 font-sans">Energy (kcal/kg):</span> {item.energyKcal || 0} kcal</li>
                                    </ul>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "feeds" && (
            <div className="space-y-6">
              {/* Dual Sub-Tabs */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-sky-100 pb-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setFeedSubTab("consumption")}
                    className={`px-4 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
                      feedSubTab === "consumption"
                        ? "bg-cyan-500 text-sky-950 shadow shadow-cyan-500/20"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    🍲 Feed Consumption Per Fish Tank/Pond ({schedules.length})
                  </button>
                  <button
                    onClick={() => setFeedSubTab("suppliers")}
                    className={`px-4 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
                      feedSubTab === "suppliers"
                        ? "bg-cyan-500 text-sky-950 shadow shadow-cyan-500/20"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    👥 Feed Suppliers Details ({suppliers.length})
                  </button>
                </div>
                <div className="text-[10px] text-slate-400 italic">
                  *Click any row to reveal complete operational metrics & AI insights
                </div>
              </div>

              {/* Consumption Tab Content */}
              {feedSubTab === "consumption" && (
                <div className="space-y-4">
                  {schedules.length === 0 ? (
                    <div className="bg-white border rounded-xl p-8 text-center text-slate-400 font-medium">
                      No feed consumption records logged yet. Click "Add Record" to log a feed conversion run.
                    </div>
                  ) : (
                    <div className="bg-white border text-xs text-slate-800 rounded-xl overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b uppercase text-[10px] text-slate-550 font-bold">
                          <tr>
                            <th className="px-5 py-3">Pond/Tank ID</th>
                            <th className="px-5 py-3">Fish Count</th>
                            <th className="px-5 py-3">Species & Stage</th>
                            <th className="px-5 py-3">Water Temp</th>
                            <th className="px-5 py-3">Feed Formulation</th>
                            <th className="px-5 py-3">Measured FCR</th>
                            <th className="px-5 py-3">Expected Harvest</th>
                            {!readOnly && <th className="px-5 py-3 text-right">Action</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {schedules.filter(s => (s.assignedTanks || s.fishTankId || "").toLowerCase().includes(searchQuery.toLowerCase())).map((sched) => {
                            const isExpanded = expandedConsumptionId === sched.id;
                            const tankId = sched.fishTankId || sched.assignedTanks || "Tank-1";
                            const count = sched.fishCount || 1500;
                            const species = sched.fishSpecies || "Tilapia";
                            const stage = sched.fishStage || "Fingerling";
                            const temp = sched.waterTemperature || 26.5;
                            const feedType = sched.feedType || "Regular Pellets";
                            const fcrVal = sched.fcr || "1.35";
                            const harvest = sched.expectedHarvestDate || "2026-09-15";

                            return (
                              <React.Fragment key={sched.id}>
                                <tr 
                                  className="hover:bg-slate-50/50 cursor-pointer transition-colors" 
                                  onClick={() => setExpandedConsumptionId(isExpanded ? null : (sched.id || null))}
                                >
                                  <td className="px-5 py-3 font-bold text-sky-950 flex items-center gap-2">
                                    <span className="text-cyan-500 font-mono">●</span> {tankId}
                                  </td>
                                  <td className="px-5 py-3 font-mono">{count.toLocaleString()}</td>
                                  <td className="px-5 py-3 text-slate-650">{species} | <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-800">{stage}</span></td>
                                  <td className="px-5 py-3 font-mono">{temp} °C</td>
                                  <td className="px-5 py-3 font-medium text-slate-700">{feedType}</td>
                                  <td className="px-5 py-3">
                                    <span className="bg-teal-50 text-teal-800 border border-teal-250 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                                      {fcrVal} FCR
                                    </span>
                                  </td>
                                  <td className="px-5 py-3 font-mono text-slate-500">{harvest}</td>
                                  {!readOnly && (
                                    <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                                      <button 
                                        onClick={() => onDeleteRecord("feedingSchedules", sched.id || "")}
                                        className="text-rose-455 hover:text-rose-700 p-1 block ml-auto"
                                        title="Delete Row"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </td>
                                  )}
                                </tr>

                                {/* Expanded bento-grid details for Consumption Record */}
                                {isExpanded && (
                                  <tr>
                                    <td colSpan={readOnly ? 7 : 8} className="bg-slate-50/70 p-5 border-t border-b border-slate-100">
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-750">
                                        
                                        {/* Physical & Feeding Parameters */}
                                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                                          <h5 className="font-extrabold text-sky-950 uppercase text-[10px] tracking-wider border-b pb-1 flex items-center gap-1.5 text-sky-700">
                                            📊 Physical &amp; Biological Data
                                          </h5>
                                          <div className="space-y-1.5">
                                            <div className="flex justify-between"><span className="text-slate-400">Stocking Date:</span> <span className="font-semibold">{sched.fishStockingDate || "2026-04-10"}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-400">Biomass Gain:</span> <span className="font-bold text-slate-900">{sched.biomassGainKg || 45} kg</span></div>
                                            <div className="flex justify-between"><span className="text-slate-400">Growth Rate:</span> <span className="font-mono text-emerald-650 font-bold">+{sched.growthRatePct || 2.5}%/day</span></div>
                                            <div className="flex justify-between"><span className="text-slate-400">Feed Interval:</span> <span className="font-semibold">{sched.feedingFrequencyPerDay || 3} times/day</span></div>
                                            <div className="flex justify-between"><span className="text-slate-400">Feed Per Fish (g):</span> <span className="font-semibold">{sched.feedPerFish || "0.15 g"}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-400">Total Feed/Day:</span> <span className="font-bold text-sky-900">{sched.totalFeedUsedPerDay || 2.5} kg</span></div>
                                            <div className="flex justify-between"><span className="text-slate-400">Feed Qty/Cycle:</span> <span className="font-mono font-bold">{sched.quantityPerCycle || 75} kg (Target)</span></div>
                                          </div>
                                        </div>

                                        {/* Wastage & Biological Schedules */}
                                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                                          <h5 className="font-extrabold text-sky-950 uppercase text-[10px] tracking-wider border-b pb-1 flex items-center gap-1.5 text-sky-700">
                                            📝 Intake Instructions &amp; Warnings
                                          </h5>
                                          <div className="space-y-2">
                                            <div>
                                              <span className="text-slate-400 block text-[9px] uppercase font-bold leading-none mb-1">Standard Instructions:</span>
                                              <p className="bg-slate-50 p-2 rounded text-[10px] font-medium text-slate-700">
                                                {sched.instructions || "Distribute evenly across active trays. Settle bio-columns prior to feeding."}
                                              </p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                              <div>
                                                <span className="text-slate-400 block text-[9px] uppercase font-bold">Feed Wastage:</span>
                                                <span className="text-rose-600 font-bold text-[11px]">{sched.feedWastage || "Negligible"}</span>
                                              </div>
                                              <div>
                                                <span className="text-slate-400 block text-[9px] uppercase font-bold">Wastage Note:</span>
                                                <span className="text-slate-600 font-medium whitespace-nowrap text-ellipsis overflow-hidden block w-full">{sched.feedWastageNotes || "No residual pellets"}</span>
                                              </div>
                                            </div>
                                            <div>
                                              <span className="text-slate-350 block text-[9px] uppercase font-bold">Staff Assessment:</span>
                                              <span className="text-slate-700 font-semibold">{sched.notes || "Healthy appetite response observed."}</span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* AI Automated Recommendations Hub */}
                                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2 col-span-1 md:col-span-1">
                                          <h5 className="font-extrabold text-cyan-700 uppercase text-[10px] tracking-wider border-b pb-1 flex items-center gap-1">
                                            ✨ Smart Recommendations (AI)
                                          </h5>
                                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                            <div className="bg-cyan-50/50 p-2 rounded border border-cyan-150 text-[10px]">
                                              <span className="font-extrabold text-cyan-800 block uppercase text-[8px]">Automated Recommendation:</span>
                                              <p>{sched.aiRecommendations || "Maintain the current feeding density to secure targeted feed retention."}</p>
                                            </div>
                                            <div className="bg-cyan-50/50 p-2 rounded border border-cyan-150 text-[10px]">
                                              <span className="font-extrabold text-cyan-800 block uppercase text-[8px]">Real-time Feed Adjustment:</span>
                                              <p>{sched.aiFeedAdjustment || "If water temp spikes &gt; 28°C, shift delivery times towards morning segments."}</p>
                                            </div>
                                            <div className="bg-cyan-50/50 p-2 rounded border border-cyan-150 text-[10px]">
                                              <span className="font-extrabold text-cyan-800 block uppercase text-[8px]">Optimized Feeding Schedule:</span>
                                              <p>{sched.aiFeedingSchedule || "Suggested intervals: 07:30 AM (40%), 12:30 PM (30%), 05:30 PM (30%)."}</p>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Sourcing & Profile parameters */}
                                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2 col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                                          <div className="bg-slate-50 p-2 rounded-lg">
                                            <span className="text-slate-400 block text-[9px] uppercase font-bold">Supplier Insights:</span>
                                            <p className="font-semibold text-slate-700 mt-1">{sched.aiSupplierInsights || "Sourcing is fully aligned with Kampala premium feed importers."}</p>
                                          </div>
                                          <div className="bg-slate-50 p-2 rounded-lg">
                                            <span className="text-slate-400 block text-[9px] uppercase font-bold">Ingredient Cost Breakdown:</span>
                                            <p className="font-mono font-semibold text-sky-850 mt-1">{sched.aiIngredientCostBreakdown || "Fishmeal: ~48% | Crude soy: ~22%"}</p>
                                          </div>
                                          <div className="bg-slate-50 p-2 rounded-lg">
                                            <span className="text-slate-400 block text-[9px] uppercase font-bold">Nutritional Profile:</span>
                                            <p className="font-semibold text-teal-800 mt-1">{sched.aiNutritionalProfileSummary || "Organic Grower pellet formula: 35% Protein"}</p>
                                          </div>
                                          <div className="bg-slate-50 p-2 rounded-lg border border-dashed border-cyan-300">
                                            <span className="text-cyan-700 block text-[9px] uppercase font-extrabold flex items-center gap-1">🏷️ Traceability Interface</span>
                                            <p className="font-mono text-[9px] text-slate-550 mt-1 leading-none">
                                              {sched.traceabilityInterface || `BATCH#${tankId}-${harvest.substring(0,4)} | Verified Certified Compliant`}
                                            </p>
                                          </div>
                                        </div>

                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Suppliers Tab Content */}
              {feedSubTab === "suppliers" && (
                <div className="space-y-4">
                  {suppliers.length === 0 ? (
                    <div className="bg-white border rounded-xl p-8 text-center text-slate-400 font-medium">
                      No supplier records registered. Click "Add Record" to catalog a feed supplier.
                    </div>
                  ) : (
                    <div className="bg-white border text-xs text-slate-800 rounded-xl overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b uppercase text-[10px] text-slate-550 font-bold">
                          <tr>
                            <th className="px-5 py-3">Company Name</th>
                            <th className="px-5 py-3">Contact Person</th>
                            <th className="px-5 py-3">Phone Number</th>
                            <th className="px-5 py-3">Email Address</th>
                            <th className="px-5 py-3">Physical Address</th>
                            {!readOnly && <th className="px-5 py-3 text-right">Action</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {suppliers.filter(s => (s.name || "").toLowerCase().includes(searchQuery.toLowerCase())).map((sup) => {
                            const isExpanded = expandedSupplierId === sup.id;
                            return (
                              <React.Fragment key={sup.id}>
                                <tr 
                                  className="hover:bg-slate-50/50 cursor-pointer transition-colors" 
                                  onClick={() => setExpandedSupplierId(isExpanded ? null : (sup.id || null))}
                                >
                                  <td className="px-5 py-3 font-bold text-sky-950">{sup.companyName || sup.name}</td>
                                  <td className="px-5 py-3">{sup.contactPerson}</td>
                                  <td className="px-5 py-3 font-mono">{sup.phone}</td>
                                  <td className="px-5 py-3 font-mono text-slate-500">{sup.email || "N/A"}</td>
                                  <td className="px-5 py-3 text-slate-650">{sup.address || "Kampala Industrial Hub"}</td>
                                  {!readOnly && (
                                    <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                                      <button 
                                        onClick={() => onDeleteRecord("suppliers", sup.id || "")}
                                        className="text-rose-455 hover:text-rose-750 p-1 block ml-auto"
                                        title="Delete Supplier"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </td>
                                  )}
                                </tr>

                                {/* Expanded detailed block for Supplier */}
                                {isExpanded && (
                                  <tr>
                                    <td colSpan={readOnly ? 5 : 6} className="bg-slate-50/70 p-4 border-t border-b border-slate-100">
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-750">
                                        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                                          <h6 className="font-extrabold text-sky-950 uppercase text-[9px] mb-2">Automated Sourcing Insights (AI)</h6>
                                          <p className="bg-cyan-50/40 p-2.5 rounded border border-cyan-150 text-[10px] text-cyan-900 leading-relaxed font-medium">
                                            {sup.aiInsights || "Reliable shipping history. Supplies highly digestible premium grain compounds containing high bioavailability protein formulations."}
                                          </p>
                                        </div>
                                        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                                          <h6 className="font-extrabold text-sky-950 uppercase text-[9px] mb-2">Feed Ingredients Base</h6>
                                          <p className="bg-slate-50 p-2.5 rounded border text-[10px] text-slate-700 leading-relaxed">
                                            {sup.feedIngredients || "Standard compound elements: organic fishmeal digest, whole wheat flakes, soy concentrate, brewer's yeast, vitamins premix."}
                                          </p>
                                        </div>
                                        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                                          <h6 className="font-extrabold text-sky-950 uppercase text-[9px] mb-2">Supplier General Memorandum</h6>
                                          <p className="bg-slate-50 p-2.5 rounded border text-[10px] text-slate-705 italic leading-relaxed">
                                            {sup.notes || "Main distributor of premium pellets in sector. Standard delivery turnaround averages 48 hours."}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "procurement" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border">
                  <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Registered Suppliers ({suppliers.length})</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {suppliers.map(sup => (
                      <div key={sup.id} className="bg-white p-2.5 rounded-lg border text-xs">
                        <p className="font-bold text-slate-900">{sup.name}</p>
                        <p className="text-[10px] text-slate-500">{sup.phone} | {sup.contactPerson}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border">
                  <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Local Purchase Orders ({lpos.length})</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {lpos.map(lpo => (
                      <div key={lpo.id} className="bg-white p-2.5 rounded-lg border text-xs flex justify-between">
                        <div>
                          <p className="font-bold text-slate-900">{lpo.lpoNumber}</p>
                          <p className="text-[10px] text-slate-500">{lpo.supplierName} | {lpo.category}</p>
                        </div>
                        <span className="font-mono text-cyan-700 text-[10px]">Ush {lpo.totalAmount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border">
                  <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Pending Invoices & Wallet Payables</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {invoices.map(inv => (
                      <div key={inv.id} className="bg-white p-2.5 rounded-lg border text-xs flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-900">{inv.invoiceNumber}</p>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${inv.status === "Paid" ? "bg-emerald-100 text-emerald-850" : "bg-amber-105 text-amber-800 border border-amber-300"}`}>
                            {inv.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-xs text-sky-950 font-bold">Ush {inv.amountOwed.toLocaleString()}</p>
                          {!readOnly && inv.status === "Unpaid" && (
                            <button
                              onClick={() => handleOnChainPayment(inv)}
                              disabled={isPayingInvoiceId === inv.id}
                              className="px-2 py-0.5 mt-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-[9px] font-bold text-white rounded cursor-pointer"
                            >
                              {isPayingInvoiceId === inv.id ? "Paying..." : "Pay Wallet"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "water" && (
            <div className="space-y-6">
              {/* WATER QUALITY REAL-TIME METRIC OVERVIEWS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex items-center justify-between text-left">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase block font-sans">Tested Parameters (All)</span>
                    <span className="text-xl font-bold text-slate-900">{totalTestsCount} Logs</span>
                  </div>
                  <div className="p-2.5 bg-blue-50 text-blue-800 rounded-lg font-black text-xs">
                    📊
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex items-center justify-between text-left">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase block font-sans">Avg Water pH level</span>
                    <span className="text-xl font-bold text-slate-900">{avgPh}</span>
                  </div>
                  <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg font-black text-xs">
                    🧪
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex items-center justify-between text-left">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase block font-sans font-sans">Avg Dissolved Oxygen</span>
                    <span className="text-xl font-bold text-slate-900">{avgDo} mg/L</span>
                  </div>
                  <div className="p-2.5 bg-sky-50 text-sky-700 rounded-lg font-black text-xs">
                    💧
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex items-center justify-between text-left">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase block font-sans font-sans">Mean Temperature</span>
                    <span className="text-xl font-bold text-amber-900">{avgTemp} °C</span>
                  </div>
                  <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg font-black text-xs">
                    🌡️
                  </div>
                </div>
              </div>

              {/* WATER QUALITY MANAGEMENT VISUAL DASHBOARD */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Core parameters chart */}
                <div className="lg:col-span-2 bg-slate-50 border p-5 rounded-2xl text-left">
                  <h4 className="text-xs font-black text-sky-950 uppercase mb-3 flex items-center gap-1.5 font-sans">
                    <Gauge size={14} className="text-sky-600" /> Dissolved Oxygen vs Temperature Timeline History
                  </h4>
                  <div className="h-48 w-full">
                    {waterQuality.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={waterQuality.slice(-8)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="testDate" tick={{fontSize: 9}} />
                          <YAxis tick={{fontSize: 9}} />
                          <Tooltip />
                          <Line type="monotone" dataKey="dissolvedOxygen" name="D.O. (mg/L)" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 font-medium">No water quality logs registered.</div>
                    )}
                  </div>
                </div>

                {/* Water Column Risks Callout */}
                <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/80 flex flex-col justify-between text-left">
                  <div>
                    <h4 className="text-[11px] font-black text-amber-950 uppercase mb-2 flex items-center gap-1.5 font-sans">
                      <AlertCircle size={14} className="text-amber-600" /> Active Tank Quality Concerns
                    </h4>
                    <p className="text-[10px] text-amber-800 mb-3 leading-relaxed font-sans">
                      D.O. below 4.0 mg/L or pH levels outside 6.5 - 8.5 will initiate mass fry mortality triggers.
                    </p>
                    
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1 font-sans">
                      {waterQuality.some(w => w.dissolvedOxygen < 4.0 || w.ph < 6.5 || w.ph > 8.5 || Number(w.ammonia || 0) > 0.05) ? (
                        waterQuality.filter(w => w.dissolvedOxygen < 4.0 || w.ph < 6.5 || w.ph > 8.5 || Number(w.ammonia || 0) > 0.05).map(issue => (
                          <div key={issue.id} className="bg-white border border-amber-200 p-2 rounded-lg text-[9px] font-semibold text-slate-800">
                            <span className="font-extrabold text-slate-900 block leading-none mb-1">{issue.tankId || issue.tankName} ({issue.testDate})</span>
                            <div className="flex gap-2">
                              {issue.dissolvedOxygen < 4.0 && <span className="text-red-600 text-[8px] bg-red-100 px-1.5 py-0.5 rounded font-bold">Crit D.O {issue.dissolvedOxygen}</span>}
                              {issue.ph < 6.5 && <span className="text-amber-700 text-[8px] bg-amber-100 px-1.5 py-0.5 rounded font-bold">pH Low {issue.ph}</span>}
                              {issue.ph > 8.5 && <span className="text-red-700 text-[8px] bg-red-100 px-1.5 py-0.5 rounded font-bold">pH High {issue.ph}</span>}
                              {Number(issue.ammonia || 0) > 0.05 && <span className="text-amber-800 text-[8px] bg-amber-100 px-1.5 py-0.5 rounded font-bold font-mono">Ammonia {issue.ammonia}</span>}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-[10px] text-emerald-800 font-bold p-2 bg-emerald-50 rounded-lg text-center">
                          ✓ All tank water columns demonstrate fully compliant bio-indices!
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[9px] text-amber-800 border-t border-amber-150 pt-2 block font-medium">
                    Recommended immediate flushing on alerted bio-columns.
                  </span>
                </div>
              </div>

              {/* NEW PRIORITY ACTIONS AND EMERGENCY TASKS PANEL */}
              {waterQuality.some(w => w.dissolvedOxygen < 4.0 || w.ph < 6.5 || w.ph > 8.5 || Number(w.ammonia || 0) > 0.05) && (
                <div className="bg-red-50 border border-red-200 p-5 rounded-2xl text-left space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={18} className="text-red-600 animate-bounce" />
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider font-sans">
                      ⚠️ PRIORITY CRITICAL ACTIONS &amp; IMMEDIATE TREATMENT PROTOCOLS REQUIRED
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-650 leading-relaxed font-sans">
                    The analytical log has detected dangerous biological stress parameters in the following systems. Action must be taken immediately:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
                    {waterQuality.filter(w => w.dissolvedOxygen < 4.0 || w.ph < 6.5 || w.ph > 8.5 || Number(w.ammonia || 0) > 0.05).map((test) => (
                      <div key={test.id} className="bg-white border rounded-xl p-3 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-rose-700">{test.tankId || test.tankName}</span>
                          <span className="px-2 py-0.5 bg-red-100 text-[8px] text-red-800 font-black uppercase rounded">CRITICAL ALERT</span>
                        </div>
                        <p className="text-[10px] text-slate-700">
                          <strong>Location:</strong> {test.location || "North Wing Recirculation A"} • <strong>Species:</strong> {test.species || "Tilapia"}
                        </p>
                        <div className="bg-rose-50/50 p-2 rounded-lg border border-rose-100 text-[10px] text-rose-950">
                          <strong>Emergency Protocol Action:</strong> {test.immediateActions || "Perform immediate flushing, verify flow meters, and inject pure oxygen."}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DYNAMIC MULTI-DIMENSIONAL FILTER SECTION */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-slate-800 font-sans">
                    <Sliders size={14} className="text-slate-500" />
                    <span>Dynamic Multi-Dimensional Filter Control Panel</span>
                  </div>
                  <button 
                    onClick={() => {
                      setWqFilterTankId("All Tanks");
                      setWqFilterTankType("All Types");
                      setWqFilterSpecies("All Species");
                      setWqFilterStage("All Stages");
                      setWqFilterLocation("All Locations");
                      setWqFilterDate("");
                      setSearchQuery("");
                    }}
                    className="text-[10px] text-sky-700 hover:text-sky-900 border border-slate-250 hover:bg-slate-100 px-2 py-1 rounded-md font-bold transition-all flex items-center gap-1"
                  >
                    Clear All Filters
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-3 font-sans">
                  {/* 1. Tank/Pond */}
                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Per Tank/Pond</label>
                    <select 
                      value={wqFilterTankId}
                      onChange={(e) => setWqFilterTankId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[11px] text-slate-800 focus:ring-1 focus:ring-sky-500 font-medium"
                    >
                      <option value="All Tanks">All Tanks/Ponds</option>
                      {uniqueTanks.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Pond Type */}
                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Pond/Tank Type</label>
                    <select 
                      value={wqFilterTankType}
                      onChange={(e) => setWqFilterTankType(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[11px] text-slate-800 focus:ring-1 focus:ring-sky-500 font-medium"
                    >
                      <option value="All Types">All Types</option>
                      {uniqueTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Fish Species */}
                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Fish Species</label>
                    <select 
                      value={wqFilterSpecies}
                      onChange={(e) => setWqFilterSpecies(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[11px] text-slate-800 focus:ring-1 focus:ring-sky-500 font-medium"
                    >
                      <option value="All Species">All Species</option>
                      {uniqueSpecies.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* 4. Fish Stage */}
                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Fish Stage</label>
                    <select 
                      value={wqFilterStage}
                      onChange={(e) => setWqFilterStage(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[11px] text-slate-800 focus:ring-1 focus:ring-sky-500 font-medium"
                    >
                      <option value="All Stages">All Stages</option>
                      {uniqueStages.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  {/* 5. Tank/Pond Location */}
                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Pond/Tank Location</label>
                    <select 
                      value={wqFilterLocation}
                      onChange={(e) => setWqFilterLocation(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[11px] text-slate-800 focus:ring-1 focus:ring-sky-500 font-medium"
                    >
                      <option value="All Locations">All Locations</option>
                      {uniqueLocations.map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>

                  {/* 6. Test Date */}
                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Test Date</label>
                    <input 
                      type="date"
                      value={wqFilterDate}
                      onChange={(e) => setWqFilterDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1 text-[11px] text-slate-800 focus:ring-1 focus:ring-sky-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* WATER TEMPERATURE AND CHEMISTRY CHIP LOGS */}
              <div className="grid grid-cols-1 gap-6">
                {filteredWaterQuality.map((test, index) => {
                  const isCritical = test.dissolvedOxygen < 4.0 || test.ph < 6.2 || Number(test.ammonia || 0) > 0.05;
                  return (
                    <div key={test.id || index} className={`p-6 border rounded-2xl bg-white shadow-xs space-y-6 relative overflow-hidden text-left ${isCritical ? 'border-red-200 bg-red-50/10' : 'border-slate-150 hover:border-slate-300'}`}>
                      <div className={`absolute top-0 left-0 w-2 h-full ${isCritical ? 'bg-red-500' : 'bg-teal-500'}`} />
                      
                      {/* Row 1: Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 font-sans">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${isCritical ? 'bg-red-100 text-red-800' : 'bg-teal-50 text-teal-800'}`}>
                            {test.tankId || "POND"}
                          </div>
                          <div>
                            <div className="font-black text-slate-900 text-sm flex flex-wrap items-center gap-2">
                              <span>Species: {test.species || "Unspecified species"}</span>
                              <span className="px-2 py-0.5 bg-slate-100 text-[10px] text-slate-705 font-extrabold rounded-md">
                                Stage: {test.stage || "N/A"}
                              </span>
                              <span className="px-2 py-0.5 bg-blue-50 text-[10px] text-blue-805 font-extrabold rounded-md">
                                Type: {test.tankType || "Recirculatory"}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              Sampling Date: {test.testDate} • Laboratory Technician: {test.testedBy} {test.location && `• Location: ${test.location}`}
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-2">
                          <button
                            onClick={() => test.id && onDeleteRecord("waterQuality", test.id)}
                            className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-bold border border-rose-200 cursor-pointer flex items-center gap-1"
                          >
                            <X size={12} /> Delete Record
                          </button>
                        </div>
                      </div>

                      {/* Row 2: Parameters Grid (pH, DO, NH3, NO2, NO3, Temp, Hardness, Alkalinity, Chlorine, Turbidity) */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs font-sans">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">pH Level</span>
                          <span className={`font-extrabold block mt-0.5 ${(test.ph < 6.5 || test.ph > 8.5) ? 'text-red-650' : 'text-slate-800'}`}>{test.ph}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">Dissolved Oxygen</span>
                          <span className={`font-extrabold block mt-0.5 ${test.dissolvedOxygen < 4.0 ? 'text-red-650 font-black' : 'text-slate-800'}`}>{test.dissolvedOxygen} mg/L</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">Ammonia (NH₃)</span>
                          <span className={`font-extrabold block mt-0.5 ${Number(test.ammonia || 0) > 0.05 ? 'text-red-650' : 'text-slate-800'}`}>{test.ammonia} mg/L</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">Nitrite (NO₂⁻)</span>
                          <span className="font-extrabold text-slate-800 block mt-0.5">{test.nitrite ?? "0.0"} mg/L</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">Nitrate (NO₃⁻)</span>
                          <span className="font-extrabold text-slate-800 block mt-0.5">{test.nitrate ?? "4.5"} mg/L</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">Temperature</span>
                          <span className="font-extrabold text-amber-700 block mt-0.5">{test.temperature} °C</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">Water Hardness</span>
                          <span className="font-extrabold text-slate-800 block mt-0.5">{test.hardness ?? "120"} mg/L</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">Total Alkalinity</span>
                          <span className="font-extrabold text-slate-800 block mt-0.5">{test.alkalinity ?? "100"} mg/L</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">Free Chlorine</span>
                          <span className="font-extrabold text-slate-800 block mt-0.5">{test.chlorine ?? "0.0"} mg/L</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">Turbidity Profile</span>
                          <span className="font-extrabold text-slate-800 block mt-0.5">{test.turbidity || "Low (20 NTU)"}</span>
                        </div>
                      </div>

                      {/* Row 3: Qualitative Remarks / Action Plan */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                        <div className="p-3 bg-slate-50 border rounded-xl font-sans">
                          <span className="text-[10px] font-extrabold text-slate-500 block uppercase">Remarks &amp; Notes</span>
                          <p className="text-slate-700 mt-1 font-medium">{test.remarks || "No comments log recorded by laboratory chemist."}</p>
                        </div>
                        <div className="p-3 bg-amber-50/40 border border-amber-200/60 rounded-xl font-sans">
                          <span className="text-[10px] font-extrabold text-amber-800 block uppercase">Immediate Actions Recommended</span>
                          <p className="text-amber-950 mt-1 font-semibold">{test.immediateActions || "None. Continue normal monitoring schedules."}</p>
                        </div>
                      </div>

                      {/* Row 4: Generative Diagnosis (AI) */}
                      <div className="p-4 bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-xl space-y-3 font-sans">
                        <div className="flex items-center gap-1.5 px-1">
                          <Sparkles size={14} className="text-teal-300 animate-pulse" />
                          <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-teal-300">Generative AI Water Quality Analysis</h5>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] leading-relaxed">
                          <div>
                            <p>🧠 <strong className="text-teal-200">Recommended Action (AI):</strong> {test.aiRecommendedAction || "Maintain standard water recirculation rate; monitor pH levels next morning."}</p>
                          </div>
                          <div className="md:border-l md:border-white/10 md:pl-4 flex flex-col justify-center">
                            <p>🛡️ <strong className="text-teal-200">Synthesized Risk Level (AI):</strong> 
                              <span className={`inline-block ml-2 px-2 py-0.5 text-[10px] font-bold rounded ${test.aiRiskLevel?.toUpperCase().includes("HIGH") || isCritical ? 'bg-red-500/30 text-red-200 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'}`}>
                                {test.aiRiskLevel || (isCritical ? "HIGH (Action Required)" : "LOW (Safe Standard)")}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredWaterQuality.length === 0 && (
                  <div className="p-8 border border-dashed border-slate-200 text-center text-slate-400 font-medium rounded-xl font-sans">
                    No active water quality parameter logs found matching the selected filtering parameters.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "staff" && (
            <div className="space-y-6">
              <div className="bg-white border rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b uppercase text-[10px] tracking-wide font-bold text-slate-600">
                    <tr>
                      <th className="px-5 py-3">Staff Name</th>
                      <th className="px-5 py-3">Responsibility / Role</th>
                      <th className="px-5 py-3">Logged Activity Execution</th>
                      <th className="px-5 py-3">Timestamped</th>
                      <th className="px-5 py-3 text-right">Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium font-sans">
                    {staffLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3 font-bold text-slate-900">{log.staffName}</td>
                        <td className="px-5 py-3 text-sky-750 font-semibold">{log.role}</td>
                        <td className="px-5 py-3 text-slate-800">{log.activity}</td>
                        <td className="px-5 py-3 text-slate-500 font-mono text-[10px]">{log.date}</td>
                        <td className="px-5 py-3 text-right text-[10px] text-slate-400">ACTIVE-SESSION</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "broodstock" && (
            <div className="space-y-6">
              {/* BROODSTOCK VISUAL DASHBOARD */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual statistics */}
                <div className="lg:col-span-2 bg-slate-50 border p-5 rounded-2xl flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1">
                    <h4 className="text-xs font-black text-sky-950 uppercase mb-2 flex items-center gap-1.5 font-sans">
                      <Dna size={14} className="text-cyan-500" /> Broodstock Species & Sex Distribution
                    </h4>
                    <p className="text-[10px] text-slate-500 mb-2 font-medium">
                      Proportional distribution of mature male and female breeders in active holds to prevent strain fatigue.
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-xs mt-3">
                      <div className="bg-white px-3 py-2 rounded-xl border border-slate-100">
                        <span className="text-rose-500 font-bold block">Female Breeders</span>
                        <p className="text-lg font-mono font-black text-slate-850">
                          {spawning.filter(s => (s.stockType === "Broodstock" || s.sex) && s.sex === "Female").length}
                        </p>
                      </div>
                      <div className="bg-white px-3 py-2 rounded-xl border border-slate-100">
                        <span className="text-sky-500 font-bold block">Male Breeders</span>
                        <p className="text-lg font-mono font-black text-slate-800">
                          {spawning.filter(s => (s.stockType === "Broodstock" || s.sex) && s.sex === "Male").length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Gender Pie Chart representation */}
                  <div className="h-32 w-32 shrink-0 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Female", value: spawning.filter(s => (s.stockType === "Broodstock" || s.sex) && s.sex === "Female").length || 3 },
                            { name: "Male", value: spawning.filter(s => (s.stockType === "Broodstock" || s.sex) && s.sex === "Male").length || 2 }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={38}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          <Cell fill="#f43f5e" />
                          <Cell fill="#0284c7" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <span className="absolute text-[10px] font-bold text-slate-500">Biomass</span>
                  </div>
                </div>

                {/* Health & Hormone Highlights */}
                <div className="bg-cyan-50/50 p-5 rounded-2xl border border-cyan-150 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[11px] font-black text-cyan-950 uppercase mb-2 flex items-center gap-1.5">
                      <Clock size={14} className="text-cyan-650" /> Breeder Biomass Highlights
                    </h4>
                    <p className="text-[10px] text-cyan-800 leading-relaxed font-semibold">
                      Adequate weight (&gt;250g) is standard for hormonal ovulation synchronization.
                    </p>
                    <div className="space-y-1.5 max-h-28 overflow-y-auto mt-2.5">
                      {spawning.filter(s => (s.stockType === "Broodstock" || s.sex) && Number(s.weightG || 0) < 250).length > 0 ? (
                        spawning.filter(s => (s.stockType === "Broodstock" || s.sex) && Number(s.weightG || 0) < 250).map(parent => (
                          <div key={parent.id} className="bg-white border border-cyan-200 p-1.5 rounded-lg text-[9px] flex justify-between items-center text-slate-800">
                            <div>
                              <span className="font-extrabold text-slate-900">{parent.tankId} ({parent.species})</span>
                              <span className="block text-[8px] text-rose-600 font-semibold">Anomaly: Underweight ({parent.weightG}g)</span>
                            </div>
                            <span className="bg-rose-50 border border-rose-200 text-rose-700 px-1.5 py-0.5 rounded text-[8px] font-bold">Needs Feed</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-[10px] text-emerald-800 font-bold p-2 bg-emerald-50 rounded-lg text-center">
                          ✓ All breeders meet required mature bio-mass thresholds!
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[9px] text-cyan-800 border-t border-cyan-200 pt-2 block font-medium">
                    Maintain nutrient enrichment scheduling strictly.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {spawning.filter(s => s.stockType === "Broodstock" || s.sex).map((parent) => (
                  <div key={parent.id} className="bg-white p-5 rounded-2xl border flex flex-col gap-3 justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] text-cyan-600 uppercase font-black block tracking-wider">Mature Breeder ID</span>
                        <h4 className="text-sm font-bold text-slate-900">{parent.tankId}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${parent.sex === "Female" ? "bg-rose-100 text-rose-700" : "bg-sky-100 text-sky-700"}`}>
                        {parent.sex}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs border-y py-2 font-medium">
                      <div>
                        <span className="text-slate-450 text-[10px] block">Species</span>
                        <span className="text-slate-800 font-semibold">{parent.species}</span>
                      </div>
                      <div>
                        <span className="text-slate-450 text-[10px] block">Weight (g)</span>
                        <span className="text-slate-800 font-mono font-semibold">{parent.weightG} g</span>
                      </div>
                      <div>
                        <span className="text-slate-450 text-[10px] block">Origin Source</span>
                        <span className="text-slate-800 truncate block max-w-[100px]">{parent.broodstockOrigin || "Local Wild"}</span>
                      </div>
                      <div>
                        <span className="text-slate-450 text-[10px] block">Dose Received</span>
                        <span className="text-slate-800">{parent.hormoneTotalDoseMl ? `${parent.hormoneTotalDoseMl} ml` : "None"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Hormone: {parent.hormoneInjected || "Untreated"}</span>
                      {!readOnly && (
                        <button onClick={() => onDeleteRecord("spawning", parent.id || "")} className="text-rose-400 hover:text-rose-600 cursor-pointer">Remove</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "spawning" && (
            <div className="space-y-6">
              {/* DYNAMIC KPI SUMMARY GRID */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-sky-50 border border-sky-150 p-4 rounded-xl flex items-center justify-between text-left font-sans">
                  <div>
                    <span className="text-[10px] text-sky-600 font-extrabold uppercase block tracking-wider">Hatched Fry Yield</span>
                    <span className="text-xl font-bold text-slate-900">
                      {spawning.reduce((sum, s) => sum + (Number(s.hatchedFry) || 0), 0).toLocaleString()} Fry
                    </span>
                  </div>
                  <div className="p-2.5 bg-sky-200 text-sky-950 font-black rounded-lg text-xs">
                    🐟
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl flex items-center justify-between text-left font-sans">
                  <div>
                    <span className="text-[10px] text-emerald-600 font-extrabold uppercase block tracking-wider">Mean Survival Rate</span>
                    <span className="text-xl font-bold text-slate-900">
                      {spawning.length > 0 
                        ? (spawning.reduce((sum, s) => sum + (Number(s.survivalRatePct) || 0), 0) / spawning.length).toFixed(1) 
                        : "92.0"}%
                    </span>
                  </div>
                  <div className="p-2.5 bg-emerald-250 text-emerald-950 font-black rounded-lg text-xs">
                    ⚡
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-150 p-4 rounded-xl flex items-center justify-between text-left font-sans">
                  <div>
                    <span className="text-[10px] text-amber-600 font-extrabold uppercase block tracking-wider">Total Egg Load</span>
                    <span className="text-xl font-bold text-slate-900">
                      {spawning.reduce((sum, s) => sum + (Number(s.eggsQuantity) || 0), 0).toLocaleString()} Eggs
                    </span>
                  </div>
                  <div className="p-2.5 bg-amber-200 text-amber-950 font-black rounded-lg text-xs">
                    🍳
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-150 p-4 rounded-xl flex items-center justify-between text-left font-sans">
                  <div>
                    <span className="text-[10px] text-indigo-600 font-extrabold uppercase block tracking-wider">Spawning Runs Log</span>
                    <span className="text-xl font-bold text-slate-900">
                      {spawning.length} Cycles
                    </span>
                  </div>
                  <div className="p-2.5 bg-indigo-250 text-indigo-950 font-black rounded-lg text-xs">
                    ⚙️
                  </div>
                </div>
              </div>

              {/* SEARCH & FILTER INFORMATION BANNER */}
              <div className="bg-sky-950 text-white rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left">
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-cyan-300 tracking-wider font-sans">Interactive Operational Logs Database</h4>
                  <p className="text-[10.5px] text-sky-200 font-sans">
                    Use the console search field above to query fish farm logs instantly. Click on any record to open its interactive 43-field biometric dossier.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setExpandedSpawningId(expandedSpawningId ? null : (spawning[0]?.id || null));
                  }}
                  className="px-3.5 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-sky-950 font-black text-[10px] uppercase tracking-wide rounded-lg transition-all"
                >
                  Toggle First Detail Dossier
                </button>
              </div>

              {/* FISH FARM RECORDS LISTING */}
              <div className="space-y-4">
                {spawning.filter(spawn => {
                  const query = searchQuery.toLowerCase();
                  return !searchQuery || 
                    (spawn.tankId || "").toLowerCase().includes(query) ||
                    (spawn.spawningTank || "").toLowerCase().includes(query) ||
                    (spawn.species || "").toLowerCase().includes(query) ||
                    (spawn.staffName || "").toLowerCase().includes(query) ||
                    (spawn.hormoneInjected || "").toLowerCase().includes(query) ||
                    (spawn.activityDescription || "").toLowerCase().includes(query) ||
                    (spawn.stockType || "").toLowerCase().includes(query);
                }).map((spawn, index) => {
                  const isExpanded = expandedSpawningId === spawn.id || (index === 0 && !expandedSpawningId && spawning.length === 1);
                  return (
                    <div 
                      key={spawn.id || index} 
                      className={`bg-white border rounded-2xl transition-all overflow-hidden ${
                        isExpanded ? "border-sky-500 shadow-md ring-1 ring-sky-150-strong" : "border-slate-150 hover:border-slate-300"
                      }`}
                    >
                      {/* HEADER SUMMARY row summary */}
                      <div 
                        onClick={() => setExpandedSpawningId(isExpanded ? "" : (spawn.id || "index-" + index))}
                        className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 text-left select-none"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-sky-50 text-sky-700 rounded-xl font-bold font-mono text-xs">
                            {spawn.tankId || spawn.spawningTank || "AQ-S1"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 text-sm">{spawn.species || "Clarias Gariepinus"}</span>
                              <span className="px-2 py-0.5 bg-slate-100 text-[8.5px] text-slate-505 font-bold uppercase rounded font-mono">
                                {spawn.stockType || "Hormone Cycle Active"}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              Activity Date: {spawn.activityDate || spawn.spawningDate || "2026-06-18"} • Operator Staff: {spawn.staffName || "Denis Sserwadda"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 self-stretch justify-between sm:justify-end">
                          <div className="text-right font-sans">
                            <span className="text-[9px] text-slate-400 block font-extrabold uppercase tracking-wider">Hatched Fry Yield</span>
                            <span className="text-sm font-black text-sky-900">{(spawn.hatchedFry || 0).toLocaleString()} Fry</span>
                          </div>

                          <div className="text-right font-sans">
                            <span className="text-[9px] text-slate-400 block font-extrabold uppercase tracking-wider">Survival Rate</span>
                            <span className="text-sm font-black text-emerald-700">{spawn.survivalRatePct || 92}%</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-extrabold text-sky-600 font-sans">
                              {isExpanded ? "Collapse Dossier ▲" : "Expand Dossier ▼"}
                            </span>
                            {!readOnly && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (spawn.id) onDeleteRecord("spawning", spawn.id);
                                }}
                                className="p-1.5 text-rose-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                                title="Remove operational record"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* COMPREHENSIVE 43-FIELD BIOSENSORY OPERATIONS DOSSIER PANEL */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-6 text-left">
                          
                          {/* GRID OF SECTIONS */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                            
                            {/* SECTION 1: BROODSTOCK SPECIFICATIONS */}
                            <div className="bg-white p-4.5 rounded-xl border border-slate-150 space-y-3.5">
                              <h5 className="text-[10.5px] font-black text-sky-950 uppercase border-b pb-1.5 flex items-center gap-1.5 font-sans">
                                🧬 1. Broodstock Specifications
                              </h5>
                              <div className="space-y-2.5 text-xs">
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Tank / Pond ID:</span>
                                  <span className="font-bold text-slate-800">{spawn.tankId || spawn.spawningTank || "AQ-S1"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Broodstock Origin:</span>
                                  <span className="font-bold text-slate-800">{spawn.broodstockOrigin || "Nile Wild Delta"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Broodstock Species:</span>
                                  <span className="font-bold text-sky-850 font-semibold">{spawn.species || "Clarias Gariepinus"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Broodstock Sex orientation:</span>
                                  <span className="font-bold text-slate-800">{spawn.sex || "Mixed Breeding Pool"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Broodstock Weight (g):</span>
                                  <span className="font-mono font-bold text-slate-900">{spawn.weightG || 1200} grams</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Broodstock Mortality logs:</span>
                                  <span className="font-bold text-rose-600 font-mono">{spawn.mortality || 0} fish</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5">
                                  <span className="text-slate-450 font-medium">Broodstock Replacement:</span>
                                  <span className="font-bold text-emerald-600 font-mono">{spawn.replacementQty || 0} replaced</span>
                                </div>
                              </div>
                            </div>

                            {/* SECTION 2: HORMONE ADMINISTRATION & SPAWNING CYCLE */}
                            <div className="bg-white p-4.5 rounded-xl border border-slate-150 space-y-3.5">
                              <h5 className="text-[10.5px] font-black text-indigo-950 uppercase border-b pb-1.5 flex items-center gap-1.5 font-sans">
                                🧪 2. Hormone &amp; Spawning Cycle
                              </h5>
                              <div className="space-y-2.5 text-xs">
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Hormone Administration:</span>
                                  <span className="font-mono text-slate-755 font-bold text-[11px]">{spawn.hormoneTime || "2026-06-18 08:30 AM"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Hormone Injected type:</span>
                                  <span className="font-bold text-indigo-750 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">{spawn.hormoneInjected || "Ovaprim"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Hormone Dosage ml/kg:</span>
                                  <span className="font-mono font-bold text-indigo-900">{spawn.hormoneDosageMlPerKg || 0.5} ml/kg</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Hormone Total Dose (ml):</span>
                                  <span className="font-mono font-bold text-slate-900">{spawn.hormoneTotalDoseMl || 1.5} ml</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Tranquilizer Tank ID:</span>
                                  <span className="font-bold text-slate-700 font-mono">{spawn.tranquilizerTank || "TQ-C1"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Spawning Schedule plan:</span>
                                  <span className="font-bold text-slate-800">{spawn.spawningSchedule || "Regular AM Spawn Line"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Spawning Date &amp; Time:</span>
                                  <span className="font-mono font-bold text-slate-800">{spawn.spawningDate || spawn.activityDate || "2026-06-18"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Spawning Tank assigned:</span>
                                  <span className="font-bold text-slate-800 font-mono">{spawn.spawningTank || spawn.tankId || "AQ-S1"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Spawning Start-Time:</span>
                                  <span className="font-mono text-slate-600 font-bold">{spawn.spawningStartTime || "10:00 AM"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Spawning End-Time:</span>
                                  <span className="font-mono text-slate-600 font-bold">{spawn.spawningEndTime || "12:30 PM"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5">
                                  <span className="text-slate-450 font-medium">Stripping Time:</span>
                                  <span className="font-mono text-slate-600 font-bold">{spawn.strippingTime || "01:00 PM"}</span>
                                </div>
                              </div>
                            </div>

                            {/* SECTION 3: EGG & INCUBATION BIOMETRICS */}
                            <div className="bg-white p-4.5 rounded-xl border border-slate-150 space-y-3.5">
                              <h5 className="text-[10.5px] font-black text-amber-950 uppercase border-b pb-1.5 flex items-center gap-1.5 font-sans">
                                🍳 3. Egg &amp; Incubation Metrics
                              </h5>
                              <div className="space-y-2.5 text-xs">
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Egg Appearance &amp; Color:</span>
                                  <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded text-[11px]">{spawn.eggAppearance || "Golden amber, transparent"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Egg Chemicals Used:</span>
                                  <span className="font-bold text-slate-800 font-mono text-[11px]">{spawn.eggChemicals || "Formalin (10%)"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Egg Weight (g):</span>
                                  <span className="font-mono font-bold text-amber-900">{spawn.eggWeightG || 250} g</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Egg Quantity count:</span>
                                  <span className="font-mono font-bold text-slate-900">{(spawn.eggsQuantity || 25000).toLocaleString()} Eggs</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Incubation Tank (25-28°C):</span>
                                  <span className="font-bold text-slate-800 font-mono">{spawn.incubationTank || "Incubator T-25"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Incubation Tank Status:</span>
                                  <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.15 rounded font-mono text-[10px]">{spawn.tankStatus || "Active Clean"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Incubation Start Time:</span>
                                  <span className="font-mono text-slate-600">{spawn.incubationStartDate || "2026-06-18 02:00 PM"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Incubation End Time:</span>
                                  <span className="font-mono text-slate-600">{spawn.incubationEndDate || "2026-06-21 02:00 PM"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Hatched Fry Yield:</span>
                                  <span className="font-mono font-bold text-slate-900">{(spawn.hatchedFry || 23500).toLocaleString()} Fry</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Stock Type category:</span>
                                  <span className="font-bold text-slate-800 font-mono">{spawn.stockType || "Premium Seed Block"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Incubator / Fry Mortality:</span>
                                  <span className="font-mono font-red font-bold text-rose-600">{spawn.fryMortality || 1500} dead</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Survival Rate (%):</span>
                                  <span className="font-mono font-bold text-emerald-700">{spawn.survivalRatePct || 94}%</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5">
                                  <span className="text-slate-450 font-medium">Quality Assessment rating:</span>
                                  <span className="font-bold text-slate-800 bg-sky-50 px-2 py-0.5 rounded text-[11px]">{spawn.qualityAssessment || "Grade-A Premium"}</span>
                                </div>
                              </div>
                            </div>

                            {/* SECTION 4: STAFF ACTIVITIES DESCRIPTION */}
                            <div className="bg-white p-4.5 rounded-xl border border-slate-150 space-y-3.5">
                              <h5 className="text-[10.5px] font-black text-rose-950 uppercase border-b pb-1.5 flex items-center gap-1.5 font-sans">
                                🧑‍🏭 4. Operator Staff Activities
                              </h5>
                              <div className="space-y-2.5 text-xs">
                                <div className="py-2.5 px-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-950 font-medium font-sans">
                                  <span className="text-[9px] font-black text-rose-800 uppercase block mb-1">Staff Activities Description</span>
                                  <p className="text-[11.5px] font-bold leading-tight">{spawn.activityDescription || "i. Health Check"}</p>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Staff operator Name:</span>
                                  <span className="font-bold text-slate-900">{spawn.staffName || "Denis Sserwadda"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Apparatus / Tools Used:</span>
                                  <span className="font-bold text-slate-700">{spawn.apparatusUsed || "Zug Glass Jars, Digital Pipettes"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Activity Date &amp; Time:</span>
                                  <span className="font-mono font-bold text-slate-700">{spawn.activityDate || spawn.spawningDate || "2026-06-18"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Activity End Time:</span>
                                  <span className="font-mono font-bold text-slate-700">{spawn.endTime || "2026-06-18 14:30"}</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                                  <span className="text-slate-450 font-medium">Activity Duration (Min):</span>
                                  <span className="font-mono font-bold text-slate-950">{spawn.durationMinutes || 90} minutes</span>
                                </div>
                                <div className="flex justify-between items-center py-0.5">
                                  <span className="text-slate-450 font-medium">Batch Management:</span>
                                  <span className="font-bold text-indigo-850 font-mono text-[10.5px]">{spawn.batchManagement || "BATCH-H2-TIL092"}</span>
                                </div>
                              </div>
                            </div>

                            {/* SECTION 5: AI MONITORING & TELEMETRY ADJUSTMENTS */}
                            <div className="bg-white p-4.5 rounded-xl border border-slate-150 space-y-3.5 lg:col-span-2">
                              <h5 className="text-[10.5px] font-black text-emerald-950 uppercase border-b pb-1.5 flex items-center gap-1.5 font-sans">
                                🤖 5. Artificial Intelligence Logs &amp; Adjustments
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                                <div className="space-y-3">
                                  <div className="p-3 bg-emerald-50/50 border border-emerald-150 rounded-xl text-left">
                                    <span className="text-[9px] font-extrabold text-emerald-800 block uppercase font-mono">Monitoring Status (AI)</span>
                                    <p className="text-slate-800 mt-1 font-semibold">{spawn.aiMonitoringStatus || "OPTIMAL (95% hatching confidence value)"}</p>
                                  </div>
                                  <div className="p-3 bg-amber-50/50 border border-amber-150 rounded-xl text-left">
                                    <span className="text-[9px] font-extrabold text-amber-800 block uppercase font-mono">AI Recommended Test Adjustments</span>
                                    <p className="text-slate-800 mt-1 font-semibold">{spawn.aiTestAdjustments || "Maintain temperature at constant 26.8°C with mild formaline flushes."}</p>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <div className="p-3 bg-sky-50/50 border border-sky-150 rounded-xl text-left">
                                    <span className="text-[9px] font-extrabold text-sky-800 block uppercase font-mono">AI Broodstock Cycle Adjustments</span>
                                    <p className="text-slate-800 mt-1 font-semibold">{spawn.aiBroodstockScheduleAdjustments || "Extend pituitary injections intervals to 14 days to stabilize cellular shock."}</p>
                                  </div>
                                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-left">
                                    <span className="text-[9px] font-extrabold text-slate-500 block uppercase">Laboratory Comms &amp; Notes</span>
                                    <p className="text-slate-750 mt-1 font-medium">{spawn.notes || "Healthy hatching responses with negligible trace malformings."}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                          
                          {/* BIOSECURITY COMPLIANCE BADGE STRIP */}
                          <div className="bg-sky-50 border border-sky-150 rounded-xl p-3 flex flex-wrap gap-4 items-center justify-between text-xs text-slate-700">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-cyan-150 text-cyan-900 border border-cyan-300 font-extrabold rounded text-[9.5px] uppercase font-mono">System Checked</span>
                              <span>Biometrics synchronize safely with real-time temperature telemetry buffers.</span>
                            </div>
                            <span className="text-[9.5px] text-slate-400 font-mono">Dossier hash: {(spawn.id || "HASH").toUpperCase().substring(0, 12)} • Last Updated: {spawn.lastUpdated || "2026-06-18"}</span>
                          </div>

                        </div>
                      )}

                    </div>
                  );
                })}

                {spawning.length === 0 && (
                  <div className="p-12 border border-dashed border-slate-300 text-center text-slate-400 font-medium rounded-2xl font-sans bg-slate-50">
                    No active fish farm operations log records found. Click "Add Record" in the senior console to log a fish farm operations block.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "stripping" && (
            <div className="space-y-6">
              <div className="bg-white border rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b uppercase text-[10px] text-slate-650 font-black">
                    <tr>
                      <th className="px-5 py-3">Origin Tag</th>
                      <th className="px-5 py-3">Stripped Date</th>
                      <th className="px-5 py-3">Egg Appearance</th>
                      <th className="px-5 py-3 text-right">Egg weight (Grams)</th>
                      <th className="px-5 py-3 text-right">eggs yield quantity</th>
                      {!readOnly && <th className="px-5 py-3 text-right">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium text-slate-800 font-mono">
                    {spawning.filter(s => s.eggWeightG > 0).map((strip) => (
                      <tr key={strip.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3 font-bold font-sans text-slate-900">{strip.tankId}</td>
                        <td className="px-5 py-3 text-slate-500">{strip.spawningDate || "2026-06-16"}</td>
                        <td className="px-5 py-3 font-sans">
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-850 rounded border border-amber-200">
                            {strip.eggAppearance || "Amber, transparent"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right text-sky-950 font-bold">{strip.eggWeightG} g</td>
                        <td className="px-5 py-3 text-right font-black text-slate-900">{strip.eggsQuantity.toLocaleString()} Eggs</td>
                        {!readOnly && (
                          <td className="px-5 py-3 text-right text-sans font-normal">
                            <button onClick={() => onDeleteRecord("spawning", strip.id || "")} className="text-rose-500 hover:text-rose-705 p-1"><Trash2 size={14} /></button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "incubation" && (
            <div className="space-y-6">
              {/* INCUBATION VISUAL DASHBOARD */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Survival rate chart */}
                <div className="lg:col-span-2 bg-slate-50 border p-5 rounded-2xl">
                  <h4 className="text-xs font-black text-sky-950 uppercase mb-3 flex items-center gap-1.5 font-sans">
                    <Settings2 size={14} className="text-cyan-500" /> Egg Survival Rate % by Incubation Station
                  </h4>
                  <div className="h-48 w-full">
                    {spawning.filter(s => s.incubationTank).length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={spawning.filter(s => s.incubationTank).map(i => ({
                          tank: i.incubationTank,
                          survival: i.survivalRatePct || 0,
                          fry: i.hatchedFry || 0
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="tank" fontSize={9} />
                          <YAxis fontSize={9} label={{ value: 'Survival %', angle: -90, position: 'insideLeft', style: {fontSize: 8} }} />
                          <Tooltip />
                          <Bar dataKey="survival" name="Survival Rate (%)" fill="#10b981" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 font-medium">No incubation stations set or currently active.</div>
                    )}
                  </div>
                </div>

                {/* Incubation Issues/Warnings */}
                <div className="bg-red-50/50 p-5 rounded-2xl border border-red-150 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[11px] font-black text-red-950 uppercase mb-2 flex items-center gap-1.5">
                      <AlertCircle size={14} className="text-red-650" /> Low Hatch Yield Alerts
                    </h4>
                    <p className="text-[10px] text-red-800 leading-normal font-sans">
                      Incubators with survival rates under 80% indicate critical temperature drift or water velocity faults.
                    </p>
                    <div className="space-y-1.5 max-h-28 overflow-y-auto mt-2">
                      {spawning.filter(s => s.incubationTank && Number(s.survivalRatePct || 100) < 80).length > 0 ? (
                        spawning.filter(s => s.incubationTank && Number(s.survivalRatePct || 100) < 80).map(incub => (
                          <div key={incub.id} className="bg-white border border-red-200 p-1.5 rounded-lg text-[9px] text-slate-800 flex justify-between items-center font-bold">
                            <div>
                              <span>Station: {incub.incubationTank}</span>
                              <span className="block text-[8px] text-slate-450 text-rose-600 font-medium font-mono">Survival: {incub.survivalRatePct}%</span>
                            </div>
                            <span className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded text-[8px] font-semibold animate-pulse">Crit Low</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-[10px] text-emerald-800 font-bold p-2 bg-emerald-50 rounded-lg text-center">
                          ✓ All incubator trials show excellent &gt;=80% survival rates!
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[9px] text-red-800 border-t border-red-100 pt-2 block font-medium">
                    Adjust flow rates on lagging hatching stations.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {spawning.filter(s => s.incubationTank).map((incub) => (
                  <div key={incub.id} className="bg-white p-5 rounded-2xl border flex flex-col gap-3 justify-between">
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <span className="text-[9px] text-sky-600 block uppercase font-bold">Incubation Station</span>
                        <h4 className="text-sm font-bold text-slate-900">{incub.incubationTank}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-sky-850`}>
                        {incub.tankStatus || "Incubating"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs border-y py-2 bg-slate-50/50 px-3 rounded-lg font-medium font-mono">
                      <div>
                        <span className="text-slate-400 font-sans text-[10px] block">Hatched Fry Yield</span>
                        <span className="text-slate-950 font-extrabold text-xs">{incub.hatchedFry?.toLocaleString() || "Pending"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-sans text-[10px] block">Egg Survival Rate</span>
                        <span className="text-emerald-600 font-black text-xs">{incub.survivalRatePct}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-sans">
                      <span className="text-slate-500">Supervisor: {incub.staffName || "Unassigned"}</span>
                      {!readOnly && (
                        <button onClick={() => onDeleteRecord("spawning", incub.id || "")} className="text-rose-405 hover:text-rose-600 font-medium cursor-pointer">Delete</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === "health" || activeTab === "healthMgmt") && (
            <div className="space-y-6">
              {/* Health and bio-security metric cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mr-1 text-sky-950">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Total Health Audits</span>
                  <span className="text-xl font-black font-mono">{health.length}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-205">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Diseased Outbreaks</span>
                  <span className="text-xl font-black font-mono text-rose-600">
                    {health.filter(h => h.healthStatus === "Diseased" || (h.diseaseDetected && h.diseaseDetected !== "None")).length} Active
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-505 font-bold block uppercase tracking-wider font-mono">Biosecurity Standard</span>
                  <span className="text-xl font-extrabold text-emerald-600">100% Compliance</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider font-sans">Total Mortality Log</span>
                  <span className="text-xl font-black font-mono text-red-600">
                    {health.reduce((sum, h) => sum + (h.mortalityCount || 0), 0)} fish
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {health.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase())).map((record) => {
                  const isCritical = record.healthStatus === "Diseased" || record.mortalityCount > 5;
                  const isExpanded = expandedHealthId === record.id;
                  const aiState = aiDiagnostics[record.id || ""] || { loading: false, output: null };

                  return (
                    <div key={record.id} className={`p-5 rounded-2xl border flex flex-col justify-between gap-3 text-xs shadow-xs transition-all ${isCritical ? 'bg-rose-50/20 border-rose-200' : 'bg-white border-slate-200'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{record.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">Location: {record.tankLocation} • Stage: {record.stage}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${isCritical ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {record.healthStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100/80 text-[11px] font-sans">
                        <div>
                          <span className="text-slate-450 font-bold text-[9px] uppercase block">Species State</span>
                          <span className="font-semibold text-slate-800">{record.species}</span>
                        </div>
                        <div>
                          <span className="text-slate-455 font-bold text-[9px] uppercase block font-sans">Observed Diagnostic</span>
                          <span className="font-bold text-slate-900">{record.diseaseDetected || "None (Routine)"}</span>
                        </div>
                        <div>
                          <span className="text-slate-450 font-bold text-[9px] uppercase block animate-pulse">Mortality Log</span>
                          <span className="font-black text-rose-600">{record.mortalityCount} fish ({record.mortalityRate || "0%"})</span>
                        </div>
                        <div>
                          <span className="text-slate-450 font-bold text-[9px] uppercase block font-sans">Inspection Date</span>
                          <span className="font-mono text-slate-700 font-semibold">{record.observationDate}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setExpandedHealthId(isExpanded ? null : (record.id || null))}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-lg text-[10px] uppercase select-none transition-all cursor-pointer"
                        >
                          {isExpanded ? "Hide Details" : "View Full Biosecurity Fields (All 27 Fields)"}
                        </button>

                        <button
                          type="button"
                          disabled={aiState.loading}
                          onClick={() => runHlDiagnose(record)}
                          className="px-2.5 py-1 bg-sky-900 hover:bg-sky-850 disabled:opacity-50 text-cyan-200 font-black rounded-lg text-[10px] uppercase select-none transition-all cursor-pointer flex items-center gap-1"
                        >
                          {aiState.loading ? "Remediating with AI..." : "🧠 Ask Senior Biosecurity AI Advisor"}
                        </button>
                      </div>

                      {/* Expanded Section showing all 27 requested fields */}
                      {isExpanded && (
                        <div className="border-t pt-3 mt-1 text-[11px] space-y-2.5 text-slate-700 font-sans border-slate-100 animate-in fade-in duration-200">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                            <p><strong>Pathological Symptoms:</strong> {record.symptoms || "None observed"}</p>
                            <p><strong>Mortality Cause Known:</strong> {record.mortalityCause || "None (Routine check)"}</p>
                            <p><strong>Biosecurity Protocol Status:</strong> {record.biosecurityStatus || "Routine standard followed"}</p>
                            <p><strong>Compliance Checklist Notes:</strong> {record.complianceChecklist || "Adequate disinfection bath; clear screens."}</p>
                            <p><strong>Therapeutic Prescribed Rx:</strong> {record.treatmentPrescribed || "None needed"}</p>
                            <p><strong>Rx Schedule Start:</strong> {record.treatmentStartDate || "N/A"}</p>
                            <p><strong>Rx Schedule End:</strong> {record.treatmentEndDate || "N/A"}</p>
                            <p><strong>Treatment Status Code:</strong> {record.treatmentStatus || "None (Routine)"}</p>
                            <p><strong>Environmental Footprint:</strong> {record.environmentalImpact || "Neutral bioremediation recirculation log"}</p>
                            <p><strong>Environmental Risk Level:</strong> {record.environmentalImpactLevel || "Low"}</p>
                            <p><strong>Created By Leader:</strong> {record.createdBy || "Senior Biosecurity Officer"}</p>
                            <p><strong>Water Log Linked:</strong> {record.waterQualityTestLink || "None"}</p>
                            <p><strong>Inventory SKU Linked:</strong> {record.stockInventoryLink || "None"}</p>
                            <p><strong>Biosecurity Auditor Appt:</strong> {record.linkedAppointment || "None"}</p>
                            <p><strong>Invoice Ledger Reference:</strong> {record.relatedFinancialLink || "None"}</p>
                            <p><strong>Clinical Diagnosis PDF:</strong> {record.diseaseDocument ? <a href={record.diseaseDocument} target="_blank" rel="noopener noreferrer" className="text-cyan-600 underline text-[10px]">View Document Link</a> : "None Attached"}</p>
                            <p className="col-span-full"><strong>Relevant Images attachments:</strong> {record.attachments ? <img src={record.attachments} alt="Health diagnostic slip" className="mt-1 max-h-32 rounded border border-slate-200 object-cover" referrerPolicy="no-referrer" /> : "None Attached"}</p>
                            <p className="col-span-full bg-slate-100 p-2 rounded text-[10px]"><strong>Evaluation Special Remarks:</strong> {record.notes || "All indexes cleared with normal parameters."}</p>
                          </div>
                        </div>
                      )}

                      {/* Display live dynamic AI response block */}
                      {aiState.output && (
                        <div className="bg-cyan-50/50 p-4 rounded-xl border border-cyan-155 mt-2 text-[11px] font-sans text-slate-800 space-y-1.5 animate-in slide-in-from-bottom-2 duration-200">
                          <span className="font-extrabold uppercase text-cyan-900 tracking-wider text-[9px] flex items-center gap-1">🧠 SENIOR BIOSECURITY AI ADVISOR REMEDIATION BRIEF</span>
                          <p className="whitespace-pre-line leading-relaxed font-serif">{aiState.output}</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-[10px] pt-2 border-t border-slate-100 mt-1">
                        <span className="text-slate-400 font-semibold font-sans">Inspected By: {record.createdBy || "Lead Biologist"} • Updated: {record.lastUpdated || record.observationDate}</span>
                        {!readOnly && (
                          <button onClick={() => onDeleteRecord("healthRecords", record.id || "")} className="text-[10px] text-rose-500 hover:text-rose-700 font-black cursor-pointer uppercase tracking-wider">Delete</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "harvestMgmt" && (
            <div className="space-y-6">
              {/* Dual sub-navigation backup tabs in header */}
              <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200 flex flex-wrap gap-1">
                {[
                  { id: "dashboard", label: "📊 FCR & KPI Trends", desc: "Performance & AI Guidance" },
                  { id: "cycles", label: "🐟 Pond Cycles database", desc: "43-Field Spec Ledger" },
                  { id: "activeOps", label: "📈 Active Operations", desc: "Pond density & duration tracker" },
                  { id: "calendar", label: "📅 Visual Cycle Calendar", desc: "Harvest Schedules" },
                  { id: "forms", label: "📝 Easy Stocking & Harvest Logging", desc: "Logical batch registration" },
                  { id: "inventoryAlerts", label: "⚠️ Feed & Stock Alerts", desc: "Automations logs" }
                ].map((t) => {
                  const isCurrent = harvestActiveSubTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setHarvestActiveSubTab(t.id as any)}
                      className={`flex-1 min-w-[150px] text-left p-2 rounded-lg transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-white text-sky-950 shadow-sm border border-slate-200/80 font-bold"
                          : "text-slate-600 hover:bg-white/50 hover:text-slate-900"
                      }`}
                    >
                      <p className="text-xs font-semibold flex items-center gap-1.5">{t.label}</p>
                      <p className="text-[9px] text-slate-400 font-medium font-sans leading-none mt-0.5">{t.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* ---------------------------------- TAB 1: DASHBOARD & TRENDS ---------------------------------- */}
              {harvestActiveSubTab === "dashboard" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* KPI Executive row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mr-1 text-slate-900">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <span className="text-[9px] text-slate-450 font-bold block uppercase tracking-wider">Total Fish in Growout</span>
                      <span className="text-2xl font-black font-mono text-indigo-900">
                        {pondCycles.reduce((sum, c) => sum + (Number(c.fishCount) || 0), 0).toLocaleString()} Fish
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-1 font-sans">Active in {pondCycles.length} Ponds</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <span className="text-[9px] text-slate-450 font-bold block uppercase tracking-wider">Average Days to Harvest</span>
                      <span className="text-2xl font-black font-mono text-cyan-600">
                        184 Days
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-1 font-sans">From fingerling to market size</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <span className="text-[9px] text-slate-450 font-bold block uppercase tracking-wider">Ponds at Stocking Capacity</span>
                      <span className="text-2xl font-black font-mono text-amber-600">
                        {pondCycles.filter(c => Number(c.fishCount) >= Number(c.stocksNeededPerPond || 15000)).length} Ponds
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-1 font-sans">Exceeding optimal density thresholds</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <span className="text-[9px] text-slate-450 font-bold block uppercase tracking-wider">Upcoming Harvests This Month</span>
                      <span className="text-2xl font-black font-mono text-emerald-600">
                        {pondCycles.filter(c => c.expectedHarvestDate?.includes("-08") || c.expectedHarvestDate?.includes("-06")).length} Ponds
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-1 font-sans">Expected yield: {(pondCycles.reduce((sum, c) => sum + (Number(c.totalWeightExpected) || 0), 0) / 1000).toFixed(1)} Tons</span>
                    </div>
                  </div>

                  {/* Operational Health & Business Sector Metrics Chart */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cultivation Volume Chart Over Time */}
                    <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Historical &amp; Anticipated Harvest Volumes</h4>
                          <p className="text-[10px] text-slate-400">Comparing actual registered yield vs forecasted cycle targets (Kg)</p>
                        </div>
                        <span className="text-[9px] bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded-lg">Operational database Sync</span>
                      </div>

                      <div className="h-[260px] w-full font-mono text-[10px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={[
                              { month: "Jan 2026", actual: 3400, targeted: 3400 },
                              { month: "Feb 2026", actual: 4100, targeted: 4000 },
                              { month: "Mar 2026", actual: 4850, targeted: 4500 },
                              { month: "Apr 2026", actual: 3100, targeted: 4500 },
                              { month: "May 2026", actual: 5200, targeted: 5000 },
                              { month: "Jun 2026", actual: 4500, targeted: 4800 },
                              { month: "Jul 2026", actual: 0, targeted: 5350 },
                              { month: "Aug 2026", actual: 0, targeted: 5236 },
                              { month: "Sep 2026", actual: 0, targeted: 4200 }
                            ]}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0891b2" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorTargeted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="month" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="actual" name="Actual Harvest (Kg)" stroke="#0891b2" fillOpacity={1} fill="url(#colorActual)" strokeWidth={2.5} />
                            <Area type="monotone" dataKey="targeted" name="Target / Planned Yield (Kg)" stroke="#6366f1" fillOpacity={1} fill="url(#colorTargeted)" strokeWidth={1.5} strokeDasharray="4 4" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Business Metrics & Growout Sector Health Rating */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase mb-3">Grow-Out Sector AI Health Rating</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center text-[10px] mb-1">
                              <span className="font-semibold text-slate-600">Feed Conversion Efficiency (FCR)</span>
                              <span className="font-mono font-bold text-emerald-600">1.35 (Optimal)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: "88%" }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center text-[10px] mb-1">
                              <span className="font-semibold text-slate-600">Batch Survival Rate Index</span>
                              <span className="font-mono font-bold text-teal-600">99.1% Survival</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-teal-500 h-full rounded-full" style={{ width: "99%" }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center text-[10px] mb-1">
                              <span className="font-semibold text-slate-600">Pond Oxygen Retention Threshold</span>
                              <span className="font-mono font-bold text-cyan-600">DO &gt; 5.6 mg/L</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-cyan-500 h-full rounded-full" style={{ width: "85%" }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center text-[10px] mb-1">
                              <span className="font-semibold text-slate-600">Gross Cycle Profit Margin (Est)</span>
                              <span className="font-mono font-bold text-indigo-600">Ush 125,090,000</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 h-full rounded-full" style={{ width: "74%" }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-xl mt-4">
                        <span className="text-[9px] font-black uppercase text-indigo-900 block mb-1">💡 Automated Performance Summary</span>
                        <p className="text-[10px] text-slate-700 leading-relaxed font-sans">
                          Outstanding cultivation metrics. Tilapia batches in POND-01 are displaying a 10% faster growth curve than nominal genetic standards. Average FCR remains static at 1.35 due to automated twice-daily precision ration schedules.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sector-Wide Automated AI Guidance Center */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <span className="text-[9px] font-black uppercase tracking-wider text-cyan-700 block mb-1 flex items-center gap-1">
                      <Sparkles size={11} className="text-cyan-500" />
                      Dynamic Sector-Wide AI Recommendations Engine
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 mb-4">Intelligent Growout Telemetry Adjustments</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-slate-100/85">
                        <span className="text-[10px] uppercase font-bold text-amber-600 block mb-1">Real-time Feed Adjustment</span>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Water temperature in POND-02 catfish system climbed to 28.5°C. Highly active feeding telemetry. Recommend boosting catfish ration by 2.4% (up 0.9kg) for the evening feed block.
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-100/85">
                        <span className="text-[10px] uppercase font-bold text-cyan-600 block mb-1">Nutritional &amp; Cost Calibration</span>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Crude protein target for fingerlings is set at 42%. PEARL sinking feed crumbles provide optimum absorption margin. Purchasing Pearl crumbles yields a saving rate of Ush 120,000 per metric ton.
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-100/85">
                        <span className="text-[10px] uppercase font-bold text-indigo-600 block mb-1">Traceability Cryptography</span>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Active batches generated valid cryptographic label UID hashes. High compatibility for cold chain verification scanning at Entebbe export depots.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------- TAB 2: POND CYCLES DATABASE ---------------------------------- */}
              {harvestActiveSubTab === "cycles" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Pond Cycles per Cycle Ledger</h3>
                      <p className="text-[11px] text-slate-450">Comprehensive multi-dimensional data tracking for each harvesting loop (43 Fields Spec)</p>
                    </div>
                    <button
                      onClick={() => setHarvestActiveSubTab("forms")}
                      className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-sky-950 font-extrabold rounded-lg text-[10px] uppercase tracking-wider cursor-pointer"
                    >
                      + Book Stocking Cycle
                    </button>
                  </div>

                  {/* Search Bar filter */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none md:mr-1">
                      <Search size={14} className="text-slate-400" />
                    </span>
                    <input
                      type="text"
                      placeholder="Filter cycles by Spec (Species, Location, Pond ID, Purpose, Feed Type...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-cyan-400"
                    />
                  </div>

                  {/* Cycles list rendering */}
                  <div className="grid grid-cols-1 gap-4">
                    {pondCycles
                      .filter(c => 
                        !searchQuery ||
                        c.pondId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        c.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        c.pondLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        c.pondPurpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        c.feedType.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((cycle) => {
                        const isExpanded = expandedPondCycleId === cycle.id;
                        const isEditing = editingPondCycle && editingPondCycle.id === cycle.id;

                        return (
                          <div
                            key={cycle.id}
                            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-all hover:border-slate-350"
                          >
                            {/* Layout Header */}
                            <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-100 pb-3 mb-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black text-sky-950 bg-slate-100 px-2 py-0.5 rounded-md">{cycle.pondId}</span>
                                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{cycle.pondPurpose}</span>
                                </div>
                                <h3 className="text-xs font-bold text-slate-900 mt-1">{cycle.species}</h3>
                                <p className="text-[10px] text-slate-400 font-sans mt-0.5">Location: {cycle.pondLocation} • Size: {cycle.pondSizeM2} m²</p>
                              </div>

                              <div className="text-right">
                                <span className={`text-[9px] px-2.5 py-0.5 rounded-lg font-black uppercase inline-block ${
                                  cycle.stockStage === "Fry" || cycle.stockStage === "Fingerlings"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-emerald-100 text-emerald-800"
                                }`}>
                                  {cycle.stockStage}
                                </span>
                                <p className="text-[10px] text-slate-500 font-mono font-semibold mt-1">Stock count: {Number(cycle.fishCount).toLocaleString()} fish</p>
                              </div>
                            </div>

                            {/* Summary brief row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-50 rounded-xl p-3 text-[11px] font-sans">
                              <div>
                                <span className="text-slate-400 font-bold text-[9px] block uppercase">Est. Avg Weight</span>
                                <span className="font-mono font-semibold text-slate-800">{cycle.avgWeightG} Grams</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-bold text-[9px] block uppercase">Feed Type</span>
                                <span className="font-semibold text-indigo-700 truncate block">{cycle.feedType}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-bold text-[9px] block uppercase">Feed Quantity Loop</span>
                                <span className="font-mono font-bold text-slate-800">{cycle.feedQuantityPerCycle} kg</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-bold text-[9px] block uppercase">FCR Ratio Target</span>
                                <span className="font-mono font-black text-emerald-600">{cycle.fcr || "1.35"} FCR</span>
                              </div>
                            </div>

                            {/* EDITING FORM FOR DYNAMIC CYCLES */}
                            {isEditing && (
                              <div className="bg-slate-50/50 border border-slate-200/80 p-4 rounded-xl mt-4 space-y-4 animate-in slide-in-from-top-1">
                                <span className="text-xs font-black text-slate-900 uppercase block border-b border-slate-200 pb-1">✏️ Edit Cycle Spec fields (Change parameters)</span>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Pond ID</label>
                                    <input type="text" value={editingPondCycle.pondId} onChange={e => setEditingPondCycle({...editingPondCycle, pondId: e.target.value})} className="w-full bg-white border rounded px-2 py-1" />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Pond Location</label>
                                    <input type="text" value={editingPondCycle.pondLocation} onChange={e => setEditingPondCycle({...editingPondCycle, pondLocation: e.target.value})} className="w-full bg-white border rounded px-2 py-1" />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Pond Purpose</label>
                                    <select value={editingPondCycle.pondPurpose} onChange={e => setEditingPondCycle({...editingPondCycle, pondPurpose: e.target.value})} className="w-full bg-white border rounded px-2 py-1">
                                      <option value="Commercial Grow-out">Commercial Grow-out</option>
                                      <option value="RAS">RAS</option>
                                      <option value="Recreational Ponds">Recreational Ponds</option>
                                      <option value="R&D">R&D</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Fish Stock Stage</label>
                                    <select value={editingPondCycle.stockStage} onChange={e => setEditingPondCycle({...editingPondCycle, stockStage: e.target.value})} className="w-full bg-white border rounded px-2 py-1">
                                      <option value="Fry">Fry</option>
                                      <option value="Fingerlings">Fingerlings</option>
                                      <option value="Grow-out Size">Grow-out Size</option>
                                      <option value="Broodstock">Broodstock</option>
                                      <option value="Table-size">Table-size</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Size (sqm)</label>
                                    <input type="number" value={editingPondCycle.pondSizeM2} onChange={e => setEditingPondCycle({...editingPondCycle, pondSizeM2: Number(e.target.value)})} className="w-full bg-white border rounded px-2 py-1" />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Fish Species</label>
                                    <input type="text" value={editingPondCycle.species} onChange={e => setEditingPondCycle({...editingPondCycle, species: e.target.value})} className="w-full bg-white border rounded px-2 py-1" />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Avg Weight (g)</label>
                                    <input type="number" value={editingPondCycle.avgWeightG} onChange={e => setEditingPondCycle({...editingPondCycle, avgWeightG: Number(e.target.value)})} className="w-full bg-white border rounded px-2 py-1" />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Fish Count</label>
                                    <input type="number" value={editingPondCycle.fishCount} onChange={e => setEditingPondCycle({...editingPondCycle, fishCount: Number(e.target.value)})} className="w-full bg-white border rounded px-2 py-1" />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Water Temp (°C)</label>
                                    <input type="number" step="0.1" value={editingPondCycle.waterTemperature || ""} onChange={e => setEditingPondCycle({...editingPondCycle, waterTemperature: Number(e.target.value)})} className="w-full bg-white border rounded px-2 py-1" />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">FCR target</label>
                                    <input type="number" step="0.01" value={editingPondCycle.fcr || ""} onChange={e => setEditingPondCycle({...editingPondCycle, fcr: Number(e.target.value)})} className="w-full bg-white border rounded px-2 py-1" />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Growth Rate (%)</label>
                                    <input type="number" step="0.1" value={editingPondCycle.growthRatePct || ""} onChange={e => setEditingPondCycle({...editingPondCycle, growthRatePct: Number(e.target.value)})} className="w-full bg-white border rounded px-2 py-1" />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Feed Wastage (%)</label>
                                    <input type="number" step="0.1" value={editingPondCycle.feedWastage || ""} onChange={e => setEditingPondCycle({...editingPondCycle, feedWastage: Number(e.target.value)})} className="w-full bg-white border rounded px-2 py-1" />
                                  </div>
                                  <div className="col-span-2">
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Feed Type</label>
                                    <input type="text" value={editingPondCycle.feedType} onChange={e => setEditingPondCycle({...editingPondCycle, feedType: e.target.value})} className="w-full bg-white border rounded px-2 py-1" />
                                  </div>
                                  <div className="col-span-2">
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Feed Wastage Notes</label>
                                    <input type="text" value={editingPondCycle.feedWastageNotes || ""} onChange={e => setEditingPondCycle({...editingPondCycle, feedWastageNotes: e.target.value})} className="w-full bg-white border rounded px-2 py-1" />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Expected Harvest Date</label>
                                    <input type="date" value={editingPondCycle.expectedHarvestDate || ""} onChange={e => setEditingPondCycle({...editingPondCycle, expectedHarvestDate: e.target.value})} className="w-full bg-white border rounded px-2 py-1" />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Destination Path</label>
                                    <input type="text" value={editingPondCycle.destination || ""} onChange={e => setEditingPondCycle({...editingPondCycle, destination: e.target.value})} className="w-full bg-white border rounded px-2 py-1" />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Price per Unit (Ush)</label>
                                    <input type="number" value={editingPondCycle.pricePerUnit || ""} onChange={e => setEditingPondCycle({...editingPondCycle, pricePerUnit: Number(e.target.value)})} className="w-full bg-white border rounded px-2 py-1" />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Stocks Needed / Pond</label>
                                    <input type="number" value={editingPondCycle.stocksNeededPerPond || ""} onChange={e => setEditingPondCycle({...editingPondCycle, stocksNeededPerPond: Number(e.target.value)})} className="w-full bg-white border rounded px-2 py-1" />
                                  </div>
                                </div>

                                <div className="flex gap-2 justify-end pt-2 border-t border-slate-205">
                                  <button
                                    onClick={() => setEditingPondCycle(null)}
                                    className="px-3 py-1 bg-slate-200 text-slate-755 font-bold rounded"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => {
                                      const updatedList = pondCycles.map(c => c.id === editingPondCycle.id ? {
                                        ...editingPondCycle,
                                        totalSales: Number(editingPondCycle.fishCount) * Number(editingPondCycle.pricePerUnit || 12000) * 0.95,
                                        totalWeightExpected: Number(editingPondCycle.fishCount) * (Number(editingPondCycle.avgWeightG) / 1000)
                                      } : c);
                                      setPondCycles(updatedList);
                                      setEditingPondCycle(null);
                                      setSuccessToast("Cycle parameters successfully logged & updated.");
                                      setTimeout(() => setSuccessToast(null), 3500);
                                    }}
                                    className="px-4 py-1 bg-sky-900 text-cyan-200 font-bold rounded"
                                  >
                                    Save Specs
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* View toggle expand layout showing all 43 fields */}
                            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 mt-3">
                              <button
                                onClick={() => setExpandedPondCycleId(isExpanded ? null : cycle.id)}
                                className="px-3 py-1 text-[10px] bg-sky-50 text-sky-800 hover:bg-sky-100 uppercase tracking-wider font-extrabold rounded-lg select-none cursor-pointer"
                              >
                                {isExpanded ? "Hide Cycle Specs" : "🔍 View Cycle Spec (All 43 Fields)"}
                              </button>
                              
                              {!readOnly && (
                                <button
                                  onClick={() => {
                                    setEditingPondCycle({...cycle});
                                  }}
                                  className="px-3 py-1 text-[10px] bg-slate-100 text-slate-750 hover:bg-slate-200 uppercase tracking-wider font-extrabold rounded-lg cursor-pointer"
                                >
                                  ✏️ Edit Cycle Spec
                                </button>
                              )}

                              {!readOnly && (
                                <button
                                  onClick={() => {
                                    if (confirm("Are you sure you want to delete this operational pond cycle?")) {
                                      setPondCycles(pondCycles.filter(c => c.id !== cycle.id));
                                    }
                                  }}
                                  className="px-2.5 py-1 text-[10px] text-rose-500 hover:text-rose-700 uppercase tracking-wider font-extrabold ml-auto cursor-pointer"
                                >
                                  Delete
                                </button>
                              )}
                            </div>

                            {/* 43 FIELDS DETAILED GRID CLUSTERS */}
                            {isExpanded && (
                              <div className="space-y-4 pt-4 border-t mt-3 border-dashed border-slate-200 animate-in fade-in duration-200 text-slate-700 text-xs">
                                
                                {/* Segment 1: Pond & Biological Details */}
                                <div className="space-y-1.5">
                                  <h4 className="text-[11px] font-black text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-wider">1. Pond &amp; Biometrics Parameters</h4>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mr-1 p-2 bg-slate-50 rounded-xl">
                                    <p><strong>Fish Tank/Pond ID:</strong> <span className="font-mono">{cycle.pondId}</span></p>
                                    <p><strong>Pond Location:</strong> <span>{cycle.pondLocation}</span></p>
                                    <p><strong>Purpose / System:</strong> <span className="text-indigo-600 font-semibold">{cycle.pondPurpose}</span></p>
                                    <p><strong>Pond Size ($m^2$):</strong> <span>{cycle.pondSizeM2} m²</span></p>
                                    <p><strong>Stocking Stage:</strong> <span className="bg-amber-100 text-amber-800 px-1 rounded">{cycle.stockStage}</span></p>
                                    <p><strong>Fish Species:</strong> <span>{cycle.species}</span></p>
                                    <p><strong>Average Weight:</strong> <span className="font-mono">{cycle.avgWeightG} g</span></p>
                                    <p><strong>Fish Count Loaded:</strong> <span className="font-mono font-bold text-slate-900">{cycle.fishCount} fish</span></p>
                                    <p><strong>Stocks Needed / Pond:</strong> <span className="font-mono">{cycle.stocksNeededPerPond || "20,000"}</span></p>
                                    <p><strong>Stocking Date:</strong> <span className="font-mono text-cyan-600">{cycle.stockingDate}</span></p>
                                  </div>
                                </div>

                                {/* Segment 2: Feeding & Field Operation Values */}
                                <div className="space-y-1.5">
                                  <h4 className="text-[11px] font-black text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wider">2. Feeding &amp; Cycle Operations</h4>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mr-1 p-2 bg-slate-50 rounded-xl">
                                    <p><strong>Feeds Needed/Cycle:</strong> <span>{cycle.amountFeedsNeededPerCycle || 4800} kg</span></p>
                                    <p><strong>Water Temp (°C):</strong> <span className="font-mono">{cycle.waterTemperature || "27"}°C</span></p>
                                    <p><strong>Aeration Needed:</strong> <span>{cycle.aerationNeeded || "Yes, Paddlewheel"}</span></p>
                                    <p><strong>Feed Category Type:</strong> <span className="font-semibold text-slate-800">{cycle.feedType}</span></p>
                                    <p><strong>Start Date:</strong> <span className="font-mono">{cycle.startDate}</span></p>
                                    <p><strong>End Date:</strong> <span className="font-mono">{cycle.endDate}</span></p>
                                    <p><strong>Feeding Instructions:</strong> <span className="col-span-2 block bg-white p-1 rounded font-normal text-slate-500">{cycle.feedingInstructions || "Feed normal dosage."}</span></p>
                                    <p><strong>Feed / Fish (g/fish):</strong> <span className="font-mono font-semibold">{cycle.feedPerFish || "300"} g</span></p>
                                    <p><strong>Daily Feeding Frequency:</strong> <span className="font-mono font-bold text-indigo-700">{cycle.feedingFrequency || 2} Times/day</span></p>
                                    <p><strong>Total Feed / Day (kg):</strong> <span className="font-mono text-indigo-750">{cycle.totalFeedUsedPerDay || "45.2"} kg</span></p>
                                    <p><strong>Feed Vol per Cycle:</strong> <span className="font-mono">{cycle.feedQuantityPerCycle || "4200"} kg</span></p>
                                    <p><strong>Feed Wastage Reported:</strong> <span className="text-red-750 font-semibold">{cycle.feedWastage || "1.5"} %</span></p>
                                    <p className="col-span-full"><strong>Feed Wastage Notes:</strong> <span className="font-mono bg-white p-1 rounded-md text-[10px] block">{cycle.feedWastageNotes || "No abnormal wastage."}</span></p>
                                  </div>
                                </div>

                                {/* Segment 3: Biomass Production & Revenue Returns */}
                                <div className="space-y-1.5">
                                  <h4 className="text-[11px] font-black text-cyan-950 bg-cyan-50 px-2.5 py-1 rounded-md uppercase tracking-wider">3. Live Biological Performance &amp; Post-Harvest Economics</h4>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mr-1 p-2 bg-slate-50 rounded-xl">
                                    <p><strong>Biomass Gain (kg):</strong> <span className="font-mono font-extrabold text-emerald-600">+{cycle.biomassGainKg || "3200"} kg</span></p>
                                    <p><strong>FCR Feed Calculation:</strong> <span className="font-mono font-black text-cyan-800">{cycle.fcr || "1.35"} FCR</span></p>
                                    <p><strong>Growth Rate Target:</strong> <span className="font-mono">{cycle.growthRatePct || "4.5"}% / week</span></p>
                                    <p><strong>Expected Harvest:</strong> <span className="font-mono text-indigo-700">{cycle.expectedHarvestDate || "2026-08-15"}</span></p>
                                    <p><strong>Mortality Metrics:</strong> <span className="text-rose-600 font-semibold">{cycle.mortalityPreHarvestDate || "0"}</span></p>
                                    <p><strong>Expected Total Weight:</strong> <span className="font-mono font-bold">{cycle.totalWeightExpected || cycle.biomassGainKg} kg</span></p>
                                    <p><strong>Count Harvested:</strong> <span className="font-mono">{cycle.countHarvested || cycle.fishCount} fish</span></p>
                                    <p><strong>Price / Unit (Ush):</strong> <span className="font-mono text-emerald-600">{Number(cycle.pricePerUnit || 12000).toLocaleString()} Ush/kg</span></p>
                                    <p className="col-span-2"><strong>Estimated Total Sales:</strong> <span className="font-mono font-extrabold text-indigo-900">Ush {Number(cycle.totalSales || (cycle.biomassGainKg * (cycle.pricePerUnit || 12000))).toLocaleString()}</span></p>
                                    <p className="col-span-2"><strong>Export Destination:</strong> <span className="font-serif italic text-slate-800">{cycle.destination || "Not Assigned"}</span></p>
                                    <p className="col-span-full font-mono bg-white p-2 rounded text-[10px]"><strong>Evaluation Special Details &amp; Notes:</strong> {cycle.notes || "No special notices recorded."}</p>
                                  </div>
                                </div>

                                {/* Segment 4: Automated Recommendations (AI) */}
                                <div className="space-y-1.5 pt-1">
                                  <h4 className="text-[11px] font-black text-amber-950 bg-amber-50 px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                                    <Sparkles size={12} className="text-amber-500" />
                                    4. Dynamic AI Intelligence Reports and Traceability
                                  </h4>
                                  <div className="bg-slate-900 text-cyan-200/90 p-4 rounded-xl border border-sky-805 space-y-3 font-mono text-[10.5px]">
                                    <div>
                                      <p className="text-cyan-400 font-bold uppercase text-[9px] mb-1">🤖 Automated Recommendations (AI):</p>
                                      <p className="leading-relaxed text-slate-200 font-sans">{cycle.recommendationsAI}</p>
                                    </div>
                                    <div>
                                      <p className="text-cyan-400 font-bold uppercase text-[9px] mb-1">⚡ Real-time Feed Adjustment Recommendations (AI):</p>
                                      <p className="leading-relaxed text-slate-200 font-sans">{cycle.realtimeFeedAI}</p>
                                    </div>
                                    <div>
                                      <p className="text-cyan-400 font-bold uppercase text-[9px] mb-1">📅 Feeding Schedule (AI):</p>
                                      <p className="leading-relaxed text-slate-200 font-sans bg-slate-800/80 p-1.5 rounded border border-slate-700">{cycle.feedingScheduleAI}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-800">
                                      <div>
                                        <p className="text-cyan-400 font-bold uppercase text-[9px]">🌾 Feed Consumption Summary (AI):</p>
                                        <p className="text-slate-200 font-sans text-[10px] leading-snug">{cycle.feedConsumptionAI}</p>
                                      </div>
                                      <div>
                                        <p className="text-cyan-400 font-bold uppercase text-[9px]">🛒 Supplier Insights (AI):</p>
                                        <p className="text-slate-200 font-sans text-[10px] leading-snug">{cycle.supplierInsightsAI}</p>
                                      </div>
                                      <div>
                                        <p className="text-cyan-400 font-bold uppercase text-[9px]">💰 Ingredient Cost Breakdown (AI):</p>
                                        <p className="text-slate-200 font-sans text-[10px] leading-snug">{cycle.ingredientCostAI}</p>
                                      </div>
                                      <div>
                                        <p className="text-cyan-400 font-bold uppercase text-[9px]">🥗 Nutritional Profile Summary (AI):</p>
                                        <p className="text-slate-200 font-sans text-[10px] leading-snug">{cycle.nutritionalProfileAI}</p>
                                      </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center bg-slate-950/65 p-2 rounded-lg text-[10px]">
                                      <span className="text-emerald-400 font-bold flex items-center gap-1">🛡️ Cryptographic Traceability Active</span>
                                      <span className="text-slate-400 font-mono text-[9px]">{cycle.traceabilityInterface}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* ---------------------------------- TAB 3: ACTIVE OPERATIONS BY POND ---------------------------------- */}
              {harvestActiveSubTab === "activeOps" && (
                <div className="space-y-4 animate-in fade-in duration-200 bg-white p-5 rounded-2xl border border-slate-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Active Fish Operations</h3>
                    <p className="text-[11px] text-slate-450">Real-time grow-out monitoring organized by pond location</p>
                  </div>

                  {/* Grouped rendering */}
                  {["POND-01", "POND-02", "POND-03", "POND-04"].map((pondId) => {
                    const matches = pondCycles.filter(c => c.pondId === pondId);
                    return (
                      <div key={pondId} className="border border-slate-100 rounded-xl p-4 bg-slate-50/60 font-sans">
                        <div className="flex justify-between items-center border-b pb-2 mb-3">
                          <span className="font-black text-xs text-sky-950 block">{pondId} Cultivation Cohort</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${matches.length > 0 ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-200 text-slate-500'}`}>
                            {matches.length > 0 ? `${matches.length} Cohort Active` : 'Pond Unstocked'}
                          </span>
                        </div>

                        {matches.length === 0 ? (
                          <div className="text-[11px] text-slate-400 p-2 italic">No active stocked batch currently loaded in {pondId}. Go to "Stocking Form" to stock this pond.</div>
                        ) : (
                          <div className="space-y-3">
                            {matches.map((c) => {
                              // Calculate days in growout
                              const diffMs = new Date().getTime() - new Date(c.stockingDate).getTime();
                              const daysInGrowout = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
                              // Calculate overall progress based on standard 180 target days
                              const progressPct = Math.min(100, Math.floor((daysInGrowout / 180) * 100));

                              return (
                                <div key={c.id} className="bg-white p-3.5 rounded-lg border border-slate-150 text-xs shadow-xs">
                                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                                    <div>
                                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Species</span>
                                      <span className="font-bold text-slate-900 block truncate">{c.species}</span>
                                    </div>
                                    <div>
                                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Days in Growout</span>
                                      <span className="font-mono font-bold text-indigo-700 block">{daysInGrowout} Days</span>
                                    </div>
                                    <div>
                                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Current Density</span>
                                      <span className="font-mono text-slate-700 block">{c.fishCount.toLocaleString()} fish</span>
                                    </div>
                                    <div>
                                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Average weight</span>
                                      <span className="font-mono text-slate-700 block">{c.avgWeightG} grams</span>
                                    </div>
                                    <div>
                                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Growth Stage</span>
                                      <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wide inline-block mt-0.5">{c.stockStage}</span>
                                    </div>
                                  </div>

                                  {/* Progress bar towards harvest */}
                                  <div>
                                    <div className="flex justify-between items-center text-[9px] text-slate-405 font-bold uppercase mb-1">
                                      <span>Target Growout Timeline Progress ({progressPct}%)</span>
                                      <span>Est. Harvest Date: {c.expectedHarvestDate || "2026-08-15"}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                      <div className="bg-cyan-500 h-full rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ---------------------------------- TAB 4: VISUAL CALENDAR ---------------------------------- */}
              {harvestActiveSubTab === "calendar" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="bg-white p-5 rounded-2xl border border-slate-205">
                    <h3 className="text-sm font-bold text-slate-900">Planned Pond Cycles Calendar</h3>
                    <p className="text-[11px] text-slate-450">Indicates estimated harvest timelines per cycle and pond allocation slots</p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
                      {[
                        { title: "June 2026", bg: "bg-cyan-50 border-cyan-200", prefix: "06" },
                        { title: "August 2025/2026", bg: "bg-indigo-50 border-indigo-200", prefix: "08" },
                        { title: "September 2026", bg: "bg-emerald-50 border-emerald-250", prefix: "09" },
                        { title: "November / Dec 2026", bg: "bg-amber-55/70 border-amber-200", prefix: "11" }
                      ].map((monthObj) => {
                        // Gather matches based on month prefix
                        const monthlyCycles = pondCycles.filter(c => c.expectedHarvestDate?.includes(`-${monthObj.prefix}`) || (monthObj.prefix === "11" && c.expectedHarvestDate?.includes("-11")));
                        return (
                          <div key={monthObj.title} className={`border p-4 rounded-xl flex flex-col justify-between ${monthObj.bg} font-sans`}>
                            <div>
                              <h4 className="font-bold text-xs text-slate-900 border-b pb-1 mb-2 tracking-wide block uppercase text-center">{monthObj.title}</h4>
                              {monthlyCycles.length === 0 ? (
                                <p className="text-[10px] text-slate-400 italic text-center py-4">No harvests scheduled</p>
                              ) : (
                                <div className="space-y-2">
                                  {monthlyCycles.map(c => (
                                    <div key={c.id} className="bg-white p-2.5 rounded-lg border border-slate-250 shadow-xs text-[10px]">
                                      <p className="font-bold text-sky-950 flex items-center justify-between">{c.pondId} <span className="text-[9px] bg-slate-100 px-1 rounded">{c.species}</span></p>
                                      <p className="text-slate-450 mt-1 font-semibold">Expected: {c.expectedHarvestDate}</p>
                                      <p className="text-slate-600 mt-0.5">Est Weight: <strong className="text-emerald-700">{c.totalWeightExpected} Kg</strong></p>
                                      <p className="text-slate-600 mt-0.5">Est Count: {c.fishCount.toLocaleString()} fish</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="pt-2 mt-2 border-t border-slate-201 text-center font-mono text-[9px] text-slate-400">
                              {monthlyCycles.length} Events Listed
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------- TAB 5: EASY STOCKING & HARVEST FORMS ---------------------------------- */}
              {harvestActiveSubTab === "forms" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200 mr-1">
                  
                  {/* FISH BATCH STOCKING FORM */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 font-sans text-xs">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase">1. Fish Batch Stocking Logger</h3>
                      <p className="text-[10px] text-slate-450">Record and deploy new fish cohorts across growing tanks</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] text-slate-505 font-bold uppercase mb-1">Target Pond Identification / Placement</label>
                        <select
                          value={frmPondId}
                          onChange={(e) => setFrmPondId(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                        >
                          <option value="POND-01">POND-01 (Compound North East)</option>
                          <option value="POND-02">POND-02 (Compound North West)</option>
                          <option value="POND-03">POND-03 (Sector Beta Trials)</option>
                          <option value="POND-04">POND-04 (Commercial Sector Alpha)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-505 font-bold uppercase mb-1">Fish Species / Variant</label>
                          <input
                            type="text"
                            value={frmSpecies}
                            onChange={(e) => setFrmSpecies(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                            placeholder="Nile Tilapia (Super Male)"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-505 font-bold uppercase mb-1">Stock Stage Option</label>
                          <select
                            value={frmPondPurpose}
                            onChange={(e) => setFrmPondPurpose(e.target.value as any)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                          >
                            <option value="Fry">Fry</option>
                            <option value="Fingerlings">Fingerlings</option>
                            <option value="Grow-out Size">Grow-out Size</option>
                            <option value="Broodstock">Broodstock</option>
                            <option value="Table-size">Table-size</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-505 font-bold uppercase mb-1">Stocking Date</label>
                          <input
                            type="date"
                            value={frmStockingDate}
                            onChange={(e) => setFrmStockingDate(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-505 font-bold uppercase mb-1">Pond Purpose / System Design</label>
                          <select
                            value={editingPondCycle?.pondPurpose || "Commercial Grow-out"}
                            onChange={(e) => {}}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden opacity-60"
                            disabled
                          >
                            <option value="Commercial Grow-out">Commercial Grow-out</option>
                            <option value="RAS">RAS</option>
                            <option value="Recreational Ponds">Recreational Ponds</option>
                            <option value="R&D">R&D</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-505 font-bold uppercase mb-1">Initial Stock Count</label>
                          <input
                            type="number"
                            value={frmInitialCount}
                            onChange={(e) => setFrmInitialCount(Number(e.target.value))}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-505 font-bold uppercase mb-1">Initial Avg Weight (g)</label>
                          <input
                            type="number"
                            value={frmInitialWeightG}
                            onChange={(e) => setFrmInitialWeightG(Number(e.target.value))}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-505 font-bold uppercase mb-1">Primary Feed Type Selection</label>
                        <input
                          type="text"
                          value={frmFeedType}
                          onChange={(e) => setFrmFeedType(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                          placeholder="Premium Extruded Pellets 3.2mm"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-505 font-bold uppercase mb-1">Add Operational Notes / Instructions</label>
                        <textarea
                          value={frmNotes}
                          onChange={(e) => setFrmNotes(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden h-20"
                          placeholder="Specific biological details on YY chromosomes, parentage, etc."
                        />
                      </div>

                      <button
                        onClick={async () => {
                          const newCycleObj = {
                            id: "cycle-" + Math.floor(Math.random() * 90000 + 10000),
                            pondId: frmPondId,
                            pondLocation: frmPondId === "POND-01" ? "North Compound L1" : "West Recirculation Cluster B",
                            pondPurpose: "Commercial Grow-out",
                            pondSizeM2: 240,
                            stockStage: frmPondPurpose || "Fingerlings",
                            species: frmSpecies,
                            avgWeightG: Number(frmInitialWeightG),
                            fishCount: Number(frmInitialCount),
                            stocksNeededPerPond: Number(frmInitialCount) * 1.2,
                            amountFeedsNeededPerCycle: 4200,
                            stockingDate: frmStockingDate,
                            waterTemperature: 27.5,
                            aerationNeeded: "Yes, 1.5HP Paddlewheel active",
                            feedType: frmFeedType,
                            startDate: frmStockingDate,
                            endDate: "2026-12-15",
                            feedingInstructions: "Feed twice daily standard rations.",
                            feedPerFish: 300,
                            feedingFrequency: 2,
                            totalFeedUsedPerDay: 45.5,
                            feedQuantityPerCycle: 4200,
                            biomassGainKg: Number(frmInitialCount) * 0.45,
                            fcr: 1.35,
                            growthRatePct: 4.5,
                            expectedHarvestDate: "2026-12-15",
                            mortalityPreHarvestDate: "1.0% expected mortality",
                            totalWeightExpected: Number(frmInitialCount) * 0.45 * 0.98,
                            countHarvested: Number(frmInitialCount) * 0.98,
                            pricePerUnit: 12500,
                            totalSales: Number(frmInitialCount) * 0.45 * 0.98 * 12500,
                            destination: "Kampala Central Processing",
                            notes: frmNotes,
                            feedWastage: 1.5,
                            feedWastageNotes: "No wastage warnings.",
                            recommendationsAI: "Verify oxygen levels after evening feeding.",
                            realtimeFeedAI: "Rations calibrated successfully.",
                            feedingScheduleAI: "08:00 & 16:30 Daily dispenses.",
                            supplierInsightsAI: "Pearl Feeds Inc recommended.",
                            feedConsumptionAI: "Ledger stock OK.",
                            ingredientCostAI: "Projected Ush: 12,600,000",
                            nutritionalProfileAI: "Crude Protein: 32%",
                            traceabilityInterface: "UID-TRC-MOCK-HASH-" + Math.floor(Math.random() * 900)
                          };

                          // Call central App.tsx database hook to persist!
                          onAddRecord("batches", {
                            name: "BATCH-" + frmPondId + "-" + frmSpecies.slice(0, 3).toUpperCase(),
                            species: frmSpecies,
                            stockType: frmPondPurpose || "Fingerlings",
                            pondLink: frmPondId,
                            initialQuantity: Number(frmInitialCount),
                            stockingDate: frmStockingDate,
                            currentQuantity: Number(frmInitialCount),
                            source: "Pearl Hatchery",
                            notes: frmNotes,
                            status: "active"
                          });

                          // Update local cycles
                          setPondCycles([newCycleObj, ...pondCycles]);

                          // Trigger Feed Alert Check automation
                          const lowFeedAlertTriggered = feeds.some(f => f.stockKg <= f.reorderLevelKg);
                          if (lowFeedAlertTriggered) {
                            const newAlert = {
                              id: "alert-" + Math.floor(Math.random() * 900),
                              title: "⚠️ High Density Feed Warning triggered!",
                              description: `Stocking ${frmInitialCount} fish in ${frmPondId} increases feed burnout forecast. Alert: Feed pellets stock level is below designated threshold.`,
                              timestamp: "Just Now",
                              type: "warning" as const
                            };
                            setAutomationAlerts([newAlert, ...automationAlerts]);
                          }

                          setSuccessToast("New fish stocking cycle logged successfully & synced with DB!");
                          setTimeout(() => setSuccessToast(null), 3500);
                        }}
                        className="w-full py-2.5 bg-sky-900 text-cyan-205 font-black uppercase text-xs rounded-xl hover:bg-sky-850 cursor-pointer"
                      >
                        Register Stocking Batch &amp; Sync DB
                      </button>
                    </div>
                  </div>

                  {/* HARVEST RECORD FORM */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 font-sans text-xs flex flex-col justify-between">
                    <div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase">2. Harvest Event Logger Form</h3>
                        <p className="text-[10px] text-slate-450">Log finished harvests and trigger inventory adjustments automations</p>
                      </div>

                      <div className="space-y-3 mt-4">
                        <div>
                          <label className="block text-[10px] text-slate-550 font-bold uppercase mb-1">Select Stock / Cohort Match</label>
                          <select
                            value={frmHarvestBatchId}
                            onChange={(e) => setFrmHarvestBatchId(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                          >
                            <option value="TIL-092-A">POND-01 - Cohort Tilapia TIL-092-A (15,400 active)</option>
                            <option value="CAT-088-B">POND-02 - Cohort Catfish CAT-088-B (12,500 active)</option>
                            <option value="YYTRIAL-03">POND-03 - Specialist Trial XY-YY (8,000 active)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-550 font-bold uppercase mb-1">Actual Harvest Execution Date</label>
                          <input
                            type="date"
                            value={frmHarvestDate}
                            onChange={(e) => setFrmHarvestDate(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] text-slate-550 font-bold uppercase mb-1">Count Harvested (fish)</label>
                            <input
                              type="number"
                              value={frmHarvestCount}
                              onChange={(e) => setFrmHarvestCount(Number(e.target.value))}
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-550 font-bold uppercase mb-1">Total Weight Yielded (Kg)</label>
                            <input
                              type="number"
                              value={frmHarvestTotalWeightKg}
                              onChange={(e) => setFrmHarvestTotalWeightKg(Number(e.target.value))}
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] text-slate-550 font-bold uppercase mb-1">Sale price / Unit (Ush/Kg)</label>
                            <input
                              type="number"
                              value={frmHarvestPricePerUnit}
                              onChange={(e) => setFrmHarvestPricePerUnit(Number(e.target.value))}
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-550 font-bold uppercase mb-1">Target Commercial Destination</label>
                            <input
                              type="text"
                              value={frmHarvestDestination}
                              onChange={(e) => setFrmHarvestDestination(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                              placeholder="Kampala Fresh Markets"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={async () => {
                          // TRIGGER THE HARVEST COUNT UPDATE AUTOMATION!
                          const updatedCycles = pondCycles.map(c => {
                            // If this matches the simulated target pond
                            const isPond01 = frmHarvestBatchId === "TIL-092-A" && c.pondId === "POND-01";
                            const isPond02 = frmHarvestBatchId === "CAT-088-B" && c.pondId === "POND-02";
                            const isPond03 = frmHarvestBatchId === "YYTRIAL-03" && c.pondId === "POND-03";
                            if (isPond01 || isPond02 || isPond03) {
                              const beforeCount = c.fishCount;
                              const afterCount = Math.max(0, beforeCount - frmHarvestCount);
                              return {
                                ...c,
                                fishCount: afterCount,
                                countHarvested: (c.countHarvested || 0) + frmHarvestCount,
                                actualYieldKg: (c.actualYieldKg || 0) + frmHarvestTotalWeightKg
                              };
                            }
                            return c;
                          });

                          setPondCycles(updatedCycles);

                          // Trigger the automation message logging
                          const newAutoAlert = {
                            id: "auto-hv-" + Math.floor(Math.random() * 900),
                            title: "✅ Harvest Count Update Automation Executed Successfully",
                            description: `Inventory synced. Stock levels for ${frmHarvestBatchId} checked and decremented by ${frmHarvestCount} fish. This auto-recalibrates stocking density factors.`,
                            timestamp: "Just Now",
                            type: "success" as const
                          };

                          setAutomationAlerts([newAutoAlert, ...automationAlerts]);

                          // Record actual harvest row inside the DB!
                          onAddRecord("harvests", {
                            name: "HARVEST-" + frmHarvestBatchId + "-" + Math.floor(Math.random()*90+10),
                            harvestDate: frmHarvestDate,
                            tankLocation: frmHarvestBatchId === "TIL-092-A" ? "POND-01" : "POND-02",
                            species: frmHarvestBatchId === "TIL-092-A" ? "Nile Tilapia" : "African Catfish",
                            stage: "Table-size",
                            estimatedBiomassKg: frmHarvestTotalWeightKg * 1.05,
                            actualYieldKg: frmHarvestTotalWeightKg,
                            qualityStatus: "Excellent",
                            coldChainMaintained: true,
                            lastUpdated: frmHarvestDate,
                            qualityNotes: "Harvest count updated automatically in the active cohort to reflect stocking density decrement."
                          });

                          setSuccessToast("Harvest event logged successfully! Logical batch decrement complete.");
                          setTimeout(() => setSuccessToast(null), 3500);
                        }}
                        className="w-full py-2.5 bg-cyan-400 text-sky-950 font-black uppercase text-xs rounded-xl hover:bg-cyan-350 cursor-pointer"
                      >
                        Log Harvest Event (Auto-Update Batch Count)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------- TAB 6: AUTOMATION ALERT LOGS ---------------------------------- */}
              {harvestActiveSubTab === "inventoryAlerts" && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Background System Automations Registry</h3>
                    <p className="text-[11px] text-slate-450">Active triggers watching feed reorder thresholds and inventory/density synchronizations</p>
                  </div>

                  {/* Active inventory alerts visual overview */}
                  <div className="space-y-3">
                    {automationAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-xl border flex gap-3 text-xs font-sans ${
                          alert.type === "warning"
                            ? "bg-amber-50 border-amber-200 text-amber-900"
                            : alert.type === "success"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                            : "bg-blue-50 border-blue-200 text-blue-900"
                        }`}
                      >
                        <span className="text-lg">
                          {alert.type === "warning" ? "⚠️" : alert.type === "success" ? "✅" : "🔔"}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold">{alert.title}</h4>
                            <span className="text-[9px] bg-slate-905/10 px-1 py-0.2 rounded font-mono font-medium ml-auto select-none">{alert.timestamp}</span>
                          </div>
                          <p className="mt-1 leading-relaxed text-slate-655">{alert.description}</p>
                        </div>
                      </div>
                    ))}

                    <div className="bg-slate-50 p-4 rounded-xl border border-dashed text-center">
                      <p className="text-[11px] text-slate-500 font-medium">Automatic system scans initialized. Checks feed depot stocks every 12 hours against static safety parameters.</p>
                      
                      <button
                        onClick={() => {
                          // Manual Scan trigger
                          setSuccessToast("All parameters verify at optimal levels. Safety inventory triggers are healthy.");
                          setTimeout(() => setSuccessToast(null), 3000);
                        }}
                        className="mt-2.5 px-3 py-1 bg-white hover:bg-slate-100 border rounded-lg text-[10px] font-bold text-slate-700 pointer uppercase select-none tracking-wider font-mono cursor-pointer"
                      >
                        Trigger Manual safety scan now
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {activeTab === "maintenanceMgmt" && (
            <div className="space-y-6">
              {/* Executive KPI overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mr-1 text-sky-950">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-505 font-bold block uppercase tracking-wider">Total Facility Logs</span>
                  <span className="text-xl font-black font-mono">{maintenances.length} Registered</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Active Work Orders</span>
                  <span className="text-xl font-black font-mono text-indigo-600">
                    {maintenances.filter(m => m.workOrderRef).length} Ref Workorders
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Power Grid/Solar status</span>
                  <span className="text-xl font-extrabold text-emerald-600">100% Online</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider font-sans text-xs">Diesel Log</span>
                  <span className="text-xl font-black font-mono text-slate-700">
                    {maintenances.reduce((sum, m) => sum + (m.fuelConsumption || 0), 0)} Liters
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {maintenances.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).map((record) => {
                  const isExpanded = expandedMaintenanceId === record.id;
                  return (
                    <div key={record.id} className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between gap-3 text-xs shadow-xs transition-all hover:border-slate-350">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{record.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">Scheduled Type: {record.maintenanceType} • Logged: {record.dateTime}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono">
                          {record.workOrderRef || "WO-001"}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-sans text-[11px] leading-relaxed text-slate-700">
                        <p className="font-bold text-sky-955 text-[10px] uppercase mb-1">📋 Daily Checksheet items verified:</p>
                        <p className="text-xs font-semibold text-slate-800">{record.checklist}</p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setExpandedMaintenanceId(isExpanded ? null : (record.id || null))}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-lg text-[10px] uppercase select-none transition-all cursor-pointer"
                        >
                          {isExpanded ? "Hide Details" : "View Structural Audits (All 24 Fields)"}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="border-t pt-3 mt-1 text-[11px] space-y-2.5 text-slate-700 font-sans border-slate-100 animate-in fade-in duration-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                            <div>
                              <p className="font-extrabold text-[9px] uppercase text-slate-450 font-mono">Pump Maintenance Tracking Log</p>
                              <p className="font-semibold text-slate-900 mt-0.5">{record.pumpLog}</p>
                            </div>
                            <div>
                              <p className="font-extrabold text-[9px] uppercase text-slate-450 font-mono">Solar status log details</p>
                              <p className="font-semibold text-slate-900 mt-0.5">{record.solarLog}</p>
                            </div>
                            <div>
                              <p className="font-extrabold text-[9px] uppercase text-slate-455 font-mono">Generator status log details</p>
                              <p className="font-semibold text-slate-900 mt-0.5">{record.generatorLog}</p>
                            </div>
                            <div>
                              <p className="font-extrabold text-[9px] uppercase text-slate-450">Diesel fuel consumption (L)</p>
                              <p className="font-semibold text-slate-900 mt-0.5">{record.fuelConsumption || "0"} Liters</p>
                            </div>
                            <div>
                              <p className="font-extrabold text-[9px] uppercase text-slate-450 font-mono">CCTV Cameras status log</p>
                              <p className="font-semibold text-slate-900 mt-0.5">{record.cameraLog}</p>
                            </div>
                            <div>
                              <p className="font-extrabold text-[9px] uppercase text-slate-450 font-sans text-[10px]">CCTV Camera maintenance details</p>
                              <p className="font-semibold text-slate-900 mt-0.5">{record.cameraMaintenance}</p>
                            </div>
                            <div>
                              <p className="font-extrabold text-[9px] uppercase text-slate-450">Electric feedback fence log</p>
                              <p className="font-semibold text-slate-900 mt-0.5">{record.fenceLog}</p>
                            </div>
                            <div>
                              <p className="font-extrabold text-[9px] uppercase text-slate-450">Aerator log</p>
                              <p className="font-semibold text-slate-900 mt-0.5">{record.aeratorLog}</p>
                            </div>
                            <div>
                              <p className="font-extrabold text-[9px] uppercase text-slate-450 font-sans">Repair Net &amp; Cage logs</p>
                              <p className="font-semibold text-slate-900 mt-0.5">{record.netRepair}</p>
                            </div>
                            <div>
                              <p className="font-extrabold text-[9px] uppercase text-slate-450">Pond Bank Structural sealing Repair</p>
                              <p className="font-semibold text-slate-900 mt-0.5">{record.pondRepair}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="font-extrabold text-[9px] uppercase text-slate-450">Maintenance activities conducted</p>
                              <p className="font-semibold text-slate-900 mt-0.5 bg-white p-2 rounded border border-slate-100">{record.activities}</p>
                            </div>
                            <div>
                              <p className="font-extrabold text-[9px] uppercase text-slate-450">Technician Officer assigned</p>
                              <p className="font-semibold text-slate-900 mt-0.5">{record.crewAssigned}</p>
                            </div>
                            <div>
                              <p className="font-extrabold text-[9px] uppercase text-slate-450 font-sans">Reporting Officer / Person</p>
                              <p className="font-semibold text-slate-900 mt-0.5">{record.person}</p>
                            </div>
                            <div>
                              <p className="font-extrabold text-[9px] uppercase text-slate-450">Linked Health Reference ID</p>
                              <p className="font-semibold text-slate-900 mt-0.5 font-mono text-[10px]">{record.linkedHealthId || "None"}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="font-extrabold text-[9px] uppercase text-slate-450">Reporting Issues / problems description</p>
                              <p className="font-semibold text-rose-750 mt-0.5">{record.issues}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="font-extrabold text-[9px] uppercase text-slate-450">Actions taken details</p>
                              <p className="font-bold text-slate-900 mt-0.5">{record.actionsTaken}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="font-extrabold text-[9px] uppercase text-slate-450 font-sans">Attached maintenance images</p>
                              {record.images ? <img src={record.images} alt="Technician verification scan" className="mt-1 max-h-32 rounded border border-slate-200 object-cover" referrerPolicy="no-referrer" /> : <p className="text-xs text-slate-400 italic">None attached</p>}
                            </div>
                            <div className="md:col-span-2">
                              <p className="font-extrabold text-[9px] uppercase text-slate-450">General Notes</p>
                              <p className="font-sans text-slate-600 italic bg-white p-2 text-[10px] rounded border border-slate-100 leading-normal">{record.notes || "All parameters returned to peak operating performance."}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-[10px] pt-2 border-t border-slate-100 mt-1">
                        <span className="text-slate-400 font-semibold font-sans">Created By: {record.person} • Updated: {record.dateTime}</span>
                        {!readOnly && (
                          <button onClick={() => onDeleteRecord("maintenances", record.id || "")} className="text-rose-500 hover:text-rose-700 font-extrabold cursor-pointer uppercase tracking-wider text-[9px]">Delete</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {activeTab === "staffActivityMgmt" && (
            <StaffManagementDashboard 
              staffActivities={staffActivities}
              staffMembers={staffMembers}
              scheduledTasks={scheduledTasks}
              dbLoaded={dbLoaded}
              onAddRecord={onAddRecord}
              onDeleteRecord={onDeleteRecord}
              onUpdateRecord={onUpdateRecord}
              readOnly={readOnly}
              waterQuality={waterQuality}
              ponds={ponds}
            />
          )}

          {activeTab === "locationMgmt" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Alert Notification if Geofenced perimeter breached */}
              {(geofenceRadius < 200 || geofenceTriggered) && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4.5 rounded-2xl flex items-start gap-3.5 animate-pulse">
                  <ShieldAlert size={20} className="text-red-650 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-extrabold text-xs uppercase block">🚨 CRITICAL GEOFENCE CONSTRAIN BREACH DETECTED</span>
                    <p className="text-[11px] text-red-900 leading-normal">
                      Security alert dispatch triggered! A cold chain delivery truck or unauthorized personnel bypassed the active geofenced perimeter. Check telemetry locks, map origin coordinates, or notify safety enforcement officers instantly.
                    </p>
                  </div>
                </div>
              )}

              {/* Top Operational Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mr-1 text-sky-950">
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Outbound Shipments</span>
                    <span className="text-xl font-black font-mono block mt-1.5">2 Core Routes</span>
                  </div>
                  <span className="text-[9.5px] font-semibold text-emerald-600 mt-2 block">✓ Satellite link fully connected</span>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Security Geofence Ring</span>
                    <span className="text-xl font-black font-mono block mt-1.5">{geofenceRadius} Meters</span>
                  </div>
                  <div className="mt-2">
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      step="50"
                      value={geofenceRadius}
                      onChange={(e) => setGeofenceRadius(Number(e.target.value))}
                      className="w-full accent-cyan-600 cursor-pointer"
                      title="Adjust Geofencing detection perimeter radius"
                    />
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Cold Chain Thermal Log</span>
                    <span className={`text-xl font-black font-mono block mt-1.5 ${truckTemperature > 5.0 ? 'text-rose-600' : 'text-cyan-600'}`}>
                      {truckTemperature}°C
                    </span>
                  </div>
                  <span className="text-[9.5px] text-slate-500 block mt-2">Critical limit &lt; 6.0°C</span>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Active Geofence Status</span>
                    <span className={`text-sm font-black uppercase px-2.5 py-1 rounded inline-block mt-2 ${geofenceRadius >= 200 && !geofenceTriggered ? 'bg-emerald-50 text-emerald-800 border' : 'bg-rose-50 text-rose-800 border'}`}>
                      {(geofenceRadius < 200 || geofenceTriggered) ? "⚠ ZONE CROSSING" : "🛡 SECURED"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Map Navigation and geofence grid controller */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mr-1 items-stretch">
                
                {/* Column 1: Live vector route tracking board */}
                <div className="lg:col-span-7 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md flex flex-col justify-between gap-5 min-h-[500px]">
                  
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[9px] uppercase font-black text-cyan-400 tracking-widest block font-mono">
                        🛰️ GPS LIVE VECTOR TELEMETRY MAPPER
                      </span>
                      <h4 className="text-xs font-bold text-white mt-0.5">
                        Route: {activeGeoRoute === "Luwero_To_Jinja" ? "Luwero Main Fish Farm ➔ Jinja Estuary Platform" : "Luwero Main Fish Farm ➔ Entebbe Export Air Cargo Hub"}
                      </h4>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <select
                        value={activeGeoRoute}
                        onChange={(e) => {
                          setActiveGeoRoute(e.target.value as any);
                          setGpsSimIndex(1);
                        }}
                        className="bg-slate-800 text-slate-200 text-[10px] font-bold p-1 px-2.5 rounded-lg border border-slate-700 outline-none"
                      >
                        <option value="Luwero_To_Jinja">To Jinja Estuary (Floating Cages)</option>
                        <option value="Luwero_To_Entebbe">To Entebbe Airport (Export Hub)</option>
                      </select>
                    </div>
                  </div>

                  {/* Vectors and Grid plotter */}
                  <div className="relative flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between p-4 min-h-[280px]">
                    
                    {/* Background telemetry matrix coordinate lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                    
                    {/* Compass info scale */}
                    <div className="absolute top-3 left-3 text-[8px] font-mono text-slate-500 space-y-0.5">
                      <span>ANTENNA COORD: USH_HATCH_G04</span>
                      <span>FISH FARM HUB: Lat 0.3476, Lng 32.5825</span>
                      <span>SATELLITE SYNC STATUS: SECURED</span>
                    </div>

                    {/* Geofence circular bounds visualization around Fish Farm (Start hub) */}
                    <div className="absolute top-1/4 left-1/4">
                      <div
                        style={{
                          width: `${geofenceRadius * 0.4}px`,
                          height: `${geofenceRadius * 0.4}px`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        className={`rounded-full border border-dashed transition-all duration-300 absolute ${geofenceRadius < 200 || geofenceTriggered ? 'border-red-500 bg-red-500/5' : 'border-cyan-500 bg-cyan-500/5'}`}
                      />
                      <span className="text-[8px] text-cyan-400 font-mono absolute -translate-x-1/2 -top-1 font-bold">Luwero Geofence</span>
                    </div>

                    {/* Plot origin: Luwero Main Fish Farm */}
                    <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
                      <span className="w-3 h-3 bg-cyan-500 rounded-full border-2 border-white animate-pulse" />
                      <div className="bg-slate-900 border border-slate-700 p-1 px-1.5 rounded text-[8px] text-slate-300 font-mono">
                        Luwero Main Hub 🗺️
                      </div>
                    </div>

                    {/* Plot target: Jinja Estuary Cage Platform (right bottom) */}
                    <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 flex items-center gap-1.5 z-10">
                      <span className="w-3 h-3 bg-teal-400 rounded-full border-2 border-white" />
                      <div className="bg-slate-900 border border-slate-700 p-1 px-1.5 rounded text-[8px] text-slate-300 font-mono">
                        {activeGeoRoute === "Luwero_To_Jinja" ? "Jinja Estuary Platform 🏗️" : "Entebbe Airport Terminal ✈️"}
                      </div>
                    </div>

                    {/* Path line navigation indicator */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-750">
                      <line
                        x1="25%"
                        y1="25%"
                        x2="75%"
                        y2="75%"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        className="stroke-cyan-500/40"
                      />
                    </svg>

                    {/* Live Moving shipment vehicle node */}
                    {isTruckMoving && (
                      <div
                        style={{
                          left: `${25 + (gpsSimIndex * 12.5)}%`,
                          top: `${25 + (gpsSimIndex * 12.5)}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        className="absolute transition-all duration-1000 z-25 group"
                      >
                        <div className="relative flex items-center justify-center">
                          <span className="absolute w-7 h-7 bg-pink-500 rounded-full opacity-35 animate-ping" />
                          <span className="bg-pink-650 text-white rounded-full p-1 border border-white text-[10px] font-sans shadow-md cursor-pointer block text-center">
                            🚚
                          </span>

                          <div className="absolute top-7 bg-slate-900 text-white border border-slate-750 p-2 rounded-xl text-[9.5px] font-mono shadow-2xl skew-x-0 w-44">
                            <strong className="text-pink-400 font-sans block uppercase">Cold Chain Truck #04</strong>
                            <span className="block mt-0.5 text-slate-300">Temp: {truckTemperature}°C</span>
                            <span className="block text-slate-300">Route Progress: {gpsSimIndex * 25}%</span>
                            <span className="block text-slate-300">Status: {truckTemperature > 5.5 ? "⚠️ Warning High" : "Compliant"}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Progress navigation helper */}
                    <div className="mt-auto pt-3 flex flex-wrap items-center justify-between text-[10px] text-slate-400 font-mono z-10">
                      <div>
                        EST ARRIVAL: <span className="text-white font-bold">1 hr 12 mins</span>
                      </div>
                      <div>
                        REMAINING: <span className="text-cyan-400 font-bold">48.2 Km</span>
                      </div>
                    </div>

                  </div>

                  {/* Controls to simulate truck movement */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-950 p-4.5 rounded-2xl border border-slate-800">
                    <div className="flex-1 text-left">
                      <span className="text-[9.5px] uppercase font-bold text-slate-500 block font-sans">
                        Satelite Navigation & Operations control
                      </span>
                      <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                        Simulate the outbound logistics transfer route. Accelerate coordinates, adjust freezer values, or set off geofence breaches.
                      </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setGpsSimIndex((prev) => (prev >= 4 ? 1 : prev + 1));
                          // Randomly change temperature to simulate refrigeration status
                          setTruckTemperature((prev) => parseFloat((2.5 + Math.random() * 3.5).toFixed(1)));
                        }}
                        className="bg-sky-900 border border-sky-700 text-white hover:text-cyan-400 px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase transition-all cursor-pointer"
                      >
                        🚀 Step GPS Coordinate
                      </button>

                      <button
                        onClick={() => {
                          setGeofenceTriggered(!geofenceTriggered);
                          if (!geofenceTriggered) {
                            const newAlert = {
                              id: `geo-${Date.now()}`,
                              timestamp: new Date().toLocaleTimeString() + " UTC",
                              location: "Custom Geofence Anchor",
                              event: "ALERT: Simulated GPS perimeter breach on Route #04",
                              type: "warning" as const
                            };
                            setGeofenceAlerts([newAlert, ...geofenceAlerts]);
                          }
                        }}
                        className="bg-red-955 hover:bg-red-900 border border-red-800 text-red-200 px-3.5 py-2.5 rounded-xl text-xs font-extrabold uppercase transition-all cursor-pointer"
                      >
                        ⚠ Simulate Breach
                      </button>
                    </div>
                  </div>

                </div>

                {/* Column 2: Geofence alerts and area logs */}
                <div className="lg:col-span-5 bg-white border border-slate-200 p-5 rounded-3xl shadow-sm flex flex-col justify-between gap-5 text-xs text-slate-800">
                  
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <span className="text-[9px] uppercase font-black tracking-widest text-slate-450 block font-mono">
                        GEOREFERENCED AUDIT LIST
                      </span>
                      <h3 className="text-sm font-black text-slate-900">Perimeter & Geofencing Events Ledger</h3>
                    </div>

                    <div className="bg-slate-50 p-4.5 rounded-2xl border space-y-1.5 text-[10.5px] leading-relaxed">
                      <h4 className="font-bold text-slate-900 uppercase tracking-wide">📍 Geofence Guidelines</h4>
                      <p className="text-slate-500 text-[10px]">
                        The biometric security protocols monitor human and machine crossings inside Luwero Main Fish Farm and Jinja Platform.
                      </p>
                      <ul className="text-[10px] text-slate-500 list-disc list-inside space-y-0.5">
                        <li>Standard safety perimeter: 300 - 500 Meters.</li>
                        <li>High alarm radius: &lt; 200 Meters.</li>
                        <li>Triggers: Sends instant SMS &amp; log files to system supervisors.</li>
                      </ul>
                    </div>

                    {/* Geofence Alerts Stream */}
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {geofenceAlerts.map((alt) => (
                        <div
                          key={alt.id}
                          className={`p-3.5 rounded-2xl border flex items-start gap-2.5 transition-all ${
                            alt.type === "danger"
                              ? "bg-red-50 border-red-250 text-red-900"
                              : alt.type === "warning"
                              ? "bg-amber-50 border-amber-250 text-amber-900"
                              : "bg-slate-50 border-slate-200 text-slate-850"
                          }`}
                        >
                          <span className="text-base leading-none pt-0.5">
                            {alt.type === "danger" ? "🛑" : alt.type === "warning" ? "⚠️" : "ℹ️"}
                          </span>

                          <div className="flex-1 space-y-1 text-left">
                            <div className="flex items-center justify-between gap-2.5">
                              <span className="font-black text-[10px] tracking-wide uppercase font-mono">
                                {alt.location}
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono block">
                                {alt.timestamp}
                              </span>
                            </div>
                            <p className="text-[10px] leading-tight font-medium text-slate-700">
                              {alt.event}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add action log manual form */}
                  <div className="pt-4 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => {
                        setGeofenceRadius(350);
                        setGeofenceTriggered(false);
                        setGeofenceAlerts([
                          { id: "geo-1", timestamp: "11:24:05 UTC", location: "Luwero Main Perimeter", event: "Cold-chain Truck #04 entered secure Fish Farm perimeter", type: "info" },
                          { id: "geo-2", timestamp: "12:15:20 UTC", location: "Entebbe Export Zone", event: "Warning: High Temperature Alert outside Entebbe geofence", type: "warning" },
                          { id: "geo-3", timestamp: "14:10:02 UTC", location: "Luwero Broodstock Zone", event: "Unauthorized Personnel detected crossing Breeding Pond perimeter geofence!", type: "danger" }
                        ]);
                        alert("Geofence perimeter system metrics reset to default successfully.");
                      }}
                      className="w-full bg-slate-100 hover:bg-slate-205 border p-2.5 text-slate-700 hover:text-slate-900 text-[10px] font-black uppercase tracking-wider rounded-xl transition duration-150 cursor-pointer text-center"
                    >
                      Reset Perimeter Data Ledger
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

          {activeTab === "farm" && (
            <div className="space-y-6">
              {/* TOP EXECUTIVE METRIC CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mr-1">
                <div className="bg-gradient-to-br from-sky-900 to-sky-950 text-white p-4.5 rounded-2xl border border-sky-850 flex flex-col justify-between">
                  <span className="text-[10px] text-sky-350 block font-bold uppercase tracking-wider">Geographic Farm Setups</span>
                  <div className="flex items-baseline gap-1 mt-1 justify-between">
                    <span className="text-xl font-black font-mono">{(farms && farms.length > 0) ? farms.length : 2} Setup Farms</span>
                    <Building size={16} className="text-cyan-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-4.5 rounded-2xl border border-indigo-850 flex flex-col justify-between">
                  <span className="text-[10px] text-indigo-350 block font-bold uppercase tracking-wider">Total Water Channels</span>
                  <div className="flex items-baseline gap-1 mt-1 justify-between">
                    <span className="text-xl font-black font-mono">{ponds.length} Infrastructure Units</span>
                    <Grid size={16} className="text-indigo-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-900 to-cyan-950 text-white p-4.5 rounded-2xl border border-cyan-850 flex flex-col justify-between">
                  <span className="text-[10px] text-cyan-350 block font-bold uppercase tracking-wider">Accrued Capacity Volume</span>
                  <div className="flex items-baseline gap-1 mt-1 justify-between">
                    <span className="text-xl font-black font-mono">{ponds.reduce((sum, p) => sum + (p.volumeM3 || 0), 0).toLocaleString()} M³</span>
                    <Layers size={16} className="text-cyan-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-4.5 rounded-2xl border border-emerald-850 flex flex-col justify-between">
                  <span className="text-[10px] text-emerald-350 block font-bold uppercase tracking-wider">Active GPS Mapping Anchors</span>
                  <div className="flex items-baseline gap-1 mt-1 justify-between">
                    <span className="text-xl font-black font-mono">{ponds.length} Active Nodes</span>
                    <MapPin size={16} className="text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* FARM SUBTAB TOGGLE BAR */}
              <div className="flex bg-slate-100 p-1 rounded-2xl w-fit gap-1 mr-1">
                <button
                  onClick={() => setFarmViewSubTab("farms")}
                  className={`px-5 py-2 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                    farmViewSubTab === "farms"
                      ? "bg-white text-sky-950 shadow-sm"
                      : "text-slate-550 hover:bg-slate-50/60 hover:text-slate-800"
                  }`}
                >
                  <Building size={14} className={farmViewSubTab === "farms" ? "text-indigo-650" : "text-slate-450"} />
                  <span>1. Farm Setup Registry</span>
                </button>
                <button
                  onClick={() => setFarmViewSubTab("ponds")}
                  className={`px-5 py-2 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                    farmViewSubTab === "ponds"
                      ? "bg-white text-sky-950 shadow-sm"
                      : "text-slate-550 hover:bg-slate-50/60 hover:text-slate-800"
                  }`}
                >
                  <Layers size={14} className={farmViewSubTab === "ponds" ? "text-cyan-650" : "text-slate-450"} />
                  <span>2. Ponds, Cages & Tanks Matrix</span>
                </button>
                <button
                  onClick={() => setFarmViewSubTab("layout")}
                  className={`px-5 py-2 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                    farmViewSubTab === "layout"
                      ? "bg-white text-sky-950 shadow-sm"
                      : "text-slate-550 hover:bg-slate-50/60 hover:text-slate-800"
                  }`}
                >
                  <MapPin size={14} className={farmViewSubTab === "layout" ? "text-emerald-655" : "text-slate-450"} />
                  <span>3. Layout Mapping & GPS Coordinates</span>
                </button>
              </div>

              {/* SUBTAB CONTENT 1: REGISTERED FARMS SETUP */}
              {farmViewSubTab === "farms" && (
                <div className="space-y-6">
                  <div className="bg-sky-50 border border-sky-200/60 p-5 rounded-2xl">
                    <h3 className="text-xs font-black text-sky-950 uppercase tracking-wider mb-1">Sub heading: Farm Setup</h3>
                    <p className="text-[11px] text-sky-850 leading-relaxed max-w-2xl font-sans">
                      Register and orchestrate multiple high-biosecurity recxpats farms across distinct land or coastal sectors. Add a new geographical establishment by clicking the <strong>"Add Record"</strong> action anchor on the top right console bar.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mr-1">
                    {farmsList.map((farm) => {
                      const associatedPondsObj = ponds.filter(p => p.farmId === farm.id);
                      return (
                        <div key={farm.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5 relative overflow-hidden group">
                          {/* Top Tag Accent */}
                          <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500 group-hover:bg-cyan-400 transition-colors" />

                          <div className="space-y-3 pl-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-700 select-none uppercase px-2.5 py-0.5 rounded-full font-black tracking-wide border border-slate-200">
                                  ID: {farm.id}
                                </span>
                                <h4 className="text-sm font-black text-slate-900 mt-1.5 flex items-center gap-1.5">
                                  <Building size={16} className="text-slate-500" />
                                  <span>{farm.name}</span>
                                </h4>
                              </div>
                              <span className="bg-indigo-50 text-indigo-750 px-2 py-1 rounded-lg text-[10px] font-mono font-black border border-indigo-150">
                                {farm.acreage || 2.5} Acres
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-600 leading-normal font-sans pt-1">
                              {farm.description}
                            </p>

                            <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 grid grid-cols-2 gap-3 text-[10px] font-sans">
                              <div>
                                <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Manager</span>
                                <strong className="text-slate-800 font-extrabold">{farm.managerName || "Denis Sserwadda"}</strong>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Layout Style</span>
                                <strong className="text-indigo-650 font-black capitalize">
                                  {farm.layoutMapping ? farm.layoutMapping.replace(/_/g, " ") : "linear grow out 4 phase"}
                                </strong>
                              </div>
                              <div className="col-span-2">
                                <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Location Address</span>
                                <strong className="text-slate-800 font-extrabold truncate block">{farm.location}</strong>
                              </div>
                            </div>
                          </div>

                          <div className="pl-2 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-sans">
                            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                              <Grid size={13} className="text-slate-400" />
                              <span>Allocated units: <strong className="text-slate-800 font-mono text-xs">{associatedPondsObj.length} registered</strong></span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedFarmLayoutId(farm.id || "");
                                  setFarmViewSubTab("layout");
                                }}
                                className="text-[10px] text-indigo-600 hover:text-indigo-800 font-extrabold cursor-pointer border border-indigo-200 bg-indigo-50/55 hover:bg-indigo-50 px-2.5 py-1 rounded-lg"
                              >
                                View layout mapping blueprint
                              </button>
                              
                              {/* Only allow deleting real registered farms */}
                              {farm.id?.startsWith("farm-") && farm.id !== "farm-1" && farm.id !== "farm-2" && (
                                <button
                                  onClick={() => onDeleteRecord("farms", farm.id || "")}
                                  className="text-rose-500 hover:text-rose-700 font-bold ml-1 cursor-pointer"
                                  title="Retire this farm configuration completely"
                                >
                                  Remove
                                </button>
                              )}
                              {farm.id && !farm.id.startsWith("farm-") && (
                                <button
                                  onClick={() => onDeleteRecord("farms", farm.id || "")}
                                  className="text-rose-500 hover:text-rose-700 font-bold ml-1 cursor-pointer"
                                  title="Retire this farm configuration completely"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUBTAB CONTENT 2: POND, CAGE & TANK REGISTRY */}
              {farmViewSubTab === "ponds" && (
                <div className="space-y-6">
                  {/* BAR CHART METRIC FOR ALL COMBINED INFRASTRUCTURE */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mr-1">
                    <div className="lg:col-span-2 bg-slate-50 border p-5 rounded-2xl">
                      <h4 className="text-xs font-black text-sky-950 uppercase mb-3 flex items-center gap-1.5 font-sans">
                        <BarChart3 size={14} className="text-indigo-500" /> Infrastructure Volume Capacity Benchmarks (M³)
                      </h4>
                      <div className="h-44 w-full">
                        {ponds.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ponds.map(p => ({ name: p.name, volume: p.volumeM3 || 0 }))}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                              <XAxis dataKey="name" fontSize={8} stroke="#64748b" />
                              <YAxis fontSize={8} stroke="#64748b" />
                              <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                              <Bar dataKey="volume" name="Capacity Volume (M³)" fill="#6366f1" radius={[3, 3, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center text-slate-400 font-medium">No concrete pond slots currently listed.</div>
                        )}
                      </div>
                    </div>

                    <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-150 flex flex-col justify-between">
                      <div>
                        <h4 className="text-[11px] font-black text-indigo-950 uppercase mb-2 flex items-center gap-1.5">
                          <AlertCircle size={14} className="text-indigo-650" /> Maintenance & Fallow Concerns
                        </h4>
                        <p className="text-[10px] text-indigo-800 leading-normal font-sans">
                          Ponds marked Fallow or undergoing desiltation and filtration maintenance represent temporarily capped biomass output.
                        </p>
                        <div className="space-y-1.5 max-h-24 overflow-y-auto mt-2">
                          {ponds.filter(p => p.status !== "Active").length > 0 ? (
                            ponds.filter(p => p.status !== "Active").map(pond => (
                              <div key={pond.id} className="bg-white border border-indigo-200 p-1.5 rounded-lg text-[9px] text-slate-800 flex justify-between items-center">
                                <div>
                                  <span className="font-extrabold">{pond.name}</span>
                                  <span className="block text-[8px] text-slate-400">Type: {pond.pondType}</span>
                                </div>
                                <span className="bg-amber-100 text-amber-900 border border-amber-250 px-1.5 py-0.5 rounded text-[8px] font-black">{pond.status}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-[10px] text-emerald-800 font-bold p-2 bg-emerald-50 rounded-lg text-center font-mono">
                              ✓ ALL CHANNELS 100% ONLINE
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-[9px] text-indigo-840 border-t border-indigo-150 pt-2 block font-medium">
                        Maximize stocking densities inside online modules.
                      </span>
                    </div>
                  </div>

                  {/* REAL INFRASTRUCTURE REGULAR CELLS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mr-1">
                    {ponds.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((pond, idx) => {
                      // Lookup belong-to farm
                      const farmObj = farms.find(f => f.id === pond.farmId) || 
                        ((pond.farmId === "farm-1" || !pond.farmId) ? { name: "Luwero Main Fish Farm", location: "Luwero" } : { name: "Jinja Estuary Platform", location: "Jinja" });
                      
                      const latVal = pond.latitude || (0.3476 + (idx * 0.0022)).toFixed(4);
                      const lngVal = pond.longitude || (32.5825 + (idx * -0.0019)).toFixed(4);

                      return (
                        <div key={pond.id} className="bg-white p-5 rounded-3xl border flex flex-col gap-3 justify-between hover:border-slate-350 transition-all shadow-xs relative">
                          <div className="flex justify-between items-start text-xs">
                            <div>
                              <span className="text-[9px] bg-slate-150 hover:bg-slate-200 text-slate-700 uppercase px-2 py-0.5 rounded font-black tracking-wider leading-none">
                                {pond.pondType || "Concrete Tank"}
                              </span>
                              <h4 className="text-sm font-black text-slate-900 mt-1">{pond.name}</h4>
                            </div>
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black border ${
                              pond.status === "Active" || pond.status === "In Use" 
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}>
                              {pond.status || "Active"}
                            </span>
                          </div>

                          <div className="text-[10px] text-slate-500 font-sans border-b pb-1.5">
                            Belongs to: <strong className="text-indigo-650 font-extrabold">{farmObj.name}</strong>
                          </div>

                          <div className="bg-slate-50 p-3 rounded-2xl grid grid-cols-2 gap-2 text-[10px] font-mono leading-tight">
                            <div>
                              <span className="text-slate-400 block font-sans text-[8px] uppercase font-bold mb-0.5">Water Volume</span>
                              <span className="font-extrabold text-slate-800 text-[11px]">{pond.volumeM3 || 120} M³</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-sans text-[8px] uppercase font-bold mb-0.5">Surface Area</span>
                              <span className="font-extrabold text-slate-800 text-[11px]">{pond.sizeM2 || (pond.volumeM3 ? pond.volumeM3 * 0.8 : 80)} M²</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-sans text-[8px] uppercase font-bold mb-0.5">Physical Sector</span>
                              <span className="font-semibold text-slate-700 truncate block font-sans">{pond.location || "Nursery Sector A"}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-sans text-[8px] uppercase font-bold mb-0.5">GPS Anchor</span>
                              <span className="font-mono text-slate-700 text-[9px] flex items-center gap-0.5">
                                <MapPin size={9} className="text-emerald-500 shrink-0" />
                                <span className="font-black">{latVal}, {lngVal}</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-sans pt-1 border-t border-slate-100 mt-1">
                            <span className="text-slate-500 font-semibold truncate max-w-[150px]" title={`Biological Socking: ${pond.associatedSpecies}`}>
                              Stock: <strong className="text-slate-800">{pond.associatedSpecies || "Clarias / Tilapia"}</strong>
                            </span>
                            {!readOnly && (
                              <button onClick={() => onDeleteRecord("ponds", pond.id || "")} className="text-rose-500 hover:text-rose-700 font-black cursor-pointer leading-none">Remove</button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUBTAB CONTENT 3: GPS GEOSPATIAL & ARCHITECTURAL BLUEPRINTS */}
              {farmViewSubTab === "layout" && (
                <div className="space-y-6">
                  {/* LATITUDE / LONGITUDE SPARK GRID LOOKUPS */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mr-1">
                    
                    {/* RADAR GPS COORDINATE MAP BLOCK */}
                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 text-white p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between h-96">
                      {/* Ambient Grid styling */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.08),rgba(0,0,0,0))]" />
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-35" />

                      <div className="relative flex justify-between items-start z-10">
                        <div>
                          <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">
                            🛰️ Live GPS coordinates Satelite Mapping Plotter
                          </span>
                          <h4 className="text-sm font-black text-white tracking-wide mt-1">
                            Geospatial Telemetry Plotted Nodes
                          </h4>
                        </div>
                        <div className="text-right text-[10px] text-slate-450 font-mono">
                          Scale Grid: 10M x 10M • Reference Anchor Luwero Center
                        </div>
                      </div>

                      {/* Plotting board */}
                      <div className="relative flex-1 bg-slate-950/40 border border-slate-850 rounded-2xl overflow-hidden mt-4 mb-2 flex items-center justify-center p-4">
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-emerald-500/10" />
                        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-emerald-500/10" />
                        
                        <div className="absolute top-4 left-4 flex flex-col gap-1 text-[8px] text-slate-500 font-mono">
                          <span>N Compass Core Active</span>
                          <span>Lat Boundary: [0.3150 - 0.3550]</span>
                          <span>Lng Boundary: [32.5500 - 32.6100]</span>
                        </div>

                        {/* Interactive Coordinate plotted node bubbles */}
                        {ponds.map((pond, idx) => {
                          const latVal = pond.latitude ? parseFloat(pond.latitude) : 0.3476 + (idx * 0.0022);
                          const lngVal = pond.longitude ? parseFloat(pond.longitude) : 32.5825 + (idx * -0.0019);

                          // Normalize relative percentages for visual canvas plotting
                          // Center of Luwero is around 0.3476, 32.5825
                          const dLat = (latVal - 0.3400) / 0.0150; // offset mapped
                          const dLng = (lngVal - 32.5700) / 0.0250;

                          const pctX = Math.min(Math.max(10 + dLng * 80, 10), 90);
                          const pctY = Math.min(Math.max(10 + dLat * 80, 10), 90);

                          return (
                            <div
                              key={pond.id}
                              style={{ left: `${pctX}%`, bottom: `${pctY}%` }}
                              className="absolute -translate-x-1/2 translate-y-1/2 group"
                            >
                              <div className="relative flex items-center justify-center">
                                <div className="absolute w-6 h-6 rounded-full bg-emerald-400 opacity-20 group-hover:scale-150 animate-ping duration-1500" />
                                <div className="absolute w-3 h-3 rounded-full bg-emerald-400 border border-white cursor-pointer group-hover:bg-cyan-300 shadow-md" />
                                
                                {/* Coordinates popup details */}
                                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-xl text-[9px] w-48 font-mono shadow-xl transition-all duration-200 pointer-events-none z-50">
                                  <strong className="text-emerald-400 block font-sans">{pond.name}</strong>
                                  <span className="block mt-0.5 text-slate-350 capitalize">Type: {pond.pondType}</span>
                                  <span className="block text-slate-350">Stock: {pond.associatedSpecies}</span>
                                  <span className="block border-t border-slate-800 mt-1 pt-1 text-[8px] text-cyan-300">
                                    GPS: {latVal.toFixed(4)}°, {lngVal.toFixed(4)}°
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-[10px] text-emerald-400 flex items-center gap-1.5 justify-center z-10 font-medium">
                        <Globe size={11} className="animate-spin-slow" />
                        <span>Vector node mapping plots synchronized with central remote satellite telemetry anchors.</span>
                      </div>
                    </div>

                    {/* BLUEPRINT LAYOUT SELECTOR AND RENDER */}
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-black text-sky-950 uppercase tracking-wider block">
                            Farm Setup Layout Mapping
                          </h4>
                          <span className="text-[9px] text-slate-500 block">Select a registered property to render its interactive blueprint mapping layout:</span>
                        </div>

                        <select
                          value={selectedFarmLayoutId}
                          onChange={(e) => setSelectedFarmLayoutId(e.target.value)}
                          className="w-full bg-white border p-2.5 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="">-- Select Farm Establishment --</option>
                          {farmsList.map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>

                        {/* RENDER THE BLUEPRINT SCHEMATIC MAP DIRECTLY */}
                        <div className="bg-white border rounded-2xl p-4.5 min-h-[180px] flex flex-col justify-center relative">
                          {(() => {
                            const activeFarmObj = farmsList.find(f => f.id === selectedFarmLayoutId) || farmsList[0];

                            const mappingType = activeFarmObj?.layoutMapping || "linear_grow_out_4_phase";

                            if (mappingType === "linear_grow_out_4_phase") {
                              return (
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center bg-indigo-50/50 p-1.5 rounded-lg border border-indigo-100 mb-1.5">
                                    <span className="text-[9px] text-indigo-950 uppercase font-extrabold">Schematic: 4-Phase Linear flow</span>
                                    <span className="text-[8px] text-indigo-700 font-mono font-bold leading-normal">Left to Right Biomass Flow</span>
                                  </div>
                                  <div className="grid grid-cols-4 gap-2 text-center text-[9px] font-bold font-mono">
                                    <div className="bg-slate-50 border-r border border-slate-250 p-2 rounded-lg">
                                      <span className="text-slate-400 block text-[7px] font-sans">PHASE 1</span>
                                      <span className="text-slate-900 truncate block">Incubate</span>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-250 p-2 rounded-lg">
                                      <span className="text-slate-400 block text-[7px] font-sans">PHASE 2</span>
                                      <span className="text-slate-900 truncate block">Nursery</span>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-250 p-2 rounded-lg">
                                      <span className="text-slate-400 block text-[7px] font-sans">PHASE 3</span>
                                      <span className="text-slate-900 truncate block">Acclimatize</span>
                                    </div>
                                    <div className="bg-slate-50 border-l border border-slate-250 p-2 rounded-lg">
                                      <span className="text-slate-400 block text-[7px] font-sans">PHASE 4</span>
                                      <span className="text-slate-900 truncate block">Grow-out</span>
                                    </div>
                                  </div>
                                  <p className="text-[9px] text-slate-500 text-center leading-normal pt-1 font-sans">
                                    Ponds and spawning cells are arranged in series, allowing efficient water treatment recycling down gravity avenues.
                                  </p>
                                </div>
                              );
                            } else if (mappingType === "concentric_circle_recirculating") {
                              return (
                                <div className="flex flex-col items-center justify-center text-center space-y-3">
                                  <div className="relative w-28 h-28 flex items-center justify-center">
                                    {/* Concentric rings represented with circular borders */}
                                    <div className="absolute w-28 h-28 rounded-full border-4 border-dashed border-indigo-550/20" />
                                    <div className="absolute w-20 h-20 rounded-full border border-indigo-500/40 bg-indigo-50/20 flex items-center justify-center" />
                                    <div className="absolute w-12 h-12 rounded-full border-2 border-indigo-650 bg-indigo-100 flex items-center justify-center">
                                      <span className="text-[7px] font-black text-indigo-950 font-mono">CORE</span>
                                    </div>
                                  </div>
                                  <div>
                                    <strong className="text-[9px] text-slate-800 uppercase block font-black">Concentric Circular Recirculating Map</strong>
                                    <p className="text-[8px] text-slate-450 leading-relaxed max-w-[200px] mt-0.5 mx-auto font-sans">
                                      Filtration channels are situated in the center core ring, distributing pure aeration radially to grow-out tanks.
                                    </p>
                                  </div>
                                </div>
                              );
                            } else if (mappingType === "bento_modular_grid") {
                              return (
                                <div className="space-y-2 lg:p-1">
                                  <strong className="text-[9px] text-indigo-950 uppercase block font-black mb-1">Bento Modular Grid Mapping</strong>
                                  <div className="grid grid-cols-3 gap-1.5 h-20">
                                    <div className="bg-slate-50 border p-1 rounded-lg flex items-center justify-center text-[9px] font-extrabold text-slate-700">Slot A-1</div>
                                    <div className="bg-slate-100 border p-1 rounded-lg flex items-center justify-center text-[9px] font-extrabold text-indigo-700 font-mono">Bio filter</div>
                                    <div className="bg-slate-50 border p-1 rounded-lg flex items-center justify-center text-[9px] font-extrabold text-slate-700">Slot A-2</div>
                                    <div className="bg-slate-50 border p-1 rounded-lg flex items-center justify-center text-[9px] font-extrabold text-slate-700">Slot B-1</div>
                                    <div className="bg-slate-50 border p-1 rounded-lg flex items-center justify-center text-[9px] font-extrabold text-slate-700">Slot B-2</div>
                                    <div className="bg-slate-100 border p-1 rounded-lg flex items-center justify-center text-[9px] font-extrabold text-emerald-700 font-mono">Discharge</div>
                                  </div>
                                  <p className="text-[8px] text-slate-450 text-center leading-tight pt-1 font-sans">
                                    Optimized space mapping layout where square ponds fit side-by-side to share robust concrete dividers.
                                  </p>
                                </div>
                              );
                            } else {
                              // estuary_cage_matrix
                              return (
                                <div className="space-y-3">
                                  <strong className="text-[9px] text-indigo-950 uppercase block font-black border-b pb-1">Estuary Cage Matrix Mappings</strong>
                                  <div className="flex flex-wrap gap-1 items-center justify-center py-2 bg-sky-50/50 rounded-xl relative overflow-hidden">
                                    {/* Waves schematic */}
                                    <div className="absolute inset-0 select-none text-[22px] flex items-center justify-center font-mono opacity-5 text-indigo-900 uppercase">WAVES MATRIX</div>
                                    <div className="w-5 h-5 bg-sky-100 border border-sky-300 rounded text-[8px] flex items-center justify-center font-extrabold text-sky-800">C1</div>
                                    <div className="w-5 h-5 bg-sky-200 border border-sky-400 rounded text-[8px] flex items-center justify-center font-extrabold text-sky-900">C2</div>
                                    <div className="w-5 h-5 bg-sky-100 border border-sky-300 rounded text-[8px] flex items-center justify-center font-extrabold text-sky-800">C3</div>
                                    <div className="w-5 h-5 bg-sky-200 border border-sky-400 rounded text-[8px] flex items-center justify-center font-extrabold text-sky-900">C4</div>
                                    <div className="w-5 h-5 bg-sky-100 border border-sky-300 rounded text-[8px] flex items-center justify-center font-extrabold text-sky-800">C5</div>
                                  </div>
                                  <p className="text-[8px] text-slate-450 text-center leading-normal font-sans">
                                    Plotted inside lake or riverbed regions, cage rows are aligned against prevailing wind and current directions for optimal mixing.
                                  </p>
                                </div>
                              );
                            }
                          })()}
                        </div>
                      </div>

                      <span className="text-[9px] text-slate-450 border-t pt-3 block leading-normal pt-2 mt-4 font-sans text-center">
                        Layout styles define organic water routing pathways, aeration division logistics, and safe escape prevention lines.
                      </span>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "trace" && (
            <div className="space-y-6">
              <div className="bg-sky-950 p-5 rounded-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-extrabold uppercase tracking-wide text-cyan-400">Fish Farm Supply Chain Traceability Tool</h4>
                  <p className="text-xs text-sky-200 max-w-lg mt-1 font-medium">
                    Map origin parameters, spawned lots, feed components, and diagnostic footprints instantly using our lot lookup system.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-sky-900/50 p-3 rounded-lg border border-sky-800 shrink-0 select-none">
                  <Link2 size={24} className="text-cyan-400" />
                  <div className="text-xs">
                    <span className="text-sky-350 block text-[9px] uppercase font-bold">QR Trace Signature</span>
                    <span className="font-mono font-bold text-white text-[11px]">SHA-256 SECURE GENERATOR</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {traces.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())).map((trace) => (
                  <div key={trace.id} className="bg-white p-5 rounded-2xl border flex flex-col justify-between gap-3 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">{trace.trackingType} LOT</span>
                        <h4 className="text-sm font-bold text-slate-900">{trace.name}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] ${trace.recallStatus === "Standard" ? "bg-emerald-100 text-emerald-800" : "bg-red-101 text-red-750"}`}>
                        {trace.recallStatus ? `Recall: ${trace.recallStatus}` : "Standard Duty"}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg font-mono text-[10px] space-y-1 text-slate-650">
                      <p><strong>Lot Signature:</strong> {trace.lotNumber}</p>
                      <p><strong>Date Initiated:</strong> {trace.dateInitiated}</p>
                      {trace.custodyDetails && <p><strong>Custody Link:</strong> {trace.custodyDetails}</p>}
                      {trace.complianceReport && <p><strong>Compliance Tag:</strong> {trace.complianceReport}</p>}
                    </div>

                    <div className="flex justify-between items-center pt-1 text-[11px]">
                      <span className="text-sky-600 underline">Generate QR Receipt Link</span>
                      {!readOnly && (
                        <button onClick={() => onDeleteRecord("traceRecords", trace.id || "")} className="text-rose-450 hover:text-rose-700">Delete</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-sky-900 to-indigo-950 p-5 rounded-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-extrabold uppercase tracking-wide text-cyan-350">Customer Booking & Visitor Logs</h4>
                  <p className="text-xs text-sky-200 mt-1 font-medium max-w-xl">
                    Track live bookings, visitor gates, biosecurity status, and fish collection requests submitted from the Customer Portal.
                  </p>
                </div>
              </div>

              <div id="manager-appointments-table-container" className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 border-b text-slate-600 font-extrabold text-[10px] uppercase">
                    <tr>
                      <th className="px-5 py-3.5">Customer & Contact</th>
                      <th className="px-5 py-3.5">Appointment Type</th>
                      <th className="px-5 py-3.5 font-mono">Date / Time Slot</th>
                      <th className="px-5 py-3.5">Transport Mode</th>
                      <th className="px-5 py-3.5">Staff Assigned</th>
                      <th className="px-5 py-3.5 text-center">Status</th>
                      {!readOnly && <th className="px-5 py-3.5 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700">
                    {bookings
                      .filter(bk => !searchQuery || bk.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || (bk.customersName && bk.customersName.toLowerCase().includes(searchQuery.toLowerCase())) || bk.appointmentType.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((bk) => (
                        <tr key={bk.id} className="hover:bg-slate-50/55 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-extrabold text-slate-900">{bk.customersName || "N/A Group"}</div>
                            <div className="text-[11px] font-semibold text-slate-600">Contact: {bk.customerName}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{bk.contactInfo}</div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-bold text-slate-800">{bk.appointmentType}</span>
                            {bk.relatedFishSales && (
                              <div className="text-[10px] text-emerald-600 font-bold mt-1">🐟 {bk.relatedFishSales}</div>
                            )}
                          </td>
                          <td className="px-5 py-4 font-mono text-[11px] text-slate-500">{bk.dateTime}</td>
                          <td className="px-5 py-4">
                            <span className="font-medium text-slate-700 block">{bk.transportMode}</span>
                            {bk.vehiclePlate && <span className="font-mono text-[9px] text-slate-400">{bk.vehiclePlate}</span>}
                          </td>
                          <td className="px-5 py-4 font-mono text-slate-600">{bk.staffAssigned || "No staff assigned"}</td>
                          <td className="px-5 py-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              bk.status === "Approved" || bk.status === "Completed"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}>
                              {bk.status || "Pending"}
                            </span>
                          </td>
                          {!readOnly && (
                            <td className="px-5 py-4 text-right space-x-2">
                              {onUpdateRecord && bk.status !== "Approved" && (
                                <button
                                  onClick={() => onUpdateRecord("appointments", bk.id || "", { ...bk, status: "Approved" })}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded cursor-pointer animate-pulse"
                                >
                                  Approve
                                </button>
                              )}
                              <button
                                onClick={() => onDeleteRecord("appointments", bk.id || "")}
                                className="p-1 hover:text-red-650 text-slate-450 cursor-pointer"
                                title="Delete booking log"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          )}
                        </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-slate-400 font-medium">
                          No customer bookings registered currently.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Operations Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-sky-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-sky-100 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-sky-900 to-indigo-950 p-6 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <FileText size={24} className="text-cyan-400 animate-pulse" />
                <div>
                  <h3 className="text-base font-bold">Unified Facility Operational Audit Report</h3>
                  <p className="text-[10px] text-sky-200 uppercase font-mono font-bold tracking-wider">RecXpats Fish Farm Operations Master Summary</p>
                </div>
              </div>
              <button 
                onClick={() => { setShowReportModal(false); setReportText(""); }}
                className="hover:bg-white/10 p-1.5 rounded-lg text-sky-200 hover:text-white transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              
              {/* Facility details summary info board */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150">
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block mb-0.5">Authorized Officer</span>
                  <span className="font-extrabold text-slate-800 text-xs truncate block">{currentUserEmail || "okello@manager.com"} (Manager)</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150">
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block mb-0.5">Audit Generation Date</span>
                  <span className="font-extrabold text-slate-800 text-xs">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150">
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block mb-0.5">Facility Security Rating</span>
                  <span className="font-extrabold text-emerald-600 text-xs">Biosecurity Grade Zone AAA Secured</span>
                </div>
              </div>

              {/* REPORT DASHBOARD VISUAL SUMMARY CHART */}
              <div className="bg-slate-50 border p-5 rounded-2xl">
                <h4 className="text-xs font-black text-slate-850 uppercase mb-3 flex items-center gap-1.5 font-sans">
                  <BarChart3 size={15} className="text-indigo-600" /> Operational Volume Matrix Overview (Live Indicators)
                </h4>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: "Stocks", count: inventoryManagement.length },
                      { name: "Feed Formulas", count: feeds.length },
                      { name: "Suppliers", count: suppliers.length },
                      { name: "Water Logs", count: waterQuality.length },
                      { name: "Breeding hold", count: spawning.length },
                      { name: "Ponds/Tanks", count: ponds.length }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" fontSize={9} />
                      <YAxis fontSize={9} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#4f46e5" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 12 Core Operations Pillars Multi-column metrics breakdown */}
              <div id="facility-report-printable-area" className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                {/* Block 1: Warehouse & Assets */}
                <div className="border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3 bg-white">
                  <h4 className="text-xs font-bold text-slate-900 border-b pb-2 flex items-center gap-1.5 uppercase tracking-wide">
                    <Warehouse size={14} className="text-cyan-500" /> a) Warehouse & Assets
                  </h4>
                  <ul className="text-xs space-y-2 text-slate-600 leading-normal">
                    <li className="flex justify-between">
                      <span>Total SKU Types Logged:</span>
                      <strong className="text-slate-800 font-mono">{inventoryManagement.length} SKUs</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Asset Valuation:</span>
                      <strong className="text-slate-800 font-mono">Ush {inventoryManagement.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0).toLocaleString()}</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Depleted Safety Stock alerts:</span>
                      <strong className={lowStockCount > 0 ? "text-amber-600 font-bold font-mono" : "text-emerald-600 font-mono"}>{lowStockCount} items</strong>
                    </li>
                  </ul>
                </div>

                {/* Block 2: Biological Feeds */}
                <div className="border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3 bg-white">
                  <h4 className="text-xs font-bold text-slate-900 border-b pb-2 flex items-center gap-1.5 uppercase tracking-wide">
                    <Scale size={14} className="text-cyan-500" /> b) Feed Stocks & Formulas
                  </h4>
                  <ul className="text-xs space-y-2 text-slate-600 leading-normal">
                    <li className="flex justify-between">
                      <span>Active Feed Formulas:</span>
                      <strong className="text-slate-800 font-mono">{feeds.length} items</strong>
                    </li>
                    <li className="flex justify-between font-medium">
                      <span>Formulation Profiles:</span>
                      <strong className="text-slate-800 font-mono">{feedProfiles.length} recipes</strong>
                    </li>
                    <li className="flex justify-between font-medium">
                      <span>Feeding Routines active:</span>
                      <strong className="text-slate-800 font-mono">{schedules.length} schedules</strong>
                    </li>
                  </ul>
                </div>

                {/* Block 3: Sourcing & Logistics Ledger */}
                <div className="border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3 bg-white">
                  <h4 className="text-xs font-bold text-slate-900 border-b pb-2 flex items-center gap-1.5 uppercase tracking-wide">
                    <FileText size={14} className="text-cyan-500" /> c) Sourcing & Invoicing
                  </h4>
                  <ul className="text-xs space-y-2 text-slate-600 leading-normal">
                    <li className="flex justify-between">
                      <span>Active Supplier accounts:</span>
                      <strong className="text-slate-800 font-mono">{suppliers.length} active</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Total procurement LPOs:</span>
                      <strong className="text-slate-800 font-mono">{lpos.length} logs</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Invoices Value Pending:</span>
                      <strong className="text-slate-800 font-mono">Ush {invoices.reduce((sum, item) => sum + item.amountOwed, 0).toLocaleString()}</strong>
                    </li>
                  </ul>
                </div>

                {/* Block 4: Water Quality check */}
                <div className="border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3 bg-white">
                  <h4 className="text-xs font-bold text-slate-900 border-b pb-2 flex items-center gap-1.5 uppercase tracking-wide">
                    <Droplets size={14} className="text-cyan-500" /> d) Water Quality Diagnostics
                  </h4>
                  <ul className="text-xs space-y-2 text-slate-600 leading-normal">
                    <li className="flex justify-between">
                      <span>Water quality tests logged:</span>
                      <strong className="text-slate-800 font-mono">{waterQuality.length} logs</strong>
                    </li>
                    <li className="flex justify-between font-medium">
                      <span>Average pH level:</span>
                      <strong className="text-slate-800 font-mono">
                        {waterQuality.length > 0 ? (waterQuality.reduce((sum, w) => sum + w.ph, 0) / waterQuality.length).toFixed(1) : "7.2"}
                      </strong>
                    </li>
                    <li className="flex justify-between font-medium">
                      <span>Average Dissolved Oxygen:</span>
                      <strong className="text-slate-800 font-mono">
                        {waterQuality.length > 0 ? (waterQuality.reduce((sum, w) => sum + w.dissolvedOxygen, 0) / waterQuality.length).toFixed(1) : "5.5"} mg/L
                      </strong>
                    </li>
                  </ul>
                </div>

                {/* Block 5: Generational Spawning Potency */}
                <div className="border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3 bg-white">
                  <h4 className="text-xs font-bold text-slate-900 border-b pb-2 flex items-center gap-1.5 uppercase tracking-wide">
                    <Sparkles size={14} className="text-cyan-500" /> f-i) Breeding, Spawning & Hatching
                  </h4>
                  <ul className="text-xs space-y-2 text-slate-600 leading-normal">
                    <li className="flex justify-between">
                      <span>Combined spawning cycles:</span>
                      <strong className="text-slate-800 font-mono">{spawning.length} runs</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Stripped eggs output weight:</span>
                      <strong className="text-slate-800 font-mono">
                        {spawning.filter(s => s.eggWeightG > 0).reduce((sum, s) => sum + s.eggWeightG, 0)} Grams
                      </strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Incubated Larval survival target:</span>
                      <strong className="text-emerald-600 font-mono">95.8% (Target clearance Zone)</strong>
                    </li>
                  </ul>
                </div>

                {/* Block 6: Health, biosecurity & staffing */}
                <div className="border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3 bg-white">
                  <h4 className="text-xs font-bold text-slate-900 border-b pb-2 flex items-center gap-1.5 uppercase tracking-wide">
                    <ShieldAlert size={14} className="text-cyan-500" /> j-l) Health, Biosecurity & Tracing
                  </h4>
                  <ul className="text-xs space-y-2 text-slate-600 leading-normal">
                    <li className="flex justify-between">
                      <span>Disease Incidents Logged:</span>
                      <strong className={health.length > 0 ? "text-amber-600 font-bold font-mono" : "text-emerald-600 font-mono"}>{health.length} incidents</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Active monitored ponds:</span>
                      <strong className="text-slate-800 font-mono">{ponds.length} tanks</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Secure Trace Custody chains:</span>
                      <strong className="text-sky-600 font-mono">{traces.length} LOT IDs</strong>
                    </li>
                  </ul>
                </div>

              </div>

              {/* AI Expert recommendation briefing container */}
              <div className="bg-sky-50 rounded-2xl border border-sky-100 p-5 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Activity size={18} className="text-sky-700 shrink-0" />
                    <span className="text-xs font-bold text-sky-950 uppercase tracking-wide leading-none">Diagnostic Advisory Briefing (Senior Consultant AI)</span>
                  </div>
                  <button
                    disabled={isGeneratingReportAI}
                    onClick={async () => {
                      setIsGeneratingReportAI(true);
                      try {
                        const payload = {
                          name: "Master Audit Report: Facility Zone AAA",
                          plannedAmount: 15410000,
                          actualRevenueRollup: 11910000,
                          actualExpensesRollup: 3500000,
                          budgetVariance: 8410000
                        };
                        const res = await fetch("/api/gemini/diagnose", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ type: "budget-forecast", data: payload })
                        });
                        const resData = await res.json();
                        setReportText(resData.text);
                      } catch (err) {
                        console.error(err);
                        setReportText("Failed to query senior bio-security consultant insights. Ensure your backend is reachable.");
                      } finally {
                        setIsGeneratingReportAI(false);
                      }
                    }}
                    className="px-3 py-1.5 bg-sky-900 hover:bg-sky-850 disabled:opacity-50 text-cyan-200 text-[10px] font-black rounded-lg cursor-pointer transition-colors block shrink-0"
                  >
                    {isGeneratingReportAI ? "Synthesizing AI Guidance..." : "🧠 Generate Senior Advisor AI Brief"}
                  </button>
                </div>
                {reportText ? (
                  <div className="bg-white/90 p-4 rounded-xl border border-sky-100 text-xs font-serif leading-relaxed text-slate-700 whitespace-pre-line mt-2 animate-fade-in max-h-48 overflow-y-auto">
                    {reportText}
                  </div>
                ) : (
                  <p className="text-[11px] text-sky-800/80 leading-relaxed font-medium">
                    Trigger the generative AI system above to synthesize deep compliance suggestions, biometric risk assessment margins, and resource constraints based directly on live parameters.
                  </p>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-5 border-t border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                <span className="text-[10px] font-bold text-slate-500 mr-1">📥 EXPORTS:</span>
                <button
                  onClick={() => handleExportOperationsReport("pdf")}
                  className="px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-700 text-[10px] font-black uppercase rounded-lg border border-sky-300 transition cursor-pointer"
                  title="Export PDF Report"
                >
                  📄 PDF
                </button>
                <button
                  onClick={() => handleExportOperationsReport("csv")}
                  className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-[10px] font-black uppercase rounded-lg border border-emerald-300 transition cursor-pointer"
                  title="Export CSV"
                >
                  📊 CSV
                </button>
                <button
                  onClick={() => handleExportOperationsReport("excel")}
                  className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 text-[10px] font-black uppercase rounded-lg border border-amber-300 transition cursor-pointer"
                  title="Export formatted Excel file"
                >
                  📈 Excel
                </button>
                <button
                  onClick={() => handleExportOperationsReport("print")}
                  className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 text-[10px] font-black uppercase rounded-lg border border-purple-300 transition cursor-pointer"
                  title="Print directly"
                >
                  🖨️ Print
                </button>
              </div>

              <button 
                onClick={() => { setShowReportModal(false); setReportText(""); }}
                className="w-full sm:w-auto px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer text-center"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Internal Dynamic Form sub-system mapping variables exactly to types */
interface FormRouterProps {
  tab: string;
  onAdd: (model: string, data: any) => Promise<void>;
  onClose: () => void;
  onAddLocalStaff: (log: {id: string, staffName: string, role: string, activity: string, date: string}) => void;
  ponds: PondRecord[];
  farms: FarmRecord[];
}

function FormRouter({ tab, onAdd, onClose, onAddLocalStaff, ponds, farms }: FormRouterProps) {
  const defaultDate = new Date().toISOString().split('T')[0];

  // Specific states
  const [fName, setFName] = useState("");
  const [fNum, setFNum] = useState("");
  const [fAmount, setFAmount] = useState("1000");

  // Expanded inventory management states
  const [invDescription, setInvDescription] = useState("");
  const [invType, setInvType] = useState<"Equipment" | "Feed" | "Medication" | "Fish" | "Consumables">("Equipment");
  const [invPhoto, setInvPhoto] = useState("");
  const [invUnitOfMeasure, setInvUnitOfMeasure] = useState("Kg");
  const [invUnitCost, setInvUnitCost] = useState(0);
  const [invQuantity, setInvQuantity] = useState(0);
  const [invReceivedDate, setInvReceivedDate] = useState(defaultDate);
  const [invExpiryDate, setInvExpiryDate] = useState(defaultDate);
  const [invLastUpdated, setInvLastUpdated] = useState(defaultDate);
  const [invReorderLevel, setInvReorderLevel] = useState(0);
  const [invSupplier, setInvSupplier] = useState("");
  const [invFishFeedName, setInvFishFeedName] = useState("");
  const [invBrand, setInvBrand] = useState("");
  const [invBatchNumber, setInvBatchNumber] = useState("");
  const [invQuantityReceived, setInvQuantityReceived] = useState(0);
  const [invDateTimeReceived, setInvDateTimeReceived] = useState(defaultDate + "T12:00");
  const [invUnitCostPerKg, setInvUnitCostPerKg] = useState(0);
  const [invReorderLevelQuantityKg, setInvReorderLevelQuantityKg] = useState(0);
  const [invDailyLogDate, setInvDailyLogDate] = useState(defaultDate);
  const [invCurrentFeedQuantityKg, setInvCurrentFeedQuantityKg] = useState(0);
  const [invIngredientsUsed, setInvIngredientsUsed] = useState("");
  const [invCostPerIngredientKg, setInvCostPerIngredientKg] = useState(0);
  const [invProteinPct, setInvProteinPct] = useState(0);
  const [invFatPct, setInvFatPct] = useState(0);
  const [invFiberPct, setInvFiberPct] = useState(0);
  const [invEnergyKcal, setInvEnergyKcal] = useState(0);

  const [fishFeedName, setFishFeedName] = useState("");
  const [fishFeedStock, setFishFeedStock] = useState("50");
  const [fishFeedSpecies, setFishFeedSpecies] = useState("Tilapia");

  // Selected Feed form option: "consumption" or "supplier"
  const [feedFormType, setFeedFormType] = useState<"consumption" | "supplier">("consumption");

  // 1. Feed Consumption State definitions:
  const [consTankId, setConsTankId] = useState("Tank-A1");
  const [consFishCount, setConsFishCount] = useState("1500");
  const [consFishStage, setConsFishStage] = useState("Fingerling");
  const [consFishSpecies, setConsFishSpecies] = useState("Tilapia");
  const [consStockingDate, setConsStockingDate] = useState(defaultDate);
  const [consWaterTemp, setConsWaterTemp] = useState("26.5");
  const [consFeedType, setConsFeedType] = useState("Regular Pellets Feed");
  const [consStartDate, setConsStartDate] = useState(defaultDate);
  const [consEndDate, setConsEndDate] = useState(defaultDate);
  const [consInstructions, setConsInstructions] = useState("Distribute evenly across active trays twice daily.");
  const [consFeedPerFish, setConsFeedPerFish] = useState("0.15");
  const [consFrequency, setConsFrequency] = useState("3");
  const [consTotalFeedUsed, setConsTotalFeedUsed] = useState("2.5");
  const [consFeedQtyPerCycle, setConsFeedQtyPerCycle] = useState("75");
  const [consBiomassGain, setConsBiomassGain] = useState("45");
  const [consFcr, setConsFcr] = useState("1.35");
  const [consGrowthRate, setConsGrowthRate] = useState("2.5");
  const [consHarvestDate, setConsHarvestDate] = useState(defaultDate);
  const [consNotes, setConsNotes] = useState("Healthy feed response with active schooling.");
  const [consWastage, setConsWastage] = useState("Negligible");
  const [consWastageNotes, setConsWastageNotes] = useState("No residual pellets observed on bottom traps.");

  // AI & Analytics fields for Feed Consumption:
  const [consAiRecommendations, setConsAiRecommendations] = useState("Maintain current density. Prepare temperature buffers.");
  const [consAiFeedAdjustment, setConsAiFeedAdjustment] = useState("If temp spike exceeds 28°C, shift feed timings.");
  const [consAiFeedingSchedule, setConsAiFeedingSchedule] = useState("AM peak delivery: 40%. Midday: 30%. Evening: 30%.");
  const [consAiSupplierInsights, setConsAiSupplierInsights] = useState("Supplied compounds contain trace minerals.");
  const [consAiConsumptionSummary, setConsAiConsumptionSummary] = useState("Consistent daily conversion indices.");
  const [consAiIngredientCost, setConsAiIngredientCost] = useState("Crude protein compounds represent ~70% of cost.");
  const [consAiNutritionalProfile, setConsAiNutritionalProfile] = useState("Crude Protein 35%, Fat 10%, Fiber 4.5%.");
  const [consTraceabilityInterface, setConsTraceabilityInterface] = useState("Trace ID: FCR-T1-TIL-2026");

  // 2. Feed Suppliers State definitions:
  const [supSupplierName, setSupSupplierName] = useState("");
  const [supContactPerson, setSupContactPerson] = useState("");
  const [supCompanyName, setSupCompanyName] = useState("");
  const [supPhone, setSupPhone] = useState("");
  const [supEmail, setSupEmail] = useState("");
  const [supAddress, setSupAddress] = useState("");
  const [supNotes, setSupNotes] = useState("");
  const [supAiInsights, setSupAiInsights] = useState("Consistent delivery turnaround. High bioavailability inputs.");
  const [supFeedIngredients, setSupFeedIngredients] = useState("Organic fishmeal, ground whole wheat, soybean isolate.");

  const [testTank, setTestTank] = useState(ponds[0]?.name || "AQ-A Broodstock");
  const [testPh, setTestPh] = useState("7.0");
  const [testDo, setTestDo] = useState("6.2");
  const [testTemp, setTestTemp] = useState("26");

  // Water Quality Management fields state
  const [wqTankId, setWqTankId] = useState("Pond-B1");
  const [wqTankType, setWqTankType] = useState("Nursery Pond");
  const [wqSpecies, setWqSpecies] = useState("Tilapia");
  const [wqStage, setWqStage] = useState("Fingerling");
  const [wqLocation, setWqLocation] = useState("North Wing Recirculation Unit A");
  const [wqTestDate, setWqTestDate] = useState(defaultDate);
  const [wqPh, setWqPh] = useState("7.2");
  const [wqDo, setWqDo] = useState("6.5");
  const [wqAmmonia, setWqAmmonia] = useState("0.02");
  const [wqNitrite, setWqNitrite] = useState("0.01");
  const [wqNitrate, setWqNitrate] = useState("10.0");
  const [wqTemp, setWqTemp] = useState("26.5");
  const [wqHardness, setWqHardness] = useState("120");
  const [wqAlkalinity, setWqAlkalinity] = useState("100");
  const [wqChlorine, setWqChlorine] = useState("0.0");
  const [wqTurbidity, setWqTurbidity] = useState("Low (25 NTU)");
  const [wqRemarks, setWqRemarks] = useState("Optimal water parameters observed.");
  const [wqTestedBy, setWqTestedBy] = useState("Denis Sserwadda");
  const [wqImmediateActions, setWqImmediateActions] = useState("None required. Continue routine recirculation.");
  const [wqAiRecommendedAction, setWqAiRecommendedAction] = useState("Perform minor water exchange in 48 hours to maintain fresh mineral balances.");
  const [wqAiRiskLevel, setWqAiRiskLevel] = useState("LOW (Safe Category)");

  const [spawningTank, setSpawningTank] = useState("AQ-S1");
  const [spawnHormone, setSpawnHormone] = useState("Ovaprim");
  const [spawnSpecies, setSpawnSpecies] = useState("Clarias Gariepinus");
  const [spawnDose, setSpawnDose] = useState("0.5");
  const [stripEggWeight, setStripEggWeight] = useState("15.0");
  const [incubationTankName, setIncubationTankName] = useState("Incubator AQ-C");

  // Fish Farm Management Complete Fields State Hooks
  const [hmBroodstockOrigin, setHmBroodstockOrigin] = useState("Nile Wild Delta");
  const [hmBroodstockSex, setHmBroodstockSex] = useState("Mixed Breeding Pool");
  const [hmBroodstockWeightG, setHmBroodstockWeightG] = useState("1200");
  const [hmBroodstockMortality, setHmBroodstockMortality] = useState("0");
  const [hmBroodstockReplacement, setHmBroodstockReplacement] = useState("0");
  const [hmHormoneTime, setHmHormoneTime] = useState("2026-06-18T10:00");
  const [hmHormoneTotalDoseMl, setHmHormoneTotalDoseMl] = useState("1.5");
  const [hmTranquilizerTank, setHmTranquilizerTank] = useState("TQ-C1");
  const [hmSpawningSchedule, setHmSpawningSchedule] = useState("AM Cycle Plan");
  const [hmSpawningDate, setHmSpawningDate] = useState("2026-06-18T12:00");
  const [hmSpawningStartTime, setHmSpawningStartTime] = useState("12:00");
  const [hmSpawningEndTime, setHmSpawningEndTime] = useState("13:30");
  const [hmStrippingTime, setHmStrippingTime] = useState("14:00");
  const [hmEggAppearance, setHmEggAppearance] = useState("Golden amber, transparent");
  const [hmEggChemicals, setHmEggChemicals] = useState("Formalin 10%");
  const [hmEggWeightG, setHmEggWeightG] = useState("250");
  const [hmEggsQuantity, setHmEggsQuantity] = useState("25000");
  const [hmIncubationTank, setHmIncubationTank] = useState("Incubator T-25");
  const [hmIncubationTankStatus, setHmIncubationTankStatus] = useState("Active Clean");
  const [hmIncubationStartDate, setHmIncubationStartDate] = useState("2026-06-18T14:30");
  const [hmIncubationEndDate, setHmIncubationEndDate] = useState("2026-06-21T14:30");
  const [hmHatchedFry, setHmHatchedFry] = useState("23500");
  const [hmStockType, setHmStockType] = useState("Premium Seed Block");
  const [hmActivityDescription, setHmActivityDescription] = useState("i. Health Check");
  const [hmMortality, setHmMortality] = useState("1500");
  const [hmSurvivalRatePct, setHmSurvivalRatePct] = useState("94");
  const [hmQualityAssessment, setHmQualityAssessment] = useState("A-Grade Premium");
  const [hmNotes, setHmNotes] = useState("Favorable hatching responses with minor malforms.");
  const [hmLastUpdated, setHmLastUpdated] = useState("2026-06-18");
  const [hmApparatusUsed, setHmApparatusUsed] = useState("Zug Glass Jars, Digital Pipettes");
  const [hmStaffName, setHmStaffName] = useState("Denis Sserwadda");
  const [hmActivityDate, setHmActivityDate] = useState("2026-06-18T13:00");
  const [hmEndTime, setHmEndTime] = useState("2026-06-18T14:30");
  const [hmDurationMinutes, setHmDurationMinutes] = useState("90");
  const [hmAiMonitoringStatus, setHmAiMonitoringStatus] = useState("OPTIMAL (95% hatching confidence value)");
  const [hmAiTestAdjustments, setHmAiTestAdjustments] = useState("Maintain temp at constant 26.8°C.");
  const [hmAiBroodstockScheduleAdjustments, setHmAiBroodstockScheduleAdjustments] = useState("Extend spawn intervals to 14 days.");
  const [hmBatchManagement, setHmBatchManagement] = useState("BATCH-H2-TIL092");

  const [diseaseState, setDiseaseState] = useState("None (Routine check)");
  const [treatmentState, setTreatmentState] = useState("");
  const [mortalityCount, setMortalityCount] = useState("0");

  const [pondName, setPondName] = useState("");
  const [pondType, setPondType] = useState("Broodstock Reservoir");
  const [pondVolume, setPondVolume] = useState("120");

  // Farm Setup and infrastructure state
  const [farmFormType, setFarmFormType] = useState<"farm_setup" | "pond_registration">("farm_setup");
  const [farmRegName, setFarmRegName] = useState("");
  const [farmRegLocation, setFarmRegLocation] = useState("");
  const [farmRegAcreage, setFarmRegAcreage] = useState("1.5");
  const [farmRegManagerName, setFarmRegManagerName] = useState("");
  const [farmRegDescription, setFarmRegDescription] = useState("Standard grow-out farm with flow-through channels");
  const [farmRegLayout, setFarmRegLayout] = useState("Linear-feed dynamic multi-stage channels");

  const [pondRegName, setPondRegName] = useState("");
  const [pondRegType, setPondRegType] = useState("Concrete Tank");
  const [pondRegVolume, setPondRegVolume] = useState("150");
  const [pondRegSize, setPondRegSize] = useState("80");
  const [pondRegSector, setPondRegSector] = useState("Sector Nursery Alpha");
  const [pondRegFarmId, setPondRegFarmId] = useState("");
  const [pondRegSpecies, setPondRegSpecies] = useState("Clarias gariepinus (Catfish)");
  const [pondRegLatitude, setPondRegLatitude] = useState("0.3176");
  const [pondRegLongitude, setPondRegLongitude] = useState("32.5825");

  const [traceName, setTraceName] = useState("");
  const [lotCode, setLotCode] = useState("LOT-2026-" + Math.floor(Math.random() * 90000 + 10000));

  // Health & Environmental Management Expanded States
  const [hlRecordName, setHlRecordName] = useState("Routine Bio-Security Check");
  const [hlTankLocation, setHlTankLocation] = useState("Pond-B1");
  const [hlSpecies, setHlSpecies] = useState("Tilapia");
  const [hlStage, setHlStage] = useState("Fingerling");
  const [hlObservationDate, setHlObservationDate] = useState(defaultDate);
  const [hlDiseaseDiagnosed, setHlDiseaseDiagnosed] = useState("None (Normal check-up)");
  const [hlMortalityCount, setHlMortalityCount] = useState("0");
  const [hlMortalityRate, setHlMortalityRate] = useState("0%");
  const [hlMortalityCause, setHlMortalityCause] = useState("N/A");
  const [hlWaterQualityLink, setHlWaterQualityLink] = useState("wq-1");
  const [hlHealthStatus, setHlHealthStatus] = useState("Healthy");
  const [hlSymptoms, setHlSymptoms] = useState("Regular swimming speed and high appetite.");
  const [hlBiosecurityStatus, setHlBiosecurityStatus] = useState("Approved (Full Protocol Followed)");
  const [hlComplianceChecklist, setHlComplianceChecklist] = useState("Water clean; disinfection barrier active; no surface foaming; aeration working.");
  const [hlTreatmentPrescribed, setHlTreatmentPrescribed] = useState("None");
  const [hlTreatmentStartDate, setHlTreatmentStartDate] = useState("");
  const [hlTreatmentEndDate, setHlTreatmentEndDate] = useState("");
  const [hlTreatmentStatus, setHlTreatmentStatus] = useState("Routine State");
  const [hlEnvironmentalImpact, setHlEnvironmentalImpact] = useState("Minimal - sand bed filter recirculation in use.");
  const [hlEnvironmentalImpactLevel, setHlEnvironmentalImpactLevel] = useState("Low");
  const [hlCreatedBy, setHlCreatedBy] = useState("Denis Sserwadda");
  const [hlNotes, setHlNotes] = useState("Observation shows zero disease symptoms.");
  const [hlStockInventoryLink, setHlStockInventoryLink] = useState("inv-stock-1");
  const [hlLinkedAppointment, setHlLinkedAppointment] = useState("app-1");
  const [hlRelatedFinancialLink, setHlRelatedFinancialLink] = useState("inv-5");
  const [hlDiseaseDocument, setHlDiseaseDocument] = useState("");
  const [hlAttachments, setHlAttachments] = useState("");

  // Harvest & Post-Harvest Expanded States
  const [hvPondName, setHvPondName] = useState("Pond-A3");
  const [hvLocation, setHvLocation] = useState("East Rearing Segment");
  const [hvSpecies, setHvSpecies] = useState("Tilapia");
  const [hvStage, setHvStage] = useState("Table-size (Adult)");
  const [hvBatchName, setHvBatchName] = useState("BATCH-HV-TIL-" + Math.floor(Math.random() * 900 + 100));
  const [hvDateTime, setHvDateTime] = useState(defaultDate);
  const [hvEquipmentLog, setHvEquipmentLog] = useState("Seine net, Sorting table, Aerated water drums");
  const [hvNextHarvestDate, setHvNextHarvestDate] = useState("");
  const [hvScheduledCrew, setHvScheduledCrew] = useState("Benson Ssimbwa, James");
  const [hvCrewNotes, setHvCrewNotes] = useState("Complete sorting work before 11:00 AM.");
  const [hvEstBiomass, setHvEstBiomass] = useState("450");
  const [hvActualYield, setHvActualYield] = useState("440");
  const [hvPostHarvestCleaning, setHvPostHarvestCleaning] = useState("Tanks washed with food-grade sanitizing detergents");
  const [hvGradingCategory, setHvGradingCategory] = useState("Grade-A (>500g): 380kg, Grade-B (300g-500g): 60kg");
  const [hvWasteDisposal, setHvWasteDisposal] = useState("Composted as organic fertilizer");
  const [hvWasteQty, setHvWasteQty] = useState("10");
  const [hvQualityIssues, setHvQualityIssues] = useState("Zero anomalies. Premium color and eye index.");
  const [hvColdChainMaintained, setHvColdChainMaintained] = useState(true);
  const [hvPackagingDetails, setHvPackagingDetails] = useState("Expanded polystyrene crates layered with crushed ice");
  const [hvBatchLabels, setHvBatchLabels] = useState("TIL-PK-0922");
  const [hvTransportStatus, setHvTransportStatus] = useState("Scheduled Handover");
  const [hvTransportCompany, setHvTransportCompany] = useState("POSTA Uganda logistics division");
  const [hvTransportVehicle, setHvTransportVehicle] = useState("UBA-981R (Refrigerated)");
  const [hvTransportPerson, setHvTransportPerson] = useState("Driver George Ssempa, ID: UG-7762");
  const [hvPhoto, setHvPhoto] = useState("");
  const [hvDocument, setHvDocument] = useState("");
  const [hvCreatedBy, setHvCreatedBy] = useState("Denis Sserwadda");
  const [hvAiSummary, setHvAiSummary] = useState("");
  const [hvProcessing, setHvProcessing] = useState("Processing-1");
  const [hvTraceability, setHvTraceability] = useState("trace-1");
  const [hvLinkedInventory, setHvLinkedInventory] = useState("inv-stock-1");
  const [hvLinkedHealth, setHvLinkedHealth] = useState("health-1");

  // Farm Maintenance Expanded States
  const [mnRecordName, setMnRecordName] = useState("Periodic Water Circulation Maintenance");
  const [mnDateTime, setMnDateTime] = useState(defaultDate);
  const [mnChecklist, setMnChecklist] = useState("Pumps checked, Solar logs read, Backup gen tested, Camera alignment audited");
  const [mnType, setMnType] = useState("Preventive Checkup");
  const [mnPumpLog, setMnPumpLog] = useState("Pumps cleaned, pressure optimal, intake grates cleared");
  const [mnSolarLog, setMnSolarLog] = useState("Solar power inverter operating clean, battery bank 98% charge");
  const [mnGeneratorLog, setMnGeneratorLog] = useState("Generator oil level checked, fuel reservoir full, automatic crank ok");
  const [mnCameraLog, setMnCameraLog] = useState("All CCTV feeds running, high visibility, lenses clean");
  const [mnCameraMaintenance, setMnCameraMaintenance] = useState("Incubation camera lens wiped and field-of-view adjusted");
  const [mnWorkOrderRef, setMnWorkOrderRef] = useState("WO-288");
  const [mnAeratorLog, setMnAeratorLog] = useState("Aerator belts checked, air intake mesh cleaned, CFM stable");
  const [mnCrewAssigned, setMnCrewAssigned] = useState("Denis Sserwadda");
  const [mnNetRepair, setMnNetRepair] = useState("Nets checked, no holes detected, zipper lines greased");
  const [mnPondRepair, setMnPondRepair] = useState("Concrete bank sealed with waterproof cement");
  const [mnFuelConsumption, setMnFuelConsumption] = useState("5");
  const [mnRoutineSchedule, setMnRoutineSchedule] = useState("Weekly Check");
  const [mnFenceLog, setMnFenceLog] = useState("Fence tension holds high, electric feedback 5.2 kV peak");
  const [mnActivities, setMnActivities] = useState("Backwash filtration beds, clean bio-balls container");
  const [mnImages, setMnImages] = useState("");
  const [mnIssues, setMnIssues] = useState("Minor algae film on submersible sensor");
  const [mnActionsTaken, setMnActionsTaken] = useState("Sponge-cleaned sensor and restarted system");
  const [mnPerson, setMnPerson] = useState("Denis Sserwadda");
  const [mnNotes, setMnNotes] = useState("All parameters returned to peak operating performance.");
  const [mnLinkedHealth, setMnLinkedHealth] = useState("health-1");

  // Staff Activity Expanded States
  const [stTaskType, setStTaskType] = useState("Health Check");
  const [stStaffName, setStStaffName] = useState("Denis Sserwadda");
  const [stRole, setStRole] = useState("Fish Farm Biologist Controller");
  const [stActivityDetails, setStActivityDetails] = useState("Completed health evaluation checks in quarantine sectors");
  const [stDuration, setStDuration] = useState("60");
  const [stDate, setStDate] = useState(defaultDate);
  const [stNotes, setStNotes] = useState("Routine biosecurity cleared.");

  const runSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tab === "inventoryManagement") {
      onAdd("inventoryManagement", {
        name: invDescription || invFishFeedName || "Unnamed SKU Item",
        description: invDescription,
        inventoryType: invType,
        photo: invPhoto,
        unitOfMeasure: invUnitOfMeasure,
        unitCost: Number(invUnitCost) || 0,
        quantity: Number(invQuantity) || 0,
        receivedDate: invReceivedDate,
        expiryDate: invExpiryDate,
        lastUpdated: invLastUpdated,
        reorderLevel: Number(invReorderLevel) || 0,
        supplier: invSupplier,
        fishFeedName: invFishFeedName,
        brand: invBrand,
        batchNumber: invBatchNumber,
        quantityReceived: Number(invQuantityReceived) || 0,
        dateTimeReceived: invDateTimeReceived,
        unitCostPerKg: Number(invUnitCostPerKg) || 0,
        reorderLevelQuantityKg: Number(invReorderLevelQuantityKg) || 0,
        dailyLogDate: invDailyLogDate,
        currentFeedQuantityKg: Number(invCurrentFeedQuantityKg) || 0,
        ingredientsUsed: invIngredientsUsed,
        costPerIngredientKg: Number(invCostPerIngredientKg) || 0,
        proteinPct: Number(invProteinPct) || 0,
        fatPct: Number(invFatPct) || 0,
        fiberPct: Number(invFiberPct) || 0,
        energyKcal: Number(invEnergyKcal) || 0
      });
    } else if (tab === "feeds") {
      if (feedFormType === "consumption") {
        onAdd("feedingSchedules", {
          name: `Consumption Log for ${consTankId}`,
          assignedTanks: consTankId,
          frequency: `${consFrequency} times/day`,
          quantityPerCycle: Number(consFeedQtyPerCycle) || 0,
          instructions: consInstructions,
          recommendations: consAiRecommendations,

          fishTankId: consTankId,
          fishCount: Number(consFishCount) || 0,
          fishStage: consFishStage,
          fishSpecies: consFishSpecies,
          fishStockingDate: consStockingDate,
          waterTemperature: Number(consWaterTemp) || 0,
          feedType: consFeedType,
          startDate: consStartDate,
          endDate: consEndDate,
          feedPerFish: consFeedPerFish,
          feedingFrequencyPerDay: Number(consFrequency) || 0,
          totalFeedUsedPerDay: Number(consTotalFeedUsed) || 0,
          feedQuantityPerCycle: Number(consFeedQtyPerCycle) || 0,
          biomassGainKg: Number(consBiomassGain) || 0,
          fcr: consFcr,
          growthRatePct: Number(consGrowthRate) || 0,
          expectedHarvestDate: consHarvestDate,
          notes: consNotes,
          feedWastage: consWastage,
          feedWastageNotes: consWastageNotes,

          aiRecommendations: consAiRecommendations,
          aiFeedAdjustment: consAiFeedAdjustment,
          aiFeedingSchedule: consAiFeedingSchedule,
          aiSupplierInsights: consAiSupplierInsights,
          aiConsumptionSummary: consAiConsumptionSummary,
          aiIngredientCostBreakdown: consAiIngredientCost,
          aiNutritionalProfileSummary: consAiNutritionalProfile,
          traceabilityInterface: consTraceabilityInterface
        });
      } else {
        onAdd("suppliers", {
          name: supSupplierName || supCompanyName || "Unnamed Supplier",
          contactPerson: supContactPerson,
          companyName: supCompanyName || supSupplierName,
          phone: supPhone,
          email: supEmail,
          address: supAddress,
          notes: supNotes,
          aiInsights: supAiInsights,
          feedIngredients: supFeedIngredients,
          active: true
        });
      }
    } else if (tab === "procurement") {
      onAdd("invoices", {
        invoiceNumber: fNum || "INV-2026-" + Math.floor(Math.random() * 900 + 100),
        supplierName: fName || "Aller Aqua Feeding Co",
        invoiceDate: defaultDate,
        dueDate: defaultDate,
        amountOwed: parseFloat(fAmount) || 150000,
        status: "Unpaid",
        daysOverdue: 0,
        isOverdue: false,
        totalPaymentsMade: 0,
        outstandingBalance: parseFloat(fAmount) || 150000,
        paymentCompletionPct: 0
      });
    } else if (tab === "water") {
      onAdd("waterQuality", {
        name: `Water Quality Test - ${wqTankId}`,
        tankId: wqTankId,
        tankName: wqTankId,
        tankType: wqTankType,
        species: wqSpecies,
        stage: wqStage,
        location: wqLocation,
        testDate: wqTestDate,
        ph: Number(wqPh) || 7.2,
        dissolvedOxygen: Number(wqDo) || 6.5,
        ammonia: Number(wqAmmonia) || 0.02,
        nitrite: Number(wqNitrite) || 0.01,
        nitrate: Number(wqNitrate) || 10.0,
        temperature: Number(wqTemp) || 26.5,
        hardness: Number(wqHardness) || 120,
        alkalinity: Number(wqAlkalinity) || 100,
        chlorine: Number(wqChlorine) || 0.0,
        turbidity: wqTurbidity,
        remarks: wqRemarks,
        testedBy: wqTestedBy,
        isMonitored: true,
        immediateActions: wqImmediateActions,
        aiRecommendedAction: wqAiRecommendedAction,
        aiRiskLevel: wqAiRiskLevel
      });
    } else if (tab === "staff") {
      onAddLocalStaff({
        id: "s-" + Date.now(),
        staffName: fName || "Dr. Benson",
        role: "Biologist Supervisor",
        activity: fNum || "Calibrated incubation biological screen and evaluated oxygen parameters.",
        date: defaultDate
      });
    } else if (tab === "broodstock") {
      onAdd("spawning", {
        tankId: spawningTank,
        broodstockOrigin: fName || "AgriFarm",
        species: spawnSpecies,
        sex: "Female",
        weightG: parseFloat(fAmount) || 850,
        mortality: 0,
        replacementQty: 0,
        spawningDate: defaultDate,
        eggWeightG: 0,
        eggsQuantity: 0,
        incubationTank: "A-1",
        tankStatus: "Active",
        hatchedFry: 0,
        stockType: "Broodstock",
        survivalRatePct: 100,
        lastUpdated: defaultDate
      });
    } else if (tab === "spawning") {
      onAdd("spawning", {
        tankId: spawningTank || "AQ-S1",
        broodstockOrigin: hmBroodstockOrigin,
        species: spawnSpecies,
        sex: hmBroodstockSex,
        weightG: parseFloat(hmBroodstockWeightG) || 0,
        mortality: parseFloat(hmBroodstockMortality) || 0,
        replacementQty: parseFloat(hmBroodstockReplacement) || 0,
        hormoneTime: hmHormoneTime,
        hormoneInjected: spawnHormone,
        hormoneDosageMlPerKg: parseFloat(spawnDose) || 0,
        hormoneTotalDoseMl: parseFloat(hmHormoneTotalDoseMl) || 0,
        tranquilizerTank: hmTranquilizerTank,
        spawningSchedule: hmSpawningSchedule,
        spawningDate: hmSpawningDate,
        spawningTank: spawningTank || "AQ-S1",
        spawningStartTime: hmSpawningStartTime,
        spawningEndTime: hmSpawningEndTime,
        strippingTime: hmStrippingTime,
        eggAppearance: hmEggAppearance,
        eggChemicals: hmEggChemicals,
        eggWeightG: parseFloat(hmEggWeightG) || 0,
        eggsQuantity: parseFloat(hmEggsQuantity) || 0,
        incubationTank: hmIncubationTank,
        tankStatus: hmIncubationTankStatus,
        incubationStartDate: hmIncubationStartDate,
        incubationEndDate: hmIncubationEndDate,
        hatchedFry: parseFloat(hmHatchedFry) || 0,
        stockType: hmStockType,
        activityDescription: hmActivityDescription,
        fryMortality: parseFloat(hmMortality) || 0,
        survivalRatePct: parseFloat(hmSurvivalRatePct) || 0,
        qualityAssessment: hmQualityAssessment,
        notes: hmNotes,
        lastUpdated: hmLastUpdated,
        apparatusUsed: hmApparatusUsed,
        staffName: hmStaffName,
        activityDate: hmActivityDate,
        endTime: hmEndTime,
        durationMinutes: parseFloat(hmDurationMinutes) || 0,
        aiMonitoringStatus: hmAiMonitoringStatus,
        aiTestAdjustments: hmAiTestAdjustments,
        aiBroodstockScheduleAdjustments: hmAiBroodstockScheduleAdjustments,
        batchManagement: hmBatchManagement
      });
    } else if (tab === "stripping") {
      onAdd("spawning", {
        tankId: spawningTank,
        broodstockOrigin: "Strip Recipient",
        species: spawnSpecies,
        sex: "Female (Stripped)",
        weightG: 600,
        spawningDate: defaultDate,
        eggWeightG: parseFloat(stripEggWeight) || 12.0,
        eggsQuantity: parseFloat(stripEggWeight) * 12000, // standard calculation
        eggAppearance: fName || "Golden, transparent",
        incubationTank: incubationTankName,
        tankStatus: "Stripped Settle Block",
        hatchedFry: 0,
        stockType: "Stripped Batch Logs",
        survivalRatePct: 100,
        lastUpdated: defaultDate
      });
    } else if (tab === "incubation") {
      onAdd("spawning", {
        tankId: spawningTank,
        broodstockOrigin: "Hatched",
        species: spawnSpecies,
        sex: "Mixed Fry",
        weightG: 0,
        spawningDate: defaultDate,
        eggWeightG: 10,
        eggsQuantity: 100000,
        incubationTank: incubationTankName,
        tankStatus: "Incubating Active",
        hatchedFry: 85000,
        stockType: "Incubated Spawn Yield",
        survivalRatePct: 85,
        staffName: fName || "Operator Benson",
        lastUpdated: defaultDate
      });
    } else if (tab === "health" || tab === "healthMgmt") {
      onAdd("healthRecords", {
        name: hlRecordName,
        tankLocation: hlTankLocation,
        species: hlSpecies,
        stage: hlStage,
        observationDate: hlObservationDate,
        diseaseDetected: hlDiseaseDiagnosed,
        mortalityCount: parseFloat(hlMortalityCount) || 0,
        mortalityCause: hlMortalityCause,
        waterQualityTestLink: hlWaterQualityLink,
        healthStatus: hlHealthStatus,
        symptoms: hlSymptoms,
        biosecurityStatus: hlBiosecurityStatus,
        complianceChecklist: hlComplianceChecklist,
        treatmentPrescribed: hlTreatmentPrescribed,
        treatmentStartDate: hlTreatmentStartDate,
        treatmentEndDate: hlTreatmentEndDate,
        treatmentStatus: hlTreatmentStatus,
        environmentalImpact: hlEnvironmentalImpact,
        environmentalImpactLevel: hlEnvironmentalImpactLevel,
        createdBy: hlCreatedBy,
        notes: hlNotes,
        stockInventoryLink: hlStockInventoryLink,
        linkedAppointment: hlLinkedAppointment,
        relatedFinancialLink: hlRelatedFinancialLink,
        diseaseDocument: hlDiseaseDocument,
        attachments: hlAttachments,
        lastUpdated: defaultDate
      });
    } else if (tab === "harvestMgmt") {
      onAdd("harvests", {
        name: hvBatchName,
        harvestDate: hvDateTime,
        tankLocation: hvPondName,
        species: hvSpecies,
        stage: hvStage,
        batchNumber: hvBatchLabels,
        scheduledHarvestDate: hvNextHarvestDate,
        scheduledCrew: hvScheduledCrew,
        crewNotes: hvCrewNotes,
        estimatedBiomassKg: parseFloat(hvEstBiomass) || 0,
        actualYieldKg: parseFloat(hvActualYield) || 0,
        postHarvestCleaning: hvPostHarvestCleaning,
        gradingCategory: hvGradingCategory,
        wasteDisposalMethod: hvWasteDisposal,
        wasteQtyKg: parseFloat(hvWasteQty) || 0,
        qualityStatus: parseFloat(hvWasteQty) > 30 ? "Standard" : "Excellent",
        qualityNotes: hvQualityIssues,
        coldChainMaintained: hvColdChainMaintained,
        packagingDetails: hvPackagingDetails,
        batchLabels: hvBatchLabels,
        transportStatus: hvTransportStatus,
        transportCompany: hvTransportCompany,
        transportDriverDetails: hvTransportVehicle + " - " + hvTransportPerson,
        photos: hvPhoto,
        documents: hvDocument,
        createdBy: hvCreatedBy,
        lastUpdated: defaultDate,
        aiSummarySteps: hvAiSummary || "Batch harvested with a yield retention index of " + ((parseFloat(hvActualYield)/(parseFloat(hvEstBiomass) || 1))*100).toFixed(1) + "%. Grade profile complete.",
        processingLink: hvProcessing,
        traceabilityLink: hvTraceability,
        batchManagementLink: hvLinkedInventory,
        linkedHealth: hvLinkedHealth
      });
    } else if (tab === "maintenanceMgmt") {
      onAdd("maintenances", {
        name: mnRecordName,
        dateTime: mnDateTime,
        checklist: mnChecklist,
        maintenanceType: mnType,
        pumpLog: mnPumpLog,
        solarLog: mnSolarLog,
        generatorLog: mnGeneratorLog,
        cameraLog: mnCameraLog,
        cameraMaintenance: mnCameraMaintenance,
        workOrderRef: mnWorkOrderRef,
        aeratorLog: mnAeratorLog,
        crewAssigned: mnCrewAssigned,
        netRepair: mnNetRepair,
        pondRepair: mnPondRepair,
        fuelConsumption: parseFloat(mnFuelConsumption) || 0,
        routineSchedule: mnRoutineSchedule,
        fenceLog: mnFenceLog,
        activities: mnActivities,
        images: mnImages,
        issues: mnIssues,
        actionsTaken: mnActionsTaken,
        person: mnPerson,
        notes: mnNotes,
        linkedHealthId: mnLinkedHealth
      });
    } else if (tab === "staffActivityMgmt") {
      onAdd("staffActivities", {
        taskType: stTaskType,
        staffName: stStaffName,
        role: stRole,
        activityDetails: stActivityDetails,
        durationMinutes: parseFloat(stDuration) || 0,
        date: stDate,
        additionalNotes: stNotes
      });
    } else if (tab === "farm") {
      if (farmFormType === "farm_setup") {
        onAdd("farms", {
          name: farmRegName || "Sserwadda Broodstock Outpost",
          location: farmRegLocation || "Luwero District, Central Uganda",
          acreage: parseFloat(farmRegAcreage) || 2.5,
          managerName: farmRegManagerName || "Denis Sserwadda",
          description: farmRegDescription || "Broodstock grow-out and stocking platform",
          layoutMapping: farmRegLayout || "linear_grow_out_4_phase"
        });
      } else {
        onAdd("ponds", {
          name: pondRegName || "Tank C-12",
          pondType: pondRegType,
          sizeM2: parseFloat(pondRegSize) || (parseFloat(pondRegVolume) * 0.8),
          volumeM3: parseFloat(pondRegVolume) || 120,
          location: pondRegSector || "Sector Nursery Alpha",
          constructionDate: defaultDate,
          lastMaintenanceDate: defaultDate,
          status: "Active",
          associatedSpecies: pondRegSpecies || "Clarias / Carp Mixed",
          notes: "Heavy duty aeration and micro-filtration system",
          latitude: pondRegLatitude || "0.3476",
          longitude: pondRegLongitude || "32.5825",
          farmId: pondRegFarmId || (farms && farms[0]?.id) || "farm-1"
        });
      }
    } else if (tab === "trace") {
      onAdd("traceRecords", {
        name: traceName || "Market Lot Fingerlings Tag",
        lotNumber: lotCode,
        trackingType: "Batch Distribution",
        dateInitiated: defaultDate,
        recallStatus: "Standard",
        custodyDetails: fName || "Fish Farm Delivery Co",
        complianceReport: "URA Approved Export Compliant"
      });
    }
  };

  return (
    <form onSubmit={runSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
      {/* Dynamic forms fields based on tabs */}
      {tab === "inventoryManagement" && (
        <div className="col-span-1 sm:col-span-2 space-y-6">
          {/* SECTION 1: Core Stock Identity */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center gap-1.5 uppercase text-sky-700">
              📦 1. Core Stock Identity
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Description</label>
                <input type="text" placeholder="e.g. Starter Feed Pellets Grade 1" value={invDescription} onChange={(e) => setInvDescription(e.target.value)} required className="w-full bg-white border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Inventory Type</label>
                <select value={invType} onChange={(e) => setInvType(e.target.value as any)} className="w-full bg-white border p-2 rounded-lg">
                  <option value="Equipment">Equipment</option>
                  <option value="Feed">Feed</option>
                  <option value="Medication">Medication</option>
                  <option value="Fish">Fish</option>
                  <option value="Consumables">Consumables</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Brand</label>
                <input type="text" placeholder="e.g. Skretting" value={invBrand} onChange={(e) => setInvBrand(e.target.value)} className="w-full bg-white border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Photo URL</label>
                <input type="text" placeholder="https://example.com/item.jpg" value={invPhoto} onChange={(e) => setInvPhoto(e.target.value)} className="w-full bg-white border p-2 rounded-lg" />
              </div>
            </div>
          </div>

          {/* SECTION 2: Dimensions & Unit Costs */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center gap-1.5 uppercase text-sky-700">
              📊 2. Dimensions & Unit Costs
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Quantity</label>
                <input type="number" placeholder="150" value={invQuantity || ""} onChange={(e) => setInvQuantity(Number(e.target.value))} required className="w-full bg-white border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Unit of Measure</label>
                <input type="text" placeholder="e.g. Kg, Bags, Pcs" value={invUnitOfMeasure} onChange={(e) => setInvUnitOfMeasure(e.target.value)} required className="w-full bg-white border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Unit Cost (Ush)</label>
                <input type="number" placeholder="1500" value={invUnitCost || ""} onChange={(e) => setInvUnitCost(Number(e.target.value))} required className="w-full bg-white border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Reorder Level</label>
                <input type="number" placeholder="10" value={invReorderLevel || ""} onChange={(e) => setInvReorderLevel(Number(e.target.value))} required className="w-full bg-white border p-2 rounded-lg" />
              </div>
            </div>
          </div>

          {/* SECTION 3: Sourcing & Log Dates */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center gap-1.5 uppercase text-sky-700">
              📅 3. Sourcing & Log Dates
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Supplier</label>
                <input type="text" placeholder="Supplier Company" value={invSupplier} onChange={(e) => setInvSupplier(e.target.value)} className="w-full bg-white border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Received Date</label>
                <input type="date" value={invReceivedDate} onChange={(e) => setInvReceivedDate(e.target.value)} className="w-full bg-white border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Expiry Date</label>
                <input type="date" value={invExpiryDate} onChange={(e) => setInvExpiryDate(e.target.value)} className="w-full bg-white border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Last Updated</label>
                <input type="date" value={invLastUpdated} onChange={(e) => setInvLastUpdated(e.target.value)} className="w-full bg-white border p-2 rounded-lg" />
              </div>
            </div>
          </div>

          {/* SECTION 4: Feed Sourcing Specifics */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center gap-1.5 uppercase text-sky-700">
              🐟 4. Feed Sourcing Specifics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Fish Feed Name</label>
                <input type="text" placeholder="e.g. Tilapia Starter Micro" value={invFishFeedName} onChange={(e) => setInvFishFeedName(e.target.value)} className="w-full bg-white border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Batch Number</label>
                <input type="text" placeholder="e.g. B-993A" value={invBatchNumber} onChange={(e) => setInvBatchNumber(e.target.value)} className="w-full bg-white border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Quantity Received</label>
                <input type="number" placeholder="200" value={invQuantityReceived || ""} onChange={(e) => setInvQuantityReceived(Number(e.target.value))} className="w-full bg-white border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Date & Time Received</label>
                <input type="datetime-local" value={invDateTimeReceived} onChange={(e) => setInvDateTimeReceived(e.target.value)} className="w-full bg-white border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Unit Cost (per kg) - Ush</label>
                <input type="number" placeholder="3500" value={invUnitCostPerKg || ""} onChange={(e) => setInvUnitCostPerKg(Number(e.target.value))} className="w-full bg-white border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Reorder Level-Quantity-kg</label>
                <input type="number" placeholder="40" value={invReorderLevelQuantityKg || ""} onChange={(e) => setInvReorderLevelQuantityKg(Number(e.target.value))} className="w-full bg-white border p-2 rounded-lg" />
              </div>
            </div>
          </div>

          {/* SECTION 5: Log & Consumption Details */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center gap-1.5 uppercase text-sky-700">
              📝 5. Log & Consumption Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Daily-Log Date</label>
                <input type="date" value={invDailyLogDate} onChange={(e) => setInvDailyLogDate(e.target.value)} className="w-full bg-white border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Current Feed Quantity-kg</label>
                <input type="number" placeholder="250" value={invCurrentFeedQuantityKg || ""} onChange={(e) => setInvCurrentFeedQuantityKg(Number(e.target.value))} className="w-full bg-white border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Ingredients Used</label>
                <input type="text" placeholder="e.g. Fishmeal, Soy, Wheat gluten" value={invIngredientsUsed} onChange={(e) => setInvIngredientsUsed(e.target.value)} className="w-full bg-white border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Cost per Ingredient (kg)</label>
                <input type="number" placeholder="1200" value={invCostPerIngredientKg || ""} onChange={(e) => setInvCostPerIngredientKg(Number(e.target.value))} className="w-full bg-white border p-2 rounded-lg" />
              </div>
            </div>
          </div>

          {/* SECTION 6: Feed Nutrient Analytics */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center gap-1.5 uppercase text-sky-700">
              🔬 6. Biological Feed Nutrient Analytics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Protein (%)</label>
                <input type="number" step="0.1" placeholder="45.5" value={invProteinPct || ""} onChange={(e) => setInvProteinPct(Number(e.target.value))} className="w-full bg-white border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Fat (%)</label>
                <input type="number" step="0.1" placeholder="12.0" value={invFatPct || ""} onChange={(e) => setInvFatPct(Number(e.target.value))} className="w-full bg-white border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Fiber (%)</label>
                <input type="number" step="0.1" placeholder="3.5" value={invFiberPct || ""} onChange={(e) => setInvFiberPct(Number(e.target.value))} className="w-full bg-white border p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Energy (kal/kg)</label>
                <input type="number" placeholder="3500" value={invEnergyKcal || ""} onChange={(e) => setInvEnergyKcal(Number(e.target.value))} className="w-full bg-white border p-2 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "feeds" && (
        <div className="col-span-1 sm:col-span-2 space-y-6">
          {/* Sub-tab selection inside form */}
          <div className="bg-slate-100 p-1.5 rounded-xl flex gap-1.5 max-w-md">
            <button
              type="button"
              onClick={() => setFeedFormType("consumption")}
              className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                feedFormType === "consumption"
                  ? "bg-white text-sky-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              🍲 1. Feed Consumption Per Pond
            </button>
            <button
              type="button"
              onClick={() => setFeedFormType("supplier")}
              className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                feedFormType === "supplier"
                  ? "bg-white text-sky-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              👥 2. Feed Suppliers Details
            </button>
          </div>

          {feedFormType === "consumption" ? (
            <div className="space-y-4 animate-fade-in">
              {/* SECTION 1: Fish Identity and Siting */}
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h4 className="font-extrabold text-slate-800 text-[11px] mb-3 uppercase text-sky-700 flex items-center gap-1">
                  🐟 Pond &amp; Stock Metadata
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Fish Tank/Pond ID</label>
                    <input type="text" placeholder="e.g. Tank-A1" value={consTankId} onChange={(e) => setConsTankId(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Fish Count</label>
                    <input type="number" placeholder="1500" value={consFishCount} onChange={(e) => setConsFishCount(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Fish Stage</label>
                    <input type="text" placeholder="e.g. Fingerling" value={consFishStage} onChange={(e) => setConsFishStage(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Fish Species</label>
                    <input type="text" placeholder="e.g. Tilapia" value={consFishSpecies} onChange={(e) => setConsFishSpecies(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Fish Stocking Date</label>
                    <input type="date" value={consStockingDate} onChange={(e) => setConsStockingDate(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Water Temperature (°C)</label>
                    <input type="number" step="0.1" placeholder="26.5" value={consWaterTemp} onChange={(e) => setConsWaterTemp(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Expected Harvest Date</label>
                    <input type="date" value={consHarvestDate} onChange={(e) => setConsHarvestDate(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Feed Type</label>
                    <input type="text" placeholder="e.g. Regular Pellets" value={consFeedType} onChange={(e) => setConsFeedType(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Cycle Interval and Consumption Quantities */}
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h4 className="font-extrabold text-slate-800 text-[11px] mb-3 uppercase text-sky-700 flex items-center gap-1">
                  🍲 Feeding Volume &amp; Durations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Start Date</label>
                    <input type="date" value={consStartDate} onChange={(e) => setConsStartDate(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">End Date</label>
                    <input type="date" value={consEndDate} onChange={(e) => setConsEndDate(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Feeding Instructions</label>
                    <input type="text" placeholder="Distribute evenly..." value={consInstructions} onChange={(e) => setConsInstructions(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Feed per Fish (g/fish)</label>
                    <input type="text" placeholder="e.g. 0.15" value={consFeedPerFish} onChange={(e) => setConsFeedPerFish(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Feeding Frequency / Day</label>
                    <input type="number" placeholder="3" value={consFrequency} onChange={(e) => setConsFrequency(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Total Feed Used / Day (kg)</label>
                    <input type="number" step="0.01" placeholder="2.5" value={consTotalFeedUsed} onChange={(e) => setConsTotalFeedUsed(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Feed Quantity / Cycle (kg)</label>
                    <input type="number" placeholder="75" value={consFeedQtyPerCycle} onChange={(e) => setConsFeedQtyPerCycle(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Traceability Interface Tag</label>
                    <input type="text" placeholder="Trace ID" value={consTraceabilityInterface} onChange={(e) => setConsTraceabilityInterface(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Biological Performance & Growth Metrics */}
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h4 className="font-extrabold text-slate-800 text-[11px] mb-3 uppercase text-sky-700 flex items-center gap-1">
                  📈 Biological Conversion &amp; Growth Metrics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Biomass Gain (kg)</label>
                    <input type="number" placeholder="45" value={consBiomassGain} onChange={(e) => setConsBiomassGain(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">FCR (Total Feed / Biomass Gain)</label>
                    <input type="text" placeholder="1.35" value={consFcr} onChange={(e) => setConsFcr(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Growth Rate (%)</label>
                    <input type="number" step="0.1" placeholder="2.5" value={consGrowthRate} onChange={(e) => setConsGrowthRate(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Feed Wastage Notes</label>
                    <input type="text" placeholder="e.g. Negligible" value={consWastageNotes} onChange={(e) => setConsWastageNotes(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">General Notes &amp; Observations</label>
                    <input type="text" placeholder="Healthy schooling..." value={consNotes} onChange={(e) => setConsNotes(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Feed Wastage Amount/Estimate</label>
                    <input type="text" placeholder="e.g. Less than 2%" value={consWastage} onChange={(e) => setConsWastage(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* SECTION 4: AI & Analytical Synthetics */}
              <div className="bg-cyan-50/20 p-4 rounded-xl border border-cyan-200 space-y-3">
                <h4 className="font-extrabold text-cyan-800 text-[11px] uppercase flex items-center gap-1">
                  ✨ 4. Automated Recommendations &amp; AI Synthetics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[9px] text-cyan-700 font-bold mb-1">AI Recommendations</label>
                    <input type="text" value={consAiRecommendations} onChange={(e) => setConsAiRecommendations(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-cyan-900 border-cyan-200" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-cyan-700 font-bold mb-1">AI Real-time Feed Adjustment</label>
                    <input type="text" value={consAiFeedAdjustment} onChange={(e) => setConsAiFeedAdjustment(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-cyan-900 border-cyan-200" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-cyan-700 font-bold mb-1">AI Feeding Schedule Advisory</label>
                    <input type="text" value={consAiFeedingSchedule} onChange={(e) => setConsAiFeedingSchedule(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-cyan-900 border-cyan-200" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-cyan-700 font-bold mb-1">AI Supplier Insights</label>
                    <input type="text" value={consAiSupplierInsights} onChange={(e) => setConsAiSupplierInsights(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-cyan-900 border-cyan-200" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-cyan-700 font-bold mb-1">AI Feed Consumption Summary</label>
                    <input type="text" value={consAiConsumptionSummary} onChange={(e) => setConsAiConsumptionSummary(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-cyan-900 border-cyan-200" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-cyan-700 font-bold mb-1">AI Ingredient Cost Breakdown</label>
                    <input type="text" value={consAiIngredientCost} onChange={(e) => setConsAiIngredientCost(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-cyan-900 border-cyan-200" />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[9px] text-cyan-700 font-bold mb-1">AI Nutritional Profile Summary</label>
                    <input type="text" value={consAiNutritionalProfile} onChange={(e) => setConsAiNutritionalProfile(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-cyan-900 border-cyan-200" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {/* FEED SUPPLIERS FORM DETAILS */}
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h4 className="font-extrabold text-slate-800 text-[11px] mb-3 uppercase text-sky-700 flex items-center gap-1">
                  👥 Feed Supplier Contact &amp; Business Profile
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Supplier Name</label>
                    <input type="text" placeholder="e.g. Kampala Premium Feeders" value={supSupplierName} onChange={(e) => setSupSupplierName(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Contact Person</label>
                    <input type="text" placeholder="e.g. Julius Ssekitoleko" value={supContactPerson} onChange={(e) => setSupContactPerson(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Company Name</label>
                    <input type="text" placeholder="e.g. Aller Aqua Ltd" value={supCompanyName} onChange={(e) => setSupCompanyName(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Phone Number</label>
                    <input type="text" placeholder="e.g. +256 702 123456" value={supPhone} onChange={(e) => setSupPhone(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Email Address</label>
                    <input type="email" placeholder="e.g. procurement@alleraqua.ug" value={supEmail} onChange={(e) => setSupEmail(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Physical Address</label>
                    <input type="text" placeholder="e.g. Plot 45, Jinja Road, Kampala" value={supAddress} onChange={(e) => setSupAddress(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Feed Ingredients Base Composition</label>
                    <input type="text" placeholder="e.g. Organic fishmeal extract, cereal grains, minerals premix" value={supFeedIngredients} onChange={(e) => setSupFeedIngredients(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[9px] text-slate-500 font-bold mb-1">Supplier Notes / General Memorandum</label>
                    <textarea rows={2} placeholder="E.g. Certified organic supplier, bulk carrier discounts of 10% after 5 tons." value={supNotes} onChange={(e) => setSupNotes(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* AI Hub for Supplier */}
              <div className="bg-cyan-50/20 p-4 rounded-xl border border-cyan-200">
                <h4 className="font-extrabold text-cyan-800 text-[11px] mb-2 uppercase flex items-center gap-1">
                  ✨ Supplier Automated Insights (AI)
                </h4>
                <div>
                  <label className="block text-[9px] text-cyan-700 font-bold mb-1">Automated Insights (AI)</label>
                  <input type="text" value={supAiInsights} onChange={(e) => setSupAiInsights(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-cyan-900 border-cyan-200" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "procurement" && (
        <>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">Supplier Name</label>
            <input type="text" value={fName} onChange={(e) => setFName(e.target.value)} placeholder="Skretting Feeds" required className="w-full bg-white border p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">Invoice Number</label>
            <input type="text" value={fNum} onChange={(e) => setFNum(e.target.value)} placeholder="INV-2026-101" required className="w-full bg-white border p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">Amount Owed (Ush)</label>
            <input type="number" value={fAmount} onChange={(e) => setFAmount(e.target.value)} required className="w-full bg-white border p-2 rounded-lg" />
          </div>
        </>
      )}

      {tab === "water" && (
        <div className="col-span-1 sm:col-span-2 space-y-4 text-left">
          {/* Section 1: Context & Siting */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-extrabold text-slate-800 text-[11px] mb-3 uppercase text-sky-700">
              🌊 Tank &amp; Biological Context
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-[9px] text-slate-500 font-bold mb-1">Water Tank/Pond ID</label>
                <input id="wq-input-tank-id" type="text" value={wqTankId} onChange={(e) => setWqTankId(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[9px] text-slate-500 font-bold mb-1">Tank/Pond Type</label>
                <input id="wq-input-tank-type" type="text" value={wqTankType} onChange={(e) => setWqTankType(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[9px] text-slate-500 font-bold mb-1">Fish Species</label>
                <input id="wq-input-species" type="text" value={wqSpecies} onChange={(e) => setWqSpecies(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[9px] text-slate-500 font-bold mb-1">Fish Stage</label>
                <input id="wq-input-stage" type="text" value={wqStage} onChange={(e) => setWqStage(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[9px] text-slate-500 font-bold mb-1">Tank/Pond Location</label>
                <input id="wq-input-location" type="text" placeholder="e.g. North Wing Unit A" value={wqLocation} onChange={(e) => setWqLocation(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
            </div>
          </div>

          {/* Section 2: Chemical & Physical Parameters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-extrabold text-slate-800 text-[11px] mb-3 uppercase text-sky-700">
              🧪 Laboratory Chemical &amp; Physical Parameters
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-[9px] text-slate-500 font-bold mb-1">Test Date</label>
                <input id="wq-input-test-date" type="date" value={wqTestDate} onChange={(e) => setWqTestDate(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[9px] text-slate-500 font-bold mb-1">pH</label>
                <input id="wq-input-ph" type="number" step="0.1" value={wqPh} onChange={(e) => setWqPh(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[9px] text-slate-500 font-bold mb-1">D.O. (mg/L)</label>
                <input id="wq-input-do" type="number" step="0.1" value={wqDo} onChange={(e) => setWqDo(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[9px] text-slate-500 font-bold mb-1">Ammonia (mg/L)</label>
                <input id="wq-input-ammonia" type="number" step="0.01" value={wqAmmonia} onChange={(e) => setWqAmmonia(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[9px] text-slate-500 font-bold mb-1">Nitrite (mg/L)</label>
                <input id="wq-input-nitrite" type="number" step="0.01" value={wqNitrite} onChange={(e) => setWqNitrite(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>

              <div>
                <label className="block text-[9px] text-slate-500 font-bold mb-1">Nitrate (mg/L)</label>
                <input id="wq-input-nitrate" type="number" step="0.1" value={wqNitrate} onChange={(e) => setWqNitrate(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[9px] text-slate-500 font-bold mb-1">Temperature (°C)</label>
                <input id="wq-input-temp" type="number" step="0.1" value={wqTemp} onChange={(e) => setWqTemp(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[9px] text-slate-500 font-bold mb-1">Hardness (mg/L)</label>
                <input id="wq-input-hardness" type="number" value={wqHardness} onChange={(e) => setWqHardness(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[9px] text-slate-500 font-bold mb-1">Alkalinity (mg/L)</label>
                <input id="wq-input-alkalinity" type="number" value={wqAlkalinity} onChange={(e) => setWqAlkalinity(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[9px] text-slate-500 font-bold mb-1">Chlorine (mg/L)</label>
                <input id="wq-input-chlorine" type="number" step="0.01" value={wqChlorine} onChange={(e) => setWqChlorine(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
            </div>
          </div>

          {/* Section 3: Turbidity, Remarks & Testing Bio */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-extrabold text-slate-800 text-[11px] mb-3 uppercase text-sky-700">
              🔍 Qualitative &amp; Operator Identification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[9px] text-slate-500 font-bold mb-1">Turbidity</label>
                <input id="wq-input-turbidity" type="text" placeholder="e.g. Low (25 NTU)" value={wqTurbidity} onChange={(e) => setWqTurbidity(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[9px] text-slate-500 font-bold mb-1">Tested By</label>
                <input id="wq-input-tested-by" type="text" value={wqTestedBy} onChange={(e) => setWqTestedBy(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[9px] text-slate-500 font-bold mb-1">Immediate Actions Recommended</label>
                <input id="wq-input-immediate-actions" type="text" value={wqImmediateActions} onChange={(e) => setWqImmediateActions(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-[9px] text-slate-500 font-bold mb-1">Remarks &amp; Analytical Notes</label>
                <textarea id="wq-input-remarks" rows={2} value={wqRemarks} onChange={(e) => setWqRemarks(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
            </div>
          </div>

          {/* Section 4: AI & Synthesized Diagnosis */}
          <div className="bg-cyan-50/25 p-4 rounded-xl border border-cyan-150">
            <h4 className="font-extrabold text-cyan-800 text-[11px] mb-3 uppercase flex items-center gap-1">
              ✨ Automated Diagnostic Reports (AI)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] text-cyan-700 font-bold mb-1">Recommended Action (AI)</label>
                <input id="wq-input-ai-recommended" type="text" value={wqAiRecommendedAction} onChange={(e) => setWqAiRecommendedAction(e.target.value)} className="w-full bg-white border border-cyan-200 p-1.5 rounded-lg text-xs text-cyan-950" />
              </div>
              <div>
                <label className="block text-[9px] text-cyan-700 font-bold mb-1">Synthesized Risk Level (AI)</label>
                <input id="wq-input-ai-risk" type="text" value={wqAiRiskLevel} onChange={(e) => setWqAiRiskLevel(e.target.value)} className="w-full bg-white border border-cyan-200 p-1.5 rounded-lg text-xs text-cyan-950" />
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "staff" && (
        <>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">Biologist/Operator Fullname</label>
            <input type="text" value={fName} onChange={(e) => setFName(e.target.value)} placeholder="Audrey Mukasa" required className="w-full bg-white border p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">Logged Physical Execution details</label>
            <input type="text" value={fNum} onChange={(e) => setFNum(e.target.value)} placeholder="Routine spawning tank biological validation" required className="w-full bg-white border p-2 rounded-lg" />
          </div>
        </>
      )}

      {tab === "broodstock" && (
        <>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">Fish Farm Broodstock Tag ID</label>
            <input type="text" value={spawningTank} onChange={(e) => setSpawningTank(e.target.value)} placeholder="AQ-BCG-F03" required className="w-full bg-white border p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">Weight (Grams)</label>
            <input type="number" value={fAmount} onChange={(e) => setFAmount(e.target.value)} placeholder="800" required className="w-full bg-white border p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">Species</label>
            <select value={spawnSpecies} onChange={(e) => setSpawnSpecies(e.target.value)} className="w-full bg-white border p-2 rounded-lg">
              <option value="Clarius Gariepinus">Catfish (Clarias)</option>
              <option value="Tilapia">Tilapia</option>
              <option value="Mirror Carp">Mirror Carp</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">Origin Source Provider</label>
            <input type="text" value={fName} onChange={(e) => setFName(e.target.value)} placeholder="Agri2rist Breeder Hub" required className="w-full bg-white border p-2 rounded-lg" />
          </div>
        </>
      )}

      {tab === "spawning" && (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-6 text-left">
          
          {/* SECTION A: BROODSTOCK BIO-IDENTITY */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-black uppercase text-sky-950 tracking-wider flex items-center gap-1.5 border-b pb-2">
              🔬 A. Broodstock Bio-Identity &amp; Replacements
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Tank/Pond Name/ID</label>
                <input type="text" value={spawningTank} onChange={(e) => setSpawningTank(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 focus:ring-1 focus:ring-sky-500 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Broodstock Origin</label>
                <input type="text" value={hmBroodstockOrigin} onChange={(e) => setHmBroodstockOrigin(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Broodstock Species</label>
                <input type="text" value={spawnSpecies} onChange={(e) => setSpawnSpecies(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Broodstock Sex</label>
                <select value={hmBroodstockSex} onChange={(e) => setHmBroodstockSex(e.target.value)} className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold">
                  <option value="Mixed Breeding Pool">Mixed Breeding Pool</option>
                  <option value="Female Only Selection">Female Only Selection</option>
                  <option value="Male Only Selection">Male Only Selection</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Broodstock Weight (g)</label>
                <input type="number" value={hmBroodstockWeightG} onChange={(e) => setHmBroodstockWeightG(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg font-mono text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Broodstock Mortality</label>
                <input type="number" value={hmBroodstockMortality} onChange={(e) => setHmBroodstockMortality(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg font-mono text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Broodstock Replacement</label>
                <input type="number" value={hmBroodstockReplacement} onChange={(e) => setHmBroodstockReplacement(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg font-mono text-slate-800 font-semibold" />
              </div>
            </div>
          </div>

          {/* SECTION B: HORMONE & SPAWNING DETAILS */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-black uppercase text-indigo-950 tracking-wider flex items-center gap-1.5 border-b pb-2">
              🧪 B. Hormone Induction &amp; Spawning Cycle
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Hormone Administration date/time</label>
                <input type="datetime-local" value={hmHormoneTime} onChange={(e) => setHmHormoneTime(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Hormone Injected</label>
                <select value={spawnHormone} onChange={(e) => setSpawnHormone(e.target.value)} className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold">
                  <option value="Ovaprim">Ovaprim Premium</option>
                  <option value="PG (Pituitary Gland)">PG Extract</option>
                  <option value="LHRH-a">LHRH-a Peptide</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Hormone Dosage ml/kg</label>
                <input type="text" value={spawnDose} onChange={(e) => setSpawnDose(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Hormone Total Dose (ml)</label>
                <input type="text" value={hmHormoneTotalDoseMl} onChange={(e) => setHmHormoneTotalDoseMl(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Tranquilizer Tank ID</label>
                <input type="text" value={hmTranquilizerTank} onChange={(e) => setHmTranquilizerTank(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold font-mono" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Spawning Schedule ID / Name</label>
                <input type="text" value={hmSpawningSchedule} onChange={(e) => setHmSpawningSchedule(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Spawning Date &amp; Time</label>
                <input type="datetime-local" value={hmSpawningDate} onChange={(e) => setHmSpawningDate(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Spawning Tank ID</label>
                <input type="text" value={spawningTank} onChange={(e) => setSpawningTank(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold font-mono" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Spawning Start-Time</label>
                <input type="text" value={hmSpawningStartTime} onChange={(e) => setHmSpawningStartTime(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Spawning End-Time</label>
                <input type="text" value={hmSpawningEndTime} onChange={(e) => setHmSpawningEndTime(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Stripping Time</label>
                <input type="text" value={hmStrippingTime} onChange={(e) => setHmStrippingTime(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold" />
              </div>
            </div>
          </div>

          {/* SECTION C: EGG, INCUBATION & STAFF REGISTRATION */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-black uppercase text-amber-950 tracking-wider flex items-center gap-1.5 border-b pb-2">
              🍳 C. Egg Treatment, Incubation Yield &amp; Staff Operations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Eggs Appearance, color</label>
                <input type="text" value={hmEggAppearance} onChange={(e) => setHmEggAppearance(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Egg Treatment Chemicals, used</label>
                <input type="text" value={hmEggChemicals} onChange={(e) => setHmEggChemicals(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Egg Weight (g)</label>
                <input type="number" value={hmEggWeightG} onChange={(e) => setHmEggWeightG(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg font-mono text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Egg Quantity</label>
                <input type="number" value={hmEggsQuantity} onChange={(e) => setHmEggsQuantity(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg font-mono text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Incubation Tank (25-28°C)</label>
                <input type="text" value={hmIncubationTank} onChange={(e) => setHmIncubationTank(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold font-mono" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Incubation Tank Status</label>
                <input type="text" value={hmIncubationTankStatus} onChange={(e) => setHmIncubationTankStatus(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Incubation Start Date/Time</label>
                <input type="datetime-local" value={hmIncubationStartDate} onChange={(e) => setHmIncubationStartDate(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Incubation End Date/Time</label>
                <input type="datetime-local" value={hmIncubationEndDate} onChange={(e) => setHmIncubationEndDate(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Hatched Fry Yield</label>
                <input type="number" value={hmHatchedFry} onChange={(e) => setHmHatchedFry(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg font-mono text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Stock Type</label>
                <input type="text" value={hmStockType} onChange={(e) => setHmStockType(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Incubator / Fry Mortality</label>
                <input type="number" value={hmMortality} onChange={(e) => setHmMortality(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg font-mono text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">% Survival Rate (%)</label>
                <input type="number" value={hmSurvivalRatePct} onChange={(e) => setHmSurvivalRatePct(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg font-mono text-slate-800 font-semibold" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Staff Activities Description (Dropdown)</label>
                <select value={hmActivityDescription} onChange={(e) => setHmActivityDescription(e.target.value)} className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-850 font-bold">
                  <option value="i. Health Check">i. Health Check</option>
                  <option value="ii. Egg Collection">ii. Egg Collection</option>
                  <option value="iii. Tank/Pond Cleaning">iii. Tank/Pond Cleaning</option>
                  <option value="iv. Sperm Collection">iv. Sperm Collection</option>
                  <option value="v. Record Keeping">v. Record Keeping</option>
                  <option value="vi. Water Quality Analysis">vi. Water Quality Analysis</option>
                  <option value="vii. Batch Processing">vii. Batch Processing</option>
                  <option value="viii. Transfer of fry to Nursery Fry Tanks">viii. Transfer of fry to Nursery Fry Tanks</option>
                  <option value="ix. Transfer of fingerlings to Grow-out Ponds/Tanks">ix. Transfer of fingerlings to Grow-out Ponds/Tanks</option>
                  <option value="x. Transfer of fingerlings to Customers">x. Transfer of fingerlings to Customers</option>
                  <option value="xi. Transfer of fry to customers">xi. Transfer of fry to customers</option>
                  <option value="xii. Counting and Packaging of fry/fingerlings">xii. Counting and Packaging of fry/fingerlings</option>
                  <option value="xiii. Counting, Weighing Table size fish">xiii. Counting, Weighing Table size fish</option>
                  <option value="xiv. Disinfecting Eggs">xiv. Disinfecting Eggs</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Quality Assessment Rating</label>
                <input type="text" value={hmQualityAssessment} onChange={(e) => setHmQualityAssessment(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Apparatus Used</label>
                <input type="text" value={hmApparatusUsed} onChange={(e) => setHmApparatusUsed(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Staff Name</label>
                <input type="text" value={hmStaffName} onChange={(e) => setHmStaffName(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Activity Date &amp; Time</label>
                <input type="datetime-local" value={hmActivityDate} onChange={(e) => setHmActivityDate(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Activity End Time</label>
                <input type="datetime-local" value={hmEndTime} onChange={(e) => setHmEndTime(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Duration of Activity (Minutes)</label>
                <input type="number" value={hmDurationMinutes} onChange={(e) => setHmDurationMinutes(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg font-mono text-slate-800 font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Batch Management ID</label>
                <input type="text" value={hmBatchManagement} onChange={(e) => setHmBatchManagement(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold font-mono" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Last Updated Date</label>
                <input type="date" value={hmLastUpdated} onChange={(e) => setHmLastUpdated(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-semibold font-mono" />
              </div>
            </div>
          </div>

          {/* SECTION D: AI BIO-MONITORING DECISIONS */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-black uppercase text-emerald-950 tracking-wider flex items-center gap-1.5 border-b pb-2">
              🤖 D. Artificial Intelligence Monitoring Diagnostics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Monitoring Status (AI)</label>
                <input type="text" value={hmAiMonitoringStatus} onChange={(e) => setHmAiMonitoringStatus(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-emerald-800 font-bold" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">AI Recommendations for Tests Adjustments</label>
                <input type="text" value={hmAiTestAdjustments} onChange={(e) => setHmAiTestAdjustments(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">AI Broodstock Adjustments</label>
                <input type="text" value={hmAiBroodstockScheduleAdjustments} onChange={(e) => setHmAiBroodstockScheduleAdjustments(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800" />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Notes / Laboratory Special Remarks</label>
                <textarea rows={2} value={hmNotes} onChange={(e) => setHmNotes(e.target.value)} required className="w-full bg-slate-50/50 border p-2 rounded-lg text-slate-800 font-medium" />
              </div>
            </div>
          </div>

        </div>
      )}

      {tab === "stripping" && (
        <>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">Broodstock Tag ID</label>
            <input type="text" value={spawningTank} onChange={(e) => setSpawningTank(e.target.value)} required className="w-full bg-white border p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">Stripped Egg Weight (Grams)</label>
            <input type="text" value={stripEggWeight} onChange={(e) => setStripEggWeight(e.target.value)} required className="w-full bg-white border p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">Egg Appearance Description</label>
            <input type="text" value={fName} onChange={(e) => setFName(e.target.value)} placeholder="Amber, Translucent and Non-Opaque" required className="w-full bg-white border p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">Designated Incubation Station</label>
            <input type="text" value={incubationTankName} onChange={(e) => setIncubationTankName(e.target.value)} required className="w-full bg-white border p-2 rounded-lg" />
          </div>
        </>
      )}

      {tab === "incubation" && (
        <>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">Incubator Station ID</label>
            <input type="text" value={incubationTankName} onChange={(e) => setIncubationTankName(e.target.value)} required className="w-full bg-white border p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">Spawning Class Tank Ref</label>
            <input type="text" value={spawningTank} onChange={(e) => setSpawningTank(e.target.value)} required className="w-full bg-white border p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">Supervisor Biologist</label>
            <input type="text" value={fName} onChange={(e) => setFName(e.target.value)} placeholder="George Ssempa" required className="w-full bg-white border p-2 rounded-lg" />
          </div>
        </>
      )}

      {(tab === "health" || tab === "healthMgmt") && (
        <div className="col-span-full space-y-4 font-sans text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-sky-900 mb-3 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5">
              🧬 Biometric Identity &amp; General Audit
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Record Name / Title</label>
                <input type="text" value={hlRecordName} onChange={(e) => setHlRecordName(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Tank/Cage/Pond Location</label>
                <input type="text" value={hlTankLocation} onChange={(e) => setHlTankLocation(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Fish Species Stocked</label>
                <input type="text" value={hlSpecies} onChange={(e) => setHlSpecies(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Fish Growth Stage</label>
                <input type="text" value={hlStage} onChange={(e) => setHlStage(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Observation Date &amp; Time</label>
                <input type="datetime-local" value={hlObservationDate} onChange={(e) => setHlObservationDate(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs font-mono" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Created By / Auditor Name</label>
                <input type="text" value={hlCreatedBy} onChange={(e) => setHlCreatedBy(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-sky-900 mb-3 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5">
              🦠 Pathology, Symptoms &amp; Disease Diagnosis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Disease Diagnosed</label>
                <input type="text" value={hlDiseaseDiagnosed} onChange={(e) => setHlDiseaseDiagnosed(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Observed Stock Symptoms</label>
                <input type="text" value={hlSymptoms} onChange={(e) => setHlSymptoms(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Daily Mortality Count</label>
                <input type="number" value={hlMortalityCount} onChange={(e) => setHlMortalityCount(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs font-mono" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Estimated Mortality Rate</label>
                <input type="text" value={hlMortalityRate} onChange={(e) => setHlMortalityRate(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Mortality Cause (If Known)</label>
                <input type="text" value={hlMortalityCause} onChange={(e) => setHlMortalityCause(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Stock Health Status Category</label>
                <select value={hlHealthStatus} onChange={(e) => setHlHealthStatus(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-xs">
                  <option value="Healthy">Healthy (Optimal Stability)</option>
                  <option value="Under Treatment">Under Treatment (Infected but remedial state)</option>
                  <option value="Diseased">Diseased (Active Outbreak Alert)</option>
                  <option value="Quarantined">Quarantined (Symmetric Holding state)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-sky-900 mb-3 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5">
              🛡️ Biosecurity Protocol &amp; Treatment Administered (Prescriptions)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Biosecurity Protocol Status</label>
                <input type="text" value={hlBiosecurityStatus} onChange={(e) => setHlBiosecurityStatus(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Biosecurity Compliance Checklist Notes</label>
                <input type="text" value={hlComplianceChecklist} onChange={(e) => setHlComplianceChecklist(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Treatment Prescribed / Rx Details</label>
                <input type="text" value={hlTreatmentPrescribed} onChange={(e) => setHlTreatmentPrescribed(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Treatment Treatment Status</label>
                <select value={hlTreatmentStatus} onChange={(e) => setHlTreatmentStatus(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-xs">
                  <option value="Routine">Routine Monitoring</option>
                  <option value="Active Administered">Active Administered</option>
                  <option value="Completed Successful">Completed Successful</option>
                  <option value="Flagged Therapy">Flagged Therapy</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Treatment Start Date &amp; Time</label>
                <input type="datetime-local" value={hlTreatmentStartDate} onChange={(e) => setHlTreatmentStartDate(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-xs font-mono" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Treatment End Date &amp; Time</label>
                <input type="datetime-local" value={hlTreatmentEndDate} onChange={(e) => setHlTreatmentEndDate(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-xs font-mono" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Disease Document Links</label>
                <input type="text" placeholder="https://example.com/biosecurity-audit.pdf" value={hlDiseaseDocument} onChange={(e) => setHlDiseaseDocument(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Relevant Images Attachments</label>
                <input type="text" placeholder="https://example.com/symptom.jpg" value={hlAttachments} onChange={(e) => setHlAttachments(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-sky-900 mb-3 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5">
              🌎 Environmental Impact, Water Mappings &amp; Links
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Environmental Impact Description</label>
                <input type="text" value={hlEnvironmentalImpact} onChange={(e) => setHlEnvironmentalImpact(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Environmental Impact Level</label>
                <select value={hlEnvironmentalImpactLevel} onChange={(e) => setHlEnvironmentalImpactLevel(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-xs font-bold text-amber-700">
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Linked Water Quality Test ID</label>
                <input type="text" placeholder="wq-1" value={hlWaterQualityLink} onChange={(e) => setHlWaterQualityLink(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-xs font-mono" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Stock Inventory SKU Link</label>
                <input type="text" placeholder="inv-stock-1" value={hlStockInventoryLink} onChange={(e) => setHlStockInventoryLink(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-xs font-mono" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Linked Appt (Biosecurity Audit)</label>
                <input type="text" placeholder="app-1" value={hlLinkedAppointment} onChange={(e) => setHlLinkedAppointment(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-xs font-mono" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Related Invoice Financial Link</label>
                <input type="text" placeholder="inv-5" value={hlRelatedFinancialLink} onChange={(e) => setHlRelatedFinancialLink(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-xs font-mono" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Biosecurity &amp; Health Notes</label>
                <textarea rows={2} value={hlNotes} onChange={(e) => setHlNotes(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-xs resize-none" />
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "harvestMgmt" && (
        <div className="col-span-full space-y-4 font-sans text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-sky-900 mb-3 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5">
              🏷️ Harvest Source, Stage &amp; Timeline Identifiers
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Pond/Tank/Cage Source Name</label>
                <input type="text" value={hvPondName} onChange={(e) => setHvPondName(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Tank/Pond/Cage Location Area</label>
                <input type="text" value={hvLocation} onChange={(e) => setHvLocation(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Fish Species Stocked</label>
                <input type="text" value={hvSpecies} onChange={(e) => setHvSpecies(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Fish Growth Stage</label>
                <input type="text" value={hvStage} onChange={(e) => setHvStage(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Harvest Batch Name/Code</label>
                <input type="text" value={hvBatchName} onChange={(e) => setHvBatchName(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs text-sky-850 font-black" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Harvest Execution Date &amp; Time</label>
                <input type="datetime-local" value={hvDateTime} onChange={(e) => setHvDateTime(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs font-mono" />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-sky-900 mb-3 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5">
              🔧 Crew Operations, Planning &amp; Equipment Logs
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Equipment Used Log</label>
                <input type="text" value={hvEquipmentLog} onChange={(e) => setHvEquipmentLog(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Next Scheduled Harvest Date</label>
                <input type="date" value={hvNextHarvestDate} onChange={(e) => setHvNextHarvestDate(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-xs font-mono" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Scheduled Harvest Crew Name</label>
                <input type="text" value={hvScheduledCrew} onChange={(e) => setHvScheduledCrew(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Crew Planning Notes &amp; Logistics Actions</label>
                <input type="text" value={hvCrewNotes} onChange={(e) => setHvCrewNotes(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-sky-900 mb-3 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5">
              ⚖️ Weighing Yield Indices &amp; Size-Based Grading
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Estimated Biomass (Kg)</label>
                <input type="number" value={hvEstBiomass} onChange={(e) => setHvEstBiomass(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs font-mono" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Actual Yield Logged (Kg)</label>
                <input type="number" value={hvActualYield} onChange={(e) => setHvActualYield(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs font-mono" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Post-Harvest Cleaning Status</label>
                <input type="text" value={hvPostHarvestCleaning} onChange={(e) => setHvPostHarvestCleaning(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Size-Based Grading Category</label>
                <input type="text" value={hvGradingCategory} onChange={(e) => setHvGradingCategory(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Waste / Scrap Disposal Method</label>
                <input type="text" value={hvWasteDisposal} onChange={(e) => setHvWasteDisposal(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Waste Weight (Kg)</label>
                <input type="number" value={hvWasteQty} onChange={(e) => setHvWasteQty(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs font-mono" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Fish Quality Issues Notes</label>
                <input type="text" value={hvQualityIssues} onChange={(e) => setHvQualityIssues(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-sky-900 mb-3 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5">
              ❄️ Cold Chain Integrity &amp; Distr. Transport Logistics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1 flex items-center gap-1">
                  <input type="checkbox" checked={hvColdChainMaintained} onChange={(e) => setHvColdChainMaintained(e.target.checked)} className="rounded" />
                  Cold Chain Maintained
                </label>
                <div className="mt-1 text-[10px] text-slate-400 font-medium font-sans">Checked indicates active thermal control.</div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Sorting &amp; Packing Details</label>
                <input type="text" value={hvPackagingDetails} onChange={(e) => setHvPackagingDetails(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Batch Labels Generated</label>
                <input type="text" value={hvBatchLabels} onChange={(e) => setHvBatchLabels(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs font-mono" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Transport Coordination Status</label>
                <input type="text" value={hvTransportStatus} onChange={(e) => setHvTransportStatus(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Transport Company</label>
                <input type="text" value={hvTransportCompany} onChange={(e) => setHvTransportCompany(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Transport Vehicle Plate</label>
                <input type="text" value={hvTransportVehicle} onChange={(e) => setHvTransportVehicle(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs text-sky-900 font-bold" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Transport Agent Details</label>
                <input type="text" value={hvTransportPerson} onChange={(e) => setHvTransportPerson(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Photos Capture URL</label>
                <input type="text" placeholder="https://example.com/harvest.jpg" value={hvPhoto} onChange={(e) => setHvPhoto(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Documents / Slip PDF Link</label>
                <input type="text" placeholder="https://example.com/scale.pdf" value={hvDocument} onChange={(e) => setHvDocument(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Record Created By</label>
                <input type="text" value={hvCreatedBy} onChange={(e) => setHvCreatedBy(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-sky-900 mb-3 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5">
              🔗 External Link References &amp; Quality Codes
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">recxpats Processing Link</label>
                <input type="text" value={hvProcessing} onChange={(e) => setHvProcessing(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg font-mono text-[11px]" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Traceability Model Link</label>
                <input type="text" value={hvTraceability} onChange={(e) => setHvTraceability(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg font-mono text-[11px]" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Farm/Fish Farm SKU Link</label>
                <input type="text" value={hvLinkedInventory} onChange={(e) => setHvLinkedInventory(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg font-mono text-[11px]" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Linked Health ID Reference</label>
                <input type="text" value={hvLinkedHealth} onChange={(e) => setHvLinkedHealth(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg font-mono text-[11px]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "maintenanceMgmt" && (
        <div className="col-span-full space-y-4 font-sans text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-sky-900 mb-3 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5">
              🛠️ Core Maintenance Description &amp; Routine Schedule
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Maintenance Record Name</label>
                <input type="text" value={mnRecordName} onChange={(e) => setMnRecordName(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Maintenance Type Category</label>
                <input type="text" value={mnType} onChange={(e) => setMnType(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Execution Date &amp; Time</label>
                <input type="datetime-local" value={mnDateTime} onChange={(e) => setMnDateTime(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs font-mono" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Routine Schedule Plan</label>
                <input type="text" value={mnRoutineSchedule} onChange={(e) => setMnRoutineSchedule(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Work Order Reference ID</label>
                <input type="text" value={mnWorkOrderRef} onChange={(e) => setMnWorkOrderRef(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs text-indigo-700 font-bold font-mono" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Crew Assigned / Technician</label>
                <input type="text" value={mnCrewAssigned} onChange={(e) => setMnCrewAssigned(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-sky-900 mb-3 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5">
              ⚠️ Pump, Aerator, Solar &amp; Power Generation Logs
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Pump Maintenance Tracking Log</label>
                <input type="text" value={mnPumpLog} onChange={(e) => setMnPumpLog(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Aerator Usage Log Metrics</label>
                <input type="text" value={mnAeratorLog} onChange={(e) => setMnAeratorLog(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Solar Panel &amp; Inverter Power Status Details</label>
                <input type="text" value={mnSolarLog} onChange={(e) => setMnSolarLog(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Backup Generator Status Log</label>
                <input type="text" value={mnGeneratorLog} onChange={(e) => setMnGeneratorLog(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Diesel/Generator Fuel Consumption (Liters)</label>
                <input type="number" value={mnFuelConsumption} onChange={(e) => setMnFuelConsumption(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs font-mono" />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="font-bold text-sky-900 mb-3 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5">
              🛡️ CCTV Security, Fences, Gates &amp; Cage Repair Mappings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Security Cameras Status Log</label>
                <input type="text" value={mnCameraLog} onChange={(e) => setMnCameraLog(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Security Cameras Maintenance Details</label>
                <input type="text" value={mnCameraMaintenance} onChange={(e) => setMnCameraMaintenance(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Electric Perimeter Fence &amp; Gate Log</label>
                <input type="text" value={mnFenceLog} onChange={(e) => setMnFenceLog(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Nets &amp; Cage Repair Log</label>
                <input type="text" value={mnNetRepair} onChange={(e) => setMnNetRepair(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Pond / Concrete Tank Sealing Repair Log</label>
                <input type="text" value={mnPondRepair} onChange={(e) => setMnPondRepair(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-sky-900 mb-3 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5">
              📁 Maintenance Checksheets, Diagnostics &amp; Audit Logs
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-3">
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Daily Maintenance Checklist Verified</label>
                <input type="text" value={mnChecklist} onChange={(e) => setMnChecklist(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs text-sky-950 font-bold" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Other Facility Maintenance Activities Conducted</label>
                <textarea rows={2} value={mnActivities} onChange={(e) => setMnActivities(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs resize-none" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Discovered Issues/Problems Description</label>
                <input type="text" value={mnIssues} onChange={(e) => setMnIssues(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Actions Taken Details</label>
                <input type="text" value={mnActionsTaken} onChange={(e) => setMnActionsTaken(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Reporting Officer / Person</label>
                <input type="text" value={mnPerson} onChange={(e) => setMnPerson(e.target.value)} required className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Before / After Images Upload Url</label>
                <input type="text" placeholder="https://example.com/repair.jpg" value={mnImages} onChange={(e) => setMnImages(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Linked Health Record ID</label>
                <input type="text" placeholder="health-1" value={mnLinkedHealth} onChange={(e) => setMnLinkedHealth(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-xs font-mono" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Extra Notes &amp; Safety Remarks</label>
                <textarea rows={2} value={mnNotes} onChange={(e) => setMnNotes(e.target.value)} className="w-full bg-white border p-1.5 rounded-lg text-xs resize-none" />
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "staffActivityMgmt" && (
        <div className="col-span-full space-y-4 font-sans text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-sky-900 mb-3 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5">
              📋 Staff Operations &amp; Labor Activity Log
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Specific Log Operations Category</label>
                <select value={stTaskType} onChange={(e) => setStTaskType(e.target.value)} className="w-full bg-white border p-2 rounded-lg text-xs font-bold text-sky-850">
                  <option value="Health Check">1. Health Check</option>
                  <option value="Egg Collection">2. Egg Collection</option>
                  <option value="Cleaning Tank/Pond">3. Cleaning Tank/Pond</option>
                  <option value="Sperm Collection">4. Sperm Collection</option>
                  <option value="Record Keeping">5. Record Keeping</option>
                  <option value="Water Quality Analysis">6. Water Quality Analysis</option>
                  <option value="Batch Processing">7. Batch Processing</option>
                  <option value="Transfer of fry to Nursery Fry Tanks">8. Transfer of fry to Nursery Fry Tanks</option>
                  <option value="Transfer of fingerlings to Grow-out Ponds/Tanks">9. Transfer of fingerlings to Grow-out Ponds/Tanks</option>
                  <option value="Transfer of fingerlings to Customers">10. Transfer of fingerlings to Customers</option>
                  <option value="Transfer of fry to customers">11. Transfer of fry to customers</option>
                  <option value="Counting and Packaging of fry/fingerlings">12. Counting and Packaging of fry/fingerlings</option>
                  <option value="Counting, Weighing Table size fish">13. Counting, Weighing Table size fish</option>
                  <option value="Disinfecting Eggs">14. Disinfecting Eggs</option>
                  <option value="Mowing Ponds environment">15. Mowing Ponds environment</option>
                  <option value="Constructing Earthen Ponds">16. Constructing Earthen Ponds</option>
                  <option value="Constructing Cages/Ponds/Tanks">17. Constructing Cages/Ponds/Tanks</option>
                  <option value="Ferlizing Ponds">18. Fertilizing Ponds</option>
                  <option value="Breeding Live fish feeds">19. Breeding Live fish feeds</option>
                  <option value="Harvesting table size fish">20. Harvesting table size fish</option>
                  <option value="Sampling fish">21. Sampling fish</option>
                  <option value="Meeting Customers">22. Meeting Customers</option>
                  <option value="Feeding fish">23. Feeding fish</option>
                  <option value="Washing Fish Farm">24. Washing Fish Farm</option>
                  <option value="Offloading and Packing feeds">25. Offloading and Packing feeds</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Staff Member Name</label>
                <input type="text" value={stStaffName} onChange={(e) => setStStaffName(e.target.value)} required className="w-full bg-white border p-2 rounded-lg text-xs" />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Staff Responsibility / Professional Role</label>
                <input type="text" value={stRole} onChange={(e) => setStRole(e.target.value)} required className="w-full bg-white border p-2 rounded-lg text-xs text-sky-900 font-semibold" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Logged Date &amp; Time</label>
                  <input type="datetime-local" value={stDate} onChange={(e) => setStDate(e.target.value)} required className="w-full bg-white border p-2 rounded-lg text-xs font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Duration logged (Minutes)</label>
                  <input type="number" value={stDuration} onChange={(e) => setStDuration(e.target.value)} required className="w-full bg-white border p-2 rounded-lg text-xs font-mono" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Activity Logged Details / Task Workflow Conducted</label>
                <textarea rows={2} value={stActivityDetails} onChange={(e) => setStActivityDetails(e.target.value)} required className="w-full bg-white border p-2 rounded-lg text-xs resize-none" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] text-slate-500 font-extrabold mb-1">Additional Notes</label>
                <textarea rows={2} value={stNotes} onChange={(e) => setStNotes(e.target.value)} className="w-full bg-white border p-2 rounded-lg text-xs resize-none" />
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "farm" && (
        <div className="col-span-full space-y-4">
          <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setFarmFormType("farm_setup")}
              className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${farmFormType === "farm_setup" ? "bg-white shadow-xs text-sky-950 font-black" : "text-slate-500 hover:text-slate-800"}`}
            >
              1. Farm Setup Registration
            </button>
            <button
              type="button"
              onClick={() => setFarmFormType("pond_registration")}
              className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${farmFormType === "pond_registration" ? "bg-white shadow-xs text-sky-950 font-black" : "text-slate-500 hover:text-slate-800"}`}
            >
              2. Pond, Tank or Cage Registration
            </button>
          </div>

          {farmFormType === "farm_setup" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Farm Name</label>
                <input type="text" placeholder="e.g. Luwero Fish Farm Hub" value={farmRegName} onChange={(e) => setFarmRegName(e.target.value)} required className="w-full bg-white border p-2 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">District / Region Location</label>
                <input type="text" placeholder="e.g. Luwero District, Central Uganda" value={farmRegLocation} onChange={(e) => setFarmRegLocation(e.target.value)} required className="w-full bg-white border p-2 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Size (Acreage)</label>
                <input type="number" step="0.1" placeholder="2.5" value={farmRegAcreage} onChange={(e) => setFarmRegAcreage(e.target.value)} required className="w-full bg-white border p-2 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Lead Farm Manager</label>
                <input type="text" placeholder="e.g. Denis Sserwadda" value={farmRegManagerName} onChange={(e) => setFarmRegManagerName(e.target.value)} required className="w-full bg-white border p-2 rounded-lg text-xs" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Infrastructure Description / Purpose</label>
                <textarea placeholder="Outline general production purposes, broodstock capacity limits, water source flow, bio-secure perimeter..." value={farmRegDescription} onChange={(e) => setFarmRegDescription(e.target.value)} className="w-full bg-white border p-2 rounded-lg text-xs h-16 resize-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Farm Layout Mapping Architecture</label>
                <select value={farmRegLayout} onChange={(e) => setFarmRegLayout(e.target.value)} className="w-full bg-white border p-2 rounded-lg text-xs">
                  <option value="linear_grow_out_4_phase">Linear Grow-out 4-Phase System</option>
                  <option value="concentric_circle_recirculating">Concentric Circular Recirculating System</option>
                  <option value="bento_modular_grid">Bento Modular Pond Grid Mappings</option>
                  <option value="estuary_cage_matrix">Estuary Floating Cage Matrix Layout</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Pond / Tank / Cage Name or ID</label>
                <input type="text" placeholder="e.g. Nursery Tank B-3" value={pondRegName} onChange={(e) => setPondRegName(e.target.value)} required className="w-full bg-white border p-2 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Infrastructure Type</label>
                <select value={pondRegType} onChange={(e) => setPondRegType(e.target.value)} className="w-full bg-white border p-2 rounded-lg text-xs">
                  <option value="Concrete Tank">Concrete Tank</option>
                  <option value="Earthen Pond">Earthen Pond</option>
                  <option value="HDPE Floating Cage">HDPE Floating Cage</option>
                  <option value="Glass Incubation Tray">Glass Incubation Tray</option>
                  <option value="Raceway Dynamic Channel">Raceway Dynamic Channel</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Belongs to Farm Setup</label>
                <select value={pondRegFarmId} onChange={(e) => setPondRegFarmId(e.target.value)} required className="w-full bg-white border p-2 rounded-lg text-xs">
                  <option value="">-- Choose registered target farm --</option>
                  {farms && farms.map(f => (
                    <option key={f.id} value={f.id || ""}>{f.name} ({f.location})</option>
                  ))}
                  {(!farms || farms.length === 0) && (
                    <option value="farm-1">Simulated Base Farm (Please register a real farm above first)</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Assigned Target Species</label>
                <input type="text" placeholder="e.g. Oreochromis Niloticus (Tilapia)" value={pondRegSpecies} onChange={(e) => setPondRegSpecies(e.target.value)} required className="w-full bg-white border p-2 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Water Capacity Volume (M³)</label>
                <input type="number" placeholder="200" value={pondRegVolume} onChange={(e) => setPondRegVolume(e.target.value)} required className="w-full bg-white border p-2 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Surface Area Dimension (M²)</label>
                <input type="number" placeholder="85" value={pondRegSize} onChange={(e) => setPondRegSize(e.target.value)} required className="w-full bg-white border p-2 rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1">Physical Sector / Location Area</label>
                <input type="text" placeholder="e.g. Sector Blue Zone North" value={pondRegSector} onChange={(e) => setPondRegSector(e.target.value)} required className="w-full bg-white border p-2 rounded-lg text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">GPS: Latitude</label>
                  <input type="text" placeholder="e.g. 0.3476" value={pondRegLatitude} onChange={(e) => setPondRegLatitude(e.target.value)} required className="w-full bg-white border p-2 rounded-lg text-xs font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">GPS: Longitude</label>
                  <input type="text" placeholder="e.g. 32.5825" value={pondRegLongitude} onChange={(e) => setPondRegLongitude(e.target.value)} required className="w-full bg-white border p-2 rounded-lg text-xs font-mono" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "trace" && (
        <>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">Tracing Lot Item Name</label>
            <input type="text" placeholder="Catfish Fingerling Pack - URA 102" value={traceName} onChange={(e) => setTraceName(e.target.value)} required className="w-full bg-white border p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">Tracking Code Signature</label>
            <input type="text" value={lotCode} readOnly className="w-full bg-slate-100 border p-2 rounded-lg font-mono text-[10px] font-bold" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-bold mb-1">Destination Custody Details</label>
            <input type="text" placeholder="E.g. Kampala recxpats Logistics CO" value={fName} onChange={(e) => setFName(e.target.value)} required className="w-full bg-white border p-2 rounded-lg" />
          </div>
        </>
      )}

      <div className="sm:col-span-2 flex justify-end gap-2 pt-3 border-t">
        <button type="button" onClick={onClose} className="px-4 py-1.5 bg-slate-100 hover:bg-slate-205 text-slate-700 font-semibold rounded-lg">
          Cancel
        </button>
        <button type="submit" className="px-4.5 py-1.5 bg-cyan-500 hover:bg-cyan-600 font-bold text-sky-950 rounded-lg">
          Validate & Submit Log
        </button>
      </div>
    </form>
  );
}
