# Công nghệ frontend

Tài liệu giới thiệu từng công nghệ: nó là gì, sinh ra để giải quyết vấn đề gì và các khái niệm cần nắm.
Mỗi mục có một ví dụ ngắn và tổng quát để thấy cách viết.

## Mục lục

1. [Tổng quan](#tổng-quan)
2. [Build & Core: Vite + React + TypeScript](#1-build--core-vite--react--typescript)
3. [Routing: React Router](#2-routing-react-router)
4. [UI & Styling: Tailwind CSS + shadcn/ui](#3-ui--styling-tailwind-css--shadcnui)
5. [Icons: Lucide React](#4-icons-lucide-react)
6. [Server State: TanStack Query](#5-server-state-tanstack-query)
7. [Client State: Zustand](#6-client-state-zustand)
8. [HTTP Client: Axios](#7-http-client-axios)
9. [API Type-Gen: Orval](#8-api-type-gen-orval)
10. [Form & Validate: React Hook Form + Zod](#9-form--validate-react-hook-form--zod)
11. [Data Grid: TanStack Table](#10-data-grid-tanstack-table)
12. [Animation: Motion](#11-animation-motion)
13. [Thuật ngữ](#thuật-ngữ)

---

## Tổng quan

| # | Mảng | Công nghệ | Một câu tóm tắt |
| --- | --- | --- | --- |
| 1 | Build & Core | Vite, React, TypeScript | Công cụ build, thư viện dựng giao diện và ngôn ngữ có kiểu tĩnh |
| 2 | Routing | React Router | Đổi trang theo URL mà không tải lại trình duyệt |
| 3 | UI & Styling | Tailwind CSS, shadcn/ui | Viết CSS bằng class tiện ích, kèm bộ component có sẵn mã nguồn |
| 4 | Icons | Lucide React | Bộ icon SVG dùng như component React |
| 5 | Server state | TanStack Query | Lấy, cache và đồng bộ dữ liệu từ server |
| 6 | Client state | Zustand | Lưu state dùng chung giữa các component |
| 7 | HTTP client | Axios | Gửi request HTTP |
| 8 | API type-gen | Orval | Sinh code gọi API và kiểu TypeScript từ tài liệu OpenAPI |
| 9 | Form | React Hook Form, Zod | Quản lý form và kiểm tra dữ liệu theo schema |
| 10 | Data grid | TanStack Table | Logic bảng: sắp xếp, lọc, phân trang |
| 11 | Animation | Motion | Tạo chuyển động cho component React |

Các công nghệ chia thành từng tầng, mỗi tầng lo một việc:

```
┌──────────────────────────────────────────────────────────────┐
│ Giao diện   React · Tailwind · shadcn/ui · Lucide · Motion   │
│             React Router (chọn trang theo URL)               │
├──────────────────────────────────────────────────────────────┤
│ Nhập liệu   React Hook Form + Zod                            │
│ Bảng        TanStack Table                                   │
├──────────────────────────────────────────────────────────────┤
│ State       TanStack Query (dữ liệu của server)              │
│             Zustand (dữ liệu chỉ có ở trình duyệt)           │
├──────────────────────────────────────────────────────────────┤
│ Gọi API     Axios  ◄── code do Orval sinh từ OpenAPI         │
├──────────────────────────────────────────────────────────────┤
│ Nền tảng    TypeScript (kiểu) · Vite (dev server, build)     │
└──────────────────────────────────────────────────────────────┘
```

---

## 1. Build & Core: Vite + React + TypeScript

### Vite

**Là gì:** công cụ build và dev server cho frontend, do Evan You (tác giả Vue) tạo ra. Vite không gắn với một
framework cụ thể: dùng được cho React, Vue, Svelte...

**Giải quyết vấn đề gì:** các bundler kiểu cũ (Webpack) phải gom toàn bộ mã nguồn thành bundle trước khi chạy,
nên dự án càng lớn thì khởi động dev server và cập nhật sau khi sửa code càng chậm.

**Khái niệm chính**

- **Native ES Modules khi dev:** trình duyệt tự tải từng file qua `import`. Vite chỉ biên dịch file nào được
  yêu cầu, nên dev server khởi động gần như tức thì.
- **Pre-bundling:** thư viện trong `node_modules` được gom sẵn một lần bằng esbuild (rất nhanh).
- **HMR (Hot Module Replacement):** sửa một file thì chỉ module đó được thay, trang không tải lại và state không mất.
- **Build production bằng Rollup:** tách code (code splitting), nén, đặt hash vào tên file để cache.
- **Biến môi trường:** đọc từ các file `.env*`. Chỉ biến có tiền tố `VITE_` được đưa xuống trình duyệt qua
  `import.meta.env`.
- **Plugin:** mở rộng bằng plugin (ví dụ `@vitejs/plugin-react` để hỗ trợ JSX và Fast Refresh).

### React

**Là gì:** thư viện JavaScript để dựng giao diện, do Meta phát triển. React chỉ lo phần hiển thị; routing,
gọi API và các phần khác do thư viện khác đảm nhận.

**Giải quyết vấn đề gì:** khi sửa DOM trực tiếp, mỗi lần dữ liệu đổi phải tự tìm và cập nhật đúng chỗ trên
giao diện. Với React, ta chỉ mô tả *giao diện trông thế nào với dữ liệu hiện tại*, còn React tự cập nhật DOM.

**Khái niệm chính**

- **Component:** hàm nhận `props` và trả về giao diện. Giao diện lớn được ghép từ nhiều component nhỏ.
- **JSX:** cú pháp giống HTML viết ngay trong JavaScript.
- **State:** dữ liệu của component. Khi state đổi, component render lại.
- **Hooks:** hàm bắt đầu bằng `use` để dùng các tính năng của React: `useState` (state), `useEffect`
  (tác dụng phụ như gọi API, gắn sự kiện), `useMemo` / `useCallback` (ghi nhớ giá trị),
  `useRef` (tham chiếu tới DOM), `useContext` (đọc context).
- **Một chiều dữ liệu:** dữ liệu đi từ cha xuống con qua props. Con báo ngược lên cha bằng callback.
- **Reconciliation:** React so sánh kết quả render mới với lần trước rồi chỉ cập nhật phần DOM thay đổi.

```tsx
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>Đã bấm {count} lần</button>
}
```

### TypeScript

**Là gì:** ngôn ngữ do Microsoft phát triển, là JavaScript cộng thêm hệ thống kiểu tĩnh. Mã TypeScript được
biên dịch ra JavaScript để chạy, và kiểu bị xoá hết khi chạy.

**Giải quyết vấn đề gì:** JavaScript chỉ báo lỗi kiểu khi chạy (ví dụ gọi thuộc tính của `undefined`).
TypeScript bắt các lỗi này ngay lúc viết code, và giúp editor gợi ý, đổi tên hay tìm chỗ dùng chính xác.

**Khái niệm chính**

- **Kiểu cơ bản:** `string`, `number`, `boolean`, mảng `T[]`, `null`/`undefined`, union `'a' | 'b'`.
- **`interface` / `type`:** mô tả hình dạng của object.
- **Generics:** viết kiểu tổng quát, ví dụ `Array<T>` hay `Promise<T>`.
- **Suy luận kiểu (inference):** nhiều chỗ không cần ghi kiểu, TypeScript tự suy ra.
- **Strict mode:** bật kiểm tra chặt, quan trọng nhất là bắt buộc xử lý trường hợp `null`/`undefined`.

```ts
interface User {
  id: number
  name: string
  role: 'ADMIN' | 'CUSTOMER'
}

function greet(user: User) {
  return `Xin chào ${user.name}` // user.nmae sẽ bị báo lỗi ngay khi gõ
}
```

---

## 2. Routing: React Router

**Là gì:** thư viện định tuyến (routing) phổ biến nhất cho React. Nó ánh xạ URL tới component cần hiển thị.

**Giải quyết vấn đề gì:** ứng dụng React là SPA (Single Page Application): chỉ có một trang HTML. React Router
cho phép đổi "trang" theo URL, giữ được nút Back/Forward và chia sẻ được link, mà không tải lại toàn bộ trình duyệt.

**Khái niệm chính**

- **Route:** cặp `path` → component.
- **Nested routes + `<Outlet />`:** route con hiển thị bên trong route cha. Nhờ đó nhiều trang dùng chung một
  layout (header, footer).
- **`<Link>` / `useNavigate()`:** chuyển trang bằng thẻ link hoặc bằng code.
- **`useParams()` / `useSearchParams()`:** đọc tham số trên đường dẫn (`/orders/:id`) và query string (`?q=pho`).
- **`<Navigate>`:** chuyển hướng, thường dùng để chặn trang khi chưa đăng nhập.
- **Data router** (từ v6.4, `createBrowserRouter`): route khai báo được `loader` (tải dữ liệu trước khi render),
  `action` (xử lý submit), `errorElement` và `lazy` (tách code theo trang).

**v6 và v7:** v7 gộp với framework Remix. Có hai cách dùng: *library mode* (gần như giống v6) và
*framework mode* (thêm SSR, routing theo file...). Từ v7, package chính là `react-router`, và v7 yêu cầu Node ≥ 20.

```tsx
const router = createBrowserRouter([
  {
    element: <Layout />, // chứa <Outlet />
    children: [
      { path: '/', element: <Home /> },
      { path: '/orders/:id', element: <OrderDetail /> },
    ],
  },
])
```

---

## 3. UI & Styling: Tailwind CSS + shadcn/ui

### Tailwind CSS

**Là gì:** framework CSS theo hướng *utility-first*: thay vì tự đặt tên class rồi viết CSS, ta ghép các class
nhỏ, mỗi class làm đúng một việc (`p-4`, `text-sm`, `bg-red-500`, `flex`).

**Giải quyết vấn đề gì:**

- Không phải nghĩ tên class hay nhảy qua lại giữa file JSX và file CSS.
- Không có CSS "chết" (viết ra nhưng không còn dùng): Tailwind quét mã nguồn và chỉ sinh CSS cho các class
  thực sự xuất hiện.
- Khoảng cách, màu, cỡ chữ... lấy từ một thang giá trị chung (design token), nên giao diện đồng nhất.

**Khái niệm chính**

- **Responsive:** tiền tố breakpoint, ví dụ `md:grid-cols-2` nghĩa là áp dụng từ màn hình `md` trở lên
  (mobile-first).
- **Trạng thái:** `hover:`, `focus-visible:`, `disabled:`, `dark:`, `group-hover:`...
- **Giá trị tuỳ ý:** `w-[320px]`, `bg-[#2B1B2E]` khi thang có sẵn không có giá trị cần dùng.
- **Theme:** mở rộng màu, font, breakpoint trong file cấu hình (v3), hoặc ngay trong CSS bằng `@theme` (v4).
- **`@apply`:** gom nhiều utility vào một class CSS khi thật cần.

```html
<button class="rounded-full bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700 md:px-8">
  Đặt món
</button>
```

### shadcn/ui

**Là gì:** bộ component giao diện (Button, Input, Dialog, Dropdown...) xây trên **Radix UI** và **Tailwind**.
Khác với thư viện thông thường, shadcn/ui **không được cài như một dependency**. CLI của nó **chép mã nguồn
component vào dự án**, nên mã đó thuộc về bạn và sửa tự do được.

**Giải quyết vấn đề gì:** thư viện UI đóng gói sẵn (MUI, Ant Design) rất khó tuỳ biến sâu và mang theo phong
cách riêng. Tự viết từ đầu thì dễ thiếu phần khó: điều hướng bằng bàn phím, quản lý focus, thuộc tính ARIA.
shadcn/ui cho sẵn phần khó (nhờ Radix) mà vẫn giữ toàn quyền sửa giao diện.

**Khái niệm chính**

- **Radix UI:** thư viện component *headless* (có logic và khả năng truy cập, không có style) như Dialog,
  Dropdown, Checkbox. shadcn/ui phủ style Tailwind lên trên.
- **CLI:** lệnh `npx shadcn add button` chép file component vào dự án. File `components.json` khai báo đường dẫn
  và cấu hình.
- **CSS variables cho theme:** màu được khai báo dạng biến (`--primary`, `--background`...). Đổi theme chỉ cần
  đổi giá trị biến.
- **`cva` (class-variance-authority):** khai báo các biến thể của component (`variant`, `size`).
- **`cn()`:** hàm ghép class, dùng `clsx` + `tailwind-merge` để class truyền vào sau ghi đè được class mặc định.

---

## 4. Icons: Lucide React

**Là gì:** bộ hơn một nghìn icon SVG mã nguồn mở, nét đều và cùng phong cách, phát triển tiếp từ Feather Icons.
`lucide-react` đóng gói mỗi icon thành một component React.

**Giải quyết vấn đề gì:** không phải tải font icon nặng hay quản lý từng file SVG. Chỉ icon nào được import
mới vào bundle (tree-shaking).

**Khái niệm chính**

- Mỗi icon là một component: `<Search />`, `<ShoppingBag />`.
- Tuỳ chỉnh bằng props `size`, `color`, `strokeWidth`, hoặc bằng `className` (ví dụ `size-4 text-red-500`).
  Icon mặc định dùng `currentColor`, tức là cùng màu với chữ xung quanh.
- Icon chỉ để trang trí nên có `aria-hidden`. Nút chỉ có icon cần `aria-label` để trình đọc màn hình đọc được.

```tsx
import { Search } from 'lucide-react'

<Search className="size-5 text-gray-500" aria-hidden />
```

---

## 5. Server State: TanStack Query

**Là gì:** thư viện quản lý **server state**, tức là dữ liệu mà "bản gốc" nằm trên server (danh sách quán,
thông tin người dùng...). Trước đây có tên React Query.

**Giải quyết vấn đề gì:** tự gọi API bằng `useEffect` + `useState` thì phải tự viết lại loading, lỗi, cache,
tránh gọi trùng, tải lại khi dữ liệu cũ, thử lại khi lỗi mạng... TanStack Query lo hết những việc này.

**Server state khác client state thế nào**

| | Server state | Client state |
| --- | --- | --- |
| Bản gốc nằm ở | Server | Trình duyệt |
| Có thể bị cũ không | Có (người khác sửa trên server) | Không |
| Cần tải bất đồng bộ | Có | Không |
| Ví dụ | Danh sách món, đơn hàng | Modal đang mở, giỏ hàng chưa gửi, theme |
| Công cụ | TanStack Query | Zustand, `useState` |

**Khái niệm chính**

- **Query:** đọc dữ liệu, gồm `queryKey` (khoá định danh, như một mảng) và `queryFn` (hàm trả về Promise).
  Mọi component dùng cùng `queryKey` sẽ dùng chung một bản cache.
- **Cache và stale-while-revalidate:** cache được trả ngay, rồi tải lại ngầm nếu dữ liệu đã "cũ".
- **`staleTime`:** bao lâu thì dữ liệu bị coi là cũ (mặc định 0). **`gcTime`:** bao lâu thì xoá cache không còn
  ai dùng (mặc định 5 phút).
- **Trạng thái:** `isPending`, `isError`, `isSuccess`, `isFetching` (đang tải, kể cả khi đã có dữ liệu cũ).
- **Mutation:** ghi dữ liệu (POST/PUT/DELETE) bằng `useMutation`, có `onSuccess` / `onError`.
- **Invalidation:** `queryClient.invalidateQueries({ queryKey })` đánh dấu dữ liệu là cũ để tải lại, thường
  gọi sau một mutation.
- **Tự động:** gộp các request trùng nhau, thử lại khi lỗi, tải lại khi focus lại cửa sổ hoặc có mạng trở lại.
- **Devtools:** công cụ xem cache và trạng thái từng query ngay trong trình duyệt.

```tsx
const { data, isPending, isError } = useQuery({
  queryKey: ['restaurants', { district: 'q1' }],
  queryFn: () => fetchRestaurants({ district: 'q1' }),
  staleTime: 60_000,
})

const createOrder = useMutation({
  mutationFn: postOrder,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
})
```

---

## 6. Client State: Zustand

**Là gì:** thư viện quản lý state rất nhỏ gọn (khoảng 1 KB), xây trên hooks.

**Giải quyết vấn đề gì:** khi nhiều component ở xa nhau cần dùng chung một state, truyền props qua nhiều tầng
rất rối (*prop drilling*). Context thì làm mọi component dùng context render lại khi giá trị đổi. Redux thì
phải viết nhiều code khung. Zustand đơn giản hơn cả ba cách này.

**Khái niệm chính**

- **Store:** tạo bằng `create()`, chứa cả state lẫn hàm cập nhật state (action).
- **Không cần Provider:** store là một hook, gọi được ở bất cứ đâu.
- **Selector:** `useStore((s) => s.count)`. Component chỉ render lại khi phần state mà nó chọn thay đổi.
- **Dùng ngoài React:** `useStore.getState()` và `useStore.setState()` gọi được trong hàm thường, ví dụ trong
  interceptor của HTTP client.
- **Middleware:** `persist` (lưu vào localStorage), `devtools` (xem bằng Redux DevTools), `immer` (sửa state
  theo kiểu mutable).

```ts
const useCounter = create<{ count: number; inc: () => void }>()((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}))

const count = useCounter((s) => s.count)
```

---

## 7. HTTP Client: Axios

**Là gì:** thư viện gửi request HTTP dựa trên Promise, chạy được cả ở trình duyệt lẫn Node.js.

**Giải quyết vấn đề gì:** `fetch` có sẵn nhưng còn thiếu một số tiện ích: phải tự `JSON.stringify` / `.json()`,
không báo lỗi khi server trả 4xx/5xx, không có interceptor, timeout phải tự cài.

**Khái niệm chính**

- **Instance:** `axios.create({ baseURL, timeout, headers })` tạo một client cấu hình sẵn để dùng chung.
- **Tự xử lý JSON:** body được tự chuyển thành JSON, response tự được parse.
- **Báo lỗi theo status:** response ngoài khoảng 2xx bị reject thành `AxiosError`, có `error.response`
  (status, data). Nếu không tới được server thì không có `response`.
- **Interceptors:** chặn mọi request hoặc response để xử lý chung: gắn header, chuẩn hoá lỗi, làm mới token khi
  gặp 401 rồi gửi lại request.
- **`withCredentials`:** cho phép gửi kèm cookie khi gọi khác origin.
- **Huỷ request:** truyền `signal` của `AbortController`.

```ts
const api = axios.create({ baseURL: '/api', timeout: 15_000 })

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      /* xử lý hết phiên đăng nhập */
    }
    return Promise.reject(error)
  },
)

const { data } = await api.get('/restaurants', { params: { page: 1 } })
```

---

## 8. API Type-Gen: Orval

**Là gì:** công cụ dòng lệnh **sinh code TypeScript từ tài liệu OpenAPI** (Swagger) của backend. Kết quả gồm
kiểu dữ liệu cho request/response, hàm gọi API, và nếu cấu hình thì có cả hook TanStack Query, schema Zod,
mock MSW.

**Giải quyết vấn đề gì:** viết tay kiểu dữ liệu và hàm gọi API cho từng endpoint vừa tốn công vừa dễ lệch với
backend. Backend đổi tên một field mà frontend không biết thì chỉ phát hiện khi chạy. Với Orval, khi backend đổi,
chỉ cần sinh lại code là TypeScript báo lỗi ở mọi chỗ bị ảnh hưởng.

**Khái niệm chính**

- **OpenAPI spec:** file JSON/YAML mô tả mọi endpoint, tham số và schema. Spring Boot sinh được file này bằng
  springdoc-openapi (thường ở `/v3/api-docs`).
- **`orval.config.ts`:** khai báo `input` (đường dẫn hoặc URL của spec) và `output` (thư mục đích, loại client).
- **`client`:** chọn kiểu code sinh ra, ví dụ `axios`, `fetch`, `react-query`, `zod`.
- **`mode`:** cách chia file: một file, tách theo tag, hoặc tách theo tag kèm thư mục.
- **Mutator:** hàm HTTP tuỳ chỉnh mà mọi code sinh ra sẽ gọi qua, để dùng chung axios instance (baseURL,
  interceptor).
- **Code sinh ra không sửa tay:** lần sinh sau sẽ ghi đè.

```bash
npx orval            # đọc orval.config.ts và sinh code
```

```ts
// Ví dụ code được sinh ra (rút gọn)
export const useGetRestaurantById = (id: number) =>
  useQuery({ queryKey: [`/restaurants/${id}`], queryFn: () => getRestaurantById(id) })
```

---

## 9. Form & Validate: React Hook Form + Zod

### React Hook Form

**Là gì:** thư viện quản lý form cho React, chú trọng hiệu năng và ít code.

**Giải quyết vấn đề gì:** nếu mỗi input là một `useState`, cả form render lại sau mỗi phím gõ, và phải tự viết
lại phần theo dõi lỗi, ô đã chạm (touched), trạng thái đang gửi... React Hook Form dùng **uncontrolled input**
(đọc giá trị qua ref), nên gần như không gây render lại.

**Khái niệm chính**

- **`useForm()`:** tạo form, trả về `register`, `handleSubmit`, `formState` (`errors`, `isSubmitting`,
  `isDirty`...), `setValue`, `setError`, `reset`, `watch`.
- **`register('name')`:** gắn một input thường vào form.
- **`Controller`:** bọc các component kiểu controlled (checkbox tuỳ biến, select, date picker).
- **`mode`:** thời điểm kiểm tra dữ liệu: `onSubmit` (mặc định), `onBlur`, `onChange`, `onTouched`.
- **`resolver`:** giao việc kiểm tra cho một thư viện schema (Zod, Yup...) thay vì khai báo luật trên từng input.
- **`setError`:** gắn lỗi từ server vào đúng ô input.

### Zod

**Là gì:** thư viện khai báo **schema** và **kiểm tra dữ liệu lúc chạy**, thiết kế cho TypeScript.

**Giải quyết vấn đề gì:** kiểu TypeScript bị xoá khi chạy, nên không thể dùng để kiểm tra dữ liệu người dùng
nhập hay dữ liệu từ API trả về. Zod kiểm tra được lúc chạy, và **suy ra luôn kiểu TypeScript từ schema**, nên
chỉ cần khai báo một lần.

**Khái niệm chính**

- **Schema:** `z.string()`, `z.number()`, `z.object({...})`, `z.enum([...])`, `z.array(...)`, `.optional()`.
- **Ràng buộc:** `.min()`, `.max()`, `.email()`, `.regex()`, kèm thông báo lỗi tuỳ chỉnh.
- **`.refine()`:** luật tự viết, ví dụ hai mật khẩu phải khớp.
- **`.transform()`:** biến đổi dữ liệu trong lúc parse (trim, chuyển chữ thường, chuẩn hoá số điện thoại).
- **`parse` / `safeParse`:** `parse` ném lỗi khi dữ liệu sai, `safeParse` trả về `{ success, data | error }`.
- **`z.infer<typeof schema>`:** lấy ra kiểu TypeScript từ schema.

### Kết hợp hai thư viện

`@hookform/resolvers` nối Zod vào React Hook Form: schema Zod vừa là luật kiểm tra của form, vừa là nguồn của kiểu
dữ liệu form.

```tsx
const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Ít nhất 8 ký tự'),
})
type FormValues = z.infer<typeof schema>

const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
  resolver: zodResolver(schema),
})

<form onSubmit={handleSubmit((values) => login(values))}>
  <input {...register('email')} />
  {errors.email && <p>{errors.email.message}</p>}
</form>
```

---

## 10. Data Grid: TanStack Table

**Là gì:** thư viện **headless** để xây bảng dữ liệu. Nó chỉ cung cấp logic (sắp xếp, lọc, phân trang, chọn
dòng, nhóm, ẩn/hiện cột), còn thẻ HTML và style do ta tự viết. Thư viện không phụ thuộc framework, có adapter
cho React, Vue, Solid, Svelte...

**Giải quyết vấn đề gì:** các component bảng dựng sẵn thường khó đổi giao diện cho khớp design. Tự viết logic
sắp xếp, lọc, phân trang thì dài và dễ sai. TanStack Table tách hai phần này ra: logic có sẵn, giao diện tự do.

**Khái niệm chính**

- **`ColumnDef`:** định nghĩa cột, gồm `accessorKey` hoặc `accessorFn` (lấy dữ liệu), `header`,
  `cell` (cách hiển thị ô).
- **`useReactTable({ data, columns, ... })`:** tạo đối tượng `table` chứa toàn bộ state và API của bảng.
- **Row models:** bật tính năng bằng cách truyền hàm, ví dụ `getCoreRowModel()`, `getSortedRowModel()`,
  `getFilteredRowModel()`, `getPaginationRowModel()`. Không dùng thì không phải tải.
- **`flexRender`:** render `header` / `cell`, dù đó là chuỗi hay component.
- **State tự quản hoặc controlled:** `sorting`, `pagination`, `columnFilters`... có thể để thư viện tự giữ, hoặc
  tự giữ bằng state riêng để đồng bộ với URL hay server.
- **Xử lý phía server:** bật `manualPagination` / `manualSorting` khi việc lọc và phân trang làm ở backend.

```tsx
const columns: ColumnDef<Order>[] = [
  { accessorKey: 'code', header: 'Mã đơn' },
  { accessorKey: 'total', header: 'Tổng tiền', cell: ({ getValue }) => formatVnd(getValue<number>()) },
]

const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

table.getRowModel().rows.map((row) =>
  row.getVisibleCells().map((cell) => flexRender(cell.column.columnDef.cell, cell.getContext())),
)
```

---

## 11. Animation: Motion

**Là gì:** thư viện animation cho React, trước đây tên là **Framer Motion**. Cuối năm 2024 thư viện tách khỏi
Framer và đổi tên thành **Motion** (package `motion`, import từ `motion/react`). API gần như giữ nguyên.

**Giải quyết vấn đề gì:** CSS transition không làm được animation khi phần tử *bị gỡ khỏi DOM*, không tự tính
được chuyển động khi bố cục thay đổi, và khó tạo chuyển động vật lý (spring) tự nhiên. Motion làm được những
việc này chỉ bằng props khai báo.

**Khái niệm chính**

- **`motion.<thẻ>`:** `motion.div`, `motion.button`... là thẻ HTML thường nhưng nhận thêm props animation.
- **`initial` / `animate` / `exit`:** trạng thái ban đầu, trạng thái đích và trạng thái khi bị gỡ.
- **`transition`:** thời lượng, độ trễ, easing, hoặc `type: 'spring'` với `stiffness` và `damping`.
- **`<AnimatePresence>`:** giữ phần tử lại cho tới khi animation `exit` chạy xong rồi mới gỡ khỏi DOM.
- **Layout animation:** thêm prop `layout` thì phần tử tự chuyển động mượt khi vị trí hoặc kích thước đổi.
- **Gesture:** `whileHover`, `whileTap`, `drag`.
- **Variants:** đặt tên cho các trạng thái animation và điều phối animation giữa component cha và con.
- **Tôn trọng người dùng:** `useReducedMotion()` và `MotionConfig reducedMotion="user"` giảm chuyển động cho
  người đã bật tuỳ chọn "giảm chuyển động" trong hệ điều hành.

```tsx
<AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    />
  )}
</AnimatePresence>
```

---

## Thuật ngữ

| Thuật ngữ | Nghĩa |
| --- | --- |
| SPA | Single Page Application: chỉ tải một trang HTML, các lần đổi trang sau đó do JavaScript xử lý |
| Bundle | File JavaScript/CSS đã gom và nén để đưa lên production |
| Code splitting | Tách bundle thành nhiều phần, chỉ tải phần cần cho trang đang xem |
| Tree-shaking | Loại bỏ code được import nhưng không dùng tới khi build |
| HMR | Thay module đang chạy mà không tải lại trang |
| Headless | Thư viện chỉ có logic, không có giao diện, ta tự viết phần hiển thị |
| Controlled / Uncontrolled | Input do state React giữ giá trị / input tự giữ giá trị trong DOM |
| Cache | Bản lưu tạm của dữ liệu để không phải tải lại |
| Stale | Dữ liệu trong cache được coi là có thể đã cũ và nên tải lại |
| Interceptor | Hàm chạy trước mỗi request hoặc sau mỗi response để xử lý chung |
| Schema | Bản mô tả cấu trúc và ràng buộc của dữ liệu |
| OpenAPI | Chuẩn mô tả REST API bằng JSON/YAML (tên cũ: Swagger) |
| Design token | Giá trị thiết kế dùng chung: màu, khoảng cách, cỡ chữ, bo góc |
| ARIA | Thuộc tính HTML giúp trình đọc màn hình hiểu giao diện |
