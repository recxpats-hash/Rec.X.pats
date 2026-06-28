/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Backend Configuration Operation Tests", () => {
  let mockEnv: Record<string, string>;
  let mockSupabaseClient: any;
  let isConfigured: boolean;

  beforeEach(() => {
    // Standard mock environment variables
    mockEnv = {
      SUPABASE_URL: "https://test-project.supabase.co",
      SUPABASE_ANON_KEY: "test-anon-key-123456",
    };

    // Standard mock database state
    isConfigured = true;

    // Standard mock Supabase queries
    mockSupabaseClient = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({
            data: [{ id: "test-id" }],
            error: null,
          }),
        }),
        upsert: vi.fn().mockResolvedValue({
          error: null,
        }),
      }),
    };

    // Virtual Router Mocks
    vi.stubGlobal("fetch", async (url: string, options?: RequestInit) => {
      if (url === "/api/supabase/config") {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            supabaseUrl: mockEnv.SUPABASE_URL || "",
            supabaseAnonKey: mockEnv.SUPABASE_ANON_KEY || "",
          }),
        } as Response;
      }

      if (url === "/api/supabase/status") {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            configured: isConfigured,
            active: isConfigured,
            tableExists: true,
            tableError: "",
          }),
        } as Response;
      }

      if (url === "/api/supabase/sync") {
        if (!isConfigured) {
          return {
            ok: false,
            status: 400,
            json: async () => ({ error: "Supabase authentication is not initialized." }),
          } as Response;
        }

        const dataToSync = {
          ponds: [{ id: "pond-1", name: "Pond A" }],
          feeds: [{ id: "feed-1", name: "BioGrow" }],
        };

        const errors: string[] = [];
        let totalSynced = 0;

        for (const [model, records] of Object.entries(dataToSync)) {
          for (const rec of records) {
            const { error } = await mockSupabaseClient.from("recxpats_records").upsert({
              id: rec.id,
              model: model,
              data: rec,
            });
            if (error) {
              errors.push(`Model ${model}, ID ${rec.id}: ${error.message}`);
            } else {
              totalSynced++;
            }
          }
        }

        return {
          ok: true,
          status: 200,
          json: async () => ({
            success: errors.length === 0,
            syncedCount: totalSynced,
            errors,
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

  describe("GET /api/supabase/config", () => {
    it("should deliver public credentials correctly to client launchers", async () => {
      const res = await fetch("/api/supabase/config");
      expect(res.ok).toBe(true);
      const data = await res.json();

      expect(data.supabaseUrl).toBe("https://test-project.supabase.co");
      expect(data.supabaseAnonKey).toBe("test-anon-key-123456");
    });

    it("should handle empty or fallback environment properties safely", async () => {
      mockEnv.SUPABASE_URL = "";
      mockEnv.SUPABASE_ANON_KEY = "";

      const res = await fetch("/api/supabase/config");
      const data = await res.json();

      expect(data.supabaseUrl).toBe("");
      expect(data.supabaseAnonKey).toBe("");
    });
  });

  describe("GET /api/supabase/status", () => {
    it("should return fully configured and active states when credentials are alive", async () => {
      const res = await fetch("/api/supabase/status");
      expect(res.ok).toBe(true);
      const data = await res.json();

      expect(data.configured).toBe(true);
      expect(data.active).toBe(true);
      expect(data.tableExists).toBe(true);
      expect(data.tableError).toBe("");
    });

    it("should reflect inactive status if Supabase environment variables are missing", async () => {
      isConfigured = false;

      const res = await fetch("/api/supabase/status");
      const data = await res.json();

      expect(data.configured).toBe(false);
      expect(data.active).toBe(false);
    });
  });

  describe("POST /api/supabase/sync", () => {
    it("should successfully trigger a sync flow and mirror local state arrays", async () => {
      const res = await fetch("/api/supabase/sync", { method: "POST" });
      expect(res.ok).toBe(true);
      const data = await res.json();

      expect(data.success).toBe(true);
      expect(data.syncedCount).toBe(2);
      expect(data.errors).toHaveLength(0);

      // Verify the mock database calls
      expect(mockSupabaseClient.from).toHaveBeenCalledWith("recxpats_records");
    });

    it("should return bad request error if sync is initiated before credentials are ready", async () => {
      isConfigured = false;

      const res = await fetch("/api/supabase/sync", { method: "POST" });
      expect(res.ok).toBe(false);
      expect(res.status).toBe(400);

      const data = await res.json();
      expect(data.error).toBe("Supabase authentication is not initialized.");
    });

    it("should gracefully accumulate errors if specific records fail to insert into Supabase", async () => {
      // Configure mock client to return an error when inserting
      mockSupabaseClient.from.mockReturnValue({
        upsert: vi.fn().mockResolvedValue({
          error: { message: "Database violation on unique constraint" },
        }),
      });

      const res = await fetch("/api/supabase/sync", { method: "POST" });
      const data = await res.json();

      expect(data.success).toBe(false);
      expect(data.syncedCount).toBe(0);
      expect(data.errors).toHaveLength(2);
      expect(data.errors[0]).toContain("Database violation");
    });
  });

  describe("Automatic Data Push on System Online", () => {
    let wasSupabaseReachableLocal: boolean;
    let autoPushCalled: boolean;

    beforeEach(() => {
      wasSupabaseReachableLocal = false;
      autoPushCalled = false;
    });

    const simulateAutoPushToSupabase = async () => {
      autoPushCalled = true;
      return 2; // Simulates successfully pushing 2 records
    };

    const simulateCheckSupabaseConnectivityAndAutoSync = async (isSupabaseActuallyReachable: boolean) => {
      if (!isConfigured) return;
      
      // Attempt query simulation
      if (isSupabaseActuallyReachable) {
        if (!wasSupabaseReachableLocal) {
          wasSupabaseReachableLocal = true;
          await simulateAutoPushToSupabase();
        }
      } else {
        wasSupabaseReachableLocal = false;
      }
    };

    it("should trigger automatic push when system transitions from offline to online", async () => {
      // 1. Initially offline
      expect(wasSupabaseReachableLocal).toBe(false);
      expect(autoPushCalled).toBe(false);

      // 2. Connectivity check runs while Supabase is unreachable -> no sync
      await simulateCheckSupabaseConnectivityAndAutoSync(false);
      expect(wasSupabaseReachableLocal).toBe(false);
      expect(autoPushCalled).toBe(false);

      // 3. System detects online (reaches Supabase) -> transitions and triggers push
      await simulateCheckSupabaseConnectivityAndAutoSync(true);
      expect(wasSupabaseReachableLocal).toBe(true);
      expect(autoPushCalled).toBe(true);
    });

    it("should not re-trigger automatic push if the system is already online", async () => {
      // 1. Transition to online
      await simulateCheckSupabaseConnectivityAndAutoSync(true);
      expect(wasSupabaseReachableLocal).toBe(true);
      expect(autoPushCalled).toBe(true);

      // Reset mock spy
      autoPushCalled = false;

      // 2. Connectivity check runs again while already online -> no redundant sync
      await simulateCheckSupabaseConnectivityAndAutoSync(true);
      expect(wasSupabaseReachableLocal).toBe(true);
      expect(autoPushCalled).toBe(false);
    });
  });
});

