import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenantContext } from "@/contexts/TenantContext";
import { useToast } from "@/hooks/use-toast";

// Define types for the new tables until the types are auto-generated
interface NetworkIntegration {
  id: string;
  tenant_id: string;
  provider_type: "mikrotik" | "radius" | "custom";
  name: string;
  is_enabled: boolean;
  host: string;
  port: number;
  username: string;
  credentials_encrypted: string | null;
  sync_mode: "manual" | "scheduled" | "event_driven";
  sync_interval_minutes: number;
  last_sync_at: string | null;
  last_sync_status: "pending" | "in_progress" | "success" | "failed" | "retrying" | null;
  radius_secret_encrypted: string | null;
  radius_auth_port: number;
  radius_acct_port: number;
  mikrotik_use_ssl: boolean;
  mikrotik_ppp_profile: string | null;
  mikrotik_address_list: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

interface NetworkIntegrationInsert {
  provider_type: "mikrotik" | "radius" | "custom";
  name: string;
  is_enabled?: boolean;
  host: string;
  port?: number;
  username: string;
  credentials_encrypted?: string;
  sync_mode?: "manual" | "scheduled" | "event_driven";
  sync_interval_minutes?: number;
  radius_secret_encrypted?: string;
  radius_auth_port?: number;
  radius_acct_port?: number;
  mikrotik_use_ssl?: boolean;
  mikrotik_ppp_profile?: string;
  mikrotik_address_list?: string;
}

export function useNetworkIntegrations() {
  const { currentTenant } = useTenantContext();

  return useQuery({
    queryKey: ["network-integrations", currentTenant?.id],
    queryFn: async () => {
      if (!currentTenant?.id) return [];

      const { data, error } = await supabase
        .from("network_integrations")
        .select("*")
        .eq("tenant_id", currentTenant.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as NetworkIntegration[];
    },
    enabled: !!currentTenant?.id,
  });
}

export function useNetworkIntegration(integrationId: string | null) {
  return useQuery({
    queryKey: ["network-integration", integrationId],
    queryFn: async () => {
      if (!integrationId) return null;

      const { data, error } = await supabase
        .from("network_integrations")
        .select("*")
        .eq("id", integrationId)
        .single();

      if (error) throw error;
      return data as NetworkIntegration;
    },
    enabled: !!integrationId,
  });
}

export function useCreateNetworkIntegration() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { currentTenant } = useTenantContext();

  return useMutation({
    mutationFn: async (integration: Omit<NetworkIntegrationInsert, "tenant_id">) => {
      if (!currentTenant?.id) throw new Error("No tenant selected");

      const { data, error } = await supabase
        .from("network_integrations")
        .insert({
          ...integration,
          tenant_id: currentTenant.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["network-integrations"] });
      toast({
        title: "ইন্টিগ্রেশন তৈরি হয়েছে",
        description: "নেটওয়ার্ক ইন্টিগ্রেশন সফলভাবে তৈরি হয়েছে।",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "ত্রুটি",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateNetworkIntegration() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<NetworkIntegration>;
    }) => {
      const { data, error } = await supabase
        .from("network_integrations")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["network-integrations"] });
      toast({
        title: "আপডেট হয়েছে",
        description: "ইন্টিগ্রেশন সেটিংস আপডেট হয়েছে।",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "ত্রুটি",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteNetworkIntegration() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("network_integrations")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["network-integrations"] });
      toast({
        title: "মুছে ফেলা হয়েছে",
        description: "ইন্টিগ্রেশন সফলভাবে মুছে ফেলা হয়েছে।",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "ত্রুটি",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useNetworkSyncLogs(integrationId?: string, limit = 20) {
  const { currentTenant } = useTenantContext();

  return useQuery({
    queryKey: ["network-sync-logs", currentTenant?.id, integrationId, limit],
    queryFn: async () => {
      if (!currentTenant?.id) return [];

      let query = supabase
        .from("network_sync_logs")
        .select(`
          *,
          customers:customer_id (name),
          network_integrations:integration_id (name, provider_type)
        `)
        .eq("tenant_id", currentTenant.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (integrationId) {
        query = query.eq("integration_id", integrationId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!currentTenant?.id,
  });
}

export function useTestConnection() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (integrationId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/network-sync`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            action: "test_connection",
            integration_id: integrationId,
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Connection test failed");
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: "সংযোগ সফল",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "সংযোগ ব্যর্থ",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useSyncCustomer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      integrationId,
      customerId,
      action,
      triggeredBy = "manual",
    }: {
      integrationId: string;
      customerId: string;
      action: "enable" | "disable" | "update_speed";
      triggeredBy?: string;
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/network-sync`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            action,
            integration_id: integrationId,
            customer_id: customerId,
            triggered_by: triggeredBy,
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Sync failed");
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["network-sync-logs"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({
        title: "সিঙ্ক সফল",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "সিঙ্ক ব্যর্থ",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
