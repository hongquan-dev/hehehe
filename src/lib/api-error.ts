import axios from 'axios'
import type { ApiResponse, FieldErrorDetail } from '@/types/api'

/**
 * Lỗi đã chuẩn hoá từ mọi request: UI chỉ cần đọc `code` (mã nghiệp vụ của backend) và `fieldErrors`.
 * `status = 0` nghĩa là không tới được máy chủ.
 */
export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly fieldErrors: FieldErrorDetail[]

  constructor(status: number, code: string, message: string, fieldErrors: FieldErrorDetail[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fieldErrors = fieldErrors
  }

  static from(error: unknown): ApiError {
    if (error instanceof ApiError) return error
    if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
      const body = error.response?.data
      if (!error.response) {
        return new ApiError(
          0,
          'NETWORK_ERROR',
          'Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.',
        )
      }
      return new ApiError(
        error.response.status,
        body?.code ?? 'UNKNOWN_ERROR',
        body?.message ?? error.message,
        body?.errors ?? [],
      )
    }
    return new ApiError(
      -1,
      'UNKNOWN_ERROR',
      error instanceof Error ? error.message : 'Đã có lỗi xảy ra',
    )
  }
}
