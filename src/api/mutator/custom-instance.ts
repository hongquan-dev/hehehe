import type { AxiosRequestConfig } from 'axios'
import { http } from '@/lib/http'
import type { ApiResponse } from '@/types/api'

/**
 * Mutator cho code do Orval sinh ra: mọi hàm trong src/api/generated gọi qua đây,
 * nên dùng chung axios instance (cookie, refresh token, chuẩn hoá lỗi).
 */
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => http({ ...config, ...options }).then(({ data }) => data as T)

/** Bóc `data` khỏi envelope ApiResponse của backend. */
export const unwrap = <T>(response: ApiResponse<T>) => response.data

export type ErrorType<Error> = Error
export type BodyType<BodyData> = BodyData
