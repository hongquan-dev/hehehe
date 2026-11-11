import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api-error'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      // Không thử lại lỗi 4xx (sai dữ liệu, chưa đăng nhập...), chỉ thử lại lỗi mạng / 5xx
      retry: (failureCount, error) => {
        const status = error instanceof ApiError ? error.status : -1
        if (status >= 400 && status < 500) return false
        return failureCount < 2
      },
    },
    mutations: { retry: false },
  },
})
