# src/api/generated

Thư mục này do **Orval** sinh ra từ OpenAPI của backend, **không sửa tay**.

```bash
# Backend (fd-auth-service...) phải đang chạy và bật springdoc-openapi
npm run api:gen
```

- Cấu hình: [`orval.config.ts`](../../../orval.config.ts) — mỗi microservice một khối, output vào `generated/<service>`.
- Mọi request đi qua [`mutator/custom-instance.ts`](../mutator/custom-instance.ts) (axios dùng chung).
- Khi đã có code sinh ra, thay các hàm viết tay trong `src/features/*/api/*.api.ts` bằng hook/hàm của Orval.
