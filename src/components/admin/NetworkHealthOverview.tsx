import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Network, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock,
  RefreshCw,
  Server
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { bn } from "date-fns/locale";

interface NetworkIntegrationWithTenant {
  id: string;
  name: string;
  provider_type: "mikrotik" | "radius" | "custom";
  is_enabled: boolean;
  last_sync_at: string | null;
  last_sync_status: "pending" | "in_progress" | "success" | "failed" | "retrying" | null;
  host: string;
  tenant: {
    id: string;
    name: string;
    subdomain: string;
  };
}

interface SyncStats {
  total: number;
  success: number;
  failed: number;
  pending: number;
}

const statusConfig = {
  success: { label: "সফল", icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-500/10" },
  failed: { label: "ব্যর্থ", icon: XCircle, color: "text-red-500", bgColor: "bg-red-500/10" },
  in_progress: { label: "চলমান", icon: RefreshCw, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  pending: { label: "অপেক্ষমাণ", icon: Clock, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  retrying: { label: "পুনরায়", icon: RefreshCw, color: "text-orange-500", bgColor: "bg-orange-500/10" },
};

const providerLabels = {
  mikrotik: "MikroTik",
  radius: "RADIUS",
  custom: "কাস্টম",
};

export function NetworkHealthOverview() {
  // Fetch all network integrations with tenant info
  const { data: integrations, isLoading: integrationsLoading } = useQuery({
    queryKey: ["admin-network-integrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("network_integrations")
        .select(`
          id,
          name,
          provider_type,
          is_enabled,
          last_sync_at,
          last_sync_status,
          host,
          tenant:tenants!network_integrations_tenant_id_fkey (
            id,
            name,
            subdomain
          )
        `)
        .order("last_sync_at", { ascending: false, nullsFirst: false });

      if (error) throw error;
      return data as unknown as NetworkIntegrationWithTenant[];
    },
  });

  // Fetch recent sync logs stats
  const { data: syncStats, isLoading: syncStatsLoading } = useQuery({
    queryKey: ["admin-sync-stats"],
    queryFn: async () => {
      const last24Hours = new Date();
      last24Hours.setHours(last24Hours.getHours() - 24);

      const { data, error } = await supabase
        .from("network_sync_logs")
        .select("status")
        .gte("created_at", last24Hours.toISOString());

      if (error) throw error;

      const stats: SyncStats = {
        total: data.length,
        success: data.filter(l => l.status === "success").length,
        failed: data.filter(l => l.status === "failed").length,
        pending: data.filter(l => l.status === "pending" || l.status === "in_progress").length,
      };

      return stats;
    },
  });

  const isLoading = integrationsLoading || syncStatsLoading;

  const enabledIntegrations = integrations?.filter(i => i.is_enabled) ?? [];
  const disabledIntegrations = integrations?.filter(i => !i.is_enabled) ?? [];
  const failedIntegrations = integrations?.filter(i => i.last_sync_status === "failed") ?? [];

  const healthScore = enabledIntegrations.length > 0
    ? Math.round(((enabledIntegrations.length - failedIntegrations.length) / enabledIntegrations.length) * 100)
    : 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          নেটওয়ার্ক ইন্টিগ্রেশন হেলথ
        </CardTitle>
        <CardDescription>সকল ISP-এর নেটওয়ার্ক সিঙ্ক স্ট্যাটাস</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Health Score & Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <div className={`text-3xl font-bold ${healthScore >= 80 ? "text-green-500" : healthScore >= 50 ? "text-yellow-500" : "text-red-500"}`}>
              {isLoading ? <Skeleton className="h-9 w-16 mx-auto" /> : `${healthScore}%`}
            </div>
            <p className="text-sm text-muted-foreground mt-1">হেলথ স্কোর</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            {isLoading ? (
              <Skeleton className="h-9 w-16 mx-auto" />
            ) : (
              <div className="text-3xl font-bold">{enabledIntegrations.length}</div>
            )}
            <p className="text-sm text-muted-foreground mt-1">সক্রিয় ইন্টিগ্রেশন</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            {syncStatsLoading ? (
              <Skeleton className="h-9 w-16 mx-auto" />
            ) : (
              <div className="text-3xl font-bold text-green-500">{syncStats?.success ?? 0}</div>
            )}
            <p className="text-sm text-muted-foreground mt-1">সফল সিঙ্ক (২৪ঘ)</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            {syncStatsLoading ? (
              <Skeleton className="h-9 w-16 mx-auto" />
            ) : (
              <div className={`text-3xl font-bold ${(syncStats?.failed ?? 0) > 0 ? "text-red-500" : ""}`}>
                {syncStats?.failed ?? 0}
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-1">ব্যর্থ সিঙ্ক (২৪ঘ)</p>
          </div>
        </div>

        {/* Failed Integrations Alert */}
        {failedIntegrations.length > 0 && (
          <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <span className="font-medium text-destructive">
                {failedIntegrations.length}টি ইন্টিগ্রেশনে সমস্যা
              </span>
            </div>
            <div className="space-y-2">
              {failedIntegrations.slice(0, 3).map((integration) => (
                <div key={integration.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <span>{integration.tenant?.name ?? "Unknown"}</span>
                    <span className="text-muted-foreground">- {integration.name}</span>
                  </div>
                  <Badge variant="destructive" className="text-xs">ব্যর্থ</Badge>
                </div>
              ))}
              {failedIntegrations.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  এবং আরও {failedIntegrations.length - 3}টি...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Integrations List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : integrations?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Network className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>কোন নেটওয়ার্ক ইন্টিগ্রেশন কনফিগার করা হয়নি</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {integrations?.map((integration) => {
              const status = integration.last_sync_status;
              const statusInfo = status ? statusConfig[status] : null;
              const StatusIcon = statusInfo?.icon ?? Clock;

              return (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${statusInfo?.bgColor ?? "bg-muted"}`}>
                      <StatusIcon className={`h-5 w-5 ${statusInfo?.color ?? "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{integration.tenant?.name ?? "Unknown Tenant"}</p>
                        <Badge variant="outline" className="text-xs">
                          {providerLabels[integration.provider_type]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {integration.name} • {integration.host}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={integration.is_enabled ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {integration.is_enabled ? "সক্রিয়" : "নিষ্ক্রিয়"}
                    </Badge>
                    {integration.last_sync_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(integration.last_sync_at), { 
                          addSuffix: true,
                          locale: bn 
                        })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
