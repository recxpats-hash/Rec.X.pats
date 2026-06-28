import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { 
  Smartphone, 
  QrCode, 
  Download, 
  X, 
  CheckCircle, 
  HelpCircle, 
  ArrowRight, 
  Compass, 
  CheckSquare, 
  Share2 
} from "lucide-react";

interface InstallMobileAppProps {
  onClose?: () => void;
  embedMode?: boolean;
}

export default function InstallMobileApp({ onClose, embedMode = false }: InstallMobileAppProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [appUrl, setAppUrl] = useState<string>("");
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [installationStatus, setInstallationStatus] = useState<"idle" | "installing" | "success">("idle");
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [activeInstructionTab, setActiveInstructionTab] = useState<"android" | "ios">("android");

  // Determine current deployment app URL at load time
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Prioritize standard active viewport URL, fallback to process environment
      const currentUrl = window.location.href;
      setAppUrl(currentUrl);

      // Listen for the custom browser PWA install promotion trigger
      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setInstallPrompt(e);
        setIsInstallable(true);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstall);

      // Check if already in standalone launcher mode
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstallable(false);
      }

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      };
    }
  }, []);

  // Drive canvas QR Code execution
  useEffect(() => {
    if (canvasRef.current && appUrl) {
      QRCode.toCanvas(
        canvasRef.current,
        appUrl,
        {
          width: 220,
          margin: 1.5,
          color: {
            dark: "#0f172a", // Slate 900
            light: "#ffffff", // Pure white
          },
        },
        (error) => {
          if (error) console.error("Could not construct QR code vector link: ", error);
        }
      );
    }
  }, [appUrl]);

  // Handle direct client triggers
  const triggerNativePwaInstall = async () => {
    if (!installPrompt) return;
    setInstallationStatus("installing");
    
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === "accepted") {
      setInstallationStatus("success");
      setIsInstallable(false);
    } else {
      setInstallationStatus("idle");
    }
    setInstallPrompt(null);
  };

  const copyUrlToClipboard = () => {
    if (appUrl) {
      navigator.clipboard.writeText(appUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 3000);
    }
  };

  const mainPanelMarkup = (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 text-white text-sans relative overflow-hidden shadow-2xl z-20">
      
      {/* Absolute high-tech vector backdrop lines */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Title & Modal Close Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/20">
            <Smartphone size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 tracking-tight flex items-center gap-1.5 leading-none">
              Android & iOS Mobile OS Wrapper
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Verify, download, and launch RecXpats OS directly on smartphones
            </p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Side: Mobile Features Summary (QR Scan Removed) */}
        <div className="lg:col-span-5 flex flex-col items-stretch p-5 bg-slate-950 border border-slate-850 rounded-2xl">
          <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest block mb-3 text-center">
            📱 Mobile Core Capability
          </span>
          
          <div className="space-y-3 mb-4 text-xs">
            <div className="flex items-center gap-2.5 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
              <span className="text-emerald-400 text-sm">🔋</span>
              <div>
                <h4 className="font-bold text-slate-200 text-[11px]">Energy-Saving Telemetry</h4>
                <p className="text-[10px] text-slate-400">Optimized for low-bandwidth cellular remote areas.</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
              <span className="text-cyan-400 text-sm">🚀</span>
              <div>
                <h4 className="font-bold text-slate-200 text-[11px]">Instant PWA Speed</h4>
                <p className="text-[10px] text-slate-400">Launches instantly without heavy app store downloads.</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
              <span className="text-pink-400 text-sm">🔒</span>
              <div>
                <h4 className="font-bold text-slate-200 text-[11px]">Zero-Trust Security</h4>
                <p className="text-[10px] text-slate-400">Secure end-to-end local keychain authentication.</p>
              </div>
            </div>
          </div>

          {/* Copyable Web Link */}
          <div className="w-full border-t border-slate-850/60 pt-3">
            <p className="text-[10px] text-slate-400 mb-1.5 text-center">Direct Live Application URL:</p>
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1.5 rounded-lg text-[10px]">
              <span className="truncate text-slate-300 select-all font-mono flex-1 text-left px-1">
                {appUrl}
              </span>
              <button 
                onClick={copyUrlToClipboard}
                className="px-2 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/40 font-semibold rounded-md text-[9px] cursor-pointer transition-colors"
              >
                {copiedUrl ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Smart Interactive installation guides */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* Direct browser standalone app installation banner (if compatible) */}
          {isInstallable && (
            <div className="bg-gradient-to-r from-blue-950/60 to-cyan-950/40 border border-cyan-500/20 p-3.5 rounded-xl flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 text-cyan-300 rounded-lg">
                  <Download size={16} />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-cyan-100">Direct Download Signal Found</h4>
                  <p className="text-[10px] text-slate-350">Install this web interface as a standalone mobile launcher app.</p>
                </div>
              </div>
              <button
                onClick={triggerNativePwaInstall}
                disabled={installationStatus === "installing"}
                className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-950 font-bold text-[10px] tracking-wide uppercase rounded-lg shadow-sm font-sans transition-all cursor-pointer flex items-center gap-1.5"
              >
                {installationStatus === "installing" ? "Installing..." : "Install App"}
              </button>
            </div>
          )}

          {/* Quick tabs of iOS / Android installation steps */}
          <div>
            <div className="flex items-center border-b border-slate-800 mb-3 text-[11px] font-semibold text-slate-400">
              <button 
                onClick={() => setActiveInstructionTab("android")}
                className={`py-2 px-4 border-b-2 transition-all cursor-pointer ${
                  activeInstructionTab === "android" 
                    ? "border-cyan-400 text-cyan-400 font-bold bg-slate-900/40" 
                    : "border-transparent text-slate-450 hover:text-white"
                }`}
              >
                🤖 Android Phone Instructions
              </button>
              <button 
                onClick={() => setActiveInstructionTab("ios")}
                className={`py-2 px-4 border-b-2 transition-all cursor-pointer ${
                  activeInstructionTab === "ios" 
                    ? "border-cyan-400 text-cyan-400 font-bold bg-slate-900/40" 
                    : "border-transparent text-slate-450 hover:text-white"
                }`}
              >
                🍎 Apple iPhone Instructions
              </button>
            </div>

            {activeInstructionTab === "android" ? (
              <div className="space-y-2.5 text-[11px] text-slate-300">
                <div className="flex items-start gap-2.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-cyan-300 font-mono flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</div>
                  <p className="leading-relaxed">
                    Copy the direct application URL using the copy button and paste it inside your smartphone's <strong>Chrome Browser</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-cyan-300 font-mono flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</div>
                  <p className="leading-relaxed">
                    Tap the <strong>Chrome menu (three dots)</strong> in the top-right corner of your browser.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-cyan-300 font-mono flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</div>
                  <p className="leading-relaxed">
                    Select <strong className="text-cyan-400">Add to Home screen</strong> or <strong className="text-cyan-400">Install App</strong> on the list.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">✓</div>
                  <p className="leading-relaxed text-slate-400">
                    A beautiful launcher icon will permanently appear in your app drawer. It functions standalone without browser borders!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 text-[11px] text-slate-300">
                <div className="flex items-start gap-2.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-cyan-300 font-mono flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</div>
                  <p className="leading-relaxed">
                    Copy the application URL and open it inside Apple's native <strong>Safari Browser</strong> on your iPhone.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-cyan-300 font-mono flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</div>
                  <p className="leading-relaxed flex items-center gap-1">
                    Tap the <strong>Share</strong> button <Share2 size={12} className="inline text-cyan-400" /> at the bottom menu bar of Safari.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-cyan-300 font-mono flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</div>
                  <p className="leading-relaxed">
                    Scroll down and select <strong className="text-cyan-400">Add to Home Screen</strong> on the shares list.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">✓</div>
                  <p className="leading-relaxed text-slate-400">
                    The app launches in hardware-accelerated fluid container mode with native feeling performance!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Technical Specifications Ledger */}
          <div className="text-[9px] uppercase tracking-wider text-slate-500 flex justify-between border-t border-slate-850/65 pt-3 mt-1.5 font-mono">
            <span>Security: SSL Encrypted AES-256</span>
            <span>OS Target: Android 9+ / iOS 13+</span>
            <span>Type: PWA Native Wrapper</span>
          </div>
        </div>

      </div>
    </div>
  );

  if (embedMode) {
    return mainPanelMarkup;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="w-full max-w-3xl transform-gpu transition-all animate-fade-in relative z-50">
        {mainPanelMarkup}
      </div>
    </div>
  );
}
