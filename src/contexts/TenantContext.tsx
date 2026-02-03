import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Tenant = Tables<"tenants">;

interface TenantContextType {
  currentTenant: Tenant | null;
  setCurrentTenant: (tenant: Tenant | null) => void;
  allTenants: Tenant[];
  isLoading: boolean;
  isSuperAdmin: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { data: role } = useUserRole();
  const isSuperAdmin = role === "super_admin";
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  // Fetch user's profile to get their default tenant_id
  const { data: profile } = useQuery({
    queryKey: ["profile-tenant", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("tenant_id")
        .eq("id", user.id)
        .single();
      if (error) return null;
      return data;
    },
    enabled: !!user?.id,
  });

  // For super admin, fetch all tenants. For others, only their tenant.
  const { data: allTenants = [], isLoading: tenantsLoading } = useQuery({
    queryKey: ["tenants-for-context", isSuperAdmin, profile?.tenant_id],
    queryFn: async () => {
      if (isSuperAdmin) {
        // Super admin can see all tenants
        const { data, error } = await supabase
          .from("tenants")
          .select("*")
          .order("name");
        if (error) throw error;
        return data as Tenant[];
      } else if (profile?.tenant_id) {
        // Regular user sees only their tenant
        const { data, error } = await supabase
          .from("tenants")
          .select("*")
          .eq("id", profile.tenant_id);
        if (error) throw error;
        return data as Tenant[];
      }
      return [];
    },
    enabled: !!user?.id && (isSuperAdmin || !!profile?.tenant_id),
  });

  // Determine current tenant
  const currentTenant = selectedTenantId
    ? allTenants.find((t) => t.id === selectedTenantId) || null
    : isSuperAdmin
    ? allTenants[0] || null
    : allTenants.find((t) => t.id === profile?.tenant_id) || null;

  // Initialize selected tenant when tenants load
  useEffect(() => {
    if (!selectedTenantId && allTenants.length > 0) {
      if (isSuperAdmin) {
        setSelectedTenantId(allTenants[0]?.id || null);
      } else if (profile?.tenant_id) {
        setSelectedTenantId(profile.tenant_id);
      }
    }
  }, [allTenants, isSuperAdmin, profile?.tenant_id, selectedTenantId]);

  const setCurrentTenant = (tenant: Tenant | null) => {
    setSelectedTenantId(tenant?.id || null);
  };

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        setCurrentTenant,
        allTenants,
        isLoading: tenantsLoading,
        isSuperAdmin,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenantContext() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenantContext must be used within a TenantProvider");
  }
  return context;
}
