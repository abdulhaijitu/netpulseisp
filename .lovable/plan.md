

# Client List থেকে "Add New Client" বাটন সরানো

## পরিবর্তন

### `src/pages/Customers.tsx`
- পেজ হেডার থেকে "Add New Client" বাটন সরিয়ে ফেলা হবে
- সংশ্লিষ্ট `handleAddCustomer` ফাংশন, `formDialogOpen`, `formMode`, `selectedCustomer` স্টেট, `CustomerFormDialog` কম্পোনেন্ট এবং `handleFormSubmit` ফাংশন রিমুভ করা হবে (যদি শুধুমাত্র Add-এর জন্য ব্যবহৃত হয়)
- Edit ফাংশনালিটি থাকায় `CustomerFormDialog` ও সংশ্লিষ্ট স্টেট রেখে দেওয়া হবে, শুধু Add বাটন সরানো হবে

