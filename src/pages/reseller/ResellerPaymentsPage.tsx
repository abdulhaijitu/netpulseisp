import { CreditCard } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useResellerSelf, useResellerSelfPayments } from "@/hooks/useResellerDashboard";

const methodLabels: Record<string, string> = {
  cash: "ক্যাশ",
  online: "অনলাইন",
  bank_transfer: "ব্যাংক ট্রান্সফার",
};

export default function ResellerPaymentsPage() {
  const { data: reseller } = useResellerSelf();
  const { data: payments, isLoading } = useResellerSelfPayments(reseller?.id);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <CreditCard className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">পেমেন্ট</h1>
          <p className="text-sm text-muted-foreground">আপনার গ্রাহকদের পেমেন্ট হিস্ট্রি</p>
        </div>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">পেমেন্ট তালিকা</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : !payments?.length ? (
            <div className="text-center py-12 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">কোনো পেমেন্ট পাওয়া যায়নি</p>
            </div>
          ) : (
            <div className="overflow-auto rounded-lg border border-border/50">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>তারিখ</TableHead>
                    <TableHead>গ্রাহক</TableHead>
                    <TableHead className="text-right">পরিমাণ</TableHead>
                    <TableHead>মাধ্যম</TableHead>
                    <TableHead>নোট</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-sm">{format(new Date(p.created_at), "dd/MM/yyyy")}</TableCell>
                      <TableCell>
                        <p className="font-medium text-sm">{p.customers?.name || "—"}</p>
                        <p className="text-xs text-muted-foreground">{p.customers?.phone}</p>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-sm">৳{Number(p.amount).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">{methodLabels[p.method] || p.method}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">{p.notes || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
