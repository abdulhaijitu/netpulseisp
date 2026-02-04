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
  Server,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { bn } from "date-fns/locale";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NetworkIntegrationWithTenant {
  id: string;
  name: string;
  provider_type: "mikrotik" | "radius" | "custom";
  is_enabled: boolean;
  last_sync_at: string | null;
  last_sync_status: "pending" | "in_progress" | "success" | "failed" | "retrying" | null;
  host: string;
  port: number | null;
  sync_mode: "manual" | "scheduled" | "event_driven";
  sync_interval_minutes: number | null;
  mikrotik_use_ssl: boolean | null;
  mikrotik_ppp_profile: string | null;
  tenant: {
    id: string;
    name: string;
    subdomain: string;
  };
}

interface SyncLog {
  id: string;
  action: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  error_message: string | null;
  customer: { name: string } | null;
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

const syncModeLabels = {
  manual: "ম্যানুয়াল",
  scheduled: "নির্ধারিত",
  event_driven: "ইভেন্ট ভিত্তিক",
};

const actionLabels: Record<string, string> = {
  enable: "সক্রিয়",
  disable: "নিষ্ক্রিয়",
  update_speed: "স্পিড আপডেট",
  create: "তৈরি",
  delete: "মুছে ফেলা",
  test_connection: "সংযোগ টেস্ট",
};

function IntegrationDetails({ integration }: { integration: NetworkIntegrationWithTenant }) {
  const { data: syncLogs, isLoading: logsLoading } = useQuery({
    queryKey: ["admin-sync-logs", integration.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("network_sync_logs")
        .select(`
          id,
          action,
          status,
          started_at,
          completed_at,
          error_message,
          customer:customers!network_sync_logs_customer_id_fkey (name)
        `)
        .eq("integration_id", integration.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as unknown as SyncLog[];
    },
  });

  return (
    <div className="mt-3 pt-3 border-t space-y-4">
      {/* Integration Configuration */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-3 rounded-lg bg-muted/30">
          <p className="text-xs text-muted-foreground mb-1">হোস্ট</p>
          <p className="text-sm font-medium flex items-center gap-1">
            {integration.host}:{integration.port ?? 8728}
            {integration.mikrotik_use_ssl && (
              <Badge variant="outline" className="text-xs ml-1">SSL</Badge>
            )}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-muted/30">
          <p className="text-xs text-muted-foreground mb-1">সিঙ্ক মোড</p>
          <p className="text-sm font-medium">
            {syncModeLabels[integration.sync_mode]}
            {integration.sync_mode === "scheduled" && integration.sync_interval_minutes && (
              <span className="text-muted-foreground ml-1">
                (প্রতি {integration.sync_interval_minutes} মিনিট)
              </span>
            )}
          </p>
        </div>
        {integration.mikrotik_ppp_profile && (
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">PPP প্রোফাইল</p>
            <p className="text-sm font-medium">{integration.mikrotik_ppp_profile}</p>
          </div>
        )}
      </div>

      {/* Recent Sync Logs */}
      <div>
        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          সাম্প্রতিক সিঙ্ক লগ
        </h4>
        {logsLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !syncLogs?.length ? (
          <p className="text-sm text-muted-foreground py-4 text-center">কোন সিঙ্ক লগ নেই</p>
        ) : (
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {syncLogs.map((log) => {
                const logStatus = statusConfig[log.status as keyof typeof statusConfig];
                const LogIcon = logStatus?.icon ?? Clock;
                return (
                  <div
                    key={log.id}
                    className="flex items-start justify-between p-2 rounded-lg bg-muted/20 text-sm"
                  >
                    <div className="flex items-start gap-2">
                      <LogIcon className={`h-4 w-4 mt-0.5 ${logStatus?.color ?? "text-muted-foreground"}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {actionLabels[log.action] ?? log.action}
                          </span>
                          {log.customer?.name && (
                            <span className="text-muted-foreground">
                              - {log.customer.name}
                            </span>
                          )}
                        </div>
                        {log.error_message && (
                          <p className="text-xs text-destructive mt-0.5">
                            {log.error_message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{format(new Date(log.started_at), "dd MMM, HH:mm", { locale: bn })}</p>
                      <Badge 
                        variant={log.status === "success" ? "default" : log.status === "failed" ? "destructive" : "secondary"}
                        className="text-xs mt-1"
                      >
                        {logStatus?.label ?? log.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

export function NetworkHealthOverview() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
          port,
          sync_mode,
          sync_interval_minutes,
          mikrotik_use_ssl,
          mikrotik_ppp_profile,
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
        <CardDescription>সকল ISP-এর নেটওয়ার্ক সিঙ্ক স্ট্যাটাস • ক্লিক করে বিস্তারিত দেখুন</CardDescription>
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

        {/* Integrations List with Drill-down */}
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
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {integrations?.map((integration) => {
              const status = integration.last_sync_status;
              const statusInfo = status ? statusConfig[status] : null;
              const StatusIcon = statusInfo?.icon ?? Clock;
              const isExpanded = expandedId === integration.id;

              return (
                <Collapsible
                  key={integration.id}
                  open={isExpanded}
                  onOpenChange={() => setExpandedId(isExpanded ? null : integration.id)}
                >
                  <div className="rounded-lg border hover:bg-muted/50 transition-colors">
                    <CollapsibleTrigger asChild>
                      <button className="w-full p-3 flex items-center justify-between text-left">
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
                        <div className="flex items-center gap-3">
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
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 pb-3">
                      <IntegrationDetails integration={integration} />
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}