

# Purchase & Vendors > Purchase Bill পেইজ

## রেফারেন্স বিশ্লেষণ
ছবিতে: "Purchase List" হেডার + "All Purchase List" সাবটাইটেল + breadcrumb। দুটি ট্যাব: "Purchase List" ও "Purchase Bills"। "+ Purchase" বাটন। ফিল্টার: Vendor (Select), From Date, To Date। Show entries + Search বার। টেবিল কলাম: SN, Bill No, Date, Vendor, Total Amount, Paid Amount, Discount, Due, Status (Pay/Due/Paid badge), Action (View/Edit/Delete)। Footer-এ Total row + Pagination।

## পরিবর্তন

### `src/pages/purchase/PurchaseBillPage.tsx` — নতুন
1. **হেডার**: ListOrdered আইকন + "Purchase List" টাইটেল + "All Purchase List" সাবটাইটেল + breadcrumb
2. **ট্যাব**: "Purchase List" (active) ও "Purchase Bills" — Tabs component ব্যবহার
3. **"+ Purchase" বাটন** — navigate to `/dashboard/purchase`
4. **ফিল্টার**: Vendor (Select), From Date, To Date
5. **Show entries + Search বার**
6. **টেবিল**: SN, Bill No (link style), Date, Vendor, Total Amount, Paid Amount, Discount, Due, Status (Badge — Due=red, Paid=green, Pay=teal button), Action (Eye/Edit/Trash)
7. **ডেমো ডাটা**: ৮+ purchase entries with mixed statuses
8. **Footer Total row** — Total Amount, Paid Amount, Discount, Due যোগফল
9. **Pagination ফুটার**

### `src/App.tsx` — রাউট আপডেট
`/dashboard/purchase/bill` → `PurchaseBillPage` (placeholder রিপ্লেস)

| ফাইল | কাজ |
|------|-----|
| `src/pages/purchase/PurchaseBillPage.tsx` | নতুন |
| `src/App.tsx` | রাউট আপডেট |

