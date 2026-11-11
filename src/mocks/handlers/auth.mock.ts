import { ApiError } from '@/lib/api-error'
import type { LoginRequest, RegisterRequest, UserDto } from '@/features/auth/types'
import { seedAccounts, type MockAccount } from '@/mocks/data/users'
import { mockLatency } from '@/mocks/utils'

/*
 * Giả lập fd-auth-service. Backend thật giữ phiên trong cookie HttpOnly; bản giả lưu tạm vào localStorage
 * chỉ để F5 vẫn còn đăng nhập khi xem giao diện.
 */
const ACCOUNTS_KEY = 'mock:accounts'
const SESSION_KEY = 'mock:session'

function loadAccounts(): MockAccount[] {
  try {
    const extra = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? '[]') as MockAccount[]
    return [...seedAccounts, ...extra]
  } catch {
    return [...seedAccounts]
  }
}

function saveExtraAccount(account: MockAccount) {
  const extra = loadAccounts().filter((a) => !seedAccounts.includes(a))
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...extra, account]))
}

/** Giống IdentifierNormalizer: 0901 234 567 / 84901234567 -> +84901234567 */
function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '')
  if (digits.startsWith('84') && digits.length === 11) return `+${digits}`
  if (digits.startsWith('0') && digits.length === 10) return `+84${digits.slice(1)}`
  return value.trim()
}

function findAccount(identifier: string) {
  const id = identifier.trim().toLowerCase()
  const phone = normalizePhone(identifier)
  return loadAccounts().find(
    (a) => a.user.username === id || a.user.email === id || a.user.phoneNumber === phone,
  )
}

export const authMock = {
  async login({ identifier, password }: LoginRequest): Promise<UserDto> {
    await mockLatency(500, 900)
    const account = findAccount(identifier)
    if (!account || account.password !== password) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Sai tài khoản hoặc mật khẩu')
    }
    if (!account.user.active) {
      throw new ApiError(403, 'ACCOUNT_DISABLED', 'Tài khoản đã bị khoá')
    }
    localStorage.setItem(SESSION_KEY, String(account.user.id))
    return account.user
  },

  async register(body: RegisterRequest): Promise<UserDto> {
    await mockLatency(600, 1000)
    const accounts = loadAccounts()
    const phone = normalizePhone(body.phoneNumber)
    const errors = [
      accounts.some((a) => a.user.username === body.username) && {
        field: 'username',
        message: 'Tên đăng nhập đã được sử dụng',
      },
      accounts.some((a) => a.user.email === body.email) && {
        field: 'email',
        message: 'Email đã được sử dụng',
      },
      accounts.some((a) => a.user.phoneNumber === phone) && {
        field: 'phoneNumber',
        message: 'Số điện thoại đã được sử dụng',
      },
    ].filter((e): e is { field: string; message: string } => Boolean(e))

    if (errors.length) throw new ApiError(409, 'DUPLICATE_ACCOUNT', 'Tài khoản đã tồn tại', errors)

    const user: UserDto = {
      id: Date.now(),
      username: body.username,
      email: body.email,
      phoneNumber: phone,
      role: 'CUSTOMER',
      active: true,
      createdAt: new Date().toISOString(),
    }
    saveExtraAccount({ user, password: body.password })
    return user
  },

  async me(): Promise<UserDto> {
    await mockLatency(150, 300)
    const id = Number(localStorage.getItem(SESSION_KEY))
    const account = loadAccounts().find((a) => a.user.id === id)
    if (!account) throw new ApiError(401, 'UNAUTHENTICATED', 'Chưa đăng nhập')
    return account.user
  },

  async logout(): Promise<void> {
    await mockLatency(150, 300)
    localStorage.removeItem(SESSION_KEY)
  },
}
