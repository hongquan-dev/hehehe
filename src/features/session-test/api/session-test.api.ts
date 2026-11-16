import { env } from '@/config/env'
import { http } from '@/lib/http'
import { sessionTestMock } from '@/mocks/handlers/session-test.mock'
import type { ApiResponse } from '@/types/api'
import type { AuthCallResult, PingResponse } from '@/features/session-test/types'

/**
 * API test, chỉ đọc và không thay đổi gì: ping của fd-auth-service, và hai API của fd-order-service lấy user đang đăng
 * nhập từ auth-service qua HTTP hoặc gRPC. Hai API của order đi qua gateway, nơi access token được kiểm tra.
 */
const sessionTestHttp = {
  ping: () => http.get<ApiResponse<PingResponse>>('/auth/test/ping').then((r) => r.data.data),
  callAuthOverHttp: () =>
    http.get<ApiResponse<AuthCallResult>>('/order/test/auth-http').then((r) => r.data.data),
  callAuthOverGrpc: () =>
    http.get<ApiResponse<AuthCallResult>>('/order/test/auth-grpc').then((r) => r.data.data),
}

export const sessionTestApi: typeof sessionTestHttp = env.useMock
  ? sessionTestMock
  : sessionTestHttp
