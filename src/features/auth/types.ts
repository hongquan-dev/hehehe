/** Khớp `UserRole` của backend (common-dto-lib). Mỗi tài khoản một role, quyết định giao diện sau khi đăng nhập. */
export type UserRole = 'CUSTOMER' | 'RESTAURANT_OWNER' | 'DRIVER' | 'ADMIN'

/** Khớp `UserDto` của fd-auth-service. */
export interface UserDto {
  id: number
  username: string
  email: string
  phoneNumber: string
  role: UserRole
  active: boolean
  createdAt: string
}

/** Body `POST /auth/login`: identifier là username, email hoặc số điện thoại. */
export interface LoginRequest {
  identifier: string
  password: string
}

/** Body `POST /auth/register`. */
export interface RegisterRequest {
  username: string
  password: string
  email: string
  phoneNumber: string
}

export type AuthStatus = 'checking' | 'authenticated' | 'anonymous'
