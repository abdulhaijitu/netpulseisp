import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Receipt, 
  CreditCard, 
  Settings, 
  Building2,
  BarChart3,
  Bell,
  Loader2,
  LogOut,
  ChevronRight,
  Network,
  UserPlus,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";

import type { AppRole } from "@/hooks/useUserRole";

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: AppRole[];
  badge?: number;
};

// Nav items for ISP staff (non-reseller)
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

// Simplified nav for reseller role
import { Wallet } from "lucide-react";

const resellerNavItems: NavItem[] = [
  { title: "ড্যাশবোর্ড", href: "/dashboard/reseller", icon: LayoutDashboard },
  { title: "আমার গ্রাহক", href: "/dashboard/reseller/customers", icon: Users },
  { title: "পেমেন্ট", href: "/dashboard/reseller/payments", icon: CreditCard },
  { title: "ওয়ালেট", href: "/dashboard/reseller/wallet", icon: Wallet },
];

const roleDisplayNames: Record<string, string> = {
  super_admin: "সুপার অ্যাডমিন",
  isp_owner: "ISP মালিক",
  admin: "অ্যাডমিন",
  manager: "ম্যানেজার",
  staff: "স্টাফ",
  accountant: "হিসাবরক্ষক",
  marketing: "মার্কেটিং",
  member: "সদস্য",
  reseller: "রিসেলার",
};

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, signOut } = useAuth();
  const { data: role, isLoading: roleLoading } = useUserRole();

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
    if (href === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href);
  };

  const canAccess = (item: NavItem) => {
    if (!item.roles) return true;
    if (!role) return false;
    return item.roles.includes(role);
  };

  const isReseller = role === ("reseller" as AppRole);
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

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);
    
    const content = (
      <NavLink
        to={item.href}
        className={cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
          "hover:bg-sidebar-accent/80",
          active 
            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" 
            : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
        )}
      >
        <item.icon className={cn(
          "h-[18px] w-[18px] shrink-0 transition-transform duration-200",
          active && "text-sidebar-primary",
          "group-hover:scale-105"
        )} />
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.title}</span>
            {item.badge && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-semibold text-destructive-foreground">
                {item.badge}
              </span>
            )}
            {active && (
              <ChevronRight className="h-4 w-4 text-sidebar-primary opacity-60" />
            )}
          </>
        )}
        {/* Active indicator bar */}
        {active && (
          <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary" />
        )}
      </NavLink>
    );

    if (collapsed) {
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              {item.title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return content;
  };

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r border-sidebar-border bg-sidebar transition-all duration-300"
    >
      <SidebarHeader className="p-4">
        <div className={cn(
          "flex items-center gap-3 transition-all duration-200",
          collapsed && "justify-center"
        )}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 shadow-md">
            <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col animate-fade-in">
              <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
                NetPulse
              </span>
              <span className="text-[11px] text-sidebar-foreground/50">
                ISP Management
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="scrollbar-thin px-3">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              Main Menu
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {filteredMainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <NavItemComponent item={item} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-4 bg-sidebar-border/50" />

        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              System
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {filteredSystemNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <NavItemComponent item={item} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-4">
        <div className={cn(
          "flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sidebar-accent/50",
          collapsed && "justify-center p-1"
        )}>
          <div className="relative h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-sidebar-primary to-sidebar-primary/70 flex items-center justify-center shadow-sm">
            {profileLoading || roleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-sidebar-primary-foreground" />
            ) : (
              <span className="text-xs font-semibold text-sidebar-primary-foreground">
                {initials}
              </span>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-sidebar bg-success" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium text-sidebar-foreground truncate">
                {profileLoading ? "লোড হচ্ছে..." : displayName}
              </span>
              <span className="text-[11px] text-sidebar-foreground/50 truncate">
                {roleLoading ? "..." : roleLabel}
              </span>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          className={cn(
            "mt-2 w-full text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors",
            collapsed ? "justify-center" : "justify-start"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">লগআউট</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
