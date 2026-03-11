

# Daily Account Closing পেইজ — রেফারেন্স ইমেজ অনুযায়ী

## রেফারেন্স বিশ্লেষণ
ছবিতে **Daily Account Closing** পেইজ: "Close Daily Account" সাবটাইটেল, breadcrumb (Daily Account > Daily Account Closing), From Date / To Date ফিল্টার + Search বাটন, তিনটি কলাম হেডার (Bill, Service Income, Expense) প্রতিটিতে Sum দেখানো, এবং নিচে একটি ডার্ক ব্যানার "Cash on Hand" = Bill - Income - Expense।

## পরিবর্তন

### `src/pages/finance/DailyAccountClosingPage.tsx` — নতুন পেইজ

1. **হেডার**: "Daily Account Closing" + "Close Daily Account" সাবটাইটেল + breadcrumb
2. **ফিল্টার**: From Date, To Date picker + Search বাটন
3. **সামারি সেকশন**: তিনটি কলাম — **Bill** (Sum), **Service Income** (Sum), **Expense** (Sum)
4. **Cash on Hand ব্যানার**: ডার্ক ব্যাকগ্রাউন্ড ব্যানার — "Cash on Hand" | calculated value (Bill + Income - Expense)
5. **ডাটা**: `useBills`, `usePayments` hooks থেকে date-filtered সামারি, demo fallback

### `src/App.tsx` — রাউট আপডেট
`/dashboard/finance/closing` → `DailyAccountClosingPage`

| ফাইল | কাজ |
|------|-----|
| `src/pages/finance/DailyAccountClosingPage.tsx` | নতুন |
| `src/App.tsx` | রাউট আপডেট |

