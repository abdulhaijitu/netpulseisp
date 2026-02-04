import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
  Wallet
} from "lucide-react";
import { Link } from "react-router-dom";
import { usePlatformStats, useAllTenants } from "@/hooks/useTenants";
import { useTenantContext } from "@/contexts/TenantContext";
import { useCustomers } from "@/hooks/useCustomers";
import { usePayments } from "@/hooks/usePayments";
import { useBills } from "@/hooks/useBills";

const statusConfig = {
  active: { label: "সক্রিয়", variant: "default" as const, icon: CheckCircle },
  trial: { label: "ট্রায়াল", variant: "secondary" as const, icon: Clock },
  suspended: { label: "স্থগিত", variant: "destructive" as const, icon: AlertTriangle },
};

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = usePlatformStats();
  const { data: tenants, isLoading: tenantsLoading } = useAllTenants();
  const { currentTenant, isSuperAdmin } = useTenantContext();

  // Tenant-specific data
  const { data: customers = [], isLoading: customersLoading } = useCustomers(currentTenant?.id);
  const { data: payments = [], isLoading: paymentsLoading } = usePayments(currentTenant?.id);
  const { data: bills = [], isLoading: billsLoading } = useBills(currentTenant?.id);

  const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;

  const recentTenants = tenants?.slice(0, 5) ?? [];

  // Calculate tenant-specific metrics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.connection_status === "active").length;
  const suspendedCustomers = customers.filter(c => c.connection_status === "suspended").length;

  // This month's data
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const monthlyPayments = payments.filter(p => {
    const paymentDate = new Date(p.created_at);
    return paymentDate >= thisMonthStart;
  });
  
  const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + Number(p.amount), 0);

  // Total due from customers
  const totalDue = customers.reduce((sum, c) => sum + (c.due_balance || 0), 0);

  // Monthly bills
  const monthlyBills = bills.filter(b => {
    const billDate = new Date(b.created_at);
    return billDate >= thisMonthStart;
  });
  const totalBilled = monthlyBills.reduce((sum, b) => sum + Number(b.amount), 0);

  // Collection rate
  const collectionRate = totalBilled > 0 ? ((monthlyRevenue / totalBilled) * 100) : 0;

  const tenantDataLoading = customersLoading || paymentsLoading || billsLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">প্ল্যাটফর্ম ওভারভিউ</h1>
        <p className="text-muted-foreground">
          সকল ISP টেন্যান্ট পরিচালনা ও প্ল্যাটফর্ম মনিটরিং
        </p>
      </div>

      {/* Platform Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              মোট টেন্যান্ট
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.totalTenants ?? 0}</div>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <Badge variant="default" className="text-xs">{stats?.activeSubscriptions ?? 0} সক্রিয়</Badge>
                  <Badge variant="secondary" className="text-xs">{stats?.trialTenants ?? 0} ট্রায়াল</Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              মাসিক রাজস্ব
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(0)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  শীঘ্রই আসছে
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              মোট গ্রাহক
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{(stats?.totalEndUsers ?? 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  সকল টেন্যান্ট জুড়ে
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              সক্রিয় সংযোগ
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{(stats?.activeConnections ?? 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.totalEndUsers 
                    ? ((stats.activeConnections / stats.totalEndUsers) * 100).toFixed(1) 
                    : 0}% সক্রিয় হার
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Selected Tenant Stats */}
      {isSuperAdmin && currentTenant && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              নির্বাচিত টেন্যান্ট: <span className="text-primary">{currentTenant.name}</span>
            </h2>
            <Badge variant={statusConfig[currentTenant.subscription_status ?? "trial"]?.variant ?? "secondary"}>
              {statusConfig[currentTenant.subscription_status ?? "trial"]?.label ?? "ট্রায়াল"}
            </Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  গ্রাহক সংখ্যা
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                {tenantDataLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{totalCustomers}</div>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <Badge variant="default" className="text-xs">{activeCustomers} সক্রিয়</Badge>
                      {suspendedCustomers > 0 && (
                        <Badge variant="destructive" className="text-xs">{suspendedCustomers} স্থগিত</Badge>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  মাসিক রাজস্ব
                </CardTitle>
                <Wallet className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                {tenantDataLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {now.toLocaleDateString("bn-BD", { month: "long", year: "numeric" })}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  সংগ্রহ হার
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                {tenantDataLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{collectionRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(totalBilled)} থেকে
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  মোট বকেয়া
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                {tenantDataLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{formatCurrency(totalDue)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {customers.filter(c => (c.due_balance || 0) > 0).length} গ্রাহকের কাছে
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Revenue & Tenants */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              রাজস্ব ওভারভিউ
            </CardTitle>
            <CardDescription>প্ল্যাটফর্মের আর্থিক সারসংক্ষেপ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm text-muted-foreground">মোট রাজস্ব (সর্বকালীন)</p>
                <p className="text-2xl font-bold">{formatCurrency(0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border">
                <p className="text-sm text-muted-foreground">সক্রিয় MRR</p>
                <p className="text-lg font-semibold">{formatCurrency(0)}</p>
              </div>
              <div className="p-3 rounded-lg border">
                <p className="text-sm text-muted-foreground">গড় প্রতি টেন্যান্ট</p>
                <p className="text-lg font-semibold">{formatCurrency(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Tenants */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                সাম্প্রতিক টেন্যান্ট
              </CardTitle>
              <CardDescription>সর্বশেষ ISP প্রতিষ্ঠান</CardDescription>
            </div>
            <Link 
              to="/admin/tenants" 
              className="text-sm text-primary hover:underline"
            >
              সব দেখুন
            </Link>
          </CardHeader>
          <CardContent>
            {tenantsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : recentTenants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                কোন টেন্যান্ট পাওয়া যায়নি
              </div>
            ) : (
              <div className="space-y-3">
                {recentTenants.map((tenant) => {
                  const status = tenant.subscription_status ?? "trial";
                  const StatusIcon = statusConfig[status]?.icon ?? Clock;
                  return (
                    <div
                      key={tenant.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{tenant.name}</p>
                          <p className="text-sm text-muted-foreground">{tenant.subdomain}.ispmanager.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-medium">{tenant.customer_count ?? 0} গ্রাহক</p>
                        </div>
                        <Badge variant={statusConfig[status]?.variant ?? "secondary"} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig[status]?.label ?? status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            মনোযোগ প্রয়োজন
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-destructive/20 bg-destructive/5">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium text-sm">{stats?.suspendedTenants ?? 0} স্থগিত টেন্যান্ট</p>
                <p className="text-xs text-muted-foreground">
                  {stats?.suspendedTenants === 0 ? "কোন পদক্ষেপ প্রয়োজন নেই" : "পদক্ষেপ প্রয়োজন"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">{stats?.trialTenants ?? 0} ট্রায়াল</p>
                <p className="text-xs text-muted-foreground">ট্রায়ালে আছে</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <CheckCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">সব সিস্টেম স্বাভাবিক</p>
                <p className="text-xs text-muted-foreground">কোন সমস্যা নেই</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
