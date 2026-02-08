import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Plus,
  RefreshCw,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  Wallet,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useResellers, useToggleResellerStatus } from "@/hooks/useResellers";
import { ResellerFormDialog } from "@/components/resellers/ResellerFormDialog";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; variant: "default" | "destructive" | "secondary" }> = {
  active: { label: "সক্রিয়", variant: "default" },
  suspended: { label: "সাসপেন্ড", variant: "destructive" },
  inactive: { label: "নিষ্ক্রিয়", variant: "secondary" },
};

const commissionLabels: Record<string, string> = {
  percentage: "শতাংশ",
  flat: "ফ্ল্যাট",
  per_payment: "প্রতি পেমেন্ট",
};

export default function Resellers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: resellers, isLoading } = useResellers();
  const toggleStatus = useToggleResellerStatus();

  const filtered = (resellers || []).filter((r) => {
    const matchSearch =
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalResellers = resellers?.length || 0;
  const activeResellers = resellers?.filter((r) => r.status === "active").length || 0;
  const totalCustomers = resellers?.reduce((s, r) => s + (r.customer_count || 0), 0) || 0;
  const totalCommission = resellers?.reduce((s, r) => s + (r.total_commission || 0), 0) || 0;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">রিসেলার</h1>
            <p className="text-sm text-muted-foreground">রিসেলার পরিচালনা ও মনিটরিং</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["resellers"] });
              toast.success("রিফ্রেশ হচ্ছে...");
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            রিফ্রেশ
          </Button>
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            নতুন রিসেলার
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "মোট রিসেলার", value: totalResellers, icon: Users, color: "text-primary", bg: "bg-primary/10" },
          { label: "সক্রিয়", value: activeResellers, icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
          { label: "মোট গ্রাহক", value: totalCustomers, icon: Users, color: "text-accent-foreground", bg: "bg-accent/50" },
          { label: "মোট কমিশন", value: `৳${totalCommission.toLocaleString()}`, icon: Wallet, color: "text-primary", bg: "bg-primary/10" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">রিসেলার তালিকা</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="নাম বা ফোন দিয়ে খুঁজুন..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="স্ট্যাটাস" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
                <SelectItem value="active">সক্রিয়</SelectItem>
                <SelectItem value="suspended">সাসপেন্ড</SelectItem>
                <SelectItem value="inactive">নিষ্ক্রিয়</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">কোনো রিসেলার পাওয়া যায়নি</p>
            </div>
          ) : (
            <div className="overflow-auto rounded-lg border border-border/50">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>নাম</TableHead>
                    <TableHead>ফোন</TableHead>
                    <TableHead className="text-center">গ্রাহক</TableHead>
                    <TableHead>কমিশন</TableHead>
                    <TableHead className="text-right">ওয়ালেট</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((reseller) => {
                    const st = statusConfig[reseller.status] || statusConfig.active;
                    return (
                      <TableRow
                        key={reseller.id}
                        className="hover:bg-muted/20 cursor-pointer"
                        onClick={() => navigate(`/dashboard/resellers/${reseller.id}`)}
                      >
                        <TableCell>
                          <p className="font-medium text-sm">{reseller.name}</p>
                          {reseller.email && (
                            <p className="text-xs text-muted-foreground">{reseller.email}</p>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{reseller.phone}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{reseller.customer_count}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {reseller.commission_value}
                          {reseller.commission_type === "percentage" ? "%" : "৳"}{" "}
                          <span className="text-xs text-muted-foreground">
                            ({commissionLabels[reseller.commission_type]})
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium text-sm">
                          ৳{Number(reseller.wallet_balance || 0).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={st.variant}>{st.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/resellers/${reseller.id}`); }}>
                                <Eye className="h-4 w-4 mr-2" /> বিস্তারিত
                              </DropdownMenuItem>
                              {reseller.status === "active" ? (
                                <DropdownMenuItem
                                  onClick={(e) => { e.stopPropagation(); toggleStatus.mutate({ id: reseller.id, status: "suspended" }); }}
                                  className="text-destructive"
                                >
                                  <Ban className="h-4 w-4 mr-2" /> সাসপেন্ড
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={(e) => { e.stopPropagation(); toggleStatus.mutate({ id: reseller.id, status: "active" }); }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" /> সক্রিয় করুন
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
            </div>
          )}
        </CardContent>
      </Card>

      <ResellerFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
