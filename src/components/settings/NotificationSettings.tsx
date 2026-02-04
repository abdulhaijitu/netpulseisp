import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { SettingsSection, SettingsRow } from "./SettingsSection";

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection
        title="SMS Notifications"
        description="Configure SMS alerts for your customers"
      >
        <div className="divide-y divide-border">
          <SettingsRow
            label="Bill Generated"
            description="Send SMS when a new bill is generated"
          >
            <Switch defaultChecked />
          </SettingsRow>
          <SettingsRow
            label="Payment Received"
            description="Send SMS confirmation on payment"
          >
            <Switch defaultChecked />
          </SettingsRow>
          <SettingsRow
            label="Due Reminder"
            description="Send SMS reminder before due date"
          >
            <Switch defaultChecked />
          </SettingsRow>
          <SettingsRow
            label="Suspension Warning"
            description="Send SMS warning before auto-suspension"
          >
            <Switch defaultChecked />
          </SettingsRow>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Push Notifications"
        description="Configure push notifications for the mobile app"
      >
        <div className="divide-y divide-border">
          <SettingsRow
            label="New Bill Alert"
            description="Notify when new bill is available"
          >
            <Switch defaultChecked />
          </SettingsRow>
          <SettingsRow
            label="Payment Confirmation"
            description="Notify when payment is received"
          >
            <Switch defaultChecked />
          </SettingsRow>
          <SettingsRow
            label="Connection Status"
            description="Notify on connection status changes"
          >
            <Switch defaultChecked />
          </SettingsRow>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Email Notifications"
        description="Configure email alerts for staff members"
      >
        <div className="divide-y divide-border">
          <SettingsRow
            label="Daily Summary"
            description="Receive daily summary of bills and payments"
          >
            <Switch defaultChecked />
          </SettingsRow>
          <SettingsRow
            label="New Customer"
            description="Notify when new customer is added"
          >
            <Switch />
          </SettingsRow>
          <SettingsRow
            label="Large Payment"
            description="Notify on payments above threshold"
          >
            <Switch />
          </SettingsRow>
        </div>
      </SettingsSection>
    </div>
  );
}
