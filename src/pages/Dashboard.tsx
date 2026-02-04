import { 
  Users, 
  Wallet, 
  TrendingUp, 
  AlertCircle,
  UserPlus,
  ArrowDownRight,
  Loader2,
  Plus,
  FileText,
  CreditCard,
  RefreshCw
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { CustomerTable } from "@/components/dashboard/CustomerTable";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { useTenantContext } from "@/contexts/TenantContext";
import { useCustomers } from "@/hooks/useCustomers";
import { usePayments } from "@/hooks/usePayments";
import { useBills } from "@/hooks/useBills";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentTenant, isLoading: tenantLoading } = useTenantContext();
  const { data: customers = [], isLoading: customersLoading } = useCustomers(currentTenant?.id);
  const { data: payments = [], isLoading: paymentsLoading } = usePayments(currentTenant?.id);
  const { data: bills = [], isLoading: billsLoading } = useBills(currentTenant?.id);

  const isLoading = tenantLoading || customersLoading || paymentsLoading || billsLoading;

  // Calculate metrics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.connection_status === "active").length;
  const suspendedCustomers = customers.filter(c => c.connection_status === "suspended").length;

  // This month's data
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  
  const newCustomersThisMonth = customers.filter(c => {
    const joinDate = new Date(c.join_date);
    return joinDate >= thisMonthStart;
  }).length;

  const newCustomersLastMonth = customers.filter(c => {
    const joinDate = new Date(c.join_date);
    return joinDate >= lastMonthStart && joinDate <= lastMonthEnd;
  }).length;

  const customerGrowth = newCustomersLastMonth > 0 
    ? Math.round(((newCustomersThisMonth - newCustomersLastMonth) / newCustomersLastMonth) * 100)
    : newCustomersThisMonth > 0 ? 100 : 0;

  const monthlyPayments = payments.filter(p => {
    const paymentDate = new Date(p.created_at);
    return paymentDate >= thisMonthStart;
  });
  
  const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + Number(p.amount), 0);

  const lastMonthPayments = payments.filter(p => {
    const paymentDate = new Date(p.created_at);
    return paymentDate >= lastMonthStart && paymentDate <= lastMonthEnd;
  });
  const lastMonthRevenue = lastMonthPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  
  const revenueGrowth = lastMonthRevenue > 0
    ? Math.round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
    : monthlyRevenue > 0 ? 100 : 0;

  // Total due from customers
  const totalDue = customers.reduce((sum, c) => sum + (c.due_balance || 0), 0);
  const customersWithDue = customers.filter(c => (c.due_balance || 0) > 0).length;

  // Total billed this month
  const monthlyBills = bills.filter(b => {
    const billDate = new Date(b.created_at);
    return billDate >= thisMonthStart;
  });
  const totalBilled = monthlyBills.reduce((sum, b) => sum + Number(b.amount), 0);

  // Collection rate
  const collectionRate = totalBilled > 0 ? ((monthlyRevenue / totalBilled) * 100) : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Welcome back! Here's your ISP overview for {now.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1.5"
            onClick={() => navigate("/dashboard/billing")}
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Generate Bills</span>
          </Button>
          <Button 
            size="sm" 
            className="gap-1.5"
            onClick={() => navigate("/dashboard/customers")}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Customer</span>
          </Button>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Customers"
          value={totalCustomers.toLocaleString()}
          subtitle={`${activeCustomers} active connections`}
          icon={Users}
          trend={customerGrowth !== 0 ? { value: Math.abs(customerGrowth), isPositive: customerGrowth > 0 } : undefined}
          variant="default"
        />
        <MetricCard
          title="Monthly Revenue"
          value={`৳${monthlyRevenue.toLocaleString()}`}
          subtitle={now.toLocaleDateString("en-US", { month: "long" })}
          icon={Wallet}
          trend={revenueGrowth !== 0 ? { value: Math.abs(revenueGrowth), isPositive: revenueGrowth > 0 } : undefined}
          variant="success"
        />
        <MetricCard
          title="Collection Rate"
          value={`${collectionRate.toFixed(0)}%`}
          subtitle="This month"
          icon={TrendingUp}
          variant={collectionRate >= 90 ? "success" : collectionRate >= 70 ? "warning" : "danger"}
        />
        <MetricCard
          title="Total Due"
          value={`৳${totalDue.toLocaleString()}`}
          subtitle={`From ${customersWithDue} customers`}
          icon={AlertCircle}
          variant={totalDue > 0 ? "warning" : "success"}
        />
      </div>

      {/* Secondary Metrics - Compact */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          title="New This Month"
          value={newCustomersThisMonth.toString()}
          icon={UserPlus}
          variant="default"
          className="py-4"
        />
        <MetricCard
          title="Suspended"
          value={suspendedCustomers.toString()}
          icon={ArrowDownRight}
          variant={suspendedCustomers > 0 ? "danger" : "default"}
          className="py-4"
        />
        <MetricCard
          title="Bills Generated"
          value={monthlyBills.length.toString()}
          icon={FileText}
          variant="default"
          className="py-4"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RevenueChart />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>

      {/* Customer Table */}
      <CustomerTable />
    </div>
  );
}
