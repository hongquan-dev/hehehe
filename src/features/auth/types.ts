/** Khớp `UserDto` của fd-auth-service. */
export interface UserDto {
  id: number
  username: string
  email: string
  phoneNumber: string
  role: 'CUSTOMER' | 'MERCHANT' | 'SHIPPER' | 'ADMIN' | string
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
