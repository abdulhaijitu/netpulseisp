

# HR & Payroll > Department পেইজ — রেফারেন্স ইমেজ অনুযায়ী

## রেফারেন্স বিশ্লেষণ
ছবিতে: "Department" হেডার + "Configure Department" সাবটাইটেল + breadcrumb। "+ Department" বাটন। SHOW entries + SEARCH। টেবিল ৪ কলাম: Serial, Department Type, Details, Action (Edit/Delete আইকন)। ডার্ক নীল হেডার। ডেমো ডাটা: ISP Version, bill-team, act-team, Rohan, BIlling2, computer operator, tea provider, warriors।

## পরিবর্তন

### `src/pages/hr/DepartmentPage.tsx` — নতুন পেইজ
ConnectionTypePage এর প্যাটার্ন অনুসরণ করে:
1. **হেডার**: আইকন + "Department" টাইটেল + "Configure Department" সাবটাইটেল + breadcrumb
2. **"+ Department" বাটন**
3. **SHOW entries + SEARCH বার**
4. **টেবিল**: Serial, Department Type, Details, Action (Edit/Delete) — ডার্ক হেডার (`bg-primary`)
5. **Pagination ফুটার**
6. **Add/Edit ডায়ালগ**: Department Name + Details
7. **Delete confirmation ডায়ালগ**
8. **ডাটা**: ছবির ৮টি এন্ট্রি

### `src/App.tsx` — রাউট আপডেট
`/dashboard/hr/department` → `DepartmentPage` (placeholder রিপ্লেস)

| ফাইল | কাজ |
|------|-----|
| `src/pages/hr/DepartmentPage.tsx` | নতুন |
| `src/App.tsx` | রাউট আপডেট |

