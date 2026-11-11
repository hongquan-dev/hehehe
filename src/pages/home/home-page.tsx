import { useCallback, useEffect, useMemo } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { HeroSection } from '@/features/catalog/components/hero-section'
import { PopularDishes } from '@/features/catalog/components/popular-dishes'
import { PromoTickets } from '@/features/catalog/components/promo-tickets'
import { RestaurantSection } from '@/features/catalog/components/restaurant-section'
import type { RestaurantQuery, RestaurantSort } from '@/features/catalog/types'

// Bộ lọc nằm trên URL (?q=pho&cat=bun-pho&freeship=1) để chia sẻ link và giữ khi F5
const PARAM = {
  keyword: 'q',
  categoryId: 'cat',
  sort: 'sort',
  freeShip: 'freeship',
  topRated: 'top',
  fast: 'fast',
} as const

function readQuery(params: URLSearchParams): RestaurantQuery {
  return {
    keyword: params.get(PARAM.keyword) ?? undefined,
    categoryId: params.get(PARAM.categoryId) ?? undefined,
    sort: (params.get(PARAM.sort) as RestaurantSort | null) ?? undefined,
    freeShip: params.has(PARAM.freeShip) || undefined,
    topRated: params.has(PARAM.topRated) || undefined,
    fast: params.has(PARAM.fast) || undefined,
  }
}

const scrollToRestaurants = () =>
  document.getElementById('quan-gan-ban')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

export default function HomePage() {
  const [params, setParams] = useSearchParams()
  const query = useMemo(() => readQuery(params), [params])
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  const updateQuery = useCallback(
    (patch: Partial<RestaurantQuery>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          for (const [key, value] of Object.entries(patch)) {
            const name = PARAM[key as keyof typeof PARAM]
            if (value === undefined || value === '' || value === false) next.delete(name)
            else next.set(name, value === true ? '1' : String(value))
          }
          return next
        },
        { replace: true, preventScrollReset: true },
      )
    },
    [setParams],
  )

  return (
    <>
      <HeroSection
        keyword={query.keyword ?? ''}
        onSearch={(keyword) => {
          updateQuery({ keyword: keyword || undefined })
          requestAnimationFrame(scrollToRestaurants)
        }}
      />
      <PromoTickets />
      <PopularDishes />
      <RestaurantSection
        query={query}
        onChange={updateQuery}
        onReset={() => setParams({}, { replace: true, preventScrollReset: true })}
      />
    </>
  )
}
