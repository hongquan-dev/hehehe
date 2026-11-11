import { toast } from 'sonner'
import { useCartStore } from '@/features/cart/store/cart.store'
import type { Dish } from '@/features/catalog/types'

/** Thêm món vào giỏ; nếu giỏ đang có món của quán khác thì hỏi lại trước khi tạo giỏ mới */
export function useAddToCart() {
  const addItem = useCartStore((s) => s.addItem)
  const replaceWith = useCartStore((s) => s.replaceWith)
  const items = useCartStore((s) => s.items)

  return (dish: Dish) => {
    if (addItem(dish) === 'added') {
      toast.success(`Đã thêm ${dish.name}`, { duration: 1800 })
      return
    }
    toast(`Giỏ đang có món của ${items[0]?.dish.restaurantName}`, {
      description: `Mỗi đơn chỉ đặt từ một quán. Tạo giỏ mới với món của ${dish.restaurantName}?`,
      action: { label: 'Tạo giỏ mới', onClick: () => replaceWith(dish) },
      cancel: { label: 'Giữ giỏ cũ', onClick: () => undefined },
      duration: 8000,
    })
  }
}
