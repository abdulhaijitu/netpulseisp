

# OLT Devices পেইজ — রেফারেন্স ইমেজ অনুযায়ী রিডিজাইন

## রেফারেন্স বিশ্লেষণ
ছবিতে: "OLT — OLTManage" হেডার, breadcrumb (OLT > OLT Manage), "Sync All OLTs" ও "+ Add OLT" বাটন। SHOW entries সিলেক্ট ও SEARCH বক্স। টেবিল কলাম: Serial, Ip, Community, OLTType, Status (Active/InActive), Action (Edit/Sync/Delete আইকন)। নিচে "Showing 1 to 7 of 7 entries" + First/Previous/1/Next/Last pagination।

## পরিবর্তন

### `src/pages/OltDevicesPage.tsx` — সম্পূর্ণ রিডিজাইন
বর্তমান কার্ড গ্রিড → টেবিল-ভিত্তিক লেআউটে পরিবর্তন (MikrotikServersPage প্যাটার্ন অনুসরণ):

1. **হেডার**: Server আইকন + "OLT" টাইটেল + "OLT Manage" সাবটাইটেল + breadcrumb + "Sync All OLTs" (outline) ও "+ Add OLT" বাটন
2. **ফিল্টার বার**: SHOW [10] ENTRIES সিলেক্ট + SEARCH ইনপুট
3. **টেবিল**: Serial, IP (host:port), Community (snmp_community), OLTType (brand_protocol), Status (Active/InActive badge), Action (Edit/Sync/Delete আইকন বাটন) — ডার্ক হেডার
4. **ফুটার**: "Showing X to Y of Z entries" + First/Previous/page/Next/Last pagination
5. **ডাটা**: `useOltDevices` থেকে (আগের মতোই), শুধু প্রেজেন্টেশন পরিবর্তন
6. **ডায়ালগ**: বিদ্যমান `OltDeviceFormDialog` ও `OltPortsDialog` সংরক্ষণ

| ফাইল | কাজ |
|------|-----|
| `src/pages/OltDevicesPage.tsx` | সম্পূর্ণ রিডিজাইন — কার্ড → টেবিল |

