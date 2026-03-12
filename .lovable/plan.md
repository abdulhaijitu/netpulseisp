

# Leave Apply পেজ তৈরি — রেফারেন্স ইমেজ অনুসারে

## পরিবর্তন

### `src/pages/hr/LeaveApplyPage.tsx` — সম্পূর্ণ পুনর্লিখন

ইমেজ অনুযায়ী দুটি অংশ: **উপরে ফর্ম** এবং **নিচে টেবিল**।

**ফর্ম ফিল্ডসমূহ:**
- Employee Name (Select, required)
- Subject (Input, required)
- Leave Type (Select from categories, required)
- Apply Date (Date input, required)
- Reason (Textarea, required)
- Start Date (Date input, required)
- End Date (Date input, required)
- Upload Attachment (File input)
- Reset ও Submit বাটন

**টেবিল কলাম:** Leave Category, Subject, Start Date, End Date, Apply Date, Reason, Status, Action

**ফিচারসমূহ:**
1. PageContainer হেডার — "Leave Apply" টাইটেল
2. Card-এ ফর্ম — ২ কলাম গ্রিড লেআউট
3. টুলবার — Show entries সিলেক্ট + সার্চ ইনপুট
4. ডার্ক-হেডার টেবিল (bg-primary) — জমা দেওয়া leave আবেদনের তালিকা
5. পেজিনেশন
6. Status Badge — Pending/Approved/Rejected

`LeaveCategoryPage` প্যাটার্ন অনুসরণ করা হবে।

