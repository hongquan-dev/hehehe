# Bàn giao: Khung frontend + 3 trang (login, register, home)

**Ngày:** 2026-11-11. **Thư mục:** `Food Delivery/hehehe` (chưa commit)

## Đã xong
- Khung dự án Vite 5 + React 18 + TS, feature-based (xem README mục "Cấu trúc"). Alias `@/` → `src/`.
- Đã cài và cấu hình: React Router 6 (bật cờ v7), Tailwind 3 + shadcn/ui (`components.json`), Lucide, TanStack
  Query + devtools, Zustand, Axios, Orval (`orval.config.ts`, mutator `src/api/mutator`), RHF + Zod,
  TanStack Table (`components/common/data-table.tsx`, chưa dùng ở trang nào), Motion, Prettier.
- Mock bật mặc định (`.env.development`: `VITE_USE_MOCK=true`). Tài khoản thử `demo` / `matkhau123`.
- Auth khớp `fd-auth-service`: envelope `ApiResponse`, cookie HttpOnly, `/auth/me`, interceptor refresh khi 401,
  quy tắc validate giống `AuthValidator`.
- Đã kiểm tra: `tsc`, `eslint`, `prettier --check`, `vite build` đều sạch. 21/21 luồng E2E qua Chrome headless
  (puppeteer-core cài trong scratchpad, không thêm vào project).

## Quyết định
- Node 18 → giữ React Router 6, Tailwind 3, Vite 5, `tailwind-merge@2`, `zod@3`.
- Bộ lọc trang chủ lưu trên URL (`q`, `cat`, `sort`, `freeship`, `top`, `fast`).
- Giỏ hàng chỉ chứa món của một quán. Thêm món quán khác thì hỏi "Tạo giỏ mới".
- Đăng ký xong tự gọi login (BE chỉ trả 201 + user).
- Proxy dev: `/api/**` → gateway `:8080`, bỏ tiền tố `/api`.

## Đang chờ
- API `fd-restaurant-service` cho danh mục/quán/món/voucher: đường dẫn trong `features/catalog/api/catalog.api.ts`
  là dự kiến.
- Kiểm tra gateway có route `/auth/**` → `:8081` không. Nếu chưa có, đổi `VITE_PROXY_TARGET`.
- Backend chưa xác nhận đã bật springdoc → chưa chạy `npm run api:gen`.
- Chưa có: trang chi tiết quán, thanh toán, đơn hàng (đặt dưới `ProtectedRoute`, xem comment trong `app/router.tsx`).
