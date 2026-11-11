# Quy ước giao diện "Ăn Gì"

Tài liệu này ghi lại các lựa chọn thiết kế **đã chốt** của dự án. Mọi trang mới phải theo đúng quy ước này
để giao diện đồng nhất, bất kể ai làm hay dùng công cụ gì.

Nguồn gốc của token: `src/styles/globals.css` (biến CSS) và `tailwind.config.ts` (ánh xạ sang class).
Khi tài liệu và mã lệch nhau, mã là chuẩn. Cập nhật tài liệu này trong cùng commit với thay đổi token.

## 1. Tinh thần thiết kế

- Chủ đề: đặt đồ ăn giao tận nơi cho người dùng Việt Nam. Giao diện ấm, thèm ăn, nhanh gọn, không giống SaaS.
- Ảnh món ăn là nhân vật chính. Khung xung quanh tiết chế để ảnh nổi bật.
- Mỗi trang chỉ có **một** điểm nhấn táo bạo (vd: hero nền cà tím với chữ cực lớn và đĩa món xoay ở trang chủ).
  Phần còn lại yên tĩnh, kỷ luật.
- Không dùng: chữ IN HOA làm nhãn, nhãn nhỏ phía trên mọi tiêu đề, tô màu riêng một từ trong tiêu đề,
  đánh số 01/02/03 khi nội dung không phải là các bước, gradient trang trí, mũi tên "→" sau chữ trong nút.

## 2. Màu

Bảng màu thương hiệu lấy từ nguyên liệu bếp Việt:

| Token | Hex | Class | Dùng cho |
|---|---|---|---|
| `--chili` | `#E5372B` | `bg-primary`, `text-primary`, `bg-chili` | Hành động chính (nút đặt, tìm), vòng focus |
| `--aubergine` | `#2B1B2E` | `bg-aubergine`, `text-aubergine` | Khối nền đậm (hero, footer, aside đăng nhập), chữ trên nền nghệ |
| `--aubergine-soft` | | `bg-aubergine-soft` | Bề mặt phụ trên nền cà tím |
| `--turmeric` | `#F4B400` | `bg-turmeric`, `fill-turmeric` | Sao đánh giá, nhãn khuyến mãi, chú thích giá trên ảnh |
| `--basil` | `#1F6F4A` | `text-basil`, `bg-basil/10` | Miễn phí giao, trạng thái thành công |

Quy tắc:
- **Luôn dùng token**, không viết hex hay màu Tailwind thô (`red-500`, `gray-600`...) trong component.
- Chữ trên nền nghệ luôn là `text-aubergine` (không dùng trắng: thiếu tương phản).
- Chữ phụ dùng `text-muted-foreground`. Trên nền cà tím dùng `text-white/60` cho chữ phụ.
- Nền xám nhạt cho khối phụ, hover: `bg-secondary`. Viền: `border` (đã mặc định `border-border`).
- Đã có sẵn token cho chế độ tối (`.dark`) nhưng chưa bật. Dùng token thì sau này bật dark mode không phải sửa.

## 3. Chữ

| Vai trò | Font | Class |
|---|---|---|
| Nội dung, nhãn, nút | Be Vietnam Pro 400/500/600/700 | `font-sans` (mặc định của `body`) |
| Tiêu đề, số nổi bật, mã giảm giá | Bricolage Grotesque 600/700/800 | `font-display` (mặc định cho `h1`–`h3`) |

Font tải từ Google Fonts trong `index.html`. Không thêm font khác.

Thang chữ đang dùng:

| Chỗ dùng | Class |
|---|---|
| Tiêu đề hero | `text-[52px] sm:text-7xl lg:text-[88px] font-extrabold leading-[0.95] tracking-[-0.03em]` |
| H1 trang (đăng nhập, đăng ký) | `text-3xl sm:text-4xl font-extrabold` |
| H2 mục trong trang | `text-2xl sm:text-[28px] font-bold` |
| Tiêu đề trạng thái trống/lỗi | `font-display text-lg font-bold` |
| Tên trong thẻ (quán, món) | `h3` với `font-sans text-base font-semibold tracking-normal` (thẻ dùng font nội dung) |
| Nội dung | `text-[15px]` (ô nhập), `text-sm` |
| Thông tin phụ trong thẻ | `text-[13px] text-muted-foreground` |
| Chú thích nhỏ | `text-xs` |

Viết hoa kiểu câu (chỉ chữ đầu), dòng chữ không quá ~80 ký tự (`max-w-xl` cho đoạn văn).

## 4. Bo góc, khoảng cách, bóng

| Thành phần | Bo góc |
|---|---|
| Nút, chip lọc/gợi ý, ô tìm kiếm lớn, avatar | `rounded-full` |
| Ô nhập (`Input`), cảnh báo form, mục menu, ảnh thu nhỏ | `rounded-xl` |
| Ảnh bìa quán/món, vé khuyến mãi | `rounded-2xl` |
| Khối trạng thái trống/lỗi, thẻ nổi lớn, mép trên `Sheet` | `rounded-3xl` |
| Badge | `rounded-md` |

