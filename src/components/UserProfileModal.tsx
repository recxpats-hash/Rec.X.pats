import React, { useState, useEffect, useRef } from "react";
import { X, User, Phone, Briefcase, Mail, ShieldAlert, Check, Camera, Settings, Sparkles } from "lucide-react";
import { uploadToSupabaseStorage } from "../lib/supabaseClient";

interface UserProfile {
  fullName: string;
  phone: string;
  role: string;
  department: string;
  bio: string;
  avatarUrl: string;
  notificationsEnabled: boolean;
  criticalAlertsPref: boolean;
  marketingEmailsPref: boolean;
  preferredLanguage: "English" | "Luganda" | "Swahili";
  accentColor: "default" | "amber" | "emerald" | "sky";
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail: string;
  currentUserRole: string;
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80", // Tech man
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80", // Tech woman
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80", // Professional suit
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80", // Executive woman
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80", // Friendly staff
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80"  // Confident manager
];

export default function UserProfileModal({
  isOpen,
  onClose,
  currentUserEmail,
  currentUserRole
}: UserProfileModalProps) {
  const profileKey = `rechxpats_profile_${currentUserEmail}`;
  const isExecutiveUser = currentUserEmail === "inno@executive.com";

  // Default structure
  const defaultProfile: UserProfile = {
    fullName: isExecutiveUser ? "Mercelo Peter Okoya" : (currentUserEmail.split("@")[0].toUpperCase() || "recxpats Specialist"),
    phone: isExecutiveUser ? "+256 772 120 450" : "+256 700 000000",
    role: isExecutiveUser ? "RecXpats CEO" : currentUserRole.toUpperCase(),
    department: isExecutiveUser 
      ? "Executive Office / Board of Directors" 
      : (currentUserEmail.includes("admin") ? "Corporate Security" : currentUserEmail.includes("finance") ? "Treasury & Finance" : "Fish Farm Operations"),
    bio: isExecutiveUser 
      ? "Chief Executive Officer of BlueHatch & RecXpats, steering sustainable aquaculture systems, IoT-enabled grow-out matrices, and corporate treasury."
      : "Passionate about sustainable recxpats, automated fry diagnostics, and biosecurity standards.",
    avatarUrl: isExecutiveUser ? "/marcelo_ceo.jpg" : PRESET_AVATARS[0],
    notificationsEnabled: true,
    criticalAlertsPref: true,
    marketingEmailsPref: false,
    preferredLanguage: "English",
    accentColor: "default"
  };

  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [successMsg, setSuccessMsg] = useState("");
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  // File loading reference to select local files
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local binary file upload from pc
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSuccessMsg("⏳ Uploading photo content to secure server...");
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === "string") {
          const base64Data = reader.result;
          setProfile(prev => ({ ...prev, avatarUrl: base64Data }));
          
          try {
            const resp = await uploadToSupabaseStorage(base64Data, file.name);
            if (resp.success && resp.url) {
              setProfile(prev => ({ ...prev, avatarUrl: resp.url }));
              setSuccessMsg("✓ Custom photo successfully uploaded to Supabase Storage!");
            } else {
              setSuccessMsg("✓ Custom photo updated locally (Supabase bucket pending setup). Click Save Profile to apply.");
            }
          } catch (err) {
            setSuccessMsg("✓ Custom photo updated locally. Click Save Profile to apply.");
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Load profile from localStorage on mount/email change
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem(profileKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProfile({ ...defaultProfile, ...parsed });
        } catch (e) {
          console.error("Failed to parse user profile: ", e);
        }
      } else {
        setProfile(defaultProfile);
      }
      setSuccessMsg("");
    }
  }, [isOpen, currentUserEmail]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem(profileKey, JSON.stringify(profile));
    setSuccessMsg("✓ Dynamic profile updated in local database successfully!");
    
    // Dispatch a custom event to update other components dynamically
    const event = new CustomEvent("rechxpats_profile_updated", {
      detail: { email: currentUserEmail, profile }
    });
    window.dispatchEvent(event);

    setTimeout(() => {
      setSuccessMsg("");
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        id="profile-modal-container" 
        className="bg-white rounded-3xl w-full max-w-2xl border border-slate-100 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-slate-900 text-white rounded-lg">
              <User size={16} />
            </span>
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                User Profile Management
              </h2>
              <p className="text-[10px] text-slate-500 font-mono font-bold">
                PERSISTENT ID: {currentUserEmail}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Scrollable Contents */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 font-medium">
          
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl font-bold flex items-center gap-2 text-center justify-center animate-bounce">
              <Sparkles size={14} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SECTION 1: Profile Photo Selector & Hero */}
          <div className="bg-slate-50 p-5 rounded-2xl flex flex-col md:flex-row items-center gap-5 border border-slate-100">
            <div className="relative group select-none shrink-0">
              <img 
                src={profile.avatarUrl || PRESET_AVATARS[0]} 
                alt="Profile Preview" 
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                onError={(e) => {
                  (e.target as any).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";
                }}
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-slate-900 text-white p-2 rounded-full shadow-lg border border-white hover:bg-teal-650 transition duration-300 hover:scale-105"
                title="Upload image from PC"
              >
                <Camera size={13} className="text-teal-400" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>

            <div className="space-y-1.5 text-center md:text-left flex-1 w-full">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm tracking-tight">{profile.fullName}</span>
                <span className="bg-slate-900 text-white font-mono font-bold uppercase text-[9px] px-2 py-0.5 rounded w-max mx-auto md:mx-0">
                  {currentUserRole}
                </span>
              </div>
              <p className="text-slate-500 max-w-md text-[11px] leading-relaxed italic">
                "{profile.bio || "No custom user status set."}"
              </p>
            </div>
          </div>

          {/* Quick Avatar Grid */}
          {showAvatarSelector && (
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3 animate-in fade-in duration-200">
              <span className="text-[10px] uppercase font-bold text-slate-450 block">Select standard professional avatar:</span>
              <div className="flex gap-2.5 flex-wrap">
                {PRESET_AVATARS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setProfile({ ...profile, avatarUrl: url });
                      setCustomAvatarUrl("");
                    }}
                    className={`w-11 h-11 rounded-full overflow-hidden border-2 transition ${
                      profile.avatarUrl === url ? "border-indigo-600 scale-105" : "border-transparent hover:border-slate-300"
                    }`}
                  >
                    <img src={url} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] uppercase font-bold text-slate-450 block">Or paste custom image URL:</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10.5px] font-black text-teal-650 hover:text-teal-750 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Camera size={11} /> Upload from PC
                  </button>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="https://example.com/photo.jpg" 
                    value={customAvatarUrl}
                    onChange={(e) => {
                      setCustomAvatarUrl(e.target.value);
                      setProfile({ ...profile, avatarUrl: e.target.value });
                    }}
                    className="flex-1 bg-white border border-slate-200 p-1.5 rounded-lg text-xs outline-none focus:border-indigo-505"
                  />
                  {customAvatarUrl && (
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-1.5 rounded-lg text-[10px] font-black">Valid Input</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Personal Information */}
          <div className="space-y-4">
            <h3 className="font-black text-slate-850 uppercase text-[10.5px] border-b pb-1">
              1. Personal Information Mappings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-450 uppercase font-bold mb-1">Full Identity Name</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2.5 text-slate-400">
                    <User size={13} />
                  </span>
                  <input 
                    type="text" 
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                    placeholder="Full Professional Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-450 uppercase font-bold mb-1">Direct Contact Number</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2.5 text-slate-400">
                    <Phone size={13} />
                  </span>
                  <input 
                    type="text" 
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                    placeholder="+256 700 000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-450 uppercase font-bold mb-1">Professional / Fish Farm Role</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2.5 text-slate-400">
                    <Briefcase size={13} />
                  </span>
                  <input 
                    type="text" 
                    value={profile.role}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 text-slate-400 rounded-xl text-xs outline-none cursor-not-allowed uppercase font-mono"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-450 uppercase font-bold mb-1">Assigned Division Department</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2.5 text-slate-400">
                    <Mail size={13} />
                  </span>
                  <input 
                    type="text" 
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                    placeholder="e.g. Nursery Sector"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-450 uppercase font-bold mb-1">Biographical Status / Summary</label>
              <textarea 
                rows={2}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-indigo-500 font-sans"
                placeholder="Write a brief professional summary about your role or activities."
              />
            </div>
          </div>

          {/* SECTION 3: Settings & Preferences */}
          <div className="space-y-4">
            <h3 className="font-black text-slate-850 uppercase text-[10.5px] border-b pb-1">
              2. System settings & Preferences
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-450 uppercase font-bold mb-1">Preferred System Language</label>
                <select
                  value={profile.preferredLanguage}
                  onChange={(e) => setProfile({ ...profile, preferredLanguage: e.target.value as any })}
                  className="w-full bg-white border border-slate-200 p-2 py-2 rounded-xl text-xs outline-none focus:border-indigo-500"
                >
                  <option value="English">English (Standard US)</option>
                  <option value="Luganda">Luganda (Eastern Region)</option>
                  <option value="Swahili">Swahili (East Africa)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-450 uppercase font-bold mb-1">Accent Panel Color</label>
                <div className="flex gap-2.5 mt-1 select-none">
                  {["default", "amber", "emerald", "sky"].map((color) => {
                    const bgClass = color === "default" ? "bg-slate-900" : color === "amber" ? "bg-amber-500" : color === "emerald" ? "bg-emerald-500" : "bg-sky-500";
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setProfile({ ...profile, accentColor: color as any })}
                        className={`w-6 h-6 rounded-full ${bgClass} flex items-center justify-center relative shadow-sm border border-white`}
                        title={`Select ${color}`}
                      >
                        {profile.accentColor === color && (
                          <span className="text-white text-[8px] font-bold"><Check size={10} strokeWidth={4} /></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Notification Checkboxes */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Interactive System Subscriptions</span>
              
              <label className="flex items-center gap-2.5 cursor-pointer leading-tight select-none">
                <input 
                  type="checkbox" 
                  checked={profile.notificationsEnabled}
                  onChange={(e) => setProfile({ ...profile, notificationsEnabled: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-550 h-3.5 w-3.5"
                />
                <div>
                  <span className="font-bold text-slate-800 text-[11px] block">Enable Dashboard Instant Notifications</span>
                  <span className="text-[9.5px] text-slate-450 block">Receive browser notification signals upon new records.</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 mt-3 cursor-pointer leading-tight select-none">
                <input 
                  type="checkbox" 
                  checked={profile.criticalAlertsPref}
                  onChange={(e) => setProfile({ ...profile, criticalAlertsPref: e.checked })}
                  className="rounded text-indigo-600 h-3.5 w-3.5"
                />
                <div>
                  <span className="font-bold text-slate-800 text-[11px] block flex items-center gap-1">
                    <ShieldAlert size={12} className="text-amber-500" />
                    Emergency Broodstock & Bio-security SMS Alerts
                  </span>
                  <span className="text-[9.5px] text-slate-450 block">SMS alerting dispatch upon abnormal water quality parameters.</span>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center select-none">
          <span className="text-[9px] text-slate-400 italic font-mono uppercase">PERSISTENT CACHING ACTIVE</span>
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={onClose}
              className="bg-white border rounded-xl px-4 py-2 hover:bg-slate-550 hover:bg-slate-100 text-slate-600 transition"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSave}
              className="bg-slate-900 border border-slate-800 text-white rounded-xl px-5 py-2 hover:bg-slate-800 transition font-black"
            >
              Save Profile Settings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
