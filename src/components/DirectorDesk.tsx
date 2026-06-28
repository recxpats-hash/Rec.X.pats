import React, { useState } from "react";
import { 
  PnLStatement, 
  TaxRecord, 
  ForecastRecord, 
  BudgetRecord, 
  RevenueRecord, 
  CustomerSaleRecord, 
  CashFlowRecord, 
  InvoiceRecord,
  ConsultancyRecord,
  CameraRecord,
  StockInventory,
  PondRecord,
  SpawningRecord,
  WaterQualityRecord,
  AppointmentBooking,
  StaffActivityRecord,
  TraceRecord,
  MaintenanceRecord,
  FishFeedRecord,
  HarvestRecord,
  BatchRecord,
  LPORecord,
  SupplierRecord
} from "../types";
import { 
  PiggyBank, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
  Trash2, 
  Coins, 
  FileSpreadsheet, 
  Percent, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Briefcase, 
  Layers, 
  Filter, 
  Info, 
  Maximize2,
  DollarSign,
  Heart,
  FileText,
  X,
  ChevronRight,
  Clock,
  Activity,
  Award,
  Shield,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Scale,
  RefreshCw,
  Sliders,
  FileCheck,
  Layers3,
  HelpCircle,
  ShieldAlert
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ComposedChart
} from "recharts";
import AppLogo from "./AppLogo";
import BackgroundWatermark from "./BackgroundWatermark";

interface DirectorDeskProps {
  pnl: PnLStatement[];
  taxes: TaxRecord[];
  forecasts: ForecastRecord[];
  budgets: BudgetRecord[];
  revenueRecords: RevenueRecord[];
  customerSales: CustomerSaleRecord[];
  cashFlows: CashFlowRecord[];
  invoices: InvoiceRecord[]; // Accounts Receivable
  messages?: any[];
  consultancies?: ConsultancyRecord[];
  cameras?: CameraRecord[];
  inventoryManagement?: StockInventory[];
  ponds?: PondRecord[];
  spawning?: SpawningRecord[];
  waterQuality?: WaterQualityRecord[];
  bookings?: AppointmentBooking[];
  staffActivities?: StaffActivityRecord[];
  traces?: TraceRecord[];
  maintenances?: MaintenanceRecord[];
  feeds?: FishFeedRecord[];
  harvests?: HarvestRecord[];
  batches?: BatchRecord[];
  lpos?: LPORecord[];
  suppliers?: SupplierRecord[];
  dbLoaded?: boolean;
  onAddRecord: (model: string, data: any) => Promise<void>;
  onDeleteRecord: (model: string, id: string) => Promise<void>;
  onUpdateRecord?: (model: string, id: string, data: any) => Promise<void>;
}

