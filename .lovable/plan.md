

# Dashboard থেকে Alert Banner সরানো

ছবিতে দেখা যাচ্ছে "Collect payments faster" এবং "connections suspended" ব্যানার দুটি — এগুলো Dashboard থেকে সরাতে হবে।

## পরিবর্তন

### `src/pages/Dashboard.tsx`
- `AlertBanner` import এবং দুটি contextual guidance banner JSX block মুছে ফেলা হবে
- `hasNoPaymentGateway` এবং `autoSuspendDays` ভ্যারিয়েবলও সরানো হবে (আর প্রয়োজন নেই)

| ফাইল | কাজ |
|---|---|
| `src/pages/Dashboard.tsx` | ২টি AlertBanner ব্লক ও সংশ্লিষ্ট ভ্যারিয়েবল সরানো |

