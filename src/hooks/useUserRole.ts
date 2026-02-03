import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];

const STAFF_ROLES: AppRole[] = [
  "super_admin",
  "isp_owner",
  "admin",
  "manager",
  "staff",
  "accountant",
  "marketing",
];

export function useUserRole() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["userRole", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase.rpc("get_user_role", {
        _user_id: user.id,
      });

      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      }

      return data as AppRole | null;
    },
    enabled: !!user?.id,
  });
}

export function useIsStaff() {
  const { data: role, isLoading } = useUserRole();
  return {
    isStaff: role ? STAFF_ROLES.includes(role) : false,
    isLoading,
  };
}

export function useIsSuperAdmin() {
  const { data: role, isLoading } = useUserRole();
  return {
    isSuperAdmin: role === "super_admin",
    isLoading,
  };
}

export function useIsCustomer() {
  const { data: role, isLoading } = useUserRole();
  return {
    isCustomer: role === "member" || role === null,
    isLoading,
  };
}
