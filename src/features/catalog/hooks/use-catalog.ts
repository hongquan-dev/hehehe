import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { catalogApi } from '@/features/catalog/api/catalog.api'
import type { RestaurantQuery } from '@/features/catalog/types'

export const catalogKeys = {
  all: ['catalog'] as const,
  categories: () => [...catalogKeys.all, 'categories'] as const,
  promotions: () => [...catalogKeys.all, 'promotions'] as const,
  popularDishes: () => [...catalogKeys.all, 'popular-dishes'] as const,
  restaurants: (query: RestaurantQuery) => [...catalogKeys.all, 'restaurants', query] as const,
}

export const useCategories = () =>
  useQuery({
    queryKey: catalogKeys.categories(),
    queryFn: catalogApi.getCategories,
    staleTime: Infinity,
  })

export const usePromotions = () =>
  useQuery({ queryKey: catalogKeys.promotions(), queryFn: catalogApi.getPromotions })

export const usePopularDishes = () =>
  useQuery({ queryKey: catalogKeys.popularDishes(), queryFn: catalogApi.getPopularDishes })

export const useRestaurants = (query: RestaurantQuery) =>
  useQuery({
    queryKey: catalogKeys.restaurants(query),
    queryFn: () => catalogApi.getRestaurants(query),
    placeholderData: keepPreviousData,
  })
