import { useLocation, useNavigate } from 'react-router-dom'
import { Minus, Plus, Store, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import emptyBag from '@/assets/illustrations/empty-bag.svg'
import { FoodImage } from '@/components/common/food-image'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { selectCartCount, selectCartSubtotal, useCartStore } from '@/features/cart/store/cart.store'
import { formatCurrency } from '@/lib/format'
import { paths } from '@/routes/paths'

export function CartSheet() {
  const navigate = useNavigate()
  const location = useLocation()
  const { items, isOpen, setOpen, setQuantity, clear } = useCartStore()
  const count = useCartStore(selectCartCount)
  const subtotal = useCartStore(selectCartSubtotal)
  const authStatus = useAuthStore((s) => s.status)
  const restaurantName = items[0]?.dish.restaurantName

  const checkout = () => {
    if (authStatus !== 'authenticated') {
      setOpen(false)
      toast.info('Đăng nhập để đặt món', { description: 'Giỏ hàng của bạn vẫn được giữ nguyên.' })
      navigate(paths.login, { state: { from: location } })
      return
    }
    toast.info('Bước thanh toán đang được xây dựng', {
      description: 'Đơn sẽ được gửi tới fd-order-service.',
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="gap-0 p-0">
        <SheetHeader className="pb-4">
          <SheetTitle>Giỏ hàng</SheetTitle>
          <SheetDescription className="flex items-center gap-1.5">
            {restaurantName ? (
              <>
                <Store className="size-4" aria-hidden /> {restaurantName}
              </>
            ) : (
              'Chưa có món nào'
            )}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <img src={emptyBag} alt="" className="w-40" />
            <div className="space-y-1">
              <p className="font-display text-lg font-bold">Giỏ hàng trống</p>
              <p className="text-sm text-muted-foreground">
                Chọn vài món ở trang chủ để bắt đầu đơn.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false)
                navigate(`${paths.home}#mon-ban-chay`)
              }}
            >
              Xem món bán chạy
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y overflow-y-auto border-t px-6">
              {items.map(({ dish, quantity }) => (
                <li key={dish.id} className="flex gap-3 py-4">
                  <FoodImage
                    src={dish.image}
                    alt={dish.name}
                    className="size-16 shrink-0 rounded-xl"
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <p className="line-clamp-2 text-sm font-medium leading-snug">{dish.name}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold">
                        {formatCurrency(dish.price * quantity)}
                      </span>
                      <div className="flex items-center gap-1 rounded-full border p-0.5">
                        <button
                          type="button"
                          onClick={() => setQuantity(dish.id, quantity - 1)}
                          className="grid size-7 place-items-center rounded-full hover:bg-secondary"
                          aria-label={
                            quantity === 1 ? `Bỏ ${dish.name}` : `Giảm số lượng ${dish.name}`
                          }
                        >
                          {quantity === 1 ? (
                            <Trash2 className="size-3.5" />
                          ) : (
                            <Minus className="size-3.5" />
                          )}
                        </button>
                        <span className="w-5 text-center text-sm font-semibold tabular-nums">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(dish.id, quantity + 1)}
                          className="grid size-7 place-items-center rounded-full hover:bg-secondary"
                          aria-label={`Tăng số lượng ${dish.name}`}
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <SheetFooter>
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Tạm tính ({count} món)</span>
                <span className="font-display text-xl font-bold">{formatCurrency(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Phí giao và mã giảm giá được tính ở bước thanh toán.
              </p>
              <Button size="lg" onClick={checkout}>
                Đặt món
              </Button>
              <Button variant="ghost" size="sm" onClick={clear} className="text-muted-foreground">
                Xoá giỏ hàng
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
