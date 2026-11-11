import type {
  Category,
  Dish,
  Promotion,
  Restaurant,
  RestaurantQuery,
} from '@/features/catalog/types'
import { categories } from '@/mocks/data/categories'
import { popularDishes } from '@/mocks/data/dishes'
import { promotions } from '@/mocks/data/promotions'
import { restaurants } from '@/mocks/data/restaurants'
import { mockLatency } from '@/mocks/utils'

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase()

export const catalogMock = {
  async getCategories(): Promise<Category[]> {
    await mockLatency(200, 400)
    return categories
  },

  async getPromotions(): Promise<Promotion[]> {
    await mockLatency(200, 500)
    return promotions
  },

  async getPopularDishes(): Promise<Dish[]> {
    await mockLatency()
    return popularDishes
  },

  async getRestaurants(query: RestaurantQuery): Promise<Restaurant[]> {
    await mockLatency()
    const keyword = query.keyword ? normalize(query.keyword) : ''
    const dishMatches = new Set(
      popularDishes
        .filter((d) => keyword && normalize(d.name).includes(keyword))
        .map((d) => d.restaurantId),
    )

    const list = restaurants.filter((r) => {
      if (query.categoryId && !r.categoryIds.includes(query.categoryId)) return false
      if (query.freeShip && r.deliveryFee > 0) return false
      if (query.topRated && r.rating < 4.7) return false
      if (query.fast && r.deliveryMinutes[1] > 30) return false
      if (keyword) {
        const categoryNames = r.categoryIds
          .map((id) => categories.find((c) => c.id === id)?.name ?? '')
          .join(' ')
        const haystack = normalize(`${r.name} ${categoryNames}`)
        if (!haystack.includes(keyword) && !dishMatches.has(r.id)) return false
      }
      return true
    })

    const sorters: Record<
      NonNullable<RestaurantQuery['sort']>,
      (a: Restaurant, b: Restaurant) => number
    > = {
      nearest: (a, b) => a.distance - b.distance,
      rating: (a, b) => b.rating - a.rating,
      fastest: (a, b) => a.deliveryMinutes[0] - b.deliveryMinutes[0],
    }
    // Quán đang mở luôn lên trước
    return [...list].sort(
      (a, b) => Number(b.isOpen) - Number(a.isOpen) || sorters[query.sort ?? 'nearest'](a, b),
    )
  },
}
