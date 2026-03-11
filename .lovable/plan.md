

# Inventory & Assets > Items পেইজ — রেফারেন্স ইমেজ অনুযায়ী

## রেফারেন্স বিশ্লেষণ
ছবিতে একটি **Item Tree** দেখা যাচ্ছে। "Item" হেডার + "Item Tree" সাবটাইটেল + breadcrumb (Inventory > Item)। "+ Item" বাটন। Card-এর ভেতরে "Items" টাইটেল + Search বার। তারপর tree-style লিস্ট যেখানে:
- প্রতিটি আইটেম ক্যাটেগরি একটি expandable row (→ আইকন)
- ফরম্যাট: `Name (description) - X Sub-Categories - Y Items`
- কিছু আইটেমে শুধু নাম (no children, dash icon)
- ক্লিক করলে sub-categories expand হবে

## পরিবর্তন

### `src/pages/inventory/ItemsPage.tsx` — নতুন পেইজ
1. **হেডার**: Package আইকন + "Item" টাইটেল + "Item Tree" সাবটাইটেল + breadcrumb
2. **"+ Item" বাটন** — Dialog দিয়ে নতুন আইটেম/ক্যাটেগরি যোগ
3. **Card**: "Items" লেবেল + Search ইনপুট
4. **Tree List**: Collapsible tree structure — প্রতিটি নোডে:
   - Expand/collapse আইকন (ChevronRight → ChevronDown)
   - Name + optional description in parentheses
   - Sub-Categories count + Items count
   - Leaf নোডে dash icon (no expand)
5. **ডেমো ডাটা**: রেফারেন্স ইমেজের ~30+ আইটেম ক্যাটেগরি (AC Test, Almirah, BB Cables, Computers, OLT, Router, Server ইত্যাদি) with nested sub-categories
6. **Search**: রিয়েল-টাইম ফিল্টার

### `src/App.tsx` — রাউট আপডেট
`/dashboard/inventory/items` → `ItemsPage` (placeholder রিপ্লেস)

| ফাইল | কাজ |
|------|-----|
| `src/pages/inventory/ItemsPage.tsx` | নতুন |
| `src/App.tsx` | রাউট আপডেট |

