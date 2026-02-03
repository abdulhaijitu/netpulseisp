import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { SuperAdminLayout } from "@/components/admin/SuperAdminLayout";
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

// Auth Pages
import StaffLogin from "@/pages/auth/StaffLogin";
import ForgotPassword from "@/pages/auth/ForgotPassword";

// Portal Pages
import Login from "@/pages/portal/Login";
import Signup from "@/pages/portal/Signup";
import PortalDashboard from "@/pages/portal/PortalDashboard";
import PortalBills from "@/pages/portal/PortalBills";
import PortalPayments from "@/pages/portal/PortalPayments";
import PortalProfile from "@/pages/portal/PortalProfile";

// Super Admin Pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminTenants from "@/pages/admin/AdminTenants";
import AdminSubscriptions from "@/pages/admin/AdminSubscriptions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Staff Auth Routes */}
            <Route path="/login" element={<StaffLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Admin Dashboard Routes (ISP Staff) - Protected */}
            <Route
              element={
                <ProtectedRoute redirectTo="/login">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/customers" element={<Customers />} />
              <Route path="/dashboard/packages" element={<Packages />} />
              <Route path="/dashboard/billing" element={<Billing />} />
              <Route path="/dashboard/payments" element={<Payments />} />
              <Route path="/dashboard/settings" element={<Settings />} />
            </Route>

            {/* Customer Portal Routes */}
            <Route path="/portal/login" element={<Login />} />
            <Route path="/portal/signup" element={<Signup />} />
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

            {/* Super Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              element={
                <ProtectedRoute redirectTo="/admin/login">
                  <SuperAdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/tenants" element={<AdminTenants />} />
              <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
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
