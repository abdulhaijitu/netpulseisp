import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Types
export interface PlatformPlan {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  billing_cycle: "monthly" | "quarterly" | "yearly";
  max_customers: number | null;
  max_staff: number | null;
  features: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PlatformAddon {
  id: string;
  name: string;
  code: string;
  description: string | null;
  pricing_type: "fixed" | "tiered" | "usage_based";
  base_price: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  tiers?: AddonTier[];
}

export interface AddonTier {
  id: string;
  addon_id: string;
  min_customers: number;
  max_customers: number | null;
  price: number;
  created_at: string;
}

export interface TenantSubscription {
  id: string;
  tenant_id: string;
  plan_id: string;
  status: "active" | "past_due" | "cancelled" | "trial";
  current_period_start: string;
  current_period_end: string;
  trial_ends_at: string | null;
  cancelled_at: string | null;
  plan?: PlatformPlan;
}

export interface TenantAddonSubscription {
  id: string;
  tenant_id: string;
  addon_id: string;
  activated_at: string;
  deactivated_at: string | null;
  is_active: boolean;
  addon?: PlatformAddon;
}

export interface BillingEstimate {
  base_plan_cost: number;
  addons_cost: number;
  total_cost: number;
  customer_count: number;
}

// Hooks for Plans
export function usePlatformPlans() {
  return useQuery({
    queryKey: ["platform-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_plans")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      return data as PlatformPlan[];
    },
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (plan: { name: string; base_price: number; billing_cycle?: "monthly" | "quarterly" | "yearly"; description?: string; max_customers?: number | null; max_staff?: number | null; features?: string[]; is_active?: boolean; sort_order?: number }) => {
      const { data, error } = await supabase
        .from("platform_plans")
        .insert({
          name: plan.name,
          base_price: plan.base_price,
          billing_cycle: plan.billing_cycle ?? "monthly",
          description: plan.description,
          max_customers: plan.max_customers,
          max_staff: plan.max_staff,
          features: plan.features as unknown as string,
          is_active: plan.is_active ?? true,
          sort_order: plan.sort_order ?? 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-plans"] });
      toast({ title: "প্ল্যান তৈরি হয়েছে" });
    },
    onError: (error: Error) => {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PlatformPlan> }) => {
      const { data, error } = await supabase
        .from("platform_plans")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-plans"] });
      toast({ title: "প্ল্যান আপডেট হয়েছে" });
    },
    onError: (error: Error) => {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    },
  });
}

// Hooks for Addons
export function usePlatformAddons() {
  return useQuery({
    queryKey: ["platform-addons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_addons")
        .select(`
          *,
          tiers:platform_addon_tiers(*)
        `)
        .order("sort_order");

      if (error) throw error;
      return data as PlatformAddon[];
    },
  });
}

export function useCreateAddon() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (addon: { name: string; code: string; description?: string; pricing_type?: "fixed" | "tiered" | "usage_based"; base_price?: number; is_active?: boolean; sort_order?: number }) => {
      const { data, error } = await supabase
        .from("platform_addons")
        .insert({
          name: addon.name,
          code: addon.code,
          description: addon.description,
          pricing_type: addon.pricing_type ?? "fixed",
          base_price: addon.base_price ?? 0,
          is_active: addon.is_active ?? true,
          sort_order: addon.sort_order ?? 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-addons"] });
      toast({ title: "অ্যাড-অন তৈরি হয়েছে" });
    },
    onError: (error: Error) => {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateAddon() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PlatformAddon> }) => {
      const { data, error } = await supabase
        .from("platform_addons")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-addons"] });
      toast({ title: "অ্যাড-অন আপডেট হয়েছে" });
    },
    onError: (error: Error) => {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    },
  });
}

