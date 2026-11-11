import { LayoutGrid } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { CategoryIcon } from '@/features/catalog/components/category-icon'
import { useCategories } from '@/features/catalog/hooks/use-catalog'
import { cn } from '@/lib/utils'

interface CategoryRailProps {
  value?: string
  onChange: (categoryId?: string) => void
}

const itemClass = (active: boolean) =>
  cn(
    'flex shrink-0 snap-start items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    active
      ? 'border-aubergine bg-aubergine text-white'
      : 'bg-background hover:border-foreground/30',
  )

const iconClass = (active: boolean) =>
  cn(
    'grid size-8 place-items-center rounded-full',
    active ? 'bg-white/15' : 'bg-accent text-accent-foreground',
  )

export function CategoryRail({ value, onChange }: CategoryRailProps) {
  const { data, isPending } = useCategories()

  return (
    <div
      role="group"
      aria-label="Danh mục"
      className="scrollbar-none -mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-1 md:-mx-6 md:scroll-px-6 md:px-6"
    >
      <button
        type="button"
        aria-pressed={!value}
        onClick={() => onChange(undefined)}
        className={itemClass(!value)}
      >
        <span className={iconClass(!value)}>
          <LayoutGrid className="size-4" aria-hidden />
        </span>
        Tất cả
      </button>
      {isPending
        ? Array.from({ length: 7 }, (_, i) => (
            <Skeleton key={i} className="h-11 w-32 shrink-0 rounded-full" />
          ))
        : data?.map((c) => {
            const active = value === c.id
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                onClick={() => onChange(active ? undefined : c.id)}
                className={itemClass(active)}
              >
                <span className={iconClass(active)}>
                  <CategoryIcon name={c.icon} className="size-4" />
                </span>
                {c.name}
              </button>
            )
          })}
    </div>
  )
}
