import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { restaurantApi } from '@/features/merchant/api/restaurant.api'

// Theo id tài khoản: đăng xuất rồi đăng nhập tài khoản khác không thấy quán của người trước
export const restaurantKeys = {
  mine: (userId: number | undefined) => ['merchant', 'restaurant', userId] as const,
}

/** Quán của chủ quán đang đăng nhập; `data` là `null` khi chưa tạo quán. */
export function useMyRestaurant() {
  const userId = useAuthStore((s) => s.user?.id)
  return useQuery({
    queryKey: restaurantKeys.mine(userId),
    queryFn: restaurantApi.getMine,
    enabled: userId !== undefined,
  })
}

/** Tạo quán; xong thì đưa quán mới vào cache để trang chuyển ngay sang phần tổng quan. */
export function useCreateRestaurant() {
  const queryClient = useQueryClient()
  const userId = useAuthStore((s) => s.user?.id)
  return useMutation({
    mutationFn: restaurantApi.create,
    onSuccess: (restaurant) => {
      queryClient.setQueryData(restaurantKeys.mine(userId), restaurant)
    },
  })
}
