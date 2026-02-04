import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// VAPID public key - this should be configured in environment
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Check browser support
  useEffect(() => {
    const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
      checkSubscription();
    }
  }, []);

  // Check if already subscribed
  const checkSubscription = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  }, []);

  // Get customer data for subscription
  const { data: customerData } = useQuery({
    queryKey: ["customerForPush", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("customers")
        .select("id, tenant_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Request permission and subscribe
  const subscribeMutation = useMutation({
    mutationFn: async () => {
      if (!isSupported) throw new Error("Push notifications not supported");
      if (!customerData) throw new Error("Customer data not found");

      // Request permission
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      if (permissionResult !== "granted") {
        throw new Error("Notification permission denied");
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Check if VAPID key is configured
      if (!VAPID_PUBLIC_KEY) {
        // Use local notifications only (without push server)
        console.log("VAPID key not configured, using local notifications only");
        
        // Save a placeholder subscription
        const { error } = await supabase.from("push_subscriptions").upsert(
          {
            customer_id: customerData.id,
            tenant_id: customerData.tenant_id,
            endpoint: `local://${customerData.id}`,
            p256dh_key: "local",
            auth_key: "local",
            user_agent: navigator.userAgent,
            is_active: true,
          },
          {
            onConflict: "customer_id,endpoint",
          }
        );

        if (error) throw error;
        setIsSubscribed(true);
        return null;
      }

      // Subscribe to push with VAPID key
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey.buffer as ArrayBuffer,
      });

      const subscriptionJson = subscription.toJSON();

      // Save to database
      const { error } = await supabase.from("push_subscriptions").upsert(
        {
          customer_id: customerData.id,
          tenant_id: customerData.tenant_id,
          endpoint: subscription.endpoint,
          p256dh_key: subscriptionJson.keys?.p256dh || "",
          auth_key: subscriptionJson.keys?.auth || "",
          user_agent: navigator.userAgent,
          is_active: true,
        },
        {
          onConflict: "customer_id,endpoint",
        }
      );

      if (error) throw error;

      setIsSubscribed(true);
      return subscription;
    },
    onSuccess: () => {
      toast.success("নোটিফিকেশন চালু হয়েছে");
      queryClient.invalidateQueries({ queryKey: ["pushSubscription"] });
    },
    onError: (error: Error) => {
      console.error("Subscription error:", error);
      if (error.message.includes("permission")) {
        toast.error("নোটিফিকেশন পারমিশন দেওয়া হয়নি");
      } else {
        toast.error("নোটিফিকেশন চালু করা যায়নি");
      }
    },
  });

  // Unsubscribe
  const unsubscribeMutation = useMutation({
    mutationFn: async () => {
      if (!customerData) return;

      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          await subscription.unsubscribe();

          // Deactivate in database
          await supabase
            .from("push_subscriptions")
            .update({ is_active: false })
            .eq("customer_id", customerData.id)
            .eq("endpoint", subscription.endpoint);
        }
      } catch (error) {
        console.log("No active push subscription to unsubscribe");
      }

      // Also deactivate local subscriptions
      await supabase
        .from("push_subscriptions")
        .update({ is_active: false })
        .eq("customer_id", customerData.id);

      setIsSubscribed(false);
    },
    onSuccess: () => {
      toast.success("নোটিফিকেশন বন্ধ হয়েছে");
      queryClient.invalidateQueries({ queryKey: ["pushSubscription"] });
    },
    onError: () => {
      toast.error("নোটিফিকেশন বন্ধ করা যায়নি");
    },
  });

  // Get notification history
  const { data: notifications, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ["notificationHistory", customerData?.id],
    queryFn: async () => {
      if (!customerData?.id) return [];

      const { data, error } = await supabase
        .from("notification_logs")
        .select("*")
        .eq("customer_id", customerData.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    enabled: !!customerData?.id,
  });

  return {
    isSupported,
    permission,
    isSubscribed,
    subscribe: subscribeMutation.mutate,
    unsubscribe: unsubscribeMutation.mutate,
    isSubscribing: subscribeMutation.isPending,
    isUnsubscribing: unsubscribeMutation.isPending,
    notifications,
    isLoadingNotifications,
  };
}

// Hook for sending notifications (used by ISP staff/system)
export function useSendNotification() {
  return useMutation({
    mutationFn: async (payload: {
      customer_id?: string;
      tenant_id: string;
      notification_type: "billing_reminder" | "payment_confirmation" | "connection_status" | "general";
      title: string;
      body: string;
      data?: Record<string, unknown>;
    }) => {
      const { data, error } = await supabase.functions.invoke("send-notification", {
        body: payload,
      });

      if (error) throw error;
      return data;
    },
  });
}
