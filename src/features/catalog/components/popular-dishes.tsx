import { Skeleton } from '@/components/ui/skeleton'
import { DishCard } from '@/features/catalog/components/dish-card'
import { usePopularDishes } from '@/features/catalog/hooks/use-catalog'

export function PopularDishes() {
  const { data, isPending } = usePopularDishes()

  return (
    <section
      id="mon-ban-chay"
      aria-labelledby="popular-heading"
      className="container scroll-mt-24 pt-14"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="popular-heading" className="text-2xl font-bold sm:text-[28px]">
            Món bán chạy quanh bạn
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Xếp theo số phần đã bán trong tuần.</p>
        </div>
      </div>
      <div className="scrollbar-none -mx-4 mt-5 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-3 md:-mx-6 md:scroll-px-6 md:px-6">
        {isPending
          ? Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="w-[200px] shrink-0 space-y-3 sm:w-[220px]">
                <Skeleton className="aspect-square rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))
          : data?.map((dish) => <DishCard key={dish.id} dish={dish} />)}
      </div>
    </section>
  )
}
