import { env } from '@/config/env'
import { http } from '@/lib/http'
import { sessionTestMock } from '@/mocks/handlers/session-test.mock'
import type { ApiResponse } from '@/types/api'
import type { PingResponse } from '@/features/session-test/types'

/** API test của fd-auth-service, chỉ đọc phiên đăng nhập và không thay đổi gì. */
const sessionTestHttp = {
  ping: () => http.get<ApiResponse<PingResponse>>('/auth/test/ping').then((r) => r.data.data),
}

export const sessionTestApi: typeof sessionTestHttp = env.useMock
  ? sessionTestMock
  : sessionTestHttp
