import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, ArrowUpDown, Eye, Edit, Receipt, CreditCard, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConnectionStatus } from "@/types";

export interface CustomerTableData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  package: string;
  packageId: string;
  status: ConnectionStatus;
  dueAmount: number;
  advanceAmount: number;
  joinDate: string;
  lastPayment: string;
}

interface CustomerTableProps {
  customers: CustomerTableData[];
  onEdit: (customer: CustomerTableData) => void;
  onViewDetails: (customer: CustomerTableData) => void;
  onSuspend: (customer: CustomerTableData) => void;
  onActivate: (customer: CustomerTableData) => void;
  onRecordPayment: (customer: CustomerTableData) => void;
  onGenerateBill: (customer: CustomerTableData) => void;
}

const statusStyles: Record<ConnectionStatus, string> = {
  active: "status-active",
  suspended: "status-suspended",
  pending: "status-pending",
};

const statusLabels: Record<ConnectionStatus, string> = {
  active: "Active",
  suspended: "Suspended",
  pending: "Pending",
};

export function CustomerTable({
  customers,
  onEdit,
  onViewDetails,
  onSuspend,
  onActivate,
  onRecordPayment,
  onGenerateBill,
}: CustomerTableProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" className="-ml-3 h-8">
                Customer
                <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
              </Button>
            </TableHead>
            <TableHead>Package</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Due</TableHead>
            <TableHead className="text-right">Advance</TableHead>
            <TableHead>Last Payment</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center">
                <p className="text-muted-foreground">No customers found</p>
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer, index) => (
              <TableRow
                key={customer.id}
                className="data-table-row animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {customer.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.phone}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{customer.package}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium",
                      statusStyles[customer.status]
                    )}
                  >
                    {statusLabels[customer.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      "font-medium",
                      customer.dueAmount > 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                    )}
                  >
                    ৳{customer.dueAmount.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      "font-medium",
                      customer.advanceAmount > 0
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    ৳{customer.advanceAmount.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(customer.lastPayment)}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onViewDetails(customer)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(customer)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Customer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRecordPayment(customer)}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Record Payment
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onGenerateBill(customer)}>
                        <Receipt className="mr-2 h-4 w-4" />
                        Generate Bill
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {customer.status === "active" ? (
                        <DropdownMenuItem
                          onClick={() => onSuspend(customer)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Pause className="mr-2 h-4 w-4" />
                          Suspend Connection
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => onActivate(customer)}
                          className="text-primary focus:text-primary"
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Activate Connection
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
