/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  PnLStatement,
  TaxRecord,
  ForecastRecord,
  FeedProfile,
  IngredientRecord,
  FeedingSchedule,
  BatchRecord,
  SupplierRecord,
  PondRecord,
  FarmRecord,
  CurrencyRecord,
  TraceRecord,
  ProcessingRecord,
  LPORecord,
  CameraRecord,
  InvoiceRecord,
  CashFlowRecord,
  FishFeedRecord,
  RevenueRecord,
  CustomerSaleRecord,
  HarvestRecord,
  SpawningRecord,
  HealthRecord,
  WaterQualityRecord,
  BudgetRecord,
  AppointmentBooking,
  StockInventory,
  ConsultancyRecord,
  MaintenanceRecord,
  StaffActivityRecord
} from "./types";

// Import core operating modules
import FishFarmConsole from "./components/FishFarmConsole";
import LandingPage from "./components/LandingPage";
import CustomerDashboard from "./components/CustomerDashboard";
import DirectorDesk from "./components/DirectorDesk";
import AdminDashboard from "./components/AdminDashboard";
import AppLogo from "./components/AppLogo";
import BackgroundWatermark from "./components/BackgroundWatermark";
import FinanceDashboard from "./components/FinanceDashboard";
import MarketplacePortal from "./components/MarketplacePortal";
import ManagerDeskGuide from "./components/ManagerDeskGuide";
import UserProfileModal from "./components/UserProfileModal";
import InstallMobileApp from "./components/InstallMobileApp";
import SupabaseHealthDashboard from "./components/SupabaseHealthDashboard";
import { motion } from "motion/react";

