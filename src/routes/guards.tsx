import { Navigate, Outlet, useLocation, type Location } from 'react-router-dom'
import { PageLoader } from '@/components/common/page-loader'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { paths } from '@/routes/paths'

/** Trang cần đăng nhập (giỏ hàng/thanh toán, đơn hàng...). Chưa đăng nhập thì về /login, nhớ trang đang định vào. */
export function ProtectedRoute() {
  const status = useAuthStore((s) => s.status)
  const location = useLocation()

  if (status === 'checking') return <PageLoader label="Đang kiểm tra phiên đăng nhập…" />
  if (status === 'anonymous')
    return <Navigate to={paths.login} replace state={{ from: location }} />
  return <Outlet />
}

/** Trang chỉ dành cho khách (đăng nhập, đăng ký). Đã đăng nhập thì quay về trang định vào trước đó hoặc trang chủ. */
export function GuestRoute() {
  const status = useAuthStore((s) => s.status)
  const location = useLocation()
  const from = (location.state as { from?: Location } | null)?.from

  if (status === 'checking') return <PageLoader label="Đang kiểm tra phiên đăng nhập…" />
  if (status === 'authenticated') {
    return (
      <Navigate to={from ? `${from.pathname}${from.search}${from.hash}` : paths.home} replace />
    )
  }
  return <Outlet />
}
