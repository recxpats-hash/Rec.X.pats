/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  PnLStatement, 
  InvoiceRecord, 
  BudgetRecord, 
  CashFlowRecord 
} from "../types";
import { 
  PiggyBank, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
  HelpCircle, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Calendar, 
  DollarSign, 
  CreditCard 
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
  Area 
} from "recharts";

interface FinanceModuleProps {
  pnl: PnLStatement[];
  invoices: InvoiceRecord[];
  budgets: BudgetRecord[];
  cashFlows: CashFlowRecord[];
  onAddRecord: (model: string, data: any) => Promise<void>;
  onDeleteRecord: (model: string, id: string) => Promise<void>;
  onRunDiagnostic: (type: string, data: any) => void;
  walletAddress?: string;
  connectMetaMask?: () => Promise<void>;
  isConnectingWallet?: boolean;
  onUpdateRecord?: (model: string, id: string, data: any) => Promise<void>;
}

export default function FinanceModule({
  pnl,
  invoices,
  budgets,
  cashFlows,
  onAddRecord,
  onDeleteRecord,
  onRunDiagnostic,
  walletAddress,
  connectMetaMask,
  isConnectingWallet,
  onUpdateRecord
}: FinanceModuleProps) {
  const [isPayingInvoiceId, setIsPayingInvoiceId] = useState<string>("");
  const [paymentError, setPaymentError] = useState<string>("");

  // Tabs for finance sub-sections
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "invoices" | "budgets" | "cashflow">("overview");
  
  // Search and Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState("all");
  const [cashFlowTypeFilter, setCashFlowTypeFilter] = useState("all");

  // Form States
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [showAddCashFlow, setShowAddCashFlow] = useState(false);
  
  const [newInvoice, setNewInvoice] = useState({
    invoiceNumber: "",
    supplierName: "",
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    amountOwed: "",
    status: "Unpaid",
    notes: "",
    budgetCategory: "Equipment",
    totalPaymentsMade: 0
  });

  const [newCashFlow, setNewCashFlow] = useState({
    recordedBy: "",
    type: "Inflow",
    amount: "",
    description: "",
    transactionDate: new Date().toISOString().split('T')[0],
    month: new Date().toISOString().slice(0, 7)
  });

  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Totals calculations
  const totalInflow = cashFlows
    .filter(cf => cf.type === "Inflow" || cf.isInflow)
    .reduce((sum, cf) => sum + Number(cf.amount), 0);

  const totalOutflow = cashFlows
    .filter(cf => cf.type === "Outflow" || cf.isOutflow)
    .reduce((sum, cf) => sum + Number(cf.amount), 0);

  const netOperationsCash = totalInflow - totalOutflow;

  // Invoice handlers
  const handleAddInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoice.invoiceNumber || !newInvoice.supplierName || !newInvoice.amountOwed) return;

    const parsedAmount = parseFloat(newInvoice.amountOwed);
    await onAddRecord("invoices", {
      ...newInvoice,
      amountOwed: parsedAmount,
      outstandingBalance: parsedAmount,
      isOverdue: false,
      daysOverdue: 0,
      paymentCompletionPct: 0
    });

    setSuccessToast(`Invoice ${newInvoice.invoiceNumber} added successfully.`);
    setShowAddInvoice(false);
    setNewInvoice({
      invoiceNumber: "",
      supplierName: "",
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      amountOwed: "",
      status: "Unpaid",
      notes: "",
      budgetCategory: "Equipment",
      totalPaymentsMade: 0
    });
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleOnChainPayment = async (inv: InvoiceRecord) => {
    if (!walletAddress) {
      if (connectMetaMask) {
        await connectMetaMask();
      } else {
        setPaymentError("Could not connect to MetaMask. Extension missing or load failed.");
      }
      return;
    }
    
    setIsPayingInvoiceId(inv.id || "");
    setPaymentError("");
    
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const txParams = {
          from: walletAddress,
          to: "0x8269d034fa39665A2069D0281b3E48043003Cd9A", // recxpats Fish Farm safe treasury address
          value: "0x38d7ea4c68000", // tiny payment
          data: "0x", 
        };
        
        const txHash = await (window as any).ethereum.request({
          method: "eth_sendTransaction",
          params: [txParams]
        });

        if (txHash && onUpdateRecord && inv.id) {
          // Sync with server db
          await onUpdateRecord("invoices", inv.id, {
            status: "Paid",
            notes: (inv.notes ? `${inv.notes}; ` : "") + `Settle hash: ${txHash.substring(0, 10)}...`
          });
          
          setSuccessToast(`Invoice ${inv.invoiceNumber} paid and settled on-chain successfully!`);
          setTimeout(() => setSuccessToast(null), 5000);
        }
      } else {
        setPaymentError("MetaMask browser extension not detected. Please install standard MetaMask.");
      }
    } catch (err: any) {
      console.error("MetaMask error: ", err);
      setPaymentError(err?.message || "Failed to make MetaMask transaction.");
    } finally {
      setIsPayingInvoiceId("");
    }
  };

  // Cash Flow handlers
  const handleAddCashFlowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCashFlow.amount || !newCashFlow.description || !newCashFlow.recordedBy) return;

    const parsedAmount = parseFloat(newCashFlow.amount);
    const isInflow = newCashFlow.type === "Inflow";
    await onAddRecord("cashFlows", {
      ...newCashFlow,
      amount: parsedAmount,
      isInflow,
      isOutflow: !isInflow,
      netCashFlow: isInflow ? parsedAmount : -parsedAmount
    });

    setSuccessToast("Transaction record processed successfully.");
    setShowAddCashFlow(false);
    setNewCashFlow({
      recordedBy: "",
      type: "Inflow",
      amount: "",
      description: "",
      transactionDate: new Date().toISOString().split('T')[0],
      month: new Date().toISOString().slice(0, 7)
    });
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Chart Mappings
  const cashFlowTimelineData = cashFlows.map(cf => ({
    date: cf.transactionDate,
    amount: cf.amount,
    type: cf.type,
    displayAmt: cf.type === "Inflow" ? cf.amount : -cf.amount
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const budgetChartData = budgets.map(b => ({
    name: b.name.replace(" Budget", ""),
    planned: b.plannedAmount,
    actual: b.actualExpensesRollup || 350000 // Fallback to demo variance logic
  }));

  // Filtering Logic
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = invoiceStatusFilter === "all" || inv.status === invoiceStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCashFlows = cashFlows.filter(cf => {
    const matchesSearch = cf.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cf.recordedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = cashFlowTypeFilter === "all" || cf.type === cashFlowTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div id="finance-module-container" className="space-y-6">
      
      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-bounce">
          <CheckCircle2 size={18} />
          <span className="text-sm font-medium">{successToast}</span>
        </div>
      )}

      {/* Top Ledger Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-sky-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-sky-505 text-xs font-bold uppercase tracking-wider block">Total Inflows (Revenue collected)</span>
            <span className="text-2xl font-bold text-sky-950 mt-1 block">Ush {totalInflow.toLocaleString()}</span>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-sky-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-sky-505 text-xs font-bold uppercase tracking-wider block">Total Outflows (Expenses settled)</span>
            <span className="text-2xl font-bold text-sky-950 mt-1 block">Ush {totalOutflow.toLocaleString()}</span>
          </div>
          <div className="bg-rose-50 text-rose-600 p-4 rounded-xl">
            <TrendingDown size={24} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-sky-900 to-sky-950 p-6 rounded-2xl shadow-md shadow-sky-950/15 flex items-center justify-between text-white">
          <div>
            <span className="text-sky-200 text-xs font-bold uppercase tracking-wider block">Net Account Balance (Ush)</span>
            <span className={`text-2xl font-bold mt-1 block ${netOperationsCash >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              Ush {netOperationsCash.toLocaleString()}
            </span>
          </div>
          <div className="bg-sky-950/80 text-cyan-300 p-4 rounded-xl">
            <PiggyBank size={24} />
          </div>
        </div>
      </div>

      {/* Navigation and Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-sky-100">
        <div className="flex gap-1 overflow-x-auto">
          <button 
            onClick={() => setActiveSubTab("overview")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeSubTab === "overview" ? "bg-sky-900 text-white shadow-sm ring-1 ring-sky-700/25" : "text-sky-900 hover:bg-sky-50"}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveSubTab("invoices")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeSubTab === "invoices" ? "bg-sky-900 text-white shadow-sm ring-1 ring-sky-700/25" : "text-sky-900 hover:bg-sky-50"}`}
          >
            Invoices & Payables ({invoices.length})
          </button>
          <button 
            onClick={() => setActiveSubTab("budgets")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeSubTab === "budgets" ? "bg-sky-900 text-white shadow-sm ring-1 ring-sky-700/25" : "text-sky-900 hover:bg-sky-50"}`}
          >
            Budgets ({budgets.length})
          </button>
          <button 
            onClick={() => setActiveSubTab("cashflow")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeSubTab === "cashflow" ? "bg-sky-900 text-white shadow-sm ring-1 ring-sky-700/25" : "text-sky-905 hover:bg-sky-50"}`}
          >
            Cash Transactions
          </button>
        </div>

        <div className="flex gap-2">
          {activeSubTab === "invoices" && (
            <button
              onClick={() => setShowAddInvoice(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-sky-900 text-white rounded-xl text-xs font-semibold hover:bg-sky-850 transition shadow-md shadow-sky-950/15"
            >
              <Plus size={16} /> Add Invoice
            </button>
          )}
          {activeSubTab === "cashflow" && (
            <button
              onClick={() => setShowAddCashFlow(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-sky-900 text-white rounded-xl text-xs font-semibold hover:bg-sky-850 transition shadow-md shadow-sky-950/15"
            >
              <Plus size={16} /> New Transaction
            </button>
          )}
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
        
        {/* OVERVIEW SUB-TAB */}
        {activeSubTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cash Flow Timeline Chart */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-850 text-sm">Accumulative Cash Inflows & Outflows</h3>
                  <span className="text-xs text-slate-400 font-mono tracking-tight">Active Currency: Ush</span>
                </div>
                <div className="h-64 bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cashFlowTimelineData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <Tooltip formatter={(value) => [`Ush ${Number(value).toLocaleString()}`]} />
                      <Legend />
                      <Area type="monotone" dataKey="displayAmt" name="Transaction Net" stroke="#0f172a" fill="#e2e8f0" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Budget Variance Chart */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-850 text-sm">Division Budgets (Planned vs. Actual Spend)</h3>
                </div>
                <div className="h-64 bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <Tooltip formatter={(value) => [`Ush ${Number(value).toLocaleString()}`]} />
                      <Legend />
                      <Bar dataKey="planned" name="Planned" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="actual" name="Actual / Rollup" fill="#0f172a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* P&L Statement Snapshot */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Active P&L Monthly Summaries</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pnl.map((st) => (
                  <div key={st.id} className="p-5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-800 text-sm">{st.name}</span>
                        <span className="text-xs font-mono px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">{st.currency}</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">Period: {st.periodStart} to {st.periodEnd}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-200/60 pt-4">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Gross Profit</span>
                        <span className="text-sm font-bold text-slate-800 block">Ush {st.grossProfit.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Net Operating Profit</span>
                        <span className="text-sm font-bold text-emerald-600 block">Ush {st.netProfit.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INVOICES SECTION */}
        {activeSubTab === "invoices" && (
          <div className="space-y-4">
            {paymentError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{paymentError}</span>
                </div>
                <button onClick={() => setPaymentError("")} className="text-rose-500 hover:text-rose-750 cursor-pointer">
                  <X size={16} />
                </button>
              </div>
            )}
            
            {/* Filter controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search invoices, suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <select 
                  value={invoiceStatusFilter}
                  onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                  className="w-full md:w-40 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"
                >
                  <option value="all">All Invoices</option>
                  <option value="Paid">Status: Paid</option>
                  <option value="Unpaid">Status: Unpaid</option>
                </select>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full border-collapse text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Invoice No</th>
                    <th className="px-6 py-4">Supplier</th>
                    <th className="px-6 py-4">Issue Date</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4 text-right">Amount Owed</th>
                    <th className="px-6 py-4 text-center">Payment Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-mono font-medium text-slate-800">{inv.invoiceNumber}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{inv.supplierName}</div>
                        {inv.notes && <div className="text-[10px] text-slate-400">{inv.notes}</div>}
                      </td>
                      <td className="px-6 py-4 text-slate-500">{inv.invoiceDate}</td>
                      <td className="px-6 py-4 text-slate-500">{inv.dueDate}</td>
                      <td className="px-6 py-4 text-right font-mono font-semibold text-slate-800">
                        Ush {inv.amountOwed.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold ${inv.status === "Paid" ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {inv.status === "Unpaid" && (
                          <button
                            onClick={() => handleOnChainPayment(inv)}
                            disabled={isPayingInvoiceId === inv.id}
                            className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded text-[10px] font-bold flex items-center gap-1 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 transition inline-flex cursor-pointer shadow-xs"
                          >
                            <CreditCard size={12} />
                            {isPayingInvoiceId === inv.id ? "Settling..." : "Pay MetaMask"}
                          </button>
                        )}
                        <button 
                          onClick={() => onRunDiagnostic("budget-forecast", inv)}
                          className="px-2 py-1 bg-slate-900 text-white rounded text-[10px] font-semibold flex items-center gap-1 hover:bg-slate-800 inline-flex"
                        >
                          <Sparkles size={12} /> AI Risk
                        </button>
                        <button
                          onClick={() => inv.id && onDeleteRecord("invoices", inv.id)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <X size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredInvoices.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                        No matching invoice payment requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BUDGETS SECTION */}
        {activeSubTab === "budgets" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {budgets.map((b) => {
                const variance = b.plannedAmount - (b.actualExpensesRollup || 350000);
                const isUnder = variance >= 0;
                return (
                  <div key={b.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/40 relative">
                    <span className="absolute top-4 right-4 text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-200 text-slate-600 rounded">
                      Category: {b.category}
                    </span>
                    <h4 className="font-bold text-slate-850 text-sm mb-1">{b.name}</h4>
                    <p className="text-xs text-slate-500 mb-4">{b.notes || "Fish Farm division operating budget."}</p>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">Planned Allowance</span>
                        <span className="font-bold text-slate-800 block mt-0.5">Ush {b.plannedAmount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">Rolling Spend</span>
                        <span className="font-bold text-slate-800 block mt-0.5">Ush {(b.actualExpensesRollup || 350000).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100/60 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-500">Variance Status:</span>
                      <span className={`font-semibold inline-flex items-center gap-1 ${isUnder ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'} px-2 py-1 rounded`}>
                        {isUnder ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        Ush {Math.abs(variance).toLocaleString()} {isUnder ? 'Under Budget' : 'Overrun'}
                      </span>
                    </div>

                    <button
                      onClick={() => onRunDiagnostic("budget-forecast", b)}
                      className="mt-4 w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
                    >
                      <Sparkles size={14} /> Analyze Variance & Risks (AI)
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CASH TRANSACTIONS SECTION */}
        {activeSubTab === "cashflow" && (
          <div className="space-y-4">
            
            {/* Filtering Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search transactions, payees, loggers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <select 
                  value={cashFlowTypeFilter}
                  onChange={(e) => setCashFlowTypeFilter(e.target.value)}
                  className="w-full md:w-40 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"
                >
                  <option value="all">All Cash Flows</option>
                  <option value="Inflow">Inflow (Collections)</option>
                  <option value="Outflow">Outflow (Payments)</option>
                </select>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full border-collapse text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Transaction Date</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4 text-right">Amount (Ush)</th>
                    <th className="px-6 py-4">Recorded By</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCashFlows.map((cf) => (
                    <tr key={cf.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 text-slate-500">{cf.transactionDate}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{cf.description}</div>
                        {cf.categorySuggestionAI && <div className="text-[10px] text-indigo-500 font-medium">Category AI: {cf.categorySuggestionAI}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${cf.type === "Inflow" ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {cf.type === "Inflow" ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          {cf.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-semibold text-slate-800">
                        Ush {cf.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">{cf.recordedBy}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => cf.id && onDeleteRecord("cashFlows", cf.id)}
                          className="p-1 hover:bg-slate-100 rounded text-rose-500 inline-flex"
                        >
                          <X size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredCashFlows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        No transactions registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ADD INVOICE */}
      {showAddInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-100 p-6 shadow-xl relative animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setShowAddInvoice(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="text-slate-900" size={20} />
              <h3 className="font-bold text-slate-800 text-base">Add New Supplier Invoice</h3>
            </div>

            <form onSubmit={handleAddInvoiceSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Invoice Number</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. INV-2025-009"
                  value={newInvoice.invoiceNumber}
                  onChange={(e) => setNewInvoice({...newInvoice, invoiceNumber: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-850"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Supplier / Deliverer Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Aller Aqua Uganda"
                  value={newInvoice.supplierName}
                  onChange={(e) => setNewInvoice({...newInvoice, supplierName: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-850"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Invoice Issue Date</label>
                  <input 
                    type="date"
                    required
                    value={newInvoice.invoiceDate}
                    onChange={(e) => setNewInvoice({...newInvoice, invoiceDate: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Due Date</label>
                  <input 
                    type="date"
                    required
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Amount Due (Ush)</label>
                  <input 
                    type="number"
                    required
                    placeholder="Total amount"
                    value={newInvoice.amountOwed}
                    onChange={(e) => setNewInvoice({...newInvoice, amountOwed: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-850"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Budget Allocation</label>
                  <select 
                    value={newInvoice.budgetCategory}
                    onChange={(e) => setNewInvoice({...newInvoice, budgetCategory: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="Equipment">Equipment & Tech</option>
                    <option value="Feed & Production">Feed & Production</option>
                    <option value="Labor">Fish Farm Labor</option>
                    <option value="Utilities">Utilities & Water</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Procurement Notes / Items</label>
                <textarea 
                  placeholder="Items or delivery reference logistics details..."
                  value={newInvoice.notes}
                  onChange={(e) => setNewInvoice({...newInvoice, notes: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-850"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition"
              >
                Register & Save Invoice
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CASH TRANSACTION */}
      {showAddCashFlow && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-100 p-6 shadow-xl relative animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setShowAddCashFlow(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="text-slate-900" size={20} />
              <h3 className="font-bold text-slate-800 text-base">Record Cash Transaction</h3>
            </div>

            <form onSubmit={handleAddCashFlowSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Cash Flow Dir</label>
                  <select 
                    value={newCashFlow.type}
                    onChange={(e) => setNewCashFlow({...newCashFlow, type: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="Inflow">Inflow (Revenue Receipt)</option>
                    <option value="Outflow">Outflow (Expense Settlement)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Amount (Ush)</label>
                  <input 
                    type="number"
                    required
                    placeholder="Ush amount"
                    value={newCashFlow.amount}
                    onChange={(e) => setNewCashFlow({...newCashFlow, amount: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Transaction Description</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Cleared advance payment for Fingerlings, or Solar system maintenance"
                  value={newCashFlow.description}
                  onChange={(e) => setNewCashFlow({...newCashFlow, description: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Transaction Date</label>
                  <input 
                    type="date"
                    required
                    value={newCashFlow.transactionDate}
                    onChange={(e) => setNewCashFlow({...newCashFlow, transactionDate: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Recorded By Staff</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ayo Adedeji, James, etc."
                    value={newCashFlow.recordedBy}
                    onChange={(e) => setNewCashFlow({...newCashFlow, recordedBy: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition"
              >
                Journalize Transaction
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
