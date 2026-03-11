

# Inventory & Assets > Stock পেইজ — রেফারেন্স ইমেজ অনুযায়ী

## রেফারেন্স বিশ্লেষণ
ছবিতে: "Stock" হেডার + "Stock Monitor" সাবটাইটেল + breadcrumb (Inventory > Stock)। Card-এর ভেতরে "Items" টাইটেল + Search বার। তারপর ItemsPage-এর মতোই tree-style লিস্ট কিন্তু এখানে **Stock quantity** ফোকাস — প্রতিটি আইটেমে `Name - X Items` এবং Sub-Categories count দেখানো হচ্ছে। এটি মূলত Items পেইজের মতো tree structure কিন্তু Stock Monitor হিসেবে।

## পরিবর্তন

### `src/pages/inventory/StockPage.tsx` — নতুন পেইজ
ItemsPage প্যাটার্ন অনুসরণ করে:
1. **হেডার**: Store আইকন + "Stock" টাইটেল + "Stock Monitor" সাবটাইটেল + breadcrumb (Inventory > Stock)
2. **Summary badges**: Total Categories, Total Stock Items, Low Stock Items count
3. **Card**: "Items" লেবেল + Search ইনপুট
4. **Tree List**: একই collapsible tree structure — প্রতিটি নোডে:
   - Arrow আইকন (expand/collapse)
   - `Name (description) - X Sub-Categories - Y Items` ফরম্যাট
   - Leaf নোডে dash icon
   - Low stock আইটেমে warning badge
5. **ডেমো ডাটা**: ISP-related stock items (Router, ONU, Cable, Switch ইত্যাদি) with stock quantities
6. **Search**: রিয়েল-টাইম ফিল্টার
7. **Footer**: Showing X of Y categories

### `src/App.tsx` — রাউট আপডেট
`/dashboard/inventory/stock` → `StockPage` (placeholder রিপ্লেস)

| ফাইল | কাজ |
|------|-----|
| `src/pages/inventory/StockPage.tsx` | নতুন |
| `src/App.tsx` | রাউট আপডেট |

