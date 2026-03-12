

# Portal Manage — "Add News & Events" মোডাল তৈরি

## পরিবর্তন

### `src/pages/portal-manage/PortalManagePage.tsx`

**NewsEventsTab-এ Dialog যোগ (রেফারেন্স ইমেজ অনুসারে):**

1. **স্টেট যোগ:** `newsDialogOpen`, `newsTitle`, `newsDetails`, `newsImages` স্টেট
2. **"+ News & Events" বাটনে `onClick`** দিয়ে মোডাল ওপেন
3. **মোডাল ডিজাইন:**
   - হেডার: "Add News & Events" — `bg-primary text-primary-foreground`
   - ফর্ম ফিল্ড:
     - **NEWS & EVENTS TITLE** (required, Input)
     - **NEWS & EVENTS DETAILS** (required, Textarea)
     - **NEWS & EVENTS IMAGES** (required, file input + Plus বাটন)
   - লেবেল: bold uppercase + লাল asterisk
   - ফুটার: "Cancel" (লাল আউটলাইন, X আইকন) বামে + "Submit" (আউটলাইন, Check আইকন) ডানে
4. আগের মোডালগুলোর একই প্যাটার্ন অনুসরণ

