import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Download, 
  Eye, 
  Search,
  Receipt,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard
} from "lucide-react";

// Mock bills data
const mockBills = [
  {
    id: "INV-2024-002",
    period: "February 2024",
    amount: 1200,
    dueDate: "2024-02-15",
    status: "due" as const,
  },
  {
    id: "INV-2024-001",
    period: "January 2024",
    amount: 1200,
    dueDate: "2024-01-15",
    status: "paid" as const,
  },
  {
    id: "INV-2023-012",
    period: "December 2023",
    amount: 1200,
    dueDate: "2023-12-15",
    status: "paid" as const,
  },
  {
    id: "INV-2023-011",
    period: "November 2023",
    amount: 1200,
    dueDate: "2023-11-15",
    status: "paid" as const,
  },
];

const statusConfig = {
  paid: { label: "Paid", variant: "default" as const, icon: CheckCircle },
  due: { label: "Due", variant: "secondary" as const, icon: Clock },
  partial: { label: "Partial", variant: "outline" as const, icon: AlertCircle },
  overdue: { label: "Overdue", variant: "destructive" as const, icon: AlertCircle },
};

export default function PortalBills() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBill, setSelectedBill] = useState<typeof mockBills[0] | null>(null);

  const filteredBills = mockBills.filter(
    (bill) =>
      bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.period.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const totalDue = mockBills
    .filter((b) => b.status !== "paid")
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Bills</h1>
        <p className="text-muted-foreground">
          View and manage your billing history
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Outstanding</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(totalDue)}</CardTitle>
          </CardHeader>
          <CardContent>
            {totalDue > 0 && (
              <Button className="w-full gap-2">
                <CreditCard className="h-4 w-4" />
                Pay Now
              </Button>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Bills</CardDescription>
            <CardTitle className="text-3xl">{mockBills.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {mockBills.filter((b) => b.status === "paid").length} paid, {" "}
              {mockBills.filter((b) => b.status !== "paid").length} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bills Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Billing History
          </CardTitle>
          <CardDescription>
            View all your past and current bills
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search bills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Period</TableHead>
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
                      <TableCell>{bill.period}</TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(bill.amount)}
                      </TableCell>
                      <TableCell>{formatDate(bill.dueDate)}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[bill.status].variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig[bill.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setSelectedBill(bill)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Invoice {bill.id}</DialogTitle>
                                <DialogDescription>
                                  Billing period: {bill.period}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="flex justify-between border-b pb-2">
                                  <span className="text-muted-foreground">Package</span>
                                  <span>Premium 50 Mbps</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                  <span className="text-muted-foreground">Monthly Fee</span>
                                  <span>{formatCurrency(bill.amount)}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                  <span className="text-muted-foreground">Due Date</span>
                                  <span>{formatDate(bill.dueDate)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2">
                                  <span>Total</span>
                                  <span>{formatCurrency(bill.amount)}</span>
                                </div>
                                {bill.status !== "paid" && (
                                  <Button className="w-full mt-4">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Pay Now
                                  </Button>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
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
