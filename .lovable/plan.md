

# System > Email Setup পেইজ রিডিজাইন

## রেফারেন্স বিশ্লেষণ
ছবিতে একটি SMTP-স্টাইল Email Setup পেইজ দেখা যাচ্ছে:
- Mail Protocol সিলেকশন (Mail / SMTP radio)
- 2-column grid: Host + Port, Username + Password, Mail From Name + Mail From Email
- Encryption select (SSL/TLS/None)
- Save বাটন

## বর্তমান অবস্থা
`EmailSettings.tsx` বর্তমানে শুধু Resend API Key ও Sender Email — সিম্পল ডিজাইন।

## পরিবর্তন

### `src/components/settings/EmailSettings.tsx` — সম্পূর্ণ রিডিজাইন

ছবির মতো SMTP কনফিগারেশন ফর্ম তৈরি:

1. **হেডার কার্ড**: Mail আইকন + "Email Setup" + subtitle "Email Settings/Configuration"
2. **Mail Protocol**: RadioGroup — Mail / SMTP (SMTP selected by default)
3. **SMTP Fields** (2-column grid, bordered card with dark header):
   - Host + Port
   - Username + Password (eye toggle)
   - Mail From Name + Mail From Email
   - Encryption (Select: SSL / TLS / None)
4. **Save বাটন** (ডান পাশে aligned)
5. **Email Features কার্ড** — বর্তমান features list বজায় থাকবে
6. Local state — কোনো DB পরিবর্তন নেই

| ফাইল | কাজ |
|---|---|
| `src/components/settings/EmailSettings.tsx` | রিডিজাইন |

