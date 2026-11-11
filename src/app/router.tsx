import { createBrowserRouter } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/auth-layout'
import { MainLayout } from '@/components/layout/main-layout'
import { RouteError } from '@/app/route-error'
import { GuestRoute } from '@/routes/guards'
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
          element: <MainLayout />,
          children: [
            { path: paths.home, lazy: page(() => import('@/pages/home/home-page')) },
            // Trang cần đăng nhập đặt trong <ProtectedRoute />, vd:
            // { element: <ProtectedRoute />, children: [{ path: '/orders', lazy: page(() => import('@/pages/orders/orders-page')) }] },
            { path: '*', lazy: page(() => import('@/pages/not-found-page')) },
          ],
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
