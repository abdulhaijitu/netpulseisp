import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { MoreVertical, Eye, Edit, Receipt, CreditCard, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { ConnectionStatus } from "@/types";

export interface CustomerTableData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  package: string;
  packageId: string;
  speed?: string;
  status: ConnectionStatus;
  dueAmount: number;
  advanceAmount: number;
  joinDate: string;
  lastPayment: string;
  networkUsername?: string;
  monthlyPrice?: number;
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
  active: "bg-success/15 text-success border-success/25",
  suspended: "bg-destructive/15 text-destructive border-destructive/25",
  pending: "bg-warning/15 text-warning border-warning/25",
};

const statusLabels: Record<ConnectionStatus, string> = {
  active: "Active",
  suspended: "Inactive",
  pending: "Pending",
};

const billingStatusStyles: Record<string, string> = {
  paid: "bg-success/15 text-success border-success/25",
  due: "bg-destructive/15 text-destructive border-destructive/25",
  clear: "bg-muted text-muted-foreground border-border",
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

  const getBillingStatus = (customer: CustomerTableData) => {
    if (customer.dueAmount > 0) return "due";
    if (customer.advanceAmount > 0) return "paid";
    return "clear";
  };

  const getBillingLabel = (customer: CustomerTableData) => {
    if (customer.dueAmount > 0) return "Due";
    if (customer.advanceAmount > 0) return "Paid";
    return "Clear";
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5 hover:bg-primary/5">
                <TableHead className="w-12 font-semibold text-xs">#</TableHead>
                <TableHead className="font-semibold text-xs min-w-[90px]">C.Code</TableHead>
                <TableHead className="font-semibold text-xs min-w-[100px]">ID/IP</TableHead>
                <TableHead className="font-semibold text-xs min-w-[130px]">Cus. Name</TableHead>
                <TableHead className="font-semibold text-xs min-w-[110px]">Mobile</TableHead>
                <TableHead className="font-semibold text-xs">Zone</TableHead>
                <TableHead className="font-semibold text-xs">Conn. Type</TableHead>
                <TableHead className="font-semibold text-xs">Cus. Type</TableHead>
                <TableHead className="font-semibold text-xs min-w-[140px]">Package/Speed</TableHead>
                <TableHead className="font-semibold text-xs text-right">M.Bill</TableHead>
                <TableHead className="font-semibold text-xs text-right">Due</TableHead>
                <TableHead className="font-semibold text-xs text-center">B.Status</TableHead>
                <TableHead className="font-semibold text-xs text-center">M.Status</TableHead>
                <TableHead className="font-semibold text-xs text-center w-16">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} className="h-32 text-center">
                    <p className="text-muted-foreground">No customers found</p>
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer, index) => {
                  const bStatus = getBillingStatus(customer);
                  const bLabel = getBillingLabel(customer);
                  return (
                    <TableRow
                      key={customer.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 20}ms` }}
                    >
                      <TableCell className="text-xs text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {customer.id.slice(0, 8)}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-primary">
                        {customer.networkUsername || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-semibold">
                              {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate">{customer.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{customer.phone}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{customer.address?.split(",")[0] || "—"}</TableCell>
                      <TableCell className="text-xs">Fiber</TableCell>
                      <TableCell className="text-xs">Home</TableCell>
                      <TableCell className="text-xs">
                        <span className="font-medium">{customer.package}</span>
                        {customer.speed && <span className="text-muted-foreground">/{customer.speed}</span>}
                      </TableCell>
                      <TableCell className="text-xs text-right font-medium">
                        ৳{(customer.monthlyPrice || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs text-right">
                        <span className={cn("font-medium", customer.dueAmount > 0 ? "text-destructive" : "text-muted-foreground")}>
                          ৳{customer.dueAmount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={cn("text-[10px] border", billingStatusStyles[bStatus])}>
                          {bLabel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Switch
                            checked={customer.status === "active"}
                            onCheckedChange={() => {
                              if (customer.status === "active") onSuspend(customer);
                              else onActivate(customer);
                            }}
                            className="scale-75"
                          />
                          <Badge variant="outline" className={cn("text-[10px] border", statusStyles[customer.status])}>
                            {statusLabels[customer.status]}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onViewDetails(customer)}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(customer)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onRecordPayment(customer)}>
                              <CreditCard className="mr-2 h-4 w-4" /> Record Payment
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onGenerateBill(customer)}>
                              <Receipt className="mr-2 h-4 w-4" /> Generate Bill
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {customer.status === "active" ? (
                              <DropdownMenuItem onClick={() => onSuspend(customer)} className="text-destructive focus:text-destructive">
                                <Pause className="mr-2 h-4 w-4" /> Suspend
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => onActivate(customer)} className="text-primary focus:text-primary">
                                <Play className="mr-2 h-4 w-4" /> Activate
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
