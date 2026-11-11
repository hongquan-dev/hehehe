import { lazy, Suspense } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'motion/react'
import { Toaster } from '@/components/ui/sonner'
import { useSessionBootstrap } from '@/features/auth/hooks/use-auth'
import { queryClient } from '@/lib/query-client'

// Chỉ tải devtools khi chạy dev, không lọt vào bản build
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools })),
    )
  : () => null

function SessionBootstrap() {
  useSessionBootstrap()
  return null
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <SessionBootstrap />
        {children}
        <Toaster />
      </MotionConfig>
      <Suspense>
        <ReactQueryDevtools buttonPosition="bottom-left" />
      </Suspense>
    </QueryClientProvider>
  )
}
