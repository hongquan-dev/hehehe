import { ApiError } from '@/lib/api-error'
import type { CreateRestaurantRequest, RestaurantDto } from '@/features/merchant/types'
import { authMock } from '@/mocks/handlers/auth.mock'
import { mockLatency } from '@/mocks/utils'

/*
 * Giả lập fd-restaurant-service: mỗi chủ quán một quán, lưu vào localStorage theo id tài khoản để F5 vẫn còn.
 * Kiểm tra role giống `<roles>RESTAURANT_OWNER</roles>` của backend.
 */
const RESTAURANTS_KEY = 'mock:restaurants'

function loadRestaurants(): Record<string, RestaurantDto> {
  try {
    return JSON.parse(localStorage.getItem(RESTAURANTS_KEY) ?? '{}') as Record<
      string,
      RestaurantDto
    >
  } catch {
    return {}
  }
}

// Tài khoản đang đăng nhập, phải là chủ quán
async function currentOwner() {
  const user = await authMock.me()
  if (user.role !== 'RESTAURANT_OWNER') {
    throw new ApiError(403, 'ACCESS_DENIED', 'Your role cannot use this API')
  }
  return user
}

/** Giống CreateRestaurantRequest.normalized(): 0912.345.678 -> +84912345678 */
function normalizePhone(value: string) {
  const digits = value.replace(/[\s.()-]/g, '')
  if (digits.startsWith('84') && digits.length === 11) return `+${digits}`
  if (digits.startsWith('0') && digits.length === 10) return `+84${digits.slice(1)}`
  return digits
}

export const restaurantMock = {
  async getMine(): Promise<RestaurantDto | null> {
    await mockLatency(200, 400)
    const owner = await currentOwner()
    return loadRestaurants()[owner.id] ?? null
  },

  async create(body: CreateRestaurantRequest): Promise<RestaurantDto> {
    await mockLatency(500, 900)
    const owner = await currentOwner()
    const restaurants = loadRestaurants()
    if (restaurants[owner.id]) {
      throw new ApiError(409, 'RESTAURANT_ALREADY_EXISTS', 'This account already has a restaurant')
    }

    const restaurant: RestaurantDto = {
      id: Date.now(),
      ownerUserId: owner.id,
      name: body.name.trim(),
      address: body.address.trim(),
      phoneNumber: normalizePhone(body.phoneNumber),
      description: body.description?.trim() || null,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem(
      RESTAURANTS_KEY,
      JSON.stringify({ ...restaurants, [owner.id]: restaurant }),
    )
    return restaurant
  },
}
