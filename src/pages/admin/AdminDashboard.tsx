import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock platform stats
const platformStats = {
  totalTenants: 24,
  activeSubscriptions: 21,
  trialTenants: 3,
  suspendedTenants: 0,
  totalRevenue: 456000,
  monthlyRecurring: 42000,
  totalEndUsers: 12450,
  activeConnections: 11890,
};

const recentTenants = [
  { id: "1", name: "FastNet BD", subdomain: "fastnet", status: "active", users: 1250, mrr: 5000 },
  { id: "2", name: "Speed Link", subdomain: "speedlink", status: "active", users: 890, mrr: 3500 },
  { id: "3", name: "NetZone", subdomain: "netzone", status: "trial", users: 120, mrr: 0 },
  { id: "4", name: "CityBroadband", subdomain: "citybb", status: "active", users: 2100, mrr: 8000 },
  { id: "5", name: "QuickNet", subdomain: "quicknet", status: "active", users: 560, mrr: 2500 },
];

const statusConfig = {
  active: { label: "Active", variant: "default" as const, icon: CheckCircle },
  trial: { label: "Trial", variant: "secondary" as const, icon: Clock },
  suspended: { label: "Suspended", variant: "destructive" as const, icon: AlertTriangle },
};

export default function AdminDashboard() {
  const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform Overview</h1>
        <p className="text-muted-foreground">
          Manage all ISP tenants and monitor platform health
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tenants
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformStats.totalTenants}</div>
            <div className="flex gap-2 mt-1">
              <Badge variant="default" className="text-xs">{platformStats.activeSubscriptions} active</Badge>
              <Badge variant="secondary" className="text-xs">{platformStats.trialTenants} trial</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(platformStats.monthlyRecurring)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-primary">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total End Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformStats.totalEndUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all tenants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Connections
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformStats.activeConnections.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((platformStats.activeConnections / platformStats.totalEndUsers) * 100).toFixed(1)}% active rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue & Tenants */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Overview
            </CardTitle>
            <CardDescription>Platform financial summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue (All Time)</p>
                <p className="text-2xl font-bold">{formatCurrency(platformStats.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border">
                <p className="text-sm text-muted-foreground">Active MRR</p>
                <p className="text-lg font-semibold">{formatCurrency(platformStats.monthlyRecurring)}</p>
              </div>
              <div className="p-3 rounded-lg border">
                <p className="text-sm text-muted-foreground">Avg. per Tenant</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(Math.round(platformStats.monthlyRecurring / platformStats.activeSubscriptions))}
                </p>
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
                Recent Tenants
              </CardTitle>
              <CardDescription>Latest ISP organizations</CardDescription>
            </div>
            <Link 
              to="/admin/tenants" 
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTenants.map((tenant) => {
                const StatusIcon = statusConfig[tenant.status].icon;
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
                        <p className="text-sm font-medium">{tenant.users} users</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(tenant.mrr)}/mo</p>
                      </div>
                      <Badge variant={statusConfig[tenant.status].variant} className="gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig[tenant.status].label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Attention Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-destructive/20 bg-destructive/5">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium text-sm">0 Suspended Tenants</p>
                <p className="text-xs text-muted-foreground">No action needed</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">3 Trial Expiring</p>
                <p className="text-xs text-muted-foreground">Within 7 days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <CheckCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">All Systems Healthy</p>
                <p className="text-xs text-muted-foreground">No issues detected</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
