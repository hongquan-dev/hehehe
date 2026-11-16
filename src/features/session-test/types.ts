/** Khớp `PingResponse` của fd-auth-service (`GET /auth/test/ping`). Thời gian là chuỗi ISO-8601 UTC. */
export interface PingResponse {
  userId: number
  role: string
  /** `null` nếu token không có claim `iat` */
  issuedAt: string | null
  /** Lúc trình duyệt xoá cookie access_token; sau đó request đầu tiên bị 401 và tự làm mới phiên */
  expiresAt: string
  /** Giờ máy chủ, để tính thời gian còn lại đúng cả khi đồng hồ máy người dùng lệch */
  serverTime: string
}

/** Khớp `AuthUser` của fd-order-service: user mà auth-service trả về, qua HTTP hay gRPC đều như nhau. */
export interface AuthUser {
  id: number
  username: string
  /** `null` nếu tài khoản không có số điện thoại */
  phoneNumber: string | null
  role: string
  active: boolean
}

/** Cách order-service gọi sang auth-service trong API test */
export type AuthTransport = 'HTTP' | 'gRPC'

/**
 * Khớp `AuthCallResult` của fd-order-service (`GET /order/test/auth-http`, `GET /order/test/auth-grpc`): cùng một
 * user lấy từ auth-service qua một cách gọi, và lời gọi đó mất bao lâu.
 */
export interface AuthCallResult {
  transport: AuthTransport
  /** Thời gian của riêng lời gọi order-service -> auth-service, không gồm đường từ trình duyệt tới gateway */
  elapsedMs: number
  user: AuthUser
}
