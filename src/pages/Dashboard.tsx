import { 
  Users, 
  Wallet, 
  TrendingUp, 
  AlertCircle,
  UserPlus,
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { CustomerTable } from "@/components/dashboard/CustomerTable";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { useTenantContext } from "@/contexts/TenantContext";
import { useCustomers } from "@/hooks/useCustomers";
import { usePayments } from "@/hooks/usePayments";
import { useBills } from "@/hooks/useBills";

export default function Dashboard() {
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
  
  const newCustomersThisMonth = customers.filter(c => {
    const joinDate = new Date(c.join_date);
    return joinDate >= thisMonthStart;
  }).length;

  const monthlyPayments = payments.filter(p => {
    const paymentDate = new Date(p.created_at);
    return paymentDate >= thisMonthStart;
  });
  
  const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + Number(p.amount), 0);

  // Total due from customers
  const totalDue = customers.reduce((sum, c) => sum + (c.due_balance || 0), 0);

  // Total billed this month
  const monthlyBills = bills.filter(b => {
    const billDate = new Date(b.created_at);
    return billDate >= thisMonthStart;
  });
  const totalBilled = monthlyBills.reduce((sum, b) => sum + Number(b.amount), 0);

  // Collection rate
  const collectionRate = totalBilled > 0 ? ((monthlyRevenue / totalBilled) * 100) : 0;

  // Average revenue per customer
  const avgRevenuePerCustomer = activeCustomers > 0 ? Math.round(monthlyRevenue / activeCustomers) : 0;

  // Customers with dues
  const customersWithDue = customers.filter(c => (c.due_balance || 0) > 0).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your ISP operations.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Customers"
          value={totalCustomers.toLocaleString()}
          subtitle={`${activeCustomers} active connections`}
          icon={Users}
          variant="default"
        />
        <MetricCard
          title="Monthly Revenue"
          value={`৳${monthlyRevenue.toLocaleString()}`}
          subtitle={now.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          icon={Wallet}
          variant="success"
        />
        <MetricCard
          title="Collection Rate"
          value={`${collectionRate.toFixed(1)}%`}
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

      {/* Secondary Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="New Customers"
          value={newCustomersThisMonth.toString()}
          subtitle="This month"
          icon={UserPlus}
          variant="default"
        />
        <MetricCard
          title="Suspended"
          value={suspendedCustomers.toString()}
          subtitle="Due to non-payment"
          icon={ArrowDownRight}
          variant={suspendedCustomers > 0 ? "danger" : "default"}
        />
        <MetricCard
          title="Avg. Revenue/Customer"
          value={`৳${avgRevenuePerCustomer.toLocaleString()}`}
          subtitle="Per month"
          icon={TrendingUp}
          variant="success"
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
