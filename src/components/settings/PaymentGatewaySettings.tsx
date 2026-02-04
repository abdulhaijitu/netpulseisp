import { useState, useEffect } from "react";
import { CreditCard, Eye, EyeOff, ExternalLink, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCurrentTenant } from "@/hooks/useTenant";
import { useUpdateTenantSettings } from "@/hooks/useTenantSettings";

export function PaymentGatewaySettings() {
  const { data: tenant, isLoading } = useCurrentTenant();
  const updateSettings = useUpdateTenantSettings(tenant?.id);

  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("https://sandbox.uddoktapay.com");
  const [enableOnlinePayment, setEnableOnlinePayment] = useState(false);
  const [autoSuspendDays, setAutoSuspendDays] = useState("15");
  const [hasChanges, setHasChanges] = useState(false);

  // Load initial values from tenant
  useEffect(() => {
    if (tenant) {
      setApiKey((tenant as any).uddoktapay_api_key || "");
      setBaseUrl((tenant as any).uddoktapay_base_url || "https://sandbox.uddoktapay.com");
      setEnableOnlinePayment(tenant.enable_online_payment || false);
      setAutoSuspendDays(String(tenant.auto_suspend_days || 15));
    }
  }, [tenant]);

  const handleSave = async () => {
    await updateSettings.mutateAsync({
      uddoktapay_api_key: apiKey || null,
      uddoktapay_base_url: baseUrl,
      enable_online_payment: enableOnlinePayment,
      auto_suspend_days: parseInt(autoSuspendDays),
    });
    setHasChanges(false);
  };

  const handleChange = () => {
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center justify-center text-muted-foreground">
              লোড হচ্ছে...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isConfigured = apiKey && apiKey.length > 0;
  const isSandbox = baseUrl.includes("sandbox");

  return (
    <div className="space-y-6">
      {/* UddoktaPay Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                UddoktaPay পেমেন্ট গেটওয়ে
              </CardTitle>
              <CardDescription>
                অনলাইন পেমেন্ট গ্রহণের জন্য UddoktaPay কনফিগার করুন
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {isConfigured ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  কনফিগার করা হয়েছে
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  কনফিগার করা হয়নি
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Environment Selection */}
          <div className="space-y-2">
            <Label>এনভায়রনমেন্ট</Label>
            <Select
              value={baseUrl}
              onValueChange={(value) => {
                setBaseUrl(value);
                handleChange();
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="https://sandbox.uddoktapay.com">
                  🧪 Sandbox (টেস্ট মোড)
                </SelectItem>
                <SelectItem value="https://uddoktapay.com">
                  🚀 Production (লাইভ)
                </SelectItem>
              </SelectContent>
            </Select>
            {isSandbox && (
              <p className="text-xs text-muted-foreground">
                Sandbox মোডে টেস্ট করুন, প্রকৃত টাকা কাটা হবে না
              </p>
            )}
          </div>

          {/* API Key */}
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  handleChange();
                }}
                placeholder="আপনার UddoktaPay API Key দিন"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              API Key পেতে{" "}
              <a
                href="https://uddoktapay.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                UddoktaPay ড্যাশবোর্ড <ExternalLink className="h-3 w-3" />
              </a>{" "}
              থেকে সংগ্রহ করুন
            </p>
          </div>

          <Separator />

          {/* Enable Online Payment */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>অনলাইন পেমেন্ট চালু করুন</Label>
              <p className="text-sm text-muted-foreground">
                গ্রাহকরা পোর্টাল থেকে অনলাইনে বিল পরিশোধ করতে পারবেন
              </p>
            </div>
            <Switch
              checked={enableOnlinePayment}
              onCheckedChange={(checked) => {
                setEnableOnlinePayment(checked);
                handleChange();
              }}
              disabled={!isConfigured}
            />
          </div>

          {enableOnlinePayment && !isConfigured && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                অনলাইন পেমেন্ট চালু করতে প্রথমে API Key কনফিগার করুন
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Billing Automation */}
      <Card>
        <CardHeader>
          <CardTitle>বিলিং অটোমেশন</CardTitle>
          <CardDescription>
            স্বয়ংক্রিয় বিলিং সেটিংস কনফিগার করুন
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>মাসিক বিল অটো-জেনারেট</Label>
              <p className="text-sm text-muted-foreground">
                প্রতি মাসের ১ তারিখে স্বয়ংক্রিয়ভাবে বিল তৈরি করুন
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>প্রোরেটেড বিলিং</Label>
              <p className="text-sm text-muted-foreground">
                মাসের মাঝখানে যোগদানের জন্য আনুপাতিক চার্জ গণনা করুন
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>অটো-সাসপেন্ড করুন (দিন পরে)</Label>
            <Select
              value={autoSuspendDays}
              onValueChange={(value) => {
                setAutoSuspendDays(value);
                handleChange();
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">৭ দিন</SelectItem>
                <SelectItem value="15">১৫ দিন</SelectItem>
                <SelectItem value="30">৩০ দিন</SelectItem>
                <SelectItem value="0">কখনোই না (ম্যানুয়াল)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              এত দিন বকেয়া থাকলে সংযোগ স্বয়ংক্রিয়ভাবে সাসপেন্ড করা হবে
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Options */}
      <Card>
        <CardHeader>
          <CardTitle>পেমেন্ট অপশন</CardTitle>
          <CardDescription>
            গ্রাহকদের জন্য পেমেন্ট অপশন কনফিগার করুন
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>আংশিক পেমেন্ট</Label>
              <p className="text-sm text-muted-foreground">
                গ্রাহকদের আংশিক পেমেন্ট করার অনুমতি দিন
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>অগ্রিম পেমেন্ট</Label>
              <p className="text-sm text-muted-foreground">
                গ্রাহকদের অগ্রিম পেমেন্ট করার অনুমতি দিন
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      {hasChanges && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={updateSettings.isPending}>
            {updateSettings.isPending ? "সেভ হচ্ছে..." : "পরিবর্তন সেভ করুন"}
          </Button>
        </div>
      )}
    </div>
  );
}
