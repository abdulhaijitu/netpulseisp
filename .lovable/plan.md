

# System > Periods Setup পেইজ

## ডিজাইন
রেফারেন্স ছবি অনুযায়ী — Year এবং Show On List (toggle switch) সহ একটি সিম্পল টেবিল।

## পরিবর্তন

### `src/pages/system/PeriodsSetupPage.tsx` — নতুন
- **হেডার**: CalendarDays আইকন + "Periods Setup" + breadcrumb + subtitle "Bill Periods Enabling/Disabling"
- **টেবিল**: Dark header (`bg-primary`), দুটি কলাম — Year ও Show On List
- Years: 2017–2027 (descending), প্রতিটিতে Switch toggle
- Local state দিয়ে toggle manage

### `src/App.tsx` — রাউট আপডেট
`periods-setup` → `PeriodsSetupPage`

