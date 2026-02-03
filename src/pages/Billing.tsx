import { useState } from "react";
import {
  Receipt,
  Download,
  Search,
  Filter,
  Plus,
  Calendar,
  Eye,
  Send,
  MoreHorizontal,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import type { Bill, PaymentStatus } from "@/types";

// Mock data for bills
const mockBills: (Bill & { customerName: string; customerPhone: string })[] = [
  {
    id: "INV-2024-001",
    customerId: "1",
    customerName: "Md. Karim Uddin",
    customerPhone: "+880 1712-345678",
    tenantId: "tenant-1",
    amount: 1200,
    dueDate: new Date("2024-02-15"),
    status: "paid",
    billingPeriod: {
      start: new Date("2024-01-01"),
      end: new Date("2024-01-31"),
    },
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "INV-2024-002",
    customerId: "2",
    customerName: "Fatema Begum",
    customerPhone: "+880 1812-456789",
    tenantId: "tenant-1",
    amount: 1500,
    dueDate: new Date("2024-02-15"),
    status: "due",
    billingPeriod: {
      start: new Date("2024-01-01"),
      end: new Date("2024-01-31"),
    },
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "INV-2024-003",
    customerId: "3",
    customerName: "Rahim Sheikh",
    customerPhone: "+880 1912-567890",
    tenantId: "tenant-1",
    amount: 800,
    dueDate: new Date("2024-02-10"),
    status: "overdue",
    billingPeriod: {
      start: new Date("2024-01-01"),
      end: new Date("2024-01-31"),
    },
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "INV-2024-004",
    customerId: "4",
    customerName: "Jamal Hossain",
    customerPhone: "+880 1612-678901",
    tenantId: "tenant-1",
    amount: 2000,
    dueDate: new Date("2024-02-20"),
    status: "partial",
    billingPeriod: {
      start: new Date("2024-01-01"),
      end: new Date("2024-01-31"),
    },
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "INV-2024-005",
    customerId: "5",
    customerName: "Salma Akter",
    customerPhone: "+880 1512-789012",
    tenantId: "tenant-1",
    amount: 1200,
    dueDate: new Date("2024-02-15"),
    status: "paid",
    billingPeriod: {
      start: new Date("2024-01-01"),
      end: new Date("2024-01-31"),
    },
    createdAt: new Date("2024-01-01"),
  },
];

const statusConfig: Record<
  PaymentStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ComponentType<{ className?: string }> }
> = {
  paid: { label: "Paid", variant: "default", icon: CheckCircle },
  due: { label: "Due", variant: "secondary", icon: Clock },
  partial: { label: "Partial", variant: "outline", icon: AlertCircle },
  overdue: { label: "Overdue", variant: "destructive", icon: AlertCircle },
};

export default function Billing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  const filteredBills = mockBills.filter((bill) => {
    const matchesSearch =
      bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBilled = mockBills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalPaid = mockBills
    .filter((b) => b.status === "paid")
    .reduce((sum, bill) => sum + bill.amount, 0);
  const totalDue = mockBills
    .filter((b) => b.status !== "paid")
    .reduce((sum, bill) => sum + bill.amount, 0);
  const overdueCount = mockBills.filter((b) => b.status === "overdue").length;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing</h1>
          <p className="text-sm text-muted-foreground">
            Manage invoices, generate bills, and track payment status
          </p>
        </div>
        <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Generate Bills
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Generate Monthly Bills</DialogTitle>
              <DialogDescription>
                Generate bills for all active customers for the selected billing period.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Billing Month</Label>
                <Select defaultValue="2024-02">
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-02">February 2024</SelectItem>
                    <SelectItem value="2024-01">January 2024</SelectItem>
                    <SelectItem value="2023-12">December 2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Customer Filter</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select customers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Active Customers</SelectItem>
                    <SelectItem value="unbilled">Unbilled Only</SelectItem>
                    <SelectItem value="package">By Package</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm text-muted-foreground">
                  This will generate invoices for <strong>127 customers</strong> with a total billing amount of <strong>৳152,400</strong>.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsGenerateDialogOpen(false)}>
                Generate Bills
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Billed
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBilled)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Collected
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(totalPaid)}
            </div>
            <p className="text-xs text-muted-foreground">
              {((totalPaid / totalBilled) * 100).toFixed(1)}% collection rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Outstanding
            </CardTitle>
            <Clock className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-foreground">
              {formatCurrency(totalDue)}
            </div>
            <p className="text-xs text-muted-foreground">Pending collection</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueCount}</div>
            <p className="text-xs text-muted-foreground">Invoices past due date</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Invoices</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by customer name or invoice ID..."
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
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="due">Due</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Date Range
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Billing Period</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBills.map((bill) => {
                    const StatusIcon = statusConfig[bill.status].icon;
                    return (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">{bill.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{bill.customerName}</p>
                            <p className="text-sm text-muted-foreground">
                              {bill.customerPhone}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(bill.billingPeriod.start)} -{" "}
                            {formatDate(bill.billingPeriod.end)}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(bill.amount)}
                        </TableCell>
                        <TableCell>{formatDate(bill.dueDate)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={statusConfig[bill.status].variant}
                            className="gap-1"
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[bill.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Send className="mr-2 h-4 w-4" />
                                Send to Customer
                              </DropdownMenuItem>
                              {bill.status !== "paid" && (
                                <DropdownMenuItem>
                                  <Receipt className="mr-2 h-4 w-4" />
                                  Record Payment
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                Showing invoices with Due or Partial status
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                Showing overdue invoices that need immediate attention
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
