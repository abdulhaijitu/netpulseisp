import { useState } from "react";
import { 
  Plus, Edit, Trash2, MoreHorizontal, Zap, Loader2, 
  LayoutGrid, List, Users, TrendingUp, Package as PackageIcon,
  ToggleLeft, ToggleRight, Eye
} from "lucide-react";
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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { usePackages, useCreatePackage, useUpdatePackage, useDeletePackage, type Package } from "@/hooks/usePackages";
import { useTenantContext } from "@/contexts/TenantContext";
import { useCustomers } from "@/hooks/useCustomers";
import { PackageFormDialog } from "@/components/packages/PackageFormDialog";
import { DeletePackageDialog } from "@/components/packages/DeletePackageDialog";
import { toast } from "sonner";

type ViewMode = "cards" | "table";

export default function Packages() {
  const { currentTenant } = useTenantContext();
  const { data: packages = [], isLoading } = usePackages(currentTenant?.id);
  const { data: customers = [] } = useCustomers(currentTenant?.id);
  const createPackage = useCreatePackage();
  const updatePackage = useUpdatePackage();
  const deletePackage = useDeletePackage();

  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingPackage, setDeletingPackage] = useState<Package | null>(null);

  const activePackages = packages.filter((p) => p.is_active);
  const inactivePackages = packages.filter((p) => !p.is_active);

  // Count customers per package
  const getCustomerCount = (packageId: string) => {
    return customers.filter((c) => c.package_id === packageId).length;
  };

  const totalSubscriptions = packages.reduce((sum, p) => sum + getCustomerCount(p.id), 0);
  const totalMonthlyRevenue = activePackages.reduce(
    (sum, p) => sum + p.monthly_price * getCustomerCount(p.id), 
    0
  );
  const avgRevenuePerPackage = totalSubscriptions > 0
    ? Math.round(totalMonthlyRevenue / totalSubscriptions)
    : 0;

  // Find most popular package
  const mostPopularPackageId = activePackages.length > 0
    ? activePackages.reduce((a, b) => 
        getCustomerCount(a.id) > getCustomerCount(b.id) ? a : b
      ).id
    : null;

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

  const handleDeletePackage = (pkg: Package) => {
    setDeletingPackage(pkg);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPackage) return;
    try {
      await deletePackage.mutateAsync(deletingPackage.id);
      toast.success("প্যাকেজ ডিলিট হয়েছে");
      setDeleteDialogOpen(false);
      setDeletingPackage(null);
    } catch (error) {
      toast.error("প্যাকেজ ডিলিট করা যায়নি");
      console.error(error);
    }
  };

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
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(value) => value && setViewMode(value as ViewMode)}
            className="bg-muted p-1 rounded-lg"
          >
            <ToggleGroupItem 
              value="cards" 
              aria-label="Card view"
              className="data-[state=on]:bg-background data-[state=on]:shadow-sm px-3"
            >
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="table" 
              aria-label="Table view"
              className="data-[state=on]:bg-background data-[state=on]:shadow-sm px-3"
            >
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          
          <Button className="gap-2" onClick={handleCreatePackage}>
            <Plus className="h-4 w-4" />
            নতুন প্যাকেজ
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -mr-10 -mt-10" />
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <PackageIcon className="h-4 w-4 text-primary" />
              </div>
              <CardDescription>সক্রিয় প্যাকেজ</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activePackages.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              মোট {packages.length} প্যাকেজের মধ্যে
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10" />
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <CardDescription>মোট সাবস্ক্রিপশন</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSubscriptions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              সক্রিয় গ্রাহক সংখ্যা
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10" />
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <CardDescription>মাসিক আয়</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">৳{totalMonthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              প্যাকেজ থেকে প্রত্যাশিত
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -mr-10 -mt-10" />
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Zap className="h-4 w-4 text-orange-500" />
              </div>
              <CardDescription>গড় আয়/গ্রাহক</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">৳{avgRevenuePerPackage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              প্রতি মাসে
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Packages Content */}
      {viewMode === "cards" ? (
        // Card View
        <div className="space-y-6">
          {/* Active Packages */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold">সক্রিয় প্যাকেজ</h2>
              <Badge variant="secondary">{activePackages.length}</Badge>
            </div>
            
            {activePackages.length === 0 ? (
              <Card className="p-8 text-center border-dashed">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-muted rounded-full">
                    <PackageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Create packages to assign customers</p>
                    <p className="text-sm text-muted-foreground">
                      Define internet plans with speed and pricing so you can start billing
                    </p>
                  </div>
                  <Button className="mt-2" onClick={handleCreatePackage}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Package
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activePackages.map((pkg, index) => {
                  const customerCount = getCustomerCount(pkg.id);
                  const isPopular = mostPopularPackageId === pkg.id && customerCount > 0;
                  const revenuePercentage = totalMonthlyRevenue > 0 
                    ? Math.round((pkg.monthly_price * customerCount / totalMonthlyRevenue) * 100)
                    : 0;
                  
                  return (
                    <Card
                      key={pkg.id}
                      className={cn(
                        "relative animate-fade-in group transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
                        isPopular && "ring-2 ring-primary shadow-primary/20"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {isPopular && (
                        <div className="absolute -top-3 left-4 z-10">
                          <Badge className="bg-primary text-primary-foreground shadow-lg">
                            ⭐ সবচেয়ে জনপ্রিয়
                          </Badge>
                        </div>
                      )}
                      
                      {/* Gradient Top Border */}
                      <div className={cn(
                        "absolute top-0 left-0 right-0 h-1 rounded-t-lg",
                        isPopular ? "bg-gradient-to-r from-primary to-primary/50" : "bg-gradient-to-r from-muted-foreground/20 to-transparent"
                      )} />

                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-xl">{pkg.name}</CardTitle>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1.5 text-muted-foreground bg-muted px-2 py-1 rounded-md">
                                <Zap className="h-3.5 w-3.5" />
                                <span className="text-sm font-medium">{pkg.speed_label}</span>
                              </div>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditPackage(pkg)}>
                                <Edit className="mr-2 h-4 w-4" />
                                সম্পাদনা
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleActive(pkg)}>
                                <ToggleLeft className="mr-2 h-4 w-4" />
                                নিষ্ক্রিয় করুন
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeletePackage(pkg)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                ডিলিট করুন
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Price */}
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold">৳{pkg.monthly_price.toLocaleString()}</span>
                          <span className="text-muted-foreground text-sm">/মাস</span>
                        </div>

                        {/* Stats */}
                        <div className="space-y-3 pt-2 border-t">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>সক্রিয় গ্রাহক</span>
                            </div>
                            <span className="font-semibold">{customerCount.toLocaleString()}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <TrendingUp className="h-4 w-4" />
                              <span>মাসিক আয়</span>
                            </div>
                            <span className="font-semibold text-green-600">
                              ৳{(pkg.monthly_price * customerCount).toLocaleString()}
                            </span>
                          </div>

                          {/* Revenue Share */}
                          {revenuePercentage > 0 && (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>আয়ের অংশ</span>
                                <span>{revenuePercentage}%</span>
                              </div>
                              <Progress value={revenuePercentage} className="h-1.5" />
                            </div>
                          )}
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
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold text-muted-foreground">নিষ্ক্রিয় প্যাকেজ</h2>
                <Badge variant="outline">{inactivePackages.length}</Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {inactivePackages.map((pkg) => (
                  <Card key={pkg.id} className="opacity-60 hover:opacity-80 transition-opacity">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{pkg.name}</CardTitle>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Zap className="h-3.5 w-3.5" />
                            <span className="text-sm">{pkg.speed_label}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-muted-foreground">
                          নিষ্ক্রিয়
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-2xl font-bold text-muted-foreground">
                          ৳{pkg.monthly_price.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground text-sm">/মাস</span>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full gap-2" 
                        size="sm"
                        onClick={() => handleToggleActive(pkg)}
                      >
                        <ToggleRight className="h-4 w-4" />
                        পুনরায় সক্রিয় করুন
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Table View
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>প্যাকেজ</TableHead>
                <TableHead>স্পিড</TableHead>
                <TableHead className="text-right">মাসিক মূল্য</TableHead>
                <TableHead className="text-right">গ্রাহক</TableHead>
                <TableHead className="text-right">মাসিক আয়</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <PackageIcon className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">কোনো প্যাকেজ নেই</p>
                      <Button size="sm" onClick={handleCreatePackage}>
                        <Plus className="h-4 w-4 mr-2" />
                        প্যাকেজ তৈরি করুন
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                packages.map((pkg, index) => {
                  const customerCount = getCustomerCount(pkg.id);
                  const isPopular = mostPopularPackageId === pkg.id && customerCount > 0;
                  
                  return (
                    <TableRow 
                      key={pkg.id} 
                      className={cn(
                        "animate-fade-in",
                        !pkg.is_active && "opacity-60"
                      )}
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            pkg.is_active ? "bg-green-500" : "bg-muted-foreground"
                          )} />
                          <span className="font-medium">{pkg.name}</span>
                          {isPopular && (
                            <Badge variant="secondary" className="text-xs">
                              ⭐ জনপ্রিয়
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Zap className="h-3.5 w-3.5" />
                          <span>{pkg.speed_label}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ৳{pkg.monthly_price.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {customerCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        ৳{(pkg.monthly_price * customerCount).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={pkg.is_active ? "default" : "outline"}
                          className={cn(
                            pkg.is_active 
                              ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" 
                              : "text-muted-foreground"
                          )}
                        >
                          {pkg.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                        </Badge>
                      </TableCell>
                      <TableCell>
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
                            <DropdownMenuItem onClick={() => handleToggleActive(pkg)}>
                              {pkg.is_active ? (
                                <>
                                  <ToggleLeft className="mr-2 h-4 w-4" />
                                  নিষ্ক্রিয় করুন
                                </>
                              ) : (
                                <>
                                  <ToggleRight className="mr-2 h-4 w-4" />
                                  সক্রিয় করুন
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeletePackage(pkg)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              ডিলিট করুন
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Package Form Dialog */}
      <PackageFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        package={editingPackage}
        onSubmit={handleSubmit}
        isLoading={createPackage.isPending || updatePackage.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeletePackageDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        packageName={deletingPackage?.name || ""}
        customerCount={deletingPackage ? getCustomerCount(deletingPackage.id) : 0}
        onConfirm={handleConfirmDelete}
        isLoading={deletePackage.isPending}
      />
    </div>
  );
}
