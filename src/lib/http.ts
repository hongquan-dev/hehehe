import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/config/env'
import { ApiError } from '@/lib/api-error'
import { useAuthStore } from '@/features/auth/store/auth.store'

/**
 * Axios instance dùng chung cho mọi service (đi qua API Gateway).
 * Backend lưu access/refresh token trong cookie HttpOnly nên chỉ cần `withCredentials`, không gắn header Authorization.
 */
export const http = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean }

const NO_REFRESH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout']

// Chỉ một request refresh tại một thời điểm, các request 401 khác chờ chung promise này
let refreshing: Promise<void> | null = null

function refreshSession() {
  refreshing ??= http
    .post('/auth/refresh')
    .then(() => undefined)
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined
    const url = config?.url ?? ''
    const canRefresh =
      error.response?.status === 401 &&
      config &&
      !config._retried &&
      !NO_REFRESH_PATHS.some((p) => url.endsWith(p))

    if (canRefresh) {
      config._retried = true
      try {
        await refreshSession()
        return http(config)
      } catch (refreshError) {
        useAuthStore.getState().signOut('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.')
        return Promise.reject(ApiError.from(refreshError))
      }
    }

    return Promise.reject(ApiError.from(error))
  },
)
