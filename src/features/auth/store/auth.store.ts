import { create } from 'zustand'
import type { AuthStatus, UserDto } from '@/features/auth/types'

interface AuthState {
  status: AuthStatus
  user: UserDto | null
  /** Thông báo hiện ở trang đăng nhập khi phiên tự kết thúc */
  notice: string | null
  setUser: (user: UserDto) => void
  signOut: (notice?: string) => void
  clearNotice: () => void
}

/**
 * Trạng thái đăng nhập phía client. Không lưu token (nằm trong cookie HttpOnly) hay user vào localStorage:
 * khi tải trang, `useMe` gọi `GET /auth/me` để biết đã đăng nhập hay chưa.
 */
export const useAuthStore = create<AuthState>()((set) => ({
  status: 'checking',
  user: null,
  notice: null,
  setUser: (user) => set({ user, status: 'authenticated', notice: null }),
  signOut: (notice) => set({ user: null, status: 'anonymous', notice: notice ?? null }),
  clearNotice: () => set({ notice: null }),
}))
