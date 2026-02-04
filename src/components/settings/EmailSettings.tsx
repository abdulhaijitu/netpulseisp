import { useState, useEffect } from "react";
import { Mail, Eye, EyeOff, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUpdateTenantSettings } from "@/hooks/useTenantSettings";
import { useCurrentTenant } from "@/hooks/useTenant";
import { toast } from "sonner";

export function EmailSettings() {
  const { data: currentTenant, isLoading: tenantLoading } = useCurrentTenant();
  const updateSettings = useUpdateTenantSettings(currentTenant?.id);
  
  const [apiKey, setApiKey] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing values when tenant loads
  useEffect(() => {
    if (currentTenant) {
      // Only show masked version if key exists
      setApiKey(currentTenant.resend_api_key ? "••••••••••••••••" : "");
      setSenderEmail(currentTenant.sender_email || "");
    }
  }, [currentTenant]);

  const handleSave = async () => {
    if (!currentTenant) return;
    
    // Validate sender email format
    if (senderEmail && !senderEmail.includes("@")) {
      toast.error("সঠিক ইমেইল এড্রেস দিন");
      return;
    }

    setIsSaving(true);
    try {
      const updates: { resend_api_key?: string; sender_email?: string } = {};
      
      // Only update API key if it's not the masked placeholder
      if (apiKey && !apiKey.includes("•")) {
        updates.resend_api_key = apiKey;
      }
      
      updates.sender_email = senderEmail || null;

      await updateSettings.mutateAsync(updates);
      
      // Reset API key field to masked version after save
      if (apiKey && !apiKey.includes("•")) {
        setApiKey("••••••••••••••••");
      }
      setShowApiKey(false);
    } catch (error) {
      console.error("Error saving email settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasApiKey = currentTenant?.resend_api_key || (apiKey && !apiKey.includes("•"));

  if (tenantLoading) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          লোড হচ্ছে...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Resend Email Configuration
          </CardTitle>
          <CardDescription>
            ইনভয়েস এবং বিলিং নোটিফিকেশন ইমেইল পাঠাতে Resend API সেটআপ করুন
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Setup Instructions */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <p className="font-medium">Resend সেটআপ করতে:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>
                  <a 
                    href="https://resend.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    resend.com <ExternalLink className="h-3 w-3" />
                  </a> 
                  {" "}এ অ্যাকাউন্ট তৈরি করুন
                </li>
                <li>
                  <a 
                    href="https://resend.com/domains" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Domain verify <ExternalLink className="h-3 w-3" />
                  </a>
                  {" "}করুন
                </li>
                <li>
                  <a 
                    href="https://resend.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    API Key তৈরি করুন <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ol>
            </AlertDescription>
          </Alert>

          {/* API Key Input */}
          <div className="space-y-2">
            <Label htmlFor="resendApiKey">Resend API Key</Label>
            <div className="relative">
              <Input
                id="resendApiKey"
                type={showApiKey ? "text" : "password"}
                placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Resend ড্যাশবোর্ড থেকে API key কপি করুন
            </p>
          </div>

          {/* Sender Email Input */}
          <div className="space-y-2">
            <Label htmlFor="senderEmail">Sender Email Address</Label>
            <Input
              id="senderEmail"
              type="email"
              placeholder="billing@yourdomain.com"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Resend এ verified domain এর ইমেইল এড্রেস দিন
            </p>
          </div>

          {/* Status Indicator */}
          {hasApiKey && (
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-success">API Key কনফিগার করা আছে</span>
            </div>
          )}

          {/* Save Button */}
          <Button 
            onClick={handleSave} 
            disabled={isSaving || (!apiKey && !senderEmail)}
            className="w-full sm:w-auto"
          >
            {isSaving ? "সেভ হচ্ছে..." : "সেটিংস সেভ করুন"}
          </Button>
        </CardContent>
      </Card>

      {/* Usage Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Email Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Invoice PDF সহ ইমেইল পাঠান
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Payment reminder ইমেইল
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Due date notification
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
