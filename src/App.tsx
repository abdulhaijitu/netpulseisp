import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { SuperAdminLayout } from "@/components/admin/SuperAdminLayout";
import MobileLayout from "@/components/mobile/MobileLayout";
import { OfflineFallback } from "@/components/mobile/OfflineFallback";
import { StaffRoute } from "@/components/StaffRoute";
import { CustomerRoute } from "@/components/CustomerRoute";
import { SuperAdminRoute } from "@/components/SuperAdminRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { TenantProvider } from "@/contexts/TenantContext";
import { ResellerImpersonationProvider } from "@/contexts/ResellerImpersonationContext";

// Dashboard Pages
import Dashboard from "@/pages/Dashboard";
import Customers from "@/pages/Customers";
import CustomerDetail from "@/pages/CustomerDetail";
import Packages from "@/pages/Packages";
import Billing from "@/pages/Billing";
import Payments from "@/pages/Payments";
import Settings from "@/pages/Settings";
import Reports from "@/pages/Reports";
import NetworkPage from "@/pages/NetworkPage";
import Notifications from "@/pages/Notifications";
import Resellers from "@/pages/Resellers";
import ResellerDetail from "@/pages/ResellerDetail";
import ResellerDashboardPage from "@/pages/reseller/ResellerDashboardPage";
import ResellerCustomersPage from "@/pages/reseller/ResellerCustomersPage";
import ResellerPaymentsPage from "@/pages/reseller/ResellerPaymentsPage";
import ResellerWalletPage from "@/pages/reseller/ResellerWalletPage";
import NotFound from "@/pages/NotFound";

// Auth Pages
import StaffLogin from "@/pages/auth/StaffLogin";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import TenantOnboarding from "@/pages/auth/TenantOnboarding";

// Portal Pages
import Login from "@/pages/portal/Login";
import Signup from "@/pages/portal/Signup";
import PortalDashboard from "@/pages/portal/PortalDashboard";
import PortalBills from "@/pages/portal/PortalBills";
import PortalPayments from "@/pages/portal/PortalPayments";
import PortalProfile from "@/pages/portal/PortalProfile";

// Mobile App Pages
import MobileLogin from "@/pages/mobile/MobileLogin";
import MobileHome from "@/pages/mobile/MobileHome";
import MobileBills from "@/pages/mobile/MobileBills";
import MobilePayments from "@/pages/mobile/MobilePayments";
import MobileProfile from "@/pages/mobile/MobileProfile";
import MobileInstall from "@/pages/mobile/MobileInstall";

