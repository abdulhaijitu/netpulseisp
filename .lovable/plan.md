

# Chart of Accounts পেইজ — রেফারেন্স ইমেজ অনুযায়ী

## রেফারেন্স বিশ্লেষণ
ছবিতে **Chart of Accounts** পেইজ: "List of Accounts" সাবটাইটেল, breadcrumb, "Create New Account" বাটন, Filter by Status ড্রপডাউন, ৫টি ট্যাব (Asset, Expense, Income, Liabilities, Owner's Equity) — প্রতিটিতে কাউন্ট দেখানো। প্রতিটি ট্যাবের ভিতরে ক্যাটাগরি গ্রুপ (ডার্ক ব্যানার হেডার + "Create New Account" বাটন) এবং তার নিচে অ্যাকাউন্ট লিস্ট (Code, Name, Description, Edit icon)। খালি ক্যাটাগরিতে "No Data Found"।

## পরিবর্তন

### `src/pages/finance/ChartOfAccountsPage.tsx` — নতুন পেইজ

1. **হেডার**: "Chart of Accounts" + "List of Accounts" সাবটাইটেল + breadcrumb + "Create New Account" বাটন
2. **Filter by Status**: Active/Inactive ড্রপডাউন
3. **৫টি ট্যাব**: Asset, Expense, Income, Liabilities, Owner's Equity — প্রতিটিতে আইটেম কাউন্ট
4. **ক্যাটাগরি গ্রুপ**: ডার্ক ব্যাকগ্রাউন্ড হেডার (ক্যাটাগরি নাম + info icon + "Create New Account" বাটন)
5. **অ্যাকাউন্ট রো**: Code | Name | Description | Edit icon
6. **ডাটা**: Static demo data (ISP accounting categories — Cash & Bank, Depreciation, Expected Payments, Inventory, etc.)

### `src/App.tsx` — রাউট আপডেট
`/dashboard/accounting/chart` → `ChartOfAccountsPage`

| ফাইল | কাজ |
|------|-----|
| `src/pages/finance/ChartOfAccountsPage.tsx` | নতুন |
| `src/App.tsx` | রাউট আপডেট |

