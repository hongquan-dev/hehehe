import { env } from '@/config/env'
import { ApiError } from '@/lib/api-error'
import { http } from '@/lib/http'
import { restaurantMock } from '@/mocks/handlers/restaurant.mock'
import type { ApiResponse } from '@/types/api'
import type { CreateRestaurantRequest, RestaurantDto } from '@/features/merchant/types'

/**
 * Gọi fd-restaurant-service qua gateway (dev: proxy `/api` của Vite). Cả hai API chỉ cho tài khoản chủ quán:
 * backend trả 403 `ACCESS_DENIED` với role khác.
 */
const restaurantHttp = {
  /** Quán của tài khoản đang đăng nhập, `null` nếu chưa tạo (backend trả 404 `RESTAURANT_NOT_FOUND`). */
  getMine: (): Promise<RestaurantDto | null> =>
    http
      .get<ApiResponse<RestaurantDto>>('/restaurant/restaurants/me')
      .then((r) => r.data.data)
      .catch((error: unknown) => {
        const apiError = ApiError.from(error)
        if (apiError.status === 404 && apiError.code === 'RESTAURANT_NOT_FOUND') return null
        throw apiError
      }),
  /** Tạo quán, trạng thái `PENDING`. Đã có quán thì 409 `RESTAURANT_ALREADY_EXISTS`. */
  create: (body: CreateRestaurantRequest) =>
    http.post<ApiResponse<RestaurantDto>>('/restaurant/restaurants', body).then((r) => r.data.data),
}

export const restaurantApi: typeof restaurantHttp = env.useMock ? restaurantMock : restaurantHttp
