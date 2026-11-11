import { AnimatePresence, motion } from 'motion/react'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { selectCartCount, useCartStore } from '@/features/cart/store/cart.store'

export function CartButton() {
  const count = useCartStore(selectCartCount)
  const setOpen = useCartStore((s) => s.setOpen)

  return (
    <Button
      variant="secondary"
      className="relative px-4"
      onClick={() => setOpen(true)}
      aria-label={count ? `Giỏ hàng, ${count} món` : 'Giỏ hàng trống'}
    >
      <ShoppingBag />
      <span className="hidden sm:inline">Giỏ hàng</span>
      <AnimatePresence initial={false}>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.4 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 600, damping: 18 }}
            className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground ring-2 ring-background"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  )
}
