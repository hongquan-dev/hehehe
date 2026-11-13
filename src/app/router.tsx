import { createBrowserRouter } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/auth-layout'
import { MainLayout } from '@/components/layout/main-layout'
import { RouteError } from '@/app/route-error'
import { GuestRoute, ProtectedRoute } from '@/routes/guards'
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
          // Trang chủ là trang kiểm tra phiên với backend thật, nên cần đăng nhập
          element: <ProtectedRoute />,
          children: [
            {
              path: paths.home,
              lazy: page(() => import('@/pages/session-test/session-test-page')),
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
