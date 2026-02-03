import { useState } from "react";
import { Plus, Edit, Trash2, MoreHorizontal, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { usePackages, useCreatePackage, useUpdatePackage, type Package } from "@/hooks/usePackages";
import { useTenantContext } from "@/contexts/TenantContext";
import { useCustomers } from "@/hooks/useCustomers";
import { PackageFormDialog } from "@/components/packages/PackageFormDialog";
import { toast } from "sonner";

export default function Packages() {
  const { currentTenant } = useTenantContext();
  const { data: packages = [], isLoading } = usePackages(currentTenant?.id);
  const { data: customers = [] } = useCustomers(currentTenant?.id);
  const createPackage = useCreatePackage();
  const updatePackage = useUpdatePackage();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  const activePackages = packages.filter((p) => p.is_active);
  const inactivePackages = packages.filter((p) => !p.is_active);

  // Count customers per package
  const getCustomerCount = (packageId: string) => {
    return customers.filter((c) => c.package_id === packageId).length;
  };

  const handleCreatePackage = () => {
    setEditingPackage(null);
    setDialogOpen(true);
  };

  const handleEditPackage = (pkg: Package) => {
    setEditingPackage(pkg);
    setDialogOpen(true);
  };

  const handleSubmit = async (data: {
    name: string;
    speed_label: string;
    monthly_price: number;
    validity_days: number;
    is_active: boolean;
  }) => {
    try {
      if (editingPackage) {
        await updatePackage.mutateAsync({
          id: editingPackage.id,
          updates: data,
        });
        toast.success("প্যাকেজ আপডেট হয়েছে");
      } else {
        if (!currentTenant?.id) {
          toast.error("টেন্যান্ট পাওয়া যায়নি");
          return;
        }
        await createPackage.mutateAsync({
          ...data,
          tenant_id: currentTenant.id,
        });
        toast.success("নতুন প্যাকেজ তৈরি হয়েছে");
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error("কিছু একটা সমস্যা হয়েছে");
      console.error(error);
    }
  };

  const handleToggleActive = async (pkg: Package) => {
    try {
      await updatePackage.mutateAsync({
        id: pkg.id,
        updates: { is_active: !pkg.is_active },
      });
      toast.success(pkg.is_active ? "প্যাকেজ নিষ্ক্রিয় করা হয়েছে" : "প্যাকেজ সক্রিয় করা হয়েছে");
    } catch (error) {
      toast.error("কিছু একটা সমস্যা হয়েছে");
      console.error(error);
    }
  };

  // Calculate stats
  const totalSubscriptions = packages.reduce((sum, p) => sum + getCustomerCount(p.id), 0);
  const avgRevenuePerPackage = activePackages.length > 0 && totalSubscriptions > 0
    ? Math.round(
        activePackages.reduce((sum, p) => sum + p.monthly_price * getCustomerCount(p.id), 0) /
        totalSubscriptions
      )
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">প্যাকেজসমূহ</h1>
          <p className="text-muted-foreground">
            আপনার ইন্টারনেট সার্ভিস প্যাকেজ ম্যানেজ করুন
          </p>
        </div>
        <Button className="gap-2" onClick={handleCreatePackage}>
          <Plus className="h-4 w-4" />
          নতুন প্যাকেজ
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>সক্রিয় প্যাকেজ</CardDescription>
            <CardTitle className="text-3xl">{activePackages.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>মোট সাবস্ক্রিপশন</CardDescription>
            <CardTitle className="text-3xl">
              {totalSubscriptions.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>গড় আয়/প্যাকেজ</CardDescription>
            <CardTitle className="text-3xl">
              ৳{avgRevenuePerPackage.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Active Packages */}
      <div>
        <h2 className="text-lg font-semibold mb-4">সক্রিয় প্যাকেজ</h2>
        {activePackages.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">কোনো সক্রিয় প্যাকেজ নেই</p>
            <Button className="mt-4" onClick={handleCreatePackage}>
              <Plus className="h-4 w-4 mr-2" />
              প্রথম প্যাকেজ তৈরি করুন
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activePackages.map((pkg, index) => {
              const customerCount = getCustomerCount(pkg.id);
              const isPopular = customerCount === Math.max(...activePackages.map(p => getCustomerCount(p.id))) && customerCount > 0;
              
              return (
                <Card
                  key={pkg.id}
                  className={cn(
                    "relative animate-fade-in transition-micro hover:shadow-md",
                    isPopular && "ring-2 ring-primary"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-4">
                      <Badge className="bg-primary text-primary-foreground">
                        সবচেয়ে জনপ্রিয়
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Zap className="h-4 w-4" />
                          <span className="font-medium">{pkg.speed_label}</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditPackage(pkg)}>
                            <Edit className="mr-2 h-4 w-4" />
                            সম্পাদনা
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleToggleActive(pkg)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            নিষ্ক্রিয় করুন
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">৳{pkg.monthly_price.toLocaleString()}</span>
                      <span className="text-muted-foreground">/মাস</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">সক্রিয় গ্রাহক</span>
                      <span className="font-medium">{customerCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">মাসিক আয়</span>
                      <span className="font-medium text-success">
                        ৳{(pkg.monthly_price * customerCount).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Inactive Packages */}
      {inactivePackages.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
            নিষ্ক্রিয় প্যাকেজ
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {inactivePackages.map((pkg) => (
              <Card key={pkg.id} className="opacity-60">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{pkg.name}</CardTitle>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Zap className="h-4 w-4" />
                        <span className="font-medium">{pkg.speed_label}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground">
                      নিষ্ক্রিয়
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-muted-foreground">
                      ৳{pkg.monthly_price.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">/মাস</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4" 
                    size="sm"
                    onClick={() => handleToggleActive(pkg)}
                  >
                    পুনরায় সক্রিয় করুন
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Package Form Dialog */}
      <PackageFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        package={editingPackage}
        onSubmit={handleSubmit}
        isLoading={createPackage.isPending || updatePackage.isPending}
      />
    </div>
  );
}
