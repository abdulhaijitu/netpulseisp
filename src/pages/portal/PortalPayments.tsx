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
  Search,
  CreditCard,
  CheckCircle,
  Banknote,
  Smartphone,
  Download
} from "lucide-react";

// Mock payments data
const mockPayments = [
  {
    id: "PAY-2024-001",
    date: "2024-01-10",
    amount: 1200,
    method: "cash" as const,
    reference: "Receipt #1234",
    billId: "INV-2024-001",
  },
  {
    id: "PAY-2023-012",
    date: "2023-12-08",
    amount: 1200,
    method: "online" as const,
    reference: "TXN-789456",
    billId: "INV-2023-012",
  },
  {
    id: "PAY-2023-011",
    date: "2023-11-05",
    amount: 1200,
    method: "bank_transfer" as const,
    reference: "BANK-456123",
    billId: "INV-2023-011",
  },
  {
    id: "PAY-2023-010",
    date: "2023-10-12",
    amount: 1200,
    method: "online" as const,
    reference: "TXN-321654",
    billId: "INV-2023-010",
  },
];

const methodConfig = {
  cash: { label: "Cash", icon: Banknote },
  online: { label: "Online", icon: Smartphone },
  bank_transfer: { label: "Bank Transfer", icon: CreditCard },
};

export default function PortalPayments() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPayments = mockPayments.filter(
    (payment) =>
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.billId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const totalPaid = mockPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payment History</h1>
        <p className="text-muted-foreground">
          View all your past payments
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Paid (Last 12 Months)</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(totalPaid)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {mockPayments.length} payments made
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Last Payment</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(mockPayments[0].amount)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              on {formatDate(mockPayments[0].date)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            All Payments
          </CardTitle>
          <CardDescription>
            Complete history of your payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>For Invoice</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => {
                  const MethodIcon = methodConfig[payment.method].icon;
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{formatDate(payment.date)}</TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MethodIcon className="h-4 w-4 text-muted-foreground" />
                          {methodConfig[payment.method].label}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {payment.reference}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.billId}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
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
