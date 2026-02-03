import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import type { Package } from "@/hooks/usePackages";

interface PackageFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  package?: Package | null;
  onSubmit: (data: {
    name: string;
    speed_label: string;
    monthly_price: number;
    validity_days: number;
    is_active: boolean;
  }) => void;
  isLoading?: boolean;
}

export function PackageFormDialog({
  open,
  onOpenChange,
  package: pkg,
  onSubmit,
  isLoading,
}: PackageFormDialogProps) {
  const [name, setName] = useState("");
  const [speedLabel, setSpeedLabel] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [validityDays, setValidityDays] = useState("30");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (pkg) {
      setName(pkg.name);
      setSpeedLabel(pkg.speed_label);
      setMonthlyPrice(pkg.monthly_price.toString());
      setValidityDays((pkg.validity_days ?? 30).toString());
      setIsActive(pkg.is_active ?? true);
    } else {
      setName("");
      setSpeedLabel("");
      setMonthlyPrice("");
      setValidityDays("30");
      setIsActive(true);
    }
  }, [pkg, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      speed_label: speedLabel,
      monthly_price: parseFloat(monthlyPrice),
      validity_days: parseInt(validityDays),
      is_active: isActive,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {pkg ? "প্যাকেজ সম্পাদনা" : "নতুন প্যাকেজ তৈরি"}
            </DialogTitle>
            <DialogDescription>
              {pkg
                ? "প্যাকেজের তথ্য আপডেট করুন"
                : "নতুন ইন্টারনেট প্যাকেজ যোগ করুন"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">প্যাকেজের নাম</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: Basic, Pro, Premium"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="speed">স্পিড</Label>
              <Input
                id="speed"
                value={speedLabel}
                onChange={(e) => setSpeedLabel(e.target.value)}
                placeholder="যেমন: 20 Mbps"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">মাসিক মূল্য (৳)</Label>
                <Input
                  id="price"
                  type="number"
                  value={monthlyPrice}
                  onChange={(e) => setMonthlyPrice(e.target.value)}
                  placeholder="800"
                  min="0"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="validity">মেয়াদ (দিন)</Label>
                <Input
                  id="validity"
                  type="number"
                  value={validityDays}
                  onChange={(e) => setValidityDays(e.target.value)}
                  placeholder="30"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="active">সক্রিয় প্যাকেজ</Label>
              <Switch
                id="active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              বাতিল
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {pkg ? "আপডেট করুন" : "তৈরি করুন"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
