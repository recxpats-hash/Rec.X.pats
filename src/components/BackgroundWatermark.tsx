import React, { useEffect, useState } from "react";
import AppLogo from "./AppLogo";

interface BackgroundWatermarkProps {
  mode?: "light" | "dark";
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export default function BackgroundWatermark({
  mode = "light",
  className = "",
  intensity = "medium"
}: BackgroundWatermarkProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Color variables based on light/dark mode
  const gridColor = mode === "dark" ? "rgba(56, 189, 248, 0.035)" : "rgba(37, 99, 235, 0.045)";
  const ringColor = mode === "dark" ? "rgba(6, 182, 212, 0.045)" : "rgba(37, 99, 235, 0.06)";
  const dashColor = mode === "dark" ? "rgba(99, 102, 241, 0.035)" : "rgba(59, 130, 246, 0.05)";
  const labelColor = mode === "dark" ? "text-slate-700/30" : "text-sky-800/10";
  const crosshairColor = mode === "dark" ? "rgba(34, 211, 238, 0.08)" : "rgba(37, 99, 235, 0.1)";

  // Scale of logo and watermarks
  const logoOpacity = mode === "dark" ? "opacity-[0.05]" : "opacity-[0.065]";
  const techGridsOpacity = mode === "dark" ? "opacity-[0.6]" : "opacity-[0.8]";

  return (
    <div
      role="presentation"
      className={`fixed inset-0 pointer-events-none select-none overflow-hidden z-0 flex items-center justify-center transition-opacity duration-700 ${techGridsOpacity} ${className}`}
    >
      {/* 1. Concentric technical grids and vector guides */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 1000"
          className="w-[120vw] h-[120vw] max-w-none transform-gpu"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="vignette-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={mode === "dark" ? "#020617" : "#F8FBFF"} stopOpacity="0" />
              <stop offset="85%" stopColor={mode === "dark" ? "#020617" : "#F8FBFF"} stopOpacity="0.4" />
              <stop offset="100%" stopColor={mode === "dark" ? "#020617" : "#F8FBFF"} stopOpacity="0.95" />
            </radialGradient>

            <linearGradient id="glow-line" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
            </linearGradient>
            
            {/* Curved text route definitions */}
            <path
              id="textPath-inner"
              d="M 500,500 m -160,0 a 160,160 0 1,1 320,0 a 160,160 0 1,1 -320,0"
            />
            <path
              id="textPath-outer"
              d="M 500,500 m -240,0 a 240,240 0 1,1 480,0 a 240,240 0 1,1 -480,0"
            />
          </defs>

          {/* Vignette fade layout to prevent edge cutting */}
          <rect cx="0" cy="0" width="1000" height="1000" fill="url(#vignette-grad)" />

          {/* Grid lines - Technical blueprint coordinates */}
          {/* Vertical axis line */}
          <line x1="500" y1="50" x2="500" y2="950" stroke={gridColor} strokeWidth="1" strokeDasharray="3 9" />
          {/* Horizontal axis line */}
          <line x1="50" y1="500" x2="950" y2="500" stroke={gridColor} strokeWidth="1" strokeDasharray="3 9" />

          {/* Concentric Circle Guides */}
          {/* Circle 1 - Inner boundary */}
          <circle cx="500" cy="500" r="100" stroke={ringColor} strokeWidth="1" />
          
          {/* Circle 2 - Dash Ring */}
          <circle cx="500" cy="500" r="160" stroke={dashColor} strokeWidth="1" strokeDasharray="5 5" className="animate-[spin_180s_linear_infinite]" />

          {/* Circle 3 - Solid Outer Boundary with coordinate cross markers */}
          <circle cx="500" cy="500" r="240" stroke={ringColor} strokeWidth="1.5" />
          
          {/* Circle 4 - Large Outer Dash Orbit */}
          <circle cx="500" cy="500" r="320" stroke={gridColor} strokeWidth="1" strokeDasharray="1 15" className="animate-[spin_240s_linear_infinite_reverse]" />
          
          {/* Circle 5 - Giant atmospheric perimeter */}
          <circle cx="500" cy="500" r="420" stroke={gridColor} strokeWidth="0.5" />

          {/* Coordinates details - crosshairs */}
          <path d="M 500,230 L 500,250 M 500,750 L 500,770 M 230,500 L 250,500 M 750,500 L 770,500" stroke={crosshairColor} strokeWidth="2" />
          <path d="M 500,130 L 500,140 M 500,860 L 500,870 M 130,500 L 140,500 M 870,500 L 880,500" stroke={crosshairColor} strokeWidth="1.5" />

          {/* Diagonal indicator lines */}
          <line x1="200" y1="200" x2="800" y2="800" stroke={gridColor} strokeWidth="0.5" strokeDasharray="2 18" />
          <line x1="200" y1="800" x2="800" y2="200" stroke={gridColor} strokeWidth="0.5" strokeDasharray="2 18" />

          {/* Decorative small node points on diagonal intersections */}
          <circle cx="300" cy="300" r="2" fill={crosshairColor} />
          <circle cx="700" cy="300" r="2" fill={crosshairColor} />
          <circle cx="300" cy="700" r="2" fill={crosshairColor} />
          <circle cx="700" cy="700" r="2" fill={crosshairColor} />

          {/* Dynamic rotating outer compass nodes */}
          <g className="animate-[spin_320s_linear_infinite]">
            <circle cx="500" cy="80" r="3" fill="#06b6d4" opacity="0.3" />
            <circle cx="500" cy="920" r="3" fill="#3b82f6" opacity="0.3" />
            <circle cx="80" cy="500" r="3" fill="#10b981" opacity="0.3" />
            <circle cx="920" cy="500" r="3" fill="#f59e0b" opacity="0.3" />
          </g>

          {/* 2. Curved Technical Text Path (SVG typography) */}
          <g className="animate-[spin_400s_linear_infinite] origin-center">
            <text className="font-mono text-[9px] uppercase tracking-[0.2em] fill-cyan-500/15 font-bold">
              <textPath href="#textPath-inner" startOffset="0%">
                RecXpats • recxpats Operations Control Deck • Biosecurity Zone Safe Link •
              </textPath>
            </text>
          </g>

          <g className="animate-[spin_600s_linear_infinite_reverse] origin-center">
            <text className="font-mono text-[8px] uppercase tracking-[0.25em] fill-blue-500/15 font-medium">
              <textPath href="#textPath-outer" startOffset="50%">
                RecXpats • Real-Time Environmental Diagnosis Active • Authorized Personnel Only •
              </textPath>
            </text>
          </g>

        </svg>
      </div>

      {/* 3. Central Brand Logo with optimized opacity */}
      <div className={`absolute flex flex-col items-center justify-center transition-all duration-500 scale-[6] md:scale-[7.5] ${logoOpacity} transform-gpu`}>
        <AppLogo iconOnly size="lg" mode={mode} />
      </div>
    </div>
  );
}
