

# District / Upazilla পেইজ — বাংলাদেশের Division-District-Upazilla হায়ারার্কি

## ডিজাইন কনসেপ্ট

বাংলাদেশের administrative hierarchy তিন স্তরের: **Division (8) → District (64) → Upazilla (495)**। একটি ট্যাবড ইন্টারফেস ব্যবহার করবো যেখানে তিনটি ট্যাব থাকবে — প্রতিটি স্তরের জন্য একটি, এবং parent-child সম্পর্ক ড্রপডাউন দিয়ে পরিচালনা করা হবে।

```text
┌─ Page Header ─────────────────────────────────────────┐
│ 📍 Area Management   Configure divisions, districts   │
│                      & upazillas                      │
├─ Tabs ────────────────────────────────────────────────┤
│ [ Division (8) ] [ District (64) ] [ Upazilla (495) ]│
├─ Toolbar ─────────────────────────────────────────────┤
│ Show [10▼] entries    🔍 Search...    [+ Add Button]  │
├─ Table ───────────────────────────────────────────────┤
│ Division Tab:                                         │
│ # │ Division Name │ Bn Name │ Status │ Action         │
│                                                       │
│ District Tab:                                         │
│ # │ District │ Division (parent) │ Status │ Action    │
│                                                       │
│ Upazilla Tab:                                         │
│ # │ Upazilla │ District (parent) │ Status │ Action    │
└───────────────────────────────────────────────────────┘
```

### ফিচার:
- **Division ট্যাব**: 8টি বিভাগ (Dhaka, Chittagong, Rajshahi, Khulna, Barisal, Sylhet, Rangpur, Mymensingh) — pre-populated
- **District ট্যাব**: 64টি জেলা — Division ড্রপডাউন ফিল্টার সহ, Add করার সময় Division সিলেক্ট করতে হবে
- **Upazilla ট্যাব**: উপজেলা — District ড্রপডাউন ফিল্টার সহ
- প্রতিটি ট্যাবে CRUD, Search, Pagination, Status toggle
- Add/Edit Dialog-এ parent সিলেক্ট ড্রপডাউন

### সাইডবার আপডেট:
"District / Upazilla" → "Area Management" রিনেম করবো, অথবা একই রুটে তিনটি ট্যাব রাখবো।

## ফাইল পরিবর্তন

| ফাইল | কাজ |
|------|-----|
| `src/pages/config/AreaManagementPage.tsx` | নতুন — Division/District/Upazilla ট্যাবড CRUD পেইজ |
| `src/App.tsx` | রাউট আপডেট — `/dashboard/config/district` → `AreaManagementPage` |
| `src/components/layout/DashboardSidebar.tsx` | সাইডবার লেবেল "District / Upazilla" → "Area Management" আপডেট |

