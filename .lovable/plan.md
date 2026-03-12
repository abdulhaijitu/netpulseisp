
# Portal Manage — Media Servers টেবিল ডিজাইন

## পরিবর্তন

### `src/pages/portal-manage/PortalManagePage.tsx`

**Media Servers সাব-ট্যাবের টেবিল তৈরি (রেফারেন্স ইমেজ অনুসারে):**

1. **ডেমো ডাটা যোগ:** `demoMediaServers` অ্যারে তৈরি — প্রতিটি আইটেমে `id`, `photo`, `title`, `category`, `mediaLink`, `details` থাকবে (ইমেজের মতো ৫-৬টি এন্ট্রি)

2. **"No media servers added yet" প্লেসহোল্ডার সরিয়ে টেবিল যোগ:**
   - SHOW entries + SEARCH বার (EntriesSearchBar কম্পোনেন্ট)
   - টেবিল কলাম: **Sr.** | **Photo** | **Title** | **Category** | **Media Link** | **Details** | **Action**
   - হেডার: `bg-primary text-primary-foreground` (বাকি টেবিলগুলোর মতো)
   - Photo কলামে ইমেজ প্লেসহোল্ডার/আইকন
   - Media Link কলামে ক্লিকযোগ্য লিঙ্ক (`text-blue-600`)
   - Action কলামে Edit (Pencil) + Delete (Trash2) বাটন
   - PaginationInfo যোগ

3. **স্টেট:** `mediaSearch`, `mediaPageSize` স্টেট MediaServersTab-এ যোগ
