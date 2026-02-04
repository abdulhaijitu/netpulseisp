import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InitiatePaymentParams {
  billId: string;
  amount: number;
}

interface PaymentResponse {
  success: boolean;
  payment_url: string;
  invoice_id: string;
}

export function useInitiatePayment() {
  const [isProcessing, setIsProcessing] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({ billId, amount }: InitiatePaymentParams) => {
      setIsProcessing(true);

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error("আপনাকে প্রথমে লগইন করতে হবে");
      }

      const currentUrl = window.location.origin;
      const returnUrl = `${currentUrl}/portal/payments?status=success`;
      const cancelUrl = `${currentUrl}/portal/bills?status=cancelled`;

      const response = await supabase.functions.invoke<PaymentResponse>("initiate-payment", {
        body: {
          bill_id: billId,
          amount: amount,
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "পেমেন্ট শুরু করা যায়নি");
      }

      if (!response.data?.payment_url) {
        throw new Error("পেমেন্ট URL পাওয়া যায়নি");
      }

      return response.data;
    },
    onSuccess: (data) => {
      // Redirect to payment gateway
      window.location.href = data.payment_url;
    },
    onError: (error: Error) => {
      setIsProcessing(false);
      toast.error(error.message || "পেমেন্ট শুরু করা যায়নি");
    },
    onSettled: () => {
      // Don't reset isProcessing on success since we're redirecting
    },
  });

  return {
    initiatePayment: mutation.mutate,
    isProcessing: isProcessing || mutation.isPending,
    error: mutation.error,
  };
}
