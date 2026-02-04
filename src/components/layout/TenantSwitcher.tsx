import { Building2, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTenantContext } from "@/contexts/TenantContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function TenantSwitcher() {
  const { currentTenant, allTenants, setCurrentTenant, isSuperAdmin, isLoading } =
    useTenantContext();

  // Only show for super admin
  // Note: we still show it when there is only 1 tenant so the UI is visible and
  // it becomes a consistent place to switch once more tenants are created.
  if (!isSuperAdmin) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 max-w-[200px]"
          disabled={isLoading || allTenants.length === 0}
        >
          <Building2 className="h-4 w-4 shrink-0" />
          <span className="truncate">
            {isLoading
              ? "লোড হচ্ছে..."
              : currentTenant?.name || (allTenants.length === 0 ? "কোন টেন্যান্ট নেই" : "টেন্যান্ট নির্বাচন করুন")}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[250px]">
        <DropdownMenuLabel>টেন্যান্ট/ISP সুইচ করুন</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allTenants.length === 0 ? (
          <DropdownMenuItem disabled>কোন টেন্যান্ট পাওয়া যায়নি</DropdownMenuItem>
        ) : (
          allTenants.map((tenant) => (
            <DropdownMenuItem
              key={tenant.id}
              onClick={() => setCurrentTenant(tenant)}
              className="flex items-center justify-between"
            >
              <div className="flex flex-col">
                <span className="font-medium">{tenant.name}</span>
                <span className="text-xs text-muted-foreground">
                  {tenant.subdomain}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    tenant.subscription_status === "active"
                      ? "default"
                      : tenant.subscription_status === "trial"
                        ? "secondary"
                        : "destructive"
                  }
                  className="text-xs"
                >
                  {tenant.subscription_status === "active"
                    ? "সক্রিয়"
                    : tenant.subscription_status === "trial"
                      ? "ট্রায়াল"
                      : "স্থগিত"}
                </Badge>
                {currentTenant?.id === tenant.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
