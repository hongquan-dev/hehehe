import type { UserDto } from '@/features/auth/types'

export interface MockAccount {
  user: UserDto
  password: string
}

/** Tài khoản dùng thử khi VITE_USE_MOCK=true */
export const DEMO_ACCOUNT = { identifier: 'demo', password: 'matkhau123' } as const

export const seedAccounts: MockAccount[] = [
  {
    password: DEMO_ACCOUNT.password,
    user: {
      id: 1,
      username: 'demo',
      email: 'demo@angi.vn',
      phoneNumber: '+84901234567',
      role: 'CUSTOMER',
      active: true,
      createdAt: '2026-01-15T08:30:00',
    },
  },
  {
    password: 'matkhau123',
    user: {
      id: 2,
      username: 'bi.khoa',
      email: 'bikhoa@angi.vn',
      phoneNumber: '+84987654321',
      role: 'CUSTOMER',
      active: false,
      createdAt: '2026-03-02T10:00:00',
    },
  },
]
