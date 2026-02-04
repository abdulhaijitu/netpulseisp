import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Receipt, Calendar, ChevronRight, FileText, CreditCard, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { usePortalBills, usePortalCustomer } from "@/hooks/usePortalData";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MobileBillDetail from "@/components/mobile/MobileBillDetail";
import type { Bill } from "@/hooks/usePortalData";
import { useInitiatePayment } from "@/hooks/usePaymentGateway";

const billStatusConfig = {
  paid: { label: "Paid", variant: "default" as const, color: "text-green-600" },
  due: { label: "Due", variant: "secondary" as const, color: "text-amber-600" },
  partial: { label: "Partial", variant: "outline" as const, color: "text-blue-600" },
  overdue: { label: "Overdue", variant: "destructive" as const, color: "text-red-600" },
};

export default function MobileBills() {
  const { data: customer } = usePortalCustomer();
  const { data: bills, isLoading, refetch } = usePortalBills();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { initiatePayment, isProcessing } = useInitiatePayment();

  // Handle payment status from redirect
  const paymentStatus = searchParams.get("status");
  const [showPaymentResult, setShowPaymentResult] = useState(false);

  useEffect(() => {
    if (paymentStatus) {
      setShowPaymentResult(true);
      // Refetch bills after payment
      refetch();
      // Clear the status param after showing
      const timer = setTimeout(() => {
        setShowPaymentResult(false);
        setSearchParams({});
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, refetch, setSearchParams]);

  const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;

  // Calculate totals
  const unpaidBills = bills?.filter(bill => 
    bill.status === "due" || bill.status === "overdue" || bill.status === "partial"
  ) || [];
  
  const totalDue = unpaidBills.reduce((sum, bill) => sum + Number(bill.amount), 0);

  // Get oldest unpaid bill for "Pay All" (pay one at a time actually)
  const oldestUnpaidBill = unpaidBills.length > 0 ? unpaidBills[unpaidBills.length - 1] : null;

  const handlePayAll = () => {
    if (oldestUnpaidBill) {
      initiatePayment({
        billId: oldestUnpaidBill.id,
        amount: Number(oldestUnpaidBill.amount),
      });
    }
  };

  if (selectedBill) {
    return <MobileBillDetail bill={selectedBill} onBack={() => setSelectedBill(null)} />;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Bills</h1>
        <p className="text-muted-foreground">Your billing history</p>
      </div>

      {/* Payment Result Alert */}
      {showPaymentResult && paymentStatus === "success" && (
        <Alert className="bg-green-500/10 border-green-500/30">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Payment successful! Your bill has been paid.
          </AlertDescription>
        </Alert>
      )}
      {showPaymentResult && paymentStatus === "cancelled" && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Payment was cancelled. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Card */}
      {totalDue > 0 && (
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total Due</p>
                <p className="text-3xl font-bold">{formatCurrency(totalDue)}</p>
                <p className="text-xs opacity-70 mt-1">
                  {unpaidBills.length} unpaid bill{unpaidBills.length > 1 ? "s" : ""}
                </p>
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                className="font-semibold gap-2"
                onClick={handlePayAll}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4" />
                )}
                {unpaidBills.length > 1 ? "Pay Oldest" : "Pay Now"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bills List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))
        ) : bills && bills.length > 0 ? (
          bills.map((bill) => {
            const status = bill.status || "due";
            return (
              <Card 
                key={bill.id} 
                className="touch-manipulation active:scale-[0.98] transition-transform cursor-pointer"
                onClick={() => setSelectedBill(bill)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        status === "paid" ? "bg-green-500/10" : 
                        status === "overdue" ? "bg-red-500/10" : 
                        "bg-amber-500/10"
                      }`}>
                        <Receipt className={`w-6 h-6 ${billStatusConfig[status].color}`} />
                      </div>
                      <div>
                        <p className="font-semibold">{bill.invoice_number}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(bill.billing_period_start).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short'
                          })} - {new Date(bill.billing_period_end).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div>
                        <p className="font-bold text-lg">{formatCurrency(Number(bill.amount))}</p>
                        <Badge variant={billStatusConfig[status].variant} className="text-xs">
                          {billStatusConfig[status].label}
                        </Badge>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold">No Bills Yet</h3>
            <p className="text-sm text-muted-foreground">Your bills will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
