import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/features/auth/api/auth.api'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { sessionTestApi } from '@/features/session-test/api/session-test.api'
import { ApiError } from '@/lib/api-error'

export const sessionTestKeys = {
  ping: ['session-test', 'ping'] as const,
}

/** `GET /auth/test/ping`. Luôn gọi lại khi mở trang để không hiện thời hạn token của phiên trước. */
export function usePing() {
  return useQuery({
    queryKey: sessionTestKeys.ping,
    queryFn: sessionTestApi.ping,
    staleTime: 0,
    refetchOnMount: 'always',
    retry: false,
  })
}

/**
 * `POST /auth/refresh` bấm tay. Thành công thì gọi lại ping để lấy thời hạn của access token mới. Lỗi 401 nghĩa là
 * phiên đã kết thúc (backend đã xoá cả hai cookie), nên đăng xuất luôn.
 */
export function useRefreshSession() {
  const queryClient = useQueryClient()
  const signOut = useAuthStore((s) => s.signOut)
  return useMutation({
    mutationFn: authApi.refresh,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionTestKeys.ping }),
    onError: (error) => {
      if (ApiError.from(error).status === 401) {
        signOut('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.')
      }
    },
  })
}
