/** Khớp `AuthUser` của fd-order-service: user mà auth-service trả về qua gRPC. */
export interface AuthUser {
  id: number
  username: string
  /** `null` nếu tài khoản không có số điện thoại */
  phoneNumber: string | null
  role: string
  active: boolean
}

/**
 * Khớp `AuthCallResult` của fd-order-service (`GET /order/test/auth-grpc`): user lấy từ auth-service qua gRPC, và lời
 * gọi đó mất bao lâu.
 */
export interface AuthCallResult {
  /** Thời gian của riêng lời gọi order-service -> auth-service, không gồm đường từ trình duyệt tới gateway */
  elapsedMs: number
  user: AuthUser
}
