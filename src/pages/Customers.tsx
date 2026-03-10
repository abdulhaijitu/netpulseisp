import { useState, useMemo } from "react";
import { Plus, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerTable, type CustomerTableData } from "@/components/customers/CustomerTable";
import { CustomerFormDialog, type CustomerFormData } from "@/components/customers/CustomerFormDialog";
import { ConnectionStatusDialog } from "@/components/customers/ConnectionStatusDialog";
import { CustomerFiltersBar, type CustomerFilters } from "@/components/customers/CustomerFilters";
import { CustomerPagination } from "@/components/customers/CustomerPagination";
import { useToast } from "@/hooks/use-toast";
import { useCustomers, useCreateCustomer, useUpdateCustomer } from "@/hooks/useCustomers";
import { usePackages } from "@/hooks/usePackages";
import { useTenantContext } from "@/contexts/TenantContext";
import type { ConnectionStatus } from "@/types";

export default function Customers() {
  const { toast } = useToast();
  const { currentTenant } = useTenantContext();
  const { data: customers, isLoading, error } = useCustomers(currentTenant?.id);
  const { data: packages } = usePackages(currentTenant?.id);
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  // Filter state
  const [filters, setFilters] = useState<CustomerFilters>({
    search: "",
    status: "all",
    packageId: "all",
    balanceType: "all",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Form dialog state
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerFormData | null>(null);

  // Connection status dialog state
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusDialogCustomer, setStatusDialogCustomer] = useState<CustomerTableData | null>(null);
  const [targetStatus, setTargetStatus] = useState<ConnectionStatus>("active");

  // Transform database customers to table format
  const tableData: CustomerTableData[] = useMemo(() => 
    (customers ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email ?? "",
      phone: c.phone,
      address: c.address ?? "",
      package: c.package?.name ?? "No package",
      packageId: c.package_id ?? "",
      status: c.connection_status ?? "pending",
      dueAmount: c.due_balance ?? 0,
      advanceAmount: c.advance_balance ?? 0,
      joinDate: c.join_date,
      lastPayment: c.last_payment_date ?? c.join_date,
    })), [customers]
  );

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return tableData.filter((customer) => {
      // Search filter
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        !filters.search ||
        customer.name.toLowerCase().includes(searchLower) ||
        customer.phone.includes(filters.search) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.id.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus =
        filters.status === "all" || customer.status === filters.status;

      // Package filter
      const matchesPackage =
        filters.packageId === "all" ||
        (filters.packageId === "none" && !customer.packageId) ||
        customer.packageId === filters.packageId;

      // Balance type filter
      let matchesBalance = true;
      if (filters.balanceType === "due") {
        matchesBalance = customer.dueAmount > 0;
      } else if (filters.balanceType === "advance") {
        matchesBalance = customer.advanceAmount > 0;
      } else if (filters.balanceType === "clear") {
        matchesBalance = customer.dueAmount === 0 && customer.advanceAmount === 0;
      }

      return matchesSearch && matchesStatus && matchesPackage && matchesBalance;
    });
  }, [tableData, filters]);

  // Paginate customers
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(startIndex, startIndex + pageSize);
  }, [filteredCustomers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredCustomers.length / pageSize);

  // Reset to page 1 when filters change
  const handleFiltersChange = (newFilters: CustomerFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

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
    if (!currentTenant?.id) {
      toast({
        title: "Error",
        description: "Tenant information not found.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (formMode === "add") {
        await createCustomer.mutateAsync({
          tenant_id: currentTenant.id,
          name: data.name,
          email: data.email || null,
          phone: data.phone,
          address: data.address || null,
          package_id: data.packageId || null,
          connection_status: "pending",
          due_balance: 0,
          advance_balance: 0,
        });
        toast({
          title: "Customer added",
          description: `${data.name} was added successfully.`,
        });
      } else {
        await updateCustomer.mutateAsync({
          id: data.id!,
          updates: {
            name: data.name,
            email: data.email || null,
            phone: data.phone,
            address: data.address || null,
            package_id: data.packageId || null,
            connection_status: data.connectionStatus,
            due_balance: data.dueBalance,
            advance_balance: data.advanceBalance,
          },
        });
        toast({
          title: "Customer updated",
          description: `${data.name} details were updated.`,
        });
      }
    } catch (err) {
      console.error("Error saving customer:", err);
      toast({
        title: "Error",
        description: "Failed to save customer.",
        variant: "destructive",
      });
      throw err;
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
    try {
      await updateCustomer.mutateAsync({
        id: customerId,
        updates: { connection_status: newStatus },
      });
      const customer = tableData.find((c) => c.id === customerId);
      toast({
        title: newStatus === "active" ? "Connection activated" : "Connection suspended",
        description: `${customer?.name} connection was ${newStatus === "active" ? "activated" : "suspended"}.`,
      });
    } catch (err) {
      console.error("Error updating status:", err);
      toast({
        title: "Error",
        description: "Failed to update connection status.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (customer: CustomerTableData) => {
    window.location.href = `/dashboard/customers/${customer.id}`;
  };

  const handleRecordPayment = (customer: CustomerTableData) => {
    toast({
      title: "Coming soon",
      description: "Payment recording will be added soon.",
    });
  };

  const handleGenerateBill = (customer: CustomerTableData) => {
    toast({
      title: "Coming soon",
      description: "Bill generation will be added soon.",
    });
  };

  const handleExport = () => {
    // Export filtered data as CSV
    const headers = ["ID", "Name", "Phone", "Email", "Package", "Status", "Due", "Advance"];
    const rows = filteredCustomers.map((c) => [
      c.id,
      c.name,
      c.phone,
      c.email,
      c.package,
      c.status,
      c.dueAmount,
      c.advanceAmount,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export complete",
      description: `${filteredCustomers.length} customers exported.`,
    });
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive">Failed to load customer data.</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customers and their connections
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2" onClick={handleAddCustomer}>
            <Plus className="h-4 w-4" />
            New Customer
          </Button>
        </div>
      </div>

      {/* Filters */}
      <CustomerFiltersBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        packages={packages ?? []}
        totalCount={tableData.length}
        filteredCount={filteredCustomers.length}
      />

      {/* Customer Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <CustomerTable
          customers={paginatedCustomers}
          onEdit={handleEditCustomer}
          onViewDetails={handleViewDetails}
          onSuspend={handleSuspendConnection}
          onActivate={handleActivateConnection}
          onRecordPayment={handleRecordPayment}
          onGenerateBill={handleGenerateBill}
        />
      )}

      {/* Pagination */}
      <CustomerPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={filteredCustomers.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Add/Edit Customer Dialog */}
      <CustomerFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        customer={selectedCustomer}
        onSubmit={handleFormSubmit}
        mode={formMode}
        tenantId={currentTenant?.id}
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
