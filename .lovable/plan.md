

# HR & Payroll > Attendance পেইজ — রেফারেন্স ইমেজ অনুযায়ী

## রেফারেন্স বিশ্লেষণ
ছবিতে: "Employee Wise Attendance" হেডার + breadcrumb। ফিল্টার: Search Employee (dropdown), Select Start Date, Select Ends Date + Search বাটন। Generate PDF / Generate Excel বাটন। টেবিল ৯ কলাম: Date, Office In Time, Office Out Time, In Time, Out Time, Working Hour, Type, Late + Early Out, Over Time (Real → Approved)। ডার্ক নীল হেডার। Pagination।

## পরিবর্তন

### `src/pages/hr/AttendancePage.tsx` — নতুন পেইজ
1. **হেডার**: আইকন + "Employee Wise Attendance" টাইটেল + "Employee" সাবটাইটেল + breadcrumb
2. **Generate PDF / Generate Excel বাটন**
3. **ফিল্টার**: Search Employee (Select), Start Date, End Date + Search বাটন
4. **টেবিল**: Date, Office In Time, Office Out Time, In Time, Out Time, Working Hour, Type, Late + Early Out, Over Time (Real → Approved) — ডার্ক হেডার (`bg-primary`)
5. **ডেমো ডাটা**: ৫-৬টি এন্ট্রি
6. **Pagination ফুটার**

### `src/App.tsx` — রাউট আপডেট
`/dashboard/hr/attendance` → `AttendancePage` (placeholder রিপ্লেস)

| ফাইল | কাজ |
|------|-----|
| `src/pages/hr/AttendancePage.tsx` | নতুন |
| `src/App.tsx` | রাউট আপডেট |

