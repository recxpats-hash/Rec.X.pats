/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Droplets, 
  Settings, 
  Warehouse, 
  Heart, 
  Sparkles, 
  Grid, 
  ShieldAlert, 
  FileText, 
  Users, 
  ArrowRight,
  Lock,
  Mail,
  User,
  Check,
  Zap,
  Globe,
  Github,
  BarChart3,
  TrendingUp,
  Award,
  HelpCircle,
  Thermometer,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkle,
  Eye,
  EyeOff,
  Menu,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getSupabaseClient } from "../lib/supabaseClient";
import AppLogo from "./AppLogo";
import BackgroundWatermark from "./BackgroundWatermark";
import InstallMobileApp from "./InstallMobileApp";

const DEFAULT_USERS = [
  { id: "usr-1", email: "okello@manager.com", name: "Stephen Okello", role: "Manager", status: "Active", lastActive: "6 mins ago", password: "manager123" },
  { id: "usr-2", email: "inno@executive.com", name: "Mercelo Peter Okoya", role: "Executive", status: "Active", lastActive: "Just now", password: "executive123" },
  { id: "usr-3", email: "lau@customer.com", name: "Ken Lawrence", role: "Customer", status: "Active", lastActive: "4 hours ago", password: "customer123" },
  { id: "usr-4", email: "ajabi@admin.com", name: "Lawrence Ajabi", role: "Admin", status: "Active", lastActive: "Just now", password: "admin123" },
  { id: "usr-5", email: "restricted-trial@customer.com", name: "Trial User", role: "Customer", status: "Suspended", lastActive: "2 weeks ago", password: "trial123" },
  { id: "usr-6", email: "recxpats@gmail.com", name: "Recxpats Admin", role: "Admin", password: "Admin@recxpats", status: "Active", lastActive: "Never logged" },
  { id: "usr-7", email: "lau@finance.com", name: "Lau Finance", role: "Finance", password: "finance123", status: "Active", lastActive: "Never logged" },
  { id: "usr-8", email: "ivan@marketer.com", name: "Ivan Marketer", role: "Marketer", password: "marketer123", status: "Active", lastActive: "Never logged" }
];

interface LandingPageProps {
  onSignInSuccess: (email: string, role: 'manager' | 'finance' | 'admin' | 'executive' | 'customer' | 'marketer') => void;
  userProfiles?: any[];
  dbLoaded?: boolean;
  onReloadDatabase?: () => Promise<void>;
  deviceFormat?: "desktop" | "android";
  sessionExpiredMsg?: string | null;
}

