

# প্যাকেজ ↔ মাইক্রোটিক সিঙ্ক প্ল্যান

## বর্তমান অবস্থা

- **Packages টেবিল**: `name`, `speed_label`, `monthly_price` আছে — কিন্তু MikroTik-specific ফিল্ড নেই (rate-limit, queue type ইত্যাদি)
- **Network Sync Edge Function**: কাস্টমার-লেভেল `update_speed` action আছে, কিন্তু প্যাকেজ-লেভেল sync নেই
- **PackageFormDialog**: শুধু basic ফিল্ড — MikroTik profile mapping নেই

## কী করতে হবে

### ১. Packages টেবিলে MikroTik ফিল্ড যোগ

```text
packages টেবিলে নতুন কলাম:
├── mikrotik_profile_name    (text)  → PPP Profile নাম (e.g. "20M-Plan")
├── mikrotik_rate_limit      (text)  → Rate limit string (e.g. "20M/20M")
├── mikrotik_address_pool    (text)  → IP Pool নাম
└── mikrotik_queue_type      (text)  → Queue type (e.g. "pcq-upload-default")
```

### ২. Package Form-এ MikroTik ফিল্ড যোগ

`PackageFormDialog.tsx`-এ নতুন section:
- **MikroTik Profile Name** — রাউটারে PPP Profile-এর নাম
- **Rate Limit** — upload/download limit (e.g. `20M/20M`)
- **Address Pool** — IP pool assignment
- **Queue Type** — optional queue type

শুধু তখনই দেখাবে যখন tenant-এর active MikroTik integration আছে।

### ৩. Network Sync Function-এ নতুন Action: `sync_package`

Edge function-এ `sync_package` action যোগ করা হবে যেটা:
- প্যাকেজের MikroTik ফিল্ড থেকে PPP Profile তৈরি/আপডেট করবে
- ঐ প্যাকেজের সব active কাস্টমারদের profile update করবে

### ৪. Package Create/Edit-এর পর Auto-Sync অপশন

প্যাকেজ তৈরি বা এডিট করার পর:
- Toast-এ "Sync to MikroTik" বাটন দেখাবে
- অথবা Package card-এ একটি "Sync" আইকন বাটন থাকবে
- ক্লিক করলে `network-sync` function call করবে `sync_package` action দিয়ে

### ৫. Bulk Customer Sync

প্যাকেজ speed পরিবর্তন হলে, ঐ প্যাকেজের সব কাস্টমারকে একসাথে sync করার অপশন। Sync queue-তে batch job হিসেবে যাবে।

## ফাইল পরিবর্তন

| ফাইল | পরিবর্তন |
|------|----------|
| **DB Migration** | `packages` টেবিলে ৪টি নতুন কলাম |
| `PackageFormDialog.tsx` | MikroTik profile fields section যোগ |
| `usePackages.ts` | Form data type-এ নতুন ফিল্ড |
| `network-sync/index.ts` | `sync_package` action handler যোগ |
| `Packages.tsx` | Package card/row-তে Sync বাটন |

## সিঙ্ক ফ্লো

```text
Package Create/Edit
       │
       ▼
  Save to DB ──────────────────────┐
       │                           │
       ▼                           ▼
  Toast: "Sync to Router?"    Package Card
       │                     "Sync" button
       ▼                           │
  network-sync edge function ◄─────┘
       │
       ├── Create/Update PPP Profile on MikroTik
       │
       └── Queue bulk customer speed updates
              (for all customers on this package)
```

