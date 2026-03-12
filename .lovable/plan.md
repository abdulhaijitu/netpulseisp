

# New Client Request Modal — রেফারেন্স ইমেজ অনুসারে রিডিজাইন

## পরিবর্তন

### `src/pages/clients/NewRequestPage.tsx` — Modal অংশ পুনর্লিখন (লাইন 413-498)

ইমেজ অনুযায়ী মডালটি একটি **মাল্টি-স্টেপ উইজার্ড** ফরম্যাটে তৈরি হবে:

**৪টি স্টেপ:**
1. **Personal Info** — Name*, Gender, Occupation, Date of Birth, Father Name, Mother Name, NID/Birth Certificate No, Registration Form No, Remarks, Profile Picture, NID Picture, Registration Form Picture
2. **Contact Info** — Mobile*, Email, Division, District, Thana/Upazilla, Address, Alternative Mobile
3. **Network & Product Info** — Zone, Subzone, Connection Type, Physical Connectivity, OLT Device, ONU MAC
4. **Service Info** — Package, Customer Type, Monthly Bill, Billing Date, OTC

**ডিজাইন ফিচার:**
- ডার্ক হেডার (bg-primary) — "New Client Request" টাইটেল ও সাবটাইটেল
- আইকন সহ স্টেপ ইনডিকেটর (User, Contact, Network, Service) — প্রোগ্রেস বার সহ
- প্রতিটি স্টেপে সেকশন টাইটেল ও "Step X - 4" ইনডিকেটর
- ৩-কলাম গ্রিড লেআউট
- Close ও Next/Previous/Submit বাটন
- মডাল সাইজ `sm:max-w-3xl`

বর্তমান `form` স্টেট অবজেক্টে নতুন ফিল্ডগুলো যোগ হবে। `handleSave` ফাংশন শুধুমাত্র শেষ স্টেপে কাজ করবে।

