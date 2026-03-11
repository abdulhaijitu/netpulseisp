

# SMS Service > SMS Template পেইজ

## রেফারেন্স বিশ্লেষণ
ছবিতে: "SMS Template" হেডার + breadcrumb। "+ Add Template" বাটন। Show entries + Search। ডার্ক হেডার টেবিল কলাম: Serial, Template Name, Template Type (Custom/Default badge), Template (body text), Action (edit/delete)। Pagination ফুটার।

## পরিবর্তন

### `src/pages/sms/SmsTemplatePage.tsx` — নতুন তৈরি
1. **হেডার**: FileText আইকন + "SMS Template" + breadcrumb (SMS Service > SMS Template)
2. **অ্যাকশন**: "+ Add Template" বাটন
3. **Show entries + Search**
4. **ডার্ক হেডার টেবিল**: Serial, Template Name, Template Type (Default=teal badge, Custom=blue badge), Template (body text), Action (Edit আইকন + Delete আইকন)
5. **ডেমো ডাটা**: ১০+ entries (Payment Receipt, Welcome, EID, Service Disruption, etc.) — mixed Default/Custom types
6. **Pagination**: "Showing 1 to 10 of X entries" + page buttons
7. **Add Template Dialog**: Template Name input, Template Type select (Custom/Default), Template body textarea, variable placeholders hint ({CustomerName}, {Amount}, etc.)

### `src/App.tsx` — রাউট আপডেট
`/dashboard/sms/template` → `SmsTemplatePage` (placeholder রিপ্লেস)

| ফাইল | কাজ |
|------|-----|
| `src/pages/sms/SmsTemplatePage.tsx` | নতুন |
| `src/App.tsx` | রাউট আপডেট |

