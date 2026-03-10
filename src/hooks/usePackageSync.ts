import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function usePackageSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      integrationId,
      packageId,
    }: {
      integrationId: string;
      packageId: string;
    }) => {
      const { data, error } = await supabase.functions.invoke("network-sync", {
        body: {
          action: "sync_package",
          integration_id: integrationId,
          package_id: packageId,
        },
      });

      if (error) throw error;
      if (data && !data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["network-sync-queue"] });
      toast.success("প্যাকেজ মাইক্রোটিকে সিঙ্ক হয়েছে");
    },
    onError: (error) => {
      toast.error(`সিঙ্ক ব্যর্থ: ${error.message}`);
    },
  });
}
