import { Bike, Clock, Star } from 'lucide-react'
import { toast } from 'sonner'
import { FoodImage } from '@/components/common/food-image'
import { Skeleton } from '@/components/ui/skeleton'
import type { Restaurant } from '@/features/catalog/types'
import { formatCompact, formatCurrency, formatDistance } from '@/lib/format'
import { cn } from '@/lib/utils'

export function RestaurantCard({ restaurant: r }: { restaurant: Restaurant }) {
  return (
    <article className={cn('group relative', !r.isOpen && 'opacity-70')}>
      <div className="relative">
        <FoodImage
          src={r.cover}
          alt={r.name}
          className={cn(
            'aspect-[4/3] rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]',
            !r.isOpen && 'grayscale',
          )}
        />
        {r.promo && r.isOpen && (
          <span className="absolute left-3 top-3 rounded-md bg-turmeric px-2 py-1 text-xs font-bold text-aubergine shadow">
            {r.promo}
          </span>
        )}
        {!r.isOpen && (
          <span className="absolute inset-x-3 bottom-3 rounded-lg bg-aubergine/85 px-3 py-1.5 text-center text-xs font-semibold text-white">
            Đóng cửa, mở lại lúc {r.opensAt}
          </span>
        )}
      </div>

      <div className="mt-3 space-y-1.5">
        <h3 className="line-clamp-1 font-sans text-base font-semibold tracking-normal">
          {/* Link phủ toàn thẻ: thay bằng <Link to={`/restaurants/${r.id}`}> khi có trang quán */}
          <button
            type="button"
            onClick={() => toast.info('Trang chi tiết quán đang được xây dựng')}
            className="text-left after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-offset-4"
          >
            {r.name}
          </button>
        </h3>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star className="size-3.5 fill-turmeric text-turmeric" aria-hidden />
            <b className="font-semibold text-foreground">{r.rating.toFixed(1)}</b>(
            {formatCompact(r.reviewCount)})
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden />
            {r.deliveryMinutes[0]}–{r.deliveryMinutes[1]} phút
          </span>
          <span>{formatDistance(r.distance)}</span>
        </p>
        <p className="inline-flex items-center gap-1 text-[13px]">
          <Bike className="size-3.5 text-muted-foreground" aria-hidden />
          {r.deliveryFee === 0 ? (
            <span className="font-semibold text-basil">Miễn phí giao</span>
          ) : (
            <span className="text-muted-foreground">Phí giao {formatCurrency(r.deliveryFee)}</span>
          )}
        </p>
      </div>
    </article>
  )
}

export function RestaurantCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[4/3] rounded-2xl" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  )
}
