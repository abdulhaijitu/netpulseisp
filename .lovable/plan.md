

# Billing গ্রুপ Home User সেকশনে সরানো

## পরিবর্তন

### `src/components/layout/DashboardSidebar.tsx`

**Home User** সেকশনে `financeGroups` (Billing) যুক্ত করা হবে এবং **Accounts** সেকশন থেকে সরানো হবে।

**আগে:**
```
Home User → Configuration, Clients, Packages
Accounts  → Billing, Payments, Reports, Income & Expense, Accounting
```

**পরে:**
```
Home User → Configuration, Clients, Packages, Billing
Accounts  → Payments, Reports, Income & Expense, Accounting
```

- লাইন ~511-513: Packages এর পরে `{financeGroups.map(renderGroup)}` যুক্ত
- লাইন ~542: Accounts থেকে `{financeGroups.map(renderGroup)}` সরিয়ে দেওয়া

