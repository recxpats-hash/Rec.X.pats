import React, { useState, useRef, useEffect } from "react";
import {
  Users,
  FileText,
  Settings,
  Bell,
  Plus,
  Search,
  Trash2,
  ShieldAlert,
  Download,
  CheckCircle2,
  UserX,
  UserCheck,
  RefreshCw,
  Sliders,
  Database,
  Building,
  Activity,
  Award,
  Flame,
  FileDown,
  Globe,
  Bot,
  Cpu,
  History,
  Wifi,
  WifiOff,
  Clock,
  Send,
  Sparkles,
  Zap,
  HardDrive
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
import AppLogo from "./AppLogo";
import BackgroundWatermark from "./BackgroundWatermark";

interface AdminDashboardProps {
  currentUserEmail: string;
  onSignOut: () => void;
  ponds: any[];
  batches: any[];
  waterQuality: any[];
  spawning: any[];
  cashFlows: any[];
  customerSales: any[];
  userProfiles?: any[];
  dbLoaded?: boolean;
  contentArticles?: any[];
  systemCalibrations?: any[];
  onAddRecord: (model: string, data: any) => Promise<void>;
  onDeleteRecord: (model: string, id: string) => Promise<void>;
  onUpdateRecord: (model: string, id: string, data: any) => Promise<void>;
}

interface UserProfile {
  email: string;
  name: string;
  role: string;
  status: "Active" | "Suspended";
  lastActive: string;
  password?: string;
}

interface ContentArticle {
  id: string;
  title: string;
  category: "Annoncement" | "Advisory" | "Feeding Standard" | "FAO Manual";
  author: string;
  snippet: string;
  dateCreated: string;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  severity: "Info" | "Warning" | "Critical";
}

const LANGUAGE_PACKS = {
  en: {
    title: "🛡️ System Administration Console",
    subtitle: "Logged in",
    level: "Primary Admin Administrator",
    adminPanel: "👥 1. Admin Panel",
    auditLogs: "📁 2. Audit Logs",
    advFeatures: "🚀 3. Advanced Features",
    userMgmt: "User Profiles & Operations Roles",
    contentMgmt: "Biological Content & Broadcasts",
    systemMonitor: "Live System Performance",
    chatbotTitle: "AI recxpats Assistant Chatbot",
    saveBtn: "Mount Credentials",
    cancelBtn: "Cancel",
    activityTrack: "System Activity Tracking Stream",
    userActionHist: "Granular User Actions Audit Log",
    aiAutomation: "Autonomous Sub-System & Co-Pilot",
    offlineMode: "Local State & Network Emulator",
    multiLanguage: "Dynamic Localization & Regionalization",
    languageTitle: "Select Active Console Language Dialect",
    currencyTitle: "Financial Realization Currency Suffix",
    timezoneTitle: "Primary Server Synchronous Timezone Offset",
    tempTitle: "Baseline Temperature Calibration Metric"
  },
  sw: {
    title: "🛡️ Dashibodi ya Utawala wa Mfumo",
    subtitle: "Umeingia kama",
    level: "Msimamizi Mkuu wa Mfumo",
    adminPanel: "👥 1. Paneli ya Utawala",
    auditLogs: "📁 2. Kumbukumbu",
    advFeatures: "🚀 3. Sifa za Kisasa",
    userMgmt: "Profaili za Watumiaji na Majukumu",
    contentMgmt: "Maudhui ya Kibiolojia na Matangazo",
    systemMonitor: "Utendaji wa Mfumo wa Moja kwa Moja",
    chatbotTitle: "Msaidizi wa AI wa Kufuga Samaki",
    saveBtn: "Hifadhi Vitambulisho",
    cancelBtn: "Ghairi",
    activityTrack: "Kipitisho cha Kufuatilia Shughuli za Mfumo",
    userActionHist: "Kumbukumbu ya Vitendo vya Watumiaji",
    aiAutomation: "Uendeshaji wa AI na Mifumo ya Moja kwa Moja",
    offlineMode: "Uhifadhi wa Ndani na Mtandao wa Majaribio",
    multiLanguage: "Tafsiri ya Lugha na Mipangilio ya Kanda",
    languageTitle: "Chagua Lugha Inayotumika Kwenye Mfumo",
    currencyTitle: "Alama ya Fedha ya Kiunzi cha Hesabu",
    timezoneTitle: "Kanda Kuu ya Saa ya Seva",
    tempTitle: "Kipimo cha Kupima Halijoto"
  },
  lg: {
    title: "🛡️ Olulyo lw'Okuddukanya Enteekateeka",
    subtitle: "Oyingidde nga",
    level: "Omuddukanya Omukulu ow'Enteekateeka",
    adminPanel: "👥 1. Olubalama lw'Abaddukanya",
    auditLogs: "📁 2. Ebiwandiiko",
    advFeatures: "🚀 3. Obusobozi obw'Omulembe",
    userMgmt: "Ebyafaayo by'Abakozesa n'Obuyinza",
    contentMgmt: "Ebirango n'Ebyokulya by'Ebyennyanja",
    systemMonitor: "Embeera y'Enteekateeka mu Butuufu",
    chatbotTitle: "Omubeezi wa AI mu Kulunda Ebyennyanja",
    saveBtn: "Kakasa Ebyapa",
    cancelBtn: "Sazaamu",
    activityTrack: "Emisoso gy'Okukebera Embeera y'Enteekateeka",
    userActionHist: "Ebiwandiiko by'Ebikorwa by'Abakozesa",
    aiAutomation: "Obuyinza obw'Awtomeshoni ne AI",
    offlineMode: "Okutereka ku lusegere ne Netiwaka eya Kiyiiye",
    multiLanguage: "Okukyusa Olulimi n'Embeera ez'Ebitundu",
    languageTitle: "Londa Olulimi lwennyini lw'Oyagala mu Konsolo",
    currencyTitle: "Sente z'Okubala mu Ofisi eno",
    timezoneTitle: "Sawa yennyini ey'Ewasomero lya Seva",
    tempTitle: "Embeera ey'Okupima Obunnyogovu"
  },
  fr: {
    title: "🛡️ Console d'Administration Système",
    subtitle: "Connecté en tant que",
    level: "Administrateur Principal",
    adminPanel: "👥 1. Panneau d'Administration",
    auditLogs: "📁 2. Journaux d'Audit",
    advFeatures: "🚀 3. Fonctionnalités Avancées",
    userMgmt: "Profils Utilisateurs et Rôles",
    contentMgmt: "Contenus Biologiques & Annonces",
    systemMonitor: "Performances Système en Direct",
    chatbotTitle: "Assistant IA recxpats",
    saveBtn: "Enregistrer les Identifiants",
    cancelBtn: "Annuler",
    activityTrack: "Flux de Suivi de l'Activité Système",
    userActionHist: "Historique d'Audit des Actions Utilisateur",
    aiAutomation: "Automatisation Système & Copilote IA",
    offlineMode: "Données Locales et Émulateur Réseau",
    multiLanguage: "Localisation Dynamique & Paramètres Régionaux",
    languageTitle: "Choisir la Langue Active de la Console",
    currencyTitle: "Symbole de Devise Budgétaire",
    timezoneTitle: "Fuseau Horaire de Synchronisation Serveur",
    tempTitle: "Calibrage Température de Base"
  }
};

export default function AdminDashboard({
  currentUserEmail,
  onSignOut,
  ponds = [],
  batches = [],
  waterQuality = [],
  spawning = [],
  cashFlows = [],
  customerSales = [],
  userProfiles = [],
  dbLoaded = false,
  contentArticles: contentArticlesProp = [],
  systemCalibrations = [],
  onAddRecord,
  onDeleteRecord,
  onUpdateRecord
}: AdminDashboardProps) {

  // Primary Workspace Tabs matching requested layout exactly
  const [activeTab, setActiveTab] = useState<"admin_panel" | "audit_logs" | "advanced_features">("admin_panel");

  // Sub-sections inside "Admin Panel"
  const [adminPanelSubTab, setAdminPanelSubTab] = useState<"users" | "content" | "system">("users");

  // Sub-sections inside "Audit Logs"
  const [auditLogsSubTab, setAuditLogsSubTab] = useState<"activity" | "history">("activity");

  // Sub-sections inside "Advanced Features"
  const [advancedSubTab, setAdvancedSubTab] = useState<"ai_automation" | "supabase_portal" | "multi_language">("ai_automation");

  // MULTI-LANGUAGE STATE
  const [activeLanguage, setActiveLanguage] = useState<"en" | "sw" | "lg" | "fr">("en");
  const t = LANGUAGE_PACKS[activeLanguage];

  // REGIONAL SETTINGS STATE
  const [selectedCurrency, setSelectedCurrency] = useState<"UGX" | "USD" | "KES" | "EUR">("UGX");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");
  const [selectedTimezone, setSelectedTimezone] = useState("Africa/Kampala (EAT - UTC+3)");

  // --- 1. DATA/STATE FOR USER MANAGEMENT ---
  const usersList = (dbLoaded || (userProfiles && userProfiles.length > 0)) ? userProfiles : [
    { id: "usr-1", email: "okello@manager.com", name: "Stephen Okello", role: "Manager", status: "Active", lastActive: "6 mins ago", password: "manager123" },
    { id: "usr-2", email: "inno@executive.com", name: "Mercelo Peter Okoya", role: "Executive", status: "Active", lastActive: "Just now", password: "executive123" },
    { id: "usr-3", email: "lau@customer.com", name: "Ken Lawrence", role: "Customer", status: "Active", lastActive: "4 hours ago", password: "customer123" },
    { id: "usr-4", email: "ajabi@admin.com", name: "Lawrence Ajabi", role: "Admin", status: "Active", lastActive: "Just now", password: "admin123" },
    { id: "usr-5", email: "restricted-trial@customer.com", name: "Trial User", role: "Customer", status: "Suspended", lastActive: "2 weeks ago", password: "trial123" },
    { id: "usr-6", email: "recxpats@gmail.com", name: "Recxpats Admin", role: "Admin", password: "Admin@recxpats", status: "Active", lastActive: "Never logged" },
    { id: "usr-7", email: "lau@finance.com", name: "Lau Finance", role: "Finance", password: "finance123", status: "Active", lastActive: "Never logged" },
    { id: "usr-8", email: "ivan@marketer.com", name: "Ivan Marketer", role: "Marketer", password: "marketer123", status: "Active", lastActive: "Never logged" }
  ];
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("Manager");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // States for inline profile editing
  const [editingUserEmail, setEditingUserEmail] = useState<string | null>(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserRole, setEditUserRole] = useState("");
  const [editUserPassword, setEditUserPassword] = useState("");

  // --- 2. DATA/STATE FOR CONTENT MANAGEMENT ---
  const contentArticles = (contentArticlesProp && contentArticlesProp.length > 0) ? contentArticlesProp : [
    { id: "ART-01", title: "Standard Tilapia Fry Incubation Protocol", category: "FAO Manual", author: "okello@manager.com", snippet: "Maintain water flow velocity at 0.5L/sec using digital automated pumps...", dateCreated: "2026-06-19" },
    { id: "ART-02", title: "Emergency Spawning Hormone Salinity Levels", category: "Advisory", author: "ajabi@admin.com", snippet: "Dilute Ovaprim compounds exclusively on 0.9% physiological saline solutions...", dateCreated: "2026-06-20" },
    { id: "ART-03", title: "Luwero Broodstock Pond Biocompliance Level A", category: "Feeding Standard", author: "inno@executive.com", snippet: "Restructure starter diets with 45% crude protein content to improve larvae output...", dateCreated: "2026-06-18" }
  ];
  const [newArtTitle, setNewArtTitle] = useState("");
  const [newArtCategory, setNewArtCategory] = useState<any>("Advisory");
  const [newArtSnippet, setNewArtSnippet] = useState("");
  const [isAddArticleModalOpen, setIsAddArticleModalOpen] = useState(false);

  // --- 3. SYSTEM MONITORING CALIBRATION SLIDERS ---
  const [optTemp, setOptTemp] = useState("26.5");
  const [targetPH, setTargetPH] = useState("7.2");
  const [maxAmmonia, setMaxAmmonia] = useState("0.05");
  const [targetSalinity, setTargetSalinity] = useState("5.0");
  const [simulatedDiagnostics, setSimulatedDiagnostics] = useState({
    cpuUsage: 34,
    memoryUsage: 58,
    threadLatency: 12,
    dbConnectionState: "ESTABLISHED",
    cloudQueueLatency: 140
  });

  // --- 4. AUDIT LOGS STATES ---
  const [systemActivityLogs, setSystemActivityLogs] = useState<AuditLogEntry[]>([
    { id: "LOG-5001", timestamp: "2026-06-20 07:44:12", user: "ajabi@admin.com", action: "Authorized corporate login to Administrator console", module: "AUTH", severity: "Info" },
    { id: "LOG-5002", timestamp: "2026-06-20 07:11:40", user: "okello@manager.com", action: "Database synchronization linked 4 new spawning logs", module: "DATABASE", severity: "Info" },
    { id: "LOG-5003", timestamp: "2026-06-20 06:12:05", user: "SYSTEM", action: "Sensor telemetry alert: Incubator Room B temperature limit bypass (28.2°C)", module: "SENSORS", severity: "Warning" },
    { id: "LOG-5004", timestamp: "2026-06-20 05:00:00", user: "SYSTEM", action: "Automatic weekly clean routine completed on Nursery standard", module: "SCHEDULER", severity: "Info" },
    { id: "LOG-5005", timestamp: "2026-06-20 04:30:19", user: "restricted-trial@customer.com", action: "Access denied to Spawning logs directory", module: "SECURITY", severity: "Critical" }
  ]);
  const [logFilterCategory, setLogFilterCategory] = useState<"All" | "AUTH" | "DATABASE" | "SENSORS" | "SECURITY">("All");

  // User Action History Logs State
  const [userActionsHistory, setUserActionsHistory] = useState([
    { id: "ACT-901", timestamp: "2026-06-20 07:55 EAT", staff: "Stephen Okello", role: "Manager", detail: "Added Tilapia Starter Feed item (ID M-101) to operational inventory ledger" },
    { id: "ACT-902", timestamp: "2026-06-20 07:49 EAT", staff: "Lawrence Ajabi", role: "Admin", detail: "Modified safe ph parameter limit from 6.9 to 7.2" },
    { id: "ACT-903", timestamp: "2026-06-20 07:12 EAT", staff: "Mercelo Peter Okoya", role: "Executive", detail: "Generated custom Water Quality Audit PDF report and exported to ledger" },
    { id: "ACT-904", timestamp: "2026-06-20 06:40 EAT", staff: "Stephen Okello", role: "Manager", detail: "Captured live biological sample snapshot and saved for audit auditing" },
    { id: "ACT-905", timestamp: "2026-06-19 23:18 EAT", staff: "Lawrence Ajabi", role: "Admin", detail: "Registered new profile account for Regina Phalange (Operator)" }
  ]);

  // --- 5. AI & AUTOMATION (Chatbot AI Support) ---
  const [chatbotMessages, setChatbotMessages] = useState([
    { sender: "ai", text: "Hello! I am your AI recxpats Companion. Ask me questions about optimal spawning rates, feed conversion formulas, biocompliance diagnostics, or baseline FAO guidelines." }
  ]);
  const [userChatInput, setUserChatInput] = useState("");
  const [isAiAnswering, setIsAiAnswering] = useState(false);

  // Automated workflows configurations
  const [workflowAutoCooling, setWorkflowAutoCooling] = useState(true);
  const [workflowSMSOnAmmonia, setWorkflowSMSOnAmmonia] = useState(false);
  const [workflowWeeklyPDFCompiler, setWorkflowWeeklyPDFCompiler] = useState(true);

  // --- 6. OFFLINE MODE SIMULATOR ---
  const [isCloudOnline, setIsCloudOnline] = useState(true);
  const [localDatabaseQuota, setLocalDatabaseQuota] = useState(87.4); // KB used
  const [offlineSyncQueue, setOfflineSyncQueue] = useState<string[]>([]);
  const [syncStatus, setSyncStatus] = useState<"Idle" | "Syncing" | "Completed">("Idle");

  // --- SUPABASE CLOUD MANAGEMENT INTEGRATION ---
  const [supabaseStatus, setSupabaseStatus] = useState({ configured: false, active: false, tableExists: true, tableError: "" });
  const [isSyncingToSupabase, setIsSyncingToSupabase] = useState(false);
  const [supabaseConfig, setSupabaseConfig] = useState({ supabaseUrl: "", supabaseAnonKey: "" });
  const [sqlViewTab, setSqlViewTab] = useState<"table" | "users">("table");

  const fetchSupabaseStatus = async () => {
    try {
      const res = await fetch("/api/supabase/status");
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setSupabaseStatus(data);
        }
      }
      const resConfig = await fetch("/api/supabase/config");
      if (resConfig.ok) {
        const contentType = resConfig.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const configData = await resConfig.json();
          setSupabaseConfig(configData);
        }
      }
    } catch (e) {
      console.warn("Could not query Supabase status endpoints:", e);
    }
  };

  useEffect(() => {
    fetchSupabaseStatus();
  }, []);

  const handleSyncToSupabase = async () => {
    setIsSyncingToSupabase(true);
    try {
      const res = await fetch("/api/supabase/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerToast(`✓ All local data migrated successfully! Synced ${data.totalSynced} items.`);
        addSystemLog("DATABASE", `Supabase migration successful: synced ${data.totalSynced} records to cloud`, "Info");
        fetchSupabaseStatus();
      } else {
        triggerToast(`❌ Migration error: ${data.error || "Please verify credentials."}`);
      }
    } catch (error: any) {
      triggerToast(`❌ Sync failed: ${error.message}`);
    } finally {
      setIsSyncingToSupabase(false);
    }
  };

  // Dynamic system simulation tick
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedDiagnostics(prev => {
        const deltaCpu = Math.floor(Math.random() * 9) - 4;
        const deltaRam = Math.floor(Math.random() * 5) - 2;
        return {
          ...prev,
          cpuUsage: Math.min(Math.max(prev.cpuUsage + deltaCpu, 20), 85),
          memoryUsage: Math.min(Math.max(prev.memoryUsage + deltaRam, 45), 90),
          threadLatency: Math.floor(8 + Math.random() * 12)
        };
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // FEEDBACK TOASTS system
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Log user activity logs helper
  const addSystemLog = (category: string, message: string, severity: "Info" | "Warning" | "Critical" = "Info") => {
    const timestampStr = new Date().toISOString().replace("T", " ").substring(0, 19);
    const newLogId = `LOG-${Math.floor(6000 + Math.random() * 3000)}`;
    const newEntry: AuditLogEntry = {
      id: newLogId,
      timestamp: timestampStr,
      user: currentUserEmail,
      action: message,
      module: category,
      severity: severity
    };
    setSystemActivityLogs(prev => [newEntry, ...prev]);
  };

  // Register New User
  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      triggerToast("Please provide legal full credentials including password.");
      return;
    }
    const isMinLength = newUserPassword.length >= 8;
    const hasLower = /[a-z]/.test(newUserPassword);
    const hasUpper = /[A-Z]/.test(newUserPassword);
    const hasDigit = /[0-9]/.test(newUserPassword);
    if (!isMinLength || !hasLower || !hasUpper || !hasDigit) {
      triggerToast("Password must have at least 8 characters, one lowercase letter, one uppercase letter, and one number.");
      return;
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      email: newUserEmail.trim(),
      name: newUserName.trim(),
      role: newUserRole,
      password: newUserPassword,
      status: "Active" as const,
      lastActive: "Never logged"
    };

    onAddRecord("userProfiles", newUser)
      .then(() => {
        addSystemLog("SECURITY", `Registered new profile user: ${newUserName} (${newUserRole})`, "Info");
        triggerToast(`User Account Registration Successful for ${newUser.name}.`);
      })
      .catch((err) => {
        console.error(err);
        triggerToast("Failed to register user to Supabase.");
      });
    
    // Track in action list too
    setUserActionsHistory(prev => [
      {
        id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: `${new Date().toLocaleTimeString()} EAT`,
        staff: "Lawrence Ajabi",
        role: "Admin",
        detail: `Registered new profile account for ${newUserName} (${newUserRole})`
      },
      ...prev
    ]);

    setIsAddUserModalOpen(false);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPassword("");
  };

  const isAdminUser = (user: any) => {
    if (!user) return false;
    return user.role === "Admin" || (user.email && (user.email.endsWith("@admin.com") || user.email.includes("@admin.com")));
  };

  const canRevokeUser = (user: any) => {
    if (!user) return false;
    // An active admin can revoke any account except themselves (itself)
    return user.email !== currentUserEmail;
  };

  const handleStartEdit = (user: any) => {
    setEditingUserEmail(user.email);
    setEditUserName(user.name);
    setEditUserRole(user.role);
    setEditUserPassword(user.password || "");
  };

  const handleSaveEdit = (user: any) => {
    if (!editUserName.trim() || !editUserPassword.trim()) {
      triggerToast("Name and password are required.");
      return;
    }
    const isMinLength = editUserPassword.length >= 8;
    const hasLower = /[a-z]/.test(editUserPassword);
    const hasUpper = /[A-Z]/.test(editUserPassword);
    const hasDigit = /[0-9]/.test(editUserPassword);
    if (!isMinLength || !hasLower || !hasUpper || !hasDigit) {
      triggerToast("Password must have at least 8 characters, one lowercase letter, one uppercase letter, and one number.");
      return;
    }
    const targetId = user.id || `usr-temp-${Date.now()}`;
    const updatedUser = {
      ...user,
      name: editUserName.trim(),
      role: editUserRole,
      password: editUserPassword.trim()
    };
    onUpdateRecord("userProfiles", targetId, updatedUser)
      .then(() => {
        addSystemLog("SECURITY", `Updated user credentials for ${user.email} in Supabase`, "Info");
        triggerToast("User profile updated successfully and saved to Supabase.");
        setEditingUserEmail(null);
      })
      .catch((err) => {
        console.error(err);
        triggerToast("Failed to update user profile in Supabase.");
      });
  };

  const handleRoleChange = (email: string, newRole: string) => {
    const userToUpdate = usersList.find(u => u.email === email);
    if (userToUpdate) {
      if (email === currentUserEmail) {
        triggerToast("Fatal: Changing your own administrative role clearance is restricted.");
        return;
      }
      const targetId = userToUpdate.id || `usr-temp-${Date.now()}`;
      onUpdateRecord("userProfiles", targetId, { ...userToUpdate, role: newRole })
        .then(() => {
          addSystemLog("SECURITY", `Restructured operational permission group of ${email} to ${newRole}`, "Warning");
          triggerToast(`Role updated successfully to ${newRole} and saved to Supabase.`);
        })
        .catch((err) => {
          console.error(err);
          triggerToast("Failed to update user role in Supabase.");
        });
    }
  };

  const handleToggleUserStatus = (email: string) => {
    if (email === currentUserEmail) {
      triggerToast("Fatal: You cannot toggle/suspend your own active account status.");
      return;
    }
    const userToToggle = usersList.find(u => u.email === email);
    if (userToToggle) {
      const targetStatus = userToToggle.status === "Active" ? "Suspended" : "Active";
      const targetId = userToToggle.id || `usr-temp-${Date.now()}`;
      onUpdateRecord("userProfiles", targetId, { ...userToToggle, status: targetStatus })
        .then(() => {
          addSystemLog("SECURITY", `Toggled permit role of ${email} to ${targetStatus}`, "Warning");
          triggerToast(`User credentials status changed.`);
        })
        .catch((err) => {
          console.error(err);
          triggerToast("Failed to update user status in Supabase.");
        });
    }
  };

  const handleDeleteUser = (email: string) => {
    if (email === currentUserEmail) {
      triggerToast("Fatal: You cannot revoke your own active session account.");
      return;
    }
    const userToDelete = usersList.find(u => u.email === email);
    if (userToDelete) {
      const targetId = userToDelete.id || `usr-temp-${Date.now()}`;
      onDeleteRecord("userProfiles", targetId)
        .then(() => {
          addSystemLog("SECURITY", `Revoked bio-clear permissions completely for user: ${email}`, "Critical");
          triggerToast(`User profile deleted successfully.`);
        })
        .catch((err) => {
          console.error(err);
          triggerToast("Failed to delete user from Supabase.");
        });
    }
  };

  // Add standard Articles Content Management
  const handleCreateArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtTitle.trim() || !newArtSnippet.trim()) {
      triggerToast("Please insert complete article snippet.");
      return;
    }
    const newArt = {
      id: `ART-${Date.now()}`,
      title: newArtTitle,
      category: newArtCategory,
      author: currentUserEmail,
      snippet: newArtSnippet,
      dateCreated: new Date().toISOString().substring(0, 10)
    };

    onAddRecord("contentArticles", newArt)
      .then(() => {
        addSystemLog("CONTENT", `Published biological standard guide: "${newArtTitle}"`, "Info");
        triggerToast(`Article published to operators catalog.`);
      })
      .catch((err) => {
        console.error(err);
        triggerToast("Failed to publish article to Supabase.");
      });

    setIsAddArticleModalOpen(false);
    setNewArtTitle("");
    setNewArtSnippet("");
  };

  const handleDeleteArticle = (id: string) => {
    onDeleteRecord("contentArticles", id)
      .then(() => {
        addSystemLog("CONTENT", `Removed manual standard guide ID: ${id}`, "Warning");
        triggerToast(`Snippet ID ${id} deleted.`);
      })
      .catch((err) => {
        console.error(err);
        triggerToast("Failed to delete article from Supabase.");
      });
  };

  // Synchronize System Calibrations from database on load
  useEffect(() => {
    if (systemCalibrations && systemCalibrations.length > 0) {
      const activeCalib = systemCalibrations[0];
      if (activeCalib.optTemp) setOptTemp(activeCalib.optTemp);
      if (activeCalib.targetPH) setTargetPH(activeCalib.targetPH);
      if (activeCalib.maxAmmonia) setMaxAmmonia(activeCalib.maxAmmonia);
      if (activeCalib.targetSalinity) setTargetSalinity(activeCalib.targetSalinity);
    }
  }, [systemCalibrations]);

  const saveCalibrations = (temp: string, ph: string, amm: string, sal: string) => {
    onUpdateRecord("systemCalibrations", "calib-1", {
      id: "calib-1",
      optTemp: temp,
      targetPH: ph,
      maxAmmonia: amm,
      targetSalinity: sal
    }).catch((err) => {
      console.error("Failed to update calibration thresholds in Supabase:", err);
    });
  };

  // AI Chatbot Answers compiler
  const handleSendChat = () => {
    if (!userChatInput.trim()) return;
    const query = userChatInput.trim();
    
    // Append user message
    const updatedMessages = [...chatbotMessages, { sender: "user", text: query }];
    setChatbotMessages(updatedMessages);
    setUserChatInput("");
    setIsAiAnswering(true);

    // Contextual bot response
    setTimeout(() => {
      let botResponse = "I have scanned the active telemetry index. All thresholds comply with FAO biosecurity guidelines.";
      const queryLower = query.toLowerCase();

      if (queryLower.includes("spawning") || queryLower.includes("optimize")) {
        botResponse = `To optimize larval strip-spawning yield: Keep water temp strictly at ${optTemp}°C, target salinity at 4.9‰, and introduce 0.5ml of Ovaprim Inducer per kilogram of female broodstock.`;
      } else if (queryLower.includes("ammonia") || queryLower.includes("toxicity")) {
        botResponse = `Warning threshold for total Unionized Ammonia is configured at < ${maxAmmonia} mg/L. Exceeding this triggers automated cooling cycle backups and releases bio-nitrifying compound buffers.`;
      } else if (queryLower.includes("ph") || queryLower.includes("optimum")) {
        botResponse = `FAO Biosecurity baseline pH target is ${targetPH}. Fluctuations below 6.5 inhibit gill respiration and scale integrity in Tilapia fingerlings.`;
      } else if (queryLower.includes("fcr") || queryLower.includes("feed")) {
        botResponse = "Optimal Feed Conversion Ratio (FCR) target is 1.4FCR. Reduce starter meal supply by -5.3% if larval conversion indices drift outside benchmark bounds.";
      } else if (queryLower.includes("help") || queryLower.includes("tutorial")) {
        botResponse = "Type phrases like 'Spawning yield tips', 'Ammonia baseline thresholds', 'Optimal pH level value', or 'FCR targets' for automated live calibrations.";
      } else {
        botResponse = `Telemetry analysis successfully indexed. Your configured baselines (Temp: ${optTemp}°C, pH: ${targetPH}) are evaluated against real-time micro-sensors. Operations are 100% SECURE.`;
      }

      setChatbotMessages(prev => [...prev, { sender: "ai", text: botResponse }]);
      setIsAiAnswering(false);
      addSystemLog("AI", `Inquired co-pilot: "${query.substring(0, 25)}..."`, "Info");
    }, 1200);
  };

  // Offline syncing handler
  const handleSynchronizeManual = () => {
    if (offlineSyncQueue.length === 0) {
      triggerToast("Local diagnostics are completely synchronized.");
      return;
    }
    setSyncStatus("Syncing");
    setTimeout(() => {
      setOfflineSyncQueue([]);
      setSyncStatus("Completed");
      setLocalDatabaseQuota(87.4);
      addSystemLog("DATABASE", "Re-synchronized local storage buffer safely with cloud Supabase databases", "Info");
      triggerToast("Synchronization Completed to Primary Cluster!");
      setTimeout(() => setSyncStatus("Idle"), 2000);
    }, 2500);
  };

  const handleSimulateWriteOffline = () => {
    const queueAction = `SAVE RECORD AT-${Math.floor(100+Math.random()*900)} [${new Date().toLocaleTimeString()}]`;
    setOfflineSyncQueue(prev => [...prev, queueAction]);
    setLocalDatabaseQuota(prev => parseFloat((prev + 3.2).toFixed(1)));
    triggerToast("Action buffered on LocalStorage. Internet Sync Pending.");
  };

  const handleExportAuditLogs = () => {
    let csvContent = "data:text/csv;charset=utf-8,ID,Timestamp,Operator,Message,Module,Severity\n";
    systemActivityLogs.forEach(log => {
      csvContent += `"${log.id}","${log.timestamp}","${log.user}","${log.action.replace(/"/g, '""')}","${log.module}","${log.severity}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `System_Telemetry_Audit_Trails_${new Date().toISOString().substring(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("System Audit CSV downloaded.");
  };

  // Chart diagnostics data compiling
  const performanceMonitoringChartData = [
    { name: "08:10", cpu: 32, ram: 54, traffic: 110, latency: 11 },
    { name: "08:15", cpu: 45, ram: 55, traffic: 145, latency: 14 },
    { name: "08:20", cpu: simulatedDiagnostics.cpuUsage, ram: simulatedDiagnostics.memoryUsage, traffic: 195, latency: simulatedDiagnostics.threadLatency },
    { name: "08:25", cpu: 38, ram: 57, traffic: 120, latency: 9 },
    { name: "08:30", cpu: 31, ram: 52, traffic: 95, latency: 10 }
  ];

  const predictiveYieldData = [
    { density: "10 Fry/L", normalYield: 85, predictedYield: 89, fcr: 1.4 },
    { density: "20 Fry/L", normalYield: 91, predictedYield: 94, fcr: 1.35 },
    { density: "30 Fry/L", normalYield: 84, predictedYield: 91, fcr: 1.45 },
    { density: "40 Fry/L", normalYield: 76, predictedYield: 83, fcr: 1.58 },
    { density: "50 Fry/L", normalYield: 65, predictedYield: 72, fcr: 1.72 }
  ];

  // Filtering users based on query
  const filteredUsers = usersList.filter(user => {
    const query = userSearchQuery.toLowerCase().trim();
    if (!query) return true;
    return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query) || user.role.toLowerCase().includes(query);
  });

  return (
    <div className="bg-slate-50 min-h-[85vh] rounded-3xl border border-slate-200 p-4 md:p-6 space-y-6 relative overflow-hidden">
      {/* Center-aligned Brand Watermark */}
      <BackgroundWatermark mode="light" />
      
      {/* feedback absolute toast alerts */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-slate-850 px-5 py-3 rounded-2xl flex items-center gap-2.5 shadow-2xl font-sans text-xs animate-bounce">
          <CheckCircle2 size={15} className="text-teal-400 shrink-0" />
          <span className="font-semibold">{feedbackToast}</span>
        </div>
      )}

      {/* ADMIN TITLE BANNER CONTAINER */}
      <div className="border-b border-slate-150 pb-5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs">
        <div className="flex gap-3.5 items-center">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-md">
            <Sliders size={22} className="text-teal-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-teal-650 font-black uppercase tracking-wider block font-mono">
              {t.level}
            </span>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              {t.title}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {t.subtitle}: <strong className="font-mono text-teal-700">{currentUserEmail}</strong> • Active Regional Suffix: <span className="font-mono text-slate-800 font-bold">[{selectedCurrency}]</span>
            </p>
          </div>
        </div>

        {/* Global Action Handlers */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setActiveLanguage("en")} 
              className={`px-2 py-1 text-[10px] font-bold rounded-lg ${activeLanguage === "en" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-500 hover:text-slate-900"}`}
            >
              EN
            </button>
            <button 
              onClick={() => setActiveLanguage("sw")} 
              className={`px-2 py-1 text-[10px] font-bold rounded-lg ${activeLanguage === "sw" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-500 hover:text-slate-900"}`}
            >
              SW
            </button>
            <button 
              onClick={() => setActiveLanguage("lg")} 
              className={`px-2 py-1 text-[10px] font-bold rounded-lg ${activeLanguage === "lg" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-500 hover:text-slate-900"}`}
            >
              LG
            </button>
            <button 
              onClick={() => setActiveLanguage("fr")} 
              className={`px-2 py-1 text-[10px] font-bold rounded-lg ${activeLanguage === "fr" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-500 hover:text-slate-900"}`}
            >
              FR
            </button>
          </div>

          <button
            onClick={() => {
              setOptTemp("26.5");
              setTargetPH("7.2");
              setMaxAmmonia("0.05");
              setTargetSalinity("5.0");
              addSystemLog("SYSTEM", "Restored system standard threshold calibrations", "Warning");
              triggerToast("FAO Baselines restored.");
              saveCalibrations("26.5", "7.2", "0.05", "5.0");
            }}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 active:scale-95 transition flex items-center gap-1.5 font-sans"
          >
            <RefreshCw size={12} />
            Reset
          </button>
          
          <button
            onClick={onSignOut}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-750 text-white font-extrabold text-xs rounded-xl shadow-3xs transition-all active:scale-95 cursor-pointer font-sans"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* CORE SYSTMEM NAVIGATION SELECTORS (MATCHES USER REQUEST) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-900/40">
        
        <button
          onClick={() => setActiveTab("admin_panel")}
          className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition cursor-pointer select-none ${
            activeTab === "admin_panel"
              ? "bg-slate-900 text-white shadow-md border-b-2 border-teal-400"
              : "text-slate-400 hover:text-white hover:bg-slate-900/50"
          }`}
        >
          <Building size={14} className="text-teal-400" />
          <span>{t.adminPanel}</span>
        </button>

        <button
          onClick={() => setActiveTab("audit_logs")}
          className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition cursor-pointer select-none ${
            activeTab === "audit_logs"
              ? "bg-slate-900 text-white shadow-md border-b-2 border-teal-400"
              : "text-slate-400 hover:text-white hover:bg-slate-900/50"
          }`}
        >
          <History size={14} className="text-violet-400" />
          <span>{t.auditLogs}</span>
        </button>

        <button
          onClick={() => setActiveTab("advanced_features")}
          className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition cursor-pointer select-none ${
            activeTab === "advanced_features"
              ? "bg-slate-900 text-white shadow-md border-b-2 border-teal-400"
              : "text-slate-400 hover:text-white hover:bg-slate-900/50"
          }`}
        >
          <Sparkles size={14} className="text-amber-400" />
          <span>{t.advFeatures}</span>
        </button>

      </div>

      {/* TAB CONTENT 1: ADMIN PANEL */}
      {activeTab === "admin_panel" && (
        <div className="space-y-6">
          
          {/* Sub Navigation */}
          <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-1.5">
            <button
              onClick={() => setAdminPanelSubTab("users")}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide shrink-0 transition ${
                adminPanelSubTab === "users" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-505 text-slate-500 hover:text-slate-900"
              }`}
            >
              👥 User Management
            </button>
            <button
              onClick={() => setAdminPanelSubTab("content")}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide shrink-0 transition ${
                adminPanelSubTab === "content" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              📝 Content Management
            </button>
            <button
              onClick={() => setAdminPanelSubTab("system")}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide shrink-0 transition ${
                adminPanelSubTab === "system" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              📈 System Monitoring
            </button>
          </div>

          {/* A. USER MANAGEMENT VIEW */}
          {adminPanelSubTab === "users" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-3xs animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900">👥 Standard Authorized Profile Registry</h3>
                  <p className="text-xs text-slate-500">Decommission credentials, restructure operational permission groups, or audit staff levels instantly.</p>
                </div>
                <button
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl flex items-center gap-1.5 transition select-none cursor-pointer"
                >
                  <Plus size={13} />
                  Authorize Staff Account
                </button>
              </div>

              {/* Search input bar */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter name, email logins, or clearance roles..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 hover:border-slate-350 select-none pl-9 pr-4 py-2 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              {/* Staff table */}
              <div className="overflow-x-auto rounded-xl border border-slate-150">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-wider border-b border-slate-150">
                      <th className="p-3 font-mono">STAFF IDENTIFIER</th>
                      <th className="p-3">ROLE CLEARANCE</th>
                      <th className="p-3">CREDENTIAL STATUS</th>
                      <th className="p-3">LAST ACTIVE TIMESTAMP</th>
                      <th className="p-3 text-right">LEDGER COMMANDS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                    {filteredUsers.map((user, idx) => {
                      const isEditing = editingUserEmail === user.email;
                      return (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3">
                            {isEditing ? (
                              <div className="space-y-1 max-w-xs">
                                <label className="block text-[9px] text-slate-400 font-extrabold uppercase">Full Name</label>
                                <input
                                  type="text"
                                  value={editUserName}
                                  onChange={(e) => setEditUserName(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded p-1 text-xs font-bold focus:outline-none"
                                />
                                <span className="text-[10px] font-mono text-slate-400 font-bold block">{user.email}</span>
                                <label className="block text-[9px] text-slate-400 font-extrabold uppercase mt-1">Password</label>
                                <input
                                  type="text"
                                  value={editUserPassword}
                                  onChange={(e) => setEditUserPassword(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded p-1 text-[11px] font-mono focus:outline-none"
                                  placeholder="Enter password"
                                />
                                <div className="mt-1 p-1.5 bg-slate-50 border border-slate-150 rounded text-[9.5px] space-y-0.5 max-w-xs">
                                  <div className="flex flex-wrap gap-x-2 gap-y-0.5 font-bold">
                                    <span className={editUserPassword.length >= 8 ? "text-emerald-600" : "text-rose-500"}>
                                      ✓ Min 8 chars ({editUserPassword.length})
                                    </span>
                                    <span className={/[a-z]/.test(editUserPassword) ? "text-emerald-600" : "text-rose-500"}>
                                      ✓ abc (lower)
                                    </span>
                                    <span className={/[A-Z]/.test(editUserPassword) ? "text-emerald-600" : "text-rose-500"}>
                                      ✓ ABC (upper)
                                    </span>
                                    <span className={/[0-9]/.test(editUserPassword) ? "text-emerald-600" : "text-rose-500"}>
                                      ✓ 123 (digit)
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2.5">
                                {user.email === "inno@executive.com" ? (
                                  <img 
                                    src="/marcelo_ceo.jpg" 
                                    alt="Mercelo Peter Okoya" 
                                    className="w-8 h-8 rounded-full object-cover border border-emerald-500/30"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200/50 flex items-center justify-center text-xs font-black text-slate-500 shrink-0">
                                    {user.name ? user.name.charAt(0) : "U"}
                                  </div>
                                )}
                                <div>
                                  <span className="font-extrabold text-slate-900 block">{user.name}</span>
                                  <span className="text-[10px] font-mono text-slate-500 font-bold">{user.email}</span>
                                  {user.password && (
                                    <span className="text-[9.5px] font-mono text-indigo-600 block mt-0.5" title="Login Password">
                                      🔑 <span className="font-bold select-all bg-indigo-50 px-1 py-0.5 rounded">{user.password}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </td>

                          <td className="p-3">
                            {isEditing ? (
                              <select
                                value={editUserRole}
                                onChange={(e) => setEditUserRole(e.target.value)}
                                className="bg-white border border-slate-200 text-slate-700 rounded-lg text-[10.5px] font-bold p-1 cursor-pointer focus:outline-none"
                              >
                                <option value="Admin">Admin</option>
                                <option value="Manager">Manager</option>
                                <option value="Executive">Executive</option>
                                <option value="Finance">Finance</option>
                                <option value="Customer">Customer</option>
                                <option value="Marketer">Marketer</option>
                              </select>
                            ) : (
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.email, e.target.value)}
                                className="bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[10.5px] font-bold py-1 px-2 cursor-pointer focus:outline-none"
                              >
                                <option value="Admin">Admin</option>
                                <option value="Manager">Manager</option>
                                <option value="Executive">Executive</option>
                                <option value="Finance">Finance</option>
                                <option value="Customer">Customer</option>
                                <option value="Marketer">Marketer</option>
                              </select>
                            )}
                          </td>

                          <td className="p-3">
                            <button
                              onClick={() => handleToggleUserStatus(user.email)}
                              className={`px-3 py-1 font-black text-[10px] uppercase rounded-full border transition cursor-pointer leading-none ${
                                user.status === "Active"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                              }`}
                            >
                              {user.status === "Active" ? "● AUTHORIOUS ACTIVE" : "✖ DEACTIVATED STATUS"}
                            </button>
                          </td>

                          <td className="p-3 text-[11px] font-mono text-slate-500">{user.lastActive}</td>

                          <td className="p-3 text-right">
                            {isEditing ? (
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => handleSaveEdit(user)}
                                  className="p-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10.5px] font-black transition cursor-pointer"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingUserEmail(null)}
                                  className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10.5px] font-black transition cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => handleStartEdit(user)}
                                  className="p-1 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-[10.5px] font-black transition cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.email)}
                                  disabled={!canRevokeUser(user)}
                                  className="p-1 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10.5px] font-black transition cursor-pointer disabled:opacity-20"
                                >
                                  Revoke
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* B. CONTENT MANAGEMENT VIEW */}
          {adminPanelSubTab === "content" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-3xs animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900">📝 Standard Guidebooks &amp; Broadcast Announcements</h3>
                  <p className="text-xs text-slate-500">Edit or draft informational standard operations manuals that dispatch across local consoles instantly.</p>
                </div>
                <button
                  onClick={() => setIsAddArticleModalOpen(true)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl flex items-center gap-1.5 transition select-none cursor-pointer"
                >
                  <Plus size={13} />
                  Assemble New Advisory
                </button>
              </div>

              {/* Items grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto">
                {contentArticles.map((art) => (
                  <div key={art.id} className="border border-slate-200 p-4 bg-slate-55/40 bg-slate-50/50 hover:bg-slate-50 rounded-2xl flex flex-col justify-between hover:shadow-3xs transition relative group">
                    <button
                      onClick={() => handleDeleteArticle(art.id)}
                      className="absolute top-3 right-3 p-1 bg-white hover:bg-rose-50 border border-slate-100 rounded-lg text-slate-400 hover:text-rose-600 transition"
                      title="Decommission biological advisory manual"
                    >
                      <Trash2 size={12} />
                    </button>

                    <div className="space-y-2">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[9.5px] font-mono font-black uppercase tracking-wider ${
                        art.category === "Advisory" ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-sky-100/85 text-sky-850 bg-sky-50 text-sky-700"
                      }`}>
                        {art.category}
                      </span>
                      <h4 className="font-black text-slate-900 text-xs tracking-tight line-clamp-2 pr-4">{art.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed font-sans line-clamp-3">
                        "{art.snippet}"
                      </p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-slate-200/60 flex justify-between text-[10px] text-slate-400 font-mono font-bold">
                      <span>By: {art.author.split("@")[0]}</span>
                      <span>Config: {art.dateCreated}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* C. SYSTEM MONITORING VIEW */}
          {adminPanelSubTab === "system" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-6 shadow-3xs animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900">📈 Live Performance Diagnostics &amp; Standard Calibration Sliders</h3>
                <p className="text-xs text-slate-500">Monitor thread utilization speeds, local databases storage quotas, and align legal thresholds.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Sliders settings */}
                <div className="space-y-4 bg-slate-50/60 border border-slate-200/80 p-4 rounded-xl">
                  <h4 className="text-[10.5px] uppercase font-black tracking-wide text-slate-505 block text-slate-550 border-b border-slate-200 pb-2">
                    FAO Legal Standard Boundary Baselines
                  </h4>

                  {/* pH Parameter Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[10.5px] text-slate-600">
                      <span className="font-bold">Target Standard pH</span>
                      <span className="font-black text-teal-700">{targetPH} pH</span>
                    </div>
                    <input
                      type="range"
                      min="5.5"
                      max="9.0"
                      step="0.1"
                      value={targetPH}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTargetPH(val);
                        addSystemLog("SYSTEM", `Calibrated pH standard boundary to ${val}`, "Info");
                        saveCalibrations(optTemp, val, maxAmmonia, targetSalinity);
                      }}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-650"
                    />
                  </div>

                  {/* Temp parameter slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[10.5px] text-slate-600">
                      <span className="font-bold">Optimal Water Temp</span>
                      <span className="font-black text-teal-700">{optTemp}°{tempUnit}</span>
                    </div>
                    <input
                      type="range"
                      min="20.0"
                      max="32.0"
                      step="0.5"
                      value={optTemp}
                      onChange={(e) => {
                        const val = e.target.value;
                        setOptTemp(val);
                        addSystemLog("SYSTEM", `Calibrated temperature baseline target boundary to ${val}°C`, "Info");
                        saveCalibrations(val, targetPH, maxAmmonia, targetSalinity);
                      }}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-650"
                    />
                  </div>

                  {/* Ammonia slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[10.5px] text-slate-600">
                      <span className="font-bold">Max Ammonia (NH₃) limit</span>
                      <span className="font-black text-rose-700">{maxAmmonia} mg/L</span>
                    </div>
                    <input
                      type="range"
                      min="0.01"
                      max="0.20"
                      step="0.01"
                      value={maxAmmonia}
                      onChange={(e) => {
                        const val = e.target.value;
                        setMaxAmmonia(val);
                        addSystemLog("SYSTEM", `Set baseline Ammonia toxicity alert standard boundary to ${val} mg/L`, "Warning");
                        saveCalibrations(optTemp, targetPH, val, targetSalinity);
                      }}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-650"
                    />
                  </div>

                  {/* Salinity Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[10.5px] text-slate-600">
                      <span className="font-bold">Base Salinity Level</span>
                      <span className="font-black text-teal-700">{targetSalinity} ppt</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="15.0"
                      step="0.5"
                      value={targetSalinity}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTargetSalinity(val);
                        addSystemLog("SYSTEM", `Calibrated baseline Salinity standard boundary to ${val} ppt`, "Info");
                        saveCalibrations(optTemp, targetPH, maxAmmonia, val);
                      }}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-650"
                    />
                  </div>
                </div>

                {/* Simulated Server Resource Graphs */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between border border-slate-805">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block font-mono">Simulated Processor Core</span>
                        <span className="text-xl font-mono font-black text-teal-400">{simulatedDiagnostics.cpuUsage}%</span>
                      </div>
                      <Cpu size={26} className="text-teal-400 animate-spin-slow" />
                    </div>

                    <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between border border-slate-805">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block font-mono">Virtual Heap Allocation</span>
                        <span className="text-xl font-mono font-black text-violet-400">{simulatedDiagnostics.memoryUsage}%</span>
                      </div>
                      <HardDrive size={26} className="text-violet-400" />
                    </div>
                  </div>

                  {/* Latency interactive graph */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <span className="text-[10px] uppercase font-mono font-black text-slate-455 block mb-2 text-slate-400">
                      Container Sync Loop Latency Response Index (ms)
                    </span>
                    <div className="h-40 w-full text-[10px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceMonitoringChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip contentStyle={{ fontSize: '10.5px' }} />
                          <Area type="monotone" dataKey="cpu" name="CPU utilization %" stroke="#0d9488" strokeWidth={1} fill="#14b8a6" fillOpacity={0.12} />
                          <Area type="monotone" dataKey="latency" name="Latency Index (ms)" stroke="#8b5cf6" strokeWidth={1.5} fill="#a78bfa" fillOpacity={0.06} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT 2: AUDIT LOGS */}
      {activeTab === "audit_logs" && (
        <div className="space-y-6">
          
          <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-1.5">
            <button
              onClick={() => setAuditLogsSubTab("activity")}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide shrink-0 transition ${
                auditLogsSubTab === "activity" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              🔄 Activity Tracking Stream
            </button>
            <button
              onClick={() => setAuditLogsSubTab("history")}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide shrink-0 transition ${
                auditLogsSubTab === "history" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              🕰️ User Action History Ledger
            </button>
          </div>

          {/* Activity Logs stream view */}
          {auditLogsSubTab === "activity" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-3xs animate-in fade-in duration-200 font-sans">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900">🔄 Live Container Telemetry Stream</h3>
                  <p className="text-xs text-slate-500">Chronological transaction logs generated automatically by edge controllers and cloud sync channels.</p>
                </div>

                <div className="flex gap-2">
                  <select
                    value={logFilterCategory}
                    onChange={(e) => setLogFilterCategory(e.target.value as any)}
                    className="bg-white border border-slate-250 hover:border-slate-350 rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer transition select-none"
                  >
                    <option value="All">All Streams</option>
                    <option value="AUTH">Authentication</option>
                    <option value="DATABASE">Database Mirroring</option>
                    <option value="SENSORS">Sensor Signals</option>
                    <option value="SECURITY">Security Warnings</option>
                  </select>

                  <button
                    onClick={handleExportAuditLogs}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center gap-1 text-[11px] font-black cursor-pointer select-none transition"
                  >
                    <FileDown size={12} />
                    <span>CSV Export</span>
                  </button>
                </div>
              </div>

              {/* Terminal list container */}
              <div className="bg-slate-900 border border-slate-950 p-4 rounded-xl text-emerald-400 font-mono text-xs space-y-2 h-96 overflow-y-auto select-none leading-relaxed">
                {systemActivityLogs
                  .filter(log => logFilterCategory === "All" || log.module === logFilterCategory)
                  .map((log) => (
                    <div key={log.id} className="border-b border-slate-805 pb-2 last:border-0">
                      <div className="flex flex-wrap items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-semibold">{log.timestamp}</span>
                          <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-black font-sans uppercase tracking-wider ${
                            log.severity === "Critical" ? "bg-red-950 text-red-400" : log.severity === "Warning" ? "bg-amber-950 text-amber-400" : "bg-teal-950 text-emerald-355"
                          }`}>
                            {log.module}
                          </span>
                        </div>
                        <span className="text-slate-500 font-sans text-[10.5px]">ID: {log.id}</span>
                      </div>
                      <p className="text-slate-100 font-sans text-[11.5px] mt-1">
                        Operator <span className="font-mono text-emerald-300 font-bold">{log.user}</span> triggered: "{log.action}"
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* User action history view */}
          {auditLogsSubTab === "history" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-3xs animate-in fade-in duration-200 font-sans">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900">🕰️ User Action History &amp; Responsibility Ledger</h3>
                <p className="text-xs text-slate-500">Detailed security audit ledger indexing explicit manual changes authorized by specific authenticated staff emails.</p>
              </div>

              <div className="bg-slate-50/70 border border-slate-150 rounded-xl overflow-hidden divide-y divide-slate-150">
                {userActionsHistory.map((act) => (
                  <div key={act.id} className="p-3.5 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[10.5px] text-slate-400 font-bold">[{act.id}]</span>
                        <span className="font-black text-slate-900">{act.detail}</span>
                      </div>
                      <p className="text-[11px] text-slate-450 font-semibold uppercase">
                        Authorized staff profile: <span className="text-slate-700 font-black">{act.staff}</span> ({act.role})
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-[10.5px] text-slate-500 bg-white border border-slate-200 rounded px-2 py-0.5 shadow-3xs font-bold">
                      {act.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT 3: ADVANCED FEATURES */}
      {activeTab === "advanced_features" && (
        <div className="space-y-6">
          
          <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-1.5">
            <button
              onClick={() => setAdvancedSubTab("ai_automation")}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide shrink-0 transition ${
                advancedSubTab === "ai_automation" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-505 text-slate-500 hover:text-slate-900"
              }`}
            >
              🤖 AI &amp; Automation Workflows
            </button>
            <button
              onClick={() => setAdvancedSubTab("supabase_portal")}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide shrink-0 transition ${
                advancedSubTab === "supabase_portal" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-520 text-slate-500 hover:text-slate-900"
              }`}
            >
              ⚡ Supabase Cloud Portal
            </button>
            <button
              onClick={() => setAdvancedSubTab("multi_language")}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide shrink-0 transition ${
                advancedSubTab === "multi_language" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-520 text-slate-500 hover:text-slate-900"
              }`}
            >
              🗺️ Multi-Language Support
            </button>
          </div>

          {/* D. AI & AUTOMATION VIEW */}
          {advancedSubTab === "ai_automation" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
              
              {/* Interactive AI Chatbot panel */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs space-y-4 flex flex-col h-[460px]">
                <div className="border-b border-slate-100 pb-2 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500">🤖</span>
                    <h4 className="text-xs font-black uppercase text-slate-900">
                      {t.chatbotTitle}
                    </h4>
                  </div>
                  <span className="text-[9.5px] font-mono font-black uppercase bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded animate-pulse">
                    ACTIVE COMPANION
                  </span>
                </div>

                {/* Messages scroll content */}
                <div className="flex-1 overflow-y-auto space-y-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-150 text-[11.5px] font-sans">
                  {chatbotMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`p-3 max-w-[85%] rounded-2xl ${
                        msg.sender === "user" 
                          ? "bg-slate-900 text-white font-semibold" 
                          : "bg-white border border-slate-200 text-slate-800 leading-relaxed font-semibold shadow-3xs"
                      }`}>
                        {msg.sender === "ai" && <span className="font-bold text-[10.5px] text-amber-600 uppercase block mb-1">Aquacop_V1_CoPlot</span>}
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {isAiAnswering && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-3xs flex items-center gap-2 text-slate-400 font-bold">
                        <RefreshCw size={11} className="animate-spin" />
                        <span>Assembling compliance rules...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat input controls */}
                <div className="flex gap-2 shrink-0">
                  <input
                    type="text"
                    placeholder="Ask standard limits, spawning efficiency formulas, or water conversion guides..."
                    value={userChatInput}
                    onChange={(e) => setUserChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                    className="flex-1 bg-slate-50 border border-slate-250 p-2.5 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-800"
                  />
                  <button
                    onClick={handleSendChat}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center transition cursor-pointer select-none"
                  >
                    <Send size={13} className="stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Predictive graphs & Automated workflows */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Automated workflows logs */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 shadow-3xs">
                  <h4 className="text-[10.5px] uppercase font-black tracking-wide text-slate-505 block text-slate-550 border-b border-slate-150 pb-2">
                    ⚡ Autonomous Workflow Telemetry Rules
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2bg-slate-50 border border-slate-150 p-2 rounded-lg bg-slate-50">
                      <div>
                        <span className="font-extrabold text-slate-850 block">Auto-cool high temp standard &gt; 28°C</span>
                        <p className="text-[9.5px] text-slate-450 mt-0.5">Launches chamber B auxiliary water sprayers autonomously</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={workflowAutoCooling} 
                        onChange={() => {
                          setWorkflowAutoCooling(!workflowAutoCooling);
                          addSystemLog("AI", `${!workflowAutoCooling ? "Enabled" : "Disabled"} auto-cooling triggers`, "Warning");
                        }} 
                        className="w-4 h-4 cursor-pointer accent-teal-650" 
                      />
                    </div>

                    <div className="flex items-center justify-between p-2bg-slate-50 border border-slate-150 p-2 rounded-lg bg-slate-50">
                      <div>
                        <span className="font-extrabold text-slate-850 block">Dispatch WhatsApp Advisory on critical Ammonia</span>
                        <p className="text-[9.5px] text-slate-450 mt-0.5">Notifies manager Stephen Okello via biosecurity gateway</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={workflowSMSOnAmmonia} 
                        onChange={() => {
                          setWorkflowSMSOnAmmonia(!workflowSMSOnAmmonia);
                          addSystemLog("AI", `${!workflowSMSOnAmmonia ? "Enabled" : "Disabled"} automated SMS dispatching`, "Warning");
                        }} 
                        className="w-4 h-4 cursor-pointer accent-teal-650" 
                      />
                    </div>

                    <div className="flex items-center justify-between p-2bg-slate-50 border border-slate-150 p-2 rounded-lg bg-slate-50">
                      <div>
                        <span className="font-extrabold text-slate-850 block">Compile system Weekly biosecurity logs</span>
                        <p className="text-[9.5px] text-slate-450 mt-0.5">Assembles PDF reports on Saturday 18:00 UTC automatically</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={workflowWeeklyPDFCompiler} 
                        onChange={() => {
                          setWorkflowWeeklyPDFCompiler(!workflowWeeklyPDFCompiler);
                          addSystemLog("AI", `${!workflowWeeklyPDFCompiler ? "Enabled" : "Disabled"} system PDF task automation`, "Warning");
                        }} 
                        className="w-4 h-4 cursor-pointer accent-teal-650" 
                      />
                    </div>
                  </div>
                </div>

                {/* Recommendations predictive yield */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-3xs">
                  <h4 className="text-[10.5px] uppercase font-black tracking-wide text-slate-400 block mb-2">
                    📈 Predictive Biomass Spawning Yield Curve
                  </h4>
                  <div className="h-32 w-full text-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={predictiveYieldData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="density" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ fontSize: '10px' }} />
                        <Bar dataKey="normalYield" name="Normal Yield %" fill="#94a3b8" />
                        <Bar dataKey="predictedYield" name="AI Predicted Yield %" fill="#d97706" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* E. SUPABASE CLOUD PORTAL VIEW */}
          {advancedSubTab === "supabase_portal" && (
            <div className="space-y-6 font-sans">

              {/* SUPABASE DEPLOYMENT AND MANAGEMENT CONSOLE */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6 shadow-3xs animate-in fade-in duration-250">
                <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Database className="text-emerald-500 w-4 h-4" />
                      ⚡ Supabase PostgreSQL Cloud Integration Portal
                    </h3>
                    <p className="text-xs text-slate-500">
                      Monitor active Supabase backend operations, manage cloud synchronizations, and configure storage bucket assets.
                    </p>
                  </div>

                  <div className="text-xs">
                    {supabaseStatus.configured ? (
                      supabaseStatus.tableExists ? (
                        supabaseStatus.tableError && supabaseStatus.tableError.toLowerCase().includes("permission") ? (
                          <span className="px-2.5 py-1 bg-rose-50 border border-rose-250 text-rose-700 font-black rounded-lg flex items-center gap-1 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            RLS / Permission Blocked
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 font-black rounded-lg flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            Live cloud connected
                          </span>
                        )
                      ) : (
                        <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-600 font-black rounded-lg flex items-center gap-1 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Table Setup Required
                        </span>
                      )
                    ) : (
                      <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 font-black rounded-lg flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Offline Sandbox fallback
                      </span>
                    )}
                  </div>
                </div>

                {/* Supabase Permission Denied (RLS active / lacking GRANT) Banner Notification */}
                {supabaseStatus.configured && supabaseStatus.tableExists && supabaseStatus.tableError && supabaseStatus.tableError.toLowerCase().includes("permission") && (
                  <div className="p-4.5 bg-gradient-to-r from-red-500/10 via-orange-500/5 to-transparent border border-red-250/60 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex gap-3">
                      <div className="p-2.5 bg-rose-100/80 text-rose-800 rounded-xl">
                        <ShieldAlert size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-rose-900 uppercase tracking-wide">⚠️ Row-Level Security (RLS) Permission Denied</h4>
                        <p className="text-[11.5px] text-rose-700/95 mt-1 leading-normal max-w-2xl">
                          The table <code className="bg-rose-150 px-1 py-0.5 rounded text-rose-950 font-bold font-mono">recxpats_records</code> exists, but Row-Level Security is active or the anonymous role lacks access. Run the following SQL query inside your Supabase <strong>SQL Editor</strong> to disable RLS and grant full permissions.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`-- Disable Row-Level Security for offline-first testing
ALTER TABLE recxpats_records DISABLE ROW LEVEL SECURITY;

-- Grant all permissions on table to anonymous/authenticated users
GRANT ALL ON TABLE recxpats_records TO anon;
GRANT ALL ON TABLE recxpats_records TO authenticated;
GRANT ALL ON TABLE recxpats_records TO service_role;`);
                          triggerToast("✓ RLS/Permission SQL copied to clipboard!");
                        }}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-xl transition shadow-xs cursor-pointer select-none active:scale-97"
                      >
                        Copy Grant SQL
                      </button>
                      <button
                        onClick={async () => {
                          await fetchSupabaseStatus();
                          triggerToast("⚡ Rechecking connection and permissions...");
                        }}
                        className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-755 text-[11px] font-bold rounded-xl transition cursor-pointer select-none active:scale-97"
                      >
                        Recheck Status
                      </button>
                    </div>
                  </div>
                )}

                {/* Supabase Missing Table Banner Notification */}
                {supabaseStatus.configured && !supabaseStatus.tableExists && (
                  <div className="p-4.5 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-250/60 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex gap-3">
                      <div className="p-2.5 bg-amber-100/80 text-amber-800 rounded-xl">
                        <ShieldAlert size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-amber-900 uppercase tracking-wide">⚠️ SQL Action Required: Database Table Not Configured</h4>
                        <p className="text-[11.5px] text-amber-700/95 mt-1 leading-normal max-w-2xl">
                          Your credentials are configured, but the target table <code className="bg-amber-150 px-1 py-0.5 rounded text-amber-950 font-bold font-mono">recxpats_records</code> is missing in Supabase. Paste and run the SQL query inside your Supabase <strong>SQL Editor</strong>, and click Recheck.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`CREATE TABLE IF NOT EXISTS recxpats_records (
  id TEXT NOT NULL,
  model TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id, model)
);

-- If table already exists with 'id' as primary key, upgrade it to (id, model)
ALTER TABLE recxpats_records DROP CONSTRAINT IF EXISTS recxpats_records_pkey;
ALTER TABLE recxpats_records ADD PRIMARY KEY (id, model);

-- Disable Row Level Security so the dashboard can insert/select directly
ALTER TABLE recxpats_records DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE recxpats_records TO anon;
GRANT ALL ON TABLE recxpats_records TO authenticated;
GRANT ALL ON TABLE recxpats_records TO service_role;`);
                          triggerToast("✓ SQL Command copied to clipboard!");
                        }}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-xl transition shadow-xs cursor-pointer select-none active:scale-97"
                      >
                        Copy SQL Command
                      </button>
                      <button
                        onClick={async () => {
                          await fetchSupabaseStatus();
                          triggerToast("⚡ Rechecking connection and tables...");
                        }}
                        className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-755 text-[11px] font-bold rounded-xl transition cursor-pointer select-none active:scale-97"
                      >
                        Recheck Table
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Status & Sync Operations */}
                  <div className="space-y-4 lg:col-span-1 bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Telemetry Configuration</span>
                      
                      <div className="mt-3 space-y-2.5 text-xs">
                        <div>
                          <strong className="block text-slate-500 text-[10px]">SUPABASE_URL</strong>
                          <code className="text-[11px] font-mono bg-white border border-slate-200 p-1 rounded block truncate max-w-full text-slate-700">
                            {supabaseConfig.supabaseUrl || "None provided / Placeholder in credentials"}
                          </code>
                        </div>

                        <div>
                          <strong className="block text-slate-500 text-[10px]">ANON_KEY EXPOSURE</strong>
                          <code className="text-[11px] font-mono bg-white border border-slate-200 p-1 rounded block truncate max-w-full text-slate-400">
                            {supabaseConfig.supabaseAnonKey ? "••••••••••••••••" : "Missing key"}
                          </code>
                        </div>
                      </div>

                      <p className="text-[10.5px] mt-4 text-slate-500 leading-normal">
                        To activate, insert <code className="bg-slate-100 px-1 rounded">SUPABASE_URL</code> and <code className="bg-slate-100 px-1 rounded">SUPABASE_ANON_KEY</code> inside the <strong>Secrets Management</strong> menu in the left panel.
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-250">
                      <button
                        onClick={handleSyncToSupabase}
                        disabled={isSyncingToSupabase}
                        className={`w-full py-2 cursor-pointer select-none font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition ${
                          supabaseStatus.configured
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-3xs"
                            : "bg-slate-200 hover:bg-slate-255 text-slate-500 hover:text-slate-700 border border-slate-300"
                        }`}
                      >
                        {isSyncingToSupabase ? (
                          <>
                            <RefreshCw size={13} className="animate-spin" />
                            <span>Migrating Database...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw size={13} />
                            <span>Sync &amp; Mirror offline data</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* SQL Schema Copier */}
                  <div className="lg:col-span-2 space-y-3 bg-slate-900 text-slate-250 p-5 rounded-xl flex flex-col justify-between">
                    <div>
                      {/* Tabs Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-2.5 gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSqlViewTab("table")}
                            className={`px-3 py-1 text-[10.5px] font-mono font-bold tracking-wide uppercase rounded-md transition cursor-pointer ${
                              sqlViewTab === "table"
                                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                            }`}
                          >
                            📁 records table SQL
                          </button>
                          <button
                            onClick={() => setSqlViewTab("users")}
                            className={`px-3 py-1 text-[10.5px] font-mono font-bold tracking-wide uppercase rounded-md transition cursor-pointer ${
                              sqlViewTab === "users"
                                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                            }`}
                          >
                            👤 create users SQL
                          </button>
                        </div>
                        
                        <button
                          onClick={() => {
                            if (sqlViewTab === "table") {
                              navigator.clipboard.writeText(`CREATE TABLE IF NOT EXISTS recxpats_records (
  id TEXT NOT NULL,
  model TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id, model)
);

-- If table already exists with 'id' as primary key, upgrade it to (id, model)
ALTER TABLE recxpats_records DROP CONSTRAINT IF EXISTS recxpats_records_pkey;
ALTER TABLE recxpats_records ADD PRIMARY KEY (id, model);

-- Disable Row Level Security so the dashboard can insert/select directly
ALTER TABLE recxpats_records DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE recxpats_records TO anon;
GRANT ALL ON TABLE recxpats_records TO authenticated;
GRANT ALL ON TABLE recxpats_records TO service_role;`);
                              triggerToast("✓ Table SQL copied to clipboard!");
                            } else {
                              navigator.clipboard.writeText(`-- 1. Enable pgcrypto extension if not already done
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Create the user creation utility helper function
CREATE OR REPLACE FUNCTION create_supabase_user(
  user_email TEXT,
  user_password TEXT,
  full_name TEXT,
  user_role TEXT
) RETURNS VOID AS $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  encrypted_pass TEXT;
BEGIN
  encrypted_pass := crypt(user_password, gen_salt('bf', 10));

  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role,
    aud,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    user_email,
    encrypted_pass,
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    json_build_object('full_name', full_name, 'role', user_role)::jsonb,
    CASE WHEN user_role = 'Admin' OR user_email = 'recxpats@gmail.com' THEN TRUE ELSE FALSE END,
    'authenticated',
    'authenticated',
    '',
    '',
    '',
    ''
  ) ON CONFLICT (email) DO NOTHING;

  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    new_user_id,
    json_build_object('sub', new_user_id, 'email', user_email)::jsonb,
    'email',
    NOW(),
    NOW(),
    NOW()
  ) ON CONFLICT (provider, id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- 3. Create initial demo/system users in Supabase Auth
SELECT create_supabase_user('okello@manager.com', 'manager123', 'Stephen Okello', 'Manager');
SELECT create_supabase_user('inno@executive.com', 'executive123', 'Mercelo Peter Okoya', 'Executive');
SELECT create_supabase_user('lau@customer.com', 'customer123', 'Ken Lawrence', 'Customer');
SELECT create_supabase_user('ajabi@admin.com', 'admin123', 'Lawrence Ajabi', 'Admin');
SELECT create_supabase_user('restricted-trial@customer.com', 'trial123', 'Trial User', 'Customer');
SELECT create_supabase_user('recxpats@gmail.com', 'Admin@recxpats', 'Recxpats Admin', 'Admin');
SELECT create_supabase_user('lau@finance.com', 'finance123', 'Lau Finance', 'Finance');
SELECT create_supabase_user('ivan@marketer.com', 'marketer123', 'Ivan Marketer', 'Marketer');`);
                              triggerToast("✓ Users creation SQL copied to clipboard!");
                            }
                          }}
                          className="px-2.5 py-1 bg-white/10 hover:bg-teal-500/30 text-teal-300 hover:text-white rounded text-[10px] font-mono transition cursor-pointer self-start sm:self-auto"
                        >
                          Copy Selected SQL
                        </button>
                      </div>

                      {sqlViewTab === "table" ? (
                        <pre className="text-[11px] font-mono leading-relaxed text-slate-300 overflow-x-auto whitespace-pre p-2 bg-slate-950 rounded border border-white/5 mt-3 select-all max-h-[160px]">
{`CREATE TABLE IF NOT EXISTS recxpats_records (
  id TEXT NOT NULL,
  model TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id, model)
);

-- If table already exists with 'id' as primary key, upgrade it to (id, model)
ALTER TABLE recxpats_records DROP CONSTRAINT IF EXISTS recxpats_records_pkey;
ALTER TABLE recxpats_records ADD PRIMARY KEY (id, model);

-- Disable Row Level Security so the dashboard can insert/select directly
ALTER TABLE recxpats_records DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE recxpats_records TO anon;
GRANT ALL ON TABLE recxpats_records TO authenticated;
GRANT ALL ON TABLE recxpats_records TO service_role;`}
                        </pre>
                      ) : (
                        <pre className="text-[10px] font-mono leading-relaxed text-slate-350 overflow-x-auto whitespace-pre p-2.5 bg-slate-950 rounded border border-white/5 mt-3 select-all max-h-[160px] overflow-y-auto">
{`-- 1. Enable pgcrypto extension if not already done
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Create helper function for Auth User generation
CREATE OR REPLACE FUNCTION create_supabase_user(
  user_email TEXT,
  user_password TEXT,
  full_name TEXT,
  user_role TEXT
) RETURNS VOID AS $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  encrypted_pass TEXT;
BEGIN
  encrypted_pass := crypt(user_password, gen_salt('bf', 10));

  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000',
    user_email, encrypted_pass, NOW(), NOW(), NOW(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    json_build_object('full_name', full_name, 'role', user_role)::jsonb,
    CASE WHEN user_role = 'Admin' OR user_email = 'recxpats@gmail.com' THEN TRUE ELSE FALSE END,
    'authenticated', 'authenticated'
  ) ON CONFLICT (email) DO NOTHING;

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    new_user_id, new_user_id,
    json_build_object('sub', new_user_id, 'email', user_email)::jsonb,
    'email', NOW(), NOW(), NOW()
  ) ON CONFLICT (provider, id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- 3. Insert system credentials (instantly log in via dashboard)
SELECT create_supabase_user('okello@manager.com', 'manager123', 'Stephen Okello', 'Manager');
SELECT create_supabase_user('inno@executive.com', 'executive123', 'Mercelo Peter Okoya', 'Executive');
SELECT create_supabase_user('lau@customer.com', 'customer123', 'Ken Lawrence', 'Customer');
SELECT create_supabase_user('ajabi@admin.com', 'admin123', 'Lawrence Ajabi', 'Admin');
SELECT create_supabase_user('restricted-trial@customer.com', 'trial123', 'Trial User', 'Customer');
SELECT create_supabase_user('recxpats@gmail.com', 'Admin@recxpats', 'Recxpats Admin', 'Admin');
SELECT create_supabase_user('lau@finance.com', 'finance123', 'Lau Finance', 'Finance');
SELECT create_supabase_user('ivan@marketer.com', 'marketer123', 'Ivan Marketer', 'Marketer');`}
                        </pre>
                      )}
                    </div>

                    <div className="mt-3 text-[11px] text-slate-400 leading-normal">
                      💡 <strong>Instructions:</strong> Open your <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-teal-400 underline hover:text-teal-300">Supabase Console</a>, click on the <strong>SQL Editor</strong> tab, paste the selected commands, and click <strong>Run</strong>. They will instantly reflect and enable secure authentications.
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* F. MULTI-LANGUAGE SUPPORT VIEW */}
          {advancedSubTab === "multi_language" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6 shadow-3xs animate-in fade-in duration-200 font-sans">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900">🗺️ Dynamic Localization &amp; Regional Parameters Converter</h3>
                <p className="text-xs text-slate-500">Configure global currency parameters, local thermal units of measure, and default synchronized timezones.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Languages selectors */}
                <div className="space-y-4">
                  <span className="text-[10.5px] uppercase font-mono font-black text-slate-550 block text-slate-500">
                    {t.languageTitle}
                  </span>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <button
                      onClick={() => {
                        setActiveLanguage("en");
                        addSystemLog("SYSTEM", "Switched console dialect interface to English (EN)", "Info");
                        triggerToast("Active language: English");
                      }}
                      className={`p-4 border rounded-xl text-left font-black flex items-center justify-between transition cursor-pointer ${
                        activeLanguage === "en" ? "border-slate-800 bg-slate-50 shadow-3xs text-slate-900" : "border-slate-200 hover:border-slate-300 text-slate-600"
                      }`}
                    >
                      <span>🇺🇸 English (Default)</span>
                      {activeLanguage === "en" && <span className="text-emerald-500">●</span>}
                    </button>

                    <button
                      onClick={() => {
                        setActiveLanguage("sw");
                        addSystemLog("SYSTEM", "Switched console dialect interface to Swahili (SW)", "Info");
                        triggerToast("Lugha inayofanya kazi: Kiswahili");
                      }}
                      className={`p-4 border rounded-xl text-left font-black flex items-center justify-between transition cursor-pointer ${
                        activeLanguage === "sw" ? "border-slate-800 bg-slate-50 shadow-3xs text-slate-900" : "border-slate-200 hover:border-slate-300 text-slate-600"
                      }`}
                    >
                      <span>🇺🇬 Kiswahili (East Africa)</span>
                      {activeLanguage === "sw" && <span className="text-emerald-500">●</span>}
                    </button>

                    <button
                      onClick={() => {
                        setActiveLanguage("lg");
                        addSystemLog("SYSTEM", "Switched console dialect interface to Luganda (LG)", "Info");
                        triggerToast("Olulimi olukolebwaako: Luganda");
                      }}
                      className={`p-4 border rounded-xl text-left font-black flex items-center justify-between transition cursor-pointer ${
                        activeLanguage === "lg" ? "border-slate-800 bg-slate-50 shadow-3xs text-slate-900" : "border-slate-200 hover:border-slate-300 text-slate-600"
                      }`}
                    >
                      <span>🇺🇬 Luganda (Central region)</span>
                      {activeLanguage === "lg" && <span className="text-emerald-500">●</span>}
                    </button>

                    <button
                      onClick={() => {
                        setActiveLanguage("fr");
                        addSystemLog("SYSTEM", "Switched console dialect interface to French (FR)", "Info");
                        triggerToast("Langue active: Français");
                      }}
                      className={`p-4 border rounded-xl text-left font-black flex items-center justify-between transition cursor-pointer ${
                        activeLanguage === "fr" ? "border-slate-800 bg-slate-50 shadow-3xs text-slate-900" : "border-slate-200 hover:border-slate-300 text-slate-600"
                      }`}
                    >
                      <span>🇫🇷 Français (French)</span>
                      {activeLanguage === "fr" && <span className="text-emerald-500">●</span>}
                    </button>
                  </div>
                </div>

                {/* Regional Units calibration converters */}
                <div className="space-y-4">
                  <span className="text-[10.5px] uppercase font-mono font-black text-slate-550 block text-slate-500">
                    Regional currency &amp; Thermal metric offsets
                  </span>

                  <div className="bg-slate-55 bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-4 text-xs font-semibold text-slate-700">
                    {/* Currency */}
                    <div className="flex items-center justify-between">
                      <span>{t.currencyTitle}</span>
                      <select
                        value={selectedCurrency}
                        onChange={(e) => {
                          setSelectedCurrency(e.target.value as any);
                          triggerToast(`Currency scale set to: ${e.target.value}`);
                        }}
                        className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-extrabold cursor-pointer"
                      >
                        <option value="UGX">UGX (shs Kampala)</option>
                        <option value="KES">KES (Kshs Nairobi)</option>
                        <option value="USD">USD (United States Dollar)</option>
                        <option value="EUR">EUR (Euro Currency)</option>
                      </select>
                    </div>

                    {/* Temp conversion target metric */}
                    <div className="flex items-center justify-between">
                      <span>{t.tempTitle}</span>
                      <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => setTempUnit("C")}
                          className={`px-3 py-1 font-black ${tempUnit === "C" ? "bg-slate-900 text-white" : "text-slate-500"}`}
                        >
                          Celsius (°C)
                        </button>
                        <button
                          onClick={() => {
                            setTempUnit("F");
                            triggerToast("Fahrenheit measurements calibrated.");
                          }}
                          className={`px-3 py-1 font-black ${tempUnit === "F" ? "bg-slate-900 text-white" : "text-slate-500"}`}
                        >
                          Fahrenheit (°F)
                        </button>
                      </div>
                    </div>

                    {/* Weight units */}
                    <div className="flex items-center justify-between">
                      <span>Inventory biomass weight metrics</span>
                      <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => setWeightUnit("kg")}
                          className={`px-3 py-1 font-black ${weightUnit === "kg" ? "bg-slate-900 text-white" : "text-slate-500"}`}
                        >
                          Kilograms (Kgs)
                        </button>
                        <button
                          onClick={() => {
                            setWeightUnit("lbs");
                            triggerToast("Pound measurements calibrated.");
                          }}
                          className={`px-3 py-1 font-black ${weightUnit === "lbs" ? "bg-slate-900 text-white" : "text-slate-500"}`}
                        >
                          Pounds (Lbs)
                        </button>
                      </div>
                    </div>

                    {/* Clock timezone */}
                    <div className="flex flex-col gap-1.5 border-t border-slate-200/80 pt-3">
                      <span>{t.timezoneTitle}</span>
                      <select
                        value={selectedTimezone}
                        onChange={(e) => {
                          setSelectedTimezone(e.target.value);
                          triggerToast(`Active server time set to timezone: ${e.target.value.split(" ")[0]}`);
                        }}
                        className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-mono font-bold cursor-pointer"
                      >
                        <option value="Africa/Kampala (EAT - UTC+3)">Africa/Kampala (EAT - UTC+3)</option>
                        <option value="Africa/Nairobi (EAT - UTC+3)">Africa/Nairobi (EAT - UTC+3)</option>
                        <option value="Europe/London (GMT/BST - UTC+1)">Europe/London (GMT/BST - UTC+1)</option>
                        <option value="America/New_York (EST/EDT - UTC-4)">America/New_York (EST/EDT - UTC-4)</option>
                      </select>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* COMPONENT MODALS WINDOW FOR REGISTERING NEW STAFF MEMBERS */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
          <form onSubmit={handleCreateUserSubmit} className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-xs font-black text-slate-805 text-slate-900">👥 Authorize New Staff Account</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Grants bio-clearances instantly</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-705">
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Full Legal Corporate Name*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Arthur Pendelton"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-bold bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Corporate Email Address*</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. pendelton@recxpats.io"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-bold bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Default Login Password*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. securePass123"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-bold bg-white focus:outline-none"
                />
                <div className="mt-1.5 p-2 bg-slate-50 border border-slate-150 rounded-xl space-y-1 text-[10px] font-semibold">
                  <span className="text-[9px] uppercase font-extrabold text-slate-500 block mb-0.5">Password Standard Guidelines</span>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                    <span className={`flex items-center gap-1 ${newUserPassword.length >= 8 ? "text-emerald-600" : "text-rose-500"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${newUserPassword.length >= 8 ? "bg-emerald-500" : "bg-rose-400 animate-pulse"}`} />
                      Min 8 chars ({newUserPassword.length}/8)
                    </span>
                    <span className={`flex items-center gap-1 ${/[a-z]/.test(newUserPassword) ? "text-emerald-600" : "text-rose-500"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(newUserPassword) ? "bg-emerald-500" : "bg-rose-400 animate-pulse"}`} />
                      One lowercase (a-z)
                    </span>
                    <span className={`flex items-center gap-1 ${/[A-Z]/.test(newUserPassword) ? "text-emerald-600" : "text-rose-500"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(newUserPassword) ? "bg-emerald-500" : "bg-rose-400 animate-pulse"}`} />
                      One uppercase (A-Z)
                    </span>
                    <span className={`flex items-center gap-1 ${/[0-9]/.test(newUserPassword) ? "text-emerald-600" : "text-rose-500"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(newUserPassword) ? "bg-emerald-500" : "bg-rose-400 animate-pulse"}`} />
                      One digit (0-9)
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Security Group Role Clearance</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-bold bg-white cursor-pointer"
                >
                  <option value="Admin">Admin (Console Calibration)</option>
                  <option value="Manager">Manager (Operational Matrix)</option>
                  <option value="Executive">Executive (Finance &amp; Audit Logs)</option>
                  <option value="Finance">Finance (Revenue &amp; Invoices Ledger)</option>
                  <option value="Customer">Customer (Read-Only access)</option>
                  <option value="Marketer">Marketer (Marketplace &amp; Portal Coordination)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl"
              >
                ✕ {t.cancelBtn}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-3xs"
              >
                ✓ {t.saveBtn}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* COMPONENT MODALS WINDOW FOR CREATING CONTENT ADVISORIES */}
      {isAddArticleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
          <form onSubmit={handleCreateArticleSubmit} className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-xs font-black text-slate-900">📝 Assemble New Advisory Manual Snippet</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Publishes immediately to manual feeds</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddArticleModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-705">
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Advisory Title / Caption*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Critical Water pH Threshold Alert standard"
                  value={newArtTitle}
                  onChange={(e) => setNewArtTitle(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-bold bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Category Group</label>
                  <select
                    value={newArtCategory}
                    onChange={(e) => setNewArtCategory(e.target.value as any)}
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-bold bg-white cursor-pointer focus:outline-none"
                  >
                    <option value="Annoncement">Annoncement</option>
                    <option value="Advisory">Advisory</option>
                    <option value="Feeding Standard">Feeding Standard</option>
                    <option value="FAO Manual">FAO Manual</option>
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Author Clearance</label>
                  <input
                    type="text"
                    readOnly
                    value={currentUserEmail.split("@")[0]}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-mono font-bold text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Content Snippet Instructions*</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Insert the exact biosecurity instructions, formulas, or standard regulations here..."
                  value={newArtSnippet}
                  onChange={(e) => setNewArtSnippet(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-semibold bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setIsAddArticleModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl"
              >
                ✕ {t.cancelBtn}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-3xs"
              >
                ✓ Mount Content
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
