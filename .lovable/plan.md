

# Import from MikroTik পেইজ — রেফারেন্স ইমেজ অনুযায়ী

## রেফারেন্স বিশ্লেষণ
ছবিতে "Mikrotik Clients — Export Mikrotik Clients" হেডার, breadcrumb (Mikrotik Server > Mikrotik Client List)। উপরে ৪টি ফিল্টার ড্রপডাউন: SERVERS, PROTOCOL (PPPOE), PROFILE, USER TYPE (Unique) + "Clear Filter" ও "Apply Filter" বাটন। SHOW entries সিলেক্ট ও SEARCH বক্স। টেবিল কলাম: Name, Password (masked + eye), Service, Profile, Caller ID, Server Name, Logout Time, User Status (badge), Branch, Action (toggle + user icon), Export (checkbox)। উপরে "Generate Excel" ও "Export To MACReseller" বাটন।

## পরিবর্তন

### `src/pages/network/MikrotikImportPage.tsx` — নতুন পেইজ
1. **হেডার**: "Mikrotik Clients" টাইটেল + "Import Mikrotik Clients" সাবটাইটেল + breadcrumb + "Generate Excel" ও "Export To MACReseller" বাটন
2. **ফিল্টার বার**: ৪টি সিলেক্ট (Servers, Protocol, Profile, User Type) + Clear Filter / Apply Filter বাটন
3. **এন্ট্রি/সার্চ বার**: SHOW entries সিলেক্ট + SEARCH ইনপুট
4. **টেবিল**: Name, Password (masked+eye), Service, Profile, Caller ID, Server Name, Logout Time, User Status (badge), Branch, Action (toggle+import icon), Export (checkbox) — ডার্ক হেডার
5. **ফুটার**: Showing X to Y of Z entries + Previous/Next
6. **ডাটা**: Static demo data (PPPoE ক্লায়েন্ট তালিকা)

### `src/App.tsx` — রাউট আপডেট
`/dashboard/mikrotik/import` → `MikrotikImportPage`

| ফাইল | কাজ |
|------|-----|
| `src/pages/network/MikrotikImportPage.tsx` | নতুন |
| `src/App.tsx` | রাউট আপডেট |

