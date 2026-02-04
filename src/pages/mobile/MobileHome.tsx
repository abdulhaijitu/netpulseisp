import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  BellRing,
  CreditCard as PaymentIcon,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePortalCustomer, usePortalBills, usePortalPayments } from "@/hooks/usePortalData";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { formatDistanceToNow } from "date-fns";

const statusConfig = {
  active: { label: "Active", color: "bg-green-500", icon: CheckCircle },
  suspended: { label: "Suspended", color: "bg-red-500", icon: AlertCircle },
  pending: { label: "Pending", color: "bg-yellow-500", icon: Clock },
};

const billStatusConfig = {
  paid: { label: "Paid", variant: "default" as const },
  due: { label: "Due", variant: "secondary" as const },
  partial: { label: "Partial", variant: "outline" as const },
  overdue: { label: "Overdue", variant: "destructive" as const },
};

const notificationIcons: Record<string, React.ElementType> = {
  billing_reminder: AlertTriangle,
  payment_confirmation: PaymentIcon,
  connection_status: Wifi,
  general: BellRing,
};

export default function MobileHome() {
  const navigate = useNavigate();
  const { data: customer, isLoading: customerLoading } = usePortalCustomer();
  const { data: bills, isLoading: billsLoading } = usePortalBills();
  const { data: payments } = usePortalPayments();
  const { notifications, isLoadingNotifications } = usePushNotifications();
  const [notificationSheetOpen, setNotificationSheetOpen] = useState(false);

  const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;
  const currentBill = bills?.find(b => b.status !== "paid") || bills?.[0];
  const lastPayment = payments?.[0];
  const unreadCount = notifications?.filter(n => !n.sent_at || new Date(n.sent_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length || 0;

  if (customerLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
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
        <Sheet open={notificationSheetOpen} onOpenChange={setNotificationSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-12 w-12 rounded-full">
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
              {isLoadingNotifications ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))
              ) : notifications && notifications.length > 0 ? (
                notifications.map((notification) => {
                  const Icon = notificationIcons[notification.notification_type] || BellRing;
                  return (
                    <div
                      key={notification.id}
                      className="flex gap-3 p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{notification.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{notification.body}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Bell className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="font-medium">No Notifications</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    You're all caught up!
                  </p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Connection Status Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className={`${connectionStatus === "active" ? "bg-gradient-to-r from-green-500 to-emerald-600" : connectionStatus === "suspended" ? "bg-gradient-to-r from-red-500 to-rose-600" : "bg-gradient-to-r from-yellow-500 to-amber-600"} text-white p-5`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Wifi className="w-5 h-5" />
                </div>
                <span className="font-medium">Connection</span>
              </div>
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 gap-1">
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
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
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
        <Card className="touch-manipulation active:scale-[0.98] transition-transform" onClick={() => navigate("/app/bills")}>
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
                <p className="text-2xl font-bold mb-1">
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
        <Card className="touch-manipulation active:scale-[0.98] transition-transform" onClick={() => navigate("/app/payments")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-muted-foreground">Last Payment</span>
            </div>
            {lastPayment ? (
              <>
                <p className="text-2xl font-bold mb-1">
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
        
        <button
          onClick={() => navigate("/app/bills")}
          className="w-full flex items-center justify-between p-4 bg-card rounded-xl border active:bg-muted/50 touch-manipulation transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Receipt className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold">View All Bills</p>
              <p className="text-sm text-muted-foreground">Check your billing history</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        <button
          onClick={() => navigate("/app/payments")}
          className="w-full flex items-center justify-between p-4 bg-card rounded-xl border active:bg-muted/50 touch-manipulation transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Payment History</p>
              <p className="text-sm text-muted-foreground">View past transactions</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        <button
          onClick={() => navigate("/app/profile")}
          className="w-full flex items-center justify-between p-4 bg-card rounded-xl border active:bg-muted/50 touch-manipulation transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold">My Package</p>
              <p className="text-sm text-muted-foreground">View package details</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
