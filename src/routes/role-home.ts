import type { UserRole } from '@/features/auth/types'
import { paths } from '@/routes/paths'

// Trang đầu tiên của từng role sau khi đăng nhập. Role chưa có giao diện riêng dùng trang chủ
const ROLE_HOME: Partial<Record<UserRole, string>> = {
  RESTAURANT_OWNER: paths.merchant,
}

/** Trang chủ của một role, vd `RESTAURANT_OWNER` -> `/merchant`. Role lạ (backend thêm mà FE chưa biết) -> `/`. */
export const homePathFor = (role: string) => ROLE_HOME[role as UserRole] ?? paths.home