import { 
  Building2, 
  Coins, 
  Droplets, 
  Scale, 
  Cpu, 
  Settings, 
  Users, 
  Activity, 
  CheckCircle2, 
  Sparkles, 
  DollarSign, 
  Menu,
  Clock,
  Compass,
  LogOut,
  Database,
  ShieldAlert,
  RefreshCw
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"finance" | "ponds" | "feeds" | "operations" | "ai">("finance");
  const [deskTab, setDeskTab] = useState<"director" | "manager">("director");
  const [isManagerDeskGuideOpen, setIsManagerDeskGuideOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [deviceFormat, setDeviceFormat] = useState<"desktop" | "android">("desktop");
  const [appSize, setAppSize] = useState<"compact" | "medium" | "wide">("wide");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Database States
  const [pnl, setPnl] = useState<PnLStatement[]>([]);
  const [taxes, setTaxes] = useState<TaxRecord[]>([]);
  const [forecasts, setForecasts] = useState<ForecastRecord[]>([]);
  const [feedProfiles, setFeedProfiles] = useState<FeedProfile[]>([]);
  const [ingredients, setIngredients] = useState<IngredientRecord[]>([]);
  const [schedules, setSchedules] = useState<FeedingSchedule[]>([]);
  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>([]);
  const [ponds, setPonds] = useState<PondRecord[]>([]);
  const [farms, setFarms] = useState<FarmRecord[]>([]);
  const [currencies, setCurrencies] = useState<CurrencyRecord[]>([]);
  const [traces, setTraces] = useState<TraceRecord[]>([]);
  const [processing, setProcessing] = useState<ProcessingRecord[]>([]);
  const [lpos, setLpos] = useState<LPORecord[]>([]);
  const [cameras, setCameras] = useState<CameraRecord[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [cashFlows, setCashFlows] = useState<CashFlowRecord[]>([]);
  const [feeds, setFeeds] = useState<FishFeedRecord[]>([]);
  const [revenueRecords, setRevenueRecords] = useState<RevenueRecord[]>([]);
  const [customerSales, setCustomerSales] = useState<CustomerSaleRecord[]>([]);
  const [harvests, setHarvests] = useState<HarvestRecord[]>([]);
  const [spawning, setSpawning] = useState<SpawningRecord[]>([]);
  const [health, setHealth] = useState<HealthRecord[]>([]);
  const [waterQuality, setWaterQuality] = useState<WaterQualityRecord[]>([]);
  const [budgets, setBudgets] = useState<BudgetRecord[]>([]);
  const [bookings, setBookings] = useState<AppointmentBooking[]>([]);
  const [inventoryManagement, setInventoryManagement] = useState<StockInventory[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [consultancies, setConsultancies] = useState<ConsultancyRecord[]>([]);
  const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>([]);
  const [staffActivities, setStaffActivities] = useState<StaffActivityRecord[]>([]);

  // Synchronized Supabase/Database States
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [scheduledTasks, setScheduledTasks] = useState<any[]>([]);
  const [marketplaceProducts, setMarketplaceProducts] = useState<any[]>([]);
  const [marketplaceOrders, setMarketplaceOrders] = useState<any[]>([]);
  const [marketplaceRecommendations, setMarketplaceRecommendations] = useState<any[]>([]);
  const [marketplaceEducations, setMarketplaceEducations] = useState<any[]>([]);
  const [marketplaceReviews, setMarketplaceReviews] = useState<any[]>([]);
  const [marketplaceTickets, setMarketplaceTickets] = useState<any[]>([]);
  const [marketplaceCustomers, setMarketplaceCustomers] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [acknowledgements, setAcknowledgements] = useState<any[]>([]);
  const [communicationStaffMembers, setCommunicationStaffMembers] = useState<any[]>([]);
  const [directMessages, setDirectMessages] = useState<any[]>([]);
  const [userProfiles, setUserProfiles] = useState<any[]>([]);
  const [contentArticles, setContentArticles] = useState<any[]>([]);
  const [systemCalibrations, setSystemCalibrations] = useState<any[]>([]);
  const [dbLoaded, setDbLoaded] = useState(false);

  // Current logged in user credentials (starts as null to show LandingPage by default)
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<"manager" | "finance" | "admin" | "executive" | "customer" | "marketer">("manager");
  const [marketerTab, setMarketerTab] = useState<"marketplace" | "appointments">("marketplace");
  const [sessionExpiredMsg, setSessionExpiredMsg] = useState<string | null>(null);

  // Track user inactivity to sign out after 5 minutes
  useEffect(() => {
    if (!currentUser) return;

    const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes in ms
    let timeoutId: any;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Sign out user and show expired session message
        setCurrentUser(null);
        setSessionExpiredMsg("Your session has expired due to 5 minutes of inactivity. Please sign in again.");
      }, INACTIVITY_LIMIT);
    };

    // Listen for core interaction events
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Start initial timer
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [currentUser]);

  // State redirection support to pass items to the AI Advisory panel
  const [activeAISuggestion, setActiveAISuggestion] = useState<{ type: string, data: any } | null>(null);

  // Supabase Cloud Integration States
  const [supabaseStatus, setSupabaseStatus] = useState<any>({ configured: false, active: false, tableExists: true, tableError: "" });
  const [isRecheckingSupabase, setIsRecheckingSupabase] = useState(false);
  const [supabaseToastMsg, setSupabaseToastMsg] = useState<string | null>(null);
  const [isSupabaseDashboardOpen, setIsSupabaseDashboardOpen] = useState(false);

  const fetchSupabaseStatus = async () => {
    setIsRecheckingSupabase(true);
    try {
      const res = await fetch("/api/supabase/status");
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setSupabaseStatus(data);
        } else {
          console.warn("[App.tsx] Expected JSON from /api/supabase/status, but received:", contentType);
        }
      }
    } catch (e) {
      console.warn("Could not query Supabase status:", e);
    } finally {
      setIsRecheckingSupabase(false);
    }
  };

  const triggerSupabaseToast = (msg: string) => {
    setSupabaseToastMsg(msg);
    setTimeout(() => setSupabaseToastMsg(null), 3000);
  };

  useEffect(() => {
    fetchSupabaseStatus();
    const interval = setInterval(fetchSupabaseStatus, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  // Load database entities from persistent Express server
  const loadDatabase = async () => {
    try {
      const fetchList = [
        { model: "pnlStatements", setter: setPnl },
        { model: "taxes", setter: setTaxes },
        { model: "forecasts", setter: setForecasts },
        { model: "feedProfiles", setter: setFeedProfiles },
        { model: "ingredients", setter: setIngredients },
        { model: "feedingSchedules", setter: setSchedules },
        { model: "batches", setter: setBatches },
        { model: "suppliers", setter: setSuppliers },
        { model: "ponds", setter: setPonds },
        { model: "farms", setter: setFarms },
        { model: "currencies", setter: setCurrencies },
        { model: "traceRecords", setter: setTraces },
        { model: "processingRecords", setter: setProcessing },
        { model: "lpos", setter: setLpos },
        { model: "cameras", setter: setCameras },
        { model: "invoices", setter: setInvoices },
        { model: "cashFlows", setter: setCashFlows },
        { model: "fishFeeds", setter: setFeeds },
        { model: "revenueRecords", setter: setRevenueRecords },
        { model: "customerSales", setter: setCustomerSales },
        { model: "harvests", setter: setHarvests },
        { model: "spawning", setter: setSpawning },
        { model: "healthRecords", setter: setHealth },
        { model: "waterQuality", setter: setWaterQuality },
        { model: "budgets", setter: setBudgets },
        { model: "appointments", setter: setBookings },
        { model: "inventoryManagement", setter: setInventoryManagement },
        { model: "messages", setter: setMessages },
        { model: "consultancies", setter: setConsultancies },
        { model: "maintenances", setter: setMaintenances },
        { model: "staffActivities", setter: setStaffActivities },
        { model: "staffMembers", setter: setStaffMembers },
        { model: "scheduledTasks", setter: setScheduledTasks },
        { model: "marketplaceProducts", setter: setMarketplaceProducts },
        { model: "marketplaceOrders", setter: setMarketplaceOrders },
        { model: "marketplaceRecommendations", setter: setMarketplaceRecommendations },
        { model: "marketplaceEducations", setter: setMarketplaceEducations },
        { model: "marketplaceReviews", setter: setMarketplaceReviews },
        { model: "marketplaceTickets", setter: setMarketplaceTickets },
        { model: "marketplaceCustomers", setter: setMarketplaceCustomers },
        { model: "announcements", setter: setAnnouncements },
        { model: "acknowledgements", setter: setAcknowledgements },
        { model: "communicationStaffMembers", setter: setCommunicationStaffMembers },
        { model: "directMessages", setter: setDirectMessages },
        { model: "userProfiles", setter: setUserProfiles },
        { model: "contentArticles", setter: setContentArticles },
        { model: "systemCalibrations", setter: setSystemCalibrations }
      ];

      await Promise.all(
        fetchList.map(async (item) => {
          try {
            const headers: Record<string, string> = {};
            if (currentUser) {
              headers["x-user-email"] = currentUser;
            }
            const res = await fetch(`/api/data/${item.model}`, { headers });
            if (!res.ok) {
              const text = await res.text().catch(() => "");
              console.warn(`Non-OK response for model ${item.model} (${res.status}):`, text);
              return;
            }
            const data = await res.json();
            if (Array.isArray(data)) {
              item.setter(data);
            } else {
              console.warn(`Expected array for model ${item.model} but got non-array:`, data);
            }
          } catch (fetchErr) {
            console.error(`Error loading model ${item.model}:`, fetchErr);
          }
        })
      );
      setDbLoaded(true);
    } catch (error) {
      console.error("Critical error connecting to the Express REST backend:", error);
    }
  };

  useEffect(() => {
    loadDatabase();
  }, [currentUser]);

  // Generalized CRUD handlers
  const handleAddRecord = async (model: string, payload: any) => {
    try {
      if (model === "consultancies-update") {
        const { id, ...rest } = payload;
        await handleUpdateRecord("consultancies", id, rest);
        return;
      }
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (currentUser) {
        headers["x-user-email"] = currentUser;
      }
      const res = await fetch(`/api/data/${model}`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${res.status}`);
      }
      await loadDatabase(); // Reload all connected lists in sync
    } catch (error) {
      console.error(`Failed to add record to model: ${model}`, error);
      throw error;
    }
  };

  const handleDeleteRecord = async (model: string, id: string) => {
    try {
      const headers: Record<string, string> = {};
      if (currentUser) {
        headers["x-user-email"] = currentUser;
      }
      const res = await fetch(`/api/data/${model}/${id}`, {
        method: "DELETE",
        headers
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${res.status}`);
      }
      await loadDatabase(); // Sync UI
    } catch (error) {
      console.error(`Failed to remove record from model: ${model}`, error);
      throw error;
    }
  };

  const handleUpdateRecord = async (model: string, id: string, payload: any) => {
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (currentUser) {
        headers["x-user-email"] = currentUser;
      }
      const res = await fetch(`/api/data/${model}/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${res.status}`);
      }
      await loadDatabase(); // Sync UI
    } catch (error) {
      console.error(`Failed to update record on model ${model}:`, error);
      throw error;
    }
  };

  // Immediate diagnostic linkage from other submodules
  const handleInitDiagnosticRedirect = (type: string, data: any) => {
    setActiveAISuggestion({ type, data });
    setActiveTab("ai");
  };

  const renderAppContent = () => {
    if (!currentUser) {
      return (
        <LandingPage 
          deviceFormat={deviceFormat}
          userProfiles={userProfiles}
          dbLoaded={dbLoaded}
          onReloadDatabase={loadDatabase}
          sessionExpiredMsg={sessionExpiredMsg}
          onSignInSuccess={(email, role) => { 
            setSessionExpiredMsg(null); // clear session timeout message on new sign in
            setCurrentUser(email); 
            const lowerEmail = email.toLowerCase().trim();
            if (lowerEmail === "recxpats@gmail.com" || lowerEmail.endsWith("@admin.com") || lowerEmail.includes("@admin.com")) {
              setCurrentUserRole("admin");
            } else {
              setCurrentUserRole(role as any);
            }
          }} 
        />
      );
    }

    if (currentUserRole === "finance") {
      return (
        <FinanceDashboard 
          budgets={budgets}
          lpos={lpos}
          invoices={invoices}
          revenueRecords={revenueRecords}
          customerSales={customerSales}
          inventoryManagement={inventoryManagement}
          maintenances={maintenances}
          staffActivities={staffActivities}
          onAddRecord={handleAddRecord}
          onDeleteRecord={handleDeleteRecord}
          onUpdateRecord={handleUpdateRecord}
          currentUserEmail={currentUser}
          onSignOut={() => setCurrentUser(null)}
        />
      );
    }

    return (
      <div id="recxpats-os-root" className="min-h-screen bg-transparent flex flex-col font-sans relative">
        {/* Center-aligned Brand Watermark */}
        <BackgroundWatermark mode="dark" />
        
        {/* Top Ledger Header Banner */}
        <header className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 text-white border-b border-slate-800 shrink-0 shadow-md relative z-25">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AppLogo mode="dark" size="sm" />
              </div>

              {/* Mobile Menu Toggle Button */}
              <div className="flex md:hidden items-center gap-2">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 bg-slate-900 border border-slate-850 text-slate-250 rounded-xl hover:text-white transition"
                >
                  <Menu size={18} />
                </button>
              </div>

              {/* Desktop Credentials and Active UTC Clock */}
              <div className="hidden md:flex flex-wrap items-center gap-4 text-xs font-mono">
                <div className="text-right">
                  <span className="text-[10px] text-sky-350 block tracking-wider uppercase font-extrabold text-blue-300">
                    Active Portal Role
                  </span>
                  <div className="flex items-center gap-2 justify-end mt-1 font-sans">
                    {currentUserRole === "admin" ? (
                      <span className="bg-teal-900 border border-teal-500/50 text-teal-300 text-[10px] font-extrabold px-3 py-1 rounded">
                        👑 Admin Console
                      </span>
                    ) : currentUserRole === "customer" ? (
                      <span className="bg-sky-850 border border-sky-700/50 text-cyan-300 text-[10px] font-extrabold px-3 py-1 rounded">
                        👤 Customer Portal
                      </span>
                    ) : (
                      <span className="bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-[10px] font-extrabold px-3 py-1 rounded">
                        ⚙️ {currentUserRole.toUpperCase()} CONSOLE
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right border-l border-sky-800/60 pl-3">
                  <span className="text-[10px] text-sky-300 block tracking-wider uppercase font-semibold">User Credential</span>
                  <div className="flex items-center gap-2 justify-end mt-1 font-sans">
                    <button
                      onClick={() => setIsProfileOpen(true)}
                      className="text-sky-100 hover:text-amber-400 font-bold transition flex items-center gap-1 bg-sky-950/40 hover:bg-sky-900/60 px-2.5 py-1.5 rounded-xl border border-sky-850/60"
                      title="Configure and Manage User Profile"
                    >
                      <span className="underline decoration-dotted truncate max-w-[140px] text-[11px]">{currentUser}</span>
                      <span className="text-amber-400 text-[11px]">👤</span>
                    </button>
                    <button
                      onClick={() => setCurrentUser(null)}
                      className="flex items-center gap-1 bg-sky-900 hover:bg-rose-955 text-cyan-300 hover:text-rose-200 text-[10px] border border-sky-800 hover:border-rose-900/50 px-2 py-1.5 rounded-xl cursor-pointer transition-colors"
                      title="Sign Out"
                    >
                      <LogOut size={10} />
                      <span>Exit</span>
                    </button>
                  </div>
                </div>

                <div className="h-8 w-px bg-sky-800" />
                <div className="text-right">
                  <span className="text-[10px] text-sky-300 block tracking-wider uppercase font-semibold">Current Audit Period</span>
                  <span className="text-emerald-400 flex items-center gap-1"><Clock size={12} /> Active Sept-Dec 2025</span>
                </div>
                
                {/* Supabase Integration Live Header Status & Recheck */}
                <div className="h-8 w-px bg-sky-800" />
                <div className="flex flex-col items-end shrink-0 select-none">
                  <span className="text-[10px] text-sky-300 block tracking-wider uppercase font-semibold">Supabase Node</span>
                  <button
                    onClick={() => setIsSupabaseDashboardOpen(true)}
                    className="flex items-center gap-1.5 mt-0.5 px-2 py-1 bg-sky-950/80 hover:bg-sky-900/90 border border-sky-800/80 hover:border-teal-500/40 rounded text-[11px] font-mono group cursor-pointer active:scale-95 transition-all"
                    title="Click to view full Supabase diagnostics, latency metrics, and table sync state"
                  >
                    {supabaseStatus.configured ? (
                      supabaseStatus.tableExists ? (
                        supabaseStatus.tableError && supabaseStatus.tableError.toLowerCase().includes("permission") ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-450 animate-pulse" />
                            <span className="text-rose-300 font-bold">RLS Restricted</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            <span className="text-emerald-300 font-bold">
                              Connected {supabaseStatus.latencyMs !== undefined && supabaseStatus.latencyMs !== -1 ? `(${supabaseStatus.latencyMs}ms)` : ""}
                            </span>
                          </>
                        )
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          <span className="text-amber-300 font-bold">Table Missing</span>
                        </>
                      )
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                        <span className="text-slate-400 font-semibold">Offline-First</span>
                      </>
                    )}
                    <span className="text-[9px] text-teal-400 bg-teal-950/80 px-1 py-0.2 rounded border border-teal-900/40 font-sans font-black tracking-wide">
                      DIAGNOSTICS
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Dropdown Menu Drawer */}
            {isMobileMenuOpen && (
              <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-4 animate-in slide-in-from-top duration-200">
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Portal Role</span>
                  <div className="flex items-center gap-2">
                    {currentUserRole === "admin" ? (
                      <span className="bg-teal-900 border border-teal-500/50 text-teal-300 text-xs font-extrabold px-3 py-1.5 rounded-xl block w-full text-center">
                        👑 Admin Console
                      </span>
                    ) : currentUserRole === "customer" ? (
                      <span className="bg-sky-850 border border-sky-700/50 text-cyan-300 text-xs font-extrabold px-3 py-1.5 rounded-xl block w-full text-center">
                        👤 Customer Portal
                      </span>
                    ) : (
                      <span className="bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-extrabold px-3 py-1.5 rounded-xl block w-full text-center">
                        ⚙️ {currentUserRole.toUpperCase()} CONSOLE
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-800/60 pt-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">User Profile</span>
                  <button
                    onClick={() => {
                      setIsProfileOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left text-slate-200 hover:text-white bg-slate-900 border border-slate-800 px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between"
                  >
                    <span className="truncate">{currentUser}</span>
                    <span>👤 Manage</span>
                  </button>
                </div>

                <div className="space-y-2 border-t border-slate-800/60 pt-3 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Supabase Connection</span>
                  {supabaseStatus.configured ? (
                    <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded font-mono">Connected</span>
                  ) : (
                    <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded font-mono">Offline-First</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-slate-800/60 pt-4">
                  <button
                    onClick={() => {
                      setIsInstallOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="py-2.5 bg-slate-900 border border-slate-800 text-cyan-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <span>📱 App Install</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentUser(null);
                      setIsMobileMenuOpen(false);
                    }}
                    className="py-2.5 bg-rose-955 border border-rose-900/50 text-rose-300 hover:text-rose-150 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <LogOut size={12} />
                    <span>Exit Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Quick Actions & Layout Customizer Toolbar Row */}
        <div className="bg-slate-900/40 backdrop-blur-md border-b border-slate-800/80 py-2.5 px-4 sm:px-6 relative z-20 shrink-0">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            {/* Left side: Functional operations quick-toggles */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-sky-400 font-extrabold uppercase tracking-widest mr-1">
                ⚡ Quick Actions:
              </span>
              <button
                onClick={() => {
                  setActiveTab("ponds");
                  setTimeout(() => {
                    const el = document.getElementById("log-water-quality-btn") || document.querySelector("[title*='Log Water Quality']") as HTMLButtonElement || document.querySelector("button:contains('Log')") as HTMLButtonElement;
                    if (el) el.click();
                  }, 300);
                }}
                className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-750 text-cyan-300 hover:text-white border border-slate-700/50 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <span>🧪 Log Water Quality</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("feeds");
                }}
                className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-750 text-emerald-300 hover:text-white border border-slate-700/50 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <span>🌾 Record Feed Use</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("ai");
                }}
                className="px-3 py-1.5 bg-slate-800/80 hover:bg-indigo-950 text-indigo-300 hover:text-white border border-indigo-900/50 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 animate-pulse"
              >
                <span>🧬 Consult Biosecurity AI</span>
              </button>
            </div>

            {/* Right side: Dynamic App Resizing Controller */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 p-1 rounded-xl shrink-0">
              <span className="text-[10px] text-slate-400 font-bold px-1.5 select-none">
                📏 Layout:
              </span>
              <button
                onClick={() => setAppSize("compact")}
                className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold transition-all cursor-pointer ${
                  appSize === "compact"
                    ? "bg-cyan-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Sleek, ultra-high density compact layout"
              >
                Compact
              </button>
              <button
                onClick={() => setAppSize("medium")}
                className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold transition-all cursor-pointer ${
                  appSize === "medium"
                    ? "bg-cyan-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Balanced, comfortable medium-width layout"
              >
                Medium
              </button>
              <button
                onClick={() => setAppSize("wide")}
                className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold transition-all cursor-pointer ${
                  appSize === "wide"
                    ? "bg-cyan-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Spacious, wide standard viewport"
              >
                Spacious
              </button>
            </div>
          </div>
        </div>

        {/* Main Container Viewport Workspace */}
        <main className={`w-full mx-auto p-3 sm:p-4 md:p-6 flex-1 overflow-y-auto transition-all duration-300 ${
          appSize === "compact" 
            ? "max-w-5xl text-xs [&_*]:text-xs [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm [&_button]:text-[10px] [&_td]:p-1 [&_th]:p-1" 
            : appSize === "medium" 
              ? "max-w-6xl text-sm" 
              : "max-w-7xl text-sm"
        }`}>
          {currentUserRole === "admin" || (currentUser && (currentUser.endsWith("@admin.com") || currentUser.includes("@admin.com"))) ? (
            <AdminDashboard 
              currentUserEmail={currentUser || "admin@recxpats.com"}
              onSignOut={() => {
                setCurrentUser(null);
              }}
              ponds={ponds}
              batches={batches}
              waterQuality={waterQuality}
              spawning={spawning}
              cashFlows={cashFlows}
              customerSales={customerSales}
              userProfiles={userProfiles}
              dbLoaded={dbLoaded}
              contentArticles={contentArticles}
              systemCalibrations={systemCalibrations}
              onAddRecord={handleAddRecord}
              onDeleteRecord={handleDeleteRecord}
              onUpdateRecord={handleUpdateRecord}
            />
          ) : currentUserRole === "customer" ? (
            <CustomerDashboard 
              bookings={bookings}
              consultancies={consultancies}
              onAddRecord={handleAddRecord}
              onDeleteRecord={handleDeleteRecord}
              onUpdateRecord={handleUpdateRecord}
              currentUserEmail={currentUser || "customer@guest.io"}
              currentUserRole={currentUserRole}
            />
          ) : currentUserRole === "marketer" ? (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-slate-900 border border-slate-800 text-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="w-full md:w-auto text-center md:text-left">
                  <span className="text-[10px] text-pink-400 font-extrabold uppercase tracking-widest block mb-1">
                    Marketer Operating Portal
                  </span>
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                    📈 Market Management Console
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Active User: <strong className="text-pink-300">{currentUser}</strong>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  {/* Marketer Sub-tab Toggle */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto justify-center">
                    <button
                      type="button"
                      onClick={() => setMarketerTab("marketplace")}
                      className={`px-3 py-1.5 text-[10px] sm:text-[10.5px] font-black uppercase rounded-lg cursor-pointer transition-all flex-1 sm:flex-initial ${
                        marketerTab === "marketplace" 
                          ? "bg-pink-600 text-white shadow-md animate-none" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      🏪 Marketplace
                    </button>
                    <button
                      type="button"
                      onClick={() => setMarketerTab("appointments")}
                      className={`px-3 py-1.5 text-[10px] sm:text-[10.5px] font-black uppercase rounded-lg cursor-pointer transition-all flex-1 sm:flex-initial ${
                        marketerTab === "appointments" 
                          ? "bg-teal-600 text-white shadow-md" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      🧬 Biosecurity AI Desk
                    </button>
                  </div>
                  <button 
                    onClick={() => setCurrentUser(null)} 
                    className="bg-red-650 hover:bg-red-700 text-white rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition w-full sm:w-auto"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
              {marketerTab === "marketplace" ? (
                <MarketplacePortal 
                  showAddProduct={true}
                  dbLoaded={dbLoaded}
                  marketplaceProducts={marketplaceProducts}
                  marketplaceOrders={marketplaceOrders}
                  marketplaceRecommendations={marketplaceRecommendations}
                  marketplaceEducations={marketplaceEducations}
                  marketplaceReviews={marketplaceReviews}
                  marketplaceTickets={marketplaceTickets}
                  marketplaceCustomers={marketplaceCustomers}
                  announcements={announcements}
                  acknowledgements={acknowledgements}
                  communicationStaffMembers={communicationStaffMembers}
                  directMessages={directMessages}
                  onAddRecord={handleAddRecord}
                  onDeleteRecord={handleDeleteRecord}
                  onUpdateRecord={handleUpdateRecord}
                />
              ) : (
                <CustomerDashboard 
                  bookings={bookings}
                  consultancies={consultancies}
                  onAddRecord={handleAddRecord}
                  onDeleteRecord={handleDeleteRecord}
                  onUpdateRecord={handleUpdateRecord}
                  currentUserEmail={currentUser || "marketer@bluehatch.io"}
                  currentUserRole={currentUserRole}
                />
              )}
            </div>
          ) : (currentUserRole === "executive" || currentUser === "inno@executive.com") ? (
            <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
              {/* Dual Sub-Dashboard Level Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md border border-sky-100 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-md">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] text-sky-600 font-extrabold uppercase tracking-widest block leading-none mb-1">
                    EXECUTIVE PORTAL CONTROLS
                  </span>
                  <h2 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight font-sans">
                    {deskTab === "director" ? "💼 DIRECTOR'S DESK" : "⚙️ MANAGER'S DESK"}
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-150 p-1 rounded-xl w-full sm:w-max justify-center">
                  <button
                    type="button"
                    onClick={() => setDeskTab("director")}
                    className={`flex-1 sm:flex-initial px-3 sm:px-4.5 py-2 text-[10.5px] sm:text-xs font-black rounded-lg transition-all ${
                      deskTab === "director"
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    💼 Director
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeskTab("manager")}
                    className={`flex-1 sm:flex-initial px-3 sm:px-4.5 py-2 text-[10.5px] sm:text-xs font-black rounded-lg transition-all ${
                      deskTab === "manager"
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    ⚙️ Manager
                  </button>
                </div>
              </div>

              {deskTab === "director" ? (
                <DirectorDesk 
                  pnl={pnl}
                  taxes={taxes}
                  forecasts={forecasts}
                  budgets={budgets}
                  revenueRecords={revenueRecords}
                  customerSales={customerSales}
                  cashFlows={cashFlows}
                  invoices={invoices}
                  messages={messages}
                  consultancies={consultancies}
                  cameras={cameras}
                  inventoryManagement={inventoryManagement}
                  ponds={ponds}
                  spawning={spawning}
                  waterQuality={waterQuality}
                  bookings={bookings}
                  staffActivities={staffActivities}
                  traces={traces}
                  maintenances={maintenances}
                  feeds={feeds}
                  harvests={harvests}
                  batches={batches}
                  lpos={lpos}
                  suppliers={suppliers}
                  dbLoaded={dbLoaded}
                  onAddRecord={handleAddRecord}
                  onDeleteRecord={handleDeleteRecord}
                  onUpdateRecord={handleUpdateRecord}
                />
              ) : (
                <div className="space-y-4">
                  <FishFarmConsole 
                    inventoryManagement={inventoryManagement}
                    feeds={feeds}
                    feedProfiles={feedProfiles}
                    schedules={schedules}
                    suppliers={suppliers}
                    lpos={lpos}
                    invoices={invoices}
                    waterQuality={waterQuality}
                    spawning={spawning}
                    health={health}
                    ponds={ponds}
                    batches={batches}
                    farms={farms}
                    traces={traces}
                    bookings={bookings}
                    harvests={harvests}
                    maintenances={maintenances}
                    staffActivities={staffActivities}
                    staffMembers={staffMembers}
                    scheduledTasks={scheduledTasks}
                    dbLoaded={dbLoaded}
                    onAddRecord={handleAddRecord}
                    onDeleteRecord={handleDeleteRecord}
                    onUpdateRecord={handleUpdateRecord}
                    readOnly={true}
                    isExecutiveScope={true}
                    currentUserEmail={currentUser || ""}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <FishFarmConsole 
                inventoryManagement={inventoryManagement}
                feeds={feeds}
                feedProfiles={feedProfiles}
                schedules={schedules}
                suppliers={suppliers}
                lpos={lpos}
                invoices={invoices}
                waterQuality={waterQuality}
                spawning={spawning}
                health={health}
                ponds={ponds}
                batches={batches}
                farms={farms}
                traces={traces}
                bookings={bookings}
                harvests={harvests}
                maintenances={maintenances}
                staffActivities={staffActivities}
                staffMembers={staffMembers}
                scheduledTasks={scheduledTasks}
                dbLoaded={dbLoaded}
                onAddRecord={handleAddRecord}
                onDeleteRecord={handleDeleteRecord}
                onUpdateRecord={handleUpdateRecord}
                readOnly={currentUserRole !== "manager" && currentUser !== "okello@manager.com"}
                currentUserEmail={currentUser || ""}
              />
            </div>
          )}
        </main>

        {/* Unified professional footer design constraint (No Tech-Larping metadata) */}
        <footer className="bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 py-5 px-6 select-none shrink-0 text-white">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* CEO Corporate Card */}
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2 pr-4 rounded-xl shadow-md">
              <img
                src="/marcelo_ceo.jpg"
                alt="Mercelo Peter Okoya"
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-emerald-500/30"
              />
              <div className="text-left">
                <span className="text-xs font-bold text-slate-200 block">RecXpats CEO</span>
                <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">Mercelo Peter Okoya</span>
              </div>
            </div>

            {/* Platform branding */}
            <div className="text-center sm:text-right">
              <p className="text-[10px] text-sky-400 font-mono tracking-widest uppercase font-black">Fish Farm Biosecurity Control Panel</p>
              <p className="text-[9px] text-slate-400 font-mono mt-0.5">Blue Ocean Enterprise Edition • Continuous Auditing Enabled</p>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  if (deviceFormat === "android") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-3 sm:p-4 md:p-8 font-sans relative overflow-hidden select-none">
        {/* Abstract beautiful blurred colored backdrop glows inside the emulator screen */}
        <div className="absolute top-1/4 left-1/4 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Header toolbar for the Simulator */}
        <div className="w-full max-w-[390px] mb-3 flex items-center justify-between text-slate-400 text-xs px-2 select-none relative z-10">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-slate-200 text-[11px] sm:text-xs">Android Smartphone Layout</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full text-[9px]">
            <span className="text-[9px] text-slate-400 font-mono">RECXPATS-OS-MOBILE</span>
          </div>
        </div>

        {/* THE PHYSICAL SMARTPHONE FRAME CHASSIS */}
        <div className="relative mx-auto w-full max-w-[375px] h-[780px] bg-slate-950 rounded-[48px] border-[10px] border-slate-800 shadow-2xl shadow-indigo-950/40 ring-4 ring-slate-900 flex flex-col overflow-hidden relative select-none">
          {/* Physical Side Buttons mockups */}
          <div className="absolute -left-[12px] top-[140px] w-[3px] h-[45px] bg-slate-800 rounded-r-md border-r border-slate-700" />
          <div className="absolute -left-[12px] top-[200px] w-[3px] h-[45px] bg-slate-800 rounded-r-md border-r border-slate-700" />
          <div className="absolute -right-[12px] top-[170px] w-[3px] h-[75px] bg-slate-800 rounded-l-md border-l border-slate-700" />

          {/* Android Punch Hole Camera Notch */}
          <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-45 flex items-center justify-center ring-2 ring-slate-900/40">
            <div className="w-1 h-1 bg-blue-900 rounded-full animate-pulse" />
          </div>

          {/* Android Interactive Virtual Status Bar */}
          <div className="h-8 bg-slate-950 text-white text-[10.5px] font-semibold px-6 flex items-center justify-between shrink-0 select-none z-40 relative">
            <div className="flex items-center gap-1 text-[10px] text-slate-300 font-medium">
              <span>09:41</span>
              <span className="text-[8.5px] font-bold text-emerald-400">5G</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-[7.5px] tracking-wider font-extrabold text-slate-400 uppercase mr-1">MTN Uganda</span>
              <div className="flex items-center gap-0.5 border border-slate-500 rounded-xs px-0.5 py-[1px] h-2.5 w-4.5 relative">
                <div className="bg-emerald-400 h-full w-[80%] rounded-2xs" />
                <div className="absolute -right-[2px] top-[2px] h-[3px] w-[1px] bg-slate-500 rounded-r-2xs" />
              </div>
              <span className="text-[8px] text-slate-400 font-mono">98%</span>
            </div>
          </div>

          {/* SIMULATOR SCREEN VIEWPORT CONTENT AREA */}
          <div className="flex-1 w-full bg-slate-50 overflow-y-auto relative text-slate-800 flex flex-col">
            {renderAppContent()}
          </div>

          {/* Android Virtual Bottom Home pill */}
          <div className="h-6 bg-slate-950 w-full flex items-center justify-center shrink-0 z-40 relative">
            <div className="w-24 h-1 bg-slate-700 rounded-full hover:bg-slate-500 transition-colors cursor-pointer" onClick={() => setDeviceFormat("desktop")} title="Click to quickly return to full Desktop screen format" />
          </div>
        </div>

        {/* Return helper tip */}
        <p className="text-[10px] text-slate-500 text-center mt-3 tracking-wide font-medium">
          💡 Scroll and tap inside the phone chassis to test! Switch back via the floating switcher.
        </p>

        {/* Render persistent Profile & PWA Modals inside Emulator scope if open */}
        <UserProfileModal 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
          currentUserEmail={currentUser || ""} 
          currentUserRole={currentUserRole} 
        />
        {isInstallOpen && (
          <InstallMobileApp onClose={() => setIsInstallOpen(false)} />
        )}

        {/* Supabase Connection Health and Sync Diagnostics Dashboard Modal Overlay (Mobile/Emulator view) */}
        {isSupabaseDashboardOpen && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-55 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl"
            >
              <SupabaseHealthDashboard 
                status={supabaseStatus} 
                isRechecking={isRecheckingSupabase} 
                onRefresh={fetchSupabaseStatus} 
                onClose={() => setIsSupabaseDashboardOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col relative animate-in fade-in duration-200">
      {renderAppContent()}

      {/* Supabase Connection Health and Sync Diagnostics Dashboard Modal Overlay (Desktop view) */}
      {isSupabaseDashboardOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-4xl"
          >
            <SupabaseHealthDashboard 
              status={supabaseStatus} 
              isRechecking={isRecheckingSupabase} 
              onRefresh={fetchSupabaseStatus} 
              onClose={() => setIsSupabaseDashboardOpen(false)}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
