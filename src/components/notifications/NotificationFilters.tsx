import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  type: string;
  status: string;
  search: string;
  onTypeChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onSearchChange: (v: string) => void;
}

export function NotificationFilters({
  type,
  status,
  search,
  onTypeChange,
  onStatusChange,
  onSearchChange,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="নোটিফিকেশন খুঁজুন..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={type} onValueChange={onTypeChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="ধরন ফিল্টার" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">সব ধরন</SelectItem>
          <SelectItem value="billing_reminder">বিলিং রিমাইন্ডার</SelectItem>
          <SelectItem value="payment_confirmation">পেমেন্ট নিশ্চিতকরণ</SelectItem>
          <SelectItem value="connection_status">কানেকশন স্ট্যাটাস</SelectItem>
          <SelectItem value="general">সাধারণ</SelectItem>
        </SelectContent>
      </Select>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="স্ট্যাটাস ফিল্টার" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
          <SelectItem value="sent">পাঠানো হয়েছে</SelectItem>
          <SelectItem value="failed">ব্যর্থ</SelectItem>
          <SelectItem value="pending">অপেক্ষমাণ</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
