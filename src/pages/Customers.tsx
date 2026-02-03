import { useState } from "react";
import { Plus, Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomerTable, type CustomerTableData } from "@/components/customers/CustomerTable";
import { CustomerFormDialog, type CustomerFormData } from "@/components/customers/CustomerFormDialog";
import { ConnectionStatusDialog } from "@/components/customers/ConnectionStatusDialog";
import { useToast } from "@/hooks/use-toast";
import type { ConnectionStatus } from "@/types";

// Mock data - will be replaced with database queries
const mockCustomers: CustomerTableData[] = [
  {
    id: "CUS001",
    name: "Rahim Ahmed",
    email: "rahim@email.com",
    phone: "01712345678",
    address: "House 12, Road 5, Dhanmondi",
    package: "30 Mbps Pro",
    packageId: "pkg2",
    status: "active",
    dueAmount: 0,
    advanceAmount: 1500,
    joinDate: "2023-06-15",
    lastPayment: "2024-01-15",
  },
  {
    id: "CUS002",
    name: "Karim Hossain",
    email: "karim@email.com",
    phone: "01812345678",
    address: "Flat 4B, Gulshan Avenue",
    package: "20 Mbps Basic",
    packageId: "pkg1",
    status: "active",
    dueAmount: 1500,
    advanceAmount: 0,
    joinDate: "2023-08-20",
    lastPayment: "2023-12-20",
  },
  {
    id: "CUS003",
    name: "Nasir Khan",
    email: "nasir@email.com",
    phone: "01912345678",
    address: "789 Banani DOHS",
    package: "50 Mbps Premium",
    packageId: "pkg3",
    status: "suspended",
    dueAmount: 4500,
    advanceAmount: 0,
    joinDate: "2023-03-10",
    lastPayment: "2023-11-10",
  },
  {
    id: "CUS004",
    name: "Jamal Uddin",
    email: "jamal@email.com",
    phone: "01612345678",
    address: "321 Mirpur-10",
    package: "30 Mbps Pro",
    packageId: "pkg2",
    status: "active",
    dueAmount: 0,
    advanceAmount: 0,
    joinDate: "2023-09-01",
    lastPayment: "2024-01-20",
  },
  {
    id: "CUS005",
    name: "Faruk Ahmed",
    email: "faruk@email.com",
    phone: "01512345678",
    address: "567 Uttara Sector-7",
    package: "20 Mbps Basic",
    packageId: "pkg1",
    status: "pending",
    dueAmount: 750,
    advanceAmount: 0,
    joinDate: "2024-01-05",
    lastPayment: "2024-01-05",
  },
  {
    id: "CUS006",
    name: "Salma Begum",
    email: "salma@email.com",
    phone: "01712345679",
    address: "89 Mohammadpur",
    package: "50 Mbps Premium",
    packageId: "pkg3",
    status: "active",
    dueAmount: 0,
    advanceAmount: 3000,
    joinDate: "2022-11-15",
    lastPayment: "2024-01-18",
  },
];

export default function Customers() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<CustomerTableData[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Form dialog state
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerFormData | null>(null);

  // Connection status dialog state
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusDialogCustomer, setStatusDialogCustomer] = useState<CustomerTableData | null>(null);
  const [targetStatus, setTargetStatus] = useState<ConnectionStatus>("active");

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddCustomer = () => {
    setFormMode("add");
    setSelectedCustomer(null);
    setFormDialogOpen(true);
  };

  const handleEditCustomer = (customer: CustomerTableData) => {
    setFormMode("edit");
    setSelectedCustomer({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      packageId: customer.packageId,
      connectionStatus: customer.status,
      dueBalance: customer.dueAmount,
      advanceBalance: customer.advanceAmount,
    });
    setFormDialogOpen(true);
  };

  const handleFormSubmit = async (data: CustomerFormData) => {
    // Mock package mapping
    const packageNames: Record<string, string> = {
      pkg1: "20 Mbps Basic",
      pkg2: "30 Mbps Pro",
      pkg3: "50 Mbps Premium",
      pkg4: "100 Mbps Ultra",
    };

    if (formMode === "add") {
      const newCustomer: CustomerTableData = {
        id: `CUS${String(customers.length + 1).padStart(3, "0")}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        package: packageNames[data.packageId] || data.packageId,
        packageId: data.packageId,
        status: "pending",
        dueAmount: 0,
        advanceAmount: 0,
        joinDate: new Date().toISOString().split("T")[0],
        lastPayment: new Date().toISOString().split("T")[0],
      };
      setCustomers([newCustomer, ...customers]);
      toast({
        title: "Customer Added",
        description: `${data.name} has been added successfully.`,
      });
    } else {
      setCustomers(
        customers.map((c) =>
          c.id === data.id
            ? {
                ...c,
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                package: packageNames[data.packageId] || data.packageId,
                packageId: data.packageId,
                status: data.connectionStatus,
                dueAmount: data.dueBalance,
                advanceAmount: data.advanceBalance,
              }
            : c
        )
      );
      toast({
        title: "Customer Updated",
        description: `${data.name}'s information has been updated.`,
      });
    }
  };

  const handleSuspendConnection = (customer: CustomerTableData) => {
    setStatusDialogCustomer(customer);
    setTargetStatus("suspended");
    setStatusDialogOpen(true);
  };

  const handleActivateConnection = (customer: CustomerTableData) => {
    setStatusDialogCustomer(customer);
    setTargetStatus("active");
    setStatusDialogOpen(true);
  };

  const handleStatusChange = async (
    customerId: string,
    newStatus: ConnectionStatus,
    reason?: string
  ) => {
    setCustomers(
      customers.map((c) =>
        c.id === customerId ? { ...c, status: newStatus } : c
      )
    );

    const customer = customers.find((c) => c.id === customerId);
    toast({
      title: newStatus === "active" ? "Connection Activated" : "Connection Suspended",
      description: `${customer?.name}'s connection has been ${newStatus === "active" ? "activated" : "suspended"}.`,
    });
  };

  const handleViewDetails = (customer: CustomerTableData) => {
    toast({
      title: "Coming Soon",
      description: "Customer details view will be implemented soon.",
    });
  };

  const handleRecordPayment = (customer: CustomerTableData) => {
    toast({
      title: "Coming Soon",
      description: "Payment recording will be implemented soon.",
    });
  };

  const handleGenerateBill = (customer: CustomerTableData) => {
    toast({
      title: "Coming Soon",
      description: "Bill generation will be implemented soon.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer base and connections
          </p>
        </div>
        <Button className="gap-2" onClick={handleAddCustomer}>
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Customer Table */}
      <CustomerTable
        customers={filteredCustomers}
        onEdit={handleEditCustomer}
        onViewDetails={handleViewDetails}
        onSuspend={handleSuspendConnection}
        onActivate={handleActivateConnection}
        onRecordPayment={handleRecordPayment}
        onGenerateBill={handleGenerateBill}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredCustomers.length} of {customers.length} customers
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>

      {/* Add/Edit Customer Dialog */}
      <CustomerFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        customer={selectedCustomer}
        onSubmit={handleFormSubmit}
        mode={formMode}
      />

      {/* Connection Status Dialog */}
      {statusDialogCustomer && (
        <ConnectionStatusDialog
          open={statusDialogOpen}
          onOpenChange={setStatusDialogOpen}
          customerName={statusDialogCustomer.name}
          customerId={statusDialogCustomer.id}
          currentStatus={statusDialogCustomer.status}
          targetStatus={targetStatus}
          onConfirm={handleStatusChange}
        />
      )}
    </div>
  );
}
