import { env } from '@/config/env'
import { http } from '@/lib/http'
import { sessionTestMock } from '@/mocks/handlers/session-test.mock'
import type { ApiResponse } from '@/types/api'
import type { AuthCallResult } from '@/features/session-test/types'

/**
 * API test, chỉ đọc và không thay đổi gì: fd-order-service lấy user đang đăng nhập từ auth-service qua gRPC. API của order đi qua gateway, nơi access token được kiểm tra.
 */
const sessionTestHttp = {
  callAuthOverGrpc: () =>
    http.get<ApiResponse<AuthCallResult>>('/order/test/auth-grpc').then((r) => r.data.data),
}

export const sessionTestApi: typeof sessionTestHttp = env.useMock
  ? sessionTestMock
  : sessionTestHttp
