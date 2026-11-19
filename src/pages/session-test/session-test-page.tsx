import { LoaderCircle, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/common/logo'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/features/auth/hooks/use-auth'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { RequestLog } from '@/features/session-test/components/request-log'
import { useAuthCall, useRefreshSession } from '@/features/session-test/hooks/use-session-test'
import { useRequestLogStore } from '@/features/session-test/store/request-log.store'
import type { AuthCallResult } from '@/features/session-test/types'
import { ApiError } from '@/lib/api-error'

/** Trang chủ sau khi đăng nhập: kiểm tra access token, refresh token và đăng xuất với backend thật. */
export default function SessionTestPage() {
  const user = useAuthStore((s) => s.user)
  const refresh = useRefreshSession()
  const logout = useLogout()
  const grpcCall = useAuthCall()

  const refreshSession = () =>
    refresh.mutate(undefined, {
      onSuccess: () => toast.success('Đã làm mới phiên'),
      onError: (error) => toast.error(ApiError.from(error).message),
    })

  const callAuth = () =>
    grpcCall.mutate(undefined, {
      onSuccess: () => toast.success('Đã lấy tài khoản qua gRPC'),
      onError: (error) => toast.error(ApiError.from(error).message),
    })

  const signOut = () =>
    logout.mutate(undefined, {
      onSuccess: () => {
        useRequestLogStore.getState().clear()
        toast.success('Đã đăng xuất')
      },
    })

  return (
    <div className="min-h-dvh">
      <header className="container flex items-center justify-between gap-4 py-5">
        <Logo />
        <div className="flex min-w-0 items-center gap-3">
          {user && (
            <p className="hidden min-w-0 text-right text-sm sm:block">
              <span className="block truncate font-semibold">{user.username}</span>
              <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
            </p>
          )}
          <Button variant="outline" onClick={signOut} disabled={logout.isPending}>
            {logout.isPending ? (
              <LoaderCircle className="animate-spin" aria-hidden />
            ) : (
              <LogOut aria-hidden />
            )}
            Đăng xuất
          </Button>
        </div>
      </header>

      <main className="container pb-16 pt-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Kiểm tra phiên đăng nhập</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Gọi một API cần đăng nhập qua gateway. Khi access token hết hạn, trình duyệt tự dùng
          refresh token để lấy token mới rồi gọi lại, bạn không phải đăng nhập lại.
        </p>

        <section aria-label="Thao tác" className="mt-8 max-w-2xl divide-y">
          <Action
            title="Làm mới phiên ngay"
            description="POST /auth/refresh đổi refresh token lấy access token và refresh token mới, không cần chờ hết hạn. Refresh token cũ không dùng lại được."
          >
            <Button variant="outline" onClick={refreshSession} disabled={refresh.isPending}>
              {refresh.isPending && <LoaderCircle className="animate-spin" aria-hidden />}
              Làm mới phiên
            </Button>
          </Action>
          <Action
            title="Gọi sang dịch vụ khác qua gRPC"
            description="GET /order/test/auth-grpc đi qua gateway (kiểm tra access token) tới order-service, rồi order-service hỏi auth-service tài khoản của bạn qua gRPC."
          >
            <Button variant="outline" onClick={callAuth} disabled={grpcCall.isPending}>
              {grpcCall.isPending && <LoaderCircle className="animate-spin" aria-hidden />}
              Gọi qua gRPC
            </Button>
            {grpcCall.data && <AuthCallResultRow result={grpcCall.data} />}
          </Action>
        </section>

        <RequestLog />
      </main>
    </div>
  )
}

// Kết quả lần gọi gần nhất: tài khoản auth-service trả về và thời gian của lời gọi gRPC
function AuthCallResultRow({ result }: { result: AuthCallResult }) {
  return (
    <dl className="mt-4 border-y text-sm">
      <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-baseline gap-x-3 py-2.5">
        <dt className="font-semibold">gRPC</dt>
        <dd className="min-w-0 truncate">
          {result.user.username}
          <span className="text-[13px] text-muted-foreground"> #{result.user.id}</span>
        </dd>
        <dd className="tabular-nums text-muted-foreground">{result.elapsedMs} ms</dd>
      </div>
    </dl>
  )
}

function Action({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="py-6 first:pt-0 last:pb-0">
      <h2 className="font-sans text-base font-semibold tracking-normal">{title}</h2>
      <p className="mt-1 max-w-xl text-sm text-muted-foreground">{description}</p>
      <div className="mt-4">{children}</div>
    </div>
  )
}
