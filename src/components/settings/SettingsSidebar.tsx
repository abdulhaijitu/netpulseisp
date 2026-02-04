import { cn } from "@/lib/utils";
import {
  Building2,
  CreditCard,
  Bell,
  Palette,
  Mail,
  Key,
  Network,
  Package,
  type LucideIcon,
} from "lucide-react";

interface SettingsSection {
  id: string;
  label: string;
  icon: LucideIcon;
  description?: string;
}

interface SettingsSidebarProps {
  sections: SettingsSection[];
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const settingsSections = {
  general: { id: "general", label: "General", icon: Building2, description: "Business info & regional settings" },
  subscription: { id: "subscription", label: "Subscription", icon: Package, description: "Plan & usage" },
  billing: { id: "billing", label: "Billing", icon: CreditCard, description: "Payment & automation" },
  notifications: { id: "notifications", label: "Notifications", icon: Bell, description: "Alerts & reminders" },
  branding: { id: "branding", label: "Branding", icon: Palette, description: "Logo & colors" },
  email: { id: "email", label: "Email", icon: Mail, description: "Email configuration" },
  network: { id: "network", label: "Network", icon: Network, description: "Router integration" },
  api: { id: "api", label: "API Access", icon: Key, description: "API keys & access" },
};

export function SettingsSidebar({ sections, activeSection, onSectionChange }: SettingsSidebarProps) {
  return (
    <nav className="space-y-1">
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;

        return (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={cn(
              "w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
              "hover:bg-muted/50 active:scale-[0.98]",
              isActive && "bg-primary/10 text-primary"
            )}
          >
            <div className={cn(
              "mt-0.5 p-1.5 rounded-md transition-colors",
              isActive ? "bg-primary/10" : "bg-muted"
            )}>
              <Icon className={cn(
                "h-4 w-4",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                "font-medium text-sm",
                isActive ? "text-primary" : "text-foreground"
              )}>
                {section.label}
              </p>
              {section.description && (
                <p className="text-xs text-muted-foreground truncate">
                  {section.description}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </nav>
  );
}
