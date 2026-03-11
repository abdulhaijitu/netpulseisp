

# Task Management > Tasks পেইজ — রেফারেন্স ইমেজ অনুযায়ী

## রেফারেন্স বিশ্লেষণ
ছবিতে: "Task — Add New Task" হেডার + breadcrumb (Task > Task Management)। Generate PDF / Generate CSV বাটন (বামে) + "+ Task" বাটন (ডানে)। ফিল্টার: Task Category, Zone, Assign To, Clients, From Date, To Date সিলেক্ট/ইনপুট। SHOW entries + SEARCH। টেবিল কলাম: TaskId, Task Name, Category, Zone, Client, Description, Complain Time, Status (Processing=সায়ান, Pending=কমলা badge + Edit/Delete আইকন), Created By, Last Updated By, Assign To (Re Assign বাটন + নাম badge + "+2" badge), Start Time, End Time। Static demo data।

## পরিবর্তন

### `src/pages/support/TaskManagementPage.tsx` — নতুন পেইজ
1. **হেডার**: আইকন + "Task" টাইটেল + "Add New Task" সাবটাইটেল + breadcrumb
2. **অ্যাকশন বার**: Generate PDF / Generate CSV বাটন (বামে) + "+ Task" বাটন (ডানে)
3. **ফিল্টার সেকশন**: Task Category, Zone, Assign To, Clients (select) + From Date, To Date (date input)
4. **SHOW entries + SEARCH বার**
5. **টেবিল**: TaskId, Task Name, Category, Zone, Client, Description, Complain Time, Status (Processing=সায়ান, Pending=কমলা badge + Edit/Delete আইকন), Created By, Last Updated By, Assign To (Re Assign/Assign বাটন + নাম badge + count badge), Start Time, End Time — horizontal scroll, ডার্ক হেডার
6. **Pagination ফুটার**
7. **New Task ডায়ালগ**: Task Name, Category, Zone, Client, Description, Priority, Assign To ফর্ম
8. **ডাটা**: Static demo data (ছবির ৪টি এন্ট্রি)

### `src/App.tsx` — রাউট আপডেট
`/dashboard/tasks` → `TaskManagementPage`

| ফাইল | কাজ |
|------|-----|
| `src/pages/support/TaskManagementPage.tsx` | নতুন |
| `src/App.tsx` | রাউট আপডেট |

