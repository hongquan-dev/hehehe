/** Khớp `RestaurantStatus` của fd-restaurant-service. */
export type RestaurantStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED'

/** Khớp `RestaurantDto` của fd-restaurant-service. */
export interface RestaurantDto {
  id: number
  ownerUserId: number
  name: string
  address: string
  /** Dạng `+84xxxxxxxxx` */
  phoneNumber: string
  description: string | null
  status: RestaurantStatus
  createdAt: string
}

/** Body `POST /restaurant/restaurants`. Chủ quán không nằm trong body: backend lấy từ tài khoản đang đăng nhập. */
export interface CreateRestaurantRequest {
  name: string
  address: string
  phoneNumber: string
  description: string | null
}
