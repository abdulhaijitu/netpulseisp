import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Download, CreditCard, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Bill } from "@/hooks/usePortalData";
import { usePortalCustomer } from "@/hooks/usePortalData";
import { useInitiatePayment } from "@/hooks/usePaymentGateway";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface MobileBillDetailProps {
  bill: Bill;
  onBack: () => void;
}

const billStatusConfig = {
  paid: { label: "Paid", variant: "default" as const },
  due: { label: "Due", variant: "secondary" as const },
  partial: { label: "Partial", variant: "outline" as const },
  overdue: { label: "Overdue", variant: "destructive" as const },
};

export default function MobileBillDetail({ bill, onBack }: MobileBillDetailProps) {
  const { data: customer } = usePortalCustomer();
  const { initiatePayment, isProcessing, error } = useInitiatePayment();
  const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;
  const status = bill.status || "due";

  const handlePayNow = () => {
    initiatePayment({
      billId: bill.id,
      amount: Number(bill.amount),
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">{bill.invoice_number}</h1>
          <p className="text-sm text-muted-foreground">Bill Details</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {/* Amount Card */}
      <Card className={`${
        status === "paid" ? "bg-green-500/5 border-green-500/20" :
        status === "overdue" ? "bg-red-500/5 border-red-500/20" :
        "bg-amber-500/5 border-amber-500/20"
      }`}>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Bill Amount</p>
          <p className="text-4xl font-bold mb-3">{formatCurrency(Number(bill.amount))}</p>
          <Badge variant={billStatusConfig[status].variant} className="text-sm px-4 py-1">
            {billStatusConfig[status].label}
          </Badge>
        </CardContent>
      </Card>

      {/* Bill Details */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Customer</span>
            <span className="font-medium">{customer?.name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Billing Period</span>
            <span className="font-medium text-right">
              {new Date(bill.billing_period_start).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short'
              })} - {new Date(bill.billing_period_end).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Due Date</span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">
                {new Date(bill.due_date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Package</span>
            <span className="font-medium">{customer?.packages?.name || "N/A"}</span>
          </div>
          {bill.notes && (
            <div className="py-2">
              <span className="text-muted-foreground block mb-1">Notes</span>
              <span className="text-sm">{bill.notes}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3 pt-4">
        {status !== "paid" && (
          <Button 
            className="w-full h-14 text-lg font-semibold gap-2"
            onClick={handlePayNow}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay Now • {formatCurrency(Number(bill.amount))}
              </>
            )}
          </Button>
        )}
        <Button variant="outline" className="w-full h-12 gap-2">
          <Download className="w-5 h-5" />
          Download Invoice
        </Button>
      </div>
    </div>
  );
}
