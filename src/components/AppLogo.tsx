import React from "react";

interface AppLogoProps {
  className?: string;
  iconOnly?: boolean;
  mode?: "light" | "dark";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export default function AppLogo({
  className = "",
  iconOnly = false,
  mode = "light",
  size = "md"
}: AppLogoProps) {
  // Determine pixel sizes for scaling
  const strokeColor = mode === "dark" ? "#e2e8f0" : "#0f172a";
  const textColor = mode === "dark" ? "text-white" : "text-slate-900";
  const subtitleColor = mode === "dark" ? "text-slate-400" : "text-slate-500";

  // Dimensions based on size property
  let width = "w-auto";
  let height = "h-12";
  let iconSize = 48;

  if (size === "xs") {
    height = "h-6";
    iconSize = 24;
  } else if (size === "sm") {
    height = "h-9";
    iconSize = 36;
  } else if (size === "md") {
    height = "h-12";
    iconSize = 52;
  } else if (size === "lg") {
    height = "h-20";
    iconSize = 80;
  } else if (size === "xl") {
    height = "h-36";
    iconSize = 144;
  }

  // Render the core logo mark SVG
  const logoMark = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 select-none"
    >
      <defs>
        {/* Glow and Gradients matching the RecXpats vibe */}
        <linearGradient id="orbit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan 500 */}
          <stop offset="50%" stopColor="#3b82f6" /> {/* Blue 500 */}
          <stop offset="100%" stopColor="#1d4ed8" /> {/* Blue 700 */}
        </linearGradient>

        <linearGradient id="fish-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" /> {/* Blue 600 */}
          <stop offset="60%" stopColor="#1e3a8a" /> {/* Blue 900 */}
          <stop offset="100%" stopColor="#020617" /> {/* Slate 950 */}
        </linearGradient>

        <linearGradient id="fish-highlight-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" /> {/* Sky 400 */}
          <stop offset="100%" stopColor="#60a5fa" /> {/* Blue 400 */}
        </linearGradient>

        <linearGradient id="cyan-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0891b2" stopOpacity="0.2" />
        </linearGradient>

        <linearGradient id="bar-grad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#0284c7" /> {/* Sky 600 */}
          <stop offset="100%" stopColor="#06b6d4" /> {/* Cyan 500 */}
        </linearGradient>

        <filter id="logo-drop-shadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* 1. Technical Data Bars in background */}
      <g opacity="0.85">
        <rect x="47" y="30" width="4.5" height="12" rx="1.5" fill="url(#bar-grad)" />
        <rect x="53" y="27" width="4.5" height="15" rx="1.5" fill="url(#bar-grad)" />
        <rect x="59" y="24" width="4.5" height="18" rx="1.5" fill="url(#bar-grad)" />
        <rect x="65" y="20" width="4.5" height="22" rx="1.5" fill="url(#bar-grad)" />
      </g>

      {/* 2. Cyber Orbit rings / perimeter loop */}
      <path
        d="M 50,15 A 35,35 0 1,1 15,50"
        stroke="url(#orbit-grad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 15,50 A 35,35 0 0,1 42,16"
        stroke="url(#orbit-grad)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        fill="none"
      />

      {/* Orbit connectivity nodes with telemetry stems */}
      <circle cx="75" cy="25" r="4.5" fill="#38bdf8" className="animate-pulse" />
      <circle cx="75" cy="25" r="2.5" fill="#ffffff" />
      
      {/* Sensor stems connecting background bars to network nodes */}
      <line x1="75" y1="25" x2="68" y2="38" stroke="#06b6d4" strokeWidth="1" />
      <circle cx="68" cy="38" r="2" fill="#0891b2" />

      <line x1="78" y1="31" x2="71" y2="44" stroke="#06b6d4" strokeWidth="1" />
      <circle cx="78" cy="31" r="2.5" fill="#06b6d4" />
      <circle cx="71" cy="44" r="2" fill="#0284c7" />

      {/* 3. recxpats Containment Mesh Grid (Net) in bottom right quadrant */}
      <path
        d="M 45,78 C 55,75 70,68 75,55 C 80,48 83,40 85,32"
        stroke="#06b6d4"
        strokeWidth="1.5"
        strokeOpacity="0.7"
        fill="none"
      />
      
      {/* Grid cross lines creating net texture */}
      <path d="M 40,65 Q 60,63 78,48" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.6" fill="none" />
      <path d="M 43,53 Q 63,55 74,38" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.5" fill="none" />
      <path d="M 48,78 Q 50,60 52,38" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.5" fill="none" />
      <path d="M 58,74 Q 61,58 64,32" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.5" fill="none" />
      <path d="M 68,67 Q 70,52 72,28" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" fill="none" />

      {/* Small dots on net intersections */}
      <circle cx="56" cy="67" r="1.5" fill="#22d3ee" />
      <circle cx="66" cy="62" r="1.5" fill="#22d3ee" />
      <circle cx="76" cy="52" r="1.5" fill="#22d3ee" />
      <circle cx="50" cy="55" r="1.2" fill="#22d3ee" />
      <circle cx="61" cy="51" r="1.2" fill="#22d3ee" />
      <circle cx="71" cy="43" r="1.2" fill="#22d3ee" />

      {/* 4. Leaping Fish (Principal Icon element) */}
      <g filter="url(#logo-drop-shadow)">
        {/* Tail fin */}
        <path
          d="M 15,48 C 10,48 8,56 12,60 C 14,57 18,55 24,53 C 22,50 18,48 15,48 Z"
          fill="url(#fish-body-grad)"
        />
        <path
          d="M 15,48 C 11,50 10,54 12,60"
          stroke="#06b6d4"
          strokeWidth="1.2"
          fill="none"
        />

        {/* Back fin (Dorsal) */}
        <path
          d="M 40,32 C 34,26 40,24 45,28 C 42,30 41,31 42,33 Z"
          fill="url(#fish-highlight-grad)"
        />

        {/* Dynamic Curved Fish Body */}
        <path
          d="M 15,50 C 22,51 32,45 38,36 C 45,28 55,28 65,37 C 55,39 48,47 40,54 C 32,60 22,60 15,50 Z"
          fill="url(#fish-body-grad)"
        />

        {/* Belly Fin */}
        <path
          d="M 32,56 C 26,59 28,64 30,62 C 31,60 32,58 33,56 Z"
          fill="url(#fish-highlight-grad)"
        />

        {/* Upper lateral line highlighting and gills */}
        <path
          d="M 33,41 C 41,33 49,32 58,40"
          stroke="url(#fish-highlight-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Gill arc & side fin */}
        <path
          d="M 54,34 C 52,36 52,41 55,44"
          stroke="#06b6d4"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        
        <path
          d="M 46,45 C 41,47 42,50 45,51 C 47,50 47,47 46,45 Z"
          fill="url(#fish-highlight-grad)"
        />

        {/* Fish Eye with tiny glossy reflection */}
        <circle cx="58" cy="35" r="2.5" fill="#0f172a" />
        <circle cx="58.8" cy="34.2" r="0.8" fill="#ffffff" />
      </g>
    </svg>
  );

