

# Journal Voucher পেইজ — রেফারেন্স ইমেজ অনুযায়ী

## রেফারেন্স বিশ্লেষণ
ছবিতে **Journal Voucher** পেইজ: breadcrumb (Accounting > Journal Voucher), "Journal Voucher List" সাবটাইটেল, তিনটি অ্যাকশন বাটন (Approve Selected Transaction, Delete Selected Transaction, Add Journal) + Generate PDF/CSV। ফিল্টার বার: Account dropdown, From Date, To Date, Status dropdown। SHOW entries + SEARCH। টেবিল কলাম: Journal Date, VoucherNumber, Account(Dr), Account(Cr), Amount, Description, CreatedBy, CreationDate, Approved By, ApprovedDate, Status, Action, Checkbox। ফুটারে Total row + Pagination।

## পরিবর্তন

### `src/pages/finance/JournalVoucherPage.tsx` — নতুন পেইজ

1. **হেডার**: "Journal Voucher" + "Journal Voucher List" সাবটাইটেল + breadcrumb
2. **অ্যাকশন বাটন**: Approve Selected Transaction (green), Delete Selected Transaction (red), Add Journal (primary), Generate PDF, Generate CSV
3. **ফিল্টার বার**: Account (Select dropdown), From Date, To Date, Status (Select dropdown)
4. **SHOW entries + SEARCH**
5. **টেবিল**: Journal Date, Voucher Number, Account(Dr), Account(Cr), Amount, Description, Created By, Creation Date, Approved By, Approved Date, Status, Action, Checkbox
6. **ফুটার**: Total row (Amount sum) + Pagination
7. **ডাটা**: Demo data fallback

### `src/App.tsx` — রাউট আপডেট
`/dashboard/accounting/journal` → `JournalVoucherPage` (placeholder রিপ্লেস)

| ফাইল | কাজ |
|------|-----|
| `src/pages/finance/JournalVoucherPage.tsx` | নতুন — Journal Voucher পেইজ |
| `src/App.tsx` | রাউট আপডেট |

