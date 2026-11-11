import { ArrowDownUp, Check, SearchX, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CategoryRail } from '@/features/catalog/components/category-rail'
import {
  RestaurantCard,
  RestaurantCardSkeleton,
} from '@/features/catalog/components/restaurant-card'
import { useRestaurants } from '@/features/catalog/hooks/use-catalog'
import type { RestaurantQuery, RestaurantSort } from '@/features/catalog/types'
import { cn } from '@/lib/utils'

const SORTS: Record<RestaurantSort, string> = {
  nearest: 'Gần nhất',
  rating: 'Đánh giá cao',
  fastest: 'Giao nhanh',
}

const FILTERS = [
  { key: 'freeShip', label: 'Miễn phí giao' },
  { key: 'topRated', label: 'Từ 4,7 sao' },
  { key: 'fast', label: 'Giao dưới 30 phút' },
] as const

interface RestaurantSectionProps {
  query: RestaurantQuery
  onChange: (patch: Partial<RestaurantQuery>) => void
  onReset: () => void
}

export function RestaurantSection({ query, onChange, onReset }: RestaurantSectionProps) {
  const { data, isPending, isFetching, isError, refetch } = useRestaurants(query)
  const sort = query.sort ?? 'nearest'
  const hasFilters = Boolean(
    query.keyword || query.categoryId || query.freeShip || query.topRated || query.fast,
  )

  return (
    <section
      id="quan-gan-ban"
      aria-labelledby="restaurants-heading"
      className="container scroll-mt-20 pt-14"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="restaurants-heading" className="text-2xl font-bold sm:text-[28px]">
            {query.keyword ? `Kết quả cho “${query.keyword}”` : 'Quán gần bạn'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
            {data ? `${data.length} quán` : 'Đang tìm quán…'}
          </p>
        </div>
        {query.keyword && (
          <Button variant="outline" size="sm" onClick={() => onChange({ keyword: undefined })}>
            <X /> Bỏ từ khoá
          </Button>
        )}
      </div>

      <div className="mt-5 space-y-3">
        <CategoryRail
          value={query.categoryId}
          onChange={(categoryId) => onChange({ categoryId })}
        />
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => {
            const active = Boolean(query[f.key])
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ [f.key]: active ? undefined : true })}
                className={cn(
                  'inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  active
                    ? 'border-primary bg-accent text-accent-foreground'
                    : 'hover:border-foreground/30',
                )}
              >
                {active && <Check className="size-3.5" aria-hidden />}
                {f.label}
              </button>
            )
          })}
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <ArrowDownUp className="size-3.5" aria-hidden />
              {SORTS[sort]}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(Object.keys(SORTS) as RestaurantSort[]).map((key) => (
                <DropdownMenuItem
                  key={key}
                  onSelect={() => onChange({ sort: key === 'nearest' ? undefined : key })}
                >
                  <span className="flex-1">{SORTS[key]}</span>
                  {key === sort && <Check className="!text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className={cn('mt-6 transition-opacity', isFetching && !isPending && 'opacity-60')}>
        {isError ? (
          <div className="rounded-3xl border border-dashed px-6 py-14 text-center">
            <p className="font-display text-lg font-bold">Chưa tải được danh sách quán</p>
            <p className="mt-1 text-sm text-muted-foreground">Kiểm tra kết nối mạng rồi tải lại.</p>
            <Button variant="outline" className="mt-5" onClick={() => refetch()}>
              Tải lại
            </Button>
          </div>
        ) : isPending ? (
          <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <RestaurantCardSkeleton key={i} />
            ))}
          </div>
        ) : data?.length ? (
          <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-3xl bg-secondary px-6 py-14 text-center">
            <SearchX className="size-10 text-muted-foreground" aria-hidden />
            <p className="mt-4 font-display text-lg font-bold">Chưa có quán phù hợp</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Bỏ bớt bộ lọc hoặc thử tên món khác, vd: “cơm”, “bún”.
            </p>
            {hasFilters && (
              <Button variant="outline" className="mt-5 bg-background" onClick={onReset}>
                Xoá bộ lọc
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
