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
  Server,
  Cog,
  MapPin,
  Wifi,
  UserCheck,
  FileText,
  DollarSign,
  BookOpen,
  HardDrive,
  Download,
  Upload,
  Router,
  Map,
  Wrench,
  ClipboardList,
  Briefcase,
  Boxes,
  ShoppingCart,
  MessageSquare,
  Wallet,
  CalendarDays,
  Ticket,
  ListTodo,
  Banknote,
  Store,
  PiggyBank,
  Scale,
  TrendingUp,
  Building2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  SidebarBody,
  SidebarLink,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/animated-sidebar";
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

type NavGroup = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: AppRole[];
  children: NavItem[];
};

// ── STANDALONE NAV ITEMS ──
const dashboardItem: NavItem = {
  title: "Dashboard",
  href: "/dashboard",
  icon: LayoutDashboard,
  roles: ["super_admin", "isp_owner", "admin", "manager", "staff", "accountant", "marketing"],
};

// ── GROUPED NAV ──
const navGroups: NavGroup[] = [
  {
    label: "Clients",
    icon: Users,
    roles: ["super_admin", "isp_owner", "admin", "manager", "staff"],
    children: [
      { title: "Client List", href: "/dashboard/customers", icon: Users },
      { title: "New Request", href: "/dashboard/clients/new-request", icon: UserPlus },
      { title: "Add New", href: "/dashboard/clients/add", icon: UserPlus },
      { title: "Left Clients", href: "/dashboard/clients/left", icon: Users },
      { title: "Change Request", href: "/dashboard/clients/change-request", icon: FileText },
    ],
  },
  {
    label: "Configuration",
    icon: Cog,
    roles: ["super_admin", "isp_owner", "admin"],
    children: [
      { title: "Zone / Sub Zone", href: "/dashboard/config/zones", icon: MapPin },
      { title: "Connection Type", href: "/dashboard/config/connection-type", icon: Wifi },
      { title: "Client Type", href: "/dashboard/config/client-type", icon: UserCheck },
      { title: "Protocol Type", href: "/dashboard/config/protocol-type", icon: Network },
      { title: "Area Management", href: "/dashboard/config/district", icon: MapPin },
      { title: "Billing Status", href: "/dashboard/config/billing-status", icon: FileText },
    ],
  },
];

const packagesItem: NavItem = {
  title: "Packages",
  href: "/dashboard/packages",
  icon: Package,
  roles: ["super_admin", "isp_owner", "admin"],
};

// ── BILLING & FINANCE ──
const financeGroups: NavGroup[] = [
  {
    label: "Billing",
    icon: Receipt,
    roles: ["super_admin", "isp_owner", "admin", "manager", "accountant"],
    children: [
      { title: "Billing List", href: "/dashboard/billing", icon: Receipt },
      { title: "Daily Collection", href: "/dashboard/billing/daily", icon: DollarSign },
      { title: "Monthly Report", href: "/dashboard/billing/monthly", icon: BarChart3 },
    ],
  },
];

const paymentsItem: NavItem = {
  title: "Payments",
  href: "/dashboard/payments",
  icon: CreditCard,
  roles: ["super_admin", "isp_owner", "admin", "manager", "accountant", "staff"],
};

const reportsItem: NavItem = {
  title: "Reports",
  href: "/dashboard/reports",
  icon: BarChart3,
  roles: ["super_admin", "isp_owner", "admin", "manager", "accountant"],
};

const financeGroups2: NavGroup[] = [
  {
    label: "Income & Expense",
    icon: DollarSign,
    roles: ["super_admin", "isp_owner", "admin", "accountant"],
    children: [
      { title: "Daily Income", href: "/dashboard/finance/income", icon: TrendingUp },
      { title: "Daily Expense", href: "/dashboard/finance/expense", icon: Banknote },
      { title: "Account Closing", href: "/dashboard/finance/closing", icon: Scale },
      { title: "History", href: "/dashboard/finance/history", icon: FileText },
    ],
  },
  {
    label: "Accounting",
    icon: BookOpen,
    roles: ["super_admin", "isp_owner", "admin", "accountant"],
    children: [
      { title: "Dashboard", href: "/dashboard/accounting", icon: LayoutDashboard },
      { title: "Chart of Accounts", href: "/dashboard/accounting/chart", icon: BookOpen },
      { title: "Journal", href: "/dashboard/accounting/journal", icon: FileText },
      { title: "Balance Sheet", href: "/dashboard/accounting/balance-sheet", icon: Scale },
      { title: "Profit & Loss", href: "/dashboard/accounting/profit-loss", icon: TrendingUp },
      { title: "Trial Balance", href: "/dashboard/accounting/trial-balance", icon: BarChart3 },
    ],
  },
];

