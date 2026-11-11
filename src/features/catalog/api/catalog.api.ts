import { env } from '@/config/env'
import { http } from '@/lib/http'
import { catalogMock } from '@/mocks/handlers/catalog.mock'
import type { ApiResponse } from '@/types/api'
import type {
  Category,
  Dish,
  Promotion,
  Restaurant,
  RestaurantQuery,
} from '@/features/catalog/types'

/*
 * fd-restaurant-service chưa có API cho các màn này: đường dẫn bên dưới là dự kiến,
 * sửa lại cho khớp khi backend xong (hoặc thay bằng code Orval).
 */
const catalogHttp = {
  getCategories: () =>
    http.get<ApiResponse<Category[]>>('/restaurants/categories').then((r) => r.data.data),
  getPromotions: () =>
    http.get<ApiResponse<Promotion[]>>('/promotions/active').then((r) => r.data.data),
  getPopularDishes: () =>
    http.get<ApiResponse<Dish[]>>('/restaurants/dishes/popular').then((r) => r.data.data),
  getRestaurants: (query: RestaurantQuery) =>
    http.get<ApiResponse<Restaurant[]>>('/restaurants', { params: query }).then((r) => r.data.data),
}

export const catalogApi: typeof catalogHttp = env.useMock ? catalogMock : catalogHttp
