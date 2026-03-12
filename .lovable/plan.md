

# Left Clients পেজ রিডিজাইন — রেফারেন্স ইমেজ অনুসারে

## পরিবর্তন সমূহ

### `src/pages/clients/LeftClientsPage.tsx` — সম্পূর্ণ পুনর্লিখন

**হেডার:**
- ডার্ক ব্যাকগ্রাউন্ড হেডার বার — আইকন + "Left Clients" + "View All Left Client" সাবটাইটেল
- ডানদিকে ব্রেডক্রাম্ব (Client > Left Clients)

**ফিল্টার প্যানেল:**
- SectionHeader সরিয়ে সরাসরি bordered কার্ডে ফিল্টার দেখানো
- লেবেল uppercase bold স্টাইল (ZONE, CONNECTION TYPE ইত্যাদি)
- ৪-কলাম গ্রিড: Row1 (Zone, Connection Type, Client Type, Package), Row2 (Protocol Type, From Left Date, To Left Date, Asgn.Cus.For), Row3 (Recovery Status, Recovered By)
- অ্যাকশন বাটন (Assign To Employee, Generate Excel, Generate Pdf) ফিল্টার কার্ডের ভিতরে ডানদিকে উপরে — filled/primary স্টাইল
- Date ফিল্ড সাধারণ Input "DD-MM-YYYY" placeholder সহ
- ফিল্টার প্যানেলের নিচে SHOW [100] ENTRIES (বামে) + SEARCH: ইনপুট (ডানে)

**টেবিল:**
- হেডার `bg-primary text-primary-foreground` (ডার্ক)
- "Recovered" ব্যাজ Connection Type কলামে সরানো
- Client Name এর পাশে সবুজ চ্যাট আইকন
- Action কলামে ৪টি আইকন (Delete, SMS, Edit, View) + ৩-ডট more menu
- পেজিনেশন যোগ

