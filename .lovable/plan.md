

# সাইডবার সেকশন রিস্ট্রাকচার

বর্তমানে সাইডবারে `SidebarGroupLabel` দিয়ে কয়েকটি বড় সেকশন আছে (Client Management, Billing & Finance, Network, Operations, Reseller, System)। ইউজার চাচ্ছেন এই সেকশনগুলো নতুনভাবে সাজাতে:

**নতুন সেকশন স্ট্রাকচার:**
1. **Home User** — Configuration, Clients, Packages (বর্তমান Client Management সেকশন)
2. **Corporate Client** — নতুন সেকশন (Corporate ক্লায়েন্ট ম্যানেজমেন্ট)
3. **MAC Client** — MAC Reseller গ্রুপ এখানে আসবে
4. **Bandwidth Client** — নতুন সেকশন (Bandwidth ক্লায়েন্ট)
5. **HR** — HR & Payroll গ্রুপ
6. **Support** — Support & Ticketing + Task Management
7. **Accounts** — Billing, Payments, Reports, Income & Expense, Accounting
8. **Purchase** — Purchase & Vendors, Inventory & Assets
9. **System** — SMS, Notifications, System settings

## পরিবর্তন

### `src/components/layout/DashboardSidebar.tsx`

রেন্ডার সেকশনে (লাইন 500-548) `SidebarGroupLabel` গুলো নতুন নাম দিয়ে রিগ্রুপ করা হবে:

```
Dashboard (standalone)

── Home User ──
  Configuration (group)
  Clients (group)
  Packages (standalone)

── Corporate Client ──
  (placeholder - coming soon)

── MAC Client ──
  MAC Reseller (group)

── Bandwidth Client ──
  (placeholder - coming soon)

── HR ──
  HR & Payroll (group)

── Support ──
  Support & Ticketing (group)
  Task Management (group)

── Accounts ──
  Billing (group)
  Payments (standalone)
  Reports (standalone)
  Income & Expense (group)
  Accounting (group)

── Purchase ──
  Purchase & Vendors (group)
  Inventory & Assets (group)

── System ──
  Network (MikroTik, OLT, Diagram)
  SMS Service (group)
  Notifications (standalone)
  System (group)
```

- Corporate Client ও Bandwidth Client সেকশনে "Coming Soon" placeholder দেখাবে
- বাকি সব existing গ্রুপ ও আইটেম শুধু নতুন সেকশনে সাজানো হবে
- সার্চ ফাংশনালিটি অপরিবর্তিত থাকবে

