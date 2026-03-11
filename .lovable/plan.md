

# Change Request (Package & Exp. Date) পেইজ

## রেফারেন্স
ছবিতে Change Request পেইজ — ফিল্টার বার (Request Type, Request Status, From Date, To Date, Occurred Date, Created By) এবং টেবিল: Code, ID/IP, Name, Mobile, Zone, CurrentPackage, RequestedPackage, CurrentBillDate, RequestedBillDate, Remarks/Note, CreatedBy, CreatedDate, OccurringDate, Status। Status badges: Requested (orange), Approved (green), Cancelled (red), Completed (blue)। Action buttons: Cancel Request, Approve Request, Generate PDF, Generate CSV। Info banner সহ।

## ডিজাইন
NewRequestPage/LeftClientsPage-এর প্যাটার্ন অনুসরণ — Filter bar + Table + Search + SHOW entries।

### ফিল্টার (Row 1):
- Request Type dropdown (Package Change, Bill Date Change, etc.)
- Request Status dropdown (Requested, Approved, Cancelled, Completed)
- From Date, To Date (date pickers)
- Occurred Date (date picker)
- Created By dropdown

### অ্যাকশন বাটন:
- Cancel Request (destructive), Approve Request (success), Generate PDF, Generate CSV

### Info Banner:
"Learn what will happen after changes request approval?" toggle

### টেবিল কলাম:
Code, ID/IP, Name (with info icon), Mobile, Zone, CurrentPackage, RequestedPackage, CurrentBillDate, RequestedBillDate, Remarks/Note, CreatedBy, CreatedDate, OccurringDate, Status, Checkbox

### Demo Data: 7-8 sample change requests

## ফাইল পরিবর্তন

| ফাইল | কাজ |
|------|-----|
| `src/pages/clients/ChangeRequestPage.tsx` | নতুন — Change Request পেইজ |
| `src/App.tsx` | রাউট আপডেট — placeholder → `ChangeRequestPage` |

