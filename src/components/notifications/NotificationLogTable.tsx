import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { CheckCircle, XCircle, Clock, Send, User, MessageSquare } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import type { NotificationLog } from "@/hooks/useNotificationLogs";

interface Props {
  logs: NotificationLog[];
  isLoading: boolean;
  onResend?: (log: NotificationLog) => void;
}

const statusConfig: Record<string, { icon: typeof CheckCircle; label: string; variant: "default" | "destructive" | "secondary" | "outline" }> = {
  sent: { icon: CheckCircle, label: "পাঠানো হয়েছে", variant: "default" },
  failed: { icon: XCircle, label: "ব্যর্থ", variant: "destructive" },
  pending: { icon: Clock, label: "অপেক্ষমাণ", variant: "secondary" },
};

const typeLabels: Record<string, string> = {
  billing_reminder: "বিলিং রিমাইন্ডার",
  payment_confirmation: "পেমেন্ট নিশ্চিতকরণ",
  connection_status: "কানেকশন স্ট্যাটাস",
  general: "সাধারণ",
  welcome: "স্বাগতম",
  overdue: "ওভারডিউ",
};

export function NotificationLogTable({ logs, isLoading, onResend }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <MessageSquare className="h-12 w-12 mb-3 opacity-30" />
        <p className="text-sm font-medium">কোনো নোটিফিকেশন লগ পাওয়া যায়নি</p>
        <p className="text-xs mt-1">ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-lg border border-border/50">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-[180px]">তারিখ</TableHead>
            <TableHead>শিরোনাম ও বার্তা</TableHead>
            <TableHead className="w-[150px]">গ্রাহক</TableHead>
            <TableHead className="w-[140px]">ধরন</TableHead>
            <TableHead className="w-[120px]">স্ট্যাটাস</TableHead>
            <TableHead className="w-[80px] text-right">অ্যাকশন</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => {
            const status = statusConfig[log.status] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <TableRow key={log.id} className="hover:bg-muted/20">
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(new Date(log.created_at), "dd MMM yyyy, hh:mm a")}
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium text-foreground truncate max-w-[300px]">
                    {log.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                    {log.body}
                  </p>
                  {log.error_message && (
                    <p className="text-xs text-destructive mt-0.5 truncate max-w-[300px]">
                      ⚠ {log.error_message}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  {log.customer_name ? (
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium">{log.customer_name}</p>
                        <p className="text-[10px] text-muted-foreground">{log.customer_phone}</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] font-normal">
                    {typeLabels[log.notification_type] || log.notification_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={status.variant} className="gap-1 text-[10px]">
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {log.status === "failed" && onResend && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onResend(log)}
                          >
                            <Send className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>পুনরায় পাঠান</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
