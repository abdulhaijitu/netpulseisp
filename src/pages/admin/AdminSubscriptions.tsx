import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CreditCard, 
  Search,
  Filter,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

// Mock subscription data
const mockSubscriptions = [
  { 
    id: "1", 
    tenant: "FastNet BD", 
    plan: "Professional",
    status: "active" as const,
    amount: 5000,
    billingCycle: "monthly",
    nextBilling: "2024-03-01",
    customers: 1250,
  },
  { 
    id: "2", 
    tenant: "Speed Link", 
    plan: "Starter",
    status: "active" as const,
    amount: 3500,
    billingCycle: "monthly",
    nextBilling: "2024-02-28",
    customers: 890,
  },
  { 
    id: "3", 
    tenant: "NetZone", 
    plan: "Professional",
    status: "trial" as const,
    amount: 0,
    billingCycle: "monthly",
    nextBilling: "2024-02-24",
    customers: 120,
  },
  { 
    id: "4", 
    tenant: "CityBroadband", 
    plan: "Enterprise",
    status: "active" as const,
    amount: 8000,
    billingCycle: "monthly",
    nextBilling: "2024-03-05",
    customers: 2100,
  },
  { 
    id: "5", 
    tenant: "QuickNet", 
    plan: "Starter",
    status: "past_due" as const,
    amount: 2500,
    billingCycle: "monthly",
    nextBilling: "2024-02-10",
    customers: 560,
  },
];

const planConfig = {
  Starter: { color: "bg-secondary" },
  Professional: { color: "bg-primary" },
  Enterprise: { color: "bg-accent" },
};

const statusConfig = {
  active: { label: "Active", variant: "default" as const, icon: CheckCircle },
  trial: { label: "Trial", variant: "secondary" as const, icon: Clock },
  past_due: { label: "Past Due", variant: "destructive" as const, icon: AlertTriangle },
  canceled: { label: "Canceled", variant: "outline" as const, icon: AlertTriangle },
};

export default function AdminSubscriptions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredSubscriptions = mockSubscriptions.filter((sub) => {
    const matchesSearch = sub.tenant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const totalMRR = mockSubscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.amount, 0);

  const activeCount = mockSubscriptions.filter(s => s.status === 'active').length;
  const trialCount = mockSubscriptions.filter(s => s.status === 'trial').length;
  const pastDueCount = mockSubscriptions.filter(s => s.status === 'past_due').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-muted-foreground">
          Manage tenant subscriptions and billing
        </p>
      </div>

      {/* Revenue Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Recurring Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalMRR)}</div>
            <div className="flex items-center gap-1 text-xs text-primary mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Subscriptions
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Paying customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Trial Accounts
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trialCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Potential conversions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Past Due
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{pastDueCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Plan Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 p-4 rounded-lg border">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <CreditCard className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockSubscriptions.filter(s => s.plan === 'Starter').length}</p>
                <p className="text-sm text-muted-foreground">Starter Plan</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg border">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <CreditCard className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockSubscriptions.filter(s => s.plan === 'Professional').length}</p>
                <p className="text-sm text-muted-foreground">Professional Plan</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg border">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <CreditCard className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockSubscriptions.filter(s => s.plan === 'Enterprise').length}</p>
                <p className="text-sm text-muted-foreground">Enterprise Plan</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            All Subscriptions
          </CardTitle>
          <CardDescription>
            View and manage tenant subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="past_due">Past Due</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Customers</TableHead>
                  <TableHead>Next Billing</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((sub) => {
                  const StatusIcon = statusConfig[sub.status].icon;
                  return (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">{sub.tenant}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{sub.plan}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {sub.amount > 0 ? `${formatCurrency(sub.amount)}/mo` : 'Free Trial'}
                      </TableCell>
                      <TableCell>{sub.customers.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(sub.nextBilling)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[sub.status].variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig[sub.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
