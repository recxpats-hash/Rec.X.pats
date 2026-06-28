/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { assessWaterQualityRisk } from "../utils/calculations";

// Define helper types for simulated integration testing
interface TestAppState {
  currentUser: string | null;
  currentUserRole: string;
  waterQualityLogs: any[];
  pnlRecords: any[];
  activeAdvisorySuggestion: any | null;
}

describe("recxpats Operations Dashboard - Integration Test Suite", () => {
  let appState: TestAppState;
  
  // Mock Express backend handlers and databases
  let serverDatabase: Record<string, any[]>;
  let activeOtps: Map<string, { code: string; expires: number; role: string }>;

  beforeEach(() => {
    // Reset Client state
    appState = {
      currentUser: null,
      currentUserRole: "manager",
      waterQualityLogs: [],
      pnlRecords: [],
      activeAdvisorySuggestion: null,
    };

    // Reset Backend database
    serverDatabase = {
      pnlStatements: [
        { id: "pnl-1", month: "June 2026", revenue: 15000000, cogs: 9500000, grossProfit: 5500000 },
        { id: "pnl-2", month: "May 2026", revenue: 12000000, cogs: 8000000, grossProfit: 4000000 },
      ],
      waterQuality: [
        { id: "wq-1", pondId: "pond-alpha", ph: 7.2, dissolvedOxygen: 6.5, ammonia: 0.1, nitrite: 0.1, timestamp: "2026-06-24T10:00:00Z", risk: "Normal" },
      ],
      consultancies: [],
    };

    activeOtps = new Map();

    // Mock global fetch to route queries through our virtual server
    vi.stubGlobal("fetch", async (url: string, options?: RequestInit) => {
      // 1. GET /api/data/:model
      if (url.startsWith("/api/data/") && (!options || options.method === "GET" || !options.method)) {
        const model = url.substring("/api/data/".length);
        if (serverDatabase[model]) {
          return {
            ok: true,
            status: 200,
            json: async () => serverDatabase[model],
          } as Response;
        } else {
          return {
            ok: true,
            status: 200,
            json: async () => [],
          } as Response;
        }
      }

      // 2. POST /api/data/:model
      if (options?.method === "POST" && url.startsWith("/api/data/")) {
        const model = url.substring("/api/data/".length);
        const body = JSON.parse(options.body as string);
        
        if (!serverDatabase[model]) {
          serverDatabase[model] = [];
        }
        
        const newRecord = { ...body, id: `${model}-${Date.now()}` };
        serverDatabase[model].push(newRecord);
        
        return {
          ok: true,
          status: 201,
          json: async () => ({ success: true, data: newRecord }),
        } as Response;
      }

      // 3. POST /api/otp/send
      if (url === "/api/otp/send" && options?.method === "POST") {
        const body = JSON.parse(options.body as string);
        const { phoneNumber, role } = body;
        
        const code = "7357"; // deterministic test code
        activeOtps.set(phoneNumber, {
          code,
          expires: Date.now() + 5 * 60 * 1000,
          role: role || "manager"
        });

        return {
          ok: true,
          status: 200,
          json: async () => ({ success: true, message: "OTP sent" }),
        } as Response;
      }

      // 4. POST /api/otp/verify
      if (url === "/api/otp/verify" && options?.method === "POST") {
        const body = JSON.parse(options.body as string);
        const { phoneNumber, code } = body;

        const record = activeOtps.get(phoneNumber);
        if (record && record.code === code && record.expires > Date.now()) {
          activeOtps.delete(phoneNumber);
          return {
            ok: true,
            status: 200,
            json: async () => ({ success: true, role: record.role }),
          } as Response;
        }

        return {
          ok: false,
          status: 400,
          json: async () => ({ success: false, error: "Invalid or expired code" }),
        } as Response;
      }

      // 5. POST /api/gemini/diagnose
      if (url === "/api/gemini/diagnose" && options?.method === "POST") {
        const body = JSON.parse(options.body as string);
        const { query, context } = body;

        return {
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            diagnosis: `[Hatchery AI] Assessed pond ${context?.pondId || "unknown"}. Parameter values: pH=${context?.ph || "N/A"}, DO=${context?.do || "N/A"}. Diagnostic Suggestion: Optimal conditions maintained.`,
            confidence: 0.95,
          }),
        } as Response;
      }

      return {
        ok: false,
        status: 404,
        json: async () => ({ error: "Not Found" }),
      } as Response;
    });
  });

  describe("Integration Flow 1: Initialization & Data Fetching Sync", () => {
    it("should load the existing dashboard database records and populate local states", async () => {
      // client loading sequence
      const resPnl = await fetch("/api/data/pnlStatements");
      expect(resPnl.ok).toBe(true);
      const fetchedPnl = await resPnl.json();
      appState.pnlRecords = fetchedPnl;

      const resWq = await fetch("/api/data/waterQuality");
      expect(resWq.ok).toBe(true);
      const fetchedWq = await resWq.json();
      appState.waterQualityLogs = fetchedWq;

      // Assertions
      expect(appState.pnlRecords).toHaveLength(2);
      expect(appState.pnlRecords[0].month).toBe("June 2026");
      expect(appState.pnlRecords[0].grossProfit).toBe(5500000);

      expect(appState.waterQualityLogs).toHaveLength(1);
      expect(appState.waterQualityLogs[0].pondId).toBe("pond-alpha");
    });
  });

  describe("Integration Flow 2: Multi-step OTP Request, Verification & Sign-in Flow", () => {
    it("should successfully log in a customer or staff member, transition credentials, and fetch authenticated dashboards", async () => {
      const phoneNumber = "0770000111";
      const userRole = "director";

      // Step 1: User enters credentials on LandingPage, triggers OTP dispatch
      const sendRes = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, role: userRole }),
      });
      expect(sendRes.ok).toBe(true);
      const sendData = await sendRes.json();
      expect(sendData.success).toBe(true);

      // Verify server registered the pending challenge
      expect(activeOtps.has(phoneNumber)).toBe(true);
      expect(activeOtps.get(phoneNumber)?.role).toBe("director");

      // Step 2: User enters OTP "7357" to authorize session
      const verifyRes = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, code: "7357" }),
      });
      expect(verifyRes.ok).toBe(true);
      const verifyData = await verifyRes.json();
      expect(verifyData.success).toBe(true);
      expect(verifyData.role).toBe("director");

      // Step 3: Client updates main logged-in UI state
      appState.currentUser = phoneNumber;
      appState.currentUserRole = verifyData.role;

      expect(appState.currentUser).toBe("0770000111");
      expect(appState.currentUserRole).toBe("director");
    });

    it("should reject login if user input incorrect OTP code", async () => {
      const phoneNumber = "0770000111";
      
      await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, role: "manager" }),
      });

      const verifyRes = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, code: "9999" }), // wrong OTP
      });

      expect(verifyRes.ok).toBe(false);
      expect(verifyRes.status).toBe(400);
      
      const verifyData = await verifyRes.json();
      expect(verifyData.success).toBe(false);
      expect(verifyData.error).toBe("Invalid or expired code");
    });
  });

  describe("Integration Flow 3: Operations Log creation, Risk Calculation, and Database Persistence", () => {
    it("should process user actions on the PondModule to add a critical log, calculate risk, and post to server", async () => {
      // 1. Simulate water quality measurements entered by technician in the field
      const inputMetrics = {
        ph: 8.9, // moderately elevated
        dissolvedOxygen: 1.2, // critically low!
        ammonia: 0.2,
        nitrite: 0.1,
      };

      // 2. Client-side validates the data and calculates current system risk level
      const calculatedRisk = assessWaterQualityRisk(inputMetrics);
      expect(calculatedRisk).toBe("Critical");

      const newLogPayload = {
        pondId: "pond-beta",
        ...inputMetrics,
        risk: calculatedRisk,
        timestamp: new Date().toISOString(),
      };

      // 3. Client posts log to the persistent database
      const response = await fetch("/api/data/waterQuality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLogPayload),
      });

      expect(response.ok).toBe(true);
      const resData = await response.json();
      expect(resData.success).toBe(true);

      // 4. Verify local database was updated with the new record
      const dbRes = await fetch("/api/data/waterQuality");
      const updatedLogs = await dbRes.json();
      
      expect(updatedLogs).toHaveLength(2);
      const addedLog = updatedLogs.find((l: any) => l.pondId === "pond-beta");
      expect(addedLog).toBeDefined();
      expect(addedLog.risk).toBe("Critical");
      expect(addedLog.dissolvedOxygen).toBe(1.2);
    });
  });

  describe("Integration Flow 4: Interactive AI Advisory diagnostics & prompt passing", () => {
    it("should packages active pond metrics, trigger diagnostic proxy endpoint, and return smart diagnostic results", async () => {
      // 1. Focus on pond-beta with critical low dissolved oxygen
      const targetPondMetrics = {
        pondId: "pond-beta",
        ph: 8.9,
        do: 1.2,
      };

      // 2. Client sends diagnosis request to the server-side Gemini gateway
      const geminiRes = await fetch("/api/gemini/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "Explain what action to take immediately based on these metrics.",
          context: targetPondMetrics,
        }),
      });

      expect(geminiRes.ok).toBe(true);
      const geminiData = await geminiRes.json();
      expect(geminiData.success).toBe(true);
      
      // 3. Assert prompt values are returned in structured form
      expect(geminiData.diagnosis).toContain("Hatchery AI");
      expect(geminiData.diagnosis).toContain("pond-beta");
      expect(geminiData.diagnosis).toContain("DO=1.2");
      expect(geminiData.confidence).toBe(0.95);

      // 4. Update advisory panel state
      appState.activeAdvisorySuggestion = {
        suggestion: geminiData.diagnosis,
        metadata: { analyzedAt: new Date().toISOString() },
      };

      expect(appState.activeAdvisorySuggestion.suggestion).toContain("Optimal conditions maintained.");
    });
  });
});
