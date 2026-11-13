import type { PingResponse } from '@/features/session-test/types'
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
}
