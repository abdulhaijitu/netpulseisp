import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateReseller } from "@/hooks/useResellers";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResellerFormDialog({ open, onOpenChange }: Props) {
  const createReseller = useCreateReseller();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    user_email: "",
    user_password: "",
    commission_type: "percentage",
    commission_value: 5,
    notes: "",
  });

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.user_email || !form.user_password) return;
    createReseller.mutate(
      {
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        address: form.address || undefined,
        user_email: form.user_email,
        user_password: form.user_password,
        commission_type: form.commission_type,
        commission_value: form.commission_value,
        notes: form.notes || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setForm({
            name: "", phone: "", email: "", address: "",
            user_email: "", user_password: "",
            commission_type: "percentage", commission_value: 5, notes: "",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>নতুন রিসেলার যোগ করুন</DialogTitle>
          <DialogDescription>রিসেলারের তথ্য ও লগইন ক্রেডেনশিয়াল দিন</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>নাম *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="রিসেলারের নাম" />
          </div>
          <div className="space-y-2">
            <Label>ফোন *</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="01XXXXXXXXX" />
          </div>
          <div className="space-y-2">
            <Label>ইমেইল (ঐচ্ছিক)</Label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="reseller@example.com" />
          </div>
          <div className="space-y-2">
            <Label>ঠিকানা (ঐচ্ছিক)</Label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="এলাকা, শহর" />
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            <p className="text-sm font-semibold text-foreground">লগইন তথ্য</p>
            <div className="space-y-2">
              <Label>লগইন ইমেইল *</Label>
              <Input value={form.user_email} onChange={(e) => setForm({ ...form, user_email: e.target.value })} placeholder="login@example.com" type="email" />
            </div>
            <div className="space-y-2">
              <Label>পাসওয়ার্ড *</Label>
              <Input value={form.user_password} onChange={(e) => setForm({ ...form, user_password: e.target.value })} placeholder="ন্যূনতম ৬ অক্ষর" type="password" />
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            <p className="text-sm font-semibold text-foreground">কমিশন সেটিংস</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>কমিশন ধরন</Label>
                <Select value={form.commission_type} onValueChange={(v) => setForm({ ...form, commission_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">শতাংশ (%)</SelectItem>
                    <SelectItem value="flat">ফ্ল্যাট (৳)</SelectItem>
                    <SelectItem value="per_payment">প্রতি পেমেন্ট (৳)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>কমিশন মান</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.commission_value}
                  onChange={(e) => setForm({ ...form, commission_value: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>নোট (ঐচ্ছিক)</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="অতিরিক্ত তথ্য..." rows={2} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>বাতিল</Button>
          <Button onClick={handleSubmit} disabled={createReseller.isPending}>
            {createReseller.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            রিসেলার তৈরি করুন
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
