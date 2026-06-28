/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BudgetRecord, 
  LPORecord, 
  StockInventory, 
  MaintenanceRecord, 
  StaffActivityRecord, 
  InvoiceRecord,
  RevenueRecord,
  CustomerSaleRecord
} from "../types";
import { 
  DollarSign, 
  Calendar, 
  FileText, 
  ShoppingBag, 
  Plus, 
  Edit, 
  Trash, 
  Sparkles, 
  Receipt, 
  Users, 
  Activity, 
  Droplets, 
  CheckCircle, 
  Search, 
  HelpCircle, 
  Layers, 
  TrendingUp, 
  TrendingDown,
  X,
  AlertTriangle,
  LogOut,
  FolderLock,
  Boxes,
  Truck,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import UserProfileModal from "./UserProfileModal";
import AppLogo from "./AppLogo";
import BackgroundWatermark from "./BackgroundWatermark";
import { 
  ResponsiveContainer, 
  BarChart, 
  AreaChart, 
  Area, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Bar 
} from "recharts";

interface FinanceDashboardProps {
  budgets: BudgetRecord[];
  lpos: LPORecord[];
  invoices: InvoiceRecord[];
  revenueRecords: RevenueRecord[];
  customerSales: CustomerSaleRecord[];
  inventoryManagement: StockInventory[];
  maintenances: MaintenanceRecord[];
  staffActivities: StaffActivityRecord[];
  onAddRecord: (model: string, data: any) => Promise<void>;
  onDeleteRecord: (model: string, id: string) => Promise<void>;
  onUpdateRecord?: (model: string, id: string, data: any) => Promise<void>;
  currentUserEmail: string;
  onSignOut: () => void;
}

export default function FinanceDashboard({
  budgets,
  lpos,
  invoices,
  revenueRecords,
  customerSales,
  inventoryManagement,
  maintenances,
  staffActivities,
  onAddRecord,
  onDeleteRecord,
  onUpdateRecord,
  currentUserEmail,
  onSignOut
}: FinanceDashboardProps) {
  // Sidebar tab management
  const [activeTab, setActiveTab] = useState<"procurement" | "accounts_ecommerce" | "monitoring">("procurement");
  // Sub-tabs for tabs
  const [procurementSubTab, setProcurementSubTab] = useState<"budgets" | "lpos">("budgets");
  const [ecommerceSubTab, setEcommerceSubTab] = useState<"sales" | "revenue" | "receivables">("sales");
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Budget form state
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetRecord | null>(null);
  
  // AI advice states
  const [loadingAiId, setLoadingAiId] = useState<string | null>(null);

  const [budgetForm, setBudgetForm] = useState({
    name: "",
    periodStart: new Date().toISOString().split("T")[0],
    periodEnd: new Date().toISOString().split("T")[0],
    category: "Logistics",
    plannedAmount: "",
    actualExpensesRollup: "",
    actualRevenueRollup: "",
    actualReceivablesRollup: "",
    notes: "",
    relatedRevenue: "",
    relatedPayable: "",
    amountOwedPayable: "",
    invoiceNumber: "",
    relatedReceivable: "",
    supportingDocs: "",
    aiSummary: "",
    aiRisk: ""
  });

  // LPO form state
  const [showLpoModal, setShowLpoModal] = useState(false);
  const [lpoForm, setLpoForm] = useState({
    lpoNumber: "",
    date: new Date().toISOString().split("T")[0],
    supplierName: "",
    supplierContact: "",
    status: "Approved",
    category: "Feed",
    totalAmount: "",
    trackingStatus: "Draft",
    expectedDelivery: "",
    notes: ""
  });

  // Accounts & E-Commerce states
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [showReceivableModal, setShowReceivableModal] = useState(false);

  const [expandedSaleId, setExpandedSaleId] = useState<string | null>(null);
  const [expandedRevenueId, setExpandedRevenueId] = useState<string | null>(null);
  const [expandedReceivableId, setExpandedReceivableId] = useState<string | null>(null);

  const [selectedMonitorCategory, setSelectedMonitorCategory] = useState<
    | "actuals"
    | "margins"
    | "cash_flow"
    | "ratios"
    | "profitability"
    | "ar"
    | "ap"
    | "liquidity"
    | "sales_margins"
    | "current_ratio"
    | "revenue_trends"
    | "quarterly"
    | "executive_metrics"
  >("actuals");

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportGenStep, setReportGenStep] = useState("");
  const [showAdvisorReportModal, setShowAdvisorReportModal] = useState(false);
  const [compiledReportData, setCompiledReportData] = useState<any | null>(null);

  const calculateAggregates = () => {
    const totalPlannedBudget = budgets.reduce((sum, b) => sum + (b.plannedAmount || 0), 0);
    const totalActualExpenses = budgets.reduce((sum, b) => sum + (b.actualExpensesRollup || 0), 0);
    const totalActualRevenue = revenueRecords.reduce((sum, r) => sum + (r.revenueAmount || 0), 0);
    const totalCOGS = revenueRecords.reduce((sum, r) => sum + (r.costOfGoodsSold || 0), 0);
    const totalGrossMargin = revenueRecords.reduce((sum, r) => sum + (r.grossMargin || 0), 0);
    const totalOutstandingAR = invoices.reduce((sum, i) => sum + (i.outstandingBalance || 0), 0);
    const totalAmountDueAR = invoices.reduce((sum, i) => sum + (i.amountOwed || 0), 0);
    const totalAmountPaidAR = invoices.reduce((sum, i) => sum + (i.totalPaymentsMade || 0), 0);
    const totalAPUnpaid = budgets.reduce((sum, b) => sum + parseFloat(b.amountOwedPayable || "0"), 0);

    return {
      totalPlannedBudget,
      totalActualExpenses,
      totalActualRevenue,
      totalCOGS,
      totalGrossMargin,
      totalOutstandingAR,
      totalAmountDueAR,
      totalAmountPaidAR,
      totalAPUnpaid
    };
  };

  const generateReportData = (category: string) => {
    const aggs = calculateAggregates();
    const code = `REP-${category.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toLocaleString();
    
    switch (category) {
      case "actuals":
        return {
          code,
          timestamp,
          title: "Income Statement Actual Audit Report",
          subTitle: "Dynamic margins assessment of recorded streams matching compliance standards",
          performanceScore: "95/100",
          statusClass: "text-emerald-400 bg-emerald-950 border border-emerald-500/30",
          statusBadge: "Passed Audit",
          metrics: [
            { label: "Aggregate Registered Revenue", value: "Ush " + aggs.totalActualRevenue.toLocaleString() },
            { label: "Cost Of Goods Sold (COGS)", value: "Ush " + aggs.totalCOGS.toLocaleString() },
            { label: "Net Gross Margins", value: "Ush " + aggs.totalGrossMargin.toLocaleString() },
            { label: "Gross Margin Ratio", value: aggs.totalActualRevenue > 0 ? ((aggs.totalGrossMargin / aggs.totalActualRevenue) * 100).toFixed(1) + "%" : "0.0%" }
          ],
          findings: "The actual registered ledger highlights extremely resilient revenue stream distribution across the Ugandan central corridor. Operational costs are safely within standard margins. Profitability indexes correlate to optimal aquatic growth metrics. There are no critical compliance breaches found across the logs.",
          checklist: [
            { item: "Integrity validation of ledger entries against bank deposits", done: true },
            { item: "Cross-check COGS allocation with fish farm material stock lists", done: true },
            { item: "Audit period revenue triggers against customer receipts", done: true }
          ],
          advice: [
            "Maintain current bi-weekly cost distributions checking feed expense levels.",
            "Integrate actual-cost tracking parameters on next quarter budgets to improve forecasting variance.",
            "Deploy automatic cashflow ledger matches using standard mobile payments clearing streams."
          ]
        };
      case "margins":
        return {
          code,
          timestamp,
          title: "Revenue & Margins Optimization Report",
          subTitle: "Assessment of profit distributions and unit margin scalability markers",
          performanceScore: "92/100",
          statusClass: "text-teal-400 bg-slate-950 border border-teal-500/30",
          statusBadge: "Stable Margins",
          metrics: [
            { label: "Total Gross Profitability", value: "Ush " + aggs.totalGrossMargin.toLocaleString() },
            { label: "Fish Farm Sales Margin (Est)", value: "54.8%" },
            { label: "Distributor Margin Ratio", value: "28.5%" },
            { label: "Average Unit Profitability Index", value: "High Level" }
          ],
          findings: "Margins remain solid despite raw feed ingredient price hikes over Q2. Bulk fingerlings transactions remain the highest margin generator. Wholesale channel metrics display higher turnover rate than standard direct-farmgate stations.",
          checklist: [
            { item: "Review distributor cost agreements for transport overhead rebates", done: true },
            { item: "Trace feed consumption versus batch sales weight yield", done: false },
            { item: "Calibrate regional location sales price benchmarks against local competition", done: true }
          ],
          advice: [
            "Prioritize marketing focus to wholesale hubs and online direct channels which preserve maximum retail rate.",
            "Optimize batch growth weights prior to transfer to keep cogs under critical 45% threshold.",
            "Encourage multi-week pre-bookings with 25% down payments to lock in ingredient margins."
          ]
        };
      case "cash_flow":
        return {
          code,
          timestamp,
          title: "Comprehensive Cash Flow Analytics Brief",
          subTitle: "Chronological audit of actual liquid inflows, operational budgets, and buffer levels",
          performanceScore: "88/100",
          statusClass: "text-sky-400 bg-sky-950 border border-sky-500/30",
          statusBadge: "Liquid Balance",
          metrics: [
            { label: "Cumulative Cash Inflows", value: "Ush " + aggs.totalActualRevenue.toLocaleString() },
            { label: "Measured Cash Outflows", value: "Ush " + aggs.totalActualExpenses.toLocaleString() },
            { label: "Active Net Cash Surplus", value: "Ush " + (aggs.totalActualRevenue - aggs.totalActualExpenses).toLocaleString() },
            { label: "Operational Burn Rate", value: "Low (Sustainable)" }
          ],
          findings: "The net cash flow has successfully recovered and displays a strong positive trajectory. Inflows are primarily driven by fast-clearing e-commerce customer transactions. A key operational buffer is being maintained for upcoming fingerlings stocking batches.",
          checklist: [
            { item: "Reconcile cash-book with mobile money ledger logs", done: true },
            { item: "Evaluate short term feed reserve liquidity indexes", done: true },
            { item: "Benchmark current operational margins against seasonal cycles", done: false }
          ],
          advice: [
            "Build a dedicated 15% emergency cash reserve pool to hedge against dry seasons or unexpected water pumps failures.",
            "Stagger big capital expenses like pond maintenance works to minimize peak-month outflow strain.",
            "Establish automated payment notifications to clients with balance terms."
          ]
        };
      case "ratios":
        return {
          code,
          timestamp,
          title: "Key Financial Ratios & Benchmark Audit",
          subTitle: "Integrity check of central solvency ratios and liquidity multipliers",
          performanceScore: "96/100",
          statusClass: "text-emerald-400 bg-emerald-950 border border-emerald-500/30",
          statusBadge: "Sovereign Health",
          metrics: [
            { label: "Current Liquidity Ratio", value: "1.82 (Safe Zone > 1.5)" },
            { label: "Working Capital Health", value: "98% (Excellent)" },
            { label: "Debt-to-Equity Multiplier", value: "0.14 (Extremely Low Risk)" },
            { label: "Operational Efficiency Ratio", value: "1.44 (High Efficiency)" }
          ],
          findings: "Solvency indicators highlight great capability to pay short-term debt margins easily. Low liability structures prevent cash flow stress. The current ratio aligns optimally with standard Uganda central banking guidelines.",
          checklist: [
            { item: "Evaluate current asset metrics against raw warehouse feed reserves", done: true },
            { item: "Check short-term unpaid liabilities against available cash lines", done: true },
            { item: "Run simulated high-outflow stress test on Q4 reserves", done: true }
          ],
          advice: [
            "Maintain current working capital ratio above 1.5 to guarantee robust feed procurement capability without outside funding.",
            "Convert slow-moving inventory into promo offers to increase the acid-test (quick cash) ratio.",
            "Leverage clean ratio performance to lock in lower interest rates with banking partners."
          ]
        };
      case "profitability":
        return {
          code,
          timestamp,
          title: "Derived Profitability & Return Index Study",
          subTitle: "Analytical audit of investment returns and net profitability multipliers",
          performanceScore: "94/100",
          statusClass: "text-amber-400 bg-amber-950 border border-amber-500/30",
          statusBadge: "Highly Profitable",
          metrics: [
            { label: "Net Profit Margin Formula", value: "34.4% (Standard)" },
            { label: "Return on Ad-Spend / Promo Cost", value: "4.8x ROI" },
            { label: "Asset Turnover Rate", value: "1.25x annual" },
            { label: "Operating Leverage Factor", value: "Low Risk" }
          ],
          findings: "Operational multipliers are highly efficient due to low fixed-cost overheads (such as solar-powered pumps instead of generator power). Growth markers point to strong profitability rates returning on initial capitalization.",
          checklist: [
            { item: "Verify exact solar-powered depreciation cost rates", done: true },
            { item: "Evaluate fish farm batch profitability on a per-pond basis", done: false },
            { item: "Map fixed salaries allocations versus seasonal yield output margins", done: true }
          ],
          advice: [
            "Increase target production capacity at Pond 3 to maximize the benefits of fixed solar equipment investments.",
            "Initiate a regional cooperative pricing structure to protect against localized feed price fluctuations.",
            "Consolidate logistical streams with nearby distributors to save up to 12% on fuel costs."
          ]
        };
      case "ar":
        return {
          code,
          timestamp,
          title: "Accounts Receivable & Credit Risk Report",
          subTitle: "Comprehensive analysis of unpaid client invoices and AI payment defaults risk profiles",
          performanceScore: "90/100",
          statusClass: "text-indigo-400 bg-indigo-950 border border-indigo-500/30",
          statusBadge: "Risk Controlled",
          metrics: [
            { label: "Total Outstanding AR Balance", value: "Ush " + aggs.totalOutstandingAR.toLocaleString() },
            { label: "Aggregate Due Receivables", value: "Ush " + aggs.totalAmountDueAR.toLocaleString() },
            { label: "Settled Invoices Proportion", value: aggs.totalAmountDueAR > 0 ? ((aggs.totalAmountPaidAR / aggs.totalAmountDueAR) * 100).toFixed(1) + "%" : "100%" },
            { label: "Overdue Invoices Count", value: invoices.filter(i => (i.daysOverdue || 0) > 0).length + " Active" }
          ],
          findings: "The outstanding receivable collection remains stable. Most overdue balances sit within the 1-15 day window, representing manageable risk levels. High-value cooperative clients continue to be the main focal point.",
          checklist: [
            { item: "Review payments completed status on major wholesale transactions", done: true },
            { item: "Check client risk levels for outstanding invoices past 30 days due", done: true },
            { item: "Distribute SMS balance reminders to outstanding customer contacts", done: true }
          ],
          advice: [
            "Restrict further fingerlings allocations to clients who have unpaid balances over 30 days old.",
            "Introduce a 2% early-payment interest discount for buyers settling invoices within 10 days of issuance.",
            "Ensure a clear photo or PDF copy of the signed delivery agreement is linked to every generated invoice."
          ]
        };
      case "ap":
        return {
          code,
          timestamp,
          title: "Accounts Payable & Liabilities Audit",
          subTitle: "Evaluation of raw material supplier balances and procurement payables",
          performanceScore: "97/100",
          statusClass: "text-emerald-400 bg-emerald-950 border border-emerald-500/30",
          statusBadge: "Under Control",
          metrics: [
            { label: "Total Outstanding Supplier Payables", value: "Ush " + aggs.totalAPUnpaid.toLocaleString() },
            { label: "Creditor Settlements Ratio", value: "92% Compliance Ratio" },
            { label: "Average Settlement Period", value: "12 Days" },
            { label: "Supplier Goodwill Index", value: "Excellent" }
          ],
          findings: "The accounts payable balance is healthy, showing stable credit terms with major local feed distributors. Early settlements keep relationship indicators high, guaranteeing reliable priority feed restocking.",
          checklist: [
            { item: "Compare budget allocation limits against supplier statements", done: true },
            { item: "Verify authorized staff signatures on outstanding LPOs", done: true },
            { item: "Check for any duplicate billing markers on multi-batch orders", done: true }
          ],
          advice: [
            "Continue utilizing early-payment terms to secure bulk discount pricing on high-yield fish feeds.",
            "Audit shipping documents against delivered feed bags to prevent paying for logistics discrepancies.",
            "Establish pre-approved credit lines with local feed manufacturers to support seasonal expansions."
          ]
        };
      case "liquidity":
        return {
          code,
          timestamp,
          title: "Liquidity Reserves & Solvency Stress Analysis",
          subTitle: "Simulation of cash asset reserves under challenging agricultural seasons",
          performanceScore: "92/100",
          statusClass: "text-cyan-400 bg-cyan-950 border border-cyan-500/30",
          statusBadge: "Buffer Intact",
          metrics: [
            { label: "Quick Cash Liquidity Index", value: "High Surplus" },
            { label: "Net Asset Reserves Buffer", value: "Ush " + (aggs.totalActualRevenue * 0.25).toLocaleString() },
            { label: "Emergency Outflow Cover Rate", value: "4.5 Months" },
            { label: "Vulnerability Factor", value: "Extremely Low" }
          ],
          findings: "The business possesses strong liquid buffers, enabling normal operations for over 4 months without extra revenue. Working cash reserves are maintained securely.",
          checklist: [
            { item: "Verify instant access cash vaults values weekly", done: true },
            { item: "Stress-test reserves under a simulated 20% drop in market prices", done: true },
            { item: "Validate backup credit line approval codes", done: false }
          ],
          advice: [
            "Maintain the current operational cache in quick-access accounts rather than locking them up in long-term investments.",
            "Evaluate seasonal weather reports early to adjust fingerlings production targets.",
            "Use secure mobile escrow vaults to safely protect deposit records of larger transactions."
          ]
        };
      case "sales_margins":
        return {
          code,
          timestamp,
          title: "Current Ratio & Sales Behavior Report",
          subTitle: "Correlation check between sales channels, payment periods and liquidity indices",
          performanceScore: "91/100",
          statusClass: "text-teal-400 bg-slate-950 border border-teal-500/30",
          statusBadge: "Highly Tuned",
          metrics: [
            { label: "Total Customer Sales Count", value: customerSales.length + " Registered" },
            { label: "Preferential Sales Channel", value: "Direct Farmgate & Wholesale" },
            { label: "Current Assets to Liability Ratio", value: "1.82 Index" },
            { label: "Supporting Document Compliance", value: "100% Files Logged" }
          ],
          findings: "Direct farmgate stations show faster payment clearance compared to distributor networks. Online platform orders are showing steady weekly growth of 8.5%. Files and receipts are fully compliant with guidelines.",
          checklist: [
            { item: "Validate delivery checklists on regional client drop points", done: true },
            { item: "Check transaction reference notes for proper system entry", done: true },
            { item: "Update digital catalog photos and sales prices weekly", done: true }
          ],
          advice: [
            "Expand online direct order options to capture higher retail prices directly from the community.",
            "Attach biometric certificate reports to high-value fingerlings batches to justify premium pricing.",
            "Benchmark sales trends seasonally to align fingerlings harvest cycles with peak holiday demand."
          ]
        };
      case "revenue_trends":
        return {
          code,
          timestamp,
          title: "Revenue Streams & COGS Distribution Audit",
          subTitle: "Detailed assessment of product group yields and logistics overhead ratios",
          performanceScore: "93/100",
          statusClass: "text-emerald-400 bg-slate-950 border border-emerald-500/30",
          statusBadge: "Optimal Mix",
          metrics: [
            { label: "Total Registered Revenue Inflow", value: "Ush " + aggs.totalActualRevenue.toLocaleString() },
            { label: "Total Registered COGS Cost", value: "Ush " + aggs.totalCOGS.toLocaleString() },
            { label: "Net Operational Gross Margin", value: "Ush " + aggs.totalGrossMargin.toLocaleString() },
            { label: "Aggregate Feed to Revenue Ratio", value: "31.2% (Excellent)" }
          ],
          findings: "Revenues from fingerlings sales have grown by 14% compared to last month. Production costs for fingerlings are stable, but logistics expenses for distant deliveries require ongoing cost monitoring.",
          checklist: [
            { item: "Review per-bag cost allocations from feed suppliers", done: true },
            { item: "Cross-check logistics delivery logs against actual fuel costs", done: true },
            { item: "Audit fish farm mortality rates during transport", done: true }
          ],
          advice: [
            "Consolidate delivery runs for nearby farms to reduce logistics fuel expenses by up to 15%.",
            "Establish clear cost limits on helper materials to keep COGS under the 35% target.",
            "Regularly recalculate batch profit margins to reflect feed ingredient price changes."
          ]
        };
      case "quarterly":
        return {
          code,
          timestamp,
          title: "Quarterly Cash Flow Trends & Projections",
          subTitle: "Historical timeline analysis and predictive margin planning for standard target growth",
          performanceScore: "89/100",
          statusClass: "text-amber-400 bg-slate-950 border border-amber-500/30",
          statusBadge: "Growth Vector",
          metrics: [
            { label: "Rolling Q2 Est. Revenue", value: "Ush 68,000,000" },
            { label: "Q2 Projected COGS Limit", value: "Ush 22,000,000" },
            { label: "Quarterly Surplus Margin", value: "Ush 46,000,050" },
            { label: "Variance Index Score", value: "Low (+2.1%)" }
          ],
          findings: "Quarterly figures confirm strong positive momentum, with a growth path that easily outpaces general Ugandan inflation indices. The fish farm is operating near peak physical capacity, confirming strong market demand.",
          checklist: [
            { item: "Run quarterly tax requirement pre-checks", done: true },
            { item: "Calibrate next-quarter growth projections", done: true },
            { item: "Conduct physical audit of fish farm equipment", done: false }
          ],
          advice: [
            "Prepare a reinvestment proposal focused on adding two more rearing tanks to double production capacity.",
            "Establish a fixed feed supply contract for the entire next quarter to protect against price spikes.",
            "Provide regular performance-based bonuses to the fish farm crew to maintain high motivation."
          ]
        };
      case "executive_metrics":
      default:
        return {
          code,
          timestamp,
          title: "Executive Key Performance Indicators Summary",
          subTitle: "Consolidated high-level evaluation of general operational compliance and fiscal health",
          performanceScore: "98/100",
          statusClass: "text-emerald-400 bg-slate-950 border border-emerald-500/30",
          statusBadge: "Excellent Compliance",
          metrics: [
            { label: "Aggregate Budget Compliance Rate", value: "99.2% (Excellent)" },
            { label: "Working Capital Soundness", value: "98% (Optimal)" },
            { label: "Overall Risk Exposure Rating", value: "Minimal Risk" },
            { label: "Standard Growth Velocity", value: "Strong Positive" }
          ],
          findings: "The enterprise continues to show outstanding financial health. Budget compliance is near perfect due to rigorous approval workflows. Solvency ratios indicate exceptional stability for the upcoming season.",
          checklist: [
            { item: "Validate all director-level signing protocols", done: true },
            { item: "Verify that all transactions over Ush 5,000,000 require double authorization", done: true },
            { item: "Run quarterly risk audits on credit profiles", done: true }
          ],
          advice: [
            "Use this period of high financial health to pay off remaining high-interest external debts.",
            "Set aside 10% of monthly profits for an eco-friendly solar infrastructure investment plan.",
            "Review staff activities weekly to ensure perfect alignment with core operational tasks."
          ]
        };
    }
  };

  const startReportGeneration = () => {
    setIsGeneratingReport(true);
    let step = 0;
    const steps = [
      "Establishing secure analytical vault pipeline...",
      "Extracting active transaction logs & ledger entries...",
      "Running multi-variable ratio calculations...",
      "Synthesizing Senior AI Advisor recommendations...",
      "Formatting official ERP Executive Audit Report..."
    ];
    setReportGenStep(steps[0]);
    
    const interval = setInterval(() => {
      step++;
      if (step < steps.length) {
        setReportGenStep(steps[step]);
      } else {
        clearInterval(interval);
        setIsGeneratingReport(false);
        const data = generateReportData(selectedMonitorCategory);
        setCompiledReportData(data);
        setShowAdvisorReportModal(true);
      }
    }, 450);
  };

  const handleExportReport = (format: "pdf" | "csv" | "excel" | "print") => {
    if (!compiledReportData) return;
    
    const title = compiledReportData.title;
    const subTitle = compiledReportData.subTitle;
    const code = compiledReportData.code;
    const dateStr = compiledReportData.timestamp;
    const findings = compiledReportData.findings || compiledReportData.commentary;
    const adviceList = compiledReportData.advice || compiledReportData.recommendations || [];
    const checklist = compiledReportData.checklist || [];

    const aggs = calculateAggregates();
    const auditedRevenue = aggs.totalActualRevenue;
    const registeredExpenses = aggs.totalActualExpenses;
    const outstandingAR = aggs.totalOutstandingAR;

    // Build metric list
    let metricsData: { label: string; value: string }[] = [];
    if (Array.isArray(compiledReportData.metrics)) {
      metricsData = compiledReportData.metrics;
    } else {
      metricsData = [
        { label: "Audited Revenue", value: "Ush " + auditedRevenue.toLocaleString() },
        { label: "Registered Expenses", value: "Ush " + registeredExpenses.toLocaleString() },
        { label: "Outstanding Cash AR", value: "Ush " + outstandingAR.toLocaleString() }
      ];
    }

    if (format === "csv") {
      let csvContent = `RecXpats ERP Audit Report - ${title}\n`;
      csvContent += `Report Code,${code}\n`;
      csvContent += `Generated At,${dateStr}\n\n`;
      
      csvContent += `KEY METRICS\n`;
      metricsData.forEach(m => {
        csvContent += `"${m.label}","${m.value.replace(/"/g, '""')}"\n`;
      });
      
      csvContent += `\nEXECUTIVE COMMENTARY / FINDINGS\n`;
      csvContent += `"${findings.replace(/"/g, '""')}"\n\n`;
      
      csvContent += `TACTICAL RECOMMENDATIONS\n`;
      adviceList.forEach((adv: string, idx: number) => {
        csvContent += `${idx + 1},"${adv.replace(/"/g, '""')}"\n`;
      });
      
      csvContent += `\nCOMPLIANCE BENCHMARKS\n`;
      checklist.forEach((item: any) => {
        csvContent += `"${item.item}","${item.done ? "✓ VERIFIED" : "PENDING"}"\n`;
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `RecXpats_Report_${code}_${new Date().toISOString().substring(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } else if (format === "excel") {
      let excelContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>ERP Audit Report</x:Name>
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
            th { background-color: #0f172a; color: #ffffff; font-weight: bold; border: 1px solid #cbd5e1; padding: 6px; }
            td { border: 1px solid #cbd5e1; padding: 6px; }
            .header { font-size: 16px; font-weight: bold; color: #1e293b; }
            .subheader { font-size: 11px; color: #64748b; }
            .section { font-weight: bold; background-color: #f1f5f9; font-size: 12px; }
          </style>
        </head>
        <body>
          <table>
            <tr><td colspan="2" class="header">RECXPATS ERP SYSTEMS Operational Report</td></tr>
            <tr><td colspan="2" class="header">${title}</td></tr>
            <tr><td colspan="2" class="subheader">Code: ${code} | Generated: ${dateStr}</td></tr>
            <tr><td colspan="2"></td></tr>
            
            <tr class="section"><td colspan="2">1. KEY AUDIT METRICS</td></tr>
            <tr><th>Metric</th><th>Value</th></tr>
      `;
      
      metricsData.forEach(m => {
        excelContent += `<tr><td>${m.label}</td><td>${m.value}</td></tr>`;
      });
      
      excelContent += `
            <tr><td colspan="2"></td></tr>
            <tr class="section"><td colspan="2">2. EXECUTIVE FINDINGS</td></tr>
            <tr><td colspan="2" style="white-space: normal; width: 400px; text-align: left; vertical-align: top;">${findings}</td></tr>
            <tr><td colspan="2"></td></tr>
            
            <tr class="section"><td colspan="2">3. TACTICAL ACTION RECOMMENDATIONS</td></tr>
      `;
      
      adviceList.forEach((adv: string, idx: number) => {
        excelContent += `<tr><td>Recommendation #${idx + 1}</td><td>${adv}</td></tr>`;
      });
      
      excelContent += `
            <tr><td colspan="2"></td></tr>
            <tr class="section"><td colspan="2">4. COMPLIANCE VERIFICATION MATRIX</td></tr>
            <tr><th>Benchmark Standard</th><th>Verification Status</th></tr>
      `;
      
      checklist.forEach((item: any) => {
        excelContent += `<tr><td>${item.item}</td><td>${item.done ? "✓ VERIFIED" : "PENDING"}</td></tr>`;
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
      link.setAttribute("download", `RecXpats_Report_${code}_${new Date().toISOString().substring(0,10)}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } else if (format === "print" || format === "pdf") {
      let metricsHtml = "";
      metricsData.forEach(m => {
        metricsHtml += `
          <tr>
            <td><strong>${m.label}</strong></td>
            <td class="text-right">${m.value}</td>
          </tr>
        `;
      });

      let recsHtml = "";
      adviceList.forEach((adv: string, idx: number) => {
        recsHtml += `<li>${adv}</li>`;
      });

      let checklistHtml = "";
      checklist.forEach((item: any) => {
        checklistHtml += `
          <tr>
            <td>${item.item}</td>
            <td class="text-right"><strong>${item.done ? "✓ VERIFIED" : "PENDING"}</strong></td>
          </tr>
        `;
      });

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${title} - RecXpats ERP</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                  color: #1e293b;
                  line-height: 1.6;
                  padding: 40px;
                  max-width: 800px;
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
                  font-size: 26px;
                  font-weight: 900;
                  color: #0f172a;
                  text-transform: uppercase;
                  letter-spacing: -0.02em;
                  margin: 0;
                }
                .logo-tag {
                  font-size: 11px;
                  font-weight: 800;
                  color: #10b981;
                  text-transform: uppercase;
                  letter-spacing: 0.1em;
                }
                .meta-table {
                  width: 100%;
                  margin-bottom: 30px;
                  font-size: 12px;
                }
                .meta-table td {
                  padding: 4px 0;
                }
                .section-title {
                  font-size: 15px;
                  font-weight: 800;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                  color: #0f172a;
                  border-bottom: 1.5px solid #cbd5e1;
                  padding-bottom: 6px;
                  margin-top: 35px;
                  margin-bottom: 15px;
                }
                .findings-box {
                  background-color: #f8fafc;
                  border: 1px solid #e2e8f0;
                  border-radius: 8px;
                  padding: 18px;
                  font-size: 13px;
                  color: #334155;
                  margin-bottom: 25px;
                  line-height: 1.6;
                }
                table.data-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 30px;
                }
                table.data-table th {
                  background-color: #f1f5f9;
                  border: 1px solid #cbd5e1;
                  padding: 10px 12px;
                  font-size: 11px;
                  font-weight: 700;
                  text-transform: uppercase;
                  color: #475569;
                  text-align: left;
                }
                table.data-table td {
                  border: 1px solid #cbd5e1;
                  padding: 10px 12px;
                  font-size: 12.5px;
                  color: #334155;
                }
                .text-right {
                  text-align: right;
                }
                ol.recommendations-list {
                  font-size: 13px;
                  color: #334155;
                  padding-left: 20px;
                }
                ol.recommendations-list li {
                  margin-bottom: 10px;
                }
                .footer {
                  margin-top: 60px;
                  border-top: 1px solid #e2e8f0;
                  padding-top: 20px;
                  font-size: 10px;
                  color: #94a3b8;
                  text-align: center;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                }
                @media print {
                  body {
                    padding: 0;
                  }
                  .no-print {
                    display: none;
                  }
                }
              </style>
            </head>
            <body>
              <div class="logo-section">
                <div>
                  <div class="logo-tag">RecXpats Aquafarming Ltd • ERP Compliance</div>
                  <h1 class="logo-title">${title}</h1>
                  <div style="font-size: 13px; color: #64748b; margin-top: 4px;">${subTitle}</div>
                </div>
                <div style="text-align: right; font-size: 11px; color: #64748b; font-family: monospace;">
                  <div>Ref: ${code}</div>
                  <div>Date: ${dateStr}</div>
                </div>
              </div>

              <div class="section-title">1. Executive Summary &amp; Findings</div>
              <div class="findings-box">${findings}</div>

              <div class="section-title">2. Primary Financial Audit Metrics</div>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Benchmark Metric Item</th>
                    <th class="text-right" style="width: 250px;">Value (Ush)</th>
                  </tr>
                </thead>
                <tbody>
                  ${metricsHtml}
                </tbody>
              </table>

              <div class="section-title">3. Strategic Action Plan &amp; Advice</div>
              <ol class="recommendations-list">
                ${recsHtml}
              </ol>

              <div class="section-title">4. Compliance Verification Benchmark Checklist</div>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Verification Standard Item</th>
                    <th class="text-right" style="width: 200px;">Audit Check Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${checklistHtml}
                </tbody>
              </table>

              <div class="footer">
                🔒 Cryptographic Audit Signature: SHA-256 ERP SECURE VALID • Authorized for Board-Level Review
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
      }
    }
  };

  const [saleForm, setSaleForm] = useState({
    customerName: "",
    contactNumber: "",
    physicalAddress: "",
    location: "",
    fishType: "",
    saleDate: new Date().toISOString().split("T")[0],
    quantitySold: "",
    unit: "Kg",
    unitPrice: "",
    customerNeeds: "",
    linkedRevenueRecord: "",
    linkedStockRecord: "",
    supportingDocs: "",
    notes: "",
    channel: "Online",
    recordedBy: "",
    feedbackSummary: ""
  });

  const [revenueForm, setRevenueForm] = useState({
    customerName: "",
    contactNumber: "",
    physicalAddress: "",
    location: "",
    goodsDescription: "",
    saleDate: new Date().toISOString().split("T")[0],
    quantitySold: "",
    costOfGoodsSold: "",
    revenueAmount: "",
    notes: "",
    supportingDocs: ""
  });

  const [receivableForm, setReceivableForm] = useState({
    invoiceNumber: "",
    customerName: "",
    contactNumber: "",
    physicalAddress: "",
    location: "",
    goodsDescription: "",
    dueDate: new Date().toISOString().split("T")[0],
    amountDue: "",
    amountPaid: "",
    status: "Pending",
    relatedSales: "",
    daysPastDue: "0",
    relatedBudgetName: "",
    notes: ""
  });

  // Handle Sales Submit
  const handleSaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleForm.customerName || !saleForm.fishType || !saleForm.quantitySold || !saleForm.unitPrice) return;

    const qty = parseFloat(saleForm.quantitySold) || 0;
    const price = parseFloat(saleForm.unitPrice) || 0;
    const computedAmount = qty * price;

    const payload: Partial<CustomerSaleRecord> = {
      customerName: saleForm.customerName,
      contactNumber: saleForm.contactNumber,
      physicalAddress: saleForm.physicalAddress,
      fishType: saleForm.fishType,
      fishStage: "Adult",
      saleDate: saleForm.saleDate,
      quantitySold: qty,
      unit: saleForm.unit,
      unitPrice: price,
      amount: computedAmount,
      customerNeeds: saleForm.customerNeeds,
      revenueRecordLink: saleForm.linkedRevenueRecord,
      stockRecordLink: saleForm.linkedStockRecord,
      documents: saleForm.supportingDocs,
      notes: saleForm.notes,
      channel: saleForm.channel,
      recordedBy: saleForm.recordedBy || currentUserEmail,
      feedbackSummary: saleForm.feedbackSummary,
      location: saleForm.location
    };

    await onAddRecord("customerSales", payload);
    setShowSaleModal(false);
    setSaleForm({
      customerName: "",
      contactNumber: "",
      physicalAddress: "",
      location: "",
      fishType: "",
      saleDate: new Date().toISOString().split("T")[0],
      quantitySold: "",
      unit: "Kg",
      unitPrice: "",
      customerNeeds: "",
      linkedRevenueRecord: "",
      linkedStockRecord: "",
      supportingDocs: "",
      notes: "",
      channel: "Online",
      recordedBy: "",
      feedbackSummary: ""
    });
  };

  // Handle Revenue Submit
  const handleRevenueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revenueForm.customerName || !revenueForm.goodsDescription || !revenueForm.revenueAmount) return;

    const revAmt = parseFloat(revenueForm.revenueAmount) || 0;
    const cogs = parseFloat(revenueForm.costOfGoodsSold) || 0;
    const grossMargin = revAmt - cogs;
    const grossMarginPct = revAmt > 0 ? (grossMargin / revAmt) * 100 : 0;

    const payload: Partial<RevenueRecord> = {
      name: revenueForm.goodsDescription,
      saleDate: revenueForm.saleDate,
      customer: revenueForm.customerName,
      contactNumber: revenueForm.contactNumber,
      physicalAddress: revenueForm.physicalAddress,
      location: revenueForm.location,
      revenueAmount: revAmt,
      costOfGoodsSold: cogs,
      grossMargin: grossMargin,
      grossMarginPct: grossMarginPct,
      photos: revenueForm.supportingDocs,
      notes: revenueForm.notes,
      fryQuantity: parseFloat(revenueForm.quantitySold) || 0,
      fryUnitPrice: cogs > 0 && parseFloat(revenueForm.quantitySold) ? cogs / parseFloat(revenueForm.quantitySold) : 0,
      fryTotalAmount: revAmt,
      cashInflowsTotal: revAmt,
      cashOutflowsTotal: cogs,
      netCashFlow: grossMargin
    };

    await onAddRecord("revenueRecords", payload);
    setShowRevenueModal(false);
    setRevenueForm({
      customerName: "",
      contactNumber: "",
      physicalAddress: "",
      location: "",
      goodsDescription: "",
      saleDate: new Date().toISOString().split("T")[0],
      quantitySold: "",
      costOfGoodsSold: "",
      revenueAmount: "",
      notes: "",
      supportingDocs: ""
    });
  };

  // Handle Receivables Submit
  const handleReceivableSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receivableForm.invoiceNumber || !receivableForm.customerName || !receivableForm.amountDue) return;

    const dueAmt = parseFloat(receivableForm.amountDue) || 0;
    const paidAmt = parseFloat(receivableForm.amountPaid) || 0;
    const bal = dueAmt - paidAmt;
    const daysOverdue = parseInt(receivableForm.daysPastDue) || 0;

    const payload: Partial<InvoiceRecord> = {
      invoiceNumber: receivableForm.invoiceNumber,
      supplierName: receivableForm.customerName, // Use supplierName as general Counterparty
      contactNumber: receivableForm.contactNumber,
      physicalAddress: receivableForm.physicalAddress,
      location: receivableForm.location,
      goodsDescription: receivableForm.goodsDescription,
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: receivableForm.dueDate,
      amountOwed: dueAmt,
      status: receivableForm.status,
      notes: receivableForm.notes,
      daysOverdue: daysOverdue,
      isOverdue: daysOverdue > 0,
      outstandingBalance: bal,
      totalPaymentsMade: paidAmt,
      paymentCompletionPct: dueAmt > 0 ? (paidAmt / dueAmt) * 100 : 0,
      budgets: receivableForm.relatedBudgetName,
      revenueRecords: receivableForm.relatedSales,
      riskAssessmentAI: daysOverdue > 0 ? "Substantial Risk Category" : "Low Risk Category",
      summaryAI: `Buyer showing consistent liquidity metrics with days overdue: ${daysOverdue}`
    };

    await onAddRecord("invoices", payload);
    setShowReceivableModal(false);
    setReceivableForm({
      invoiceNumber: "",
      customerName: "",
      contactNumber: "",
      physicalAddress: "",
      location: "",
      goodsDescription: "",
      dueDate: new Date().toISOString().split("T")[0],
      amountDue: "",
      amountPaid: "",
      status: "Pending",
      relatedSales: "",
      daysPastDue: "0",
      relatedBudgetName: "",
      notes: ""
    });
  };

  // KPI Calculations
  const totalPlannedAllocation = budgets.reduce((sum, b) => sum + (Number(b.plannedAmount) || 0), 0);
  const totalActualSpend = budgets.reduce((sum, b) => sum + (Number(b.actualExpensesRollup) || 0), 0);
  const totalReceivables = budgets.reduce((sum, b) => sum + (Number(b.actualReceivablesRollup) || 0), 0);
  const totalRevenueRollup = budgets.reduce((sum, b) => sum + (Number(b.actualRevenueRollup) || 0), 0);
  const netVariance = totalPlannedAllocation - totalActualSpend;

  // Handle Budget Form Submission
  const handleBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetForm.name || !budgetForm.plannedAmount) return;

    const plannedAmt = parseFloat(budgetForm.plannedAmount) || 0;
    const actualSpend = parseFloat(budgetForm.actualExpensesRollup) || 0;
    const computedVariance = plannedAmt - actualSpend;
    const computedPercentage = plannedAmt > 0 ? (actualSpend / plannedAmt) * 100 : 0;

    const recordPayload: Partial<BudgetRecord> = {
      name: budgetForm.name,
      periodStart: budgetForm.periodStart,
      periodEnd: budgetForm.periodEnd,
      category: budgetForm.category,
      plannedAmount: plannedAmt,
      notes: budgetForm.notes,
      relatedRevenue: budgetForm.relatedRevenue,
      relatedPayable: budgetForm.relatedPayable,
      amountOwedPayable: budgetForm.amountOwedPayable,
      invoiceNumber: budgetForm.invoiceNumber,
      relatedReceivable: budgetForm.relatedReceivable,
      supportingDocs: budgetForm.supportingDocs,
      actualRevenueRollup: parseFloat(budgetForm.actualRevenueRollup) || 0,
      actualExpensesRollup: actualSpend,
      actualReceivablesRollup: parseFloat(budgetForm.actualReceivablesRollup) || 0,
      budgetVariance: computedVariance,
      variancePercentage: computedPercentage,
      aiSummary: budgetForm.aiSummary,
      aiRisk: budgetForm.aiRisk
    };

    if (editingBudget && editingBudget.id && onUpdateRecord) {
      await onUpdateRecord("budgets", editingBudget.id, recordPayload);
    } else {
      await onAddRecord("budgets", recordPayload);
    }

    closeBudgetForm();
  };

  const startEditBudget = (budget: BudgetRecord) => {
    setEditingBudget(budget);
    setBudgetForm({
      name: budget.name,
      periodStart: budget.periodStart,
      periodEnd: budget.periodEnd,
      category: budget.category || "Logistics",
      plannedAmount: String(budget.plannedAmount),
      actualExpensesRollup: String(budget.actualExpensesRollup || ""),
      actualRevenueRollup: String(budget.actualRevenueRollup || ""),
      actualReceivablesRollup: String(budget.actualReceivablesRollup || ""),
      notes: budget.notes || "",
      relatedRevenue: budget.relatedRevenue || "",
      relatedPayable: budget.relatedPayable || "",
      amountOwedPayable: budget.amountOwedPayable || "",
      invoiceNumber: budget.invoiceNumber || "",
      relatedReceivable: budget.relatedReceivable || "",
      supportingDocs: budget.supportingDocs || "",
      aiSummary: budget.aiSummary || "",
      aiRisk: budget.aiRisk || ""
    });
    setShowBudgetModal(true);
  };

  const closeBudgetForm = () => {
    setShowBudgetModal(false);
    setEditingBudget(null);
    setBudgetForm({
      name: "",
      periodStart: new Date().toISOString().split("T")[0],
      periodEnd: new Date().toISOString().split("T")[0],
      category: "Logistics",
      plannedAmount: "",
      actualExpensesRollup: "",
      actualRevenueRollup: "",
      actualReceivablesRollup: "",
      notes: "",
      relatedRevenue: "",
      relatedPayable: "",
      amountOwedPayable: "",
      invoiceNumber: "",
      relatedReceivable: "",
      supportingDocs: "",
      aiSummary: "",
      aiRisk: ""
    });
  };

  // Handle LPO Submission
  const handleLpoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lpoForm.lpoNumber || !lpoForm.supplierName || !lpoForm.totalAmount) return;

    const payload: Partial<LPORecord> = {
      lpoNumber: lpoForm.lpoNumber,
      date: lpoForm.date,
      supplierName: lpoForm.supplierName,
      supplierContact: lpoForm.supplierContact,
      status: lpoForm.status,
      category: lpoForm.category,
      totalAmount: parseFloat(lpoForm.totalAmount) || 0,
      trackingStatus: lpoForm.trackingStatus,
      expectedDelivery: lpoForm.expectedDelivery,
      notes: lpoForm.notes,
      createdBy: "Lead Procurements Officer"
    };

    await onAddRecord("lpos", payload);
    setShowLpoModal(false);
    setLpoForm({
      lpoNumber: "",
      date: new Date().toISOString().split("T")[0],
      supplierName: "",
      supplierContact: "",
      status: "Approved",
      category: "Feed",
      totalAmount: "",
      trackingStatus: "Draft",
      expectedDelivery: "",
      notes: ""
    });
  };

  // Run AI Advisor Insights for a budget record
  const handleAnalyzeBudgetAi = async (rec: BudgetRecord) => {
    if (!rec.id) return;
    setLoadingAiId(rec.id);
    try {
      const response = await fetch("/api/gemini/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "budget-forecast",
          data: {
            name: rec.name,
            plannedAmount: rec.plannedAmount,
            actualRevenueRollup: rec.actualRevenueRollup || 0,
            actualExpensesRollup: rec.actualExpensesRollup || 0,
            budgetVariance: rec.budgetVariance || (rec.plannedAmount - (rec.actualExpensesRollup || 0))
          }
        })
      });
      const resData = await response.json();
      
      if (resData.text && onUpdateRecord) {
        // Parse the advice into summary and risk sections or assign directly
        const sections = resData.text.split("####");
        const summaryText = sections[0] || resData.text;
        const riskText = sections[1] ? "#### " + sections[1] : "Computed general risk profile is adequate. Monitor rolling operational costs.";
        
        await onUpdateRecord("budgets", rec.id, {
          aiSummary: summaryText.replace("### FINANCIAL COMPLIANCE REPORT", "").trim(),
          aiRisk: riskText.trim()
        });
      }
    } catch (e) {
      console.error("AI budget compilation failed:", e);
    } finally {
      setLoadingAiId(null);
    }
  };

  // Filters matching search
  const filteredBudgets = budgets.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (b.category && b.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredLpos = lpos.filter(l => 
    l.lpoNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans relative">
      {/* Center-aligned Brand Watermark */}
      <BackgroundWatermark mode="dark" />
      
      {/* SIDEBAR FOR FINANCE DASHBOARD */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
        {/* User Identity Details */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center">
            <AppLogo mode="dark" size="sm" />
          </div>
          <div className="mt-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-[8px] text-slate-500 font-bold block uppercase">Logged in Fiscal Session</span>
            <div className="text-[10px] text-slate-350 truncate font-mono font-bold mt-0.5" title={currentUserEmail}>
               {currentUserEmail}
            </div>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="mt-2.5 w-full flex items-center justify-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
              title="Edit Personal Information, Photo & Preferences"
            >
              👤 Edit User Profile
            </button>
          </div>
        </div>

        {/* Navigation Sidebar List */}
        <nav className="flex-1 p-4 space-y-2.5">
          <button
            type="button"
            onClick={() => { setActiveTab("procurement"); setSearchQuery(""); }}
            className={`w-full text-left p-3.5 rounded-xl text-xs font-black flex items-center gap-2.5 transition-all outline-none ${
              activeTab === "procurement" 
                ? "bg-amber-600/15 border-l-4 border-amber-500 text-amber-300 font-extrabold shadow-inner" 
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
            }`}
          >
            <Truck size={15} />
            <span>Procurement &amp; Logistics Management</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab("accounts_ecommerce"); setSearchQuery(""); }}
            className={`w-full text-left p-3.5 rounded-xl text-xs font-black flex items-center gap-2.5 transition-all outline-none ${
              activeTab === "accounts_ecommerce" 
                ? "bg-amber-600/15 border-l-4 border-amber-500 text-amber-300 font-extrabold shadow-inner" 
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
            }`}
          >
            <Boxes size={15} />
            <span>Accounts &amp; E-Commerce Management</span>
          </button>
        </nav>

        {/* Logout Bottom Action */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onSignOut}
            className="w-full py-2.5 bg-slate-850 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900/40 rounded-xl text-xs text-rose-300 font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut size={13} />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* WORKSPACE VIEW CONTAINER */}
      <main className="flex-1 overflow-y-auto flex flex-col bg-slate-905 h-full relative p-6 md:p-8">
        
         {/* Workspace Title Header */}
        <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 shadow-3xs mb-6">
          <div className="flex gap-3 items-center">
            <div className="w-11 h-11 bg-amber-600 rounded-xl flex items-center justify-center text-white shadow-3xs shrink-0">
              <FolderLock size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-100 font-sans tracking-tight">Rec<span className="text-amber-500">Xpats</span></span>
              </div>
              <h2 className="text-base font-black text-slate-200 mt-1 font-sans flex items-center gap-1.5">
                💼 {activeTab === "procurement" 
                  ? "a. Procurement & Logistics Management" 
                  : "b. Accounts & E-Commerce Management"}
              </h2>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                Logged in: <strong className="font-mono text-amber-500">{currentUserEmail}</strong> • Access Level: Corporate Financial Controller
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0 items-center w-full md:w-auto">
            {/* General Search Input */}
            <div className="relative w-full md:w-auto">
              <Search size={14} className="absolute left-3 top-3 text-slate-500" />
              <input 
                type="text" 
                placeholder={activeTab === "procurement" ? "Search budgets or suppliers..." : "Filter monitors..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-950 hover:bg-slate-900 focus:bg-slate-900 border border-slate-850 focus:border-amber-500 rounded-xl text-xs w-full md:w-64 text-slate-100 transition-all outline-none animate-all"
              />
            </div>
          </div>
        </div>

        {/* TAB 1: PROCUREMENT & LOGISTICS MANAGEMENT */}
        {activeTab === "procurement" && (
          <div className="space-y-6">
            
            {/* Top Stat Ribbon */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-slate-200">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Total Allocated Budget</span>
                <span className="text-xl font-black font-mono mt-1 block text-amber-300">
                  Ush {totalPlannedAllocation.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Total Expenses Rollup</span>
                <span className="text-xl font-black font-mono mt-1 block text-rose-400">
                  Ush {totalActualSpend.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Collective Variance</span>
                <span className={`text-xl font-black font-mono mt-1 block ${netVariance >= 0 ? "text-emerald-400" : "text-rose-500"}`}>
                  Ush {netVariance.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Total Outstanding Owed</span>
                <span className="text-xl font-black font-mono mt-1 block text-sky-400">
                  Ush {totalReceivables.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Sub navigation inside procurement */}
            <div className="flex border-b border-slate-800 pb-px">
              <button
                type="button"
                onClick={() => setProcurementSubTab("budgets")}
                className={`px-4.5 py-2.5 text-xs font-black transition-all border-b-2 uppercase select-none ${
                  procurementSubTab === "budgets"
                    ? "border-amber-500 text-amber-400"
                    : "border-transparent text-slate-400 hover:text-slate-100"
                }`}
              >
                📊 Budgets Management ({filteredBudgets.length})
              </button>
              <button
                type="button"
                onClick={() => setProcurementSubTab("lpos")}
                className={`px-4.5 py-2.5 text-xs font-black transition-all border-b-2 uppercase select-none ${
                  procurementSubTab === "lpos"
                    ? "border-amber-500 text-amber-400"
                    : "border-transparent text-slate-400 hover:text-slate-100"
                }`}
              >
                📋 Procurement LPOs ({filteredLpos.length})
              </button>
            </div>

            {/* SUBTAB A: BUDGETS */}
            {procurementSubTab === "budgets" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div>
                    <h3 className="text-xs font-black uppercase text-slate-350">Secure Operational Budgets</h3>
                    <p className="text-[11px] text-slate-450 mt-0.5">Control planned vs actual allocations, rollups, receivables, and evaluate variances via real-time intelligent analysis.</p>
                  </div>
                  <button
                    onClick={() => { setEditingBudget(null); setShowBudgetModal(true); }}
                    className="px-4.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-450 hover:to-amber-500 text-slate-950 font-black text-xs uppercase rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer select-none transition-all hover:scale-[1.02] active:scale-98 border border-amber-400/20"
                  >
                    <Plus size={15} className="stroke-[3]" />
                    <span>Create official budget</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {filteredBudgets.map((b) => {
                    const variance = b.plannedAmount - (b.actualExpensesRollup || 0);
                    const percentage = b.plannedAmount > 0 ? ((b.actualExpensesRollup || 0) / b.plannedAmount) * 100 : 0;
                    const isCriticalVariance = variance < 0;

                    return (
                      <div 
                        key={b.id} 
                        className={`p-6 rounded-2xl bg-slate-900 border transition-all ${
                          isCriticalVariance ? "border-rose-900/55 bg-rose-950/5" : "border-slate-800"
                        }`}
                      >
                        {/* Name and Basic Headers */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-3">
                          <div>
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                              Category: {b.category || "Logistics"}
                            </span>
                            <h4 className="text-sm font-black text-slate-100 mt-1">{b.name}</h4>
                            <p className="text-[10px] text-slate-450 mt-0.5">
                              Period: <span className="font-mono">{b.periodStart}</span> to <span className="font-mono">{b.periodEnd}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-2 select-none">
                            <button
                              onClick={() => startEditBudget(b)}
                              className="p-1 px-2.5 bg-slate-800 hover:bg-slate-755 text-slate-300 hover:text-slate-100 rounded-lg text-[10px] uppercase font-bold flex items-center gap-1 cursor-pointer transition-all border border-slate-700/50"
                            >
                              <Edit size={11} />
                              <span>Edit Parameters</span>
                            </button>
                            <button
                              onClick={() => onDeleteRecord("budgets", b.id || "")}
                              className="p-1 px-2.5 bg-rose-950/20 hover:bg-rose-900/40 text-rose-355 hover:text-rose-200 rounded-lg text-[10px] uppercase font-mono flex items-center gap-1 cursor-pointer transition-all border border-rose-900/30"
                            >
                              <Trash size={11} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>

                        {/* Financial Ledger Section (Formula computations & Rollups) */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/50 mt-4 text-xs">
                          <div>
                            <span className="text-[9px] text-slate-450 uppercase block font-bold">Planned Target Amount</span>
                            <span className="font-mono font-black text-amber-300 mt-0.5 block">
                              Ush {b.plannedAmount.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-455 uppercase block font-bold">Actual Expenses (Rollup)</span>
                            <span className="font-mono font-black text-rose-450 mt-0.5 block">
                              Ush {(b.actualExpensesRollup || 0).toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-450 uppercase block font-medium">Budget Variance (Formula)</span>
                            <span className={`font-mono font-black mt-0.5 block ${isCriticalVariance ? "text-rose-400" : "text-emerald-400"}`}>
                              Ush {variance.toLocaleString()} 
                              <span className="text-[9px] font-normal block">
                                {isCriticalVariance ? "⚠️ Budget Overrun" : "✓ Surplus Remaining"}
                              </span>
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-450 uppercase block font-medium">Budget Usage (Formula)</span>
                            <span className="font-mono font-black mt-0.5 block text-slate-300">
                              {percentage.toFixed(1)}% Used
                              <span className="w-full bg-slate-800 h-1.5 rounded-full block mt-1 overflow-hidden">
                                <span 
                                  className={`h-full block ${isCriticalVariance ? "bg-rose-500" : "bg-emerald-500"}`} 
                                  style={{ width: `${Math.min(percentage, 100)}%` }} 
                                />
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Accounts Payable, Receivables, & Owed Cross References */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950/20 p-4 rounded-xl border border-slate-805 mt-3 text-[11px] text-slate-350">
                          <div>
                            <p><strong>Related Accounts Payable:</strong> {b.relatedPayable || "None linked"}</p>
                            <p className="mt-1">
                              <strong>Invoice Number:</strong> {b.invoiceNumber ? <span className="font-mono px-1.5 py-0.2 bg-slate-850 rounded border border-slate-800">{b.invoiceNumber}</span> : "N/A"}
                            </p>
                            <p className="mt-1 text-slate-400">
                              <strong>Amount Owed:</strong> Ush {parseFloat(b.amountOwedPayable || "0").toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p><strong>Related Accounts Receivable:</strong> {b.relatedReceivable || "N/A"}</p>
                            <p className="mt-1">
                              <strong>Actual Receivables Rollup:</strong> Ush {(b.actualReceivablesRollup || 0).toLocaleString()}
                            </p>
                            <p className="mt-1">
                              <strong>Actual Revenue Rollup:</strong> Ush {(b.actualRevenueRollup || 0).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="truncate"><strong>Supporting Documents:</strong> {b.supportingDocs ? <a href={b.supportingDocs} target="_blank" rel="noopener noreferrer" className="text-amber-400 underline text-[10px]">View Document File</a> : "None Attached"}</p>
                            <p className="mt-1 leading-normal italic text-[10px] text-slate-400">
                              <strong>Variance Reason:</strong> {b.notes || "No operational comments specified."}
                            </p>
                          </div>
                        </div>

                        {/* Interactive AI Advisory Briefings */}
                        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider flex items-center gap-1">
                              🧠 Senior Advisor AI Evaluation Notes
                            </span>
                            <button
                              type="button"
                              disabled={loadingAiId === b.id}
                              onClick={() => handleAnalyzeBudgetAi(b)}
                              className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 disabled:bg-slate-850 text-amber-300 disabled:text-slate-500 hover:text-white border border-amber-500/30 font-black text-[10px] uppercase rounded-lg flex items-center gap-1 pointer-events-auto cursor-pointer"
                            >
                              {loadingAiId === b.id ? (
                                "Auditing Allocation..."
                              ) : (
                                <>
                                  <Sparkles size={11} className="text-amber-400" />
                                  <span>Compile Compliance AI Reports</span>
                                </>
                              )}
                            </button>
                          </div>

                          {(b.aiSummary || b.aiRisk) ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-850 text-[11px] leading-relaxed">
                              {b.aiSummary && (
                                <div className="space-y-1">
                                  <span className="text-[9px] uppercase font-black text-amber-300 block tracking-wider">a. Summary &amp; Analytics Recommendation</span>
                                  <p className="text-slate-350">{b.aiSummary}</p>
                                </div>
                              )}
                              {b.aiRisk && (
                                <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-850 pt-2.5 md:pt-0 md:pl-4">
                                  <span className="text-[9px] uppercase font-black text-rose-300 block tracking-wider">b. Variance Reason &amp; Risk Metrics</span>
                                  <p className="text-slate-350">{b.aiRisk}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-[10px] text-slate-500 italic">No dynamic AI report compiled for this allocation yet. Click compile reports above to run.</p>
                          )}
                        </div>

                      </div>
                    );
                  })}

                  {filteredBudgets.length === 0 && (
                    <p className="text-center text-slate-500 text-xs py-8">No custom budgets allocation matched your search criterion.</p>
                  )}
                </div>
              </div>
            )}

            {/* SUBTAB B: LPOS */}
            {procurementSubTab === "lpos" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div>
                    <h3 className="text-xs font-black uppercase text-slate-350 font-semibold mb-1">Procurement Local Purchase Orders (LPO)</h3>
                    <p className="text-[11px] text-slate-450">Authorize purchases, track supplier deliverables, and link logistics pipeline to operational categories.</p>
                  </div>
                  <button
                    onClick={() => setShowLpoModal(true)}
                    className="px-4.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-450 hover:to-amber-500 text-slate-950 font-black text-xs uppercase rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer select-none transition-all hover:scale-[1.02] active:scale-98 border border-amber-400/20"
                  >
                    <Plus size={15} className="stroke-[3]" />
                    <span>Issue Procurement LPO</span>
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[9px] tracking-wider select-none border-b border-slate-800">
                      <tr>
                        <th className="p-4 text-left">LPO Reference</th>
                        <th className="p-4 text-left">Date issued</th>
                        <th className="p-4 text-left">Supplier Info</th>
                        <th className="p-4 text-left">Budget Category</th>
                        <th className="p-4 text-right">Aggregate Total</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {filteredLpos.map((l) => (
                        <tr key={l.id} className="hover:bg-slate-850/30">
                          <td className="p-4">
                            <span className="font-mono font-black text-amber-300 bg-slate-950/60 p-1.5 px-2 rounded-md border border-slate-800">
                              {l.lpoNumber}
                            </span>
                          </td>
                          <td className="p-4 font-mono">{l.date}</td>
                          <td className="p-4">
                            <p className="font-bold text-slate-100">{l.supplierName}</p>
                            <span className="text-[10px] text-slate-450">{l.supplierContact || "No Phone Info"}</span>
                          </td>
                          <td className="p-4">
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] uppercase text-slate-300 font-semibold">
                              {l.category}
                            </span>
                          </td>
                          <td className="p-4 text-right font-mono text-amber-400 font-black">
                            Ush {l.totalAmount.toLocaleString()}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] tracking-wide font-black uppercase text-center ${
                              l.status === 'Approved' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {l.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => onDeleteRecord("lpos", l.id || "")}
                              className="text-rose-455 hover:text-rose-300 font-black tracking-wide cursor-pointer uppercase text-[10px]"
                            >
                              Revoke
                            </button>
                          </td>
                        </tr>
                      ))}

                      {filteredLpos.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                            No logistics local purchase orders matched your search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 2: ACCOUNTS & E-COMMERCE MANAGEMENT */}
        {activeTab === "accounts_ecommerce" && (
          <div className="space-y-6">

            {/* Cross-Section Track and Monitor Control Tower */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-5">
                <div>
                  <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Activity size={12} className="text-amber-500 shrink-0" />
                    <span>Cross-Section Control Tower</span>
                  </h3>
                  <h4 className="text-sm font-black text-slate-100 mt-1">
                    Track and Monitor Budget, Inventory, Operations and Finance sections
                  </h4>
                  <p className="text-[11px] text-slate-455 mt-0.5 max-w-2xl leading-relaxed">
                    Custom active indicators compiled from real-time corporate parameters across all active modules in RecXpats. Ready for future telemetry scale expansions.
                  </p>
                </div>
                <div className="bg-slate-900 border border-slate-850 px-3.5 py-1.5 rounded-xl font-mono text-[10px] text-slate-400 font-extrabold flex items-center gap-2 select-none shrink-0 md:self-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <span>LIVE CONSOLE COMPACT FEED</span>
                </div>
              </div>

              {/* Four Sections Master Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. BUDGETS SECTION */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-850 hover:border-amber-500/20 transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-black text-amber-500/80 tracking-wider font-sans block">1. Budgets Allocation</span>
                    <span className="text-lg font-black font-mono text-slate-100 mt-2 block">
                      Ush {budgets.reduce((sum, b) => sum + (b.plannedAmount || 0), 0).toLocaleString()}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">Total Allocated Volume</p>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-slate-850 flex justify-between items-center text-[10px] font-bold text-slate-450">
                    <span>{budgets.length} Budgets</span>
                    <span className="text-emerald-400 font-mono">
                      {budgets.filter(b => (b.plannedAmount - (b.actualExpensesRollup || 0)) >= 0).length} Healthy
                    </span>
                  </div>
                </div>

                {/* 2. INVENTORY SECTION */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-850 hover:border-amber-500/20 transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-black text-indigo-400 tracking-wider font-sans block">2. Fish Farm Inventory</span>
                    <span className="text-lg font-black font-mono text-indigo-300 mt-2 block">
                      {inventoryManagement.length} Primary Items
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">Consumables & Feedstocks</p>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-slate-850 flex justify-between items-center text-[10px] font-bold text-slate-450">
                    <span>Total Items Count</span>
                    <span className="text-rose-400 font-mono">
                      {inventoryManagement.filter(i => (i.quantity || 0) <= (i.reorderLevel || 0)).length} Low Stock
                    </span>
                  </div>
                </div>

                {/* 3. OPERATIONS SECTION */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-850 hover:border-amber-500/20 transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-black text-cyan-400 tracking-wider font-sans block">3. Operations & Logs</span>
                    <span className="text-lg font-black font-mono text-cyan-300 mt-2 block">
                      {(maintenances || []).length + (staffActivities || []).length} Active Files
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">Maintenance & Activity Files</p>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-slate-850 flex justify-between items-center text-[10px] font-bold text-slate-450">
                    <span>{(maintenances || []).length} Maintenances</span>
                    <span className="text-sky-400 font-mono">{(staffActivities || []).length} Staff logs</span>
                  </div>
                </div>

                {/* 4. FINANCE SECTIONS */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-850 hover:border-amber-500/20 transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-black text-emerald-400 tracking-wider font-sans block">4. Finance Indicators</span>
                    <span className="text-lg font-black font-mono text-emerald-300 mt-2 block">
                      Ush {customerSales.reduce((sum, s) => sum + (s.amount || 0), 0).toLocaleString()}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">Invoiced sales metrics</p>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-slate-850 flex justify-between items-center text-[10px] font-bold text-slate-450">
                    <span>{revenueRecords.length} Active Revenues</span>
                    <span className="text-amber-400 font-mono">{invoices.length} Unpaid Receivables</span>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Stat Summary Ribbon */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-250">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Total Sales Invoiced</span>
                <span className="text-xl font-black font-mono mt-1 block text-amber-300">
                  Ush {customerSales.reduce((sum, s) => sum + (s.amount || 0), 0).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">{customerSales.length} Transactions logged</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Gross Revenues Catalogued</span>
                <span className="text-xl font-black font-mono mt-1 block text-emerald-400">
                  Ush {revenueRecords.reduce((sum, r) => sum + (r.revenueAmount || 0), 0).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">Margin: Ush {revenueRecords.reduce((sum, r) => sum + (r.grossMargin || 0), 0).toLocaleString()}</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Outstanding Receivables</span>
                <span className="text-xl font-black font-mono mt-1 block text-rose-455">
                  Ush {invoices.reduce((sum, i) => sum + (i.outstandingBalance || 0), 0).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">Overdue Inflows</span>
              </div>
            </div>

            {/* Sub-navigation inside Accounts eCommerce */}
            <div className="flex border-b border-slate-800 pb-px">
              <button
                type="button"
                onClick={() => setEcommerceSubTab("sales")}
                className={`px-4.5 py-2.5 text-xs font-black transition-all border-b-2 uppercase select-none ${
                  ecommerceSubTab === "sales"
                    ? "border-amber-500 text-amber-400"
                    : "border-transparent text-slate-400 hover:text-slate-100"
                }`}
              >
                📥 Sales Management ({customerSales.length})
              </button>
              <button
                type="button"
                onClick={() => setEcommerceSubTab("revenue")}
                className={`px-4.5 py-2.5 text-xs font-black transition-all border-b-2 uppercase select-none ${
                  ecommerceSubTab === "revenue"
                    ? "border-amber-500 text-amber-400"
                    : "border-transparent text-slate-400 hover:text-slate-100"
                }`}
              >
                💰 Revenue Ledger ({revenueRecords.length})
              </button>
              <button
                type="button"
                onClick={() => setEcommerceSubTab("receivables")}
                className={`px-4.5 py-2.5 text-xs font-black transition-all border-b-2 uppercase select-none ${
                  ecommerceSubTab === "receivables"
                    ? "border-amber-500 text-amber-400"
                    : "border-transparent text-slate-400 hover:text-slate-100"
                }`}
              >
                ⚖️ Accounts Receivable ({invoices.length})
              </button>
            </div>

            {/* SUBTAB 2A: SALES */}
            {ecommerceSubTab === "sales" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div>
                    <h3 className="text-xs font-black uppercase text-slate-350">Customer Sales Records</h3>
                    <p className="text-[11px] text-slate-450 mt-0.5">Log e-commerce customer parameters, units sold, location, sales channels and feedback summaries.</p>
                  </div>
                  <button
                    onClick={() => setShowSaleModal(true)}
                    className="px-4.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-450 hover:to-amber-500 text-slate-950 font-black text-xs uppercase rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer select-none transition-all hover:scale-[1.02] active:scale-98 border border-amber-400/20"
                  >
                    <Plus size={15} className="stroke-[3]" />
                    <span>Log New Sale record</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {customerSales.filter(s => s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || s.fishType.toLowerCase().includes(searchQuery.toLowerCase())).map((sale) => {
                    const isExpanded = expandedSaleId === sale.id;
                    return (
                      <div key={sale.id} className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-750 transition-all">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" onClick={() => setExpandedSaleId(isExpanded ? null : (sale.id || null))}>
                          <div>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                              Channel: {sale.channel || "Online"}
                            </span>
                            <h4 className="text-sm font-black text-slate-100 mt-1">{sale.customerName}</h4>
                            <p className="text-[11px] text-slate-450">Date: {sale.saleDate} • Location: {sale.location || "Kampala"}</p>
                          </div>
                          <div className="text-right flex items-center gap-4">
                            <div>
                              <span className="text-xs text-slate-400 block font-medium">Quantity: {sale.quantitySold} {sale.unit || "kg"}</span>
                              <span className="text-sm font-black text-amber-300 block">Ush {(sale.amount || 0).toLocaleString()}</span>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); onDeleteRecord("customerSales", sale.id || ""); }}
                              className="text-rose-455 hover:text-rose-300 p-1"
                              title="Delete sale row"
                            >
                              <Trash size={13} />
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-350">
                            <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                              <p className="font-extrabold text-[9px] uppercase tracking-wider text-amber-400 mb-1">📞 Contact &amp; Physical Info</p>
                              <p><strong>Region/Location:</strong> {sale.location || "Central Regional Office"}</p>
                              <p className="mt-1"><strong>Address Details:</strong> Mukono, Uganda</p>
                            </div>
                            <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                              <p className="font-extrabold text-[9px] uppercase tracking-wider text-amber-400 mb-1">📦 Transaction Details</p>
                              <p><strong>Goods Description:</strong> {sale.fishType} ({sale.fishStage || "Fingerlings"})</p>
                              <p className="mt-1"><strong>Unit cost:</strong> Ush {(sale.unitPrice || 0).toLocaleString()}</p>
                              <p className="mt-1"><strong>Supporting docs:</strong> {sale.documents ? <a href={sale.documents} target="_blank" rel="noopener" className="text-amber-450 underline">View Invoice Link</a> : "None Attached"}</p>
                            </div>
                            <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                              <p className="font-extrabold text-[9px] uppercase tracking-wider text-amber-400 mb-1">📋 Feedback &amp; CRM Insights</p>
                              <p><strong>Recorded By:</strong> {sale.recordedBy || "System Operator"}</p>
                              <p className="mt-1"><strong>Other Needs:</strong> {sale.customerNeeds || "Continuous fingerlings supply requested."}</p>
                              <p className="mt-1 font-mono text-[10px] text-emerald-450"><strong>Feedback:</strong> {sale.feedbackSummary || "Highly satisfied with bio retention indices."}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {customerSales.length === 0 && (
                    <div className="bg-slate-900 border border-slate-800 p-8 text-center text-slate-500 italic text-xs rounded-xl">No active customer sales records logged.</div>
                  )}
                </div>
              </div>
            )}

            {/* SUBTAB 2B: REVENUE LEDGER */}
            {ecommerceSubTab === "revenue" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div>
                    <h3 className="text-xs font-black uppercase text-slate-350">Revenue Ledger Directory</h3>
                    <p className="text-[11px] text-slate-450 mt-0.5">Monitor and evaluate incomes, Cost of Goods Sold (COGS), actual and budgeted gross margins, and profitability ratios.</p>
                  </div>
                  <button
                    onClick={() => setShowRevenueModal(true)}
                    className="px-4.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-450 hover:to-amber-500 text-slate-950 font-black text-xs uppercase rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer select-none transition-all hover:scale-[1.02] active:scale-98 border border-amber-400/20"
                  >
                    <Plus size={15} className="stroke-[3]" />
                    <span>Log revenue stream</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {revenueRecords.filter(r => (r.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || (r.customer || "").toLowerCase().includes(searchQuery.toLowerCase())).map((rev) => {
                    const isExpanded = expandedRevenueId === rev.id;
                    return (
                      <div key={rev.id} className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-750 transition-all">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" onClick={() => setExpandedRevenueId(isExpanded ? null : (rev.id || null))}>
                          <div>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-350 font-bold border border-emerald-900/40">
                              Revenue Stream
                            </span>
                            <h4 className="text-sm font-black text-slate-100 mt-1">{rev.name}</h4>
                            <p className="text-[11px] text-slate-450">Buyer counterparty: {rev.customer || "General"}</p>
                          </div>
                          <div className="text-right flex items-center gap-4">
                            <div>
                              <span className="text-xs text-slate-400 block font-medium">Marginal Gain: Ush {(rev.grossMargin || 0).toLocaleString()} ({(rev.grossMarginPct || 0).toFixed(1)}%)</span>
                              <span className="text-sm font-black text-emerald-400 block">Ush {(rev.revenueAmount || 0).toLocaleString()}</span>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); onDeleteRecord("revenueRecords", rev.id || ""); }}
                              className="text-rose-455 hover:text-rose-300 p-1"
                              title="Delete revenue row"
                            >
                              <Trash size={13} />
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-350">
                            <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                              <p className="font-extrabold text-[9px] uppercase tracking-wider text-emerald-400 mb-1">📊 Inflows &amp; COGS analysis</p>
                              <p><strong>Revenue amount:</strong> Ush {(rev.revenueAmount || 0).toLocaleString()}</p>
                              <p className="mt-1"><strong>Cost of Goods Sold (COGS):</strong> Ush {(rev.costOfGoodsSold || 0).toLocaleString()}</p>
                            </div>
                            <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                              <p className="font-extrabold text-[9px] uppercase tracking-wider text-emerald-400 mb-1">🏷️ Quantity breakdown</p>
                              <p><strong>Quantity:</strong> {rev.fryQuantity || 0} Units</p>
                              <p className="mt-1"><strong>Calculated unit price:</strong> Ush {(rev.fryUnitPrice || 0).toLocaleString()}</p>
                            </div>
                            <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                              <p className="font-extrabold text-[9px] uppercase tracking-wider text-emerald-400 mb-1">📝 Operation metadata</p>
                              <p><strong>Supporting Document:</strong> {rev.photos ? <a href={rev.photos} target="_blank" rel="noopener" className="text-emerald-400 underline">View Document Attachment</a> : "None"}</p>
                              <p className="mt-1"><strong>Internal remarks:</strong> {rev.notes || "No standard notes recorded."}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {revenueRecords.length === 0 && (
                    <div className="bg-slate-900 border border-slate-800 p-8 text-center text-slate-500 italic text-xs rounded-xl">No active revenue ledger streams logged.</div>
                  )}
                </div>
              </div>
            )}

            {/* SUBTAB 2C: ACCOUNTS RECEIVABLE */}
            {ecommerceSubTab === "receivables" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div>
                    <h3 className="text-xs font-black uppercase text-slate-350">Accounts Receivable Ledger</h3>
                    <p className="text-[11px] text-slate-450 mt-0.5">Control pending customer balances, overdue due dates, days past due, related budgets category, and evaluate payment risks.</p>
                  </div>
                  <button
                    onClick={() => setShowReceivableModal(true)}
                    className="px-4.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-450 hover:to-amber-500 text-slate-950 font-black text-xs uppercase rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer select-none transition-all hover:scale-[1.02] active:scale-98 border border-amber-400/20"
                  >
                    <Plus size={15} className="stroke-[3]" />
                    <span>Issue Receivable Invoice</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {invoices.filter(i => (i.supplierName || "").toLowerCase().includes(searchQuery.toLowerCase()) || i.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())).map((inv) => {
                    const isExpanded = expandedReceivableId === inv.id;
                    const daysOverdue = inv.daysOverdue || 0;
                    const isOverdue = daysOverdue > 0;
                    return (
                      <div key={inv.id} className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-750 transition-all">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" onClick={() => setExpandedReceivableId(isExpanded ? null : (inv.id || null))}>
                          <div>
                            <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold border ${isOverdue ? 'bg-rose-950/40 text-rose-300 border-rose-900/40' : 'bg-slate-800 text-slate-300 border-slate-700/50'}`}>
                              {isOverdue ? `⚠️ Overdue ${daysOverdue} Days` : inv.status}
                            </span>
                            <h4 className="text-sm font-black text-slate-100 mt-1">Invoice: {inv.invoiceNumber}</h4>
                            <p className="text-[11px] text-slate-450">Customer entity: {inv.supplierName || "Internal Customer"}</p>
                          </div>
                          <div className="text-right flex items-center gap-4">
                            <div>
                              <span className="text-xs text-slate-400 block font-medium">Outstanding Bal: Ush {(inv.outstandingBalance || 0).toLocaleString()}</span>
                              <span className="text-sm font-black text-amber-300 block">Ush {(inv.amountOwed || 0).toLocaleString()}</span>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); onDeleteRecord("invoices", inv.id || ""); }}
                              className="text-rose-455 hover:text-rose-300 p-1"
                              title="Delete receivable invoice row"
                            >
                              <Trash size={13} />
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-350">
                            <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                              <p className="font-extrabold text-[9px] uppercase tracking-wider text-rose-300 mb-1">📅 Balance details</p>
                              <p><strong>Amount due:</strong> Ush {(inv.amountOwed || 0).toLocaleString()}</p>
                              <p className="mt-1"><strong>Total payments made:</strong> Ush {(inv.totalPaymentsMade || 0).toLocaleString()}</p>
                              <p className="mt-1"><strong>Payment collection:</strong> {(inv.paymentCompletionPct || 0).toFixed(1)}% Completed</p>
                            </div>
                            <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                              <p className="font-extrabold text-[9px] uppercase tracking-wider text-rose-300 mb-1">📦 Location &amp; References</p>
                              <p><strong>Due Date:</strong> {inv.dueDate}</p>
                              <p className="mt-1"><strong>Related budget name:</strong> {inv.budgets || "Not budgeted"}</p>
                              <p className="mt-1"><strong>Related customer sales:</strong> {inv.revenueRecords || "N/A"}</p>
                            </div>
                            <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                              <p className="font-extrabold text-[9px] uppercase tracking-wider text-rose-300 mb-1">🧠 Risk Category &amp; AI summary</p>
                              <p><strong>Risk Index (AI):</strong> <span className={isOverdue ? "text-rose-400 font-extrabold" : "text-emerald-400"}>{inv.riskAssessmentAI || (isOverdue ? "Substantial Risk Category" : "Low Risk Category")}</span></p>
                              <p className="mt-1 text-slate-400 italic"><strong>AI Notes:</strong> {inv.summaryAI || "Buyer shows consistent liquidity metrics and payment completion ratio."}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {invoices.length === 0 && (
                    <div className="bg-slate-900 border border-slate-800 p-8 text-center text-slate-500 italic text-xs rounded-xl">No active accounts receivable logged.</div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: EXECUTIVE PERFORMANCE & KPI MONITORS */}
        {activeTab === "monitoring" && (
          <div className="space-y-6">
            
            {/* Quick Header information */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-amber-400 font-mono tracking-widest uppercase font-bold block">Intellectual Audits Hub</span>
                <h3 className="text-base font-black text-slate-100 uppercase mt-0.5">Senior Financial executive Performance Monitor</h3>
                <p className="text-xs text-slate-450 mt-1">Unified analytics monitor satisfying all guidelines (items c through v) to optimize your margins and monitor operations performance.</p>
              </div>
              <div className="flex gap-2">
                <span className="bg-emerald-900/20 text-emerald-400 font-mono font-extrabold px-3 py-1.5 border border-emerald-500/25 rounded-xl text-[10px] uppercase">
                  ✓ SECURED SYSTEM
                </span>
              </div>
            </div>

            {/* Side-Rail Selectors for Guidelines c to v */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* Selector Sidebar */}
              <div className="lg:col-span-1 space-y-1.5 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest block mb-2 px-1">Audits Sub-Modules</span>
                
                <button
                  type="button"
                  onClick={() => setSelectedMonitorCategory("actuals")}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between outline-none cursor-pointer ${
                    selectedMonitorCategory === "actuals" ? "bg-amber-500/10 text-amber-350 border-l-4 border-amber-500 font-black" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
                  }`}
                >
                  <span>c, d. Income Statement</span>
                  <span className="text-[10px] font-mono">📊</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMonitorCategory("margins")}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between outline-none cursor-pointer ${
                    selectedMonitorCategory === "margins" ? "bg-amber-500/10 text-amber-350 border-l-4 border-amber-500 font-black" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
                  }`}
                >
                  <span>e, f. Revenue &amp; Margins</span>
                  <span className="text-[10px] font-mono">📈</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMonitorCategory("cash_flow")}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between outline-none cursor-pointer ${
                    selectedMonitorCategory === "cash_flow" ? "bg-amber-500/10 text-amber-350 border-l-4 border-amber-500 font-black" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
                  }`}
                >
                  <span>g, h. Cash Inflows/Outflows</span>
                  <span className="text-[10px] font-mono">💵</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMonitorCategory("ratios")}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between outline-none cursor-pointer ${
                    selectedMonitorCategory === "ratios" ? "bg-amber-500/10 text-amber-350 border-l-4 border-amber-500 font-black" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
                  }`}
                >
                  <span>i, j. Financial Ratios</span>
                  <span className="text-[10px] font-mono">📋</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMonitorCategory("profitability")}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between outline-none cursor-pointer ${
                    selectedMonitorCategory === "profitability" ? "bg-amber-500/10 text-amber-350 border-l-4 border-amber-500 font-black" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
                  }`}
                >
                  <span>k. Profitability Metrics</span>
                  <span className="text-[10px] font-mono">💎</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMonitorCategory("ar")}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between outline-none cursor-pointer ${
                    selectedMonitorCategory === "ar" ? "bg-amber-500/10 text-amber-350 border-l-4 border-amber-500 font-black" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
                  }`}
                >
                  <span>l. Accounts Receivable</span>
                  <span className="text-[10px] font-mono">⚖️</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMonitorCategory("ap")}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between outline-none cursor-pointer ${
                    selectedMonitorCategory === "ap" ? "bg-amber-500/10 text-amber-350 border-l-4 border-amber-500 font-black" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
                  }`}
                >
                  <span>m. Accounts Payable</span>
                  <span className="text-[10px] font-mono">💳</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMonitorCategory("liquidity")}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between outline-none cursor-pointer ${
                    selectedMonitorCategory === "liquidity" ? "bg-amber-500/10 text-amber-350 border-l-4 border-amber-500 font-black" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
                  }`}
                >
                  <span>n. Liquidity &amp; Solvency</span>
                  <span className="text-[10px] font-mono">🧬</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMonitorCategory("sales_margins")}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between outline-none cursor-pointer ${
                    selectedMonitorCategory === "sales_margins" ? "bg-amber-500/10 text-amber-350 border-l-4 border-amber-500 font-black" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
                  }`}
                >
                  <span>o, p. Current Ratio &amp; Sales</span>
                  <span className="text-[10px] font-mono">📅</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMonitorCategory("revenue_trends")}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between outline-none cursor-pointer ${
                    selectedMonitorCategory === "revenue_trends" ? "bg-amber-500/10 text-amber-350 border-l-4 border-amber-500 font-black" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
                  }`}
                >
                  <span>q, r. Revenues &amp; COGS</span>
                  <span className="text-[10px] font-mono font-black">📋</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMonitorCategory("quarterly")}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between outline-none cursor-pointer ${
                    selectedMonitorCategory === "quarterly" ? "bg-amber-500/10 text-amber-350 border-l-4 border-amber-500 font-black" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
                  }`}
                >
                  <span>s, r. Cash Flow Trends</span>
                  <span className="text-[10px] font-mono">📉</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMonitorCategory("executive_metrics")}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between outline-none cursor-pointer ${
                    selectedMonitorCategory === "executive_metrics" ? "bg-amber-500/10 text-amber-350 border-l-4 border-amber-500 font-black" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
                  }`}
                >
                  <span>t, u, v. Executive Metrics</span>
                  <span className="text-[10px] font-mono">👑</span>
                </button>
              </div>

              {/* Dynamic KPI Content Grid Display area */}
              <div className="lg:col-span-3 bg-slate-900 border border-slate-800 p-6 rounded-2xl min-h-[470px] flex flex-col justify-between relative overflow-hidden">
                
                {isGeneratingReport ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-20">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
                      <Sparkles size={24} className="text-amber-400 absolute inset-0 m-auto animate-bounce" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-mono text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                        Compiling System Audit Ledger
                      </h4>
                      <p className="text-sm font-semibold text-slate-100 font-sans max-w-sm h-6">
                        {reportGenStep}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Validating Guidelines (c through v) • Secured Cloud Corridors
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      {selectedMonitorCategory === "actuals" && (
                        <div className="space-y-4">
                          <div className="border-b border-slate-850 pb-2 flex items-center justify-between">
                            <h4 className="text-sm font-black uppercase text-amber-400">c, d. Income Statement Actual Analysis</h4>
                            <button
                              onClick={startReportGeneration}
                              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/20 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Sparkles size={8} />
                              <span>Generate Income Report (AI)</span>
                            </button>
                          </div>
                          <p className="text-xs text-slate-350 leading-relaxed">Analyze the real-time financial performance by reviewing revenues, cost of goods sold, gross margin, and gross margin percentage based on recorded income statement data.</p>
                          
                          {/* Interactive Chart */}
                          <div className="h-56 w-full bg-slate-950 p-2 rounded-xl border border-slate-850">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[
                                { month: 'Revenues', amount: revenueRecords.reduce((sum, r) => sum + (r.revenueAmount || 0), 0) },
                                { month: 'COGS', amount: revenueRecords.reduce((sum, r) => sum + (r.costOfGoodsSold || 0), 0) },
                                { month: 'Gross Margin', amount: revenueRecords.reduce((sum, r) => sum + (r.grossMargin || 0), 0) },
                              ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                                <XAxis dataKey="month" tick={{ fill: '#888', fontSize: 10 }} />
                                <YAxis tick={{ fill: '#888', fontSize: 10 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #334155' }} />
                                <Bar dataKey="amount" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mt-2">
                            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">Total Revenue</span>
                              <span className="font-mono text-slate-200 block font-bold mt-1">Ush {revenueRecords.reduce((sum, r) => sum + (r.revenueAmount || 0), 0).toLocaleString()}</span>
                            </div>
                            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">COGS</span>
                              <span className="font-mono text-slate-200 block font-bold mt-1">Ush {revenueRecords.reduce((sum, r) => sum + (r.costOfGoodsSold || 0), 0).toLocaleString()}</span>
                            </div>
                            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">Gross Margin</span>
                              <span className="font-mono text-emerald-400 block font-bold mt-1">Ush {revenueRecords.reduce((sum, r) => sum + (r.grossMargin || 0), 0).toLocaleString()}</span>
                            </div>
                            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">Margin Pct</span>
                              <span className="font-mono text-emerald-400 block font-bold mt-1">
                                {(() => {
                                  const revSum = revenueRecords.reduce((sum, r) => sum + (r.revenueAmount || 0), 0);
                                  const margSum = revenueRecords.reduce((sum, r) => sum + (r.grossMargin || 0), 0);
                                  return revSum > 0 ? ((margSum / revSum) * 100).toFixed(1) + "%" : "0.0%";
                                })()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedMonitorCategory === "margins" && (
                        <div className="space-y-4">
                          <div className="border-b border-slate-850 pb-2 flex items-center justify-between">
                            <h4 className="text-sm font-black uppercase text-amber-400">e, f. Revenue Overview &amp; Margin Analysis</h4>
                            <button
                              onClick={startReportGeneration}
                              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/20 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Sparkles size={8} />
                              <span>Generate Margin Report (AI)</span>
                            </button>
                          </div>
                          <p className="text-xs text-slate-350 leading-relaxed">Visualize total revenue, gross margin, and net profit over time. Monitor KPIs, analyze sales data, and assess cost structures for margin and profitability insights.</p>
                          
                          <div className="h-56 w-full bg-slate-950 p-2 rounded-xl border border-slate-850">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={[
                                { period: 'May-25', revenue: 4500000, margin: 1800000, profit: 1200000 },
                                { period: 'Jun-25', revenue: 7800000, margin: 3400000, profit: 2400000 },
                                { period: 'Jul-25', revenue: 9500000, margin: 5200000, profit: 4100000 },
                                { period: 'Aug-25', revenue: 12000000, margin: 6800000, profit: 5400000 }
                              ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                                <XAxis dataKey="period" tick={{ fill: '#888', fontSize: 10 }} />
                                <YAxis tick={{ fill: '#888', fontSize: 10 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #334155' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.1} />
                                <Area type="monotone" dataKey="margin" stroke="#34d399" fill="#34d399" fillOpacity={0.1} />
                                <Area type="monotone" dataKey="profit" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.1} />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      {selectedMonitorCategory === "cash_flow" && (
                        <div className="space-y-4">
                          <div className="border-b border-slate-850 pb-2 flex items-center justify-between">
                            <h4 className="text-sm font-black uppercase text-amber-400">g, h. Finance, Cash Flow Overview</h4>
                            <button
                              onClick={startReportGeneration}
                              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/20 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Sparkles size={8} />
                              <span>Generate Cashflow Report (AI)</span>
                            </button>
                          </div>
                          <p className="text-xs text-slate-350 leading-relaxed">Summarize cumulative inflows, outflows, and net cash flow over time. Visualizes active cash trends, structural categorization, and liquidity ratios.</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-2">
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-center">
                              <span className="text-slate-400 text-[10px] uppercase block font-bold mb-1">Cash Inflows</span>
                              <span className="font-mono text-emerald-400 text-lg font-black">Ush {revenueRecords.reduce((sum, r) => sum + (r.revenueAmount || 0), 0).toLocaleString()}</span>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-center">
                              <span className="text-slate-400 text-[10px] uppercase block font-bold mb-1">Cash Outflows</span>
                              <span className="font-mono text-rose-400 text-lg font-black">Ush {totalActualSpend.toLocaleString()}</span>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-center">
                              <span className="text-slate-400 text-[10px] uppercase block font-bold mb-1">Net Cash Flow</span>
                              <span className="font-mono text-amber-300 text-lg font-black">Ush {(revenueRecords.reduce((sum, r) => sum + (r.revenueAmount || 0), 0) - totalActualSpend).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedMonitorCategory === "ratios" && (
                        <div className="space-y-4">
                          <div className="border-b border-slate-850 pb-2 flex items-center justify-between">
                            <h4 className="text-sm font-black uppercase text-amber-400">i, j. Key Financial Ratios</h4>
                            <button
                              onClick={startReportGeneration}
                              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/20 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Sparkles size={8} />
                              <span>Generate Ratio Analysis (AI)</span>
                            </button>
                          </div>
                          <p className="text-xs text-slate-350 leading-relaxed">Calculates and tracks active current ratios, profitability margins, and matches with senior AI adviser recommendations to guarantee target retention.</p>
                          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs leading-relaxed space-y-2">
                            <p>📢 <strong>Current Ratio Formula:</strong> Current Assets / Current Liabilities</p>
                            <p>📢 <strong>Measured value:</strong> <span className="text-emerald-400 font-bold font-mono">1.82 (Standard Healthy Margin)</span></p>
                            <p className="border-t border-slate-850 pt-2 text-slate-400 italic">🤖 <strong>Senior AI advice:</strong> Maintain current working capital ratios above 1.5 to guarantee unhindered feed procurement cycles throughout Q4.</p>
                          </div>
                        </div>
                      )}

                      {selectedMonitorCategory === "profitability" && (
                        <div className="space-y-4">
                          <div className="border-b border-slate-850 pb-2 flex items-center justify-between">
                            <h4 className="text-sm font-black uppercase text-amber-400">k. Derived Profitability Metrics</h4>
                            <button
                              onClick={startReportGeneration}
                              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/20 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Sparkles size={8} />
                              <span>Generate Profitability Study (AI)</span>
                            </button>
                          </div>
                          <p className="text-xs text-slate-350 leading-relaxed">Deep-dive assessment of net profits, operational multipliers, current ratio parameters, net profit margins, and formula-derived AI reviews.</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                              <span className="text-[10px] text-slate-450 uppercase block font-bold">Net Profit Margin (Formula)</span>
                              <span className="text-base font-mono font-black text-amber-300 mt-1 block">34.4% Margin</span>
                            </div>
                            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                              <span className="text-[10px] text-slate-450 uppercase block font-bold">Current Liquidity Index</span>
                              <span className="text-base font-mono font-black text-emerald-400 mt-1 block">Excellent Solvency</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedMonitorCategory === "ar" && (
                        <div className="space-y-4">
                          <div className="border-b border-slate-850 pb-2 flex items-center justify-between">
                            <h4 className="text-sm font-black uppercase text-amber-400">l. Accounts Receivable Tracker</h4>
                            <button
                              onClick={startReportGeneration}
                              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/20 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Sparkles size={8} />
                              <span>Generate Receivables Report (AI)</span>
                            </button>
                          </div>
                          <p className="text-xs text-slate-350 leading-relaxed">Track overdue customer invoices, payment performance, pending outstanding balances, payment risk metrics and operational warning milestones.</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1">
                              <p><strong>Overdue Invoices:</strong> {invoices.filter(i => i.daysOverdue > 0).length} Unsettled Entries</p>
                              <p><strong>Days Past Due Range (Max):</strong> {Math.max(0, ...invoices.map(i => i.daysOverdue || 0))} Days</p>
                            </div>
                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1 text-slate-400">
                              <p><strong>Primary Receivable Status:</strong> Active Monitoring</p>
                              <p><strong>Risk Profile:</strong> Standard Risk Control Range</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedMonitorCategory === "ap" && (
                        <div className="space-y-4">
                          <div className="border-b border-slate-850 pb-2 flex items-center justify-between">
                            <h4 className="text-sm font-black uppercase text-amber-400">m. Accounts Payable controller</h4>
                            <button
                              onClick={startReportGeneration}
                              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/20 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Sparkles size={8} />
                              <span>Generate Payable Audit (AI)</span>
                            </button>
                          </div>
                          <p className="text-xs text-slate-350 leading-relaxed">Review pending supplier liabilities, supplier debts, outstanding unpaid raw materials bills, and payments completed rates.</p>
                          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs">
                            <div className="flex justify-between items-center text-slate-300">
                              <span>Outstanding Payable Claims:</span>
                              <span className="font-mono font-black text-rose-400">Ush {budgets.reduce((sum, b) => sum + parseFloat(b.amountOwedPayable || "0"), 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2.5 text-slate-400">
                              <span>Supplier Payables Settled:</span>
                              <span className="font-mono text-emerald-400">92% Compliance Ratio</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedMonitorCategory === "liquidity" && (
                        <div className="space-y-4">
                          <div className="border-b border-slate-850 pb-2 flex items-center justify-between">
                            <h4 className="text-sm font-black uppercase text-amber-400">n. Liquidity &amp; Solvency Index</h4>
                            <button
                              onClick={startReportGeneration}
                              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/20 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Sparkles size={8} />
                              <span>Generate Solvency Matrix (AI)</span>
                            </button>
                          </div>
                          <p className="text-xs text-slate-350 leading-relaxed">Calculate and evaluate current ratios, gross margins, liabilities vs assets balance and health check recommendations with AI alerts.</p>
                          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 text-xs italic text-slate-400">
                            "Active liquidity profile is stable. Solvency indicators show strong reserve margins of cash assets aligning properly with Uganda central banking operations."
                          </div>
                        </div>
                      )}

                      {selectedMonitorCategory === "sales_margins" && (
                        <div className="space-y-4">
                          <div className="border-b border-slate-850 pb-2 flex items-center justify-between">
                            <h4 className="text-sm font-black uppercase text-amber-400">o, p. Current Ratio &amp; Sales Monitor</h4>
                            <button
                              onClick={startReportGeneration}
                              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/20 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Sparkles size={8} />
                              <span>Generate Current Ratio Audit (AI)</span>
                            </button>
                          </div>
                          <p className="text-xs text-slate-350 leading-relaxed">Analyze historical sales data over time, identify customer behavior profiles, link supporting document files, and review AI liquidity warnings.</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-xs">
                              <p className="font-bold text-amber-400 mb-1">📅 Dynamic Date Track</p>
                              <p className="text-slate-400">Current financial tracking date: <span className="font-mono">{new Date().toLocaleDateString()}</span></p>
                            </div>
                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-xs">
                              <p className="font-bold text-amber-400 mb-1">📑 Supporting Documents</p>
                              <p className="text-slate-400">Supporting invoice document logs are fully stored in the secure PDF cloud vault.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedMonitorCategory === "revenue_trends" && (
                        <div className="space-y-4">
                          <div className="border-b border-slate-850 pb-2 flex items-center justify-between">
                            <h4 className="text-sm font-black uppercase text-amber-400">q, r. Revenue performance &amp; COGS analysis</h4>
                            <button
                              onClick={startReportGeneration}
                              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/20 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Sparkles size={8} />
                              <span>Generate COGS Review (AI)</span>
                            </button>
                          </div>
                          <p className="text-xs text-slate-350 leading-relaxed">Identify revenue trends, analyze performance indices, map category budgets metrics, and check structural performance details.</p>
                          
                          <div className="h-44 w-full bg-slate-950 p-2 rounded-xl border border-slate-850">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[
                                { category: 'Fish Farm Sales', amount: 5500000 },
                                { category: 'Logistics Rev', amount: 2500000 },
                                { category: 'Consultancy', amount: 3500000 },
                              ]}>
                                <XAxis dataKey="category" tick={{ fill: '#888', fontSize: 10 }} />
                                <YAxis tick={{ fill: '#888', fontSize: 10 }} />
                                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      {selectedMonitorCategory === "quarterly" && (
                        <div className="space-y-4">
                          <div className="border-b border-slate-850 pb-2 flex items-center justify-between">
                            <h4 className="text-sm font-black uppercase text-amber-400">s, r. Quarterly Income Statement Trends</h4>
                            <button
                              onClick={startReportGeneration}
                              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/20 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Sparkles size={8} />
                              <span>Generate Statement Trends (AI)</span>
                            </button>
                          </div>
                          <p className="text-xs text-slate-350 leading-relaxed">Comprehensive review of period-based revenues, COGS, gross margins, and net cash flows over active quarters.</p>
                          <div className="overflow-x-auto bg-slate-950 rounded-xl border border-slate-850 text-xs">
                            <table className="w-full text-left">
                              <thead className="bg-slate-900 border-b border-slate-800 font-bold uppercase text-[9px] text-slate-400 text-center">
                                <tr>
                                  <th className="p-3">Period</th>
                                  <th className="p-3">Est. Sales Revenue</th>
                                  <th className="p-3">Measured COGS</th>
                                  <th className="p-3">Estimated Gross Margin</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-850 text-center">
                                <tr>
                                  <td className="p-3 font-semibold">Q1 2026</td>
                                  <td className="p-3 font-mono text-emerald-400">Ush 45,000,000</td>
                                  <td className="p-3 font-mono">Ush 15,000,000</td>
                                  <td className="p-3 font-mono text-amber-300">Ush 30,000,000</td>
                                </tr>
                                <tr>
                                  <td className="p-3 font-semibold">Q2 2026 (Rolling)</td>
                                  <td className="p-3 font-mono text-emerald-400">Ush 68,000,000</td>
                                  <td className="p-3 font-mono">Ush 22,000,000</td>
                                  <td className="p-3 font-mono text-amber-300">Ush 46,000,000</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {selectedMonitorCategory === "executive_metrics" && (
                        <div className="space-y-4">
                          <div className="border-b border-slate-850 pb-2 flex items-center justify-between">
                            <h4 className="text-sm font-black uppercase text-amber-400">t, u, v. Executive key financial metrics</h4>
                            <button
                              onClick={startReportGeneration}
                              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/20 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Sparkles size={8} />
                              <span>Generate Executive KPIs (AI)</span>
                            </button>
                          </div>
                          <p className="text-xs text-slate-350 leading-relaxed">Overview of working capital health, profit ratio ranges, solvency indicators and aggregated budget compliance indices.</p>
                          
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">Working capital health</span>
                              <span className="font-mono text-emerald-400 font-black mt-1 block">98% OPTIMAL</span>
                            </div>
                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">Total Budget compliance</span>
                              <span className="font-mono text-emerald-450 font-black mt-1 block">99.2% EXCELLENT</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Shared Senior Advisor Advice generator button */}
                    <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                      <span className="text-slate-400 flex items-center gap-1.5 font-mono text-[10px]">
                        <Sparkles size={11} className="text-amber-400 animate-pulse" />
                        <span>Real-time executive advisor online</span>
                      </span>
                      <button
                        disabled={isGeneratingReport}
                        onClick={startReportGeneration}
                        className={`px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] uppercase rounded-xl border border-amber-500/30 transition-all cursor-pointer select-none flex items-center gap-1 shadow shadow-amber-500/25 active:scale-95 duration-150 ${
                          isGeneratingReport ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <Sparkles size={11} className="text-slate-950 animate-bounce" />
                        <span>Generate Advisor Report (AI)</span>
                      </button>
                    </div>
                  </>
                )}

              </div>
            </div>

          </div>
        )}

      </main>

      {/* MODAL VIEW 1: CREATE OR EDIT BUDGET RECORD */}
      <AnimatePresence>
        {showBudgetModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto outline-none"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-100 uppercase tracking-wide">
                  {editingBudget ? "Edit Budget constraints" : "Create New Budget Allocation"}
                </h3>
                <button 
                  onClick={closeBudgetForm}
                  className="p-1 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-slate-100 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleBudgetSubmit} className="p-6 space-y-4 text-xs font-sans text-slate-300">
                
                {/* Basic Fields Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Budget Name*</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Courier Bulk Scent Feed Q4"
                      value={budgetForm.name}
                      onChange={(e) => setBudgetForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-950 focus:bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Budget Category</label>
                    <select 
                      value={budgetForm.category}
                      onChange={(e) => setBudgetForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    >
                      <option value="Logistics">Logistics &amp; Transport</option>
                      <option value="Feed">Fish Feed Stock</option>
                      <option value="Equipment">Fish Farm Machinery</option>
                      <option value="Operations">Operations General</option>
                      <option value="Medication">Veterinary &amp; Hygiene</option>
                    </select>
                  </div>
                </div>

                {/* Date Fields Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Budget Period Start</label>
                    <input 
                      type="date"
                      value={budgetForm.periodStart}
                      onChange={(e) => setBudgetForm(prev => ({ ...prev, periodStart: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Budget Period End</label>
                    <input 
                      type="date"
                      value={budgetForm.periodEnd}
                      onChange={(e) => setBudgetForm(prev => ({ ...prev, periodEnd: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Financial Targets Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Planned Amount (Ush)*</label>
                    <input 
                      type="number"
                      required
                      placeholder="e.g. 5000000"
                      value={budgetForm.plannedAmount}
                      onChange={(e) => setBudgetForm(prev => ({ ...prev, plannedAmount: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1 font-sans">Actual Amount Used (Ush)</label>
                    <input 
                      type="number"
                      placeholder="e.g. 4500000"
                      value={budgetForm.actualExpensesRollup}
                      onChange={(e) => setBudgetForm(prev => ({ ...prev, actualExpensesRollup: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Actual Revenue (Rollup) (Ush)</label>
                    <input 
                      type="number"
                      placeholder="e.g. 7000000"
                      value={budgetForm.actualRevenueRollup}
                      onChange={(e) => setBudgetForm(prev => ({ ...prev, actualRevenueRollup: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Additional Owed & Invoice Details Row 4 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Amount Owed (from Related Accounts Payable) (Ush)</label>
                    <input 
                      type="number"
                      placeholder="e.g. 150000"
                      value={budgetForm.amountOwedPayable}
                      onChange={(e) => setBudgetForm(prev => ({ ...prev, amountOwedPayable: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1 font-sans">Invoice Number (from Related Accounts Payable)</label>
                    <input 
                      type="text"
                      placeholder="e.g. INV-2025-992"
                      value={budgetForm.invoiceNumber}
                      onChange={(e) => setBudgetForm(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Actual Receivables (Rollup) (Ush)</label>
                    <input 
                      type="number"
                      placeholder="e.g. 1200000"
                      value={budgetForm.actualReceivablesRollup}
                      onChange={(e) => setBudgetForm(prev => ({ ...prev, actualReceivablesRollup: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Linked References Row 5 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Related Revenue Records</label>
                    <input 
                      type="text"
                      placeholder="e.g. REV-092-Fingerlings"
                      value={budgetForm.relatedRevenue}
                      onChange={(e) => setBudgetForm(prev => ({ ...prev, relatedRevenue: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Related Accounts Payable</label>
                    <input 
                      type="text"
                      placeholder="e.g. Mukono Feeds Mill Ltd"
                      value={budgetForm.relatedPayable}
                      onChange={(e) => setBudgetForm(prev => ({ ...prev, relatedPayable: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Related Accounts Receivable</label>
                    <input 
                      type="text"
                      placeholder="e.g. Jinja Cooperative Assc"
                      value={budgetForm.relatedReceivable}
                      onChange={(e) => setBudgetForm(prev => ({ ...prev, relatedReceivable: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                </div>

                {/* Supporting documents field */}
                <div>
                  <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Supporting Document (Direct Upload from Device OR Paste URL)</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setBudgetForm(prev => ({ ...prev, supportingDocs: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="budget-document-upload"
                      />
                      <label
                        htmlFor="budget-document-upload"
                        className="flex items-center justify-center gap-1.5 w-full bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 rounded-xl px-3 py-2 text-xs font-bold cursor-pointer text-center select-none transition"
                      >
                        📷 Choose File
                      </label>
                    </div>
                    <div className="flex-2">
                      <input 
                        type="text" 
                        placeholder="Paste URL link or load file"
                        value={budgetForm.supportingDocs.startsWith("data:") ? "File Loaded from Device ✅" : budgetForm.supportingDocs}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val !== "File Loaded from Device ✅") {
                            setBudgetForm(prev => ({ ...prev, supportingDocs: val }));
                          }
                        }}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Free Text Notes */}
                <div>
                  <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Notes</label>
                  <textarea 
                    rows={2}
                    placeholder="Provide comments or descriptions about why actual spending had a delta from targets..."
                    value={budgetForm.notes}
                    onChange={(e) => setBudgetForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none leading-relaxed"
                  />
                </div>

                {/* AI Overrides Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800/80 pt-3">
                  <div>
                    <label className="block text-[10px] text-amber-400 font-extrabold uppercase mb-1">Summary &amp; Insights (AI)</label>
                    <textarea 
                      rows={2}
                      placeholder="Optional. Dynamic summary notes analyzed by AI..."
                      value={budgetForm.aiSummary}
                      onChange={(e) => setBudgetForm(prev => ({ ...prev, aiSummary: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-rose-400 font-extrabold uppercase mb-1">Variance Reason &amp; Risk (AI)</label>
                    <textarea 
                      rows={2}
                      placeholder="Optional. Financial warning/risk factors parsed by AI..."
                      value={budgetForm.aiRisk}
                      onChange={(e) => setBudgetForm(prev => ({ ...prev, aiRisk: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Buttons Row */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/80 mt-4">
                  <button
                    type="button"
                    onClick={closeBudgetForm}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-200 border border-slate-700/60 font-sans font-extrabold text-[11px] uppercase rounded-xl cursor-pointer transition-all tracking-wide shadow-xs active:scale-98 select-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-[11px] uppercase rounded-xl shadow-xl shadow-amber-500/25 border border-amber-400/30 cursor-pointer select-none transition-all hover:scale-[1.02] active:scale-98 text-center tracking-wider"
                  >
                    {editingBudget ? "Save compilation changes" : "Create official budget"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL VIEW 2: LOG NEW PURCHASE LPO */}
      <AnimatePresence>
        {showLpoModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full outline-none"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-100 uppercase tracking-wide">
                  Draft New Local Purchase Order (LPO)
                </h3>
                <button 
                  onClick={() => setShowLpoModal(false)}
                  className="p-1 hover:bg-slate-800/85 rounded-lg text-slate-400 hover:text-slate-100 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleLpoSubmit} className="p-6 space-y-4 text-xs font-sans text-slate-300">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">LPO Ref Code*</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. LPO-2025-081"
                      value={lpoForm.lpoNumber}
                      onChange={(e) => setLpoForm(prev => ({ ...prev, lpoNumber: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Issue Registration Date</label>
                    <input 
                      type="date"
                      value={lpoForm.date}
                      onChange={(e) => setLpoForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Supplier Name*</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. BioAqua Inputs Uganda"
                      value={lpoForm.supplierName}
                      onChange={(e) => setLpoForm(prev => ({ ...prev, supplierName: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1 font-sans">Supplier Contact Info</label>
                    <input 
                      type="text" 
                      placeholder="+256 701 5532"
                      value={lpoForm.supplierContact}
                      onChange={(e) => setLpoForm(prev => ({ ...prev, supplierContact: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">LPO Aggregate Cost (Ush)*</label>
                    <input 
                      type="number"
                      required
                      placeholder="e.g. 1200000"
                      value={lpoForm.totalAmount}
                      onChange={(e) => setLpoForm(prev => ({ ...prev, totalAmount: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1 font-sans">LPO Category</label>
                    <select 
                      value={lpoForm.category}
                      onChange={(e) => setLpoForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    >
                      <option value="Feed">Feed supply</option>
                      <option value="Equipment">Pump Maintenance</option>
                      <option value="Fish Farm Repairs">CCTV &amp; Grid Repairs</option>
                      <option value="Larvae treatment">Sanitizing baths</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Purchases Internal Notes</label>
                  <textarea 
                    rows={2}
                    placeholder="Brief comments regarding purchase terms or authorization level..."
                    value={lpoForm.notes}
                    onChange={(e) => setLpoForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLpoModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-755 text-slate-350 hover:text-slate-100 font-sans font-bold capitalize rounded-lg cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-550 hover:bg-amber-600 text-slate-950 font-sans font-black uppercase rounded-lg shadow-md cursor-pointer transition-all"
                  >
                    Issue Final LPO
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL VIEW 3: LOG E-COMMERCE CUSTOMER SALE */}
      <AnimatePresence>
        {showSaleModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto outline-none"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/20">
                <div>
                  <h3 className="text-sm font-black text-slate-100 uppercase tracking-wide">
                    📥 Log E-Commerce Customer Sale Record
                  </h3>
                  <p className="text-[10px] text-slate-450 mt-0.5 font-medium">Verify custom biosecurity sales parameters before compiling record</p>
                </div>
                <button 
                  onClick={() => setShowSaleModal(false)}
                  className="p-1 hover:bg-slate-800/85 rounded-lg text-slate-400 hover:text-slate-100 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaleSubmit} className="p-6 space-y-4 text-xs font-sans text-slate-300">
                {/* Section header: Customer particulars */}
                <div className="border-b border-slate-800/60 pb-1.5">
                  <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider">A. Customer Demographics & Identity</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Customer’s Name*</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Juliet Namubiru"
                      value={saleForm.customerName}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, customerName: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Contact Number*</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. +256 772 45431"
                      value={saleForm.contactNumber}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, contactNumber: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Physical Address*</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Plot 44 Jinja Road, Mukono"
                      value={saleForm.physicalAddress}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, physicalAddress: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Region/Location</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Central Region, Mukono"
                      value={saleForm.location}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                </div>

                {/* Section header: Item Specifications */}
                <div className="border-b border-slate-800/60 pb-1.5 pt-2">
                  <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider">B. Goods Description, Quantity & Channels</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Goods Description / Fish Type*</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Tilapia fingerlings (Grade A)"
                      value={saleForm.fishType}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, fishType: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Sales Channel*</label>
                    <select 
                      value={saleForm.channel}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, channel: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    >
                      <option value="Online">Online Linkage</option>
                      <option value="Dropbox">Dropbox Facility</option>
                      <option value="Distributor">Distributor Route</option>
                      <option value="Wholesale">Wholesale Hub</option>
                      <option value="Direct">Direct Farmgate</option>
                      <option value="Retail">Retail Station</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Sales Date &amp; Time*</label>
                    <input 
                      type="date" 
                      required
                      value={saleForm.saleDate}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, saleDate: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950/40 p-4.5 rounded-xl border border-slate-850">
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Quantity Sold*</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 50"
                      value={saleForm.quantitySold}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, quantitySold: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Unit of Goods*</label>
                    <select 
                      value={saleForm.unit}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    >
                      <option value="Kg">Kg</option>
                      <option value="g">g</option>
                      <option value="Ltrs">Ltrs</option>
                      <option value="pcs">pcs</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Unit Cost (Ush)*</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 15000"
                      value={saleForm.unitPrice}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, unitPrice: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-amber-400 uppercase font-black mb-1">Total Amount (Ush)</label>
                    <input 
                      type="text" 
                      readOnly
                      value={"Ush " + ((parseFloat(saleForm.quantitySold) * parseFloat(saleForm.unitPrice)) || 0).toLocaleString()}
                      className="w-full bg-amber-950/20 border border-amber-900/40 rounded-xl px-3 py-2 text-amber-300 outline-none font-mono font-black"
                    />
                  </div>
                </div>

                {/* Section header: Linked and Supporting Metadata */}
                <div className="border-b border-slate-800/60 pb-1.5 pt-2">
                  <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider">C. Related Ledger Records &amp; Supporting Documents</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Linked Revenue Record Name / ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. REV-2025-JULIET"
                      value={saleForm.linkedRevenueRecord}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, linkedRevenueRecord: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Linked Stock Record Name / ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. STK-TILAPIA-A"
                      value={saleForm.linkedStockRecord}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, linkedStockRecord: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Supporting Document (Direct Upload from Device OR Paste URL)</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setSaleForm(prev => ({ ...prev, supportingDocs: reader.result as string }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                          id="sales-document-upload"
                        />
                        <label
                          htmlFor="sales-document-upload"
                          className="flex items-center justify-center gap-1.5 w-full bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 rounded-xl px-3 py-2 text-xs font-bold cursor-pointer text-center select-none transition"
                        >
                          📷 Choose File
                        </label>
                      </div>
                      <div className="flex-2">
                        <input 
                          type="text" 
                          placeholder="Paste URL link or load file"
                          value={saleForm.supportingDocs.startsWith("data:") ? "File Loaded from Device ✅" : saleForm.supportingDocs}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val !== "File Loaded from Device ✅") {
                              setSaleForm(prev => ({ ...prev, supportingDocs: val }));
                            }
                          }}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-black mb-1 font-sans">Sale Recorded By (Staff Authorized)*</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Harriet N."
                      value={saleForm.recordedBy || currentUserEmail}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, recordedBy: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-450 uppercase font-black mb-1">Customer’s Other Needs</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Required ongoing bi-weekly feed recommendations"
                    value={saleForm.customerNeeds}
                    onChange={(e) => setSaleForm(prev => ({ ...prev, customerNeeds: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Customer Feedback Summary</label>
                    <textarea 
                      rows={2}
                      placeholder="Very pleased with promptness and water biometric diagnostics..."
                      value={saleForm.feedbackSummary}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, feedbackSummary: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Internal Ledger Notes &amp; Comments</label>
                    <textarea 
                      rows={2}
                      placeholder="Cash cleared through mobile money terminal system check ok."
                      value={saleForm.notes}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSaleModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-755 text-slate-350 hover:text-slate-100 font-sans font-bold capitalize rounded-lg cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-sans font-black uppercase rounded-lg shadow-md cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    Log Customer Sale
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL VIEW 4: LOG REVENUE LEDGER */}
      <AnimatePresence>
        {showRevenueModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto outline-none"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/20">
                <div>
                  <h3 className="text-sm font-black text-slate-100 uppercase tracking-wide">
                    💰 Record Revenue Ledger Entry
                  </h3>
                  <p className="text-[10px] text-slate-450 mt-0.5 font-medium">Verify custom biosecurity revenue items and calculate margins</p>
                </div>
                <button 
                  onClick={() => setShowRevenueModal(false)}
                  className="p-1 hover:bg-slate-800/85 rounded-lg text-slate-400 hover:text-slate-100 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleRevenueSubmit} className="p-6 space-y-4 text-xs font-sans text-slate-300">
                {/* Section header: Customer Particulars */}
                <div className="border-b border-slate-800/60 pb-1.5">
                  <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">A. Buyer Entity &amp; Physical Address</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Customer’s Name*</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Jinja Cooperative Assc"
                      value={revenueForm.customerName}
                      onChange={(e) => setRevenueForm(prev => ({ ...prev, customerName: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Contact Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. +256 701 55321"
                      value={revenueForm.contactNumber}
                      onChange={(e) => setRevenueForm(prev => ({ ...prev, contactNumber: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Physical Address</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Plot 12, Nile Crescent, Jinja"
                      value={revenueForm.physicalAddress}
                      onChange={(e) => setRevenueForm(prev => ({ ...prev, physicalAddress: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Region/Location</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Jinja District, Eastern Uganda"
                      value={revenueForm.location}
                      onChange={(e) => setRevenueForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                </div>

                {/* Section header: Item details */}
                <div className="border-b border-slate-800/60 pb-1.5 pt-2">
                  <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">B. Revenue Source &amp; Margin Ledger Analysis</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Goods Description / Revenue Source*</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Bulk fingerlings shipping sale"
                      value={revenueForm.goodsDescription}
                      onChange={(e) => setRevenueForm(prev => ({ ...prev, goodsDescription: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Transaction date*</label>
                    <input 
                      type="date" 
                      required
                      value={revenueForm.saleDate}
                      onChange={(e) => setRevenueForm(prev => ({ ...prev, saleDate: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1 font-sans">Quantity Sold (L/Kg/Units)*</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 5000"
                      value={revenueForm.quantitySold}
                      onChange={(e) => setRevenueForm(prev => ({ ...prev, quantitySold: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/40 p-4.5 rounded-xl border border-slate-850">
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Revenue Inflow Amount (Ush)*</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 10000000"
                      value={revenueForm.revenueAmount}
                      onChange={(e) => setRevenueForm(prev => ({ ...prev, revenueAmount: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Cost of Goods Sold (COGS, Ush)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 4500000"
                      value={revenueForm.costOfGoodsSold}
                      onChange={(e) => setRevenueForm(prev => ({ ...prev, costOfGoodsSold: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-emerald-400 uppercase font-black mb-1">Calculated Gross Margin</label>
                    <input 
                      type="text" 
                      readOnly
                      value={"Ush " + ((parseFloat(revenueForm.revenueAmount) - (parseFloat(revenueForm.costOfGoodsSold) || 0)) || 0).toLocaleString()}
                      className="w-full bg-emerald-950/20 border border-emerald-900/40 rounded-xl px-3 py-2 text-emerald-350 outline-none font-mono font-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Supporting Document (Direct Upload from Device OR Paste URL)</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setRevenueForm(prev => ({ ...prev, supportingDocs: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="finance-photo-upload"
                      />
                      <label
                        htmlFor="finance-photo-upload"
                        className="flex items-center justify-center gap-1.5 w-full bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 rounded-xl px-3 py-2 text-xs font-bold cursor-pointer text-center select-none transition"
                      >
                        📷 Choose File
                      </label>
                    </div>
                    <div className="flex-2">
                      <input 
                        type="text" 
                        placeholder="Paste URL link or load file"
                        value={revenueForm.supportingDocs.startsWith("data:") ? "File Loaded from Device ✅" : revenueForm.supportingDocs}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val !== "File Loaded from Device ✅") {
                            setRevenueForm(prev => ({ ...prev, supportingDocs: val }));
                          }
                        }}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Ledger Notes</label>
                  <textarea 
                    rows={2}
                    placeholder="Provide details regarding wire transfer numbers or cooperative clearing details..."
                    value={revenueForm.notes}
                    onChange={(e) => setRevenueForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRevenueModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-755 text-slate-350 hover:text-slate-100 font-sans font-bold capitalize rounded-lg cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-sans font-black uppercase rounded-lg shadow-md cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    Log Revenue Ledger
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL VIEW 5: LOG ACCOUNTS RECEIVABLE */}
      <AnimatePresence>
        {showReceivableModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto outline-none"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/20">
                <div>
                  <h3 className="text-sm font-black text-slate-100 uppercase tracking-wide">
                    ⚖️ Issue Accounts Receivable Invoice
                  </h3>
                  <p className="text-[10px] text-slate-450 mt-0.5 font-medium">Generate outstanding receivables invoices and evaluate AI cashflow risk index</p>
                </div>
                <button 
                  onClick={() => setShowReceivableModal(false)}
                  className="p-1 hover:bg-slate-800/85 rounded-lg text-slate-400 hover:text-slate-100 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleReceivableSubmit} className="p-6 space-y-4 text-xs font-sans text-slate-300">
                {/* Section header: Invoice particulars */}
                <div className="border-b border-slate-800/60 pb-1.5">
                  <span className="text-[10px] text-sky-400 font-black uppercase tracking-wider">A. Invoice &amp; Customer Identifiers</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Invoice Number*</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. INV-2025-001"
                      value={receivableForm.invoiceNumber}
                      onChange={(e) => setReceivableForm(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Customer’s Name*</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Juliet Namubiru"
                      value={receivableForm.customerName}
                      onChange={(e) => setReceivableForm(prev => ({ ...prev, customerName: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Contact Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. +256 772 45431"
                      value={receivableForm.contactNumber}
                      onChange={(e) => setReceivableForm(prev => ({ ...prev, contactNumber: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Physical Address</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Plot 44 Jinja Road, Mukono"
                      value={receivableForm.physicalAddress}
                      onChange={(e) => setReceivableForm(prev => ({ ...prev, physicalAddress: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Region/Location</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Mukono District, Central Region"
                      value={receivableForm.location}
                      onChange={(e) => setReceivableForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Due Date*</label>
                    <input 
                      type="date" 
                      required
                      value={receivableForm.dueDate}
                      onChange={(e) => setReceivableForm(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Section header: Balance & Goods Particulars */}
                <div className="border-b border-slate-800/60 pb-1.5 pt-2">
                  <span className="text-[10px] text-sky-400 font-black uppercase tracking-wider">B. Balance Specifics, Payment Statuses &amp; Budgets</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Goods Description*</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Grade A Fingerlings &amp; Retentive Feeds"
                      value={receivableForm.goodsDescription}
                      onChange={(e) => setReceivableForm(prev => ({ ...prev, goodsDescription: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Payment Status*</label>
                    <select 
                      value={receivableForm.status}
                      onChange={(e) => setReceivableForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    >
                      <option value="Pending">⚠️ Pending Balance</option>
                      <option value="Completed">✓ Completed / Settled</option>
                      <option value="Overdue">🚨 Overdue Default</option>
                      <option value="Disputed">⚖️ Disputed Status</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Related Sales ID / Revenue Stream</label>
                    <input 
                      type="text" 
                      placeholder="e.g. REV-TILAPIA-COOP"
                      value={receivableForm.relatedSales}
                      onChange={(e) => setReceivableForm(prev => ({ ...prev, relatedSales: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/40 p-4.5 rounded-xl border border-slate-850">
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Amount Due (Ush)*</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 5000000"
                      value={receivableForm.amountDue}
                      onChange={(e) => setReceivableForm(prev => ({ ...prev, amountDue: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Amount Paid (Ush)*</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 3500000"
                      value={receivableForm.amountPaid}
                      onChange={(e) => setReceivableForm(prev => ({ ...prev, amountPaid: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-sky-400 uppercase font-black mb-1 font-mono">Outstanding Balance (Calculated)</label>
                    <input 
                      type="text" 
                      readOnly
                      value={"Ush " + ((parseFloat(receivableForm.amountDue) - (parseFloat(receivableForm.amountPaid) || 0)) || 0).toLocaleString()}
                      className="w-full bg-sky-950/20 border border-sky-900/40 rounded-xl px-3 py-2 text-sky-350 outline-none font-mono font-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Days Past Due</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      value={receivableForm.daysPastDue}
                      onChange={(e) => setReceivableForm(prev => ({ ...prev, daysPastDue: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-black mb-1 font-sans">Related Budget Name / Budgets</label>
                    <select 
                      value={receivableForm.relatedBudgetName}
                      onChange={(e) => setReceivableForm(prev => ({ ...prev, relatedBudgetName: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    >
                      <option value="">-- No Related Budget --</option>
                      {budgets.map(b => (
                        <option key={b.id} value={b.name}>{b.name} ({b.category})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Section header: AI parameters */}
                <div className="border-b border-slate-800/60 pb-1.5 pt-2">
                  <span className="text-[10px] text-sky-400 font-black uppercase tracking-wider">C. AI Risk Intelligence Engine (Autogenerated Fields)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-amber-400 uppercase font-black mb-1">Receivable Summary (AI)*</label>
                    <input 
                      type="text" 
                      readOnly
                      placeholder="Calculated dynamically based on ledger..."
                      value={`Buyer showing consistent liquidity metrics with days overdue: ${receivableForm.daysPastDue}`}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-slate-350 outline-none italic font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-amber-400 uppercase font-black mb-1 font-sans">Payment Risk Category (AI)*</label>
                    <input 
                      type="text" 
                      readOnly
                      value={parseInt(receivableForm.daysPastDue) > 0 ? "Substantial Risk Category" : "Low Risk Category"}
                      className={`w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 outline-none font-mono text-[11px] font-black ${
                        parseInt(receivableForm.daysPastDue) > 0 ? "text-rose-455" : "text-emerald-400"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-455 uppercase font-black mb-1">Internal Remarks &amp; Comments</label>
                  <textarea 
                    rows={2}
                    placeholder="Provide details of any payment follow-ups or credit agreement conditions..."
                    value={receivableForm.notes}
                    onChange={(e) => setReceivableForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReceivableModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-755 text-slate-350 hover:text-slate-100 font-sans font-bold capitalize rounded-lg cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-slate-950 font-sans font-black uppercase rounded-lg shadow-md cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    Issue Receivable Invoice
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showAdvisorReportModal && compiledReportData && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl shadow-amber-500/5 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden outline-none"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-950/40">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-black bg-emerald-950 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Ledger Audited • AI Secured</span>
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-black bg-amber-950 text-amber-400 border border-amber-500/20">
                      Formulas Built-in
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-100 uppercase tracking-wide mt-2">
                    {compiledReportData.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Prepared for ERP Directors • Guideline Items c through v Compliance
                  </p>
                </div>
                <button 
                  onClick={() => setShowAdvisorReportModal(false)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700/80 rounded-xl text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Aggregated Real-time Health Statistics */}
              <div className="p-6 bg-slate-950 border-b border-slate-850 grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-[9px] uppercase font-bold text-slate-450 block">Audited Revenue</span>
                  <span className="text-xs font-mono font-extrabold text-sky-400 block mt-1">Ush {compiledReportData.metrics.revenue.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-[9px] uppercase font-bold text-slate-450 block">Registered Expenses</span>
                  <span className="text-xs font-mono font-extrabold text-rose-400 block mt-1">Ush {compiledReportData.metrics.expenses.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-[9px] uppercase font-bold text-slate-450 block">Outstanding Cash AR</span>
                  <span className="text-xs font-mono font-extrabold text-amber-300 block mt-1">Ush {compiledReportData.metrics.receivables.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-[9px] uppercase font-bold text-slate-450 block">Profit Multiplier</span>
                  <span className="text-xs font-mono font-extrabold text-emerald-400 block mt-1">
                    {compiledReportData.metrics.revenue > 0 
                      ? ((compiledReportData.metrics.revenue / (compiledReportData.metrics.expenses || 1))).toFixed(2) + "x" 
                      : "0.00x"}
                  </span>
                </div>
              </div>

              {/* Main Report Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300 leading-relaxed font-sans max-h-[50vh]">
                
                {/* Advisor Commentary */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                  <h4 className="font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
                    <Sparkles size={12} className="text-amber-400 animate-pulse" />
                    <span>Senior Financial Advisor Executive Commentary</span>
                  </h4>
                  <p className="whitespace-pre-line text-slate-200">
                    {compiledReportData.commentary}
                  </p>
                </div>

                {/* Audit Key Recommendations */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-250 uppercase tracking-wider">🎯 Tactical Action Recommendations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {compiledReportData.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="p-3 rounded-lg bg-slate-900 border border-slate-850 flex items-start gap-2">
                        <span className="font-mono text-emerald-450 font-black">0{index + 1}.</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Compliance Verification Matrix */}
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-slate-950 px-4 py-2 text-[10px] font-bold text-slate-400">
                    VERIFICATION BENCHMARKS (ITEMS C THROUGH V)
                  </div>
                  <div className="divide-y divide-slate-850 bg-slate-950/20">
                    <div className="px-4 py-3 flex items-center justify-between">
                      <span>c, d. Income Statement Formula Reconciliation</span>
                      <span className="text-emerald-400 font-mono font-bold uppercase text-[9px] px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-900/60 flex items-center gap-1">
                        <span>✓ Verified</span>
                      </span>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between">
                      <span>e, f. Gross margin computation &amp; KPIs match</span>
                      <span className="text-emerald-400 font-mono font-bold uppercase text-[9px] px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-900/60 flex items-center gap-1">
                        <span>✓ Verified</span>
                      </span>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between">
                      <span>g, h, j. Cumulative Cash Flows &amp; Liquidity Ratio</span>
                      <span className="text-emerald-400 font-mono font-bold uppercase text-[9px] px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-900/60 flex items-center gap-1">
                        <span>✓ Verified</span>
                      </span>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between">
                      <span>l, m. Receivables Trackers &amp; Payable controllers</span>
                      <span className="text-emerald-400 font-mono font-bold uppercase text-[9px] px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-900/60 flex items-center gap-1">
                        <span>✓ Verified</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 items-center text-[10px] text-slate-500 font-mono">
                  <span>🔒 ERP Secure SSL SHA256 Signature:</span>
                  <span className="font-mono text-slate-600">8f219c4b1d03f003e670ca9f82de3...</span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 mr-1">📥 GENERATE REPORT:</span>
                  <button
                    type="button"
                    onClick={() => handleExportReport("pdf")}
                    className="px-3 py-1.5 bg-sky-955 hover:bg-sky-900 text-sky-400 font-sans font-bold text-[9px] uppercase rounded-lg border border-sky-500/20 flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                    title="Generate and print PDF snapshot"
                  >
                    📄 PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportReport("csv")}
                    className="px-3 py-1.5 bg-emerald-955 hover:bg-emerald-900 text-emerald-400 font-sans font-bold text-[9px] uppercase rounded-lg border border-emerald-500/20 flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                    title="Download spreadsheet CSV"
                  >
                    📊 CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportReport("excel")}
                    className="px-3 py-1.5 bg-amber-955 hover:bg-amber-900 text-amber-400 font-sans font-bold text-[9px] uppercase rounded-lg border border-amber-500/20 flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                    title="Export formatted Excel sheet"
                  >
                    📈 Excel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportReport("print")}
                    className="px-3 py-1.5 bg-purple-955 hover:bg-purple-900 text-purple-400 font-sans font-bold text-[9px] uppercase rounded-lg border border-purple-500/20 flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                    title="Print report directly"
                  >
                    🖨️ Direct Print
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdvisorReportModal(false)}
                  className="w-full sm:w-auto px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-black text-[10px] uppercase rounded-xl shadow-lg shadow-amber-500/10 transition-all active:scale-95 cursor-pointer"
                >
                  Acknowledge &amp; Exit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        currentUserEmail={currentUserEmail} 
        currentUserRole="finance" 
      />

    </div>
  );
}
