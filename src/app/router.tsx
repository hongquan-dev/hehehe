import { createBrowserRouter } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/auth-layout'
import { MainLayout } from '@/components/layout/main-layout'
import { RouteError } from '@/app/route-error'
import { GuestRoute, ProtectedRoute, RoleHomeRedirect, RoleRoute } from '@/routes/guards'
import { paths } from '@/routes/paths'

// Mỗi trang tách thành chunk riêng (lazy) để tải lần đầu nhẹ hơn
const page = (load: () => Promise<{ default: React.ComponentType }>) => async () => ({
  Component: (await load()).default,
})

export const router = createBrowserRouter(
  [
    {
      errorElement: <RouteError />,
      children: [
        {
          // Trang chủ là trang kiểm tra phiên với backend thật, nên cần đăng nhập. Chủ quán được chuyển sang /merchant
          element: <ProtectedRoute />,
          children: [
            {
              element: <RoleHomeRedirect />,
              children: [
                {
                  path: paths.home,
                  lazy: page(() => import('@/pages/session-test/session-test-page')),
                },
              ],
            },
          ],
        },
        {
          // Kênh nhà hàng: chỉ tài khoản chủ quán
          element: <RoleRoute roles={['RESTAURANT_OWNER']} />,
          children: [
            {
              path: paths.merchant,
              lazy: page(() => import('@/pages/merchant/merchant-home-page')),
            },
          ],
        },
        {
          element: <MainLayout />,
          children: [{ path: '*', lazy: page(() => import('@/pages/not-found-page')) }],
        },
        {
          element: <GuestRoute />,
          children: [
            {
              element: <AuthLayout />,
              children: [
                { path: paths.login, lazy: page(() => import('@/pages/auth/login-page')) },
                { path: paths.register, lazy: page(() => import('@/pages/auth/register-page')) },
              ],
            },
          ],
        },
      ],
    },
  ],
  {
    // Bật sẵn hành vi của React Router v7 để sau này nâng cấp không phải sửa code
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
)
