

# System > Company Setup পেইজ

## রেফারেন্স বিশ্লেষণ
ছবিতে দুটি সেকশন:
1. **Basic Company Settings** (dark header bar) — 3-column grid: Company Name*, Email Address, Address 1, Address 2, Mobile 1, Mobile 2, Phone 1, Phone 2, Logo (file upload)। Client Code (Customizable/Automatic radio)। "Want to Show in Login Page?" checkbox।
2. **Company Localization** (dark header bar) — 3-column grid: Country (select), Country Code, Symbol, Language, Dial Code, Timezone (select)। "Update Company Information" বাটন।

## পরিবর্তন

### `src/pages/system/CompanySetupPage.tsx` — নতুন তৈরি

1. **হেডার**: Building2 আইকন + "Company Setup" + breadcrumb (System > Company Setup)
2. **Basic Company Settings সেকশন** (dark header `bg-slate-800`):
   - 3-column form grid: Company Name*, Email Address, Address 1, Address 2, Mobile 1, Mobile 2, Phone 1, Phone 2, Logo (file input)
   - Client Code: Radio group (Customizable / Automatic) with info tooltip
   - "Want to Show in Login Page?" checkbox with info tooltip
3. **Company Localization সেকশন** (dark header):
   - 3-column grid: Country (Select), Country Code (Input), Currency Symbol (Input), Language (Input), Dial Code (Input), Timezone (Select)
4. **"Update Company Information"** বাটন (primary)
5. Tenant ডাটা থেকে pre-fill (name, currency, timezone, language, logo_url) — `useCurrentTenant` + `useUpdateTenantSettings` hooks ব্যবহার
6. Toast on save

### `src/App.tsx` — রাউট আপডেট
`/dashboard/system/company-setup` → `CompanySetupPage` (placeholder রিপ্লেস)

| ফাইল | কাজ |
|---|---|
| `src/pages/system/CompanySetupPage.tsx` | নতুন |
| `src/App.tsx` | রাউট আপডেট |

