import { Navigate, Outlet, useLocation, type Location } from 'react-router-dom'
import { PageLoader } from '@/components/common/page-loader'
import { useAuthStore } from '@/features/auth/store/auth.store'
import type { UserRole } from '@/features/auth/types'
import { paths } from '@/routes/paths'
import { homePathFor } from '@/routes/role-home'

/** Trang cần đăng nhập (giỏ hàng/thanh toán, đơn hàng...). Chưa đăng nhập thì về /login, nhớ trang đang định vào. */
export function ProtectedRoute() {
  const status = useAuthStore((s) => s.status)
  const location = useLocation()

  if (status === 'checking') return <PageLoader label="Đang kiểm tra phiên đăng nhập…" />
  if (status === 'anonymous')
    return <Navigate to={paths.login} replace state={{ from: location }} />
  return <Outlet />
}

/**
 * Trang chỉ một số role được vào (vd kênh nhà hàng). Chưa đăng nhập thì về /login; sai role thì về trang chủ của role
 * đó. Chỉ để chọn giao diện: backend vẫn tự kiểm tra role của từng API (`<roles>` trong `api-routes.xml`).
 */
export function RoleRoute({ roles }: { roles: readonly UserRole[] }) {
  const { status, user } = useAuthStore()
  const location = useLocation()

  if (status === 'checking') return <PageLoader label="Đang kiểm tra phiên đăng nhập…" />
  if (!user) return <Navigate to={paths.login} replace state={{ from: location }} />
  if (!roles.includes(user.role)) return <Navigate to={homePathFor(user.role)} replace />
  return <Outlet />
}

/** Trang chủ chung: role có trang riêng (vd chủ quán -> /merchant) được chuyển sang đó. Đặt bên trong ProtectedRoute. */
export function RoleHomeRedirect() {
  const user = useAuthStore((s) => s.user)
  const home = user ? homePathFor(user.role) : paths.home

  if (home !== paths.home) return <Navigate to={home} replace />
  return <Outlet />
}

/**
 * Trang chỉ dành cho khách (đăng nhập, đăng ký). Đã đăng nhập thì quay về trang định vào trước đó, không có thì về
 * trang chủ của role.
 */
export function GuestRoute() {
  const { status, user } = useAuthStore()
  const location = useLocation()
  const from = (location.state as { from?: Location } | null)?.from

  if (status === 'checking') return <PageLoader label="Đang kiểm tra phiên đăng nhập…" />
  if (status === 'authenticated') {
    const target = from
      ? `${from.pathname}${from.search}${from.hash}`
      : homePathFor(user?.role ?? '')
    return <Navigate to={target} replace />
  }
  return <Outlet />
}
