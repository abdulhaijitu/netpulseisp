import { Bell, Search, LogOut, User, Settings, HelpCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { TenantSwitcher } from "./TenantSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["header-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email, avatar_url")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch pending notification count
  const { data: notificationCount = 0 } = useQuery({
    queryKey: ["notification-count", user?.id],
    queryFn: async () => {
      // This would typically query notification_logs for unread count
      return 3; // Placeholder
    },
    enabled: !!user?.id,
  });

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 px-4 md:px-6">
      {/* Mobile menu trigger */}
      <SidebarTrigger className="h-9 w-9 shrink-0 md:hidden" />
      
      {/* Desktop sidebar trigger */}
      <SidebarTrigger className="hidden md:flex h-9 w-9 shrink-0" />
      
      {/* Tenant Switcher */}
      <TenantSwitcher />
      
      {/* Search - Desktop */}
      <div className="hidden md:flex md:flex-1 md:max-w-md">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            placeholder="Search customers, bills..."
            className="pl-10 h-10 bg-muted/40 border-transparent hover:bg-muted/60 focus:bg-background focus:border-primary/20 transition-all duration-200"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex flex-1 items-center justify-end gap-2">
        {/* Mobile search button */}
        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
          <Search className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-9 w-9 hover:bg-muted transition-colors"
            >
              <Bell className="h-[18px] w-[18px]" />
              {notificationCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground animate-scale-in">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80" sideOffset={8}>
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Button variant="ghost" size="sm" className="h-auto py-1 px-2 text-xs text-primary hover:text-primary">
                Mark all read
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              <NotificationItem
                title="Payment Received"
                description="Customer #1234 paid ৳2,500 via Cash"
                time="2 min ago"
                unread
              />
              <NotificationItem
                title="New Customer"
                description="Rahim Ahmed joined with 20 Mbps plan"
                time="1 hour ago"
                unread
              />
              <NotificationItem
                title="Auto-Suspend Alert"
                description="5 customers due for suspension tomorrow"
                time="3 hours ago"
              />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-9 gap-2 px-2 hover:bg-muted transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
                {profileLoading ? (
                  <Skeleton className="h-full w-full rounded-full" />
                ) : (
                  <span className="text-xs font-semibold text-primary-foreground">
                    {initials}
                  </span>
                )}
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {profileLoading ? "Loading..." : displayName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

interface NotificationItemProps {
  title: string;
  description: string;
  time: string;
  unread?: boolean;
}

function NotificationItem({ title, description, time, unread }: NotificationItemProps) {
  return (
    <DropdownMenuItem className={cn(
      "flex flex-col items-start gap-1 py-3 px-4 cursor-pointer",
      unread && "bg-primary/5"
    )}>
      <div className="flex items-center gap-2 w-full">
        {unread && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
        <span className="font-medium text-sm">{title}</span>
        <span className="text-[10px] text-muted-foreground ml-auto">{time}</span>
      </div>
      <span className="text-xs text-muted-foreground line-clamp-2 pl-4">
        {description}
      </span>
    </DropdownMenuItem>
  );
}
