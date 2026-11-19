import type { AuthCallResult } from '@/features/session-test/types'
import { authMock } from '@/mocks/handlers/auth.mock'
import { mockLatency } from '@/mocks/utils'

// Giả lập API test của fd-order-service
export const sessionTestMock = {
  callAuthOverGrpc: mockAuthCall,
}

// User đang đăng nhập như order-service nhận từ auth-service qua gRPC
async function mockAuthCall(): Promise<AuthCallResult> {
  const user = await authMock.me()
  const elapsedMs = Math.round(3 + Math.random() * 6)
  await mockLatency(100, 250)
  return {
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
