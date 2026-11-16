import type { AuthCallResult, AuthTransport, PingResponse } from '@/features/session-test/types'
import { authMock } from '@/mocks/handlers/auth.mock'
import { mockLatency } from '@/mocks/utils'

const MOCK_ACCESS_TTL_MS = 15 * 60_000

/*
 * Giả lập API test của fd-auth-service. Phiên giả không có access token thật, nên coi như token được cấp lại ở đầu
 * mỗi chu kỳ 15 phút để đồng hồ đếm ngược vẫn chạy.
 */
export const sessionTestMock = {
  async ping(): Promise<PingResponse> {
    const user = await authMock.me()
    await mockLatency(100, 250)
    const now = Date.now()
    const issuedAt = now - (now % MOCK_ACCESS_TTL_MS)
    return {
      userId: user.id,
      role: user.role,
      issuedAt: new Date(issuedAt).toISOString(),
      expiresAt: new Date(issuedAt + MOCK_ACCESS_TTL_MS).toISOString(),
      serverTime: new Date(now).toISOString(),
    }
  },

  callAuthOverHttp: () => mockAuthCall('HTTP'),
  callAuthOverGrpc: () => mockAuthCall('gRPC'),
}

// User đang đăng nhập như order-service nhận từ auth-service; gRPC giả lập nhanh hơn HTTP một chút
async function mockAuthCall(transport: AuthTransport): Promise<AuthCallResult> {
  const user = await authMock.me()
  const elapsedMs = Math.round(
    transport === 'HTTP' ? 8 + Math.random() * 12 : 3 + Math.random() * 6,
  )
  await mockLatency(100, 250)
  return {
    transport,
    elapsedMs,
    user: {
      id: user.id,
      username: user.username,
      phoneNumber: user.phoneNumber,
      role: user.role,
      active: user.active,
    },
  }
}
