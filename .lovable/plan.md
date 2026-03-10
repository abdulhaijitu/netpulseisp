

## Topbar অডিট — পাওয়া সমস্যাসমূহ

### ১. React Ref Warning (Console Error)
`NotificationItem` একটি সাধারণ function component, কিন্তু `DropdownMenuItem` এটিকে ref pass করার চেষ্টা করছে। এতে console-এ warning আসছে:
> "Function components cannot be given refs"

**Fix:** `NotificationItem` কে `React.forwardRef` দিয়ে wrap করতে হবে।

### ২. Hardcoded Notification Data
- Notification count সবসময় `3` return করছে (line 44-45) — আসল ডাটা fetch করে না।
- Notification items সম্পূর্ণ hardcoded (line 120-122)।

**Fix:** এখন hardcoded রাখা ঠিক আছে যদি notification system এখনো implement না হয়ে থাকে, তবে একটা comment রাখা উচিত।

### ৩. Search Bar Non-functional
- Search input শুধু UI — কোনো actual search logic নেই।
- ⌘K shortcut কোনো handler নেই।

**Fix:** Placeholder হিসেবে ঠিক আছে, তবে কোনো কাজ করে না এটা জানা দরকার।

### ৪. Logout Route Mismatch
- `handleLogout` navigate করে `/login`-এ, কিন্তু staff login page আছে `/login`-এ (StaffLogin)। এটা ঠিক আছে।

---

## প্রস্তাবিত ফিক্স

**`src/components/layout/DashboardHeader.tsx`** — ১টি ফিক্স:

1. **`NotificationItem`-কে `forwardRef` দিয়ে wrap করা** — এতে React ref warning দূর হবে। `DropdownMenuItem`-এর ভেতর ব্যবহৃত component-এ ref forward করা প্রয়োজন।

```tsx
const NotificationItem = forwardRef<HTMLDivElement, NotificationItemProps>(
  ({ title, description, time, unread, ...props }, ref) => {
    return (
      <DropdownMenuItem ref={ref} className={...} {...props}>
        ...
      </DropdownMenuItem>
    );
  }
);
```

এটাই একমাত্র actual bug। বাকিগুলো feature gap (search, real notifications) — যেগুলো পরে implement করা যাবে।