export default function LandingPage({ 
  onSignInSuccess, 
  userProfiles = [], 
  dbLoaded = false, 
  onReloadDatabase, 
  deviceFormat = "desktop",
  sessionExpiredMsg = null
}: LandingPageProps) {
  // Modal / Sign In Card visibility state
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    if (sessionExpiredMsg) {
      setIsAuthOpen(true);
      setAuthMode("signin");
    }
  }, [sessionExpiredMsg]);
  const [isMobileWalkthroughOpen, setIsMobileWalkthroughOpen] = useState(false);
  const [isFeaturesDropdownOpen, setIsFeaturesDropdownOpen] = useState(false);
  // Toggle between "signin" and "signup" inside the card
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  // Toggle role selection
  const [selectedRole, setSelectedRole] = useState<"operator" | "customer">("operator");
  
  // Local state for credentials form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneMode, setPhoneMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showPopupBlockedWarning, setShowPopupBlockedWarning] = useState(false);

  // Pricing Interval State
  const [isAnnual, setIsAnnual] = useState(true);

  // SHOWCASE MOCK DASHBOARD STATES
  const [activeKpi, setActiveKpi] = useState<"population" | "breeding" | "hatchRate" | "waterQuality" | "feed">("population");
  // Simulated parameters
  const [waterTemp, setWaterTemp] = useState(26.4);
  const [waterDO, setWaterDO] = useState(6.8); // Dissolved Oxygen
  const [waterPh, setWaterPh] = useState(7.3);
  const [simulatedSpike, setSimulatedSpike] = useState(false);

  // Handle auto role-detection on typing email
  useEffect(() => {
    if (authMode === "signup") {
      setSelectedRole("customer");
    }
  }, [authMode]);



  const handleEmailChange = (val: string) => {
    setEmail(val);
    const lower = val.toLowerCase().trim();
    
    let matchedRole: string | null = null;
    try {
      const usersMap = new Map();
      DEFAULT_USERS.forEach((u: any) => usersMap.set(u.email.toLowerCase().trim(), u));
      if (userProfiles && userProfiles.length > 0) {
        userProfiles.forEach((u: any) => {
          if (u && u.email) {
            usersMap.set(u.email.toLowerCase().trim(), u);
          }
        });
      }
      const users = Array.from(usersMap.values());
      if (users.length > 0) {
        const match = users.find((u: any) => u.email.toLowerCase().trim() === lower);
        if (match) {
          matchedRole = match.role.toLowerCase();
        }
      }
    } catch (e) {
      console.error(e);
    }

    const role = matchedRole || (
      (lower === "recxpats@gmail.com" || lower.endsWith("@admin.com") || lower.includes("@admin.com")) ? "admin" :
      (lower === "ivan@marketer.com" || lower.endsWith("@marketer.com")) ? "marketer" :
      (lower.endsWith("@finance.com") || lower === "lau@finance.com") ? "finance" :
      (lower.endsWith("@executive.com") || lower === "inno@executive.com") ? "executive" :
      (lower.endsWith("@manager.com") || lower === "okello@manager.com") ? "manager" :
      "customer"
    );

    if (role === "customer") {
      setSelectedRole("customer");
    } else {
      setSelectedRole("operator");
    }
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (phoneMode) {
      if (!phoneNumber || phoneNumber.trim().length < 8) {
        setErrorMsg("Please enter a valid phone number.");
        return;
      }
      if (!otpCode || otpCode.trim().length < 4) {
        setErrorMsg("Please enter the 4-digit verification code sent to your mobile phone.");
        return;
      }
      setIsSubmitting(true);
      fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim(), otpCode: otpCode.trim() })
      })
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            setIsSubmitting(false);
            alert(`✓ Phone Verification Succeeded! Authorized session loaded.`);
            onSignInSuccess(data.email, data.role);
          } else {
            const errData = await res.json();
            throw new Error(errData.error || "Failed to verify phone OTP.");
          }
        })
        .catch((err: any) => {
          setIsSubmitting(false);
          setErrorMsg(err.message || "Network error. Please try again.");
        });
      return;
    }

    if (!email) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (authMode === "signup") {
      const isMinLength = password.length >= 8;
      const hasLower = /[a-z]/.test(password);
      const hasUpper = /[A-Z]/.test(password);
      const hasDigit = /[0-9]/.test(password);
      if (!isMinLength || !hasLower || !hasUpper || !hasDigit) {
        setErrorMsg("Your password does not meet the guidelines. It must have at least 8 characters, one lowercase letter, one uppercase letter, and one number.");
        return;
      }
    } else {
      if (!password || password.length < 5) {
        setErrorMsg("Password must be at least 5 characters long.");
        return;
      }
    }
    if (authMode === "signup" && !fullName) {
      setErrorMsg("Please fill in your full name.");
      return;
    }

    setIsSubmitting(true);
    
    const lowerEmail = email.toLowerCase().trim();
    let finalRole: "manager" | "finance" | "admin" | "executive" | "customer" | "marketer" = "customer";
    if (lowerEmail === "recxpats@gmail.com" || lowerEmail.endsWith("@admin.com") || lowerEmail.includes("@admin.com")) {
      finalRole = "admin";
    } else if (lowerEmail === "ivan@marketer.com" || lowerEmail.endsWith("@marketer.com")) {
      finalRole = "marketer";
    } else if (lowerEmail.endsWith("@finance.com") || lowerEmail === "lau@finance.com") {
      finalRole = "finance";
    } else if (lowerEmail.endsWith("@executive.com") || lowerEmail === "inno@executive.com") {
      finalRole = "executive";
    } else if (lowerEmail.endsWith("@manager.com") || lowerEmail === "okello@manager.com") {
      finalRole = "manager";
    } else if (lowerEmail.endsWith("@customer.com") || lowerEmail === "lau@customer.com") {
      finalRole = "customer";
    }

    // Restriction: all user accounts except customers are supposed to be created by admin
    if (authMode === "signup" && finalRole !== "customer") {
      setErrorMsg("Only customer accounts can be self-created. All other roles (Manager, Finance, Admin, Executive, Marketer) must be created by the system Administrator.");
      setIsSubmitting(false);
      return;
    }

    // Verify custom admin-created accounts
    let matchingLocalUser: any = null;
    try {
      const usersMap = new Map();
      DEFAULT_USERS.forEach((u: any) => usersMap.set(u.email.toLowerCase().trim(), u));
      if (userProfiles && userProfiles.length > 0) {
        userProfiles.forEach((u: any) => {
          if (u && u.email) {
            usersMap.set(u.email.toLowerCase().trim(), u);
          }
        });
      }
      const users = Array.from(usersMap.values());
      matchingLocalUser = users.find((u: any) => u.email.toLowerCase().trim() === lowerEmail);
    } catch (e) {
      console.error("Failed to load users for validation", e);
    }

    if (authMode === "signup" && matchingLocalUser) {
      setErrorMsg("An account with this email address already exists. Please sign in instead.");
      setIsSubmitting(false);
      return;
    }

    if (authMode === "signin") {
      if (!matchingLocalUser) {
        setErrorMsg("This account does not exist. If you are a customer, please register / sign up first. Other roles must be created by an Administrator.");
        setIsSubmitting(false);
        return;
      }
      if (matchingLocalUser.status === "Suspended") {
        setErrorMsg("This account has been suspended by the Administrator.");
        setIsSubmitting(false);
        return;
      }
      if (matchingLocalUser.password && matchingLocalUser.password !== password) {
        setErrorMsg("Incorrect password.");
        setIsSubmitting(false);
        return;
      }
      const roleToUse = (matchingLocalUser.role || "customer").toLowerCase() as any;
      setIsSubmitting(false);
      alert(`💡 RecXpats Authorization Succeeded!\n\nAccess granted for account "${email}" as "${roleToUse.toUpperCase()}".`);
      onSignInSuccess(email, roleToUse);
      return;
    }

    const executeAuth = async () => {
      try {
        const client = await getSupabaseClient();
        if (client) {
          if (authMode === "signup") {
            const { data, error } = await client.auth.signUp({
              email,
              password,
              options: {
                data: {
                  full_name: fullName,
                  role: finalRole
                }
              }
            });
            if (error) {
              const details = error.message || (typeof error === 'object' && error !== null ? (error.message || JSON.stringify(error)) : String(error));
              const finalDetails = details === '{}' ? 'Check Supabase SQL table setup and SMTP email confirmation settings' : details;
              console.warn("Supabase signUp failed, falling back to local signup:", finalDetails);
              
              // Inform user of the configuration status but register them locally to prevent blocking their flow
              alert(`💡 Supabase Sign-Up Note: ${finalDetails}\n\nTo ensure your progress is not blocked, we have registered your account locally in our high-fidelity offline-first cache so you can proceed immediately!`);
              
              const newUserObj = {
                email: email.toLowerCase().trim(),
                name: fullName,
                role: finalRole.charAt(0).toUpperCase() + finalRole.slice(1),
                status: "Active",
                password,
                lastActive: "Just registered"
              };

              // Register their user profile row in our central database via backend
              try {
                await fetch("/api/data/userProfiles", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(newUserObj)
                });
                if (onReloadDatabase) {
                  await onReloadDatabase();
                }
              } catch (errProfile) {
                console.error("Failed to automatically record user profile in central database:", errProfile);
              }

              setIsSubmitting(false);
              onSignInSuccess(email, finalRole);
              return;
            }
            alert("✓ Registration successful in Supabase! If email confirmation is required, check your inbox. Authorizing access...");
            
            const newUserObj = {
              email: email.toLowerCase().trim(),
              name: fullName,
              role: finalRole.charAt(0).toUpperCase() + finalRole.slice(1),
              status: "Active",
              password,
              lastActive: "Just registered"
            };

            // Register their user profile row in our central database via backend
            try {
              await fetch("/api/data/userProfiles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUserObj)
              });
              if (onReloadDatabase) {
                await onReloadDatabase();
              }
            } catch (errProfile) {
              console.error("Failed to automatically record user profile in central database:", errProfile);
            }

            setIsSubmitting(false);
            onSignInSuccess(email, finalRole);
          } else {
            const { data, error } = await client.auth.signInWithPassword({
              email,
              password
            });
            if (error) {
              // Handle "Email not confirmed" or "Invalid login credentials" by letting the user bypass for easy local testing
              const lowerErrMsg = error.message.toLowerCase();
              const isDemoAccount = 
                lowerEmail === "recxpats@gmail.com" ||
                lowerEmail.endsWith("@admin.com") || 
                lowerEmail.includes("@admin.com") ||
                lowerEmail.endsWith("@marketer.com") || 
                lowerEmail.includes("@marketer.com") ||
                lowerEmail.endsWith("@finance.com") || 
                lowerEmail.includes("@finance.com") ||
                lowerEmail.endsWith("@manager.com") || 
                lowerEmail.includes("@manager.com") ||
                lowerEmail.endsWith("@executive.com") || 
                lowerEmail.includes("@executive.com") ||
                lowerEmail.endsWith("@customer.com") || 
                lowerEmail.includes("@customer.com") ||
                ["okello@manager.com", "lau@customer.com", "lau@finance.com", "inno@executive.com", "ajabi@admin.com", "ivan@marketer.com", "recxpats@gmail.com"].includes(lowerEmail);

              if (isDemoAccount) {
                console.warn("Supabase auth failed or pending confirmation but bypassed for testing:", error.message);
                setIsSubmitting(false);
                alert(`💡 RecXpats Authorization Succeeded!\n\nAccess granted for account "${email}" as "${finalRole.toUpperCase()}".`);
                onSignInSuccess(email, finalRole);
                return;
              }

              if (lowerErrMsg.includes("confirm") || lowerErrMsg.includes("verification")) {
                console.warn("Supabase email verification is required but bypassed for testing: ", error.message);
                setIsSubmitting(false);
                alert("💡 Supabase Notification: Your email has not been confirmed yet in your Supabase project. To make testing easy, we've authorized your session to proceed!");
                onSignInSuccess(email, finalRole);
                return;
              }
              const details = error.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
              setErrorMsg(`Supabase Sign-In Error: ${details === '{}' ? 'Check credentials and database connection' : details}`);
              setIsSubmitting(false);
              return;
            }
            const userRole = data.user?.user_metadata?.role || finalRole;
            setIsSubmitting(false);
            onSignInSuccess(email, userRole);
          }
        } else {
          // Fallback to local authentication immediately if Supabase is pending setup
          if (authMode === "signup") {
            const newUserObj = {
              email: email.toLowerCase().trim(),
              name: fullName,
              role: finalRole.charAt(0).toUpperCase() + finalRole.slice(1),
              status: "Active",
              password,
              lastActive: "Just registered"
            };

            try {
              await fetch("/api/data/userProfiles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUserObj)
              });
              if (onReloadDatabase) {
                await onReloadDatabase();
              }
            } catch (errProfile) {
              console.error("Failed to automatically record user profile in central database:", errProfile);
            }
          }
          setTimeout(() => {
            setIsSubmitting(false);
            onSignInSuccess(email, finalRole);
          }, 800);
        }
      } catch (err: any) {
        console.warn("Supabase authentication exception, falling back to offline mode:", err);
        if (authMode === "signup") {
          const newUserObj = {
            email: email.toLowerCase().trim(),
            name: fullName,
            role: finalRole.charAt(0).toUpperCase() + finalRole.slice(1),
            status: "Active",
            password,
            lastActive: "Just registered"
          };

          try {
            await fetch("/api/data/userProfiles", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newUserObj)
            });
            if (onReloadDatabase) {
              await onReloadDatabase();
            }
          } catch (errProfile) {
            console.error("Failed to automatically record user profile in central database:", errProfile);
          }
        }
        setTimeout(() => {
          setIsSubmitting(false);
          onSignInSuccess(email, finalRole);
        }, 800);
      }
    };

    executeAuth();
  };

  const handleSocialAuth = (providerName: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSignInSuccess(`partner-${providerName.toLowerCase()}@recxpats.io`, selectedRole);
    }, 750);
  };

  // Helper metrics for the interactive simulator
  useEffect(() => {
    if (simulatedSpike) {
      const interval = setInterval(() => {
        setWaterPh((prev) => {
          const next = prev - 0.15;
          return next <= 5.2 ? 5.2 : parseFloat(next.toFixed(2));
        });
        setWaterDO((prev) => {
          const next = prev - 0.22;
          return next <= 3.1 ? 3.1 : parseFloat(next.toFixed(2));
        });
      }, 300);
      return () => clearInterval(interval);
    } else {
      // recovery
      const interval = setInterval(() => {
        setWaterPh((prev) => {
          if (prev >= 7.3) return 7.3;
          return parseFloat((prev + 0.15).toFixed(2));
        });
        setWaterDO((prev) => {
          if (prev >= 6.8) return 6.8;
          return parseFloat((prev + 0.22).toFixed(2));
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [simulatedSpike]);

  // Pricing models configs
  const prices = {
    starter: isAnnual ? 79 : 99,
    professional: isAnnual ? 199 : 249,
    enterprise: isAnnual ? 479 : 599
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden text-slate-800">
      
      {/* BACKGROUND ACCENTS AND GRIDS (Vercel/Stripe style) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_45%)] pointer-events-none z-0" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-[linear-gradient(to_bottom,rgba(248,251,255,1),rgba(255,255,255,0))] pointer-events-none z-0" />
      
      {/* Center-aligned Brand Watermark */}
      <BackgroundWatermark mode="light" />
      
      {/* Thin elegant architectural grid lines */}
      <div className="absolute top-0 left-[8%] bottom-0 w-[1px] bg-slate-100/50 pointer-events-none hidden lg:block" />
      <div className="absolute top-0 right-[8%] bottom-0 w-[1px] bg-slate-100/50 pointer-events-none hidden lg:block" />

      {/* STICKY HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 shadow-md">
        {/* Desktop Header */}
        <div className="hidden md:flex max-w-7xl mx-auto px-6 py-4 items-center justify-between">
          <div className="flex items-center gap-2.5 group">
            <AppLogo mode="dark" size="sm" />
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Platform Features</a>
            <a href="#showcase" className="hover:text-cyan-400 transition-colors">Platform Tour</a>
            <a href="#benefits" className="hover:text-cyan-400 transition-colors">Our Benefits</a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">Enterprise Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAuthMode("signin");
                setIsAuthOpen(true);
              }}
              className="px-5 py-2 hover:bg-slate-800/80 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700/80 transition-all cursor-pointer"
            >
              Sign In
            </button>

            {/* Features Dropdown replacing Start Free Trial */}
            <div className="relative">
              <button
                onClick={() => setIsFeaturesDropdownOpen(!isFeaturesDropdownOpen)}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700/80 text-cyan-300 hover:text-cyan-200 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
                title="Explore Core Platform Features and Module Overviews"
              >
                <Menu size={14} className="text-cyan-400" />
                <span>Features</span>
                <ChevronDown size={12} className={`text-slate-400 transition-transform duration-200 ${isFeaturesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isFeaturesDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsFeaturesDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2.5 w-72 bg-slate-950 border border-slate-800 rounded-2xl shadow-xl p-4 z-40 text-left"
                    >
                      <h4 className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest mb-3 pb-1 border-b border-slate-900">
                        Operational Modules
                      </h4>
                      <div className="space-y-1">
                        <a
                          href="#features"
                          onClick={() => setIsFeaturesDropdownOpen(false)}
                          className="flex items-start gap-3 p-2 hover:bg-slate-900 rounded-xl transition-colors group"
                        >
                          <span className="text-sm mt-0.5">🧬</span>
                          <div>
                            <h5 className="text-[11px] font-bold text-slate-250 group-hover:text-cyan-350 font-sans">Biosecurity AI Desk</h5>
                            <p className="text-[9px] text-slate-400 leading-tight">Advanced diagnostic telemetry and bio-security diagnostics.</p>
                          </div>
                        </a>
                        <a
                          href="#features"
                          onClick={() => setIsFeaturesDropdownOpen(false)}
                          className="flex items-start gap-3 p-2 hover:bg-slate-900 rounded-xl transition-colors group"
                        >
                          <span className="text-sm mt-0.5">🐟</span>
                          <div>
                            <h5 className="text-[11px] font-bold text-slate-250 group-hover:text-cyan-350 font-sans">Broodstock & Breeding</h5>
                            <p className="text-[9px] text-slate-400 leading-tight">Track genetics, fingerlings, and batch survival rates.</p>
                          </div>
                        </a>
                        <a
                          href="#features"
                          onClick={() => setIsFeaturesDropdownOpen(false)}
                          className="flex items-start gap-3 p-2 hover:bg-slate-900 rounded-xl transition-colors group"
                        >
                          <span className="text-sm mt-0.5">🧪</span>
                          <div>
                            <h5 className="text-[11px] font-bold text-slate-250 group-hover:text-cyan-350 font-sans">Water Quality Analytics</h5>
                            <p className="text-[9px] text-slate-400 leading-tight">Dissolved oxygen, temperature, and pH tracking.</p>
                          </div>
                        </a>
                        <a
                          href="#features"
                          onClick={() => setIsFeaturesDropdownOpen(false)}
                          className="flex items-start gap-3 p-2 hover:bg-slate-900 rounded-xl transition-colors group"
                        >
                          <span className="text-sm mt-0.5">📊</span>
                          <div>
                            <h5 className="text-[11px] font-bold text-slate-250 group-hover:text-cyan-350 font-sans">Executive Director Desk</h5>
                            <p className="text-[9px] text-slate-400 leading-tight">Financial ledgers, forecasting, and LPO/invoice matching.</p>
                          </div>
                        </a>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Header: Centered Sign In Button & Recommended Quick Actions Row */}
        <div className="flex md:hidden flex-col items-stretch px-4 py-3 gap-2.5">
          {/* Top Row: Left App Logo, Center Sign In Button, Right App walkthrough trigger */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center shrink-0">
              <AppLogo mode="dark" size="sm" />
            </div>
            
            {/* Centered Sign In button */}
            <div className="flex-1 flex justify-center">
              <button
                onClick={() => {
                  setAuthMode("signin");
                  setIsAuthOpen(true);
                }}
                className="px-5 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs rounded-full shadow-md active:scale-95 transition-all border border-cyan-400/20"
              >
                Sign In
              </button>
            </div>

            {/* Symmetric empty spacer to keep the sign in button perfectly centered */}
            <div className="w-[52px]" />
          </div>

          {/* Quick Action bar: Pre-auth quick entry points */}
          <div className="flex flex-col gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[8px] text-cyan-400 font-extrabold uppercase tracking-widest text-center block mb-1">
              ⚡ RECOMMENDED MOBILE QUICK ACTIONS
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1">
              <button
                onClick={() => onSignInSuccess("ajabi@admin.com", "admin")}
                className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-[9.5px] text-rose-300 font-extrabold rounded-md border border-rose-950/40 transition-colors"
                title="Log in as Administrator"
              >
                Admin
              </button>
              <button
                onClick={() => onSignInSuccess("okello@manager.com", "manager")}
                className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-[9.5px] text-emerald-300 font-extrabold rounded-md border border-emerald-950/40 transition-colors"
                title="Log in as Manager"
              >
                Manager
              </button>
              <button
                onClick={() => onSignInSuccess("inno@executive.com", "executive")}
                className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-[9.5px] text-yellow-300 font-extrabold rounded-md border border-yellow-950/40 transition-colors"
                title="Log in as Executive"
              >
                Exec
              </button>
              <button
                onClick={() => onSignInSuccess("lau@finance.com", "finance")}
                className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-[9.5px] text-cyan-300 font-extrabold rounded-md border border-cyan-950/40 transition-colors"
                title="Log in as Finance Officer"
              >
                Finance
              </button>
              <button
                onClick={() => onSignInSuccess("lau@customer.com", "customer")}
                className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-[9.5px] text-purple-300 font-extrabold rounded-md border border-purple-950/40 transition-colors"
                title="Log in as Customer"
              >
                Cust
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* HERO LEFT CONTENT */}
            <div className="lg:col-span-6 flex flex-col gap-6 text-left">
              {/* Product Badge */}
              <div className="inline-flex self-start items-center gap-1.5 bg-blue-50/80 border border-blue-100 text-blue-700 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <Sparkle size={10} className="text-blue-500 fill-blue-500" />
                <span>Modern Commercial Fish Farm OS</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.05] font-sans">
                Transform Your Fish Farm Into an <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-605 to-sky-500">Operation</span>
              </h1>
              
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal max-w-xl">
                Manage broodstock, breeding, eggs, larvae, fingerlings, water quality, inventory, production, and analytics from one powerful, beautiful platform built to Stripe and Linear precision standards.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => {
                    setAuthMode("signup");
                    setIsAuthOpen(true);
                  }}
                  className="px-7 py-3 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/10 flex items-center gap-2 cursor-pointer transition-all transform hover:-translate-y-0.5"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight size={13} strokeWidth={2.5} />
                </button>
                
                <a
                  href="#showcase"
                  className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-2 transition-all shadow-xs"
                >
                  <Play size={11} className="text-blue-600 fill-blue-600" />
                  <span>Watch System Demo</span>
                </a>
              </div>

              {/* Security Badges */}
              <div className="pt-6 mt-4 border-t border-slate-100 flex flex-wrap items-center gap-x-8 gap-y-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Bio-Security Standards</span>
                  <div className="flex gap-4 mt-1.5 text-slate-600 font-bold text-xs">
                    <span className="flex items-center gap-1">🛡️ FAO Compliant</span>
                    <span className="flex items-center gap-1">🔬 Level 4 Protocols</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-100 hidden sm:block" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Advanced Integration</span>
                  <div className="flex gap-4 mt-1.5 text-slate-600 font-bold text-xs">
                    <span className="flex items-center gap-1">💡 AI Diagnostics</span>
                    <span className="flex items-center gap-1">🔗 On-Chain Traceability</span>
                  </div>
                </div>
              </div>
            </div>

            {/* HERO RIGHT VISUAL SCREEN */}
            <div className="lg:col-span-6 relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-sky-400 to-blue-500 opacity-10 blur-3xl rounded-full" />
              
              {/* Floating Dashboard Card visualizer */}
              <div className="relative bg-white border border-slate-100 rounded-2xl shadow-2xl p-4 sm:p-5 select-none overflow-hidden max-w-lg mx-auto transform transition-all hover:scale-[1.01] duration-300">
                
                {/* Visual grid header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/50">FISH_FARM_OS_PRIMARY</span>
                </div>

                <div className="space-y-3">
                  
                  {/* Metric 1 */}
                  <div className="bg-gradient-to-r from-blue-50/40 to-indigo-50/20 border border-blue-50/80 rounded-xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600 text-white rounded-lg">
                        <Thermometer size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Bio-Incubator A-1</span>
                        <span className="text-xs font-black text-slate-800">Water Temperature control</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono font-black text-blue-700 block">26.8°C</span>
                      <span className="text-[8px] font-extrabold text-emerald-500 uppercase bg-emerald-50 border border-emerald-100/60 px-1.5 py-0.2 rounded">OPTIMAL</span>
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="bg-white border border-slate-100 rounded-xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sky-100 text-[#0EA5E9] rounded-lg">
                        <Droplets size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Dissolved Oxygen Sensor</span>
                        <span className="text-xs font-black text-slate-800">Critical Oxygenation tracking</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono font-black text-sky-600 block">6.4 mg/L</span>
                      <span className="text-[8px] font-extrabold text-[#2563EB] bg-blue-50 border border-blue-100/60 px-1.5 py-0.2 rounded">HEALTHY</span>
                    </div>
                  </div>

                  {/* Micro simulated spawn tracking */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#F8FBFF] border border-slate-100 rounded-xl p-3">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Egg Spawning Log</span>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-base font-black text-slate-800 tracking-tight">48,000</span>
                        <span className="text-[10px] text-slate-400">incubated</span>
                      </div>
                      <span className="text-[8.5px] text-blue-600 font-bold mt-1.5 block">Hatch success forecast: 95.8%</span>
                    </div>

                    <div className="bg-[#F8FBFF] border border-slate-100 rounded-xl p-3">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Larval Biomass</span>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-base font-black text-slate-800 tracking-tight">435 Kg</span>
                        <span className="text-[10px] text-emerald-500 font-bold">+12%</span>
                      </div>
                      <span className="text-[8.5px] text-slate-400/80 font-bold mt-1.5 block">Estimated fry count: 20k+</span>
                    </div>
                  </div>

                  {/* Progress log and diagnostics */}
                  <div className="border border-slate-150 rounded-xl p-3 bg-white shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Active Fish Farm Diagnostics</span>
                      <span className="text-[8px] text-[#2563EB] font-black tracking-wider uppercase flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" /> Live Advisory
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal italic">
                      "Incubation water exchange completed safely. pH level stable. No risk vectors detected."
                    </p>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TRUST SECTION (Large figures, stats) */}
      <section className="bg-slate-50/50 border-y border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div className="space-y-1">
              <span className="text-3xl md:text-4.5xl font-black text-slate-900 block tracking-tight font-sans">
                150+
              </span>
              <span className="text-[10px] md:text-xs text-[#2563EB] uppercase font-black block tracking-widest leading-none">
                Hatcheries Managed
              </span>
              <p className="text-[10.5px] text-slate-400 mt-1">Globally deployment stats</p>
            </div>

            <div className="space-y-1">
              <span className="text-3xl md:text-4.5xl font-black text-slate-900 block tracking-tight font-sans">
                24M+
              </span>
              <span className="text-[10px] md:text-xs text-[#2563EB] uppercase font-black block tracking-widest leading-none">
                Fish Produced
              </span>
              <p className="text-[10.5px] text-slate-400 mt-1">Broodstock descendants logged</p>
            </div>

            <div className="space-y-1">
              <span className="text-3xl md:text-4.5xl font-black text-slate-900 block tracking-tight font-sans">
                12,000+
              </span>
              <span className="text-[10px] md:text-xs text-[#2563EB] uppercase font-black block tracking-widest leading-none">
                Active Users
              </span>
              <p className="text-[10.5px] text-slate-400 mt-1">Supervisors & operators</p>
            </div>

            <div className="space-y-1">
              <span className="text-3xl md:text-4.5xl font-black text-[#2563EB] block tracking-tight font-sans">
                99.8%
              </span>
              <span className="text-[10px] md:text-xs text-slate-900 uppercase font-black block tracking-widest leading-none">
                Success Rates
              </span>
              <p className="text-[10.5px] text-slate-400 mt-1">Egg-fertilization safety metric</p>
            </div>

          </div>
        </div>
      </section>



      {/* 3. PLATFORM FEATURES SECTION (Bento and clean grids) */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-600 font-extrabold text-[11px] uppercase tracking-widest block mb-1">
              Engineered Precision
            </span>
            <h2 className="text-3xl md:text-4.5xl font-black text-slate-900 tracking-tight leading-none mb-4">
              Pillars of Fish Farm Excellence
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Designed dynamically to automate early life stages care, trace origins, and manage biological risks effortlessly.
            </p>
          </div>

          {deviceFormat !== "android" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Broodstock Management */}
            <div className="p-6 bg-[#F8FBFF]/80 border border-slate-100 hover:border-blue-100 rounded-2xl flex flex-col gap-4 hover:shadow-lg transition-all">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg inline-flex self-start">
                <Heart size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Broodstock Management</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-normal">
                  Track mature breeding stock performance, map gene lines, and monitor active weight scales.
                </p>
              </div>
              <ul className="text-[11px] text-slate-500 space-y-1 mt-auto pt-3 border-t border-slate-50/80">
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-blue-500" /> Active parent breeders counting
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-blue-500" /> Female extraction indexes
                </li>
              </ul>
            </div>

            {/* Card 2: Breeding & Spawning */}
            <div className="p-6 bg-[#F8FBFF]/80 border border-slate-100 hover:border-blue-100 rounded-2xl flex flex-col gap-4 hover:shadow-lg transition-all font-sans">
              <div className="p-2.5 bg-sky-50 text-sky-600 rounded-lg inline-flex self-start">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Breeding & Spawning</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-normal">
                  Manage hormone schedules (OvaPrim dosages), spawning tank status triggers, and egg appearance checks.
                </p>
              </div>
              <ul className="text-[11px] text-slate-500 space-y-1 mt-auto pt-3 border-t border-slate-50/80">
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-sky-500" /> Hormone timer alarms
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-sky-500" /> Stripping progress tracking
                </li>
              </ul>
            </div>

            {/* Card 3: Egg Incubation */}
            <div className="p-6 bg-[#F8FBFF]/80 border border-slate-100 hover:border-blue-100 rounded-2xl flex flex-col gap-4 hover:shadow-lg transition-all">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg inline-flex self-start">
                <Layers size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Egg Incubation</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-normal">
                  Audit hatch rates, calculate total initial egg output weights (g), and log sterilization treatments.
                </p>
              </div>
              <ul className="text-[11px] text-slate-500 space-y-1 mt-auto pt-3 border-t border-slate-50/80">
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-indigo-500" /> Volumetric spawn count logic
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-indigo-500" /> Incubation bottle rotation
                </li>
              </ul>
            </div>

            {/* Card 4: Larval Management */}
            <div className="p-6 bg-[#F8FBFF]/80 border border-slate-100 hover:border-blue-100 rounded-2xl flex flex-col gap-4 hover:shadow-lg transition-all">
              <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-lg inline-flex self-start">
                <Zap size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Larval Management</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-normal">
                  Track yolk-sac absorption runtimes, record daily feeding logs, and log live-feed types (Rotifer, Artemia).
                </p>
              </div>
              <ul className="text-[11px] text-slate-500 space-y-1 mt-auto pt-3 border-t border-slate-50/80">
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-cyan-500" /> Specialized micron feeding
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-cyan-500" /> Shock stress minimization
                </li>
              </ul>
            </div>

            {/* Card 5: Fingerling Management */}
            <div className="p-6 bg-[#F8FBFF]/80 border border-slate-100 hover:border-blue-100 rounded-2xl flex flex-col gap-4 hover:shadow-lg transition-all">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg inline-flex self-start">
                <Grid size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Fingerling Management</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-normal">
                  Oversee transfer timelines, batch grading indices, sorting categories, transport visitor logs, and sales.
                </p>
              </div>
              <ul className="text-[11px] text-emerald-650 space-y-1 mt-auto pt-3 border-t border-slate-50/80">
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" /> Transport logistics audits
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" /> Average biomass index checks
                </li>
              </ul>
            </div>

            {/* Card 6: Water Quality Monitoring */}
            <div className="p-6 bg-[#F8FBFF]/80 border border-slate-100 hover:border-blue-100 rounded-2xl flex flex-col gap-4 hover:shadow-lg transition-all">
              <div className="p-2.5 bg-blue-100 text-blue-800 rounded-lg inline-flex self-start">
                <Droplets size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Water Quality Monitoring</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-normal">
                  Real-time monitoring of Dissolved Oxygen, ammonia levels, nitrite logs, pH metrics, and thermal warnings.
                </p>
              </div>
              <ul className="text-[11px] text-blue-700 space-y-1 mt-auto pt-3 border-t border-slate-50/80 font-semibold">
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-blue-600" /> Immediate warning system alerts
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-blue-600" /> AI-guided chemical adjustment
                </li>
              </ul>
            </div>

            {/* Card 7: Inventory Management */}
            <div className="p-6 bg-[#F8FBFF]/80 border border-slate-100 hover:border-blue-100 rounded-2xl flex flex-col gap-4 hover:shadow-lg transition-all">
              <div className="p-2.5 bg-amber-50 text-amber-605 rounded-lg inline-flex self-start">
                <Warehouse size={18} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Inventory Management</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-normal">
                  Administer feed bags stock levels, reorder threshold alerts, equipment logs, and LPO supplier records.
                </p>
              </div>
              <ul className="text-[11px] text-slate-500 space-y-1 mt-auto pt-3 border-t border-slate-50/80">
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-amber-500" /> Feed bags auto decrement
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-amber-500" /> Supplier ledger link
                </li>
              </ul>
            </div>

            {/* Card 8: Analytics & BI Reports */}
            <div className="p-6 bg-[#F8FBFF]/80 border border-slate-100 hover:border-blue-100 rounded-2xl flex flex-col gap-4 hover:shadow-lg transition-all font-sans">
              <div className="p-2.5 bg-slate-100 text-slate-705 rounded-lg inline-flex self-start">
                <BarChart3 size={18} className="text-slate-700" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Analytics & BI Reports</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-normal">
                  Compile comprehensive P&L profiles, trace compliance, with AI summarizer recommendations.
                </p>
              </div>
              <ul className="text-[11px] text-slate-500 space-y-1 mt-auto pt-3 border-t border-slate-50/80">
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-slate-730" /> Multi-variable BI logs
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-slate-730" /> Financial ratio audits
                </li>
              </ul>
            </div>
          </div>
        )}
        </div>
      </section>

      {deviceFormat !== "android" && (
        <>
          {/* 4. DASHBOARD SHOWCASE (The interactive tour console) */}
          <section id="showcase" className="py-24 bg-[#F8FBFF] border-y border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-600 font-extrabold text-[11px] uppercase tracking-widest block mb-1">
              Live Product Experience
            </span>
            <h2 className="text-3xl md:text-4.5xl font-black text-slate-900 tracking-tight leading-none mb-4 font-sans">
              Interactive Dashboard Showcase
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-normal">
              Click the different operational tabs and metrics to simulate live parameters dynamically. Trigger an biological emergency state to preview the intel reports.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-150 shadow-2xl overflow-hidden font-sans">
            
            {/* Showcase Header Controls */}
            <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <div>
                  <h4 className="text-xs font-black tracking-tight text-white uppercase">RecXpats Commercial Simulator</h4>
                  <span className="text-[9px] text-blue-300 font-mono block uppercase">Active Zone: Nursery Incubation Room A</span>
                </div>
              </div>

              {/* Simulated parameter triggers */}
              <div className="flex items-center flex-wrap gap-3">
                <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 p-1 rounded-lg">
                  <button 
                    onClick={() => setWaterTemp((prev) => parseFloat((prev - 0.5).toFixed(1)))} 
                    className="text-slate-400 hover:text-white hover:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-[9px] font-mono text-cyan-300 font-bold px-1.5">Temp: {waterTemp}°C</span>
                  <button 
                    onClick={() => setWaterTemp((prev) => parseFloat((prev + 0.5).toFixed(1)))} 
                    className="text-slate-400 hover:text-white hover:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => setSimulatedSpike(!simulatedSpike)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    simulatedSpike 
                      ? "bg-rose-650 hover:bg-rose-700 text-white animate-bounce" 
                      : "bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/20"
                  }`}
                >
                  {simulatedSpike ? "⚠️ Reset Water Spike" : "⚡ Simulate Acid Spike"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Show-left: Tabs navigation */}
              <div className="lg:col-span-3 border-r border-slate-100 p-4 bg-slate-50/50">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mb-4 px-2">Operational KPI select</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                  <button
                    onClick={() => { setActiveKpi("population"); setErrorMsg(""); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      activeKpi === "population" 
                        ? "bg-[#2563EB] text-white shadow-xs" 
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>Total Fish Population</span>
                    <span className="text-[9px] font-mono opacity-80">43,500</span>
                  </button>

                  <button
                    onClick={() => { setActiveKpi("breeding"); setErrorMsg(""); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      activeKpi === "breeding" 
                        ? "bg-[#2563EB] text-white shadow-xs" 
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>Active Spawning Tanks</span>
                    <span className="text-[9px] font-mono opacity-80">14 In Use</span>
                  </button>

                  <button
                    onClick={() => { setActiveKpi("hatchRate"); setErrorMsg(""); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      activeKpi === "hatchRate" 
                        ? "bg-[#2563EB] text-white shadow-xs" 
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>Hatch Success Rate</span>
                    <span className="text-[9px] font-mono opacity-80">95.8%</span>
                  </button>

                  <button
                    onClick={() => { setActiveKpi("waterQuality"); setErrorMsg(""); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      activeKpi === "waterQuality" 
                        ? "bg-[#2563EB] text-white shadow-xs" 
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>Water Quality Stats</span>
                    <span className={`text-[9px] font-mono font-black ${simulatedSpike ? "text-rose-500 animate-pulse bg-white rounded px-1" : "opacity-80"}`}>
                      {simulatedSpike ? "CRITICAL" : "OPTIMAL"}
                    </span>
                  </button>

                  <button
                    onClick={() => { setActiveKpi("feed"); setErrorMsg(""); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      activeKpi === "feed" 
                        ? "bg-[#2563EB] text-white shadow-xs" 
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>Feed Inventory Levels</span>
                    <span className="text-[9px] font-mono opacity-80">950 Kg left</span>
                  </button>
                </div>

              </div>

              {/* Show-right: Dynamic visual preview board */}
              <div className="lg:col-span-9 p-6">
                
                {simulatedSpike && (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                      <div className="bg-rose-500 text-white p-2.5 rounded-xl">
                        <AlertTriangle size={18} className="animate-bounce" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-extrabold text-[#7F1D1D] uppercase">High Bio-Security Warning Triggered</h4>
                        <p className="text-[11px] text-red-700 leading-tight">
                          Dissolved Oxygen levels are dropping fast! Live pH has spiked down to {waterPh}. Immediate chemical block neutralizing is crucial.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSimulatedSpike(false)}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-lg uppercase cursor-pointer transition-colors"
                    >
                      Bypass & Normalize
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left column info representation */}
                  <div className="space-y-4 text-left">
                    
                    <div>
                      <span className="text-[10px] text-blue-600 font-extrabold uppercase block tracking-wider mb-0.5">Selected telemetry metrics</span>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        {activeKpi === "population" && "Unified Fingerlings Density Index"}
                        {activeKpi === "breeding" && "Parent Stock Spawning Performance"}
                        {activeKpi === "hatchRate" && "Incubation Cycle Survival Estimates"}
                        {activeKpi === "waterQuality" && "Dissolved DO & pH Chemical Multipliers"}
                        {activeKpi === "feed" && "Premix Alpha Feeding Consumption Forecast"}
                      </h3>
                    </div>

                    <p className="text-slate-500 text-xs leading-relaxed font-normal">
                      {activeKpi === "population" && "Ensuring maximum concrete tank surface utilization. Overstocking causes quick infection transmissions. RecXpats measures volumetric density and logs historical survival curves seamlessly."}
                      {activeKpi === "breeding" && "Allows tracking of female parents weight scales pre-hormone, OvaPrim dosage volume parameters, and logs sperm-egg fertilization hours to predict total incubation survival rates."}
                      {activeKpi === "hatchRate" && "Continuous temperature indexing ensures eggs complete hatching safely. High temperatures reduce cycle runtimes but trigger mutations. Lower temperatures arrest larval absorption."}
                      {activeKpi === "waterQuality" && "Critical biosecurity sensors feed dissolved gas weights directly to our centralized panel. The AI-advisor recommends water flushing or flushing block rates instantly on deviation warnings."}
                      {activeKpi === "feed" && "Dynamically calculates daily required feed per stocking density parameters. Decrements bag counts in our inventory control records and issues reorder warnings automatically."}
                    </p>

                    <div className="p-4 bg-[#F8FBFF] border border-slate-100 rounded-xl space-y-2">
                      <span className="text-[9px] text-[#2563EB] font-bold uppercase tracking-widest block border-b pb-1.5 border-slate-100">AI Diagnostic Assistant Advice</span>
                      <p className="text-[11px] text-slate-650 italic">
                        {activeKpi === "population" && "• Volumetric biomass looks healthy. Recommended grading cycle is scheduled for next Tuesday to separate fast growers."}
                        {activeKpi === "breeding" && "• Broodstock origin NAGRI Male Mirror carp successfully logged. Sperm activity levels audited; high fertilization forecast."}
                        {activeKpi === "hatchRate" && "• Incubation cycle at 26.4°C requires 12 hours remaining for complete hatching. Keep air flow pumps steady."}
                        {activeKpi === "waterQuality" && (simulatedSpike 
                          ? "• Toxic Ammonia/Acid Spike detected! pH decreased below 6.0 safety limits. Recommended corrective action: run a 40% water flush immediately." 
                          : "• Sensor stability is at 98.7% accuracy. Water metrics reside inside optimal boundaries. No manual corrections required.")}
                        {activeKpi === "feed" && "• High Starter Premium Alpha reserves are sufficient to complete the 14-days nursery cycle safely. Reorder is scheduled."}
                      </p>
                    </div>

                  </div>

                  {/* Right column dynamic SVG visual metrics */}
                  <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 flex flex-col justify-between items-stretch">
                    
                    <div className="flex items-center justify-between border-b border-slate-150 pb-3 mb-3">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Live Telemetric Graph</span>
                      <span className="bg-white px-2 py-0.5 rounded text-[8px] font-mono font-bold text-slate-500 uppercase">ACTIVE_PREVIEW</span>
                    </div>

                    {/* Simple dynamic graph based on selected tab */}
                    <div className="h-44 flex items-end justify-between gap-3 text-center pt-2">
                      
                      {activeKpi === "population" && (
                        <>
                          <div className="flex-1 flex flex-col items-center gap-1.5">
                            <div className="w-full bg-blue-105 bg-blue-100 rounded-lg h-24" />
                            <span className="text-[9px] text-slate-400 font-bold">Week 1</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center gap-1.5">
                            <div className="w-full bg-blue-200 rounded-lg h-32 animate-pulse" />
                            <span className="text-[9px] text-slate-400 font-bold">Week 2</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center gap-1.5">
                            <div className="w-full bg-blue-400 rounded-lg h-36" />
                            <span className="text-[9px] text-slate-400 font-bold">Week 3</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center gap-1.5">
                            <div className="w-full bg-[#2563EB] rounded-lg h-40" />
                            <span className="text-[9px] text-slate-950 font-black">Week 4</span>
                          </div>
                        </>
                      )}

                      {activeKpi === "breeding" && (
                        <>
                          <div className="flex-1 flex flex-col items-center gap-1.5">
                            <div className="w-full bg-slate-300 rounded-lg h-16" />
                            <span className="text-[9px] text-slate-400 font-bold">Tank A-1</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center gap-1.5">
                            <div className="w-full bg-[#2563EB] rounded-lg h-36" />
                            <span className="text-[9px] text-slate-950 font-black">Tank B-4</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center gap-1.5">
                            <div className="w-full bg-[#2563EB] rounded-lg h-28" />
                            <span className="text-[9px] text-slate-400 font-bold">Tank C-2</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center gap-1.5">
                            <div className="w-full bg-slate-300 rounded-lg h-20" />
                            <span className="text-[9px] text-slate-400 font-bold">Tank D-9</span>
                          </div>
                        </>
                      )}

                      {activeKpi === "hatchRate" && (
                        <div className="flex-1 flex flex-col items-center justify-center gap-2 h-full">
                          <span className="text-4xl font-black font-mono text-[#2563EB]">95.8%</span>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Average Success Limit</span>
                            <span className="text-[9px] text-emerald-500 font-bold font-mono">+12.4% vs industry benchmarks</span>
                          </div>
                        </div>
                      )}

                      {activeKpi === "waterQuality" && (
                        <div className="flex-1 flex flex-col justify-around h-full text-left gap-1">
                          <div>
                            <span className="text-[9px] text-slate-400 uppercase font-bold block">Dissolved Oxygen (DO)</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="flex-1 bg-slate-200 rounded-full h-2">
                                <div 
                                  className={`rounded-full h-2 transition-all duration-300 ${simulatedSpike ? "bg-red-500 w-[45%]" : "bg-blue-600 w-[94%]"}`} 
                                />
                              </div>
                              <span className="text-xs font-mono font-bold text-slate-700">{waterDO} mg/L</span>
                            </div>
                          </div>

                          <div>
                            <span className="text-[9px] text-slate-400 uppercase font-bold block">Active Rearing pH</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="flex-1 bg-slate-200 rounded-full h-2">
                                <div 
                                  className={`rounded-full h-2 transition-all duration-300 ${simulatedSpike ? "bg-red-500 w-[55%]" : "bg-sky-500 w-[85%]"}`} 
                                />
                              </div>
                              <span className="text-xs font-mono font-bold text-slate-700">{waterPh} ph</span>
                            </div>
                          </div>

                          <div>
                            <span className="text-[9px] text-slate-400 uppercase font-bold block">Chemical Nitrate concentration</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="flex-1 bg-slate-200 rounded-full h-2">
                                <div 
                                  className={`rounded-full h-2 transition-all duration-300 ${simulatedSpike ? "bg-red-600 w-[95%]" : "bg-emerald-500 w-[20%]"}`} 
                                />
                              </div>
                              <span className="text-xs font-mono font-bold text-slate-700">{simulatedSpike ? "7.0 mg/L" : "0.1 mg/L"}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeKpi === "feed" && (
                        <div className="flex-1 flex flex-col justify-center items-center gap-2 h-full text-center">
                          <span className="text-3xl font-black font-mono text-slate-800">950 Kg</span>
                          <span className="text-[9px] text-amber-600 font-black bg-amber-50 border border-amber-100/50 px-2 py-0.5 rounded-full uppercase">
                            Safety reserves ok
                          </span>
                          <span className="text-[9px] text-slate-400">Next auto decrement schedule: 4 hours</span>
                        </div>
                      )}

                    </div>

                    <div className="border-t border-slate-150 pt-3.5 mt-4 text-center">
                      <span className="text-[9px] text-slate-400 font-bold block">Dynamic simulation synced successfully with localized guidelines.</span>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. BENEFITS SECTION (Why choose RecXpats) */}
      <section id="benefits" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 text-left space-y-6">
              <span className="text-blue-600 font-extrabold text-[11px] uppercase tracking-widest block mb-1">
                Value proposition
              </span>
              <h2 className="text-3xl md:text-4.5xl font-black text-slate-900 tracking-tight leading-none font-sans">
                Uncompromising Quality Built For Enterprise Growth
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed font-normal">
                Whether managing small nurseries or large commercial tilapia, carp, and shrimp arrays, RecXpats provides rigid guardrails to minimize biological mortalities and elevate financial yields.
              </p>

              <div className="p-5 bg-[#F8FBFF] border border-slate-100 rounded-2xl flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase">Awwwards-Level Precision Design</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Designed precisely to prevent interface fatigue for managers on-site during stressful emergency incidents.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              
              <div className="space-y-2 p-5 bg-slate-50 border border-slate-100/85 rounded-2xl">
                <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  ✓
                </div>
                <h3 className="text-xs font-black text-slate-900 uppercase">Increased Productivity</h3>
                <p className="text-[11.5px] text-slate-500 leading-normal">
                  Reduces manual reporting log times by 85%. Managers capture spawning, feeds, and visitor counts in one simple workflow.
                </p>
              </div>

              <div className="space-y-2 p-5 bg-slate-50 border border-slate-100/85 rounded-2xl">
                <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  ✓
                </div>
                <h3 className="text-xs font-black text-slate-900 uppercase">Better Hatch Rates</h3>
                <p className="text-[11.5px] text-slate-500 leading-normal">
                  Our temperature indexing, chemical alarms, and biological guidelines prevent standard incubation failures.
                </p>
              </div>

              <div className="space-y-2 p-5 bg-slate-50 border border-slate-100/85 rounded-2xl font-sans">
                <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  ✓
                </div>
                <h3 className="text-xs font-black text-slate-900 uppercase">Reduced Losses</h3>
                <p className="text-[11.5px] text-slate-500 leading-normal">
                  Live biosecurity checks keep supervisors in alignment with critical FAO procedures, preventing standard infections.
                </p>
              </div>

              <div className="space-y-2 p-5 bg-slate-50 border border-slate-100/85 rounded-2xl">
                <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  ✓
                </div>
                <h3 className="text-xs font-black text-slate-900 uppercase">On-Chain Traceability</h3>
                <p className="text-[11.5px] text-slate-500 leading-normal">
                  Enables rapid export compliance tagging. Generate digital QR codes linked with our immutable water quality tests and feed origins.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION (High-contrast professional layouts - Skipped on mobile) */}
      <section className="hidden md:block py-24 bg-[#F8FBFF] border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <span className="text-blue-600 font-extrabold text-[11px] uppercase tracking-widest block mb-1">
            Global feedback
          </span>
          <h2 className="text-3xl md:text-4.5xl font-black text-slate-900 tracking-tight leading-none mb-16 font-sans">
            Endorsed by Leading Marine Scientists
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            
            <div className="bg-white border border-slate-150 p-6 rounded-2xl flex flex-col gap-4 font-sans shadow-xs hover:shadow-md transition-shadow">
              <span className="text-4xl text-blue-400 font-mono italic leading-none">“</span>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                "Our fingerling survival rate jumped from 72% to 94.6% in the first season of adopting RecXpats. The AI diagnostic reminders for nitrogenous spikes completely saved our Mirror Carp larvae batches during a storm water leakage incident."
              </p>
              <div className="pt-4 border-t border-slate-100/80 flex items-center gap-3 mt-auto">
                <div className="h-8 w-8 rounded-full bg-slate-100 text-[#2563EB] font-black text-[11px] flex items-center justify-center shrink-0">SK</div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Sarah Kim</h4>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Fish Farm Manager, SK Farms</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-150 p-6 rounded-2xl flex flex-col gap-4 shadow-xs hover:shadow-md transition-shadow">
              <span className="text-4xl text-blue-400 font-mono italic leading-none">“</span>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                "As an executive director, the treasury control console combined with water biosecurity compliance auditing is exceptional. It gives us standard compliance records ready to print for European export auditors."
              </p>
              <div className="pt-4 border-t border-slate-100/80 flex items-center gap-3 mt-auto">
                <div className="h-8 w-8 rounded-full bg-slate-100 text-[#2563EB] font-black text-[11px] flex items-center justify-center shrink-0">MT</div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Dr.Emily Tan</h4>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Senior Consultant, Biosecurity Ltd</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-150 p-6 rounded-2xl flex flex-col gap-4 shadow-xs hover:shadow-md transition-shadow">
              <span className="text-4xl text-blue-400 font-mono italic leading-none">“</span>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                "The interface design is perfect. Our field teams do not have the patience for complex ERP software. RecXpats is as simple to use as Notion, but packs the raw telemetry power of high-end industrial automation."
              </p>
              <div className="pt-4 border-t border-slate-100/80 flex items-center gap-3 mt-auto">
                <div className="h-8 w-8 rounded-full bg-slate-100 text-[#2563EB] font-black text-[11px] flex items-center justify-center shrink-0">CM</div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Carlos Mendoza</h4>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Fish Farm Supervisor, Lagos Cooperative</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. PRICING SECTION (Professional SaaS cards) */}
      <section id="pricing" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-600 font-extrabold text-[11px] uppercase tracking-widest block mb-1">
              Flexible Investment
            </span>
            <h2 className="text-3xl md:text-4.5xl font-black text-slate-900 tracking-tight leading-none mb-4 font-sans">
              Plans Crafted for High-Yield Facilities
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xl mx-auto mb-8">
              Pick the target plan matching your active tank volumetrics. Get started in minutes on a risk-free trial.
            </p>

            {/* Annual toggle */}
            <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-150 p-1.5 rounded-2xl">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  !isAnnual ? "bg-white text-slate-900 shadow-xs border border-slate-200" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  isAnnual ? "bg-[#2563EB] text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>Annual Billing</span>
                <span className="bg-blue-500/20 text-blue-100 text-[9px] px-1.5 py-0.2 rounded-full font-sans">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            
            {/* Plan 1: Starter */}
            <div className="bg-white border border-slate-150 rounded-2xl p-6.5 flex flex-col text-left hover:shadow-xl transition-all relative">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Starter Fish Farm</span>
              <h3 className="text-lg font-black text-slate-900 leading-tight mb-4">Starter plan</h3>
              <div className="flex items-baseline gap-1 mb-6 border-b border-slate-100 pb-5">
                <span className="text-3xl font-black text-slate-900 font-sans">${prices.starter}</span>
                <span className="text-slate-400 font-bold text-xs">/ month</span>
              </div>
              
              <ul className="space-y-3.5 text-xs text-slate-600 mb-8 flex-1">
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-[#2563EB] shrink-0" /> Up to 5 Active Rearing Tanks</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-[#2563EB] shrink-0" /> Core Spawning tracking</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-[#2563EB] shrink-0" /> Water monitoring logs</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-[#2563EB] shrink-0" /> Local local data backups</li>
              </ul>

              <button
                onClick={() => { setAuthMode("signup"); setIsAuthOpen(true); }}
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-800 font-extrabold text-xs rounded-xl uppercase tracking-wider cursor-pointer border border-slate-200 transition-colors"
              >
                Start Free Trial
              </button>
            </div>

            {/* Plan 2: Professional - Featured */}
            <div className="bg-white border-2 border-blue-600 rounded-3xl p-6.5 flex flex-col text-left shadow-2xl relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white text-[9px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full border border-blue-500/10">
                Most Popular
              </span>
              <span className="text-xs font-black text-[#2563EB] uppercase tracking-widest block mb-1">Commercial Expert</span>
              <h3 className="text-lg font-black text-slate-900 leading-tight mb-4">Professional Plan</h3>
              <div className="flex items-baseline gap-1 mb-6 border-b border-slate-100 pb-5">
                <span className="text-3xl font-black text-slate-900 font-sans">${prices.professional}</span>
                <span className="text-slate-400 font-bold text-xs">/ month</span>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-600 mb-8 flex-1">
                <li className="flex items-center gap-2 font-semibold"><CheckCircle2 size={13} className="text-[#0EA5E9] shrink-0" /> Unlimited Breeding Ponds</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-[#0EA5E9] shrink-0" /> Extended Live incubation tracking</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-[#0EA5E9] shrink-0" /> AI diagnostics module</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-[#0EA5E9] shrink-0" /> Full on-chain traceability integration</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-[#0EA5E9] shrink-0" /> 24/7 Priority specialist support</li>
              </ul>

              <button
                onClick={() => { setAuthMode("signup"); setIsAuthOpen(true); }}
                className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider cursor-pointer border border-blue-600/10 transition-all shadow-md"
              >
                Access Professional Setup
              </button>
            </div>

            {/* Plan 3: Enterprise */}
            <div className="bg-white border border-slate-150 rounded-2xl p-6.5 flex flex-col text-left hover:shadow-xl transition-all">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Enterprise Scaled</span>
              <h3 className="text-lg font-black text-slate-900 leading-tight mb-4">Enterprise Custom</h3>
              <div className="flex items-baseline gap-1 mb-6 border-b border-slate-100 pb-5">
                <span className="text-3xl font-black text-slate-900 font-sans">${prices.enterprise}</span>
                <span className="text-slate-400 font-bold text-xs">/ month</span>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-600 mb-8 flex-1">
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-[#2563EB] shrink-0" /> Global Multi-Site locations mapping</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-[#2563EB] shrink-0" /> Custom firmware testing integration</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-[#2563EB] shrink-0" /> Raw telemetry web sockets integration</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-[#2563EB] shrink-0" /> Dedicated bio-consultant assignees</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-[#2563EB] shrink-0" /> Custom service level SLA agreements</li>
              </ul>

              <button
                onClick={() => { setAuthMode("signup"); setIsAuthOpen(true); }}
                className="w-full py-3 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider cursor-pointer transition-colors"
              >
                Contact Enterprise Sales
              </button>
            </div>

          </div>
        </div>
      </section>
        </>
      )}

      {/* 8. CLEAN MINIMALIST FOOTER */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-10 text-center relative z-10 selection:bg-blue-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-5">
          <AppLogo mode="dark" size="sm" />
          <p className="text-xs leading-relaxed text-slate-400 max-w-md">
            The combined aquaculture platform for bio-security tracking, water quality analytics, feed optimization, and digital trade networks.
          </p>
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-850 p-2.5 pr-4 rounded-2xl shadow-sm max-w-xs w-full justify-center">
            <img 
              src="/marcelo_ceo.jpg" 
              alt="Mercelo Peter Okoya" 
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-emerald-500/30"
            />
            <div className="text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">RecXpats CEO</span>
              <span className="text-xs font-black text-white block mt-0.5">Mercelo Peter Okoya</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-[10px] sm:text-[11px] text-slate-500 font-semibold border-t border-slate-900 w-full pt-6">
            <span>© 2026 RecXpats. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-blue-400 font-mono">Region: East Africa (v2.56-stable)</span>
          </div>
        </div>
      </footer>

      {/* OVERLAY AUTH CONTAINER */}
      <AnimatePresence>
        {isAuthOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop blur overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAuthOpen(false); setErrorMsg(""); }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" 
            />
            
            {/* Modal Dialog container content (mobile-optimized layout with max-height, scrolling & adaptive padding) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-md max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-3xl border border-slate-100 shadow-2xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 z-10"
            >
              
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsAuthOpen(false);
                  setErrorMsg("");
                }}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header Branding */}
              <div className="text-center pt-2 sm:pt-0">
                <AppLogo size="sm" mode="light" className="mx-auto mb-2 sm:mb-3 justify-center" />
                <h3 className="text-sm sm:text-base font-extrabold text-slate-950 tracking-tight capitalize">
                  {authMode === "signin" 
                    ? (selectedRole === "operator" ? "Fish Farm Secure Sign In" : "Customer Portal Secure Sign In")
                    : (selectedRole === "operator" ? "Create Breeder Operator Profile" : "Register Visitor & Customer Profile")}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium px-2">
                  {authMode === "signin" 
                    ? "Input your bio-operational credentials or partner single sign-on below."
                    : "Start scheduling appointments, tracing transport, and managing bio-protocols."}
                </p>
              </div>

              {sessionExpiredMsg && (
                <div className="bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl text-[10px] text-amber-800 font-bold flex items-center gap-2 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>{sessionExpiredMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl text-[10px] text-rose-800 font-bold flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form implementation */}
              <form onSubmit={handleCredentialsSubmit} className="space-y-3 text-left">
                {authMode === "signup" && (
                  <div className="space-y-0.5">
                    <label className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">
                      {selectedRole === "operator" ? "Full Operator Name" : "Company / Customer Name"}
                    </label>
                    <div className="relative">
                      <User size={13} className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder={selectedRole === "operator" ? "Dr. Arthur Pendelton" : "Koma recxpats Services"}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-0.5">
                  <label className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      placeholder="Enter operational email address..."
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">
                      Secure Password
                    </label>
                    {authMode === "signin" && (
                      <a href="#" className="text-[9.5px] text-[#2563EB] font-bold hover:underline" onClick={(e) => { e.preventDefault(); setErrorMsg("Contact system administrator to request verification keys."); }}>
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <Lock size={13} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-450 hover:text-slate-600 transition cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>

                  {authMode === "signup" && (
                    <div className="mt-2 p-2.5 bg-slate-100/70 border border-slate-200 rounded-xl space-y-1 text-[10px] animate-in fade-in-50 duration-250">
                      <span className="text-[9px] uppercase font-extrabold text-slate-500 block mb-1">Password Standard Guidelines</span>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-semibold">
                        <span className={`flex items-center gap-1 ${password.length >= 8 ? "text-emerald-600" : "text-rose-500"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? "bg-emerald-500" : "bg-rose-400 animate-pulse"}`} />
                          Min 8 chars ({password.length}/8)
                        </span>
                        <span className={`flex items-center gap-1 ${/[a-z]/.test(password) ? "text-emerald-600" : "text-rose-500"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(password) ? "bg-emerald-500" : "bg-rose-400 animate-pulse"}`} />
                          One lowercase (a-z)
                        </span>
                        <span className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? "text-emerald-600" : "text-rose-500"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(password) ? "bg-emerald-500" : "bg-rose-400 animate-pulse"}`} />
                          One uppercase (A-Z)
                        </span>
                        <span className={`flex items-center gap-1 ${/[0-9]/.test(password) ? "text-emerald-600" : "text-rose-500"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(password) ? "bg-emerald-500" : "bg-rose-400 animate-pulse"}`} />
                          One digit (0-9)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2.5 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-3 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 border border-blue-600/10`}
                >
                  {isSubmitting 
                    ? "Processing..." 
                    : authMode === "signin" 
                    ? "Verify System Credentials" 
                    : "Create Operational Profile"}
                </button>
              </form>



              {/* MODE TOGGLES */}
              <div className="text-center text-xs border-t border-slate-100 pt-3.5">
                {authMode === "signin" ? (
                  <p className="text-slate-500">
                    Don't have an operator account?{" "}
                    <button
                      onClick={() => {
                        setAuthMode("signup");
                        setErrorMsg("");
                      }}
                      className="text-[#2563EB] font-extrabold cursor-pointer underline hover:no-underline"
                    >
                      Sign Up Now
                    </button>
                  </p>
                ) : (
                  <p className="text-slate-500">
                    Already registered profile?{" "}
                    <button
                      onClick={() => {
                        setAuthMode("signin");
                        setErrorMsg("");
                      }}
                      className="text-[#2563EB] font-extrabold cursor-pointer underline hover:no-underline"
                    >
                      Log In Instead
                    </button>
                  </p>
                )}
              </div>

              {/* Removed SSO/Social Auth Dock for a cleaner, unified login card */}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {isMobileWalkthroughOpen && (
        <InstallMobileApp onClose={() => setIsMobileWalkthroughOpen(false)} />
      )}

    </div>
  );
}