- Bố cục trang dùng `container` (căn giữa, rộng tối đa 1280px, lề 1rem / 1.5rem từ `md`).
- Khoảng cách giữa các mục trang chủ: `pt-12`. Tiêu đề mục cách nội dung `mt-5`.
- Chiều cao điều khiển: `h-11` (nút mặc định, ô nhập), `h-9` (nút nhỏ), `h-12` (nút lớn).
- Bóng: hạn chế. Thẻ quán/món **không** có khung hay bóng: ảnh bo góc + chữ bên dưới. Bóng đậm chỉ cho
  phần tử nổi trên nền đậm (ô tìm kiếm hero, đĩa món).

## 5. Thành phần dùng chung

Dùng lại trước, tự viết sau. Component shadcn/ui ở `src/components/ui/` (style `new-york`, đã chỉnh theo token):

- `Button`: biến thể `default` (ớt, cho hành động chính, mỗi vùng chỉ một), `outline`, `secondary`, `ghost`, `link`,
  `destructive`. Kích thước `sm` / `default` / `lg` / `icon`.
- `Badge`: thêm biến thể riêng `promo` (nghệ) và `freeship` (húng quế nhạt).
- `Input`, `Form` (RHF + Zod), `Sheet` (ngăn kéo giỏ hàng, trượt từ dưới trên di động), `DropdownMenu`,
  `Skeleton`, `Avatar`, `Checkbox`, `Separator`, Toast qua `sonner`.
- Riêng của dự án (`src/components/common/`): `FoodImage` (ảnh món có trạng thái lỗi hiển thị icon dao nĩa),
  `Logo`, `PageLoader`, `DataTable`.

Thêm component shadcn mới: `npx shadcn@latest add <tên>` rồi chỉnh class cho khớp bảng bo góc và token ở trên.
Icon chỉ dùng `lucide-react`, cỡ `size-4` (trong nút) hoặc `size-3.5` (dòng thông tin trong thẻ),
icon trang trí có `aria-hidden`.

## 6. Mẫu giao diện lặp lại

- **Thẻ quán/món**: ảnh `aspect-[4/3] rounded-2xl`, hover phóng nhẹ `group-hover:scale-[1.02]`; nhãn khuyến mãi
  góc trên trái (nghệ); dòng thông tin gồm sao (nghệ) + thời gian + khoảng cách; phí giao bằng 0 thì ghi
  "Miễn phí giao" màu húng quế. Quán đóng cửa: `opacity-70` + ảnh `grayscale` + dải thông báo giờ mở lại.
  Cả thẻ bấm được bằng link phủ (`after:absolute after:inset-0`).
- **Đang tải**: luôn có `Skeleton` cùng hình dạng với nội dung thật, không dùng spinner cho danh sách.
- **Trống**: khối `rounded-3xl bg-secondary px-6 py-14 text-center`, tiêu đề nói điều gì đang xảy ra,
  dòng dưới chỉ cách xử lý (vd: "Bỏ bớt bộ lọc hoặc thử tên món khác").
- **Lỗi tải**: khối `rounded-3xl border border-dashed`, tiêu đề dạng "Chưa tải được ...", có nút thử lại.
- **Danh sách cuộn ngang trên di động**: `scrollbar-none snap-x overflow-x-auto -mx-4 px-4`, chuyển sang lưới từ `md`.
- **Tính năng chưa có**: `toast.info('<Tính năng> đang được xây dựng')`.

## 7. Chuyển động

- Thư viện: `motion/react`. Luôn kiểm tra `useReducedMotion()` (CSS toàn cục cũng đã tắt animation khi người
  dùng bật giảm chuyển động).
- Mỗi trang tối đa một màn chuyển động tự chạy (vd: tiêu đề hero hiện lên + đĩa món xoay vào).
  Không thêm hiệu ứng fade/trượt cho từng mục khi cuộn.
- Chuyển động phản hồi thao tác (mở giỏ, thêm món, xác nhận) thì được khuyến khích.
- Easing chuẩn: `[0.22, 1, 0.36, 1]`, thời lượng 0.2–0.6s.

## 8. Chữ trên giao diện

- Tiếng Việt, xưng "bạn", giọng thân thiện, ngắn. Nói theo góc nhìn người dùng, không dùng thuật ngữ kỹ thuật.
- Nút ghi rõ hành động: "Tìm", "Đặt món", "Sao chép", không ghi "Gửi" / "OK".
- Cùng một hành động giữ cùng một tên: nút "Đăng xuất" → toast "Đã đăng xuất".
- Lỗi nói rõ chuyện gì xảy ra và cách sửa, không xin lỗi, không mơ hồ.
- Tiền định dạng bằng `formatCurrency` (`src/lib/format.ts`, kiểu `60.000 ₫`), khoảng cách bằng `formatDistance`,
  số lớn bằng `formatCompact`. Không tự ghép chuỗi tiền tệ.
- Khoảng số dùng gạch nối ngắn: `20–30 phút`.

## 9. Mức chất lượng tối thiểu

- Chạy tốt từ 360px trở lên, không cuộn ngang trang.
- Mọi phần tử bấm được có vòng focus nhìn thấy (`focus-visible:ring-2 focus-visible:ring-ring`).
- Ảnh có `alt` (ảnh trang trí để `alt=""`), ô nhập có `label` (có thể `sr-only`).
- Tương phản chữ đạt WCAG AA. Kiểm tra lại khi đặt chữ lên ảnh hoặc nền nghệ.
