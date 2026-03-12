

# Configuration গ্রুপ Clients এর উপরে সরানো

## পরিবর্তন

### `src/components/layout/DashboardSidebar.tsx`
`navGroups` অ্যারেতে Configuration ও Clients এর অর্ডার swap করা হবে:

```typescript
const navGroups: NavGroup[] = [
  {
    label: "Configuration",  // আগে যাবে
    ...
  },
  {
    label: "Clients",  // পরে যাবে
    ...
  },
];
```

শুধু অ্যারের ভেতরে দুটি অবজেক্টের পজিশন বদলানো — বাকি সব অপরিবর্তিত।

