import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Receipt, 
  CreditCard, 
  Wifi, 
  Calendar,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for customer portal
const customerData = {
  name: "Md. Karim Uddin",
  connectionId: "CONN-2024-001",
  packageName: "Premium 50 Mbps",
  status: "active" as const,
  currentBill: {
    amount: 1200,
    dueDate: "2024-02-15",
    status: "due" as const,
  },
  lastPayment: {
    amount: 1200,
    date: "2024-01-10",
  },
};

const statusConfig = {
  active: { label: "Active", variant: "default" as const, icon: CheckCircle },
  suspended: { label: "Suspended", variant: "destructive" as const, icon: AlertCircle },
  pending: { label: "Pending", variant: "secondary" as const, icon: Clock },
};

const billStatusConfig = {
  paid: { label: "Paid", variant: "default" as const },
  due: { label: "Due", variant: "secondary" as const },
  partial: { label: "Partial", variant: "outline" as const },
  overdue: { label: "Overdue", variant: "destructive" as const },
};

export default function PortalDashboard() {
  const { user } = useAuth();
  const StatusIcon = statusConfig[customerData.status].icon;

  const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {customerData.name}</h1>
        <p className="text-muted-foreground">
          Manage your internet connection and payments
        </p>
      </div>

      {/* Connection Status Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Connection Status</CardTitle>
            <Badge variant={statusConfig[customerData.status].variant} className="gap-1">
              <StatusIcon className="h-3 w-3" />
              {statusConfig[customerData.status].label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Wifi className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Package</p>
                <p className="font-medium">{customerData.packageName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Connection ID</p>
                <p className="font-medium">{customerData.connectionId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Billing Cycle</p>
                <p className="font-medium">Monthly</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Bill & Payment Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Current Bill */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Receipt className="h-5 w-5" />
              Current Bill
            </CardTitle>
            <CardDescription>Your latest billing information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">
                {formatCurrency(customerData.currentBill.amount)}
              </span>
              <Badge variant={billStatusConfig[customerData.currentBill.status].variant}>
                {billStatusConfig[customerData.currentBill.status].label}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Due by {new Date(customerData.currentBill.dueDate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" asChild>
                <Link to="/portal/bills">
                  View Bill
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="flex-1">
                Pay Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Last Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5" />
              Last Payment
            </CardTitle>
            <CardDescription>Your most recent payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">
                {formatCurrency(customerData.lastPayment.amount)}
              </span>
              <Badge variant="default" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Paid
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Paid on {new Date(customerData.lastPayment.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/portal/payments">
                View Payment History
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <Button variant="outline" className="justify-start h-auto py-4" asChild>
              <Link to="/portal/bills">
                <Receipt className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">View All Bills</p>
                  <p className="text-xs text-muted-foreground">Check your billing history</p>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4" asChild>
              <Link to="/portal/payments">
                <CreditCard className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Payment History</p>
                  <p className="text-xs text-muted-foreground">View past transactions</p>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4" asChild>
              <Link to="/portal/profile">
                <Wifi className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">My Profile</p>
                  <p className="text-xs text-muted-foreground">Update your information</p>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
