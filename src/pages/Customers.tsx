import { useState } from "react";
import { Plus, Search, Filter, Download, Loader2 } from "lucide-react";
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
import { useCustomers, useCreateCustomer, useUpdateCustomer } from "@/hooks/useCustomers";
import { useTenantContext } from "@/contexts/TenantContext";
import type { ConnectionStatus } from "@/types";

export default function Customers() {
  const { toast } = useToast();
  const { currentTenant, isLoading: tenantLoading } = useTenantContext();
  const { data: customers, isLoading, error } = useCustomers(currentTenant?.id);
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

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

  // Transform database customers to table format
  const tableData: CustomerTableData[] = (customers ?? []).map((c) => ({
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
  }));

  const filteredCustomers = tableData.filter((customer) => {
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
    if (!currentTenant?.id) {
      toast({
        title: "ত্রুটি",
        description: "টেন্যান্ট তথ্য পাওয়া যায়নি।",
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
          title: "কাস্টমার যুক্ত হয়েছে",
          description: `${data.name} সফলভাবে যুক্ত হয়েছে।`,
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
          title: "কাস্টমার আপডেট হয়েছে",
          description: `${data.name} এর তথ্য আপডেট হয়েছে।`,
        });
      }
    } catch (err) {
      console.error("Error saving customer:", err);
      toast({
        title: "ত্রুটি",
        description: "কাস্টমার সেভ করতে সমস্যা হয়েছে।",
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
        title: newStatus === "active" ? "সংযোগ সক্রিয়" : "সংযোগ স্থগিত",
        description: `${customer?.name} এর সংযোগ ${newStatus === "active" ? "সক্রিয়" : "স্থগিত"} করা হয়েছে।`,
      });
    } catch (err) {
      console.error("Error updating status:", err);
      toast({
        title: "ত্রুটি",
        description: "সংযোগ স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (customer: CustomerTableData) => {
    toast({
      title: "শীঘ্রই আসছে",
      description: "কাস্টমার বিস্তারিত ভিউ শীঘ্রই যুক্ত হবে।",
    });
  };

  const handleRecordPayment = (customer: CustomerTableData) => {
    toast({
      title: "শীঘ্রই আসছে",
      description: "পেমেন্ট রেকর্ড শীঘ্রই যুক্ত হবে।",
    });
  };

  const handleGenerateBill = (customer: CustomerTableData) => {
    toast({
      title: "শীঘ্রই আসছে",
      description: "বিল জেনারেট শীঘ্রই যুক্ত হবে।",
    });
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive">কাস্টমার তথ্য লোড করতে সমস্যা হয়েছে।</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          পুনরায় চেষ্টা করুন
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">কাস্টমার</h1>
          <p className="text-muted-foreground">
            আপনার কাস্টমার এবং সংযোগ ম্যানেজ করুন
          </p>
        </div>
        <Button className="gap-2" onClick={handleAddCustomer}>
          <Plus className="h-4 w-4" />
          নতুন কাস্টমার
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="নাম, ফোন বা ID দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="স্ট্যাটাস" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
              <SelectItem value="active">সক্রিয়</SelectItem>
              <SelectItem value="suspended">স্থগিত</SelectItem>
              <SelectItem value="pending">অপেক্ষমান</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Customer Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <CustomerTable
          customers={filteredCustomers}
          onEdit={handleEditCustomer}
          onViewDetails={handleViewDetails}
          onSuspend={handleSuspendConnection}
          onActivate={handleActivateConnection}
          onRecordPayment={handleRecordPayment}
          onGenerateBill={handleGenerateBill}
        />
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          মোট {tableData.length} কাস্টমারের মধ্যে {filteredCustomers.length} জন দেখানো হচ্ছে
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            আগের
          </Button>
          <Button variant="outline" size="sm" disabled={filteredCustomers.length <= 10}>
            পরের
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