// ── NETWORK ──
const networkGroups: NavGroup[] = [
  {
    label: "MikroTik Server",
    icon: Server,
    roles: ["super_admin", "isp_owner", "admin"],
    children: [
      { title: "Servers", href: "/dashboard/network", icon: Server },
      { title: "Server Backup", href: "/dashboard/mikrotik/backup", icon: HardDrive },
      { title: "Import from MikroTik", href: "/dashboard/mikrotik/import", icon: Download },
      { title: "Bulk Import", href: "/dashboard/mikrotik/bulk-import", icon: Upload },
    ],
  },
  {
    label: "OLT Management",
    icon: Router,
    roles: ["super_admin", "isp_owner", "admin"],
    children: [
      { title: "OLT Devices", href: "/dashboard/olt", icon: Router },
      { title: "OLT Users", href: "/dashboard/olt/users", icon: Users },
    ],
  },
];

const networkDiagramItem: NavItem = {
  title: "Network Diagram",
  href: "/dashboard/network-diagram",
  icon: Map,
  roles: ["super_admin", "isp_owner", "admin"],
};

// ── OPERATIONS ──
const operationGroups: NavGroup[] = [
  {
    label: "Support & Ticketing",
    icon: Ticket,
    roles: ["super_admin", "isp_owner", "admin", "manager", "staff"],
    children: [
      { title: "Client Support", href: "/dashboard/support", icon: Ticket },
      { title: "Support Category", href: "/dashboard/support/category", icon: ClipboardList },
      { title: "Support History", href: "/dashboard/support/history", icon: FileText },
    ],
  },
  {
    label: "Task Management",
    icon: ListTodo,
    roles: ["super_admin", "isp_owner", "admin", "manager", "staff"],
    children: [
      { title: "Tasks", href: "/dashboard/tasks", icon: ListTodo },
      { title: "Task Category", href: "/dashboard/tasks/category", icon: ClipboardList },
      { title: "Task History", href: "/dashboard/tasks/history", icon: FileText },
    ],
  },
  {
    label: "HR & Payroll",
    icon: Briefcase,
    roles: ["super_admin", "isp_owner", "admin"],
    children: [
      { title: "Employee List", href: "/dashboard/hr/employees", icon: Users },
      { title: "Department", href: "/dashboard/hr/department", icon: Building2 },
      { title: "Salary Sheet", href: "/dashboard/hr/salary", icon: DollarSign },
      { title: "Attendance", href: "/dashboard/hr/attendance", icon: CalendarDays },
    ],
  },
  {
    label: "Inventory & Assets",
    icon: Boxes,
    roles: ["super_admin", "isp_owner", "admin"],
    children: [
      { title: "Items", href: "/dashboard/inventory/items", icon: Boxes },
      { title: "Stock", href: "/dashboard/inventory/stock", icon: Store },
      { title: "Assets", href: "/dashboard/inventory/assets", icon: HardDrive },
    ],
  },
  {
    label: "Purchase & Vendors",
    icon: ShoppingCart,
    roles: ["super_admin", "isp_owner", "admin", "accountant"],
    children: [
      { title: "Vendors", href: "/dashboard/purchase/vendors", icon: Store },
      { title: "Purchase", href: "/dashboard/purchase", icon: ShoppingCart },
      { title: "Purchase Bill", href: "/dashboard/purchase/bill", icon: Receipt },
    ],
  },
];

// ── RESELLER ──
const resellerGroup: NavGroup = {
  label: "MAC Reseller",
  icon: UserPlus,
  roles: ["super_admin", "isp_owner", "admin", "manager"],
  children: [
    { title: "Reseller List", href: "/dashboard/resellers", icon: Users },
    { title: "Package / Tariff", href: "/dashboard/resellers/tariff", icon: Package },
    { title: "Funding", href: "/dashboard/resellers/funding", icon: PiggyBank },
    { title: "PGW Settlement", href: "/dashboard/resellers/pgw", icon: Wallet },
  ],
};

