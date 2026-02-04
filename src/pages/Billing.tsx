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
  Loader2,
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
import { InvoiceDetailDialog, type InvoiceDetail } from "@/components/billing/InvoiceDetailDialog";
import { RecordPaymentDialog } from "@/components/billing/RecordPaymentDialog";
import { useBills, useGenerateBills, type Bill } from "@/hooks/useBills";
import { useTenantContext } from "@/contexts/TenantContext";
import { useToast } from "@/hooks/use-toast";
import { downloadInvoicePdf } from "@/lib/generateInvoicePdf";
import type { PaymentStatus } from "@/types";

const statusConfig: Record<
  PaymentStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ComponentType<{ className?: string }> }
> = {
  paid: { label: "Paid", variant: "default", icon: CheckCircle },
  due: { label: "Due", variant: "secondary", icon: Clock },
  partial: { label: "Partial", variant: "outline", icon: AlertCircle },
  overdue: { label: "Overdue", variant: "destructive", icon: AlertCircle },
};

function transformBillToInvoiceDetail(bill: Bill): InvoiceDetail {
  const paidAmount = bill.payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  
  return {
    id: bill.invoice_number,
    customerId: bill.customer_id,
    customerName: bill.customer?.name || "Unknown Customer",
    customerPhone: bill.customer?.phone || "",
    customerEmail: bill.customer?.email || undefined,
    customerAddress: bill.customer?.address || undefined,
    packageName: bill.customer?.package?.name || "No Package",
    amount: Number(bill.amount),
    dueDate: new Date(bill.due_date),
    status: (bill.status || "due") as PaymentStatus,
    billingPeriod: {
      start: new Date(bill.billing_period_start),
      end: new Date(bill.billing_period_end),
    },
    createdAt: new Date(bill.created_at),
    paidAmount,
    lineItems: [
      {
        id: "1",
        description: `Monthly Internet Subscription - ${bill.customer?.package?.name || "Standard"}`,
        quantity: 1,
        unitPrice: Number(bill.amount),
        total: Number(bill.amount),
      },
    ],
    payments: bill.payments?.map((p) => ({
      id: p.id,
      date: new Date(p.created_at),
      amount: Number(p.amount),
      method: (p.method as "cash" | "online" | "bank_transfer") || "cash",
      reference: p.reference || undefined,
      receivedBy: "Staff",
    })) || [],
    notes: bill.notes || undefined,
  };
}

