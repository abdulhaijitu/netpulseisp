import { useState } from "react";
import { format } from "date-fns";
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddWalletAdjustment } from "@/hooks/useResellers";
import { Loader2 } from "lucide-react";

const typeConfig: Record<string, { label: string; icon: typeof ArrowUpRight; color: string }> = {
  commission: { label: "কমিশন", icon: ArrowUpRight, color: "text-success" },
  adjustment: { label: "অ্যাডজাস্টমেন্ট", icon: Settings, color: "text-primary" },
  withdrawal: { label: "উত্তোলন", icon: ArrowDownRight, color: "text-destructive" },
};

interface Props {
  wallet: { balance: number; transactions: any[] };
  isLoading: boolean;
  resellerId: string;
  tenantId: string;
}

export function ResellerWalletTab({ wallet, isLoading, resellerId, tenantId }: Props) {
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const addAdjustment = useAddWalletAdjustment();

  if (isLoading) {
    return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>;
  }

  const handleAdjust = () => {
    if (!amount || !description) return;
    addAdjustment.mutate(
      { resellerId, tenantId, amount, description },
      {
        onSuccess: () => {
          setAdjustDialog(false);
          setAmount(0);
          setDescription("");
        },
      }
    );
  };

  return (
    <>
      <div className="space-y-4 mt-4">
        {/* Balance Card */}
        <Card className="border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Wallet className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">বর্তমান ব্যালেন্স</p>
                <p className="text-3xl font-bold text-foreground">৳{wallet.balance.toLocaleString()}</p>
              </div>
            </div>
            <Button size="sm" onClick={() => setAdjustDialog(true)}>
              <Plus className="h-4 w-4 mr-1" /> অ্যাডজাস্ট
            </Button>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">ট্রানজাকশন ইতিহাস</CardTitle>
          </CardHeader>
          <CardContent>
            {wallet.transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">কোনো ট্রানজাকশন নেই</p>
              </div>
            ) : (
              <div className="overflow-auto rounded-lg border border-border/50">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>তারিখ</TableHead>
                      <TableHead>ধরন</TableHead>
                      <TableHead>বিবরণ</TableHead>
                      <TableHead className="text-right">পরিমাণ</TableHead>
                      <TableHead className="text-right">ব্যালেন্স</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wallet.transactions.map((tx: any) => {
                      const config = typeConfig[tx.type] || typeConfig.adjustment;
                      const TxIcon = config.icon;
                      return (
                        <TableRow key={tx.id}>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {format(new Date(tx.created_at), "dd MMM yyyy, hh:mm a")}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="gap-1 text-[10px]">
                              <TxIcon className={`h-3 w-3 ${config.color}`} />
                              {config.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm max-w-[200px] truncate">{tx.description}</TableCell>
                          <TableCell className={`text-right font-medium text-sm ${Number(tx.amount) >= 0 ? "text-success" : "text-destructive"}`}>
                            {Number(tx.amount) >= 0 ? "+" : ""}৳{Number(tx.amount).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            ৳{Number(tx.balance_after).toLocaleString()}
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
      </div>

      {/* Adjustment Dialog */}
      <Dialog open={adjustDialog} onOpenChange={setAdjustDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>ওয়ালেট অ্যাডজাস্টমেন্ট</DialogTitle>
            <DialogDescription>ধনাত্মক মান ক্রেডিট, ঋণাত্মক মান ডেবিট করবে</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>পরিমাণ (৳)</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="100 বা -50" />
            </div>
            <div className="space-y-2">
              <Label>বিবরণ *</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="অ্যাডজাস্টমেন্টের কারণ..." rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustDialog(false)}>বাতিল</Button>
            <Button onClick={handleAdjust} disabled={addAdjustment.isPending || !amount || !description}>
              {addAdjustment.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              নিশ্চিত করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
