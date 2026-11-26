import { ClipboardList, Clock, ListOrdered, MapPin, UtensilsCrossed } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { RestaurantStatusBadge } from '@/features/merchant/components/restaurant-status-badge'
import type { RestaurantDto } from '@/features/merchant/types'
import { formatDate, formatPhone } from '@/lib/format'

const soon = (feature: string) => () => toast.info(`${feature} đang được xây dựng`)

const NEXT_STEPS = [
  {
    icon: UtensilsCrossed,
    title: 'Món ăn',
    description: 'Tạo món với ảnh, giá và mô tả để khách biết mình đang đặt gì.',
    action: 'Thêm món',
  },
  {
    icon: ListOrdered,
    title: 'Menu',
    description: 'Xếp món vào từng nhóm như món chính, đồ uống để khách chọn nhanh hơn.',
    action: 'Lên menu',
  },
  {
    icon: ClipboardList,
    title: 'Đơn hàng',
    description: 'Nhận và xử lý đơn khi quán đã mở bán.',
    action: 'Xem đơn hàng',
  },
]

/** Chủ quán đã có quán: tên và trạng thái quán, việc nên làm tiếp, thông tin đã khai báo. */
export function RestaurantOverview({ restaurant }: { restaurant: RestaurantDto }) {
  return (
    <div>
      <section className="rounded-3xl bg-aubergine px-6 py-9 text-white sm:px-10 sm:py-12">
        <RestaurantStatusBadge status={restaurant.status} />
        <h1 className="mt-4 break-words text-[40px] font-extrabold leading-[0.95] tracking-[-0.03em] sm:text-6xl">
          {restaurant.name}
        </h1>
        <p className="mt-4 flex max-w-xl items-start gap-2 text-sm text-white/60">
          <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
          {restaurant.address}
        </p>
      </section>

      {restaurant.status === 'PENDING' && (
        <p className="mt-4 flex items-start gap-2.5 rounded-xl bg-secondary px-4 py-3 text-sm">
          <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span>
            Ăn Gì đang duyệt quán của bạn. Khách chưa thấy quán cho tới khi được duyệt, trong lúc
            chờ bạn có thể chuẩn bị món và menu.
          </span>
        </p>
      )}

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <section aria-labelledby="next-steps-title">
          <h2 id="next-steps-title" className="text-2xl font-bold sm:text-[28px]">
            Việc tiếp theo
          </h2>
          <ul className="mt-5 divide-y border-y">
            {NEXT_STEPS.map(({ icon: Icon, title, description, action }) => (
              <li key={title} className="flex items-center gap-4 py-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-sans text-base font-semibold tracking-normal">{title}</h3>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p>
                </div>
                <Button variant="outline" size="sm" onClick={soon(action)}>
                  {action}
                </Button>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="restaurant-info-title">
          <h2 id="restaurant-info-title" className="text-2xl font-bold sm:text-[28px]">
            Thông tin quán
          </h2>
          <dl className="mt-5 divide-y border-y text-sm">
            <InfoRow label="Số điện thoại">{formatPhone(restaurant.phoneNumber)}</InfoRow>
            <InfoRow label="Giới thiệu">
              {restaurant.description ?? (
                <span className="text-muted-foreground">Chưa có giới thiệu</span>
              )}
            </InfoRow>
            <InfoRow label="Ngày tạo">{formatDate(restaurant.createdAt)}</InfoRow>
            <InfoRow label="Mã quán">
              <span className="tabular-nums">{restaurant.id}</span>
            </InfoRow>
          </dl>
        </section>
      </div>
    </div>
  )
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-3.5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="whitespace-pre-line break-words">{children}</dd>
    </div>
  )
}
