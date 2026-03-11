

# System > Invoice Setup পেইজ

## রেফারেন্স বিশ্লেষণ
ছবি থেকে দুটি ট্যাব এবং তিনটি সেকশন:

**Tab 1: Invoice Settings**
1. **Company Information** (toggle সহ) — 2-column grid: Company Name, Email, Mobile Number, Website, Upload Logo, Address (textarea)
2. **Invoice Settings** — Invoice Title, Set Position of "Invoice" word (Left/Right/None radio), Number of Invoice Per Page (select), Invoice Page Margin Top (inches), Invoice Page Margin Bottom (inches)
3. **Note for Invoice** — Dynamic list of notes (NOTE 1, NOTE 2...) with Remove button and "Add Note" button

**Tab 2: Money Receipt** — placeholder for now

## পরিবর্তন

### `src/pages/system/InvoiceSetupPage.tsx` — নতুন তৈরি

1. **হেডার**: FileText আইকন + "Invoice Setup" + breadcrumb + subtitle "Setting Up Invoice"
2. **ট্যাব**: Invoice Settings | Money Receipt
3. **Company Information সেকশন** (bordered card, toggle switch):
   - 2-column grid: Company Name, Email, Mobile Number, Website, Upload Logo (file input), Address (textarea)
4. **Invoice Settings সেকশন** (bordered card):
   - Invoice Title (input), Set Position of "Invoice" word (radio: Left/Right/None), Number of Invoice Per Page (select: 1/2/3), Margin Top/Bottom (number inputs)
5. **Note for Invoice সেকশন** (bordered card):
   - Dynamic notes array with label "NOTE 1", "NOTE 2"... + Remove button (destructive) + "Add Note" button
6. **Save বাটন**: "Update Invoice Settings"
7. Local state management (useState) — no DB integration yet, just UI

### `src/App.tsx` — রাউট আপডেট
`/dashboard/system/invoice-setup` → `InvoiceSetupPage`

| ফাইল | কাজ |
|---|---|
| `src/pages/system/InvoiceSetupPage.tsx` | নতুন |
| `src/App.tsx` | রাউট আপডেট |

