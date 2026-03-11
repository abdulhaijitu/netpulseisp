

# MikroTik Server > Servers পেইজ — রেফারেন্স ইমেজ অনুযায়ী

## রেফারেন্স বিশ্লেষণ
ছবিতে: "Mikrotik Server — All Mikrotik Servers" হেডার, breadcrumb (System > Server), "+ Server" বাটন, SHOW entries সিলেক্ট, SEARCH বক্স। টেবিল কলাম: Serial, ServerName (নাম + স্ট্যাটাস টেক্সট), Server IP, Username, Password (masked), Port, Version, Timeout, Status (toggle switch), Action (test/edit/sync আইকন)। প্রতিটি সার্ভারে "Mikrotik Is InActive" / "Mikrotik Connected" / "Checking..." স্ট্যাটাস। নিচে "Showing 1 to 6 of 6 entries" + pagination।

## পরিবর্তন

### `src/pages/network/MikrotikServersPage.tsx` — নতুন পেইজ
1. **হেডার**: Server আইকন + "Mikrotik Server" টাইটেল + "All Mikrotik Servers" সাবটাইটেল + breadcrumb + "+ Server" বাটন
2. **ফিল্টার বার**: "SHOW [10] ENTRIES" সিলেক্ট (বামে) + "SEARCH" ইনপুট (ডানে)
3. **টেবিল**: `network_integrations` থেকে `provider_type = 'mikrotik'` ডাটা ব্যবহার করে:
   - Serial (row index)
   - ServerName (name + connection status text — green "Connected" / red "InActive")
   - Server IP (host)
   - Username
   - Password (masked dots + eye toggle)
   - Port
   - Version (mikrotik_use_ssl → v3, else v2)
   - Timeout ("10 sec." default)
   - Status (Switch toggle — is_enabled)
   - Action (Test Connection, Edit, Sync আইকন বাটন)
4. **ফুটার**: "Showing X to Y of Z entries" + Previous/Next pagination
5. **ডাটা**: `useNetworkIntegrations` হুক ফিল্টার করে mikrotik টাইপ

### `src/App.tsx` — রাউট আপডেট
`/dashboard/mikrotik/servers` → `MikrotikServersPage` (নতুন রাউট যোগ)

| ফাইল | কাজ |
|------|-----|
| `src/pages/network/MikrotikServersPage.tsx` | নতুন — MikroTik Servers টেবিল পেইজ |
| `src/App.tsx` | রাউট যোগ |

