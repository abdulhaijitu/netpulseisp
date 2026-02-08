import { format } from "date-fns";
import { Users, User } from "lucide-react";
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

const statusConfig: Record<string, { label: string; variant: "default" | "destructive" | "secondary" }> = {
  active: { label: "সক্রিয়", variant: "default" },
  suspended: { label: "সাসপেন্ড", variant: "destructive" },
  pending: { label: "পেন্ডিং", variant: "secondary" },
};

interface Props {
  customers: any[];
  isLoading: boolean;
}

export function ResellerCustomersTab({ customers, isLoading }: Props) {
  if (isLoading) {
    return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>;
  }

  return (
    <Card className="border-border/50 mt-4">
      <CardHeader>
        <CardTitle className="text-base">গ্রাহক তালিকা ({customers.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {customers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">এই রিসেলারের কোনো গ্রাহক নেই</p>
          </div>
        ) : (
          <div className="overflow-auto rounded-lg border border-border/50">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>নাম</TableHead>
                  <TableHead>ফোন</TableHead>
                  <TableHead>প্যাকেজ</TableHead>
                  <TableHead className="text-right">বকেয়া</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c: any) => {
                  const st = statusConfig[c.connection_status] || statusConfig.pending;
                  return (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{c.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{c.phone}</TableCell>
                      <TableCell className="text-sm">{c.packages?.name || "—"}</TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        ৳{Number(c.due_balance || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={st.variant} className="text-[10px]">{st.label}</Badge>
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
  );
}
