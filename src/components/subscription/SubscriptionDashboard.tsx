import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Package,
  Puzzle,
  CreditCard,
  Calendar,
  Users,
  TrendingUp,
  ArrowRight,
  Check,
  AlertCircle,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { bn } from "date-fns/locale";
import { useTenantContext } from "@/contexts/TenantContext";
import {
  useTenantSubscription,
  useTenantAddonSubscriptions,
  useBillingEstimate,
  usePlatformPlans,
  usePlatformAddons,
  useAssignPlanToTenant,
  useToggleTenantAddon,
  PlatformPlan,
} from "@/hooks/usePlatformPricing";

const statusLabels = {
  active: { label: "সক্রিয়", variant: "default" as const },
  past_due: { label: "বকেয়া", variant: "destructive" as const },
  cancelled: { label: "বাতিল", variant: "secondary" as const },
  trial: { label: "ট্রায়াল", variant: "outline" as const },
};

export function SubscriptionDashboard() {
  const { currentTenant } = useTenantContext();
  const tenantId = currentTenant?.id;

  const { data: subscription, isLoading: subscriptionLoading } = useTenantSubscription(tenantId);
  const { data: addonSubscriptions, isLoading: addonsLoading } = useTenantAddonSubscriptions(tenantId);
  const { data: billingEstimate, isLoading: estimateLoading } = useBillingEstimate(tenantId);
  const { data: allPlans } = usePlatformPlans();
  const { data: allAddons } = usePlatformAddons();

  const assignPlan = useAssignPlanToTenant();
  const toggleAddon = useToggleTenantAddon();

  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlatformPlan | null>(null);

  const isLoading = subscriptionLoading || addonsLoading || estimateLoading;

  const currentPlan = subscription?.plan;
  const activeAddonIds = addonSubscriptions?.map((a) => a.addon_id) ?? [];

  const handlePlanSelect = (plan: PlatformPlan) => {
    setSelectedPlan(plan);
    setUpgradeDialogOpen(true);
  };

  const handleConfirmUpgrade = () => {
    if (selectedPlan && tenantId) {
      assignPlan.mutate({ tenantId, planId: selectedPlan.id });
      setUpgradeDialogOpen(false);
    }
  };

  const handleToggleAddon = (addonId: string, currentlyActive: boolean) => {
    if (tenantId) {
      toggleAddon.mutate({ tenantId, addonId, activate: !currentlyActive });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              বর্তমান প্ল্যান
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{currentPlan?.name ?? "কোন প্ল্যান নেই"}</p>
                {subscription && (
                  <Badge variant={statusLabels[subscription.status].variant}>
                    {statusLabels[subscription.status].label}
                  </Badge>
                )}
              </div>
              {currentPlan && (
                <div className="text-right">
                  <p className="text-2xl font-bold">৳{currentPlan.base_price}</p>
                  <p className="text-sm text-muted-foreground">/মাস</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              গ্রাহক সংখ্যা
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold">{billingEstimate?.customer_count ?? 0}</p>
                {currentPlan?.max_customers && (
                  <p className="text-sm text-muted-foreground">
                    / {currentPlan.max_customers}
                  </p>
                )}
              </div>
              {currentPlan?.max_customers && (
                <Progress
                  value={((billingEstimate?.customer_count ?? 0) / currentPlan.max_customers) * 100}
                  className="h-2"
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              পরবর্তী বিলিং
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">৳{billingEstimate?.total_cost ?? 0}</p>
              {subscription?.current_period_end && (
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(subscription.current_period_end), {
                    addSuffix: true,
                    locale: bn,
                  })}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            বিলিং ব্রেকডাউন
          </CardTitle>
          <CardDescription>পরবর্তী বিলিং সাইকেলের আনুমানিক খরচ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">বেস প্ল্যান ({currentPlan?.name})</p>
                <p className="text-sm text-muted-foreground">মাসিক সাবস্ক্রিপশন</p>
              </div>
            </div>
            <p className="font-medium">৳{billingEstimate?.base_plan_cost ?? 0}</p>
          </div>

          {addonSubscriptions && addonSubscriptions.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">সক্রিয় অ্যাড-অন</p>
                {addonSubscriptions.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Puzzle className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{sub.addon?.name}</p>
                        <p className="text-sm text-muted-foreground">{sub.addon?.description}</p>
                      </div>
                    </div>
                    <p className="font-medium">৳{sub.addon?.base_price ?? 0}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <Separator />

          <div className="flex items-center justify-between py-2">
            <p className="text-lg font-bold">মোট আনুমানিক</p>
            <p className="text-lg font-bold">৳{billingEstimate?.total_cost ?? 0}</p>
          </div>

          {subscription?.current_period_end && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              পরবর্তী বিল: {format(new Date(subscription.current_period_end), "dd MMMM, yyyy", { locale: bn })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            প্ল্যান আপগ্রেড / ডাউনগ্রেড
          </CardTitle>
          <CardDescription>আপনার প্রয়োজন অনুযায়ী প্ল্যান পরিবর্তন করুন</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {allPlans?.filter((p) => p.is_active).map((plan) => {
              const isCurrent = plan.id === currentPlan?.id;
              return (
                <Card
                  key={plan.id}
                  className={`relative ${isCurrent ? "border-primary" : ""}`}
                >
                  {isCurrent && (
                    <Badge className="absolute -top-2 left-4">বর্তমান</Badge>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <span className="text-3xl font-bold">৳{plan.base_price}</span>
                      <span className="text-muted-foreground">/মাস</span>
                    </div>

                    <ul className="space-y-2 text-sm">
                      {plan.features?.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                      <li className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {plan.max_customers ? `${plan.max_customers} গ্রাহক` : "আনলিমিটেড গ্রাহক"}
                      </li>
                    </ul>

                    <Button
                      className="w-full"
                      variant={isCurrent ? "outline" : "default"}
                      disabled={isCurrent || assignPlan.isPending}
                      onClick={() => handlePlanSelect(plan)}
                    >
                      {isCurrent ? "বর্তমান প্ল্যান" : "এই প্ল্যানে যান"}
                      {!isCurrent && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Available Addons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Puzzle className="h-5 w-5" />
            অ্যাড-অন মডিউল
          </CardTitle>
          <CardDescription>প্রয়োজনীয় ফিচার যোগ করুন</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allAddons?.filter((a) => a.is_active).map((addon) => {
              const isActive = activeAddonIds.includes(addon.id);
              return (
                <div
                  key={addon.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${isActive ? "bg-primary/10" : "bg-muted"}`}>
                      <Puzzle className={`h-6 w-6 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{addon.name}</p>
                        {addon.pricing_type === "tiered" && (
                          <Badge variant="outline" className="text-xs">টায়ার ভিত্তিক</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{addon.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">৳{addon.base_price}</p>
                      <p className="text-xs text-muted-foreground">/মাস থেকে</p>
                    </div>
                    <Switch
                      checked={isActive}
                      onCheckedChange={() => handleToggleAddon(addon.id, isActive)}
                      disabled={toggleAddon.isPending}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Confirmation Dialog */}
      <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>প্ল্যান পরিবর্তন নিশ্চিত করুন</DialogTitle>
            <DialogDescription>
              আপনি কি {selectedPlan?.name} প্ল্যানে যেতে চান?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <p className="text-sm">
                প্ল্যান পরিবর্তন পরবর্তী বিলিং সাইকেল থেকে কার্যকর হবে
              </p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="text-sm text-muted-foreground">নতুন মাসিক খরচ</p>
                <p className="text-2xl font-bold">৳{selectedPlan?.base_price}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">সর্বোচ্চ গ্রাহক</p>
                <p className="text-lg font-medium">
                  {selectedPlan?.max_customers ?? "আনলিমিটেড"}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeDialogOpen(false)}>
              বাতিল
            </Button>
            <Button onClick={handleConfirmUpgrade} disabled={assignPlan.isPending}>
              {assignPlan.isPending ? "প্রসেসিং..." : "নিশ্চিত করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
