# Ăn Gì (food-delivery-web)

Frontend đặt đồ ăn: Vite 5 + React 18 + TypeScript, Tailwind 3 + shadcn/ui. Cấu trúc thư mục và cách chạy
xem `README.md`.

## Giao diện: bắt buộc

Mọi việc tạo hoặc sửa giao diện (trang, component, màu, chữ, bố cục, chữ trên UI) phải:

1. **Đọc `docs/design/ui-guide.md` trước khi viết mã** và theo đúng token màu, font, thang chữ, bo góc,
   mẫu giao diện, giọng văn ghi trong đó.
2. Dùng skill `frontend-design` (có sẵn trong `.claude/skills/`) cho quy trình và nguyên tắc thiết kế:
   lên kế hoạch, tự soát, tránh kiểu template, chất lượng tối thiểu.
   **Khi skill và `ui-guide.md` mâu thuẫn, `ui-guide.md` thắng.** Không tự chọn bảng màu, font hay phong cách
   mới cho từng trang; "bản sắc riêng" của dự án đã được chốt trong `ui-guide.md`.
3. Dùng lại component trong `src/components/ui/` và `src/components/common/` trước khi viết mới.
   Không dùng hex hoặc màu Tailwind thô trong component.
4. Muốn thay đổi quy ước (thêm màu, đổi font, mẫu mới dùng lại được): hỏi người dùng trước, rồi cập nhật
   `ui-guide.md` và token trong cùng một thay đổi.

## Kiểm tra trước khi báo xong

```bash
npm run typecheck && npm run lint && npx prettier --check "src/**/*.{ts,tsx,css}" && npm run build
```

Mock bật mặc định khi dev (`VITE_USE_MOCK=true`), tài khoản thử `demo` / `matkhau123`.
