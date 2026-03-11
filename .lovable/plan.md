

# MAC Reseller > Funding পেইজ

## রেফারেন্স বিশ্লেষণ
ছবিতে: "MAC Reseller Funding" হেডার + breadcrumb। দুইটি ট্যাব: "MACReseller Fund" ও "MACReseller Fund History"। তিনটি অ্যাকশন বাটন: "Download PDF", "Download Excel", "+ Give Fund"। "BulkOnlineFundRestriction(Block/Unblock)" বাটন। ফিল্টার ২ সারি: MAC Resellers (Select), Transaction Status (Select), From Date, To Date, Payment By, Received By, Restrict Status। Show entries + Search। বিস্তারিত টেবিল: Checkbox, ResellerName, InvoiceNumber, FundAmount, Payment, P.Processing Fee, Vat, Discount, DueAmount, FundingDate, FundGivenBy, ReceivedDate(Last), ReceivedBy(Last), Remarks, Trans.Status (Paid/Due/Refund badges), RestrictOnlinePayment (Unblocked toggle), Action (copy/view/delete)।

## পরিবর্তন

### `src/pages/reseller/ResellerFundingPage.tsx` — নতুন
1. **হেডার**: PiggyBank আইকন + "Reseller Funding" + breadcrumb
2. **ট্যাব**: "Reseller Fund" (active) ও "Fund History"
3. **অ্যাকশন বাটন**: "Download PDF", "Download Excel", "+ Give Fund"
4. **ফিল্টার ২ সারি**: Reseller (Select), Transaction Status (Select), From Date, To Date, Payment By, Received By, Restrict Status
5. **Show entries + Search**
6. **ডার্ক হেডার টেবিল**: Checkbox, Reseller Name, Invoice No, Fund Amount, Payment, Processing Fee, VAT, Discount, Due Amount, Funding Date, Given By, Received Date, Received By, Status (Paid=green/Due=orange/Refund=red badge), Restrict (Unblocked/Blocked toggle), Action
7. **ডেমো ডাটা**: ৬+ entries with mixed statuses
8. **Pagination ফুটার**

### `src/App.tsx` — রাউট আপডেট
`/dashboard/resellers/funding` → `ResellerFundingPage`

| ফাইল | কাজ |
|------|-----|
| `src/pages/reseller/ResellerFundingPage.tsx` | নতুন |
| `src/App.tsx` | রাউট আপডেট |

