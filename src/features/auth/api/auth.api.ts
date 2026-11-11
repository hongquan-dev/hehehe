import { env } from '@/config/env'
import { http } from '@/lib/http'
import { authMock } from '@/mocks/handlers/auth.mock'
import type { ApiResponse } from '@/types/api'
import type { LoginRequest, RegisterRequest, UserDto } from '@/features/auth/types'

/**
 * Gọi fd-auth-service qua API Gateway. Viết tay tạm thời, khi backend có OpenAPI thì thay bằng code Orval
 * (src/api/generated/auth) nhưng giữ nguyên chữ ký hàm để hook và component không phải đổi.
 */
const authHttp = {
  login: (body: LoginRequest) =>
    http.post<ApiResponse<UserDto>>('/auth/login', body).then((r) => r.data.data),
  register: (body: RegisterRequest) =>
    http.post<ApiResponse<UserDto>>('/auth/register', body).then((r) => r.data.data),
  me: () => http.get<ApiResponse<UserDto>>('/auth/me').then((r) => r.data.data),
  logout: (): Promise<void> => http.post('/auth/logout').then(() => undefined),
}

export const authApi: typeof authHttp = env.useMock ? authMock : authHttp
