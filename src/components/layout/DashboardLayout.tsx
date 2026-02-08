import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { MobileBottomNav } from "./MobileBottomNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useTenantContext } from "@/contexts/TenantContext";
import { useResellerImpersonation } from "@/contexts/ResellerImpersonationContext";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, UserCheck } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { isImpersonating, currentTenant, stopImpersonation } = useTenantContext();
  const { isImpersonatingReseller, impersonatedResellerName, stopResellerImpersonation } = useResellerImpersonation();
  const isMobile = useIsMobile();

  const handleExitImpersonation = () => {
    stopImpersonation();
    navigate("/admin/tenants");
  };

  const handleExitResellerImpersonation = () => {
    stopResellerImpersonation();
    navigate("/dashboard/resellers");
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        
        <div className="flex flex-1 flex-col min-w-0">
          {/* Tenant Impersonation Banner */}
          {isImpersonating && !isImpersonatingReseller && (
            <div className="bg-warning/15 text-warning-foreground px-4 py-2.5 flex items-center justify-between border-b border-warning/20 animate-fade-in">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-warning/20 flex items-center justify-center">
                  <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                </div>
                <span className="text-sm font-medium">
                  Viewing as <strong>"{currentTenant?.name}"</strong>
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExitImpersonation}
                className="h-8 gap-1.5 text-warning-foreground hover:bg-warning/20 hover:text-warning-foreground"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Exit</span>
              </Button>
            </div>
          )}

          {/* Reseller Impersonation Banner */}
          {isImpersonatingReseller && (
            <div className="bg-primary/10 text-primary px-4 py-2.5 flex items-center justify-between border-b border-primary/20 animate-fade-in">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <UserCheck className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  রিসেলার হিসেবে দেখছেন: <strong>"{impersonatedResellerName}"</strong>
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExitResellerImpersonation}
                className="h-8 gap-1.5 text-primary hover:bg-primary/20"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">বের হন</span>
              </Button>
            </div>
          )}
          
          <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </main>
          
          <MobileBottomNav />
        </div>
      </div>
    </SidebarProvider>
  );
}
