import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";

// Dashboard Pages
import Dashboard from "@/pages/Dashboard";
import Customers from "@/pages/Customers";
import Packages from "@/pages/Packages";
import Billing from "@/pages/Billing";
import Payments from "@/pages/Payments";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

// Portal Pages
import Login from "@/pages/portal/Login";
import PortalDashboard from "@/pages/portal/PortalDashboard";
import PortalBills from "@/pages/portal/PortalBills";
import PortalPayments from "@/pages/portal/PortalPayments";
import PortalProfile from "@/pages/portal/PortalProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Admin Dashboard Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/customers" element={<Customers />} />
              <Route path="/dashboard/packages" element={<Packages />} />
              <Route path="/dashboard/billing" element={<Billing />} />
              <Route path="/dashboard/payments" element={<Payments />} />
              <Route path="/dashboard/settings" element={<Settings />} />
            </Route>

            {/* Customer Portal Routes */}
            <Route path="/portal/login" element={<Login />} />
            <Route
              element={
                <ProtectedRoute>
                  <PortalLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/portal" element={<PortalDashboard />} />
              <Route path="/portal/bills" element={<PortalBills />} />
              <Route path="/portal/payments" element={<PortalPayments />} />
              <Route path="/portal/profile" element={<PortalProfile />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
