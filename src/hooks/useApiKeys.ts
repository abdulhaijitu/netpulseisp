import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentTenant } from "@/hooks/useTenant";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  scope: "read_only" | "read_write";
  is_active: boolean;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
  revoked_at: string | null;
}

export interface ApiLog {
  id: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms: number | null;
  created_at: string;
}

// Generate a secure random API key
function generateApiKey(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const key = Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
  return `isp_${key}`;
}

// Hash API key using SHA-256 (browser-compatible)
async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function useApiKeys() {
  const { data: currentTenant } = useCurrentTenant();

  return useQuery({
    queryKey: ["apiKeys", currentTenant?.id],
    queryFn: async () => {
      if (!currentTenant?.id) return [];

      const { data, error } = await supabase
        .from("api_keys")
        .select("id, name, key_prefix, scope, is_active, last_used_at, expires_at, created_at, revoked_at")
        .eq("tenant_id", currentTenant.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ApiKey[];
    },
    enabled: !!currentTenant?.id,
  });
}

export function useApiLogs(limit = 50) {
  const { data: currentTenant } = useCurrentTenant();

  return useQuery({
    queryKey: ["apiLogs", currentTenant?.id, limit],
    queryFn: async () => {
      if (!currentTenant?.id) return [];

      const { data, error } = await supabase
        .from("api_logs")
        .select("id, endpoint, method, status_code, response_time_ms, created_at")
        .eq("tenant_id", currentTenant.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as ApiLog[];
    },
    enabled: !!currentTenant?.id,
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();
  const { data: currentTenant } = useCurrentTenant();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ name, scope }: { name: string; scope: "read_only" | "read_write" }) => {
      if (!currentTenant?.id || !user?.id) throw new Error("Missing tenant or user");

      const rawKey = generateApiKey();
      const keyHash = await hashApiKey(rawKey);
      const keyPrefix = rawKey.substring(0, 12) + "...";

      const { data, error } = await supabase
        .from("api_keys")
        .insert({
          tenant_id: currentTenant.id,
          name,
          key_hash: keyHash,
          key_prefix: keyPrefix,
          scope,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Return both the database record and the raw key (only shown once)
      return { ...data, rawKey };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys", currentTenant?.id] });
      toast.success("API key created successfully");
    },
    onError: (error) => {
      console.error("Error creating API key:", error);
      toast.error("Failed to create API key");
    },
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();
  const { data: currentTenant } = useCurrentTenant();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (keyId: string) => {
      if (!currentTenant?.id || !user?.id) throw new Error("Missing tenant or user");

      const { error } = await supabase
        .from("api_keys")
        .update({
          is_active: false,
          revoked_at: new Date().toISOString(),
          revoked_by: user.id,
        })
        .eq("id", keyId)
        .eq("tenant_id", currentTenant.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys", currentTenant?.id] });
      toast.success("API key revoked successfully");
    },
    onError: (error) => {
      console.error("Error revoking API key:", error);
      toast.error("Failed to revoke API key");
    },
  });
}

export function useToggleApiAccess() {
  const queryClient = useQueryClient();
  const { data: currentTenant } = useCurrentTenant();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!currentTenant?.id) throw new Error("Missing tenant");

      const { error } = await supabase
        .from("tenants")
        .update({ api_enabled: enabled })
        .eq("id", currentTenant.id);

      if (error) throw error;
    },
    onSuccess: (_, enabled) => {
      queryClient.invalidateQueries({ queryKey: ["currentTenant", user?.id] });
      toast.success(`API access ${enabled ? "enabled" : "disabled"}`);
    },
    onError: (error) => {
      console.error("Error toggling API access:", error);
      toast.error("Failed to update API access");
    },
  });
}
