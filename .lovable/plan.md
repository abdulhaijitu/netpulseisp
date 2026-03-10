

## Plan: Convert Remaining Bengali Text to English

Login page and customer table/detail pages are already in English. The following 12 files still contain Bengali text:

### Files to Update

**Reseller Pages (6 files):**
- `src/pages/Resellers.tsx` — status labels, commission labels, buttons, headers, table heads, dropdown items
- `src/pages/ResellerDetail.tsx` — commission labels, status config, stats, tabs, buttons
- `src/pages/reseller/ResellerDashboardPage.tsx` — status config, stat cards, headers, table heads
- `src/pages/reseller/ResellerCustomersPage.tsx` — status config, headers, filters, table heads
- `src/pages/reseller/ResellerPaymentsPage.tsx` — method labels, headers, table heads
- `src/pages/reseller/ResellerWalletPage.tsx` — type labels, headers, tabs, table heads

**Reseller Components (4 files):**
- `src/components/resellers/ResellerFormDialog.tsx` — all form labels, buttons, placeholders
- `src/components/resellers/ResellerCommissionsTab.tsx` — type labels, table heads, empty states
- `src/components/resellers/ResellerCustomersTab.tsx` — status config, table heads, dialog text, buttons
- `src/components/resellers/ResellerWalletTab.tsx` — type config, balance label, table heads, dialog

**Customer Components (1 file):**
- `src/components/customers/CustomerFilters.tsx` — search placeholder, filter labels, status labels, balance type labels

**Reseller Assignment (1 file):**
- `src/components/resellers/AssignCustomerDialog.tsx` — dialog title, description, search, empty state, buttons

### Approach
- Direct string replacement: Bengali → English
- No logic or structure changes
- Keep ৳ currency symbol

