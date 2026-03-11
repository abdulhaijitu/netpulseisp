

# Purchase & Vendors > Purchase Entry পেইজ

## রেফারেন্স বিশ্লেষণ
ছবিতে: "Purchase Entry" হেডার + breadcrumb (Purchase > Purchase Entry)। "Back to List" বাটন। ফর্মে ৩টি ফিল্ড: Purchase ID (Auto Generated, disabled), Purchase Date, Vendor (Select)। তারপর একটি editable টেবিল (Item, Description, Sequenceable toggle, Starts with, Serial/Mac, Store Room, Unit, Quantity, Rate, VAT%, Total, Action)। "+ Add New" বাটন দিয়ে নতুন row যোগ। Total সারি। REMARKS/NOTE টেক্সটএরিয়া। Save বাটন।

## পরিবর্তন

### `src/pages/purchase/PurchasePage.tsx` — নতুন
1. **হেডার**: ShoppingCart আইকন + "Purchase Entry" টাইটেল + "Purchase Entry" সাবটাইটেল + breadcrumb
2. **"Back to List" বাটন** — navigate back
3. **ফর্ম ফিল্ড**: Purchase ID (disabled, auto-generated), Purchase Date (date input), Vendor (Select from demo vendors)
4. **Editable টেবিল** — ডার্ক প্রাইমারি হেডার, কলাম: Item (Select), Description, Sequenceable (Switch), Starts with, Serial/Mac, Store Room (Select), Unit (Select), Quantity, Rate, VAT(%), Total (computed), Action (Delete)
5. **"+ Add New" বাটন** — নতুন empty row যোগ
6. **Total row** — সব row-এর Total যোগফল
7. **REMARKS/NOTE** — Textarea
8. **Save বাটন**
9. **State management**: useState দিয়ে dynamic rows, auto-compute total = qty × rate × (1 + vat/100)

### `src/App.tsx` — রাউট আপডেট
`/dashboard/purchase` → `PurchasePage` (placeholder রিপ্লেস)

| ফাইল | কাজ |
|------|-----|
| `src/pages/purchase/PurchasePage.tsx` | নতুন |
| `src/App.tsx` | রাউট আপডেট |

