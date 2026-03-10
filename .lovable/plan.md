

# Packages ↔ Customer ↔ MikroTik ↔ OLT — সম্পর্ক বিশ্লেষণ

---

## ১. বর্তমান অবস্থা (যা আছে)

```text
┌──────────────┐       ┌──────────────────┐       ┌─────────────────────┐
│   packages   │◄──────│    customers     │──────►│ network_integrations│
│              │ FK:   │                  │ via   │   (MikroTik/RADIUS) │
│ - name       │package│ - package_id     │edge   │                     │
│ - speed_label│ _id   │ - network_user   │func   │ - host, port        │
│ - mikrotik_  │       │ - connection_    │       │ - mikrotik_ppp_     │
│   profile_   │       │   status         │       │   profile           │
│   name ✅    │       │ - network_sync_  │       │ - credentials       │
│ - mikrotik_  │       │   status         │       │                     │
│   rate_limit │       │ - last_network_  │       │                     │
│   ✅         │       │   sync_at        │       │                     │
└──────────────┘       └──────────────────┘       └─────────────────────┘
       │                       │                          │
       │              sync_queue / sync_logs              │
       └────────────── network-sync edge function ────────┘
```

### যা কাজ করে:
- **Package → Customer**: `customers.package_id` দিয়ে যুক্ত। প্রতিটি কাস্টমারের একটি প্যাকেজ থাকে
- **Customer → MikroTik**: `network_username` দিয়ে PPP secret ম্যাপ হয়। Edge function দিয়ে enable/disable/update_speed করা যায়
- **Package → MikroTik**: সদ্য যোগ করা `mikrotik_profile_name`, `mikrotik_rate_limit` ফিল্ড দিয়ে PPP Profile সিঙ্ক হয়। `sync_package` action আছে

### যা নেই:
- **OLT** সম্পর্কিত কোনো টেবিল, কোড বা ইন্টিগ্রেশন নেই
- MikroTik সিঙ্ক বর্তমানে **simulated** (আসল RouterOS API কল হয় না)
- কাস্টমারের কোনো OLT port/ONU তথ্য রাখা হয় না

---

## ২. আদর্শ সম্পর্ক (যেভাবে হওয়া উচিত)

```text
                    ┌───────────────┐
                    │   packages    │
                    │ - speed/price │
                    │ - mikrotik    │
                    │   profile     │
                    └──────┬────────┘
                           │ 1:N
                    ┌──────▼────────┐
                    │   customers   │
                    │ - package_id  │
                    │ - network_user│
                    │ - olt_port_id │◄──── (নতুন FK)
                    └──┬─────────┬──┘
                       │         │
            ┌──────────▼──┐  ┌──▼──────────────┐
            │  MikroTik   │  │      OLT        │
            │ (PPP/Queue) │  │ (GPON/EPON)     │
            │             │  │                  │
            │ enable/     │  │ - OLT devices    │
            │ disable/    │  │ - OLT ports      │
            │ speed sync  │  │ - ONU serial     │
            └─────────────┘  │ - VLAN           │
                             │ - port status    │
                             └──────────────────┘
```

### প্রয়োজনীয় নতুন টেবিলসমূহ:

| টেবিল | উদ্দেশ্য |
|-------|---------|
| `olt_devices` | OLT ডিভাইস তালিকা (brand, model, IP, SNMP credentials) |
| `olt_ports` | প্রতিটি OLT-এর পোর্ট/স্লট তথ্য (slot, port, status, connected ONU) |
| `customer_onu` | কাস্টমার ↔ ONU ম্যাপিং (ONU serial, MAC, VLAN, port assignment) |

### সম্পর্কের লজিক:

```text
olt_devices (1) ──► (N) olt_ports (1) ──► (1) customer_onu (N) ◄── (1) customers
                                                    │
                                              ONU serial, MAC
                                              VLAN ID, status
```

### কী কী লজিক দরকার:

1. **Package তৈরি/এডিট** → MikroTik PPP Profile সিঙ্ক (✅ এটা আছে)
2. **Customer তৈরি** → MikroTik-এ PPP secret তৈরি + OLT port assign (নতুন)
3. **Customer suspend** → MikroTik-এ disable + OLT port shutdown (নতুন)
4. **Customer activate** → MikroTik-এ enable + OLT port enable (নতুন)
5. **Package পরিবর্তন** → MikroTik speed update + OLT VLAN/bandwidth update (নতুন)
6. **OLT monitoring** → পোর্ট স্ট্যাটাস, ONU online/offline, optical signal level (নতুন)

---

## ৩. বাস্তবায়নের ধাপ (প্রস্তাবিত)

### Phase 1: OLT Device Management (ডাটাবেস + UI)
- `olt_devices` ও `olt_ports` টেবিল তৈরি
- OLT ডিভাইস যোগ/এডিট/ডিলিট UI
- পোর্ট ম্যাপিং ইন্টারফেস

### Phase 2: Customer ↔ ONU Mapping
- `customer_onu` টেবিল তৈরি
- Customer form-এ ONU assignment ফিল্ড যোগ
- কোন কাস্টমার কোন OLT-এর কোন পোর্টে — এই ভিজ্যুয়ালাইজেশন

### Phase 3: OLT Sync Edge Function
- OLT API integration (SNMP/Telnet/HTTP based on vendor)
- Port enable/disable automation
- Customer status পরিবর্তনে auto-sync

### Phase 4: Unified Network Dashboard
- MikroTik + OLT একসাথে Network পেজে দেখানো
- ONU status monitoring
- Signal level alerts

---

## ৪. সারাংশ

| বিষয় | বর্তমান | প্রয়োজন |
|-------|---------|---------|
| Package → Customer | ✅ `package_id` FK | ✅ আছে |
| Package → MikroTik | ✅ `mikrotik_profile_name` | ✅ আছে |
| Customer → MikroTik | ✅ `network_username` + edge func | ✅ আছে (simulated) |
| OLT Device Management | ❌ নেই | নতুন তৈরি করতে হবে |
| Customer → OLT/ONU | ❌ নেই | নতুন তৈরি করতে হবে |
| OLT Sync Automation | ❌ নেই | Edge function দরকার |

আপনি কোন Phase দিয়ে শুরু করতে চান?

