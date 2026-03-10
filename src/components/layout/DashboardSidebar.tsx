import {
  LayoutDashboard,
  Users,
  Package,
  Receipt,
  CreditCard,
  Settings,
  BarChart3,
  Bell,
  Loader2,
  LogOut,
  Network,
  UserPlus,
  Wallet,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SidebarBody, SidebarLink, useSidebar } from "@/components/ui/animated-sidebar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useResellerImpersonation } from "@/contexts/ResellerImpersonationContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useISPBranding } from "@/hooks/useBranding";
import ispManagerIcon from "@/assets/isp-manager-icon.png";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

import type { AppRole } from "@/hooks/useUserRole";

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: AppRole[];
};

const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["super_admin", "isp_owner", "admin", "manager", "staff", "accountant", "marketing"] },
  { title: "Customers", href: "/dashboard/customers", icon: Users, roles: ["super_admin", "isp_owner", "admin", "manager", "staff"] },
  { title: "Packages", href: "/dashboard/packages", icon: Package, roles: ["super_admin", "isp_owner", "admin"] },
  { title: "Billing", href: "/dashboard/billing", icon: Receipt, roles: ["super_admin", "isp_owner", "admin", "manager", "accountant"] },
  { title: "Payments", href: "/dashboard/payments", icon: CreditCard, roles: ["super_admin", "isp_owner", "admin", "manager", "accountant", "staff"] },
  { title: "Reports", href: "/dashboard/reports", icon: BarChart3, roles: ["super_admin", "isp_owner", "admin", "manager", "accountant"] },
];

const systemNavItems: NavItem[] = [
  { title: "Resellers", href: "/dashboard/resellers", icon: UserPlus, roles: ["super_admin", "isp_owner", "admin", "manager"] },
  { title: "Network", href: "/dashboard/network", icon: Network, roles: ["super_admin", "isp_owner", "admin"] },
  { title: "Notifications", href: "/dashboard/notifications", icon: Bell, roles: ["super_admin", "isp_owner", "admin", "manager", "staff", "accountant", "marketing"] },
  { title: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["super_admin", "isp_owner", "admin"] },
];

const resellerNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard/reseller", icon: LayoutDashboard },
  { title: "My Customers", href: "/dashboard/reseller/customers", icon: Users },
  { title: "Payments", href: "/dashboard/reseller/payments", icon: CreditCard },
  { title: "Wallet", href: "/dashboard/reseller/wallet", icon: Wallet },
];

const roleDisplayNames: Record<string, string> = {
  super_admin: "Super Admin",
  isp_owner: "ISP Owner",
  admin: "Admin",
  manager: "Manager",
  staff: "Staff",
  accountant: "Accountant",
  marketing: "Marketing",
  member: "Member",
  reseller: "Reseller",
};

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { open } = useSidebar();
  const { user, signOut } = useAuth();
  const { data: role, isLoading: roleLoading } = useUserRole();
  const { isImpersonatingReseller } = useResellerImpersonation();
  const { branding } = useISPBranding();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const isActive = (href: string) => {
    if (href === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(href);
  };

  const canAccess = (item: NavItem) => {
    if (!item.roles) return true;
    if (!role) return false;
    return item.roles.includes(role);
  };

  const isReseller = role === ("reseller" as AppRole) || isImpersonatingReseller;
  const filteredMainNavItems = isReseller ? resellerNavItems : mainNavItems.filter(canAccess);
  const filteredSystemNavItems = isReseller ? [] : systemNavItems.filter(canAccess);

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const roleLabel = role ? roleDisplayNames[role] || role : "...";

  const toLink = (item: NavItem) => ({
    label: item.title,
    href: item.href,
    icon: <item.icon className={cn("h-[18px] w-[18px] shrink-0", isActive(item.href) && "text-sidebar-primary")} />,
  });

  return (
    <SidebarBody className="justify-between gap-4 overflow-hidden">
      {/* Top section */}
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          {branding.logoUrl ? (
            <img src={branding.logoUrl} alt={branding.brandName} className="h-8 w-8 shrink-0 rounded-lg object-contain" />
          ) : (
            <img src={ispManagerIcon} alt="ISP Manager" className="h-8 w-8 shrink-0 rounded-lg object-contain" />
          )}
          <motion.span
            animate={{ display: open ? "inline-block" : "none", opacity: open ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-bold tracking-tight text-sidebar-foreground whitespace-nowrap"
          >
            {branding.brandName}
          </motion.span>
        </div>

        {/* Main nav */}
        <div className="flex flex-col gap-1">
          {filteredMainNavItems.map((item) => (
            <SidebarLink key={item.href} link={toLink(item)} active={isActive(item.href)} />
          ))}
        </div>

        {filteredSystemNavItems.length > 0 && (
          <>
            <Separator className="my-4 bg-sidebar-border/50" />
            <div className="flex flex-col gap-1">
              {filteredSystemNavItems.map((item) => (
                <SidebarLink key={item.href} link={toLink(item)} active={isActive(item.href)} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border/50 pt-4">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-sidebar-primary to-sidebar-primary/70 flex items-center justify-center">
            {profileLoading || roleLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-sidebar-primary-foreground" />
            ) : (
              <span className="text-[11px] font-semibold text-sidebar-primary-foreground">{initials}</span>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-sidebar bg-success" />
          </div>
          <motion.div
            animate={{ display: open ? "flex" : "none", opacity: open ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-col min-w-0 flex-1"
          >
            <span className="text-sm font-medium text-sidebar-foreground truncate">
              {profileLoading ? "Loading..." : displayName}
            </span>
            <span className="text-[11px] text-sidebar-foreground/50 truncate">
              {roleLoading ? "..." : roleLabel}
            </span>
          </motion.div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "mt-2 w-full text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors",
            !open ? "justify-center px-0" : "justify-start"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {open && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </SidebarBody>
  );
}
