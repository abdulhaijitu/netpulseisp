import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenantContext } from "@/contexts/TenantContext";

export function useNetworkSyncQueue(limit = 20) {
  const { currentTenant } = useTenantContext();

  return useQuery({
    queryKey: ["network-sync-queue", currentTenant?.id, limit],
    queryFn: async () => {
      if (!currentTenant?.id) return [];
      const { data, error } = await supabase
        .from("network_sync_queue")
        .select(`
          *,
          customers:customer_id (name),
          network_integrations:integration_id (name, provider_type)
        `)
        .eq("tenant_id", currentTenant.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    enabled: !!currentTenant?.id,
  });
}
