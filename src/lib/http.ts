import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/config/env'
import { ApiError } from '@/lib/api-error'
import type { ApiResponse } from '@/types/api'
import { useAuthStore } from '@/features/auth/store/auth.store'

/**
 * Axios instance dùng chung cho mọi service, gọi qua `env.apiBaseUrl` (dev: proxy `/api` của Vite).
 * Backend lưu access/refresh token trong cookie HttpOnly nên chỉ cần `withCredentials`, không gắn header Authorization.
 */
export const http = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

type TrackedConfig = InternalAxiosRequestConfig & { _retried?: boolean; _startedAt?: number }

/** Một request đã có kết quả, để trang kiểm tra phiên hiện chuỗi 401 → làm mới phiên → gọi lại. */
export interface HttpLogEntry {
  id: number
  /** Thời điểm có kết quả, `Date.now()` */
  at: number
  method: string
  /** Path không có tiền tố `/api`, vd `/auth/test/ping` */
  url: string
  /** 0 nếu không tới được máy chủ */
  status: number
  /** Mã nghiệp vụ của body, vd `TOKEN_EXPIRED` */
  code: string | null
  durationMs: number
  /** Request được gửi lại sau khi làm mới phiên */
  retried: boolean
}

const logListeners = new Set<(entry: HttpLogEntry) => void>()
let nextLogId = 1

/** Nghe mọi request của `http` khi có kết quả. Trả về hàm huỷ đăng ký. */
export function onHttpLog(listener: (entry: HttpLogEntry) => void) {
  logListeners.add(listener)
  return () => {
    logListeners.delete(listener)
  }
}

function emitLog(config: TrackedConfig | undefined, status: number, data: unknown) {
  if (!config || logListeners.size === 0) return
  const entry: HttpLogEntry = {
    id: nextLogId++,
    at: Date.now(),
    method: (config.method ?? 'get').toUpperCase(),
    url: config.url ?? '',
    status,
    code: (data as Partial<ApiResponse<unknown>> | undefined)?.code ?? null,
    durationMs: config._startedAt ? Math.round(performance.now() - config._startedAt) : 0,
    retried: Boolean(config._retried),
  }
  logListeners.forEach((listener) => listener(entry))
}

const NO_REFRESH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout']

// Chỉ một request refresh tại một thời điểm, các request 401 khác chờ chung promise này
let refreshing: Promise<void> | null = null

/**
 * `POST /auth/refresh`: đổi refresh token lấy cặp token mới (cookie). Request bị 401 tự gọi hàm này; nút "Làm mới
 * phiên" cũng gọi chung để không bao giờ có hai lần refresh song song (lần sau sẽ dùng refresh token đã bị thay).
 */
export function refreshSession() {
  refreshing ??= http
    .post('/auth/refresh')
    .then(() => undefined)
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

http.interceptors.request.use((config: TrackedConfig) => {
  config._startedAt = performance.now()
  return config
})

http.interceptors.response.use(
  (response) => {
    emitLog(response.config, response.status, response.data)
    return response
  },
  async (error: AxiosError) => {
    const config = error.config as TrackedConfig | undefined
    emitLog(config, error.response?.status ?? 0, error.response?.data)

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
