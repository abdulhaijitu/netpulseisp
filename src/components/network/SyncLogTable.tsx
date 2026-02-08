import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { bn } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface SyncLogTableProps {
  logs: any[];
  isLoading: boolean;
  title?: string;
  description?: string;
  limit?: number;
}

const actionLabels: Record<string, string> = {
  enable: "সক্রিয়",
  disable: "নিষ্ক্রিয়",
  update_speed: "স্পিড আপডেট",
  create: "তৈরি",
  delete: "মুছুন",
  test_connection: "সংযোগ পরীক্ষা",
};

const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
  success: { label: "সফল", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: CheckCircle },
  failed: { label: "ব্যর্থ", className: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
  pending: { label: "অপেক্ষমান", className: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: Clock },
  in_progress: { label: "চলমান", className: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: RefreshCw },
  retrying: { label: "পুনরায় চেষ্টা", className: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: AlertTriangle },
};

export function SyncLogTable({ logs, isLoading, title = "সিঙ্ক লগ", description, limit = 15 }: SyncLogTableProps) {
  const displayLogs = logs?.slice(0, limit) || [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : displayLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Activity className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">কোনো সিঙ্ক লগ নেই</p>
          </div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">সময়</TableHead>
                  <TableHead>অ্যাকশন</TableHead>
                  <TableHead>কাস্টমার</TableHead>
                  <TableHead>ইন্টিগ্রেশন</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead className="hidden md:table-cell">ত্রুটি</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayLogs.map((log: any) => {
                  const status = statusConfig[log.status] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(parseISO(log.created_at), { addSuffix: true, locale: bn })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {actionLabels[log.action] || log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.customers?.name || "-"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {log.network_integrations?.name || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px] gap-1", status.className)}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-destructive max-w-[200px] truncate">
                        {log.error_message || "-"}
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