// ── SYSTEM ──
const smsGroup: NavGroup = {
  label: "SMS Service",
  icon: MessageSquare,
  roles: ["super_admin", "isp_owner", "admin"],
  children: [
    { title: "Send SMS", href: "/dashboard/sms/send", icon: MessageSquare },
    { title: "SMS Template", href: "/dashboard/sms/template", icon: FileText },
    { title: "SMS Gateway", href: "/dashboard/sms/gateway", icon: Cog },
  ],
};

const systemStandaloneItems: NavItem[] = [
  { title: "Notifications", href: "/dashboard/notifications", icon: Bell, roles: ["super_admin", "isp_owner", "admin", "manager", "staff", "accountant", "marketing"] },
  { title: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["super_admin", "isp_owner", "admin"] },
];

// ── RESELLER SELF-SERVICE NAV ──
const resellerSelfNavItems: NavItem[] = [
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

  const canAccessGroup = (group: NavGroup) => {
    if (!group.roles) return true;
    if (!role) return false;
    return group.roles.includes(role);
  };

  const isReseller = role === ("reseller" as AppRole) || isImpersonatingReseller;

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const roleLabel = role ? roleDisplayNames[role] || role : "...";

  const toLink = (item: NavItem) => ({
    label: item.title,
    href: item.href,
    icon: <item.icon className={cn("h-[18px] w-[18px] shrink-0", isActive(item.href) && "text-sidebar-primary")} />,
  });

  const renderGroup = (group: NavGroup) => {
    if (!canAccessGroup(group)) return null;
    const hasActiveChild = group.children.some((c) => isActive(c.href));
    return (
      <SidebarGroup
        key={group.label}
        label={group.label}
        icon={<group.icon className={cn("h-[18px] w-[18px] shrink-0", hasActiveChild && "text-sidebar-primary")} />}
        defaultOpen={hasActiveChild}
      >
        {group.children.filter(canAccess).map((item) => (
          <SidebarLink key={item.href} link={toLink(item)} active={isActive(item.href)} />
        ))}
      </SidebarGroup>
    );
  };

  return (
    <SidebarBody className="justify-between gap-4 overflow-hidden">
      {/* Top section */}
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-4">
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

        {isReseller ? (
          // Reseller self-service nav
          <div className="flex flex-col gap-1">
            {resellerSelfNavItems.map((item) => (
              <SidebarLink key={item.href} link={toLink(item)} active={isActive(item.href)} />
            ))}
          </div>
        ) : (
          // Full ISP nav
          <>
            {/* Dashboard */}
            {canAccess(dashboardItem) && (
              <SidebarLink link={toLink(dashboardItem)} active={isActive(dashboardItem.href)} />
            )}

            {/* Client Management */}
            <SidebarGroupLabel>Client Management</SidebarGroupLabel>
            {navGroups.map(renderGroup)}
            {canAccess(packagesItem) && (
              <SidebarLink link={toLink(packagesItem)} active={isActive(packagesItem.href)} />
            )}

            {/* Billing & Finance */}
            <SidebarGroupLabel>Billing & Finance</SidebarGroupLabel>
            {financeGroups.map(renderGroup)}
            {canAccess(paymentsItem) && (
              <SidebarLink link={toLink(paymentsItem)} active={isActive(paymentsItem.href)} />
            )}
            {canAccess(reportsItem) && (
              <SidebarLink link={toLink(reportsItem)} active={isActive(reportsItem.href)} />
            )}
            {financeGroups2.map(renderGroup)}

            {/* Network */}
            <SidebarGroupLabel>Network</SidebarGroupLabel>
            {networkGroups.map(renderGroup)}
            {canAccess(networkDiagramItem) && (
              <SidebarLink link={toLink(networkDiagramItem)} active={isActive(networkDiagramItem.href)} />
            )}

            {/* Operations */}
            <SidebarGroupLabel>Operations</SidebarGroupLabel>
            {operationGroups.map(renderGroup)}

            {/* Reseller */}
            <SidebarGroupLabel>Reseller</SidebarGroupLabel>
            {renderGroup(resellerGroup)}

            {/* System */}
            <SidebarGroupLabel>System</SidebarGroupLabel>
            {renderGroup(smsGroup)}
            {systemStandaloneItems.filter(canAccess).map((item) => (
              <SidebarLink key={item.href} link={toLink(item)} active={isActive(item.href)} />
            ))}
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
