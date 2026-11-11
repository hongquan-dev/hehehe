import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Dish } from '@/features/catalog/types'

export interface CartItem {
  dish: Dish
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  /** Giỏ chỉ chứa món của một quán; trả về 'conflict' nếu món thuộc quán khác */
  addItem: (dish: Dish) => 'added' | 'conflict'
  replaceWith: (dish: Dish) => void
  setQuantity: (dishId: string, quantity: number) => void
  clear: () => void
  setOpen: (open: boolean) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (dish) => {
        const { items } = get()
        if (items.length && items[0].dish.restaurantId !== dish.restaurantId) return 'conflict'
        const existing = items.find((i) => i.dish.id === dish.id)
        set({
          items: existing
            ? items.map((i) => (i.dish.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i))
            : [...items, { dish, quantity: 1 }],
        })
        return 'added'
      },
      replaceWith: (dish) => set({ items: [{ dish, quantity: 1 }] }),
      setQuantity: (dishId, quantity) =>
        set((s) => ({
          items:
            quantity <= 0
              ? s.items.filter((i) => i.dish.id !== dishId)
              : s.items.map((i) => (i.dish.id === dishId ? { ...i, quantity } : i)),
        })),
      clear: () => set({ items: [] }),
      setOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: 'cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    },
  ),
)

export const selectCartCount = (s: CartState) => s.items.reduce((n, i) => n + i.quantity, 0)
export const selectCartSubtotal = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.dish.price * i.quantity, 0)
