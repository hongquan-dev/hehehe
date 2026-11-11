import { RouterProvider } from 'react-router-dom'
import { AppProviders } from '@/app/providers'
import { PageLoader } from '@/components/common/page-loader'
import { router } from '@/app/router'

export function App() {
  return (
    <AppProviders>
      <RouterProvider
        router={router}
        fallbackElement={<PageLoader />}
        future={{ v7_startTransition: true }}
      />
    </AppProviders>
  )
}
