import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Wifi, 
  Calendar,
  LogOut,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Share2,
  Bell,
  BellOff
} from "lucide-react";
import { usePortalCustomer } from "@/hooks/usePortalData";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { usePushNotifications } from "@/hooks/usePushNotifications";

const statusConfig = {
  active: { label: "Active", color: "bg-green-500", icon: CheckCircle },
  suspended: { label: "Suspended", color: "bg-red-500", icon: AlertCircle },
  pending: { label: "Pending", color: "bg-yellow-500", icon: Clock },
};

export default function MobileProfile() {
  const { data: customer, isLoading } = usePortalCustomer();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const {
    isSupported: notificationsSupported,
    permission,
    isSubscribed,
    subscribe,
    unsubscribe,
    isSubscribing,
    isUnsubscribing,
  } = usePushNotifications();

  const handleLogout = async () => {
    await signOut();
    navigate("/app/login");
  };

  const handleNotificationToggle = () => {
    if (isSubscribed) {
      unsubscribe();
    } else {
      subscribe();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="flex flex-col items-center">
          <Skeleton className="w-24 h-24 rounded-full" />
          <Skeleton className="h-6 w-32 mt-4" />
          <Skeleton className="h-4 w-24 mt-2" />
        </div>
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  const connectionStatus = customer.connection_status || "pending";
  const StatusIcon = statusConfig[connectionStatus].icon;

  return (
    <div className="space-y-5">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center pt-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-3xl font-bold">
          {customer.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-xl font-bold mt-4">{customer.name}</h1>
        <p className="text-sm text-muted-foreground font-mono">
          ID: {customer.id.slice(0, 8).toUpperCase()}
        </p>
        <Badge 
          variant={connectionStatus === "active" ? "default" : connectionStatus === "suspended" ? "destructive" : "secondary"} 
          className="mt-2 gap-1"
        >
          <StatusIcon className="w-3 h-3" />
          {statusConfig[connectionStatus].label}
        </Badge>
      </div>

      {/* Contact Info */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Contact Information
          </h3>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{customer.phone}</p>
            </div>
          </div>

          {customer.email && (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
            </div>
          )}

          {customer.address && (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{customer.address}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Package Info */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Package Details
          </h3>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Current Package</p>
              <p className="font-medium">{customer.packages?.name || "No Package"}</p>
              {customer.packages?.speed_label && (
                <p className="text-sm text-muted-foreground">{customer.packages.speed_label}</p>
              )}
            </div>
            {customer.packages && (
              <p className="text-lg font-bold text-primary">
                ৳{customer.packages.monthly_price?.toLocaleString()}/mo
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium">
                {new Date(customer.join_date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balance Info */}
      <div className="grid grid-cols-2 gap-4">
        {Number(customer.due_balance) > 0 && (
          <Card className="border-destructive/30">
            <CardContent className="p-4 text-center">
              <AlertCircle className="w-6 h-6 text-destructive mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Due</p>
              <p className="text-xl font-bold text-destructive">
                ৳{Number(customer.due_balance).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        )}
        {Number(customer.advance_balance) > 0 && (
          <Card className="border-green-500/30">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Advance</p>
              <p className="text-xl font-bold text-green-600">
                ৳{Number(customer.advance_balance).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Notification Settings */}
      {notificationsSupported && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {isSubscribed ? (
                    <Bell className="w-5 h-5 text-primary" />
                  ) : (
                    <BellOff className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    {isSubscribed 
                      ? "Billing & payment alerts enabled"
                      : "Get notified about bills & payments"
                    }
                  </p>
                </div>
              </div>
              <Switch 
                checked={isSubscribed}
                onCheckedChange={handleNotificationToggle}
                disabled={isSubscribing || isUnsubscribing || permission === "denied"}
              />
            </div>
            {permission === "denied" && (
              <p className="text-xs text-destructive mt-3 pl-14">
                Notifications blocked. Please enable in browser settings.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="space-y-3 pt-4">
        <button
          className="w-full flex items-center justify-between p-4 bg-card rounded-xl border active:bg-muted/50 touch-manipulation transition-colors"
        >
          <div className="flex items-center gap-4">
            <Download className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Download Statement</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        <button
          className="w-full flex items-center justify-between p-4 bg-card rounded-xl border active:bg-muted/50 touch-manipulation transition-colors"
        >
          <div className="flex items-center gap-4">
            <Share2 className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Share App</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        <Button 
          variant="outline" 
          className="w-full h-14 text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
