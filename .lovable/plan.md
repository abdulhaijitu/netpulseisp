

# System > Activity Loggers পেইজ

## রেফারেন্স বিশ্লেষণ
ছবিতে দেখা যাচ্ছে:
- হেডার: "Activity Logs" + subtitle "All Activity Loggers Of This Application" + breadcrumb
- ফিল্টার বার: From Date, To Date, Changed By (user select), Changed Type (type select)
- Generate PDF / Generate CSV বাটন
- Show entries dropdown + Search ইনপুট
- ডার্ক হেডার টেবিল: Sr., Table Name, Old Values, New Values, Changed Columns, Changed By, Changing Date, Change Type
- পেজিনেশন: "Showing 0 to 0 of 0 entries" + Previous/Next

## পরিবর্তন

### `src/pages/system/ActivityLoggersPage.tsx` — নতুন পেইজ

1. **হেডার**: ClipboardList আইকন + "Activity Logs" + breadcrumb (System > Activity Logs) + subtitle
2. **ফিল্টার কার্ড** (dark header "Filter Options"):
   - 4-column grid: From Date input, To Date input, Changed By select, Changed Type select
   - Generate PDF + Generate CSV বাটন (top-right)
3. **ডাটা টেবিল কার্ড** (dark header):
   - Show entries select + Search input
   - টেবিল কলাম: Sr., Table Name, Old Values, New Values, Changed Columns, Changed By, Changing Date, Change Type
   - Mock data দিয়ে কিছু sample entries
   - পেজিনেশন footer
4. Local state management

### `src/App.tsx` — রাউট আপডেট
`activity-loggers` placeholder → `ActivityLoggersPage`

| ফাইল | কাজ |
|---|---|
| `src/pages/system/ActivityLoggersPage.tsx` | নতুন |
| `src/App.tsx` | রাউট আপডেট |

