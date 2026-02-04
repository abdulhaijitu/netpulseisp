import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Bill = Tables<"bills"> & {
  customer?: Tables<"customers"> & {
    package?: Tables<"packages">;
  };
  payments?: Tables<"payments">[];
};

export function useBills(tenantId?: string) {
  return useQuery({
    queryKey: ["bills", tenantId],
    queryFn: async () => {
      let query = supabase
        .from("bills")
        .select(`
          *,
          customer:customers(
            *,
            package:packages(*)
          ),
          payments(*)
        `)
        .order("created_at", { ascending: false });

      if (tenantId) {
        query = query.eq("tenant_id", tenantId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Bill[];
    },
    enabled: true,
  });
}

export function useBill(billId: string) {
  return useQuery({
    queryKey: ["bill", billId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bills")
        .select(`
          *,
          customer:customers(
            *,
            package:packages(*)
          ),
          payments(*)
        `)
        .eq("id", billId)
        .single();

      if (error) throw error;
      return data as Bill;
    },
    enabled: !!billId,
  });
}

export function useCustomerBills(customerId: string) {
  return useQuery({
    queryKey: ["bills", "customer", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bills")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!customerId,
  });
}

export function useCreateBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bill: TablesInsert<"bills">) => {
      const { data, error } = await supabase
        .from("bills")
        .insert(bill)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });
}

export function useUpdateBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<TablesInsert<"bills">>;
    }) => {
      const { data, error } = await supabase
        .from("bills")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["bill", variables.id] });
    },
  });
}

export function useGenerateBills() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tenantId,
      billingPeriodStart,
      billingPeriodEnd,
      dueDate,
    }: {
      tenantId: string;
      billingPeriodStart: string;
      billingPeriodEnd: string;
      dueDate: string;
    }) => {
      // Check for existing bills in this billing period
      const { data: existingBills, error: existingError } = await supabase
        .from("bills")
        .select("customer_id")
        .eq("tenant_id", tenantId)
        .eq("billing_period_start", billingPeriodStart)
        .eq("billing_period_end", billingPeriodEnd);

      if (existingError) throw existingError;

      const existingCustomerIds = new Set(existingBills?.map(b => b.customer_id) || []);

      // Get all active customers with their packages
      const { data: customers, error: customersError } = await supabase
        .from("customers")
        .select("*, package:packages(*)")
        .eq("tenant_id", tenantId)
        .eq("connection_status", "active");

      if (customersError) throw customersError;

      // Filter out customers who already have bills for this period
      const customersTooBill = customers.filter(
        (c) => c.package && !existingCustomerIds.has(c.id)
      );

      if (customersTooBill.length === 0) {
        if (existingBills && existingBills.length > 0) {
          throw new Error("Bills already exist for this billing period");
        }
        throw new Error("No active customers with packages to bill");
      }

      // Generate unique invoice numbers with timestamp
      const timestamp = Date.now().toString(36).toUpperCase();
      const bills = customersTooBill.map((customer, index) => ({
        tenant_id: tenantId,
        customer_id: customer.id,
        amount: customer.package!.monthly_price,
        billing_period_start: billingPeriodStart,
        billing_period_end: billingPeriodEnd,
        due_date: dueDate,
        invoice_number: `INV-${timestamp}-${String(index + 1).padStart(4, "0")}`,
        status: "due" as const,
      }));

      const { data, error } = await supabase
        .from("bills")
        .insert(bills)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });
}