  if (iconOnly) {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        {logoMark}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 sm:gap-3.5 ${className}`}>
      {logoMark}
      
      <div className="flex flex-col justify-center">
        {/* RecXpats Brand Title - Plain elegant styled text */}
        <div className="flex items-center tracking-tight leading-none">
          <span className={`text-base sm:text-xl font-black font-sans tracking-tight ${textColor}`}>
            Rec<span className={mode === "dark" ? "text-blue-400" : "text-blue-600"}>Xpats</span>
          </span>
          <span className="ml-1 sm:ml-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[8px] sm:text-[9px] font-black tracking-wider px-1 sm:px-1.5 py-0.5 rounded-md border border-blue-500/20 uppercase font-mono">
            PRO
          </span>
        </div>
        
        {/* Elegant architectural subtitle with balanced lines */}
        <div className="flex items-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-1 leading-none">
          <span className="h-[1px] w-1 sm:w-2 bg-slate-400/30 shrink-0" />
          <span className={`text-[6.5px] sm:text-[8.5px] font-extrabold tracking-[0.04em] sm:tracking-[0.16em] uppercase font-mono leading-none whitespace-nowrap ${subtitleColor}`}>
            FISH FARM MANAGEMENT APP
          </span>
          <span className="h-[1px] w-1 sm:w-2 bg-slate-400/30 shrink-0" />
        </div>
      </div>
    </div>
  );
}
