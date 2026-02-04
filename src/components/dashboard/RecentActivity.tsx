import { CreditCard, UserPlus, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTenantContext } from "@/contexts/TenantContext";
import { usePayments } from "@/hooks/usePayments";
import { useCustomers } from "@/hooks/useCustomers";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  type: "payment" | "new_customer" | "suspension" | "reactivation";
  title: string;
  description: string;
  time: string;
}

const iconMap = {
  payment: CreditCard,
  new_customer: UserPlus,
  suspension: AlertTriangle,
  reactivation: CheckCircle,
};

const colorMap = {
  payment: "text-success bg-success/10",
  new_customer: "text-primary bg-primary/10",
  suspension: "text-destructive bg-destructive/10",
  reactivation: "text-success bg-success/10",
};

export function RecentActivity() {
  const { currentTenant } = useTenantContext();
  const { data: payments = [], isLoading: paymentsLoading } = usePayments(currentTenant?.id);
  const { data: customers = [], isLoading: customersLoading } = useCustomers(currentTenant?.id);

  const isLoading = paymentsLoading || customersLoading;

  // Build activity list from real data
  const activities: ActivityItem[] = [];

  // Add recent payments
  payments.slice(0, 3).forEach((payment) => {
    activities.push({
      id: `payment-${payment.id}`,
      type: "payment",
      title: "Payment Received",
      description: `${payment.customer?.name || "Customer"} paid ৳${Number(payment.amount).toLocaleString()}`,
      time: formatDistanceToNow(new Date(payment.created_at), { addSuffix: true }),
    });
  });

  // Add recent customers
  const recentCustomers = customers
    .filter((c) => {
      const joinDate = new Date(c.join_date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return joinDate >= weekAgo;
    })
    .slice(0, 2);

  recentCustomers.forEach((customer) => {
    activities.push({
      id: `customer-${customer.id}`,
      type: "new_customer",
      title: "New Customer",
      description: `${customer.name} joined with ${customer.package?.name || "a plan"}`,
      time: formatDistanceToNow(new Date(customer.join_date), { addSuffix: true }),
    });
  });

  // Add suspended customers
  const suspendedCustomers = customers
    .filter((c) => c.connection_status === "suspended")
    .slice(0, 1);

  suspendedCustomers.forEach((customer) => {
    activities.push({
      id: `suspended-${customer.id}`,
      type: "suspension",
      title: "Connection Suspended",
      description: `${customer.name} - pending payment`,
      time: formatDistanceToNow(new Date(customer.updated_at), { addSuffix: true }),
    });
  });

  // Sort by recency (we'd need actual timestamps, but for now just show as is)
  const sortedActivities = activities.slice(0, 5);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-4">
        <h3 className="font-semibold">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">Latest updates from your ISP</p>
      </div>
      {sortedActivities.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          <p>No recent activity</p>
          <p className="text-sm">Activity will appear here as you use the system</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {sortedActivities.map((activity, index) => {
            const Icon = iconMap[activity.type];
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 transition-micro hover:bg-muted/50"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={cn("rounded-full p-2", colorMap[activity.type])}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            );
          })}
        </div>
      )}
      <div className="border-t border-border p-4">
        <button className="text-sm font-medium text-primary hover:underline">
          View all activity →
        </button>
      </div>
    </div>
  );
}