export default function Billing() {
  const { toast } = useToast();
  const { currentTenant } = useTenantContext();
  const { data: bills, isLoading, error } = useBills(currentTenant?.id);
  const generateBills = useGenerateBills();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDetail | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState<{
    open: boolean;
    billId: string;
    customerId: string;
    customerName: string;
    invoiceNumber: string;
    outstandingAmount: number;
  } | null>(null);

  const handleGenerateBills = async () => {
    if (!currentTenant?.id) {
      toast({
        title: "ত্রুটি",
        description: "টেন্যান্ট পাওয়া যায়নি",
        variant: "destructive",
      });
      return;
    }

    const [year, month] = selectedMonth.split('-').map(Number);
    const billingPeriodStart = new Date(year, month - 1, 1);
    const billingPeriodEnd = new Date(year, month, 0);
    const dueDate = new Date(year, month - 1, 15);

    try {
      const result = await generateBills.mutateAsync({
        tenantId: currentTenant.id,
        billingPeriodStart: billingPeriodStart.toISOString().split('T')[0],
        billingPeriodEnd: billingPeriodEnd.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
      });

      toast({
        title: "বিল তৈরি হয়েছে",
        description: `${result.length}টি গ্রাহকের জন্য বিল তৈরি হয়েছে`,
      });
      setIsGenerateDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "বিল তৈরি করতে ব্যর্থ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredBills = (bills || []).filter((bill) => {
    const matchesSearch =
      bill.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBilled = (bills || []).reduce((sum, bill) => sum + Number(bill.amount), 0);
  const totalPaid = (bills || []).reduce((sum, bill) => {
    const paid = bill.payments?.reduce((s, p) => s + Number(p.amount), 0) || 0;
    return sum + paid;
  }, 0);
  const totalDue = totalBilled - totalPaid;
  const overdueCount = (bills || []).filter((b) => b.status === "overdue").length;

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString()}`;
  };

  const handleViewInvoice = (bill: Bill) => {
    setSelectedInvoice(transformBillToInvoiceDetail(bill));
    setIsDetailDialogOpen(true);
  };

  const handleRecordPayment = (bill: Bill) => {
    const paidAmount = bill.payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
    const outstanding = Number(bill.amount) - paidAmount;
    
    setPaymentDialog({
      open: true,
      billId: bill.id,
      customerId: bill.customer_id,
      customerName: bill.customer?.name || "Unknown",
      invoiceNumber: bill.invoice_number,
      outstandingAmount: outstanding,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-muted-foreground">Failed to load billing data</p>
        <p className="text-sm text-destructive">{error.message}</p>
      </div>
    );
  }

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
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      const months = [];
                      const now = new Date();
                      for (let i = 0; i < 6; i++) {
                        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                        const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                        const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                        months.push(
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        );
                      }
                      return months;
                    })()}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm text-muted-foreground">
                  সক্রিয় গ্রাহকদের জন্য তাদের প্যাকেজ মূল্যের উপর ভিত্তি করে ইনভয়েস তৈরি হবে।
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                বাতিল
              </Button>
              <Button 
                onClick={handleGenerateBills}
                disabled={generateBills.isPending}
              >
                {generateBills.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                বিল তৈরি করুন
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
            <p className="text-xs text-muted-foreground">{bills?.length || 0} invoices</p>
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
              {totalBilled > 0 ? ((totalPaid / totalBilled) * 100).toFixed(1) : 0}% collection rate
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
              {filteredBills.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No invoices found</p>
                  <p className="text-sm text-muted-foreground">
                    {bills?.length === 0
                      ? "Generate bills to get started"
                      : "Try adjusting your search or filters"}
                  </p>
                </div>
              ) : (
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
                      const status = (bill.status || "due") as PaymentStatus;
                      const StatusIcon = statusConfig[status].icon;
                      return (
                        <TableRow 
                          key={bill.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleViewInvoice(bill)}
                        >
                          <TableCell className="font-medium">{bill.invoice_number}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{bill.customer?.name || "Unknown"}</p>
                              <p className="text-sm text-muted-foreground">
                                {bill.customer?.phone}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(bill.billing_period_start)} -{" "}
                              {formatDate(bill.billing_period_end)}
                            </span>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(Number(bill.amount))}
                          </TableCell>
                          <TableCell>{formatDate(bill.due_date)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={statusConfig[status].variant}
                              className="gap-1"
                            >
                              <StatusIcon className="h-3 w-3" />
                              {statusConfig[status].label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewInvoice(bill);
                                }}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Invoice
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  const invoiceDetail = transformBillToInvoiceDetail(bill);
                                  downloadInvoicePdf(invoiceDetail);
                                  toast({
                                    title: "PDF Downloaded",
                                    description: `Invoice ${bill.invoice_number} has been downloaded.`,
                                  });
                                }}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  <Send className="mr-2 h-4 w-4" />
                                  Send to Customer
                                </DropdownMenuItem>
                                {bill.status !== "paid" && (
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    handleRecordPayment(bill);
                                  }}>
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {(() => {
                const pendingBills = (bills || []).filter(b => b.status === "due" || b.status === "partial");
                if (pendingBills.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <CheckCircle className="h-12 w-12 text-success mb-4" />
                      <p className="text-muted-foreground">No pending invoices</p>
                      <p className="text-sm text-muted-foreground">All invoices are paid!</p>
                    </div>
                  );
                }
                return (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingBills.map((bill) => {
                        const status = (bill.status || "due") as PaymentStatus;
                        const StatusIcon = statusConfig[status].icon;
                        return (
                          <TableRow key={bill.id}>
                            <TableCell className="font-medium">{bill.invoice_number}</TableCell>
                            <TableCell>{bill.customer?.name || "Unknown"}</TableCell>
                            <TableCell>{formatCurrency(Number(bill.amount))}</TableCell>
                            <TableCell>{formatDate(bill.due_date)}</TableCell>
                            <TableCell>
                              <Badge variant={statusConfig[status].variant} className="gap-1">
                                <StatusIcon className="h-3 w-3" />
                                {statusConfig[status].label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" onClick={() => handleRecordPayment(bill)}>
                                Record Payment
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {(() => {
                const overdueBills = (bills || []).filter(b => b.status === "overdue");
                if (overdueBills.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <CheckCircle className="h-12 w-12 text-success mb-4" />
                      <p className="text-muted-foreground">No overdue invoices</p>
                      <p className="text-sm text-muted-foreground">Great! All payments are on time.</p>
                    </div>
                  );
                }
                return (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Days Overdue</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {overdueBills.map((bill) => {
                        const dueDate = new Date(bill.due_date);
                        const today = new Date();
                        const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
                        return (
                          <TableRow key={bill.id} className="bg-destructive/5">
                            <TableCell className="font-medium">{bill.invoice_number}</TableCell>
                            <TableCell>{bill.customer?.name || "Unknown"}</TableCell>
                            <TableCell className="font-semibold text-destructive">
                              {formatCurrency(Number(bill.amount))}
                            </TableCell>
                            <TableCell>{formatDate(bill.due_date)}</TableCell>
                            <TableCell>
                              <Badge variant="destructive">{daysOverdue} days</Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleViewInvoice(bill)}>
                                View
                              </Button>
                              <Button size="sm" onClick={() => handleRecordPayment(bill)}>
                                Collect
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invoice Detail Dialog */}
      <InvoiceDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        invoice={selectedInvoice}
        onRecordPayment={(invoiceId) => {
          const bill = bills?.find(b => b.invoice_number === invoiceId);
          if (bill) handleRecordPayment(bill);
        }}
      />

      {/* Record Payment Dialog */}
      {paymentDialog && currentTenant && (() => {
        const bill = bills?.find(b => b.id === paymentDialog.billId);
        const billingPeriod = bill 
          ? `${formatDate(bill.billing_period_start)} - ${formatDate(bill.billing_period_end)}`
          : undefined;
        return (
          <RecordPaymentDialog
            open={paymentDialog.open}
            onOpenChange={(open) => setPaymentDialog(open ? paymentDialog : null)}
            billId={paymentDialog.billId}
            customerId={paymentDialog.customerId}
            tenantId={currentTenant.id}
            customerName={paymentDialog.customerName}
            customerPhone={bill?.customer?.phone}
            customerAddress={bill?.customer?.address || undefined}
            invoiceNumber={paymentDialog.invoiceNumber}
            billingPeriod={billingPeriod}
            outstandingAmount={paymentDialog.outstandingAmount}
            tenantName={currentTenant.name}
          />
        );
      })()}
    </div>
  );
}