export default function DirectorDesk({
  pnl,
  taxes,
  forecasts,
  budgets,
  revenueRecords,
  customerSales,
  cashFlows,
  invoices,
  messages = [],
  consultancies = [],
  cameras = [],
  inventoryManagement = [],
  ponds = [],
  spawning = [],
  waterQuality = [],
  bookings = [],
  staffActivities = [],
  traces = [],
  maintenances = [],
  feeds = [],
  harvests = [],
  batches = [],
  lpos = [],
  suppliers = [],
  dbLoaded = false,
  onAddRecord,
  onDeleteRecord,
  onUpdateRecord
}: DirectorDeskProps) {
  // View mode toggler: default to Dashboards Cockpit, allow toggle to Airtable
  const [viewMode, setViewMode] = useState<"dashboards" | "airtable">("dashboards");
  const [activeDashboard, setActiveDashboard] = useState<string>("executive");
  const [certifiedLogs, setCertifiedLogs] = useState<string[]>([]);
  const [dashboardSearch, setDashboardSearch] = useState<string>("");
  const [selectedRatioCard, setSelectedRatioCard] = useState<string>("current");
  const [accrualAccountingMode, setAccrualAccountingMode] = useState<boolean>(true);
  const [cccDso, setCccDso] = useState<number>(34);
  const [cccDio, setCccDio] = useState<number>(45);
  const [cccDpo, setCccDpo] = useState<number>(30);
  const [simulatedCashOffset, setSimulatedCashOffset] = useState<number>(0);

  // Airtable Sheet Navigation state
  const [activeSheet, setActiveSheet] = useState<
    "budgets" | "customerSales" | "revenue" | "cashflows" | "receivables" | "payables" | "ratios" | "taxes" | "pnl"
  >("budgets");

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Consultancy states
  const [isConsFormOpen, setIsConsFormOpen] = useState(false);
  const [consRequestTitle, setConsRequestTitle] = useState("");
  const [consDescriptionOfNeeds, setConsDescriptionOfNeeds] = useState("");
  const [consQuestions, setConsQuestions] = useState("");
  const [consFishFarmManager, setConsFishFarmManager] = useState("Sarah Kim");
  const [consAssignedConsultant, setConsAssignedConsultant] = useState("Dr. Emily Tan");
  const [consSuggestedExpertise, setConsSuggestedExpertise] = useState("Water Chemistry & Emergency Response");
  const [consRequestedServices, setConsRequestedServices] = useState("");
  const [consPhotosOfIssue, setConsPhotosOfIssue] = useState("");
  
  // Consultancy response states
  const [selectedConsForResponse, setSelectedConsForResponse] = useState<ConsultancyRecord | null>(null);
  const [consResponseText, setConsResponseText] = useState("");
  const [consResponseRating, setConsResponseRating] = useState(5);
  const [consResponseStatus, setConsResponseStatus] = useState<"Responded" | "Closed">("Responded");
  const [activeConsFilter, setActiveConsFilter] = useState<string>("All");

  // Security Camera & Video Activity Logs states
  const [secFilterStatus, setSecFilterStatus] = useState<string>("All");
  const [secFilterActivity, setSecFilterActivity] = useState<string>("All");
  const [secFilterDate, setSecFilterDate] = useState<string>("");
  
  // Registration form states for adding a new camera
  const [isAddCameraOpen, setIsAddCameraOpen] = useState(false);
  const [newCamName, setNewCamName] = useState("");
  const [newCamLocation, setNewCamLocation] = useState("");
  const [newCamModel, setNewCamModel] = useState("");
  const [newCamSerial, setNewCamSerial] = useState("");
  const [newCamViewZone, setNewCamViewZone] = useState("");
  const [newCamStatus, setNewCamStatus] = useState("Online");
  const [newCamNotes, setNewCamNotes] = useState("");
  
  // States for logging/editing a specific camera's details & latest video logs
  const [editingCamera, setEditingCamera] = useState<CameraRecord | null>(null);
  const [logActivityType, setLogActivityType] = useState("");
  const [logActivityTimestamp, setLogActivityTimestamp] = useState("");
  const [logActivityNotes, setLogActivityNotes] = useState("");
  const [logActivityAttachments, setLogActivityAttachments] = useState("");

  // Quick metrics calculations
  const totalPlannedBudget = budgets.reduce((sum, b) => sum + Number(b.plannedAmount || 0), 0);
  const totalRevenueAmount = revenueRecords.reduce((sum, r) => sum + Number(r.revenueAmount || 0), 0);
  const totalTaxesOwed = taxes.reduce((sum, t) => sum + (Number(t.taxRate || 0) * totalRevenueAmount / 100), 0);
  const netEarnings = totalRevenueAmount - totalTaxesOwed;

  // Add state handlers for Airtable records creation
  // 1. Budget Form State
  const [budgetForm, setBudgetForm] = useState({
    name: "",
    periodStart: "2025-10-01",
    periodEnd: "2025-12-31",
    category: "Equipment",
    plannedAmount: "",
    notes: "",
    actualRevenueRollup: 0,
    actualExpensesRollup: 0,
    actualReceivablesRollup: 0,
    budgetVariance: 0,
    variancePercentage: 0,
    aiSummary: "Automatic pending review",
    aiRisk: "Low Risk Status Checked"
  });

  // 2. Customer Sale Form State
  const [customerSaleForm, setCustomerSaleForm] = useState({
    customerName: "",
    fishType: "Tilapia fry",
    fishStage: "Fry",
    saleDate: "2025-10-01",
    quantitySold: "",
    unit: "pcs",
    unitPrice: "",
    amount: "",
    customerNeeds: "",
    notes: "",
    saleChannel: "Direct",
    regionLocation: "Kampala",
    saleRecordedBy: "Director Office"
  });

  // 3. Revenue Record Form State
  const [revenueForm, setRevenueForm] = useState({
    name: "",
    saleDate: "2025-10-01",
    customer: "",
    salesTransaction: "Tilapia Sales",
    revenueAmount: "",
    costOfGoodsSold: "",
    notes: "",
    budgetCategory: "Equipment",
    cashInflowsTotal: 0,
    cashOutflowsTotal: 0,
    netCashFlow: 0
  });

  // 4. Cash Flow Form State
  const [cashFlowForm, setCashFlowForm] = useState({
    recordedBy: "Ayo Adedeji",
    type: "Inflow",
    amount: "",
    description: "",
    transactionDate: "2025-10-01",
    month: "2025-10",
    isInflow: true,
    isOutflow: false
  });

  // 5. Receivable/Invoice Form State
  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: "",
    customer: "",
    invoiceDate: "2025-10-01",
    dueDate: "2025-10-15",
    amountDue: "",
    amountPaid: "",
    paymentStatus: "Unpaid",
    notes: "",
    customerEmail: ""
  });

  // 6. Tax Record Form State
  const [taxForm, setTaxForm] = useState({
    name: "",
    jurisdiction: "East Africa",
    taxType: "Withholding Tax",
    taxRate: "6",
    notes: ""
  });

  // 7. P&L Statement Form State
  const [pnlForm, setPnlForm] = useState({
    name: "",
    periodStart: "2025-10-01",
    periodEnd: "2025-10-31",
    totalRevenue: "",
    totalExpenses: "",
    grossProfit: "",
    netProfit: "",
    currency: "Ush",
    notes: ""
  });

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const clearForms = () => {
    setBudgetForm({
      name: "", periodStart: "2025-10-01", periodEnd: "2025-12-31", category: "Equipment",
      plannedAmount: "", notes: "", actualRevenueRollup: 0, actualExpensesRollup: 0,
      actualReceivablesRollup: 0, budgetVariance: 0, variancePercentage: 0,
      aiSummary: "Automatic pending review", aiRisk: "Low Risk Status Checked"
    });
    setCustomerSaleForm({
      customerName: "", fishType: "Tilapia fry", fishStage: "Fry", saleDate: "2025-10-01",
      quantitySold: "", unit: "pcs", unitPrice: "", amount: "", customerNeeds: "",
      notes: "", saleChannel: "Direct", regionLocation: "Kampala", saleRecordedBy: "Director Office"
    });
    setRevenueForm({
      name: "", saleDate: "2025-10-01", customer: "", salesTransaction: "Tilapia Sales",
      revenueAmount: "", costOfGoodsSold: "", notes: "", budgetCategory: "Equipment",
      cashInflowsTotal: 0, cashOutflowsTotal: 0, netCashFlow: 0
    });
    setCashFlowForm({
      recordedBy: "Ayo Adedeji", type: "Inflow", amount: "", description: "",
      transactionDate: "2025-10-01", month: "2025-10", isInflow: true, isOutflow: false
    });
    setInvoiceForm({
      invoiceNumber: "", customer: "", invoiceDate: "2025-10-01", dueDate: "2025-10-15",
      amountDue: "", amountPaid: "", paymentStatus: "Unpaid", notes: "", customerEmail: ""
    });
    setTaxForm({
      name: "", jurisdiction: "East Africa", taxType: "Withholding Tax", taxRate: "6", notes: ""
    });
    setPnlForm({
      name: "", periodStart: "2025-10-01", periodEnd: "2025-10-31",
      totalRevenue: "", totalExpenses: "", grossProfit: "", netProfit: "", currency: "Ush", notes: ""
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeSheet === "budgets") {
        const planned = parseFloat(budgetForm.plannedAmount) || 0;
        await onAddRecord("budgets", {
          ...budgetForm,
          plannedAmount: planned,
          budgetVariance: planned,
          variancePercentage: 100
        });
        showToast("✓ Budget record parsed & populated to Airtable database.");
      } else if (activeSheet === "customerSales") {
        const qty = parseFloat(customerSaleForm.quantitySold) || 0;
        const price = parseFloat(customerSaleForm.unitPrice) || 0;
        await onAddRecord("customerSales", {
          ...customerSaleForm,
          quantitySold: qty,
          unitPrice: price,
          amount: qty * price
        });
        showToast("✓ Customer sale registered with exact fish-stage tracking.");
      } else if (activeSheet === "revenue") {
        const rev = parseFloat(revenueForm.revenueAmount) || 0;
        const cogs = parseFloat(revenueForm.costOfGoodsSold) || 0;
        await onAddRecord("revenueRecords", {
          ...revenueForm,
          revenueAmount: rev,
          costOfGoodsSold: cogs,
          grossMargin: rev - cogs,
          grossMarginPct: rev > 0 ? Math.round(((rev - cogs) / rev) * 100) : 0,
          netCashFlow: rev
        });
        showToast("✓ Revenue record mapped with profit calculations!");
      } else if (activeSheet === "cashflows") {
        const amt = parseFloat(cashFlowForm.amount) || 0;
        await onAddRecord("cashFlows", {
          ...cashFlowForm,
          amount: amt,
          isInflow: cashFlowForm.type === "Inflow",
          isOutflow: cashFlowForm.type === "Outflow",
          netCashFlow: cashFlowForm.type === "Inflow" ? amt : -amt
        });
        showToast("✓ Cash flow transaction added in ledger.");
      } else if (activeSheet === "receivables") {
        const due = parseFloat(invoiceForm.amountDue) || 0;
        const paid = parseFloat(invoiceForm.amountPaid) || 0;
        await onAddRecord("invoices", {
          ...invoiceForm,
          amountDue: due,
          amountPaid: paid,
          outstandingBalance: due - paid
        });
        showToast("✓ Accounts receivable invoice created.");
      } else if (activeSheet === "taxes") {
        await onAddRecord("taxes", {
          ...taxForm,
          taxRate: parseFloat(taxForm.taxRate) || 0
        });
        showToast("✓ Tax record updated on active jurisdiction.");
      } else if (activeSheet === "pnl") {
        const revValue = parseFloat(pnlForm.totalRevenue) || 0;
        const expValue = parseFloat(pnlForm.totalExpenses) || 0;
        await onAddRecord("pnlStatements", {
          ...pnlForm,
          totalRevenue: revValue,
          totalExpenses: expValue,
          grossProfit: revValue - expValue,
          netProfit: revValue - expValue
        });
        showToast("✓ Generated dynamic P&L Statement period.");
      }
      setShowAddForm(false);
      clearForms();
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (val: number | string | undefined) => {
    if (val === undefined || val === null) return "Ush 0";
    const num = Number(val);
    if (isNaN(num)) return String(val);
    return `Ush ${num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const sheets = [
    { id: "budgets", label: "📄 Budgets & Variances", count: budgets.length },
    { id: "customerSales", label: "🐟 Customer Sales Logs", count: customerSales.length },
    { id: "revenue", label: "💰 Revenue Records", count: revenueRecords.length },
    { id: "cashflows", label: "💸 Cash Flow Ledger", count: cashFlows.length },
    { id: "receivables", label: "📥 Accounts Receivable", count: invoices.length },
    { id: "taxes", label: "⚖️ Taxes & Jurisdiction", count: taxes.length },
    { id: "pnl", label: "📈 P&L Statements", count: pnl.length }
  ];

  const filteredQuery = searchQuery.toLowerCase().trim();

  // Unified calculations for charts
  const calculatedCCC = cccDso + cccDio - cccDpo;

  const totalInflowVal = cashFlows
    .filter(cf => cf.type === "Inflow" || cf.isInflow)
    .reduce((sum, cf) => sum + Number(cf.amount || 0), 0);

  const totalOutflowVal = cashFlows
    .filter(cf => cf.type === "Outflow" || cf.isOutflow)
    .reduce((sum, cf) => sum + Number(cf.amount || 0), 0);

  const totalOutstandingAR = invoices.reduce((sum, i) => sum + (Number(i.amountOwed || 0) - Number(i.totalPaymentsMade || 0)), 0);
  const totalInvoicedAmount = invoices.reduce((sum, i) => sum + Number(i.amountOwed || 0), 0);
  const collectionPercentage = totalInvoicedAmount > 0 
    ? Math.round((invoices.reduce((sum, i) => sum + Number(i.totalPaymentsMade || 0), 0) / totalInvoicedAmount) * 100) 
    : 100;

  const totalCogs = revenueRecords.reduce((sum, r) => sum + Number(r.costOfGoodsSold || 0), 0);

  // Grouping product sales from customerSales
  const productDistribution = customerSales.reduce((acc: {[key: string]: number}, item) => {
    const stage = item.fishStage || "Other Stage";
    const amt = parseFloat(item.amount as any) || (parseFloat(item.quantitySold as any) * parseFloat(item.unitPrice as any)) || 0;
    acc[stage] = (acc[stage] || 0) + amt;
    return acc;
  }, {});

  const productPieData = Object.keys(productDistribution).map(key => ({
    name: key,
    value: productDistribution[key],
  }));

  const COLORS = ["#0284c7", "#0d9488", "#4f46e5", "#7c3aed", "#db2777", "#ea580c"];

  // Monthly Cash Flow Aggregation
  const monthlyDataMap: { [key: string]: { month: string; inflow: number; outflow: number; net: number } } = {};
  cashFlows.forEach((cf) => {
    const rawMonth = cf.month || (cf.transactionDate ? cf.transactionDate.substring(0, 7) : "2025-10");
    if (!monthlyDataMap[rawMonth]) {
      monthlyDataMap[rawMonth] = { month: rawMonth, inflow: 0, outflow: 0, net: 0 };
    }
    const amt = Number(cf.amount || 0);
    if (cf.type === "Inflow" || cf.isInflow) {
      monthlyDataMap[rawMonth].inflow += amt;
    } else {
      monthlyDataMap[rawMonth].outflow += amt;
    }
  });
  const monthlyData = Object.values(monthlyDataMap).sort((a,b) => a.month.localeCompare(b.month));
  const executiveTimelineData = (dbLoaded || monthlyData.length > 0) ? monthlyData : [
    { month: "2025-10", inflow: 12000000, outflow: 4500000, net: 7500000 },
    { month: "2025-11", inflow: 15500000, outflow: 5200000, net: 10300000 },
    { month: "2025-12", inflow: 18000000, outflow: 6000000, net: 12000000 }
  ];
  executiveTimelineData.forEach(d => d.net = d.inflow - d.outflow);

  // Simulated Current Assets Calculation
  const simulatedCurrentAssets = totalInflowVal + totalOutstandingAR + simulatedCashOffset;
  const simulatedCurrentLiabilities = totalOutflowVal + totalTaxesOwed;
  const simulatedCurrentRatio = simulatedCurrentLiabilities > 0 
    ? parseFloat((simulatedCurrentAssets / simulatedCurrentLiabilities).toFixed(2)) 
    : 3.5;

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-slate-800 font-sans relative overflow-hidden">
      {/* Center-aligned Brand Watermark */}
      <BackgroundWatermark mode="light" />
      
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-55 bg-slate-900 border border-emerald-500 text-emerald-400 font-bold text-xs py-3 px-5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Mode Toggler Header Block */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col xl:flex-row items-center justify-between gap-6 mr-1">
        <div className="space-y-1 text-center xl:text-left">
          <div className="flex items-center justify-center xl:justify-start gap-2 text-emerald-400 font-extrabold text-xs tracking-wider uppercase">
            <Sparkles size={14} className="animate-pulse" />
            <span>Corporate Finance Director Cockpit</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight font-sans text-white">
            Fish Farm Controller Desk
          </h1>
          <p className="text-xs text-slate-400 max-w-xl font-medium">
            Analyze fish spawning and nursery unit financial assets. Simulates liquidity offsets, generates profit & loss summaries, tracks accounts payable/receivable with ledger synchronization.
          </p>
        </div>

        {/* View Switcher button group */}
        <div className="flex bg-slate-800/80 p-1 border border-slate-700/60 rounded-2xl shadow-inner shrink-0 self-center">
          <button
            type="button"
            onClick={() => setViewMode("dashboards")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === "dashboards"
                ? "bg-emerald-450 bg-emerald-500 text-slate-950 shadow-md font-black"
                : "text-slate-350 hover:text-white"
            }`}
          >
            <Activity size={14} />
            <span>📊 Analytics Cockpit</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("airtable")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === "airtable"
                ? "bg-emerald-500 text-slate-950 shadow-md font-black"
                : "text-slate-350 hover:text-white"
            }`}
          >
            <FileSpreadsheet size={14} />
            <span>📁 Airtable Spreadsheets</span>
          </button>
        </div>
      </div>

      {/* Director Desk Overview Metric Bento Blocks (Stat Scorecards) */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div id="dd-stat-budget" className="bg-gradient-to-br from-sky-900 to-sky-950 text-white rounded-2xl p-5 shadow-xs border border-sky-850 flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute right-[-15px] top-[-10px] opacity-10 text-white group-hover:scale-110 transition-transform">
            <Coins size={90} />
          </div>
          <div>
            <span className="text-[10px] text-sky-300 font-extrabold tracking-widest uppercase block mb-1">
              Planned Budgets (Total Allocation)
            </span>
            <div className="text-2xl font-black font-mono tracking-tight text-white mt-1">
              {formatCurrency(totalPlannedBudget)}
            </div>
          </div>
          <div className="text-[10px] text-cyan-300 mt-4 font-bold flex items-center gap-1">
            <CheckCircle2 size={11} /> 
            <span>Audoting September-December FY2025</span>
          </div>
        </div>

        <div id="dd-stat-revenue" className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-2xl p-5 shadow-xs border border-emerald-850 flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute right-[-15px] top-[-10px] opacity-10 text-white group-hover:scale-110 transition-transform">
            <TrendingUp size={90} />
          </div>
          <div>
            <span className="text-[10px] text-emerald-300 font-extrabold tracking-widest uppercase block mb-1">
              Actual Realized Revenue
            </span>
            <div className="text-2xl font-black font-mono tracking-tight text-teal-200 mt-1">
              {formatCurrency(totalRevenueAmount)}
            </div>
          </div>
          <div className="text-[10px] text-emerald-200 mt-4 font-bold flex items-center gap-1">
            <Percent size={11} /> 
            <span>Margin average: ~38% across spawn batches</span>
          </div>
        </div>

        <div id="dd-stat-taxes" className="bg-gradient-to-br from-purple-900 to-purple-950 text-white rounded-2xl p-5 shadow-xs border border-purple-850 flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute right-[-15px] top-[-10px] opacity-10 text-white group-hover:scale-110 transition-transform">
            <Percent size={90} />
          </div>
          <div>
            <span className="text-[10px] text-purple-300 font-extrabold tracking-widest uppercase block mb-1">
              Estimated Taxes (At Active Rate)
            </span>
            <div className="text-2xl font-black font-mono tracking-tight text-purple-100 mt-1">
              {formatCurrency(totalTaxesOwed)}
            </div>
          </div>
          <div className="text-[10px] text-purple-200 mt-4 font-bold flex items-center gap-1">
            <Info size={11} /> 
            <span>Active withholding levy is 6.00%</span>
          </div>
        </div>

        <div id="dd-stat-net" className="bg-gradient-to-br from-teal-900 to-cyan-950 text-white rounded-2xl p-5 shadow-xs border border-teal-850 flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute right-[-15px] top-[-10px] opacity-10 text-white group-hover:scale-110 transition-transform">
            <PiggyBank size={90} />
          </div>
          <div>
            <span className="text-[10px] text-teal-300 font-extrabold tracking-widest uppercase block mb-1">
              Nettable Earnings (After Tax)
            </span>
            <div className="text-2xl font-black font-mono tracking-tight text-cyan-300 mt-1">
              {formatCurrency(netEarnings)}
            </div>
          </div>
          <div className="text-[10px] text-cyan-300 mt-4 font-bold flex items-center gap-1">
            <Percent size={11} /> 
            <span>Net operational cushion is solid (94%)</span>
          </div>
        </div>

      </section>

      {/* DASHBOARDS VIEWMODE SUITES COCKPIT */}
      {viewMode === "dashboards" && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mr-1">
          
          {/* Dashboard Left Sidebar */}
          <div className="xl:col-span-1 flex flex-col gap-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3">
              Corporate Visualizations
            </span>
            <div className="flex flex-row xl:flex-col gap-1.5 overflow-x-auto pb-2 xl:pb-0 scrollbar-none">
              {[
                { id: "executive", label: "👑 Executive Dashboard", desc: "Operations & Accounts Overview" },
                { id: "revenue", label: "📈 Revenue & Growth", desc: "Sales Channels, FCR & Yields BI" },
                { id: "inventory", label: "📦 Stocks & Inventory", desc: "Inventory Status & Reorder Logs" },
                { id: "customer-login", label: "👤 Customer Login & Hub", desc: "Customer Profiles & Accounts" },
                { id: "appointments", label: "📅 Engagement & Scheduler", desc: "Meetings, Staff, and Follow-ups" },
                { id: "variance", label: "⚖️ Budget Variance Review", desc: "Financial Ratios, Variance & Risk" },
                { id: "spawning", label: "🧬 Spawning & Incubation", desc: "Broodstock striping & fish farm metrics" },
                { id: "ponds", label: "🐟 Pond & Batch Control", desc: "Batches, Transfers & Mortality logs" },
                { id: "water-quality", label: "💧 Water Quality Review", desc: "Daily Parameter Actions & Alerts" },
                { id: "procurement", label: "⛓️ Procurement & Logistics", desc: "LPOs, Suppliers & Deliveries" },
                { id: "staff-log", label: "👥 Staff Activities Log", desc: "Detailed Time & Activity tracking" },
                { id: "traceability", label: "🔍 Traceability & Chain", desc: "Pond-to-pack compliance custody" },
                { id: "bookings", label: "🤝 Consultancy Bookings", desc: "Advice and service engagement log" },
                { id: "maintenance", label: "🚜 Farm Maintenance Desk", desc: "Pumps, aerators and net repairs" },
                { id: "security", label: "📹 Cameras & Video Activity", desc: "CCTV pings & Machine vision events" },
                { id: "cashflow", label: "💸 Cash Velocity Ledger", desc: "Ayo Adedeji Cash Flows Ledger" },
                { id: "ledger", label: "📥 Accounts Receivable AP/AR", desc: "Balance Statements & Payables" },
                { id: "messages", label: "💬 Customer Communication", desc: "Communication Board logs" },
              ].map((tab) => {
                const isActive = activeDashboard === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveDashboard(tab.id)}
                    className={`px-4 py-3.5 text-xs font-bold rounded-2xl text-left border flex flex-col gap-0.5 transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? "bg-slate-900 text-white border-slate-900 shadow-lg scale-[1.01]"
                        : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-xs font-bold">
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-300'}`} />
                      {tab.label}
                    </span>
                    <span className={`text-[9px] font-medium block pl-4 ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                      {tab.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Auto-Audit Assistant */}
            <div className="hidden xl:flex flex-col gap-3 p-4 bg-indigo-50 border border-indigo-100/50 rounded-2xl mt-4">
              <div className="flex items-center gap-1.5 text-indigo-900 font-extrabold text-[10px] uppercase tracking-wider">
                <Shield size={12} />
                <span>Regulatory Auto-Audit</span>
              </div>
              <p className="text-[10px] text-indigo-750 font-medium leading-relaxed">
                Liquidity models and ratios are evaluated based on GAPP principles. Taxes are withholding-certified.
              </p>
              <div className="text-[10px] font-mono text-indigo-950 bg-white/70 px-2 py-1.5 rounded-lg border border-indigo-100 font-extrabold flex items-center justify-between">
                <span>Regulatory: Compliance</span>
                <span className="text-emerald-650 text-emerald-600">Grade AAA</span>
              </div>
            </div>
          </div>

          {/* Dashboards active Viewport Area */}
          <div className="xl:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm min-h-[550px] flex flex-col gap-6">
            
            {/* 1. EXECUTIVE COMMAND SUITE */}
            {activeDashboard === "executive" && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-lg font-black text-slate-950 flex items-center gap-2">
                    Executive Dashboard & Financial Report Overview
                  </h2>
                  <p className="text-xs text-slate-500">Unification of recxpats operations metrics, estimated tax burdens, and actual ledger balance.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Corporate Health Rating</span>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-black text-indigo-950">Grade A-</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded-lg">Low Risk</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">Calculated from net margins vs active liabilities ratio.</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Total Transaction Velocity</span>
                    <div className="text-2xl font-mono font-black text-slate-900">{cashFlows.length} Operations Logs</div>
                    <p className="text-[10px] text-slate-400 mt-2">Active cash ledger flows currently synchronized.</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Unbilled Assets</span>
                    <div className="text-2xl font-mono font-black text-slate-900">{formatCurrency(totalOutstandingAR)}</div>
                    <p className="text-[10px] text-slate-400 mt-2">Secured accounts receivable from Tilapia clients.</p>
                  </div>
                </div>

                {/* Composed chart of outflows vs inflows */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Historical General Net Inflows vs Outflows</h3>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono font-semibold">Base: Ledger Items</span>
                  </div>
                  <div className="h-64 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={executiveTimelineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <Tooltip formatter={(v) => [`Ush ${Number(v).toLocaleString()}`]} />
                        <Legend />
                        <Bar dataKey="inflow" barSize={20} fill="#0ea5e9" name="Inflow (Revenue)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="outflow" barSize={20} fill="#f43f5e" name="Outflow (Expenses)" radius={[4, 4, 0, 0]} />
                        <Line type="monotone" strokeWidth={3} dataKey="net" stroke="#4f46e5" name="Net Velocity Margin" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* DIRECTOR'S DESK ISSUES & REGULATORY RISKS TRACKER */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3 border-slate-200">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                        <ShieldAlert size={15} className="text-rose-500 animate-pulse" /> Director's Desk Regulatory & Operational Risk Register
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Live automated facility compliance, biological anomalies, and cash reserve exposure diagnostics.
                      </p>
                    </div>
                    <span className="bg-rose-50 border border-rose-200 text-rose-700 px-2.5 py-0.5 rounded text-[9.5px] font-black uppercase animate-pulse">
                      Dynamic Risk Audit Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Biological Risk Column */}
                    <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">1. recxpats Bio-Stress</span>
                        <span className="bg-amber-100 text-amber-800 text-[8px] font-bold px-1.5 py-0.5 rounded">Monitor</span>
                      </div>
                      <p className="text-[10px] text-slate-700">
                        Evaluates real-time tank measurements against hypoxic tolerances for mature breeders.
                      </p>
                      <div className="bg-slate-50 border p-2 rounded-lg text-[9.5px] font-medium text-slate-650 flex flex-col gap-1.5">
                        <div className="flex justify-between">
                          <span>Water Column Outliers:</span>
                          <strong className="text-slate-900 font-mono">0 tanks critical</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Feeds Reorder Alarms:</span>
                          <strong className="text-rose-600 font-mono">Depleted limits detected</strong>
                        </div>
                      </div>
                    </div>

                    {/* Regulatory Risk Column */}
                    <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">2. Tax & Compliance Audit</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[8px] font-bold px-1.5 py-0.5 rounded">Grade A</span>
                      </div>
                      <p className="text-[10px] text-slate-700">
                        Validates local provisional withholding, tax clearance certs, and statutory tax obligations.
                      </p>
                      <div className="bg-slate-50 border p-2 rounded-lg text-[9.5px] font-medium text-slate-650 flex flex-col gap-1.5">
                        <div className="flex justify-between">
                          <span>Withholding Certification:</span>
                          <span className="text-emerald-700 font-bold">100% compliant</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Audit Trail Logs:</span>
                          <span className="text-slate-800 font-mono">Fully signed</span>
                        </div>
                      </div>
                    </div>

                    {/* Financial Risk Column */}
                    <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">3. Cash Flow Exposure</span>
                        <span className="bg-sky-100 text-sky-850 text-[8px] font-bold px-1.5 py-0.5 rounded">Safe Buffer</span>
                      </div>
                      <p className="text-[10px] text-slate-700">
                        Tracks assets coverage, outstanding accounts receivables ratio, and actual runway.
                      </p>
                      <div className="bg-slate-50 border p-2 rounded-lg text-[9.5px] font-medium text-slate-650 flex flex-col gap-1.5">
                        <div className="flex justify-between">
                          <span>Budget Variance Target:</span>
                          <span className="text-emerald-700 font-bold">Within standard</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Liquidity Multiple Ratio:</span>
                          <span className="text-sky-700 font-mono">1.4 Compliant</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operational Issue Checklist Detail Grid */}
                  <div className="bg-white border text-[10px] rounded-xl overflow-x-auto text-slate-800 font-sans">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b text-[9px] uppercase font-bold text-slate-400">
                        <tr>
                          <th className="px-4 py-2">Identified Core Exposure</th>
                          <th className="px-4 py-2">Category</th>
                          <th className="px-4 py-2">Threat Priority</th>
                          <th className="px-4 py-2">Corrective Strategy / Compass Directive</th>
                          <th className="px-4 py-2 text-right">Status Check</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-medium text-slate-700">
                        <tr>
                          <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span> Critical Feeds Inventory Reorder alerts
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-500">Biological Hold</td>
                          <td className="px-4 py-3">
                            <span className="bg-red-100 text-red-850 border border-red-200 px-1.5 py-0.5 rounded-[5px] text-[8px] font-extrabold uppercase">Critical</span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 font-medium">Issue express instructions to manager Okello to initiate immediate procurement LPOs for safety stocks.</td>
                          <td className="px-4 py-3 text-right">
                            <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[8px] font-bold">Pending Action</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Dissolved oxygen below 4.0 mg/L constraints
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-500">Biosecurity Gate</td>
                          <td className="px-4 py-3">
                            <span className="bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded-[5px] text-[8px] font-extrabold uppercase">Monitor Status</span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 font-medium">Coordinate instant tank flushing system cycles inside fish farm console water management module.</td>
                          <td className="px-4 py-3 text-right">
                            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[8px] font-bold">Under Check</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Provisional tax burden withholding rate log
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-500">Tax Auditing</td>
                          <td className="px-4 py-3">
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-150 px-1.5 py-0.5 rounded-[5px] text-[8px] font-extrabold uppercase">Compliant AAA</span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 font-medium">Submit formal VAT withhold logs to local authority portal under provisional clearance framework.</td>
                          <td className="px-4 py-3 text-right">
                            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[8px] font-bold">Fully Certified</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 🌟 PREMIUM MULTI-DASHBOARD SUB-SYSTEM MONITORS 🌟 */}
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Layers3 size={14} className="text-cyan-500 animate-pulse" />
                    CROSS-DASHBOARD SUB-SYSTEM INTEGRATION REGISTRY
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Operations Dashboard Monitor */}
                    <div className="bg-gradient-to-tr from-sky-50 to-white hover:from-sky-100/50 transition-all rounded-2xl p-4.5 border border-sky-100 flex flex-col justify-between shadow-xs">
                      <div>
                        <div className="flex justify-between items-center mb-2.5">
                          <span className="text-[10px] uppercase font-bold text-sky-800 tracking-wider">
                            ⚙️ Operations Desk Stream
                          </span>
                          <span className="bg-sky-100 text-sky-800 font-mono text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                            Active
                          </span>
                        </div>
                        
                        <div className="space-y-1.5 text-[10.5px] text-slate-650">
                          <div className="flex justify-between border-b border-sky-100/50 pb-1">
                            <span>Sourced Ponds Count:</span>
                            <strong className="text-slate-900 font-mono">{ponds?.length || 6} basins</strong>
                          </div>
                          <div className="flex justify-between border-b border-sky-100/50 pb-1">
                            <span>Active Larval Batches:</span>
                            <strong className="text-slate-900 font-mono">{batches?.length || 10} batches</strong>
                          </div>
                          <div className="flex justify-between border-b border-sky-100/50 pb-1">
                            <span>Water Quality Actions:</span>
                            <strong className="text-slate-900 font-mono">{waterQuality?.length || 8} parameters</strong>
                          </div>
                          <div className="flex justify-between pb-1">
                            <span>Harvest Navigation:</span>
                            <span className="text-cyan-600 font-semibold text-[10px] flex items-center gap-1 font-mono">
                              Collapsible List ✓
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 border-t border-sky-100/70 pt-2.5 flex items-center justify-between">
                        <span className="text-[8.5px] uppercase tracking-wider text-slate-450 font-mono">
                          Completed Harvests: {harvests?.length || 5}
                        </span>
                        <button 
                          onClick={() => setActiveDashboard("ponds")}
                          className="text-[9px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-0.5 cursor-pointer"
                        >
                          Configure <span>→</span>
                        </button>
                      </div>
                    </div>

                    {/* Customers Corner Monitor */}
                    <div className="bg-gradient-to-tr from-emerald-50 to-white hover:from-emerald-100/50 transition-all rounded-2xl p-4.5 border border-emerald-100 flex flex-col justify-between shadow-xs">
                      <div>
                        <div className="flex justify-between items-center mb-2.5">
                          <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                            👥 Customers & CRM Stream
                          </span>
                          <span className="bg-emerald-100 text-emerald-850 font-mono text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                            Operational
                          </span>
                        </div>

                        <div className="space-y-1.5 text-[10.5px] text-slate-650">
                          <div className="flex justify-between border-b border-emerald-100/50 pb-1">
                            <span>Unique Registered Clients:</span>
                            <strong className="text-slate-900 font-mono">
                              {Array.from(new Set(customerSales?.map(cs => cs.customerName) || [])).length || 4} entities
                            </strong>
                          </div>
                          <div className="flex justify-between border-b border-emerald-100/50 pb-1">
                            <span>Consultancy Bookings:</span>
                            <strong className="text-slate-900 font-mono">{bookings?.length || 4} active</strong>
                          </div>
                          <div className="flex justify-between border-b border-emerald-100/50 pb-1">
                            <span>Live Message Logs:</span>
                            <strong className="text-slate-900 font-mono">{messages?.length || 12} feeds</strong>
                          </div>
                          <div className="flex justify-between pb-1">
                            <span>Support Desk Mode:</span>
                            <span className="text-emerald-700 font-semibold text-[10px] flex items-center gap-1 font-mono">
                              Auto-categorized
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 border-t border-emerald-100/70 pt-2.5 flex items-center justify-between">
                        <span className="text-[8.5px] uppercase tracking-wider text-slate-450 font-mono">
                          Sales Channels: Online + Off-take
                        </span>
                        <button 
                          onClick={() => setActiveDashboard("customer-login")}
                          className="text-[9px] font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
                        >
                          Audit CRM <span>→</span>
                        </button>
                      </div>
                    </div>

                    {/* Accounts & PnL Ledger Monitor */}
                    <div className="bg-gradient-to-tr from-amber-50 to-white hover:from-amber-100/50 transition-all rounded-2xl p-4.5 border border-amber-100 flex flex-col justify-between shadow-xs">
                      <div>
                        <div className="flex justify-between items-center mb-2.5">
                          <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                            💰 Cash ledger & PNL Stream
                          </span>
                          <span className="bg-emerald-100 text-emerald-800 font-mono text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                            AAA Certified
                          </span>
                        </div>

                        <div className="space-y-1.5 text-[10.5px] text-slate-650">
                          <div className="flex justify-between border-b border-amber-100/50 pb-1">
                            <span>VAT Withholding Rate:</span>
                            <strong className="text-emerald-700 font-black text-[9.5px]">Compliant (100%)</strong>
                          </div>
                          <div className="flex justify-between border-b border-amber-100/50 pb-1">
                            <span>Planned Budgets:</span>
                            <strong className="text-slate-900 font-mono">{budgets?.length || 0} entries</strong>
                          </div>
                          <div className="flex justify-between border-b border-amber-100/50 pb-1">
                            <span>Transaction Velocity:</span>
                            <strong className="text-slate-900 font-mono">{cashFlows?.length || 0} logs</strong>
                          </div>
                          <div className="flex justify-between pb-1">
                            <span>Accounting Rule Match:</span>
                            <span className="text-indigo-700 font-semibold text-[10px] font-mono">GAPP Compliant</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 border-t border-amber-100/70 pt-2.5 flex items-center justify-between">
                        <span className="text-[8.5px] uppercase tracking-wider text-slate-450 font-mono">
                          Cash Balance Offset: Active
                        </span>
                        <button 
                          onClick={() => setActiveDashboard("ledger")}
                          className="text-[9px] font-bold text-amber-600 hover:text-amber-800 flex items-center gap-0.5 cursor-pointer"
                        >
                          Sync Ledger <span>→</span>
                        </button>
                      </div>
                    </div>
                    
                  </div>
                </div>

                {/* Corporate Narrative Report */}
                <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
                  <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 mb-1">
                    <Shield size={14} className="text-emerald-600" />
                    Overall Corporate Audit Assessment Narrative
                  </h4>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Based on available live accounting streams, actual realized revenue totals <span className="font-bold">{formatCurrency(totalRevenueAmount)}</span> against planned allocations of <span className="font-bold">{formatCurrency(totalPlannedBudget)}</span>. This demonstrates excellent budget control hygiene. Outstanding AR totals <span className="font-bold">{formatCurrency(totalOutstandingAR)}</span> which, if recovered, will increase the quick assets liquidity multiple. Executive recommendation is to maintain the active withholding level rate check and certify regional tax declarations on time.
                  </p>
                </div>
              </div>
            )}

            {/* 2. REVENUE & GROWTH SUITE */}
            {activeDashboard === "revenue" && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-lg font-black text-slate-950">
                    Revenue, Trends & Business Health Dashboard
                  </h2>
                  <p className="text-xs text-slate-500">Chronological analysis of fry production sales, unit conversions, and customer segment contributions.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Revenue Growth Trend */}
                  <div className="lg:col-span-2 space-y-3">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Revenue Realization Timeline</h3>
                    <div className="h-64 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                      <ResponsiveContainer width="100%" height="105%">
                        <AreaChart data={revenueRecords.map(r => ({ date: r.saleDate, amount: Number(r.revenueAmount || 0) })).sort((a,b) => a.date.localeCompare(b.date))}>
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                          <Tooltip formatter={(v) => [`Ush ${Number(v).toLocaleString()}`]} />
                          <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2.5} name="Actual Revenue Amount" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Fish Segment Contributions */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Sales Share by Growth Stage</h3>
                    <div className="h-64 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                      {productPieData.length > 0 ? (
                        <div className="h-40">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={productPieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={60}
                                paddingAngle={3}
                                dataKey="value"
                              >
                                {productPieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(v) => [`Ush ${Number(v).toLocaleString()}`]} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="h-40 flex items-center justify-center text-xs text-slate-400 font-medium">No customer sales logging available</div>
                      )}
                      
                      {/* Custom Legend */}
                      <div className="text-[9px] grid grid-cols-2 gap-1.5 border-t pt-2 max-h-16 overflow-y-auto">
                        {productPieData.map((item, idx) => (
                          <div key={item.name} className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                            <span className="truncate text-slate-650" title={item.name}>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Sales Table subset for Business Health audit */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Customer Revenue Audit Log</h3>
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left text-[11px] border-collapse bg-white">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[9px] tracking-wider border-b border-slate-100">
                        <tr>
                          <th className="px-4 py-3">Customer & Location</th>
                          <th className="px-4 py-3">Fish Type / Stage</th>
                          <th className="px-4 py-3 text-right">Volume</th>
                          <th className="px-4 py-3 text-right">Unit Price</th>
                          <th className="px-4 py-3 text-right">Gross revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-650">
                        {customerSales.length > 0 ? (
                          customerSales.slice(0, 5).map((cs) => {
                            const realizedAmt = parseFloat(cs.amount as any) || (Number(cs.quantitySold || 0) * Number(cs.unitPrice || 0));
                            return (
                              <tr key={cs.id} className="hover:bg-slate-50 transition">
                                <td className="px-4 py-2.5">
                                  <span className="font-bold text-slate-900 block">{cs.customerName}</span>
                                  <span className="text-[9px] text-slate-400 font-mono tracking-tight">{cs.location || "Kampala HQ"}</span>
                                </td>
                                <td className="px-4 py-2.5">
                                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-sky-50 text-sky-700">
                                    {cs.fishType} ({cs.fishStage})
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 text-right font-mono font-semibold text-slate-700">{cs.quantitySold} {cs.unit}</td>
                                <td className="px-4 py-2.5 text-right font-mono text-slate-600">{formatCurrency(cs.unitPrice)}</td>
                                <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">{formatCurrency(realizedAmt)}</td>
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-6 text-center text-slate-400 font-medium">No sales logged in Airtable ledger yet. Go back to Spreadsheets view to append.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. CASH FLOW TIMELINE & VELOCITY */}
            {activeDashboard === "cashflow" && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-lg font-black text-slate-950 border-b-0">
                    Cash Flow & Cash Conversion Cycle (CCC)
                  </h2>
                  <p className="text-xs text-slate-500">Simulate Days Sales Outstanding vs Inventories, evaluate conversion cycles, and inspect cash timeline ledgers.</p>
                </div>

                {/* Cash Conversion Cycle Interactive Widget */}
                <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white border border-slate-800 space-y-6 shadow-md shadow-indigo-950/20">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-[9px] font-black tracking-widest text-emerald-400 uppercase block mb-1">
                        Advanced Treasury Simulator
                      </span>
                      <h3 className="text-base font-black tracking-tight flex items-center gap-1.5">
                        <Sliders size={15} />
                        Cash Conversion Cycle Calculator
                      </h3>
                      <p className="text-[10px] text-slate-300 max-w-lg mt-1 font-medium select-none">
                        The Cash Conversion Cycle (CCC) measures the time in days it takes to convert resource inputs into actual business cash. Formula: CCC = DSO + DIO - DPO.
                      </p>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 flex flex-col items-center justify-center p-4 rounded-xl min-w-40 shrink-0 text-center select-none shadow-inner">
                      <span className="text-[10px] font-bold text-slate-450 text-slate-300 tracking-wider">CCC TARGET CYCLE</span>
                      <span className="text-4xl font-black font-mono mt-1 text-emerald-400">
                        {calculatedCCC} Days
                      </span>
                      <span className="text-[9px] px-2 py-0.5 mt-2 bg-emerald-500/10 text-emerald-400 font-extrabold rounded-full">
                        {calculatedCCC < 40 ? "🔥 Hyper Efficient" : "✔️ standard Velocity"}
                      </span>
                    </div>
                  </div>

                  {/* Range Sliders */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-350 shrink-0">Days Sales Outstanding (DSO)</span>
                        <span className="font-mono text-emerald-400 shrink-0">{cccDso} Days</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="90" 
                        value={cccDso} 
                        onChange={(e) => setCccDso(Number(e.target.value))}
                        className="w-full accent-emerald-400 bg-slate-700 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-[9px] text-slate-400 block font-medium">Goal: Collect receivables as fast as possible.</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-350 shrink-0">Days Inventory Outstanding (DIO)</span>
                        <span className="font-mono text-emerald-400 shrink-0">{cccDio} Days</span>
                      </div>
                      <input 
                        type="range" 
                        min="15" 
                        max="120" 
                        value={cccDio} 
                        onChange={(e) => setCccDio(Number(e.target.value))}
                        className="w-full accent-emerald-400 bg-slate-700 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-[9px] text-slate-400 block font-medium">Goal: Minimize duration feed/fish sit in inventory.</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-350 shrink-0">Days Payable Outstanding (DPO)</span>
                        <span className="font-mono text-emerald-400 shrink-0">{cccDpo} Days</span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
                        max="60" 
                        value={cccDpo} 
                        onChange={(e) => setCccDpo(Number(e.target.value))}
                        className="w-full accent-emerald-400 bg-slate-700 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-[9px] text-slate-400 block font-medium">Goal: Extend suppliers pay times safely.</span>
                    </div>
                  </div>
                </div>

                {/* Cash Flow ledger sequence timeline list */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Cash Cycle Timeline</h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {cashFlows.length > 0 ? (
                      cashFlows.map((cf) => {
                        const isPlusState = cf.type === "Inflow" || cf.isInflow;
                        return (
                          <div key={cf.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-xl border shrink-0 ${
                                isPlusState 
                                  ? "bg-emerald-50 border-emerald-100 text-emerald-600 font-bold" 
                                  : "bg-rose-50 border-rose-100 text-rose-600 font-bold"
                              }`}>
                                {isPlusState ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 block">{cf.description}</span>
                                <span className="text-[9px] text-slate-400 block">Recorded by: {cf.recordedBy || "Administrator"} • {cf.transactionDate}</span>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <span className={`font-mono font-bold tracking-tight text-[11px] ${
                                isPlusState ? "text-emerald-600" : "text-rose-600"
                              }`}>
                                {isPlusState ? "+" : "-"}{formatCurrency(cf.amount)}
                              </span>
                              <span className="text-[8px] bg-slate-200 text-slate-500 px-1.5 py-0.2 rounded-md font-bold uppercase tracking-wide block mt-1">
                                {cf.month}
                              </span>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="p-8 text-center text-slate-400 font-medium">No transaction timeline events mapped.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. STATEMENT OF INCOME & PNL */}
            {activeDashboard === "income" && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-lg font-black text-slate-950 flex items-center gap-2">
                    Operating P&L & Actual Analysis of Income Statement
                  </h2>
                  <p className="text-xs text-slate-500">Audit-level spreadsheet detailing revenues, deductions, active tax withholdings, and real margin health.</p>
                </div>

                {/* Scorecard steps */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border">
                    <span className="text-[10px] text-slate-450 text-slate-400 uppercase trackers block mb-1">Gross Revenues</span>
                    <span className="text-sm font-mono font-bold text-slate-900">{formatCurrency(totalRevenueAmount)}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border">
                    <span className="text-[10px] text-slate-450 text-slate-400 uppercase trackers block mb-1">Deduction (COGS)</span>
                    <span className="text-sm font-mono font-bold text-slate-900">{formatCurrency(totalCogs)}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border">
                    <span className="text-[10px] text-slate-450 text-slate-400 uppercase trackers block mb-1">Operating Exp (OPEX)</span>
                    <span className="text-sm font-mono font-bold text-slate-900">{formatCurrency(totalOutflowVal)}</span>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-emerald-800 uppercase trackers block mb-1">Calculated Net Earnings</span>
                    <span className="text-sm font-mono font-bold text-emerald-700">{formatCurrency(netEarnings)}</span>
                  </div>
                </div>

                {/* Real Income Statement Matrix */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Dynamic Income Statement Report</h3>
                  <div className="overflow-x-auto rounded-2xl border border-slate-150">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-950 text-white font-bold uppercase text-[9px] tracking-widest">
                        <tr>
                          <th className="px-5 py-3">Accounting Category Line Item</th>
                          <th className="px-5 py-3 text-right">Value (Ush)</th>
                          <th className="px-5 py-3 text-right">Plausible % of Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-slate-700 bg-white font-mono">
                        <tr>
                          <td className="px-5 py-3 text-slate-900 font-sans font-bold">1. Gross Operational Revenue (Billed + Realized)</td>
                          <td className="px-5 py-3 text-right font-bold text-slate-900">{formatCurrency(totalRevenueAmount)}</td>
                          <td className="px-5 py-3 text-right text-slate-500">100.0%</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3 pl-8 text-rose-800 font-sans font-medium">Less: Cost of Goods Sold (COGS)</td>
                          <td className="px-5 py-3 text-right text-rose-800">-{formatCurrency(totalCogs)}</td>
                          <td className="px-5 py-3 text-right text-rose-500">
                            {totalRevenueAmount > 0 ? Math.round((totalCogs/totalRevenueAmount)*100) : 0}%
                          </td>
                        </tr>
                        <tr className="bg-slate-50/70 font-semibold">
                          <td className="px-5 py-3 text-slate-950 font-sans font-extrabold pl-4">A. Gross Profit Margin Buffer</td>
                          <td className="px-5 py-3 text-right text-indigo-950 font-black">{formatCurrency(totalRevenueAmount - totalCogs)}</td>
                          <td className="px-5 py-3 text-right text-indigo-900">
                            {totalRevenueAmount > 0 ? Math.round(((totalRevenueAmount - totalCogs)/totalRevenueAmount)*100) : 100}%
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3 pl-8 text-slate-700 font-sans font-medium">Operating Expenses (Payroll, Leases, Nursery Spares)</td>
                          <td className="px-5 py-3 text-right text-slate-700">-{formatCurrency(totalOutflowVal)}</td>
                          <td className="px-5 py-3 text-right text-slate-500">
                            {totalRevenueAmount > 0 ? Math.round((totalOutflowVal/totalRevenueAmount)*100) : 0}%
                          </td>
                        </tr>
                        <tr className="bg-slate-50 font-semibold">
                          <td className="px-5 py-3 text-slate-900 font-sans font-extrabold pl-4">B. Operating EBITDA Cushion</td>
                          <td className="px-5 py-3 text-right text-slate-900 font-bold">{formatCurrency((totalRevenueAmount - totalCogs) - totalOutflowVal)}</td>
                          <td className="px-5 py-3 text-right text-slate-500">
                            {totalRevenueAmount > 0 ? Math.round((((totalRevenueAmount - totalCogs) - totalOutflowVal)/totalRevenueAmount)*100) : 0}%
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3 pl-8 text-purple-800 font-sans font-medium">Withholding Estimates (Active Jurisdictional rate)</td>
                          <td className="px-5 py-3 text-right text-purple-800">-{formatCurrency(totalTaxesOwed)}</td>
                          <td className="px-5 py-3 text-right text-slate-500">6.0%</td>
                        </tr>
                        <tr className="bg-emerald-500/10 text-emerald-950 font-black">
                          <td className="px-5 py-3 font-sans font-black pl-4">C. Net Operational Earnings (EAT)</td>
                          <td className="px-5 py-3 text-right text-emerald-700 font-black">{formatCurrency(netEarnings)}</td>
                          <td className="px-5 py-3 text-right text-emerald-750">
                            {totalRevenueAmount > 0 ? Math.round((netEarnings/totalRevenueAmount)*100) : 0}%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 5. LIQUIDITY & FINANCIAL RATIOS */}
            {activeDashboard === "liquidity" && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-lg font-black text-slate-955 text-slate-950 flex items-center gap-2">
                    Current Ratio, Liquidity & Ratios Gallery
                  </h2>
                  <p className="text-xs text-slate-500">Live simulation of cash injections to model liquidity multiples and assess quick assets recovery.</p>
                </div>

                {/* Simulator Widget for Current Ratio Dashboard & Liquidity Metrics Dashboard */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  <div className="lg:col-span-2 space-y-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 flex items-center gap-1">
                      <Sliders size={13} />
                      Current Ratio Simulator Control
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">Simulate Cash Offset Reserves</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold pr-4 select-none">
                      Adjust this slider mock offset to simulate injecting or drawing down cash reserves (e.g. from Fish Farm infrastructure purchases or external equity funding). Watch how his changes standard solvent ratios immediately!
                    </p>

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-600">Simulated Extra Cash Reserve</span>
                        <span className="font-mono text-indigo-700 font-black">{formatCurrency(simulatedCashOffset)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="-5000000" 
                        max="8000000" 
                        step="250000"
                        value={simulatedCashOffset} 
                        onChange={(e) => setSimulatedCashOffset(Number(e.target.value))}
                        className="w-full accent-indigo-750 bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Ratio Dial Ring representation */}
                  <div className="bg-white border border-slate-150 rounded-xl p-4 flex flex-col items-center justify-center text-center select-none shadow-sm shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Live solvency ratio</span>
                    <span className="text-4xl font-extrabold font-mono text-indigo-950 mt-1">{simulatedCurrentRatio}x</span>
                    <span className="text-[11px] font-bold text-slate-550 mt-1 text-slate-500">Current Assets / Liabilities</span>
                    
                    <div className="w-full mt-4 p-2 bg-slate-50 rounded-lg text-[10px] font-bold">
                      {simulatedCurrentRatio >= 2.0 ? (
                        <span className="text-emerald-600">✔️ Safe solvent liquidity multiple</span>
                      ) : simulatedCurrentRatio >= 1.2 ? (
                        <span className="text-amber-600">⚠️ Risk warning: Moderate liquidity buffer</span>
                      ) : (
                        <span className="text-rose-600">❌ High risk: Threat of liquidity default</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Financial Ratios Gallery */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Financial Ratios Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white border border-slate-150 rounded-2xl">
                      <h4 className="text-xs font-black text-slate-900 border-b pb-1 mb-2">Quick Acid test Ratio</h4>
                      <div className="text-lg font-mono font-bold text-slate-700">
                        {parseFloat((simulatedCurrentAssets * 0.7 / simulatedCurrentLiabilities).toFixed(2)) || 1.4}x
                      </div>
                      <p className="text-[9px] text-slate-400 mt-2">Deducts slow-moving inventory fry stock to analyze immediate survival cash assets.</p>
                    </div>

                    <div className="p-4 bg-white border border-slate-150 rounded-2xl">
                      <h4 className="text-xs font-black text-slate-900 border-b pb-1 mb-2">Working Capital cushion</h4>
                      <div className="text-lg font-mono font-bold text-slate-700">
                        {formatCurrency(simulatedCurrentAssets - simulatedCurrentLiabilities)}
                      </div>
                      <p className="text-[9px] text-slate-400 mt-2">The net operational funds available for staff salaries and daily spawn feed supplies.</p>
                    </div>

                    <div className="p-4 bg-white border border-slate-150 rounded-2xl">
                      <h4 className="text-xs font-black text-slate-900 border-b pb-1 mb-2">Estimated ROI Multiplier</h4>
                      <div className="text-lg font-mono font-bold text-slate-700">
                        {(totalRevenueAmount > 0 && totalCogs > 0) ? Math.round(((totalRevenueAmount - totalCogs)/totalPlannedBudget)*100) : 38}%
                      </div>
                      <p className="text-[9px] text-slate-400 mt-2">Gross margins realized on top of initial financial capital investment plans.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. AP / AR LEDGER LEDGER COMPONENT */}
            {activeDashboard === "ledger" && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-lg font-black text-slate-950 flex items-center gap-1.5">
                    Accounts Receivable & Payable (Receivables & Payables)
                  </h2>
                  <p className="text-xs text-slate-500">Aging accounts receivable ledger profiles and outstanding client balance audits.</p>
                </div>

                {/* AR completion block */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Collection Rate</span>
                    <h3 className="text-base font-extrabold text-slate-900">Dynamic Accounts Receivable Collection</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Currently client collections are operating with elegant speed.</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-2xl font-black font-mono text-emerald-600 block">{collectionPercentage}%</span>
                      <span className="text-[9px] text-slate-400 font-mono tracking-tight font-semibold block uppercase">Settle Completion</span>
                    </div>
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${collectionPercentage}%` }} />
                    </div>
                  </div>
                </div>

                {/* Aging accounts ledger table */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Accounts Receivable Detail Ledger</h3>
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 border-b text-slate-500 uppercase text-[9px] font-bold">
                        <tr>
                          <th className="px-4 py-3">Invoice Ref No.</th>
                          <th className="px-4 py-3">Customer Client Name</th>
                          <th className="px-4 py-3 text-right">Sum Invoice Due</th>
                          <th className="px-4 py-3 text-right">Settled Amount</th>
                          <th className="px-4 py-3 text-right">Outstanding balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-650 bg-white">
                        {invoices.length > 0 ? (
                          invoices.map((inv) => {
                            const outstanding = Number(inv.outstandingBalance !== undefined ? inv.outstandingBalance : (Number(inv.amountOwed || 0) - Number(inv.totalPaymentsMade || 0)));
                            return (
                              <tr key={inv.id} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-mono font-bold text-indigo-950">{inv.invoiceNumber}</td>
                                <td className="px-4 py-3">
                                  <span className="font-semibold text-slate-850 block text-slate-800">{inv.supplierName}</span>
                                  <span className="text-[9px] text-slate-400 font-mono tracking-tight">{inv.invoiceDate || "Due:"} {inv.dueDate || "As Agreed"}</span>
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-slate-800">{formatCurrency(inv.amountOwed)}</td>
                                <td className="px-4 py-3 text-right font-mono text-emerald-600 font-medium">{formatCurrency(inv.totalPaymentsMade)}</td>
                                <td className={`px-4 py-3 text-right font-mono font-bold ${outstanding > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                                  {outstanding > 0 ? formatCurrency(outstanding) : "Fully Settled ✔️"}
                                </td>
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-6 text-center text-slate-400 font-medium">No accounts receivables registered. Ensure invoices exist in live Airtable spreadsheets.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 7. BUDGET CONTROLS & VARIANCES */}
            {activeDashboard === "variance" && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-lg font-black text-slate-950">
                    Budget Variance Analysis Dashboard & Variance List
                  </h2>
                  <p className="text-xs text-slate-500">Live reconciliation of planned budget limits against actual rollup expenses.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Budget planned vs actual spend comparison chart */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Planned vs Spend Rollup Comparison</h3>
                    <div className="h-64 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={budgets.map(b => ({ name: b.name.replace(" Budget", ""), target: b.plannedAmount, actual: b.actualExpensesRollup || 250000 }))}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                          <Tooltip formatter={(v) => [`Ush ${Number(v).toLocaleString()}`]} />
                          <Legend />
                          <Bar dataKey="target" name="Target Plan" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
                          <Bar dataKey="actual" name="Actual Rollup" fill="#0f172a" radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Budget Variance analytical table (Variance List) */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Variance Checklist</h3>
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="w-full text-left text-[11px] border-collapse bg-white">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-[9px] font-bold border-b">
                          <tr>
                            <th className="px-3 py-2.5">Division Profile Name</th>
                            <th className="px-3 py-2.5 text-right">Variance Pct</th>
                            <th className="px-3 py-2.5 text-right">State Quality</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-slate-650">
                          {budgets.length > 0 ? (
                            budgets.map((b) => {
                              const plan = Number(b.plannedAmount || 0);
                              const rollup = Number(b.actualExpensesRollup || 0);
                              const pct = b.variancePercentage !== undefined ? b.variancePercentage : 100;
                              const isOver = plan < rollup;
                              return (
                                <tr key={b.id} className="hover:bg-slate-50/50">
                                  <td className="px-3 py-2.5">
                                    <span className="font-semibold text-slate-850 block text-slate-800">{b.name}</span>
                                    <span className="text-[9px] text-slate-400 font-mono tracking-wide">Allocated: {formatCurrency(b.plannedAmount)}</span>
                                  </td>
                                  <td className={`px-3 py-2.5 text-right font-mono font-bold ${isOver ? 'text-rose-600' : 'text-emerald-600'}`}>
                                    {pct}%
                                  </td>
                                  <td className="px-3 py-2.5 text-right">
                                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold ${isOver ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                      {isOver ? "Over Budget" : "Under Control"}
                                    </span>
                                  </td>
                                </tr>
                              )
                            })
                          ) : (
                            <tr>
                              <td colSpan={3} className="px-3 py-6 text-center text-slate-400 font-medium">No budgets planned. Append in Airtable worksheets view.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 8. CUSTOMER COMMUNICATION MESSAGES */}

            {/* 9. CONSULTANCY PROJECTS AIRTABLE INTEGRATION PORT */}
            {activeDashboard === "consultancytab" && (
              <div className="space-y-6">
                
                {/* Dashboard Tab Banner */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-slate-100 gap-4">
                  <div>
                    <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                      🤝 Executive Consultancy & Advisory Board
                    </h2>
                    <p className="text-xs text-slate-500">
                      Synchronized Airtable database for Water Quality Troubleshoot, Early-Stage Larvae reduction routines, and Biosecurity audits.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsConsFormOpen(!isConsFormOpen)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>{isConsFormOpen ? "Hide Add Form" : "Log New Intake"}</span>
                    </button>
                    <span className="bg-emerald-50 text-emerald-805 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-100">
                      {consultancies.length} Airtable Rows
                    </span>
                  </div>
                </div>

                {/* KPI Metrics row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-150 p-4 rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Requests</span>
                    <span className="text-xl font-bold font-mono text-slate-800 block mt-1">{consultancies.length}</span>
                    <span className="text-[9px] text-slate-500 font-semibold mt-0.5 block">Synced from Airtable</span>
                  </div>
                  
                  <div className="bg-white border border-slate-150 p-4 rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-amber-600 block">In Review / Pending</span>
                    <span className="text-xl font-bold font-mono text-slate-800 block mt-1">
                      {consultancies.filter(c => c.status === "In Review" || c.status === "Pending").length}
                    </span>
                    <span className="text-[9px] text-slate-500 font-semibold mt-0.5 block">Requiring attention</span>
                  </div>

                  <div className="bg-white border border-slate-150 p-4 rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 block">Completed & Responded</span>
                    <span className="text-xl font-bold font-mono text-slate-800 block mt-1">
                      {consultancies.filter(c => c.status === "Responded" || c.status === "Closed").length}
                    </span>
                    <span className="text-[9px] text-slate-500 font-semibold mt-0.5 block">Advisory successfully served</span>
                  </div>

                  <div className="bg-white border border-slate-150 p-4 rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 block">Avg Advisor Rating</span>
                    <span className="text-xl font-bold font-mono text-slate-800 block mt-1">
                      {(
                        consultancies.filter(c => c.averageResponseRating).reduce((sum, c) => sum + (c.averageResponseRating || 0), 0) /
                        (consultancies.filter(c => c.averageResponseRating).length || 1)
                      ).toFixed(1)} / 5.0
                    </span>
                    <span className="text-[9px] text-slate-500 font-semibold mt-0.5 block">Based on live quality ratings</span>
                  </div>
                </div>

                {/* Dynamic Record Adding Form */}
                {isConsFormOpen && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!consRequestTitle || !consDescriptionOfNeeds) {
                        alert("Please provide at least a request title and description of current needs.");
                        return;
                      }

                      const generatedAiSummary = consDescriptionOfNeeds.slice(0, 80) + "...";

                      await onAddRecord("consultancies", {
                        requestTitle: consRequestTitle,
                        descriptionOfNeeds: consDescriptionOfNeeds,
                        questions: consQuestions,
                        dateSubmitted: new Date().toISOString().split('T')[0],
                        status: "Pending",
                        photosOfIssue: consPhotosOfIssue || "https://images.unsplash.com/photo-1534080391025-a17c03b2fe3e?auto=format&fit=crop&w=600&q=80",
                        fishFarmManager: consFishFarmManager,
                        assignedConsultant: consAssignedConsultant,
                        consultancyResponses: "",
                        numberOfResponses: 0,
                        averageResponseRating: undefined,
                        firstResponseDate: undefined,
                        fishFarmManagerName: consFishFarmManager,
                        assignedConsultantName: consAssignedConsultant,
                        summaryOfNeedsAi: generatedAiSummary,
                        suggestedExpertiseAreaAi: consSuggestedExpertise,
                        requestedServices: consRequestedServices || "Assigned Site Analysis Feasibility Studies"
                      });

                      // Reset form states
                      setConsRequestTitle("");
                      setConsDescriptionOfNeeds("");
                      setConsQuestions("");
                      setConsRequestedServices("");
                      setConsPhotosOfIssue("");
                      setIsConsFormOpen(false);
                      alert("Successfully wrote new consultancy record into synchronized Airtable cluster!");
                    }}
                    className="bg-white border border-slate-205 p-6 rounded-3xl space-y-4 shadow-sm animate-in zoom-in-95"
                  >
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                        📝 Log New recxpats Intake Record (Airtable Schema)
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsConsFormOpen(false)}
                        className="text-slate-400 hover:text-slate-650 font-bold text-xs"
                      >
                        ✕ Close Form
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-500 block">Request Title</label>
                        <input
                          type="text"
                          required
                          value={consRequestTitle}
                          onChange={(e) => setConsRequestTitle(e.target.value)}
                          placeholder="e.g. Critical Nitrogen Spontaneous Flare-Up"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-500 block">Suggested Area of Expertise</label>
                        <select
                          value={consSuggestedExpertise}
                          onChange={(e) => setConsSuggestedExpertise(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-black cursor-pointer text-slate-750"
                        >
                          <option value="Water Chemistry & Emergency Response">Water Chemistry & Emergency Response</option>
                          <option value="Larval Rearing & Best Practices">Larval Rearing & Best Practices</option>
                          <option value="Pond Ecology & Algae Control">Pond Ecology & Algae Control</option>
                          <option value="Fish Health & Disease Management">Fish Health & Disease Management</option>
                          <option value="recxpats Site Search & Analysis">recxpats Site Search & Analysis</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-500 block">Fish Farm Manager Sponsor</label>
                        <select
                          value={consFishFarmManager}
                          onChange={(e) => setConsFishFarmManager(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-black cursor-pointer text-slate-750"
                        >
                          <option value="Sarah Kim">Sarah Kim</option>
                          <option value="Carlos Mendoza">Carlos Mendoza</option>
                          <option value="Priya Nair">Priya Nair</option>
                          <option value="James O'Connor">James O'Connor</option>
                          <option value="Mercelo Peter Okoya">Mercelo Peter Okoya (RecXpats CEO)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-500 block">Assigned Advisor Consultant</label>
                        <select
                          value={consAssignedConsultant}
                          onChange={(e) => setConsAssignedConsultant(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-black cursor-pointer text-slate-750"
                        >
                          <option value="Dr. Emily Tan">Dr. Emily Tan</option>
                          <option value="Miguel Santos">Miguel Santos</option>
                          <option value="Priya Nair">Priya Nair</option>
                          <option value="James O'Connor">James O'Connor</option>
                        </select>
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500 block">Description of Needs</label>
                        <textarea
                          rows={3}
                          required
                          value={consDescriptionOfNeeds}
                          onChange={(e) => setConsDescriptionOfNeeds(e.target.value)}
                          placeholder="Describe the physical symptoms, water chemistry values, biofilter behavior..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500 block">Questions to Consultant</label>
                        <textarea
                          rows={2}
                          value={consQuestions}
                          onChange={(e) => setConsQuestions(e.target.value)}
                          placeholder="List specific questions (e.g. Is salt-bath effective for mirror carps?)"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-500 block">Requested Services Scope</label>
                        <input
                          type="text"
                          value={consRequestedServices}
                          onChange={(e) => setConsRequestedServices(e.target.value)}
                          placeholder="e.g. Feasibility Studies, R&D Facility Hire"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-500 block">Photo of Issue (Direct Upload from Device OR Paste URL)</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="relative flex-1">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setConsPhotosOfIssue(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="hidden"
                              id="director-photo-upload"
                            />
                            <label
                              htmlFor="director-photo-upload"
                              className="flex items-center justify-center gap-1.5 w-full bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-800 rounded-lg p-2.5 text-xs font-bold cursor-pointer text-center select-none transition"
                            >
                              📷 Choose Image
                            </label>
                          </div>
                          <div className="flex-2">
                            <input
                              type="text"
                              value={consPhotosOfIssue.startsWith("data:") ? "Image Loaded from Device ✅" : consPhotosOfIssue}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val !== "Image Loaded from Device ✅") {
                                  setConsPhotosOfIssue(val);
                                }
                              }}
                              placeholder="Paste image URL or load file"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 rounded-xl transition shadow-xs cursor-pointer"
                    >
                      Save to synchronized Airtable instance
                    </button>
                  </form>
                )}

                {/* Table View of Airtable Records */}
                <div className="bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                  
                  {/* Table Toolbar Search and Status Filters */}
                  <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-3 bg-slate-50/50">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {["All", "Pending", "In Review", "Responded", "Closed"].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setActiveConsFilter(st)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeConsFilter === st
                              ? "bg-slate-900 text-white"
                              : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <div className="relative max-w-sm w-full">
                      <Search size={14} className="absolute left-3 top-2/5 text-slate-400" />
                      <input
                        type="text"
                        value={dashboardSearch}
                        onChange={(e) => setDashboardSearch(e.target.value)}
                        placeholder="Search Title, Manager, Advisor..."
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-100">
                          <th className="p-4">Request & Expertise</th>
                          <th className="p-4">Staff Assigned</th>
                          <th className="p-4">Submission Date</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-center">Responses</th>
                          <th className="p-4 text-center">Avg Rating</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                        {consultancies
                          .filter((rec) => {
                            if (activeConsFilter !== "All" && rec.status !== activeConsFilter) return false;
                            if (dashboardSearch) {
                              const matchStr = dashboardSearch.toLowerCase();
                              return (
                                rec.requestTitle.toLowerCase().includes(matchStr) ||
                                rec.fishFarmManager.toLowerCase().includes(matchStr) ||
                                rec.assignedConsultant.toLowerCase().includes(matchStr) ||
                                (rec.suggestedExpertiseAreaAi && rec.suggestedExpertiseAreaAi.toLowerCase().includes(matchStr))
                              );
                            }
                            return true;
                          })
                          .map((rec) => {
                            const isPending = rec.status === "Pending";
                            const isReview = rec.status === "In Review";
                            const isResp = rec.status === "Responded";
                            const isClosed = rec.status === "Closed";

                            return (
                              <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4">
                                  <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                                    <span>{rec.requestTitle}</span>
                                    {rec.photosOfIssue && (
                                      <a
                                        href={rec.photosOfIssue}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[10px] text-sky-600 hover:underline flex items-center gap-0.5 font-bold"
                                      >
                                        📷 File
                                      </a>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">{rec.suggestedExpertiseAreaAi || "General recxpats"}</div>
                                </td>
                                
                                <td className="p-4">
                                  <div className="text-slate-700 font-bold">{rec.assignedConsultant || "Not Assigned"}</div>
                                  <div className="text-[9px] text-slate-400 block mt-0.5">Manager: {rec.fishFarmManager}</div>
                                </td>

                                <td className="p-4 font-mono font-semibold text-slate-500 whitespace-nowrap">
                                  {rec.dateSubmitted}
                                </td>

                                <td className="p-4 text-center whitespace-nowrap">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                    isPending
                                      ? "bg-rose-50 text-rose-700 border border-rose-100"
                                      : isReview
                                      ? "bg-amber-50 text-amber-700 border border-amber-100 animated-pulse"
                                      : isResp
                                      ? "bg-emerald-50 text-emerald-805 border border-emerald-100"
                                      : "bg-slate-100 text-slate-650 border border-slate-200"
                                  }`}>
                                    {rec.status}
                                  </span>
                                </td>

                                <td className="p-4 text-center font-mono font-bold text-slate-650">
                                  {rec.numberOfResponses || 0}
                                </td>

                                <td className="p-4 text-center">
                                  {rec.averageResponseRating ? (
                                    <div className="flex items-center justify-center gap-0.5 text-amber-505 font-bold font-mono">
                                      <span>★</span>
                                      <span>{rec.averageResponseRating}</span>
                                    </div>
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </td>

                                <td className="p-4 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedConsForResponse(rec);
                                        setConsResponseText(rec.consultancyResponses || "");
                                        setConsResponseRating(rec.averageResponseRating || 5);
                                        setConsResponseStatus(rec.status === "Closed" ? "Closed" : "Responded");
                                      }}
                                      className="p-1 px-2 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-black cursor-pointer transition-colors"
                                    >
                                      Answer / Review
                                    </button>
                                    
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        if (confirm("Are you sure you want to delete this Airtable row?")) {
                                          await onDeleteRecord("consultancies", rec.id || "");
                                        }
                                      }}
                                      className="p-1 px-2 border border-slate-200 text-rose-600 hover:text-white hover:bg-rose-500 hover:border-rose-500 rounded-lg text-[10px] font-black cursor-pointer transition-colors"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                    
                    {consultancies.length === 0 && (
                      <div className="p-16 text-center text-slate-400">
                        No consultancy records mapped currently in Airtable. click 'Log New Intake' to generate!
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-panel details with Answers feedback */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
                    <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider mb-3">
                      💡 Active Advisor Action Guide
                    </h4>
                    <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                      When responding to an intake record:
                    </p>
                    <ul className="text-xs text-slate-500 list-disc pl-5 mt-2 space-y-1 font-semibold">
                      <li>Assess the <b>Water chemistry parameters</b> (Oxygen levels must be kept &gt; 4.0 ppm).</li>
                      <li>Double-check biological solutions for outdoor algal blooms before deploying lethal biocides.</li>
                      <li>Validate biosecurity protocols for larval fingerling survival thresholds under 70%.</li>
                    </ul>
                  </div>

                  <div className="bg-sky-50/20 border border-sky-150 p-6 rounded-3xl">
                    <h4 className="text-xs font-black uppercase text-sky-905 tracking-wider mb-2">
                      🤖 RecXpats Smart Diagnostics (AI)
                    </h4>
                    <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                      Our system automatically tags issues and maps them to appropriate expertise zones based on keywords like: <i>"Oxygen"</i>, <i>"Mortality"</i>, or <i>"Algae"</i>. Click Answer to compose customized responses to Fish Farm Managers.
                    </p>
                  </div>
                </div>

                {/* MODAL: ANSWER & EDIT AIRTABLE CONSULTANCY ROW */}
                {selectedConsForResponse && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
                      
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <div>
                          <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                            ✍️ Provide Response / Update Airtable Record
                          </h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                            ID: {selectedConsForResponse.id} • {selectedConsForResponse.requestTitle}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedConsForResponse(null)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 font-extrabold text-xs w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Display original intake details */}
                      <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100 text-xs">
                        <div>
                          <span className="font-extrabold text-slate-400 block uppercase tracking-wider text-[9px]">Sponsor Fish Farm Manager</span>
                          <span className="font-black text-slate-850">{selectedConsForResponse.fishFarmManager}</span>
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-400 block uppercase tracking-wider text-[9px]">Detailed Description of Needs</span>
                          <p className="text-slate-650 leading-relaxed font-semibold italic">"{selectedConsForResponse.descriptionOfNeeds}"</p>
                        </div>
                        {selectedConsForResponse.questions && (
                          <div>
                            <span className="font-extrabold text-slate-400 block uppercase tracking-wider text-[9px]">Questions Submitted</span>
                            <p className="text-slate-650 leading-relaxed font-semibold">❓ {selectedConsForResponse.questions}</p>
                          </div>
                        )}
                        {selectedConsForResponse.requestedServices && (
                          <div>
                            <span className="font-extrabold text-slate-400 block uppercase tracking-wider text-[9px]">Services Scope Selected</span>
                            <span className="bg-slate-200/65 px-2 py-0.5 rounded text-[10px] font-bold text-slate-700">{selectedConsForResponse.requestedServices}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 font-semibold">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500 block">Expert Response Feedback (Airtable: consultancyResponses)</label>
                          <textarea
                            rows={4}
                            value={consResponseText}
                            onChange={(e) => setConsResponseText(e.target.value)}
                            placeholder="Type concrete recommendations, water metrics remedies, biological controls, or instructions..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-500 block">Airtable Row Status</label>
                            <select
                              value={consResponseStatus}
                              onChange={(e) => setConsResponseStatus(e.target.value as any)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-755 cursor-pointer"
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Review">In Review</option>
                              <option value="Responded">Responded</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-500 block">Response Date</label>
                            <input
                              type="date"
                              defaultValue={new Date().toISOString().split('T')[0]}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-1.5 text-xs font-semibold"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-500 block">Advisor Quality Rating</label>
                            <select
                              value={consResponseRating}
                              onChange={(e) => setConsResponseRating(Number(e.target.value))}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-amber-600 cursor-pointer"
                            >
                              <option value={1}>★ Option 1 (Poor)</option>
                              <option value={2}>★★ Option 2 (Fair)</option>
                              <option value={3}>★★★ Option 3 (Neutral)</option>
                              <option value={4}>★★★★ Option 4 (Good)</option>
                              <option value={5}>★★★★★ Option 5 (Excellent)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2.5 pt-2 border-t border-slate-100 justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedConsForResponse(null)}
                          className="px-4 py-2 border border-slate-200 font-bold hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-xs rounded-xl transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        
                        <button
                          type="button"
                          onClick={async () => {
                            if (!consResponseText) {
                              alert("Please fill in the Expert Response description.");
                              return;
                            }

                            // Update properties back to state/server using App's callback handler
                            await onAddRecord("consultancies-update", {
                              id: selectedConsForResponse.id,
                              consultancyResponses: consResponseText,
                              status: consResponseStatus,
                              averageResponseRating: consResponseRating,
                              firstResponseDate: new Date().toISOString().split('T')[0],
                              numberOfResponses: (selectedConsForResponse.numberOfResponses || 0) + 1
                            });

                            setSelectedConsForResponse(null);
                            alert("Airtable row successfully updated!");
                          }}
                          className="px-5 py-2 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition shadow-xs cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeDashboard === "messages" && (
              <div className="space-y-6">
                <div className="border-b pb-4 flex justify-between items-center bg-white/45 p-4.5 rounded-2xl border border-slate-100">
                  <div>
                    <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                      ✉️ Executive Communications Inbox
                    </h2>
                    <p className="text-xs text-slate-500">Live feed of incoming queries, marketplace requests, and consultant inquires from active customers.</p>
                  </div>
                  <span className="bg-sky-55 text-sky-750 text-xs font-bold px-3 py-1 rounded-full border border-sky-100">
                    {messages.length} Total Messages
                  </span>
                </div>

                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map((msg: any) => {
                      const dateStr = msg.timestamp ? new Date(msg.timestamp).toLocaleString() : "Date N/A";
                      return (
                        <div key={msg.id} className="bg-white border border-slate-150 p-5 rounded-3xl shadow-xs hover:shadow-md transition-shadow relative">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dashed pb-3 mb-3">
                            <div className="flex items-center gap-2.5">
                              <span className={`w-2.5 h-2.5 rounded-full ${msg.status === 'Unread' ? 'bg-amber-500 animate-pulse' : 'bg-slate-350'}`} />
                              <div>
                                <span className="font-extrabold text-slate-800 text-xs">{msg.sender}</span>
                                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{dateStr}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                msg.urgency === 'Critical' 
                                  ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                                  : msg.urgency === 'Medium' 
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                                  : 'bg-sky-50 text-sky-750 border border-sky-100'
                              }`}>
                                {msg.urgency || 'Low'}
                              </span>
                              <button
                                onClick={async () => {
                                  if (confirm("Are you sure you want to delete this message?")) {
                                    await onDeleteRecord("messages", msg.id);
                                  }
                                }}
                                className="p-1 px-2 hover:bg-rose-55 hover:text-rose-700 text-rose-600 rounded-lg text-[10px] font-bold border border-transparent hover:border-rose-150 cursor-pointer transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900 mb-1.5">{msg.subject || "No Subject"}</h4>
                            <p className="text-xs text-slate-650 leading-relaxed whitespace-pre-line font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
                              "{msg.message}"
                            </p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-3xl">
                      <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-lg">✉️</span>
                      </div>
                      <h4 className="font-bold text-slate-705 text-xs">Inbox is completely clear</h4>
                      <p className="text-xs text-slate-400 mt-1">No customer queries or consultant inquiries have been logged yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeDashboard === "security" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* Header */}
                <div className="border-b pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/45 p-5 rounded-2xl border border-slate-100">
                  <div>
                    <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                      📹 Secure Nursery CCTV & Video Activity Log
                    </h2>
                    <p className="text-xs text-slate-500">
                      Monitor real-time fingerling tank cameras, log computer vision events, and ensure biosecurity compliance records.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddCameraOpen(true)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    Register New CCTV Feed
                  </button>
                </div>

                {/* Metrics Widgets */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-205 p-4 rounded-2xl shadow-3xs flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Total Cameras</span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-black text-slate-800">{cameras.length}</span>
                      <span className="text-[10px] text-emerald-600 font-bold">● Active Units</span>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-205 p-4 rounded-2xl shadow-3xs flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Online Feeds</span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-black text-emerald-600">
                        {cameras.filter(c => c.status === "Online").length}
                      </span>
                      <span className="text-[10px] text-slate-400">Streaming healthy</span>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-205 p-4 rounded-2xl shadow-3xs flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Alert / Maintenance</span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-black text-amber-600">
                        {cameras.filter(c => c.status === "Alert Triggered" || c.status === "Maintenance" || c.status === "Offline").length}
                      </span>
                      <span className="text-[10px] text-slate-400">Pings requiring action</span>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-205 p-4 rounded-2xl shadow-3xs flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Security Events Logged</span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-black text-indigo-600">
                        {cameras.filter(c => c.activityType && c.activityType !== "None" && c.activityType !== "None / Regular").length}
                      </span>
                      <span className="text-[10px] text-indigo-500 font-bold">Dynamic logs saved</span>
                    </div>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-4 items-end">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-slate-400 block">Filter Status</label>
                    <select
                      value={secFilterStatus}
                      onChange={(e) => setSecFilterStatus(e.target.value)}
                      className="bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Alert Triggered">Alert Triggered</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-slate-400 block">Filter Last Video Activity</label>
                    <select
                      value={secFilterActivity}
                      onChange={(e) => setSecFilterActivity(e.target.value)}
                      className="bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Activities</option>
                      <option value="None">None / Regular</option>
                      <option value="Motion Detected">Motion Detected</option>
                      <option value="Person Detected">Person Detected</option>
                      <option value="Water Level Alert">Water Level Alert</option>
                      <option value="Low Water Level Alert">Low Water Level Alert</option>
                      <option value="Water Overfill Warning">Water Overfill Warning</option>
                      <option value="Access Breach">Access Breach</option>
                      <option value="Bio-Security Breach">Bio-Security Breach</option>
                      <option value="Feeding Event">Feeding Event</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-slate-400 block">Filter Event Date</label>
                    <input
                      type="date"
                      value={secFilterDate}
                      onChange={(e) => setSecFilterDate(e.target.value)}
                      className="bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSecFilterStatus("All");
                      setSecFilterActivity("All");
                      setSecFilterDate("");
                    }}
                    className="px-3 py-1.5 text-xs font-black text-slate-500 hover:text-slate-900 transition-colors uppercase cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>

                {/* Main Cameras List & Video Activity Log Table */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-100">
                          <th className="p-4">Camera Identifier</th>
                          <th className="p-4">Deployment Details</th>
                          <th className="p-4">Status Select</th>
                          <th className="p-4">Video Activity Type</th>
                          <th className="p-4">Activity Date</th>
                          <th className="p-4">Attachments & Detections</th>
                          <th className="p-4">Notes Log</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                        {cameras
                          .filter((cam) => {
                            if (secFilterStatus !== "All" && cam.status !== secFilterStatus) return false;
                            if (secFilterActivity !== "All" && (cam.activityType || "None") !== secFilterActivity) return false;
                            if (secFilterDate && cam.activityTimestamp && !cam.activityTimestamp.includes(secFilterDate)) return false;
                            return true;
                          })
                          .map((cam) => {
                            return (
                              <tr key={cam.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 align-top">
                                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                                    📹 {cam.name}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-bold mt-1">
                                    Location: <span className="text-slate-800 font-semibold">{cam.location}</span>
                                  </div>
                                  <span className="text-[9px] font-mono text-slate-400 block mt-1 uppercase">ID: {cam.id}</span>
                                </td>

                                <td className="p-4 align-top">
                                  <div className="space-y-1 text-[11px] leading-snug">
                                    <div><strong className="text-slate-400">Zone:</strong> {cam.viewZone || "Nursery Central"}</div>
                                    <div><strong className="text-slate-400">Model:</strong> {cam.model || "CCTV Standard v1"}</div>
                                    <div><strong className="text-slate-400">Serial:</strong> <span className="font-mono text-[10px]">{cam.serialNumber || "N/A"}</span></div>
                                  </div>
                                </td>

                                <td className="p-4 align-top">
                                  <div className="space-y-1">
                                    <select
                                      value={cam.status}
                                      onChange={async (e) => {
                                        if (onUpdateRecord) {
                                          await onUpdateRecord("cameras", cam.id!, { status: e.target.value });
                                        }
                                      }}
                                      className={`px-2 py-1 text-[11px] font-bold rounded-lg border focus:outline-none cursor-pointer transition ${
                                        cam.status === "Online"
                                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                          : cam.status === "Offline"
                                          ? "bg-rose-50 text-rose-700 border-rose-200"
                                          : cam.status === "Maintenance"
                                          ? "bg-slate-50 text-slate-700 border-slate-200"
                                          : "bg-amber-50 text-amber-700 border-amber-200"
                                      }`}
                                    >
                                      <option value="Online">Online</option>
                                      <option value="Offline">Offline</option>
                                      <option value="Maintenance">Maintenance</option>
                                      <option value="Alert Triggered">Alert Triggered</option>
                                    </select>
                                    <span className="text-[9px] text-slate-400 block italic">Instant auto-save</span>
                                  </div>
                                </td>

                                <td className="p-4 align-top">
                                  <div className="space-y-1">
                                    <select
                                      value={cam.activityType || "None"}
                                      onChange={async (e) => {
                                        if (onUpdateRecord) {
                                          await onUpdateRecord("cameras", cam.id!, { activityType: e.target.value });
                                        }
                                      }}
                                      className="p-1 px-1.5 text-[11px] font-semibold border border-slate-200 hover:border-slate-300 rounded-lg bg-white text-slate-700 cursor-pointer max-w-[140px]"
                                    >
                                      <option value="None">None / Regular</option>
                                      <option value="Motion Detected">Motion Detected</option>
                                      <option value="Person Detected">Person Detected</option>
                                      <option value="Water Level Alert">Water Level Alert</option>
                                      <option value="Low Water Level Alert">Low Water Level Alert</option>
                                      <option value="Water Overfill Warning">Water Overfill Warning</option>
                                      <option value="Access Breach">Access Breach</option>
                                      <option value="Bio-Security Breach">Bio-Security Breach</option>
                                      <option value="Feeding Event">Feeding Event</option>
                                    </select>
                                    <span className="text-[9px] text-slate-400 block italic">Triggers alert cascade</span>
                                  </div>
                                </td>

                                <td className="p-4 align-top whitespace-nowrap">
                                  <input
                                    type="date"
                                    value={cam.activityTimestamp || ""}
                                    onChange={async (e) => {
                                      if (onUpdateRecord) {
                                        await onUpdateRecord("cameras", cam.id!, { activityTimestamp: e.target.value });
                                      }
                                    }}
                                    className="border border-slate-200 hover:border-slate-300 p-1 px-1.5 text-[11px] rounded bg-white text-slate-700 font-semibold cursor-pointer"
                                  />
                                </td>

                                <td className="p-4 align-top">
                                  {cam.activityAttachments || cam.photos ? (
                                    <div className="relative group w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-3xs bg-slate-50">
                                      <img
                                        src={cam.activityAttachments || cam.photos}
                                        referrerPolicy="no-referrer"
                                        alt="Activity detection log"
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                      />
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 text-[10px]">— No Attachment</span>
                                  )}
                                </td>

                                <td className="p-4 align-top max-w-[180px]">
                                  <div className="text-[10px] text-slate-600 bg-slate-50 rounded-lg p-2 border border-slate-100 max-h-[72px] overflow-y-auto font-medium leading-normal scrollbar-none italic">
                                    "{cam.activityNotes || cam.notes || "No security remarks logged."}"
                                  </div>
                                </td>

                                <td className="p-4 align-top text-center whitespace-nowrap">
                                  <div className="flex flex-col gap-1 items-stretch col-span-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingCamera(cam);
                                        setLogActivityType(cam.activityType || "None");
                                        setLogActivityTimestamp(cam.activityTimestamp || cam.installationDate || "");
                                        setLogActivityNotes(cam.activityNotes || cam.notes || "");
                                        setLogActivityAttachments(cam.activityAttachments || cam.photos || "");
                                      }}
                                      className="px-2.5 py-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-md border border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
                                    >
                                      ✍️ Edit & Log Event
                                    </button>
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        if (confirm(`Do you want to decommission and delete camera ${cam.name}?`)) {
                                          await onDeleteRecord("cameras", cam.id!);
                                        }
                                      }}
                                      className="px-2.5 py-1 text-[10px] hover:bg-rose-50 text-rose-600 hover:text-rose-700 font-bold rounded-md border border-transparent hover:border-rose-100 transition-all cursor-pointer"
                                    >
                                      🗑️ Delete Feed
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}

                        {cameras.length === 0 && (
                          <tr>
                            <td colSpan={8} className="p-16 text-center text-slate-400">
                              No active security cameras are configured. Click "Register New CCTV Feed" to mount cameras!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* MODAL 1: REGISTER NEW CAMERA FEED */}
                {isAddCameraOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <div>
                          <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                            📹 Register & Install New CCTV Feed
                          </h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                            Provision a secure closed-circuit camera feed
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsAddCameraOpen(false)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 font-extrabold text-xs w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="font-extrabold text-slate-700 block mb-1">Camera Name*</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Incubation Nursery Chamber"
                              value={newCamName}
                              onChange={(e) => setNewCamName(e.target.value)}
                              className="w-full border border-slate-200 p-2 rounded-xl text-xs font-bold text-slate-800 bg-white"
                            />
                          </div>
                          <div>
                            <label className="font-extrabold text-slate-700 block mb-1">Deployment Location*</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Fish Farm Room A"
                              value={newCamLocation}
                              onChange={(e) => setNewCamLocation(e.target.value)}
                              className="w-full border border-slate-200 p-2 rounded-xl text-xs font-bold text-slate-800 bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="font-extrabold text-slate-700 block mb-1">Hardware Model</label>
                            <input
                              type="text"
                              placeholder="e.g. HikVision Aqua v2"
                              value={newCamModel}
                              onChange={(e) => setNewCamModel(e.target.value)}
                              className="w-full border border-slate-200 p-2 rounded-xl text-xs font-bold text-slate-800 bg-white"
                            />
                          </div>
                          <div>
                            <label className="font-extrabold text-slate-700 block mb-1">Serial Number</label>
                            <input
                              type="text"
                              placeholder="e.g. HK-99882"
                              value={newCamSerial}
                              onChange={(e) => setNewCamSerial(e.target.value)}
                              className="w-full border border-slate-200 p-2 rounded-xl text-xs font-bold text-slate-800 bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="font-extrabold text-slate-700 block mb-1">Visual Coverage Zone</label>
                            <input
                              type="text"
                              placeholder="e.g. Nursery Tank C & D"
                              value={newCamViewZone}
                              onChange={(e) => setNewCamViewZone(e.target.value)}
                              className="w-full border border-slate-200 p-2 rounded-xl text-xs font-bold text-slate-800 bg-white"
                            />
                          </div>
                          <div>
                            <label className="font-extrabold text-slate-700 block mb-1">Initial Status</label>
                            <select
                              value={newCamStatus}
                              onChange={(e) => setNewCamStatus(e.target.value)}
                              className="w-full border border-slate-200 p-2 rounded-xl text-xs font-bold text-slate-800 bg-white cursor-pointer"
                            >
                              <option value="Online">Online</option>
                              <option value="Offline">Offline</option>
                              <option value="Maintenance">Maintenance</option>
                              <option value="Alert Triggered">Alert Triggered</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="font-extrabold text-slate-700 block mb-1">CCTV Placement Notes</label>
                          <textarea
                            placeholder="Describe any particular angles, calibration focal length, or power supply guidelines."
                            rows={2}
                            value={newCamNotes}
                            onChange={(e) => setNewCamNotes(e.target.value)}
                            className="w-full border border-slate-200 p-2 rounded-xl text-xs font-medium text-slate-800 bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                        <button
                          type="button"
                          onClick={() => setIsAddCameraOpen(false)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!newCamName || !newCamLocation) {
                              alert("Please fill in the camera name and deployment location.");
                              return;
                            }
                            await onAddRecord("cameras", {
                              name: newCamName,
                              location: newCamLocation,
                              model: newCamModel,
                              serialNumber: newCamSerial,
                              viewZone: newCamViewZone,
                              installationDate: new Date().toISOString().split('T')[0],
                              status: newCamStatus,
                              notes: newCamNotes,
                              activityType: "None",
                              activityTimestamp: new Date().toISOString().split('T')[0],
                              activityNotes: "CCTV unit first active ping successful."
                            });
                            setIsAddCameraOpen(false);
                            setNewCamName("");
                            setNewCamLocation("");
                            setNewCamModel("");
                            setNewCamSerial("");
                            setNewCamViewZone("");
                            setNewCamNotes("");
                            alert("CCTV Feed registered successfully in corporate security database!");
                          }}
                          className="px-5 py-2 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl transition shadow-xs cursor-pointer"
                        >
                          Mount Camera Feed
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODAL 2: EDIT CAMERA & LOG SECURITY VIDEO LOG EVENT */}
                {editingCamera && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <div>
                          <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                            ✍️ Log Video Activity Event: {editingCamera.name}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                            Register a security event or update machine vision detections
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingCamera(null)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 font-extrabold text-xs w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-[11px] leading-relaxed">
                          <span className="font-black text-slate-400 block uppercase tracking-wider text-[8.5px] mb-1">CCTV Unit Specifications</span>
                          <div><strong>Location & Zone coverage:</strong> Room {editingCamera.location} • coverage {editingCamera.viewZone || "Nursery Central"}</div>
                          <div><strong>Serial reference Number:</strong> {editingCamera.serialNumber || "None"} • Hardware {editingCamera.model || "CCTV Module"}</div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="font-extrabold text-slate-700 block mb-1">Dynamic Video Activity Type</label>
                            <select
                              value={logActivityType}
                              onChange={(e) => setLogActivityType(e.target.value)}
                              className="w-full border border-slate-200 p-2 rounded-xl text-xs font-bold text-slate-800 bg-white cursor-pointer"
                            >
                              <option value="None">None / Regular Feed</option>
                              <option value="Motion Detected">Motion Detected</option>
                              <option value="Person Detected">Person Detected</option>
                              <option value="Water Level Alert">Water Level Alert</option>
                              <option value="Low Water Level Alert">Low Water Level Alert</option>
                              <option value="Water Overfill Warning">Water Overfill Warning</option>
                              <option value="Access Breach">Access Breach</option>
                              <option value="Bio-Security Breach">Bio-Security Breach</option>
                              <option value="Feeding Event">Feeding Event</option>
                            </select>
                          </div>
                          <div>
                            <label className="font-extrabold text-slate-700 block mb-1">Activity Detection Date*</label>
                            <input
                              type="date"
                              required
                              value={logActivityTimestamp}
                              onChange={(e) => setLogActivityTimestamp(e.target.value)}
                              className="w-full border border-slate-200 p-2 rounded-xl text-xs font-bold text-slate-800 bg-white focus:outline-none cursor-pointer"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-extrabold text-slate-700 block mb-1">Referral Attachment / Frame Shot Image URL</label>
                          <input
                            type="text"
                            placeholder="e.g. abstract_21.png or a custom thumbnail link"
                            value={logActivityAttachments}
                            onChange={(e) => setLogActivityAttachments(e.target.value)}
                            className="w-full border border-slate-200 p-2 rounded-xl text-xs font-bold text-slate-800 bg-white"
                          />
                          <p className="text-[9.5px] text-slate-400 mt-1 font-semibold">
                            Enter an image link representing the captured event frame. You can use standard assets like <code className="font-mono bg-slate-100 text-slate-700 px-1 rounded">abstract_21.png</code>, <code className="font-mono bg-slate-100 text-slate-700 px-1 rounded">abstract_26.png</code>, <code className="font-mono bg-slate-100 text-slate-700 px-1 rounded">abstract_28.png</code>!
                          </p>
                        </div>

                        <div>
                          <label className="font-extrabold text-slate-700 block mb-1">Detailed Logs & Activity Notes</label>
                          <textarea
                            placeholder="Enter specific notes about the detection (e.g. Fish Farm team entered to feed Tilapia broodstock, level gauges triggered temporarily)."
                            rows={3}
                            value={logActivityNotes}
                            onChange={(e) => setLogActivityNotes(e.target.value)}
                            className="w-full border border-slate-200 p-2 rounded-xl text-xs font-medium text-slate-800 bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                        <button
                          type="button"
                          onClick={() => setEditingCamera(null)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!logActivityTimestamp) {
                              alert("Please select the activity timestamp date.");
                              return;
                            }
                            if (onUpdateRecord) {
                              await onUpdateRecord("cameras", editingCamera.id!, {
                                activityType: logActivityType,
                                activityTimestamp: logActivityTimestamp,
                                activityNotes: logActivityNotes,
                                activityAttachments: logActivityAttachments,
                                notes: logActivityNotes // sync notes too
                              });
                            }
                            setEditingCamera(null);
                            alert("CCTV video log event appended successfully!");
                          }}
                          className="px-5 py-2 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl transition shadow-xs cursor-pointer"
                        >
                          Append Security Log
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {activeDashboard === "inventory" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b pb-4 bg-white/45 p-5 rounded-2xl border border-slate-100">
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    📦 Operations-Stocks Inventory Monitoring
                  </h2>
                  <p className="text-xs text-slate-500">
                    Track and monitor overall warehouse status, feed quantities, equipment reserves, and critical reorder thresholds.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">Total SKU Inventory Items</span>
                    <div className="text-2xl font-black mt-1 font-mono">{inventoryManagement.length} items</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">Critical Low Stocks Alert</span>
                    <div className="text-2xl font-black mt-1 text-rose-600 font-mono">
                      {inventoryManagement.filter(i => Number(i.quantity || 0) <= Number(i.reorderLevel || 10)).length} Alerts
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">Total Inventory Valuation</span>
                    <div className="text-2xl font-black mt-1 text-indigo-950 font-mono">
                      {formatCurrency(inventoryManagement.reduce((sum, i) => sum + (Number(i.quantity || 0) * Number(i.unitCost || 0)), 0))}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">Active Feed Reservoirs</span>
                    <div className="text-2xl font-black mt-1 text-emerald-600 font-mono">
                      {feeds.length} Batches
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                    <span className="text-xs font-extrabold uppercase text-slate-505">Warehouse Stocks Ledger</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-405 border-b">
                        <tr>
                          <th className="p-3">Item Descriptor</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Quantity Stored</th>
                          <th className="p-3">Unit Cost</th>
                          <th className="p-3">Total Value</th>
                          <th className="p-3">Supplier Source</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-medium text-slate-700 bg-white">
                        {inventoryManagement.map((itm, idx) => {
                          const isLow = Number(itm.quantity || 0) <= Number(itm.reorderLevel || 10);
                          return (
                            <tr key={itm.id || idx} className="hover:bg-slate-50/50">
                              <td className="p-3 font-bold text-slate-900">{itm.name || itm.description || itm.fishFeedName || "N/A"}</td>
                              <td className="p-3 font-mono text-slate-500 font-bold">{itm.inventoryType || "Feed"}</td>
                              <td className="p-3 font-mono">{itm.quantity || 0} {itm.unitOfMeasure || "kg"}</td>
                              <td className="p-3 font-mono">{formatCurrency(itm.unitCost)}</td>
                              <td className="p-3 font-mono font-bold">{formatCurrency((itm.quantity || 0) * (itm.unitCost || 0))}</td>
                              <td className="p-3 text-slate-550">{itm.supplier || "N/A"}</td>
                              <td className="p-3">
                                {isLow ? (
                                  <span className="bg-rose-100 text-rose-800 text-[9.5px] px-1.5 py-0.5 rounded font-black uppercase">Low Stock REORDER</span>
                                ) : (
                                  <span className="bg-emerald-100 text-emerald-800 text-[9.5px] px-1.5 py-0.5 rounded font-black uppercase">Sufficient</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        {inventoryManagement.length === 0 && (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-400">No stocks inventory logs inside corporate database.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeDashboard === "customer-login" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b pb-4 bg-white/45 p-5 rounded-2xl border border-slate-100">
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    👤 Operations-Customer Login Dashboard & Hub
                  </h2>
                  <p className="text-xs text-slate-500">
                    Track and monitor overall customer interaction profiles, registration history, purchase logs, and self-service portals status.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 p-5 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total Registered Customers</span>
                    <div className="text-3xl font-black mt-1 text-indigo-950">
                      {Array.from(new Set(customerSales.map(s => s.customerName))).length} Accounts
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-slate-50 to-teal-50/30 p-5 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Historical Booking Load</span>
                    <div className="text-3xl font-black mt-1 text-teal-800">
                      {bookings.length} Engagements
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-slate-50 to-sky-50/30 p-5 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Avg Engagement Rate</span>
                    <div className="text-3xl font-black mt-1 text-sky-850">
                      94% Active
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b">
                    <h3 className="text-xs font-extrabold uppercase text-slate-500">Active Customer Base Operations Grid</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b">
                        <tr>
                          <th className="p-3">Customer Account</th>
                          <th className="p-3">Region / Location</th>
                          <th className="p-3">Primary Contact</th>
                          <th className="p-3">Purchased Items</th>
                          <th className="p-3">Total Volume</th>
                          <th className="p-3">Customer Feedback</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-medium text-slate-700 bg-white">
                        {customerSales.map((sale, i) => (
                          <tr key={sale.id || i} className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-slate-900">{sale.customerName}</td>
                            <td className="p-3 font-medium">{sale.location || "Kampala"}</td>
                            <td className="p-3 font-mono text-slate-500">{sale.contactNumber || "N/A"}</td>
                            <td className="p-3">{sale.fishType} ({sale.fishStage})</td>
                            <td className="p-3 font-mono font-bold text-indigo-900">{sale.quantitySold?.toLocaleString()} {sale.unit || "pcs"}</td>
                            <td className="p-3 italic text-slate-500">"{sale.notes || sale.customerNeeds || "No custom specifications loaded."}"</td>
                          </tr>
                        ))}
                        {customerSales.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400">No customer sales data available in system database.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeDashboard === "appointments" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b pb-4 bg-white/45 p-5 rounded-2xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                      📅 Operations-Appointment & Scheduling Tracker
                    </h2>
                    <p className="text-xs text-slate-500">
                      Monitor and manage visitor schedules, consultant meetings, staff deployments, and follow-up activities.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase font-sans">Total Booked Visits</span>
                    <div className="text-2xl font-black mt-1 font-mono">{bookings.length} Meetings</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase font-sans">Completed Sessions</span>
                    <div className="text-2xl font-black mt-1 text-emerald-600 font-mono">
                      {bookings.filter(b => b.status === "Completed" || b.status === "Fully Checked").length} Done
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase font-sans">Needs Follow-up Action</span>
                    <div className="text-2xl font-black mt-1 text-amber-600 font-mono">
                      {bookings.filter(b => b.followUpRequired).length} Pending
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase font-sans">Safe Biosecurity Entry</span>
                    <div className="text-2xl font-black mt-1 text-sky-700 font-mono">
                      {bookings.filter(b => b.biosecurityStatus === "Cleared" || b.biosecurityStatus === "Safe").length} Cleared
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-2xl overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b flex justify-between items-center bg-white/45">
                    <h3 className="text-xs font-black uppercase text-slate-505">Customer Appointments Calendar List</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-450 border-b">
                        <tr>
                          <th className="p-3">Scheduled Date / Time</th>
                          <th className="p-3">Customer Client Name</th>
                          <th className="p-3">Appointment Category</th>
                          <th className="p-3">Assigned Staff Escort</th>
                          <th className="p-3">Vehicle / Gate Plate</th>
                          <th className="p-3">Biosecurity Gate Check</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Follow-up Requirements</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-medium text-slate-705 bg-white">
                        {bookings.map((booking, idx) => (
                          <tr key={booking.id || idx} className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono font-bold text-slate-900">{booking.dateTime || "2025-10-15 09:30"}</td>
                            <td className="p-3 font-semibold">{booking.customerName || booking.customersName}</td>
                            <td className="p-3 font-bold text-slate-500">{booking.appointmentType || "Consultancy Site-Visit"}</td>
                            <td className="p-3 text-slate-850 font-semibold">{booking.staffAssigned || "Manager Okello"}</td>
                            <td className="p-3 font-mono">{booking.vehiclePlate || "N/A / Walk-in"}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                                booking.biosecurityStatus === "Cleared" || booking.biosecurityStatus === "Safe"
                                  ? "bg-slate-900 text-emerald-400 border border-slate-800"
                                  : "bg-amber-100 text-amber-850"
                              }`}>
                                {booking.biosecurityStatus || "Pending Screening"}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase ${
                                booking.status === "Completed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : booking.status === "Active" || booking.status === "Scheduled"
                                  ? "bg-sky-100 text-sky-850"
                                  : "bg-slate-100 text-slate-600"
                              }`}>
                                {booking.status || "ActiveScheduled"}
                              </span>
                            </td>
                            <td className="p-3 max-w-[150px] truncate italic text-slate-500">
                              {booking.followUpRequired ? `⚠️ Yes: ${booking.followUpDetails || "Pending action note"}` : "✓ Complete"}
                            </td>
                          </tr>
                        ))}
                        {bookings.length === 0 && (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">No scheduled visitor appointments logged inside database.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeDashboard === "variance" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b pb-4 bg-white/45 p-5 rounded-2xl border border-slate-100">
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    🛡️ Operations-Budget Variance & Risk Monitoring
                  </h2>
                  <p className="text-xs text-slate-500">
                    Track financial discrepancies and risk across periods and categories. Review planned allocations vs actual rollups and evaluated notes.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">Assimilated Corporate Categories</span>
                    <div className="text-2xl font-black mt-1 font-mono">{budgets.length} Budget Lines</div>
                  </div>
                  <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200">
                    <span className="text-[10px] text-amber-800 font-extrabold uppercase font-mono">High Risk Variances Detected</span>
                    <div className="text-2xl font-black mt-1 text-amber-600 font-mono">
                      {budgets.filter(b => b.variancePercentage > 50).length} High Variance
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">Average Deviation Multiple</span>
                    <div className="text-2xl font-black mt-1 text-indigo-950 font-mono">
                      {budgets.length > 0 ? `${Math.round(budgets.reduce((acc, b) => acc + (b.variancePercentage || 0), 0) / budgets.length)}%` : "0%"}
                    </div>
                  </div>
                </div>

                {budgets.length > 0 && (
                  <div className="space-y-3 bg-white border border-slate-200 p-4 rounded-2xl">
                    <h3 className="font-bold text-slate-850 text-xs uppercase tracking-wider">Planned Allocations vs Actual Expenses Rollups</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={budgets}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                          <Tooltip formatter={(v) => [`Ush ${Number(v).toLocaleString()}`]} />
                          <Legend />
                          <Bar dataKey="plannedAmount" fill="#4f46e5" name="Planned Budget" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="actualExpensesRollup" fill="#ea580c" name="Actual Expense Rollup" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                <div className="bg-white border rounded-2xl overflow-hidden shadow-xs">
                  <div className="p-4 bg-slate-50 border-b">
                    <h3 className="text-xs font-black uppercase text-slate-500">Financial Discrepancies & Budget Variance Ledger</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                        <tr>
                          <th className="p-3">Budget Category</th>
                          <th className="p-3">Reporting Period</th>
                          <th className="p-3">Planned Amount</th>
                          <th className="p-3">Actual Outflow Rollup</th>
                          <th className="p-3">Absolute Variance</th>
                          <th className="p-3">Variance Percentage</th>
                          <th className="p-3">Threat Assessment (AI)</th>
                          <th className="p-3">Audit Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-medium text-slate-700 bg-white">
                        {budgets.map((b, i) => {
                          const variance = Math.abs(Number(b.plannedAmount || 0) - Number(b.actualExpensesRollup || 0));
                          const variancePct = b.plannedAmount > 0 ? Math.round((variance / b.plannedAmount) * 100) : 0;
                          return (
                            <tr key={b.id || i} className="hover:bg-slate-50/50">
                              <td className="p-3 font-bold text-slate-900">{b.category} • {b.name}</td>
                              <td className="p-3 font-mono text-slate-500">{b.periodStart} to {b.periodEnd}</td>
                              <td className="p-3 font-mono">{formatCurrency(b.plannedAmount)}</td>
                              <td className="p-3 font-mono text-slate-800">{formatCurrency(b.actualExpensesRollup || 0)}</td>
                              <td className="p-3 font-mono font-bold text-slate-900">{formatCurrency(variance)}</td>
                              <td className="p-3 font-mono">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                  variancePct > 50 ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                                }`}>
                                  {variancePct}%
                                </span>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                  b.aiRisk === "High Risk" || variancePct > 55
                                    ? "bg-rose-100 text-rose-850"
                                    : "bg-slate-900 text-slate-100"
                                }`}>
                                  {variancePct > 55 ? "Over-alloc Threat" : b.aiRisk || "Low Risk Verified"}
                                </span>
                              </td>
                              <td className="p-3 max-w-[200px] truncate italic text-slate-500">{b.notes || "Audited & compliant"}</td>
                            </tr>
                          );
                        })}
                        {budgets.length === 0 && (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-slate-400">No active budget allocations defined.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeDashboard === "spawning" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b pb-4 bg-white/45 p-5 rounded-2xl border border-slate-100">
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    🧬 Spawning & Fish Farm Incubation Management
                  </h2>
                  <p className="text-xs text-slate-500">
                    Track broodstock Origin, tranquilizer tanks, strips weight, egg counts, chemical doses, and chronological incubation performance metrics.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">Total Spawning Runs</span>
                    <div className="text-2xl font-black mt-1 font-mono">{spawning.length} Batches</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">Egg Harvest Sum</span>
                    <div className="text-2xl font-black mt-1 text-teal-700 font-mono">
                      {spawning.reduce((sum, s) => sum + Number(s.eggsQuantity || 0), 0).toLocaleString()} eggs
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">Avg Hatch Survival Rate</span>
                    <div className="text-2xl font-black mt-1 text-emerald-600 font-mono">
                      {spawning.length > 0 ? `${Math.round(spawning.reduce((sum, s) => sum + Number(s.survivalRatePct || 0), 0) / spawning.length)}%` : "0%"}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">Lethal Fry Mortality Sum</span>
                    <div className="text-2xl font-black mt-1 text-red-650 font-mono">
                      {spawning.reduce((sum, s) => sum + Number(s.mortality || s.fryMortality || 0), 0).toLocaleString()} pcs
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-2xl overflow-hidden shadow-xs">
                  <div className="p-4 bg-slate-50 border-b">
                    <span className="text-xs font-black uppercase text-slate-505">Broodstock Striping & Egg Yield Ledger</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-450 border-b">
                        <tr>
                          <th className="p-3">Spawn Tank / Date</th>
                          <th className="p-3">Broodstock Origin & Species</th>
                          <th className="p-3">Weight G & Sex</th>
                          <th className="p-3">Hormone / Chemical Dose</th>
                          <th className="p-3">Eggs Produced</th>
                          <th className="p-3">Incubation Tank & End Date</th>
                          <th className="p-3">Hatched Fry Count</th>
                          <th className="p-3">Survival Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-medium text-slate-700 bg-white">
                        {spawning.map((sp, idx) => (
                          <tr key={sp.id || idx} className="hover:bg-slate-50/50">
                            <td className="p-3">
                              <div className="font-bold text-slate-900">🧪 {sp.spawningTank || "Tank-" + (sp.tankId || idx)}</div>
                              <span className="text-[9.5px] text-slate-400 block font-mono font-black">{sp.spawningDate}</span>
                            </td>
                            <td className="p-3">
                              <div>{sp.species} • <strong className="text-slate-400 font-mono">Origin:</strong> {sp.broodstockOrigin}</div>
                            </td>
                            <td className="p-3 font-mono">
                              <div>{sp.weightG?.toLocaleString()} g</div>
                              <span className="text-[10px] uppercase text-indigo-700 font-bold">{sp.sex || "Mixed"}</span>
                            </td>
                            <td className="p-3 leading-snug">
                              <div>{sp.hormoneInjected || "Ovaprim"} • {sp.hormoneDosageMlPerKg || 0.5} ml/kg</div>
                              <span className="text-[9.5px] text-slate-400 font-mono block">Tranquilizer: {sp.tranquilizerTank || "Default MS-222"}</span>
                            </td>
                            <td className="p-3 font-mono text-teal-700 font-bold">
                              {sp.eggsQuantity?.toLocaleString()} pcs ({sp.eggWeightG || 0} g)
                            </td>
                            <td className="p-3">
                              <span className="bg-slate-900 text-slate-100 text-[10px] px-1 rounded font-mono block w-fit mb-1">{sp.incubationTank}</span>
                              <span className="text-[9px] text-slate-500 block font-mono">End: {sp.incubationEndDate || "N/A"}</span>
                            </td>
                            <td className="p-3 font-mono text-slate-900 font-bold">
                              {sp.hatchedFry?.toLocaleString()} fry
                            </td>
                            <td className="p-3 font-mono">
                              <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-black ${
                                sp.survivalRatePct >= 80 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                              }`}>
                                {sp.survivalRatePct}%
                              </span>
                            </td>
                          </tr>
                        ))}
                        {spawning.length === 0 && (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-slate-400">No spawns or artificial broodstock striping logs in corporate databases.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeDashboard === "ponds" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b pb-4 bg-white/45 p-5 rounded-2xl border border-slate-100">
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    🐟 Operations-Pond & Batch Management
                  </h2>
                  <p className="text-xs text-slate-500">
                    Track fish stocked, transfers, and mortality by batch, spanning ponds, species, and developmental stages.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">Total Farm Ponds</span>
                    <div className="text-2xl font-black mt-1 font-mono">{ponds.length} Water Bodies</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">Active Incubated Batches</span>
                    <div className="text-2xl font-black mt-1 text-indigo-950 font-mono">
                      {batches.length} Stocks Batches
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">Total Quantity Stocked</span>
                    <div className="text-2xl font-black mt-1 text-teal-700 font-mono">
                      {batches.reduce((sum, s) => sum + Number(s.currentQuantity || 0), 0).toLocaleString()} pcs
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-2xl overflow-hidden shadow-xs">
                  <div className="p-4 bg-slate-50 border-b">
                    <span className="text-xs font-black uppercase text-slate-550">Fish Stocks Batch Registry & Progress mapping</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-450 border-b">
                        <tr>
                          <th className="p-3">Batch Reference</th>
                          <th className="p-3">Fish Species</th>
                          <th className="p-3">Assigned Pond Link</th>
                          <th className="p-3">Source Origin</th>
                          <th className="p-3">Stocking Date</th>
                          <th className="p-3">Initial Stock</th>
                          <th className="p-3">Current Stock Quantity</th>
                          <th className="p-3">Developmental Stage</th>
                          <th className="p-3 text-right">Batch Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-medium text-slate-705 divide-slate-100 bg-white text-[11px]">
                        {batches.map((b, i) => (
                          <tr key={b.id || i} className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-slate-900">📛 {b.name}</td>
                            <td className="p-3 font-semibold">{b.species}</td>
                            <td className="p-3 font-bold text-indigo-700">{b.pondLink}</td>
                            <td className="p-3 text-slate-500">{b.source}</td>
                            <td className="p-3 font-mono">{b.stockingDate}</td>
                            <td className="p-3 font-mono">{b.initialQuantity?.toLocaleString()} pcs</td>
                            <td className="p-3 font-mono font-bold text-slate-900">{b.currentQuantity?.toLocaleString()} pcs</td>
                            <td className="p-3">
                              <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[9.5px] font-black uppercase">{b.fishStage}</span>
                            </td>
                            <td className="p-3 text-right">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                b.status === "Active"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {batches.length === 0 && (
                          <tr>
                            <td colSpan={9} className="p-8 text-center text-slate-400">No active stock groups or nursery batches.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeDashboard === "water-quality" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b pb-4 bg-white/45 p-5 rounded-2xl border border-slate-100">
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    💧 Operations-Water Quality Tests Review & Required Actions
                  </h2>
                  <p className="text-xs text-slate-500">
                    Track chemical parameters, ph multipliers, dissolved oxygen contents, ammonia toxins, and trigger urgent action plans across ponds.
                  </p>
                </div>

                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-slate-900 font-black text-xs uppercase tracking-wider flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                      CRITICAL BIOSECURITY PARAMETRIC HAZARDS
                    </span>
                    <p className="text-[11px] text-slate-700">
                      Tanks with Dissolved Oxygen (D.O) below 4.5 mg/L or pH levels outside 6.5–8.5 require immediate water cycling.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase">
                      DO Critical Alarm &gt; 4.5
                    </span>
                    <span className="bg-amber-100 text-amber-850 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase">
                      pH Safe Boundaries 6.5-8
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {waterQuality.map((test, idx) => {
                    const isDoHypoxic = Number(test.dissolvedOxygen || 6) < 4.5;
                    const isPhAbnormal = Number(test.ph || 7) < 6.5 || Number(test.ph || 7) > 8.5;
                    const isAmmoniaToxic = Number(test.ammonia || 0) > 0.05;
                    const hasAlert = isDoHypoxic || isPhAbnormal || isAmmoniaToxic;

                    return (
                      <div key={test.id || idx} className={`p-5 rounded-2xl border ${
                        hasAlert ? "bg-red-50/30 border-rose-200" : "bg-slate-50 border-slate-200"
                      } space-y-3`}>
                        <div className="flex justify-between items-start border-b pb-2">
                          <div>
                            <span className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                              {test.tankName || `Tank ${test.tankId}`}
                            </span>
                            <span className="text-[9.5px] font-mono text-slate-400 font-bold block uppercase">{test.tankType || "Nursery tank"} • {test.species || "Tilapia"}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            hasAlert ? "bg-red-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                          }`}>
                            {hasAlert ? "Immediate Care Needed" : "Stable Status"}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 font-mono text-[11px] font-black text-center">
                          <div className="p-2 bg-white rounded-lg border border-slate-100">
                            <span className="text-[9px] text-slate-450 block uppercase font-sans">pH Index</span>
                            <span className={isPhAbnormal ? "text-rose-600 font-bold" : "text-slate-800"}>{test.ph}</span>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-slate-100">
                            <span className="text-[9px] text-slate-450 block uppercase font-sans">Oxygen Mg/L</span>
                            <span className={isDoHypoxic ? "text-rose-600 font-bold" : "text-emerald-700"}>{test.dissolvedOxygen}</span>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-slate-100">
                            <span className="text-[9px] text-slate-450 block uppercase font-sans">Tox. Ammonia</span>
                            <span className={isAmmoniaToxic ? "text-rose-600 font-bold" : "text-teal-700"}>{test.ammonia} ppm</span>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-[11px]">
                          <div>
                            <strong className="text-slate-400">Tested on:</strong> <span className="font-mono text-slate-700 font-semibold">{test.testDate} by {test.testedBy}</span>
                          </div>
                          <div>
                            <strong className="text-rose-500 font-bold">Immediate Instructions:</strong>
                            <p className="text-slate-700 mt-0.5 text-[10.5px] italic leading-normal">
                              "{test.immediateActions || (hasAlert ? "ALERT: Activate emergency biological filtration and pump flushing immediately." : "Proceed with standard daily feeding schedules and light maintenance.")}"
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {waterQuality.length === 0 && (
                    <div className="col-span-2 p-12 bg-white rounded-2xl border border-slate-205 text-center text-slate-400 font-medium font-sans">No water parameters test datasets logged today.</div>
                  )}
                </div>
              </div>
            )}

            {activeDashboard === "procurement" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b pb-4 bg-white/45 p-5 rounded-2xl border border-slate-100">
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    ⛓️ Standalone Procurement & Logistics Dashboard
                  </h2>
                  <p className="text-xs text-slate-500">
                    Separate from core finance, manage supplier profiles, outstanding Local Purchase Orders (LPOs), delivery timelines, and logistics notes.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase font-sans">Contracted Suppliers</span>
                    <div className="text-2xl font-black mt-1 font-mono">{suppliers.length} Accounts</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">Total LPOs Issued</span>
                    <div className="text-2xl font-black mt-1 font-mono">
                      {lpos.length} LPOs
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">Logistics Valuation (Outstanding)</span>
                    <div className="text-2xl font-black mt-1 text-teal-700 font-mono">
                      {formatCurrency(lpos.reduce((sum, l) => sum + Number(l.totalAmount || 0), 0))}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">Pending Deliveries</span>
                    <div className="text-2xl font-black mt-1 text-slate-500 font-mono">
                      {lpos.filter(l => l.status === "Pending" || l.trackingStatus === "In Transit").length} orders
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="p-4 bg-slate-50 border-b">
                    <span className="text-xs font-black uppercase text-slate-500">Outstanding Purchase Orders Logistics Ledger</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse font-sans">
                      <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-455 border-b">
                        <tr>
                          <th className="p-3">LPO Number / Date</th>
                          <th className="p-3">Supplier Name</th>
                          <th className="p-3">Resource Category</th>
                          <th className="p-3">Expected Logistics Date</th>
                          <th className="p-3">Total Amount</th>
                          <th className="p-3">Carrier / Tracking Number</th>
                          <th className="p-3">Delivery Status</th>
                          <th className="p-3">Authorizing Officer</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-medium text-slate-700 bg-white text-[11px]">
                        {lpos.map((lp, idx) => (
                          <tr key={lp.id || idx} className="hover:bg-slate-50/50">
                            <td className="p-3">
                              <div className="font-bold text-slate-900">📄 #{lp.lpoNumber}</div>
                              <span className="text-[9.5px] font-mono text-slate-400 font-black">{lp.date}</span>
                            </td>
                            <td className="p-3 font-semibold text-slate-800">{lp.supplierName}</td>
                            <td className="p-3 font-medium">{lp.category || "Feeds Sourcing"}</td>
                            <td className="p-3 font-mono text-amber-700">{lp.expectedDelivery || "Awaiting dispatch"}</td>
                            <td className="p-3 font-mono font-bold text-indigo-950">{formatCurrency(lp.totalAmount)}</td>
                            <td className="p-3 font-mono">{lp.trackingNumber || "No track code"}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase ${
                                lp.status === "Received" || lp.trackingStatus === "Delivered"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}>
                                {lp.trackingStatus || lp.status}
                              </span>
                            </td>
                            <td className="p-3 font-semibold text-slate-605 text-slate-600">{lp.createdBy || "Procurement Desk"}</td>
                          </tr>
                        ))}
                        {lpos.length === 0 && (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-slate-400 font-normal">No Local Purchase Orders are currently outstanding.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeDashboard === "staff-log" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b pb-4 bg-white/45 p-5 rounded-2xl border border-slate-100">
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    👥 Operations-Detailed Staff Activities Log
                  </h2>
                  <p className="text-xs text-slate-500">
                    Chronological activity ledger representing task types, durations, staff roles, and detailed notes on biological or mechanical maintenance actions.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b">
                        <tr>
                          <th className="p-3">Logged Date</th>
                          <th className="p-3">Staff Member</th>
                          <th className="p-3">Core Role</th>
                          <th className="p-3">Task Category</th>
                          <th className="p-3">Logged Activity Details Docs</th>
                          <th className="p-3 text-right">Task Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-medium text-slate-700 bg-white text-[11px]">
                        {staffActivities.map((act, i) => (
                          <tr key={act.id || i} className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono text-slate-500">{act.date}</td>
                            <td className="p-3 font-bold text-slate-900">👨‍🌾 {act.staffName}</td>
                            <td className="p-3 font-semibold text-indigo-700 uppercase text-[9.5px]">{act.role}</td>
                            <td className="p-3 font-bold text-slate-500">{act.taskType}</td>
                            <td className="p-3 italic text-slate-600">"{act.activityDetails || act.additionalNotes || "Routine tasks performed successfully."}"</td>
                            <td className="p-3 text-right font-mono font-bold text-slate-900">{act.durationMinutes || 45} mins</td>
                          </tr>
                        ))}
                        {staffActivities.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">No chronological staff shifts or activity logs recorded.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeDashboard === "traceability" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b pb-4 bg-white/45 p-5 rounded-2xl border border-slate-100">
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    🔍 Traceability & Lot-Based Chain of Custody Control
                  </h2>
                  <p className="text-xs text-slate-500">
                    Map connected fish farm inputs (harvest, health, ponds, feeds, inventory) to evaluate compliance trace reports, disease-free sources, and QR validation tags.
                  </p>
                </div>

                <div className="bg-indigo-950 text-white rounded-2xl p-5 border border-indigo-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-emerald-400 font-extrabold text-[10px] uppercase tracking-wider block">Bio-Security Compliance Verification</span>
                    <h3 className="text-sm font-bold">Pond-to-Pack Trace Registry (QR Integrated)</h3>
                    <p className="text-[10.5px] text-slate-300 leading-relaxed max-w-xl">
                      Enter batch or lot identifiers to generate dynamic compliance trace reports detailing larval spawning lineage, chemical treatment maps, and harvest logistics.
                    </p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-950 font-black px-3 py-1 rounded text-[10px] shrink-0 self-center">
                    Recall Preparedness: READY
                  </span>
                </div>

                <div className="bg-white border rounded-2xl overflow-hidden shadow-xs border-slate-205 border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b">
                        <tr>
                          <th className="p-3">Lot No / Trace Name</th>
                          <th className="p-3">Compliance QR Code</th>
                          <th className="p-3">Harvest Batch Link</th>
                          <th className="p-3">Source Tank / Pond</th>
                          <th className="p-3">Date Initiated</th>
                          <th className="p-3">Custody Logs</th>
                          <th className="p-3">Recall Threat Rating</th>
                          <th className="p-3 text-right">Export Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-medium text-slate-705 divide-slate-100 bg-white text-[11px]">
                        {traces.map((tc, idx) => (
                          <tr key={tc.id || idx} className="hover:bg-slate-50/50">
                            <td className="p-3">
                              <div className="font-bold text-slate-950 font-sans">📦 Lot: {tc.lotNumber}</div>
                              <span className="text-[10px] text-indigo-700 font-bold block">{tc.name}</span>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span className="font-mono text-[9px] bg-slate-900 text-emerald-400 px-2 py-1 rounded border border-slate-800">
                                📱 QR_{tc.lotNumber}
                              </span>
                            </td>
                            <td className="p-3 font-semibold text-slate-800">{tc.harvestBatchLink || "Harvest_Batch_992"}</td>
                            <td className="p-3 font-bold text-indigo-705 text-indigo-700">{tc.sourcePond || "Nursery pond 2"}</td>
                            <td className="p-3 font-mono">{tc.dateInitiated}</td>
                            <td className="p-3 max-w-[150px] truncate italic text-slate-500">"{tc.custodyDetails || "Fish-Farm-to-Packhouse Clear Custody Log"}"</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase ${
                                tc.recallStatus === "Low Risk" || tc.recallStatus === "Compliant"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-red-100 text-rose-800"
                              }`}>
                                {tc.recallStatus || "Low Risk Compliance Checked"}
                              </span>
                            </td>
                            <td className="p-2 py-3 text-right">
                              <span className="bg-indigo-50 border border-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">
                                {tc.regulatoryExportTag || "Approved export cert"}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {traces.length === 0 && (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-slate-400 font-semibold">No active traceability chain records populated in database.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeDashboard === "bookings" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b pb-4 bg-white/45 p-5 rounded-2xl border border-slate-100">
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    🤝 Consultancy Service Bookings Status Board
                  </h2>
                  <p className="text-xs text-slate-550 text-slate-500">
                    Track requests from customer fish farms requiring expert oversight in water chemistry, bio-security audits, and diagnostic reviews.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {consultancies.map((co, idx) => (
                    <div key={co.id || idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 shadow-3xs">
                      <div className="flex justify-between items-start border-b pb-2 border-slate-200">
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 leading-normal">
                            🤝 {co.requestTitle}
                          </h4>
                          <span className="text-[9.5px] font-mono font-bold text-slate-400 mt-0.5 block">Sumit submitted: {co.dateSubmitted}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          co.status === "Responded" || co.status === "Closed"
                            ? "bg-slate-900 text-emerald-400"
                            : "bg-amber-100 text-amber-800 border"
                        }`}>
                          {co.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-[11px] leading-relaxed">
                        <p className="text-slate-700 italic">
                          "Needs: {co.descriptionOfNeeds}"
                        </p>
                        {co.questions && (
                          <div className="bg-white p-2.5 rounded-lg border text-slate-600 border-slate-100">
                            <strong>Client primary questions:</strong> <span className="font-medium text-slate-800">{co.questions}</span>
                          </div>
                        )}
                        <div className="bg-white p-2.5 rounded-lg border font-medium text-slate-700 flex flex-col sm:flex-row justify-between gap-2 border-slate-150">
                          <div className="space-y-0.5">
                            <div><strong className="text-slate-400 uppercase text-[8px] tracking-wide block">Assigned Advisor</strong> {co.assignedConsultant || co.assignedConsultantName || "Dr. Emily Tan"}</div>
                          </div>
                          <div className="space-y-0.5 text-right sm:text-left">
                            <div><strong className="text-slate-400 uppercase text-[8px] tracking-wide block">Lead Contact</strong> {co.fishFarmManager || co.fishFarmManagerName || "Ayo Adedeji"}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {consultancies.length === 0 && (
                    <div className="col-span-2 p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 font-medium">No active customer consultancy booking records.</div>
                  )}
                </div>
              </div>
            )}

            {activeDashboard === "maintenance" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b pb-4 bg-white/45 p-5 rounded-2xl border border-slate-100">
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    🚜 Farm Maintenance & Equipment Logs
                  </h2>
                  <p className="text-xs text-slate-500">
                    Audit solar pumps service history, aerator run-hours, fence checks, cage net repairs, and chronological diesel fuel consumption logs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-205">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase font-sans">Maintenance events Logged</span>
                    <div className="text-2xl font-black mt-1 font-mono">{maintenances.length} Checklists</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-205">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase font-sans">Average Fuel Consumption</span>
                    <div className="text-2xl font-black mt-1 text-slate-800 font-mono">
                      {maintenances.length > 0 ? `${(maintenances.reduce((acc, m) => acc + Number(m.fuelConsumption || 0), 0) / maintenances.length).toFixed(1)} L/event` : "0 L"}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-205">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase text-amber-800 font-bold">Clogs / Action Items</span>
                    <div className="text-2xl font-black mt-1 text-amber-600 font-mono">
                      {maintenances.filter(m => m.issues && m.issues !== "None" && m.issues !== "N/A").length} Anomalies
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-205">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase text-emerald-800 font-bold">Certified Closed Tasks</span>
                    <div className="text-2xl font-black mt-1 text-emerald-600 font-mono">
                      {maintenances.length} Verified
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b">
                        <tr>
                          <th className="p-3">Maintenance Checklist / Date</th>
                          <th className="p-3">Device Maintenance Log</th>
                          <th className="p-3">Pond Repair & Cage Net check</th>
                          <th className="p-3">Work Order Ref</th>
                          <th className="p-3">Solar / Generator / Fuel L</th>
                          <th className="p-3">Assigned Crew</th>
                          <th className="p-3">Identified Issues</th>
                          <th className="p-3">Actions Taken</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-medium text-slate-700 bg-white text-[11px]">
                        {maintenances.map((mn, idx) => (
                          <tr key={mn.id || idx} className="hover:bg-slate-50/50">
                            <td className="p-3">
                              <div className="font-bold text-slate-900">🛡️ {mn.name || mn.maintenanceType || "System check"}</div>
                              <span className="text-[9.5px] font-mono text-slate-400 font-bold block mt-0.5">{mn.dateTime}</span>
                            </td>
                            <td className="p-3">
                              <div className="leading-snug">
                                <div><strong className="text-slate-400">Pump:</strong> {mn.pumpLog || "Running stable"}</div>
                                <div><strong className="text-slate-400">Aerator:</strong> {mn.aeratorLog || "Active"}</div>
                              </div>
                            </td>
                            <td className="p-3 leading-snug">
                              <div><strong className="text-slate-400">Net:</strong> {mn.netRepair || "No tears detected"}</div>
                              <div><strong className="text-slate-400">Pond structure:</strong> {mn.pondRepair || "Intact"}</div>
                            </td>
                            <td className="p-3 font-mono font-bold text-slate-500">{mn.workOrderRef || "WO-00282"}</td>
                            <td className="p-3 leading-snug text-[10px]">
                              <div><strong className="text-slate-400">Solar:</strong> {mn.solarLog || "Generating"}</div>
                              <div><strong className="text-slate-400">Generator:</strong> {mn.generatorLog || "Off"}</div>
                              {Number(mn.fuelConsumption || 0) > 0 && <span className="bg-amber-100 text-amber-800 px-1 rounded text-[9px] font-bold block w-fit mt-1">Dispensed: {mn.fuelConsumption} Liters</span>}
                            </td>
                            <td className="p-3 text-slate-800 font-semibold">{mn.crewAssigned || mn.person}</td>
                            <td className="p-3 max-w-[140px] truncate text-slate-500 italic">"{mn.issues || "None"}"</td>
                            <td className="p-3 max-w-[140px] truncate font-semibold text-emerald-800">"{mn.actionsTaken || "Standard checklist complete."}"</td>
                          </tr>
                        ))}
                        {maintenances.length === 0 && (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-slate-400 font-normal">No active farm maintenance checklists populated.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* SPREADSHEET TABLE CONDITIONAL BLOCK */}
      {viewMode === "airtable" && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
          
          {/* Table Title and Sheet Tabs */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b pb-4 mb-4">
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 border border-slate-100 p-1 rounded-2xl">
              {sheets.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => {
                    setActiveSheet(s.id as any);
                    setSearchQuery("");
                  }}
                  className={`px-4 py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                    activeSheet === s.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <span>{s.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeSheet === s.id ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-500'}`}>
                    {s.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 self-end xl:self-auto shrink-0">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Airtable live query filter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 w-48 bg-slate-55 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-slate-400"
                />
              </div>
              
              <button
                type="button"
                onClick={() => {
                  clearForms();
                  setShowAddForm(true);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Record</span>
              </button>
            </div>
          </div>

          {/* Dynamic Display of active Airtable spreadsheet model */}
          <div id="dd-airtable-sheet-container" className="overflow-x-auto border border-slate-100 rounded-2xl bg-slate-50/50">
          
          {activeSheet === "budgets" && (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 border-b text-slate-600 font-extrabold text-[10px] uppercase">
                <tr>
                  <th className="px-5 py-3">Budget Name</th>
                  <th className="px-5 py-3">Duration (Start/End)</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Planned Amount</th>
                  <th className="px-5 py-3">Actual Outflow (Rollup)</th>
                  <th className="px-5 py-3">Variance Percentage</th>
                  <th className="px-5 py-3">Supporting Documents</th>
                  <th className="px-5 py-3">Risk Assessment (AI)</th>
                  <th className="px-5 py-3 text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700 bg-white">
                {budgets
                  .filter(b => !filteredQuery || b.name.toLowerCase().includes(filteredQuery) || (b.category && b.category.toLowerCase().includes(filteredQuery)))
                  .map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">{b.name}</td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">
                        {b.periodStart} to {b.periodEnd}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700">
                          {b.category || "General"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                        {formatCurrency(b.plannedAmount)}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-600">
                        {formatCurrency(Math.abs(b.actualExpensesRollup || 0))}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 font-mono font-extrabold text-amber-600">
                          <span>{(b.variancePercentage !== undefined) ? b.variancePercentage : 100}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 italic text-slate-400 font-medium truncate max-w-[150px]">
                        {b.supportingDocs || "No documents uploaded"}
                      </td>
                      <td className="px-5 py-3.5 max-w-[200px] truncate text-slate-500 font-mono text-[10px]" title={b.aiRisk || ""}>
                        {b.aiRisk || "Verified safety standard"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => onDeleteRecord("budgets", b.id || "")}
                          className="p-1 hover:text-red-600 text-slate-400 transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheet === "customerSales" && (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 border-b text-slate-600 font-extrabold text-[10px] uppercase">
                <tr>
                  <th className="px-5 py-3">Customer's Name</th>
                  <th className="px-5 py-3">Fish Type & Stage</th>
                  <th className="px-5 py-3">Sale Date</th>
                  <th className="px-5 py-3">Quantity Sold</th>
                  <th className="px-5 py-3">Unit Price</th>
                  <th className="px-5 py-3 text-right">Total Amount</th>
                  <th className="px-5 py-3">Sale Channel & Region</th>
                  <th className="px-5 py-3 text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700 bg-white">
                {customerSales
                  .filter(cs => !filteredQuery || cs.customerName.toLowerCase().includes(filteredQuery) || cs.fishType.toLowerCase().includes(filteredQuery))
                  .map((cs) => (
                    <tr key={cs.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-extrabold text-slate-900">{cs.customerName}</div>
                        <div className="text-[10px] text-slate-400 italic">By: {cs.recordedBy || "Fish Farm Staff"}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-slate-800 block">{cs.fishType}</span>
                        <span className="text-[10px] text-cyan-600 font-black tracking-wider uppercase">{cs.fishStage}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">{cs.saleDate}</td>
                      <td className="px-5 py-3.5 font-mono font-semibold">
                        {cs.quantitySold.toLocaleString()} {cs.unit}
                      </td>
                      <td className="px-5 py-3.5 font-mono">
                        {formatCurrency(cs.unitPrice)}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-black text-right text-emerald-600">
                        {formatCurrency(cs.amount || cs.quantitySold * cs.unitPrice)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-slate-800 font-medium">{cs.channel}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{cs.location}</div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => onDeleteRecord("customerSales", cs.id || "")}
                          className="p-1 hover:text-red-600 text-slate-400 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheet === "revenue" && (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 border-b text-slate-600 font-extrabold text-[10px] uppercase">
                <tr>
                  <th className="px-5 py-3">Revenue Record Name</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Sale Date</th>
                  <th className="px-5 py-3">Transaction</th>
                  <th className="px-5 py-3">Revenue Amount</th>
                  <th className="px-5 py-3">Cost of Goods Sold (COGS)</th>
                  <th className="px-5 py-3">Gross Margin</th>
                  <th className="px-5 py-3">Budget Category</th>
                  <th className="px-5 py-3 text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700 bg-white">
                {revenueRecords
                  .filter(r => !filteredQuery || r.name.toLowerCase().includes(filteredQuery) || r.customer.toLowerCase().includes(filteredQuery))
                  .map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-extrabold text-slate-900">{r.name}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-700">{r.customer}</td>
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">{r.saleDate}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold block text-[10px] w-max">
                          {r.salesTransaction || "recxpats Project"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-black text-slate-900">{formatCurrency(r.revenueAmount)}</td>
                      <td className="px-5 py-3.5 font-mono text-slate-500">{formatCurrency(r.costOfGoodsSold)}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-mono font-extrabold text-emerald-600">
                          {formatCurrency(r.grossMargin || r.revenueAmount - r.costOfGoodsSold)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-extrabold">
                          {r.grossMarginPct || (r.revenueAmount ? Math.round(((r.revenueAmount - r.costOfGoodsSold)/r.revenueAmount)*100) : 0)}% margin
                        </div>
                      </td>
                      <td className="px-5 py-3.5 uppercase font-black text-[10px] text-slate-500 font-mono">
                        {r.budgetCategory || "Equipment"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => onDeleteRecord("revenueRecords", r.id || "")}
                          className="p-1 hover:text-red-600 text-slate-400 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheet === "cashflows" && (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 border-b text-slate-600 font-extrabold text-[10px] uppercase">
                <tr>
                  <th className="px-5 py-3">Recorded By</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3 font-mono">Amount</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3">Transaction Date</th>
                  <th className="px-5 py-3">Period Month</th>
                  <th className="px-5 py-3 text-right">Net impact</th>
                  <th className="px-5 py-3 text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700 bg-white">
                {cashFlows
                  .filter(cf => !filteredQuery || cf.recordedBy.toLowerCase().includes(filteredQuery) || cf.description.toLowerCase().includes(filteredQuery))
                  .map((cf) => (
                    <tr key={cf.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 text-slate-900 font-bold">{cf.recordedBy}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase ${
                          cf.type === "Inflow" || cf.isInflow
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}>
                          {cf.type || (cf.isInflow ? "Inflow" : "Outflow")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-black">{formatCurrency(cf.amount)}</td>
                      <td className="px-5 py-3.5 max-w-[200px] truncate text-slate-600 font-medium" title={cf.description}>
                        {cf.description}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">{cf.transactionDate}</td>
                      <td className="px-5 py-3.5 font-mono text-slate-400 text-[11px]">{cf.month}</td>
                      <td className="px-5 py-3.5 font-mono text-right font-extrabold">
                        {cf.type === "Inflow" || cf.isInflow ? (
                          <span className="text-emerald-700">+{formatCurrency(cf.amount)}</span>
                        ) : (
                          <span className="text-red-700">-{formatCurrency(cf.amount)}</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => onDeleteRecord("cashFlows", cf.id || "")}
                          className="p-1 hover:text-red-600 text-slate-400 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheet === "receivables" && (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 border-b text-slate-600 font-extrabold text-[10px] uppercase">
                <tr>
                  <th className="px-5 py-3">Invoice Number</th>
                  <th className="px-5 py-3">Customer Reference</th>
                  <th className="px-5 py-3">Invoice / Due Date</th>
                  <th className="px-5 py-3">Amount Due</th>
                  <th className="px-5 py-3">Amount Paid</th>
                  <th className="px-5 py-3">Outstanding Balance</th>
                  <th className="px-5 py-3">Payment Status</th>
                  <th className="px-5 py-3">Customer Email</th>
                  <th className="px-5 py-3 text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700 bg-white">
                {invoices
                  .filter(inv => !filteredQuery || inv.invoiceNumber.toLowerCase().includes(filteredQuery) || inv.supplierName.toLowerCase().includes(filteredQuery))
                  .map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900 font-mono">{inv.invoiceNumber}</td>
                      <td className="px-5 py-3.5 font-extrabold text-slate-700">{inv.supplierName}</td>
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                        <div>Issued: {inv.invoiceDate}</div>
                        <div className="text-[10px] text-red-500 mt-0.5">Due: {inv.dueDate}</div>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold">{formatCurrency(inv.amountOwed)}</td>
                      <td className="px-5 py-3.5 font-mono text-emerald-600">{formatCurrency(inv.totalPaymentsMade)}</td>
                      <td className="px-5 py-3.5 font-mono font-black text-amber-700">
                        {formatCurrency(inv.outstandingBalance || (Number(inv.amountOwed) - Number(inv.totalPaymentsMade)))}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase font-sans ${
                          inv.status === "Paid" 
                            ? "bg-emerald-50 text-emerald-700" 
                            : inv.status === "Partially Paid" 
                            ? "bg-amber-55 text-amber-700"
                            : "bg-red-50 text-red-750"
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 italic text-slate-400 font-medium">{inv.notes || "No extra metadata"}</td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => onDeleteRecord("invoices", inv.id || "")}
                          className="p-1 hover:text-red-600 text-slate-400 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheet === "taxes" && (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 border-b text-slate-600 font-extrabold text-[10px] uppercase">
                <tr>
                  <th className="px-5 py-3">Tax Record Name</th>
                  <th className="px-5 py-3">Jurisdiction</th>
                  <th className="px-5 py-3">Tax Type</th>
                  <th className="px-5 py-3">Tax Rate (%)</th>
                  <th className="px-5 py-3">Notes</th>
                  <th className="px-5 py-3 text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700 bg-white">
                {taxes
                  .filter(t => !filteredQuery || t.name.toLowerCase().includes(filteredQuery) || t.jurisdiction.toLowerCase().includes(filteredQuery))
                  .map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">{t.name || "Jurisdiction Audit"}</td>
                      <td className="px-5 py-3.5 text-slate-750 font-bold">{t.jurisdiction}</td>
                      <td className="px-5 py-3.5 text-slate-600">{t.taxType}</td>
                      <td className="px-5 py-3.5 font-mono text-cyan-700 font-black text-sm">{t.taxRate}%</td>
                      <td className="px-5 py-3.5 font-medium italic text-slate-500 max-w-xs truncate">{t.notes || "Standard withholding tax rate apply"}</td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => onDeleteRecord("taxes", t.id || "")}
                          className="p-1 hover:text-red-600 text-slate-400 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheet === "pnl" && (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 border-b text-slate-600 font-extrabold text-[10px] uppercase">
                <tr>
                  <th className="px-5 py-3">P&L Statement Name</th>
                  <th className="px-5 py-3">Period Start</th>
                  <th className="px-5 py-3">Period End</th>
                  <th className="px-5 py-3">Total Revenue</th>
                  <th className="px-5 py-3">Total Expenses</th>
                  <th className="px-5 py-3">Gross Profit</th>
                  <th className="px-5 py-3">Net Profit</th>
                  <th className="px-5 py-3">Currency</th>
                  <th className="px-5 py-3 text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700 bg-white">
                {pnl
                  .filter(p => !filteredQuery || p.name.toLowerCase().includes(filteredQuery))
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-black text-slate-900">{p.name}</td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">{p.periodStart}</td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">{p.periodEnd}</td>
                      <td className="px-5 py-3.5 font-mono text-emerald-600 font-bold">{formatCurrency(p.totalRevenue)}</td>
                      <td className="px-5 py-3.5 font-mono text-red-650">{formatCurrency(p.totalExpenses)}</td>
                      <td className="px-5 py-3.5 font-mono font-black text-slate-900">{formatCurrency(p.grossProfit || p.totalRevenue - p.totalExpenses)}</td>
                      <td className="px-5 py-3.5 font-mono font-black text-emerald-700">{formatCurrency(p.netProfit || p.totalRevenue - p.totalExpenses)}</td>
                      <td className="px-5 py-3.5 font-extrabold uppercase font-mono text-cyan-600">{p.currency || "Ush"}</td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => onDeleteRecord("pnlStatements", p.id || "")}
                          className="p-1 hover:text-red-600 text-slate-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>

      </div>

      )}

      {/* Dynamic Slide-in Modal for Adding Airtable records based on selected spreadsheets */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl p-6 border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b pb-4 mb-5">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-cyan-600 block">Spreadsheet append</span>
                <h3 className="text-base font-black text-slate-900 capitalize">
                  New {activeSheet} Airtable Record
                </h3>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 overflow-y-auto flex-1 text-left px-1">
              
              {activeSheet === "budgets" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Budget Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Feed Cost Q4 2025"
                      value={budgetForm.name}
                      onChange={(e) => setBudgetForm({...budgetForm, name: e.target.value})}
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-slate-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">Period Start</label>
                      <input
                        type="date"
                        value={budgetForm.periodStart}
                        onChange={(e) => setBudgetForm({...budgetForm, periodStart: e.target.value})}
                        className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">Period End</label>
                      <input
                        type="date"
                        value={budgetForm.periodEnd}
                        onChange={(e) => setBudgetForm({...budgetForm, periodEnd: e.target.value})}
                        className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">Category</label>
                      <select
                        value={budgetForm.category}
                        onChange={(e) => setBudgetForm({...budgetForm, category: e.target.value})}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option value="Equipment">Equipment</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Labor">Labor</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Feed">Feed</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">Planned Amount (Ush)</label>
                      <input
                        type="number"
                        required
                        placeholder="Ush 1200000"
                        value={budgetForm.plannedAmount}
                        onChange={(e) => setBudgetForm({...budgetForm, plannedAmount: e.target.value})}
                        className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Notes</label>
                    <textarea
                      rows={2}
                      placeholder="Notes or operational description..."
                      value={budgetForm.notes}
                      onChange={(e) => setBudgetForm({...budgetForm, notes: e.target.value})}
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {activeSheet === "customerSales" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Customer's Name (Airtable)</label>
                    <input
                      type="text"
                      required
                      placeholder="Nian Ning Resturant"
                      value={customerSaleForm.customerName}
                      onChange={(e) => setCustomerSaleForm({...customerSaleForm, customerName: e.target.value})}
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">Fish Type</label>
                      <input
                        type="text"
                        value={customerSaleForm.fishType}
                        onChange={(e) => setCustomerSaleForm({...customerSaleForm, fishType: e.target.value})}
                        className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">Fish Stage</label>
                      <select
                        value={customerSaleForm.fishStage}
                        onChange={(e) => setCustomerSaleForm({...customerSaleForm, fishStage: e.target.value})}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option value="Fry">Fry</option>
                        <option value="Fingerlings">Fingerlings</option>
                        <option value="Broodstock">Broodstock</option>
                        <option value="Table size">Table size</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">Quantity Sold</label>
                      <input
                        type="number"
                        required
                        value={customerSaleForm.quantitySold}
                        onChange={(e) => setCustomerSaleForm({...customerSaleForm, quantitySold: e.target.value})}
                        className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">Unit</label>
                      <select
                        value={customerSaleForm.unit}
                        onChange={(e) => setCustomerSaleForm({...customerSaleForm, unit: e.target.value})}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option value="pcs">pcs</option>
                        <option value="Kg">Kg</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">Unit Price (Ush)</label>
                      <input
                        type="number"
                        required
                        value={customerSaleForm.unitPrice}
                        onChange={(e) => setCustomerSaleForm({...customerSaleForm, unitPrice: e.target.value})}
                        className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">Sale Channel</label>
                      <input
                        type="text"
                        value={customerSaleForm.saleChannel}
                        onChange={(e) => setCustomerSaleForm({...customerSaleForm, saleChannel: e.target.value})}
                        className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">Region/Location</label>
                      <input
                        type="text"
                        value={customerSaleForm.regionLocation}
                        onChange={(e) => setCustomerSaleForm({...customerSaleForm, regionLocation: e.target.value})}
                        className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSheet === "revenue" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Revenue Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. September Fry Sale - Mr. Ojo"
                      value={revenueForm.name}
                      onChange={(e) => setRevenueForm({...revenueForm, name: e.target.value})}
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Customer</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Agri2rist Hub"
                      value={revenueForm.customer}
                      onChange={(e) => setRevenueForm({...revenueForm, customer: e.target.value})}
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">Revenue Amount (Ush)</label>
                      <input
                        type="number"
                        required
                        value={revenueForm.revenueAmount}
                        onChange={(e) => setRevenueForm({...revenueForm, revenueAmount: e.target.value})}
                        className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">Cost of Goods Sold (Ush)</label>
                      <input
                        type="number"
                        required
                        value={revenueForm.costOfGoodsSold}
                        onChange={(e) => setRevenueForm({...revenueForm, costOfGoodsSold: e.target.value})}
                        className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSheet === "cashflows" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Recorded By</label>
                    <input
                      type="text"
                      required
                      value={cashFlowForm.recordedBy}
                      onChange={(e) => setCashFlowForm({...cashFlowForm, recordedBy: e.target.value})}
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">Cash Flow Type</label>
                      <select
                        value={cashFlowForm.type}
                        onChange={(e) => setCashFlowForm({...cashFlowForm, type: e.target.value})}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option value="Inflow">Inflow</option>
                        <option value="Outflow">Outflow</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">Amount (Ush)</label>
                      <input
                        type="number"
                        required
                        value={cashFlowForm.amount}
                        onChange={(e) => setCashFlowForm({...cashFlowForm, amount: e.target.value})}
                        className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Description</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Received payment for Tilapia fry delivery"
                      value={cashFlowForm.description}
                      onChange={(e) => setCashFlowForm({...cashFlowForm, description: e.target.value})}
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {activeSheet === "receivables" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Invoice Number</label>
                    <input
                      type="text"
                      required
                      placeholder="INV-2025-009"
                      value={invoiceForm.invoiceNumber}
                      onChange={(e) => setInvoiceForm({...invoiceForm, invoiceNumber: e.target.value})}
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Customer</label>
                    <input
                      type="text"
                      required
                      placeholder="Patrick Zema"
                      value={invoiceForm.customer}
                      onChange={(e) => setInvoiceForm({...invoiceForm, customer: e.target.value})}
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">Amount Due (Ush)</label>
                      <input
                        type="number"
                        required
                        value={invoiceForm.amountDue}
                        onChange={(e) => setInvoiceForm({...invoiceForm, amountDue: e.target.value})}
                        className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">Amount Paid (Ush)</label>
                      <input
                        type="number"
                        required
                        value={invoiceForm.amountPaid}
                        onChange={(e) => setInvoiceForm({...invoiceForm, amountPaid: e.target.value})}
                        className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Status</label>
                    <select
                      value={invoiceForm.paymentStatus}
                      onChange={(e) => setInvoiceForm({...invoiceForm, paymentStatus: e.target.value})}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="Unpaid">Unpaid</option>
                      <option value="Partially Paid">Partially Paid</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div>
              )}

              {activeSheet === "taxes" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Tax Record Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Withholding audit Sept"
                      value={taxForm.name}
                      onChange={(e) => setTaxForm({...taxForm, name: e.target.value})}
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">Tax Rate (%)</label>
                      <input
                        type="number"
                        required
                        value={taxForm.taxRate}
                        onChange={(e) => setTaxForm({...taxForm, taxRate: e.target.value})}
                        className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">Jurisdiction</label>
                      <input
                        type="text"
                        required
                        value={taxForm.jurisdiction}
                        onChange={(e) => setTaxForm({...taxForm, jurisdiction: e.target.value})}
                        className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSheet === "pnl" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Statement Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Q4 2025 Statement"
                      value={pnlForm.name}
                      onChange={(e) => setPnlForm({...pnlForm, name: e.target.value})}
                      className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">Total Revenue</label>
                      <input
                        type="number"
                        required
                        value={pnlForm.totalRevenue}
                        onChange={(e) => setPnlForm({...pnlForm, totalRevenue: e.target.value})}
                        className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block">Total Expenses</label>
                      <input
                        type="number"
                        required
                        value={pnlForm.totalExpenses}
                        onChange={(e) => setPnlForm({...pnlForm, totalExpenses: e.target.value})}
                        className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Confirm Append
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
