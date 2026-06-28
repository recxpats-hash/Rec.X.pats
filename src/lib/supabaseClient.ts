import { createClient } from "@supabase/supabase-js";

// Attempt to read from client environment variables (VITE_) or fall back to dynamic async resolution
const VITE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "";
const VITE_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

let supabaseInstance: ReturnType<typeof createClient> | null = null;
let isInitialized = false;

if (VITE_URL && VITE_KEY && !VITE_URL.includes("your-supabase") && !VITE_KEY.includes("anon-key")) {
  supabaseInstance = createClient(VITE_URL, VITE_KEY);
  isInitialized = true;
  console.log("Supabase Client initialized via client-side configuration.");
}

/**
 * Returns the Supabase client instance if configured, or attempts to retrieve configuration
 * from the backend server dynamically.
 */
export async function getSupabaseClient(): Promise<ReturnType<typeof createClient> | null> {
  if (supabaseInstance) return supabaseInstance;
  
  try {
    const res = await fetch("/api/supabase/config");
    if (res.ok) {
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const config = await res.json().catch(() => null);
        if (config && config.supabaseUrl && config.supabaseAnonKey && 
            !config.supabaseUrl.includes("your-supabase") && 
            !config.supabaseAnonKey.includes("anon-key")) {
          supabaseInstance = createClient(config.supabaseUrl, config.supabaseAnonKey);
          isInitialized = true;
          console.log("Supabase Client dynamically initialized from server configuration.");
          return supabaseInstance;
        }
      } else {
        console.warn("Retrieved HTML or non-JSON config response. Fallback to offline mode.");
      }
    }
  } catch (error) {
    console.warn("Could not retrieve Supabase configuration from server yet:", error);
  }
  
  return null;
}

/**
 * Checks if Supabase integration is currently healthy and active.
 */
export async function checkSupabaseStatus(): Promise<{
  configured: boolean;
  active: boolean;
  tableExists?: boolean;
  tableError?: string;
}> {
  try {
    const res = await fetch("/api/supabase/status");
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn("Could not retrieve Supabase status from server:", error);
  }
  return { configured: isInitialized, active: isInitialized };
}

/**
 * Uploads a base64 encoded photo or general file attachment to Supabase Storage via proxy.
 * This guarantees the request works within sandboxed iframe headers securely.
 */
export async function uploadToSupabaseStorage(
  fileData: string,
  fileName: string,
  bucket: string = "recxpats-assets"
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const res = await fetch("/api/supabase/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileData, fileName, bucket })
    });
    
    const result = await res.json();
    if (res.ok && result.success) {
      return { success: true, url: result.url };
    } else {
      return { success: false, error: result.error || "Server failed to upload." };
    }
  } catch (err: any) {
    return { success: false, error: err.message || "Network error uploading file." };
  }
}
