import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/features/auth/api/auth.api'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { sessionTestApi } from '@/features/session-test/api/session-test.api'
import { ApiError } from '@/lib/api-error'

/**
 * `GET /order/test/auth-grpc`: order-service lấy user đang đăng nhập từ auth-service qua gRPC. Dùng mutation vì mỗi lần
 * bấm là một lần đo mới, không cần cache.
 */
export function useAuthCall() {
  return useMutation({ mutationFn: sessionTestApi.callAuthOverGrpc })
}

/**
 * `POST /auth/refresh` bấm tay. Lỗi 401 nghĩa là phiên đã kết thúc (backend đã xoá cả hai cookie), nên đăng xuất
 * luôn.
 */
export function useRefreshSession() {
  const signOut = useAuthStore((s) => s.signOut)
  return useMutation({
    mutationFn: authApi.refresh,
    onError: (error) => {
      if (ApiError.from(error).status === 401) {
        signOut('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.')
      }
    },
  })
}
