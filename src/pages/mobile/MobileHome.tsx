import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Wifi, 
  Receipt, 
  CreditCard, 
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Clock,
  UserX,
  Bell,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePortalCustomer, usePortalBills, usePortalPayments } from "@/hooks/usePortalData";
import { cn } from "@/lib/utils";
import { MobileNotificationSheet } from "@/components/mobile/MobileNotificationSheet";

const statusConfig = {
  active: { label: "Active", color: "bg-success", icon: CheckCircle },
  suspended: { label: "Suspended", color: "bg-destructive", icon: AlertCircle },
  pending: { label: "Pending", color: "bg-warning", icon: Clock },
};

const billStatusConfig = {
  paid: { label: "Paid", variant: "default" as const },
  due: { label: "Due", variant: "secondary" as const },
  partial: { label: "Partial", variant: "outline" as const },
  overdue: { label: "Overdue", variant: "destructive" as const },
};

export default function MobileHome() {
  const navigate = useNavigate();
  const { data: customer, isLoading: customerLoading } = usePortalCustomer();
  const { data: bills, isLoading: billsLoading } = usePortalBills();
  const { data: payments } = usePortalPayments();
  const [notificationSheetOpen, setNotificationSheetOpen] = useState(false);

  const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;
  const currentBill = bills?.find(b => b.status !== "paid") || bills?.[0];
  const lastPayment = payments?.[0];

  if (customerLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center animate-fade-in">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <UserX className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">No Account Found</h2>
        <p className="text-muted-foreground max-w-xs">
          Your login is not linked to any customer account. Please contact your ISP.
        </p>
      </div>
    );
  }

  const connectionStatus = customer.connection_status || "pending";
  const StatusIcon = statusConfig[connectionStatus].icon;

  return (
    <div className="space-y-5">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="text-2xl font-bold truncate max-w-[200px]">
            {customer.name.split(" ")[0]}
          </h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-12 w-12 rounded-full"
          onClick={() => setNotificationSheetOpen(true)}
        >
          <Bell className="h-6 w-6" />
        </Button>
      </div>

      {/* Connection Status Card */}
      <Card className="overflow-hidden border-0 shadow-lg animate-slide-up">
        <CardContent className="p-0">
          <div className={cn(
            "text-white p-5",
            connectionStatus === "active" 
              ? "bg-gradient-to-br from-success to-success/80" 
              : connectionStatus === "suspended" 
                ? "bg-gradient-to-br from-destructive to-destructive/80" 
                : "bg-gradient-to-br from-warning to-warning/80"
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Wifi className="w-5 h-5" />
                </div>
                <span className="font-medium">Connection</span>
              </div>
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 gap-1 backdrop-blur-sm">
                <StatusIcon className="w-3 h-3" />
                {statusConfig[connectionStatus].label}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-white/80 text-sm">Current Package</p>
              <p className="text-xl font-bold">
                {customer.packages?.name || "No Package"}
              </p>
              {customer.packages?.speed_label && (
                <p className="text-white/80 text-sm">{customer.packages.speed_label}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Due Balance Alert */}
      {Number(customer.due_balance) > 0 && (
        <Card className="border-destructive/50 bg-destructive/5 animate-slide-up" style={{ animationDelay: "50ms" }}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Balance</p>
                <p className="text-xl font-bold text-destructive">
                  {formatCurrency(Number(customer.due_balance))}
                </p>
              </div>
            </div>
            <Button size="sm" variant="destructive" onClick={() => navigate("/app/bills")}>
              Pay Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Current Bill */}
        <Card 
          className="touch-manipulation active:scale-[0.98] transition-all duration-200 cursor-pointer animate-slide-up hover:shadow-soft" 
          style={{ animationDelay: "100ms" }}
          onClick={() => navigate("/app/bills")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Receipt className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Current Bill</span>
            </div>
            {billsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : currentBill ? (
              <>
                <p className="text-2xl font-bold mb-1 tabular-nums">
                  {formatCurrency(Number(currentBill.amount))}
                </p>
                <Badge variant={billStatusConfig[currentBill.status || "due"].variant} className="text-xs">
                  {billStatusConfig[currentBill.status || "due"].label}
                </Badge>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">No bills</p>
            )}
          </CardContent>
        </Card>

        {/* Last Payment */}
        <Card 
          className="touch-manipulation active:scale-[0.98] transition-all duration-200 cursor-pointer animate-slide-up hover:shadow-soft" 
          style={{ animationDelay: "150ms" }}
          onClick={() => navigate("/app/payments")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Last Payment</span>
            </div>
            {lastPayment ? (
              <>
                <p className="text-2xl font-bold mb-1 tabular-nums">
                  {formatCurrency(Number(lastPayment.amount))}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(lastPayment.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">No payments</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Quick Actions</h3>
        
        <QuickActionButton
          icon={Receipt}
          iconBg="bg-primary/10"
          iconColor="text-primary"
          title="View All Bills"
          subtitle="Check your billing history"
          onClick={() => navigate("/app/bills")}
          delay="200ms"
        />

        <QuickActionButton
          icon={CreditCard}
          iconBg="bg-success/10"
          iconColor="text-success"
          title="Payment History"
          subtitle="View past transactions"
          onClick={() => navigate("/app/payments")}
          delay="250ms"
        />

        <QuickActionButton
          icon={Package}
          iconBg="bg-accent/10"
          iconColor="text-accent-foreground"
          title="My Package"
          subtitle="View package details"
          onClick={() => navigate("/app/profile")}
          delay="300ms"
        />
      </div>

      {/* Notification Sheet */}
      <MobileNotificationSheet 
        open={notificationSheetOpen} 
        onOpenChange={setNotificationSheetOpen} 
      />
    </div>
  );
}

interface QuickActionButtonProps {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  onClick: () => void;
  delay?: string;
}

function QuickActionButton({ 
  icon: Icon, 
  iconBg, 
  iconColor, 
  title, 
  subtitle, 
  onClick,
  delay = "0ms"
}: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-card rounded-xl border active:scale-[0.98] hover:bg-muted/30 touch-manipulation transition-all duration-200 animate-slide-up"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", iconBg)}>
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
        <div className="text-left">
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
  );
}
