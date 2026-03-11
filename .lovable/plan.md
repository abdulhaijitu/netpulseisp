

# Profit & Loss পেইজ — রেফারেন্স ইমেজ অনুযায়ী

## রেফারেন্স বিশ্লেষণ
ছবিতে: breadcrumb (Accounting Report > Profit Loss Report), From Date / To Date পিকার, "Update Report" ও "Clear Filters" বাটন, Generate PDF/CSV। মূল কন্টেন্ট — ACCOUNT কলাম হেডার + ডেট রেঞ্জ দেখানো। তিনটি সেকশন:
- **Income** (ডার্ক ব্যানার): অ্যাকাউন্ট রো (Name — Amount), Total Income
- **Cost of Goods Sold** (ডার্ক ব্যানার): Total COGS → **Gross Profit** রো (amount + percentage)
- **Expense** (ডার্ক ব্যানার): অ্যাকাউন্ট রো, Total Expense → **Net Profit** রো (amount + percentage)
- ফুটার নোট: "Asset, Liabilities and Owner's Equity are not shown... Go to Balance Sheet"

## পরিবর্তন

### `src/pages/finance/ProfitLossPage.tsx` — নতুন পেইজ
1. **হেডার**: "Profit & Loss" + "Accounting Report" সাবটাইটেল + breadcrumb + PDF/CSV বাটন
2. **ফিল্টার**: From Date, To Date পিকার + "Update Report" + "Clear Filters"
3. **ACCOUNT হেডার**: ডার্ক ব্যাকগ্রাউন্ড — "ACCOUNT" বামে, ডেট রেঞ্জ ডানে
4. **Income সেকশন**: ডার্ক ব্যানার, অ্যাকাউন্ট রো, Total Income (bold)
5. **Cost of Goods Sold সেকশন**: ডার্ক ব্যানার, Total COGS → Gross Profit রো (amount + % of Total Income)
6. **Expense সেকশন**: ডার্ক ব্যানার, অ্যাকাউন্ট রো, Total Expense → Net Profit রো (amount + % of Total Income)
7. **ফুটার নোট**: Balance Sheet লিংকসহ
8. **ডাটা**: Static demo data

### `src/App.tsx` — রাউট আপডেট
`/dashboard/accounting/profit-loss` → `ProfitLossPage` (placeholder রিপ্লেস)

| ফাইল | কাজ |
|------|-----|
| `src/pages/finance/ProfitLossPage.tsx` | নতুন |
| `src/App.tsx` | রাউট আপডেট |

