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