// Hooks for Addon Tiers
export function useUpdateAddonTiers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ addonId, tiers }: { addonId: string; tiers: { min_customers?: number; max_customers?: number | null; price?: number }[] }) => {
      // Delete existing tiers
      await supabase.from("platform_addon_tiers").delete().eq("addon_id", addonId);

      // Insert new tiers
      if (tiers.length > 0) {
        const { error } = await supabase.from("platform_addon_tiers").insert(
          tiers.map((t) => ({
            addon_id: addonId,
            min_customers: t.min_customers ?? 0,
            max_customers: t.max_customers,
            price: t.price ?? 0,
          }))
        );
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-addons"] });
      toast({ title: "টায়ার আপডেট হয়েছে" });
    },
    onError: (error: Error) => {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    },
  });
}

// Hooks for Tenant Subscriptions
export function useTenantSubscription(tenantId?: string) {
  return useQuery({
    queryKey: ["tenant-subscription", tenantId],
    queryFn: async () => {
      if (!tenantId) return null;

      const { data, error } = await supabase
        .from("tenant_subscriptions")
        .select(`
          *,
          plan:platform_plans(*)
        `)
        .eq("tenant_id", tenantId)
        .maybeSingle();

      if (error) throw error;
      return data as TenantSubscription | null;
    },
    enabled: !!tenantId,
  });
}

export function useTenantAddonSubscriptions(tenantId?: string) {
  return useQuery({
    queryKey: ["tenant-addon-subscriptions", tenantId],
    queryFn: async () => {
      if (!tenantId) return [];

      const { data, error } = await supabase
        .from("tenant_addon_subscriptions")
        .select(`
          *,
          addon:platform_addons(*)
        `)
        .eq("tenant_id", tenantId)
        .eq("is_active", true);

      if (error) throw error;
      return data as TenantAddonSubscription[];
    },
    enabled: !!tenantId,
  });
}

export function useBillingEstimate(tenantId?: string) {
  return useQuery({
    queryKey: ["billing-estimate", tenantId],
    queryFn: async () => {
      if (!tenantId) return null;

      const { data, error } = await supabase.rpc("get_tenant_billing_estimate", {
        _tenant_id: tenantId,
      });

      if (error) throw error;
      return data?.[0] as BillingEstimate | null;
    },
    enabled: !!tenantId,
  });
}

export function useAssignPlanToTenant() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ tenantId, planId }: { tenantId: string; planId: string }) => {
      const periodEnd = new Date();
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      const { data, error } = await supabase
        .from("tenant_subscriptions")
        .upsert({
          tenant_id: tenantId,
          plan_id: planId,
          status: "active",
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd.toISOString(),
        }, { onConflict: "tenant_id" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-subscription"] });
      queryClient.invalidateQueries({ queryKey: ["billing-estimate"] });
      toast({ title: "প্ল্যান অ্যাসাইন হয়েছে" });
    },
    onError: (error: Error) => {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    },
  });
}

export function useToggleTenantAddon() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ tenantId, addonId, activate }: { tenantId: string; addonId: string; activate: boolean }) => {
      if (activate) {
        const { error } = await supabase.from("tenant_addon_subscriptions").upsert(
          {
            tenant_id: tenantId,
            addon_id: addonId,
            is_active: true,
            activated_at: new Date().toISOString(),
            deactivated_at: null,
          },
          { onConflict: "tenant_id,addon_id" }
        );
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("tenant_addon_subscriptions")
          .update({ is_active: false, deactivated_at: new Date().toISOString() })
          .eq("tenant_id", tenantId)
          .eq("addon_id", addonId);
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tenant-addon-subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["billing-estimate"] });
      toast({ title: variables.activate ? "অ্যাড-অন সক্রিয় হয়েছে" : "অ্যাড-অন নিষ্ক্রিয় হয়েছে" });
    },
    onError: (error: Error) => {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    },
  });
}

// Platform Invoices
export function usePlatformInvoices(tenantId?: string) {
  return useQuery({
    queryKey: ["platform-invoices", tenantId],
    queryFn: async () => {
      let query = supabase
        .from("platform_invoices")
        .select(`
          *,
          tenant:tenants(name, subdomain),
          items:platform_invoice_items(*)
        `)
        .order("created_at", { ascending: false });

      if (tenantId) {
        query = query.eq("tenant_id", tenantId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}
