import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse webhook data from UddoktaPay
    const webhookData = await req.json();
    console.log("Payment webhook received:", webhookData);

    const {
      invoice_id,
      status,
      amount,
      fee,
      charged_amount,
      transaction_id,
      payment_method,
      sender_number,
      metadata,
    } = webhookData;

    // Validate required fields
    if (!metadata?.bill_id || !metadata?.customer_id || !metadata?.tenant_id) {
      console.error("Missing metadata in webhook:", webhookData);
      return new Response(
        JSON.stringify({ error: "Invalid webhook data: missing metadata" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Only process completed payments
    if (status !== "COMPLETED") {
      console.log(`Payment status is ${status}, not processing`);
      return new Response(
        JSON.stringify({ message: `Payment status: ${status}` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if payment already recorded (idempotency)
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("id")
      .eq("reference", transaction_id)
      .maybeSingle();

    if (existingPayment) {
      console.log("Payment already recorded:", transaction_id);
      return new Response(
        JSON.stringify({ message: "Payment already processed" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Record the payment
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        tenant_id: metadata.tenant_id,
        customer_id: metadata.customer_id,
        bill_id: metadata.bill_id,
        amount: parseFloat(amount),
        method: "online",
        reference: transaction_id,
        notes: `UddoktaPay: ${payment_method || "N/A"} | Sender: ${sender_number || "N/A"} | Fee: ${fee || 0}`,
      })
      .select()
      .single();

    if (paymentError) {
      console.error("Failed to record payment:", paymentError);
      return new Response(
        JSON.stringify({ error: "Failed to record payment", details: paymentError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Payment recorded successfully:", payment.id);

    // Update bill status to paid
    const { error: billUpdateError } = await supabase
      .from("bills")
      .update({ status: "paid" })
      .eq("id", metadata.bill_id);

    if (billUpdateError) {
      console.error("Failed to update bill status:", billUpdateError);
    }

    // Update customer's due balance and last payment date
    const { data: customer } = await supabase
      .from("customers")
      .select("due_balance")
      .eq("id", metadata.customer_id)
      .single();

    if (customer) {
      const newDueBalance = Math.max(0, (customer.due_balance || 0) - parseFloat(amount));
      
      await supabase
        .from("customers")
        .update({
          due_balance: newDueBalance,
          last_payment_date: new Date().toISOString().split("T")[0],
        })
        .eq("id", metadata.customer_id);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Payment processed successfully",
        payment_id: payment.id 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Payment verification error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Internal server error", details: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
