import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatVariant = "primary" | "success" | "info" | "warning" | "danger" | "purple";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: StatVariant;
}

const variantStyles: Record<StatVariant, string> = {
  primary: "bg-primary",
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  danger: "bg-destructive",
  purple: "bg-[hsl(262,60%,55%)]",
};

export function DashboardStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "primary",
}: DashboardStatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-4 text-white transition-transform duration-200 hover:scale-[1.02] hover:shadow-medium",
        variantStyles[variant]
      )}
    >
      {/* Decorative circle */}
      <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-white/10" />
      <div className="absolute -right-1 -bottom-4 h-12 w-12 rounded-full bg-white/5" />

      <div className="relative flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-white/80">{title}</p>
          <p className="text-xl font-bold leading-tight">{value}</p>
          {subtitle && (
            <p className="truncate text-[11px] text-white/70">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
