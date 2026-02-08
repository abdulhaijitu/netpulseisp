import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenantContext } from "@/contexts/TenantContext";

function useTenantId() {
  const { currentTenant } = useTenantContext();
  return currentTenant?.id ?? null;
}

export interface NotificationLog {
  id: string;
  title: string;
  body: string;
  notification_type: string;
  status: string;
  sent_at: string | null;
  created_at: string;
  error_message: string | null;
  data: Record<string, unknown> | null;
  customer_id: string | null;
  customer_name?: string;
  customer_phone?: string;
}

export function useNotificationLogs(filters?: {
  type?: string;
  status?: string;
  search?: string;
}) {
  const currentTenantId = useTenantId();

  return useQuery({
    queryKey: ["notificationLogs", currentTenantId, filters],
    queryFn: async () => {
      if (!currentTenantId) return [];

      let query = supabase
        .from("notification_logs")
        .select(`
          *,
          customers:customer_id (name, phone)
        `)
        .eq("tenant_id", currentTenantId)
        .order("created_at", { ascending: false })
        .limit(200);

      if (filters?.type && filters.type !== "all") {
        query = query.eq("notification_type", filters.type);
      }
      if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }
      if (filters?.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,body.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((log: any) => ({
        ...log,
        customer_name: log.customers?.name || null,
        customer_phone: log.customers?.phone || null,
        customers: undefined,
      })) as NotificationLog[];
    },
    enabled: !!currentTenantId,
  });
}

export function useNotificationStats() {
  const currentTenantId = useTenantId();

  return useQuery({
    queryKey: ["notificationStats", currentTenantId],
    queryFn: async () => {
      if (!currentTenantId) return null;

      const { data, error } = await supabase
        .from("notification_logs")
        .select("status, notification_type, created_at")
        .eq("tenant_id", currentTenantId);

      if (error) throw error;

      const total = data.length;
      const sent = data.filter((d) => d.status === "sent").length;
      const failed = data.filter((d) => d.status === "failed").length;
      const pending = data.filter((d) => d.status === "pending").length;

      const now = new Date();
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const recentCount = data.filter(
        (d) => new Date(d.created_at) >= last7Days
      ).length;

      // Type breakdown
      const typeBreakdown: Record<string, number> = {};
      data.forEach((d) => {
        typeBreakdown[d.notification_type] =
          (typeBreakdown[d.notification_type] || 0) + 1;
      });

      return {
        total,
        sent,
        failed,
        pending,
        recentCount,
        successRate: total > 0 ? Math.round((sent / total) * 100) : 0,
        typeBreakdown,
      };
    },
    enabled: !!currentTenantId,
  });
}
