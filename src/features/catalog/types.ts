export type CategoryIcon =
  | 'rice'
  | 'noodle'
  | 'snack'
  | 'milk-tea'
  | 'coffee'
  | 'pizza'
  | 'healthy'
  | 'chicken'
  | 'hotpot'
  | 'dessert'

export interface Category {
  id: string
  name: string
  icon: CategoryIcon
}

export interface Restaurant {
  id: string
  name: string
  cover: string
  categoryIds: string[]
  address: string
  rating: number
  reviewCount: number
  /** Thời gian giao ước tính, phút [min, max] */
  deliveryMinutes: [number, number]
  /** Khoảng cách tới địa chỉ giao, mét */
  distance: number
  deliveryFee: number
  promo?: string
  isOpen: boolean
  opensAt?: string
}

export interface Dish {
  id: string
  name: string
  image: string
  price: number
  originalPrice?: number
  soldCount: number
  restaurantId: string
  restaurantName: string
}

export interface Promotion {
  id: string
  code: string
  title: string
  description: string
  minOrder: number
  expiresAt: string
}

export type RestaurantSort = 'nearest' | 'rating' | 'fastest'

export interface RestaurantQuery {
  categoryId?: string
  keyword?: string
  freeShip?: boolean
  topRated?: boolean
  fast?: boolean
  sort?: RestaurantSort
}
