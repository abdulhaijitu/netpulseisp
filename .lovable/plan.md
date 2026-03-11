

# Daily Income পেইজ — রেফারেন্স ইমেজ অনুযায়ী

## রেফারেন্স বিশ্লেষণ
ছবিতে Daily Income পেইজ: "All Daily Incomes" সাবটাইটেল, breadcrumb (Income > Daily Income), "+ Income" বাটন (নীল), ফিল্টার বার (Category dropdown, From Date, To Date), SHOW entries + SEARCH, টেবিল (Date, Category, Served By, Service Charge, Description, Action), TOTAL row নিচে, Pagination।

## পরিবর্তন

### `src/pages/finance/DailyIncomePage.tsx` — নতুন পেইজ

DailyCollectionPage-এর প্যাটার্ন অনুসরণ করে:

1. **হেডার**: "Daily Income" + "All Daily Incomes" সাবটাইটেল + breadcrumb + "+ Income" বাটন
2. **ফিল্টার বার**: Category dropdown, From Date picker, To Date picker
3. **SHOW entries + SEARCH বার**
4. **টেবিল কলাম**: Date, Category, Served By, Service Charge, Description, Action (Edit/Delete)
5. **TOTAL row**: Service Charge টোটাল
6. **Pagination**: "Showing X to Y of Z entries (filtered from N total)" + Previous/Next

ডাটা সোর্স: `usePayments` hook থেকে, income category হিসেবে ম্যাপ করা হবে। Demo data fallback।

### `src/App.tsx` — রাউট আপডেট
`/dashboard/finance/income` → `DailyIncomePage`

| ফাইল | কাজ |
|------|-----|
| `src/pages/finance/DailyIncomePage.tsx` | নতুন — Daily Income পেইজ |
| `src/App.tsx` | রাউট আপডেট |

