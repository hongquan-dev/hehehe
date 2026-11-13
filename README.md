# Ăn Gì — Food Delivery Web

Frontend của hệ thống giao đồ ăn (backend: Spring Boot microservices trong `../hahaha`).

| Mảng | Công nghệ |
| --- | --- |
| Build & core | Vite 5 + React 18 + TypeScript |
| Routing | React Router 6 (đã bật cờ `future` của v7) |
| UI | Tailwind CSS 3 + shadcn/ui (Radix) + Lucide |
| Server state | TanStack Query 5 + Axios |
| Client state | Zustand |
| API type-gen | Orval (`npm run api:gen`) |
| Form | React Hook Form + Zod |
| Bảng dữ liệu | TanStack Table (`components/common/data-table.tsx`) |
| Animation | Motion (`motion/react`) |

> Máy đang dùng **Node 18**, nên React Router, Tailwind và Vite được giữ ở major chạy được trên Node 18.
> Khi lên Node ≥ 20 có thể nâng React Router 7, Tailwind 4 và Vite 6/7.

## Chạy

```bash
npm install
npm run dev          # http://localhost:5173
```

Mặc định `VITE_USE_MOCK=false` (`.env.development`), nên app gọi **backend thật**. Chỉ cần chạy trước
`fd-auth-service` (:8081, cần PostgreSQL) trong `../hahaha`. Mọi request `/api/**` được Vite proxy thẳng tới
`fd-auth-service` (`VITE_PROXY_TARGET`) sau khi bỏ tiền tố `/api`; cookie `refresh_token` (`Path=/auth`) được đổi
thành `Path=/api/auth` để trình duyệt gửi kèm. Vì frontend và API chạy cùng origin nên cookie HttpOnly của
`fd-auth-service` hoạt động, không gặp lỗi CORS.

Khi frontend gọi thêm service khác (order, restaurant...), đổi `VITE_PROXY_TARGET` sang `fd-gateway-service`
(`http://localhost:8080`) để một proxy chuyển tới mọi service.

Sau khi đăng nhập, trang chủ là trang kiểm tra phiên: gọi API thử `GET /auth/test/ping`, làm mới phiên bằng
`POST /auth/refresh`, đếm ngược thời hạn access token và ghi nhật ký request. Muốn thấy access token hết hạn
nhanh, đặt `auth.jwt.access-ttl=1m` trong `application.properties` của `fd-auth-service` khi thử.

Chạy không cần backend: tạo file `.env.local` với `VITE_USE_MOCK=true`, app dùng **dữ liệu giả**.
Tài khoản thử: `demo` / `matkhau123` (đăng nhập bằng `demo@angi.vn` hoặc `0901 234 567` cũng được).
Tài khoản `bi.khoa` / `matkhau123` dùng để thử trường hợp tài khoản bị khoá.

| Lệnh | Việc |
| --- | --- |
| `npm run build` | typecheck + build production |
| `npm run lint` / `npm run format` | ESLint / Prettier (tự sắp xếp class Tailwind) |
| `npm run api:gen` | sinh client + hook React Query từ OpenAPI (backend phải đang chạy và bật springdoc) |

## Cấu trúc

```
src/
├── app/                 # Khởi tạo app: providers, router, trang lỗi
├── api/
│   ├── generated/       # Code do Orval sinh (không sửa tay)
│   └── mutator/         # customInstance: Orval gọi qua axios dùng chung
├── assets/              # Ảnh, SVG import trong code
├── components/
│   ├── ui/              # shadcn/ui (chỉ chỉnh style, không chứa logic nghiệp vụ)
│   ├── common/          # Component dùng chung: Logo, FoodImage, DataTable...
│   └── layout/          # MainLayout, AuthLayout, header, footer
├── config/              # env.ts (biến môi trường có kiểu), site.ts
├── features/            # Mỗi nghiệp vụ một thư mục, tự chứa
│   ├── auth/            #   api/ hooks/ store/ components/ schemas.ts types.ts
│   ├── catalog/         #   quán, món, danh mục, voucher
│   └── cart/            #   giỏ hàng (Zustand + localStorage)
├── hooks/               # Hook dùng chung: useDebounce, useMealTime
├── lib/                 # http (axios + refresh token), api-error, query-client, format, utils
├── mocks/               # Dữ liệu giả + handler giả lập backend
├── pages/               # Một file cho mỗi route, chỉ ghép các component của feature
├── routes/              # paths, ProtectedRoute / GuestRoute
├── stores/              # Store Zustand dùng chung nhiều feature (địa chỉ giao)
├── styles/              # globals.css: token màu (CSS variables) cho shadcn
└── types/               # Kiểu dùng chung: ApiResponse<T> khớp backend
```

**Quy ước**

- `pages/` chỉ ghép component lại, logic nằm trong `features/*`. Một feature không import nội bộ feature khác,
  trừ store và kiểu dữ liệu.
- Server state (dữ liệu từ API) dùng **TanStack Query**. **Zustand** chỉ giữ state thuần client (đăng nhập, giỏ,
  địa chỉ). Không copy dữ liệu từ API vào Zustand.
- Mỗi `features/*/api/*.api.ts` có 2 bản cùng chữ ký: gọi HTTP thật và mock. `env.useMock` quyết định dùng bản nào.
  Khi có code Orval thì thay bản HTTP, hook và component giữ nguyên.
- Lỗi luôn là `ApiError` (`status`, `code`, `fieldErrors`). Dùng `applyApiErrors(form, error)` để hiện lỗi
  của backend dưới đúng ô input.
- Không lưu token. Access/refresh token nằm trong cookie HttpOnly, trạng thái đăng nhập lấy từ `GET /auth/me`.
  Khi một request bị 401, interceptor gọi `/auth/refresh` một lần rồi gửi lại request.
- Thêm component shadcn: `npx shadcn@2.3.0 add <tên>` (bản CLI còn hỗ trợ Tailwind 3), cấu hình trong `components.json`.

## Trang hiện có

| Route | Trang | Ghi chú |
| --- | --- | --- |
| `/` | Trang chủ | Tìm kiếm, voucher, món bán chạy, danh sách quán có lọc/sắp xếp (lưu trên URL), giỏ hàng |
| `/login` | Đăng nhập | username / email / SĐT; lỗi theo field, `INVALID_CREDENTIALS`, `ACCOUNT_DISABLED` |
| `/register` | Đăng ký | Validate giống `AuthValidator`; đăng ký xong tự đăng nhập |

API của `fd-restaurant-service` trong `features/catalog/api/catalog.api.ts` mới là đường dẫn **dự kiến**. Cần
sửa lại cho khớp khi backend xong.
