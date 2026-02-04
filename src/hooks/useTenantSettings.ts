import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface TenantSettingsUpdate {
  uddoktapay_api_key?: string | null;
  uddoktapay_base_url?: string | null;
  enable_online_payment?: boolean;
  auto_suspend_days?: number;
  currency?: string;
  timezone?: string;
  language?: string;
  primary_color?: string;
  accent_color?: string;
  name?: string;
  subdomain?: string;
}

export function useUpdateTenantSettings(tenantId: string | undefined) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (settings: TenantSettingsUpdate) => {
      if (!tenantId) throw new Error("No tenant ID");

      const { data, error } = await supabase
        .from("tenants")
        .update(settings)
        .eq("id", tenantId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentTenant", user?.id] });
      toast.success("সেটিংস সফলভাবে আপডেট হয়েছে");
    },
    onError: (error) => {
      console.error("Error updating tenant settings:", error);
      toast.error("সেটিংস আপডেট করতে সমস্যা হয়েছে");
    },
  });
}
