import { Plus } from 'lucide-react'
import { FoodImage } from '@/components/common/food-image'
import { useAddToCart } from '@/features/cart/hooks'
import type { Dish } from '@/features/catalog/types'
import { formatCompact, formatCurrency } from '@/lib/format'

export function DishCard({ dish }: { dish: Dish }) {
  const addToCart = useAddToCart()

  return (
    <article className="w-[200px] shrink-0 snap-start sm:w-[220px]">
      <div className="relative">
        <FoodImage src={dish.image} alt={dish.name} className="aspect-square rounded-2xl" />
        {dish.originalPrice && (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-turmeric px-1.5 py-0.5 text-xs font-bold text-aubergine">
            -{Math.round((1 - dish.price / dish.originalPrice) * 100)}%
          </span>
        )}
        <button
          type="button"
          onClick={() => addToCart(dish)}
          aria-label={`Thêm ${dish.name} vào giỏ`}
          className="absolute bottom-2.5 right-2.5 grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95"
        >
          <Plus className="size-5" strokeWidth={2.5} />
        </button>
      </div>
      <div className="mt-3 space-y-0.5">
        <h3 className="line-clamp-1 font-sans text-[15px] font-semibold tracking-normal">
          {dish.name}
        </h3>
        <p className="line-clamp-1 text-[13px] text-muted-foreground">{dish.restaurantName}</p>
        <p className="flex items-baseline gap-2 pt-1">
          <span className="font-semibold">{formatCurrency(dish.price)}</span>
          {dish.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatCurrency(dish.originalPrice)}
            </span>
          )}
        </p>
        <p className="text-xs text-muted-foreground">Đã bán {formatCompact(dish.soldCount)}</p>
      </div>
    </article>
  )
}