// Super Admin Pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminTenants from "@/pages/admin/AdminTenants";
import AdminSubscriptions from "@/pages/admin/AdminSubscriptions";
import AdminPricing from "@/pages/admin/AdminPricing";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminSystemHealth from "@/pages/admin/AdminSystemHealth";
import AdminActivityLogs from "@/pages/admin/AdminActivityLogs";
import AdminAddons from "@/pages/admin/AdminAddons";
import AdminRevenue from "@/pages/admin/AdminRevenue";
import AdminWallets from "@/pages/admin/AdminWallets";
import AdminPayouts from "@/pages/admin/AdminPayouts";
import AdminPaymentInfra from "@/pages/admin/AdminPaymentInfra";
import AdminNotifications from "@/pages/admin/AdminNotifications";
import AdminNetworkIntegrations from "@/pages/admin/AdminNetworkIntegrations";
import AdminUsersRoles from "@/pages/admin/AdminUsersRoles";
import AdminApiUsage from "@/pages/admin/AdminApiUsage";
import AdminAuditLogs from "@/pages/admin/AdminAuditLogs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TenantProvider>
        <ResellerImpersonationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <OfflineFallback />
          <BrowserRouter>
            <Routes>
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Staff Auth Routes */}
              <Route path="/login" element={<StaffLogin />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/register" element={<TenantOnboarding />} />
              
              {/* Admin Dashboard Routes (ISP Staff) - Protected by role */}
              <Route
                element={
                  <StaffRoute>
                    <DashboardLayout />
                  </StaffRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/customers" element={<Customers />} />
                <Route path="/dashboard/customers/:customerId" element={<CustomerDetail />} />
                <Route path="/dashboard/packages" element={<Packages />} />
                <Route path="/dashboard/billing" element={<Billing />} />
                <Route path="/dashboard/payments" element={<Payments />} />
                <Route path="/dashboard/reports" element={<Reports />} />
                <Route path="/dashboard/network" element={<NetworkPage />} />
                <Route path="/dashboard/notifications" element={<Notifications />} />
                <Route path="/dashboard/resellers" element={<Resellers />} />
                <Route path="/dashboard/resellers/:resellerId" element={<ResellerDetail />} />
                {/* Reseller self-service routes (inside StaffRoute since reseller is a staff role) */}
                <Route path="/dashboard/reseller" element={<ResellerDashboardPage />} />
                <Route path="/dashboard/reseller/customers" element={<ResellerCustomersPage />} />
                <Route path="/dashboard/reseller/payments" element={<ResellerPaymentsPage />} />
                <Route path="/dashboard/reseller/wallet" element={<ResellerWalletPage />} />
                <Route path="/dashboard/settings" element={<Settings />} />
              </Route>

              {/* Customer Portal Routes (Web) */}
              <Route path="/portal/login" element={<Login />} />
              <Route path="/portal/signup" element={<Signup />} />
              <Route
                element={
                  <CustomerRoute>
                    <PortalLayout />
                  </CustomerRoute>
                }
              >
                <Route path="/portal" element={<PortalDashboard />} />
                <Route path="/portal/bills" element={<PortalBills />} />
                <Route path="/portal/payments" element={<PortalPayments />} />
                <Route path="/portal/profile" element={<PortalProfile />} />
              </Route>

              {/* Mobile Customer App Routes (PWA) */}
              <Route path="/app/login" element={<MobileLogin />} />
              <Route path="/app/install" element={<MobileInstall />} />
              <Route
                element={
                  <MobileLayout>
                    <></>
                  </MobileLayout>
                }
              >
                <Route path="/app" element={<MobileLayout><MobileHome /></MobileLayout>} />
                <Route path="/app/bills" element={<MobileLayout><MobileBills /></MobileLayout>} />
                <Route path="/app/payments" element={<MobileLayout><MobilePayments /></MobileLayout>} />
                <Route path="/app/profile" element={<MobileLayout><MobileProfile /></MobileLayout>} />
              </Route>

              {/* Super Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                element={
                  <SuperAdminRoute>
                    <SuperAdminLayout />
                  </SuperAdminRoute>
                }
              >
                {/* Platform Overview */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/health" element={<AdminSystemHealth />} />
                <Route path="/admin/activity" element={<AdminActivityLogs />} />
                
                {/* ISP Management */}
                <Route path="/admin/tenants" element={<AdminTenants />} />
                <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
                <Route path="/admin/addons" element={<AdminAddons />} />
                
                {/* Financials */}
                <Route path="/admin/revenue" element={<AdminRevenue />} />
                <Route path="/admin/wallets" element={<AdminWallets />} />
                <Route path="/admin/payouts" element={<AdminPayouts />} />
                
                {/* Infrastructure */}
                <Route path="/admin/payments" element={<AdminPaymentInfra />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
                <Route path="/admin/network" element={<AdminNetworkIntegrations />} />
                
                {/* Governance */}
                <Route path="/admin/users" element={<AdminUsersRoles />} />
                <Route path="/admin/api" element={<AdminApiUsage />} />
                <Route path="/admin/audit" element={<AdminAuditLogs />} />
                
                {/* Settings */}
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/pricing" element={<AdminPricing />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </ResellerImpersonationProvider>
      </TenantProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
