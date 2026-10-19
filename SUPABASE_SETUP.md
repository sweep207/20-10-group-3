# Cấu hình Supabase cho lời chúc cộng đồng

Website dùng Supabase JS v2 từ CDN và kết nối đến project được cấu hình trong `script.js`.

## Bảng dữ liệu

Tạo bảng `public.wishes` với các cột:

- `id`: bigint identity, primary key
- `sender_name`: text, bắt buộc, 1–60 ký tự
- `message`: text, bắt buộc, 1–1000 ký tự
- `status`: text, mặc định `pending`, chỉ nhận `pending`, `approved`, `rejected`
- `created_at`: timestamptz, mặc định `now()`

Bật Row Level Security (RLS). Chỉ cho khách ẩn danh gửi lời chúc ở trạng thái `pending`, và chỉ đọc các lời chúc `approved`. Không cấp quyền UPDATE/DELETE cho vai trò `anon`.

## SQL tham khảo

```sql
create table if not exists public.wishes (
  id bigint generated always as identity primary key,
  sender_name text not null check (char_length(sender_name) between 1 and 60),
  message text not null check (char_length(message) between 1 and 1000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.wishes enable row level security;

drop policy if exists "Anyone can submit wishes" on public.wishes;
create policy "Anyone can submit wishes" on public.wishes
for insert to anon, authenticated
with check (status = 'pending');

drop policy if exists "Anyone can read approved wishes" on public.wishes;
create policy "Anyone can read approved wishes" on public.wishes
for select to anon, authenticated
using (status = 'approved');

revoke all on table public.wishes from anon, authenticated;
grant insert (sender_name, message, status) on public.wishes to anon, authenticated;
grant select (id, sender_name, message, status, created_at) on public.wishes to anon, authenticated;
grant usage, select on sequence public.wishes_id_seq to anon, authenticated;
```

> Nếu đã tạo bảng và policies trước đó, hãy đối chiếu quyền cột với đoạn SQL trên. Nếu muốn người gửi không thể tự đặt `status`, hãy chỉ cấp quyền INSERT cho `sender_name, message` và bỏ trường `status` khỏi payload trong `script.js`; giá trị mặc định của cột sẽ là `pending`.

## Duyệt lời chúc

Trong Supabase Dashboard → Table Editor → `wishes`, kiểm tra lời chúc rồi đổi `status` thành `approved` để công khai, hoặc `rejected` để từ chối. Không bật quyền sửa trạng thái cho người truy cập website.

## Khóa API

Chỉ sử dụng **publishable key** trong mã trình duyệt. Không bao giờ đưa `sb_secret_...` hoặc `service_role` key vào repository hay mã phía client. Publishable key không thay thế RLS; hãy giữ policies chặt chẽ.
